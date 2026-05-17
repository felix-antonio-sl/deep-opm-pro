import type { OrigenPestana } from "../../modelo/tipos";
import type { OpmStore } from "../../store";

export interface PersistencePort {
  modeloPersistidoId: OpmStore["modeloPersistidoId"];
  dirty: OpmStore["dirty"];
  dirtyModelo: OpmStore["dirtyModelo"];
  dialogoGuardarComoAbierto: OpmStore["dialogoGuardarComoAbierto"];
  cargadoDesde: OrigenPestana;
  esFixture: boolean;
  versiones: number;
  ultimoAutosalvado: number | null;
  modeloNombre: OpmStore["modelo"]["nombre"];
  abrirGuardarComo: OpmStore["abrirGuardarComo"];
  cerrarGuardarComo: OpmStore["cerrarGuardarComo"];
  guardarLocal: OpmStore["guardarLocal"];
  guardarComoLocalConDescripcion: OpmStore["guardarComoLocalConDescripcion"];
  hayDirty: () => boolean;
  hayDirtyModelo: () => boolean;
}
