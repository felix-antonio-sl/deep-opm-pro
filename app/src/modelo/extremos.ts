import type { Enlace, Entidad, Estado, ExtremoEnlace, Id, Modelo, Opd } from "./tipos";

export type ExtremoEntrada = Id | ExtremoEnlace;

export function extremoEntidad(id: Id): ExtremoEnlace {
  return { kind: "entidad", id };
}

export function extremoEstado(id: Id): ExtremoEnlace {
  return { kind: "estado", id };
}

export function normalizarExtremo(extremo: ExtremoEntrada): ExtremoEnlace {
  return typeof extremo === "string" ? extremoEntidad(extremo) : extremo;
}

export function extremoEsEntidad(extremo: ExtremoEnlace): boolean {
  return extremo.kind === "entidad";
}

export function extremoEsEstado(extremo: ExtremoEnlace): boolean {
  return extremo.kind === "estado";
}

export function extremoKey(extremo: ExtremoEnlace): string {
  return `${extremo.kind}:${extremo.id}`;
}

export function mismoExtremo(a: ExtremoEnlace, b: ExtremoEnlace): boolean {
  return a.kind === b.kind && a.id === b.id;
}

export function extremoApuntaAEntidad(extremo: ExtremoEnlace, entidadId: Id): boolean {
  return extremo.kind === "entidad" && extremo.id === entidadId;
}

export function estadoDeExtremo(modelo: Modelo, extremo: ExtremoEnlace): Estado | undefined {
  return extremo.kind === "estado" ? modelo.estados?.[extremo.id] : undefined;
}

export function entidadDeExtremo(modelo: Modelo, extremo: ExtremoEnlace): Entidad | undefined {
  if (extremo.kind === "entidad") return modelo.entidades[extremo.id];
  const estado = modelo.estados?.[extremo.id];
  return estado ? modelo.entidades[estado.entidadId] : undefined;
}

export function entidadIdDeExtremo(modelo: Modelo, extremo: ExtremoEnlace): Id | null {
  if (extremo.kind === "entidad") return modelo.entidades[extremo.id] ? extremo.id : null;
  const estado = modelo.estados?.[extremo.id];
  return estado && modelo.entidades[estado.entidadId] ? estado.entidadId : null;
}

export function objetoContenedorDeExtremo(modelo: Modelo, extremo: ExtremoEnlace): Entidad | undefined {
  const entidad = entidadDeExtremo(modelo, extremo);
  return entidad?.tipo === "objeto" ? entidad : undefined;
}

export function extremosDeEnlace(modelo: Modelo, enlace: Enlace): { origen: Entidad; destino: Entidad } | null {
  const origen = entidadDeExtremo(modelo, enlace.origenId);
  const destino = entidadDeExtremo(modelo, enlace.destinoId);
  return origen && destino ? { origen, destino } : null;
}

export function extremoVisibleEnOpd(modelo: Modelo, opd: Opd, extremo: ExtremoEnlace): boolean {
  const entidadId = entidadIdDeExtremo(modelo, extremo);
  return !!entidadId && Object.values(opd.apariencias).some((apariencia) => apariencia.entidadId === entidadId);
}

export function nombreExtremo(modelo: Modelo, extremo: ExtremoEnlace): string {
  const entidad = entidadDeExtremo(modelo, extremo);
  if (!entidad) return extremo.id;
  if (extremo.kind === "entidad") return entidad.nombre;
  const estado = estadoDeExtremo(modelo, extremo);
  return estado ? `${entidad.nombre} [${estado.nombre}]` : extremo.id;
}
