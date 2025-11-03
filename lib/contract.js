import {
  Connection,
  Transaction,
  TransactionInstruction,
  PublicKey,
} from "@solana/web3.js";
import toast from "react-hot-toast";

// ✅ CARV SVM testnet RPC
export const connection = new Connection("https://rpc.testnet.carv.io/rpc", "confirmed");

/**
 * Logs quest completion safely using the Memo program
 */
export async function logQuestCompletion(walletAdapter, questId) {
  try {
    if (!walletAdapter?.publicKey) throw new Error("Wallet not connected");

    const memoProgramId = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
    const memoMessage = `Quest completed: ${questId}`;

    // Create Memo instruction
    const instruction = new TransactionInstruction({
      programId: memoProgramId,
      keys: [],
      data: Buffer.from(memoMessage),
    });

    // Build transaction
    const transaction = new Transaction().add(instruction);
    transaction.feePayer = walletAdapter.publicKey;

    // Fetch recent blockhash manually for reliability
    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = blockhash;

    toast.loading("Submitting quest completion...");

    // Send and confirm transaction
    const signature = await walletAdapter.sendTransaction(transaction, connection);
    await connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight },
      "confirmed"
    );

    toast.dismiss();
    toast.success("✅ Quest successfully logged!");
    console.log("Transaction successful:", signature);

    // Optional explorer link
    toast((t) => (
      <div>
        <p className="font-medium text-white">View Transaction:</p>
        <a
          href={`https://solscan.io/tx/${signature}?cluster=custom&customUrl=https://rpc.carv.testnet.soo.network/rpc/carv-McPrlbfMcW0ggpkvr07Tjs2YfviwpHaI`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 underline text-sm"
        >
          Open in Explorer
        </a>
      </div>
    ));

    return signature;
  } catch (error) {
    toast.dismiss();
    toast.error("⚠️ Quest submission failed!");
    console.error("Error submitting quest:", error);
    throw error;
  }
}
