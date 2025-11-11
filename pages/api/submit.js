// pages/api/submit.js
import { Connection, PublicKey } from "@solana/web3.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const STORE = path.join(PROJECT_ROOT, "data_leaderboard.json");

const RPC = "https://rpc.testnet.carv.io/rpc"; // Updated RPC URL

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

async function readStore() {
  try {
    const raw = await fs.readFile(STORE, "utf8");
    return JSON.parse(raw);
  } catch {
    return { counts: {} };
  }
}
async function writeStore(data) {
  await fs.writeFile(STORE, JSON.stringify(data, null, 2), "utf8");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { tx, user, questId } = req.body || {};
  if (!tx || !user) return res.status(400).json({ error: "Missing tx or user" });

  try {
    const conn = new Connection(RPC, "confirmed");
    const txInfo = await conn.getTransaction(tx, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });

    if (!txInfo) return res.status(400).json({ error: "Transaction not found/confirmed yet" });

    // signer check
    const signerBase58 = txInfo.transaction.message.accountKeys[0]?.toBase58();
    if (signerBase58 !== user) {
      return res.status(400).json({ error: "User does not match transaction signer" });
    }

    // ✅ robust memo detection
    const message = txInfo.transaction.message;
    const accountKeys = message.accountKeys;
    const ixList = message.compiledInstructions || message.instructions || [];

    let memoFound = false;

    // A) direct instruction program match
    for (const ix of ixList) {
      const programId = accountKeys[ix.programIdIndex];
      if (programId?.equals?.(MEMO_PROGRAM_ID)) {
        memoFound = true;
        break;
      }
    }

    // B) or present in account keys + log contains "Quest completed:"
    if (!memoFound) {
      const logs = (txInfo.meta?.logMessages || []).join("\n");
      const hasMemoKey = accountKeys.some((k) => k.equals?.(MEMO_PROGRAM_ID));
      if (hasMemoKey && /Quest completed:\s*\d+/i.test(logs)) {
        memoFound = true;
      }
    }

    if (!memoFound) {
      return res.status(400).json({
        error: "No Memo found in tx (expected 'Quest completed: N')",
      });
    }

    // increment
    const store = await readStore();
    store.counts[user] = (store.counts[user] || 0) + 1;
    await writeStore(store);

    res.status(200).json({ ok: true, user, questId, tx, count: store.counts[user] });
  } catch (e) {
    console.error("submit error:", e);
    res.status(500).json({ error: "Server error", detail: String(e?.message || e) });
  }
}
