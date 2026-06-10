import type { GridConfig } from "../../canvas/grid";
import type { Id, Modelo, ModoImagenEntidad } from "../../modelo/tipos";

export interface CommandPaletteContextPort {
  modelo: Modelo;
  opdActivoId: Id;
  seleccionId: Id | null;
  enlaceSeleccionId: Id | null;
  seleccionados: Id[];
}

/**
 * Ronda Codex v2 L5: el command palette absorbe TODAS las acciones que antes
 * vivían en el menú lateral `MenuPrincipal` (retirado). Estas acciones
 * extra no son atajos ni acciones contextuales: son comandos globales de
 * workspace, vista y navegación que ahora se invocan sólo desde el palette.
 */
export interface CommandPaletteMenuExtrasPort {
  abrirPestanaNueva: () => void;
  abrirBusquedaCosas: () => void;
  abrirBusquedaGlobal: () => void;
  abrirModalUrls: (objetoId: Id) => void;
  toggleAliasVisibles: () => void;
  uiAliasVisibles: boolean;
  toggleDescripcionesVisibles: () => void;
  uiDescripcionesVisibles: boolean;
  uiSoloCanvas: boolean;
  toggleSoloCanvas: () => void;
  uiModoImagenGlobal: ModoImagenEntidad | null;
  fijarModoImagenGlobal: (modo: ModoImagenEntidad | null) => void;
  abrirModalImagen: (objetoId: Id) => void;
  mostrarArchivados: boolean;
  toggleMostrarArchivados: () => void;
  mostrarVersiones: boolean;
  toggleMostrarVersiones: () => void;
  abrirDialogoOntologia: () => void;
  abrirDialogoRequisito: (modo: "crear" | "marcar" | "satisfacer") => void;
  abrirDialogoSubmodelo: () => void;
  splitEffectParcialSeleccionado: () => void;
  recolectarEnlaceContornoSeleccionado: () => void;
  distribuirEnlaceContornoSeleccionado: () => void;
  resolverDecisionSeleccionada: () => void;
}

export interface CommandPaletteWorkspacePort {
  nuevoModelo: () => void;
  abrirCargarModelo: (opciones?: { mostrarArchivados?: boolean }) => void;
  abrirGuardarComo: () => void;
  abrirDialogoConfiguracion: () => void;
  abrirDialogoVersiones: (modeloId: Id) => void;
  modeloPersistidoId: Id | null;
  abrirDialogoImportarExportarJson: () => void;
  exportarJson: () => string;
  copiarOplModeloMarkdownAlPortapapeles: () => Promise<void>;
  /** W6.0: copia el contexto de modelado para la skill y cuenta el cruce (g3). */
  copiarContextoSkillAlPortapapeles: () => Promise<void>;
  /** W6.5-b: copia el LogDecisiones v0 (consumidor: `re-elicitar` de la skill). */
  copiarLogDecisionesAlPortapapeles: () => Promise<void>;
  /** Auth v1 (spec §4): cierra la sesión y vuelve a PantallaLogin. */
  cerrarSesion: () => Promise<void>;
}

export interface CommandPaletteViewPort {
  gridConfigBase: Partial<GridConfig> | undefined;
  toggleGrid: () => void;
  aplicarLayoutSugerido: () => void;
  iniciarModoSimulacion: () => void;
  abrirDialogoSimulacionNumerica: () => void;
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
