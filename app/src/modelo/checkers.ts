/**
 * Verificacion metodologica OPM. Avisos accionables, blandos.
 *
 * Citas SSOT canonicas (KORA):
 *   §6.1   Identificacion del Proceso Principal
 *   §6.4   Funcion Principal
 *   §6.9   Objetos Ambientales (contorno discontinuo)
 *   §6.11  Verificacion del SD
 *   §7.1   Refinamiento Sincrono / Inzoom (refinamiento no trivial)
 *   §7.2   Refinamiento Asincrono / Unfold (refinamiento no trivial)
 *   §7.3   Refinamiento de Objetos
 *   §7.6   Verificacion de SD1
 * Plus glosario: [Glos 3.55 Object] [Glos 3.69 Process].
 *
 * Ronda 16 L3 (Beta1): cada aviso debe llevar `ssotRef` (cita corta visible
 * en el panel) y, cuando aplica, `accionesSugeridas` legibles. Esta funcion
 * no decide la presentacion: solo emite datos puros consumibles por
 * `PanelDiagnostico`.
 *
 * Referencias semanticas OPCloud verificadas (no autoridad):
 * opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/ing-checker.ts
 * opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/object-name-as-singular-checker.ts
 * opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/inzoomed-content-checker.ts
 * opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/part-unfold-content-checker.ts
 * opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/transforming-process-checker.ts
 * opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/systemic-processes-main-function-checker.ts
 *
 * Destilacion semantica, no copia 1:1: SSOT prevalece sobre OPCloud cuando hay
 * conflicto.
 */

import { naturalezaDeEnlace } from "./constantes";
import { entidadDeExtremo, entidadIdDeExtremo, extremoApuntaAEntidad } from "./extremos";
import { verificarLinealidad } from "./composicion";
import { observarPreservacionFrontera } from "./equivalencia";
import { estadoTieneNombreCanonico } from "./nombresCanonicos";
import { obtenerRefinamiento, refinamientosDe, tieneRefinamiento } from "./refinamientos";
import type { AvisoMetodologico, CodigoChecker, Entidad, Id, Modelo, TipoEnlace, TipoRefinamiento } from "./tipos";

const TRANSFORMADORES = new Set<TipoEnlace>(["consumo", "resultado", "efecto"]);
const INVARIABLES_SINGULAR = new Set(["analisis", "sintesis", "crisis", "tesis", "hipotesis", "virus", "gas"]);
const KB_OPM = "urn:fxsl:kb:opm-es";
const KB_OPD = "urn:fxsl:kb:opd-es";
const KB_OPL = "urn:fxsl:kb:opl-es";
const KB_METODO = "urn:fxsl:kb:manual-metodologico-opm-es";
const KB_REGLAS = "urn:fxsl:kb:reglas-opm-estrictas-es";
/**
 * Patron de placeholders auto-generados.
 * Casos cubiertos:
 *   - Hotfix unicidad (`e5a0613`): "Objeto", "Objeto_2", "Proceso", "Proceso_3".
 *   - Descomposicion sembrada (`subcosasInicialesInzoom`): "Procesar Pedido 1",
 *     "Procesar Pedido 2", ... — sufijo numerico simple sobre el nombre del padre.
 *
 * Es heuristico por diseno: la SSOT §7.1 pide vocabulario de dominio, pero la
 * forma exacta del placeholder es decision de implementacion. Mantener el
 * patron acotado: solo nombres "creados por defecto y no tocados".
 */
const PLACEHOLDER_NOMBRE_RE = /^(?:Objeto|Proceso)(?:_\d+)?$/;
const PLACEHOLDER_SUFIJO_NUMERICO_RE = /\s\d+$/;

export function verificarMetodologia(modelo: Modelo): AvisoMetodologico[] {
  return [
    ...checkSdSinProcesoPrincipal(modelo),
    ...checkProcesoNombreFormaVerbal(modelo),
    ...checkEstadoNombreCanonico(modelo),
    ...checkObjetoNombreSingular(modelo),
    ...checkObjetoAmbientalSinContornoDiscontinuo(modelo),
    ...checkDescomposicionSinSubprocesos(modelo),
    ...checkInzoomContenido(modelo),
    ...checkInzoomNombresPlaceholderHijos(modelo),
    ...checkUnfoldContenido(modelo),
    ...checkProcesoTransforma(modelo),
    ...checkProcesoSistemicoConectado(modelo),
    ...checkRecursoLinealMultiplesConsumidores(modelo),
    ...checkDescomposicionPreservaFrontera(modelo),
  ];
}

/**
 * Preservación de frontera (capa categorial F2): la descomposición de un proceso
 * debe ser FRONTERA-EQUIVALENTE al proceso abstracto (ley in-zoom ↔ out-zoom).
 * Si el OPD hijo deja de ejercer un rol de contorno que el proceso sí ejerce
 * (o lo introduce de más), el inzoom no realiza fielmente el proceso. Reusa
 * `observarPreservacionFrontera` del kernel de equivalencia.
 */
export function checkDescomposicionPreservaFrontera(modelo: Modelo): AvisoMetodologico[] {
  return observarPreservacionFrontera(modelo).map((obs) => {
    const entidad = modelo.entidades[obs.procesoId];
    return {
      codigo: "DESCOMPOSICION_NO_PRESERVA_FRONTERA",
      severidad: "advertencia",
      entidadId: obs.procesoId,
      navegarA: { tipo: "entidad", id: obs.procesoId },
      mensaje: `La descomposición de "${entidad?.nombre ?? obs.procesoId}" no preserva su frontera: difiere en ${obs.diferencias.join(", ")}. El OPD hijo debe ejercer sobre el contorno los mismos roles (consumo/resultado/efecto…) que el proceso abstracto.`,
      rationale: "La realización in-zoom de un proceso debe ser frontera-equivalente a su vista abstracta (out-zoom).",
      ssotRef: `${KB_METODO} §7.1 / urn:fxsl:kb:opm-categorial-es F2`,
      accionesSugeridas: [
        "Recolecta o distribuye los enlaces de contorno faltantes en el OPD hijo (clic derecho sobre el enlace externo).",
        "O ajusta los enlaces del proceso abstracto para que coincidan con su descomposición.",
      ],
    } satisfies AvisoMetodologico;
  });
}

/**
 * Recurso lineal (capa categorial F1) consumido por más de un proceso: un
 * objeto `lineal` se consume y no se copia, así que su consumo es exclusivo.
 * Reusa `verificarLinealidad` del kernel de composición y lo eleva a aviso
 * metodológico navegable.
 */
export function checkRecursoLinealMultiplesConsumidores(modelo: Modelo): AvisoMetodologico[] {
  return verificarLinealidad(modelo).map((obs) => {
    const entidad = modelo.entidades[obs.entidadId];
    return {
      codigo: "RECURSO_LINEAL_MULTIPLES_CONSUMIDORES",
      severidad: "advertencia",
      entidadId: obs.entidadId,
      navegarA: { tipo: "entidad", id: obs.entidadId },
      mensaje: `El recurso lineal "${entidad?.nombre ?? obs.entidadId}" es consumido por ${obs.procesos.length} procesos. Un recurso lineal se consume (no se reutiliza): si varios procesos lo necesitan, replícalo o reclasifícalo como no lineal.`,
      rationale: "Un objeto lineal no se copia: su consumo es exclusivo de un proceso.",
      ssotRef: `${KB_OPM} §recursos lineales / urn:fxsl:kb:opm-categorial-es F1`,
      accionesSugeridas: [
        "Si varios procesos lo necesitan en paralelo, quita la marca 'lineal' (recurso copiable).",
        "Si es exclusivamente lineal, rediseña para que un solo proceso lo consuma.",
      ],
    } satisfies AvisoMetodologico;
  });
}

/**
 * Refinamiento trivial: un proceso con descomposición formal cuyo OPD hijo no
 * agrega ningun subproceso interno. Metodologicamente es distinto de "menos de
 * dos cosas": puede haber objetos contextuales, pero si no aparece ningun
 * proceso refinador el in-zoom no explica comportamiento.
 */
export function checkDescomposicionSinSubprocesos(modelo: Modelo): AvisoMetodologico[] {
  return procesos(modelo)
    .filter((proceso) => obtenerRefinamiento(proceso, "descomposicion") !== undefined)
    .filter((proceso) => cantidadSubprocesosEnDescomposicion(modelo, proceso) === 0)
    .map((proceso) => avisoConOpdRefinamiento(modelo, "DESCOMPOSICION_SIN_SUBPROCESOS", proceso, "descomposicion", {
      severidad: "advertencia",
      mensaje: `La descomposición de "${proceso.nombre}" no agrega subprocesos. Un in-zoom de proceso debe descomponer comportamiento; si este OPD solo navega contexto, conviértelo en vista navegacional sin refinamiento formal.`,
      rationale: "Un refinamiento por descomposicion de proceso debe aportar subprocesos internos; un hijo sin subprocesos es refinamiento trivial.",
      ssotRef: `${KB_METODO} §7.1 / ${KB_REGLAS} LF-19`,
      accionesSugeridas: [
        "Agrega al menos dos subprocesos internos que refinen el comportamiento del proceso.",
        "Si el OPD solo agrupa contexto o evidencia, elimina el refDescomp formal y úsalo como OPD/vista navegacional.",
      ],
    }));
}

export function checkEstadoNombreCanonico(modelo: Modelo): AvisoMetodologico[] {
  const entidadIds = new Set<Id>();
  for (const estado of Object.values(modelo.estados ?? {})) {
    if (!estadoTieneNombreCanonico(estado)) entidadIds.add(estado.entidadId);
  }
  return [...entidadIds]
    .map((entidadId) => modelo.entidades[entidadId])
    .filter((entidad): entidad is Entidad => entidad?.tipo === "objeto")
    .map((entidad) => aviso("ESTADO_NOMBRE_CANONICO", entidad, {
      severidad: "advertencia",
      mensaje: `El objeto "${entidad.nombre}" tiene estados con nombre por defecto. Nombra cada estado en minúsculas descriptivas antes de emitir OPL canónica.`,
      rationale: "Los estados placeholder como estado1/estado2 son ruido de edición y no nombres OPL-ES válidos.",
      ssotRef: `${KB_REGLAS} R-NOM-EST-1 / ${KB_OPL} §1.3`,
      accionesSugeridas: [
        "Renombra los estados con formas descriptivas en minúscula, por ejemplo 'pendiente', 'aprobado' o 'cerrado'.",
      ],
    }));
}

export function checkProcesoNombreFormaVerbal(modelo: Modelo): AvisoMetodologico[] {
  return procesos(modelo)
    .filter((proceso) => !esFormaVerbalValida(proceso.nombre))
    .map((proceso) => aviso("PROCESO_NOMBRE_FORMA_VERBAL", proceso, {
      severidad: "sugerencia",
      mensaje: `El proceso "${proceso.nombre}" no sigue la política léxica OPL-ES; usa infinitivo o una nominalización de dominio cuando corresponda.`,
      rationale: "El nombre del proceso debe expresar accion o transformacion identificable mediante forma canónica OPL-ES.",
      ssotRef: `${KB_REGLAS} R-NOM-PROC-1 / ${KB_OPL} §1.1`,
      accionesSugeridas: [
        "Renombra usando una forma verbal o un sustantivo deverbal (ej. 'Procesar Pedido', 'Recoleccion').",
        "Si la cosa describe una clase de objeto, conviertela en objeto en vez de proceso.",
      ],
    }));
}

export function checkObjetoNombreSingular(modelo: Modelo): AvisoMetodologico[] {
  return objetos(modelo)
    .filter((objeto) => !esNombreObjetoSingular(objeto.nombre))
    .map((objeto) => aviso("OBJETO_NOMBRE_SINGULAR", objeto, {
      severidad: "sugerencia",
      mensaje: `El objeto "${objeto.nombre}" no está nombrado en singular. Un objeto representa una cosa: usa singular, o modela el conjunto mediante nombre de dominio, multiplicidad o estructura.`,
      rationale: "Un objeto representa una cosa persistente; el nombre canonico se mantiene singular.",
      ssotRef: `${KB_REGLAS} R-NOM-OBJ-1 / ${KB_OPL} §1.2`,
      accionesSugeridas: [
        "Renombra al singular ('Cliente').",
        "Si necesitas multiplicidad, usa 'Conjunto', 'Grupo' o anota la multiplicidad en el enlace.",
      ],
    }));
}

export function checkObjetoAmbientalSinContornoDiscontinuo(modelo: Modelo): AvisoMetodologico[] {
  /**
   * SSOT §6.9: "Los objetos ambientales DEBEN representarse con contorno
   * discontinuo." En el modelo deep-opm-pro la convencion canonica es:
   * objeto ambiental + esencia "fisica" (contorno solido en render). Si la
   * esencia es informacional, el render usa contorno discontinuo (rasgo
   * informacional), pero el modelador puede haber dejado un objeto ambiental
   * marcado como esencia fisica + contorno solido por descuido.
   *
   * Aviso emitido cuando: afiliacion=ambiental && (no hay enlace que justifique
   * pertenencia al sistema). Aqui usamos un proxy operacional simple: el
   * objeto ambiental no debe estar consumido/resultado por procesos sistemicos
   * (eso lo convierte de facto en sistemico). El render se encarga del
   * contorno discontinuo; este aviso solo dispara cuando hay incoherencia
   * semantica entre afiliacion y rol procedural.
   */
  return objetos(modelo)
    .filter((objeto) => objeto.afiliacion === "ambiental")
    .filter((objeto) => objetoAmbientalEsTransformadoPorSistemico(modelo, objeto))
    .map((objeto) => aviso("OBJETO_AMBIENTAL_SIN_CONTORNO_DISCONTINUO", objeto, {
      severidad: "advertencia",
      mensaje: `Marcaste "${objeto.nombre}" como ambiental, pero un proceso del sistema lo está consumiendo o produciendo. Si participa de la función del sistema, pásalo a sistémico; si pertenece al entorno, reemplaza el enlace por exhibición, efecto o agente según corresponda.`,
      rationale: "Un objeto ambiental no deberia ser consumido, producido ni afectado por la funcion del sistema; revisa la afiliacion o reclasificalo como sistemico.",
      ssotRef: `${KB_METODO} §6.9 / ${KB_OPD} §1.1`,
      accionesSugeridas: [
        "Cambia la afiliacion a sistemica si es parte del sistema modelado.",
        "Si pertenece al entorno, reemplaza el enlace transformador por exhibicion/efecto/agente segun corresponda.",
      ],
    }));
}

export function checkInzoomContenido(modelo: Modelo): AvisoMetodologico[] {
  return Object.values(modelo.entidades)
    .filter((entidad) => obtenerRefinamiento(entidad, "descomposicion") !== undefined)
    .filter((entidad) => !(entidad.tipo === "proceso" && cantidadSubprocesosEnDescomposicion(modelo, entidad) === 0))
    .filter((entidad) => cantidadCosasEnOpdHijo(modelo, entidad, "descomposicion") < 2)
    .map((entidad) => avisoConOpdRefinamiento(modelo, "INZOOM_CONTENIDO_INSUFICIENTE", entidad, "descomposicion", {
      severidad: "advertencia",
      mensaje: `La descomposición de "${entidad.nombre}" tiene menos de dos cosas internas. Un refinamiento con una sola cosa no aporta información nueva: agrega otro subproceso o parte, o pospón la descomposición.`,
      rationale: "Una cosa descompuesta debe agregar al menos dos refinadores internos para que el inzoom aporte informacion.",
      ssotRef: `${KB_METODO} §7.1`,
      accionesSugeridas: [
        "Agrega al menos un subproceso/parte mas dentro del OPD hijo.",
        "Si no puedes identificar otro refinador, posterga la descomposicion hasta tener al menos dos.",
      ],
    }));
}

export function checkInzoomNombresPlaceholderHijos(modelo: Modelo): AvisoMetodologico[] {
  return Object.values(modelo.entidades)
    .filter((entidad) => obtenerRefinamiento(entidad, "descomposicion") !== undefined)
    .flatMap((entidad) => {
      const opdId = obtenerRefinamiento(entidad, "descomposicion")?.opdId;
      const opd = opdId ? modelo.opds[opdId] : undefined;
      if (!opd) return [] as AvisoMetodologico[];
      const placeholders = new Set<Id>();
      for (const apariencia of Object.values(opd.apariencias)) {
        if (apariencia.entidadId === entidad.id) continue;
        const hijo = modelo.entidades[apariencia.entidadId];
        if (hijo && esNombrePlaceholderHijoInzoom(hijo.nombre, entidad.nombre)) placeholders.add(hijo.id);
      }
      if (placeholders.size === 0) return [];
      return [...placeholders].map((hijoId) => {
        const hijo = modelo.entidades[hijoId];
        if (!hijo) return null;
        return aviso("INZOOM_NOMBRES_PLACEHOLDER_HIJOS", hijo, {
          severidad: "sugerencia",
          mensaje: `El refinador "${hijo.nombre}" del OPD "${opd?.nombre ?? opdId}" todavía tiene el nombre por defecto que se sembró al descomponer. Renómbralo con vocabulario del dominio antes de seguir profundizando.`,
          rationale: "La elaboracion progresiva de SD1 indica renombrar los subprocesos/partes con nombres significativos antes de avanzar.",
          ssotRef: `${KB_METODO} §7.1`,
          opdId: opd?.id,
          accionesSugeridas: [
            `Abre el OPD "${opd?.nombre ?? "hijo"}" y renombra "${hijo.nombre}" con vocabulario de dominio.`,
          ],
        });
      }).filter((item): item is AvisoMetodologico => item !== null);
    });
}

function esNombrePlaceholderHijoInzoom(nombreHijo: string, nombrePadre: string): boolean {
  if (PLACEHOLDER_NOMBRE_RE.test(nombreHijo)) return true;
  // "<padre> N" sembrado por descomponerProceso/desplegar.
  if (nombreHijo.startsWith(`${nombrePadre} `) && PLACEHOLDER_SUFIJO_NUMERICO_RE.test(nombreHijo)) return true;
  return false;
}

export function checkUnfoldContenido(modelo: Modelo): AvisoMetodologico[] {
  return Object.values(modelo.entidades)
    .filter((entidad) => obtenerRefinamiento(entidad, "despliegue") !== undefined)
    .filter((entidad) => cantidadRefinadoresEstructurales(modelo, entidad) < 2)
    .map((entidad) => avisoConOpdRefinamiento(modelo, "UNFOLD_CONTENIDO_INSUFICIENTE", entidad, "despliegue", {
      severidad: "advertencia",
      mensaje: `El despliegue de "${entidad.nombre}" tiene menos de dos refinadores estructurales. Un unfold con uno solo no agrega información: agrega otra parte, exhibición, especialización o instancia, o pliega el despliegue.`,
      rationale: "Un despliegue debe revelar al menos dos refinadores para agregar informacion al modelo.",
      ssotRef: `${KB_METODO} §7.2`,
      accionesSugeridas: [
        "Agrega un refinador estructural mas en el OPD hijo (otra parte/exhibicion/especializacion/instancia).",
        "Si solo hay uno, considera plegar el despliegue.",
      ],
    }));
}

export function checkProcesoTransforma(modelo: Modelo): AvisoMetodologico[] {
  return procesos(modelo)
    .filter((proceso) => !procesoTransforma(modelo, proceso) && !tieneHijoTransformador(modelo, proceso))
    .map((proceso) => aviso("PROCESO_NO_TRANSFORMA", proceso, {
      severidad: "advertencia",
      mensaje: `El proceso "${proceso.nombre}" no consume, produce ni afecta ningún objeto. Todo proceso debe transformar algo: conéctalo con un objeto por consumo, resultado o efecto, o descompónlo dejando el rol transformador en un subproceso.`,
      rationale: "Un proceso debe transformar al menos un objeto mediante consumo, resultado o efecto, directamente o via un subproceso.",
      ssotRef: `${KB_METODO} §7.6 / ${KB_OPM} V-115`,
      accionesSugeridas: [
        "Conecta el proceso con al menos un objeto via consumo, resultado o efecto.",
        "Si el proceso es solo orquestador, descomponlo y deja el rol transformador en un subproceso.",
      ],
    }));
}

export function checkProcesoSistemicoConectado(modelo: Modelo): AvisoMetodologico[] {
  const principal = procesoPrincipalSistemico(modelo);
  if (!principal) return [];
  const conectados = procesosConectadosAlPrincipal(modelo, principal);
  return procesos(modelo)
    .filter((proceso) => proceso.afiliacion === "sistemica" && !conectados.has(proceso.id))
    .map((proceso) => aviso("PROCESO_SISTEMICO_DESCONECTADO", proceso, {
      severidad: "advertencia",
      mensaje: `El proceso sistémico "${proceso.nombre}" no llega a la función principal del SD por enlaces ni por refinamiento. Conéctalo a la cadena del proceso principal, o reclasifícalo como ambiental si no aporta a la función del sistema.`,
      rationale: "Todo proceso sistemico debe integrarse a la funcion principal por refinamiento o enlaces estructurales.",
      ssotRef: `${KB_METODO} §6.4`,
      accionesSugeridas: [
        "Conecta el proceso a la cadena que parte de la funcion principal.",
        "Reclasifica como ambiental si no aporta a la funcion del sistema.",
      ],
    }));
}

export function checkSdSinProcesoPrincipal(modelo: Modelo): AvisoMetodologico[] {
  /**
   * SSOT §6.1 / §6.11: el SD (OPD raiz) DEBE tener al menos un proceso
   * sistemico que actue como funcion principal. Sin proceso principal el
   * modelo no cumple el contrato de proposito.
   */
  const sd = modelo.opds[modelo.opdRaizId];
  if (!sd) return [];
  const tieneProcesoSistemico = Object.values(sd.apariencias).some((apariencia) => {
    const entidad = modelo.entidades[apariencia.entidadId];
    return entidad?.tipo === "proceso" && entidad.afiliacion === "sistemica";
  });
  // Solo emite si hay al menos una entidad: un SD totalmente vacio no
  // arrastra avisos (el modelador todavia no empezo).
  if (tieneProcesoSistemico) return [];
  if (Object.keys(sd.apariencias).length === 0) return [];
  return [{
    codigo: "SD_SIN_PROCESO_PRINCIPAL",
    severidad: "advertencia",
    opdId: sd.id,
    mensaje: `El SD "${sd.nombre}" todavía no tiene un proceso sistémico. Sin proceso principal el modelo no expresa la función del sistema: agrega el proceso que da el propósito y conéctalo al beneficiario por efecto o consumo/resultado.`,
    rationale: "El SD debe contener el proceso principal del sistema (sistemico, transformador), que define su proposito.",
    ssotRef: `${KB_METODO} §6.1 / §6.11`,
    navegarA: { tipo: "opd", id: sd.id },
    accionesSugeridas: [
      "Agrega un proceso sistemico al SD que represente la funcion principal del sistema.",
      "Conectalo al beneficiario via efecto o consumo/resultado segun corresponda.",
    ],
  }];
}

function procesos(modelo: Modelo): Entidad[] {
  return Object.values(modelo.entidades).filter((entidad) => entidad.tipo === "proceso");
}

function objetos(modelo: Modelo): Entidad[] {
  return Object.values(modelo.entidades).filter((entidad) => entidad.tipo === "objeto");
}

function aviso(
  codigo: CodigoChecker,
  entidad: Entidad,
  base: Pick<AvisoMetodologico, "severidad" | "mensaje" | "rationale" | "ssotRef" | "accionesSugeridas" | "opdId">,
): AvisoMetodologico {
  return {
    codigo,
    entidadId: entidad.id,
    ...base,
  };
}

/**
 * Helper para checkers de inzoom/unfold: anota como `opdId` el OPD hijo del
 * refinamiento (no el OPD donde aparece la entidad refinada). Esto lleva el
 * click de navegacion al lugar donde el modelador debe agregar contenido.
 */
function avisoConOpdRefinamiento(
  modelo: Modelo,
  codigo: CodigoChecker,
  entidad: Entidad,
  tipo: TipoRefinamiento,
  base: Pick<AvisoMetodologico, "severidad" | "mensaje" | "rationale" | "ssotRef" | "accionesSugeridas">,
): AvisoMetodologico {
  const opdHijoId = obtenerRefinamiento(entidad, tipo)?.opdId;
  const opdHijoExiste = Boolean(opdHijoId && modelo.opds[opdHijoId]);
  const navegarA: AvisoMetodologico["navegarA"] = opdHijoExiste && opdHijoId
    ? { tipo: "opd", id: opdHijoId }
    : { tipo: "entidad", id: entidad.id };
  const item: AvisoMetodologico = {
    codigo,
    entidadId: entidad.id,
    navegarA,
    ...base,
  };
  if (opdHijoExiste && opdHijoId) item.opdId = opdHijoId;
  return item;
}

function objetoAmbientalEsTransformadoPorSistemico(modelo: Modelo, objeto: Entidad): boolean {
  return Object.values(modelo.enlaces).some((enlace) => {
    if (!TRANSFORMADORES.has(enlace.tipo)) return false;
    const tocaObjeto = extremoApuntaAEntidad(enlace.origenId, objeto.id) || extremoApuntaAEntidad(enlace.destinoId, objeto.id);
    if (!tocaObjeto) return false;
    const otra = entidadDeExtremo(modelo, enlace.origenId)?.id === objeto.id
      ? entidadDeExtremo(modelo, enlace.destinoId)
      : entidadDeExtremo(modelo, enlace.origenId);
    return otra?.tipo === "proceso" && otra.afiliacion === "sistemica";
  });
}

function esFormaVerbalValida(nombre: string): boolean {
  const palabras = palabrasNormalizadas(nombre);
  if (palabras.length === 0) return false;
  return palabras.some((palabra, index) => index === 0 || index === palabras.length - 1
    ? /(?:ar|er|ir|izar|ion|aje|miento|ing)$/.test(palabra)
    : false);
}

function esNombreObjetoSingular(nombre: string): boolean {
  const palabras = palabrasNormalizadas(nombre);
  const ultimaOriginal = nombre.trim().split(/\s+/).at(-1) ?? "";
  const ultima = palabras.at(-1) ?? "";
  if (!ultima || INVARIABLES_SINGULAR.has(ultima)) return true;
  if (/^[A-Z0-9]{2,6}$/.test(ultimaOriginal)) return true;
  if (ultima === "datos") return false;
  if (/(?:es|s)$/.test(ultima) && !/(?:is|us)$/.test(ultima)) return false;
  return true;
}

function palabrasNormalizadas(nombre: string): string[] {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function cantidadCosasEnOpdHijo(modelo: Modelo, entidad: Entidad, tipo: TipoRefinamiento = "descomposicion"): number {
  const opdId = obtenerRefinamiento(entidad, tipo)?.opdId;
  const opd = opdId ? modelo.opds[opdId] : undefined;
  if (!opd) return 0;
  const ids = new Set<Id>();
  for (const apariencia of Object.values(opd.apariencias)) {
    if (apariencia.entidadId !== entidad.id && modelo.entidades[apariencia.entidadId]) {
      ids.add(apariencia.entidadId);
    }
  }
  return ids.size;
}

function cantidadSubprocesosEnDescomposicion(modelo: Modelo, entidad: Entidad): number {
  const opdId = obtenerRefinamiento(entidad, "descomposicion")?.opdId;
  const opd = opdId ? modelo.opds[opdId] : undefined;
  if (!opd) return 0;
  const ids = new Set<Id>();
  for (const apariencia of Object.values(opd.apariencias)) {
    if (apariencia.entidadId === entidad.id) continue;
    if (apariencia.contextoRefinamiento?.rol === "externo") continue;
    const hijo = modelo.entidades[apariencia.entidadId];
    if (hijo?.tipo === "proceso") ids.add(hijo.id);
  }
  return ids.size;
}

function cantidadRefinadoresEstructurales(modelo: Modelo, entidad: Entidad): number {
  const opdId = obtenerRefinamiento(entidad, "despliegue")?.opdId;
  const opd = opdId ? modelo.opds[opdId] : undefined;
  if (!opd) return 0;
  const ids = new Set<Id>();
  for (const apariencia of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[apariencia.enlaceId];
    if (!enlace || naturalezaDeEnlace(enlace.tipo) !== "estructural") continue;
    if (!extremoApuntaAEntidad(enlace.origenId, entidad.id)) continue;
    const destinoId = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (destinoId && destinoId !== entidad.id) ids.add(destinoId);
  }
  return ids.size;
}

function procesoTransforma(modelo: Modelo, proceso: Entidad): boolean {
  return Object.values(modelo.enlaces).some((enlace) => (
    TRANSFORMADORES.has(enlace.tipo) &&
    (extremoApuntaAEntidad(enlace.origenId, proceso.id) || extremoApuntaAEntidad(enlace.destinoId, proceso.id)) &&
    (entidadDeExtremo(modelo, enlace.origenId)?.tipo === "objeto" || entidadDeExtremo(modelo, enlace.destinoId)?.tipo === "objeto")
  ));
}

function tieneHijoTransformador(modelo: Modelo, proceso: Entidad): boolean {
  const hijoIds = hijosDeRefinamiento(modelo, proceso.id).filter((entidad) => entidad.tipo === "proceso");
  return hijoIds.some((hijo) => procesoTransforma(modelo, hijo));
}

function procesoPrincipalSistemico(modelo: Modelo): Entidad | null {
  const sd = modelo.opds[modelo.opdRaizId];
  if (!sd) return null;
  const candidatos = Object.values(sd.apariencias)
    .map((apariencia) => modelo.entidades[apariencia.entidadId])
    .filter((entidad): entidad is Entidad => entidad?.tipo === "proceso" && entidad.afiliacion === "sistemica");
  if (candidatos.length <= 1) return candidatos[0] ?? null;
  const transformadores = candidatos.filter((proceso) => procesoTransforma(modelo, proceso));
  const base = transformadores.length > 0 ? transformadores : candidatos;
  return [...base].sort((a, b) => a.id.localeCompare(b.id))[0] ?? null;
}

function procesosConectadosAlPrincipal(modelo: Modelo, principal: Entidad): Set<Id> {
  const conectados = new Set<Id>();
  const visitados = new Set<Id>();
  const cola: Id[] = [principal.id];
  while (cola.length > 0) {
    const id = cola.shift();
    if (!id || visitados.has(id)) continue;
    visitados.add(id);
    const entidad = modelo.entidades[id];
    if (entidad?.tipo === "proceso" && entidad.afiliacion === "sistemica") conectados.add(id);
    for (const vecino of vecinosMetodologicos(modelo, id)) {
      if (!visitados.has(vecino)) cola.push(vecino);
    }
  }
  return conectados;
}

function vecinosMetodologicos(modelo: Modelo, entidadId: Id): Id[] {
  const vecinos = new Set<Id>();
  for (const enlace of Object.values(modelo.enlaces)) {
    if (naturalezaDeEnlace(enlace.tipo) !== "estructural") continue;
    const origenId = entidadIdDeExtremo(modelo, enlace.origenId);
    const destinoId = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (origenId === entidadId && destinoId) vecinos.add(destinoId);
    if (destinoId === entidadId && origenId) vecinos.add(origenId);
  }
  for (const hijo of hijosDeRefinamiento(modelo, entidadId)) vecinos.add(hijo.id);
  const padreId = padreRefinamientoDe(modelo, entidadId);
  if (padreId) vecinos.add(padreId);
  return [...vecinos];
}

function hijosDeRefinamiento(modelo: Modelo, entidadId: Id): Entidad[] {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return [];
  const ids = new Set<Id>();
  for (const ref of refinamientosDe(entidad)) {
    const opd = modelo.opds[ref.opdId];
    if (!opd) continue;
    for (const apariencia of Object.values(opd.apariencias)) ids.add(apariencia.entidadId);
  }
  ids.delete(entidadId);
  return [...ids].map((id) => modelo.entidades[id]).filter((item): item is Entidad => Boolean(item));
}

function padreRefinamientoDe(modelo: Modelo, entidadId: Id): Id | null {
  for (const entidad of Object.values(modelo.entidades)) {
    if (tieneRefinamiento(entidad) && hijosDeRefinamiento(modelo, entidad.id).some((hijo) => hijo.id === entidadId)) {
      return entidad.id;
    }
  }
  return null;
}
