import { normalizarGridConfig } from "../../canvas/grid";
import { useOpmStore } from "../../store";
import { useZustandModelCommandPort } from "../ports/zustandModelCommandPort";
import { useZustandSelectionPort } from "../ports/zustandSelectionPort";

export function useJointCanvasViewModel() {
  const {
    cambiarOpdActivo,
    moverAparienciaConPuertos,
    actualizarPosicionSimboloEstructural,
    actualizarAnclajesSimboloEstructural,
    cambiarModoPlegadoApariencia,
    extraerParteDePlegado,
    actualizarVerticesEnlace,
    actualizarPosicionLabelEnlace,
    crearEntidadEnCanvas,
    crearAparienciaEntidadEnCanvas,
    crearEnlaceEntreEntidades,
    elegirTipoEnlace,
    iniciarConexionDesdeApariencia,
    cancelarEnlace,
    redimensionarAparienciaEnCanvas,
    reanclarExtremoAccion,
    renombrarEntidadDesdeOpl,
  } = useZustandModelCommandPort();
  const {
    seleccionId,
    seleccionados,
    enlaceSeleccionId,
    idsResaltadosTemporales,
    seleccionarEntidad,
    seleccionarPartePlegada,
    seleccionarEstadoComoExtremo,
    seleccionarEnlace,
    seleccionarGrupoEstructural,
    setSeleccion,
    agregarASeleccion,
    toggleSeleccion,
    vaciarSeleccion,
  } = useZustandSelectionPort();
  const modoEnlace = useOpmStore((s) => s.modoEnlace);
  const modoCreacion = useOpmStore((s) => s.modoCreacion);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const hoverOplRef = useOpmStore((s) => s.hoverOplRef);
  const uiAliasVisibles = useOpmStore((s) => s.uiAliasVisibles);
  const uiDescripcionesVisibles = useOpmStore((s) => s.uiDescripcionesVisibles);
  const uiModoImagenGlobal = useOpmStore((s) => s.uiModoImagenGlobal);
  const contextoSimulacion = useOpmStore((s) => s.contextoSimulacion);
  const alternarModoImagenEntidad = useOpmStore((s) => s.alternarModoImagenEntidad);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);
  const fijarHoverOpl = useOpmStore((s) => s.fijarHoverOpl);
  const gridConfig = useOpmStore((s) => normalizarGridConfig(s.gridConfig ?? s.indice.preferenciasUi?.gridConfig));
  const solicitudFitToken = useOpmStore((s) => s.solicitudFitToken);

  return {
    modoEnlace,
    modoCreacion,
    modelo,
    opdActivoId,
    seleccionId,
    seleccionados,
    idsResaltadosTemporales,
    enlaceSeleccionId,
    hoverOplRef,
    uiAliasVisibles,
    uiDescripcionesVisibles,
    uiModoImagenGlobal,
    contextoSimulacion,
    seleccionarEntidad,
    seleccionarPartePlegada,
    seleccionarEstadoComoExtremo,
    seleccionarEnlace,
    seleccionarGrupoEstructural,
    cambiarOpdActivo,
    moverAparienciaConPuertos,
    actualizarPosicionSimboloEstructural,
    actualizarAnclajesSimboloEstructural,
    cambiarModoPlegadoApariencia,
    alternarModoImagenEntidad,
    abrirModalImagen,
    extraerParteDePlegado,
    actualizarVerticesEnlace,
    actualizarPosicionLabelEnlace,
    crearEntidadEnCanvas,
    crearAparienciaEntidadEnCanvas,
    crearEnlaceEntreEntidades,
    elegirTipoEnlace,
    iniciarConexionDesdeApariencia,
    cancelarEnlace,
    fijarHoverOpl,
    setSeleccion,
    agregarASeleccion,
    toggleSeleccion,
    vaciarSeleccion,
    redimensionarAparienciaEnCanvas,
    reanclarExtremoAccion,
    renombrarEntidadDesdeOpl,
    gridConfig,
    solicitudFitToken,
  };
}

export type JointCanvasViewModel = ReturnType<typeof useJointCanvasViewModel>;
