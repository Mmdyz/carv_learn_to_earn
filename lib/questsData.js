// lib/questsData.js

const quests = [
  {
    id: "first-tx",
    title: "Complete Your First Transaction",
    description: "Interact with CARV SVM by submitting a memo transaction.",
    type: "On-Chain",
    xp: 50,
    difficulty: "Easy",
    verify: {
      type: "memo",
      memoText: "Quest completed: 1"
    }
  },

  {
  id: "explore-dapps",
  title: "Explore Dapps on Carv SVM Chain",
  description: "Visit the Dapps tab and vote for any Dapp.",
  xp: 50,
  difficulty: "Easy",
  verify: {
    type: "vote_dapp"
  }
},
  {
  id: "join-discord",
  title: "Join CARV Discord",
  description: "Join the official CARV Discord server.",
  xp: 30,
  difficulty: "Easy",
  verify: {
    type: "auto_click",
    url: "https://discord.gg/carv" // example
  }
},
{
  id: "follow-x",
  title: "Follow CARV on X",
  description: "Follow @carv_official on X.",
  xp: 30,
  difficulty: "Easy",
  verify: {
    type: "auto_click",
    url: "https://x.com/carv_official"
  }
},

  {
    id: "svm-deploy",
    title: "Deploy a Smart Contract",
    description: "Deploy a contract on CARV SVM and paste your Program ID.",
    type: "On-Chain",
    xp: 100,
    difficulty: "Medium",
    verify: {
      type: "program_deploy"
    }
  },

  {
    id: "mint-og-badge",
    title: "SVM Chain OG",
    description: "Requires at least 100 SVM transactions.",
    type: "On-Chain",
    xp: 70,
    difficulty: "Medium",
    verify: {
      type: "onchain",
      minTx: 100
    }
  },

  {
    id: "submit-project",
    title: "Submit a Learn-to-Earn Project",
    description: "Submit your project and wait for review.",
    type: "Build",
    xp: 200,
    difficulty: "Hard",
    verify: {
      type: "manual"
    }
  }
];

export default quests;
