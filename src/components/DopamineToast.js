import { useEffect } from "react";
import { motion } from "framer-motion";

export default function DopamineToast({ hit, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0, scale: 0.88 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 16, opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={{
        position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
        background: "linear-gradient(135deg, #13100a, #1f1a0c)",
        border: "1px solid rgba(201,168,76,.45)",
        borderRadius: 16, padding: "14px 26px",
        zIndex: 9998,
        boxShadow: "0 0 40px rgba(201,168,76,.35), 0 20px 60px rgba(0,0,0,.7)",
        display: "flex", alignItems: "center", gap: 14,
        maxWidth: 420, backdropFilter: "blur(16px)",
        fontFamily: "'DM Sans', sans-serif",
        pointerEvents: "none",
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.1 }}
        style={{ fontSize: 28 }}
      >
        {hit.e}
      </motion.div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#c9a84c", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 3 }}>
          Dopamine Released ✦
        </div>
        <div style={{ color: "#f0e4c0", fontSize: 13.5, lineHeight: 1.4 }}>{hit.m}</div>
      </div>
    </motion.div>
  );
}
