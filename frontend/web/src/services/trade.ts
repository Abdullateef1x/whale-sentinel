import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";

export const executeTrade = async (
  wallet: any,
  amount: number
) => {
  const connection = new Connection("https://api.mainnet-beta.solana.com");

  if (!wallet.publicKey) throw new Error("Wallet not connected");

  // ⚠️ MVP: simple transfer (simulate trade)
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: new PublicKey(wallet.publicKey), // self-transfer (safe demo)
      lamports: amount,
    })
  );

  const signature = await wallet.sendTransaction(transaction, connection);

  await connection.confirmTransaction(signature);

  console.log("✅ Trade executed:", signature);

  return signature;
};