import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const BG_CONFIGS = {
  sky: {
    gradient: "from-sky-500 via-sky-300 to-emerald-400",
    ground: "bg-emerald-600 border-t-4 border-emerald-800",
  },
  party: {
    gradient: "from-purple-700 via-fuchsia-600 to-pink-500",
    ground: "bg-amber-800 border-t-4 border-amber-900",
  },
  hell: {
    gradient: "from-red-950 via-red-800 to-orange-700",
    ground: "bg-red-900 border-t-4 border-red-700",
  },
  hospital: {
    gradient: "from-slate-200 via-white to-slate-100",
    ground: "bg-slate-300 border-t-2 border-slate-400",
  },
  graveyard: {
    gradient: "from-slate-900 via-slate-800 to-zinc-900",
    ground: "bg-zinc-700 border-t-4 border-zinc-600",
  },
};

function PartyDecorations() {
  return (
    <>
      {["🎈", "🎊", "🎉", "✨", "🎈"].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl md:text-3xl pointer-events-none"
          style={{ left: `${10 + i * 20}%`, top: `${5 + (i % 2) * 12}%` }}
          animate={{ y: [0, -12, 0], rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2 + i * 0.4, delay: i * 0.3 }}
        >
          {emoji}
        </motion.div>
      ))}
      {/* Confetti dots */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`c${i}`}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 60 + 5}%`,
            background: ["#F87171", "#FBBF24", "#34D399", "#60A5FA", "#C084FC"][i % 5],
          }}
          animate={{ y: [0, 15, 0], opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 + i * 0.2, delay: i * 0.15 }}
        />
      ))}
    </>
  );
}

function HellDecorations() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-16 pointer-events-none"
          style={{ left: `${10 + i * 18}%` }}
          animate={{ scaleY: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 0.8 + i * 0.2 }}
        >
          <div className="w-4 h-8 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-300 rounded-full opacity-80" />
        </motion.div>
      ))}
      <motion.div
        className="absolute top-4 right-4 text-4xl pointer-events-none"
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >😈</motion.div>
    </>
  );
}

function GraveyardDecorations() {
  return (
    <>
      {[
        { x: 8, h: 14 }, { x: 20, h: 12 }, { x: 68, h: 16 }, { x: 80, h: 11 }
      ].map((tomb, i) => (
        <div key={i} className="absolute bottom-16 pointer-events-none" style={{ left: `${tomb.x}%` }}>
          <div
            className="bg-slate-400 border-2 border-slate-500 rounded-t-full"
            style={{ width: "32px", height: `${tomb.h * 4}px` }}
          />
          <div className="text-slate-300 text-xs text-center mt-0.5">RIP</div>
        </div>
      ))}
      <motion.div
        className="absolute top-6 left-8 text-3xl pointer-events-none"
        animate={{ opacity: [0, 0.6, 0], x: [0, 20] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >👻</motion.div>
      <motion.div
        className="absolute top-10 right-10 text-2xl pointer-events-none"
        animate={{ opacity: [0, 0.5, 0], x: [0, -15] }}
        transition={{ repeat: Infinity, duration: 5, delay: 2 }}
      >👻</motion.div>
    </>
  );
}

function SkyDecorations() {
  return (
    <>
      <motion.div
        className="absolute top-6 text-4xl pointer-events-none"
        animate={{ x: [-60, 420] }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
      >☁️</motion.div>
      <motion.div
        className="absolute top-14 text-3xl pointer-events-none"
        animate={{ x: [420, -60] }}
        transition={{ repeat: Infinity, duration: 24, ease: "linear", delay: 6 }}
      >☁️</motion.div>
    </>
  );
}

function HospitalDecorations() {
  return (
    <>
      <div className="absolute top-4 right-6 text-red-500 text-5xl font-black opacity-80 pointer-events-none">✚</div>
      <div className="absolute top-4 left-6 text-red-400 text-3xl font-black opacity-50 pointer-events-none">✚</div>
    </>
  );
}

export default function GameScene({ children, background = "sky" }) {
  const config = BG_CONFIGS[background] || BG_CONFIGS.sky;

  return (
    <div className={`relative w-full min-h-[440px] md:min-h-[500px] rounded-2xl overflow-hidden bg-gradient-to-b ${config.gradient} border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.4)]`}>
      {/* Decorations */}
      {background === "party" && <PartyDecorations />}
      {background === "hell" && <HellDecorations />}
      {background === "graveyard" && <GraveyardDecorations />}
      {background === "sky" && <SkyDecorations />}
      {background === "hospital" && <HospitalDecorations />}

      {/* Ground */}
      <div className={`absolute bottom-0 left-0 right-0 h-16 ${config.ground}`} />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-4 md:p-6">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </div>
    </div>
  );
}