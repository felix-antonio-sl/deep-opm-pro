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
 */
type RegistroRemoto = {
  id: string;
  nombre: string;
  json?: string;
  creadoEn: string;
  actualizadoEn: string;
  revision?: number;
  autosalvado?: boolean;
  esApunte?: boolean;
  esBiblioteca?: boolean;
};

async function listar(): Promise<RegistroRemoto[]> {
  const r = await api("/modelos");
  if (!r.ok) {
    console.error(`API ${r.status}`);
    process.exit(1);
  }
  const body = (await r.json()) as { modelos?: RegistroRemoto[] };
  return body.modelos ?? [];
}

async function resolverRef(ref: string): Promise<RegistroRemoto | null> {
  const lista = await listar();
  return lista.find((m) => m.id === ref) ?? lista.find((m) => m.nombre === ref) ?? null;
}

async function obtenerModelo(id: string): Promise<RegistroRemoto | null> {
  const r = await api(`/modelos/${encodeURIComponent(id)}`);
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

async function cmdPush(
  ref: string,
  bundlePath: string,
  opts: { nota: string; confirmado: boolean; especie?: "apunte" | "modelo" },
): Promise<void> {
  const bundleJson = readFileSync(bundlePath, "utf8");
  const encontrado = await resolverRef(ref);
  const destinoRec = encontrado ? await obtenerModelo(encontrado.id) : null;

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
  const ahora = new Date().toISOString();
  const body = destinoRec
    ? {
        id: destinoRec.id,
        nombre: destinoRec.nombre,
        json: bundleJson,
        creadoEn: destinoRec.creadoEn,
        actualizadoEn: ahora,
        revision: destinoRec.revision ?? 0,
      }
    : {
        id: crypto.randomUUID(),
        nombre: `Nuevo ${veredicto.especieDestino}`,
        json: bundleJson,
        creadoEn: ahora,
        actualizadoEn: ahora,
        ...(veredicto.especieDestino === "apunte" ? { esApunte: true } : {}),
      };
  const w = await api("/modelos", { method: "POST", body: JSON.stringify(body) });
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

  const versionId = crypto.randomUUID();
  const v = await api(`/modelos/${encodeURIComponent(guardado.id)}/versiones`, {
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
    return (JSON.parse(json) as { modelo?: { procedencia?: unknown } }).modelo?.procedencia != null;
  } catch {
    return false;
  }
}

// --- dispatch ---
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
