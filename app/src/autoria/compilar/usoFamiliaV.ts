// Observación pura para la migración familia-V → skill (F2/F3).
//
// `usoFamiliaV` deriva del ledger que `compilarProto` ya devuelve cuántas líneas
// se resolvieron por una regla de la familia V (`V1`..`V17`). No toca el
// compilador: es lectura. F2 lo usa para aserir "la ruta E2 estricta no usó
// familia-V"; F3 lo promoverá a métrica de auditoría por OPD.
//
// `proyeccionObservable` canoniza un Modelo a una forma comparable que IGNORA
// ids posicionales pero PRESERVA la semántica decidida (entidades por nombre+
// tipo, enlaces por tipo+extremos+etiqueta+modificador, estados por entidad,
// anclas por claveProto). Es la vara de equivalencia laxo↔E2: dos compilaciones
// son equivalentes sii sus proyecciones son iguales.

import type { Ledger } from "./compilador";
import type { Modelo } from "../../modelo/tipos";

/** Toda regla de la familia V (decisiones de léxico abierto migrables a la skill). */
const REGLAS_V = /^V([1-9]|1[0-7])$/;

export interface UsoFamiliaV {
  /** Total de líneas resueltas por alguna regla V. */
  total: number;
  /** Conteo por regla (`{ V5: 1 }`). Solo reglas con uso > 0. */
  porRegla: Record<string, number>;
}

/** Cuenta el uso de la familia V en el ledger de una compilación. Puro. */
export function usoFamiliaV(ledger: Ledger): UsoFamiliaV {
  const porRegla: Record<string, number> = {};
  let total = 0;
  for (const entrada of ledger.entradas) {
    const regla = "regla" in entrada ? entrada.regla : undefined;
    if (typeof regla === "string" && REGLAS_V.test(regla)) {
      porRegla[regla] = (porRegla[regla] ?? 0) + 1;
      total += 1;
    }
  }
  return { total, porRegla };
}

// ── Proyección observable (vara de equivalencia) ─────────────────────────────

interface EntidadObs {
  nombre: string;
  tipo: string;
  estados: string[];
}
interface EnlaceObs {
  tipo: string;
  origen: string;
  destino: string;
  etiqueta: string;
  modificador: string;
}
export interface ModeloObservable {
  entidades: EntidadObs[];
  enlaces: EnlaceObs[];
  anclas: Array<{ claveProto: string; estado: string }>;
}

function nombreExtremo(modelo: Modelo, extremo: { kind: string; id: string }): string {
  if (extremo.kind === "entidad") {
    return modelo.entidades[extremo.id]?.nombre ?? `?${extremo.id}`;
  }
  const estado = modelo.estados[extremo.id];
  if (!estado) return `?${extremo.id}`;
  const ent = modelo.entidades[estado.entidadId]?.nombre ?? `?${estado.entidadId}`;
  return `${ent}/${estado.nombre}`;
}

/**
 * Canoniza un Modelo a su forma observable comparable. Ordena listas por clave
 * estable para que la igualdad no dependa del orden de inserción.
 */
export function proyeccionObservable(modelo: Modelo): ModeloObservable {
  const estadosPorEntidad = new Map<string, string[]>();
  for (const estado of Object.values(modelo.estados)) {
    const arr = estadosPorEntidad.get(estado.entidadId) ?? [];
    arr.push(estado.nombre);
    estadosPorEntidad.set(estado.entidadId, arr);
  }
  const entidades: EntidadObs[] = Object.values(modelo.entidades)
    .map((e) => ({
      nombre: e.nombre,
      tipo: e.tipo,
      estados: (estadosPorEntidad.get(e.id) ?? []).slice().sort(),
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  const enlaces: EnlaceObs[] = Object.values(modelo.enlaces)
    .map((l) => ({
      tipo: l.tipo,
      origen: nombreExtremo(modelo, l.origenId),
      destino: nombreExtremo(modelo, l.destinoId),
      etiqueta: l.etiqueta ?? "",
      modificador: l.modificador ?? "",
    }))
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

  const anclas = Object.values(modelo.anclasNormativas ?? {})
    .map((a) => ({ claveProto: a.claveProto, estado: a.estado }))
    .sort((a, b) => a.claveProto.localeCompare(b.claveProto));

  return { entidades, enlaces, anclas };
}
