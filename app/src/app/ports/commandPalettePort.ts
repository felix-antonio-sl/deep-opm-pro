import type { GridConfig } from "../../canvas/grid";
import type { EnlaceEstilo, Id, Modelo } from "../../modelo/tipos";

export interface CommandPaletteContextPort {
  modelo: Modelo;
  opdActivoId: Id;
  seleccionId: Id | null;
  enlaceEstiloPortapapeles: EnlaceEstilo | null;
  seleccionados: Id[];
}

export interface CommandPaletteWorkspacePort {
  nuevoModelo: () => void;
  abrirCargarModelo: (opciones?: { mostrarArchivados?: boolean }) => void;
  abrirGuardarComo: () => void;
  abrirDialogoConfiguracion: () => void;
  abrirDialogoGuardarPlantilla: () => void;
  abrirDialogoPlantillas: () => void;
  abrirDialogoVersiones: (modeloId: Id) => void;
  modeloPersistidoId: Id | null;
  abrirDialogoImportarExportarJson: () => void;
  exportarJson: () => string;
}

export interface CommandPaletteViewPort {
  gridConfigBase: Partial<GridConfig> | undefined;
  toggleGrid: () => void;
  aplicarLayoutSugerido: () => void;
  iniciarModoSimulacion: () => void;
  abrirTablaEnlaces: () => void;
  abrirCheatsheetAtajos: () => void;
}

export interface CommandPaletteUsagePort {
  frecuenciaUso: Record<string, number>;
  registrarUsoCommandPalette: (itemId: string) => void;
}

export interface CommandPalettePort extends
  CommandPaletteContextPort,
  CommandPaletteWorkspacePort,
  CommandPaletteViewPort,
  CommandPaletteUsagePort {}
