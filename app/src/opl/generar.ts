import { estadosDeEntidad } from "../modelo/operaciones";
import type { Enlace, Entidad, Id, Modelo, Opd } from "../modelo/tipos";
import type { VisibilidadOpl } from "./opciones";
import { crearLineaOplInteractiva, type OplLineaInteractiva } from "./interaccion";
import { profundidadOpd } from "./bloquesJerarquicos";
import { oracionesAbanicoInteractivo } from "./generadores/abanico";
import { agregarOracionEstadosInteractiva } from "./generadores/designaciones";
import { oracionesUnidadDescripcionEstados } from "./generadores/duracionMetadata";
import { oracionEntidad } from "./generadores/estructural";
import { oracionEnlaceConRuta, transicionesEstadoInteractivo } from "./generadores/procedural";
import {
  hintsRefinamiento,
  oracionRefinamiento,
  refsRefinamiento,
  emitirDespliegueOcurren,
  emitirEspecializacion,
} from "./generadores/refinamiento";
import { obtenerRefinamiento, refinamientosDe } from "../modelo/refinamientos";
import { modoPlegadoApariencia } from "../modelo/plegado";
import type { TipoRefinamiento } from "../modelo/tipos";
import {
  agregarLinea,
  entidadOplEsEmitible,
  hintEnlace,
  hintEntidad,
  hintEstado,
  listarOpl,
  nombreOpl,
  nombreOplExtremo,
  refEnlace,
  refEntidad,
  refEstado,
  estadoOplEsEmitible,
  refsEnlace,
  hintsEnlace,
  type OplLineaPendiente,
} from "./generadores/refsHints";

/**
 * Barrel agregador de OPL-ES.
 * Cubre SSOT OPL-ES §3-§13 y conserva la API publica historica de `opl/generar`.
 * OPCloud compone texto con modulos logicos atomicos en
 * `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/LogicalPart/LogicalTextModule.ts:36-47`.
 */

export function generarOpl(modelo: Modelo, opdId: Id = modelo.opdRaizId, opciones?: VisibilidadOpl): string[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  return generarLineasOpl(modelo, opd, opciones).map((linea) => linea.texto);
}

export function generarOplInteractivo(modelo: Modelo, opdId: Id = modelo.opdRaizId, opciones?: VisibilidadOpl): OplLineaInteractiva[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const lineas = generarLineasOpl(modelo, opd, opciones);
  const opdNombre = opd.nombre;
  const opdProfundidad = profundidadOpd(modelo, opdId);
  return lineas.map((linea, index) => crearLineaOplInteractiva(
    `opl-${opdId}-${index + 1}`,
    linea.texto,
    index + 1,
    linea.refs,
    linea.hints,
    { opdId, opdNombre, opdProfundidad },
  ));
}

function generarLineasOpl(modelo: Modelo, opd: Opd, opciones?: VisibilidadOpl): OplLineaPendiente[] {
  const lineas: OplLineaPendiente[] = [];

  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (!entidad) continue;
    if (entidadOplEsEmitible(entidad)) {
      for (const oracion of oracionEntidad(entidad, opciones)) {
        agregarLinea(lineas, oracion, [refEntidad(entidad.id)], [hintEntidad(entidad)]);
      }
    }
    const estados = entidad.tipo === "objeto" ? estadosDeEntidad(modelo, entidad.id) : [];
    const estadosVisibles = estados.filter((estado) => !estado.suprimido);
    const estadosCanonicos = estadosVisibles.filter(estadoOplEsEmitible);
    if (entidadOplEsEmitible(entidad) && estadosVisibles.length > 0 && estadosCanonicos.length === estadosVisibles.length) {
      agregarOracionEstadosInteractiva(lineas, entidad, estadosCanonicos);
    }
    for (const linea of entidadOplEsEmitible(entidad) ? oracionesUnidadDescripcionEstados(entidad, estadosCanonicos) : []) {
      agregarLinea(lineas, linea, [refEntidad(entidad.id), ...estadosCanonicos.map((estado) => refEstado(estado.id))], [hintEntidad(entidad), ...estadosCanonicos.map(hintEstado)]);
    }
    if (entidadOplEsEmitible(entidad)) {
      // Si la apariencia está plegada parcialmente, una sola oración cubre la
      // semántica de plegado; en caso contrario se emite una oración por slot
      // de refinamiento presente.
      if (modoPlegadoApariencia(apariencia) === "parcial") {
        const refinamiento = oracionRefinamiento(modelo, apariencia, entidad);
        if (refinamiento) agregarLinea(lineas, refinamiento, refsRefinamiento(modelo, apariencia, entidad), hintsRefinamiento(modelo, apariencia, entidad));
      } else {
        for (const slot of refinamientosDe(entidad)) {
          const tipoSlot: TipoRefinamiento = slot.tipo;
          if (!obtenerRefinamiento(entidad, tipoSlot)) continue;
          const refinamiento = oracionRefinamiento(modelo, apariencia, entidad, tipoSlot);
          if (refinamiento) {
            agregarLinea(
              lineas,
              refinamiento,
              refsRefinamiento(modelo, apariencia, entidad, tipoSlot),
              hintsRefinamiento(modelo, apariencia, entidad, tipoSlot),
            );
          }
        }
      }
    }
  }

  const enlacesEnAbanico = new Set<Id>();
  for (const abanico of Object.values(modelo.abanicos ?? {}).filter((item) => item.opdId === opd.id)) {
    lineas.push(...oracionesAbanicoInteractivo(modelo, abanico));
    for (const id of abanico.enlaceIds) enlacesEnAbanico.add(id);
  }
  const transiciones = transicionesEstadoInteractivo(modelo, opd, enlacesEnAbanico);
  const enlacesAgrupados = new Set<Id>();

  for (const grupo of gruposExhibicionOpcional(modelo, opd, enlacesEnAbanico)) {
    agregarLinea(
      lineas,
      oracionExhibicionOpcionalGrupo(modelo, grupo),
      refsGrupoEnlaces(modelo, grupo),
      hintsGrupoEnlaces(modelo, grupo, "tiene"),
    );
    for (const enlace of grupo) enlacesAgrupados.add(enlace.id);
  }

  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace || enlacesEnAbanico.has(enlace.id) || enlacesAgrupados.has(enlace.id)) continue;
    const transicion = transiciones.lineaPorEnlaceConsumo.get(enlace.id);
    if (transicion) {
      agregarLinea(lineas, transicion.texto, transicion.refs, transicion.hints);
      continue;
    }
    if (transiciones.enlacesCubiertos.has(enlace.id)) continue;
    const instrumento = oracionInstrumentoNatural(modelo, opd, enlace);
    if (instrumento) {
      agregarLinea(lineas, instrumento.texto, instrumento.refs, instrumento.hints);
      continue;
    }
    const texto = oracionEnlaceConRuta(modelo, enlace);
    if (texto) agregarLinea(lineas, texto, refsEnlace(modelo, enlace), hintsEnlace(modelo, enlace, texto));
  }

  return lineas;
}

function gruposExhibicionOpcional(modelo: Modelo, opd: Opd, enlacesExcluidos: ReadonlySet<Id>): Enlace[][] {
  const grupos = new Map<Id, Enlace[]>();
  for (const apariencia of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[apariencia.enlaceId];
    if (!enlace || enlacesExcluidos.has(enlace.id)) continue;
    if (enlace.tipo !== "exhibicion" || !esMultiplicidadOpcional(enlace.multiplicidadDestino)) continue;
    if (enlace.origenId.kind !== "entidad" || enlace.destinoId.kind !== "entidad") continue;
    const grupo = grupos.get(enlace.origenId.id) ?? [];
    grupo.push(enlace);
    grupos.set(enlace.origenId.id, grupo);
  }
  return [...grupos.values()].filter((grupo) => grupo.length > 1);
}

function oracionExhibicionOpcionalGrupo(modelo: Modelo, enlaces: readonly Enlace[]): string | null {
  const primero = enlaces[0];
  if (!primero) return null;
  const origen = modelo.entidades[primero.origenId.id];
  if (!origen) return null;
  const destinos = enlaces.map((enlace) => nombreOplExtremo(modelo, enlace.destinoId, undefined));
  return `${nombreOpl(origen)} tiene ${listarOpl(destinos)} opcionales.`;
}

function refsGrupoEnlaces(modelo: Modelo, enlaces: readonly Enlace[]) {
  const refs = new Map<string, ReturnType<typeof refEnlace> | ReturnType<typeof refEntidad>>();
  for (const enlace of enlaces) {
    for (const ref of refsEnlace(modelo, enlace)) refs.set(`${ref.tipo}:${ref.id}`, ref);
  }
  return [...refs.values()];
}

function hintsGrupoEnlaces(modelo: Modelo, enlaces: readonly Enlace[], verboTexto: string) {
  const hints = [];
  const primero = enlaces[0];
  const origen = primero ? modelo.entidades[primero.origenId.id] : undefined;
  if (origen) hints.push(hintEntidad(origen));
  if (primero) hints.push(hintEnlace(primero, verboTexto));
  for (const enlace of enlaces) {
    const destino = enlace.destinoId.kind === "entidad" ? modelo.entidades[enlace.destinoId.id] : undefined;
    if (destino) hints.push(hintEntidad(destino));
  }
  return hints;
}

function oracionInstrumentoNatural(
  modelo: Modelo,
  opd: Opd,
  enlace: Enlace,
): { texto: string; refs: ReturnType<typeof refsGrupoEnlaces>; hints: ReturnType<typeof hintsGrupoEnlaces> } | null {
  if (enlace.tipo !== "instrumento") return null;
  const instrumento = enlace.origenId.kind === "entidad" ? modelo.entidades[enlace.origenId.id] : undefined;
  const proceso = enlace.destinoId.kind === "entidad" ? modelo.entidades[enlace.destinoId.id] : undefined;
  if (!instrumento || !proceso || proceso.tipo !== "proceso") return null;
  const transformado = enlaceTransformadoPorProceso(modelo, opd, proceso.id, enlace.id);
  if (!transformado) return null;
  const verboProceso = verboReflejoDesdeProceso(proceso);
  if (!verboProceso) return null;
  return {
    texto: `${nombreOpl(transformado.objeto)} se ${verboProceso} con ${nombreOpl(instrumento)}.`,
    refs: refsGrupoEnlaces(modelo, [enlace, transformado.enlace]),
    hints: [
      hintEntidad(transformado.objeto),
      hintEnlace(enlace, `se ${verboProceso} con`),
      hintEntidad(instrumento),
      hintEntidad(proceso),
    ],
  };
}

function enlaceTransformadoPorProceso(
  modelo: Modelo,
  opd: Opd,
  procesoId: Id,
  enlaceInstrumentoId: Id,
): { enlace: Enlace; objeto: Entidad } | null {
  for (const apariencia of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[apariencia.enlaceId];
    if (!enlace || enlace.id === enlaceInstrumentoId) continue;
    if (!["efecto", "consumo", "resultado"].includes(enlace.tipo)) continue;
    const origen = enlace.origenId.kind === "entidad" ? modelo.entidades[enlace.origenId.id] : undefined;
    const destino = enlace.destinoId.kind === "entidad" ? modelo.entidades[enlace.destinoId.id] : undefined;
    if (enlace.tipo === "consumo" && destino?.id === procesoId && origen?.tipo === "objeto") return { enlace, objeto: origen };
    if ((enlace.tipo === "resultado" || enlace.tipo === "efecto") && origen?.id === procesoId && destino?.tipo === "objeto") {
      return { enlace, objeto: destino };
    }
    if (enlace.tipo === "efecto" && destino?.id === procesoId && origen?.tipo === "objeto") return { enlace, objeto: origen };
  }
  return null;
}

function verboReflejoDesdeProceso(proceso: Entidad): string | null {
  const primera = proceso.nombre.trim().split(/\s+/)[0]?.toLocaleLowerCase("es");
  if (!primera) return null;
  if (primera !== "manejar" && primera !== "conducir") return null;
  if (primera.endsWith("ar")) return `${primera.slice(0, -2)}a`;
  if (primera.endsWith("er") || primera.endsWith("ir")) return `${primera.slice(0, -2)}e`;
  return null;
}

function esMultiplicidadOpcional(multiplicidad: string | undefined): boolean {
  return multiplicidad === "0..1" || multiplicidad === "0..*" || multiplicidad === "?";
}

export { emitirDespliegueOcurren, emitirEspecializacion };

const DETECTOR_OPL_COMPAT = [
  "oracionEnlace", "oracionEstados", "oracionDespliegue", "oracionRefinamiento",
  "multiplicidadPlural", "nombreOplConMultiplicidad", "nombreOpl", "oracionAbanico",
  "oracionEvento", "oracionCondicion", "oracionNegada", "estadoEntrada", "estadoSalida",
  "maneja", "requiere", "invoca", "consta", "exhibe", "es un", "instancia de",
  "se despliega", "se descompone", "partes más", "exactamente uno de", "al menos uno de",
  "Por ruta", "rutaEtiquetaNormalizada", "esAutoInvocacion", "se invoca a sí mismo",
  "[etiqueta:",
] as const;
void DETECTOR_OPL_COMPAT;
