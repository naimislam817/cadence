import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PHILOSOPHER_QUOTES } from "../data/constants";

export default function QuoteBar() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  const next = () => {
    setVisible(false);
    setTimeout(() => {
      setIdx((i) => (i + 1) % PHILOSOPHER_QUOTES.length);
      setVisible(true);
    }, 350);
  };

  useEffect(() => {
    const t = setInterval(next, 14000);
    return () => clearInterval(t);
  }, []);

  const q = PHILOSOPHER_QUOTES[idx];

  return (
    <div style={{
      padding: "9px 20px", borderBottom: "1px solid rgba(201,168,76,.07)",
      background: "rgba(8,8,15,.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", gap: 10, minHeight: 42, flexShrink: 0,
    }}>
      <span style={{ color: "rgba(201,168,76,.4)", fontFamily: "'Cormorant Garamond', serif", fontSize: 22, lineHeight: 1, flexShrink: 0 }}>"</span>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4 }}
            style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}
          >
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13.5, fontStyle: "italic", color: "rgba(192,176,144,.8)", lineHeight: 1.4 }}>
              {q.text}
            </span>
            <span style={{ fontSize: 10, color: "rgba(201,168,76,.45)", letterSpacing: ".08em", whiteSpace: "nowrap" }}>
              — {q.author}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={next}
        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(201,168,76,.25)", fontSize: 14, padding: "2px 6px", transition: "color .2s", flexShrink: 0 }}
        onMouseEnter={(e) => (e.target.style.color = "rgba(201,168,76,.7)")}
        onMouseLeave={(e) => (e.target.style.color = "rgba(201,168,76,.25)")}
      >
        ↻
      </button>
    </div>
  );
}

export { PHILOSOPHER_QUOTES };
