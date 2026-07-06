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
import { cmdPush } from "../../scripts/mesa-cli";
import type { ModeloPersistido } from "../persistencia/modelos";

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
 *    guard vive del lado CLIENTE (`esSinDelta`, puro y unit-testeado en
 *    `esSinDelta.test.ts`); esta ley invoca el `cmdPush` REAL
 *    (`scripts/mesa-cli.ts`, exportado tras el corte `import.meta.main` —
 *    Task 7, hallazgo IMPORTANT de revisión) inyectándole un `api` que habla
 *    contra el handler en memoria — no una reimplementación inline de la
 *    decisión del guard. Se mide con un espía sobre `repo.save` (cero
 *    escrituras) y con la revisión/contenido remotos (sin cambio).
 */

const TOKEN = "z".repeat(48);

function nuevoHandler(repo: ModelPersistenceRepository) {
  return crearModelPersistenceFetchHandler({
    repo,
    sessionResolver: crearTokenSessionResolver({ token: TOKEN, tenantId: "t", userId: "u" }),
    // sin auth.requireAuth: el token ya trae auth:true; el repo memoria no exige login.
  });
}

function req(path: string, init?: RequestInit): Request {
  return new Request(`https://x/__deep-opm${path}`, {
    ...init,
    headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json", ...(init?.headers ?? {}) },
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
  opts: { nota: string; confirmado: boolean; especie?: "apunte" | "modelo" },
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
  test("COUNIT: pull∘push preserva la proyección semántica", async () => {
    const h = nuevoHandler(crearRepoMemoria());
    const modelo = crearModelo("RT");
    const bundle = exportarModelo(modelo);
    const ahora = new Date().toISOString();

    const post = await h(
      req("/modelos", {
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
      req("/modelos", {
        method: "POST",
        body: JSON.stringify({
          id: "rt-2",
          nombre: "RT2",
          json: bundle,
          creadoEn: ahora,
          actualizadoEn: ahora,
          revision: 1,
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
        { nota: "sin nota", confirmado: false },
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
        { nota: "edición real", confirmado: false },
        { api: apiViaHandler },
      );
      expect(salidaEdicion.codigoSalida).toBeUndefined(); // completó sin abortar
      expect(escrituras()).toBe(2); // la edición real sí escribió.
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
