import { motion, AnimatePresence } from "framer-motion";
import { PROJECT_COLORS } from "../data/constants";
import { useState } from "react";

export default function Sidebar({ projects, activeId, onSelect, onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[0]);

  const handleCreate = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), color);
    setName("");
    setColor(PROJECT_COLORS[0]);
    setShowForm(false);
  };

  return (
    <motion.aside
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: 220, minWidth: 220, background: "#08080f",
        borderRight: "1px solid rgba(201,168,76,.1)",
        display: "flex", flexDirection: "column",
        position: "relative", zIndex: 20,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid rgba(201,168,76,.07)" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 600, color: "#c9a84c", letterSpacing: ".05em", display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ opacity: 0.6, fontSize: 13 }}>✦</span> Scratchpad
        </div>
        <div style={{ fontSize: 9, color: "rgba(201,168,76,.28)", letterSpacing: ".2em", textTransform: "uppercase", marginTop: 3 }}>
          Focus · Ship · Repeat
        </div>
      </div>

      {/* Project list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 7px" }}>
        <div style={{ fontSize: 9, color: "rgba(201,168,76,.25)", letterSpacing: ".2em", textTransform: "uppercase", padding: "4px 10px 8px" }}>
          Projects
        </div>
        <AnimatePresence>
          {projects.map((p, i) => {
            const done = p.tasks.filter((t) => t.done).length;
            const tot = p.tasks.length;
            const isActive = p.id === activeId;
            return (
              <motion.div
                key={p.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                onClick={() => onSelect(p.id)}
                whileHover={{ x: 2 }}
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "9px 11px", borderRadius: 8, cursor: "pointer",
                  marginBottom: 2,
                  background: isActive ? `${p.color}10` : "transparent",
                  border: `1px solid ${isActive ? p.color + "30" : "transparent"}`,
                  transition: "background .2s, border-color .2s",
                }}
              >
                <div style={{
                  width: 7, height: 7, borderRadius: "50%", background: p.color, flexShrink: 0,
                  boxShadow: isActive ? `0 0 8px ${p.color}` : "none",
                  transition: "box-shadow .3s",
                }} />
                <span style={{
                  fontSize: 12.5, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  color: isActive ? p.color : "rgba(240,228,192,.5)",
                  fontWeight: isActive ? 500 : 400,
                }}>
                  {p.name}
                </span>
                {isActive && tot > 0 && (
                  <span style={{ fontSize: 9, color: `${p.color}70`, letterSpacing: ".05em" }}>
                    {done}/{tot}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Project */}
      <AnimatePresence>
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ margin: "0 8px 10px", padding: 12, background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 10 }}
          >
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Project name…"
              maxLength={28}
              style={{
                width: "100%", padding: "7px 10px", marginBottom: 10,
                background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.2)",
                borderRadius: 6, color: "#f0e4c0", fontSize: 12,
                fontFamily: "'DM Sans', sans-serif", outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
              {PROJECT_COLORS.map((c) => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 22, height: 22, borderRadius: "50%", background: c, cursor: "pointer",
                    border: `2px solid ${color === c ? "white" : "transparent"}`,
                    transform: color === c ? "scale(1.2)" : "scale(1)",
                    transition: "all .15s",
                    boxShadow: color === c ? `0 0 8px ${c}` : "none",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setShowForm(false)}
                style={{ flex: 1, padding: "6px", background: "none", border: "1px solid rgba(201,168,76,.15)", borderRadius: 6, color: "rgba(201,168,76,.4)", cursor: "pointer", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                style={{ flex: 2, padding: "6px", background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.35)", borderRadius: 6, color: "#c9a84c", cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}
              >
                Create →
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowForm(true)}
            whileHover={{ borderColor: "rgba(201,168,76,.5)", color: "#c9a84c", background: "rgba(201,168,76,.04)" }}
            style={{
              margin: "0 8px 10px", padding: "9px 12px",
              border: "1px dashed rgba(201,168,76,.18)", borderRadius: 8,
              background: "none", cursor: "pointer",
              color: "rgba(201,168,76,.35)", fontFamily: "'DM Sans', sans-serif",
              fontSize: 11.5, letterSpacing: ".06em",
              display: "flex", alignItems: "center", gap: 7, transition: "all .2s",
            }}
          >
            <span style={{ fontSize: 17, lineHeight: 1 }}>+</span> New Project
          </motion.button>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
