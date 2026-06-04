import { esAutoInvocacion } from "../../modelo/autoinvocacion";
import { enlaceAdmiteTiempoMaximo, enlaceAdmiteTiempoMinimo } from "../../modelo/constantes";
import { etiquetaEnlaceNormalizada } from "../../modelo/etiquetasEnlace";
import { entidadDeExtremo, entidadIdDeExtremo, estadoDeExtremo } from "../../modelo/extremos";
import { nombreCanonicoEstado } from "../../modelo/nombresCanonicos";
import { rutaEtiquetaNormalizada } from "../../modelo/rutas";
import type { Enlace, Entidad, Id, Modelo, Opd } from "../../modelo/tipos";
import {
  hintEnlace,
  hintEntidad,
  hintEstado,
  enlaceOplEsEmitible,
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
  if (!enlaceOplEsEmitible(modelo, enlace)) return null;
  const origen = entidadDeExtremo(modelo, enlace.origenId);
  const destino = entidadDeExtremo(modelo, enlace.destinoId);
  if (!origen || !destino) return null;
  if (enlace.tipo === "resultado" && enlace.destinoId.kind === "estado" && origen.tipo === "proceso") {
    const estado = estadoDeExtremo(modelo, enlace.destinoId);
    return estado ? `${nombreOplConMultiplicidad(origen, enlace.multiplicidadOrigen)} genera ${nombreOplConMultiplicidad(destino, enlace.multiplicidadDestino)} en \`${nombreCanonicoEstado(estado)}\`.` : null;
  }
  if (enlace.tipo === "consumo" && enlace.origenId.kind === "estado" && destino.tipo === "proceso") {
    const estado = estadoDeExtremo(modelo, enlace.origenId);
    return estado ? `${nombreOplConMultiplicidad(destino, enlace.multiplicidadDestino)} consume ${nombreOplConMultiplicidad(origen, enlace.multiplicidadOrigen)} en \`${nombreCanonicoEstado(estado)}\`.` : null;
  }
  return oracionEnlace(modelo, enlace);
}

export function transicionesEstado(
  modelo: Modelo,
  opd: Opd,
  enlacesExcluidos: ReadonlySet<Id> = new Set(),
): { lineaPorEnlaceConsumo: Map<Id, string>; enlacesCubiertos: Set<Id> } {
  const base = transicionesEstadoBase(modelo, opd, enlacesExcluidos);
  return {
    lineaPorEnlaceConsumo: new Map([...base.lineaPorEnlaceConsumo].map(([id, linea]) => [id, linea.texto])),
    enlacesCubiertos: base.enlacesCubiertos,
  };
}

export function transicionesEstadoInteractivo(
  modelo: Modelo,
  opd: Opd,
  enlacesExcluidos: ReadonlySet<Id> = new Set(),
): { lineaPorEnlaceConsumo: Map<Id, { texto: string; refs: ReturnType<typeof refsEnlace>; hints: ReturnType<typeof hintsEnlace> }>; enlacesCubiertos: Set<Id> } {
  return transicionesEstadoBase(modelo, opd, enlacesExcluidos);
}

function transicionesEstadoBase(modelo: Modelo, opd: Opd, enlacesExcluidos: ReadonlySet<Id>) {
  const consumos = Object.values(opd.enlaces)
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((enlace): enlace is Enlace => !!enlace && !enlacesExcluidos.has(enlace.id) && enlace.tipo === "consumo" && enlace.origenId.kind === "estado" && enlaceOplEsEmitible(modelo, enlace));
  const resultados = Object.values(opd.enlaces)
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((enlace): enlace is Enlace => !!enlace && !enlacesExcluidos.has(enlace.id) && enlace.tipo === "resultado" && enlace.destinoId.kind === "estado" && enlaceOplEsEmitible(modelo, enlace));
  const lineaPorEnlaceConsumo = new Map<Id, { texto: string; refs: ReturnType<typeof refsEnlace>; hints: ReturnType<typeof hintsEnlace> }>();
  const enlacesCubiertos = new Set<Id>();
  const resultadosUsados = new Set<Id>();

  for (const consumo of consumos) {
    const objetoEntradaId = entidadIdDeExtremo(modelo, consumo.origenId);
    const procesoId = entidadIdDeExtremo(modelo, consumo.destinoId);
    if (!objetoEntradaId || !procesoId) continue;
    const candidatos = resultados.filter((candidato) => (
      !resultadosUsados.has(candidato.id)
      && entidadIdDeExtremo(modelo, candidato.origenId) === procesoId
      && entidadIdDeExtremo(modelo, candidato.destinoId) === objetoEntradaId
    ));
    const resultado = elegirResultadoParaPath(consumo, candidatos);
    if (!resultado) continue;
    const proceso = modelo.entidades[procesoId];
    const objeto = modelo.entidades[objetoEntradaId];
    const estadoEntrada = estadoDeExtremo(modelo, consumo.origenId);
    const estadoSalida = estadoDeExtremo(modelo, resultado.destinoId);
    if (!proceso || !objeto || !estadoEntrada || !estadoSalida) continue;
    const texto = oracionTransicionEstados(modelo, proceso, objeto, estadoEntrada, estadoSalida, consumo, resultado);
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
    resultadosUsados.add(resultado.id);
  }

  return { lineaPorEnlaceConsumo, enlacesCubiertos };
}

function elegirResultadoParaPath(consumo: Enlace, candidatos: Enlace[]): Enlace | undefined {
  const ruta = rutaEtiquetaNormalizada(consumo.rutaEtiqueta);
  if (ruta) {
    const porRuta = candidatos.find((resultado) => rutaEtiquetaNormalizada(resultado.rutaEtiqueta) === ruta);
    return porRuta;
  }

  const sinRuta = candidatos.filter((resultado) => !rutaEtiquetaNormalizada(resultado.rutaEtiqueta));
  if (sinRuta.length === 1) return sinRuta[0];
  if (sinRuta.length === 0 && candidatos.length === 1) return candidatos[0];
  return undefined;
}

function oracionTransicionEstados(
  modelo: Modelo,
  proceso: Entidad,
  objeto: Entidad,
  estadoEntrada: NonNullable<ReturnType<typeof estadoDeExtremo>>,
  estadoSalida: NonNullable<ReturnType<typeof estadoDeExtremo>>,
  consumo: Enlace,
  resultado: Enlace,
): string {
  const modificador = consumo.modificador ?? resultado.modificador;
  const enlaceModificador = consumo.modificador ? consumo : resultado.modificador ? resultado : null;
  const sufijo = enlaceModificador ? sufijoProbabilidad(enlaceModificador) : "";
  const multiplicidadProceso = resultado.multiplicidadOrigen ?? consumo.multiplicidadDestino;
  const multiplicidadObjeto = resultado.multiplicidadDestino ?? consumo.multiplicidadOrigen;
  const procesoOpl = nombreOplConMultiplicidad(proceso, multiplicidadProceso);
  const objetoOpl = nombreOplConMultiplicidad(objeto, multiplicidadObjeto);
  const entrada = nombreCanonicoEstado(estadoEntrada);
  const salida = nombreCanonicoEstado(estadoSalida);
  const rutaConsumo = rutaEtiquetaNormalizada(consumo.rutaEtiqueta);
  const rutaResultado = rutaEtiquetaNormalizada(resultado.rutaEtiqueta);
  const prefijoRuta = rutaConsumo && rutaConsumo === rutaResultado ? `Por ruta ${rutaConsumo}, ` : "";
  switch (modificador) {
    case "evento":
      return `${prefijoRuta}${objetoOpl} en \`${entrada}\` inicia ${procesoOpl}, que cambia ${objetoOpl} de \`${entrada}\` a \`${salida}\`${sufijo}.`;
    case "condicion":
      return `${prefijoRuta}${procesoOpl} ocurre si ${objetoOpl} está en \`${entrada}\`, en cuyo caso ${procesoOpl} cambia ${objetoOpl} de \`${entrada}\` a \`${salida}\`, de lo contrario ${procesoOpl} se omite.`;
    case "no":
      return `${prefijoRuta}${procesoOpl} no cambia ${objetoOpl} de \`${entrada}\` a \`${salida}\`.`;
    default:
      return `${prefijoRuta}${procesoOpl} cambia ${objetoOpl} de \`${entrada}\` a \`${salida}\`.`;
  }
}

export function oracionEnlace(modelo: Modelo, enlace: Enlace): string | null {
  if (enlace.tipo === "etiquetado" || enlace.tipo === "etiquetadoBidireccional") {
    return oracionTagged(modelo, enlace);
  }
  return conEtiquetaEnlace(enlace, oracionEnlaceSinEtiqueta(modelo, enlace));
}

export function oracionEnlaceSinEtiqueta(modelo: Modelo, enlace: Enlace): string | null {
  if (!enlaceOplEsEmitible(modelo, enlace)) return null;
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
    return `${origenOpl} se invoca a sí mismo${enlace.demora ? ` después de ${enlace.demora}` : ""}.`;
  }

  switch (enlace.tipo) {
    case "agente":
      return `${origenOpl} ${verbo("maneja", "manejan", origenPlural)} ${destinoOpl}.`;
    case "instrumento": {
      const posesiva = oracionInstrumentoPosesiva(modelo, enlace, origen, destino);
      if (posesiva) return posesiva;
      return `${destinoOpl} ${verbo("requiere", "requieren", destinoPlural)} ${origenOpl}.`;
    }
    case "consumo":
      return `${destinoOpl} ${verbo("consume", "consumen", destinoPlural)} ${origenOpl}.`;
    case "resultado":
      return `${origenOpl} ${verbo("genera", "generan", origenPlural)} ${destinoOpl}.`;
    case "efecto":
      return oracionEfecto(modelo, enlace, origen, destino);
    case "invocacion":
      return `${origenOpl} ${verbo("invoca", "invocan", origenPlural)} ${destinoOpl}${enlace.demora ? ` después de ${enlace.demora}` : ""}.`;
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
    case "consumo": {
      const estado = estadoDeExtremo(modelo, enlace.origenId);
      if (estado) return `${origenOpl} inicia ${destinoOpl}, que consume ${origenOpl}${sufijo}.`;
      return `${origenOpl} inicia ${destinoOpl}, que consume ${origenOpl}${sufijo}.`;
    }
    case "resultado":
      return oracionEnlaceSinModificador(modelo, enlace);
    case "efecto": {
      const proceso = origen.tipo === "proceso" ? origenOpl : destino.tipo === "proceso" ? destinoOpl : null;
      const objeto = origen.tipo === "objeto" ? origenOpl : destino.tipo === "objeto" ? destinoOpl : null;
      return proceso && objeto ? `${objeto} inicia ${proceso}, que afecta ${objeto}${sufijo}.` : null;
    }
    case "invocacion":
      return oracionEnlaceSinModificador(modelo, enlace);
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
    case "agente": {
      const estado = estadoDeExtremo(modelo, enlace.origenId);
      if (estado) return `${nombreOpl(origen)} maneja ${destinoOpl} si ${nombreOpl(origen)} está en \`${nombreCanonicoEstado(estado)}\`, de lo contrario ${destinoOpl} se omite.`;
      return `${origenOpl} maneja ${destinoOpl} si ${origenOpl} existe, de lo contrario ${destinoOpl} se omite.`;
    }
    case "instrumento": {
      const estado = estadoDeExtremo(modelo, enlace.origenId);
      if (estado) return `${destinoOpl} ocurre si ${nombreOpl(origen)} está en \`${nombreCanonicoEstado(estado)}\`, de lo contrario ${destinoOpl} se omite.`;
      return `${destinoOpl} ocurre si ${origenOpl} existe, de lo contrario ${destinoOpl} se omite.`;
    }
    case "consumo": {
      const estado = estadoDeExtremo(modelo, enlace.origenId);
      if (estado) return `${destinoOpl} ocurre si ${nombreOpl(origen)} está en \`${nombreCanonicoEstado(estado)}\`, en cuyo caso ${destinoOpl} consume ${origenOpl}, de lo contrario ${destinoOpl} se omite.`;
      return `${destinoOpl} ocurre si ${origenOpl} existe, en cuyo caso ${origenOpl} se consume, de lo contrario ${destinoOpl} se omite.`;
    }
    case "resultado":
      return oracionEnlaceSinModificador(modelo, enlace);
    case "efecto": {
      const proceso = origen.tipo === "proceso" ? origenOpl : destino.tipo === "proceso" ? destinoOpl : null;
      const objeto = origen.tipo === "objeto" ? origenOpl : destino.tipo === "objeto" ? destinoOpl : null;
      return proceso && objeto ? `${proceso} ocurre si ${objeto} existe, en cuyo caso ${proceso} afecta ${objeto}, de lo contrario ${proceso} se omite.` : null;
    }
    case "invocacion":
      return oracionEnlaceSinModificador(modelo, enlace);
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
    case "consumo": {
      const estado = estadoDeExtremo(modelo, enlace.origenId);
      if (estado) return `${destinoOpl} no consume ${origenOpl}.`;
      return `${destinoOpl} no ${verbo("consume", "consumen", destinoPlural)} ${origenOpl}.`;
    }
    case "resultado": {
      const estado = estadoDeExtremo(modelo, enlace.destinoId);
      if (estado) return `${origenOpl} no genera ${destinoOpl}.`;
      return `${origenOpl} no ${verbo("genera", "generan", origenPlural)} ${destinoOpl}.`;
    }
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
  // BUG-f314c4: efecto TS3 compacto — la transición vive como metadato del
  // enlace entidad→entidad (estadoEntradaId/estadoSalidaId). Se verbaliza con
  // la misma plantilla `cambia` de la vía escindida TS4/TS5
  // (oracionTransicionEstados); con un solo extremo, la variante parcial.
  const entradaTs3 = enlace.estadoEntradaId ? modelo.estados[enlace.estadoEntradaId] : undefined;
  const salidaTs3 = enlace.estadoSalidaId ? modelo.estados[enlace.estadoSalidaId] : undefined;
  if (entradaTs3 || salidaTs3) {
    const proceso = origen.tipo === "proceso" ? origen : destino.tipo === "proceso" ? destino : null;
    const objeto = origen.tipo === "objeto" ? origen : destino.tipo === "objeto" ? destino : null;
    if (proceso && objeto) {
      const procesoEsOrigen = entidadIdDeExtremo(modelo, enlace.origenId) === proceso.id;
      const multiplicidadProceso = procesoEsOrigen ? enlace.multiplicidadOrigen : enlace.multiplicidadDestino;
      const multiplicidadObjeto = procesoEsOrigen ? enlace.multiplicidadDestino : enlace.multiplicidadOrigen;
      const procesoOpl = nombreOplConMultiplicidad(proceso, multiplicidadProceso);
      const objetoOpl = nombreOplConMultiplicidad(objeto, multiplicidadObjeto);
      if (entradaTs3 && salidaTs3) {
        return `${procesoOpl} cambia ${objetoOpl} de \`${nombreCanonicoEstado(entradaTs3)}\` a \`${nombreCanonicoEstado(salidaTs3)}\`.`;
      }
      if (entradaTs3) {
        return `${procesoOpl} cambia ${objetoOpl} de \`${nombreCanonicoEstado(entradaTs3)}\`.`;
      }
      if (salidaTs3) {
        return `${procesoOpl} cambia ${objetoOpl} a \`${nombreCanonicoEstado(salidaTs3)}\`.`;
      }
    }
  }
  const estadoOrigen = estadoDeExtremo(modelo, enlace.origenId);
  const estadoDestino = estadoDeExtremo(modelo, enlace.destinoId);
  if (estadoOrigen && destino.tipo === "proceso") {
    const multiplicidadProceso = destino.id === entidadIdDeExtremo(modelo, enlace.destinoId)
      ? enlace.multiplicidadDestino : enlace.multiplicidadOrigen;
    const multiplicidadObjeto = origen.id === entidadIdDeExtremo(modelo, enlace.origenId)
      ? enlace.multiplicidadOrigen : enlace.multiplicidadDestino;
    return `${nombreOplConMultiplicidad(destino, multiplicidadProceso)} cambia ${nombreOplConMultiplicidad(origen, multiplicidadObjeto)} de \`${nombreCanonicoEstado(estadoOrigen)}\`.`;
  }
  if (estadoDestino && origen.tipo === "proceso") {
    const multiplicidadProceso = origen.id === entidadIdDeExtremo(modelo, enlace.origenId)
      ? enlace.multiplicidadOrigen : enlace.multiplicidadDestino;
    const multiplicidadObjeto = destino.id === entidadIdDeExtremo(modelo, enlace.destinoId)
      ? enlace.multiplicidadDestino : enlace.multiplicidadOrigen;
    return `${nombreOplConMultiplicidad(origen, multiplicidadProceso)} cambia ${nombreOplConMultiplicidad(destino, multiplicidadObjeto)} a \`${nombreCanonicoEstado(estadoDestino)}\`.`;
  }
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

function oracionInstrumentoPosesiva(modelo: Modelo, enlace: Enlace, instrumento: Entidad, proceso: Entidad): string | null {
  if (instrumento.tipo !== "objeto" || proceso.tipo !== "proceso") return null;
  const afectado = Object.values(modelo.enlaces).find((candidato) => {
    if (candidato.id === enlace.id || candidato.tipo !== "efecto") return false;
    const origenId = entidadIdDeExtremo(modelo, candidato.origenId);
    const destinoId = entidadIdDeExtremo(modelo, candidato.destinoId);
    if (origenId !== proceso.id && destinoId !== proceso.id) return false;
    const otroId = origenId === proceso.id ? destinoId : origenId;
    const otro = otroId ? modelo.entidades[otroId] : undefined;
    return otro?.tipo === "objeto";
  });
  if (!afectado) return null;
  const origenId = entidadIdDeExtremo(modelo, afectado.origenId);
  const destinoId = entidadIdDeExtremo(modelo, afectado.destinoId);
  const objetoId = origenId === proceso.id ? destinoId : origenId;
  const objeto = objetoId ? modelo.entidades[objetoId] : undefined;
  if (!objeto || objeto.tipo !== "objeto") return null;
  const verboReflexivo = verboReflexivoDesdeProceso(proceso.nombre);
  if (!verboReflexivo) return null;
  return `${nombreOpl(objeto)} se ${verboReflexivo} con ${nombreOpl(instrumento)}.`;
}

function verboReflexivoDesdeProceso(nombre: string): string | null {
  const primera = nombre.trim().split(/\s+/)[0]?.toLocaleLowerCase("es");
  if (!primera) return null;
  if (primera !== "manejar" && primera !== "conducir") return null;
  if (primera.endsWith("ar")) return `${primera.slice(0, -2)}a`;
  if (primera.endsWith("er") || primera.endsWith("ir")) return `${primera.slice(0, -2)}e`;
  return null;
}

function sufijoProbabilidad(enlace: Enlace): string {
  return enlace.probabilidad === undefined ? "" : ` \`Pr=${formatearProbabilidad(enlace.probabilidad)}\``;
}

function formatearProbabilidad(value: number): string {
  return Number(value.toFixed(6)).toString();
}
