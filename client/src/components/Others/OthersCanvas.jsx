import React, { useEffect, useRef } from "react";

// Generic CS vibe: bouncing nodes with rotating gears and signal waves
export default function OthersCanvas({ className = "" }) {
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

    const nodes = Array.from({ length: 18 }).map(() => ({
      x: Math.random() * 1200,
      y: 40 + Math.random() * 160,
      r: 3 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      a: Math.random() * Math.PI * 2,
    }));

    function drawGear(x, y, r, teeth = 8, a = 0) {
      ctx.save();
      ctx.translate(x, y); ctx.rotate(a);
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const ang = (i / teeth) * Math.PI * 2;
        const r1 = r * 0.8, r2 = r * 1.1;
        ctx.lineTo(Math.cos(ang) * r2, Math.sin(ang) * r2);
        ctx.lineTo(Math.cos(ang + 0.2) * r1, Math.sin(ang + 0.2) * r1);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(99,102,241,0.18)";
      ctx.strokeStyle = "rgba(79,70,229,0.4)";
      ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    function step() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      grad.addColorStop(0, "rgba(99,102,241,0.10)");
      grad.addColorStop(1, "rgba(236,72,153,0.08)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, rect.width, rect.height);

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy; n.a += 0.01;
        if (n.x < 0 || n.x > rect.width) n.vx *= -1;
        if (n.y < 20 || n.y > rect.height - 20) n.vy *= -1;
      }

      // connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y; const d2 = dx*dx + dy*dy;
          if (d2 < 160*160) {
            const alpha = 1 - d2 / (160*160);
            ctx.strokeStyle = `rgba(99,102,241,${0.25 * alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      // gears (dbms/system design feel)
      drawGear(120, 120, 16, 10, nodes[0].a);
      drawGear(200, 80, 12, 8, -nodes[1].a * 1.2);
      drawGear(320, 140, 18, 12, nodes[2].a * 0.8);

      // waves (IoT/web signals)
      ctx.strokeStyle = "rgba(236,72,153,0.4)"; ctx.lineWidth = 1.2;
      for (let y = 40; y <= 160; y += 40) {
        ctx.beginPath();
        for (let x = 0; x <= rect.width; x += 12) {
          const v = Math.sin((x + nodes[3].a * 120) * 0.02 + y * 0.03) * 6;
          ctx.lineTo(x, y + v);
        }
        ctx.stroke();
      }

      // nodes
      for (const n of nodes) {
        ctx.fillStyle = "#111827";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2); ctx.fill();
      }

      raf = requestAnimationFrame(step);
    }

    resize(); step();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas className={className} ref={ref} />;
}
