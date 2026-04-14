import React from "react";
import { motion } from "framer-motion";
import { PLAYER_TEMPLATE } from "@/lib/battleData";

function HPBar({ current, max, label, icon, color }) {
  const pct = Math.max(0, (current / max) * 100);
  const barColor = pct > 50 ? "bg-green-500" : pct > 25 ? "bg-yellow-500" : "bg-red-600";
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1 mb-0.5">
        <span className="text-sm">{icon}</span>
        <span className={`font-bangers text-xs ${color} tracking-wide`}>{label}</span>
        <span className="ml-auto font-bangers text-white text-xs">{current}/{max}</span>
      </div>
      <div className="h-2.5 bg-black/60 rounded-full border border-white/20 overflow-hidden">
        <motion.div className={`h-full rounded-full ${barColor}`}
          animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
      </div>
    </div>
  );
}

function SuperBar({ value }) {
  const ready = value >= 100;
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-comic text-xs text-white/50">SUPER</span>
      <div className="flex-1 h-2.5 bg-black/60 rounded-full border border-white/20 overflow-hidden min-w-[50px]">
        <motion.div
          className={`h-full rounded-full transition-colors ${ready ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" : "bg-purple-700"}`}
          animate={{ width: `${value}%` }} transition={{ duration: 0.3 }}
        />
      </div>
      {ready && (
        <motion.span className="font-bangers text-purple-300 text-xs" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>
          LISTO
        </motion.span>
      )}
    </div>
  );
}

export default function BattleHUD({ playerHp, enemyHp, enemy, phase, superMeter, porroUses, turn_number }) {
  const phaseLabel = {
    move: { text: "📍 MOVER", color: "text-blue-400 border-blue-400" },
    action: { text: "⚔️ ACCIÓN", color: "text-yellow-400 border-yellow-400" },
    enemy: { text: `${enemy.icon} ENEMIGO`, color: "text-red-400 border-red-400" },
    qte: { text: "⚡ QTE!", color: "text-purple-400 border-purple-400 animate-pulse" },
    win: { text: "🏆 VICTORIA", color: "text-green-400 border-green-400" },
    lose: { text: "💀 DERROTA", color: "text-red-600 border-red-600" },
  }[phase] || { text: phase, color: "text-white/50" };

  return (
    <div className="w-full bg-black/85 border-2 border-white/15 rounded-xl p-2.5 space-y-2">
      <div className="flex items-center gap-2">
        <HPBar current={playerHp} max={PLAYER_TEMPLATE.maxHp} label="CERRO" icon="🎂" color="text-yellow-400" />
        <div className="w-px bg-white/20 self-stretch mx-1" />
        <HPBar current={enemyHp} max={enemy.maxHp} label={enemy.name.split(" ")[0].toUpperCase()} icon={enemy.icon} color={enemy.color} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <SuperBar value={superMeter} />
        <div className={`font-bangers text-xs px-2 py-0.5 rounded-full border ${phaseLabel.color} ml-auto`}>
          {phaseLabel.text}
        </div>
        <span className="font-comic text-white/30 text-xs">T{turn_number}</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-white/40 font-comic text-xs">🌿</span>
        {Array.from({ length: PLAYER_TEMPLATE.heal.maxUses }).map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full border ${i < PLAYER_TEMPLATE.heal.maxUses - porroUses ? "bg-green-500 border-green-400" : "bg-black/40 border-white/20"}`} />
        ))}
        <span className="text-white/30 font-comic text-xs ml-1">{PLAYER_TEMPLATE.heal.maxUses - porroUses} left</span>
      </div>
    </div>
  );
}