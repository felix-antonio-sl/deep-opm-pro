import type { OrigenPestana } from "../../modelo/tipos";
import type { OpmStore } from "../../store";

export interface PersistencePort {
  modeloPersistidoId: OpmStore["modeloPersistidoId"];
  dirty: OpmStore["dirty"];
  dirtyModelo: OpmStore["dirtyModelo"];
  cargadoDesde: OrigenPestana;
  esFixture: boolean;
  versiones: number;
  ultimoAutosalvado: number | null;
  modeloNombre: OpmStore["modelo"]["nombre"];
  abrirGuardarComo: OpmStore["abrirGuardarComo"];
  guardarLocal: OpmStore["guardarLocal"];
  hayDirty: () => boolean;
  hayDirtyModelo: () => boolean;
}
