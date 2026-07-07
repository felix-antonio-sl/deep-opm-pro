import type { Id, OrigenPestana } from "../../modelo/tipos";

export interface GuardarComoLocalInput {
  nombre: string;
  descripcion?: string;
  crearVersionAlGuardar?: boolean;
}

export interface AbrirCargarModeloOptions {
  mostrarArchivados?: boolean;
}

export interface PersistencePort {
  modeloPersistidoId: Id | null;
  dirty: boolean;
  dirtyModelo: boolean;
  dialogoGuardarComoAbierto: boolean;
  dialogoCargarModeloAbierto: boolean;
  cargadoDesde: OrigenPestana;
  versiones: number;
  ultimoAutosalvado: number | null;
  autosalvadoEnCurso: boolean;
  modeloNombre: string;
  abrirGuardarComo: () => void;
  abrirCargarModelo: (opciones?: AbrirCargarModeloOptions) => void;
  abrirDialogoImportarExportarJson: () => void;
  cerrarGuardarComo: () => void;
  cerrarCargarModelo: () => void;
  guardarLocal: () => void;
  guardarComoLocalConDescripcion: (input: GuardarComoLocalInput) => void;
  listarModelosGuardados: () => void;
  cargarLocal: (id?: Id) => void;
  borrarLocal: (id: Id) => void;
  exportarJson: () => string;
  importarJson: (json: string) => void;
  hayDirty: () => boolean;
  hayDirtyModelo: () => boolean;
  // ── A′-vitrina ──
  revisionRemota: { modeloId: Id; revision: number } | null;
  /** Base de revisión del modelo activo (resuelta desde `revisionBasePorModelo`). */
  revisionBase: number | null;
  iniciarPollRevision: () => void;
  detenerPollRevision: () => void;
  traerRevisionDelAgente: () => void;
  verVersionDelAgente: () => void;
}
