import { describe, expect, spyOn, test } from "bun:test";
import { cmdPreflightRetiro, cmdRecuperar } from "../../scripts/mesa-cli";
import { crearModelo } from "../modelo/operaciones";
import type { VersionResumen } from "../modelo/tipos";
import { exportarModelo } from "../serializacion/json";
import { crearModelPersistenceFetchHandler } from "../server/modelPersistence";
import { crearRepoMemoria } from "../server/repoMemoria";
import { crearTokenSessionResolver } from "../server/tokenSessionResolver";
import { encodeSessionIdentity, SESSION_IDENTITY_HEADER } from "../persistencia/sessionIdentity";
import { indiceVacio } from "../persistencia/workspace";

const TOKEN = "r".repeat(48);

function handler() {
  const agentResolver = crearTokenSessionResolver({ token: TOKEN, tenantId: "t", userId: "u" });
  return crearModelPersistenceFetchHandler({
    repo: crearRepoMemoria(),
    sessionResolver: {
      async resolve(request) {
        if (request.headers.get("x-test-operator") === "1") {
          return { tenantId: "t", userId: "u", auth: true, authKind: "operator" as const };
        }
        return agentResolver.resolve(request);
      },
    },
  });
}

function request(path: string, init?: RequestInit, operador = false): Request {
  return new Request(`https://x/__deep-opm${path}`, {
    ...init,
    headers: operador
      ? {
          "x-test-operator": "1",
          "content-type": "application/json",
          [SESSION_IDENTITY_HEADER]: encodeSessionIdentity({ tenantId: "t", userId: "u" }),
          ...(init?.headers ?? {}),
        }
      : { authorization: `Bearer ${TOKEN}`, "content-type": "application/json", ...(init?.headers ?? {}) },
  });
}

async function sembrarModelo(
  h: ReturnType<typeof handler>,
  id: string,
  json: string,
  nombre = "Modelo recuperable",
): Promise<void> {
  const ahora = "2026-07-21T10:00:00.000Z";
  const response = await h(request("/modelos", {
    method: "POST",
    body: JSON.stringify({ id, nombre, json, creadoEn: ahora, actualizadoEn: ahora }),
  }, true));
  expect(response.ok).toBe(true);
}

describe("mesa recuperar y preflight de retiro", () => {
  test("recuperar entrega el JSON exacto por ID sin listar ni reserializar", async () => {
    const h = handler();
    const id = "modelo con espacio";
    const json = exportarModelo(crearModelo("Recuperación exacta"), "carpeta-documental");
    await sembrarModelo(h, id, json, "Recuperación exacta");
    const paths: string[] = [];
    const api = (path: string, init?: RequestInit) => {
      paths.push(`${init?.method ?? "GET"} ${path}`);
      return h(request(path, init));
    };
    const escritos: string[] = [];
    await cmdRecuperar(id, { api, write: (contenido) => escritos.push(contenido) });
    expect(escritos).toEqual([json]);
    expect(new TextEncoder().encode(escritos[0]!).byteLength).toBe(new TextEncoder().encode(json).byteLength);
    expect(paths).toEqual(["GET /modelos/modelo%20con%20espacio"]);
  });

  test("preflight usa sólo GET, verifica recuperación/versionado y no acredita permisos de operador", async () => {
    const h = handler();
    const id = "modelo-preflight";
    const json = exportarModelo(crearModelo("Preflight"));
    await sembrarModelo(h, id, json, "Preflight");
    const indice = indiceVacio();
    indice.modelos.push({ id, carpetaId: null });
    const workspace = await h(request("/workspace", {
      method: "PUT",
      body: JSON.stringify({ indice, revisionBase: 0 }),
    }, true));
    expect(workspace.ok).toBe(true);
    const version: VersionResumen = {
      id: "version-1",
      creadoEn: "2026-07-21T10:01:00.000Z",
      nombre: "Corte recuperable",
      modeloPayloadKey: "version-1",
      bytes: new TextEncoder().encode(json).byteLength,
    };
    const versionPost = await h(request(`/modelos/${id}/versiones`, {
      method: "POST",
      body: JSON.stringify({ version, json }),
    }, true));
    expect(versionPost.ok).toBe(true);

    const paths: string[] = [];
    const api = (path: string, init?: RequestInit) => {
      paths.push(`${init?.method ?? "GET"} ${path}`);
      return h(request(path, init));
    };
    const log = spyOn(console, "log").mockImplementation(() => {});
    try {
      await cmdPreflightRetiro(id, { api });
      const output = String(log.mock.calls[0]?.[0] ?? "");
      const recibo = JSON.parse(output) as {
        estado: string;
        comprobaciones: { bundleActualRecuperable: boolean; versionRecuperable: boolean };
        viaRetiro: { actorRequerido: string; ejecutablePorTokenAgente: boolean; permisoOperadorConfirmadoEnDestino: boolean };
        recuperacionSoportada: { comando: string; argumentos: string[] };
        mutacionesEjecutadas: number;
      };
      expect(recibo.estado).toBe("requiere-operador");
      expect(recibo.comprobaciones.bundleActualRecuperable).toBe(true);
      expect(recibo.comprobaciones.versionRecuperable).toBe(true);
      expect(recibo.viaRetiro).toEqual(expect.objectContaining({
        actorRequerido: "operador",
        ejecutablePorTokenAgente: false,
        permisoOperadorConfirmadoEnDestino: false,
      }));
      expect(recibo.recuperacionSoportada).toEqual({ comando: "mesa recuperar", argumentos: [id] });
      expect(recibo.mutacionesEjecutadas).toBe(0);
      expect(paths.every((path) => path.startsWith("GET "))).toBe(true);
      expect(paths).toEqual([
        "GET /modelos/modelo-preflight",
        "GET /workspace",
        "GET /modelos/modelo-preflight/versiones",
        "GET /modelos/modelo-preflight/versiones/version-1",
      ]);
      expect(output).not.toContain('"formato"');
    } finally {
      log.mockRestore();
    }
  });
});
