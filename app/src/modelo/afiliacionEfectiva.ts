import type { Id, Modelo } from "./tipos";

/**
 * Afiliación efectiva por cadena estructural (R-OPD-STR-13, R-OBJ-6/7):
 * los atributos/operaciones de una cosa ambiental son ambientales y se
 * renderizan con contorno discontinuo automáticamente. La herencia sube por
 * la cadena de EXHIBICIÓN (exhibitor → atributo/operación); las demás
 * relaciones estructurales no transmiten afiliación.
 *
 * Función pura de kernel: el campo `afiliacion` de la entidad NO se muta —
 * la herencia es un hecho derivado que consume el render (V-6, auditoría
 * 2026-06-11).
 */
export function esAfiliacionEfectivaAmbiental(modelo: Modelo, entidadId: Id): boolean {
  const visitados = new Set<Id>();
  const pendientes: Id[] = [entidadId];
  while (pendientes.length > 0) {
    const actualId = pendientes.pop();
    if (actualId === undefined || visitados.has(actualId)) continue;
    visitados.add(actualId);
    const entidad = modelo.entidades[actualId];
    if (!entidad) continue;
    if (entidad.afiliacion === "ambiental") return true;
    for (const enlace of Object.values(modelo.enlaces)) {
      if (enlace.tipo !== "exhibicion") continue;
      if (enlace.destinoId.id !== actualId) continue;
      if (!visitados.has(enlace.origenId.id)) pendientes.push(enlace.origenId.id);
    }
  }
  return false;
}
