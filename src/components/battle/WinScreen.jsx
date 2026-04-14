import React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import SouthParkCharacter from "@/components/game/SouthParkCharacter";

export default function WinScreen({ battle, enemy, onRestart }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 0.6 }}
      className="flex flex-col items-center text-center py-6 px-2"
    >
      {/* Glow */}
      <div className="absolute w-40 h-40 rounded-full blur-2xl opacity-30 bg-yellow-400" />

      {/* Happy character */}
      <motion.div
        animate={{ rotate: [0, 6, -6, 0], y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="relative z-10"
      >
        <SouthParkCharacter emotion="happy" size={130} />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 font-bangers text-3xl md:text-5xl tracking-widest text-yellow-400"
        style={{ textShadow: "3px 3px 0 #000, 0 0 20px rgba(234,179,8,0.5)" }}
      >
        ¡HAS GANADO!
      </motion.h2>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5 }}
        className="h-1 w-48 rounded-full my-3 bg-yellow-400"
      />

      {/* Main message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white font-comic text-sm md:text-base max-w-sm leading-relaxed mb-1"
      >
        Has ganado la pelea contra el doblaje.
      </motion.p>

      {/* Happy birthday message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-yellow-300 font-bangers text-lg md:text-2xl tracking-wider"
        style={{ textShadow: "2px 2px 0 #000" }}
      >
        ¡Feliz Cumpleaños! 🎂
      </motion.p>

      {/* Stats */}
      {battle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 mt-4 mb-5"
        >
          <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
          <p className="text-yellow-300/90 font-comic text-xs italic">
            {battle.stats.totalDamageDealt} daño · {battle.stats.turns} turnos
          </p>
        </motion.div>
      )}

      {/* Restart */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={onRestart}
        className="flex items-center gap-2 font-bangers text-xl tracking-wider bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-3 rounded-xl border-4 border-black shadow-[5px_5px_0_0_rgba(0,0,0,0.4)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,0.4)] transition-all"
      >
        ¡OTRA VEZ!
      </motion.button>
    </motion.div>
  );
}