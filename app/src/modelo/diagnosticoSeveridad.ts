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
  // B-2: entidad sin apariciones (invisible al OPL). Mejora accionable.
  ENTIDAD_SIN_APARICIONES: "mejora",
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
 * Severidad visible (bloqueo/mejora/estilo) de un aviso unificado del
 * diagnóstico. Es la misma clasificación que ve el usuario en el panel:
 * la metodología se eleva a `mejora` aunque llegue como `info`; el resto
 * mapea desde `SeveridadAviso`. Kernel puro — sin dependencias de capas
 * superiores. El viewmodel del panel la re-exporta para presentación.
 */
export function severidadDiagnostico(aviso: AvisoDiagnostico): SeveridadIssue {
  if (aviso.origen === "metodologia") return clasificarSeveridad({ codigo: aviso.codigo as CodigoChecker });
  return severidadDesdeAviso(aviso.severidad);
}

export function severidadDesdeAviso(severidad: SeveridadAviso): SeveridadIssue {
  if (severidad === "error") return "bloqueo";
  if (severidad === "advertencia") return "mejora";
  return "estilo";
}
