import { anclasPendientes, enumerarAnclas } from "../modelo/anclasNormativas";
import { exportarDiagnosticoJson } from "../modelo/exportarDiagnostico";
import type { AnclaNormativa, Modelo } from "../modelo/tipos";
import { exportarOplModeloMarkdown } from "./exportarMarkdown";

/**
 * Puente de contexto W6.0 (acta mesa equilibrio, delib. 2): compone en UN solo
 * markdown copiable el contexto de modelado del modelo activo — procedencia +
 * pendientes [RATIFICAR] + diagnóstico + OPL — listo para pegar en la sesión de
 * la skill `modelamiento-opm`. Función pura del kernel (sin DOM/store/clipboard);
 * `now` se inyecta para fechas deterministas en tests (mismo patrón que
 * `exportarDiagnosticoJson`). El glosario NO viaja: fue retirado del pipeline
 * (G2, `98784c1c`) — el proto es la fuente única autoral.
 *
 * Orden de secciones: contexto accionable primero (procedencia → pendientes →
 * diagnóstico), el OPL completo al final por ser la sección más larga.
 */
export function exportarContextoSkill(modelo: Modelo, now: Date = new Date()): string {
  const fecha = now.toISOString().slice(0, 10);
  return [
    `# Contexto de modelado — ${modelo.nombre}`,
    "",
    `> Puente W6.0 deep-opm-pro → skill \`modelamiento-opm\` · ${fecha}.`,
    "> El proto es la fuente única: las correcciones se re-elicitan, no se editan aquí.",
    "",
    "## Procedencia",
    "",
    seccionProcedencia(modelo),
    "",
    "## Pendientes [RATIFICAR]",
    "",
    seccionPendientes(modelo),
    "",
    "## Diagnóstico",
    "",
    "```json",
    exportarDiagnosticoJson(modelo, now),
    "```",
    "",
    "## OPL",
    "",
    exportarOplModeloMarkdown(modelo),
  ].join("\n");
}

function seccionProcedencia(modelo: Modelo): string {
  const sello = modelo.procedencia;
  if (!sello) {
    return "_Sin sello de procedencia — el modelo no fue emitido por el compilador de autoría._";
  }
  return [
    `- protoHash: \`${sello.protoHash}\``,
    `- autoriaVersion: \`${sello.autoriaVersion}\``,
    `- layoutVersion: \`${sello.layoutVersion}\``,
  ].join("\n");
}

function seccionPendientes(modelo: Modelo): string {
  const pendientes = anclasPendientes(modelo);
  const total = enumerarAnclas(modelo).length;
  const resumen = `Total anclas normativas: ${total} (${pendientes.length} pendientes de ratificación).`;
  if (pendientes.length === 0) {
    return `_Sin pendientes de ratificación._\n\n${resumen}`;
  }
  const lineas = pendientes.map(lineaPendiente);
  return `${lineas.join("\n")}\n\n${resumen}`;
}

function lineaPendiente(ancla: AnclaNormativa): string {
  const partes = [
    `autoridad: ${ancla.ratificacion?.nivelAutoridad ?? "—"}`,
    `estado: ${ancla.ratificacion?.estadoRatificacion ?? "pendiente"}`,
  ];
  if (ancla.ratificacion?.responsable) partes.push(`responsable: ${ancla.ratificacion.responsable}`);
  const nota = ancla.nota ? ` — ${ancla.nota}` : "";
  return `- \`${ancla.claveProto}\`${nota} (${partes.join(", ")})`;
}
