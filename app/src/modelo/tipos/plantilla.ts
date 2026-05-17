import type { Id } from "./comunes";
import type { VersionResumen } from "./modelo";

/**
 * Tipos de plantillas privadas como artefactos reutilizables fuera del Modelo.
 * Citas SSOT: [Met §8.8] plantillas crean copias locales desacopladas;
 * [V-52]/[V-123] apariencias locales y existencia única por modelo propietario.
 * Evidencia OPCloud: opm-extracted/src/app/dialogs/templates-import/templates-import.ts.
 */

export type AmbitoPlantilla = "privado" | "organizacional" | "global";

export interface ContenidoPlantillaModelo {
  id: Id;
  nombre: string;
  descripcion: string;
  creadoEn: string;
  actualizadoEn: string;
  json: string;
  carpetaId?: Id | null;
  ultimaApertura?: string;
  autosalvado?: boolean;
  archivado?: boolean;
  archivadoEn?: string;
  archivadoAuto?: boolean;
  versiones?: VersionResumen[];
  crearVersionAlGuardar?: boolean;
}

export interface Plantilla {
  id: Id;
  nombre: string;
  descripcion?: string;
  ambito: AmbitoPlantilla;
  contenido: ContenidoPlantillaModelo;
  creadoEn: string;
  actualizadoEn: string;
}

export interface PlantillaIndice {
  id: Id;
  nombre: string;
  descripcion?: string;
  ambito: AmbitoPlantilla;
  creadoEn: string;
  actualizadoEn: string;
}
