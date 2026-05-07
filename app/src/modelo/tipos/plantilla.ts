import type { ModeloPersistido } from "../../persistencia/local";
import type { Id } from "./comunes";

/**
 * Tipos de plantillas privadas como artefactos reutilizables fuera del Modelo.
 * Citas SSOT: [Met §8.8] plantillas crean copias locales desacopladas;
 * [V-52]/[V-123] apariencias locales y existencia única por modelo propietario.
 * Evidencia OPCloud: opm-extracted/src/app/dialogs/templates-import/templates-import.ts.
 */

export type AmbitoPlantilla = "privado" | "organizacional" | "global";

export interface Plantilla {
  id: Id;
  nombre: string;
  descripcion?: string;
  ambito: AmbitoPlantilla;
  contenido: ModeloPersistido;
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
