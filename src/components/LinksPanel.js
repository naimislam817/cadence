import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LinksPanel({ project, onAdd, onDelete }) {
  const lblRef = useRef(null);
  const urlRef = useRef(null);

  const handleAdd = () => {
    const lbl = lblRef.current?.value?.trim();
    const url = urlRef.current?.value?.trim();
    if (!lbl || !url) return;
    onAdd(lbl, url, "🔗");
    lblRef.current.value = "";
    urlRef.current.value = "";
  };

  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", height: "100%", fontFamily: "'DM Sans', sans-serif" }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: "#c9a84c", marginBottom: 18 }}
      >
        Resources ✦
      </motion.div>

      <AnimatePresence>
        {project.links.map((l, i) => (
          <motion.div
            key={l.id}
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ x: 4 }}
            style={{
              display: "flex", alignItems: "center", gap: 13,
              padding: "13px 16px",
              background: "rgba(8,8,15,.85)",
              border: "1px solid rgba(201,168,76,.09)",
              borderRadius: 10, marginBottom: 7,
              cursor: "pointer",
              transition: "border-color .25s, box-shadow .25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(201,168,76,.32)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(201,168,76,.09)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{
              width: 36, height: 36,
              background: "rgba(201,168,76,.07)", border: "1px solid rgba(201,168,76,.15)",
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 17, flexShrink: 0,
            }}>
              {l.icon}
            </div>
            <div
              style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
              onClick={() => window.open(l.url, "_blank", "noopener")}
            >
              <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(240,228,192,.85)" }}>{l.label}</div>
              <div style={{ fontSize: 10, color: "rgba(201,168,76,.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.url}</div>
            </div>
            <span style={{ color: "rgba(201,168,76,.3)", fontSize: 15, transition: "color .2s" }}>→</span>
            <button
              onClick={() => onDelete(l.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(224,123,84,.25)", fontSize: 12, padding: "2px 5px", transition: "color .2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#e07b54")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(224,123,84,.25)")}
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          padding: "14px 16px",
          background: "rgba(201,168,76,.02)",
          border: "1px dashed rgba(201,168,76,.14)",
          borderRadius: 10, display: "flex", flexDirection: "column", gap: 7,
          marginTop: 8,
        }}
      >
        {[
          { ref: lblRef, placeholder: "Label (e.g. Figma file)" },
          { ref: urlRef, placeholder: "https://…", onKeyDown: (e) => e.key === "Enter" && handleAdd() },
        ].map((inp, i) => (
          <input
            key={i}
            ref={inp.ref}
            placeholder={inp.placeholder}
            onKeyDown={inp.onKeyDown}
            style={{
              padding: "8px 12px",
              background: "rgba(201,168,76,.03)", border: "1px solid rgba(201,168,76,.09)",
              borderRadius: 7, fontFamily: "'DM Sans', sans-serif", fontSize: 12,
              color: "#f0e4c0", outline: "none", transition: "border-color .2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,.35)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,.09)")}
          />
        ))}
        <motion.button
          whileHover={{ background: "rgba(201,168,76,.16)" }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          style={{
            alignSelf: "flex-start", padding: "8px 16px",
            background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.22)",
            borderRadius: 7, color: "#c9a84c", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: ".06em",
            transition: "background .2s",
          }}
        >
          + Add Link
        </motion.button>
      </motion.div>
    </div>
  );
}
