import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const cursorRef = useRef(null);
  const glowRef = useRef(null);
  const [clicking, setClicking] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const glowPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };

    const animateGlow = () => {
      glowPos.current.x += (pos.current.x - glowPos.current.x) * 0.08;
      glowPos.current.y += (pos.current.y - glowPos.current.y) * 0.08;
      if (glowRef.current) {
        glowRef.current.style.left = glowPos.current.x + "px";
        glowRef.current.style.top = glowPos.current.y + "px";
      }
      rafRef.current = requestAnimationFrame(animateGlow);
    };

    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const enter = () => setHidden(false);
    const leave = () => setHidden(true);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseenter", enter);
    document.addEventListener("mouseleave", leave);
    rafRef.current = requestAnimationFrame(animateGlow);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseleave", leave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (typeof window !== "undefined" && window.innerWidth < 768) return null;

  return (
    <>
      {/* Glow trail */}
      <div ref={glowRef} style={{
        position: "fixed", pointerEvents: "none", zIndex: 99998,
        width: 300, height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,168,76,.06) 0%, transparent 70%)",
        transform: "translate(-50%, -50%)",
        opacity: hidden ? 0 : 1,
        transition: "opacity .3s",
      }} />
      {/* Dot cursor */}
      <div ref={cursorRef} style={{
        position: "fixed", pointerEvents: "none", zIndex: 99999,
        width: clicking ? 6 : 8, height: clicking ? 6 : 8,
        borderRadius: "50%",
        background: "#c9a84c",
        transform: "translate(-50%, -50%)",
        opacity: hidden ? 0 : 1,
        transition: "width .15s, height .15s, opacity .3s",
        boxShadow: "0 0 10px rgba(201,168,76,.8), 0 0 20px rgba(201,168,76,.4)",
        mixBlendMode: "screen",
      }} />
    </>
  );
}
