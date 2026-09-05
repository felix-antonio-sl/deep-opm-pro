import type { PersistenciaSesion } from "./modelPersistence";

export async function leerJsonRequest(request: Request, maxBodyBytes: number): Promise<unknown> {
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

export function responderJson(status: number, payload: unknown, session?: PersistenciaSesion): Response {
  const headers = new Headers({ "content-type": "application/json; charset=utf-8" });
  if (session?.setCookie) headers.set("set-cookie", session.setCookie);
  return new Response(JSON.stringify(payload), {
    status,
    headers,
  });
}

export function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
