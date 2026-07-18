import { Buffer } from "node:buffer";
import { timingSafeEqual } from "node:crypto";
import type { PersistenciaSesion, PersistenciaSessionResolver } from "./modelPersistence";

/**
 * Resolver de sesión por token de agente (Bearer). Producto del corte
 * «puente directo mesa↔skill» (A′-motor). Encadenado ANTES del resolver de
 * cookies: si el token autentica, la skill recibe una sesión `agent` que el
 * handler confina a lectura + commit atómico; si no, la cadena cae al
 * comportamiento de navegador intacto.
 */
export function crearTokenSessionResolver(opts: {
  token: string;
  tenantId: string;
  userId: string;
}): PersistenciaSessionResolver {
  const esperado = Buffer.from(opts.token);
  return {
    async resolve(request): Promise<PersistenciaSesion> {
      const header = request.headers.get("authorization") ?? "";
      const prefijo = "Bearer ";
      if (header.startsWith(prefijo)) {
        const presentado = Buffer.from(header.slice(prefijo.length));
        // timingSafeEqual exige longitudes iguales; el guard evita su throw
        // y a la vez no filtra la longitud por tiempo (rechazo inmediato).
        if (presentado.length === esperado.length && timingSafeEqual(presentado, esperado)) {
          return {
            tenantId: opts.tenantId,
            userId: opts.userId,
            auth: true,
            authKind: "agent",
          };
        }
      }
      // Sin auth: la cadena decide (el siguiente resolver o el 401 del gate).
      return { tenantId: "", userId: "" };
    },
  };
}

export function crearResolverEncadenado(
  resolvers: PersistenciaSessionResolver[],
): PersistenciaSessionResolver {
  return {
    async resolve(request): Promise<PersistenciaSesion> {
      let ultima: PersistenciaSesion = { tenantId: "", userId: "" };
      for (const r of resolvers) {
        const s = await r.resolve(request);
        if (s.auth === true) return s;
        ultima = s;
      }
      return ultima;
    },
  };
}
