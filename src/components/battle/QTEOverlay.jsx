import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QTE_WINDOW_MS } from "@/lib/battleData";

export default function QTEOverlay({ onResult }) {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    let start = null;
    let raf;
    const animate = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.max(0, 1 - elapsed / QTE_WINDOW_MS);
      setProgress(p);
      if (elapsed < QTE_WINDOW_MS) {
        raf = requestAnimationFrame(animate);
      } else {
        onResult(false);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handlePress = () => {
    onResult(progress > 0);
  };

  // Color changes from green → yellow → red
  const color = progress > 0.5 ? `hsl(${120 * progress * 2}, 80%, 50%)` : `hsl(${120 * progress * 2}, 80%, 50%)`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 rounded-2xl backdrop-blur-sm"
      onClick={handlePress}
    >
      <div className="flex flex-col items-center gap-3 px-6 py-5 bg-black/90 border-4 border-yellow-400 rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.5)]">
        <p className="font-bangers text-yellow-400 text-xl tracking-widest" style={{ textShadow: "2px 2px 0 #000" }}>
          ⚡ ¡PRESIONÁ AHORA! ⚡
        </p>

        {/* Ring timer */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg width="80" height="80" className="absolute -rotate-90">
            <circle cx="40" cy="40" r="34" stroke="#222" strokeWidth="6" fill="none" />
            <circle
              cx="40" cy="40" r="34"
              stroke={color}
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress)}`}
              strokeLinecap="round"
              style={{ transition: "none" }}
            />
          </svg>
          <motion.span
            className="text-4xl relative z-10"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.3 }}
          >🛡️</motion.span>
        </div>

        <p className="font-comic text-white/60 text-xs">Tocá / Clickeá para bloquear</p>

        <div className="flex gap-2">
          <span className="text-green-400 font-comic text-xs">✅ Éxito: -50% daño + resistir empuje</span>
        </div>
      </div>
    </motion.div>
  );
}