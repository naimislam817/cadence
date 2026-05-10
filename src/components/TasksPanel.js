import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PHILOSOPHER_QUOTES } from "../data/constants";

export default function TasksPanel({ project, quoteIdx, onAdd, onToggle, onUpdate, onDelete }) {
  const inputRef = useRef(null);
  const done = project.tasks.filter((t) => t.done).length;
  const total = project.tasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const quote = PHILOSOPHER_QUOTES[quoteIdx % PHILOSOPHER_QUOTES.length];

  const handleAdd = () => {
    const v = inputRef.current?.value?.trim();
    if (!v) return;
    onAdd(v);
    inputRef.current.value = "";
  };

  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", height: "100%", fontFamily: "'DM Sans', sans-serif" }}>
      {/* stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        {[
          { l: "Total", v: total, c: "#c9a84c" },
          { l: "Done", v: done, c: "#a8c96e" },
          { l: "Left", v: total - done, c: "#e07b54" },
          { l: "Progress", v: pct + "%", c: project.color },
        ].map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              flex: 1, padding: "12px 14px",
              background: `${s.c}08`,
              border: `1px solid ${s.c}18`,
              borderRadius: 9, textAlign: "center",
            }}
          >
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 9, letterSpacing: ".15em", textTransform: "uppercase", marginTop: 1, color: `${s.c}90` }}>{s.l}</div>
          </motion.div>
        ))}
      </div>

      {/* quote block */}
      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIdx}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.4 }}
          style={{
            marginBottom: 18, padding: "13px 16px",
            background: `${project.color}04`,
            border: `1px solid ${project.color}15`,
            borderLeft: `2.5px solid ${project.color}55`,
            borderRadius: "0 8px 8px 0",
          }}
        >
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic", color: "rgba(192,176,144,.8)", lineHeight: 1.5 }}>
            "{quote.text}"
          </div>
          <div style={{ fontSize: 10, color: "rgba(201,168,76,.45)", marginTop: 5, letterSpacing: ".08em" }}>— {quote.author}</div>
        </motion.div>
      </AnimatePresence>

      {/* tasks */}
      <AnimatePresence>
        {project.tasks.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 30, opacity: 0, height: 0, padding: 0, margin: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            style={{
              display: "flex", alignItems: "center", gap: 11,
              padding: "11px 15px",
              background: t.done ? "rgba(168,201,110,.04)" : "rgba(8,8,15,.85)",
              border: `1px solid ${t.done ? "rgba(168,201,110,.18)" : "rgba(201,168,76,.06)"}`,
              borderLeft: `2.5px solid ${t.done ? "#a8c96e" : project.color}`,
              borderRadius: "0 9px 9px 0",
              marginBottom: 6,
              transition: "background .3s, border-color .3s",
            }}
          >
            <motion.div
              onClick={(e) => onToggle(t.id, e.clientX, e.clientY)}
              whileTap={{ scale: 0.85 }}
              style={{
                width: 19, height: 19, borderRadius: "50%",
                border: `1.5px solid ${t.done ? "#a8c96e" : `${project.color}50`}`,
                background: t.done ? "#a8c96e" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0, transition: "all .3s",
                boxShadow: t.done ? "0 0 10px rgba(168,201,110,.4)" : "none",
              }}
            >
              {t.done && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ color: "#06060e", fontSize: 10, fontWeight: 700, lineHeight: 1 }}
                >
                  ✓
                </motion.span>
              )}
            </motion.div>

            <input
              defaultValue={t.text}
              onBlur={(e) => onUpdate(t.id, e.target.value)}
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                color: t.done ? "rgba(168,201,110,.45)" : "rgba(240,228,192,.8)",
                textDecoration: t.done ? "line-through" : "none",
                transition: "all .3s",
              }}
            />
            {t.done && (
              <span style={{ fontSize: 9, letterSpacing: ".12em", color: "rgba(168,201,110,.55)" }}>✦ done</span>
            )}
            <button
              onClick={() => onDelete(t.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(224,123,84,.25)", fontSize: 12, padding: "2px 5px", transition: "color .2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#e07b54")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(224,123,84,.25)")}
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* add task */}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input
          ref={inputRef}
          placeholder="Add a task…"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          style={{
            flex: 1, padding: "10px 14px",
            background: "rgba(201,168,76,.03)", border: "1px solid rgba(201,168,76,.1)",
            borderRadius: 9, fontFamily: "'DM Sans', sans-serif", fontSize: 12.5,
            color: "#f0e4c0", outline: "none", transition: "border-color .2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,.38)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,.1)")}
        />
        <motion.button
          whileHover={{ background: "rgba(201,168,76,.16)", boxShadow: "0 0 14px rgba(201,168,76,.15)" }}
          whileTap={{ scale: 0.96 }}
          onClick={handleAdd}
          style={{
            padding: "10px 18px",
            background: "rgba(201,168,76,.08)",
            border: "1px solid rgba(201,168,76,.28)",
            borderRadius: 9, color: "#c9a84c", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: ".05em",
            transition: "all .2s",
          }}
        >
          + Add
        </motion.button>
      </div>
    </div>
  );
}
