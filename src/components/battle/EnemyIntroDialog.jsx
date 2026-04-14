import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnemyIntroDialog({ enemy, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const quote = enemy.intros[Math.floor(Math.random() * enemy.intros.length)];

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      if (i < quote.length) {
        setDisplayed(quote.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(iv);
      }
    }, 22);
    return () => clearInterval(iv);
  }, [quote]);

  const skip = () => { setDisplayed(quote); setDone(true); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.7, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.35 }}
        className="w-full max-w-sm bg-black border-4 border-red-500 rounded-2xl p-5 shadow-[0_0_40px_rgba(239,68,68,0.4)]"
      >
        {/* Enemy header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.span
            className="text-5xl"
            animate={{ y: [0, -6, 0], rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >{enemy.icon}</motion.span>
          <div>
            <div className={`font-bangers text-xl ${enemy.color}`} style={{ textShadow: "2px 2px 0 #000" }}>
              {enemy.name}
            </div>
            <div className="font-comic text-white/50 text-xs">{enemy.title}</div>
          </div>
          <div className="ml-auto bg-red-900/60 border border-red-500/40 rounded-lg px-2 py-1 text-center">
            <div className="font-bangers text-red-400 text-xs">HP</div>
            <div className="font-bangers text-white text-sm">{enemy.maxHp}</div>
          </div>
        </div>

        {/* Speech bubble */}
        <div
          className="relative bg-zinc-900 border-2 border-red-500/40 rounded-xl p-3 cursor-pointer mb-4"
          onClick={!done ? skip : undefined}
        >
          <div className="absolute -top-2 left-4 w-3 h-3 bg-zinc-900 border-l-2 border-t-2 border-red-500/40 rotate-45" />
          <p className="font-comic text-white text-sm leading-relaxed min-h-[2.5rem]">
            {displayed}
            {!done && (
              <motion.span
                className="inline-block w-0.5 h-3.5 bg-red-400 ml-0.5 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
            )}
          </p>
          {!done && <p className="text-white/30 text-xs mt-1 font-comic italic">toca para saltar...</p>}
        </div>

        {/* Start button */}
        <AnimatePresence>
          {done && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onDone}
              className="w-full font-bangers text-lg tracking-wider bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] transition-all"
            >
              ⚔️ ¡A PELEAR!
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}