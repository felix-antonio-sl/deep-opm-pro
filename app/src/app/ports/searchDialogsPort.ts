import type { Id, Modelo } from "../../modelo/tipos";
import type { ResultadoBusquedaGlobal } from "../../persistencia/workspace";
import type { BusquedaCosasFiltro, ResultadoBusquedaSalto } from "../../store/tipos";

export interface SearchDialogsPort {
  abrirBusquedaCosas: () => void;
  abrirBusquedaGlobal: () => void;
}

export interface ModelSearchDialogPort {
  abierto: boolean;
  query: string;
  filtro: BusquedaCosasFiltro;
  modelo: Modelo;
  opdActivoId: Id;
  cerrar: () => void;
  fijarQuery: (q: string) => void;
  fijarFiltro: (filtro: BusquedaCosasFiltro) => void;
  saltar: (resultado: ResultadoBusquedaSalto) => void;
  traerAlOpdActivo: (entidadId: Id) => void;
}

export interface WorkspaceSearchDialogPort {
  open: boolean;
  query: string;
  resultados: ResultadoBusquedaGlobal[];
  cerrar: () => void;
  fijarQuery: (q: string) => void;
  ejecutar: () => void;
  abrirResultado: (modeloId: Id) => void;
}
