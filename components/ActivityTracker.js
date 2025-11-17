
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CommunityHub() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/activity");
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 25000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-gray-500 text-sm">Loading recent activities...</p>;
  if (!data) return <p className="text-gray-500 text-sm">No data available.</p>;

  const { feed, links } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0b0f19] border border-gray-800 rounded-2xl shadow-md p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold text-cyan-400">Recent Activities</h2>

      {/* Live Feed */}
      <div>
        <h3 className="text-cyan-300 mb-2 font-medium">...</h3>
        <div className="space-y-3">
          {feed.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="border border-gray-700 rounded-lg p-3 hover:border-cyan-600 transition bg-[#0f1625]"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <img
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${post.user}`}
                  className="w-8 h-8 rounded-full"
                />

                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span className="font-semibold text-white">{post.user}</span>
                    <span>{post.time}</span>
                  </div>
                  <p className="text-gray-300 mt-1">{post.message}</p>
                  <span className="text-xs bg-cyan-600/20 text-cyan-400 px-2 py-0.5 rounded-md mt-2 inline-block">
                    {post.tag}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Links 
      <div>
        <h3 className="text-cyan-300 mb-2 font-medium">Join the Community</h3>
        <div className="flex flex-wrap gap-3">
          <a href={links.discord} target="_blank" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-white text-sm transition">💬 Discord</a>
          <a href={links.telegram} target="_blank" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white text-sm transition">📱 Telegram</a>
          <a href={links.twitter} target="_blank" className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg text-white text-sm transition">🐦 X (Twitter)</a>
        </div>
      </div>*/}
    </motion.div>
  );
}
