import { useState } from "react";

export default function QuestCard({ quest, onComplete }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      await onComplete(quest?.id);
    } finally {
      setIsLoading(false);
    }
  };

  if (!quest) return null;

  return (
    
    <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl shadow-md p-5 mb-4 hover:border-cyan-600 transition">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg text-cyan-400 tracking-wide mb-1">
            {quest.title}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {quest.description} <span className="text-xs text-gray-500">🏆 {quest.xp} XP • {quest.difficulty}</span>

          </p>
                     </div>

        <button
          onClick={handleComplete}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            isLoading
              ? "bg-cyan-900 text-gray-400 cursor-not-allowed"
              : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/20 hover:shadow-cyan-400/30"
          }`}
        >
          {isLoading ? (
            <svg
              className="animate-spin w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path
                d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 00-10 10z"
                fill="currentColor"
                fillOpacity="0.75"
              />
            </svg>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              Complete
            </>
          )}
        </button>
      </div>
    </div>
  );
}
