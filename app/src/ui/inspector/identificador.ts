// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
//
// Ronda Codex v2 / L3: el header del Inspector mostraba el `id` interno crudo
// (`o-11`, `p-3`), pero el canvas rotula la misma entidad con el identificador
// canónico de punto (`o.11`, `p.03`) vía `identificadorCanonicoEntidad`
// (render/jointjs/composers/entidad.ts, ui-forja §08/1.3, SSOT
// opm-visual-es §identificadores). Para que ambos hablen con una sola voz, el
// Inspector reusa la misma transformación.
//
// No se importa desde `render/` (frontera dura: el Inspector es chrome, el
// renderer es adaptador desechable y está fuera del scope de esta línea). Se
// replica la lógica pura — secuencia global monótona del `id` interno
// (`<prefijo>-<n>`) proyectada a `<prefijo>.<n>` con zero-pad a 2.
import type { Id } from "../../modelo/tipos";

/**
 * Convierte un `id` interno de entidad (`o-11`, `p-3`) al identificador
 * canónico de punto que rotula el canvas (`o.11`, `p.03`). Lectura pura, no
 * muta modelo ni proyección.
 */
export function identificadorInspector(id: Id): string {
  const sufijo = id.includes("-") ? id.slice(id.lastIndexOf("-") + 1) : id.replace(/^[a-zA-Z]+/, "");
  const prefijo = id.includes("-") ? id.slice(0, id.indexOf("-")) : id.replace(/[0-9].*$/, "");
  const n = Number.parseInt(sufijo, 10);
  const seq = Number.isFinite(n) ? String(n).padStart(2, "0") : (sufijo || "01");
  return prefijo ? `${prefijo}.${seq}` : seq;
}

/**
 * Identificador canónico de enlace (`e-5` → `e.05`). Misma transformación de
 * punto que las entidades; mantiene una sola voz entre Inspector y canvas.
 */
export function identificadorEnlaceInspector(id: Id): string {
  return identificadorInspector(id);
}
