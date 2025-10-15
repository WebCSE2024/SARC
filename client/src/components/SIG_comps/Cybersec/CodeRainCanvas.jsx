import React, { useEffect, useRef } from "react";

// Matrix-style code rain, optimized for hero backgrounds
export default function CodeRainCanvas({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const glyphs = "01$#@*&^%{}[]<>/\\|+=-~".split("");
    let columns = [];

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * DPR;
      canvas.height = rect.height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const fontSize = 14;
      const cols = Math.floor(rect.width / fontSize);
      columns = new Array(cols).fill(0).map(() => ({ y: Math.random() * rect.height, speed: 2 + Math.random() * 2 }));
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
    }

    function step() {
      const rect = canvas.getBoundingClientRect();
      // trail
      ctx.fillStyle = "rgba(2,6,23,0.6)";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "rgba(34,197,94,0.9)";

      const fontSize = 14;
      for (let i = 0; i < columns.length; i++) {
        const x = i * fontSize;
        const col = columns[i];
        const char = glyphs[(Math.random() * glyphs.length) | 0];
        ctx.fillText(char, x, col.y);
        col.y += col.speed;
        if (col.y > rect.height + 20) {
          col.y = -20;
          col.speed = 2 + Math.random() * 2;
        }
      }
      raf = requestAnimationFrame(step);
    }

    resize();
    step();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas className={className} ref={ref} />;
}
