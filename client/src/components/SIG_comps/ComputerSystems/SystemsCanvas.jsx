import React, { useEffect, useRef } from "react";

// Systems + Bitcoin hybrid: datacenter nodes with packet pulses, CPU spinners, and subtle ₿ workloads
export default function SystemsCanvas({ className = "" }) {
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

    // --- Layout primitives in normalized space (0..1) so resize stays stable ---
  const nodeCount = 9; // reduced nodes to make IoT/cloud stand out
    const nodes = Array.from({ length: nodeCount }).map(() => ({
      x: 0.1 + Math.random() * 0.8,
      y: 0.15 + Math.random() * 0.6,
      r: 3 + Math.random() * 2,
    }));

    // Precompute edges: connect each node to fewer nearest neighbors
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      const dists = nodes
        .map((n, j) => ({ j, d: (n.x - nodes[i].x) ** 2 + (n.y - nodes[i].y) ** 2 }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const { j } of dists) {
        const a = Math.min(i, j), b = Math.max(i, j);
        if (!edges.find((e) => e.a === a && e.b === b)) edges.push({ a, b });
      }
    }

    // Packets travelling along edges
  const packets = Array.from({ length: 14 }).map(() => newPacket()); // fewer packets
    function newPacket() {
      const e = edges[Math.floor(Math.random() * edges.length)];
      const dir = Math.random() < 0.5 ? 1 : -1;
      return { e, t: Math.random(), v: 0.004 + Math.random() * 0.006, dir };
    }

    // CPU spinners: simple rotating arcs to hint schedulers/cores
    const spinners = Array.from({ length: 2 }).map(() => ({ // fewer CPU rings
      x: 0.15 + Math.random() * 0.7,
      y: 0.15 + Math.random() * 0.6,
      r: 14 + Math.random() * 10,
      a: Math.random() * Math.PI * 2,
      av: (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? -1 : 1),
      tasks: Array.from({ length: 3 }).map(() => ({ // fewer tasks per ring
        a: Math.random() * Math.PI * 2,
        av: (0.01 + Math.random() * 0.02) * (Math.random() < 0.5 ? -1 : 1),
      })),
    }));

    // Subtle bitcoin coins orbiting a few nodes to signal workloads
    const coinAnchors = [nodes[2], nodes[5], nodes[8]];
    const coins = coinAnchors.map((anchor, i) => ({
      anchorIdx: nodes.indexOf(anchor),
      a: Math.random() * Math.PI * 2,
      av: 0.02 + Math.random() * 0.02,
      radius: 10 + i * 2,
      glyphR: 8 + Math.random() * 3,
    }));

    // IoT devices around the periphery sending bursts into the network
  const iotCount = 10; // more IoT/WiFi devices
    const iotDevices = Array.from({ length: iotCount }).map(() => {
      // place near borders
      const side = Math.floor(Math.random() * 4);
      let x = Math.random();
      let y = Math.random();
      const margin = 0.06;
      if (side === 0) y = margin; // top
      if (side === 1) x = 1 - margin; // right
      if (side === 2) y = 1 - margin; // bottom
      if (side === 3) x = margin; // left
      // nearest node target
      let nearestIdx = 0;
      let bestD = Infinity;
      nodes.forEach((n, idx) => {
        const d = (n.x - x) * (n.x - x) + (n.y - y) * (n.y - y);
        if (d < bestD) { bestD = d; nearestIdx = idx; }
      });
      return {
        x, y,
        phase: Math.random() * Math.PI * 2,
        cooldown: Math.random() * 120 + 60, // frames
        targetIdx: nearestIdx,
      };
    });

    const iotBursts = [];
    function spawnIoTBurst(dev) {
      const tn = nodes[dev.targetIdx];
      iotBursts.push({
        x: dev.x, y: dev.y,
        tx: tn.x, ty: tn.y,
        t: 0,
        v: 0.02 + Math.random() * 0.02,
      });
    }

    // Multiple Cloud "datacenters" with uplinks to nearest nodes
    const clouds = Array.from({ length: 3 }).map((_, i) => ({
      x: 0.7 + Math.random() * 0.25,
      y: 0.1 + i * 0.09 + Math.random() * 0.04,
      r: 0.05 + Math.random() * 0.02,
    }));
    const cloudLinks = clouds.map((cloud) =>
      nodes
        .map((n, idx) => ({ idx, d: (n.x - cloud.x) ** 2 + (n.y - cloud.y) ** 2 }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .map((o) => o.idx)
    );
    const cloudBursts = [];
    function spawnCloudBurstFrom(ci) {
      const cloud = clouds[ci];
      const links = cloudLinks[ci];
      const targetIdx = links[Math.floor(Math.random() * links.length)];
      const tn = nodes[targetIdx];
      cloudBursts.push({
        x: cloud.x, y: cloud.y,
        tx: tn.x, ty: tn.y,
        t: 0,
        v: 0.015 + Math.random() * 0.015,
      });
    }

    function drawNode(x, y, r) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59,130,246,0.7)"; // blue node
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.stroke();
    }

    function drawCPU(x, y, r, a) {
      // outer ring
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(16,185,129,0.5)"; // emerald
      ctx.lineWidth = 2;
      ctx.stroke();

      // rotating wedges
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a);
      ctx.strokeStyle = "rgba(59,130,246,0.6)";
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, r - 3, i * (2 * Math.PI) / 3, i * (2 * Math.PI) / 3 + Math.PI / 6);
        ctx.stroke();
      }
      ctx.restore();

      // pins (hint of CPU package)
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(x + (r + 4) * Math.cos(ang), y + (r + 4) * Math.sin(ang), 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(107,114,128,0.6)"; // gray-500
        ctx.fill();
      }

      // Note: OS scheduler task markers are rendered in the main loop to avoid
      // coupling drawCPU with external state and to keep this function stateless.
    }

    function drawCoin(x, y, r, rot) {
      const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.2, x, y, r);
      grad.addColorStop(0, "#ffea8a");
      grad.addColorStop(1, "#f59e0b");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = "#1f2937"; // gray-800
      ctx.font = `${Math.max(10, Math.floor(r))}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("₿", 0, 0);
      ctx.restore();
    }

    function drawCloudShape(x, y, size) {
      // simple cloud blob
      const r = size;
      ctx.fillStyle = "rgba(59,130,246,0.12)";
      ctx.strokeStyle = "rgba(59,130,246,0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x - r * 0.6, y, r * 0.6, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(x, y - r * 0.5, r * 0.7, Math.PI, 0);
      ctx.arc(x + r * 0.6, y, r * 0.6, Math.PI * 1.5, Math.PI * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    function drawWiFiDevice(x, y, scale = 1) {
      // small circle with wifi arcs
      ctx.fillStyle = "rgba(2,6,23,0.8)"; // slate-950
      ctx.beginPath();
      ctx.arc(x, y, 3 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(59,130,246,0.6)";
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(x, y - 2 * scale, 5 * i * scale, Math.PI , Math.PI + .8* Math.PI );
        ctx.stroke();
      }
    }

    function step() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Subtle gradient background
      const bg = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      bg.addColorStop(0, "rgba(59,130,246,0.06)");
      bg.addColorStop(1, "rgba(16,185,129,0.05)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Edges
      ctx.lineWidth = 1;
      for (const { a, b } of edges) {
        const na = nodes[a], nb = nodes[b];
        const x1 = na.x * rect.width, y1 = na.y * rect.height;
        const x2 = nb.x * rect.width, y2 = nb.y * rect.height;
        ctx.strokeStyle = "rgba(2,6,23,0.15)"; // slate-950/15
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }

      // Nodes
      for (const n of nodes) drawNode(n.x * rect.width, n.y * rect.height, n.r);

      // Packets moving along edges
      for (const p of packets) {
        p.t += p.v * p.dir;
        if (p.t <= 0 || p.t >= 1) {
          // new journey
          const np = newPacket();
          p.e = np.e; p.t = 0; p.v = np.v; p.dir = np.dir;
        }
        const na = nodes[p.e.a], nb = nodes[p.e.b];
        const x = (na.x + (nb.x - na.x) * p.t) * rect.width;
        const y = (na.y + (nb.y - na.y) * p.t) * rect.height;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(16,185,129,0.9)"; // emerald packet
        ctx.fill();
      }

      // CPU spinners
      for (const s of spinners) {
        s.a += s.av;
        const x = s.x * rect.width, y = s.y * rect.height;
        drawCPU(x, y, s.r, s.a);
        // draw scheduler tasks
        for (const tsk of s.tasks) {
          tsk.a += tsk.av;
          const tx = x + (s.r - 5) * Math.cos(tsk.a);
          const ty = y + (s.r - 5) * Math.sin(tsk.a);
          ctx.beginPath();
          ctx.arc(tx, ty, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(99,102,241,0.9)"; // indigo task
          ctx.fill();
        }
      }

      // Orbiting coins as workloads near their anchor nodes
    //   coins.forEach((c) => {
    //     c.a += c.av * 0.5;
    //     const anchor = nodes[c.anchorIdx];
    //     const ax = anchor.x * rect.width, ay = anchor.y * rect.height;
    //     const x = ax + c.radius * Math.cos(c.a);
    //     const y = ay + c.radius * Math.sin(c.a);
    //     drawCoin(x, y, c.glyphR, c.a * 2);
    //   });

      // IoT devices with bursts towards nearest nodes
      for (const dev of iotDevices) {
        dev.phase += 0.06;
        dev.cooldown -= 1;
        const dx = dev.x * rect.width;
        const dy = dev.y * rect.height;
        drawWiFiDevice(dx, dy, 0.9 + 0.1 * Math.sin(dev.phase));
        if (dev.cooldown <= 0) {
          spawnIoTBurst(dev);
          dev.cooldown = 90 + Math.random() * 120;
        }
      }

      for (let i = iotBursts.length - 1; i >= 0; i--) {
        const b = iotBursts[i];
        b.t += b.v;
        if (b.t >= 1) { iotBursts.splice(i, 1); continue; }
        const x = (b.x + (b.tx - b.x) * b.t) * rect.width;
        const y = (b.y + (b.ty - b.y) * b.t) * rect.height;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59,130,246,0.95)"; // blue pulse
        ctx.fill();
      }

      // Clouds with links and function pulses
      ctx.strokeStyle = "rgba(59,130,246,0.35)";
      for (let ci = 0; ci < clouds.length; ci++) {
        const c = clouds[ci];
        const cx = c.x * rect.width, cy = c.y * rect.height;
        drawCloudShape(cx, cy, c.r * Math.min(rect.width, rect.height));
        for (const idx of cloudLinks[ci]) {
          const n = nodes[idx];
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(n.x * rect.width, n.y * rect.height);
          ctx.stroke();
        }
      }

      // occasionally spawn cloud bursts from random clouds
      if (Math.random() < 0.03 && cloudBursts.length < 12) {
        spawnCloudBurstFrom(Math.floor(Math.random() * clouds.length));
      }
      for (let i = cloudBursts.length - 1; i >= 0; i--) {
        const b = cloudBursts[i];
        b.t += b.v;
        if (b.t >= 1) { cloudBursts.splice(i, 1); continue; }
        const x = (b.x + (b.tx - b.x) * b.t) * rect.width;
        const y = (b.y + (b.ty - b.y) * b.t) * rect.height;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37,99,235,0.9)"; // blue-600
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    }

    function onResize() { resize(); }
    resize();
    step();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas className={className} ref={ref} />;
}
