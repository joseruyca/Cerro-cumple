import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import SouthParkCharacter from "@/components/game/SouthParkCharacter";
import BattleGrid from "@/components/battle/BattleGrid";
import BattleHUD from "@/components/battle/BattleHUD";
import BattleActions from "@/components/battle/BattleActions";
import BattleLog from "@/components/battle/BattleLog";
import QTEOverlay from "@/components/battle/QTEOverlay";
import BattleSummary from "@/components/battle/BattleSummary";
import { PLAYER_TEMPLATE, ENEMIES } from "@/lib/battleData";
import {
  initBattle,
  playerMove,
  skipMove,
  playerAttack,
  playerUltimate,
  playerHeal,
  doEnemyTurn,
  resolveQte,
  removeFloat,
  getAoeTargets,
  getReachableTiles,
} from "@/lib/battleEngine";

const FALLBACK_STATS = {
  totalDamageDealt: 0,
  qtesSuccess: 0,
  qtesTotal: 0,
  porrosUsed: 0,
  ultimatesUsed: 0,
  turns: 0,
};

const FINAL_BOSS_TEMPLATE = ENEMIES.find((enemy) => enemy.id === "maestro_doblaje") ?? ENEMIES[0];
const FINAL_BOSS_HP = 120;

function createFinalBoss() {
  return {
    ...FINAL_BOSS_TEMPLATE,
    maxHp: FINAL_BOSS_HP,
  };
}

function TitleScreen({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 relative overflow-hidden">
      {["🎂", "💀", "🍺", "🎈", "💥", "🌿", "🔪", "🎉"].map((emoji, index) => (
        <motion.span
          key={index}
          className="absolute text-2xl pointer-events-none select-none"
          style={{ left: `${5 + index * 12}%`, bottom: "8%" }}
          animate={{ y: [0, -80, -160], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, delay: index * 0.4, ease: "easeOut" }}
        >
          {emoji}
        </motion.span>
      ))}

      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="mb-3">
        <SouthParkCharacter emotion="happy" size={130} />
      </motion.div>

      <div className="text-center relative z-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
          <h1
            className="font-bangers text-4xl md:text-6xl text-yellow-400 leading-none"
            style={{ textShadow: "4px 4px 0 #000, 0 0 30px rgba(234,179,8,0.4)" }}
          >
            ¡FELIZ CUMPLEAÑOS
          </h1>
          <h1
            className="font-bangers text-6xl md:text-8xl text-red-500 leading-none"
            style={{ textShadow: "5px 5px 0 #000, 0 0 40px rgba(239,68,68,0.5)" }}
          >
            CERRO!
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mt-5">
          <motion.button
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="font-bangers text-2xl tracking-widest bg-red-600 hover:bg-red-500 text-white px-10 py-3 rounded-2xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,0.5)] transition-all flex items-center gap-3 mx-auto"
          >
            <Play className="w-6 h-6 fill-white" />
            ¡A PELEAR!
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

function BattleScreen({ battle, enemy, selectedAbility, handlers }) {
  const { phase, playerPos, enemyPos } = battle;

  const reachableTiles = phase === "move" && !battle.playerMoved
    ? getReachableTiles(playerPos, PLAYER_TEMPLATE.moveRange, [enemyPos])
    : [];

  const abilityTargets = phase === "action" && selectedAbility
    ? selectedAbility.aoe === "all"
      ? [enemyPos]
      : getAoeTargets(selectedAbility, enemyPos) || []
    : [];

  const playerEmotion = battle.playerHp < 25
    ? "dead"
    : battle.superMeter >= 100
      ? "angry"
      : phase === "enemy"
        ? "shocked"
        : "happy";

  return (
    <div className="flex flex-col gap-2 w-full">
      <BattleHUD
        playerHp={battle.playerHp}
        enemyHp={battle.enemyHp}
        enemy={enemy}
        phase={phase}
        superMeter={battle.superMeter}
        porroUses={battle.porroUses}
        turn_number={battle.turn_number}
      />

      <div className={`relative w-full rounded-2xl border-4 border-black bg-gradient-to-b ${enemy.bgColor} overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-0" />

        <div className="relative z-10 pt-6 pb-1 px-1">
          <BattleGrid
            playerPos={playerPos}
            enemyPos={enemyPos}
            playerEmotion={playerEmotion}
            enemy={enemy}
            isPlayerTurn={phase !== "enemy"}
            reachableTiles={reachableTiles}
            abilityTargets={abilityTargets}
            selectedAbility={selectedAbility}
            onTileClick={handlers.tileClick}
            phase={phase}
            playerStatuses={battle.playerStatuses}
            enemyStatuses={battle.enemyStatuses}
            floats={battle.floats}
            onFloatEnd={handlers.floatEnd}
            lastHitPos={battle.lastHitPos}
          />
        </div>

        <AnimatePresence>{phase === "qte" && <QTEOverlay onResult={handlers.qte} />}</AnimatePresence>
      </div>

      <BattleLog messages={battle.log} />

      {(phase === "move" || phase === "action") && (
        <BattleActions
          phase={phase}
          onSelectAbility={handlers.selectAbility}
          onSkipMove={handlers.skipMove}
          onHeal={handlers.heal}
          onUltimate={handlers.ultimate}
          selectedAbility={selectedAbility}
          superMeter={battle.superMeter}
          porroUses={battle.porroUses}
          playerPos={playerPos}
          enemyPos={enemyPos}
          playerMoved={battle.playerMoved}
          playerActed={battle.playerActed}
        />
      )}

      {phase === "enemy" && (
        <div className="text-center py-2">
          <motion.p
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 0.7 }}
            className="font-bangers text-red-400 text-base tracking-wide"
          >
            {enemy.icon} {enemy.name} está pensando...
          </motion.p>
        </div>
      )}
    </div>
  );
}

function EndScreen({ type, battle, onRestart }) {
  const stats = battle?.stats ?? FALLBACK_STATS;
  const isWin = type === "win";

  return (
    <div
      className={`rounded-2xl border-4 overflow-hidden ${
        isWin
          ? "border-yellow-400 bg-gradient-to-b from-yellow-900 via-yellow-800 to-orange-900"
          : "border-red-600 bg-gradient-to-b from-slate-900 to-zinc-900"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.45 }}
        className="relative flex flex-col items-center text-center py-6 px-4"
      >
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 blur-3xl ${
            isWin ? "bg-yellow-300" : "bg-red-500"
          }`}
        />

        <motion.div
          animate={isWin ? { rotate: [0, 15, -15, 0], y: [0, -12, 0] } : { y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: isWin ? 1.5 : 3 }}
          className="relative z-10"
        >
          <SouthParkCharacter emotion={isWin ? "happy" : "dead"} size={isWin ? 110 : 100} />
        </motion.div>

        <h2
          className={`font-bangers mt-4 ${isWin ? "text-4xl text-yellow-300" : "text-3xl text-red-500"}`}
          style={{ textShadow: "3px 3px 0 #000" }}
        >
          {isWin ? "¡HAS GANADO!" : "¡HAS PERDIDO!"}
        </h2>

        <p
          className={`font-bangers mt-3 ${isWin ? "text-2xl text-yellow-400" : "text-xl text-red-400 mt-2"}`}
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          {isWin ? "¡Feliz Cumpleaños Cerro! 🎂" : "El doblaje español te derrotó"}
        </p>

        <p className={`font-comic max-w-xs leading-relaxed mt-3 ${isWin ? "text-white/80 text-sm" : "text-white/70 text-sm"}`}>
          {isWin
            ? "Venciste al Maestro del Doblaje y sus acentos forzados. ¡Eres una leyenda!"
            : "El Maestro del Doblaje ganó. Sus acentos forzados y respiraciones innecesarias fueron demasiado."}
        </p>
      </motion.div>

      <div className="px-3 pb-3">
        <BattleSummary
          stats={stats}
          onContinue={onRestart}
          label={isWin ? "🎉 Volver al inicio" : "🔄 REVANCHA"}
        />
      </div>
    </div>
  );
}

export default function BirthdayGame() {
  const [screen, setScreen] = useState("title");
  const [battle, setBattle] = useState(null);
  const [currentBoss, setCurrentBoss] = useState(null);
  const [selectedAbility, setSelectedAbility] = useState(null);

  const enemyTimerRef = useRef(null);
  const finishTimerRef = useRef(null);
  const musicStartedRef = useRef(false);

  const { playSound, startBgMusic, stopBgMusic } = useSoundEffects();

  const endState = useMemo(() => {
    if (!battle) return null;
    if (battle.phase === "win") return "win";
    if (battle.phase === "lose") return "lose";
    return null;
  }, [battle]);

  const clearAllTimers = useCallback(() => {
    if (enemyTimerRef.current) {
      clearTimeout(enemyTimerRef.current);
      enemyTimerRef.current = null;
    }
    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
  }, []);

  const startGame = useCallback(() => {
    clearAllTimers();
    const boss = createFinalBoss();
    setCurrentBoss(boss);
    setBattle(initBattle(boss));
    setSelectedAbility(null);
    setScreen("battle");

    if (!musicStartedRef.current) {
      startBgMusic();
      musicStartedRef.current = true;
    }
  }, [clearAllTimers, startBgMusic]);

  const restart = useCallback(() => {
    clearAllTimers();
    setSelectedAbility(null);
    setBattle(null);
    setCurrentBoss(null);
    setScreen("title");
    stopBgMusic();
    musicStartedRef.current = false;
  }, [clearAllTimers, stopBgMusic]);

  useEffect(() => {
    return () => {
      clearAllTimers();
      stopBgMusic();
      musicStartedRef.current = false;
    };
  }, [clearAllTimers, stopBgMusic]);

  useEffect(() => {
    if (!battle || !currentBoss) {
      clearAllTimers();
      return;
    }

    if (battle.phase === "enemy") {
      enemyTimerRef.current = setTimeout(() => {
        setBattle((previous) => {
          if (!previous || previous.phase !== "enemy") return previous;
          return doEnemyTurn(previous, currentBoss, () => playSound("attack", 0.6));
        });
      }, 1000);
      return () => {
        if (enemyTimerRef.current) {
          clearTimeout(enemyTimerRef.current);
          enemyTimerRef.current = null;
        }
      };
    }

    if (battle.phase === "win" || battle.phase === "lose") {
      clearAllTimers();
      stopBgMusic();
      musicStartedRef.current = false;
      playSound(battle.phase === "win" ? "victory" : "defeat", 0.7);
      finishTimerRef.current = setTimeout(() => {
        setScreen(battle.phase);
      }, 120);
      return () => {
        if (finishTimerRef.current) {
          clearTimeout(finishTimerRef.current);
          finishTimerRef.current = null;
        }
      };
    }

    if (enemyTimerRef.current) {
      clearTimeout(enemyTimerRef.current);
      enemyTimerRef.current = null;
    }

    return undefined;
  }, [battle, currentBoss, clearAllTimers, playSound, stopBgMusic]);

  const handleTileClick = useCallback((position) => {
    setBattle((previous) => {
      if (!previous || !currentBoss) return previous;

      if (previous.phase === "move" && !previous.playerMoved) {
        return playerMove(previous, position);
      }

      if (previous.phase === "action" && selectedAbility) {
        playSound("attack", 0.6);
        return playerAttack(previous, selectedAbility, position, currentBoss);
      }

      return previous;
    });

    if (selectedAbility) {
      setSelectedAbility(null);
    }
  }, [currentBoss, playSound, selectedAbility]);

  const handlers = useMemo(() => ({
    tileClick: handleTileClick,
    selectAbility: (ability) => {
      setSelectedAbility((previous) => (previous?.id === ability.id ? null : ability));
    },
    skipMove: () => {
      setSelectedAbility(null);
      setBattle((previous) => (previous ? skipMove(previous) : previous));
    },
    heal: () => {
      playSound("heal", 0.6);
      setSelectedAbility(null);
      setBattle((previous) => (previous ? playerHeal(previous) : previous));
    },
    ultimate: () => {
      playSound("ultimate", 0.8);
      setSelectedAbility(null);
      setBattle((previous) => (previous && currentBoss ? playerUltimate(previous, currentBoss) : previous));
    },
    qte: (success) => {
      if (success) {
        playSound("qte", 0.7);
      }
      setBattle((previous) => (previous ? resolveQte(previous, success) : previous));
    },
    floatEnd: (id) => {
      setBattle((previous) => (previous ? removeFloat(previous, id) : previous));
    },
  }), [currentBoss, handleTileClick, playSound]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-b from-cyan-400 to-blue-500">
      <AnimatePresence mode="wait">
        {screen === "title" && (
          <motion.div key="title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
            <TitleScreen onStart={startGame} />
          </motion.div>
        )}

        {screen === "battle" && battle && currentBoss && !endState && (
          <motion.div
            key="battle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col px-2 py-2 md:px-3 md:py-3 max-w-lg mx-auto w-full"
          >
            <div className="flex items-center justify-between mb-1.5 shrink-0">
              <h2 className="font-bangers text-base text-yellow-400" style={{ textShadow: "2px 2px 0 #000" }}>
                🎂 Cumpleaños de Cerro
              </h2>
              <span className="font-comic text-white/30 text-xs">⚠️ JEFE FINAL</span>
            </div>

            <BattleScreen battle={battle} enemy={currentBoss} selectedAbility={selectedAbility} handlers={handlers} />

            <p className="text-center font-comic text-xs text-white/15 mt-2 shrink-0">South Park Tactics™</p>
          </motion.div>
        )}

        {screen === "win" && battle && currentBoss && (
          <motion.div
            key="win"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-center px-2 py-4 md:px-3 max-w-lg mx-auto w-full"
          >
            <EndScreen type="win" battle={battle} onRestart={restart} />
          </motion.div>
        )}

        {screen === "lose" && battle && currentBoss && (
          <motion.div
            key="lose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-center px-2 py-4 md:px-3 max-w-lg mx-auto w-full"
          >
            <EndScreen type="lose" battle={battle} onRestart={restart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
