import {
  Connection,
  PublicKey,
  ParsedTransactionWithMeta,
  LogsCallback,
} from "@solana/web3.js";

import { emitEvent } from "../socket";
import { processSignal, isRealSwap } from "./signal.service";
import { sendTelegramAlert } from "./alert.service";

/**
 * ============================================
 * STABLE STREAM CONNECTION (WebSocket)
 * NEVER rotate this connection.
 * Used ONLY for onLogs subscriptions.
 * ============================================
 */
const STREAM_RPC = "https://api.mainnet-beta.solana.com";

const streamConnection = new Connection(STREAM_RPC, {
  commitment: "confirmed",
  wsEndpoint: "wss://api.mainnet-beta.solana.com",
});

/**
 * ============================================
 * ROTATING FETCH RPC POOL
 * Used ONLY for getParsedTransaction calls
 * ============================================
 */
const RPC_POOL = [
  "https://api.mainnet-beta.solana.com",

  // Add your premium RPCs here later:
  // "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY",
  // "https://rpc.shyft.to?api_key=YOUR_KEY",
];

let currentRpcIndex = 0;

const getFetchConnection = () =>
  new Connection(RPC_POOL[currentRpcIndex], {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 15_000,
  });

let fetchConnection = getFetchConnection();

const rotateRpc = () => {
  currentRpcIndex = (currentRpcIndex + 1) % RPC_POOL.length;

  fetchConnection = getFetchConnection();

  console.warn(
    `🔄 Rotated FETCH RPC → ${RPC_POOL[currentRpcIndex]}`
  );
};

/**
 * ============================================
 * ANTI-SPAM CACHE
 * ============================================
 */
const seenSignatures = new Set<string>();

const WHALE_THRESHOLD_SOL = 200;

/**
 * ============================================
 * DEX PROGRAM IDS
 * ============================================
 */
const DEX_PROGRAMS = [
  // Jupiter v4
  "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB",

  // Jupiter v6
  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",

  // Raydium AMM
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",

  // Orca Whirlpool
  "whirLbMiicVdio4qvUfM5KAg6Ct9o2u1gq7b4j2bX4",

  // Serum DEX v3
  "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
];

/**
 * ============================================
 * TRANSACTION FETCH RETRY
 * ============================================
 */
const fetchWithRetry = async (
  signature: string,
  retries = 3,
  delayMs = 1000
): Promise<ParsedTransactionWithMeta | null> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const tx = await fetchConnection.getParsedTransaction(
        signature,
        {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        }
      );

      return tx;
    } catch (err: any) {
      const errorMessage =
        err?.cause?.code ??
        err?.message ??
        "Unknown RPC error";

      console.warn(
        `⚠️ Attempt ${attempt}/${retries} failed for ${signature.slice(
          0,
          12
        )}... → ${errorMessage}`
      );

      const isTimeout =
        err?.cause?.code === "UND_ERR_CONNECT_TIMEOUT" ||
        err?.message?.includes("fetch failed") ||
        err?.message?.includes("timeout");

      if (isTimeout) {
        rotateRpc();
      }

      if (attempt < retries) {
        await new Promise((res) =>
          setTimeout(res, delayMs * attempt)
        );
      }
    }
  }

  console.error(
    `❌ All retries exhausted for ${signature.slice(0, 12)}...`
  );

  return null;
};

/**
 * ============================================
 * PARSE WHALE SWAP
 * ============================================
 */
const parseSwapFromTx = (
  tx: ParsedTransactionWithMeta
): {
  type: "WHALE_BUY" | "WHALE_SELL";
  amount: number;
  token: string;
  wallet: string;
  price: number;
} | null => {
  try {
    const preBalances = tx.meta?.preBalances ?? [];
    const postBalances = tx.meta?.postBalances ?? [];

    const accountKeys =
      tx.transaction.message.accountKeys;

    if (!preBalances.length || !postBalances.length) {
      return null;
    }

    const feePayer = accountKeys[0];

    const solDelta =
      (postBalances[0] - preBalances[0]) / 1e9;

    const absDelta = Math.abs(solDelta);

    if (absDelta < WHALE_THRESHOLD_SOL) {
      return null;
    }

    const type: "WHALE_BUY" | "WHALE_SELL" =
      solDelta < 0 ? "WHALE_BUY" : "WHALE_SELL";

    const tokenBalances =
      tx.meta?.postTokenBalances ?? [];

    const token =
      tokenBalances[0]?.mint ?? "UNKNOWN";

    const wallet =
      typeof feePayer === "string"
        ? feePayer
        : feePayer.pubkey.toBase58();

    return {
      type,
      amount: absDelta,
      token,
      wallet,
      price: 0,
    };
  } catch (err) {
    console.error(
      "⚠️ Failed to parse swap transaction:",
      err
    );

    return null;
  }
};

/**
 * ============================================
 * SIMPLE TRANSACTION QUEUE
 * Prevents websocket callback blocking
 * ============================================
 */
const txQueue: string[] = [];

let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue) return;

  isProcessingQueue = true;

  while (txQueue.length > 0) {
    const signature = txQueue.shift();

    if (!signature) continue;

    try {
      const tx = await fetchWithRetry(signature);

      if (!tx || !tx.meta) {
        continue;
      }

      const swap = parseSwapFromTx(tx);

      if (!swap) {
        continue;
      }

      console.log(
        `🐋 Whale swap [${swap.type}] ${swap.amount.toFixed(
          2
        )} SOL → ${swap.token}`
      );

      const signal = await processSignal({
        ...swap,
        signature,
      });

      if (!signal) {
        continue;
      }

      emitEvent("signal", signal);

      if (
        signal.isWhaleSignal &&
        signal.confidence >= 0.75
      ) {
        await sendTelegramAlert(
          `🚨 ${signal.whaleGrade} WHALE ${signal.signal}\n` +
            `Token: ${signal.token}\n` +
            `Amount: ${signal.amount.toFixed(2)} SOL\n` +
            `Confidence: ${(
              signal.confidence * 100
            ).toFixed(0)}%\n` +
            `Reason: ${signal.reason}`
        );
      }
    } catch (err) {
      console.error(
        "⚠️ Queue processing error:",
        err
      );
    }
  }

  isProcessingQueue = false;
};

/**
 * ============================================
 * START SOLANA STREAM
 * ============================================
 */
export const startSolanaStream = () => {
  console.log(
    "👂 Whale-grade Solana stream started..."
  );

  DEX_PROGRAMS.forEach((programId) => {
    try {
      const programKey = new PublicKey(programId);

      const callback: LogsCallback = async (
        logInfo
      ) => {
        try {
          const { signature, logs, err } = logInfo;

          if (err) return;

          if (!isRealSwap(logs)) return;

          if (seenSignatures.has(signature)) return;

          seenSignatures.add(signature);

          // Prevent memory leaks
          if (seenSignatures.size > 5000) {
            const oldest =
              seenSignatures.values().next().value;

            if (oldest) {
              seenSignatures.delete(oldest);
            }
          }

          /**
           * Push into queue instead of
           * blocking websocket callback
           */
          txQueue.push(signature);

          processQueue();
        } catch (err) {
          console.error(
            "⚠️ onLogs callback error:",
            err
          );
        }
      };

      streamConnection.onLogs(
        programKey,
        callback,
        "confirmed"
      );

      console.log(
        `✅ Subscribed to DEX → ${programId}`
      );
    } catch {
      console.error(
        `❌ Invalid program key skipped → ${programId}`
      );
    }
  });
};