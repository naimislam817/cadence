import { useState } from "react";
import { motion } from "framer-motion";

const TAG_COLORS = {
  personal: "#c9a84c", work: "#7eb8c9", tech: "#a8c96e",
  philosophy: "#c97eb8", business: "#e07b54", design: "#7b8ce0",
  ideas: "#54b87e", research: "#e05454",
};

export default function NoteCard({ note, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const tagColor = TAG_COLORS[note.tag] || "#c9a84c";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onClick(note)}
      style={{
        position: "relative",
        background: "rgba(12,12,20,.8)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${hovered ? tagColor + "40" : "rgba(255,255,255,.06)"}`,
        borderRadius: 16,
        padding: "20px 18px",
        cursor: "pointer",
        overflow: "hidden",
        transition: "border-color .25s",
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,.5), 0 0 30px ${tagColor}15, inset 0 1px 0 rgba(255,255,255,.05)`
          : "0 8px 30px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.03)",
      }}
    >
      {/* Ambient light leak */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${tagColor}40, transparent)`,
        opacity: hovered ? 1 : 0, transition: "opacity .3s",
      }} />

      {/* Glow corner */}
      <motion.div
        animate={hovered ? { opacity: 1 } : { opacity: 0 }}
        style={{
          position: "absolute", top: -30, right: -30, width: 80, height: 80,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${tagColor}20, transparent 70%)`,
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 8 }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(14px, 3.5vw, 16px)", fontWeight: 700,
          color: hovered ? "#f0e4c0" : "rgba(240,228,192,.85)",
          lineHeight: 1.3, flex: 1, transition: "color .2s",
        }}>
          {note.title}
        </h3>
        <span style={{
          fontSize: 9, color: "rgba(201,168,76,.4)",
          letterSpacing: ".06em", whiteSpace: "nowrap", marginTop: 2,
          fontFamily: "'JetBrains Mono', monospace",
        }}>{note.time}</span>
      </div>

      <p style={{
        fontSize: "clamp(11px, 2.8vw, 12.5px)",
        color: "rgba(192,176,144,.6)", lineHeight: 1.6,
        display: "-webkit-box", WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical", overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {note.content}
      </p>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
        <span style={{
          fontSize: 10, padding: "3px 10px",
          background: `${tagColor}12`, border: `1px solid ${tagColor}30`,
          borderRadius: 20, color: tagColor, letterSpacing: ".06em",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {note.tag}
        </span>
        <span style={{ fontSize: 10, color: "rgba(201,168,76,.25)", letterSpacing: ".05em" }}>
          {note.mood}
        </span>
      </div>

      {/* Bottom glow line */}
      <motion.div
        animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${tagColor}60, transparent)`,
          transformOrigin: "center",
        }}
      />
    </motion.div>
  );
}
