/**
 * ViewContainer ToolbarMapaSistema: acciones de la vista de mapa. [JOYAS §1-3], [V-0c], T2.6.
 */
import { useOpmStore } from "../../store";
import { toolbarStyle as style } from "./toolbarStyles";

export function ToolbarMapaSistema() {
  const refrescarVistaMapa = useOpmStore((s) => s.refrescarVistaMapa);
  const mapaAutoRefresh = useOpmStore((s) => s.mapaAutoRefresh);
  const toggleMapaAutoRefresh = useOpmStore((s) => s.toggleMapaAutoRefresh);
  const toggleMapaPanelEstadisticas = useOpmStore((s) => s.toggleMapaPanelEstadisticas);

  return (
    <>
      <button style={style.button} type="button" onClick={refrescarVistaMapa} data-testid="refrescar-mapa" title="Refrescar miniaturas y conexiones del mapa">Refrescar mapa</button>
      <button style={mapaAutoRefresh ? style.activeButton : style.button} type="button" onClick={toggleMapaAutoRefresh} aria-pressed={mapaAutoRefresh} title={mapaAutoRefresh ? "Auto-refresh del mapa activo" : "Activar auto-refresh del mapa"}>Auto-refresh</button>
      <button style={style.button} type="button" onClick={toggleMapaPanelEstadisticas} title="Mostrar/ocultar panel de estadísticas del mapa">Estadísticas</button>
    </>
  );
}
