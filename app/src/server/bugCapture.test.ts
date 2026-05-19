import { Buffer } from "node:buffer";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "bun:test";
import { crearBugCaptureRequestHandler } from "./bugCapture";

const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64",
);

let cleanup: (() => Promise<void>) | null = null;

afterEach(async () => {
  await cleanup?.();
  cleanup = null;
});

describe("bugCapture server handler", () => {
  test("persiste reporte y screenshots bajo docs/bugs con respuesta referenciable", async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), "deep-opm-bug-capture-"));
    cleanup = () => rm(repoRoot, { recursive: true, force: true });
    const server = await levantarServidor(repoRoot);

    try {
      const response = await fetch(`${server.url}/__deep-opm/bug-reports`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text: "El canvas pierde el halo al reordenar.",
          context: { modeloNombre: "Modelo test", opdActivoId: "opd-1" },
          screenshots: [{
            name: "CleanShot 2026/Canvas.png",
            type: "image/png",
            dataUrl: `data:image/png;base64,${PNG_1X1.toString("base64")}`,
          }],
        }),
      });

      expect(response.status).toBe(201);
      const body = await response.json() as Record<string, unknown>;
      expect(body).toEqual({
        id: "BUG-20260519T010203Z-abc123",
        path: "docs/bugs/BUG-20260519T010203Z-abc123/report.md",
        directory: "docs/bugs/BUG-20260519T010203Z-abc123",
        screenshots: 1,
      });

      const report = await readFile(path.join(repoRoot, String(body.path)), "utf8");
      expect(report).toContain("El canvas pierde el halo al reordenar.");
      expect(report).toContain("screenshots/01-cleanshot-2026-canvas.png");

      const payload = JSON.parse(await readFile(path.join(repoRoot, String(body.directory), "payload.json"), "utf8")) as Record<string, unknown>;
      expect(payload.context).toEqual({ modeloNombre: "Modelo test", opdActivoId: "opd-1" });
    } finally {
      await server.close();
    }
  });

  test("rechaza metodos no POST y payloads sin texto", async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), "deep-opm-bug-capture-"));
    cleanup = () => rm(repoRoot, { recursive: true, force: true });
    const server = await levantarServidor(repoRoot);

    try {
      const getResponse = await fetch(`${server.url}/__deep-opm/bug-reports`);
      expect(getResponse.status).toBe(405);

      const postResponse = await fetch(`${server.url}/__deep-opm/bug-reports`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: "   ", screenshots: [] }),
      });
      expect(postResponse.status).toBe(400);
      await expect(postResponse.json()).resolves.toEqual({ error: "Texto requerido" });
    } finally {
      await server.close();
    }
  });
});

async function levantarServidor(repoRoot: string): Promise<{ url: string; close: () => Promise<void> }> {
  const handler = crearBugCaptureRequestHandler({
    repoRoot,
    now: () => new Date("2026-05-19T01:02:03.000Z"),
    randomHex: () => "abc123",
  });
  const server = createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No se pudo levantar servidor de prueba");
  return {
    url: `http://127.0.0.1:${address.port}`,
    close: () => cerrarServidor(server),
  };
}

function cerrarServidor(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
}
