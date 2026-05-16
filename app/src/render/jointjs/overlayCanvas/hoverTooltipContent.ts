import type { Enlace, Modelo, TipoEnlace } from "../../../modelo/tipos";
import type { OpmJointMetadata } from "../proyeccion";

const ETIQUETA_ENLACE: Record<TipoEnlace, string> = {
  agente: "agente",
  instrumento: "instrumento",
  consumo: "consumo",
  resultado: "resultado",
  efecto: "efecto",
  invocacion: "invocación",
  excepcionSobretiempo: "excepción por sobretiempo",
  excepcionSubtiempo: "excepción por subtiempo",
  excepcionSubSobretiempo: "excepción por rango de tiempo",
  agregacion: "agregación",
  exhibicion: "exhibición",
  generalizacion: "generalización",
  clasificacion: "clasificación",
  etiquetado: "etiquetado",
  etiquetadoBidireccional: "etiquetado bidireccional",
} as const;

export function contenidoHoverTooltip(modelo: Modelo, meta: OpmJointMetadata | null): string | null {
  if (!meta) return null;
  if (meta.kind === "entidad") {
    const entidad = modelo.entidades[meta.entidadId];
    if (!entidad) return null;
    const tipo = entidad.tipo === "objeto" ? "Objeto OPM" : "Proceso OPM";
    const ssot = entidad.tipo === "objeto" ? "[Glos 3.55]" : "[Glos 3.69]";
    return [
      tipo,
      entidad.nombre,
      entidad.esencia === "fisica" ? "físico" : "informacional",
      entidad.afiliacion === "ambiental" ? "ambiental" : "sistémico",
      ssot,
    ].join(" · ");
  }
  if (meta.kind === "enlace") {
    const enlace = modelo.enlaces[meta.enlaceId];
    if (!enlace) return null;
    return [
      "Enlace OPM",
      etiquetaTipoEnlace(meta.tipo),
      multiplicidad(enlace),
      meta.rolEstructural ? `rol ${meta.rolEstructural}` : null,
      "[V-239]",
    ].filter(Boolean).join(" · ");
  }
  return null;
}

function etiquetaTipoEnlace(tipo: TipoEnlace): string {
  return ETIQUETA_ENLACE[tipo] ?? tipo;
}

function multiplicidad(enlace: Enlace): string | null {
  const partes = [
    enlace.multiplicidadOrigen ? `origen ${enlace.multiplicidadOrigen}` : null,
    enlace.multiplicidadDestino ? `destino ${enlace.multiplicidadDestino}` : null,
  ].filter(Boolean);
  return partes.length ? `multiplicidad ${partes.join(" / ")}` : null;
}
