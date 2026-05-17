import type { GridConfig } from "../../canvas/grid";
import type { OpmStore } from "../../store";

export interface CommandPaletteContextPort {
  modelo: OpmStore["modelo"];
  opdActivoId: OpmStore["opdActivoId"];
  seleccionId: OpmStore["seleccionId"];
  enlaceEstiloPortapapeles: OpmStore["enlaceEstiloPortapapeles"];
  seleccionados: OpmStore["seleccionados"];
}

export interface CommandPaletteWorkspacePort {
  nuevoModelo: OpmStore["nuevoModelo"];
  abrirCargarModelo: OpmStore["abrirCargarModelo"];
  abrirGuardarComo: OpmStore["abrirGuardarComo"];
  abrirDialogoConfiguracion: OpmStore["abrirDialogoConfiguracion"];
  abrirDialogoGuardarPlantilla: OpmStore["abrirDialogoGuardarPlantilla"];
  abrirDialogoPlantillas: OpmStore["abrirDialogoPlantillas"];
  abrirDialogoVersiones: OpmStore["abrirDialogoVersiones"];
  modeloPersistidoId: OpmStore["modeloPersistidoId"];
  abrirDialogoImportarExportarJson: OpmStore["abrirDialogoImportarExportarJson"];
  exportarJson: OpmStore["exportarJson"];
}

export interface CommandPaletteViewPort {
  abrirVistaMapa: OpmStore["abrirVistaMapa"];
  cerrarVistaMapa: OpmStore["cerrarVistaMapa"];
  vistaMapaActiva: OpmStore["vistaMapaActiva"];
  gridConfigBase: Partial<GridConfig> | undefined;
  toggleGrid: OpmStore["toggleGrid"];
  aplicarLayoutSugerido: OpmStore["aplicarLayoutSugerido"];
  iniciarModoSimulacion: OpmStore["iniciarModoSimulacion"];
  abrirTablaEnlaces: OpmStore["abrirTablaEnlaces"];
  abrirCheatsheetAtajos: OpmStore["abrirCheatsheetAtajos"];
}

export interface CommandPaletteUsagePort {
  frecuenciaUso: OpmStore["frecuenciaUsoCommandPalette"];
  registrarUsoCommandPalette: OpmStore["registrarUsoCommandPalette"];
}

export interface CommandPalettePort extends
  CommandPaletteContextPort,
  CommandPaletteWorkspacePort,
  CommandPaletteViewPort,
  CommandPaletteUsagePort {}
