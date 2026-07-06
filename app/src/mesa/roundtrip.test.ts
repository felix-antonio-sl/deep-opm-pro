import { describe, expect, test } from "bun:test";
import { crearModelPersistenceFetchHandler, type ModelPersistenceRepository } from "../server/modelPersistence";
import { crearTokenSessionResolver } from "../server/tokenSessionResolver";
import { crearRepoMemoria } from "../server/repoMemoria";
import { exportarContextoSkill } from "../opl/contextoSkill";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import { esSinDelta } from "./esSinDelta";
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
 *    `esSinDelta.test.ts`) porque el backend real (`scripts/model-persistence-api.ts`)
 *    avanza la revisión en CADA escritura sin comparar contenido — sin el
 *    guard, cada ciclo pull→push infla la historia aunque el operador no haya
 *    tocado nada. Esta prueba simula la MISMA decisión que toma
 *    `cmdPush` (scripts/mesa-cli.ts): si `esSinDelta` es `true`, el push NO se
 *    emite — se mide con un espía sobre `repo.save` (cero escrituras) y con
 *    la revisión remota (sin cambio).
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

  test("CLAUSURA: push∘pull sin delta no escribe (cero escrituras, revisión intacta)", async () => {
    const { repo, escrituras } = repoConEspiaDeEscrituras();
    const h = nuevoHandler(repo);
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

    // pull: GET sin ediciones.
    const get = await h(req(`/modelos/${postBody.modelo.id}`));
    const getBody = (await get.json()) as { modelo: ModeloPersistido };

    // El operador re-serializa localmente sin editar nada (re-export por su
    // editor): mismos datos, bytes distintos (compactado) — exactamente el
    // caso que `esSinDelta` debe absorber sin falso-negativo.
    const candidatoSinEdicion = JSON.stringify(JSON.parse(getBody.modelo.json));
    expect(candidatoSinEdicion).not.toBe(getBody.modelo.json);

    // Réplica de la decisión de `cmdPush` (scripts/mesa-cli.ts::cmdPush): si
    // `esSinDelta` es true, el push NO se emite — cero llamadas a `repo.save`.
    if (!esSinDelta(candidatoSinEdicion, getBody.modelo.json)) {
      await h(
        req("/modelos", {
          method: "POST",
          body: JSON.stringify({ ...getBody.modelo, json: candidatoSinEdicion, revision: (getBody.modelo.revision ?? 0) + 1 }),
        }),
      );
    }
    expect(escrituras()).toBe(1); // sigue en 1: la clausura no escribió.

    const getFinal = await h(req(`/modelos/${postBody.modelo.id}`));
    const getFinalBody = (await getFinal.json()) as { modelo: ModeloPersistido };
    expect(getFinalBody.modelo.revision ?? 0).toBe(revisionInicial);
    expect(getFinalBody.modelo.json).toBe(getBody.modelo.json); // ni el contenido cambió.

    // Contraste: una edición REAL sí debe atravesar la clausura y escribir.
    const modeloEditado = crearObjeto(hidratarModeloOk(getBody.modelo.json), modelo.opdRaizId, { x: 10, y: 10 }, "Cosa");
    if (!modeloEditado.ok) throw new Error(`setup falló: ${modeloEditado.error}`);
    const bundleEditado = exportarModelo(modeloEditado.value);
    expect(esSinDelta(bundleEditado, getBody.modelo.json)).toBe(false);
    await h(
      req("/modelos", {
        method: "POST",
        body: JSON.stringify({ ...getBody.modelo, json: bundleEditado, revision: (getBody.modelo.revision ?? 0) + 1 }),
      }),
    );
    expect(escrituras()).toBe(2); // la edición real sí escribió.
  });
});

function hidratarModeloOk(json: string) {
  const r = hidratarModelo(json);
  if (!r.ok) throw new Error(`fixture inhidratable: ${r.error}`);
  return r.value;
}
