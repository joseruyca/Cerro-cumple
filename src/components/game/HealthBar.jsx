import React from "react";
import { motion } from "framer-motion";

export default function HealthBar({ health, drunkLevel = 0 }) {
  const getHealthColor = () => {
    if (health > 70) return "bg-emerald-500";
    if (health > 40) return "bg-yellow-400";
    if (health > 20) return "bg-orange-500";
    return "bg-red-600";
  };

  const getHealthEmoji = () => {
    if (health > 70) return "❤️";
    if (health > 40) return "🧡";
    if (health > 20) return "💛";
    return "💀";
  };

  return (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {/* Health */}
      <div className="flex items-center gap-1.5 bg-black/80 border-2 border-red-500 rounded-full px-3 py-1.5 shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]">
        <motion.span
          animate={health < 30 ? { scale: [1, 1.3, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="text-sm"
        >
          {getHealthEmoji()}
        </motion.span>
        <div className="w-16 md:w-20 h-2.5 bg-gray-800 rounded-full overflow-hidden border border-black/50">
          <motion.div
            className={`h-full rounded-full ${getHealthColor()}`}
            animate={{ width: `${Math.max(0, health)}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <span className="text-white font-bangers text-xs tracking-wide">{health}%</span>
      </div>

      {/* Drunk */}
      {drunkLevel > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-1.5 bg-black/80 border-2 border-purple-500 rounded-full px-3 py-1.5 shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]"
        >
          <span className="text-sm">🍺</span>
          <div className="w-12 md:w-16 h-2.5 bg-gray-800 rounded-full overflow-hidden border border-black/50">
            <motion.div
              className="h-full rounded-full bg-purple-500"
              animate={{ width: `${Math.min(100, drunkLevel)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}