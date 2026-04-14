import React from "react";
import { motion } from "framer-motion";
import { RotateCcw, Trophy } from "lucide-react";
import SouthParkCharacter from "./SouthParkCharacter";

export default function GameOverScreen({ ending, onRestart }) {
  const isGood = ending?.type === "good";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 0.6 }}
      className="flex flex-col items-center text-center py-6 px-2"
    >
      {/* Glow behind character */}
      <div
        className={`absolute w-40 h-40 rounded-full blur-2xl opacity-30 ${
          isGood ? "bg-yellow-400" : "bg-red-600"
        }`}
      />

      <motion.div
        animate={
          isGood
            ? { rotate: [0, 6, -6, 0], y: [0, -8, 0] }
            : { y: [0, 4, 0] }
        }
        transition={{ repeat: Infinity, duration: isGood ? 2 : 3 }}
        className="relative z-10"
      >
        <SouthParkCharacter emotion={isGood ? "happy" : ending?.emotion || "dead"} size={130} />
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 relative"
      >
        <h2
          className={`font-bangers text-3xl md:text-5xl tracking-widest ${
            isGood ? "text-yellow-400" : "text-red-500"
          }`}
          style={{
            textShadow: isGood
              ? "3px 3px 0 #000, 0 0 20px rgba(234,179,8,0.5)"
              : "3px 3px 0 #000, 0 0 20px rgba(239,68,68,0.5)",
          }}
        >
          {ending?.title || "GAME OVER"}
        </h2>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5 }}
        className={`h-1 w-48 rounded-full my-3 ${isGood ? "bg-yellow-400" : "bg-red-500"}`}
      />

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white font-comic text-sm md:text-base max-w-sm leading-relaxed mb-2"
      >
        {ending?.message}
      </motion.p>

      {/* Achievement */}
      {ending?.subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 mt-2 mb-5"
        >
          <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
          <p className="text-yellow-300/90 font-comic text-xs italic">{ending.subtitle}</p>
        </motion.div>
      )}

      {/* Restart */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={onRestart}
        className="flex items-center gap-2 font-bangers text-xl tracking-wider bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-3 rounded-xl border-4 border-black shadow-[5px_5px_0_0_rgba(0,0,0,0.4)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,0.4)] transition-all"
      >
        <RotateCcw className="w-5 h-5" />
        ¡OTRA VEZ!
      </motion.button>
    </motion.div>
  );
}