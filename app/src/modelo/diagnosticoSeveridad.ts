import type { AvisoMetodologico, CodigoChecker } from "./tipos";

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
  OBJETO_NOMBRE_SINGULAR: "mejora",
  OBJETO_AMBIENTAL_SIN_CONTORNO_DISCONTINUO: "mejora",
  INZOOM_CONTENIDO_INSUFICIENTE: "mejora",
  INZOOM_NOMBRES_PLACEHOLDER_HIJOS: "mejora",
  UNFOLD_CONTENIDO_INSUFICIENTE: "mejora",
  PROCESO_NO_TRANSFORMA: "mejora",
  PROCESO_SISTEMICO_DESCONECTADO: "mejora",
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
