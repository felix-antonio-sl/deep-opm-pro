import { describe, expect, spyOn, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { crearModelPersistenceFetchHandler, type ModelPersistenceRepository } from "../server/modelPersistence";
import { crearTokenSessionResolver } from "../server/tokenSessionResolver";
import { crearRepoMemoria } from "../server/repoMemoria";
import { exportarContextoSkill } from "../opl/contextoSkill";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import { cmdPull, cmdPush } from "../../scripts/mesa-cli";
import type { ModeloPersistido } from "../persistencia/modelos";
import { createBaseWitness, decodeBaseWitness, encodeBaseWitness } from "./baseWitness";
import {
  encodeSessionIdentity,
  SESSION_IDENTITY_HEADER,
} from "../persistencia/sessionIdentity";

/**
 * Leyes categoriales de round-trip del puente mesa↔skill (comité, Ola 1
 * Task 7), verificadas contra el handler REAL en memoria (`crearRepoMemoria`,
 * sin red, sin Postgres):
 *
 *  - COUNIT (pull∘push preserva): tras un push de B, un pull inmediato debe
 *    producir una proyección semántica ≡ a la de B. Atrapa pérdida silenciosa
 *    en el round-trip del backend (serialización/normalización/hidratación).
 *
 *  - CLAUSURA (push∘pull sin delta es no-op): pull de un modelo SIN ediciones
 *    + push del mismo contenido NO debe crear una revisión/versión nueva. El
 *    guard corta temprano en el CLIENTE y vuelve a sellarse bajo lock en el
 *    servidor (`esSinDelta`, puro y unit-testeado en
 *    `esSinDelta.test.ts`); esta ley invoca el `cmdPush` REAL
 *    (`scripts/mesa-cli.ts`, exportado tras el corte `import.meta.main` —
 *    Task 7, hallazgo IMPORTANT de revisión) inyectándole un `api` que habla
 *    contra el handler en memoria — no una reimplementación inline de la
 *    decisión del guard. Se mide con un espía sobre `repo.save` (cero
 *    escrituras) y con la revisión/contenido remotos (sin cambio).
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
    // sin auth.requireAuth: el token ya trae auth:true; el repo memoria no exige login.
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

/** Envuelve el repo en memoria con un contador de escrituras (`save`), para medir CLAUSURA sin depender de si el repo modela revisión. */
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

/**
 * `cmdPush` real corta sus caminos de decisión con `process.exit(código)`
 * (clausura sin delta = 4, rechazo de `evaluarPush` = 1, 409 = 3, uso = 2).
 * Dentro del test runner eso mataría el proceso completo — se sustituye
 * `process.exit` por una excepción capturable con el MISMO código mientras
 * dura la llamada, para poder invocar el `cmdPush` REAL (no una
 * reimplementación inline del guard) sin abortar la suite.
 */
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

describe("leyes de round-trip del puente (repo en memoria, sin red)", () => {
  test("pull observa explícitamente la ausencia de autosave y emite Testigo-Base reutilizable", async () => {
    const h = nuevoHandler(crearRepoMemoria());
    const modelo = crearModelo("Pull testigo");
    const json = exportarModelo(modelo);
    const ahora = "2026-07-17T10:00:00.000Z";
    await h(reqOperador("/modelos", {
      method: "POST",
      body: JSON.stringify({
        id: "pull-witness",
        nombre: "Pull testigo",
        descripcion: "",
        json,
        creadoEn: ahora,
        actualizadoEn: ahora,
        autosalvado: false,
      }),
    }));
    const paths: string[] = [];
    const apiViaHandler = (path: string, init?: RequestInit) => {
      paths.push(path);
      return h(req(path, init));
    };
    const log = spyOn(console, "log").mockImplementation(() => {});
    try {
      await cmdPull("pull-witness", { api: apiViaHandler });
      const output = String(log.mock.calls[0]?.[0] ?? "");
      const encoded = output.match(/^Testigo-Base: (mesa-v1\.\S+)$/m)?.[1];
      expect(encoded).toBeDefined();
      expect(decodeBaseWitness(encoded ?? "")).toEqual(expect.objectContaining({
        modelId: "pull-witness",
        autosave: null,
        source: "saved",
      }));
      expect(paths).toContain("/modelos/pull-witness/autosave");
    } finally {
      log.mockRestore();
    }
  });

  test("COUNIT: pull∘push preserva la proyección semántica", async () => {
    const h = nuevoHandler(crearRepoMemoria());
    const modelo = crearModelo("RT");
    const bundle = exportarModelo(modelo);
    const ahora = new Date().toISOString();

    const post = await h(
      reqOperador("/modelos", {
        method: "POST",
        body: JSON.stringify({ id: "rt-1", nombre: "RT", json: bundle, creadoEn: ahora, actualizadoEn: ahora }),
      }),
    );
    expect(post.ok).toBe(true);
    const postBody = (await post.json()) as { modelo: ModeloPersistido };

    const get = await h(req(`/modelos/${postBody.modelo.id}`));
    expect(get.ok).toBe(true);
    const getBody = (await get.json()) as { modelo: ModeloPersistido };

    const mB = hidratarModelo(bundle);
    const mPull = hidratarModelo(getBody.modelo.json);
    if (!mB.ok || !mPull.ok) {
      throw new Error(`hallazgo real: hidratación falló en el round-trip (bundle=${mB.ok}, pull=${mPull.ok})`);
    }

    const FECHA_FIJA = new Date("2026-07-06");
    expect(exportarContextoSkill(mPull.value, FECHA_FIJA)).toBe(exportarContextoSkill(mB.value, FECHA_FIJA));
  });

  test("CLAUSURA: cmdPush real no escribe ante push∘pull sin delta; sí escribe ante edición real", async () => {
    const { repo, escrituras } = repoConEspiaDeEscrituras();
    const h = nuevoHandler(repo);
    const apiViaHandler = (path: string, init?: RequestInit) => h(req(path, init));

    const modelo = crearModelo("RT2");
    const bundle = exportarModelo(modelo);
    const ahora = new Date().toISOString();

    const post = await h(
      reqOperador("/modelos", {
        method: "POST",
        body: JSON.stringify({
          id: "rt-2",
          nombre: "RT2",
          json: bundle,
          creadoEn: ahora,
          actualizadoEn: ahora,
        }),
      }),
    );
    expect(post.ok).toBe(true);
    expect(escrituras()).toBe(1);
    const postBody = (await post.json()) as { modelo: ModeloPersistido };
    const revisionInicial = postBody.modelo.revision ?? 0;

    const dir = mkdtempSync(join(tmpdir(), "mesa-cli-clausura-"));
    try {
      // pull: GET sin ediciones.
      const get = await h(req(`/modelos/${postBody.modelo.id}`));
      const getBody = (await get.json()) as { modelo: ModeloPersistido };
      const baseWitness = encodeBaseWitness(createBaseWitness({
        modelId: getBody.modelo.id,
        saved: {
          revision: getBody.modelo.revision ?? 0,
          updatedAt: getBody.modelo.actualizadoEn,
          json: getBody.modelo.json,
        },
        autosave: null,
      }));

      // El operador re-serializa localmente sin editar nada (re-export por su
      // editor): mismos datos, bytes distintos (compactado) — exactamente el
      // no-op genuino que `esSinDelta` debe absorber sin falso-negativo.
      const candidatoSinEdicion = JSON.stringify(JSON.parse(getBody.modelo.json));
      expect(candidatoSinEdicion).not.toBe(getBody.modelo.json);
      const bundleSinEdicionPath = join(dir, "sin-edicion.json");
      writeFileSync(bundleSinEdicionPath, candidatoSinEdicion, "utf8");

      // El `cmdPush` REAL decide — no una reimplementación inline del guard.
      const salida = await invocarCmdPush(
        "rt-2",
        bundleSinEdicionPath,
        { nota: "sin nota", confirmado: false, base: baseWitness },
        { api: apiViaHandler },
      );
      expect(salida.codigoSalida).toBe(4); // clausura: exit dedicado, ANTES de cualquier fetch/POST
      expect(escrituras()).toBe(1); // sigue en 1: la clausura no escribió.

      const getFinal = await h(req(`/modelos/${postBody.modelo.id}`));
      const getFinalBody = (await getFinal.json()) as { modelo: ModeloPersistido };
      expect(getFinalBody.modelo.revision ?? 0).toBe(revisionInicial);
      expect(getFinalBody.modelo.json).toBe(getBody.modelo.json); // ni el contenido cambió.

      // Contraste en el MISMO test: una edición REAL sí debe atravesar
      // `cmdPush` y escribir.
      const modeloEditado = crearObjeto(hidratarModeloOk(getBody.modelo.json), modelo.opdRaizId, { x: 10, y: 10 }, "Cosa");
      if (!modeloEditado.ok) throw new Error(`setup falló: ${modeloEditado.error}`);
      const bundleEditado = exportarModelo(modeloEditado.value);
      const bundleEditadoPath = join(dir, "editado.json");
      writeFileSync(bundleEditadoPath, bundleEditado, "utf8");

      const salidaEdicion = await invocarCmdPush(
        "rt-2",
        bundleEditadoPath,
        { nota: "edición real", confirmado: false, base: baseWitness },
        { api: apiViaHandler },
      );
      expect(salidaEdicion.codigoSalida).toBeUndefined(); // completó sin abortar
      expect(escrituras()).toBe(2); // la edición real sí escribió.
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("FAST-FORWARD: un Testigo-Base obsoleto aborta antes del commit atómico", async () => {
    const repo = crearRepoMemoria();
    const h = nuevoHandler(repo);
    const paths: string[] = [];
    const apiViaHandler = (path: string, init?: RequestInit) => {
      paths.push(`${init?.method ?? "GET"} ${path}`);
      return h(req(path, init));
    };
    const original = crearModelo("Base original");
    const originalJson = exportarModelo(original);
    const originalUpdatedAt = "2026-07-17T10:00:00.000Z";
    await h(reqOperador("/modelos", {
      method: "POST",
      body: JSON.stringify({
        id: "rt-stale",
        nombre: "Base original",
        descripcion: "",
        json: originalJson,
        creadoEn: originalUpdatedAt,
        actualizadoEn: originalUpdatedAt,
      }),
    }));
    const witness = encodeBaseWitness(createBaseWitness({
      modelId: "rt-stale",
      saved: {
        revision: 1,
        updatedAt: originalUpdatedAt,
        json: originalJson,
      },
      autosave: null,
    }));
    await repo.save(
      { tenantId: "t", userId: "u" },
      {
        id: "rt-stale",
        nombre: "Remoto avanzado",
        descripcion: "",
        json: exportarModelo(crearModelo("Remoto avanzado")),
        creadoEn: originalUpdatedAt,
        actualizadoEn: "2026-07-17T10:01:00.000Z",
        revision: 1,
      },
    );

    const dir = mkdtempSync(join(tmpdir(), "mesa-cli-stale-"));
    try {
      const bundlePath = join(dir, "candidato.json");
      writeFileSync(bundlePath, exportarModelo(crearModelo("Candidato viejo")), "utf8");
      const result = await invocarCmdPush(
        "rt-stale",
        bundlePath,
        { nota: "stale", confirmado: false, base: witness },
        { api: apiViaHandler },
      );

      expect(result.codigoSalida).toBe(3);
      expect(paths.some((path) => path.includes("/revisiones"))).toBe(false);
      expect((await repo.get({ tenantId: "t", userId: "u" }, "rt-stale"))?.revision).toBe(2);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("un 5xx del commit se declara ambiguo y exige pull antes de reintentar", async () => {
    const h = nuevoHandler(crearRepoMemoria());
    const base = crearModelo("Base para 5xx");
    const savedJson = exportarModelo(base);
    const updatedAt = "2026-07-17T10:30:00.000Z";
    await h(reqOperador("/modelos", {
      method: "POST",
      body: JSON.stringify({
        id: "rt-5xx",
        nombre: base.nombre,
        descripcion: "",
        json: savedJson,
        creadoEn: updatedAt,
        actualizadoEn: updatedAt,
      }),
    }));
    const witness = encodeBaseWitness(createBaseWitness({
      modelId: "rt-5xx",
      saved: { revision: 1, updatedAt, json: savedJson },
      autosave: null,
    }));
    const editado = crearObjeto(base, base.opdRaizId, { x: 10, y: 10 }, "Cambio");
    if (!editado.ok) throw new Error(`setup falló: ${editado.error}`);
    let commitIntentado = false;
    const apiViaHandler = (path: string, init?: RequestInit) => {
      if (path.endsWith("/revisiones") && init?.method === "POST") {
        commitIntentado = true;
        return Promise.resolve(new Response(
          JSON.stringify({ error: "gateway timeout" }),
          { status: 503, headers: { "content-type": "application/json" } },
        ));
      }
      return h(req(path, init));
    };

    const dir = mkdtempSync(join(tmpdir(), "mesa-cli-5xx-"));
    const error = spyOn(console, "error").mockImplementation(() => {});
    try {
      const bundlePath = join(dir, "editado.json");
      writeFileSync(bundlePath, exportarModelo(editado.value), "utf8");
      const result = await invocarCmdPush(
        "rt-5xx",
        bundlePath,
        { nota: "respuesta ambigua", confirmado: false, base: witness },
        { api: apiViaHandler },
      );

      expect(commitIntentado).toBe(true);
      expect(result.codigoSalida).toBe(1);
      expect(error.mock.calls.flat().join(" ")).toContain(
        "resultado del commit es desconocido",
      );
      expect(error.mock.calls.flat().join(" ")).toContain(
        "Ejecuta pull para comprobar antes de reintentar",
      );
    } finally {
      error.mockRestore();
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("un sello guardado no se pierde si el autosave más nuevo es artesanal", async () => {
    const repo = crearRepoMemoria();
    const h = nuevoHandler(repo);
    const apiViaHandler = (path: string, init?: RequestInit) => h(req(path, init));
    const baseTimestamp = "2026-07-17T11:00:00.000Z";
    const sellado = {
      ...crearModelo("Con proto"),
      procedencia: {
        protoHash: "proto-abc",
        autoriaVersion: "1.0.0",
        layoutVersion: "1",
      },
    };
    const { procedencia: _sello, ...artesanal } = sellado;
    const savedJson = exportarModelo(sellado);
    const autosaveJson = exportarModelo(artesanal);
    const created = await h(reqOperador("/modelos", {
      method: "POST",
      body: JSON.stringify({
        id: "rt-linaje",
        nombre: "Con proto",
        descripcion: "",
        json: savedJson,
        creadoEn: baseTimestamp,
        actualizadoEn: baseTimestamp,
      }),
    }));
    expect(created.status).toBe(200);
    const auto = await h(reqOperador("/modelos/rt-linaje/autosave", {
      method: "PUT",
      body: JSON.stringify({
        creadoEn: "2026-07-17T11:00:01.000Z",
        json: autosaveJson,
        revisionBase: 1,
      }),
    }));
    expect(auto.status).toBe(200);
    const autoBody = await auto.json() as { creadoEn: string; json: string };
    const witness = encodeBaseWitness(createBaseWitness({
      modelId: "rt-linaje",
      saved: { revision: 1, updatedAt: baseTimestamp, json: savedJson },
      autosave: { createdAt: autoBody.creadoEn, json: autoBody.json },
    }));
    const editado = crearObjeto(artesanal, artesanal.opdRaizId, { x: 10, y: 10 }, "Cambio artesanal");
    if (!editado.ok) throw new Error(`setup falló: ${editado.error}`);

    const dir = mkdtempSync(join(tmpdir(), "mesa-cli-linaje-autosave-"));
    try {
      const bundlePath = join(dir, "artesanal.json");
      writeFileSync(bundlePath, exportarModelo(editado.value), "utf8");
      const result = await invocarCmdPush(
        "rt-linaje",
        bundlePath,
        { nota: "intento artesanal", confirmado: true, base: witness },
        { api: apiViaHandler },
      );

      expect(result.codigoSalida).toBe(1);
      expect((await repo.get({ tenantId: "t", userId: "u" }, "rt-linaje"))?.revision).toBe(1);
      expect(await repo.listVersions!({ tenantId: "t", userId: "u" }, "rt-linaje")).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("autosave persistido queda estrictamente posterior y el push exige ratificación", async () => {
    const repo = crearRepoMemoria();
    const h = nuevoHandler(repo);
    const apiViaHandler = (path: string, init?: RequestInit) => h(req(path, init));
    const savedTimestamp = "2026-07-17T12:00:00.000Z";
    const saved = crearModelo("Guardado");
    const autosave = crearObjeto(saved, saved.opdRaizId, { x: 10, y: 10 }, "Autosave");
    if (!autosave.ok) throw new Error(`setup falló: ${autosave.error}`);
    const candidate = crearObjeto(autosave.value, saved.opdRaizId, { x: 20, y: 20 }, "Candidato");
    if (!candidate.ok) throw new Error(`setup falló: ${candidate.error}`);
    const savedJson = exportarModelo(saved);
    const autosaveJson = exportarModelo(autosave.value);
    const created = await h(reqOperador("/modelos", {
      method: "POST",
      body: JSON.stringify({
        id: "rt-auto-real",
        nombre: "Guardado",
        descripcion: "",
        json: savedJson,
        creadoEn: savedTimestamp,
        actualizadoEn: savedTimestamp,
      }),
    }));
    expect(created.status).toBe(200);
    const autosaved = await h(reqOperador("/modelos/rt-auto-real/autosave", {
      method: "PUT",
      body: JSON.stringify({
        creadoEn: savedTimestamp,
        json: autosaveJson,
        revisionBase: 1,
      }),
    }));
    expect(autosaved.status).toBe(200);
    const autosavedBody = await autosaved.json() as { creadoEn: string; json: string };
    expect(autosavedBody.creadoEn > savedTimestamp).toBe(true);
    const witness = encodeBaseWitness(createBaseWitness({
      modelId: "rt-auto-real",
      saved: { revision: 1, updatedAt: savedTimestamp, json: savedJson },
      autosave: { createdAt: autosavedBody.creadoEn, json: autosavedBody.json },
    }));

    const dir = mkdtempSync(join(tmpdir(), "mesa-cli-autosave-confirmacion-"));
    try {
      const bundlePath = join(dir, "candidato.json");
      writeFileSync(bundlePath, exportarModelo(candidate.value), "utf8");
      const noRatificado = await invocarCmdPush(
        "rt-auto-real",
        bundlePath,
        { nota: "desde autosave", confirmado: false, base: witness },
        { api: apiViaHandler },
      );
      expect(noRatificado.codigoSalida).toBe(1);
      expect((await repo.get({ tenantId: "t", userId: "u" }, "rt-auto-real"))?.revision).toBe(1);

      const ratificado = await invocarCmdPush(
        "rt-auto-real",
        bundlePath,
        { nota: "desde autosave", confirmado: true, base: witness },
        { api: apiViaHandler },
      );
      expect(ratificado.codigoSalida).toBeUndefined();
      expect((await repo.get({ tenantId: "t", userId: "u" }, "rt-auto-real"))?.revision).toBe(2);
      expect(await repo.getAutosave!({ tenantId: "t", userId: "u" }, "rt-auto-real")).toBeNull();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

function hidratarModeloOk(json: string) {
  const r = hidratarModelo(json);
  if (!r.ok) throw new Error(`fixture inhidratable: ${r.error}`);
  return r.value;
}
