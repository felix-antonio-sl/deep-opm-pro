import { Buffer } from "node:buffer";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "bun:test";
import { crearBugCaptureRequestHandler } from "./bugCapture";
import { actualizarIndiceBugs } from "./bugIndex";

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
      expect(report).toContain("**Tipo**: Bug");
      expect(report).toContain("**Estado**: Nuevo");
      expect(report).toContain("**Resolución**: Pendiente.");
      expect(report).toContain("screenshots/01-cleanshot-2026-canvas.png");

      const payload = JSON.parse(await readFile(path.join(repoRoot, String(body.directory), "payload.json"), "utf8")) as Record<string, unknown>;
      expect(payload.type).toBe("Bug");
      expect(payload.status).toBe("Nuevo");
      expect(payload.resolution).toBe("Pendiente.");
      expect(payload.context).toEqual({ modeloNombre: "Modelo test", opdActivoId: "opd-1" });

      const index = await readFile(path.join(repoRoot, "docs", "bugs", "INDEX.md"), "utf8");
      expect(index).toContain("[BUG-20260519T010203Z-abc123](BUG-20260519T010203Z-abc123/report.md)");
      expect(index).toContain("| Nuevo | 1 |");
      expect(index).toContain("| Bug | 1 |");
      expect(index).toContain("| Bug | Nuevo | [BUG-20260519T010203Z-abc123](BUG-20260519T010203Z-abc123/report.md) |");
      const history = await readFile(path.join(repoRoot, "docs", "bugs", "HISTORY.md"), "utf8");
      expect(history).toContain("| Activo | Bug | Nuevo | [BUG-20260519T010203Z-abc123](BUG-20260519T010203Z-abc123/report.md) |");
    } finally {
      await server.close();
    }
  });

  test("expone ledger por GET y rechaza payloads sin texto", async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), "deep-opm-bug-capture-"));
    cleanup = () => rm(repoRoot, { recursive: true, force: true });
    const bugDir = path.join(repoRoot, "docs", "bugs", "BUG-20260523T185803Z-a0d7bc");
    await mkdir(bugDir, { recursive: true });
    await writeFile(path.join(bugDir, "payload.json"), JSON.stringify({
      id: "BUG-20260523T185803Z-a0d7bc",
      type: "Feat",
      status: "Resuelto",
      resolution: "Visible en UI.",
      createdAt: "2026-05-23T18:58:03.717Z",
      text: "que exista una lista de los bugs y su estado para no repetirnos",
      screenshots: [],
    }, null, 2));
    await writeFile(path.join(bugDir, "report.md"), "# BUG-20260523T185803Z-a0d7bc\n");
    const server = await levantarServidor(repoRoot);

    try {
      const getResponse = await fetch(`${server.url}/__deep-opm/bug-reports`);
      expect(getResponse.status).toBe(200);
      const ledger = await getResponse.json() as {
        active: Array<{ id: string; status: string; resolution: string }>;
        history: Array<{ id: string }>;
        counts: { active: number; history: number };
      };
      expect(ledger.active[0]).toMatchObject({
        id: "BUG-20260523T185803Z-a0d7bc",
        status: "Resuelto",
        resolution: "Visible en UI.",
      });
      expect(ledger.counts).toEqual({ active: 1, history: 1 });

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

  test("indice de bugs respeta estado y nota desde statuses.json", async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), "deep-opm-bug-capture-"));
    cleanup = () => rm(repoRoot, { recursive: true, force: true });
    const bugDir = path.join(repoRoot, "docs", "bugs", "BUG-20260523T185803Z-a0d7bc");
    await mkdir(bugDir, { recursive: true });
    await writeFile(path.join(bugDir, "payload.json"), JSON.stringify({
      id: "BUG-20260523T185803Z-a0d7bc",
      createdAt: "2026-05-23T18:58:03.717Z",
      text: "que exista una lista de los bugs y su estado para no repetirnos",
      context: { modeloNombre: "HODOM", opdActivoNombre: "SD1" },
      screenshots: [],
    }, null, 2));
    await writeFile(path.join(bugDir, "report.md"), "# BUG-20260523T185803Z-a0d7bc\n");
    await writeFile(path.join(repoRoot, "docs", "bugs", "statuses.json"), JSON.stringify({
      "BUG-20260523T185803Z-a0d7bc": {
        type: "Feat",
        status: "Resuelto",
        resolution: "Indice vivo generado y validado.",
        note: "Indice vivo generado.",
      },
    }, null, 2));

    const result = await actualizarIndiceBugs({
      repoRoot,
      bugsRoot: path.join(repoRoot, "docs", "bugs"),
    });

    expect(result.entries).toBe(1);
    const index = await readFile(result.path, "utf8");
    expect(index).toContain("| Feat | Resuelto | [BUG-20260523T185803Z-a0d7bc](BUG-20260523T185803Z-a0d7bc/report.md) | 2026-05-23 18:58Z | HODOM / SD1 |");
    expect(index).toContain("Indice vivo generado y validado.");
    expect(index).toContain("Indice vivo generado.");
  });

  test("historico incluye bugs archivados y estado de resolucion desde README de archivo", async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), "deep-opm-bug-capture-"));
    cleanup = () => rm(repoRoot, { recursive: true, force: true });
    const activeDir = path.join(repoRoot, "docs", "bugs", "BUG-20260523T185803Z-a0d7bc");
    const archivedDir = path.join(repoRoot, "docs", "bugs", "archive", "2026-05", "BUG-20260507T165507Z-19b234");
    await mkdir(activeDir, { recursive: true });
    await mkdir(archivedDir, { recursive: true });
    await writeFile(path.join(activeDir, "payload.json"), JSON.stringify({
      id: "BUG-20260523T185803Z-a0d7bc",
      createdAt: "2026-05-23T18:58:03.717Z",
      text: "que exista una lista de los bugs y su estado para no repetirnos",
      screenshots: [],
    }, null, 2));
    await writeFile(path.join(activeDir, "report.md"), "# BUG-20260523T185803Z-a0d7bc\n");
    await writeFile(path.join(archivedDir, "payload.json"), JSON.stringify({
      id: "BUG-20260507T165507Z-19b234",
      createdAt: "2026-05-07T16:55:07.000Z",
      text: "No entiendo como crear cosas nuevas.",
      screenshots: [],
    }, null, 2));
    await writeFile(path.join(archivedDir, "report.md"), "# BUG-20260507T165507Z-19b234\n");
    await writeFile(path.join(repoRoot, "docs", "bugs", "archive", "2026-05", "README.md"), [
      "# Archivo",
      "",
      "| Bug ID corto | Commit | Cierre |",
      "|---|---|---|",
      "| 19b234 | dd315ec | fix(ui): aclara creacion continua |",
    ].join("\n"));

    const result = await actualizarIndiceBugs({
      repoRoot,
      bugsRoot: path.join(repoRoot, "docs", "bugs"),
    });

    expect(result.activeEntries).toBe(1);
    expect(result.historyEntries).toBe(2);
    const history = await readFile(result.historyPath, "utf8");
    expect(history).toContain("| Histórico | Bug | Resuelto | [BUG-20260507T165507Z-19b234](archive/2026-05/BUG-20260507T165507Z-19b234/report.md) |");
    expect(history).toContain("dd315ec; fix(ui): aclara creacion continua");
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
