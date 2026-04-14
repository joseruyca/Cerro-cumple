import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BattleLog({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full bg-black/80 border-2 border-white/15 rounded-xl overflow-hidden">
      <div className="bg-black/60 border-b border-white/10 px-3 py-1.5 flex items-center gap-2">
        <span className="text-yellow-400 text-xs">📜</span>
        <span className="font-bangers text-yellow-400 text-sm tracking-wide">BATALLA</span>
      </div>
      <div className="h-20 overflow-y-auto px-3 py-2 space-y-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`font-comic text-xs leading-snug ${
                msg.type === "player" ? "text-yellow-300" :
                msg.type === "enemy" ? "text-red-300" :
                msg.type === "heal" ? "text-green-300" :
                msg.type === "system" ? "text-purple-300 italic" :
                "text-white/70"
              }`}
            >
              {msg.text}
            </motion.p>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}