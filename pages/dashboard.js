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
      const sigs = await connection.getSignaturesForAddress(
        new PublicKey(address)
      );
      const totalTrades = sigs.length;

      // Base stats (XP here is your "base" XP, without badge bonuses)
      setStats({
        totalTrades,
        totalVolume: "$239,070.95",
        currentStreak: 1,
        bestStreak: 1,
        level: 1,
        xp: 75, // base XP
        questHistory: [
          { week: "Week 1", xp: 75, quests: 1 },
        ],
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // 👉 Calculate total XP including badge bonuses
const calculateTotalXP = () => {
  if (!stats) return 0;

  let bonusXP = 0;

  // 🧪 Early Tester badge: always available
  bonusXP += 75;

  // ⚙️ OG badge (100+ on-chain interactions)
  if (stats.totalTrades >= 100) bonusXP += 200;

  // 👑 Premium OG badge (999+ on-chain interactions)
  if (stats.totalTrades >= 999) bonusXP += 500;

  return stats.xp + bonusXP;
};

// 👉 Derive level from total XP
const calculateLevel = (totalXP) => {
  // 1 level every 200 XP
  return Math.floor(totalXP / 200) + 1;
};


  if (!walletAdapter?.publicKey)
    return (
      <p className="text-gray-400 text-sm text-center mt-10">
        Connect your wallet to view your Dashboard.
      </p>
    );

  if (loading || !stats)
    return (
      <p className="text-gray-400 text-sm text-center mt-10 animate-pulse">
        Fetching your on-chain data...
      </p>
    );

  const totalXP = calculateTotalXP();
const derivedLevel = calculateLevel(totalXP);


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
          <h2 className="text-cyan-300 mb-3 font-medium">
            📊 Trading Statistics
          </h2>
          <div className="text-gray-300 space-y-2">
            <p>
              OnChain Interaction:{" "}
              <span className="text-white font-semibold">
                {stats.totalTrades}
              </span>
            </p>
            <p>
              Current Streak:{" "}
              <span className="text-white font-semibold">
                {stats.currentStreak}
              </span>
            </p>
            <p>
              Best Streak:{" "}
              <span className="text-white font-semibold">
                {stats.bestStreak}
              </span>
            </p>
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
<p className="text-lg font-semibold text-white mb-1">
  Level {derivedLevel}
</p>
<p className="text-sm text-gray-400 mb-2">{totalXP} XP</p>

<div className="bg-gray-700 h-2 rounded-full overflow-hidden">
  <motion.div
    initial={{ width: 0 }}
    animate={{ width: `${(totalXP % 200) / 2}%` }} // reset every 200xp
    transition={{ duration: 0.8 }}
    className="bg-gradient-to-r from-cyan-400 to-blue-600 h-2"
  />
</div>

<p className="text-xs text-gray-500 mt-1">
  Progress to Level {derivedLevel + 1}
</p>

          <p className="text-xs text-gray-500 mt-1 italic">
            Includes badge bonuses: Early Tester (+75), OG (+200), Premium OG
            (+500)
          </p>
        </motion.div>
      </div>

      {/* === Quest Summary Chart 
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
      === */}

      {/* === Achievements with Badges & Lock Logic === */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-panel border border-gray-800 rounded-2xl p-6 shadow-md"
      >
        <h2 className="text-cyan-300 mb-4 font-medium">🏆 Achievements</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* 🧪 Early Tester (Always available) */}
          <div className="group relative border border-gray-700 rounded-xl p-4 transition hover:border-cyan-500 hover:shadow-cyan-500/30">
            <div className="tooltip">
              <a
                href="https://febro.fun/mint/carv-nexus-early-ydh9e58i"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/nex.jpg"
                  alt="CARV NEXUS Early Tester"
                  className="rounded-lg w-full object-contain transition-transform group-hover:scale-105 badge-animate"
                />
              </a>
              <span className="tooltip-text">
                🔓 Mint your CARV NEXUS Early Tester badge
              </span>
            </div>
            <div className="mt-3 text-center">
              <h3 className="text-white font-semibold mb-1">NEXUS i'm early</h3>
              <p className="text-xs text-gray-400 mb-2">Rare</p>
              <span className="text-cyan-400 text-sm font-semibold">
                +75 XP
              </span>
            </div>
          </div>

          {/* 🧪 Early Tester (Always available) */}
          <div className="group relative border border-gray-700 rounded-xl p-4 transition hover:border-cyan-500 hover:shadow-cyan-500/30">
            <div className="tooltip">
              <a
                href="https://febro.fun/mint/carv-nexus-early-ydh9e58i"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/ea.jpg"
                  alt="CARV NEXUS Early Tester"
                  className="rounded-lg w-full object-contain transition-transform group-hover:scale-105 badge-animate"
                />
              </a>
              <span className="tooltip-text">
                🔓 Mint your CARVSVM Early Adopter badge
              </span>
            </div>
            <div className="mt-3 text-center">
              <h3 className="text-white font-semibold mb-1">SVM i'm early</h3>
              <p className="text-xs text-gray-400 mb-2">Rare</p>
              <span className="text-cyan-400 text-sm font-semibold">
                +75 XP
              </span>
            </div>
          </div>

          {/* ⚙️ CARV SVM Chain OG */}
          <div
            className={`group relative border rounded-xl p-4 transition ${
              stats.totalTrades >= 100
                ? "border-cyan-600 hover:border-cyan-400 hover:shadow-cyan-500/30"
                : "border-gray-800 opacity-60 cursor-not-allowed"
            }`}
          >
            <div className="tooltip">
              {stats.totalTrades >= 100 ? (
                <a
                  href="https://febro.fun/mint/carv-svm-og-XXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/og.jpg"
                    alt="CARV SVM Chain OG"
                    className="rounded-lg w-full object-contain transition-transform group-hover:scale-105 badge-animate"
                  />
                </a>
              ) : (
                <img
                  src="/images/og.jpg"
                  alt="CARV SVM Chain OG (Locked)"
                  className="rounded-lg w-full object-contain grayscale"
                />
              )}
              <span className="tooltip-text">
                {stats.totalTrades >= 100
                  ? "🔓 Click to mint your OG badge!"
                  : "🔒 Reach 100 on-chain interactions to unlock!"}
              </span>
            </div>

            <div className="mt-3 text-center">
              <h3 className="text-white font-semibold mb-1">
                CARV SVM Chain OG
              </h3>
              {stats.totalTrades >= 100 ? (
                <>
                  <p className="text-xs text-gray-400 mb-2">Epic</p>
                  <span className="text-cyan-400 text-sm font-semibold">
                    +200 XP
                  </span>
                </>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  🔒 Reach 100 interactions to unlock
                </p>
              )}
            </div>
          </div>

          {/* 👑 Premium OG */}
          <div
            className={`group relative border rounded-xl p-4 transition ${
              stats.totalTrades >= 999
                ? "border-yellow-500 hover:shadow-yellow-500/30"
                : "border-gray-800 opacity-60 cursor-not-allowed"
            }`}
          >
            <div className="tooltip">
              {stats.totalTrades >= 999 ? (
                <a
                  href="https://febro.fun/mint/carv-premium-og-XXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/pog.jpg"
                    alt="CARV SVM Chain Premium OG"
                    className="rounded-lg w-full object-contain transition-transform group-hover:scale-105 badge-animate"
                  />
                </a>
              ) : (
                <img
                  src="/images/pog.jpg"
                  alt="Premium OG (Locked)"
                  className="rounded-lg w-full object-contain grayscale"
                />
              )}
              <span className="tooltip-text">
                {stats.totalTrades >= 999
                  ? "👑 You’re a true builder! Mint your Premium OG badge!"
                  : "🔒 Reach 999 on-chain interactions to unlock!"}
              </span>
            </div>

            <div className="mt-3 text-center">
              <h3 className="text-white font-semibold mb-1">Premium OG</h3>
              {stats.totalTrades >= 999 ? (
                <>
                  <p className="text-xs text-yellow-400 mb-2">Legendary</p>
                  <span className="text-yellow-300 text-sm font-semibold">
                    +500 XP
                  </span>
                </>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  🔒 Reach 999 interactions to unlock
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
