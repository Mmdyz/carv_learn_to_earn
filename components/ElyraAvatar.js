import { motion } from "framer-motion";

export default function ElyraAvatar({ isActive = false }) {
  return (
    <motion.div
      className="relative w-20 h-20 rounded-full overflow-hidden border border-cyan-500/40 shadow-lg"
      animate={{
        boxShadow: isActive
          ? [
              "0 0 10px rgba(34,211,238,0.6)",
              "0 0 25px rgba(34,211,238,0.9)",
              "0 0 10px rgba(34,211,238,0.6)",
            ]
          : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{
        duration: 2,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      <img
        src="/images/elyra.jpg"
        alt="Elyra AI Mentor"
        className="object-cover w-full h-full rounded-full"
      />
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full bg-cyan-400/10"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
}

