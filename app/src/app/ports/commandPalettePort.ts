import type { GridConfig } from "../../canvas/grid";
import type { EnlaceEstilo, Id, Modelo, ModoImagenEntidad } from "../../modelo/tipos";

export interface CommandPaletteContextPort {
  modelo: Modelo;
  opdActivoId: Id;
  seleccionId: Id | null;
  enlaceEstiloPortapapeles: EnlaceEstilo | null;
  seleccionados: Id[];
}

/**
 * Ronda Codex v2 L5: el command palette absorbe TODAS las acciones que antes
 * vivían en el menú lateral `MenuPrincipal` (retirado). Estas acciones
 * extra no son atajos ni acciones contextuales: son comandos globales de
 * workspace, vista y navegación que ahora se invocan sólo desde el palette.
 */
export interface CommandPaletteMenuExtrasPort {
  iniciarAsistente: () => void;
  abrirPestanaNueva: () => void;
  abrirBusquedaCosas: () => void;
  abrirBusquedaGlobal: () => void;
  abrirModalUrls: (objetoId: Id) => void;
  toggleAliasVisibles: () => void;
  uiAliasVisibles: boolean;
  toggleDescripcionesVisibles: () => void;
  uiDescripcionesVisibles: boolean;
  uiModoImagenGlobal: ModoImagenEntidad | null;
  fijarModoImagenGlobal: (modo: ModoImagenEntidad | null) => void;
  abrirModalImagen: (objetoId: Id) => void;
  mostrarArchivados: boolean;
  toggleMostrarArchivados: () => void;
  mostrarVersiones: boolean;
  toggleMostrarVersiones: () => void;
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
  CommandPaletteMenuExtrasPort,
  CommandPaletteUsagePort {}
