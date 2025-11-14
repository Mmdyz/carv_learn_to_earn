import { Connection, PublicKey, Transaction, SystemProgram, TransactionInstruction } from "@solana/web3.js";

const RPC = process.env.NEXT_PUBLIC_CARV_SVM_RPC || "https://rpc.testnet.carv.io/rpc";
const connection = new Connection(RPC, "confirmed");

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

// 🚀 MAIN FUNCTION
export async function sendQuestTransaction(wallet, questId) {
  if (!wallet?.publicKey) {
    throw new Error("Wallet not connected");
  }

  const user = wallet.publicKey;

  // The memo text your backend is expecting
  const memoText = `Quest completed: ${questId}`;

  const instruction = {
    programId: MEMO_PROGRAM_ID,
    keys: [],
    data: Buffer.from(memoText, "utf8"),
  };

  const tx = new Transaction().add(instruction);

  tx.feePayer = user;

  // Fetch blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;

  // Send + sign
  const signature = await wallet.sendTransaction(tx, connection);

  // Wait for confirmation
  await connection.confirmTransaction(signature, "confirmed");

  return signature;
}