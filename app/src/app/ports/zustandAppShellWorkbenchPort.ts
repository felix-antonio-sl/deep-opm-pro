import { useOpmStore } from "../../store";
import { APP_FEATURES } from "../features";
import type { AppShellWorkbenchPort } from "./appShellWorkbenchPort";

export function useZustandAppShellWorkbenchPort(): AppShellWorkbenchPort {
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const anchoPanelArbol = useOpmStore((s) => s.anchoPanelArbol);
  const anchoPanelInspector = useOpmStore((s) => s.anchoPanelInspector);
  const anchoPanelOpleft = useOpmStore((s) => s.anchoPanelOpleft);
  const panelOpleftAbierto = useOpmStore((s) => s.panelOpleftAbierto);
  const panelInspectorAbierto = useOpmStore((s) => s.panelInspectorAbierto);
  const uiSoloCanvas = useOpmStore((s) => s.uiSoloCanvas);
  const preferenciasOpl = useOpmStore((s) => s.indice.preferenciasUi);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const fijarAnchoPanelArbol = useOpmStore((s) => s.fijarAnchoPanelArbol);
  const fijarAnchoPanelInspector = useOpmStore((s) => s.fijarAnchoPanelInspector);
  const fijarAnchoPanelOpleft = useOpmStore((s) => s.fijarAnchoPanelOpleft);
  const togglePanelOpleft = useOpmStore((s) => s.togglePanelOpleft);
  const togglePanelInspector = useOpmStore((s) => s.togglePanelInspector);
  const toggleSoloCanvas = useOpmStore((s) => s.toggleSoloCanvas);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const seleccionIdOpl = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionIdOpl = useOpmStore((s) => s.enlaceSeleccionId);
  const vistaMobileActiva = useOpmStore((s) => s.vistaMobileActiva);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const modoSimulacionActivo = useOpmStore((s) => s.contextoSimulacion !== null);
  const modoEnlaceActivo = useOpmStore((s) => s.modoEnlace !== null);
  const modoCreacionActivo = useOpmStore((s) => s.modoCreacion !== null);

  return {
    vistaMapaActiva: APP_FEATURES.mapaSistema ? vistaMapaActiva : false,
    anchoPanelArbol,
    anchoPanelInspector,
    anchoPanelOpleft,
    panelOpleftAbierto,
    panelInspectorAbierto,
    uiSoloCanvas,
    preferenciasOpl,
    modelo,
    opdActivoId,
    fijarAnchoPanelArbol,
    fijarAnchoPanelInspector,
    fijarAnchoPanelOpleft,
    togglePanelOpleft,
    togglePanelInspector,
    toggleSoloCanvas,
    modeloPersistidoId,
    seleccionIdOpl,
    enlaceSeleccionIdOpl,
    vistaMobileActiva,
    cambiarOpdActivo,
    modoSimulacionActivo,
    modoEnlaceActivo,
    modoCreacionActivo,
  };
}
