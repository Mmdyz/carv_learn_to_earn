// pages/api/verifyQuest.js

import { Connection, PublicKey } from "@solana/web3.js";
import { supabase } from "../../lib/supabase";
import quests from "../../lib/questsData";

const RPC =
  process.env.NEXT_PUBLIC_CARV_SVM_RPC ||
  "https://rpc.testnet.carv.io/rpc";

const connection = new Connection(RPC, "confirmed");

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

const UPGRADEABLE_LOADER = new PublicKey(
  "BPFLoaderUpgradeab1e11111111111111111111111"
);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { questId, user, extraData = {} } = req.body;

    if (!questId || !user) {
      return res.status(400).json({ verified: false, error: "Missing questId or user" });
    }

    const quest = quests.find((q) => q.id === questId);
    if (!quest) {
      return res.status(404).json({ verified: false, error: "Quest not found" });
    }

    const verification = quest.verify || {};

    // ======================================================
    // 🟦 1. MEMO QUEST
    // ======================================================
    if (verification.type === "memo") {
      const signature = extraData.signature;
      if (!signature)
        return res.status(400).json({ verified: false, error: "Missing signature" });

      const txInfo = await connection.getTransaction(signature, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });

      if (!txInfo)
        return res.status(400).json({ verified: false, error: "Transaction not found" });

      const signer = txInfo.transaction.message.accountKeys[0]?.toBase58();
      if (signer !== user)
        return res.status(400).json({ verified: false, error: "Invalid signer" });

      const expectedText = `Quest completed: ${questId}`;
      const logs = txInfo.meta?.logMessages || [];
      const hasMemo = logs.some((line) => line.includes(expectedText));

      if (!hasMemo)
        return res.status(400).json({ verified: false, error: "Memo text not found" });

      await saveCompletion(user, questId, signature);
      return res.status(200).json({ verified: true });
    }

    // ======================================================
    // 🟩 2. PROGRAM DEPLOY QUEST (check authority)
    // ======================================================
    
if (verification.type === "program_deploy") {
  const programAddress = extraData?.programAddress;

  if (!programAddress) {
    return res.status(400).json({
      verified: false,
      error: "Missing programAddress",
    });
  }

  let programPubkey;
  try {
    programPubkey = new PublicKey(programAddress);
  } catch (e) {
    return res.status(400).json({
      verified: false,
      error: "Invalid program address",
    });
  }

  const programInfo = await connection.getAccountInfo(programPubkey);

  if (!programInfo) {
    return res.status(400).json({
      verified: false,
      error: "Program not found on chain",
    });
  }

  // ✅ Must be an upgradeable program
  if (!programInfo.owner.equals(UPGRADEABLE_LOADER)) {
    return res.status(400).json({
      verified: false,
      error: "Program is not using the upgradeable loader",
    });
  }

  // At this point we know:
  // - user provided a valid Program ID
  // - program exists on CARV SVM
  // - it's upgradeable (typical for Anchor/SolPG contracts)
  // For the quest, this is enough to count as "deployed a smart contract".
  await saveCompletion(user, questId, programAddress);
  return res.status(200).json({ verified: true });
}


    // ======================================================
    // 🟧 3. ONCHAIN TX COUNT VERIFICATION
    // ======================================================
    if (verification.type === "onchain") {
      const minTx = verification.minTx || 1;
      const pubkey = new PublicKey(user);

      const signatures = await connection.getSignaturesForAddress(pubkey, {
        limit: minTx,
      });

      if (signatures.length >= minTx) {
        await saveCompletion(user, questId, `tx-count:${signatures.length}`);
        return res.status(200).json({ verified: true });
      }

      return res.status(200).json({
        verified: false,
        error: `You have ${signatures.length}/${minTx} required transactions`,
      });
    }

    // ======================================================
    // 🟪 4. DAPP VOTE VERIFICATION (reads Supabase table)
    // ======================================================
    if (verification.type === "vote_dapp") {
      const { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("wallet", user)
        .limit(1);

      if (error)
        return res.status(500).json({ verified: false, error: "Database error" });

      if (data && data.length > 0) {
        await saveCompletion(user, questId, "vote-proof");
        return res.status(200).json({ verified: true });
      }

      return res.status(200).json({
        verified: false,
        error: "No dapp vote found for this wallet",
      });
    }

    // ======================================================
    // 🟨 5. AUTO-CLICK VERIFICATION (X / Discord / Website)
    // ======================================================
    if (verification.type === "auto_click") {
      if (!extraData.auto)
        return res.status(400).json({ verified: false, error: "Button not clicked" });

      await saveCompletion(user, questId, "auto-click");
      return res.status(200).json({ verified: true });
    }

    // ======================================================
    // 🟥 6. MANUAL QUEST (admin)
    // ======================================================
    if (verification.type === "manual") {
      return res.status(200).json({
        verified: false,
        message: "Requires admin approval",
      });
    }

    return res.status(400).json({
      verified: false,
      error: "Invalid verification type",
    });
  } catch (err) {
    console.error("VERIFY_QUEST_ERROR:", err);
    return res.status(500).json({ verified: false, error: err.message });
  }
}

// ========================================================
// 📌 SAVE COMPLETION IN SUPABASE
// ========================================================
async function saveCompletion(user, questId, proof) {
  const { error } = await supabase
    .from("quest_completions")
    .upsert(
      {
        user_address: user,
        quest_id: questId,
        tx_signature: proof,
      },
      { onConflict: "user_address,quest_id" }
    );

  if (error) console.error("Supabase save error:", error);
}
