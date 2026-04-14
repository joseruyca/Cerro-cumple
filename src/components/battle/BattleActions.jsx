import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PLAYER_TEMPLATE } from "@/lib/battleData";
import AttackTooltip from "@/components/battle/AttackTooltip";

const TABS = [
  { id: "attack", label: "⚔️ Atacar" },
  { id: "move", label: "👟 Mover" },
  { id: "heal", label: "💨 Curar" },
];

export default function BattleActions({
  phase, onSelectAbility, onSkipMove, onHeal, onUltimate,
  selectedAbility, superMeter, porroUses, playerMoved, playerActed,
}) {
  const [tab, setTab] = useState("attack");
  const porroLeft = PLAYER_TEMPLATE.heal.maxUses - porroUses;
  const superReady = superMeter >= 100;
  const isMovPhase = phase === "move";
  const isActPhase = phase === "action";
  const disabled = !isMovPhase && !isActPhase;

  return (
    <div className="w-full bg-black/90 border-2 border-yellow-400/30 rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => !disabled && setTab(t.id)}
            className={`flex-1 py-1.5 font-bangers text-xs tracking-wide transition-colors
              ${tab === t.id && !disabled ? "bg-white/10 text-yellow-400 border-b-2 border-yellow-400" : "text-white/40 hover:text-white/60"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-2.5 min-h-[110px]">
        <AnimatePresence mode="wait">

          {/* ATTACK TAB */}
          {tab === "attack" && (
            <motion.div key="atk" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-1.5">
              {isMovPhase && (
                <p className="text-yellow-400/60 font-comic text-xs text-center">📍 Primero moví a Cerro (o saltá el movimiento)</p>
              )}

              {/* 3 ataques en grid de 3 columnas */}
              <div className="grid grid-cols-3 gap-1.5">
                {PLAYER_TEMPLATE.abilities.map((ab) => {
                  const active = isActPhase && !playerActed;
                  const selected = selectedAbility?.id === ab.id;
                  return (
                    <AttackTooltip key={ab.id} ability={ab}>
                      <motion.button
                        whileHover={active ? { scale: 1.04, y: -1 } : {}}
                        whileTap={active ? { scale: 0.95 } : {}}
                        disabled={!active}
                        onClick={() => onSelectAbility(ab)}
                        className={`w-full flex flex-col items-center gap-1 px-1.5 py-2 rounded-xl border-2 text-center transition-all
                          ${selected ? "ring-2 ring-yellow-400 ring-offset-1 ring-offset-black border-yellow-400" : "border-black/50"}
                          ${!active ? "opacity-40 cursor-not-allowed bg-gray-800 text-white/30" :
                            `bg-gradient-to-b ${ab.color} text-white shadow-[2px_3px_0_0_rgba(0,0,0,0.5)]`}`}>
                        <span className="text-xl leading-none">{ab.icon}</span>
                        <div className="font-bangers text-xs leading-tight w-full truncate">{ab.name}</div>
                        <div className="font-comic text-white/60 leading-tight" style={{ fontSize: 8 }}>
                          {ab.damage}💥 R{ab.range}{ab.knockback ? ` KB${ab.knockback.tiles}` : ""}
                        </div>
                      </motion.button>
                    </AttackTooltip>
                  );
                })}
              </div>

              {/* Ultimate */}
              <motion.button
                whileHover={superReady && isActPhase && !playerActed ? { scale: 1.02, y: -1 } : {}}
                whileTap={superReady && isActPhase && !playerActed ? { scale: 0.97 } : {}}
                disabled={!superReady || !isActPhase || playerActed}
                onClick={() => onUltimate()}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all
                  ${superReady && isActPhase && !playerActed
                    ? "bg-gradient-to-r from-green-700 via-emerald-600 to-red-700 text-white border-green-400 shadow-[0_0_16px_rgba(74,222,128,0.5)]"
                    : "bg-gray-800 opacity-40 cursor-not-allowed text-white/40 border-black/50"}`}>
                <motion.span
                  className="text-xl shrink-0"
                  animate={superReady ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  {PLAYER_TEMPLATE.ultimate.icon}
                </motion.span>
                <div className="min-w-0 text-left flex-1">
                  <div className="font-bangers text-sm truncate leading-tight">{PLAYER_TEMPLATE.ultimate.name}</div>
                  <div className="font-comic leading-tight" style={{ fontSize: 9, color: "rgba(255,255,255,0.6)" }}>
                    {superReady ? `${PLAYER_TEMPLATE.ultimate.damage} dmg · TODOS · KB3 · STUN x2` : `⚡ Super: ${superMeter}/100`}
                  </div>
                </div>
                {superReady && (
                  <span className="font-bangers text-xs text-yellow-300 shrink-0 animate-pulse">LISTO</span>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* MOVE TAB */}
          {tab === "move" && (
            <motion.div key="mov" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <p className="text-white/60 font-comic text-xs">
                  {isMovPhase
                    ? `🔵 Clickeá una casilla azul (rango ${PLAYER_TEMPLATE.moveRange})`
                    : playerMoved
                    ? "✅ Movimiento completado"
                    : "⏳ Esperá tu turno"}
                </p>
              </div>
              {isMovPhase && !playerMoved && (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={onSkipMove}
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bangers text-sm py-2.5 rounded-xl border-2 border-slate-500 shadow-[2px_2px_0_0_rgba(0,0,0,0.4)] transition-all">
                  ⏭️ Saltar Movimiento
                </motion.button>
              )}
            </motion.div>
          )}

          {/* HEAL TAB */}
          {tab === "heal" && (
            <motion.div key="heal" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
              {/* Porro counter */}
              <div className="flex justify-center gap-1.5">
                {Array.from({ length: PLAYER_TEMPLATE.heal.maxUses }).map((_, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition-all
                    ${i < porroLeft ? "bg-green-500 border-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]" : "bg-black/40 border-white/20"}`}>
                    {i < porroLeft ? "💨" : "✗"}
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={porroLeft > 0 && isActPhase && !playerActed ? { scale: 1.02 } : {}}
                whileTap={porroLeft > 0 && isActPhase && !playerActed ? { scale: 0.97 } : {}}
                disabled={porroLeft <= 0 || !isActPhase || playerActed}
                onClick={onHeal}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-black/50 text-left transition-all
                  ${porroLeft > 0 && isActPhase && !playerActed
                    ? "bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-[2px_2px_0_0_rgba(0,0,0,0.4)] border-green-600"
                    : "bg-gray-800 opacity-40 cursor-not-allowed text-white/40"}`}>
                <span className="text-xl">💨</span>
                <div>
                  <div className="font-bangers text-sm">{PLAYER_TEMPLATE.heal.name}</div>
                  <div className="font-comic text-white/60" style={{ fontSize: 9 }}>
                    +{PLAYER_TEMPLATE.heal.heal} HP · {porroLeft} porro{porroLeft !== 1 ? "s" : ""} restante{porroLeft !== 1 ? "s" : ""}
                  </div>
                </div>
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}