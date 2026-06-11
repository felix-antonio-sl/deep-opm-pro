import type { Id, Modelo, Opd } from "../modelo/tipos";
import { generarOpl } from "./generar";

/**
 * Exportación de OPL a Markdown listo para pegar (sin HTML).
 *
 * Las frases OPL ya vienen en sintaxis Markdown inline (`**objeto**`,
 * `*proceso*`, `` `estado` ``), así que exportar a Markdown sólo requiere
 * envolverlas con un título y presentarlas como lista. No se reusa
 * `generarHtmlOpl` (retirado): el objetivo es texto Markdown copiable, no un
 * documento HTML descargable.
 */

function listaFrases(lineas: string[]): string {
  if (lineas.length === 0) return "_Sin frases OPL._";
  return lineas.map((linea) => `- ${linea}`).join("\n");
}

/** OPL del OPD indicado como bloque Markdown con título `# {modelo} — {OPD}`. */
export function exportarOplOpdMarkdown(modelo: Modelo, opdId: Id): string {
  const opd = modelo.opds[opdId];
  const titulo = opd ? `${modelo.nombre} — ${opd.nombre}` : modelo.nombre;
  const lineas = generarOpl(modelo, opdId);
  return `# ${titulo}\n\n${listaFrases(lineas)}\n`;
}

/**
 * OPL completo de TODO el modelo: un encabezado `# {modelo}` y una sección
 * `## {OPD}` por cada OPD, recorridos en orden jerárquico (raíz → hijos).
 */
export function exportarOplModeloMarkdown(modelo: Modelo): string {
  const secciones = opdsEnOrden(modelo).map((opd) => {
    const lineas = generarOpl(modelo, opd.id);
    return `## ${opd.nombre}\n\n${listaFrases(lineas)}`;
  });
  const cuerpo = secciones.length > 0 ? secciones.join("\n\n") : "_Sin OPDs._";
  return `# ${modelo.nombre}\n\n${cuerpo}\n`;
}

/** Recorre los OPDs en preorden (padre antes que hijos), respetando ordenLocal. */
export function opdsEnOrden(modelo: Modelo): Opd[] {
  const porPadre = new Map<Id | null, Opd[]>();
  for (const opd of Object.values(modelo.opds)) {
    const lista = porPadre.get(opd.padreId) ?? [];
    lista.push(opd);
    porPadre.set(opd.padreId, lista);
  }
  const comparar = (a: Opd, b: Opd): number => {
    if (a.ordenLocal !== undefined && b.ordenLocal !== undefined) return a.ordenLocal - b.ordenLocal;
    if (a.ordenLocal !== undefined) return -1;
    if (b.ordenLocal !== undefined) return 1;
    return a.nombre.localeCompare(b.nombre, "es-CL") || a.id.localeCompare(b.id, "es-CL");
  };
  const resultado: Opd[] = [];
  const visitados = new Set<Id>();
  const visitar = (padreId: Id | null): void => {
    for (const opd of [...(porPadre.get(padreId) ?? [])].sort(comparar)) {
      if (visitados.has(opd.id)) continue;
      visitados.add(opd.id);
      resultado.push(opd);
      visitar(opd.id);
    }
  };
  visitar(null);
  // OPDs huérfanos (padre inexistente): añadir al final en orden estable.
  for (const opd of Object.values(modelo.opds).sort(comparar)) {
    if (!visitados.has(opd.id)) {
      visitados.add(opd.id);
      resultado.push(opd);
    }
  }
  return resultado;
}
