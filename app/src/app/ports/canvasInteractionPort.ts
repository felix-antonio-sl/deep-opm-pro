import type { CanvasSessionPort } from "./canvasSessionPort";
import type { ModelCommandPort } from "./modelCommandPort";
import type { SelectionPort } from "./selectionPort";

export type CanvasInteractionPort =
  Pick<CanvasSessionPort,
    | "modoEnlace"
    | "modoCreacion"
    | "modelo"
    | "opdActivoId"
    | "hoverOplRef"
    | "uiAliasVisibles"
    | "uiDescripcionesVisibles"
    | "uiModoImagenGlobal"
    | "contextoSimulacion"
    | "alternarModoImagenEntidad"
    | "abrirModalImagen"
    | "fijarHoverOpl"
    | "gridConfig"
    | "solicitudFitToken"
  >
  & Pick<SelectionPort,
    | "seleccionId"
    | "seleccionados"
    | "enlaceSeleccionId"
    | "estadoSeleccionId"
    | "idsResaltadosTemporales"
    | "seleccionarEntidad"
    | "seleccionarPartePlegada"
    | "seleccionarEstadoComoExtremo"
    | "seleccionarEnlace"
    | "seleccionarGrupoEstructural"
    | "setSeleccion"
    | "agregarASeleccion"
    | "toggleSeleccion"
    | "vaciarSeleccion"
    | "seleccionarEstado"
    | "agregarEstadoASeleccion"
    | "toggleSeleccionEstado"
  >
  & Pick<ModelCommandPort,
    | "cambiarOpdActivo"
    | "moverAparienciaConPuertos"
    | "actualizarPosicionSimboloEstructural"
    | "actualizarAnclajesSimboloEstructural"
    | "cambiarModoPlegadoApariencia"
    | "extraerParteDePlegado"
    | "actualizarVerticesEnlace"
    | "actualizarPosicionLabelEnlace"
    | "crearEntidadEnCanvas"
    | "crearAparienciaEntidadEnCanvas"
    | "crearEnlaceEntreEntidades"
    | "elegirTipoEnlace"
    | "iniciarConexionDesdeApariencia"
    | "cancelarEnlace"
    | "redimensionarAparienciaEnCanvas"
    | "redimensionarEstadoEnCanvas"
    | "moverEstadoEnCanvas"
    | "reanclarExtremoAccion"
    | "renombrarEntidadDesdeOpl"
  >;

export function componerCanvasInteractionPort(
  session: CanvasSessionPort,
  selection: SelectionPort,
  commands: ModelCommandPort,
): CanvasInteractionPort {
  return {
    modoEnlace: session.modoEnlace,
    modoCreacion: session.modoCreacion,
    modelo: session.modelo,
    opdActivoId: session.opdActivoId,
    hoverOplRef: session.hoverOplRef,
    uiAliasVisibles: session.uiAliasVisibles,
    uiDescripcionesVisibles: session.uiDescripcionesVisibles,
    uiModoImagenGlobal: session.uiModoImagenGlobal,
    contextoSimulacion: session.contextoSimulacion,
    alternarModoImagenEntidad: session.alternarModoImagenEntidad,
    abrirModalImagen: session.abrirModalImagen,
    fijarHoverOpl: session.fijarHoverOpl,
    gridConfig: session.gridConfig,
    solicitudFitToken: session.solicitudFitToken,
    seleccionId: selection.seleccionId,
    seleccionados: selection.seleccionados,
    enlaceSeleccionId: selection.enlaceSeleccionId,
    estadoSeleccionId: selection.estadoSeleccionId,
    idsResaltadosTemporales: selection.idsResaltadosTemporales,
    seleccionarEntidad: selection.seleccionarEntidad,
    seleccionarPartePlegada: selection.seleccionarPartePlegada,
    seleccionarEstadoComoExtremo: selection.seleccionarEstadoComoExtremo,
    seleccionarEnlace: selection.seleccionarEnlace,
    seleccionarGrupoEstructural: selection.seleccionarGrupoEstructural,
    setSeleccion: selection.setSeleccion,
    agregarASeleccion: selection.agregarASeleccion,
    toggleSeleccion: selection.toggleSeleccion,
    vaciarSeleccion: selection.vaciarSeleccion,
    seleccionarEstado: selection.seleccionarEstado,
    agregarEstadoASeleccion: selection.agregarEstadoASeleccion,
    toggleSeleccionEstado: selection.toggleSeleccionEstado,
    cambiarOpdActivo: commands.cambiarOpdActivo,
    moverAparienciaConPuertos: commands.moverAparienciaConPuertos,
    actualizarPosicionSimboloEstructural: commands.actualizarPosicionSimboloEstructural,
    actualizarAnclajesSimboloEstructural: commands.actualizarAnclajesSimboloEstructural,
    cambiarModoPlegadoApariencia: commands.cambiarModoPlegadoApariencia,
    extraerParteDePlegado: commands.extraerParteDePlegado,
    actualizarVerticesEnlace: commands.actualizarVerticesEnlace,
    actualizarPosicionLabelEnlace: commands.actualizarPosicionLabelEnlace,
    crearEntidadEnCanvas: commands.crearEntidadEnCanvas,
    crearAparienciaEntidadEnCanvas: commands.crearAparienciaEntidadEnCanvas,
    crearEnlaceEntreEntidades: commands.crearEnlaceEntreEntidades,
    elegirTipoEnlace: commands.elegirTipoEnlace,
    iniciarConexionDesdeApariencia: commands.iniciarConexionDesdeApariencia,
    cancelarEnlace: commands.cancelarEnlace,
    redimensionarAparienciaEnCanvas: commands.redimensionarAparienciaEnCanvas,
    redimensionarEstadoEnCanvas: commands.redimensionarEstadoEnCanvas,
    moverEstadoEnCanvas: commands.moverEstadoEnCanvas,
    reanclarExtremoAccion: commands.reanclarExtremoAccion,
    renombrarEntidadDesdeOpl: commands.renombrarEntidadDesdeOpl,
  };
}
