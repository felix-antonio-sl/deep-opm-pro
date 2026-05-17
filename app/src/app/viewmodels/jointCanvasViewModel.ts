import { normalizarGridConfig } from "../../canvas/grid";
import { useOpmStore } from "../../store";
import { useZustandSelectionPort } from "../ports/zustandSelectionPort";

export function useJointCanvasViewModel() {
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
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const moverAparienciaConPuertos = useOpmStore((s) => s.moverAparienciaConPuertos);
  const actualizarPosicionSimboloEstructural = useOpmStore((s) => s.actualizarPosicionSimboloEstructural);
  const actualizarAnclajesSimboloEstructural = useOpmStore((s) => s.actualizarAnclajesSimboloEstructural);
  const cambiarModoPlegadoApariencia = useOpmStore((s) => s.cambiarModoPlegadoApariencia);
  const alternarModoImagenEntidad = useOpmStore((s) => s.alternarModoImagenEntidad);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);
  const extraerParteDePlegado = useOpmStore((s) => s.extraerParteDePlegado);
  const actualizarVerticesEnlace = useOpmStore((s) => s.actualizarVerticesEnlace);
  const actualizarPosicionLabelEnlace = useOpmStore((s) => s.actualizarPosicionLabelEnlace);
  const crearEntidadEnCanvas = useOpmStore((s) => s.crearEntidadEnCanvas);
  const crearEnlaceEntreEntidades = useOpmStore((s) => s.crearEnlaceEntreEntidades);
  const elegirTipoEnlace = useOpmStore((s) => s.elegirTipoEnlace);
  const iniciarConexionDesdeApariencia = useOpmStore((s) => s.iniciarConexionDesdeApariencia);
  const cancelarEnlace = useOpmStore((s) => s.cancelarEnlace);
  const fijarHoverOpl = useOpmStore((s) => s.fijarHoverOpl);
  const redimensionarAparienciaEnCanvas = useOpmStore((s) => s.redimensionarAparienciaEnCanvas);
  const renombrarEntidadDesdeOpl = useOpmStore((s) => s.renombrarEntidadDesdeOpl);
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
    renombrarEntidadDesdeOpl,
    gridConfig,
    solicitudFitToken,
  };
}

export type JointCanvasViewModel = ReturnType<typeof useJointCanvasViewModel>;
