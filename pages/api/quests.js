//pages/api/quests.js
export default function handler(req, res) {
  const quests = [
    {
      id: 1,
      title: "Complete Your First Transaction",
      description: "Interact with CARV SVM Chain.",
      type: "On-Chain",
      xp: 50,
      difficulty: "Easy",
      streakBonus: true,
    },
    { difficulty: "Easy", xp: 50, id: 'learn-1', title: 'Explore Dapps', description: 'Goto the Dapps tab and visit any dapp' },
    {
      id: 2,
      title: "Join the CARV Discord",
      description: "Engage with fellow builders in the CARV ecosystem.",
      type: "Engage",
      xp: 20,
      difficulty: "Easy",
      streakBonus: false,
    },
    
    { difficulty: "Easy", xp: 50, id: 'learn-1', title: 'Intro to CARV SVM', description: 'Deploy a simple contract on CARV SVM.' },
    { difficulty: "Easy", xp: 50, id: 'learn-1', title: 'Mint OG badge', description: 'Have at least 100 interactions on carv svm chain to be eligeble to mint' },
    /*{ difficulty: "Hard", xp: 150,id: 'learn-2', title: 'AgentKit Integration', description: 'Connect a CARV Agent to your dApp and fetch profile.' },*/
    {
      id: 3,
      title: "Submit a Learn-to-Earn Project",
      description: "Build your own quest or dApp and submit it for review.",
      type: "Build",
      xp: 200,
      difficulty: "Hard",
      streakBonus: true,
    },
  ];
  res.status(200).json( quests );
}
