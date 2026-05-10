import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function NoteEditor({ note, onClose, onSave }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [wordCount, setWordCount] = useState(0);
  const textRef = useRef(null);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [content]);

  useEffect(() => {
    if (textRef.current) textRef.current.focus();
  }, []);

  const handleSave = () => {
    onSave({ ...note, title: title || "Untitled", content, time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }) });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(4,4,10,.97)",
        backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Ambient */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "60%", height: 300, background: "radial-gradient(ellipse, rgba(201,168,76,.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Topbar */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,.04)", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <motion.button whileTap={{ scale: 0.92 }} onClick={onClose}
          style={{ padding: "7px 14px", border: "1px solid rgba(255,255,255,.08)", borderRadius: 8, background: "none", cursor: "pointer", color: "rgba(240,228,192,.4)", fontSize: 12, letterSpacing: ".06em" }}>
          ← Back
        </motion.button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: "rgba(201,168,76,.3)", fontFamily: "'JetBrains Mono', monospace" }}>
          {wordCount} words
        </span>
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave}
          style={{ padding: "7px 18px", border: "1px solid rgba(201,168,76,.3)", borderRadius: 8, background: "rgba(201,168,76,.08)", cursor: "pointer", color: "#c9a84c", fontSize: 12, fontWeight: 500, letterSpacing: ".06em" }}>
          Save ✦
        </motion.button>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, overflowY: "auto", padding: "clamp(24px, 6vw, 80px) clamp(20px, 8vw, 160px)", maxWidth: 800, margin: "0 auto", width: "100%" }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Untitled"
          style={{
            width: "100%", background: "none", border: "none",
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 7vw, 48px)", fontWeight: 700,
            color: "#f0e4c0", marginBottom: 24,
            lineHeight: 1.2, letterSpacing: "-.01em",
          }}
        />
        <div style={{ width: 60, height: 1, background: "rgba(201,168,76,.3)", marginBottom: 28 }} />
        <textarea
          ref={textRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What's on your mind tonight…"
          style={{
            width: "100%", background: "none", border: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(15px, 3vw, 18px)", color: "rgba(240,228,192,.8)",
            lineHeight: 1.85, resize: "none",
            minHeight: "50vh", letterSpacing: ".01em",
          }}
        />
      </div>

      {/* Bottom bar */}
      <div style={{ padding: "12px 24px", borderTop: "1px solid rgba(255,255,255,.04)", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: "rgba(201,168,76,.25)", letterSpacing: ".1em", textTransform: "uppercase" }}>
          {new Date().toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: "rgba(201,168,76,.25)", fontFamily: "'JetBrains Mono', monospace" }}>
          {new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
}
