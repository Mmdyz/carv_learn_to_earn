// pages/api/vote.js
import fs from "fs";
import path from "path";

const votesFile = path.join(process.cwd(), "data", "votes.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(votesFile))) {
  fs.mkdirSync(path.dirname(votesFile));
}

// Initialize votes file if empty
if (!fs.existsSync(votesFile)) {
  fs.writeFileSync(votesFile, JSON.stringify({}));
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Fetch vote data
    const votes = JSON.parse(fs.readFileSync(votesFile, "utf8"));
    return res.status(200).json(votes);
  }

  if (req.method === "POST") {
    try {
      const { dapp, wallet } = req.body;
      if (!dapp || !wallet)
        return res.status(400).json({ message: "Missing dapp or wallet" });

      const votes = JSON.parse(fs.readFileSync(votesFile, "utf8"));

      // Make sure each wallet votes only once per dApp
      if (!votes[dapp]) votes[dapp] = { count: 0, voters: [] };
      if (votes[dapp].voters.includes(wallet))
        return res.status(400).json({ message: "Already voted" });

      // Record new vote
      votes[dapp].count += 1;
      votes[dapp].voters.push(wallet);
      fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));

      return res.status(200).json({ success: true, votes: votes[dapp].count });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error saving vote" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
