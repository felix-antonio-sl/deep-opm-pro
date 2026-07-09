import { esAutoInvocacion } from "../../modelo/autoinvocacion";
import { puertoExactoCompartidoDeAbanico } from "../../modelo/abanicos";
import { entidadDeExtremo, entidadIdDeExtremo, estadoDeExtremo } from "../../modelo/extremos";
import { esNombreProcesoPlaceholder, nombreCanonicoEntidad, nombreCanonicoEstado } from "../../modelo/nombresCanonicos";
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
  const puertoComun = puertoExactoCompartidoDeAbanico(modelo, abanico);
  const refs: OplReferencia[] = puertoComun ? [refEntidad(puertoComun.entidadId)] : [];
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
  const puertoComun = puertoExactoCompartidoDeAbanico(modelo, abanico);
  const puerto = puertoComun ? modelo.entidades[puertoComun.entidadId] : undefined;
  const hints: OplTokenHint[] = puerto ? [hintEntidad(puerto)] : [];
  const primer = enlaces[0];
  const verbo = primer ? verboInteractivo(primer, texto) : null;
  if (primer && verbo) hints.push(hintEnlace(primer, verbo));
  for (const enlace of enlaces) {
    const otroExtremo = extremoOpuestoAbanico(modelo, abanico, enlace);
    if (!otroExtremo) continue;
    const entidad = entidadDeExtremo(modelo, otroExtremo);
    if (entidad) hints.push(hintEntidad(entidad));
    const estado = estadoDeExtremo(modelo, otroExtremo);
    if (estado) hints.push(hintEstado(estado));
  }
  return hints;
}

function extremoOpuestoAbanico(
  modelo: Modelo,
  abanico: Abanico,
  enlace: Enlace,
): Enlace["origenId"] | null {
  const puertoComun = puertoExactoCompartidoDeAbanico(modelo, abanico);
  if (!puertoComun) return null;
  if (puertoComun.lado === "origen" && enlace.origenId.kind === "entidad" && enlace.origenId.id === puertoComun.entidadId && enlace.origenId.portId === puertoComun.portId) {
    return enlace.destinoId;
  }
  if (puertoComun.lado === "destino" && enlace.destinoId.kind === "entidad" && enlace.destinoId.id === puertoComun.entidadId && enlace.destinoId.portId === puertoComun.portId) {
    return enlace.origenId;
  }
  return null;
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
    texto: `\`${nombreCanonicoEstado(estado)}\``,
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
  efecto: ["afecta", "afectan", "cambia"],
  invocacion: ["invoca", "invocan", "se invoca"],
  excepcionSobretiempo: ["ocurre si duración", "excede"],
  excepcionSubtiempo: ["ocurre si duración", "es menor"],
  excepcionSubSobretiempo: ["ocurre si duración", "excede", "es menor"],
  etiquetado: ["se relaciona"],
  etiquetadoBidireccional: ["se relacionan"],
};

export function nombreOpl(entidad: Entidad): string {
  const nombre = nombreOplBase(entidad, entidad.nombre);
  return entidad.alias ? `${nombre} {${entidad.alias}}` : nombre;
}

export function nombreOplAtributoValor(entidad: Entidad): string {
  const nombre = nombreCanonicoEntidad(entidad);
  return entidad.tipo === "objeto" ? `**${nombre}**` : `*${nombre}*`;
}

export function nombreOplExtremo(modelo: Modelo, extremo: Enlace["origenId"], multiplicidad: string | undefined): string {
  const entidad = entidadDeExtremo(modelo, extremo);
  if (!entidad) return extremo.id;
  const base = nombreOplConMultiplicidad(entidad, multiplicidad);
  const estado = estadoDeExtremo(modelo, extremo);
  return estado ? `${base} en \`${nombreCanonicoEstado(estado)}\`` : base;
}

export function nombreOplConMultiplicidad(entidad: Entidad, multiplicidad: string | undefined): string {
  const canonico = nombreCanonicoEntidad(entidad);
  const nombre = multiplicidadPlural(multiplicidad) ? pluralizarCanonico(canonico) : canonico;
  const token = nombreOplBase(entidad, nombre);
  if (multiplicidad === "?" || multiplicidad === "0..1") {
    return `un ${token} opcional`;
  }
  if (multiplicidad === "+" || multiplicidad === "1..*" || multiplicidad === "1..N") {
    return `al menos un ${token}`;
  }
  if (multiplicidad === "*" || multiplicidad === "0..*") {
    return token;
  }
  return multiplicidad ? `${multiplicidad} ${token}` : token;
}

export function nombreOplBase(entidad: Entidad, nombre: string): string {
  const canonico = nombreCanonicoEntidad(entidad, nombre);
  const conUnidad = entidad.tipo === "objeto" && entidad.unidad ? `${canonico} [${entidad.unidad}]` : canonico;
  return entidad.tipo === "objeto" ? `**${conUnidad}**` : `*${conUnidad}*`;
}

export function entidadOplEsEmitible(entidad: Entidad, esApunte = false): boolean {
  // En modo apunte se relaja R-NOM-PROC-1: los procesos placeholder emiten OPL
  // (bisimetría del bosquejo). En modo riguroso siguen suprimidos.
  if (entidad.tipo === "proceso") return esApunte || !esNombreProcesoPlaceholder(entidad.nombre);
  return true;
}

export function estadoOplEsEmitible(estado: Estado | undefined): estado is Estado {
  return !!estado;
}

export function extremoOplEsEmitible(modelo: Modelo, extremo: Enlace["origenId"], esApunte = false): boolean {
  const entidad = entidadDeExtremo(modelo, extremo);
  if (!entidad || !entidadOplEsEmitible(entidad, esApunte)) return false;
  const estado = estadoDeExtremo(modelo, extremo);
  return estado ? estadoOplEsEmitible(estado) : true;
}

export function enlaceOplEsEmitible(modelo: Modelo, enlace: Enlace, esApunte = false): boolean {
  return extremoOplEsEmitible(modelo, enlace.origenId, esApunte) && extremoOplEsEmitible(modelo, enlace.destinoId, esApunte);
}

export function pluralizarCanonico(texto: string): string {
  if (/z$/i.test(texto)) return `${texto.slice(0, -1)}ces`;
  if (/[aeiou]$/i.test(texto)) return `${texto}s`;
  return `${texto}es`;
}

export function multiplicidadPlural(multiplicidad: string | undefined): boolean {
  if (!multiplicidad) return false;
  if (multiplicidad === "?" || multiplicidad === "0..1") return false;
  if (multiplicidad === "*" || multiplicidad === "N" || multiplicidad === "0..*") return true;
  if (multiplicidad === "+" || multiplicidad === "1..*" || multiplicidad === "1..N") return false;
  if (/^\d+$/.test(multiplicidad)) return Number(multiplicidad) !== 1;
  if (multiplicidad.endsWith("..N") || multiplicidad.endsWith("..*")) {
    const [min] = multiplicidad.split("..");
    return min === "0";
  }
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
