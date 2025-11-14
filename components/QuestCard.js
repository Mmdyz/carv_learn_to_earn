import { useState, useEffect } from "react";
import { sendQuestTransaction } from "../utils/sendQuestTx";
import toast from "react-hot-toast";

export default function QuestCard({
  quest,
  wallet,
  publicKey,
  completedQuests = [],
  setCompletedQuests = () => {},
  onComplete = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [programId, setProgramId] = useState("");

  const isCompleted = completedQuests.includes(quest.id);

  async function handleVerify() {
    if (!wallet?.publicKey) {
      toast.error("Connect wallet first.");
      return;
    }

    setIsLoading(true);
    const user = wallet.publicKey.toBase58();

    let extraData = {};

    // 🟦 MEMO QUEST
    if (quest.verify?.type === "memo") {
      try {
        const signature = await sendQuestTransaction(wallet, quest.id);
        extraData.signature = signature;
      } catch (e) {
        setIsLoading(false);
        toast.error("Failed to send memo transaction");
        return;
      }
    }

    // 🟩 PROGRAM DEPLOY QUEST
    if (quest.verify?.type === "program_deploy") {
      if (!programId) {
        toast.error("Paste your Program ID first.");
        setIsLoading(false);
        return;
      }
      extraData.programAddress = programId;
    }

    // 🟨 AUTO CLICK / OFFCHAIN QUEST
    if (quest.verify?.type === "auto_click") {
      extraData.auto = true;
    }

    // vote_dapp needs no extra data — backend validates Supabase

    // SEND TO BACKEND
    const res = await fetch("/api/verifyQuest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questId: quest.id, user, extraData }),
    });

    const data = await res.json();
    setIsLoading(false);

    if (data.verified) {
      setCompletedQuests((prev) => [...new Set([...prev, quest.id])]);
      onComplete(quest.id);
    } else {
      toast.error(data.error || data.message || "Verification failed");
    }
  }

  return (
    <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl shadow-md p-4 mb-4 transition">

      {/* Header */}
      <div className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h3 className="text-cyan-400 font-semibold text-lg">{quest.title}</h3>
          <p className="text-gray-300 text-sm">
            {quest.description}
            <span className="ml-1 text-xs text-gray-500">
              🏆 {quest.xp} XP • {quest.difficulty}
            </span>
          </p>
        </div>

        {isCompleted ? (
          <span className="text-green-400 font-bold text-sm">✓ Done</span>
        ) : (
          <svg
            className={`w-5 h-5 text-cyan-400 transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>

      {/* Expandable Content */}
      <div className={`overflow-hidden transition-all duration-300 ${
        isOpen ? "max-h-[350px] opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="border-t border-gray-700 pt-3 text-sm text-gray-400">

          {/* Instructions */}
          <p className="mb-3">
            <span className="text-cyan-400 font-semibold">How to complete:</span>
            <br />
            {quest.verify?.type === "memo" &&
              "→ Sign a memo transaction to confirm action."}

            {quest.verify?.type === "program_deploy" &&
              "→ Deploy a program on CARV SVM and paste your Program ID."}

            {quest.verify?.type === "vote_dapp" &&
              "→ Vote for any Dapp in the Dapps tab."}

            {quest.verify?.type === "auto_click" &&
              "→ Click the button below to visit the required link."}

            {quest.verify?.type === "onchain" &&
              `→ Perform at least ${quest.verify.minTx} on-chain interactions.`}
          </p>

          {/* Program ID input */}
          {quest.verify?.type === "program_deploy" && (
            <input
              type="text"
              placeholder="Paste Program ID"
              className="w-full px-3 py-2 bg-black/40 border border-gray-600 rounded-lg text-white"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
            />
          )}

          {/* Offchain auto-click button */}
          {quest.verify?.type === "auto_click" && (
            <a
              href={quest.verify.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleVerify()}
              className="block w-full text-center mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow"
            >
              Go to Required Page
            </a>
          )}

          {/* Verify Button */}
          {!isCompleted && quest.verify?.type !== "auto_click" && (
            <button
              disabled={isLoading}
              onClick={handleVerify}
              className={`mt-3 px-4 py-2 rounded-lg text-sm ${
                isLoading
                  ? "bg-cyan-900 text-gray-400 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white"
              }`}
            >
              {isLoading ? "Verifying..." : "Verify Quest"}
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
