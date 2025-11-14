import { supabase } from "./supabase";
import quests from "./questsData";

export async function getUserXP(walletAddress) {
  if (!walletAddress) return 0;

  const { data, error } = await supabase
    .from("quest_completions")
    .select("quest_id")
    .eq("user_address", walletAddress);

  if (error || !data) return 0;

  const completed = data.map((q) => q.quest_id);

  const earnedXp = quests
    .filter((q) => completed.includes(q.id))
    .reduce((sum, q) => sum + (q.xp || 0), 0);

  return earnedXp;
}
