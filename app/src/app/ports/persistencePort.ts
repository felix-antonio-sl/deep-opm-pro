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
  abrirCargarModelo: OpmStore["abrirCargarModelo"];
  abrirDialogoImportarExportarJson: OpmStore["abrirDialogoImportarExportarJson"];
  cerrarGuardarComo: OpmStore["cerrarGuardarComo"];
  cerrarCargarModelo: OpmStore["cerrarCargarModelo"];
  guardarLocal: OpmStore["guardarLocal"];
  guardarComoLocalConDescripcion: OpmStore["guardarComoLocalConDescripcion"];
  listarModelosGuardados: OpmStore["listarModelosGuardados"];
  cargarLocal: OpmStore["cargarLocal"];
  borrarLocal: OpmStore["borrarLocal"];
  cargarFixtureDemo: OpmStore["cargarFixtureDemo"];
  exportarJson: OpmStore["exportarJson"];
  importarJson: OpmStore["importarJson"];
  hayDirty: () => boolean;
  hayDirtyModelo: () => boolean;
}
