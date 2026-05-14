import { esAutoInvocacion } from "../../modelo/autoinvocacion";
import { enlaceAdmiteTiempoMaximo, enlaceAdmiteTiempoMinimo } from "../../modelo/constantes";
import { etiquetaEnlaceNormalizada } from "../../modelo/etiquetasEnlace";
import { entidadDeExtremo, entidadIdDeExtremo, estadoDeExtremo } from "../../modelo/extremos";
import { rutaEtiquetaNormalizada } from "../../modelo/rutas";
import type { Enlace, Entidad, Id, Modelo, Opd } from "../../modelo/tipos";
import {
  hintEnlace,
  hintEntidad,
  hintEstado,
  nombreOpl,
  nombreOplConMultiplicidad,
  nombreOplExtremo,
  refEnlace,
  refEntidad,
  refEstado,
  refsEnlace,
  hintsEnlace,
  verbo,
  multiplicidadPlural,
} from "./refsHints";
import { oracionEnlaceEstructural } from "./estructural";

/**
 * Generador de oraciones OPL para enlaces procedimentales, rutas y transiciones de estado.
 * Cubre SSOT OPL-ES §4-§8, §13 y TS1-TS5; consumidores: `opl/generar.ts`.
 */

export function oracionEnlaceConRuta(modelo: Modelo, enlace: Enlace): string | null {
  const ruta = rutaEtiquetaNormalizada(enlace.rutaEtiqueta);
  if (!ruta) return oracionEnlace(modelo, enlace);
  const base = oracionProcedimentalParaRuta(modelo, enlace) ?? oracionEnlaceSinEtiqueta(modelo, enlace);
  return conEtiquetaEnlace(enlace, base ? `Por ruta ${ruta}, ${base}` : null);
}

export function oracionProcedimentalParaRuta(modelo: Modelo, enlace: Enlace): string | null {
  const origen = entidadDeExtremo(modelo, enlace.origenId);
  const destino = entidadDeExtremo(modelo, enlace.destinoId);
  if (!origen || !destino) return null;
  if (enlace.tipo === "resultado" && enlace.destinoId.kind === "estado" && origen.tipo === "proceso") {
    const estado = estadoDeExtremo(modelo, enlace.destinoId);
    return estado ? `${nombreOpl(origen)} genera ${nombreOpl(destino)} en \`${estado.nombre}\`.` : null;
  }
  if (enlace.tipo === "consumo" && enlace.origenId.kind === "estado" && destino.tipo === "proceso") {
    const estado = estadoDeExtremo(modelo, enlace.origenId);
    return estado ? `${nombreOpl(destino)} consume ${nombreOpl(origen)} en \`${estado.nombre}\`.` : null;
  }
  return oracionEnlace(modelo, enlace);
}

export function transicionesEstado(modelo: Modelo, opd: Opd): { lineaPorEnlaceConsumo: Map<Id, string>; enlacesCubiertos: Set<Id> } {
  const base = transicionesEstadoBase(modelo, opd);
  return {
    lineaPorEnlaceConsumo: new Map([...base.lineaPorEnlaceConsumo].map(([id, linea]) => [id, linea.texto])),
    enlacesCubiertos: base.enlacesCubiertos,
  };
}

export function transicionesEstadoInteractivo(
  modelo: Modelo,
  opd: Opd,
): { lineaPorEnlaceConsumo: Map<Id, { texto: string; refs: ReturnType<typeof refsEnlace>; hints: ReturnType<typeof hintsEnlace> }>; enlacesCubiertos: Set<Id> } {
  return transicionesEstadoBase(modelo, opd);
}

function transicionesEstadoBase(modelo: Modelo, opd: Opd) {
  const consumos = Object.values(opd.enlaces)
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((enlace): enlace is Enlace => !!enlace && enlace.tipo === "consumo" && enlace.origenId.kind === "estado");
  const resultados = Object.values(opd.enlaces)
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((enlace): enlace is Enlace => !!enlace && enlace.tipo === "resultado" && enlace.destinoId.kind === "estado");
  const lineaPorEnlaceConsumo = new Map<Id, { texto: string; refs: ReturnType<typeof refsEnlace>; hints: ReturnType<typeof hintsEnlace> }>();
  const enlacesCubiertos = new Set<Id>();

  for (const consumo of consumos) {
    const objetoEntradaId = entidadIdDeExtremo(modelo, consumo.origenId);
    const procesoId = entidadIdDeExtremo(modelo, consumo.destinoId);
    if (!objetoEntradaId || !procesoId) continue;
    const resultado = resultados.find((candidato) => (
      entidadIdDeExtremo(modelo, candidato.origenId) === procesoId &&
      entidadIdDeExtremo(modelo, candidato.destinoId) === objetoEntradaId
    ));
    if (!resultado) continue;
    const proceso = modelo.entidades[procesoId];
    const objeto = modelo.entidades[objetoEntradaId];
    const estadoEntrada = estadoDeExtremo(modelo, consumo.origenId);
    const estadoSalida = estadoDeExtremo(modelo, resultado.destinoId);
    if (!proceso || !objeto || !estadoEntrada || !estadoSalida) continue;
    const texto = `${nombreOpl(proceso)} cambia ${nombreOpl(objeto)} de \`${estadoEntrada.nombre}\` a \`${estadoSalida.nombre}\`.`;
    lineaPorEnlaceConsumo.set(consumo.id, {
      texto,
      refs: [
        refEntidad(proceso.id),
        refEntidad(objeto.id),
        refEstado(estadoEntrada.id),
        refEstado(estadoSalida.id),
        refEnlace(consumo.id),
        refEnlace(resultado.id),
      ],
      hints: [
        hintEntidad(proceso),
        hintEnlace(consumo, "cambia"),
        hintEntidad(objeto),
        hintEstado(estadoEntrada),
        hintEstado(estadoSalida),
      ],
    });
    enlacesCubiertos.add(consumo.id);
    enlacesCubiertos.add(resultado.id);
  }

  return { lineaPorEnlaceConsumo, enlacesCubiertos };
}

export function oracionEnlace(modelo: Modelo, enlace: Enlace): string | null {
  if (enlace.tipo === "etiquetado" || enlace.tipo === "etiquetadoBidireccional") {
    return oracionTagged(modelo, enlace);
  }
  return conEtiquetaEnlace(enlace, oracionEnlaceSinEtiqueta(modelo, enlace));
}

export function oracionEnlaceSinEtiqueta(modelo: Modelo, enlace: Enlace): string | null {
  const origen = entidadDeExtremo(modelo, enlace.origenId);
  const destino = entidadDeExtremo(modelo, enlace.destinoId);
  if (!origen || !destino) return null;

  if (["agregacion", "exhibicion", "generalizacion", "clasificacion"].includes(enlace.tipo)) {
    return oracionEnlaceEstructural(modelo, enlace);
  }

  if (enlace.tipo === "etiquetado" || enlace.tipo === "etiquetadoBidireccional") {
    return oracionTagged(modelo, enlace);
  }

  const origenOpl = nombreOplExtremo(modelo, enlace.origenId, enlace.multiplicidadOrigen);
  const destinoOpl = nombreOplExtremo(modelo, enlace.destinoId, enlace.multiplicidadDestino);
  const origenPlural = multiplicidadPlural(enlace.multiplicidadOrigen);
  const destinoPlural = multiplicidadPlural(enlace.multiplicidadDestino);

  if (enlace.modificador === "evento") {
    return oracionEvento(modelo, enlace, origen, destino, origenOpl, destinoOpl);
  }
  if (enlace.modificador === "condicion") {
    return oracionCondicion(modelo, enlace, origen, destino, origenOpl, destinoOpl);
  }
  if (enlace.modificador === "no") {
    return oracionNegada(modelo, enlace, origen, destino, origenOpl, destinoOpl, origenPlural, destinoPlural);
  }
  if (esAutoInvocacion(enlace)) {
    return `${origenOpl} se invoca a sí mismo${enlace.demora ? ` despues de ${enlace.demora}` : ""}.`;
  }

  switch (enlace.tipo) {
    case "agente":
      return `${origenOpl} ${verbo("maneja", "manejan", origenPlural)} ${destinoOpl}.`;
    case "instrumento":
      return `${destinoOpl} ${verbo("requiere", "requieren", destinoPlural)} ${origenOpl}.`;
    case "consumo":
      if (enlace.origenId.kind === "estado" && destino.tipo === "proceso") {
        const estado = estadoDeExtremo(modelo, enlace.origenId);
        return estado ? `${destinoOpl} cambia ${nombreOpl(origen)} de \`${estado.nombre}\`.` : null;
      }
      return `${destinoOpl} ${verbo("consume", "consumen", destinoPlural)} ${origenOpl}.`;
    case "resultado":
      if (enlace.destinoId.kind === "estado" && origen.tipo === "proceso") {
        const estado = estadoDeExtremo(modelo, enlace.destinoId);
        return estado ? `${origenOpl} cambia ${nombreOpl(destino)} a \`${estado.nombre}\`.` : null;
      }
      return `${origenOpl} ${verbo("genera", "generan", origenPlural)} ${destinoOpl}.`;
    case "efecto":
      return oracionEfecto(modelo, enlace, origen, destino);
    case "invocacion":
      return `${origenOpl} ${verbo("invoca", "invocan", origenPlural)} ${destinoOpl}${enlace.demora ? ` despues de ${enlace.demora}` : ""}.`;
    case "excepcionSobretiempo":
      return `${destinoOpl} ocurre si duración de ${origenOpl} excede ${formatoTiempoMaximo(enlace)}.`;
    case "excepcionSubtiempo":
      return `${destinoOpl} ocurre si duración de ${origenOpl} es menor que ${formatoTiempoMinimo(enlace)}.`;
    case "excepcionSubSobretiempo":
      return `${destinoOpl} ocurre si duración de ${origenOpl} es menor que ${formatoTiempoMinimo(enlace)} o excede ${formatoTiempoMaximo(enlace)}.`;
    default:
      return null;
  }
}

function formatoTiempoMinimo(enlace: Enlace): string {
  if (!enlaceAdmiteTiempoMinimo(enlace.tipo)) return "su duración mínima";
  return formatoTiempo(enlace.tiempoMinimo, enlace.unidadTiempoMinimo, "su duración mínima");
}

function formatoTiempoMaximo(enlace: Enlace): string {
  if (!enlaceAdmiteTiempoMaximo(enlace.tipo)) return "su duración máxima";
  return formatoTiempo(enlace.tiempoMaximo, enlace.unidadTiempoMaximo, "su duración máxima");
}

function formatoTiempo(valor: string | undefined, unidad: string | undefined, fallback: string): string {
  const limpio = valor?.trim();
  if (!limpio) return fallback;
  const unidadLimpia = unidad?.trim();
  return unidadLimpia ? `${limpio} ${unidadLimpia}` : limpio;
}

function oracionTagged(modelo: Modelo, enlace: Enlace): string | null {
  const origenOpl = nombreOplExtremo(modelo, enlace.origenId, enlace.multiplicidadOrigen);
  const destinoOpl = nombreOplExtremo(modelo, enlace.destinoId, enlace.multiplicidadDestino);
  const tag = etiquetaEnlaceNormalizada(enlace.etiqueta);
  const backwardTag = enlace.backwardTag?.trim();
  if (enlace.tipo === "etiquetado") {
    return tag ? `${origenOpl} ${tag} ${destinoOpl}.` : `${origenOpl} se relaciona con ${destinoOpl}.`;
  }
  if (tag && backwardTag) return `${origenOpl} ${tag} ${destinoOpl}, y ${destinoOpl} ${backwardTag} ${origenOpl}.`;
  if (tag) return `${origenOpl} y ${destinoOpl} son ${tag}.`;
  return `${origenOpl} y ${destinoOpl} se relacionan.`;
}

function conEtiquetaEnlace(enlace: Enlace, linea: string | null): string | null {
  if (!linea) return null;
  const etiqueta = etiquetaEnlaceNormalizada(enlace.etiqueta);
  return etiqueta ? `${linea} [etiqueta: ${etiqueta}]` : linea;
}

function oracionEvento(
  modelo: Modelo,
  enlace: Enlace,
  origen: Entidad,
  destino: Entidad,
  origenOpl: string,
  destinoOpl: string,
): string | null {
  const sufijo = sufijoProbabilidad(enlace);
  switch (enlace.tipo) {
    case "agente":
      return `${origenOpl} inicia y maneja ${destinoOpl}${sufijo}.`;
    case "instrumento":
      return `${origenOpl} inicia ${destinoOpl}, que requiere ${origenOpl}${sufijo}.`;
    case "consumo":
      return `${origenOpl} inicia ${destinoOpl}, que consume ${origenOpl}${sufijo}.`;
    case "resultado":
      return `${destinoOpl} inicia ${origenOpl}, que genera ${destinoOpl}${sufijo}.`;
    case "efecto": {
      const proceso = origen.tipo === "proceso" ? origenOpl : destino.tipo === "proceso" ? destinoOpl : null;
      const objeto = origen.tipo === "objeto" ? origenOpl : destino.tipo === "objeto" ? destinoOpl : null;
      return proceso && objeto ? `${objeto} inicia ${proceso}, que afecta ${objeto}${sufijo}.` : null;
    }
    case "invocacion":
      return `${origenOpl} inicia e invoca ${destinoOpl}${sufijo}.`;
    default:
      return oracionEnlaceSinModificador(modelo, enlace);
  }
}

function oracionCondicion(
  modelo: Modelo,
  enlace: Enlace,
  origen: Entidad,
  destino: Entidad,
  origenOpl: string,
  destinoOpl: string,
): string | null {
  switch (enlace.tipo) {
    case "agente":
      return `${origenOpl} maneja ${destinoOpl} si ${origenOpl} existe, de lo contrario ${destinoOpl} se omite.`;
    case "instrumento":
      return `${destinoOpl} ocurre si ${origenOpl} existe, de lo contrario ${destinoOpl} se omite.`;
    case "consumo":
      return `${destinoOpl} ocurre si ${origenOpl} existe, en cuyo caso ${destinoOpl} consume ${origenOpl}, de lo contrario ${destinoOpl} se omite.`;
    case "resultado":
      return `${origenOpl} ocurre si ${destinoOpl} puede generarse, en cuyo caso ${origenOpl} genera ${destinoOpl}, de lo contrario ${origenOpl} se omite.`;
    case "efecto": {
      const proceso = origen.tipo === "proceso" ? origenOpl : destino.tipo === "proceso" ? destinoOpl : null;
      const objeto = origen.tipo === "objeto" ? origenOpl : destino.tipo === "objeto" ? destinoOpl : null;
      return proceso && objeto ? `${proceso} ocurre si ${objeto} existe, en cuyo caso ${proceso} afecta ${objeto}, de lo contrario ${proceso} se omite.` : null;
    }
    case "invocacion":
      return `${origenOpl} invoca ${destinoOpl} si ${origenOpl} ocurre.`;
    default:
      return oracionEnlaceSinModificador(modelo, enlace);
  }
}

function oracionNegada(
  modelo: Modelo,
  enlace: Enlace,
  origen: Entidad,
  destino: Entidad,
  origenOpl: string,
  destinoOpl: string,
  origenPlural: boolean,
  destinoPlural: boolean,
): string | null {
  switch (enlace.tipo) {
    case "agente":
      return `${origenOpl} no ${verbo("maneja", "manejan", origenPlural)} ${destinoOpl}.`;
    case "instrumento":
      return `${destinoOpl} no ${verbo("requiere", "requieren", destinoPlural)} ${origenOpl}.`;
    case "consumo":
      return `${destinoOpl} no ${verbo("consume", "consumen", destinoPlural)} ${origenOpl}.`;
    case "resultado":
      return `${origenOpl} no ${verbo("genera", "generan", origenPlural)} ${destinoOpl}.`;
    case "efecto": {
      const proceso = origen.tipo === "proceso" ? origenOpl : destino.tipo === "proceso" ? destinoOpl : null;
      const objeto = origen.tipo === "objeto" ? origenOpl : destino.tipo === "objeto" ? destinoOpl : null;
      return proceso && objeto ? `${proceso} no afecta ${objeto}.` : null;
    }
    default:
      return oracionEnlaceSinModificador(modelo, enlace);
  }
}

function oracionEnlaceSinModificador(modelo: Modelo, enlace: Enlace): string | null {
  const { modificador: _modificador, subtipoModificador: _subtipoModificador, probabilidad: _probabilidad, ...sinModificador } = enlace;
  return oracionEnlaceSinEtiqueta(modelo, sinModificador);
}

function oracionEfecto(modelo: Modelo, enlace: Enlace, origen: Entidad, destino: Entidad): string | null {
  const proceso = origen.tipo === "proceso" ? origen : destino.tipo === "proceso" ? destino : null;
  const objeto = origen.tipo === "objeto" ? origen : destino.tipo === "objeto" ? destino : null;
  if (!proceso || !objeto) return null;
  const procesoEsOrigen = entidadIdDeExtremo(modelo, enlace.origenId) === proceso.id;
  const objetoEsOrigen = entidadIdDeExtremo(modelo, enlace.origenId) === objeto.id;
  const multiplicidadProceso = procesoEsOrigen ? enlace.multiplicidadOrigen : enlace.multiplicidadDestino;
  const multiplicidadObjeto = objetoEsOrigen ? enlace.multiplicidadOrigen : enlace.multiplicidadDestino;
  const extremoObjeto = objetoEsOrigen ? enlace.origenId : enlace.destinoId;
  return `${nombreOplConMultiplicidad(proceso, multiplicidadProceso)} ${verbo("afecta", "afectan", multiplicidadPlural(multiplicidadProceso))} ${nombreOplExtremo(modelo, extremoObjeto, multiplicidadObjeto)}.`;
}

function sufijoProbabilidad(enlace: Enlace): string {
  return enlace.probabilidad === undefined ? "" : ` (probabilidad: ${formatearProbabilidad(enlace.probabilidad)})`;
}

function formatearProbabilidad(value: number): string {
  return `${Math.round(value * 100)}%`;
}
