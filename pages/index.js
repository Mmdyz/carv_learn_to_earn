import { useEffect, useState } from "react";
import axios from "axios";
import QuestCard from "../components/QuestCard";
import MentorChat from "../components/MentorChat";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection, getAccountData } from "../lib/connection";
import { logQuestCompletion } from "../lib/contract";
import SwapWidget from "../components/SwapWidget";
import { motion, AnimatePresence } from "framer-motion";
import DappsWidget from "../components/DappsWidget";
import ActivityTracker from "../components/ActivityTracker";
import CommunityHub from "../components/CommunityHub";
import toast from "react-hot-toast";
import Questboard from "../components/Questboard";
import Dashboard from "./dashboard";
import ThemeToggle from "../components/ThemeToggle";
import ElyraAvatar from "../components/ElyraAvatar";

import LeaderboardWidget from "../components/LeaderboardWidget"; // ⬅️ Add this import
import dynamic from "next/dynamic";

export default function Home() {
  const [quests, setQuests] = useState([]);
  const [activeTab, setActiveTab] = useState("quests");
  const [aiReply, setAiReply] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [account, setAccount] = useState(null);
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useWallet();

  const [thinking, setThinking] = useState(false);

  const handleSend = async () => {
    setThinking(true);
    // simulate async response
    await new Promise((r) => setTimeout(r, 2000));
    setThinking(false);
  };



  // Initial load
  useEffect(() => {
    fetchQuests();
    fetchLeaderboard();
  }, []);

  // Wallet info updates
  useEffect(() => {
    if (!publicKey) return;
    fetchAccount();

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

  async function fetchQuests() {
    const res = await axios.get("/api/quests");
    setQuests(res.data);
  }

  async function fetchLeaderboard() {
    const res = await axios.get("/api/leaderboard");
    setLeaderboard(res.data || []);
  }



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
    if (!publicKey) {
      toast.error("Please connect your Backpack wallet first.");
      return;
    }

    // Pass the full wallet adapter, not a custom object
    const sig = await logQuestCompletion(wallet, questId);

    //toast.success("Quest submitted successfully!");
    console.log("Transaction Signature:", sig);

    fetchLeaderboard();
  } catch (e) {
    console.error(e);
  //  toast.error("Quest submission failed.");
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
      
       <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent ">
        <span className="text-sm text-gray-400"></span>
        </h1>
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
      

           {activeTab === "quests" && (
    <>
      <h2 className="text-xl font-semibold text-cyan-400 mb-4">
        🎮 Gamified Questboard
      </h2>

      {quests.length > 0 ? (
        quests.map((q) => (
          <QuestCard key={q.id} quest={q} onComplete={handleComplete} />
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
                  {account?.address?.slice(0, 6)}...{account?.address?.slice(-6)}
                </p>
                <p>
                  <span className="text-gray-400">Balance:</span>{" "}
                  {account?.balance?.toFixed(3)} SOL
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Connect your wallet to see details.</p>
            )}
          </div>

        {/* === Mentor Header === */}
<div className="flex items-center gap-4 p-4 bg-[#0b0f19] border border-gray-800 rounded-xl relative overflow-hidden">
  {/* Holographic background pulse */}
  <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-blue-900/5 to-cyan-800/10 animate-bgflow pointer-events-none" />

  <ElyraAvatar isActive={thinking} />

  <div className="flex flex-col z-10">
    <h3 className="text-cyan-400 font-semibold">Elyra — CARV Mentor ✨</h3>
    <p className="text-gray-400 text-sm italic">
      {thinking
        ? "Processing insights from the CARV chain..."
        : "Ready when you are, my friend."}
    </p>
  </div>

  <button
    onClick={handleSend}
    className="ml-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition-all font-medium shadow-md shadow-cyan-800/30 z-10"
  >
    Ask Elyra
  </button>

  <style jsx>{`
    .animate-bgflow {
      background-size: 200% 200%;
      animation: bgflow 6s ease-in-out infinite alternate;
    }
    @keyframes bgflow {
      0% {
        background-position: left center;
      }
      100% {
        background-position: right center;
      }
    }
  `}</style>
</div>

{/* === Mentor Chat === */}
<div className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-5 shadow-md mt-2">
  <MentorChat onAsk={handleAsk} />
</div>


          {/* Leaderboard */}
          
        </aside>
      </main>
    </div>
  );
}
