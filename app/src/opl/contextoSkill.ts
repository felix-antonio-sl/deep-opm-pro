import { anclasPendientes, enumerarAnclas } from "../modelo/anclasNormativas";
import { exportarDiagnosticoJson } from "../modelo/exportarDiagnostico";
import { nombreExtremo } from "../modelo/extremos";
import { enumerarNotasMesa } from "../modelo/notasMesa";
import type { AnclaNormativa, Modelo, NotaMesa, ReferenciaNorma, TargetAncla } from "../modelo/tipos";
import { exportarOplModeloMarkdown, type OpcionesExportOpl } from "./exportarMarkdown";

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
export function exportarContextoSkill(modelo: Modelo, now: Date = new Date(), opciones?: OpcionesExportOpl): string {
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
    "## Notas de la mesa",
    "",
    seccionNotasMesa(modelo),
    "",
    "## Diagnóstico",
    "",
    "```json",
    exportarDiagnosticoJson(modelo, now),
    "```",
    "",
    "## OPL",
    "",
    exportarOplModeloMarkdown(modelo, opciones),
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
  const todas = enumerarAnclas(modelo);
  const pendientes = anclasPendientes(modelo);
  const vigentes = todas.filter((ancla) => ancla.estado === "vigente");
  const total = todas.length;
  const resumen = `Total anclas normativas: ${total} (${pendientes.length} pendientes de ratificación).`;

  const bloques: string[] = [];

  // Pendientes [RATIFICAR]: insumo de re-elicitación (la mesa debe resolverlos).
  if (pendientes.length === 0) {
    bloques.push("_Sin pendientes de ratificación._");
  } else {
    bloques.push("### Pendientes", "", pendientes.map(lineaAncla).join("\n"));
  }

  // w60-02: las anclas vigentes (ya ratificadas) también viajan en el cuerpo, no
  // solo en el resumen — la mesa necesita saber qué normas ya están ancladas.
  if (vigentes.length > 0) {
    bloques.push("", "### Vigentes", "", vigentes.map(lineaAncla).join("\n"));
  }

  bloques.push("", resumen);
  return bloques.join("\n");
}

// W6.5-a: las notas de mesa son insumo de re-elicitación — cada una es una
// conversación pendiente con el experto del dominio. Se resuelven el target por
// NOMBRE (la skill no conoce los ids internos del bundle).
function seccionNotasMesa(modelo: Modelo): string {
  const notas = enumerarNotasMesa(modelo);
  if (notas.length === 0) return "_Sin notas de mesa._";
  return notas.map((nota) => lineaNota(modelo, nota)).join("\n");
}

function lineaNota(modelo: Modelo, nota: NotaMesa): string {
  return `- [${nota.fecha}] sobre ${describirTarget(modelo, nota.target)}: ${nota.texto}`;
}

function describirTarget(modelo: Modelo, target: TargetAncla): string {
  switch (target.tipo) {
    case "modelo":
      return "el modelo";
    case "entidad": {
      const entidad = modelo.entidades[target.id];
      return entidad ? `${entidad.tipo} **${entidad.nombre}**` : `entidad ${target.id}`;
    }
    case "opd": {
      const opd = modelo.opds[target.id];
      return opd ? `OPD «${opd.nombre}»` : `OPD ${target.id}`;
    }
    case "enlace": {
      const enlace = modelo.enlaces[target.id];
      if (!enlace) return `enlace ${target.id}`;
      return `enlace ${enlace.tipo} ${nombreExtremo(modelo, enlace.origenId)}→${nombreExtremo(modelo, enlace.destinoId)}`;
    }
  }
}

function lineaAncla(ancla: AnclaNormativa): string {
  // w60-03: un claveProto vacío no debe colapsar a un inline-code span vacío sin
  // traza — se emite un marcador explícito que conserva el id posicional.
  const clave = ancla.claveProto.trim()
    ? `\`${ancla.claveProto}\``
    : `‹sin claveProto — id ${ancla.id}›`;
  const nota = ancla.nota ? ` — ${ancla.nota}` : "";
  const partes = atributosRatificacion(ancla);
  const cabecera = partes.length > 0 ? `${clave}${nota} (${partes.join(", ")})` : `${clave}${nota}`;

  // w60-01: las referencias normativas viajan como sub-lista anidada (norma +
  // artículos + sección) para no inflar la línea principal; la fuente de
  // ratificación, si existe, se anexa como un bullet más.
  const sub = subListaReferencias(ancla);
  return sub ? `- ${cabecera}\n${sub}` : `- ${cabecera}`;
}

/**
 * Atributos del ciclo de ratificación (autoridad / estado / responsable). Solo
 * las anclas pendientes traen `ratificacion`; las vigentes devuelven `[]`.
 */
function atributosRatificacion(ancla: AnclaNormativa): string[] {
  if (!ancla.ratificacion) return [];
  const partes = [
    `autoridad: ${ancla.ratificacion.nivelAutoridad ?? "—"}`,
    `estado: ${ancla.ratificacion.estadoRatificacion ?? "pendiente"}`,
  ];
  if (ancla.ratificacion.responsable) partes.push(`responsable: ${ancla.ratificacion.responsable}`);
  return partes;
}

/**
 * Sub-lista (bullets anidados) con cada `ReferenciaNorma` y, si existe, la fuente
 * de ratificación. Devuelve `null` si el ancla no tiene referencias ni fuente —
 * así la línea principal se mantiene compacta.
 */
function subListaReferencias(ancla: AnclaNormativa): string | null {
  const bullets = (ancla.referencias ?? []).map((ref) => `  - ${describirReferencia(ref)}`);
  if (ancla.ratificacion?.fuente) bullets.push(`  - fuente: ${ancla.ratificacion.fuente}`);
  return bullets.length > 0 ? bullets.join("\n") : null;
}

/** Renderiza una norma como `norma — arts. a, b — §sección` (partes opcionales se omiten). */
function describirReferencia(ref: ReferenciaNorma): string {
  const partes = [ref.norma];
  if (ref.articulos?.length) partes.push(`arts. ${ref.articulos.join(", ")}`);
  if (ref.seccion) partes.push(ref.seccion);
  return partes.join(" — ");
}
