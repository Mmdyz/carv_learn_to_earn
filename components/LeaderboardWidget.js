import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LeaderboardWidget() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⏱ Auto-refresh every 10 seconds
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        // Placeholder data (replace with API call later)
        const data = [
          { wallet: "2wRvR7...G7jWt", transactions: 125 },
          { wallet: "4hDxP1...9tKuW", transactions: 97 },
          { wallet: "8uJtX2...6sOpQ", transactions: 74 },
          { wallet: "6xErQ8...3dLpZ", transactions: 51 },
          { wallet: "3pMzT9...1kBxV", transactions: 38 },
        ];
        setLeaderboard(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-6 text-center text-gray-400">
        Fetching leaderboard data...
      </div>
    );
  }

  if (!leaderboard.length) {
    return (
      <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-6 text-center text-gray-400">
        No leaderboard data yet.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-6"
    >
      <h2 className="text-xl font-bold text-cyan-400 mb-4">🏆 Top Builders on CARV SVM</h2>

      {/* 🥇 Top 3 Highlight */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {leaderboard.slice(0, 3).map((user, index) => (
          <motion.div
            key={user.wallet}
            className={`rounded-xl p-4 text-center ${
              index === 0
                ? "bg-gradient-to-b from-yellow-500/20 to-yellow-600/10 border border-yellow-400/40"
                : index === 1
                ? "bg-gradient-to-b from-gray-400/20 to-gray-500/10 border border-gray-300/30"
                : "bg-gradient-to-b from-orange-400/20 to-orange-500/10 border border-orange-400/30"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl">
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
            </div>
            <div className="font-semibold text-white mt-1">{user.wallet}</div>
            <div className="text-cyan-400 text-sm">{user.transactions} XP</div>
          </motion.div>
        ))}
      </div>

      {/* Other ranks */}
      <div className="space-y-2">
        {leaderboard.slice(3).map((user, index) => (
          <div
            key={user.wallet}
            className="flex justify-between bg-[#0e1525] rounded-lg px-4 py-2 border border-gray-800 hover:border-cyan-600 transition"
          >
            <span className="text-gray-300 font-medium">
              #{index + 4} {user.wallet}
            </span>
            <span className="text-cyan-400 font-semibold">
              {user.transactions} XP
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
