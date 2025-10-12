import React, { useEffect, useRef } from "react";

// Animated hex grid + block links to evoke blockchain networks
export default function BlockchainCanvas({ className = "" }) {
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

    const blocks = Array.from({ length: 14 }).map(() => ({
      x: Math.random() * 1200,
      y: 40 + Math.random() * 160,
      size: 10 + Math.random() * 8,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    function drawHex(x, y, r) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    function step() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // gradient background
      const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      grad.addColorStop(0, "rgba(59,130,246,0.08)");
      grad.addColorStop(1, "rgba(16,185,129,0.06)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // move blocks
      for (const b of blocks) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < 0 || b.x > rect.width) b.vx *= -1;
        if (b.y < 20 || b.y > rect.height - 20) b.vy *= -1;
      }

      // connections
      for (let i = 0; i < blocks.length; i++) {
        for (let j = i + 1; j < blocks.length; j++) {
          const a = blocks[i];
          const b = blocks[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 160 * 160) {
            const alpha = 1 - d2 / (160 * 160);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.25 * alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // draw hex blocks
      for (const b of blocks) {
        ctx.strokeStyle = "#2563eb";
        ctx.fillStyle = "rgba(37,99,235,0.12)";
        drawHex(b.x, b.y, b.size);
        ctx.fill();
        ctx.stroke();
      }
      raf = requestAnimationFrame(step);
    }

    function onResize() {
      resize();
    }

    resize();
    step();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas className={className} ref={ref} />;
}
