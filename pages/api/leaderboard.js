// pages/api/leaderboard.js
import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "data_leaderboard.json");

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const data = raw.trim() ? JSON.parse(raw) : { counts: {} }; // 🛠 Fallback if empty

    const sorted = Object.entries(data.counts || {})
      .sort((a, b) => b[1] - a[1])
      .map(([address, count]) => ({ address, count }));

    res.status(200).json(sorted);
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    res.status(200).json([]); // fallback empty
  }
}
