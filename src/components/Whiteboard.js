import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

const WB_COLORS = ["#0d0b10", "#c9a84c", "#f0e4c0", "#e07b54", "#7eb8c9", "#a8c96e", "#c97eb8", "#e05454", "#ffffff"];

export default function Whiteboard({ isOpen, onClose, canvas, onSave }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const pts = useRef([]);
  const rollerRef = useRef(null);
  const boardRef = useRef(null);
  const [mode, setMode] = useState("pen");
  const [color, setColor] = useState("#c9a84c");
  const [size, setSize] = useState(3);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Cinematic entrance: roller unrolls from ceiling
  useEffect(() => {
    if (isOpen && rollerRef.current && boardRef.current) {
      setHasLoaded(false);
      gsap.set(rollerRef.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(boardRef.current, { opacity: 0 });

      const tl = gsap.timeline();
      tl.to(rollerRef.current, {
        scaleY: 1,
        duration: 0.8,
        ease: "power3.inOut",
      })
      .to(boardRef.current, {
        opacity: 1,
        duration: 0.2,
      }, "-=0.1")
      .call(() => {
        setHasLoaded(true);
        initCanvas();
      });
    }
  }, [isOpen]);

  // Cinematic exit: rolls back up
  const handleClose = useCallback(() => {
    if (rollerRef.current && boardRef.current) {
      gsap.to(boardRef.current, { opacity: 0, duration: 0.15 });
      gsap.to(rollerRef.current, {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.55,
        ease: "power3.inOut",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  }, [onClose]);

  const initCanvas = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const wrap = cvs.parentElement;
    cvs.width = wrap.offsetWidth;
    cvs.height = wrap.offsetHeight;
    const ctx = cvs.getContext("2d");
    ctxRef.current = ctx;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (canvas) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = canvas;
    }
  }, [canvas]);

  const getPos = (e, cvs) => {
    const r = cvs.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - r.left) * (cvs.width / r.width),
      y: (src.clientY - r.top) * (cvs.height / r.height),
    };
  };

  const startDraw = (e) => {
    drawing.current = true;
    pts.current = [];
    const p = getPos(e, canvasRef.current);
    pts.current.push(p);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(p.x, p.y);
  };

  const doDraw = (e) => {
    if (!drawing.current) return;
    const p = getPos(e, canvasRef.current);
    pts.current.push(p);
    const ctx = ctxRef.current;
    if (mode === "erase") {
      ctx.clearRect(p.x - size * 5, p.y - size * 5, size * 10, size * 10);
      return;
    }
    ctx.globalAlpha = mode === "marker" ? 0.3 : 1;
    ctx.lineWidth = mode === "marker" ? size * 4 : size;
    ctx.strokeStyle = color;
    const arr = pts.current;
    const l = arr.length;
    if (l > 2) {
      ctx.beginPath();
      ctx.moveTo((arr[l - 3].x + arr[l - 2].x) / 2, (arr[l - 3].y + arr[l - 2].y) / 2);
      ctx.quadraticCurveTo(arr[l - 2].x, arr[l - 2].y, (arr[l - 2].x + arr[l - 1].x) / 2, (arr[l - 2].y + arr[l - 1].y) / 2);
      ctx.stroke();
    }
  };

  const endDraw = () => {
    drawing.current = false;
    if (ctxRef.current) ctxRef.current.globalAlpha = 1;
    try { onSave(canvasRef.current.toDataURL()); } catch (_) {}
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 900,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      pointerEvents: "none",
    }}>
      {/* backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,.6)",
          backdropFilter: "blur(6px)",
          pointerEvents: "all",
        }}
      />

      {/* roller mechanism - top bar */}
      <div style={{
        position: "absolute", top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "min(900px, 94vw)",
        zIndex: 901,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        {/* ceiling mount bar */}
        <div style={{
          width: "100%", height: 18,
          background: "linear-gradient(180deg, #2a1f0a 0%, #1a1306 100%)",
          border: "1px solid rgba(201,168,76,.5)",
          borderTop: "3px solid #c9a84c",
          borderRadius: "0 0 4px 4px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px",
          boxShadow: "0 4px 20px rgba(0,0,0,.5), 0 0 30px rgba(201,168,76,.15)",
          flexShrink: 0,
          position: "relative",
          zIndex: 3,
        }}>
          {/* screws */}
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#c9a84c", boxShadow: "0 0 4px rgba(201,168,76,.6)", opacity: 0.7 }} />
          ))}
        </div>

        {/* the rolling canvas panel */}
        <div
          ref={rollerRef}
          style={{
            width: "100%",
            transformOrigin: "top center",
            pointerEvents: "all",
            position: "relative",
          }}
        >
          {/* wooden roller top edge */}
          <div style={{
            height: 14, background: "linear-gradient(180deg, #3d2b0f, #251a08)",
            borderLeft: "1px solid rgba(201,168,76,.3)", borderRight: "1px solid rgba(201,168,76,.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 40,
          }}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ width: 60, height: 4, borderRadius: 2, background: "rgba(201,168,76,.15)" }} />
            ))}
          </div>

          {/* board itself */}
          <div
            ref={boardRef}
            style={{
              background: "#07070d",
              borderLeft: "1px solid rgba(201,168,76,.2)",
              borderRight: "1px solid rgba(201,168,76,.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,.7), inset 0 0 80px rgba(0,0,0,.3)",
            }}
          >
            {/* header */}
            <div style={{
              padding: "12px 18px", borderBottom: "1px solid rgba(201,168,76,.1)",
              background: "rgba(8,8,15,.95)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "#c9a84c", letterSpacing: ".04em" }}>
                  ◈ Whiteboard
                </div>
                <div style={{ fontSize: 10, color: "rgba(201,168,76,.3)", letterSpacing: ".1em" }}>draw · sketch · brainstorm</div>
              </div>
              <div style={{ flex: 1 }} />
              <button
                onClick={handleClose}
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  border: "1px solid rgba(201,168,76,.2)", background: "none",
                  cursor: "pointer", color: "rgba(201,168,76,.5)",
                  fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .2s", fontFamily: "sans-serif",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(224,123,84,.5)"; e.currentTarget.style.color = "#e07b54"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,.2)"; e.currentTarget.style.color = "rgba(201,168,76,.5)"; }}
              >
                ✕
              </button>
            </div>

            {/* canvas area */}
            <div style={{ position: "relative", width: "100%", height: "min(460px, 55vh)", overflow: "hidden" }}>
              {/* dot grid */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(201,168,76,.07) 1px, transparent 0)",
                backgroundSize: "26px 26px",
              }} />
              <canvas
                ref={canvasRef}
                onMouseDown={startDraw}
                onMouseMove={doDraw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={(e) => { e.preventDefault(); startDraw(e); }}
                onTouchMove={(e) => { e.preventDefault(); doDraw(e); }}
                onTouchEnd={endDraw}
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  cursor: mode === "erase" ? "cell" : "crosshair",
                  touchAction: "none",
                }}
              />
            </div>

            {/* toolbar */}
            <div style={{
              padding: "10px 18px",
              borderTop: "1px solid rgba(201,168,76,.08)",
              background: "rgba(8,8,15,.97)",
              display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
            }}>
              {[["pen", "✏️"], ["marker", "🖊️"], ["erase", "⬜"]].map(([m, icon]) => (
                <button key={m} onClick={() => setMode(m)} style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: `1px solid ${mode === m ? "#c9a84c" : "rgba(201,168,76,.15)"}`,
                  background: mode === m ? "rgba(201,168,76,.12)" : "transparent",
                  cursor: "pointer", fontSize: 14, transition: "all .2s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: mode === m ? "0 0 10px rgba(201,168,76,.2)" : "none",
                }}>
                  {icon}
                </button>
              ))}
              <div style={{ width: 1, height: 24, background: "rgba(201,168,76,.1)" }} />
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {WB_COLORS.map((c, i) => (
                  <div key={c} onClick={() => setColor(c)} style={{
                    width: 19, height: 19, borderRadius: "50%", background: c, cursor: "pointer",
                    border: `2px solid ${color === c ? "white" : "transparent"}`,
                    transform: color === c ? "scale(1.25)" : "scale(1)",
                    transition: "all .18s",
                    boxShadow: color === c ? `0 0 8px ${c}` : "none",
                  }} />
                ))}
              </div>
              <div style={{ width: 1, height: 24, background: "rgba(201,168,76,.1)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 9, color: "rgba(201,168,76,.3)", letterSpacing: ".1em" }}>SZ</span>
                <input
                  type="range" min={1} max={28} value={size} step={1}
                  onChange={(e) => setSize(+e.target.value)}
                  style={{ width: 70, accentColor: "#c9a84c" }}
                />
              </div>
              <div style={{ flex: 1 }} />
              <button
                onClick={() => {
                  if (ctxRef.current && canvasRef.current) {
                    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    onSave(null);
                  }
                }}
                style={{
                  padding: "5px 14px", border: "1px solid rgba(224,123,84,.25)",
                  borderRadius: 20, background: "transparent",
                  color: "rgba(224,123,84,.6)", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: ".08em",
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e07b54"; e.currentTarget.style.color = "#e07b54"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(224,123,84,.25)"; e.currentTarget.style.color = "rgba(224,123,84,.6)"; }}
              >
                🗑 clear
              </button>
            </div>
          </div>

          {/* wooden roller bottom edge */}
          <div style={{
            height: 18, background: "linear-gradient(180deg, #251a08, #1a1206)",
            borderLeft: "1px solid rgba(201,168,76,.3)", borderRight: "1px solid rgba(201,168,76,.3)",
            borderBottom: "3px solid #c9a84c",
            borderRadius: "0 0 4px 4px",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 40, boxShadow: "0 8px 30px rgba(0,0,0,.6)",
          }}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ width: 60, height: 4, borderRadius: 2, background: "rgba(201,168,76,.15)" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
