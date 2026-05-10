import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { STICKY_SCHEMES } from "../data/constants";

const MIN_W = 160;
const MIN_H = 140;

export default function StickyNote({ note, onUpdate, onDelete }) {
  const scheme = STICKY_SCHEMES[note.colorIdx % STICKY_SCHEMES.length];
  const posRef = useRef({ x: note.x, y: note.y });
  const sizeRef = useRef({ w: note.w || 188, h: note.h || 164 });
  const noteRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 30); }, []);

  // ── Drag ──
  const onDragMouseDown = useCallback((e) => {
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON") return;
    e.preventDefault();
    const el = noteRef.current;
    const sx = e.clientX - posRef.current.x;
    const sy = e.clientY - posRef.current.y;
    el.style.zIndex = 300;
    el.style.transition = "box-shadow .15s, transform .15s";
    el.style.transform = `rotate(${note.rot + (Math.random() * 4 - 2)}deg) scale(1.05)`;
    el.style.boxShadow = `10px 14px 40px rgba(0,0,0,.65), 0 0 20px ${scheme.border}40`;

    const onMove = (ev) => {
      posRef.current = { x: ev.clientX - sx, y: ev.clientY - sy };
      el.style.left = posRef.current.x + "px";
      el.style.top = posRef.current.y + "px";
    };
    const onUp = () => {
      el.style.zIndex = 10;
      el.style.transform = `rotate(${note.rot}deg) scale(1)`;
      el.style.boxShadow = "5px 7px 26px rgba(0,0,0,.45)";
      onUpdate({ ...note, x: posRef.current.x, y: posRef.current.y });
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [note, onUpdate, scheme]);

  // ── Resize ──
  const onResizeMouseDown = useCallback((e, corner) => {
    e.preventDefault();
    e.stopPropagation();
    const el = noteRef.current;
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = sizeRef.current.w;
    const startH = sizeRef.current.h;
    const startPX = posRef.current.x;
    const startPY = posRef.current.y;
    el.style.zIndex = 300;

    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let newW = startW;
      let newH = startH;
      let newX = startPX;
      let newY = startPY;

      if (corner.includes("e")) newW = Math.max(MIN_W, startW + dx);
      if (corner.includes("s")) newH = Math.max(MIN_H, startH + dy);
      if (corner.includes("w")) {
        newW = Math.max(MIN_W, startW - dx);
        newX = startPX + (startW - newW);
      }
      if (corner.includes("n")) {
        newH = Math.max(MIN_H, startH - dy);
        newY = startPY + (startH - newH);
      }

      sizeRef.current = { w: newW, h: newH };
      posRef.current = { x: newX, y: newY };
      el.style.width = newW + "px";
      el.style.height = newH + "px";
      el.style.left = newX + "px";
      el.style.top = newY + "px";
    };
    const onUp = () => {
      onUpdate({ ...note, x: posRef.current.x, y: posRef.current.y, w: sizeRef.current.w, h: sizeRef.current.h });
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [note, onUpdate]);

  const w = note.w || 188;
  const h = note.h || 164;

  return (
    <motion.div
      ref={noteRef}
      initial={{ scale: 0, rotate: note.rot - 90, opacity: 0, y: -60 }}
      animate={{ scale: 1, rotate: note.rot, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onMouseDown={onDragMouseDown}
      style={{
        position: "absolute",
        left: note.x, top: note.y,
        width: w, height: h,
        background: scheme.bg,
        border: `1px solid ${scheme.border}55`,
        borderTop: `3px solid ${scheme.border}`,
        borderRadius: 3,
        padding: "20px 14px 14px",
        cursor: "grab",
        boxShadow: focused
          ? `5px 7px 26px rgba(0,0,0,.45), 0 0 18px ${scheme.border}30`
          : "5px 7px 26px rgba(0,0,0,.45)",
        zIndex: 10,
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow .2s",
        minWidth: MIN_W,
        minHeight: MIN_H,
      }}
    >
      {/* tape */}
      <div style={{
        position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)",
        width: 44, height: 14,
        background: `${scheme.border}28`, border: `1px solid ${scheme.border}38`, borderRadius: 2,
      }} />
      {/* pin */}
      <div style={{
        position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
        width: 7, height: 7, borderRadius: "50%",
        background: scheme.border, boxShadow: `0 0 7px ${scheme.border}`,
      }} />
      {/* delete */}
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => onDelete(note.id)}
        style={{
          position: "absolute", top: 6, right: 8,
          background: "none", border: "none", cursor: "pointer",
          color: `${scheme.border}55`, fontSize: 12, padding: "2px 4px",
          transition: "color .2s", lineHeight: 1,
        }}
        onMouseEnter={(e) => (e.target.style.color = scheme.border)}
        onMouseLeave={(e) => (e.target.style.color = `${scheme.border}55`)}
      >
        ✕
      </button>

      {/* textarea */}
      <textarea
        defaultValue={note.text}
        placeholder="write something…"
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); onUpdate({ ...note, text: e.target.value }); }}
        onChange={(e) => { note.text = e.target.value; }}
        style={{
          flex: 1, background: "transparent", border: "none", outline: "none",
          resize: "none", fontFamily: "'Caveat', cursive",
          fontSize: 16.5, color: scheme.text, lineHeight: 1.6,
          marginTop: 6,
          userSelect: "text",
          cursor: "text",
          width: "100%",
        }}
      />

      {/* resize handles */}
      {[
        { corner: "se", bottom: 0, right: 0, cursor: "nwse-resize" },
        { corner: "sw", bottom: 0, left: 0, cursor: "nesw-resize" },
        { corner: "ne", top: 0, right: 0, cursor: "nesw-resize" },
        { corner: "nw", top: 0, left: 0, cursor: "nwse-resize" },
        { corner: "e", right: 0, top: "50%", cursor: "ew-resize" },
        { corner: "s", bottom: 0, left: "50%", cursor: "ns-resize" },
        { corner: "w", left: 0, top: "50%", cursor: "ew-resize" },
        { corner: "n", top: 0, left: "50%", cursor: "ns-resize" },
      ].map(({ corner, cursor, ...pos }) => (
        <div
          key={corner}
          onMouseDown={(e) => onResizeMouseDown(e, corner)}
          style={{
            position: "absolute",
            width: corner.length === 1 ? (["n", "s"].includes(corner) ? 20 : 6) : 10,
            height: corner.length === 1 ? (["e", "w"].includes(corner) ? 20 : 6) : 10,
            cursor,
            zIndex: 20,
            ...(pos.top !== undefined ? { top: pos.top === "50%" ? "calc(50% - 3px)" : pos.top } : {}),
            ...(pos.bottom !== undefined ? { bottom: pos.bottom } : {}),
            ...(pos.left !== undefined ? { left: pos.left === "50%" ? "calc(50% - 3px)" : pos.left } : {}),
            ...(pos.right !== undefined ? { right: pos.right } : {}),
          }}
        />
      ))}

      {/* resize grip indicator bottom-right */}
      <div
        onMouseDown={(e) => onResizeMouseDown(e, "se")}
        style={{
          position: "absolute", bottom: 5, right: 6,
          cursor: "nwse-resize", opacity: 0.35,
          display: "grid", gridTemplateColumns: "3px 3px 3px", gap: "2px",
        }}
      >
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <div key={i} style={{ width: 2, height: 2, borderRadius: "50%", background: scheme.border, opacity: i < 3 ? 0 : i < 6 ? 0.5 : 1 }} />
        ))}
      </div>
    </motion.div>
  );
}
