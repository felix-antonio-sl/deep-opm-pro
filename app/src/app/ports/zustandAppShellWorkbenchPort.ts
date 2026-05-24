import { useOpmStore } from "../../store";
import { APP_FEATURES } from "../features";
import type { AppShellWorkbenchPort } from "./appShellWorkbenchPort";

export function useZustandAppShellWorkbenchPort(): AppShellWorkbenchPort {
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const anchoPanelArbol = useOpmStore((s) => s.anchoPanelArbol);
  const anchoPanelInspector = useOpmStore((s) => s.anchoPanelInspector);
  const preferenciasOpl = useOpmStore((s) => s.indice.preferenciasUi);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const fijarAnchoPanelArbol = useOpmStore((s) => s.fijarAnchoPanelArbol);
  const fijarAnchoPanelInspector = useOpmStore((s) => s.fijarAnchoPanelInspector);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const pantallaInicioCerrada = useOpmStore((s) => s.pantallaInicioCerrada);
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
    preferenciasOpl,
    modelo,
    opdActivoId,
    fijarAnchoPanelArbol,
    fijarAnchoPanelInspector,
    modeloPersistidoId,
    pantallaInicioCerrada,
    seleccionIdOpl,
    enlaceSeleccionIdOpl,
    vistaMobileActiva,
    cambiarOpdActivo,
    modoSimulacionActivo,
    modoEnlaceActivo,
    modoCreacionActivo,
  };
}
