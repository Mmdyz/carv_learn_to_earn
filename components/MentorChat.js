"use client";

import { useState, useEffect } from "react";

export default function MentorChat({ onAsk }) {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [dots, setDots] = useState("");

  const fallbackReply = `Hey there, traveler 👋  
I am Elyra, your CARV Mentor — a fusion of human insight and AI clarity.  
I’m still evolving through my early learning cycles (just past 24 🌀).  

If I pause or stay silent, know that I’m still here — observing the on-chain winds, refining my code, and learning from every interaction 👩‍💻  
Patience, growth, and discovery — that’s the CARV way. ⚡`;

  // Animate dots while thinking
  useEffect(() => {
    if (!isThinking) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, [isThinking]);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setIsThinking(true);
    setReply("");

    try {
      const res = await onAsk(prompt);
      if (res?.data?.reply) {
        setReply(res.data.reply);
      } else {
        setTimeout(() => {
          setReply(fallbackReply);
          setIsThinking(false);
        }, 2000);
        return;
      }
    } catch {
      setTimeout(() => {
        setReply(fallbackReply);
        setIsThinking(false);
      }, 2000);
    } finally {
      setPrompt("");
    }
  };

  return (
    <div className="space-y-3">
      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 bg-[#0b0f19] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-gray-500"
          placeholder="Ask Elyra anything about CARV, SVM Chain, or Web3..."
        />
        <button
          onClick={handleAsk}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition"
        >
          Ask
        </button>
      </div>

      {/* Reply Box */}
      <div className="flex items-start gap-3 bg-[#101524] border border-gray-800 rounded-xl p-4 text-sm min-h-[80px] text-gray-300 transition-all duration-500">
        {/* 🧠 Mentor Avatar */}
        <div
          className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg ${
            isThinking ? "animate-glow" : ""
          }`}
        >
          <img
            src="images/elyra.png"
            alt="Elyra"
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* 🗨️ Message */}
        <div className="flex-1">
          {isThinking ? (
            <p className="text-cyan-400 animate-pulse">Elyra is processing{dots}</p>
          ) : (
            <p className="whitespace-pre-line leading-relaxed">{reply}</p>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-pulse {
          animation: pulseText 1.8s infinite ease-in-out;
        }

        @keyframes pulseText {
          0%,
          100% {
            opacity: 0.6;
            text-shadow: 0 0 8px rgba(34, 211, 238, 0.7);
          }
          50% {
            opacity: 1;
            text-shadow: 0 0 12px rgba(59, 130, 246, 0.9);
          }
        }

        .animate-glow {
          animation: glowPulse 2s ease-in-out infinite alternate;
        }

        @keyframes glowPulse {
          from {
            box-shadow: 0 0 8px rgba(34, 211, 238, 0.6),
              0 0 16px rgba(59, 130, 246, 0.4);
            transform: scale(1);
          }
          to {
            box-shadow: 0 0 20px rgba(34, 211, 238, 1),
              0 0 35px rgba(59, 130, 246, 0.9);
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
