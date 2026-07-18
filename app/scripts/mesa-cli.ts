// CLI de mesa (3 verbos): capa delgada de I/O sobre la lógica ya testeada de
// `mesa pull`/`mesa push` (src/mesa/contextoPull.ts, src/mesa/validarPush.ts).
// Este script NO decide nada — arma el contexto (fetch + token) y delega toda
// decisión (base a usar, permiso de escritura) a las funciones puras.
// Uso:
//   bun run mesa modelos
//   bun run mesa pull <ref>
//   bun run mesa push <ref> <bundle.json> [--base <testigo>] --nota "…" [--especie apunte|modelo] [--confirmado-por-operador]
// Config: env OPFORJA_API_URL (default instancia prod) + archivo
// ~/.config/opforja/agent-token (o OPFORJA_AGENT_TOKEN_FILE).
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Especie } from "../src/persistencia/especie";
import { componerPull, elegirBase } from "../src/mesa/contextoPull";
import { evaluarPush } from "../src/mesa/validarPush";
import { esSinDelta } from "../src/mesa/esSinDelta";
import { construirBodyActualizacion } from "../src/mesa/construirBodyActualizacion";
import { mapaEspeciePorModelo } from "../src/mesa/especieWorkspace";
import { generarId, type ResumenModeloPersistido } from "../src/persistencia/modelos";
import { indiceVacio, type WorkspaceIndice } from "../src/persistencia/workspace";
import {
  baseWitnessMatches,
  createBaseWitness,
  decodeBaseWitness,
  encodeBaseWitness,
  selectedBaseJson,
  type ObservedBaseState,
} from "../src/mesa/baseWitness";

const API = process.env.OPFORJA_API_URL ?? "https://opforja.sanixai.com";
const TOKEN_PATH = process.env.OPFORJA_AGENT_TOKEN_FILE ?? join(homedir(), ".config/opforja/agent-token");

function token(): string {
  try {
    return readFileSync(TOKEN_PATH, "utf8").trim();
  } catch {
    console.error(`No hay token en ${TOKEN_PATH}. Genera uno con openssl y colócalo (chmod 600).`);
    process.exit(2);
  }
}

function headers(): Record<string, string> {
  return { authorization: `Bearer ${token()}`, "content-type": "application/json" };
}

async function api(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API}/__deep-opm${path}`, { ...init, headers: { ...headers(), ...(init?.headers ?? {}) } });
}

/**
 * Shape real de un record remoto (GET /modelos → { modelos: [...] } sin json;
 * GET /modelos/:id → { modelo: {...} } CON json). Verificado contra
 * src/server/modelPersistence.ts (`responderJson(200, { modelo }, …)` / `{ modelos }`)
 * y scripts/model-persistence-api.ts (`modeloDesdeRow`). `esApunte`/`esBiblioteca`
 * son opcionales porque el repo Postgres actual NO los persiste como columna del
 * modelo (solo existen hoy en el índice de workspace) — ver nota en el reporte.
 *
 * Se tipa como `ResumenModeloPersistido` (+ `json` opcional, ausente en el
 * listado sin payload) en vez de re-declarar los campos a mano: así el
 * registro fetchado del servidor encaja estructuralmente como `existente` de
 * `construirBodyActualizacion`/`construirModeloPersistido` sin adaptador —
 * trae TODOS los campos preservables (descripcion, carpetaId, archivado*,
 * versiones, crearVersionAlGuardar), no solo los que el CLI conocía antes.
 */
type RegistroRemoto = ResumenModeloPersistido & { json?: string };

/**
 * Firma de `api()` (fetch real contra `OPFORJA_API_URL` + token de disco).
 * Seam de testeabilidad (Task 7, hallazgo IMPORTANT de revisión): `cmdPush`
 * acepta un `apiFn` inyectable (default = `api`) para que un test pueda
 * driblar la MISMA función contra un handler en memoria (`crearRepoMemoria`)
 * sin red ni archivo de token — sin esto, la ley de CLAUSURA solo se podía
 * probar reimplementando la decisión del guard inline, no invocando el
 * `cmdPush` real.
 */
type ApiFn = (path: string, init?: RequestInit) => Promise<Response>;

async function listar(apiFn: ApiFn = api): Promise<RegistroRemoto[]> {
  const r = await apiFn("/modelos");
  if (!r.ok) {
    console.error(`API ${r.status}`);
    process.exit(1);
  }
  const body = (await r.json()) as { modelos?: RegistroRemoto[] };
  return body.modelos ?? [];
}

async function resolverRef(ref: string, apiFn: ApiFn = api): Promise<RegistroRemoto | null> {
  const lista = await listar(apiFn);
  return lista.find((m) => m.id === ref) ?? lista.find((m) => m.nombre === ref) ?? null;
}

async function obtenerModelo(id: string, apiFn: ApiFn = api): Promise<RegistroRemoto | null> {
  const r = await apiFn(`/modelos/${encodeURIComponent(id)}`);
  if (r.status === 404) return null;
  if (!r.ok) {
    console.error(`API ${r.status}`);
    process.exit(1);
  }
  const body = (await r.json()) as { modelo?: RegistroRemoto };
  return body.modelo ?? null;
}

/**
 * `esApunte`/`esBiblioteca` NO viven en el record de Postgres (`GET
 * /modelos/:id` no los trae) — hoy solo existen en el índice de workspace
 * (`GET /__deep-opm/workspace` → `{ indice }`). Toda especie mostrada u
 * honrada por el CLI (columna de `mesa modelos`, header de `mesa pull`, guard
 * biblioteca de `mesa push`) debe cruzar contra este índice vía
 * `mapaEspeciePorModelo` — nunca releer `especieDe` sobre el record remoto.
 */
async function obtenerWorkspaceIndice(apiFn: ApiFn = api): Promise<WorkspaceIndice> {
  const r = await apiFn("/workspace");
  if (!r.ok) {
    console.error(`API ${r.status}`);
    process.exit(1);
  }
  const body = (await r.json()) as { indice?: WorkspaceIndice };
  return body.indice ?? indiceVacio();
}

async function cmdModelos(): Promise<void> {
  const lista = await listar();
  const especiePorId = mapaEspeciePorModelo(await obtenerWorkspaceIndice());
  for (const m of lista) {
    console.log(`${m.id}\t${especiePorId.get(m.id) ?? "modelo"}\trev ${m.revision ?? 0}\t${m.nombre}`);
  }
}

export async function cmdPull(ref: string, deps: { api?: ApiFn } = {}): Promise<void> {
  const apiFn = deps.api ?? api;
  const encontrado = await resolverRef(ref, apiFn);
  if (!encontrado) {
    console.error("modelo no encontrado");
    process.exit(1);
  }
  const rec = await obtenerModelo(encontrado.id, apiFn);
  if (!rec || typeof rec.json !== "string") {
    console.error("modelo no encontrado");
    process.exit(1);
  }
  // La ausencia del autosave también es parte del testigo. Por eso se consulta
  // siempre y solo 404 significa ausencia; cualquier otro fallo aborta el pull.
  const autosave = await obtenerAutosave(rec.id, apiFn);
  const base = elegirBase({
    guardadoActualizadoEn: rec.actualizadoEn,
    guardadoJson: rec.json,
    guardadoRev: rec.revision ?? 0,
    ...(autosave ? { autosave: { creadoEn: autosave.createdAt, json: autosave.json } } : {}),
  });
  const observed: ObservedBaseState = {
    modelId: rec.id,
    saved: {
      revision: rec.revision ?? 0,
      updatedAt: rec.actualizadoEn,
      json: rec.json,
    },
    autosave,
  };
  const baseWitness = encodeBaseWitness(createBaseWitness(observed));
  const especiePorId = mapaEspeciePorModelo(await obtenerWorkspaceIndice(apiFn));
  const especie = especiePorId.get(rec.id) ?? "modelo";
  console.log(componerPull({ nombre: rec.nombre, especie, base, baseWitness }));
}

export async function cmdPush(
  ref: string,
  bundlePath: string,
  opts: { nota: string; confirmado: boolean; base?: string; especie?: "apunte" | "modelo" },
  deps: { api?: ApiFn } = {},
): Promise<void> {
  const apiFn = deps.api ?? api;
  const nota = opts.nota.trim();
  if (!nota) {
    console.error("push rechazado: --nota exige un rótulo significativo");
    process.exit(2);
  }
  const bundleJson = readFileSync(bundlePath, "utf8");
  const encontrado = await resolverRef(ref, apiFn);
  let destinoRec: RegistroRemoto | null = null;
  if (encontrado) {
    destinoRec = await obtenerModelo(encontrado.id, apiFn);
    if (!destinoRec) {
      // El ref SÍ resolvió contra el listado, pero el fetch puntual dio 404:
      // el modelo se borró (o se movió) entre el `list` y el `get` — no es
      // "ref no encontrado" (eso crearía uno NUEVO por accidente encima de un
      // borrado concurrente). Solo un ref jamás resuelto crea.
      console.error(`push abortado: "${ref}" (id ${encontrado.id}) apareció en el listado pero desapareció antes del fetch (¿borrado concurrente?). Reintenta.`);
      process.exit(1);
    }
  }

  let destinoInfo: { tieneSello: boolean; especie: Especie } | undefined;
  let baseFueAutosave = false;
  let base:
    | { kind: "new" }
    | { kind: "existing"; witness: NonNullable<ReturnType<typeof decodeBaseWitness>> };
  if (destinoRec) {
    const destinationJson = destinoRec.json;
    if (typeof destinationJson !== "string") {
      console.error("push abortado: la respuesta del modelo no incluye un bundle legible");
      process.exit(1);
    }
    if (!opts.base) {
      console.error("push rechazado: falta --base <Testigo-Base> del pull que originó este bundle");
      process.exit(2);
    }
    const witness = decodeBaseWitness(opts.base);
    if (!witness || witness.modelId !== destinoRec.id) {
      console.error("push rechazado: Testigo-Base inválido o perteneciente a otro modelo");
      process.exit(2);
    }
    const autosave = await obtenerAutosave(destinoRec.id, apiFn);
    const observed: ObservedBaseState = {
      modelId: destinoRec.id,
      saved: {
        revision: destinoRec.revision ?? 0,
        updatedAt: destinoRec.actualizadoEn,
        json: destinationJson,
      },
      autosave,
    };
    if (!baseWitnessMatches(witness, observed)) {
      console.error("409: la base cambió desde el pull. Re-pull y reintenta.");
      process.exit(3);
    }

    // CLAUSURA: el no-op se compara contra la fuente elegida por ESE pull,
    // no siempre contra el guardado principal.
    if (esSinDelta(bundleJson, selectedBaseJson(observed))) {
      console.error("sin cambios: no se crea revisión");
      process.exit(4);
    }

    // La especie real vive en el índice de workspace, NO en el record remoto
    // (ver `obtenerWorkspaceIndice`) — sin este cruce el guard biblioteca de
    // `evaluarPush` queda inerte porque `destinoRec` nunca trae `esBiblioteca`.
    const especiePorId = mapaEspeciePorModelo(await obtenerWorkspaceIndice(apiFn));
    destinoInfo = {
      // El linaje del destino no desaparece porque un autosave artesanal sea
      // la fuente más nueva: basta un sello en cualquiera de las dos ramas.
      tieneSello: bundleTieneSelloRemoto(destinationJson) ||
        Boolean(autosave && bundleTieneSelloRemoto(autosave.json)),
      especie: especiePorId.get(destinoRec.id) ?? "modelo",
    };
    baseFueAutosave = witness.source === "autosave";
    base = { kind: "existing", witness };
  } else {
    if (opts.base) {
      console.error("409: el modelo del Testigo-Base ya no existe; no se creará otro por accidente");
      process.exit(3);
    }
    base = { kind: "new" };
  }

  const veredicto = evaluarPush({
    bundleJson,
    ...(destinoInfo ? { destino: destinoInfo } : {}),
    baseFueAutosave,
    confirmadoPorOperador: opts.confirmado,
    ...(opts.especie ? { especieAlCrear: opts.especie } : {}),
  });
  if (!veredicto.ok) {
    console.error(`push rechazado: ${veredicto.motivo}`);
    process.exit(1);
  }

  // Snapshot del commit: crea con id fresco o actualiza el mismo id, preserva
  // creadoEn y porta la revisión observada. El endpoint atómico exige los
  // metadatos completos y vuelve a comprobar base + revisión bajo lock.
  //
  // CRÍTICO (bug de integridad corregido): la persistencia SQL reemplaza todas
  // las columnas del modelo desde el body recibido, sin merge contra lo
  // persistido. Enviar solo
  // id/nombre/json/creadoEn/actualizadoEn/revision (como hacía este CLI antes)
  // pisa silenciosamente descripcion (→ ""), carpetaId (→ null, saca de la
  // carpeta), archivado*/versiones/crearVersionAlGuardar (→ ausentes). Se usa
  // `construirBodyActualizacion` (envoltorio de la utilidad canónica
  // `construirModeloPersistido`, la misma que usa el store del producto en
  // src/store/persistencia.ts) para preservar esos campos desde `destinoRec`.
  const ahora = new Date().toISOString();
  const body = destinoRec
    ? construirBodyActualizacion(
        {
          id: destinoRec.id,
          nombre: destinoRec.nombre,
          json: bundleJson,
          revision: base.kind === "existing" ? base.witness.saved.revision : 0,
        },
        destinoRec,
        ahora,
      )
    : {
        id: generarId(),
        nombre: `Nuevo ${veredicto.especieDestino}`,
        json: bundleJson,
        creadoEn: ahora,
        actualizadoEn: ahora,
        // La especie no es columna del modelo: viaja como `speciesOnCreate`
        // del commit y el servidor actualiza el índice de workspace dentro
        // de la misma transacción.
      };
  const consolidatedBody = { ...body, autosalvado: false };
  const versionId = generarId();
  const version = {
    id: versionId,
    creadoEn: new Date().toISOString(),
    nombre: `agente·${nota}`,
    modeloPayloadKey: versionId,
    bytes: new TextEncoder().encode(consolidatedBody.json).byteLength,
  };
  let w: Response;
  try {
    w = await apiFn(`/modelos/${encodeURIComponent(consolidatedBody.id)}/revisiones`, {
      method: "POST",
      body: JSON.stringify({
        model: consolidatedBody,
        version,
        base,
        ...(opts.confirmado ? { confirmedByOperator: true } : {}),
        ...(!destinoRec ? { speciesOnCreate: veredicto.especieDestino } : {}),
      }),
    });
  } catch {
    console.error(
      "push interrumpido: el resultado es desconocido. Ejecuta pull para comprobar antes de reintentar.",
    );
    process.exit(1);
  }
  if (w.status === 409) {
    console.error("409: la base cambió desde el pull. Re-pull y reintenta.");
    process.exit(3);
  }
  if (w.status === 405 || w.status === 404 || w.status === 501) {
    console.error("push abortado: el backend aún no soporta revisiones atómicas; no se escribió nada");
    process.exit(1);
  }
  if (w.status >= 500) {
    console.error(
      `API ${w.status}: el resultado del commit es desconocido. Ejecuta pull para comprobar antes de reintentar.`,
    );
    process.exit(1);
  }
  if (!w.ok) {
    console.error(`API ${w.status}`);
    process.exit(1);
  }
  let guardadoBody: {
    model?: { id: string; revision?: number };
    version?: { id?: string };
  };
  try {
    guardadoBody = await w.json() as typeof guardadoBody;
  } catch {
    console.error(
      "respuesta de commit inválida; el cambio puede haberse aplicado. Ejecuta pull antes de reintentar.",
    );
    process.exit(1);
  }
  const guardado = guardadoBody.model;
  if (!guardado || guardadoBody.version?.id !== versionId) {
    console.error(
      "respuesta de commit inválida; el cambio puede haberse aplicado. Ejecuta pull antes de reintentar.",
    );
    process.exit(1);
  }
  console.log(`push ok: ${guardado.id} rev ${guardado.revision ?? "?"}`);
}

async function obtenerAutosave(
  modelId: string,
  apiFn: ApiFn,
): Promise<ObservedBaseState["autosave"]> {
  const response = await apiFn(`/modelos/${encodeURIComponent(modelId)}/autosave`);
  if (response.status === 404) return null;
  if (!response.ok) {
    console.error(`API ${response.status}: no se pudo observar el autosave`);
    process.exit(1);
  }
  try {
    const value = (await response.json()) as { creadoEn?: unknown; json?: unknown };
    if (typeof value.creadoEn !== "string" || !value.creadoEn ||
      typeof value.json !== "string" || !value.json) {
      console.error("respuesta de autosave inválida");
      process.exit(1);
    }
    return { createdAt: value.creadoEn, json: value.json };
  } catch {
    console.error("respuesta de autosave inválida");
    process.exit(1);
  }
}

/**
 * El sello de procedencia vive en `Modelo.procedencia`, que en el documento
 * serializado por `exportarModelo` queda anidado bajo `.modelo` — NO en la
 * raíz (`{ formato, modelo, carpetaId? }`). Ver src/mesa/validarPush.ts
 * (`bundleTieneSello`), que fija la misma regla del lado del bundle candidato.
 * Leer `procedencia` en la raíz aquí haría que el carril por procedencia
 * nunca se activara para el destino (push artesanal aceptado sobre un modelo
 * con proto) — corrección deliberada de Task 5 aplicada también aquí.
 */
function bundleTieneSelloRemoto(json: string): boolean {
  try {
    const procedencia = (JSON.parse(json) as { modelo?: { procedencia?: unknown } }).modelo?.procedencia;
    return procedencia != null && typeof procedencia === "object";
  } catch {
    return false;
  }
}

// --- dispatch ---
// Gated tras `import.meta.main` (Task 7, hallazgo IMPORTANT de revisión): sin
// esto, IMPORTAR este módulo desde un test ejecuta el CLI real (argv del test
// runner, `process.exit` en cuanto falta un verbo) — por eso `roundtrip.test.ts`
// reimplementaba la decisión del guard inline en vez de invocar `cmdPush`.
// Mismo idioma que `scripts/cordon-skill-audit.ts` (ya verificado en este repo).
if (import.meta.main) {
  const [, , verbo, ...rest] = process.argv;
  const flag = (n: string): string | undefined => {
    const i = rest.indexOf(n);
    return i >= 0 ? rest[i + 1] : undefined;
  };
  const has = (n: string): boolean => rest.includes(n);

  const USO = "uso: mesa <modelos|pull <ref>|push <ref> <bundle.json> [--base <Testigo-Base>] --nota … [--especie apunte|modelo] [--confirmado-por-operador]>";

  if (verbo === "modelos") {
    await cmdModelos();
  } else if (verbo === "pull") {
    const ref = rest[0];
    if (!ref) {
      console.error(USO);
      process.exit(2);
    }
    await cmdPull(ref);
  } else if (verbo === "push") {
    const ref = rest[0];
    const bundlePath = rest[1];
    if (!ref || !bundlePath) {
      console.error(USO);
      process.exit(2);
    }
    const especieFlag = flag("--especie");
    const especie = especieFlag === "apunte" || especieFlag === "modelo" ? especieFlag : undefined;
    const baseFlag = flag("--base");
    await cmdPush(ref, bundlePath, {
      nota: flag("--nota") ?? "",
      confirmado: has("--confirmado-por-operador"),
      ...(baseFlag ? { base: baseFlag } : {}),
      ...(especie ? { especie } : {}),
    });
  } else {
    console.error(USO);
    process.exit(2);
  }
}
