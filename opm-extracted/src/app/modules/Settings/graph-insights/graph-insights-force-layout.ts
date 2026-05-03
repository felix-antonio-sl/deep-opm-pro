// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/graph-insights/graph-insights-force-layout.ts
// Extracted by opm-extracted/tools/extract.mjs

/**
 * Simple Fruchterman–Reingold–style force layout for small preview graphs (no extra deps).
 * Suitable for ~100 nodes in the browser.
 */
const graph_insights_force_layout_clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
/**
 * Mutates positions in-place on the nodes array (expects x,y initialized).
 */
function runForceDirectedLayout(nodes, edges, width, height, options) {
  const iterations = options?.iterations ?? 100;
  const margin = options?.margin ?? 36;
  const repMul = options?.repulsionMultiplier ?? 1;
  const attMul = options?.attractionMultiplier ?? 1;
  const clampToBounds = options?.clampToBounds ?? true;
  const recenterEvery = options?.recenterInterval ?? 0;
  const n = nodes.length;
  if (n === 0) {
    return;
  }
  const area = Math.max(1, (width - margin * 2) * (height - margin * 2));
  const k = Math.sqrt(area / n);
  const pos = new Map(nodes.map(nd => [nd.id, nd]));
  const disp = new Map();
  const ensureDisp = id => {
    if (!disp.has(id)) {
      disp.set(id, {
        dx: 0,
        dy: 0
      });
    }
    return disp.get(id);
  };
  for (let iter = 0; iter < iterations; iter++) {
    for (const nd of nodes) {
      disp.set(nd.id, {
        dx: 0,
        dy: 0
      });
    }
    // Repulsion between all pairs
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        const distSq = dx * dx + dy * dy || 0.0001;
        const dist = Math.sqrt(distSq);
        const force = k * k / dist * repMul;
        const fx = dx / dist * force;
        const fy = dy / dist * force;
        const da = ensureDisp(a.id);
        const db = ensureDisp(b.id);
        da.dx += fx;
        da.dy += fy;
        db.dx -= fx;
        db.dy -= fy;
      }
    }
    // Attraction along edges
    for (const e of edges) {
      const s = pos.get(e.source);
      const t = pos.get(e.target);
      if (!s || !t) {
        continue;
      }
      let dx = t.x - s.x;
      let dy = t.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
      const force = dist * dist / k * 0.04 * attMul;
      const fx = dx / dist * force;
      const fy = dy / dist * force;
      const ds = ensureDisp(e.source);
      const dt = ensureDisp(e.target);
      ds.dx += fx;
      ds.dy += fy;
      dt.dx -= fx;
      dt.dy -= fy;
    }
    const temperature = (1 - iter / iterations) * 0.65 + 0.05;
    const limit = (14 + n * 0.02) * temperature;
    for (const nd of nodes) {
      const d = disp.get(nd.id) || {
        dx: 0,
        dy: 0
      };
      const mag = Math.sqrt(d.dx * d.dx + d.dy * d.dy) || 1;
      const scale = Math.min(mag, limit) / mag;
      nd.x += d.dx * scale * temperature;
      nd.y += d.dy * scale * temperature;
      if (clampToBounds) {
        nd.x = graph_insights_force_layout_clamp(nd.x, margin, width - margin);
        nd.y = graph_insights_force_layout_clamp(nd.y, margin, height - margin);
      }
    }
    if (recenterEvery > 0 && (iter + 1) % recenterEvery === 0) {
      let sx = 0;
      let sy = 0;
      for (const nd of nodes) {
        sx += nd.x;
        sy += nd.y;
      }
      sx /= n;
      sy /= n;
      const tx = width / 2 - sx;
      const ty = height / 2 - sy;
      for (const nd of nodes) {
        nd.x += tx;
        nd.y += ty;
      }
    }
  }
}