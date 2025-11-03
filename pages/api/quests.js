export default function handler(req,res){
  const quests = [
    { id: 'learn-1', title: 'Intro to CARV SVM', description: 'Deploy a simple contract on CARV SVM using Remix.' },
    { id: 'learn-2', title: 'AgentKit Integration', description: 'Connect a CARV Agent to your dApp and fetch profile.' },
    { id: 'learn-3', title: 'Build a Quest Logger', description: 'Call QuestLog.completeQuest from a serverless function.' }
  ];
  res.status(200).json(quests);
}