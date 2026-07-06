import type { PersistenciaSessionResolver } from "./modelPersistence";
import { crearResolverEncadenado, crearTokenSessionResolver } from "./tokenSessionResolver";

/**
 * Selector puro (Task 8 Ola 1, FIX 2 + FIX 3 de la revisión whole-branch) de
 * qué `PersistenciaSessionResolver` usar para el carril de agente. Extraído
 * de `scripts/model-persistence-api.ts::construirSessionResolver` (que
 * quedó como envoltorio delgado sobre `process.env`) para poder testear la
 * DECISIÓN sin arrancar ese script — importarlo dispara `Bun.serve` +
 * `inicializarSchema()` contra Postgres en el top-level.
 *
 * Habilita el carril de token SOLO si:
 *   1. el token tiene ≥48 caracteres (mínimo de entropía), Y
 *   2. la identidad "tenantId:userId" separa en DOS partes, AMBAS no vacías.
 *
 * FIX 2 (hallazgo de revisión): el guard previo (`AGENT_IDENTITY.includes(":")`)
 * pasaba con el valor literal ":" — produciendo tenantId/userId vacíos con
 * `auth:true`, un hueco de identidad. Aquí se exige explícitamente que
 * NINGUNA de las dos partes quede vacía; si falla, cae al `cookieResolver`
 * (fail-closed), igual que la ausencia total de token o de identidad.
 */
export function elegirSessionResolver(
  env: { token?: string | undefined; identity?: string | undefined },
  cookieResolver: PersistenciaSessionResolver,
  logHabilitado: (habilitado: boolean) => void = () => {},
): PersistenciaSessionResolver {
  const { token, identity } = env;
  if (token && token.length >= 48 && identity) {
    const [tenantId = "", userId = ""] = identity.split(":", 2);
    if (tenantId && userId) {
      const tokenResolver = crearTokenSessionResolver({ token, tenantId, userId });
      logHabilitado(true);
      return crearResolverEncadenado([tokenResolver, cookieResolver]);
    }
  }
  logHabilitado(false);
  return cookieResolver; // fail-closed: sin identidad válida, carril deshabilitado
}
