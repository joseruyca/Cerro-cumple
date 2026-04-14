import React from "react";
import { motion } from "framer-motion";
import SouthParkCharacter from "@/components/game/SouthParkCharacter";

export default function LoseScreen({ battle, enemy, onRestart }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 0.6 }}
      className="flex flex-col items-center text-center py-6 px-2"
    >
      {/* Glow */}
      <div className="absolute w-40 h-40 rounded-full blur-2xl opacity-30 bg-red-600" />

      {/* Dead character */}
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="relative z-10"
      >
        <SouthParkCharacter emotion="dead" size={130} />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 font-bangers text-3xl md:text-5xl tracking-widest text-red-500"
        style={{ textShadow: "3px 3px 0 #000, 0 0 20px rgba(239,68,68,0.5)" }}
      >
        ¡HAS PERDIDO!
      </motion.h2>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5 }}
        className="h-1 w-48 rounded-full my-3 bg-red-500"
      />

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white font-comic text-sm md:text-base max-w-sm leading-relaxed mb-2"
      >
        El doblaje fue demasiado forzado. No pudiste resistir más.
      </motion.p>

      {/* Restart */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={onRestart}
        className="flex items-center gap-2 font-bangers text-xl tracking-wider bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl border-4 border-black shadow-[5px_5px_0_0_rgba(0,0,0,0.4)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,0.4)] transition-all mt-6"
      >
        INTENTAR DE NUEVO
      </motion.button>
    </motion.div>
  );
}