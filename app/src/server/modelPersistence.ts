import type { ModeloPersistido, ResumenModeloPersistido } from "../persistencia/local";

export interface ModelPersistenceRepository {
  list(includePayload?: boolean): Promise<Array<ModeloPersistido | ResumenModeloPersistido>>;
  get(id: string): Promise<ModeloPersistido | null>;
  save(modelo: ModeloPersistido): Promise<ModeloPersistido>;
  delete(id: string): Promise<boolean>;
  health?(): Promise<boolean>;
}

export interface ModelPersistenceOptions {
  repo: ModelPersistenceRepository;
  maxBodyBytes?: number;
}

const ENDPOINT = "/__deep-opm/modelos";
const DEFAULT_MAX_BODY_BYTES = 15 * 1024 * 1024;

export function crearModelPersistenceFetchHandler(options: ModelPersistenceOptions) {
  const maxBodyBytes = options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    if (url.pathname === "/healthz") {
      const ok = options.repo.health ? await options.repo.health() : true;
      return responderJson(ok ? 200 : 503, { ok });
    }
    if (url.pathname !== ENDPOINT && !url.pathname.startsWith(`${ENDPOINT}/`)) {
      return responderJson(404, { error: "Not found" });
    }

    try {
      if (request.method === "GET" && url.pathname === ENDPOINT) {
        const includePayload = url.searchParams.get("includePayload") === "1";
        const modelos = await options.repo.list(includePayload);
        return responderJson(200, { modelos });
      }

      const id = decodeURIComponent(url.pathname.slice(`${ENDPOINT}/`.length)).trim();
      if (request.method === "GET" && id) {
        const modelo = await options.repo.get(id);
        return modelo ? responderJson(200, { modelo }) : responderJson(404, { error: "Modelo no encontrado" });
      }

      if ((request.method === "POST" || request.method === "PUT") && url.pathname === ENDPOINT) {
        const payload = await leerJsonRequest(request, maxBodyBytes);
        const modelo = validarModeloPersistido(payload);
        const guardado = await options.repo.save(modelo);
        return responderJson(200, { modelo: guardado });
      }

      if (request.method === "DELETE" && id) {
        const deleted = await options.repo.delete(id);
        return responderJson(deleted ? 200 : 404, deleted ? { ok: true } : { error: "Modelo no encontrado" });
      }

      return responderJson(405, { error: "Metodo no permitido" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo procesar la persistencia";
      return responderJson(esErrorPayload(message) ? 400 : 500, { error: message });
    }
  };
}

async function leerJsonRequest(request: Request, maxBodyBytes: number): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > maxBodyBytes) {
    throw new Error("Payload demasiado grande");
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBodyBytes) throw new Error("Payload demasiado grande");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("JSON invalido");
  }
}

function validarModeloPersistido(input: unknown): ModeloPersistido {
  if (!esRecord(input)) throw new Error("Modelo persistido invalido");
  const record = esRecord(input.modelo) ? input.modelo : input;
  if (!esRecord(record)) throw new Error("Modelo persistido invalido");
  if (typeof record.id !== "string" || !record.id.trim()) throw new Error("Modelo persistido invalido: id");
  if (typeof record.nombre !== "string" || !record.nombre.trim()) throw new Error("Modelo persistido invalido: nombre");
  if (typeof record.creadoEn !== "string") throw new Error("Modelo persistido invalido: creadoEn");
  if (typeof record.actualizadoEn !== "string") throw new Error("Modelo persistido invalido: actualizadoEn");
  if (typeof record.json !== "string" || !record.json.trim()) throw new Error("Modelo persistido invalido: json");
  try {
    JSON.parse(record.json);
  } catch {
    throw new Error("Modelo persistido invalido: json");
  }
  const base: ModeloPersistido = {
    id: record.id,
    nombre: record.nombre,
    descripcion: typeof record.descripcion === "string" ? record.descripcion : "",
    creadoEn: record.creadoEn,
    actualizadoEn: record.actualizadoEn,
    json: record.json,
  };
  if (record.carpetaId === null || typeof record.carpetaId === "string") base.carpetaId = record.carpetaId;
  if (typeof record.ultimaApertura === "string") base.ultimaApertura = record.ultimaApertura;
  if (typeof record.autosalvado === "boolean") base.autosalvado = record.autosalvado;
  if (typeof record.archivado === "boolean") base.archivado = record.archivado;
  if (typeof record.archivadoEn === "string") base.archivadoEn = record.archivadoEn;
  if (typeof record.archivadoAuto === "boolean") base.archivadoAuto = record.archivadoAuto;
  if (Array.isArray(record.versiones)) base.versiones = record.versiones.filter(esVersionResumen);
  if (typeof record.crearVersionAlGuardar === "boolean") base.crearVersionAlGuardar = record.crearVersionAlGuardar;
  return base;
}

function esVersionResumen(value: unknown): boolean {
  if (!esRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.creadoEn !== "string" ||
    typeof value.nombre !== "string" ||
    typeof value.modeloPayloadKey !== "string" ||
    typeof value.bytes !== "number") {
    return false;
  }
  return true;
}

function responderJson(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function esErrorPayload(message: string): boolean {
  return message.startsWith("Payload") ||
    message.startsWith("JSON") ||
    message.startsWith("Modelo persistido");
}
