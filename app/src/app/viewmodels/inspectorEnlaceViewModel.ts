import { useOpmStore } from "../../store";

export function useInspectorEnlaceViewModel() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const tabActivo = useOpmStore((s) => s.tabInspectorEnlaceActivo);
  const cambiarTab = useOpmStore((s) => s.cambiarTabInspectorEnlace);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const ajustarMultiplicidad = useOpmStore((s) => s.ajustarMultiplicidadSeleccionada);
  const apuntarExtremo = useOpmStore((s) => s.apuntarExtremoEnlaceSeleccionado);
  const reanclarEnlaceExternoDerivado = useOpmStore((s) => s.reanclarEnlaceExternoDerivado);
  const volverEnlaceExternoDerivadoAAutomatico = useOpmStore((s) => s.volverEnlaceExternoDerivadoAAutomatico);
  const splitEffect = useOpmStore((s) => s.splitEffectSeleccionado);
  const alternarOperadorAbanico = useOpmStore((s) => s.alternarOperadorAbanicoSeleccionado);
  const quitarRamaDeAbanico = useOpmStore((s) => s.quitarRamaDeAbanicoSeleccionado);
  const disolverAbanico = useOpmStore((s) => s.disolverAbanicoSeleccionado);
  const aplicarModificador = useOpmStore((s) => s.aplicarModificadorEnlaceSeleccionado);
  const aplicarSubtipoModificador = useOpmStore((s) => s.aplicarSubtipoModificadorEnlaceSeleccionado);
  const quitarModificador = useOpmStore((s) => s.quitarModificadorEnlaceSeleccionado);
  const definirProbabilidadEvento = useOpmStore((s) => s.definirProbabilidadEventoSeleccionada);
  const definirDemoraInvocacion = useOpmStore((s) => s.definirDemoraInvocacionSeleccionada);
  const definirBackwardTag = useOpmStore((s) => s.definirBackwardTagSeleccionado);
  const definirRequisitosEnlace = useOpmStore((s) => s.definirRequisitosEnlaceSeleccionado);
  const definirTasaEnlace = useOpmStore((s) => s.definirTasaEnlaceSeleccionada);
  const definirTiempoExcepcionEnlace = useOpmStore((s) => s.definirTiempoExcepcionEnlaceSeleccionado);
  const moverPuerto = useOpmStore((s) => s.moverPuertoEnlaceSeleccionado);
  const renombrarEtiquetaEnlace = useOpmStore((s) => s.renombrarEtiquetaEnlaceSeleccionado);
  const definirRutaEtiqueta = useOpmStore((s) => s.definirRutaEtiquetaSeleccionada);
  const cambiarTipoGrupoEstructural = useOpmStore((s) => s.cambiarTipoGrupoEstructuralSeleccionado);
  const fijarOrdenGrupoEstructural = useOpmStore((s) => s.fijarOrdenGrupoEstructuralSeleccionado);
  const actualizarAnclajesSimboloEstructural = useOpmStore((s) => s.actualizarAnclajesSimboloEstructural);
  const resetearAnclajesSimboloEstructural = useOpmStore((s) => s.resetearAnclajesSimboloEstructural);
  const separarGrupoEstructural = useOpmStore((s) => s.separarGrupoEstructuralSeleccionado);
  const volverGrupoEstructuralAutomatico = useOpmStore((s) => s.volverGrupoEstructuralAutomaticoSeleccionado);
  const traerRelacionesEstructuralesFaltantes = useOpmStore((s) => s.traerRelacionesEstructuralesFaltantesSeleccionadas);
  const plegarGrupoEstructural = useOpmStore((s) => s.plegarGrupoEstructuralSeleccionado);
  const plegarCompletoGrupoEstructural = useOpmStore((s) => s.plegarCompletoGrupoEstructuralSeleccionado);
  const eliminar = useOpmStore((s) => s.eliminarSeleccion);
  const aplicarEstiloEnlaceAccion = useOpmStore((s) => s.aplicarEstiloEnlaceAccion);
  const resetEstiloEnlaceAccion = useOpmStore((s) => s.resetEstiloEnlaceAccion);
  const copiarEstiloAlPortapapeles = useOpmStore((s) => s.copiarEstiloEnlaceAlPortapapeles);
  const pegarEstiloDesdePortapapeles = useOpmStore((s) => s.pegarEstiloEnlaceDesdePortapapeles);
  const enlaceEstiloPortapapeles = useOpmStore((s) => s.enlaceEstiloPortapapeles);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const aplicarEstiloASeleccion = useOpmStore((s) => s.aplicarEstiloASeleccion);
  const abrirInspectorEnlaceDesdeOpl = useOpmStore((s) => s.abrirInspectorEnlaceDesdeOpl);

  return {
    modelo,
    opdActivoId,
    tabActivo,
    cambiarTab,
    cambiarOpdActivo,
    ajustarMultiplicidad,
    apuntarExtremo,
    reanclarEnlaceExternoDerivado,
    volverEnlaceExternoDerivadoAAutomatico,
    splitEffect,
    alternarOperadorAbanico,
    quitarRamaDeAbanico,
    disolverAbanico,
    aplicarModificador,
    aplicarSubtipoModificador,
    quitarModificador,
    definirProbabilidadEvento,
    definirDemoraInvocacion,
    definirBackwardTag,
    definirRequisitosEnlace,
    definirTasaEnlace,
    definirTiempoExcepcionEnlace,
    moverPuerto,
    renombrarEtiquetaEnlace,
    definirRutaEtiqueta,
    cambiarTipoGrupoEstructural,
    fijarOrdenGrupoEstructural,
    actualizarAnclajesSimboloEstructural,
    resetearAnclajesSimboloEstructural,
    separarGrupoEstructural,
    volverGrupoEstructuralAutomatico,
    traerRelacionesEstructuralesFaltantes,
    plegarGrupoEstructural,
    plegarCompletoGrupoEstructural,
    eliminar,
    aplicarEstiloEnlaceAccion,
    resetEstiloEnlaceAccion,
    copiarEstiloAlPortapapeles,
    pegarEstiloDesdePortapapeles,
    enlaceEstiloPortapapeles,
    seleccionados,
    aplicarEstiloASeleccion,
    abrirInspectorEnlaceDesdeOpl,
  };
}

export type InspectorEnlaceViewModel = ReturnType<typeof useInspectorEnlaceViewModel>;
