import { useEffect, useState } from "react";

export default function CommunityHub() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/community")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500 text-sm">Loading community updates...</p>;
  if (!data) return <p className="text-gray-500 text-sm">No community data available.</p>;

  const { feed, contributors, links } = data;

  return (
    <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-cyan-400">🌐 CARV Community Hub</h2>

      {/* Feed */}
      <div>
        <h3 className="text-cyan-300 mb-2 font-medium">Live Feed</h3>
        <div className="space-y-3">
          {feed.map((post, i) => (
            <div key={i} className="border border-gray-700 rounded-lg p-3 hover:border-cyan-600 transition">
              <div className="flex justify-between text-sm text-gray-400">
                <span className="font-semibold text-white">{post.user}</span>
                <span>{post.time}</span>
              </div>
              <p className="text-gray-300 mt-1">{post.message}</p>
              <span className="text-xs text-cyan-500">{post.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors 
      <div>
        <h3 className="text-cyan-300 mb-2 font-medium">Top Contributors</h3>
        <ul className="space-y-2">
          {contributors.map((c, i) => (
            <li key={i} className="flex justify-between text-gray-300 border-b border-gray-800 pb-1">
              <span>{c.name}</span>
              <span className="text-cyan-400 font-semibold">{c.xp} XP</span>
            </li>
          ))}
        </ul>
      </div>*/}

      {/* Links */}
      <div>
        <h3 className="text-cyan-300 mb-2 font-medium">Join the Community</h3>
        <div className="flex flex-wrap gap-3">
          <a href={links.discord} target="_blank" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-white text-sm transition">💬 Discord</a>
          <a href={links.telegram} target="_blank" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white text-sm transition">📱 Telegram</a>
          <a href={links.twitter} target="_blank" className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg text-white text-sm transition">🐦 X (Twitter)</a>
        </div>
      </div>
    </div>
  );
}
