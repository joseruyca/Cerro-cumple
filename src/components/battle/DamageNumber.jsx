import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DamageNumber({ value, type = "damage", id }) {
  const color = type === "heal" ? "text-green-400" : type === "player" ? "text-yellow-400" : "text-red-400";
  const prefix = type === "heal" ? "+" : "-";

  return (
    <AnimatePresence>
      {value !== null && (
        <motion.div
          key={id}
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -50, scale: 1.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className={`absolute top-0 left-1/2 -translate-x-1/2 font-bangers text-2xl pointer-events-none z-50 ${color}`}
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          {prefix}{value}
        </motion.div>
      )}
    </AnimatePresence>
  );
}