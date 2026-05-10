import { useRef, useCallback } from "react";

export function useParticles(canvasRef) {
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  const spawn = useCallback((x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#c9a84c", "#f0e4c0", "#e07b54", "#7eb8c9", "#a8c96e", "#c97eb8", "#ffffff", "#ffd93d"];
    for (let i = 0; i < 110; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 10;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 6,
        r: 2 + Math.random() * 6,
        col: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: 0.01 + Math.random() * 0.02,
        gravity: 0.18 + Math.random() * 0.12,
        rot: Math.random() * Math.PI * 2,
        rs: (Math.random() - 0.5) * 0.2,
        shape: ["circle", "star", "rect"][Math.floor(Math.random() * 3)],
      });
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.life -= p.decay;
        p.rot += p.rs;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.col;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "rect") {
          ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
        } else {
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const ia = a + Math.PI / 5;
            i === 0 ? ctx.moveTo(Math.cos(a) * p.r, Math.sin(a) * p.r) : ctx.lineTo(Math.cos(a) * p.r, Math.sin(a) * p.r);
            ctx.lineTo(Math.cos(ia) * p.r * 0.4, Math.sin(ia) * p.r * 0.4);
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });
      ctx.globalAlpha = 1;
      if (particlesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [canvasRef]);

  return { spawn };
}
