/**
 * Perfiles de export canónicos (R-VIS-EXP-2 / R-OPD-CAN-1, SSOT
 * `reglas-opm-estrictas-es` §0 V-0a; régimen R-CONF-7).
 *
 * Tres perfiles declarados:
 *
 * - `canon-diagrama` — gramática OPM persistible por OPD: excluye las
 *   extensiones meta no diagramáticas (notas de mesa, ontología organizacional,
 *   satisfacciones de requisito, sello de procedencia). Conserva anclas
 *   normativas (W5.1, trazabilidad) y el par estereotipo+requisito (la
 *   validación de entidades los acopla: la marca sin su metadata no hidrata).
 * - `canon-documento` — por modelo, multi-OPD: todo `canon-diagrama` más
 *   satisfacciones de requisito y procedencia. Excluye notas de mesa (meta de
 *   revisión interna, V-204) y ontología organizacional.
 * - `intercambio` — modelo completo, sin filtro (el export histórico).
 *
 * Los perfiles canónicos quedan subordinados al gate de densidad
 * (`perfilCanonDiagrama`): un OPD bloqueado (> máx. apariencias) rechaza el
 * export ruidosamente — ninguna ruta de export evade el gate (EXPORT-GATE).
 */
import { CODIGO_OPD_SIN_ADOPTAR, CODIGOS_VALIDEZ_DEGRADABLES_APUNTE } from "../modelo/diagnosticoSeveridad";
import { calcularMetricasComplejidad } from "../modelo/metricasComplejidad";
import { opdsSueltos } from "../modelo/opdSueltos";
import { CANON_DIAGRAMA_MAX_APARIENCIAS, perfilCanonDiagrama } from "../modelo/perfilDiagrama";
import type { Id, Modelo, Resultado } from "../modelo/tipos";
import { exportarOplModeloMarkdown, opdsEnOrden } from "../opl/exportarMarkdown";
import { exportarModelo } from "./json";

export const PERFILES_EXPORT = ["canon-diagrama", "canon-documento", "intercambio"] as const;
export type PerfilExport = (typeof PERFILES_EXPORT)[number];

/** V-226 / R-VIS-EXPORT-1A: perfil por defecto declarado por familia de salida. */
export const PERFIL_DEFAULT_DIAGRAMA = "canon-diagrama" satisfies PerfilExport;
export const PERFIL_DEFAULT_DOCUMENTO = "canon-documento" satisfies PerfilExport;

/**
 * R-VIS-EXP-5 (V-0d): todo elemento persistente SOLO en un perfil canónico se
 * declara como atributo de perfil. Esta declaración es ejecutable: el filtro
 * de perfil la consume (única fuente de verdad).
 */
export const ATRIBUTOS_DE_PERFIL = {
  "canon-documento": ["satisfaccionesRequisito", "procedencia"],
} as const satisfies Partial<Record<PerfilExport, readonly (keyof Modelo)[]>>;

/**
 * Gate de densidad para perfiles canónicos: todo OPD del modelo debe estar
 * bajo el máximo de apariencias. Bloqueado ⇒ fallo con OPDs nombrados y la
 * acción correctiva (dividir el diagrama), nunca export degradado silencioso.
 */
export function gateDensidadCanonica(modelo: Modelo): Resultado<true> {
  const bloqueados = Object.keys(modelo.opds)
    .map((opdId) => perfilCanonDiagrama(modelo, opdId))
    .filter((perfil) => perfil.estado === "bloqueado");
  if (bloqueados.length === 0) return { ok: true, value: true };
  const nombres = bloqueados
    .map((p) => `'${modelo.opds[p.opdId]?.nombre ?? p.opdId}' (${p.apariencias} apariencias)`)
    .join(", ");
  return {
    ok: false,
    error:
      `Export canónico bloqueado por densidad: ${nombres} supera el máximo de ` +
      `${CANON_DIAGRAMA_MAX_APARIENCIAS} apariencias por OPD. Divide el diagrama antes de exportar.`,
  };
}

/**
 * Condición de export canónico «OPD sin adoptar» (R-OPD-REF-20): un modelo con
 * OPDs sueltos no cierra como documento canónico. En un MODELO bloquea con causa;
 * en un APUNTE (rigor relajado) degrada a observación vía la whitelist
 * CODIGOS_VALIDEZ_DEGRADABLES_APUNTE — NO es una clase de severidad nueva.
 * La edición nunca se bloquea (esto solo rige el export canónico).
 */
export function gateOpdsSinAdoptar(modelo: Modelo, opciones: { esApunte?: boolean } = {}): Resultado<true> {
  const sueltos = opdsSueltos(modelo);
  if (sueltos.length === 0) return { ok: true, value: true };
  if (opciones.esApunte && CODIGOS_VALIDEZ_DEGRADABLES_APUNTE.has(CODIGO_OPD_SIN_ADOPTAR)) {
    return { ok: true, value: true }; // observación: el bosquejo exporta con marca
  }
  const nombres = sueltos.map((o) => `'${o.nombre}'`).join(", ");
  return {
    ok: false,
    error: `Export canónico bloqueado: OPD sin adoptar: ${nombres}. Adopta cada OPD suelto (in-zoom/unfold de una cosa) o reconcílialo antes de exportar.`,
  };
}

/** Proyección del modelo según el perfil. `intercambio` es la identidad. */
export function filtrarModeloPorPerfil(modelo: Modelo, perfil: PerfilExport): Modelo {
  if (perfil === "intercambio") return modelo;
  const {
    notasMesa: _notasMesa,
    ontologia: _ontologia,
    satisfaccionesRequisito: _satisfacciones,
    procedencia: _procedencia,
    ...base
  } = modelo;
  if (perfil === "canon-documento") {
    // Los atributos de perfil declarados (R-VIS-EXP-5) se re-incorporan desde
    // el modelo original: la declaración ES el filtro.
    const atributos = Object.fromEntries(
      ATRIBUTOS_DE_PERFIL["canon-documento"]
        .filter((clave) => modelo[clave] !== undefined)
        .map((clave) => [clave, modelo[clave]]),
    );
    return { ...base, ...atributos };
  }
  return base;
}

/**
 * Export JSON con perfil declarado. Los perfiles canónicos pasan primero por
 * el gate de densidad; `intercambio` conserva la conducta histórica sin gate.
 */
export function exportarModeloConPerfil(
  modelo: Modelo,
  perfil: PerfilExport,
  carpetaId?: Id | null,
  opciones: { esApunte?: boolean } = {},
): Resultado<string> {
  if (perfil !== "intercambio") {
    const gd = gateDensidadCanonica(modelo);
    if (!gd.ok) return gd;
    const gs = gateOpdsSinAdoptar(modelo, opciones);
    if (!gs.ok) return gs;
  }
  return { ok: true, value: exportarModelo(filtrarModeloPorPerfil(modelo, perfil), carpetaId) };
}

/**
 * Documento canónico del modelo (`canon-documento` textual, R-OPD-CAN-1):
 * portada + métricas + árbol de OPDs + OPL completa + procedencia. Markdown
 * determinista (sin timestamps: la identidad la da el sello de procedencia).
 */
export function emitirDocumentoCanonico(modelo: Modelo, opciones: { esApunte?: boolean } = {}): Resultado<string> {
  const gd = gateDensidadCanonica(modelo);
  if (!gd.ok) return gd;
  const gs = gateOpdsSinAdoptar(modelo, opciones);
  if (!gs.ok) return gs;

  const filtrado = filtrarModeloPorPerfil(modelo, "canon-documento");
  const metricas = calcularMetricasComplejidad(filtrado);
  const secciones: string[] = [];

  secciones.push(`# ${filtrado.nombre}`);
  const sueltosMarca = opdsSueltos(modelo);
  if (opciones.esApunte && sueltosMarca.length > 0) {
    secciones.push(`> **Bosquejo**: contiene ${sueltosMarca.length} OPD(s) sin adoptar (observación, no bloqueo).`);
  }
  secciones.push(`> Perfil de export: \`canon-documento\` (R-VIS-EXP-2).`);
  if (typeof filtrado.descripcion === "string" && filtrado.descripcion.trim()) {
    secciones.push(filtrado.descripcion.trim());
  }

  secciones.push(
    [
      "## Métricas del modelo",
      "",
      `- Entidades: ${metricas.entidades}`,
      `- Enlaces: ${metricas.enlaces}`,
      `- OPDs: ${metricas.opds}`,
    ].join("\n"),
  );

  const arbol = opdsEnOrden(filtrado)
    .map((opd) => `${"  ".repeat(profundidadOpd(filtrado, opd.id))}- ${opd.nombre}`)
    .join("\n");
  secciones.push(`## Árbol de OPDs\n\n${arbol || "_Sin OPDs._"}`);

  // exportarOplModeloMarkdown ya emite `# {modelo}` + `## {OPD}`; aquí se
  // degrada un nivel para anidar bajo la portada del documento.
  const opl = exportarOplModeloMarkdown(filtrado)
    .replace(/^# /, "### Modelo: ")
    .replace(/^## /gm, "#### ");
  secciones.push(`## OPL completa\n\n${opl.trimEnd()}`);

  if (filtrado.procedencia) {
    const sello = Object.entries(filtrado.procedencia)
      .map(([clave, valor]) => `- ${clave}: \`${String(valor)}\``)
      .join("\n");
    secciones.push(`## Procedencia\n\n${sello}`);
  }

  return { ok: true, value: `${secciones.join("\n\n")}\n` };
}

function profundidadOpd(modelo: Modelo, opdId: Id): number {
  let profundidad = 0;
  let actual = modelo.opds[opdId];
  const visitados = new Set<Id>([opdId]);
  while (actual?.padreId && modelo.opds[actual.padreId] && !visitados.has(actual.padreId)) {
    visitados.add(actual.padreId);
    actual = modelo.opds[actual.padreId];
    profundidad += 1;
  }
  return profundidad;
}
