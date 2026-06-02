import type { Id, Modelo } from "../tipos";
import { obtenerRefinamiento } from "../refinamientos";
import { verificarEquivalencia } from "./verificar";

export interface DescomposicionIncoherente {
  /** Proceso cuya descomposición no preserva su frontera. */
  procesoId: Id;
  /** OPD donde el proceso aparece con su frontera abstracta (padre del hijo). */
  opdAbstractoId: Id;
  /** OPD hijo (in-zoom) que rompe la frontera. */
  opdDescomposicionId: Id;
  /** Roles de frontera presentes en una vista y ausentes en la otra. */
  diferencias: string[];
}

/**
 * Ley in-zoom ↔ out-zoom (F2): la descomposición de un proceso debe ser
 * FRONTERA-EQUIVALENTE al proceso abstracto. La vista abstracta (el proceso en
 * su OPD padre) y la vista detallada (su OPD hijo) son dos realizaciones del
 * mismo hecho; deben ejercer los mismos roles netos sobre el contorno.
 *
 * Reusa `verificarEquivalencia` (firma de frontera) tomando opdA = OPD padre,
 * opdB = OPD de descomposición. Devuelve solo las descomposiciones incoherentes.
 * Puro: no muta el modelo.
 */
export function observarPreservacionFrontera(modelo: Modelo): DescomposicionIncoherente[] {
  const out: DescomposicionIncoherente[] = [];
  for (const entidad of Object.values(modelo.entidades)) {
    if (entidad.tipo !== "proceso") continue;
    const slot = obtenerRefinamiento(entidad, "descomposicion");
    if (!slot) continue;
    const opdHijo = modelo.opds[slot.opdId];
    if (!opdHijo?.padreId) continue;
    const resultado = verificarEquivalencia(modelo, {
      padreId: entidad.id,
      opdA: opdHijo.padreId,
      opdB: slot.opdId,
    });
    if (resultado.ok && !resultado.value.equivalente) {
      out.push({
        procesoId: entidad.id,
        opdAbstractoId: opdHijo.padreId,
        opdDescomposicionId: slot.opdId,
        diferencias: resultado.value.diferencias ?? [],
      });
    }
  }
  return out;
}
