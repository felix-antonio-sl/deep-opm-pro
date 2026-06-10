import type { EstadoAncla, ReferenciaNorma } from "../../modelo/tipos";

// W6.4: helpers puros de presentación de AnclaNormativa para el Inspector.
// Los artículos viajan verbatim del proto (la expansión de rangos es
// presentación, no dato — §10 decisión 5): aquí solo se componen segmentos.

/** Compone "norma · artículos · sección" omitiendo los segmentos ausentes. */
export function formatearReferencia(referencia: ReferenciaNorma): string {
  const segmentos = [referencia.norma];
  if (referencia.articulos && referencia.articulos.length > 0) segmentos.push(referencia.articulos.join(", "));
  if (referencia.seccion) segmentos.push(referencia.seccion);
  return segmentos.join(" · ");
}

/** Vocabulario visible del estado: el pendiente conserva el género `[RATIFICAR]` del proto. */
export function etiquetaEstadoAncla(estado: EstadoAncla): string {
  return estado === "pendiente-ratificacion" ? "[RATIFICAR]" : "vigente";
}
