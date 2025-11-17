import { supabase } from "../../lib/supabase";

// Utility: convert timestamp → "5m ago"
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  for (let key in intervals) {
    const value = intervals[key];
    if (seconds >= value) {
      return Math.floor(seconds / value) + key[0];
    }
  }
  return seconds + "s";
}

export default async function handler(req, res) {
  try {
    // 1️⃣ Recent quest completions
    const { data: questFeed } = await supabase
      .from("quest_completions")
      .select("user_address, quest_id, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    // 2️⃣ Recent dapp votes
    const { data: votes } = await supabase
      .from("votes")
      .select("user_address, dapp_id, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    // 3️⃣ Build combined feed
    const feed = [];

    // Format quest feed
    questFeed?.forEach((q) => {
      feed.push({
        type: "quest",
        user: q.user_address.slice(0, 6) + "..." + q.user_address.slice(-4),
        message: `Completed quest #${q.quest_id}!`,
        time: timeAgo(q.created_at),
        tag: "Quest Completed",
      });
    });

    // Format votes
    votes?.forEach((v) => {
      feed.push({
        type: "vote",
        user: v.user_address.slice(0, 6) + "..." + v.user_address.slice(-4),
        message: `Voted for dapp #${v.dapp_id}!`,
        time: timeAgo(v.created_at),
        tag: "Dapp Vote",
      });
    });

    // Sort everything by most recent
    feed.sort((a, b) => new Date(b.time) - new Date(a.time));

    return res.status(200).json({
      feed,
      links: {
        discord: "https://discord.gg/your-link",
        telegram: "https://t.me/your-group",
        twitter: "https://twitter.com/CARVofficial",
      },
    });
  } catch (err) {
    console.error("Community API error:", err);
    return res.status(500).json({ error: "Failed to load community feed" });
  }
}
