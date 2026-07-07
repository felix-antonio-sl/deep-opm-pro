import type { AvisoDiagnostico } from "./diagnostico";
import type { AvisoMetodologico, CodigoChecker } from "./tipos";
import type { SeveridadAviso } from "./validaciones";

export type SeveridadIssue = "bloqueo" | "mejora" | "estilo";

export interface ResumenSeveridades {
  bloqueos: number;
  mejoras: number;
  estilo: number;
}

export interface GruposSeveridad {
  bloqueo: AvisoMetodologico[];
  mejora: AvisoMetodologico[];
  estilo: AvisoMetodologico[];
}

const SEVERIDAD_POR_CODIGO: Record<CodigoChecker, SeveridadIssue> = {
  SD_SIN_PROCESO_PRINCIPAL: "mejora",
  PROCESO_NOMBRE_FORMA_VERBAL: "mejora",
  ESTADO_NOMBRE_CANONICO: "mejora",
  OBJETO_NOMBRE_SINGULAR: "mejora",
  OBJETO_AMBIENTAL_SIN_CONTORNO_DISCONTINUO: "mejora",
  INZOOM_CONTENIDO_INSUFICIENTE: "mejora",
  INZOOM_NOMBRES_PLACEHOLDER_HIJOS: "mejora",
  UNFOLD_CONTENIDO_INSUFICIENTE: "mejora",
  PROCESO_NO_TRANSFORMA: "mejora",
  PROCESO_SISTEMICO_DESCONECTADO: "mejora",
  RECURSO_LINEAL_MULTIPLES_CONSUMIDORES: "mejora",
  DESCOMPOSICION_SIN_SUBPROCESOS: "mejora",
  DESCOMPOSICION_NO_PRESERVA_FRONTERA: "mejora",
  // B-4 (§3.15): efecto sobre objeto sin estados. Candidato a bloqueo (violación
  // estructural del canon); se emite como mejora hasta que el operador decida
  // escalarlo a validarModelo.
  EFECTO_OBJETO_SIN_ESTADOS: "mejora",
  // El efecto plano es abstracción transitoria: madura a transición TS3-TS5
  // o al par consumo+resultado. Mejora accionable, no bloqueo.
  EFECTO_SIN_TRANSICION: "mejora",
  // R-OPD-HAB-4/R-PREC-1..3: transformadores planos duplicados sobre el mismo
  // par sin abanico. La edición no puede distinguir ramas pre-abanico; el
  // checker acusa el residual no agrupado. Mejora accionable.
  PAR_TRANSFORMADOR_DUPLICADO: "mejora",
  // A6-2/V-18: Pr=p fuera de un abanico XOR no tiene canonicidad (reglas §11.2,
  // zona no canonizada). Visible, no bloqueante (R-ZNC: silencio, no prohibición).
  PROBABILIDAD_FUERA_DE_ABANICO: "mejora",
  // B-2: entidad sin apariciones (invisible al OPL). Mejora accionable.
  ENTIDAD_SIN_APARICIONES: "mejora",
  // U5 (R-INV-2B / §5.4): enlace de invocación redundante con el orden de
  // descomposición (doble vara). Mejora accionable, no bloqueo: coexisten modelos
  // legacy mientras se migra al campo ordenInzoom.
  INVOCACION_REDUNDANTE_CON_ORDEN: "mejora",
  // Integridad referencial: un id de `ordenInzoom` que no es subproceso interno del OPD
  // es una referencia colgante del orden declarado. Clasificación del panel `mejora`
  // (como todo checker); el aviso es `advertencia` (referencia rota real) — el layout/OPL
  // la ignoran, pero el orden declarado miente sobre el contenido de la descomposición.
  ORDEN_INZOOM_REFERENCIA_INVALIDA: "mejora",
};

export function clasificarSeveridad(aviso: Pick<AvisoMetodologico, "codigo">): SeveridadIssue {
  return SEVERIDAD_POR_CODIGO[aviso.codigo] ?? "mejora";
}

export function agruparPorSeveridad(avisos: AvisoMetodologico[]): GruposSeveridad {
  const grupos: GruposSeveridad = { bloqueo: [], mejora: [], estilo: [] };
  for (const aviso of avisos) {
    grupos[clasificarSeveridad(aviso)].push(aviso);
  }
  return grupos;
}

export function resumenSeveridades(avisos: AvisoMetodologico[]): ResumenSeveridades {
  const grupos = agruparPorSeveridad(avisos);
  return {
    bloqueos: grupos.bloqueo.length,
    mejoras: grupos.mejora.length,
    estilo: grupos.estilo.length,
  };
}

export function resumenSeveridadesTexto(resumen: ResumenSeveridades): string {
  return `${resumen.bloqueos} bloqueos estructurales / ${resumen.mejoras} mejoras metodologicas / ${resumen.estilo} sugerencias de estilo`;
}

/**
 * Modo apunte — corrección 4 (DEGRADAR POR CLASE, NO POR SEVERIDAD EN BRUTO).
 *
 * Códigos de **VALIDEZ OPM** que, cuando el modelo activo es un apunte, se relajan
 * a observación (`estilo`) en vez de bloquear. Es una whitelist **fail-closed**: un
 * código que NO esté aquí conserva su severidad, de modo que la **INTEGRIDAD
 * estructural** (referencias colgantes, formato, geometría) y cualquier regla nueva
 * **nunca degradan por accidente** — así «la ley falsable no se rompe».
 *
 * Validez = juicio sobre el *significado* (firma de enlaces, transformee, agente
 * humano, refinamiento, nombres, densidad). Integridad = precondición *mecánica* del
 * documento; su gate duro vive aparte en `serializacion/validarIntegridad.ts`
 * (`validarReferenciasOpd`), ciego al flag `esApunte` por construcción.
 *
 * DELIBERADAMENTE EXCLUIDOS (integridad — nunca degradan): los `visual-*` de
 * referencia colgante / inconsistencia / huérfano / geometría / puerto / vértices /
 * símbolo / label / solape / extremo-no-visible, más `estructural-sin-duplicar`,
 * `orden-estructural-huerfano` y `ORDEN_INZOOM_REFERENCIA_INVALIDA`.
 *
 * Spec: docs/superpowers/specs/2026-06-30-modo-apunte-design.md §1, §3.4.
 */

/** Código de la condición de export «OPD sin adoptar» (R-OPD-REF-20). NO es una
 *  clase de severidad del panel (no está en SEVERIDAD_POR_CODIGO); es condición
 *  del gate de export canónico. Se lista en CODIGOS_VALIDEZ_DEGRADABLES_APUNTE para
 *  que en APUNTE degrade a observación (no bloquea el export del bosquejo). */
export const CODIGO_OPD_SIN_ADOPTAR = "opd-sin-adoptar";

export const CODIGOS_VALIDEZ_DEGRADABLES_APUNTE: ReadonlySet<string> = new Set<string>([
  // ── Validez semántica (validaciones.ts) ──
  "agente-requiere-objeto-fisico", // agente = humano/físico (R-AG-1)
  "agregacion-misma-esencia",
  "ambiental-dentro-contorno",
  "canon-diagrama-densidad",
  "consumo-doble-mismo-objeto",
  "efecto-direccion-canonica", // firma legal de enlaces
  "estructural-no-acepta-extremo-estado", // firma legal de enlaces
  "excepcion-temporal-proceso-proceso",
  "generalizacion-mismo-tipo", // especialización
  "imagen-estados-excluyentes",
  "instrumento-y-agente-simultaneos",
  "procedural-no-objeto-objeto", // firma legal de enlaces
  "proceso-sin-entrada-ni-salida", // transformee
  "solo-un-nivel-de-instanciacion",
  "subproceso-no-conecta-al-padre", // preservación de refinamiento
  // ── Validez de realización visual (diagnosticoVisual.ts) — NO geometría/formato ──
  "visual-subproceso-sin-transformado", // transformee
  "visual-transformador-contorno-no-distribuido",
  "visual-externo-dentro-contorno",
  // ── Mejoras/heurísticas metodológicas (checkers.ts) ──
  "SD_SIN_PROCESO_PRINCIPAL",
  "PROCESO_NOMBRE_FORMA_VERBAL", // nombres
  "ESTADO_NOMBRE_CANONICO", // nombres
  "OBJETO_NOMBRE_SINGULAR", // nombres
  "OBJETO_AMBIENTAL_SIN_CONTORNO_DISCONTINUO",
  "INZOOM_CONTENIDO_INSUFICIENTE",
  "INZOOM_NOMBRES_PLACEHOLDER_HIJOS", // nombres
  "UNFOLD_CONTENIDO_INSUFICIENTE",
  "PROCESO_NO_TRANSFORMA", // transformee
  "PROCESO_SISTEMICO_DESCONECTADO",
  "RECURSO_LINEAL_MULTIPLES_CONSUMIDORES",
  "DESCOMPOSICION_SIN_SUBPROCESOS",
  "DESCOMPOSICION_NO_PRESERVA_FRONTERA",
  "EFECTO_OBJETO_SIN_ESTADOS",
  "EFECTO_SIN_TRANSICION",
  "PAR_TRANSFORMADOR_DUPLICADO",
  "PROBABILIDAD_FUERA_DE_ABANICO",
  "ENTIDAD_SIN_APARICIONES",
  "INVOCACION_REDUNDANTE_CON_ORDEN",
  CODIGO_OPD_SIN_ADOPTAR, // condición de gate de export canónico, degradable en apunte
]);

/**
 * Severidad visible (bloqueo/mejora/estilo) de un aviso unificado del
 * diagnóstico. Es la misma clasificación que ve el usuario en el panel:
 * la metodología se eleva a `mejora` aunque llegue como `info`; el resto
 * mapea desde `SeveridadAviso`. Kernel puro — sin dependencias de capas
 * superiores. El viewmodel del panel la re-exporta para presentación.
 *
 * `opciones.esApunte` (modo apunte): cuando el modelo activo es un apunte, los
 * códigos de VALIDEZ whitelisted se relajan a observación (`estilo`); la integridad
 * y todo lo no whitelisted conservan su severidad (corrección 4, fail-closed). El
 * default (sin opciones / `esApunte:false`) es idéntico al comportamiento previo —
 * cero migración para todos los consumidores existentes.
 */
export function severidadDiagnostico(
  aviso: AvisoDiagnostico,
  opciones: { esApunte?: boolean } = {},
): SeveridadIssue {
  const base = aviso.origen === "metodologia"
    ? clasificarSeveridad({ codigo: aviso.codigo as CodigoChecker })
    : severidadDesdeAviso(aviso.severidad);
  if (opciones.esApunte && CODIGOS_VALIDEZ_DEGRADABLES_APUNTE.has(aviso.codigo)) {
    return "estilo";
  }
  return base;
}

export function severidadDesdeAviso(severidad: SeveridadAviso): SeveridadIssue {
  if (severidad === "error") return "bloqueo";
  if (severidad === "advertencia") return "mejora";
  return "estilo";
}
