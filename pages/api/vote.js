// pages/api/vote.js
import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("votes").select("dapp");
    if (error) return res.status(500).json({ error: error.message });

    const counts = data.reduce((acc, v) => {
      acc[v.dapp] = (acc[v.dapp] || 0) + 1;
      return acc;
    }, {});

    return res.status(200).json(counts);
  }

  if (req.method === "POST") {
    const { dapp, wallet } = req.body;
    if (!dapp || !wallet)
      return res.status(400).json({ message: "Missing dapp or wallet" });

    // check if user already voted for this dapp
    const { data: existing, error: checkErr } = await supabase
      .from("votes")
      .select("id")
      .eq("dapp", dapp)
      .eq("wallet", wallet);

    if (checkErr) return res.status(500).json({ message: checkErr.message });
    if (existing?.length > 0)
      return res.status(400).json({ message: "Already voted" });

    // insert vote
    const { error } = await supabase.from("votes").insert([{ dapp, wallet }]);
    if (error) return res.status(500).json({ message: error.message });

    return res.status(200).json({ success: true });
  }

  res.status(405).json({ message: "Method not allowed" });
}
