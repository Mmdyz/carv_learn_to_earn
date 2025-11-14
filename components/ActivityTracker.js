import { useEffect, useState } from "react";

export default function ActivityTracker() {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 10000); // every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await fetch("/api/activity");
      const data = await res.json();
      setTxs(data.transactions || []);
    } catch (err) {
      console.error("Error fetching on-chain activity:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
        ⚡ Recent On-Chain Activity
      </h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Fetching activity...</p>
      ) : txs.length > 0 ? (
        <div className="space-y-3">
          {txs.map((tx) => (
            <div
              key={tx.signature}
              className="border border-gray-700 rounded-xl p-3 hover:border-cyan-600 transition"
            >
              <div className="flex justify-between text-sm text-gray-300">
                <span className="text-cyan-400 font-mono truncate w-1/2">
                  {tx.signature.slice(0, 25)}...
                </span>
                <span>{tx.status}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Slot: {tx.slot}</span>
                <span>{tx.blockTime}</span>
              </div>
              <a
                href={`https://solscan.io/tx/${tx.signature}?cluster=custom&customUrl=${encodeURIComponent(
                  "https://rpc.carv.testnet.soo.network/rpc/carv-McPrlbfMcW0ggpkvr07Tjs2YfviwpHaI"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-500 hover:underline mt-1 block"
              >
                View on Solscan
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No recent transactions found.</p>
      )}
    </div>
  );
}
