import type { Entidad } from "../tipos/entidad";
import type { ExtremoEnlace } from "../tipos/enlace";
import type { Id, Modelo } from "../tipos";

export interface ObservacionLinealidad {
  codigo: "lineal-multiple-consumo";
  severidad: "error-linealidad";
  entidadId: Id;
  procesos: Id[];
  mensaje: string;
}

export function esLineal(entidad: Entidad): boolean {
  return entidad.lineal === true;
}

function extremoEntidadId(extremo: ExtremoEnlace, modelo: Modelo): Id | null {
  if (extremo.kind === "entidad") return extremo.id;
  return modelo.estados[extremo.id]?.entidadId ?? null;
}

export function verificarLinealidad(modelo: Modelo): ObservacionLinealidad[] {
  const consumosExentosPorXor = new Set(
    Object.values(modelo.abanicos ?? {})
      .filter((abanico) => abanico.operador === "XOR")
      .flatMap((abanico) => abanico.enlaceIds),
  );
  const consumidoresPorObjeto = new Map<Id, Set<Id>>();
  for (const enlace of Object.values(modelo.enlaces)) {
    if (enlace.tipo !== "consumo") continue;
    if (consumosExentosPorXor.has(enlace.id)) continue;
    const objetoId = extremoEntidadId(enlace.origenId, modelo);
    const procesoId = extremoEntidadId(enlace.destinoId, modelo);
    if (!objetoId || !procesoId) continue;
    if (!consumidoresPorObjeto.has(objetoId)) consumidoresPorObjeto.set(objetoId, new Set());
    consumidoresPorObjeto.get(objetoId)!.add(procesoId);
  }
  const obs: ObservacionLinealidad[] = [];
  for (const [objetoId, procesos] of consumidoresPorObjeto) {
    const entidad = modelo.entidades[objetoId];
    if (entidad && esLineal(entidad) && procesos.size > 1) {
      obs.push({
        codigo: "lineal-multiple-consumo",
        severidad: "error-linealidad",
        entidadId: objetoId,
        procesos: [...procesos],
        mensaje: `El objeto lineal '${entidad.nombre}' es consumido por ${procesos.size} procesos; un recurso lineal no se copia.`,
      });
    }
  }
  return obs;
}
