import React from "react";
import { motion } from "framer-motion";

const CERRO_IMG = "https://media.base44.com/images/public/69de2ed89c27af8df0516e55/3d25fa7bf_2e294a76-50f7-47c7-9667-f2e69672ef8c.png";

export default function SouthParkCharacter({ emotion = "happy", size = 120, className = "" }) {
  const animations = {
    happy: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" } },
    shocked: { rotate: [0, -3, 3, -2, 0], transition: { repeat: Infinity, duration: 0.5 } },
    dead: { rotate: [-8, 8, -8], opacity: [1, 0.6, 1], transition: { repeat: Infinity, duration: 1.5 } },
    angry: { x: [0, -3, 3, -2, 0], transition: { repeat: Infinity, duration: 0.4 } },
    drunk: { rotate: [-6, 6, -6], y: [0, -3, 0], transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } },
  };

  const overlays = {
    dead: (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span style={{ fontSize: size * 0.35, lineHeight: 1 }}>💀</span>
      </div>
    ),
    shocked: (
      <div className="absolute -top-1 -right-1 pointer-events-none">
        <span style={{ fontSize: size * 0.22 }}>😱</span>
      </div>
    ),
    angry: (
      <div className="absolute -top-1 -right-1 pointer-events-none">
        <span style={{ fontSize: size * 0.22 }}>😤</span>
      </div>
    ),
    drunk: (
      <div className="absolute -top-1 -right-1 pointer-events-none">
        <span style={{ fontSize: size * 0.22 }}>😵</span>
      </div>
    ),
  };

  return (
    <motion.div
      className={`relative inline-flex items-end justify-center ${className}`}
      style={{ width: size, height: size * 1.15 }}
      animate={animations[emotion]}
    >
      <img
        src={CERRO_IMG}
        alt="Cerro"
        style={{ width: size, height: size * 1.15, objectFit: "contain", objectPosition: "bottom" }}
        draggable={false}
      />
      {overlays[emotion] || null}
    </motion.div>
  );
}