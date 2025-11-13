/* pages/api/profile.js
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data_profile.json");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const profile = JSON.parse(raw || "{}");
      res.status(200).json(profile);
    } catch {
      res.status(200).json({ xp: 0, streak: 0, badges: [] });
    }
  }

  if (req.method === "POST") {
    try {
      const { xpEarned, questType } = req.body;
      const raw = await fs.readFile(filePath, "utf8");
      const profile = JSON.parse(raw || "{}");

      profile.xp = (profile.xp || 0) + xpEarned;
      profile.streak = (profile.streak || 0) + 1;

      if (profile.streak % 7 === 0) {
        profile.badges = [...(profile.badges || []), "🔥 7-Day Streak"];
      }

      await fs.writeFile(filePath, JSON.stringify(profile, null, 2));
      res.status(200).json(profile);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
*/