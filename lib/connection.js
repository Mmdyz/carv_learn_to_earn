// /lib/connection.js
import { Connection } from "@solana/web3.js";

// Use CARV SVM Testnet RPC
export const connection = new Connection("https://rpc.testnet.carv.io/rpc", "confirmed");

// Helper to fetch clean account data
export async function getAccountData(publicKey) {
  if (!publicKey) return null;

  try {
    const info = await connection.getAccountInfo(publicKey);
    if (!info) return null;

    return {
      address: publicKey.toBase58(),
      balance: info.lamports / 1_000_000_000,
      owner: info.owner.toBase58(),
      executable: info.executable,
      dataLength: info.data.length,
    };
  } catch (err) {
    console.error("❌ Error fetching account data:", err);
    return null;
  }
}
