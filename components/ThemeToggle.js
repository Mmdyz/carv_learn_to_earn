import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // uses lucide-react icons (already in shadcn stack)

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  // Load theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = systemDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.classList.toggle("dark", systemDark);
    }
  }, []);

  // Toggle between themes
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 hover:border-cyan-400 transition-all duration-300 bg-[#0b0f19]/60 hover:bg-[#0b0f19]/90 backdrop-blur-md"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun size={18} className="text-yellow-400 transition-all duration-300" />
      ) : (
        <Moon size={18} className="text-cyan-400 transition-all duration-300" />
      )}
    </button>
  );
}
