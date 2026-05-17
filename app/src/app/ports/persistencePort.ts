import type { OrigenPestana } from "../../modelo/tipos";
import type { OpmStore } from "../../store";

export interface PersistencePort {
  modeloPersistidoId: OpmStore["modeloPersistidoId"];
  dirty: OpmStore["dirty"];
  dirtyModelo: OpmStore["dirtyModelo"];
  dialogoGuardarComoAbierto: OpmStore["dialogoGuardarComoAbierto"];
  dialogoCargarModeloAbierto: OpmStore["dialogoCargarModeloAbierto"];
  cargadoDesde: OrigenPestana;
  esFixture: boolean;
  versiones: number;
  ultimoAutosalvado: number | null;
  modeloNombre: OpmStore["modelo"]["nombre"];
  abrirGuardarComo: OpmStore["abrirGuardarComo"];
  cerrarGuardarComo: OpmStore["cerrarGuardarComo"];
  cerrarCargarModelo: OpmStore["cerrarCargarModelo"];
  guardarLocal: OpmStore["guardarLocal"];
  guardarComoLocalConDescripcion: OpmStore["guardarComoLocalConDescripcion"];
  listarModelosGuardados: OpmStore["listarModelosGuardados"];
  cargarLocal: OpmStore["cargarLocal"];
  cargarFixtureDemo: OpmStore["cargarFixtureDemo"];
  hayDirty: () => boolean;
  hayDirtyModelo: () => boolean;
}
