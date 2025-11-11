import { motion } from "framer-motion";

export default function Leaderboard({ data = [] }) {
  if (!data || data.length === 0)
    return (
      <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-5 text-gray-400 text-center">
        No leaderboard data yet.
      </div>
    );

  return (
    <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-5 shadow-md">
      <h2 className="font-semibold text-cyan-400 tracking-wide mb-4">
        Top Learners 🔥
      </h2>

      <ul className="space-y-3 max-h-[400px] overflow-auto pr-2">
        {data.slice(0, 100).map((entry, i) => {
          const rank = i + 1;
          const glowColor =
            rank === 1
              ? "from-yellow-400 to-yellow-600"
              : rank === 2
              ? "from-gray-300 to-gray-500"
              : rank === 3
              ? "from-amber-500 to-orange-700"
              : "from-cyan-800 to-cyan-900";

          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between bg-[#101524] border border-gray-700 rounded-lg p-3 hover:border-cyan-600 transition"
            >
              <div className="flex items-center gap-3">
                {/* Rank badge */}
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-b ${glowColor} text-black font-bold`}
                >
                  {rank}
                </div>

                {/* Address + XP */}
                <div>
                  <p className="text-gray-200 text-sm font-mono">
                    {entry.address
                      ? `${entry.address.slice(0, 6)}...${entry.address.slice(-6)}`
                      : "Anonymous"}
                  </p>
                  <div className="relative w-40 bg-gray-800 rounded-full h-2 mt-1 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-2 bg-gradient-to-r from-cyan-500 to-blue-400"
                      style={{ width: `${Math.min(entry.count * 5, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Count */}
              <span className="text-cyan-400 text-sm font-semibold">
                {entry.count} pts
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
