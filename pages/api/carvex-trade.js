// pages/api/carvex-trade.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { inputMint, outputMint, amount, userPubkey } = req.body;

  if (!inputMint || !outputMint || !amount || !userPubkey) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    // ✅ CARVEX API endpoint for transaction swap
    const url = "https://carvex.fun/api/swap";
    const { data } = await axios.post(url, {
      inputMint,
      outputMint,
      amount,
      userPublicKey: userPubkey,
      slippage: 1,
      platformFeeBps: 0,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("CARVEX Trade API error:", error.response?.data || error.message);
    return res.status(500).json({
      error: "CARVEX trade failed",
      details: error.response?.data || error.message,
    });
  }
}
