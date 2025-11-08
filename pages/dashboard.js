import { useEffect, useState } from "react";
import { PublicKey, Connection } from "@solana/web3.js";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const RPC_URL =
  "https://rpc.carv.testnet.soo.network/rpc/carv-McPrlbfMcW0ggpkvr07Tjs2YfviwpHaI";

export default function Dashboard({ walletAdapter }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletAdapter?.publicKey) return;
    fetchStats(walletAdapter.publicKey.toBase58());
  }, [walletAdapter]);

  const fetchStats = async (address) => {
    setLoading(true);
    try {
      const connection = new Connection(RPC_URL, "confirmed");
      const sigs = await connection.getSignaturesForAddress(new PublicKey(address));
      const totalTrades = sigs.length;

      // Mock stats (to be replaced by QuestLog)
      setStats({
        totalTrades,
        totalVolume: "$239,070.95",
        currentStreak: 1,
        bestStreak: 1,
        level: 1,
        xp: 75,
        achievements: [
          { name: "Early Adopter", rarity: "Rare", points: 75 },
          //{ name: "Daily Trader", rarity: "Common", points: 15 },
          //{ name: "Whale Trader", rarity: "Epic", points: 200 },
        ],
        questHistory: [
          { week: "Week 1", xp: 75, quests: 1 },
         // { week: "Week 2", xp: 24, quests: 6 },
          //{ week: "Week 3", xp: 131, quests: 7 },
         // { week: "Week 4", xp: 142, quests: 9 },
          //{ week: "Week 5", xp: 272, quests: 30 },
        ],
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!walletAdapter?.publicKey)
    return (
      <p className="text-gray-400 text-sm text-center mt-10">
        Connect your wallet to view your Dashboard.
      </p>
    );

  if (loading)
    return (
      <p className="text-gray-400 text-sm text-center mt-10 animate-pulse">
        Fetching your on-chain data...
      </p>
    );

  return (
    <div className="p-6 text-gray-200 bg-transparent">
      <h1 className="text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
        Your CARV NEXUS Dashboard
      </h1>

      {/* === Trading Stats === */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-panel border border-gray-800 rounded-2xl p-6 shadow-md"
        >
          <h2 className="text-cyan-300 mb-3 font-medium">📊 Trading Statistics</h2>
          <div className="text-gray-300 space-y-2">
            <p>OnChain Interaction: <span className="text-white font-semibold">{stats.totalTrades}</span></p>
            <p>Current Streak: <span className="text-white font-semibold">{stats.currentStreak}</span></p>
            <p>Best Streak: <span className="text-white font-semibold">{stats.bestStreak}</span></p>
          </div>
        </motion.div>

        {/* === Level & XP === */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-panel border border-gray-800 rounded-2xl p-6 shadow-md"
        >
          <h2 className="text-cyan-300 mb-3 font-medium">⚡ Level & Progress</h2>
          <p className="text-lg font-semibold text-white mb-1">Level {stats.level}</p>
          <p className="text-sm text-gray-400 mb-2">{stats.xp} XP</p>
          <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stats.xp % 1000) / 10}%` }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-cyan-400 to-blue-600 h-2"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Progress to Level {stats.level + 1}
          </p>
        </motion.div>
      </div>

      {/* === Quest Summary Chart === */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-panel border border-gray-800 rounded-2xl p-6 shadow-md mb-8"
      >
        <h2 className="text-cyan-300 mb-4 font-medium">📈 Quest Summary</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.questHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0b0f19",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="#00e0ff"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                name="XP Earned"
              />
              <Line
                type="monotone"
                dataKey="quests"
                stroke="#4f46e5"
                strokeWidth={2}
                name="Quests Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* === Achievements === */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-panel border border-gray-800 rounded-2xl p-6 shadow-md"
      >
        <h2 className="text-cyan-300 mb-4 font-medium">🏆 Achievements</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stats.achievements.map((a, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, borderColor: "#00e0ff" }}
              className="border border-gray-700 rounded-xl p-4 transition"
            >
              <h3 className="text-white font-semibold mb-1">{a.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{a.rarity}</p>
              <span className="text-cyan-400 text-sm font-semibold">
                +{a.points} pts
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
