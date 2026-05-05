import { naturalezaDeEnlace } from "./constantes";
import { entidadDeExtremo, entidadIdDeExtremo, extremoApuntaAEntidad, extremoKey, nombreExtremo } from "./extremos";
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
]);

export function validarModelo(modelo: Modelo, opdActivoId: Id): Aviso[] {
  const avisos = [
    ...reglaAgregacionMismaEsencia(modelo, opdActivoId),
    ...reglaGeneralizacionMismoTipo(modelo, opdActivoId),
    ...reglaEstructuralNoAceptaExtremoEstado(modelo, opdActivoId),
    ...reglaProceduralNoObjetoObjeto(modelo, opdActivoId),
    ...reglaEstructuralSinDuplicar(modelo, opdActivoId),
    ...reglaSubprocesoNoConectaAlPadre(modelo),
    ...reglaAgenteRequiereObjetoFisico(modelo, opdActivoId),
    ...reglaProcesoSinEntradaNiSalida(modelo, opdActivoId),
    ...reglaInstrumentoYAgenteSimultaneos(modelo, opdActivoId),
    ...reglaSoloUnNivelDeInstanciacion(modelo, opdActivoId),
    ...reglaConsumoDobleMismoObjeto(modelo, opdActivoId),
  ];
  return priorizarOpdActivo(avisos, opdActivoId);
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
      mensaje: `El enlace estructural ${etiquetaTipo(enlace.tipo)} no puede apuntar a un estado específico: ${nombreExtremo(modelo, enlace.origenId)} -> ${nombreExtremo(modelo, enlace.destinoId)}.`,
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
      mensaje: `Agregación entre ${origen.nombre} y ${destino.nombre} mezcla esencia ${origen.esencia}/${destino.esencia}; revisa si corresponde otra relación estructural.`,
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
      mensaje: `Generalización requiere entidades del mismo tipo OPM; ${origen.nombre} es ${origen.tipo} y ${destino.nombre} es ${destino.tipo}.`,
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
      mensaje: `El enlace procedural ${etiquetaTipo(enlace.tipo)} no puede conectar objeto con objeto: ${origen.nombre} -> ${destino.nombre}.`,
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
      mensaje: `El par ${origen.nombre} -> ${destino.nombre} ya tiene un enlace estructural ${etiquetaTipo(enlace.tipo)}.`,
      citaSSOT: "[V-239]",
    }));
  }

  return avisos;
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
        mensaje: `El subproceso interno ${subproceso?.nombre ?? otroId} no debe enlazarse explícitamente con su proceso refinable ${contexto.padre.nombre}.`,
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
      mensaje: `El agente ${origen.nombre} que habilita ${destino.nombre} debe ser un objeto físico/humano; si es sistema o software usa instrumento.`,
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
  ]);

  for (const proceso of Object.values(modelo.entidades)) {
    if (proceso.tipo !== "proceso") continue;
    if (proceso.refinamiento?.tipo === "descomposicion") continue;
    const tieneEnlaceOperativo = Object.values(modelo.enlaces).some((enlace) => (
      enlacesRelevantes.has(enlace.tipo) &&
      (extremoApuntaAEntidad(enlace.origenId, proceso.id) || extremoApuntaAEntidad(enlace.destinoId, proceso.id))
    ));
    if (tieneEnlaceOperativo) continue;

    const opdId = opdIdDeEntidad(modelo, proceso.id, opdActivoId);
    avisos.push({
      reglaId: "proceso-sin-entrada-ni-salida",
      severidad: "advertencia",
      mensaje: `El proceso ${proceso.nombre} no participa en enlaces de transformación, habilitación o invocación; revisa si falta entrada/salida o si debe abstraerse.`,
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
      mensaje: `${origen?.nombre ?? enlaceInstrumento.origenId} aparece como agente e instrumento del mismo proceso ${destino?.nombre ?? enlaceInstrumento.destinoId}; elige un rol procedimental único.`,
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
        mensaje: `${instanciaIntermedia?.nombre ?? enlace.destinoId} ya es instancia y además clasifica a ${instanciaFinal?.nombre ?? enlaceSiguiente.destinoId}; revisa si corresponde generalización o una sola clasificación directa.`,
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
      mensaje: `${destino.nombre} consume ${origen.nombre} más de una vez; considera un único consumo o un abanico XOR/OR cuando sea alternativo.`,
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
    entidad.refinamiento?.tipo === "descomposicion" &&
    entidad.refinamiento.opdId === opd.id
  ));
  if (!padre) return null;
  const contorno = Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === padre.id);
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
  const opdPreferido = modelo.opds[opdPreferidoId];
  if (opdPreferido && Object.values(opdPreferido.apariencias).some((apariencia) => apariencia.entidadId === entidadId)) {
    return opdPreferidoId;
  }
  for (const opd of Object.values(modelo.opds)) {
    if (Object.values(opd.apariencias).some((apariencia) => apariencia.entidadId === entidadId)) return opd.id;
  }
  return null;
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
