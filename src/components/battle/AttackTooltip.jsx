import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AttackTooltip({ ability, children }) {
  const [show, setShow] = useState(false);

  const tags = [];
  if (ability.knockback) tags.push(`💨 Empuja ${ability.knockback.tiles} casillas`);
  if (ability.effect?.type === "stun") tags.push(`⭐ Aturde ${ability.effect.turns} turno${ability.effect.turns > 1 ? "s" : ""}`);
  if (ability.effect?.type === "poison") tags.push(`☠️ Veneno ${ability.effect.turns} turno${ability.effect.turns > 1 ? "s" : ""}`);
  if (ability.effect?.type === "slow") tags.push(`🐌 Ralentiza ${ability.effect.turns} turno${ability.effect.turns > 1 ? "s" : ""}`);
  if (ability.aoe === "all") tags.push("🌐 Golpea a todos");
  else if (ability.aoe?.length > 1) tags.push(`📐 AOE ${ability.aoe.length} casillas`);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow(true)}
      onTouchEnd={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-44 pointer-events-none"
          >
            <div className="bg-zinc-900 border-2 border-yellow-400/50 rounded-xl p-2.5 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <div className="font-bangers text-yellow-400 text-sm leading-tight mb-1">{ability.icon} {ability.name}</div>
              <p className="font-comic text-white/70 text-xs leading-snug mb-2">{ability.description}</p>
              <div className="flex flex-wrap gap-1">
                <span className="bg-red-900/60 text-red-300 font-bangers text-xs px-1.5 rounded">💥 {ability.damage} daño</span>
                <span className="bg-blue-900/60 text-blue-300 font-bangers text-xs px-1.5 rounded">🎯 R{ability.range}</span>
                {tags.map((t, i) => (
                  <span key={i} className="bg-purple-900/60 text-purple-300 font-comic text-xs px-1.5 rounded">{t}</span>
                ))}
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-900 border-r-2 border-b-2 border-yellow-400/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}