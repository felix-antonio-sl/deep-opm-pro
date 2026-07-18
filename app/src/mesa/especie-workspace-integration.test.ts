import { describe, expect, spyOn, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { crearModelPersistenceFetchHandler, type ModelPersistenceRepository } from "../server/modelPersistence";
import { crearTokenSessionResolver } from "../server/tokenSessionResolver";
import { crearRepoMemoria } from "../server/repoMemoria";
import { exportarModelo } from "../serializacion/json";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import { cmdPush } from "../../scripts/mesa-cli";
import type { WorkspaceIndice } from "../persistencia/workspace";
import { createBaseWitness, encodeBaseWitness } from "./baseWitness";
import {
  encodeSessionIdentity,
  SESSION_IDENTITY_HEADER,
} from "../persistencia/sessionIdentity";

/**
 * Regresión de las dos mecánicas de más riesgo del corte «especie vía
 * workspace» (commit 00c1fa78, `mesa-cli.ts`):
 *
 *  - GUARD BIBLIOTECA (antes código muerto): `mesa push` UPDATE debe RECHAZAR
 *    un destino marcado `esBiblioteca:true` en el índice de workspace — antes
 *    de este corte `destinoRec` nunca traía ese flag, así que `evaluarPush`
 *    jamás veía la especie "biblioteca" del destino real.
 *  - ATOMICIDAD en CREATE `--especie apunte`: el commit crea modelo+versión
 *    y marca la especie dentro de la misma operación del repositorio. El CLI
 *    no debe emitir un PUT posterior del workspace que abra una ventana de
 *    clobber sobre modelos, carpetas, recientes o preferencias.
 *
 * Mismo harness que `roundtrip.test.ts`: handler real en memoria
 * (`crearRepoMemoria` + `crearModelPersistenceFetchHandler`), `cmdPush` REAL
 * (no una reimplementación inline de sus decisiones), `process.exit`
 * interceptado con una excepción capturable para no matar el test runner.
 */

const TOKEN = "z".repeat(48);

function nuevoHandler(repo: ModelPersistenceRepository) {
  const agentResolver = crearTokenSessionResolver({ token: TOKEN, tenantId: "t", userId: "u" });
  return crearModelPersistenceFetchHandler({
    repo,
    sessionResolver: {
      async resolve(request) {
        if (request.headers.get("x-test-operator") === "1") {
          return {
            tenantId: "t",
            userId: "u",
            auth: true,
            authKind: "operator",
          };
        }
        return agentResolver.resolve(request);
      },
    },
  });
}

function req(path: string, init?: RequestInit): Request {
  return new Request(`https://x/__deep-opm${path}`, {
    ...init,
    headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json", ...(init?.headers ?? {}) },
  });
}

function reqOperador(path: string, init?: RequestInit): Request {
  return new Request(`https://x/__deep-opm${path}`, {
    ...init,
    headers: {
      "x-test-operator": "1",
      "content-type": "application/json",
      [SESSION_IDENTITY_HEADER]: encodeSessionIdentity({
        tenantId: "t",
        userId: "u",
      }),
      ...(init?.headers ?? {}),
    },
  });
}

/** Envuelve el repo en memoria con un contador de escrituras (`save`), para medir que el guard NO escribió. */
function repoConEspiaDeEscrituras(): { repo: ModelPersistenceRepository; escrituras: () => number } {
  const base = crearRepoMemoria();
  let escrituras = 0;
  const repo: ModelPersistenceRepository = {
    ...base,
    async save(session, modelo) {
      escrituras += 1;
      return base.save(session, modelo);
    },
    async commitRevision(session, commit) {
      escrituras += 1;
      return base.commitRevision!(session, commit);
    },
  };
  return { repo, escrituras: () => escrituras };
}

class SalidaProcesoSimulada extends Error {
  constructor(public codigo: number | undefined) {
    super(`process.exit(${codigo ?? ""})`);
  }
}

async function invocarCmdPush(
  ref: string,
  bundlePath: string,
  opts: { nota: string; confirmado: boolean; base?: string; especie?: "apunte" | "modelo" },
  deps: { api: (path: string, init?: RequestInit) => Promise<Response> },
): Promise<{ codigoSalida?: number }> {
  const spy = spyOn(process, "exit").mockImplementation(((codigo?: number) => {
    throw new SalidaProcesoSimulada(codigo);
  }) as never);
  try {
    await cmdPush(ref, bundlePath, opts, deps);
    return {};
  } catch (e) {
    if (e instanceof SalidaProcesoSimulada) return e.codigo === undefined ? {} : { codigoSalida: e.codigo };
    throw e;
  } finally {
    spy.mockRestore();
  }
}

describe("especie vía workspace — guard biblioteca + creación atómica (repo en memoria, sin red)", () => {
  test("guard biblioteca: cmdPush UPDATE rechaza destino esBiblioteca:true; control no-biblioteca sí escribe", async () => {
    const { repo, escrituras } = repoConEspiaDeEscrituras();
    const h = nuevoHandler(repo);
    const apiViaHandler = (path: string, init?: RequestInit) => h(req(path, init));
    const ahora = new Date().toISOString();

    // Sembrar dos modelos: "bib-1" quedará marcado esBiblioteca en el índice;
    // "ctrl-1" queda ausente del índice (especie por defecto "modelo").
    const modeloBib = crearModelo("Biblioteca");
    const jsonBib = exportarModelo(modeloBib);
    const postBib = await h(
      reqOperador("/modelos", {
        method: "POST",
        body: JSON.stringify({
          id: "bib-1",
          nombre: "Biblioteca",
          json: jsonBib,
          creadoEn: ahora,
          actualizadoEn: ahora,
        }),
      }),
    );
    expect(postBib.ok).toBe(true);

    const modeloCtrl = crearModelo("Control");
    const jsonCtrl = exportarModelo(modeloCtrl);
    const postCtrl = await h(
      reqOperador("/modelos", {
        method: "POST",
        body: JSON.stringify({
          id: "ctrl-1",
          nombre: "Control",
          json: jsonCtrl,
          creadoEn: ahora,
          actualizadoEn: ahora,
        }),
      }),
    );
    expect(postCtrl.ok).toBe(true);
    expect(escrituras()).toBe(2); // los dos POST de seed.

    // Marcar "bib-1" como biblioteca en el índice de workspace (PUT real).
    const indiceConBiblioteca: WorkspaceIndice = {
      modelos: [{ id: "bib-1", carpetaId: null, esBiblioteca: true }],
      carpetas: [],
      recientes: [],
    };
    const putIndice = await h(reqOperador("/workspace", {
      method: "PUT",
      body: JSON.stringify({ indice: indiceConBiblioteca, revisionBase: 0 }),
    }));
    expect(putIndice.ok).toBe(true);

    const dir = mkdtempSync(join(tmpdir(), "mesa-cli-biblioteca-guard-"));
    try {
      // Bundle candidato editado (distinto del remoto) para no chocar con la
      // clausura sin-delta antes de llegar al guard biblioteca.
      const editadoBib = crearObjeto(modeloBib, modeloBib.opdRaizId, { x: 10, y: 10 }, "Cosa");
      if (!editadoBib.ok) throw new Error(`setup falló: ${editadoBib.error}`);
      const bundleBibPath = join(dir, "bib-editado.json");
      writeFileSync(bundleBibPath, exportarModelo(editadoBib.value), "utf8");

      const salidaBib = await invocarCmdPush(
        "bib-1",
        bundleBibPath,
        {
          nota: "edición sobre biblioteca",
          confirmado: false,
          base: baseWitness("bib-1", ahora, jsonBib, 1),
        },
        { api: apiViaHandler },
      );
      // evaluarPush rechaza especie "biblioteca" → cmdPush hace process.exit(1)
      // ANTES de cualquier POST de escritura.
      expect(salidaBib.codigoSalida).toBe(1);
      expect(escrituras()).toBe(2); // sigue en 2: el guard NO escribió.

      // Control: el MISMO tipo de push contra el modelo NO-biblioteca sí escribe.
      const editadoCtrl = crearObjeto(modeloCtrl, modeloCtrl.opdRaizId, { x: 20, y: 20 }, "Cosa");
      if (!editadoCtrl.ok) throw new Error(`setup falló: ${editadoCtrl.error}`);
      const bundleCtrlPath = join(dir, "ctrl-editado.json");
      writeFileSync(bundleCtrlPath, exportarModelo(editadoCtrl.value), "utf8");

      const salidaCtrl = await invocarCmdPush(
        "ctrl-1",
        bundleCtrlPath,
        {
          nota: "edición sobre control",
          confirmado: false,
          base: baseWitness("ctrl-1", ahora, jsonCtrl, 1),
        },
        { api: apiViaHandler },
      );
      expect(salidaCtrl.codigoSalida).toBeUndefined(); // completó sin abortar
      expect(escrituras()).toBe(3); // el control SÍ escribió.
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("CREATE --especie apunte: el commit marca la especie sin PUT posterior y preserva el workspace", async () => {
    const repo = crearRepoMemoria();
    const h = nuevoHandler(repo);
    const paths: string[] = [];
    const apiViaHandler = (path: string, init?: RequestInit) => {
      paths.push(`${init?.method ?? "GET"} ${path}`);
      return h(req(path, init));
    };
    const ahora = new Date().toISOString();

    // Modelo preexistente + entrada de índice + carpeta + preferencias — todo
    // debe sobrevivir intacto al commit que incorpora la especie del modelo
    // NUEVO creado en este push.
    const modeloExistente = crearModelo("Existente");
    const postExistente = await h(
      reqOperador("/modelos", {
        method: "POST",
        body: JSON.stringify({
          id: "existing-1",
          nombre: "Existente",
          json: exportarModelo(modeloExistente),
          creadoEn: ahora,
          actualizadoEn: ahora,
        }),
      }),
    );
    expect(postExistente.ok).toBe(true);

    const indiceSemilla: WorkspaceIndice = {
      modelos: [{ id: "existing-1", carpetaId: "carpeta-x", archivado: true, archivadoEn: ahora }],
      carpetas: [{ id: "carpeta-x", nombre: "Carpeta X", padreId: null, creadoEn: 12345 }],
      recientes: ["existing-1"],
      preferenciasUi: { anchoPanelArbol: 240 },
    };
    const putSemilla = await h(reqOperador("/workspace", {
      method: "PUT",
      body: JSON.stringify({ indice: indiceSemilla, revisionBase: 0 }),
    }));
    expect(putSemilla.ok).toBe(true);

    const dir = mkdtempSync(join(tmpdir(), "mesa-cli-anti-clobber-"));
    try {
      const bundleNuevoPath = join(dir, "nuevo.json");
      writeFileSync(bundleNuevoPath, exportarModelo(crearModelo("Apunte nuevo")), "utf8");

      // ref que NUNCA resuelve (ni por id ni por nombre) → CREATE.
      const salida = await invocarCmdPush(
        "ref-inexistente",
        bundleNuevoPath,
        { nota: "apunte nuevo", confirmado: false, especie: "apunte" },
        { api: apiViaHandler },
      );
      expect(salida.codigoSalida).toBeUndefined(); // creó sin abortar
      expect(paths.some((path) => path.startsWith("POST /modelos/") && path.endsWith("/revisiones"))).toBe(true);
      expect(paths).not.toContain("PUT /workspace");

      const getIndiceFinal = await h(req("/workspace"));
      const { indice: indiceFinal } = (await getIndiceFinal.json()) as { indice: WorkspaceIndice };

      // (a) la entrada nueva existe con esApunte:true.
      const entradaExistente = indiceFinal.modelos.find((m) => m.id === "existing-1");
      const entradasNuevas = indiceFinal.modelos.filter((m) => m.id !== "existing-1");
      expect(entradasNuevas.length).toBe(1);
      expect(entradasNuevas[0]?.esApunte).toBe(true);

      // (b) Todo lo preexistente sigue intacto dentro del mismo commit: la
      // entrada del modelo viejo, la carpeta, recientes y preferenciasUi.
      expect(entradaExistente).toEqual(indiceSemilla.modelos[0]);
      expect(indiceFinal.carpetas).toEqual(indiceSemilla.carpetas);
      expect(indiceFinal.recientes).toEqual([
        entradasNuevas[0]!.id,
        ...indiceSemilla.recientes,
      ]);
      expect(indiceFinal.preferenciasUi).toEqual(indiceSemilla.preferenciasUi);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

function baseWitness(
  modelId: string,
  updatedAt: string,
  json: string,
  revision: number,
): string {
  return encodeBaseWitness(createBaseWitness({
    modelId,
    saved: { revision, updatedAt, json },
    autosave: null,
  }));
}
