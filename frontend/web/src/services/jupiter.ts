import { Connection, VersionedTransaction } from "@solana/web3.js";

const RPC = "https://api.mainnet-beta.solana.com";

export const executeJupiterSwap = async ({
  inputMint,
  outputMint,
  amount,
  wallet,
}: {
  inputMint: string;
  outputMint: string;
  amount: number;
  wallet: any;
}) => {
  const connection = new Connection(RPC);

  if (!wallet.publicKey) throw new Error("Wallet not connected");

  // 1️⃣ Get quote
  const quoteRes = await fetch(
    `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`
  );
  const quote = await quoteRes.json();

  const route = quote.data[0];

  if (!route) throw new Error("No route found");

  // 2️⃣ Get swap transaction
  const swapRes = await fetch("https://quote-api.jup.ag/v6/swap", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quoteResponse: route,
      userPublicKey: wallet.publicKey.toString(),
      wrapAndUnwrapSol: true,
    }),
  });

  const { swapTransaction } = await swapRes.json();

  // 3️⃣ Deserialize transaction
  const tx = VersionedTransaction.deserialize(
    Buffer.from(swapTransaction, "base64")
  );

  // 4️⃣ Sign + send
  const signature = await wallet.sendTransaction(tx, connection);

  await connection.confirmTransaction(signature);

  console.log("✅ Swap executed:", signature);

  return signature;
};