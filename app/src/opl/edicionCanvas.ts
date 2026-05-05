import { renombrarEtiquetaEnlace } from "../modelo/etiquetasEnlace";
import { renombrarEntidad, renombrarEstado } from "../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../modelo/tipos";

/**
 * Intención de edición originada desde la lente OPL-ES hacia el canvas.
 * Cada variante describe una mutación que el store debe aplicar
 * invocando la operación de modelo correspondiente.
 *
 * SSOT: opm-opl-es.md §1 — OPL como representación textual derivada.
 * metolodogia-opm-es.md §15 — la edición inversa no altera el modelo
 * desde una vista derivada salvo cuando se refiere explícitamente.
 */
export type IntencionEdicionOpl =
  | { tipo: "renombrar-entidad"; id: Id; nombre: string }
  | { tipo: "renombrar-estado"; estadoId: Id; nombre: string }
  | { tipo: "fijar-etiqueta-enlace"; enlaceId: Id; etiqueta: string }
  | { tipo: "abrir-inspector-enlace"; enlaceId: Id };

/**
 * Aplica una intención de edición OPL al modelo.
 * "abrir-inspector-enlace" no muta el modelo; solo señala al store
 * que debe abrir el inspector de ese enlace.
 *
 * @returns Resultado.ok con el modelo modificado, o Resultado.error si los ids no existen.
 */
export function aplicarEdicionOpl(
  modelo: Modelo,
  intencion: IntencionEdicionOpl,
): Resultado<Modelo> {
  switch (intencion.tipo) {
    case "renombrar-entidad": {
      if (!modelo.entidades[intencion.id]) {
        return fallo(`Entidad no existe: ${intencion.id}`);
      }
      return renombrarEntidad(modelo, intencion.id, intencion.nombre);
    }
    case "renombrar-estado": {
      if (!modelo.estados[intencion.estadoId]) {
        return fallo(`Estado no existe: ${intencion.estadoId}`);
      }
      return renombrarEstado(modelo, intencion.estadoId, intencion.nombre);
    }
    case "fijar-etiqueta-enlace": {
      if (!modelo.enlaces[intencion.enlaceId]) {
        return fallo(`Enlace no existe: ${intencion.enlaceId}`);
      }
      return renombrarEtiquetaEnlace(modelo, intencion.enlaceId, intencion.etiqueta);
    }
    case "abrir-inspector-enlace": {
      // No muta el modelo. El store interpreta esta intención
      // para abrir el inspector del enlace sin modificar el modelo.
      if (!modelo.enlaces[intencion.enlaceId]) {
        return fallo(`Enlace no existe: ${intencion.enlaceId}`);
      }
      return ok(modelo);
    }
  }
}

// ── helpers ──

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
