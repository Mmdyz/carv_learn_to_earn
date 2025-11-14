// pages/api/carvex-proxy.js
import axios from "axios";

export default async function handler(req, res) {
  const { endpoint, ...params } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: "Missing endpoint parameter" });
  }

  const baseUrl = "https://carvex.fun/"; // ✅ CARVEX main aggregator endpoint
  const url = `${baseUrl}/${endpoint}`;

  try {
    const { data } = await axios.get(url, { params });
    res.status(200).json(data);
  } catch (err) {
    console.error("CARVEX Proxy Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "CARVEX proxy failed",
      details: err.response?.data || err.message,
    });
  }
}
