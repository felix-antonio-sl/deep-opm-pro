import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { crearBugCaptureRequestHandler } from "../src/server/bugCapture";

const ENDPOINT = "/__deep-opm/bug-reports";
const SCRIPT_DIR = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = process.env.BUG_CAPTURE_REPO_ROOT ?? path.resolve(SCRIPT_DIR, "..", "..");
const BUGS_ROOT = process.env.BUG_CAPTURE_BUGS_ROOT ?? path.join(REPO_ROOT, "docs", "bugs");
const HOST = process.env.BUG_CAPTURE_HOST ?? "0.0.0.0";
const PORT = Number(process.env.BUG_CAPTURE_PORT ?? "3000");

const bugCaptureHandler = crearBugCaptureRequestHandler({
  repoRoot: REPO_ROOT,
  bugsRoot: BUGS_ROOT,
});

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname === "/healthz") {
    responderJson(res, 200, { ok: true });
    return;
  }
  if (url.pathname === ENDPOINT) {
    bugCaptureHandler(req, res);
    return;
  }
  responderJson(res, 404, { error: "Not found" });
});

server.listen(PORT, HOST, () => {
  console.log(`bug-capture-api listening on http://${HOST}:${PORT}`);
});

function responderJson(res: import("node:http").ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}
