import { useEffect, useRef } from "react";

export default function Rain({ intensity = 0.5 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drops = Array.from({ length: Math.floor(80 * intensity) }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: 8 + Math.random() * 16,
      speed: 4 + Math.random() * 6,
      opacity: 0.03 + Math.random() * 0.08,
      width: 0.3 + Math.random() * 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach(d => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.len);
        ctx.strokeStyle = `rgba(180,200,220,${d.opacity})`;
        ctx.lineWidth = d.width;
        ctx.stroke();
        d.y += d.speed;
        if (d.y > canvas.height) {
          d.y = -d.len;
          d.x = Math.random() * canvas.width;
        }
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [intensity]);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, pointerEvents: "none",
      zIndex: 1, opacity: 0.7,
    }} />
  );
}
