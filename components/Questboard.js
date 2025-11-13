/* import { useState, useEffect } from "react";

export default function Questboard() {
  const [quests, setQuests] = useState([]);
  const [profile, setProfile] = useState({ xp: 0, streak: 0, badges: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/quests").then(r => r.json()).then(d => setQuests(d.quests));
    fetch("/api/profile").then(r => r.json()).then(d => setProfile(d));
  }, []);

  const completeQuest = async (q) => {
    setLoading(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xpEarned: q.xp, questType: q.type }),
    });
    const updated = await fetch("/api/profile").then(r => r.json());
    setProfile(updated);
    setLoading(false);
  };

  return (
    <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-cyan-400 mb-4">🎮 Gamified Questboard 2.0</h2>

      {/* Profile *//*}
      <div className="mb-6 bg-[#101522] p-4 rounded-xl border border-gray-700">
        <p className="text-gray-300">XP: <span className="text-cyan-400 font-bold">{profile.xp}</span></p>
        <p className="text-gray-300">Streak: <span className="text-yellow-400 font-bold">{profile.streak} 🔥</span></p>
        {profile.badges?.length > 0 && (
          <p className="text-cyan-300 text-sm mt-2">🏅 Badges: {profile.badges.join(", ")}</p>
        )}
      </div>

      {/* Quests *//*}
      <div className="space-y-3">
        {quests.map((q) => (
          <div key={q.id} className="border border-gray-700 rounded-xl p-4 hover:border-cyan-600 transition">
            <h3 className="text-lg text-cyan-300 font-medium">{q.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{q.description}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-500">🏆 {q.xp} XP • {q.difficulty}</span>
              <button
                onClick={() => completeQuest(q)}
                disabled={loading}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  loading ? "bg-gray-700" : "bg-cyan-600 hover:bg-cyan-500 text-white"
                }`}
              >
                {loading ? "Processing..." : "Complete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
*/