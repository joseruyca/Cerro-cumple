import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GRID_ROWS, GRID_COLS, posToKey, STATUS_LABELS } from "@/lib/battleData";
import SouthParkCharacter from "@/components/game/SouthParkCharacter";

function StatusBadges({ statuses }) {
  if (!statuses || statuses.length === 0) return null;
  return (
    <div className="flex gap-0.5 justify-center flex-wrap">
      {statuses.map((s, i) => {
        const info = STATUS_LABELS[s.type];
        return (
          <span key={i} className={`text-[10px] font-bangers ${info?.color} bg-black/60 px-1 rounded`} title={info?.label}>
            {info?.icon}{s.turns}
          </span>
        );
      })}
    </div>
  );
}

export default function BattleGrid({
  playerPos, enemyPos, playerEmotion, enemy,
  reachableTiles, abilityTargets,
  selectedAbility, onTileClick, phase,
  playerStatuses, enemyStatuses,
  floats, onFloatEnd,
  lastHitPos,
}) {
  const reachableKeys = new Set((reachableTiles || []).map(posToKey));
  const abilityKeys = new Set((abilityTargets && abilityTargets !== null ? abilityTargets : []).map(posToKey));
  const playerKey = posToKey(playerPos);
  const enemyKey = posToKey(enemyPos);
  const hitKey = lastHitPos ? posToKey(lastHitPos) : null;

  return (
    <div className="w-full relative select-none">
      <div className="absolute inset-0 pointer-events-none z-30">
        <AnimatePresence>
          {floats.map((f) => {
            const cellW = 100 / GRID_COLS;
            const cellH = 100 / GRID_ROWS;
            const left = `${f.pos.c * cellW + cellW / 2}%`;
            const top = `${f.pos.r * cellH}%`;
            const color =
              f.type === "heal" ? "text-green-400" :
              f.type === "ultimate" ? "text-purple-300" :
              f.type === "qte_success" ? "text-blue-300" :
              f.type === "poison" ? "text-lime-400" :
              f.type === "enemy" ? "text-red-400" : "text-yellow-300";

            return (
              <motion.div
                key={f.id}
                className={`absolute font-bangers text-lg pointer-events-none ${color} -translate-x-1/2`}
                style={{ left, top, textShadow: "2px 2px 0 #000" }}
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -38, scale: 1.25 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85 }}
                onAnimationComplete={() => onFloatEnd(f.id)}
              >
                {f.type === "heal" ? "+" : "-"}{f.value}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div
        className="grid gap-0.5 p-1"
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}
      >
        {Array.from({ length: GRID_ROWS }).map((_, r) =>
          Array.from({ length: GRID_COLS }).map((_, c) => {
            const key = posToKey({ r, c });
            const isPlayer = key === playerKey;
            const isEnemy = key === enemyKey;
            const isReachable = reachableKeys.has(key);
            const isAoeTarget = abilityKeys.has(key);
            const isHit = key === hitKey;
            const isClickable = (phase === "move" && isReachable) || (phase === "action" && selectedAbility && isAoeTarget && !isPlayer);

            return (
              <motion.div
                key={key}
                onClick={() => isClickable && onTileClick({ r, c })}
                animate={isHit ? { backgroundColor: ["rgba(239,68,68,0.6)", "rgba(239,68,68,0)", "rgba(239,68,68,0)"] } : {}}
                transition={isHit ? { duration: 0.4 } : {}}
                className={`relative flex flex-col items-center justify-end rounded-md border transition-all
                  ${isClickable ? "cursor-pointer hover:brightness-125" : "cursor-default"}
                  ${isPlayer ? "border-yellow-400 bg-yellow-400/15 shadow-[0_0_8px_rgba(234,179,8,0.5)]" :
                    isEnemy ? "border-red-500 bg-red-500/15 shadow-[0_0_8px_rgba(239,68,68,0.4)]" :
                    isAoeTarget ? "border-orange-400 bg-orange-400/25 shadow-[0_0_8px_rgba(251,146,60,0.6)] cursor-pointer" :
                    isReachable ? "border-blue-400/60 bg-blue-400/10 cursor-pointer" :
                    "border-white/10 bg-white/[0.03]"}
                `}
                style={{ height: "clamp(46px, 8.4vw, 72px)" }}
              >
                {isPlayer && (
                  <motion.div
                    layout
                    layoutId="player"
                    transition={{ type: "spring", stiffness: 250, damping: 22 }}
                    className="flex flex-col items-center gap-0 pb-0.5"
                  >
                    <StatusBadges statuses={playerStatuses} />
                    <SouthParkCharacter emotion={playerEmotion} size={34} />
                  </motion.div>
                )}

                {isEnemy && (
                  <motion.div
                    layout
                    layoutId="enemy"
                    transition={{ type: "spring", stiffness: 250, damping: 22 }}
                    className="flex flex-col items-center pb-0.5"
                  >
                    <StatusBadges statuses={enemyStatuses} />
                    <motion.span
                      className="text-xl md:text-2xl leading-none"
                      animate={phase === "enemy" ? { y: [0, -4, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                    >{enemy.icon}</motion.span>
                  </motion.div>
                )}

                {isReachable && !isPlayer && !isEnemy && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-blue-400/60 mb-1"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}

                {isAoeTarget && !isPlayer && !isEnemy && (
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-orange-400/70 mb-1"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  />
                )}

                <span className="absolute top-0.5 left-1 text-white/15 font-comic text-[7px]">
                  {r + 1},{c + 1}
                </span>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
