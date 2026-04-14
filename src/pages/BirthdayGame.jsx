import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import SouthParkCharacter from "@/components/game/SouthParkCharacter";
import BattleGrid from "@/components/battle/BattleGrid";
import BattleHUD from "@/components/battle/BattleHUD";
import BattleActions from "@/components/battle/BattleActions";
import BattleLog from "@/components/battle/BattleLog";
import QTEOverlay from "@/components/battle/QTEOverlay";
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

        {phase === "qte" && <QTEOverlay onResult={handlers.qte} />}
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

function EndScreen({ type, onRestart, onBackToTitle }) {
  const isWin = type === "win";

  return (
    <div className="flex-1 flex items-center justify-center px-3 py-6">
      <div className={`w-full max-w-lg rounded-2xl border-4 p-6 text-center shadow-[8px_8px_0_0_rgba(0,0,0,0.35)] ${isWin ? "border-yellow-400 bg-gradient-to-b from-yellow-300 to-orange-300" : "border-red-600 bg-gradient-to-b from-red-400 to-red-600"}`}>
        <h2 className="font-bangers text-4xl text-black" style={{ textShadow: "2px 2px 0 rgba(255,255,255,0.35)" }}>
          {isWin ? "¡Felicidades!" : "¡Has perdido!"}
        </h2>

        <p className="mt-4 font-bangers text-2xl text-black">
          {isWin ? "Has derrotado al doblaje" : "El doblaje te ha vencido"}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          {isWin ? (
            <button
              onClick={onBackToTitle}
              className="font-bangers text-xl tracking-wide bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-2xl border-4 border-black"
            >
              Volver al inicio
            </button>
          ) : (
            <button
              onClick={onRestart}
              className="font-bangers text-xl tracking-wide bg-black hover:bg-zinc-800 text-white px-6 py-3 rounded-2xl border-4 border-white"
            >
              Volver a intentar la pelea
            </button>
          )}
        </div>
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
  const musicStartedRef = useRef(false);
  const playedEndSoundRef = useRef(null);

  const { playSound, startBgMusic, stopBgMusic } = useSoundEffects();

  const clearAllTimers = useCallback(() => {
    if (enemyTimerRef.current) {
      clearTimeout(enemyTimerRef.current);
      enemyTimerRef.current = null;
    }
  }, []);

  const createBattleState = useCallback(() => {
    const boss = createFinalBoss();
    setCurrentBoss(boss);
    setBattle(initBattle(boss));
    setSelectedAbility(null);
    setScreen("battle");
    playedEndSoundRef.current = null;
  }, []);

  const startGame = useCallback(() => {
    clearAllTimers();
    createBattleState();

    if (!musicStartedRef.current) {
      startBgMusic();
      musicStartedRef.current = true;
    }
  }, [clearAllTimers, createBattleState, startBgMusic]);

  const restartBattle = useCallback(() => {
    clearAllTimers();
    createBattleState();

    if (!musicStartedRef.current) {
      startBgMusic();
      musicStartedRef.current = true;
    }
  }, [clearAllTimers, createBattleState, startBgMusic]);

  const backToTitle = useCallback(() => {
    clearAllTimers();
    setSelectedAbility(null);
    setBattle(null);
    setCurrentBoss(null);
    setScreen("title");
    stopBgMusic();
    musicStartedRef.current = false;
    playedEndSoundRef.current = null;
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

      if (playedEndSoundRef.current !== battle.phase) {
        playedEndSoundRef.current = battle.phase;
        playSound(battle.phase === "win" ? "victory" : "defeat", 0.7);
      }
      return;
    }

    if (enemyTimerRef.current) {
      clearTimeout(enemyTimerRef.current);
      enemyTimerRef.current = null;
    }
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

  const isBattleActive = screen === "battle" && battle && currentBoss && battle.phase !== "win" && battle.phase !== "lose";
  const isWin = screen === "battle" && battle && currentBoss && battle.phase === "win";
  const isLose = screen === "battle" && battle && currentBoss && battle.phase === "lose";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-b from-cyan-400 to-blue-500">
      {screen === "title" && <TitleScreen onStart={startGame} />}

      {isBattleActive && (
        <div className="flex-1 flex flex-col px-2 py-2 md:px-3 md:py-3 max-w-lg mx-auto w-full">
          <div className="flex items-center justify-between mb-1.5 shrink-0">
            <h2 className="font-bangers text-base text-yellow-400" style={{ textShadow: "2px 2px 0 #000" }}>
              🎂 Cumpleaños de Cerro
            </h2>
            <span className="font-comic text-white/30 text-xs">⚠️ JEFE FINAL</span>
          </div>

          <BattleScreen battle={battle} enemy={currentBoss} selectedAbility={selectedAbility} handlers={handlers} />

          <p className="text-center font-comic text-xs text-white/15 mt-2 shrink-0">South Park Tactics™</p>
        </div>
      )}

      {isWin && <EndScreen type="win" onRestart={restartBattle} onBackToTitle={backToTitle} />}
      {isLose && <EndScreen type="lose" onRestart={restartBattle} onBackToTitle={backToTitle} />}
    </div>
  );
}
