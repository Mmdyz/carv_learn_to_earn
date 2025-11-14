// pages/api/activity.js
import { Connection } from "@solana/web3.js";

const RPC_URL = "https://rpc.testnet.carv.io/rpc";

export default async function handler(req, res) {
  try {
    const connection = new Connection(RPC_URL, "confirmed");

    // Fetch recent signatures for the most active account (system account as fallback)
    const signatures = await connection.getSignaturesForAddress(
      "11111111111111111111111111111111", // System Program as example
      { limit: 10 }
    );

    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        const tx = await connection.getTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        });

        return {
          signature: sig.signature,
          slot: sig.slot,
          blockTime: sig.blockTime
            ? new Date(sig.blockTime * 1000).toLocaleString()
            : "Pending",
          status: sig.confirmationStatus,
          fee: tx?.meta?.fee || 0,
          accounts: tx?.transaction.message.accountKeys.slice(0, 3) || [],
        };
      })
    );

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Activity fetch error:", error);
    res.status(500).json({ error: error.message });
  }
}
