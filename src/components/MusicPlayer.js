import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FOCUS_MODES } from "../data";

export default function MusicPlayer({ mode, onModeChange }) {
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const currentMode = FOCUS_MODES.find(m => m.id === mode) || FOCUS_MODES[0];

  const bars = [12, 20, 8, 24, 16, 10, 22, 14, 18, 6];

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100, fontFamily: "'DM Sans', sans-serif" }}>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "absolute", bottom: 70, right: 0,
              width: 260,
              background: "rgba(8,8,16,.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(201,168,76,.2)",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,.6), 0 0 40px rgba(201,168,76,.08)",
            }}
          >
            <div style={{ fontSize: 10, color: "rgba(201,168,76,.4)", letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 12 }}>Focus Mode</div>
            {FOCUS_MODES.map(m => (
              <motion.div key={m.id} whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
                onClick={() => { onModeChange(m.id); setExpanded(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  borderRadius: 10, cursor: "pointer", marginBottom: 4,
                  background: mode === m.id ? `${m.color}12` : "transparent",
                  border: `1px solid ${mode === m.id ? m.color + "30" : "transparent"}`,
                  transition: "all .2s",
                }}>
                <span style={{ fontSize: 18 }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: mode === m.id ? m.color : "rgba(240,228,192,.7)" }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: "rgba(201,168,76,.3)", marginTop: 1 }}>{m.desc}</div>
                </div>
                {mode === m.id && <div style={{ width: 6, height: 6, borderRadius: "50%", background: m.color, boxShadow: `0 0 8px ${m.color}` }} />}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player pill */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
          background: "rgba(8,8,16,.92)", backdropFilter: "blur(20px)",
          border: `1px solid ${currentMode.color}30`,
          borderRadius: 40,
          boxShadow: `0 8px 32px rgba(0,0,0,.4), 0 0 20px ${currentMode.color}15`,
          cursor: "pointer",
          minWidth: 200,
        }}
      >
        {/* Equalizer */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 20, flexShrink: 0 }}>
          {bars.map((h, i) => (
            <motion.div key={i}
              animate={playing ? { height: [4, h, 4] } : { height: 4 }}
              transition={{ duration: 0.5 + i * 0.08, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
              style={{ width: 2.5, background: currentMode.color, borderRadius: 2, minHeight: 4 }}
            />
          ))}
        </div>

        <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setExpanded(v => !v)}>
          <div style={{ fontSize: 11, fontWeight: 500, color: currentMode.color, letterSpacing: ".03em" }}>{currentMode.label}</div>
          <div style={{ fontSize: 9, color: "rgba(201,168,76,.35)", marginTop: 1 }}>{currentMode.desc}</div>
        </div>

        <motion.button whileTap={{ scale: 0.85 }} onClick={() => setPlaying(v => !v)}
          style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${currentMode.color}50`, background: `${currentMode.color}15`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: currentMode.color, fontSize: 10, flexShrink: 0 }}>
          {playing ? "⏸" : "▶"}
        </motion.button>
      </motion.div>
    </div>
  );
}
