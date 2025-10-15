import React, { useEffect, useRef } from "react";

// Theoretical CS canvas: quantum gates (right-top), discrete graph (right-bottom),
// and Big-O complexity curves (left) for clearer explanation
export default function TheoryCanvas({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let raf;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * DPR;
      canvas.height = rect.height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    // Quantum area state
    const q = {
      t: 0,
      lines: 3,
      speed: 0.015,
      gates: Array.from({ length: 8 }).map((_, i) => ({
        col: Math.random() * 0.9 + 0.05,
        row: Math.floor(Math.random() * 3),
        type: ["H", "X", "Z", "CNOT"][Math.floor(Math.random() * 4)],
      })),
    };

    // Discrete graph (small) — shifted to the right-bottom quadrant
    // Removed discrete graph as per the new design
    // Small animation states
    const pnp = { t: 0 };
    const complexityLabels = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)"];
    // Precompute random, non-overlapping normalized positions near the left edge
    function generateComplexityPositions() {
      const pts = [];
      for (let i = 0; i < complexityLabels.length; i++) {
        let tries = 0;
        let px, py;
        do {
          // keep clear of heading area: y from 0.38..0.9; leftmost x 0.02..0.18
          px = 0.5 + Math.random() * 0.2;
          py = 0.02 + Math.random() * 0.7;
          tries++;
        } while (
          pts.some((p) => {
            const dx = p.x - px, dy = p.y - py;
            return dx * dx + dy * dy < 0.02 * 0.02; // minimal separation
          }) && tries < 40
        );
        pts.push({ x: px, y: py });
      }
      return pts;
    }
    const complexityPos = generateComplexityPositions();

    function drawQuantum(rect) {
      // Smaller, right-top quantum area (with extra spacing from others)
      const left = rect.width * 0.64;
      const top = rect.height * 0.14;
      const width = rect.width * 0.26;
      const height = rect.height * 0.24;

      // wires
      ctx.strokeStyle = "rgba(99,102,241,0.6)"; // indigo
      ctx.lineWidth = 1.5;
      for (let r = 0; r < q.lines; r++) {
        const y = top + (r / (q.lines - 1)) * height;
        ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(left + width, y); ctx.stroke();
      }

      // gates
      for (const g of q.gates) {
        const gx = left + g.col * width + (Math.sin(q.t + g.col * 6) * 0.003) * rect.width;
        const gy = top + (g.row / (q.lines - 1)) * height;
        ctx.fillStyle = "rgba(236,72,153,0.12)"; // pink box
        ctx.strokeStyle = "rgba(236,72,153,0.6)";
        const w = 24, h = 18;
        ctx.fillRect(gx - w / 2, gy - h / 2, w, h);
        ctx.strokeRect(gx - w / 2, gy - h / 2, w, h);
        ctx.fillStyle = "#111827";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(g.type, gx, gy);

        // simple CNOT visual connection
        if (g.type === "CNOT" && q.lines > 1) {
          const tgt = (g.row + 1) % q.lines;
          const ty = top + (tgt / (q.lines - 1)) * height;
          ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, ty); ctx.stroke();
          ctx.beginPath(); ctx.arc(gx, ty, 3, 0, Math.PI * 2); ctx.stroke();
        }
      }

      // Bloch-like spinner
  const bx = left + width * 0.78;
      const by = top + height * 0.5;
  const br = 18;
      ctx.strokeStyle = "rgba(99,102,241,0.5)";
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(bx, by, br, br * 0.45, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.save(); ctx.translate(bx, by); ctx.rotate(q.t * 1.6);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(br * 0.9, 0); ctx.stroke();
      ctx.restore();
      // Label for accessibility/clarity
      const label = "Quantum circuit";
      ctx.font = "11px sans-serif";
      ctx.textBaseline = "top"; ctx.textAlign = "left";
      const lx = left; const ly = top - 16;
      // optional soft background under label
      const metrics = ctx.measureText(label);
      const lw = metrics.width + 10; const lh = 14;
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillRect(lx - 4, ly - 2, lw, lh);
      ctx.fillStyle = "#111827";
      ctx.fillText(label, lx + 1, ly);
    }



    function drawComplexityTexts(rect) {
      // Randomly spread near the left edge
      ctx.font = "11px sans-serif";
      ctx.textBaseline = "middle"; ctx.textAlign = "left";
      complexityLabels.forEach((label, idx) => {
        const pos = complexityPos[idx];
        const x = pos.x * rect.width;
        const y = pos.y * rect.height;
        const w = ctx.measureText(label).width;
        const padX = 8, padY = 6;
        const x1 = x, x2 = x + w + padX * 2;
        const y1 = y - padY, h = padY * 2;
        ctx.fillStyle = "rgba(255,255,255,0.78)";
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.beginPath();
        const r = 8;
        ctx.moveTo(x1 + r, y1);
        ctx.lineTo(x2 - r, y1);
        ctx.quadraticCurveTo(x2, y1, x2, y1 + r);
        ctx.lineTo(x2, y1 + h - r);
        ctx.quadraticCurveTo(x2, y1 + h, x2 - r, y1 + h);
        ctx.lineTo(x1 + r, y1 + h);
        ctx.quadraticCurveTo(x1, y1 + h, x1, y1 + h - r);
        ctx.lineTo(x1, y1 + r);
        ctx.quadraticCurveTo(x1, y1, x1 + r, y1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#111827"; ctx.fillText(label, x + padX, y);
      });
    }

    function drawAutomaton(rect) {
      // Small DFA-like diagram on the right-middle, spaced from quantum
      const cx = rect.width * 0.78 ;
      const cy = rect.height * 0.58 -100;
      const r = 12;
      const states = [
        { x: cx - 40, y: cy, label: "q0", accept: false },
        { x: cx, y: cy, label: "q1", accept: true },
        { x: cx + 45, y: cy, label: "q2", accept: false },
      ];

      // transitions
      ctx.strokeStyle = "rgba(2,6,23,0.45)"; ctx.lineWidth = 1.2;
      function arrow(x1, y1, x2, y2, text) {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        // arrowhead
        const ang = Math.atan2(y2 - y1, x2 - x1);
        const ah = 6;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - ah * Math.cos(ang - 0.4), y2 - ah * Math.sin(ang - 0.4));
        ctx.lineTo(x2 - ah * Math.cos(ang + 0.4), y2 - ah * Math.sin(ang + 0.4));
        ctx.closePath(); ctx.fillStyle = "rgba(2,6,23,0.45)"; ctx.fill();
        // label
        if (text) {
          ctx.font = "10px sans-serif";
          ctx.textAlign = "center"; ctx.textBaseline = "bottom";
          ctx.fillStyle = "#111827";
          ctx.fillText(text, (x1 + x2) / 2, (y1 + y2) / 2 - 4);
        }
      }

      arrow(states[0].x + r, states[0].y, states[1].x - r, states[1].y, "0");
      arrow(states[1].x + r, states[1].y, states[2].x - r, states[2].y, "1");
      // loop on q1
      ctx.beginPath();
      ctx.arc(states[1].x, states[1].y - r - 10, 8, Math.PI * 0.2, Math.PI * 1.8);
      ctx.stroke();
      ctx.font = "10px sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillStyle = "#111827"; ctx.fillText("1", states[1].x + 10, states[1].y - r - 10);

      // states
      for (const s of states) {
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.strokeStyle = "rgba(2,6,23,0.45)";
        ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        if (s.accept) { ctx.beginPath(); ctx.arc(s.x, s.y, r - 3, 0, Math.PI * 2); ctx.stroke(); }
        ctx.font = "10px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#111827";
        ctx.fillText(s.label, s.x, s.y);
      }
    }

    function drawPNP(rect) {
      // Small prompt text on right-top, spaced above quantum label
      pnp.t += 0.03;
      const alpha = 0.6 + 0.2 * Math.sin(pnp.t);
      const x = rect.width * 0.80;
      const y = rect.height * 0.08;
      const label = "Is P = NP?";
      ctx.font = "12px sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      const w = ctx.measureText(label).width + 10;
      ctx.fillStyle = `rgba(255,255,255,${0.7})`;
      ctx.fillRect(x - 6, y - 9, w, 18);
      ctx.fillStyle = `rgba(17,24,39,${alpha})`;
      ctx.fillText(label, x, y);
    }

    function step() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // soft backdrop
      const bg = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      bg.addColorStop(0, "rgba(99,102,241,0.06)");
      bg.addColorStop(1, "rgba(236,72,153,0.05)");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, rect.width, rect.height);

  q.t += q.speed;
  // keep left area clean; only add small right-side visuals
  // drawQuantum(rect);
  drawAutomaton(rect);
  drawComplexityTexts(rect);
  drawPNP(rect);

      raf = requestAnimationFrame(step);
    }

    resize(); step();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas className={className} ref={ref} />;
}
