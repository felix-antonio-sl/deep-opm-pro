#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(appRoot, "..");
const markdown = process.argv.includes("--markdown");
const check = process.argv.includes("--check");
const canonicalLaws = ["law-json-roundtrip", "law-render-stable-metadata", "law-refinement-thing-matrix", "law-refinement-removal", "law-opl-safe-lens", "law-store-undo-atomicity"];
const aliases = { "law-store-undo-atomicity": ["law-opl-apply-undo-atomicity"] };
const rel = (file, root = repoRoot) => path.relative(root, file).replaceAll(path.sep, "/");
const kb = (n) => Math.round((n / 1000) * 100) / 100;
const bundleBaselineGzipKb = 124.62;
const bundleAllowedGrowthGzipKb = 5;
const thresholds = {
  mainBundleMaxGzipKb: Number((bundleBaselineGzipKb + bundleAllowedGrowthGzipKb).toFixed(2)),
  mainBundleBaselineGzipKb: bundleBaselineGzipKb,
  mainBundleAllowedGrowthGzipKb: bundleAllowedGrowthGzipKb,
  activeCanonicalLawsMin: canonicalLaws.length,
  compatDetectorsMax: 0,
};

function walk(dir, predicate = () => true) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    const stat = statSync(file);
    if (stat.isDirectory()) return walk(file, predicate);
    return predicate(file) ? [file] : [];
  });
}

const lawEvidence = new Map();
for (const file of walk(path.join(appRoot, "src"), (item) => item.endsWith(".test.ts"))) {
  const text = readFileSync(file, "utf8");
  for (const [id] of text.matchAll(/\blaw-[a-z0-9-]+\b/g)) {
    const entry = lawEvidence.get(id) ?? { id, count: 0, files: new Set() };
    entry.count += 1;
    entry.files.add(rel(file));
    lawEvidence.set(id, entry);
  }
}

function evidenceFor(id) {
  return [id, ...(aliases[id] ?? [])].flatMap((candidate) => {
    const found = lawEvidence.get(candidate);
    return found ? [{ id: candidate, count: found.count, files: [...found.files] }] : [];
  });
}

const canonicalStatus = canonicalLaws.map((id) => {
  const evidence = evidenceFor(id);
  return { id, active: evidence.length > 0, evidence };
});

const compatEntries = [];
for (const dir of ["src", "e2e", "scripts"].map((name) => path.join(appRoot, name))) {
  for (const file of walk(dir, (item) => /\.(tsx?|mjs|js)$/.test(item))) {
    readFileSync(file, "utf8").split(/\r?\n/).forEach((line, index) => {
      if (/^\s*(\/\/|\/\*).*Compat detector/.test(line)) {
        compatEntries.push({ file: rel(file), line: index + 1, text: line.trim() });
      }
    });
  }
}

const distAssets = path.join(appRoot, "dist", "assets");
const jsAssets = walk(distAssets, (item) => item.endsWith(".js")).map((file) => {
  const source = readFileSync(file);
  return { file: rel(file, appRoot), rawKb: kb(source.length), gzipKb: kb(gzipSync(source).length) };
}).sort((a, b) => b.rawKb - a.rawKb);
const mainJs = jsAssets.find((asset) => /^dist\/assets\/index-.*\.js$/.test(asset.file)) ?? null;

const report = {
  schema: "deep-opm-pro.quality-ledger.metrics.v2",
  generatedAt: new Date().toISOString(),
  thresholds,
  bundle: { distPresent: existsSync(distAssets), mainJs, jsAssets },
  laws: { canonicalTotal: canonicalLaws.length, activeCanonical: canonicalStatus.filter((item) => item.active).length, missingCanonical: canonicalStatus.filter((item) => !item.active).map((item) => item.id), canonicalStatus, rawLawIds: [...lawEvidence.keys()].sort() },
  compatDetectors: { total: compatEntries.length, entries: compatEntries },
};

function gateFailures(metrics) {
  const failures = [];
  if (!metrics.bundle.distPresent) {
    failures.push("dist no existe; ejecuta bun run build antes del gate");
  } else if (!metrics.bundle.mainJs) {
    failures.push("dist no contiene bundle principal index-*.js");
  } else if (metrics.bundle.mainJs.gzipKb > thresholds.mainBundleMaxGzipKb) {
    failures.push(`bundle principal ${metrics.bundle.mainJs.gzipKb} kB gzip supera ${thresholds.mainBundleMaxGzipKb} kB`);
  }

  if (metrics.laws.activeCanonical < thresholds.activeCanonicalLawsMin) {
    failures.push(`leyes canonicas ${metrics.laws.activeCanonical}/${thresholds.activeCanonicalLawsMin}; faltan ${metrics.laws.missingCanonical.join(", ") || "sin detalle"}`);
  }

  if (metrics.compatDetectors.total > thresholds.compatDetectorsMax) {
    failures.push(`compat detectors ${metrics.compatDetectors.total}; maximo permitido ${thresholds.compatDetectorsMax}`);
  }

  return failures;
}

const failures = check ? gateFailures(report) : [];
report.gate = { checked: check, passed: !check || failures.length === 0, failures };

if (markdown) {
  console.log("# Quality ledger metrics");
  console.log(`- Main bundle: ${mainJs ? `${mainJs.rawKb} kB / ${mainJs.gzipKb} kB gzip (${mainJs.file})` : "dist not built"}`);
  console.log(`- Canonical laws: ${report.laws.activeCanonical}/${report.laws.canonicalTotal}`);
  console.log(`- Compat detectors: ${report.compatDetectors.total}`);
  if (check) {
    console.log(`- Gate: ${report.gate.passed ? "PASS" : "FAIL"}`);
    for (const failure of failures) console.log(`  - ${failure}`);
  }
} else {
  console.log(JSON.stringify(report, null, 2));
}

if (failures.length > 0) process.exitCode = 1;
