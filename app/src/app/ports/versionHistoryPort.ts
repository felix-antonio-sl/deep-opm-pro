import type { Id } from "../../modelo/tipos";
import type { ResumenModeloPersistido } from "../../persistencia/local";

export interface VersionHistoryPort {
  abierto: { modeloId: Id } | null;
  cerrar: () => void;
  modelos: ResumenModeloPersistido[];
  modeloPersistidoId: Id | null;
  crearVersionAhora: (opts?: { nombre?: string; descripcion?: string }) => Promise<void>;
  restaurar: (modeloId: Id, versionId: Id) => Promise<void>;
  eliminar: (modeloId: Id, versionId: Id) => void;
  mostrarVersiones: boolean;
  toggleMostrarVersiones: () => void;
}
