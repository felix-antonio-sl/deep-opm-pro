import { esAutoInvocacion } from "../../modelo/autoinvocacion";
import { entidadDeExtremo, entidadIdDeExtremo, estadoDeExtremo } from "../../modelo/extremos";
import type { Abanico, Enlace, Entidad, Estado, Id, Modelo, TipoEnlace } from "../../modelo/tipos";
import type { OplReferencia, OplTokenHint } from "../interaccion";

/**
 * Helpers compartidos de referencias, hints y formato OPL puro.
 * Cubre SSOT OPL-ES §1, §12 y §13; consumidores: generadores OPL y barrel `opl/generar.ts`.
 * OPCloud usa modulos logicos atomicos con `getText()` y un agregador en
 * `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/LogicalPart/LogicalTextModule.ts:36-47`.
 */

export type OplLineaPendiente = { texto: string; refs: OplReferencia[]; hints: OplTokenHint[] };

export function agregarLinea(
  lineas: OplLineaPendiente[],
  texto: string | null,
  refs: OplReferencia[],
  hints: OplTokenHint[],
): void {
  if (!texto) return;
  lineas.push({ texto, refs, hints });
}

export function refsEnlace(modelo: Modelo, enlace: Enlace): OplReferencia[] {
  const refs: OplReferencia[] = [refEnlace(enlace.id)];
  const origen = entidadIdDeExtremo(modelo, enlace.origenId);
  const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
  if (origen) refs.push(refEntidad(origen));
  if (destino) refs.push(refEntidad(destino));
  if (enlace.origenId.kind === "estado") refs.push(refEstado(enlace.origenId.id));
  if (enlace.destinoId.kind === "estado") refs.push(refEstado(enlace.destinoId.id));
  return refs;
}

export function hintsEnlace(modelo: Modelo, enlace: Enlace, texto: string): OplTokenHint[] {
  const hints: OplTokenHint[] = [];
  const origen = entidadDeExtremo(modelo, enlace.origenId);
  const destino = entidadDeExtremo(modelo, enlace.destinoId);
  if (origen) hints.push(hintEntidad(origen, nombreOplExtremo(modelo, enlace.origenId, enlace.multiplicidadOrigen)));
  const verbo = verboInteractivo(enlace, texto);
  if (verbo) hints.push(hintEnlace(enlace, verbo));
  if (destino) hints.push(hintEntidad(destino, nombreOplExtremo(modelo, enlace.destinoId, enlace.multiplicidadDestino)));
  const estadoOrigen = estadoDeExtremo(modelo, enlace.origenId);
  const estadoDestino = estadoDeExtremo(modelo, enlace.destinoId);
  if (estadoOrigen) hints.push(hintEstado(estadoOrigen));
  if (estadoDestino) hints.push(hintEstado(estadoDestino));
  return hints;
}

export function refsAbanico(modelo: Modelo, abanico: Abanico): OplReferencia[] {
  const refs: OplReferencia[] = [refEntidad(abanico.puertoEntidadId)];
  for (const id of abanico.enlaceIds) {
    const enlace = modelo.enlaces[id];
    if (enlace) refs.push(...refsEnlace(modelo, enlace));
  }
  return refs;
}

export function hintsAbanico(modelo: Modelo, abanico: Abanico, texto: string): OplTokenHint[] {
  const enlaces = abanico.enlaceIds
    .map((id) => modelo.enlaces[id])
    .filter((enlace): enlace is Enlace => enlace !== undefined);
  const puerto = modelo.entidades[abanico.puertoEntidadId];
  const hints: OplTokenHint[] = puerto ? [hintEntidad(puerto)] : [];
  const primer = enlaces[0];
  const verbo = primer ? verboInteractivo(primer, texto) : null;
  if (primer && verbo) hints.push(hintEnlace(primer, verbo));
  for (const enlace of enlaces) {
    const origenEntId = entidadIdDeExtremo(modelo, enlace.origenId);
    const otroExtremo = origenEntId === abanico.puertoEntidadId ? enlace.destinoId : enlace.origenId;
    const entidad = entidadDeExtremo(modelo, otroExtremo);
    if (entidad) hints.push(hintEntidad(entidad));
  }
  return hints;
}

export function refsEntidad(id: Id): OplReferencia[] {
  return [refEntidad(id)];
}

export function refEntidad(id: Id): OplReferencia {
  return { tipo: "entidad", id };
}

export function refEnlace(id: Id): OplReferencia {
  return { tipo: "enlace", id };
}

export function refEstado(id: Id): OplReferencia {
  return { tipo: "estado", id };
}

export function hintEntidad(entidad: Entidad, texto = nombreOpl(entidad)): OplTokenHint {
  const textoEntidad = texto === nombreOpl(entidad) && entidad.valorSlot ? nombreOplAtributoValor(entidad) : texto;
  return {
    texto: textoEntidad,
    ref: refEntidad(entidad.id),
    rol: "nombre",
    markdown: entidad.tipo === "objeto" ? "objeto" : "proceso",
  };
}

export function hintEstado(estado: Estado): OplTokenHint {
  return {
    texto: `\`${estado.nombre}\``,
    ref: refEstado(estado.id),
    rol: "estado",
    markdown: "estado",
  };
}

export function hintEnlace(enlace: Enlace, texto: string): OplTokenHint {
  return {
    texto,
    ref: refEnlace(enlace.id),
    rol: "verbo",
  };
}

export function verboInteractivo(enlace: Enlace, texto: string): string | null {
  const candidatos = [
    ...(esAutoInvocacion(enlace) ? ["se invoca"] : []),
    ...(enlace.modificador === "evento" ? ["inicia y maneja", "inicia e invoca", "inicia"] : []),
    ...(enlace.modificador === "condicion" ? ["ocurre si", "maneja", "invoca"] : []),
    ...(enlace.modificador === "no" ? ["no maneja", "no requiere", "no consume", "no genera", "no afecta"] : []),
    ...verbosPorTipo[enlace.tipo],
  ];
  return candidatos.find((candidato) => texto.includes(candidato)) ?? null;
}

const verbosPorTipo: Record<TipoEnlace, string[]> = {
  agregacion: ["consta", "constan"],
  exhibicion: ["exhibe", "exhiben"],
  generalizacion: ["es un", "son"],
  clasificacion: ["es una instancia", "son instancias"],
  agente: ["maneja", "manejan", "es manejado"],
  instrumento: ["requiere", "requieren", "es requerido"],
  consumo: ["consume", "consumen", "cambia"],
  resultado: ["genera", "generan", "cambia"],
  efecto: ["afecta", "afectan"],
  invocacion: ["invoca", "invocan", "se invoca"],
};

export function nombreOpl(entidad: Entidad): string {
  const nombre = nombreOplBase(entidad, entidad.nombre);
  return entidad.alias ? `${nombre} {${entidad.alias}}` : nombre;
}

export function nombreOplAtributoValor(entidad: Entidad): string {
  return entidad.tipo === "objeto" ? `**${entidad.nombre}**` : `*${entidad.nombre}*`;
}

export function nombreOplExtremo(modelo: Modelo, extremo: Enlace["origenId"], multiplicidad: string | undefined): string {
  const entidad = entidadDeExtremo(modelo, extremo);
  if (!entidad) return extremo.id;
  const base = nombreOplConMultiplicidad(entidad, multiplicidad);
  const estado = estadoDeExtremo(modelo, extremo);
  return estado ? `${base} en \`${estado.nombre}\`` : base;
}

export function nombreOplConMultiplicidad(entidad: Entidad, multiplicidad: string | undefined): string {
  const nombre = multiplicidadPlural(multiplicidad) ? pluralizarCanonico(entidad.nombre) : entidad.nombre;
  const token = nombreOplBase(entidad, nombre);
  return multiplicidad ? `${multiplicidad} ${token}` : token;
}

export function nombreOplBase(entidad: Entidad, nombre: string): string {
  const conUnidad = entidad.tipo === "objeto" && entidad.unidad ? `${nombre} [${entidad.unidad}]` : nombre;
  return entidad.tipo === "objeto" ? `**${conUnidad}**` : `*${conUnidad}*`;
}

export function pluralizarCanonico(texto: string): string {
  if (/z$/i.test(texto)) return `${texto.slice(0, -1)}ces`;
  if (/[aeiou]$/i.test(texto)) return `${texto}s`;
  return `${texto}es`;
}

export function multiplicidadPlural(multiplicidad: string | undefined): boolean {
  if (!multiplicidad) return false;
  if (multiplicidad === "*") return true;
  if (/^\d+$/.test(multiplicidad)) return Number(multiplicidad) !== 1;
  if (multiplicidad.endsWith("..N")) return true;
  const [, max] = multiplicidad.split("..");
  return Number(max) !== 1;
}

export function verbo(singular: string, plural: string, usarPlural: boolean): string {
  return usarPlural ? plural : singular;
}

export function listarOpl(items: string[]): string {
  if (items.length === 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

export function listarEstadosOpl(items: string[]): string {
  if (items.length === 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} o ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} o ${items[items.length - 1]}`;
}

export function listarDesignaciones(items: string[]): string {
  if (items.length === 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

export function codigoOpd(nombre: string): string {
  return /^SD(?:\d+(?:\.\d+)*)?/.exec(nombre.trim())?.[0] ?? nombre;
}

export function textoEsencia(entidad: Entidad): string {
  return entidad.esencia === "fisica" ? "físico" : "informacional";
}

export function textoAfiliacion(entidad: Entidad): string {
  return entidad.afiliacion === "sistemica" ? "sistémico" : "ambiental";
}
