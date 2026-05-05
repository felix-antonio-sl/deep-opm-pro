import type { Id, Modelo } from "../modelo/tipos";
import type { OplLineaInteractiva } from "./interaccion";

export type OracionOpl = OplLineaInteractiva & {
  opdId: Id;
  opdNombre: string;
  opdProfundidad: number;
};

export interface BloqueOpl {
  opdId: Id;
  opdNombre: string;
  profundidad: number;
  oraciones: OracionOpl[];
}

export function agruparOracionesPorOpd(oraciones: OplLineaInteractiva[], modelo: Modelo): BloqueOpl[] {
  const bloques = new Map<Id, BloqueOpl>();
  for (const oracion of oraciones) {
    const opdId = oracion.opdId;
    if (!opdId || !modelo.opds[opdId]) continue;
    const opd = modelo.opds[opdId]!;
    const existente = bloques.get(opdId);
    const oracionConOpd: OracionOpl = {
      ...oracion,
      opdId,
      opdNombre: oracion.opdNombre ?? opd.nombre,
      opdProfundidad: oracion.opdProfundidad ?? profundidadOpd(modelo, opdId),
    };
    if (existente) {
      existente.oraciones.push(oracionConOpd);
      continue;
    }
    bloques.set(opdId, {
      opdId,
      opdNombre: oracionConOpd.opdNombre,
      profundidad: oracionConOpd.opdProfundidad,
      oraciones: [oracionConOpd],
    });
  }
  return ordenarOpdsParaOpl(modelo)
    .flatMap((opdId) => {
      const bloque = bloques.get(opdId);
      return bloque ? [bloque] : [];
    });
}

export function aplanarBloquesOpl(bloques: BloqueOpl[], colapsados: Set<Id>): OracionOpl[] {
  return bloques.flatMap((bloque) => colapsados.has(bloque.opdId) ? [] : bloque.oraciones);
}

export function chevronEstadoBloque(colapsados: Set<Id>, opdId: Id): "colapsado" | "expandido" {
  return colapsados.has(opdId) ? "colapsado" : "expandido";
}

export function togglearColapsoBloque(colapsados: Set<Id>, opdId: Id): Set<Id> {
  const siguiente = new Set(colapsados);
  if (siguiente.has(opdId)) siguiente.delete(opdId);
  else siguiente.add(opdId);
  return siguiente;
}

export function ordenarOpdsParaOpl(modelo: Modelo): Id[] {
  const resultado: Id[] = [];
  const cola: Id[] = modelo.opds[modelo.opdRaizId] ? [modelo.opdRaizId] : [];
  const visitados = new Set<Id>();
  while (cola.length > 0) {
    const actual = cola.shift()!;
    if (visitados.has(actual)) continue;
    visitados.add(actual);
    resultado.push(actual);
    const hijos = Object.values(modelo.opds)
      .filter((opd) => opd.padreId === actual)
      .sort((a, b) => (a.ordenLocal ?? 0) - (b.ordenLocal ?? 0) || a.nombre.localeCompare(b.nombre, "es-CL") || a.id.localeCompare(b.id));
    cola.push(...hijos.map((opd) => opd.id));
  }
  return resultado;
}

export function profundidadOpd(modelo: Modelo, opdId: Id): number {
  let profundidad = 0;
  let actual = modelo.opds[opdId];
  const vistos = new Set<Id>();
  while (actual?.padreId && modelo.opds[actual.padreId] && !vistos.has(actual.id)) {
    vistos.add(actual.id);
    profundidad += 1;
    actual = modelo.opds[actual.padreId];
  }
  return profundidad;
}
