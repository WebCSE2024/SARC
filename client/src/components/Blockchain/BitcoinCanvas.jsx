import React, { useEffect, useRef } from "react";

// Bitcoin themed: spinning BTC glyphs and PoW-like spark connections
export default function BitcoinCanvas({ className = "" }) {
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

    const coins = Array.from({ length: 10 }).map(() => ({
      x: Math.random() * 1200,
      y: 40 + Math.random() * 160,
      r: 12 + Math.random() * 8,
      a: Math.random() * Math.PI * 2,
      av: (Math.random() - 0.5) * 0.02,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    function drawCoin(x, y, r, a) {
      // coin circle
      const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.2, x, y, r);
      grad.addColorStop(0, "#ffea8a");
      grad.addColorStop(1, "#f59e0b");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.stroke();
      // BTC glyph
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a);
      ctx.fillStyle = "#1f2937";
      ctx.font = `${Math.floor(r)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("₿", 0, 0);
      ctx.restore();
    }

    function step() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // gradient background
      const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      grad.addColorStop(0, "rgba(245, 158, 11, 0.10)");
      grad.addColorStop(1, "rgba(59,130,246,0.06)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // move & draw coins
      for (const c of coins) {
        c.x += c.vx; c.y += c.vy; c.a += c.av;
        if (c.x < 0 || c.x > rect.width) c.vx *= -1;
        if (c.y < 20 || c.y > rect.height - 20) c.vy *= -1;
        drawCoin(c.x, c.y, c.r, c.a);
      }

      // occasional spark connections (PoW flair)
      for (let i = 0; i < coins.length; i++) {
        for (let j = i + 1; j < coins.length; j++) {
          const a = coins[i], b = coins[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < 180*180 && Math.random() < 0.015) {
            ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(step);
    }

    resize();
    step();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas className={className} ref={ref} />;
}
