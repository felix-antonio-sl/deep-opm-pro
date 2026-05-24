import type { ContextoSimulacion } from "../../modelo/simulacion/tipos";
import type { Id, Modelo, PreferenciasUiUsuario } from "../../modelo/tipos";
import type { OplReferencia } from "../../opl/interaccion";

export interface OplPort {
  modelo: Modelo;
  opdActivoId: Id;
  vistaMapaActiva: boolean;
  contextoSimulacion: ContextoSimulacion | null;
  seleccionId: Id | null;
  enlaceSeleccionId: Id | null;
  filtroActivo: boolean;
  hoverOplRef: OplReferencia | null;
  busquedaOpl: string;
  preferenciasOpl: PreferenciasUiUsuario | undefined;
  seleccionarDesdeOpl: (ref: OplReferencia) => void;
  renombrarEntidadDesdeOpl: (entidadId: Id, nombre: string) => void;
  renombrarEstadoDesdeOpl: (estadoId: Id, nombre: string) => void;
  abrirInspectorEnlaceDesdeOpl: (enlaceId: Id) => void;
  aplicarEdicionOplLibre: (texto: string) => void;
  fijarFiltroOplPorSeleccion: (activo: boolean) => void;
  fijarHoverOpl: (ref: OplReferencia | null) => void;
  buscarEnPanelOpl: (texto: string) => void;
  alternarNumeracionOpl: () => void;
  minimizarOpl: () => void;
  restaurarOpl: () => void;
  alternarBloqueOplContraido: (opdId: Id) => void;
  mostrarPlaceholderAiOpl: () => void;
  copiarOplActualAlPortapapeles: () => Promise<void>;
  exportarOplActualHtml: () => Promise<void>;
}
