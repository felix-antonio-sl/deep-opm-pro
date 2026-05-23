import path from "node:path";
import { fileURLToPath } from "node:url";
import { actualizarIndiceBugs } from "../src/server/bugIndex";

const SCRIPT_DIR = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = process.env.BUG_CAPTURE_REPO_ROOT ?? path.resolve(SCRIPT_DIR, "..", "..");
const BUGS_ROOT = process.env.BUG_CAPTURE_BUGS_ROOT ?? path.join(REPO_ROOT, "docs", "bugs");

const result = await actualizarIndiceBugs({
  repoRoot: REPO_ROOT,
  bugsRoot: BUGS_ROOT,
});

console.log(
  `bug index actualizado: ${path.relative(REPO_ROOT, result.path)} ` +
  `(${result.activeEntries} activos, ${result.historyEntries} historicos)`,
);
