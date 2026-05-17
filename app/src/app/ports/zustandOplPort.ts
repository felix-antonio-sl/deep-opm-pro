import { useOpmStore } from "../../store";
import type { OplPort } from "./oplPort";

export function useZustandOplPort(): OplPort {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const filtroActivo = useOpmStore((s) => s.filtroOplPorSeleccion);
  const hoverOplRef = useOpmStore((s) => s.hoverOplRef);
  const busquedaOpl = useOpmStore((s) => s.busquedaOpl);
  const preferenciasOpl = useOpmStore((s) => s.indice.preferenciasUi);
  const seleccionarDesdeOpl = useOpmStore((s) => s.seleccionarDesdeOpl);
  const renombrarEntidadDesdeOpl = useOpmStore((s) => s.renombrarEntidadDesdeOpl);
  const renombrarEstadoDesdeOpl = useOpmStore((s) => s.renombrarEstadoDesdeOpl);
  const abrirInspectorEnlaceDesdeOpl = useOpmStore((s) => s.abrirInspectorEnlaceDesdeOpl);
  const aplicarEdicionOplLibre = useOpmStore((s) => s.aplicarEdicionOplLibre);
  const fijarFiltroOplPorSeleccion = useOpmStore((s) => s.fijarFiltroOplPorSeleccion);
  const fijarHoverOpl = useOpmStore((s) => s.fijarHoverOpl);
  const buscarEnPanelOpl = useOpmStore((s) => s.buscarEnPanelOpl);
  const alternarNumeracionOpl = useOpmStore((s) => s.alternarNumeracionOpl);
  const minimizarOpl = useOpmStore((s) => s.minimizarOpl);
  const restaurarOpl = useOpmStore((s) => s.restaurarOpl);
  const alternarBloqueOplContraido = useOpmStore((s) => s.alternarBloqueOplContraido);
  const mostrarPlaceholderAiOpl = useOpmStore((s) => s.mostrarPlaceholderAiOpl);
  const copiarOplActualAlPortapapeles = useOpmStore((s) => s.copiarOplActualAlPortapapeles);
  const exportarOplActualHtml = useOpmStore((s) => s.exportarOplActualHtml);

  return {
    modelo,
    opdActivoId,
    vistaMapaActiva,
    seleccionId,
    enlaceSeleccionId,
    filtroActivo,
    hoverOplRef,
    busquedaOpl,
    preferenciasOpl,
    seleccionarDesdeOpl,
    renombrarEntidadDesdeOpl,
    renombrarEstadoDesdeOpl,
    abrirInspectorEnlaceDesdeOpl,
    aplicarEdicionOplLibre,
    fijarFiltroOplPorSeleccion,
    fijarHoverOpl,
    buscarEnPanelOpl,
    alternarNumeracionOpl,
    minimizarOpl,
    restaurarOpl,
    alternarBloqueOplContraido,
    mostrarPlaceholderAiOpl,
    copiarOplActualAlPortapapeles,
    exportarOplActualHtml,
  };
}
