//pages/api/mentor.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  // Fallback mentor replies if API fails
  const fallbackReplies = [
    "🚀 Let's explore how the CARV SVM works together!",
    "🧠 Try completing a quest to boost your builder rank!",
    "⚙️ The future of Web3 learning is on-chain with CARV.",
    "🔥 You’re doing great — check your leaderboard next!",
    "💡 Tip: Try reading your wallet data from the CARV SVM chain.",
  ];

  const fallback =
    fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];

  // If no API key found, auto-use fallback
  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️ No OpenAI API key found — using fallback response");
    return res.status(200).json({ reply: fallback });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are CARV Mentor — an AI that helps users learn about Web3, CARV SVM, and decentralized learning. Reply in a concise, encouraging, and futuristic tone.",
        },
        { role: "user", content: prompt },
      ],
    });

    const reply = completion.choices[0].message.content || fallback;
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("🚨 Mentor API Error:", error.message);
    return res.status(200).json({ reply: fallback });
  }
}
