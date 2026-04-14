import React from "react";
import { motion } from "framer-motion";

export default function BattleSummary({ stats, onContinue, label = "Siguiente ➡️" }) {
  const safeStats = {
    totalDamageDealt: 0,
    qtesSuccess: 0,
    qtesTotal: 0,
    porrosUsed: 0,
    ultimatesUsed: 0,
    turns: 0,
    ...(stats ?? {}),
  };

  const items = [
    { icon: "💥", label: "Daño total", value: safeStats.totalDamageDealt },
    { icon: "🛡️", label: "QTEs bloqueados", value: `${safeStats.qtesSuccess}/${safeStats.qtesTotal}` },
    { icon: "🌿", label: "Porros usados", value: safeStats.porrosUsed },
    { icon: "⚡", label: "Definitivas", value: safeStats.ultimatesUsed },
    { icon: "🔄", label: "Turnos", value: safeStats.turns },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-3 bg-black/70 border-2 border-yellow-400/30 rounded-xl p-3"
    >
      <div className="font-bangers text-yellow-400 text-sm tracking-wide mb-2 text-center">📊 RESUMEN DE BATALLA</div>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1.5"
          >
            <span className="text-base">{item.icon}</span>
            <div>
              <div className="font-comic text-white/50 leading-none" style={{ fontSize: 9 }}>{item.label}</div>
              <div className="font-bangers text-white text-sm leading-tight">{item.value}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="w-full font-bangers text-base bg-red-600 hover:bg-red-500 text-white py-2 rounded-xl border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.4)] transition-all"
      >
        {label}
      </motion.button>
    </motion.div>
  );
}