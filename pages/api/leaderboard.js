import { supabase } from "../../lib/supabase";
import { getUserXP } from "../../lib/getUserXP";

export default async function handler(req, res) {
  try {
    // 1️⃣ Fetch all distinct users who completed quests
    const { data, error } = await supabase
      .from("quest_completions")
      .select("user_address")
      .neq("user_address", null);

    if (error) throw error;
    if (!data.length) return res.status(200).json([]);

    // 2️⃣ Unique wallet addresses
    const users = [...new Set(data.map((u) => u.user_address))];

    // 3️⃣ Compute XP per user
    const leaderboard = [];
    for (let address of users) {
      const xp = await getUserXP(address);
      leaderboard.push({
        wallet: address,
        xp,
      });
    }

    // 4️⃣ Sort by XP DESC
    leaderboard.sort((a, b) => b.xp - a.xp);

    return res.status(200).json(leaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err);
    return res.status(500).json({ error: "Failed to load leaderboard" });
  }
}
