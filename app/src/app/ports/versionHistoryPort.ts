import type { Id } from "../../modelo/tipos";
import type { ResumenModeloPersistido } from "../../persistencia/modelos";
import type { VersionMutationReceipt } from "../../store/tipos";

export interface VersionHistoryPort {
  abierto: { modeloId: Id } | null;
  cerrar: () => void;
  modelos: ResumenModeloPersistido[];
  modeloPersistidoId: Id | null;
  crearVersionAhora: (opts?: { nombre?: string; descripcion?: string }) => Promise<VersionMutationReceipt>;
  restaurar: (modeloId: Id, versionId: Id) => Promise<VersionMutationReceipt>;
  eliminar: (modeloId: Id, versionId: Id) => Promise<VersionMutationReceipt>;
  mostrarVersiones: boolean;
  toggleMostrarVersiones: () => void;
}
