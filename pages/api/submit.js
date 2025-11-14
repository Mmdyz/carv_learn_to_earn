// pages/api/submit.js

import { Connection, PublicKey } from "@solana/web3.js";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

const RPC = "https://rpc.testnet.carv.io/rpc";

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { tx, user, questId } = req.body || {};
  if (!tx || !user)
    return res.status(400).json({ error: "Missing tx or user" });

  try {
    const conn = new Connection(RPC, "confirmed");
    const txInfo = await conn.getTransaction(tx, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });

    if (!txInfo)
      return res.status(400).json({
        error: "Transaction not found or not confirmed yet",
      });

    // Verify signer
    const signerBase58 =
      txInfo.transaction.message.accountKeys[0]?.toBase58();

    if (signerBase58 !== user) {
      return res
        .status(400)
        .json({ error: "User does not match transaction signer" });
    }

    // ========= MEMO DETECTION =========
    const message = txInfo.transaction.message;
    const accountKeys = message.accountKeys;
    const ixList =
      message.compiledInstructions || message.instructions || [];

    let memoFound = false;

    // A) Check program ID directly
    for (const ix of ixList) {
      const programId = accountKeys[ix.programIdIndex];
      if (programId?.equals?.(MEMO_PROGRAM_ID)) {
        memoFound = true;
        break;
      }
    }

    // B) Check logs for the memo text
    if (!memoFound) {
      const logs = (txInfo.meta?.logMessages || []).join("\n");
      const hasMemoKey = accountKeys.some((k) =>
        k.equals?.(MEMO_PROGRAM_ID)
      );

      if (hasMemoKey && /Quest completed:\s*\d+/i.test(logs)) {
        memoFound = true;
      }
    }

    if (!memoFound) {
      return res.status(400).json({
        error: "No Memo found in tx (expected 'Quest completed: N')",
      });
    }

    // ========= SAVE TO SUPABASE =========
    const { error: saveError } = await supabase
      .from("quest_completions")
      .upsert(
        {
          user_address: user,
          quest_id: questId,
          tx_signature: tx,
        },
        {
          onConflict: "user_address,quest_id",
        }
      );

    if (saveError) {
      toast.error("Supabase Save Error:", saveError);
      return res.status(500).json({
        error: "Supabase insert error",
        detail: saveError.message,
      });
    }

    // SUCCESS 🎉
    return res.status(200).json({
      ok: true,
      user,
      questId,
      tx,
    });
  } catch (e) {
    toast.error("submit error:", e);
    return res.status(500).json({
      error: "Server error",
      detail: String(e?.message || e),
    });
  }
}
