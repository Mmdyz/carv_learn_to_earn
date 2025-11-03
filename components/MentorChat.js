"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { SendHorizonal, Bot, Loader2 } from "lucide-react";

export default function MentorChat() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  // Keywords used to detect fallback replies
  const fallbackHints = [
    "CARV SVM",
    "on-chain with CARV",
    "boost your builder rank",
    "CARV ecosystem",
    "AI Beings",
    "Agent",
  ];

  const handleAsk = async () => {
    if (!prompt.trim()) {
      toast("💡 Ask something about CARV or Web3 first!");
      return;
    }

    setLoading(true);
    setReply(""); // clear previous response

    try {
      const res = await axios.post("/api/mentor", { prompt });
      const message = (res.data && res.data.reply) || "No reply yet.";

      // Ensure we never pass an object or Promise to React
      const finalMessage = typeof message === "string" ? message : JSON.stringify(message);

      // Detect if it's one of our fallback replies
      const isFallback = fallbackHints.some((hint) =>
        finalMessage.toLowerCase().includes(hint.toLowerCase())
      );

      setReply(finalMessage);

      // Toast feedback
      if (isFallback) {
        toast("🛰️ Mentor is currently offline — using local AI mode", {
          icon: "⚙️",
          style: {
            background: "#0b0f19",
            color: "#fbbf24",
            border: "1px solid #f59e0b",
          },
        });
      } else {
        toast.success("🤖 Mentor replied!", {
          style: {
            background: "#0b0f19",
            color: "#22d3ee",
            border: "1px solid #22d3ee",
          },
        });
      }
    } catch (error) {
      console.error("Mentor API error:", error);
      toast.error("❌ Mentor failed to respond!");
      setReply("⚠️ I couldn’t fetch a response right now. Please try again.");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-950/70 to-gray-900 p-4 rounded-xl border border-gray-700/60 text-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Bot className="text-cyan-400" />
        <h3 className="font-semibold text-blue-400">CARV Mentor</h3>
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask your mentor about CARV or Web3..."
          className="flex-1 bg-gray-800 text-gray-200 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-400"
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <SendHorizonal className="w-4 h-4" />
          )}
          Ask
        </button>
      </div>

      {/* Response box */}
      <div className="mt-4">
        <div className="p-3 bg-gray-900/60 rounded-lg text-sm border border-gray-800 shadow-inner min-h-[100px]">
          {reply ? reply : "💬 Ask me anything about the CARV ecosystem!"}
        </div>
      </div>
    </div>
  );
}
