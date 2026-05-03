// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/Settings/graph-insights/graph-insights-layout-seed.ts
// Extracted by opm-extracted/tools/extract.mjs

/**
 * Initial positions for a force-directed preview: spread high-degree nodes across the canvas
 * (multi-hub / cluster feel) instead of a single circle, which tends to leave one node in the middle.
 */
function seedMultiClusterLayout(nodes, edges, width, height) {
  const n = nodes.length;
  if (n === 0) {
    return;
  }
  /** Soft inset only — positions are not snapped to the sheet border. */
  const pad = Math.min(width, height) * 0.05;
  const innerW = Math.max(1, width - pad * 2);
  const innerH = Math.max(1, height - pad * 2);
  const posById = new Map(nodes.map(nd => [nd.id, nd]));
  const deg = new Map();
  const neigh = new Map();
  for (const nd of nodes) {
    deg.set(nd.id, 0);
    neigh.set(nd.id, new Set());
  }
  for (const e of edges) {
    if (!deg.has(e.source) || !deg.has(e.target)) {
      continue;
    }
    deg.set(e.source, (deg.get(e.source) || 0) + 1);
    deg.set(e.target, (deg.get(e.target) || 0) + 1);
    neigh.get(e.source).add(e.target);
    neigh.get(e.target).add(e.source);
  }
  const byDeg = [...nodes].sort((a, b) => (deg.get(b.id) || 0) - (deg.get(a.id) || 0));
  const hubCount = Math.min(14, Math.max(6, Math.ceil(Math.sqrt(n) * 1.2)), n);
  /** Interior-only anchors (0–1 within inner box) — avoids seeding on the contour of the sheet. */
  const anchorFractions = [[0.22, 0.32], [0.78, 0.32], [0.22, 0.68], [0.78, 0.68], [0.5, 0.36], [0.5, 0.64], [0.34, 0.5], [0.66, 0.5], [0.38, 0.4], [0.62, 0.4], [0.38, 0.6], [0.62, 0.6], [0.46, 0.28], [0.54, 0.72]];
  const jitter = () => (Math.random() - 0.5) * Math.min(innerW, innerH) * 0.04;
  const placed = new Set();
  for (let i = 0; i < hubCount; i++) {
    const nd = posById.get(byDeg[i].id);
    const [ux, uy] = anchorFractions[i % anchorFractions.length];
    nd.x = pad + ux * innerW + jitter();
    nd.y = pad + uy * innerH + jitter();
    placed.add(nd.id);
  }
  const spread = Math.min(innerW, innerH) * 0.16;
  const unplaced = new Set(nodes.map(nd => nd.id));
  for (const id of placed) {
    unplaced.delete(id);
  }
  while (unplaced.size > 0) {
    let progressed = false;
    for (const id of unplaced) {
      const nbs = neigh.get(id);
      if (!nbs?.size) {
        const nd = posById.get(id);
        nd.x = pad + Math.random() * innerW;
        nd.y = pad + Math.random() * innerH;
        unplaced.delete(id);
        progressed = true;
        continue;
      }
      const anchored = [...nbs].filter(nid => !unplaced.has(nid));
      if (anchored.length === 0) {
        continue;
      }
      const p = posById.get(anchored[Math.floor(Math.random() * anchored.length)]);
      const nd = posById.get(id);
      nd.x = p.x + (Math.random() - 0.5) * spread * 2;
      nd.y = p.y + (Math.random() - 0.5) * spread * 2;
      unplaced.delete(id);
      progressed = true;
    }
    if (!progressed) {
      for (const id of unplaced) {
        const nd = posById.get(id);
        nd.x = pad + Math.random() * innerW;
        nd.y = pad + Math.random() * innerH;
      }
      unplaced.clear();
    }
  }
}