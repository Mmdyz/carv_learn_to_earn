// components/DappsWidget.js
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// 🧩 Fallback Button (simple custom component)
const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`transition font-medium rounded-lg px-4 py-2 active:scale-95 ${className}`}
  >
    {children}
  </button>
);

export default function DappsWidget() {
  const wallet = useWallet();
  const [votes, setVotes] = useState({});
  const [animate, setAnimate] = useState({});

  useEffect(() => {
    fetchVotes();
  }, []);

 const fetchVotes = async () => {
  try {
    const res = await axios.get("/api/vote");
    setVotes(res.data);
  } catch {
    toast.error("Failed to load votes");
  }
};

const handleUpvote = async (dapp) => {
  if (!wallet.publicKey)
    return toast.error("Connect your wallet before voting!");

  const walletAddr = wallet.publicKey.toBase58();
  try {
    await axios.post("/api/vote", { dapp, wallet: walletAddr });
    toast.success("Vote recorded successfully!");
    fetchVotes();
  } catch (err) {
    const msg = err.response?.data?.message;
    if (msg === "Already voted")
      toast("You’ve already voted for this dApp!");
    else toast.error("Vote failed, please try again later.");
  }
};



  const dapps = [
    {
      name: "CARVEX",
      description: "A decentralized exchange built on CARV SVM Chain.",
      url: "https://carvex.fun/",
      icon: "💱",
    },
    {
      name: "CARV NEXUS",
      description:
        "next-generation ecosystem hub built on the CARV SVM Chain.",
      url: "https://carv-learn-to-earn.vercel.app",
      icon: "🌐",
    },
     {
      name: " CARV Soul Scanner",
      description: "A lightweight, on-chain personality analyzer.",
      url: " https://carv-souls-scanner.vercel.app/",
      icon: "🧠",
    },
    {
      name: "Neoland",
      description:
        "The first NFT Marketplace built on CARV SVM Chain.",
      url: " https://febro.fun/",
      icon: " 🖼️",
    },
    {
      name: " CARV Discord Level Avatar Builder",
      description: " AI-powered visual generation that rewards community participation.",
      url: " https://carv-discord-avatar-builder.streamlit.app/",
      icon: "🎨",
    },
    {
      name: " Dreamz",
      description:
        "A social network where creators thrive, compete, and learn together on CARV SVM Chain.",
      url: "  https://ourdreamz.xyz/",
      icon: " 🌟",
    },
  ];

  // Sort dapps by votes (highest first)
  const sortedDapps = [...dapps].sort(
    (a, b) => (votes[b.name] || 0) - (votes[a.name] || 0)
  );

  return (
    <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl shadow-md p-6">
      {/* Header Row */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
          🔗 Top Dapps on SVM Chain
        </h2>

        <Button
          onClick={() =>
            window.open("https://forms.gle/mpZNfR75Q1mtcxH67", "_blank")
          }
          className="bg-cyan-700 hover:bg-cyan-600 text-white text-sm rounded-lg shadow-md"
        >
          🚀 Submit Your Project
        </Button>
      </div>

      {/* Dapp Cards */}
      <div className="space-y-4">
        {sortedDapps.map((dapp, index) => (
          <div
            key={dapp.name}
            className={`border border-gray-700 rounded-xl p-4 flex justify-between items-center hover:border-cyan-600 transition ${
              index === 0 ? "bg-[#101727]" : ""
            }`}
          >
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {dapp.icon} {dapp.name}
              </h3>
              <p className="text-gray-400 text-sm mt-1">{dapp.description}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.open(dapp.url, "_blank")}
                className="bg-cyan-600 hover:glow-cyan text-white text-sm shadow-md px-4 py-2 rounded-lg font-medium transition"
              >
                Go to Dapp
              </button>

              <button
                onClick={() => handleUpvote(dapp.name)}
                className={`relative bg-gray-800 hover:bg-gray-700 text-cyan-400 text-sm px-4 py-2 rounded-lg font-medium transition ${
                  animate[dapp.name] ? "animate-ping-once" : ""
                }`}
              >
                ⬆️vote {votes[dapp.name] || 0}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Animations & Glow */}
      <style jsx>{`
        .animate-ping-once {
          animation: pulseOnce 0.4s ease-in-out;
        }

        @keyframes pulseOnce {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.25);
          }
          100% {
            transform: scale(1);
          }
        }

        .hover\\:glow-cyan:hover {
          box-shadow: 0 0 10px 2px rgba(34, 211, 238, 0.5);
          transition: box-shadow 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
