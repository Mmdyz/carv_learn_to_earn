// pages/api/community.js
export default async function handler(req, res) {
  try {
    // Temporary dummy feed (can replace with X API later)
    const feed = [
     

      
      {
        user: "MCryptoMav",
        handle: "@MCryptoMav",
        message: "Just deployed Learn-to-Earn dApp on CARV SVM! 🔥",
        time: "5h ago",
        tag: "#CARVChain",
        
      },
      {
        user: "Base Hub 🛡️",
        handle: "@BaseHubHB",
        message: "@carv_official is building the AI-native OS for Web3, where sovereign AI beings can think, transact, and evolve across chains.",
        time: "5h ago",
        tag: "#CARVChain",
        
      },

    ];

    const contributors = [
      { name: "MCryptoMav", xp: 920 },
      { name: "carv_priest", xp: 840 },
    ];

    const links = {
      discord: "https://discord.gg/carv",
      telegram: "https://t.me/carvofficial",
      twitter: "https://twitter.com/carv_official",
    };

    res.status(200).json({ feed, contributors, links });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
