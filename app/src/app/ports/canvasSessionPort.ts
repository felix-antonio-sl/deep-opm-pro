import type { GridConfig } from "../../canvas/grid";
import type { OpmStore } from "../../store";

export interface CanvasSessionPort {
  modoEnlace: OpmStore["modoEnlace"];
  modoCreacion: OpmStore["modoCreacion"];
  modelo: OpmStore["modelo"];
  opdActivoId: OpmStore["opdActivoId"];
  hoverOplRef: OpmStore["hoverOplRef"];
  uiAliasVisibles: OpmStore["uiAliasVisibles"];
  uiDescripcionesVisibles: OpmStore["uiDescripcionesVisibles"];
  uiModoImagenGlobal: OpmStore["uiModoImagenGlobal"];
  contextoSimulacion: OpmStore["contextoSimulacion"];
  alternarModoImagenEntidad: OpmStore["alternarModoImagenEntidad"];
  abrirModalImagen: OpmStore["abrirModalImagen"];
  fijarHoverOpl: OpmStore["fijarHoverOpl"];
  gridConfig: GridConfig;
  solicitudFitToken: OpmStore["solicitudFitToken"];
}
