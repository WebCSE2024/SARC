import React, { useEffect, useRef } from "react";

// Animated scanlines + pulse nodes to evoke infosec/hacking vibe
export default function CybersecCanvas({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * DPR;
      canvas.height = rect.height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    const nodes = Array.from({ length: 26 }).map(() => ({
      x: Math.random() * 1200,
      y: 30 + Math.random() * 180,
      r: 2 + Math.random() * 2,
      t: Math.random() * Math.PI * 2,
    }));

    function step(time) {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // dark gradient wash
      const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      grad.addColorStop(0, "rgba(2,6,23,0.75)");
      grad.addColorStop(1, "rgba(2,6,23,0.55)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // scanlines
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      for (let y = 0; y < rect.height; y += 6) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }

      // pulse nodes
      for (const n of nodes) {
        n.t += 0.03;
        const alpha = 0.4 + 0.4 * Math.sin(n.t);
        ctx.fillStyle = `rgba(34,197,94,${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 0.5 * (1 + Math.sin(n.t)), 0, Math.PI * 2);
        ctx.fill();
      }

      // random flicker connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140 && Math.random() < 0.02) {
            ctx.strokeStyle = "rgba(125, 211, 252, 0.25)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(step);
    }

    function onResize() {
      resize();
    }

    resize();
    step(0);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas className={className} ref={ref} />;
}
