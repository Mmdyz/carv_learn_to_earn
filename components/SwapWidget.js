import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

// Testnet token mints
const TOKENS = {
  CARV: "D7WVEw9Pkf4dfCCE3fwGikRCCTvm9ipqTYPHRENLiw3s",
  USDT: "7J6YALZGY2MhAYF9veEapTRbszWVTVPYHSfWeK2LuaQF",
};

export default function SwapWidget() {
  const [priceData, setPriceData] = useState([]);
  const [livePrice, setLivePrice] = useState(null);

  // Fetch live price data (read-only)
  useEffect(() => {
    fetchPriceHistory();
    const interval = setInterval(fetchPriceHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchPriceHistory() {
    try {
      const res = await axios.get("/api/carvex-proxy", {
        params: { endpoint: "api/prices", pair: "CARV-USDT" },
      });
      const formatted = (res.data?.history || []).map((p) => ({
        time: new Date(p.timestamp * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        price: p.price,
      }));
      setPriceData(formatted);
      if (formatted.length > 0) setLivePrice(formatted.at(-1).price);
    } catch (e) {
      console.warn("Price feed unavailable, using placeholder data");
      setPriceData([{ time: "10:00", price: 1.0 }]);
      setLivePrice(1.0);
    }
  }

  return (
    <div className="flex flex-col gap-6 text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-cyan-400">
          NEX DEX (Coming Soon)
        </h2>
        {livePrice ? (
          <span className="text-sm text-cyan-300 bg-gray-800 px-3 py-1 rounded-full border border-cyan-700">
            💹 1 CARV = {parseFloat(livePrice).toFixed(4)} USDT
          </span>
        ) : (
          <span className="text-sm text-gray-500">Fetching price...</span>
        )}
      </div>

      {/* Chart */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-[#0b101a] p-4">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-cyan-900/5 animate-pulse pointer-events-none" />
        <h3 className="text-sm text-gray-400 mb-2">Live CARV/USDT Price</h3>
        <ResponsiveContainer width="100%" height={170}>
          <LineChart data={priceData}>
            <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
            <YAxis
              domain={["auto", "auto"]}
              stroke="#64748b"
              fontSize={10}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #22d3ee",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "#22d3ee" }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#22d3ee"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Disabled Swap Form */}
      <div className="bg-[#101524] border border-gray-800 rounded-xl p-4 text-center space-y-3">
        <p className="text-gray-400 text-sm">
          💱 Swapping will be available soon, Ready to trade? Open CARVEX below..
        </p>

        <button
          disabled
          className="w-full bg-cyan-600/30 text-gray-400 border border-cyan-700 rounded py-2 font-semibold cursor-not-allowed"
        >
          Swap (Coming Soon)
        </button>

        {/* ✅ Updated Get Quote Button */}
        <button
          onClick={() => window.open("https://carvex.fun/trade", "_blank")}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border border-cyan-600 rounded py-2 font-semibold shadow-md transition-transform transform hover:scale-105"
        >
          🚀 Use Official DEX
        </button>
      </div>

      {/* Glow effect */}
      <style jsx global>{`
        .recharts-line path {
          filter: drop-shadow(0 0 8px #22d3ee) drop-shadow(0 0 14px #22d3ee);
        }
      `}</style>
    </div>
  );
}

/*import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { VersionedTransaction } from "@solana/web3.js";

const TOKENS = {
  CARV: "D7WVEw9Pkf4dfCCE3fwGikRCCTvm9ipqTYPHRENLiw3s",
  USDT: "7J6YALZGY2MhAYF9veEapTRbszWVTVPYHSfWeK2LuaQF",
};

export default function SwapWidget({ connection, walletAdapter }) {
  const [fromToken, setFromToken] = useState("USDT");
  const [toToken, setToToken] = useState("CARV");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(null);
  const [swapping, setSwapping] = useState(false);

  // 🔁 Auto-refresh CARV price every 15 seconds
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await axios.get("/api/carvex-proxy", {
          params: { endpoint: "api/prices", pair: "CARV-USDT" },
        });
        setPrice(res.data?.price || null);
      } catch {
        setPrice(null);
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 15000);
    return () => clearInterval(interval);
  }, []);

  // 🧾 Fetch quote
  async function getQuote() {
    if (!amount || isNaN(amount)) return toast.error("Enter a valid amount");
    setLoading(true);
    setQuote(null);

    try {
      const res = await axios.get("/api/carvex-proxy", {
        params: {
          endpoint: "api/quote",
          inputMint: TOKENS[fromToken],
          outputMint: TOKENS[toToken],
          amount: (amount * 1_000_000).toFixed(0),
        },
      });

      setQuote(res.data);
      toast.success("Quote fetched successfully ✅");
    } catch (err) {
      toast.error("Failed to fetch quote");
      console.error("Quote error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ⚡ Execute real swap
  async function executeSwap() {
    // 🧩 Detect any wallet type (Phantom, Backpack, Solflare)
    const pubkey =
      walletAdapter?.publicKey ||
      walletAdapter?.adapter?.publicKey ||
      walletAdapter?.wallet?.adapter?.publicKey;

    if (!pubkey) {
      toast.error("Connect your wallet first");
      return;
    }

    if (!quote) {
      toast.error("No quote available — please fetch one first");
      return;
    }

    try {
      setSwapping(true);
      toast.loading("Preparing swap transaction...");

      const tradeRes = await axios.post("/api/carvex-trade", {
        inputMint: TOKENS[fromToken],
        outputMint: TOKENS[toToken],
        amount: (amount * 1_000_000).toFixed(0),
        userPubkey: pubkey.toBase58(),
      });

      const txBuffer = Buffer.from(tradeRes.data.swapTransaction, "base64");
      const tx = VersionedTransaction.deserialize(txBuffer);

      const signedTx = await walletAdapter.signTransaction(tx);
      const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        maxRetries: 3,
      });

      await connection.confirmTransaction(signature, "confirmed");
      toast.dismiss();
      toast.success(`✅ Swap successful!`);
      console.log("Swap tx:", signature);
    } catch (err) {
      toast.dismiss();
      toast.error("❌ Swap failed");
      console.error("Swap error:", err);
    } finally {
      setSwapping(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-950/80 to-gray-900 border border-cyan-800/40 shadow-md rounded-2xl p-5 w-full">
      <h3 className="text-lg font-semibold text-cyan-400 mb-4">💱 Swap Tokens</h3>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">From</label>
          <select
            className="w-full bg-gray-900 text-gray-200 rounded-lg p-2 border border-gray-700 focus:outline-none"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
          >
            <option value="USDT">USDT</option>
            <option value="CARV">CARV</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">To</label>
          <select
            className="w-full bg-gray-900 text-gray-200 rounded-lg p-2 border border-gray-700 focus:outline-none"
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
          >
            <option value="CARV">CARV</option>
            <option value="USDT">USDT</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs text-gray-400 mb-1">Amount</label>
        <input
          type="number"
          className="w-full bg-gray-900 text-gray-200 rounded-lg p-2 border border-gray-700 focus:outline-none"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="text-sm text-gray-400 mb-3">
        {price ? (
          <p>
            1 CARV ≈ <span className="text-cyan-400">{price.toFixed(4)}</span> USDT
          </p>
        ) : (
          <p className="text-gray-600">Fetching price...</p>
        )}
      </div>

      {quote && (
        <div className="text-sm text-gray-300 mb-4 bg-gray-900 p-3 rounded-xl border border-gray-700">
          <p>
            Expected Output: {(quote.outAmount / 1_000_000).toFixed(3)} {toToken}
          </p>
          <p>Route: {quote.route || "CARVEX Aggregator"}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={getQuote}
          disabled={loading}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
            loading ? "bg-cyan-900 text-gray-400" : "bg-cyan-600 hover:bg-cyan-500 text-white"
          }`}
        >
          {loading ? "Fetching..." : "Get Quote"}
        </button>

        <button
          onClick={executeSwap}
          disabled={swapping || !quote}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
            swapping
              ? "bg-cyan-900 text-gray-400"
              : quote
              ? "bg-cyan-600 hover:bg-cyan-500 text-white"
              : "bg-gray-800 text-gray-400"
          }`}
        >
          {swapping ? "Swapping..." : "Execute Swap"}
        </button>
      </div>
    </div>
  );
}
*/
