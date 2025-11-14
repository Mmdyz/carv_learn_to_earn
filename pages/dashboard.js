import { useEffect, useState } from "react";
import { PublicKey, Connection } from "@solana/web3.js";
import { motion } from "framer-motion";
import { getUserXP } from "../lib/getUserXP";

const RPC_URL =
  "https://rpc.carv.testnet.soo.network/rpc/carv-McPrlbfMcW0ggpkvr07Tjs2YfviwpHaI";

export default function Dashboard({ walletAdapter }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questXP, setQuestXP] = useState(0);   // ← NEW

  // Load both on-chain stats + quest XP
  useEffect(() => {
    if (!walletAdapter?.publicKey) return;

    const user = walletAdapter.publicKey.toBase58();
    fetchStats(user);
    fetchQuestXP(user);
  }, [walletAdapter]);

  // Fetch quest XP from Supabase
  const fetchQuestXP = async (address) => {
    const xp = await getUserXP(address);
    setQuestXP(xp);
  };

  // Fetch on-chain interactions
  const fetchStats = async (address) => {
    setLoading(true);
    try {
      const connection = new Connection(RPC_URL, "confirmed");
      const sigs = await connection.getSignaturesForAddress(new PublicKey(address));
      const totalTrades = sigs.length;

      setStats({
        totalTrades,
        currentStreak: 1,
        bestStreak: 1,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Badge XP (dynamic)
  const calculateBadgeXP = () => {
    if (!stats) return 0;

    let bonus = 75; // Early Tester

    if (stats.totalTrades >= 100) bonus += 200; // OG
    if (stats.totalTrades >= 999) bonus += 500; // Premium OG

    return bonus;
  };

  // Total XP = quest XP + badge XP
  const calculateTotalXP = () => {
    return questXP + calculateBadgeXP();
  };

  // Level calculation
  const calculateLevel = (xp) => Math.floor(xp / 70) + 1;

   // ======================================================
  // ⭐ LEVEL TITLES
  // ======================================================
  const getLevelTitle = (level) => {
    if (level >= 25) return "🜂 SVM Overlord";
    if (level >= 20) return "⚡ Nexus Ascendant";
    if (level >= 15) return "🛡 Guardian of CARV";
    if (level >= 10) return "💠 Elite Web3 Pioneer";
    if (level >= 7) return "🚀 CARV Chain Builder";
    if (level >= 5)  return "🎯 Web3 Explorer";
    if (level >= 2)  return "🔰 Apprentice";
    return "🌱 Beginner";
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
  const level = calculateLevel(totalXP);

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
          <h2 className="text-cyan-300 mb-3 font-medium">📊 Activity</h2>
          <p>On-chain Interactions: <span className="font-bold text-blue-300">{stats.totalTrades}</span></p>
          <p>Quest XP: <span className="font-bold text-cyan-300">{questXP} XP</span></p>
          <p>Badge XP: <span className="font-bold text-blue-300">{calculateBadgeXP()} XP</span></p>

           <p>Rank:<span className="text-md font-medium text-purple-300 mb-4">
            {getLevelTitle(level)}</span>
          </p>
        </motion.div>

        {/* === Level & XP === */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-panel border border-gray-800 rounded-2xl p-6 shadow-md"
        >
          <h2 className="text-cyan-300 mb-3 font-medium">⚡ Level & Progress</h2>
          <p className="text-lg font-semibold text-white">Level {level}</p>
          
          <p className="text-sm text-gray-400 mb-2">{totalXP} XP</p>

          <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(totalXP % 200) / 2}%` }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-cyan-400 to-blue-600 h-2"
            />
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Progress to Level {level + 1}
          </p>
          <p className="text-xs text-gray-500 mt-1 italic">
            Includes badges XPs which are earned through on-chain interactions.
          </p>
        </motion.div>
      </div>

      {/* === Achievements (unchanged UI) === */}
      
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
                  href="https://febro.fun/mint/carv-svm-og-ck57sbdn"
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
                  href="https://febro.fun/mint/carv-svm-premium-og-opzb90m8"
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
