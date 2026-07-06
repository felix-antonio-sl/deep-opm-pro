// CLI de mesa (3 verbos): capa delgada de I/O sobre la lógica ya testeada de
// `mesa pull`/`mesa push` (src/mesa/contextoPull.ts, src/mesa/validarPush.ts).
// Este script NO decide nada — arma el contexto (fetch + token) y delega toda
// decisión (base a usar, permiso de escritura) a las funciones puras.
// Uso:
//   bun run mesa modelos
//   bun run mesa pull <ref>
//   bun run mesa push <ref> <bundle.json> --nota "…" [--especie apunte|modelo] [--confirmado-por-operador]
// Config: env OPFORJA_API_URL (default instancia prod) + archivo
// ~/.config/opforja/agent-token (o OPFORJA_AGENT_TOKEN_FILE).
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { especieDe, type Especie } from "../src/persistencia/especie";
import { componerPull, elegirBase } from "../src/mesa/contextoPull";
import { evaluarPush } from "../src/mesa/validarPush";
import { esSinDelta } from "../src/mesa/esSinDelta";
import { construirBodyActualizacion } from "../src/mesa/construirBodyActualizacion";
import { generarId, type ResumenModeloPersistido } from "../src/persistencia/modelos";

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

async function cmdModelos(): Promise<void> {
  const lista = await listar();
  for (const m of lista) {
    console.log(`${m.id}\t${especieDe(m)}\trev ${m.revision ?? 0}\t${m.nombre}`);
  }
}

async function cmdPull(ref: string): Promise<void> {
  const encontrado = await resolverRef(ref);
  if (!encontrado) {
    console.error("modelo no encontrado");
    process.exit(1);
  }
  const rec = await obtenerModelo(encontrado.id);
  if (!rec || typeof rec.json !== "string") {
    console.error("modelo no encontrado");
    process.exit(1);
  }
  // El autosave vive en un endpoint SEPARADO (GET /modelos/:id/autosave →
  // { modeloId, creadoEn, json }); el record solo trae el flag `autosalvado`.
  let autosave: { creadoEn: string; json: string } | undefined;
  if (rec.autosalvado) {
    const a = await api(`/modelos/${encodeURIComponent(rec.id)}/autosave`);
    if (a.ok) {
      const av = (await a.json()) as { creadoEn?: string; json?: string };
      if (av.creadoEn && av.json) autosave = { creadoEn: av.creadoEn, json: av.json };
    }
  }
  const base = elegirBase({
    guardadoActualizadoEn: rec.actualizadoEn,
    guardadoJson: rec.json,
    guardadoRev: rec.revision ?? 0,
    ...(autosave ? { autosave } : {}),
  });
  console.log(componerPull({ nombre: rec.nombre, especie: especieDe(rec), base }));
}

export async function cmdPush(
  ref: string,
  bundlePath: string,
  opts: { nota: string; confirmado: boolean; especie?: "apunte" | "modelo" },
  deps: { api?: ApiFn } = {},
): Promise<void> {
  const apiFn = deps.api ?? api;
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

  // CLAUSURA (Task 7, ley push∘pull sin delta = no-op): si el bundle
  // candidato tiene el MISMO significado que el `json` remoto vigente,
  // abortar ANTES de escribir — sin llamar a `evaluarPush` ni emitir el POST.
  // Sin este guard, un ciclo pull→push sin ediciones igual crea revisión en
  // el backend real (`model-persistence-api.ts::save` avanza la revisión en
  // CADA escritura sin comparar contenido) — el guard debe vivir del lado
  // cliente porque el backend no lo hace. Solo aplica al ACTUALIZAR (hay un
  // `destinoRec.json` remoto contra el cual comparar); al crear no hay nada
  // que comparar. Ver `esSinDelta.test.ts` (unit) + `roundtrip.test.ts`
  // (ley end-to-end contra el handler en memoria).
  if (destinoRec && typeof destinoRec.json === "string" && esSinDelta(bundleJson, destinoRec.json)) {
    console.error("sin cambios: no se crea revisión");
    process.exit(4);
  }

  let destinoInfo: { tieneSello: boolean; especie: Especie } | undefined;
  let baseFueAutosave = false;
  if (destinoRec) {
    destinoInfo = { tieneSello: bundleTieneSelloRemoto(destinoRec.json ?? ""), especie: especieDe(destinoRec) };
    baseFueAutosave = Boolean(destinoRec.autosalvado);
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

  // Escritura: crea (POST /modelos, id fresco) o actualiza (mismo id, revision
  // vigente para el optimistic lock; creadoEn preservado). El endpoint exige
  // creadoEn/actualizadoEn como strings no vacíos y, en actualización, la
  // revision exacta — si no coincide, 409 (PersistenciaConflictError).
  //
  // CRÍTICO (bug de integridad corregido): `save()` en model-persistence-api.ts
  // hace `INSERT ... ON CONFLICT DO UPDATE SET <TODAS las columnas>` desde el
  // body recibido — sin merge contra lo persistido. Enviar solo
  // id/nombre/json/creadoEn/actualizadoEn/revision (como hacía este CLI antes)
  // pisa silenciosamente descripcion (→ ""), carpetaId (→ null, saca de la
  // carpeta), archivado*/versiones/crearVersionAlGuardar (→ ausentes). Se usa
  // `construirBodyActualizacion` (envoltorio de la utilidad canónica
  // `construirModeloPersistido`, la misma que usa el store del producto en
  // src/store/persistencia.ts) para preservar esos campos desde `destinoRec`.
  const ahora = new Date().toISOString();
  const body = destinoRec
    ? construirBodyActualizacion(
        { id: destinoRec.id, nombre: destinoRec.nombre, json: bundleJson, revision: destinoRec.revision ?? 0 },
        destinoRec,
        ahora,
      )
    : {
        id: generarId(),
        nombre: `Nuevo ${veredicto.especieDestino}`,
        json: bundleJson,
        creadoEn: ahora,
        actualizadoEn: ahora,
        // NO se manda `esApunte` aquí: el endpoint de creación no tiene
        // columna para ese flag (vive hoy solo en el índice de workspace,
        // que este CLI no escribe) — incluirlo en el body sería un no-op
        // que engaña a quien lea el body pensando que algo se persistió.
        // Ver el aviso post-creación más abajo (FIX 1, Task 8).
      };
  const w = await apiFn("/modelos", { method: "POST", body: JSON.stringify(body) });
  if (w.status === 409) {
    console.error("409: la mesa avanzó bajo tus pies. Re-pull y reintenta.");
    process.exit(3);
  }
  if (!w.ok) {
    console.error(`API ${w.status}`);
    process.exit(1);
  }
  const guardadoBody = (await w.json()) as { modelo?: { id: string; revision?: number } };
  const guardado = guardadoBody.modelo;
  if (!guardado) {
    console.error("respuesta de guardado inválida");
    process.exit(1);
  }
  console.log(`push ok: ${guardado.id} rev ${guardado.revision ?? "?"}`);

  // FIX 1 (Task 8, revisión whole-branch): al CREAR con `--especie apunte`,
  // el flag no se persiste en ninguna parte hoy (ni columna Postgres ni
  // índice de workspace, que este CLI no escribe) — `push ok` no puede ser
  // la única señal, o el operador cree que quedó marcado como apunte.
  if (!destinoRec && veredicto.especieDestino === "apunte") {
    console.error(
      "nota: la especie «apunte» no se persiste en Ola 1 (los flags viven en el índice de workspace, aún no cableado por el CLI); el modelo se creó como modelo normal. Márcalo como apunte desde la app si lo necesitas.",
    );
  }

  const versionId = generarId();
  const v = await apiFn(`/modelos/${encodeURIComponent(guardado.id)}/versiones`, {
    method: "POST",
    body: JSON.stringify({
      version: {
        id: versionId,
        creadoEn: new Date().toISOString(),
        nombre: `agente·${opts.nota}`,
        modeloPayloadKey: versionId,
        bytes: bundleJson.length,
      },
      json: bundleJson,
    }),
  });
  if (!v.ok) console.error(`aviso: no se pudo etiquetar la versión (API ${v.status})`);
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

  const USO = "uso: mesa <modelos|pull <ref>|push <ref> <bundle.json> --nota … [--especie apunte|modelo] [--confirmado-por-operador]>";

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
    await cmdPush(ref, bundlePath, {
      nota: flag("--nota") ?? "sin nota",
      confirmado: has("--confirmado-por-operador"),
      ...(especie ? { especie } : {}),
    });
  } else {
    console.error(USO);
    process.exit(2);
  }
}
