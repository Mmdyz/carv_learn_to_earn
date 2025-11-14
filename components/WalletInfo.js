import { useEffect, useState } from "react";

export default function WalletInfo({ address, balance, network }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-5 text-gray-200 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-cyan-400 tracking-wide">
          Wallet Overview
        </h2>

        {/* Network badge */}
        <span className="px-3 py-1 rounded-lg text-xs bg-cyan-900/40 text-cyan-300 border border-cyan-700">
          {network || "SVM Testnet"}
        </span>
      </div>

      {/* Address display */}
      <div className="flex items-center justify-between bg-[#101524] rounded-lg p-3 mb-3 border border-gray-700">
        <div className="truncate text-sm text-gray-300 font-mono">
          {address
            ? `${address.slice(0, 6)}...${address.slice(-6)}`
            : "Not connected"}
        </div>

        <button
          onClick={copyToClipboard}
          className="text-cyan-400 hover:text-cyan-300 transition text-sm flex items-center gap-1"
        >
          {/* Copy icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Balance Section */}
      <div className="bg-[#101524] border border-gray-700 rounded-lg p-4 text-center">
        <div className="text-gray-400 text-sm mb-1">Token Balance</div>
        <div className="text-2xl font-bold text-cyan-400 animate-pulse">
          {balance !== undefined ? `${balance} $CARV` : "—"}
        </div>
      </div>
    </div>
  );
}
