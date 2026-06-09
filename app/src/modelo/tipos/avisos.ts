/**
 * Avisos metodologicos blandos derivados del modelo OPM.
 *
 * Citas SSOT canonicas (metodologia-opm-es.md):
 *   [Met §6 Construccion del SD]
 *   [Met §6.1 Identificacion del Proceso Principal]
 *   [Met §6.4 Funcion Principal]
 *   [Met §6.9 Objetos Ambientales]
 *   [Met §6.11 Verificacion del SD]
 *   [Met §7.1 Refinamiento Sincrono / Inzoom]
 *   [Met §7.2 Refinamiento Asincrono / Unfold]
 *   [Met §7.6 Verificacion de SD1]
 *   [Glos 3.55 Object] [Glos 3.69 Process]
 *
 * Ronda 16 L3 (Beta1): el aviso es accionable. Cada aviso lleva:
 *   - codigo (estable, machine-readable)
 *   - severidad ("info" | "advertencia" | "sugerencia")
 *   - mensaje (humano, accion-oriented)
 *   - rationale (opcional, explicacion breve del porque)
 *   - ssotRef (cita corta, visible en panel; obligatoria para cada aviso emitido)
 *   - entidadId / opdId (donde se materializa la violacion)
 *   - navegarA (override explicito del destino de navegacion: entidad o opd)
 *   - accionesSugeridas (sugerencias humanas, no ejecutables aun en Beta1)
 *
 * Contrato ronda 13 L3 (sin cambio): AvisoMetodologico NO se serializa; se
 * calcula en runtime como DataFlow puro Modelo -> AvisoMetodologico[].
 */

import type { Id } from "./comunes";

export type SeveridadAviso = "info" | "advertencia" | "sugerencia";

export type CodigoChecker =
  | "PROCESO_NOMBRE_FORMA_VERBAL"
  | "ESTADO_NOMBRE_CANONICO"
  | "OBJETO_NOMBRE_SINGULAR"
  | "INZOOM_CONTENIDO_INSUFICIENTE"
  | "UNFOLD_CONTENIDO_INSUFICIENTE"
  | "PROCESO_NO_TRANSFORMA"
  | "PROCESO_SISTEMICO_DESCONECTADO"
  | "INZOOM_NOMBRES_PLACEHOLDER_HIJOS"
  | "OBJETO_AMBIENTAL_SIN_CONTORNO_DISCONTINUO"
  | "SD_SIN_PROCESO_PRINCIPAL"
  | "RECURSO_LINEAL_MULTIPLES_CONSUMIDORES"
  | "DESCOMPOSICION_SIN_SUBPROCESOS"
  | "DESCOMPOSICION_NO_PRESERVA_FRONTERA"
  | "EFECTO_OBJETO_SIN_ESTADOS"
  | "ENTIDAD_SIN_APARICIONES";

export interface NavegacionAviso {
  tipo: "entidad" | "opd";
  id: Id;
  opdId?: Id;
}

export interface AvisoMetodologico {
  codigo: CodigoChecker;
  severidad: SeveridadAviso;
  entidadId?: Id;
  opdId?: Id;
  mensaje: string;
  rationale?: string;
  /**
   * Cita corta visible en el panel: identifica seccion de la SSOT
   * (`metodologia-opm-es.md`) y es la responsable de hacer trazable cada
   * aviso. Obligatoria para checkers nuevos; los legacy se completan en L3.
   */
  ssotRef?: string;
  /**
   * Override explicito del destino de navegacion. Si esta ausente, se usa
   * `entidadId` / `opdId`.
   */
  navegarA?: NavegacionAviso;
  /**
   * Sugerencias humanas de correccion. No ejecutables en Beta1; sirven al
   * usuario para entender que hacer ante el aviso.
   */
  accionesSugeridas?: string[];
}
