import { useEffect, useState } from "react";
import axios from "axios";
import QuestCard from "../components/QuestCard";
import MentorChat from "../components/MentorChat";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection, getAccountData } from "../lib/connection";
import SwapWidget from "../components/SwapWidget";
import DappsWidget from "../components/DappsWidget";
import ActivityTracker from "../components/ActivityTracker";
import CommunityHub from "../components/CommunityHub";
import toast from "react-hot-toast";
import Questboard from "../components/Questboard";
import Dashboard from "./dashboard";
import ThemeToggle from "../components/ThemeToggle";
import EleshaAvatar from "../components/EleshaAvater";
import { supabase } from "../lib/supabase";
import LeaderboardWidget from "../components/LeaderboardWidget";

export default function Home() {
  const [quests, setQuests] = useState([]);
  const [activeTab, setActiveTab] = useState("quests");
  const [aiReply, setAiReply] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [account, setAccount] = useState(null);
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useWallet();

  const [completedQuests, setCompletedQuests] = useState([]);
  const [thinking, setThinking] = useState(false);

  const handleSend = async () => {
    setThinking(true);
    await new Promise((r) => setTimeout(r, 2000));
    setThinking(false);
  };

  // 🔹 Initial load (no wallet required)
  useEffect(() => {
    fetchQuests();
    fetchLeaderboard();
  }, []);

  async function fetchQuests() {
    const res = await axios.get("/api/quests");
    setQuests(res.data);
  }

  async function fetchLeaderboard() {
    const res = await axios.get("/api/leaderboard");
    setLeaderboard(res.data || []);
  }

  // 🔹 Fetch completed quests from Supabase
  async function fetchCompletedQuests() {
    if (!publicKey) return [];

    const { data, error } = await supabase
      .from("quest_completions")
      .select("quest_id")
      .eq("user_address", publicKey.toBase58());

    if (error) {
      console.error("Supabase fetch error:", error);
      return [];
    }

    return data.map((q) => q.quest_id);
  }

  // 🔹 When wallet connects
  useEffect(() => {
    if (!publicKey) return;

    // Load account info
    fetchAccount();

    // ⭐ Load Completed Quests from Supabase
    fetchCompletedQuests().then((list) => {
      console.log("Loaded completed quests:", list);
      setCompletedQuests(list);
    });

    // Wallet listener for balance updates
    const subId = connection.onAccountChange(publicKey, (info) => {
      setAccount({
        address: publicKey.toBase58(),
        balance: info.lamports / 1_000_000_000,
        owner: info.owner.toBase58(),
        executable: info.executable,
        dataLength: info.data.length,
      });
    });

    return () => connection.removeAccountChangeListener(subId);
  }, [publicKey]);

  async function fetchAccount() {
    if (!publicKey) return;
    const data = await getAccountData(publicKey);
    setAccount(data);
  }

  async function handleAsk(prompt) {
    const res = await axios.post("/api/mentor", { prompt });
    setAiReply(res.data.reply || "No reply");
  }

  async function handleComplete(questId) {
    try {
      fetchLeaderboard();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div
      className="min-h-screen bg-[#070b14] text-gray-100 p-6"
      style={{
        backgroundImage: "url('/images/darkmode.jpg')",
      }}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div className="flex items-baseline space-x-3">
          <img
            src="/images/logo.png"
            alt="CARV NEXUS Logo"
            className="w-250 h-20 object-contain "
          />
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <WalletMultiButton />
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Quests or Swap */}
        <section className="lg:col-span-2 bg-[#0b0f19] border border-gray-800 rounded-2xl p-5 shadow-md">
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "dashboard"
                  ? "bg-cyan-600 text-white"
                  : "bg-[#0b0f19] text-gray-400 hover:text-white"
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("quests")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "quests"
                  ? "bg-cyan-600 text-white"
                  : "bg-[#0b0f19] text-gray-400 hover:text-white"
              }`}
            >
              Quests
            </button>

            <button
              onClick={() => setActiveTab("swap")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "swap"
                  ? "bg-cyan-600 text-white"
                  : "bg-[#0b0f19] text-gray-400 hover:text-white"
              }`}
            >
              Swap
            </button>

            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "leaderboard"
                  ? "bg-cyan-600 text-white"
                  : "bg-[#0b0f19] text-gray-400 hover:text-white"
              }`}
            >
              Leaderboard
            </button>

            <button
              onClick={() => setActiveTab("dapps")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "dapps"
                  ? "bg-cyan-600 text-white"
                  : "bg-[#0b0f19] text-gray-400 hover:text-white"
              }`}
            >
              Dapps
            </button>

            <button
              onClick={() => setActiveTab("activity")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "activity"
                  ? "bg-cyan-600 text-white"
                  : "bg-[#0b0f19] text-gray-400 hover:text-white"
              }`}
            >
              Activity
            </button>

            <button
              onClick={() => setActiveTab("community")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "community"
                  ? "bg-cyan-600 text-white"
                  : "bg-[#0b0f19] text-gray-400 hover:text-white"
              }`}
            >
              Community
            </button>
          </div>

          {/* QUEST LIST */}
          {activeTab === "quests" && (
            <>
              <h2 className="text-xl font-semibold text-cyan-400 mb-4">
                🎮 Gamified Questboard
              </h2>

              {quests.length > 0 ? (
                quests.map((q) => (
                  <QuestCard
                    key={q.id}
                    quest={q}
                    wallet={wallet}
                    publicKey={publicKey}
                    completedQuests={completedQuests}
                    setCompletedQuests={setCompletedQuests}
                    onComplete={handleComplete}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm">No quests available yet.</p>
              )}
            </>
          )}

          {activeTab === "dashboard" && <Dashboard walletAdapter={wallet} />}
          {activeTab === "questboard" && <Questboard />}
          {activeTab === "swap" && (
            <SwapWidget
              connection={connection}
              walletAdapter={wallet}
              publicKey={publicKey}
              sendTransaction={sendTransaction}
            />
          )}
          {activeTab === "leaderboard" && <LeaderboardWidget />}
          {activeTab === "dapps" && <DappsWidget />}
          {activeTab === "activity" && <ActivityTracker />}
          {activeTab === "community" && <CommunityHub />}
        </section>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          {/* Wallet Info */}
          <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-5 shadow-md">
            <h3 className="text-cyan-400 font-semibold mb-2">Wallet Info</h3>
            {publicKey ? (
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-400">Address:</span>{" "}
                  {account?.address?.slice(0, 6)}...
                  {account?.address?.slice(-6)}
                </p>
                <p>
                  <span className="text-gray-400">Balance:</span>{" "}
                  {account?.balance?.toFixed(3)} SOL
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Connect your wallet to see details.
              </p>
            )}
          </div>

          {/* Mentor */}
          <div className="flex items-center gap-4 p-4 bg-[#0b0f19] border border-gray-800 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-blue-900/5 to-cyan-800/10 animate-bgflow pointer-events-none" />
            <EleshaAvatar isActive={thinking} />

            <div className="flex flex-col z-10">
              <h3 className="text-cyan-400 font-semibold">
                Elesha — CARV Mentor ✨
              </h3>
              <p className="text-gray-400 text-sm italic">
                {thinking
                  ? "Processing insights from the CARV SVM chain..."
                  : "Ready when you are, my friend."}
              </p>
            </div>

            <button
              onClick={handleSend}
              className="ml-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition-all font-medium shadow-md shadow-cyan-800/30 z-10"
            >
              Wake Elesha
            </button>
          </div>

          {/* Mentor Chat */}
          <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-5 shadow-md mt-2">
            <MentorChat onAsk={handleAsk} />
          </div>
        </aside>
      </main>
    </div>
  );
}
