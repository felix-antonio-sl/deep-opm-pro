/**
 * Reglas de validación semántica del modelo OPM (consistency rules).
 * Implementa avisos por categoría sobre kernel: cardinalidad, esencia,
 * direccionalidad, agregación, instanciación, generalización.
 *
 * Refs: SSOT opm-iso-19450-es.md §Reglas (autoridad semántica),
 *       opm-extracted/src/app/models/consistency/behavioral.rules.ts
 *       (40 reglas behavioral; referencia técnica de inspiración),
 *       opm-extracted/src/app/models/consistency/structural.rules.ts
 *       (11 reglas structural; referencia técnica de inspiración).
 *
 * SSOT manda sobre opm-extracted: el conjunto de reglas se decide por HU
 * activas (EPICA-1c, EPICA-15) y SSOT, no por paridad bruta con OPCloud.
 * Auditoría 2026-05-07-ssot-opm-extracted.md §4.4 / RF-3 mide el delta real.
 */

import { naturalezaDeEnlace } from "./constantes";
import { puertoExactoCompartidoDeAbanico } from "./abanicos";
import { aparienciaEsExternaDeRefinamiento } from "./contextoRefinamiento";
import { entidadDeExtremo, entidadIdDeExtremo, extremoApuntaAEntidad, extremoKey, nombreExtremo } from "./extremos";
import { imagenIncluyeBitmap } from "./imagenObjeto";
import { estadosDeEntidad } from "./operaciones";
import { perfilCanonDiagrama } from "./perfilDiagrama";
import { aparienciaDeEntidadEnOpd, opdIdDeEntidadVisible } from "./politicaApariciones";
import { obtenerRefinamiento } from "./refinamientos";
import type { Apariencia, Enlace, Entidad, Id, Modelo, Opd, TipoEnlace } from "./tipos";

export type SeveridadAviso = "error" | "advertencia" | "info";
export type ElementoAvisoTipo = "entidad" | "enlace" | "opd";

export interface Aviso {
  reglaId: string;
  severidad: SeveridadAviso;
  mensaje: string;
  citaSSOT: string;
  elementoTipo?: ElementoAvisoTipo;
  elementoId?: Id;
  opdId?: Id;
}

const PROCEDURALES = new Set<TipoEnlace>([
  "agente",
  "instrumento",
  "consumo",
  "resultado",
  "efecto",
  "invocacion",
  "excepcionSobretiempo",
  "excepcionSubtiempo",
  "excepcionSubSobretiempo",
]);

const EXCEPCIONES_TEMPORALES = new Set<TipoEnlace>([
  "excepcionSobretiempo",
  "excepcionSubtiempo",
  "excepcionSubSobretiempo",
]);

export function validarModelo(modelo: Modelo, opdActivoId: Id): Aviso[] {
  const avisos = [
    ...reglaAgregacionMismaEsencia(modelo, opdActivoId),
    ...reglaGeneralizacionMismoTipo(modelo, opdActivoId),
    ...reglaEstructuralNoAceptaExtremoEstado(modelo, opdActivoId),
    ...reglaExcepcionTemporalProcesoProceso(modelo, opdActivoId),
    ...reglaEfectoDireccionCanonica(modelo, opdActivoId),
    ...reglaProceduralNoObjetoObjeto(modelo, opdActivoId),
    ...reglaEstructuralSinDuplicar(modelo, opdActivoId),
    ...reglaOrdenEstructuralHuerfano(modelo, opdActivoId),
    ...reglaSubprocesoNoConectaAlPadre(modelo),
    ...reglaAgenteRequiereObjetoFisico(modelo, opdActivoId),
    ...reglaProcesoSinEntradaNiSalida(modelo, opdActivoId),
    ...reglaInstrumentoYAgenteSimultaneos(modelo, opdActivoId),
    ...reglaSoloUnNivelDeInstanciacion(modelo, opdActivoId),
    ...advertirConsumoDuplicado(modelo, opdActivoId),
    ...validarExclusionImagenEstados(modelo, opdActivoId),
    ...validarAmbientalDentroContorno(modelo, opdActivoId),
    ...validarDensidadCanonDiagrama(modelo),
  ];
  return priorizarOpdActivo(avisos, opdActivoId);
}

export function validarDensidadCanonDiagrama(modelo: Modelo): Aviso[] {
  return Object.values(modelo.opds).flatMap((opd) => {
    const perfil = perfilCanonDiagrama(modelo, opd.id);
    if (perfil.estado === "ok") return [];
    return [{
      reglaId: "canon-diagrama-densidad",
      severidad: perfil.estado === "bloqueado" ? "error" : "advertencia",
      mensaje: perfil.estado === "bloqueado"
        ? `El OPD ${opd.nombre} tiene ${perfil.apariencias} apariencias; supera el máximo canon-diagrama de ${perfil.maxApariencias}. Divide el diagrama antes de exportar.`
        : `El OPD ${opd.nombre} tiene ${perfil.apariencias} apariencias; está cerca del máximo canon-diagrama de ${perfil.maxApariencias}. Considera dividir o refinar antes de exportar.`,
      citaSSOT: "perfil canon-diagrama / EXPORT-GATE",
      elementoTipo: "opd",
      elementoId: opd.id,
      opdId: opd.id,
    } satisfies Aviso];
  });
}

function reglaEfectoDireccionCanonica(modelo: Modelo, opdActivoId: Id): Aviso[] {
  return enlacesConExtremos(modelo)
    .filter(({ enlace, origen, destino }) => (
      enlace.tipo === "efecto" &&
      !(
        (origen.tipo === "proceso" && destino.tipo === "objeto") ||
        (enlace.origenId.kind === "estado" && origen.tipo === "objeto" && destino.tipo === "proceso") ||
        efectoObjetoAProcesosEnAbanicoLogico(modelo, enlace)
      )
    ))
    .map(({ enlace }) => avisoEnlace(modelo, opdActivoId, enlace, {
      reglaId: "efecto-direccion-canonica",
      severidad: "error",
      mensaje: `El efecto debe expresar que un proceso afecta a un objeto. Hoy va de ${nombreExtremo(modelo, enlace.origenId)} a ${nombreExtremo(modelo, enlace.destinoId)}; usa Proceso -> Objeto/Estado, o Estado -> Proceso solo para un efecto de entrada escindido.`,
      citaSSOT: "urn:fxsl:kb:reglas-opm-estrictas-es R-EFE-1 / urn:fxsl:kb:opl-es TS3-TS5",
    }));
}

function efectoObjetoAProcesosEnAbanicoLogico(modelo: Modelo, enlace: Enlace): boolean {
  const origen = entidadDeExtremo(modelo, enlace.origenId);
  const destino = entidadDeExtremo(modelo, enlace.destinoId);
  if (
    enlace.tipo !== "efecto" ||
    enlace.origenId.kind !== "entidad" ||
    enlace.destinoId.kind !== "entidad" ||
    origen?.tipo !== "objeto" ||
    destino?.tipo !== "proceso"
  ) return false;

  return Object.values(modelo.abanicos ?? {}).some((abanico) => {
    if (!abanico.enlaceIds.includes(enlace.id)) return false;
    const puertoComun = puertoExactoCompartidoDeAbanico(modelo, abanico);
    if (!puertoComun || puertoComun.lado !== "origen" || puertoComun.entidadId !== origen.id) return false;
    const ramas = abanico.enlaceIds.map((enlaceId) => modelo.enlaces[enlaceId]);
    if (ramas.length < 2 || ramas.some((rama) => !rama)) return false;
    return ramas.every((rama) => {
      if (
        !rama ||
        rama.tipo !== "efecto" ||
        rama.origenId.kind !== "entidad" ||
        rama.destinoId.kind !== "entidad" ||
        rama.origenId.id !== origen.id
      ) return false;
      return entidadDeExtremo(modelo, rama.destinoId)?.tipo === "proceso";
    });
  });
}

export function advertirConsumoDuplicado(modelo: Modelo, opdActivoId: Id = modelo.opdRaizId): Aviso[] {
  return reglaConsumoDobleMismoObjeto(modelo, opdActivoId);
}

export function validarAmbientalDentroContorno(modelo: Modelo, opdActivoId: Id = modelo.opdRaizId): Aviso[] {
  const avisos: Aviso[] = [];

  for (const opd of Object.values(modelo.opds)) {
    const contexto = contextoDescomposicion(modelo, opd);
    if (!contexto) continue;
    for (const apariencia of Object.values(opd.apariencias)) {
      if (apariencia.entidadId === contexto.padre.id) continue;
      const entidad = modelo.entidades[apariencia.entidadId];
      if (entidad?.afiliacion !== "ambiental") continue;
      if (aparienciaEsExternaDeRefinamiento(modelo, opd.id, apariencia)) continue;
      if (dentroDe(apariencia, contexto.contorno)) continue;
      avisos.push({
        reglaId: "ambiental-dentro-contorno",
        severidad: "advertencia",
        mensaje: `La cosa ambiental ${entidad.nombre} aparece fuera del contorno del proceso descompuesto en ${opd.nombre}. Si pertenece al ambiente del refinamiento, muévela dentro del contorno; si no, decide si corresponde reclasificarla como sistémica.`,
        citaSSOT: "[ISO-19450 in-zooming] opm-iso-19450-es.md:708",
        elementoTipo: "entidad",
        elementoId: entidad.id,
        opdId: opd.id,
      });
    }
  }

  return priorizarOpdActivo(avisos, opdActivoId);
}

export function validarExclusionImagenEstados(modelo: Modelo, opdActivoId: Id = modelo.opdRaizId): Aviso[] {
  return Object.values(modelo.entidades).flatMap((entidad) => {
    if (entidad.tipo !== "objeto" || !entidad.imagen || !imagenIncluyeBitmap(entidad.imagen.modo)) return [];
    const tieneEstadosVisibles = estadosDeEntidad(modelo, entidad.id).some((estado) => !estado.suprimido);
    if (!tieneEstadosVisibles) return [];
    const opdId = opdIdDeEntidad(modelo, entidad.id, opdActivoId);
    return [{
      reglaId: "imagen-estados-excluyentes",
      severidad: "advertencia",
      mensaje: `El objeto ${entidad.nombre} muestra imagen interior y estados al mismo tiempo. La imagen tapa los estados y dificulta la lectura: pasa el modo a Solo texto o suprime los estados visibles.`,
      citaSSOT: "[Glos 3.39] [Glos 3.68]",
      elementoTipo: "entidad",
      elementoId: entidad.id,
      ...(opdId ? { opdId } : {}),
    } satisfies Aviso];
  });
}

function reglaExcepcionTemporalProcesoProceso(modelo: Modelo, opdActivoId: Id): Aviso[] {
  return enlacesConExtremos(modelo)
    .filter(({ enlace, origen, destino }) => (
      EXCEPCIONES_TEMPORALES.has(enlace.tipo) &&
      (
        enlace.origenId.kind === "estado" ||
        enlace.destinoId.kind === "estado" ||
        origen.tipo !== "proceso" ||
        destino.tipo !== "proceso"
      )
    ))
    .map(({ enlace }) => avisoEnlace(modelo, opdActivoId, enlace, {
      reglaId: "excepcion-temporal-proceso-proceso",
      severidad: "error",
      mensaje: `La excepción temporal ${etiquetaTipo(enlace.tipo)} debe conectar dos procesos directamente, sin estados intermedios. Hoy va de ${nombreExtremo(modelo, enlace.origenId)} a ${nombreExtremo(modelo, enlace.destinoId)}; ajusta los extremos a procesos.`,
      citaSSOT: "[V-239] [ISO-19450 enlaces de excepción]",
    }));
}

function reglaEstructuralNoAceptaExtremoEstado(modelo: Modelo, opdActivoId: Id): Aviso[] {
  return Object.values(modelo.enlaces)
    .filter((enlace) => (
      naturalezaDeEnlace(enlace.tipo) === "estructural" &&
      (enlace.origenId.kind === "estado" || enlace.destinoId.kind === "estado")
    ))
    .map((enlace) => avisoEnlace(modelo, opdActivoId, enlace, {
      reglaId: "estructural-no-acepta-extremo-estado",
      severidad: "error",
      mensaje: `El enlace estructural ${etiquetaTipo(enlace.tipo)} debe unir objetos o procesos completos, no estados específicos. Hoy va de ${nombreExtremo(modelo, enlace.origenId)} a ${nombreExtremo(modelo, enlace.destinoId)}: conecta a la cosa contenedora del estado.`,
      citaSSOT: "[V-237] [V-239]",
    }));
}

function reglaAgregacionMismaEsencia(modelo: Modelo, opdActivoId: Id): Aviso[] {
  return enlacesConExtremos(modelo)
    .filter(({ enlace, origen, destino }) => (
      enlace.tipo === "agregacion" && origen.esencia !== destino.esencia
    ))
    .map(({ enlace, origen, destino }) => avisoEnlace(modelo, opdActivoId, enlace, {
      reglaId: "agregacion-misma-esencia",
      severidad: "advertencia",
      mensaje: `La agregación entre ${origen.nombre} (${origen.esencia}) y ${destino.nombre} (${destino.esencia}) cruza esencias distintas. Una parte debe compartir la naturaleza del todo: revisa si alguna esencia está mal puesta o si el enlace correcto es exhibición.`,
      citaSSOT: "[V-1]",
    }));
}

function reglaGeneralizacionMismoTipo(modelo: Modelo, opdActivoId: Id): Aviso[] {
  return enlacesConExtremos(modelo)
    .filter(({ enlace, origen, destino }) => (
      enlace.tipo === "generalizacion" && origen.tipo !== destino.tipo
    ))
    .map(({ enlace, origen, destino }) => avisoEnlace(modelo, opdActivoId, enlace, {
      reglaId: "generalizacion-mismo-tipo",
      severidad: "error",
      mensaje: `La generalización exige especialista y general del mismo tipo OPM, pero ${origen.nombre} es ${origen.tipo} y ${destino.nombre} es ${destino.tipo}. Cambia el tipo de uno de los extremos o usa otro enlace estructural.`,
      citaSSOT: "[V-239]",
    }));
}

function reglaProceduralNoObjetoObjeto(modelo: Modelo, opdActivoId: Id): Aviso[] {
  return enlacesConExtremos(modelo)
    .filter(({ enlace, origen, destino }) => (
      PROCEDURALES.has(enlace.tipo) && origen.tipo === "objeto" && destino.tipo === "objeto"
    ))
    .map(({ enlace, origen, destino }) => avisoEnlace(modelo, opdActivoId, enlace, {
      reglaId: "procedural-no-objeto-objeto",
      severidad: "error",
      mensaje: `El enlace procedural ${etiquetaTipo(enlace.tipo)} representa una transformación, así que uno de los extremos debe ser un proceso. Hoy va de ${origen.nombre} (objeto) a ${destino.nombre} (objeto): inserta el proceso que media o cambia el tipo de enlace.`,
      citaSSOT: "[V-239]",
    }));
}

function reglaEstructuralSinDuplicar(modelo: Modelo, opdActivoId: Id): Aviso[] {
  const vistos = new Set<string>();
  const avisos: Aviso[] = [];

  for (const { enlace, origen, destino } of enlacesConExtremos(modelo)) {
    if (naturalezaDeEnlace(enlace.tipo) !== "estructural") continue;
    const clave = `${enlace.tipo}:${extremoKey(enlace.origenId)}->${extremoKey(enlace.destinoId)}`;
    if (!vistos.has(clave)) {
      vistos.add(clave);
      continue;
    }
    avisos.push(avisoEnlace(modelo, opdActivoId, enlace, {
      reglaId: "estructural-sin-duplicar",
      severidad: "advertencia",
      mensaje: `${origen.nombre} y ${destino.nombre} ya están unidos por otro enlace estructural ${etiquetaTipo(enlace.tipo)}. Una sola declaración basta: elimina el duplicado o usa otro tipo de relación si querías describir algo distinto.`,
      citaSSOT: "[V-239]",
    }));
  }

  return avisos;
}

function reglaOrdenEstructuralHuerfano(modelo: Modelo, opdActivoId: Id): Aviso[] {
  const avisos: Aviso[] = [];

  for (const entidad of Object.values(modelo.entidades)) {
    const tipos = entidad.orderedFundamentalTypes ?? [];
    for (const tipo of tipos) {
      if (existeEnlaceEstructuralDeTipoParaEntidad(modelo, entidad.id, tipo)) continue;
      const opdId = opdIdDeEntidad(modelo, entidad.id, opdActivoId);
      avisos.push({
        reglaId: "orden-estructural-huerfano",
        severidad: "advertencia",
        mensaje: `${entidad.nombre} guarda un orden estructural ${etiquetaTipo(tipo)} de cuando tenía ese enlace, pero ya no existe ningún ${etiquetaTipo(tipo)} vigente. Recrea el enlace o pídele al modelo que limpie el metadato.`,
        citaSSOT: "[V-239] [OPCloud orderedFundamentalTypes]",
        elementoTipo: "entidad",
        elementoId: entidad.id,
        ...(opdId ? { opdId } : {}),
      });
    }
  }

  return avisos;
}

function existeEnlaceEstructuralDeTipoParaEntidad(modelo: Modelo, entidadId: Id, tipo: TipoEnlace): boolean {
  return Object.values(modelo.enlaces).some((enlace) => (
    enlace.tipo === tipo &&
    naturalezaDeEnlace(enlace.tipo) === "estructural" &&
    (
      entidadIdDeExtremo(modelo, enlace.origenId) === entidadId ||
      entidadIdDeExtremo(modelo, enlace.destinoId) === entidadId
    )
  ));
}

function reglaSubprocesoNoConectaAlPadre(modelo: Modelo): Aviso[] {
  const avisos: Aviso[] = [];

  for (const opd of Object.values(modelo.opds)) {
    const contexto = contextoDescomposicion(modelo, opd);
    if (!contexto) continue;

    const subprocesosInternos = new Set(
      Object.values(opd.apariencias)
        .filter((apariencia) => apariencia.entidadId !== contexto.padre.id && dentroDe(apariencia, contexto.contorno))
        .map((apariencia) => modelo.entidades[apariencia.entidadId])
        .filter((entidad): entidad is Entidad => entidad?.tipo === "proceso")
        .map((entidad) => entidad.id),
    );

    if (subprocesosInternos.size === 0) continue;

    for (const aparienciaEnlace of Object.values(opd.enlaces)) {
      const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
      if (!enlace) continue;
      const conectaPadreConSubproceso = (
        extremoApuntaAEntidad(enlace.origenId, contexto.padre.id) &&
        (entidadIdDeExtremo(modelo, enlace.destinoId) ? subprocesosInternos.has(entidadIdDeExtremo(modelo, enlace.destinoId)!) : false)
      ) || (
        extremoApuntaAEntidad(enlace.destinoId, contexto.padre.id) &&
        (entidadIdDeExtremo(modelo, enlace.origenId) ? subprocesosInternos.has(entidadIdDeExtremo(modelo, enlace.origenId)!) : false)
      );
      if (!conectaPadreConSubproceso) continue;

      const otroId = extremoApuntaAEntidad(enlace.origenId, contexto.padre.id)
        ? entidadIdDeExtremo(modelo, enlace.destinoId)
        : entidadIdDeExtremo(modelo, enlace.origenId);
      if (!otroId) continue;
      const subproceso = modelo.entidades[otroId];
      avisos.push({
        reglaId: "subproceso-no-conecta-al-padre",
        severidad: "error",
        mensaje: `${subproceso?.nombre ?? otroId} es un subproceso interno de ${contexto.padre.nombre}, así que la relación padre-hijo ya está implícita en el in-zoom. No agregues un enlace explícito hacia el padre: bórralo o conecta el subproceso con un objeto del refinamiento.`,
        citaSSOT: "[Glos 3.33]",
        elementoTipo: "enlace",
        elementoId: enlace.id,
        opdId: opd.id,
      });
    }
  }

  return avisos;
}

function reglaAgenteRequiereObjetoFisico(modelo: Modelo, opdActivoId: Id): Aviso[] {
  // Inspirado en OPCloud AgentConsistency; SSOT: agente humano [Glos 3.3] modelado como objeto físico [Glos 3.39].
  return enlacesConExtremos(modelo)
    .filter(({ enlace, origen, destino }) => (
      enlace.tipo === "agente" &&
      origen.tipo === "objeto" &&
      destino.tipo === "proceso" &&
      origen.esencia !== "fisica"
    ))
    .map(({ enlace, origen, destino }) => avisoEnlace(modelo, opdActivoId, enlace, {
      reglaId: "agente-requiere-objeto-fisico",
      severidad: "error",
      mensaje: `Un agente representa una persona u objeto físico que habilita el proceso, pero ${origen.nombre} es informacional. Si es software, sistema o dato, usa instrumento en vez de agente; si es realmente humano, cambia su esencia a física.`,
      citaSSOT: "[Glos 3.3] [Glos 3.39]",
    }));
}

function reglaProcesoSinEntradaNiSalida(modelo: Modelo, opdActivoId: Id): Aviso[] {
  // OPCloud no expone esta clase en behavioral.rules.ts; SSOT exige proceso transformador [Glos 3.58] y V-115.
  const avisos: Aviso[] = [];
  const enlacesRelevantes = new Set<TipoEnlace>([
    "consumo",
    "resultado",
    "efecto",
    "agente",
    "instrumento",
    "invocacion",
    "excepcionSobretiempo",
    "excepcionSubtiempo",
    "excepcionSubSobretiempo",
  ]);

  for (const proceso of Object.values(modelo.entidades)) {
    if (proceso.tipo !== "proceso") continue;
    if (obtenerRefinamiento(proceso, "descomposicion")) continue;
    const tieneEnlaceOperativo = Object.values(modelo.enlaces).some((enlace) => (
      enlacesRelevantes.has(enlace.tipo) &&
      (extremoApuntaAEntidad(enlace.origenId, proceso.id) || extremoApuntaAEntidad(enlace.destinoId, proceso.id))
    ));
    if (tieneEnlaceOperativo) continue;

    const opdId = opdIdDeEntidad(modelo, proceso.id, opdActivoId);
    avisos.push({
      reglaId: "proceso-sin-entrada-ni-salida",
      severidad: "advertencia",
      mensaje: `${proceso.nombre} no participa en ningún enlace de transformación, habilitación o invocación. Sin entradas ni salidas no expresa qué hace en el sistema: conéctalo con un objeto como entrada o salida, o decide si conviene abstraerlo.`,
      citaSSOT: "[Glos 3.58] [V-115] [V-239]",
      elementoTipo: "entidad",
      elementoId: proceso.id,
      ...(opdId ? { opdId } : {}),
    });
  }

  return avisos;
}

function reglaInstrumentoYAgenteSimultaneos(modelo: Modelo, opdActivoId: Id): Aviso[] {
  // Inspirado en OPCloud InstrumentWithAgentConsistency1/2; SSOT separa agente humano [Glos 3.3] de instrumento no humano [Glos 3.30].
  const agentes = new Map<string, Enlace>();
  const instrumentos = new Map<string, Enlace>();
  const avisos: Aviso[] = [];

  for (const { enlace, origen, destino } of enlacesConExtremos(modelo)) {
    if (origen.tipo !== "objeto" || destino.tipo !== "proceso") continue;
    if (enlace.tipo === "agente") agentes.set(clavePar(origen.id, destino.id), enlace);
    if (enlace.tipo === "instrumento") instrumentos.set(clavePar(origen.id, destino.id), enlace);
  }

  for (const [clave, enlaceInstrumento] of instrumentos) {
    const enlaceAgente = agentes.get(clave);
    if (!enlaceAgente) continue;
    const origen = entidadDeExtremo(modelo, enlaceInstrumento.origenId);
    const destino = entidadDeExtremo(modelo, enlaceInstrumento.destinoId);
    avisos.push(avisoEnlace(modelo, opdActivoId, enlaceInstrumento, {
      reglaId: "instrumento-y-agente-simultaneos",
      severidad: "advertencia",
      mensaje: `${origen?.nombre ?? enlaceInstrumento.origenId} habilita a ${destino?.nombre ?? enlaceInstrumento.destinoId} como agente y como instrumento a la vez. Solo uno de los dos roles aplica al mismo tiempo: elige cuál corresponde y elimina el otro enlace.`,
      citaSSOT: "[Glos 3.3] [Glos 3.30] [V-239]",
    }));
  }

  return avisos;
}

function reglaSoloUnNivelDeInstanciacion(modelo: Modelo, opdActivoId: Id): Aviso[] {
  // Inspirado en OPCloud OnlyOneLevelOfInstantiation; en esta app aplica al enlace clasificación-instanciación.
  const avisos: Aviso[] = [];
  const clasesPorInstancia = new Map<Id, Enlace[]>();

  for (const enlace of Object.values(modelo.enlaces)) {
    if (enlace.tipo !== "clasificacion") continue;
    const origenId = entidadIdDeExtremo(modelo, enlace.origenId);
    if (!origenId) continue;
    const existentes = clasesPorInstancia.get(origenId) ?? [];
    clasesPorInstancia.set(origenId, [...existentes, enlace]);
  }

  for (const enlace of Object.values(modelo.enlaces)) {
    if (enlace.tipo !== "clasificacion") continue;
    const destinoId = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (!destinoId) continue;
    const enlacesSiguientes = clasesPorInstancia.get(destinoId) ?? [];
    for (const enlaceSiguiente of enlacesSiguientes) {
      const instanciaIntermedia = modelo.entidades[destinoId];
      const siguienteDestinoId = entidadIdDeExtremo(modelo, enlaceSiguiente.destinoId);
      const instanciaFinal = siguienteDestinoId ? modelo.entidades[siguienteDestinoId] : undefined;
      avisos.push(avisoEnlace(modelo, opdActivoId, enlaceSiguiente, {
        reglaId: "solo-un-nivel-de-instanciacion",
        severidad: "advertencia",
        mensaje: `${instanciaIntermedia?.nombre ?? enlace.destinoId} ya es instancia de otra cosa y a la vez clasifica a ${instanciaFinal?.nombre ?? enlaceSiguiente.destinoId}. La clasificación se modela en un solo nivel: si querías encadenarlas, usa generalización para uno de los tramos.`,
        citaSSOT: "[Glos 3.28] [V-239]",
      }));
    }
  }

  return avisos;
}

function reglaConsumoDobleMismoObjeto(modelo: Modelo, opdActivoId: Id): Aviso[] {
  // Inspirado en OPCloud LegalConsumptionWarning; V-43 invalida consumo+consumo sobre el mismo objeto abstracto.
  const avisos: Aviso[] = [];
  const primerConsumoPorPar = new Set<string>();

  for (const { enlace, origen, destino } of enlacesConExtremos(modelo)) {
    if (enlace.tipo !== "consumo" || origen.tipo !== "objeto" || destino.tipo !== "proceso") continue;
    const clave = clavePar(origen.id, destino.id);
    if (!primerConsumoPorPar.has(clave)) {
      primerConsumoPorPar.add(clave);
      continue;
    }
    avisos.push(avisoEnlace(modelo, opdActivoId, enlace, {
      reglaId: "consumo-doble-mismo-objeto",
      severidad: "advertencia",
      mensaje: `${destino.nombre} consume ${origen.nombre} más de una vez. Un consumo describe una sola transformación; si son alternativos, agrúpalos con un abanico XOR/OR; si son cantidades, anota la multiplicidad en un único consumo.`,
      citaSSOT: "[V-43] [V-239]",
    }));
  }

  return avisos;
}

function enlacesConExtremos(modelo: Modelo): Array<{ enlace: Enlace; origen: Entidad; destino: Entidad }> {
  return Object.values(modelo.enlaces).flatMap((enlace) => {
    const origen = entidadDeExtremo(modelo, enlace.origenId);
    const destino = entidadDeExtremo(modelo, enlace.destinoId);
    return origen && destino ? [{ enlace, origen, destino }] : [];
  });
}

function avisoEnlace(
  modelo: Modelo,
  opdActivoId: Id,
  enlace: Enlace,
  base: Pick<Aviso, "reglaId" | "severidad" | "mensaje" | "citaSSOT">,
): Aviso {
  const opdId = opdIdDeEnlace(modelo, enlace.id, opdActivoId);
  return {
    ...base,
    elementoTipo: "enlace",
    elementoId: enlace.id,
    ...(opdId ? { opdId } : {}),
  };
}

function contextoDescomposicion(modelo: Modelo, opd: Opd): { padre: Entidad; contorno: Apariencia } | null {
  if (!opd.padreId) return null;
  const padre = Object.values(modelo.entidades).find((entidad) => (
    entidad.tipo === "proceso" &&
    obtenerRefinamiento(entidad, "descomposicion")?.opdId === opd.id
  ));
  if (!padre) return null;
  const contorno = aparienciaDeEntidadEnOpd(opd, padre.id);
  return contorno ? { padre, contorno } : null;
}

function opdIdDeEnlace(modelo: Modelo, enlaceId: Id, opdPreferidoId: Id): Id | null {
  const opdPreferido = modelo.opds[opdPreferidoId];
  if (opdPreferido && Object.values(opdPreferido.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId)) {
    return opdPreferidoId;
  }
  for (const opd of Object.values(modelo.opds)) {
    if (Object.values(opd.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId)) return opd.id;
  }
  return null;
}

function opdIdDeEntidad(modelo: Modelo, entidadId: Id, opdPreferidoId: Id): Id | null {
  return opdIdDeEntidadVisible(modelo, entidadId, opdPreferidoId);
}

function priorizarOpdActivo(avisos: Aviso[], opdActivoId: Id): Aviso[] {
  return avisos
    .map((aviso, index) => ({ aviso, index }))
    .sort((a, b) => prioridadOpd(a.aviso, opdActivoId) - prioridadOpd(b.aviso, opdActivoId) || a.index - b.index)
    .map(({ aviso }) => aviso);
}

function prioridadOpd(aviso: Aviso, opdActivoId: Id): number {
  if (!aviso.opdId) return 1;
  return aviso.opdId === opdActivoId ? 0 : 2;
}

function dentroDe(apariencia: Apariencia, contorno: Apariencia): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

function etiquetaTipo(tipo: TipoEnlace): string {
  return tipo.replaceAll("-", " ");
}

function clavePar(origenId: Id, destinoId: Id): string {
  return `${origenId}->${destinoId}`;
}
