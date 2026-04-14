import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DialogBox({ text, options, onSelect, speaker = "Narrador" }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [text]);

  const skip = () => {
    setDisplayed(text);
    setDone(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="mt-3 w-full"
    >
      {/* Dialog bubble */}
      <div
        className="relative bg-black border-4 border-yellow-400 rounded-2xl p-4 md:p-5 shadow-[0_0_30px_rgba(234,179,8,0.3),6px_6px_0_0_rgba(0,0,0,0.5)] cursor-pointer"
        onClick={!done ? skip : undefined}
      >
        {/* Speaker badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-yellow-400 text-black font-bangers text-sm md:text-base px-3 py-0.5 rounded-full tracking-wider shadow-[2px_2px_0_0_rgba(0,0,0,0.3)]">
            {speaker}
          </div>
          {!done && (
            <motion.div
              className="flex gap-1"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            </motion.div>
          )}
        </div>

        {/* Text */}
        <p className="text-white font-comic text-sm md:text-base leading-relaxed min-h-[3rem]">
          {displayed}
          {!done && (
            <motion.span
              className="inline-block w-0.5 h-4 bg-yellow-400 ml-0.5 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            />
          )}
        </p>

        {!done && (
          <p className="text-yellow-500/50 text-xs mt-2 font-comic italic">click para saltar...</p>
        )}
      </div>

      {/* Options */}
      <AnimatePresence>
        {done && options && options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2 mt-3"
          >
            {options.map((option, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.12 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(option.next)}
                className="w-full text-left font-comic text-sm md:text-base bg-gradient-to-r from-yellow-400/10 to-orange-400/5 border-2 border-yellow-400/40 hover:border-yellow-400 text-yellow-200 hover:text-white rounded-xl px-4 py-3 transition-all duration-200 shadow-[3px_3px_0_0_rgba(0,0,0,0.3)] hover:shadow-[4px_4px_0_0_rgba(234,179,8,0.25)] group"
              >
                <span className="font-bangers text-yellow-400 text-base mr-2 group-hover:text-yellow-300">
                  {idx + 1}.
                </span>
                {option.text}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}