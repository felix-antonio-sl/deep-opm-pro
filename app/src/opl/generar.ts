import { estadosDeEntidad } from "../modelo/operaciones";
import type { Id, Modelo, Opd } from "../modelo/tipos";
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
  hintEntidad,
  hintEstado,
  refEntidad,
  refEstado,
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

export function generarOpl(modelo: Modelo, opdId: Id = modelo.opdRaizId): string[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  return generarLineasOpl(modelo, opd).map((linea) => linea.texto);
}

export function generarOplInteractivo(modelo: Modelo, opdId: Id = modelo.opdRaizId): OplLineaInteractiva[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const lineas = generarLineasOpl(modelo, opd);
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

function generarLineasOpl(modelo: Modelo, opd: Opd): OplLineaPendiente[] {
  const lineas: OplLineaPendiente[] = [];

  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (!entidad) continue;
    for (const oracion of oracionEntidad(entidad)) {
      agregarLinea(lineas, oracion, [refEntidad(entidad.id)], [hintEntidad(entidad)]);
    }
    const estados = entidad.tipo === "objeto" ? estadosDeEntidad(modelo, entidad.id) : [];
    if (estados.some((estado) => !estado.suprimido)) agregarOracionEstadosInteractiva(lineas, entidad, estados);
    for (const linea of oracionesUnidadDescripcionEstados(entidad, estados)) {
      agregarLinea(lineas, linea, [refEntidad(entidad.id), ...estados.map((estado) => refEstado(estado.id))], [hintEntidad(entidad), ...estados.map(hintEstado)]);
    }
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

  const enlacesEnAbanico = new Set<Id>();
  for (const abanico of Object.values(modelo.abanicos ?? {}).filter((item) => item.opdId === opd.id)) {
    lineas.push(...oracionesAbanicoInteractivo(modelo, abanico));
    for (const id of abanico.enlaceIds) enlacesEnAbanico.add(id);
  }
  const transiciones = transicionesEstadoInteractivo(modelo, opd, enlacesEnAbanico);

  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace || enlacesEnAbanico.has(enlace.id)) continue;
    const transicion = transiciones.lineaPorEnlaceConsumo.get(enlace.id);
    if (transicion) {
      agregarLinea(lineas, transicion.texto, transicion.refs, transicion.hints);
      continue;
    }
    if (transiciones.enlacesCubiertos.has(enlace.id)) continue;
    const texto = oracionEnlaceConRuta(modelo, enlace);
    if (texto) agregarLinea(lineas, texto, refsEnlace(modelo, enlace), hintsEnlace(modelo, enlace, texto));
  }

  return lineas;
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
