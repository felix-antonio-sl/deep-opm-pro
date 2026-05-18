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
  esFixture: boolean;
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
  cargarFixtureDemo: (nombre: string) => void;
  exportarJson: () => string;
  importarJson: (json: string) => void;
  hayDirty: () => boolean;
  hayDirtyModelo: () => boolean;
}
