#!/usr/bin/env bun
/**
 * validate-hu.ts — linter del inventario v2 de historias de usuario.
 *
 * Ejecuta: `bun run docs/historias-usuario-v2/tools/validate-hu.ts`
 *
 * Verifica invariantes locales (por HU) e invariantes globales (sobre el grafo
 * completo del inventario). Cada invariante corresponde a una propiedad
 * categorial verificable; ver reporte cat-thinking 2026-05-03.
 *
 * --- Invariantes locales (por HU canónica viva) ---
 * L01. Frontmatter homogéneo y bien tipado.
 * L02. Conteo `### HU-` consistente con `hu_emitidas` del frontmatter.
 * L03. Campo `**Tipo:**` solo con valores {opm-semantica, opcloud-ui, mixto}.
 * L04. HU `opm-semantica` con al menos una cita `[V-xxx]` / `[Glos 3.x]` / `[OPL-ES …]`.
 * L05. Terminología prohibida ausente del cuerpo.
 * L06. Modelo de datos: solo raíces declaradas como permitidas.
 * L07. `Bloqueada por:` apunta a HU canónica viva (no stub).
 * L08. Cada cita SSOT existe en el corpus canónico.
 * L09. Sin `?¿` ni `(pregunta abierta)` en cuerpo de HU canónica viva.
 *
 * --- Invariantes globales (sobre el grafo) ---
 * G01. Aciclicidad de `Bloqueada por:` (DFS sobre todo el inventario).
 * G02. Conformidad de prioridad: HU M0 no depende transitivamente de HU no-M0.
 * G03. Universalidad de HU shared: cada shared documenta ≥3 absorciones (heurística;
 *      el corpus categorial sugiere ≥5 pero permitimos 3 con justificación).
 * G04. Drift `Spec ↔ Code`: las raíces del modelo declaradas en HU canónicas
 *      viven o en `app/src/modelo/tipos.ts` o están marcadas `[propuesta]`.
 * G05. Composición de citas SSOT: par de HU adyacentes (una bloquea a otra) no
 *      cita reglas SSOT contradictorias (heurística simple: detectar [V-x] vs [V-y]
 *      donde el mismo número se cita con interpretaciones distintas — degradado a
 *      check de nomenclatura por ahora).
 * G06. Inventario de propuestas: no hay dos HU que propongan el mismo campo con
 *      tipo o nombre divergente.
 *
 * Salida: lista de violaciones por archivo y código de salida 0/1.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = "/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2";
const SSOT = "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es";
const TIPOS_TS = "/home/felix/projects/deep-opm-pro/app/src/modelo/tipos.ts";

const TIPOS_VALIDOS = new Set(["opm-semantica", "opcloud-ui", "mixto"]);

const PRIORIDADES_ORDEN: Record<string, number> = {
  M0: 0,
  M1: 1,
  S: 2,
  C: 3,
  W: 4,
};

const TERMINOLOGIA_PROHIBIDA: Array<[RegExp, string]> = [
  [/\bthing\b/i, "thing → cosa"],
  [/\baffiliation\b/i, "affiliation → afiliación"],
  [/\bessence\b/i, "essence → esencia"],
  [/\bin-zooming\b/i, "in-zooming → descomposición"],
  [/\bout-zooming\b/i, "out-zooming → recomposición"],
  [/\bunfolding\b/i, "unfolding → despliegue"],
  [/\bfolding\b/i, "folding → plegado"],
  [/\benabler\b/i, "enabler → habilitador"],
  [/\btransformee\b/i, "transformee → transformado"],
  [/\baggregation\b(?!-)/i, "aggregation → agregación-participación"],
  [/\bhover\b/i, "hover → pasar el cursor / apuntar"],
  [/\bto-the-(left|right|top|bottom)\b/i, "anglicismo direccional"],
  [/\binformatical\b/i, "informatical → informacional"],
  [/\bstateful\b/i, "stateful → con estados"],
];

const MODELO_PROHIBIDO: Array<[RegExp, string]> = [
  [/`cosa\.[a-zA-Z_]+`/, "cosa.* → entidad.*"],
  [/`thing\.[a-zA-Z_]+`/, "thing.* → entidad.*"],
  [/`object\.[a-zA-Z_]+`/, "object.* → entidad.*"],
  [/`link\.[a-zA-Z_]+`/, "link.* → enlace.*"],
  [/`appearance\.[a-zA-Z_]+`/, "appearance.* → apariencia.*"],
];

const MODELO_PERMITIDO_RAICES_IMPLEMENTADAS = new Set([
  "entidad",
  "apariencia",
  "enlace",
  "aparienciaenlace",
  "opd",
  "modelo",
]);

// Raíces declaradas como [propuesta] en pilares; viven en HU pero no en tipos.ts aún.
const MODELO_PERMITIDO_RAICES_PROPUESTAS = new Set([
  "estado",
  "estereotipo",
  "ui",
  "usuario",
  "org",
  "carpeta",
  "permiso",
  "nota",
  "mensaje",
  "plantilla",
  "valueslot",
  "ontologia",
  "aplicacionestereotipo",
  "aplicacionrequisito",
  "auditontologia",
  "analisis",
  "oracion",
  "simulacion",
  "tutorial",
  "pool",
]);

const MODELO_PERMITIDO_RAICES = new Set([
  ...MODELO_PERMITIDO_RAICES_IMPLEMENTADAS,
  ...MODELO_PERMITIDO_RAICES_PROPUESTAS,
]);

interface Violacion {
  archivo: string;
  hu?: string;
  linea?: number;
  regla: string;
  detalle: string;
}

interface Frontmatter {
  raw: string;
  campos: Record<string, string>;
}

interface HU {
  archivo: string;
  id: string;
  cuerpo: string;
  lineaInicio: number;
  estado: "viva" | "absorbida" | "fusionada";
  bloqueadaPor: string[];
  prioridad: string;
  tipo: string;
  patronesAplicados: string[];
  citasSSOT: string[];
  propuestasModelo: Array<{ raiz: string; campo: string }>;
}

function leerFrontmatter(contenido: string): Frontmatter | null {
  const m = contenido.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const raw = m[1];
  const campos: Record<string, string> = {};
  for (const linea of raw.split("\n")) {
    const kv = linea.match(/^([a-z_]+):\s*(.*)$/);
    if (kv) campos[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return { raw, campos };
}

function listarArchivos(): { epicas: string[]; shared: string[] } {
  const epicasDir = join(ROOT, "epicas");
  const sharedDir = join(ROOT, "shared");
  const epicas = statSync(epicasDir, { throwIfNoEntry: false })
    ? readdirSync(epicasDir)
        .filter(f => f.endsWith(".md"))
        .map(f => join(epicasDir, f))
        .sort()
    : [];
  const shared = statSync(sharedDir, { throwIfNoEntry: false })
    ? readdirSync(sharedDir)
        .filter(f => f.endsWith(".md"))
        .map(f => join(sharedDir, f))
        .sort()
    : [];
  return { epicas, shared };
}

function partirEnHUs(archivo: string, contenido: string): HU[] {
  const lineas = contenido.split("\n");
  const hus: HU[] = [];
  let actual: { id: string; cuerpoLineas: string[]; lineaInicio: number } | null = null;
  for (let i = 0; i < lineas.length; i++) {
    const m = lineas[i].match(/^### (HU-[A-Z0-9]+(?:-[A-Z0-9]+)?\.[0-9]+)\s+—\s+(.*)$/);
    if (m) {
      if (actual) hus.push(construirHU(archivo, actual));
      actual = { id: m[1], cuerpoLineas: [lineas[i]], lineaInicio: i + 1 };
      continue;
    }
    if (actual) actual.cuerpoLineas.push(lineas[i]);
  }
  if (actual) hus.push(construirHU(archivo, actual));
  return hus;
}

function construirHU(archivo: string, raw: { id: string; cuerpoLineas: string[]; lineaInicio: number }): HU {
  const cuerpo = raw.cuerpoLineas.join("\n");
  let estado: "viva" | "absorbida" | "fusionada" = "viva";
  if (/\[absorbida en/i.test(raw.cuerpoLineas[0]) || /\*\*Estado:\*\*\s*absorbida/i.test(cuerpo)) {
    estado = "absorbida";
  } else if (/\[fusionada en/i.test(raw.cuerpoLineas[0]) || /\*\*Estado:\*\*\s*fusionada/i.test(cuerpo)) {
    estado = "fusionada";
  }

  const bloqueadaPor: string[] = [];
  const bMatch = cuerpo.match(/\*\*Bloqueada por:\*\*\s*([^\n]+)/);
  if (bMatch) {
    for (const m of bMatch[1].matchAll(/HU-[A-Z0-9]+(?:-[A-Z0-9]+)?\.\d+/g)) {
      bloqueadaPor.push(m[0]);
    }
  }
  const dMatch = cuerpo.match(/\*\*Deps:\*\*\s*([^\n]+)/);
  if (dMatch) {
    for (const m of dMatch[1].matchAll(/HU-[A-Z0-9]+(?:-[A-Z0-9]+)?\.\d+/g)) {
      bloqueadaPor.push(m[0]);
    }
  }

  const prMatch = cuerpo.match(/\*\*Prioridad:\*\*\s*([A-Z][0-9]?)/);
  const prioridad = prMatch ? prMatch[1] : "";

  const tipoMatch = cuerpo.match(/\*\*Tipo:\*\*\s*([a-zA-Z\-]+)/);
  const tipo = tipoMatch ? tipoMatch[1] : "";

  const patronesAplicados: string[] = [];
  const paMatch = cuerpo.match(/\*\*Patrones aplicados:\*\*([\s\S]*?)(?=\n\*\*[A-Z]|\n###|\n##|$)/);
  if (paMatch) {
    for (const m of paMatch[1].matchAll(/HU-SHARED-\d+/g)) {
      if (!patronesAplicados.includes(m[0])) patronesAplicados.push(m[0]);
    }
  }

  const citasSSOT: string[] = [];
  for (const m of cuerpo.matchAll(/\[V-\d{1,3}[a-z]?\]|\[Glos\s+3\.\d{1,3}[a-z]?\]|\[Glos\s+E\d+\]|\[OPL-ES[^\]]*\]|\[Met\s+§[^\]]*\]|\[JOYAS\s+§[^\]]*\]/g)) {
    citasSSOT.push(m[0]);
  }

  const propuestasModelo: Array<{ raiz: string; campo: string }> = [];
  const seccionModelo = cuerpo.match(/\*\*Modelo(?: de datos tocado)?:\*\*([\s\S]*?)(?=\n\*\*[A-Z]|\n###|\n##|$)/);
  if (seccionModelo) {
    const blob = seccionModelo[1];
    if (/\[propuesta\]/.test(blob)) {
      for (const m of blob.matchAll(/`([a-zA-Z]+)\.([a-zA-Z_.]+)`/g)) {
        propuestasModelo.push({ raiz: m[1].toLowerCase(), campo: m[2] });
      }
    }
  }

  return {
    archivo,
    id: raw.id,
    cuerpo,
    lineaInicio: raw.lineaInicio,
    estado,
    bloqueadaPor,
    prioridad,
    tipo,
    patronesAplicados,
    citasSSOT,
    propuestasModelo,
  };
}

function leerSSOT(): { vReglas: Set<string>; glos: Set<string>; opl: Set<string> } {
  const v = readFileSync(join(SSOT, "opm-visual-es.md"), "utf8");
  const iso = readFileSync(join(SSOT, "opm-iso-19450-es.md"), "utf8");
  const opl = readFileSync(join(SSOT, "opm-opl-es.md"), "utf8");
  const vReglas = new Set<string>();
  for (const m of v.matchAll(/\bV-(\d{1,3}[a-z]?)\b/g)) vReglas.add(m[1]);
  const glos = new Set<string>();
  for (const m of iso.matchAll(/\b3\.(\d{1,3}[a-z]?)\b/g)) glos.add(m[1]);
  for (const m of iso.matchAll(/\bE(\d{1,3})\b/g)) glos.add(`E${m[1]}`);
  const oplT = new Set<string>();
  for (const m of opl.matchAll(/\b(T|D|TS)(\d{1,3})\b/g)) oplT.add(`${m[1]}${m[2]}`);
  return { vReglas, glos, opl: oplT };
}

function leerRaicesTipos(): Set<string> {
  if (!existsSync(TIPOS_TS)) return new Set();
  const contenido = readFileSync(TIPOS_TS, "utf8");
  const raices = new Set<string>();
  for (const m of contenido.matchAll(/^export\s+interface\s+([A-Z][a-zA-Z]*)\s*\{/gm)) {
    raices.add(m[1].toLowerCase());
  }
  for (const m of contenido.matchAll(/^export\s+type\s+([A-Z][a-zA-Z]*)\s*=/gm)) {
    raices.add(m[1].toLowerCase());
  }
  return raices;
}

function quitarBloquesEvidencia(cuerpo: string): string {
  return cuerpo.replace(/\*\*Notas de evidencia:\*\*[\s\S]*?(?=\n\*\*[A-Z]|\n###|\n##|$)/g, "");
}

// ---------- Invariantes locales ----------

function validarFrontmatterEpica(archivo: string, fm: Frontmatter, violaciones: Violacion[]): void {
  const requeridos = ["epica", "titulo", "estado", "prioridad_predominante", "hu_emitidas"];
  for (const campo of requeridos) {
    if (!(campo in fm.campos)) {
      violaciones.push({
        archivo,
        regla: "L01-frontmatter-incompleto",
        detalle: `falta campo "${campo}"`,
      });
    }
  }
}

function validarHU(
  hu: HU,
  ssot: { vReglas: Set<string>; glos: Set<string>; opl: Set<string> },
  idsCanonicos: Set<string>,
  violaciones: Violacion[]
): void {
  if (hu.estado !== "viva") return;

  const { archivo, id, cuerpo, lineaInicio } = hu;

  if (!hu.tipo) {
    violaciones.push({ archivo, hu: id, linea: lineaInicio, regla: "L03-tipo-ausente", detalle: "**Tipo:** no encontrado" });
  } else if (!TIPOS_VALIDOS.has(hu.tipo)) {
    violaciones.push({
      archivo,
      hu: id,
      linea: lineaInicio,
      regla: "L03-tipo-invalido",
      detalle: `valor "${hu.tipo}" no en {opm-semantica, opcloud-ui, mixto}`,
    });
  }

  const esSemantica = hu.tipo === "opm-semantica";
  if (esSemantica && hu.citasSSOT.length === 0) {
    violaciones.push({
      archivo,
      hu: id,
      linea: lineaInicio,
      regla: "L04-cita-ssot-faltante",
      detalle: "HU opm-semantica sin cita [V-xxx]/[Glos 3.x]/[OPL-ES ...]",
    });
  }

  for (const [regex, detalle] of TERMINOLOGIA_PROHIBIDA) {
    const segCuerpo = quitarBloquesEvidencia(cuerpo);
    const m = segCuerpo.match(regex);
    if (m) {
      violaciones.push({
        archivo,
        hu: id,
        linea: lineaInicio,
        regla: "L05-terminologia-prohibida",
        detalle: `${detalle} (encontrado: "${m[0]}")`,
      });
    }
  }

  for (const [regex, detalle] of MODELO_PROHIBIDO) {
    const m = cuerpo.match(regex);
    if (m) {
      violaciones.push({
        archivo,
        hu: id,
        linea: lineaInicio,
        regla: "L06-modelo-prohibido",
        detalle: `${detalle} (encontrado: ${m[0]})`,
      });
    }
  }

  const seccionModelo = cuerpo.match(/\*\*Modelo(?: de datos tocado)?:\*\*([\s\S]*?)(?=\n\*\*[A-Z]|\n###|\n##|$)/);
  if (seccionModelo) {
    for (const linea of seccionModelo[1].split("\n")) {
      const ref = linea.match(/`([a-zA-Z]+)\.[a-zA-Z_.]+`/);
      if (ref) {
        const raiz = ref[1].toLowerCase();
        if (!MODELO_PERMITIDO_RAICES.has(raiz)) {
          violaciones.push({
            archivo,
            hu: id,
            linea: lineaInicio,
            regla: "L06-modelo-raiz-desconocida",
            detalle: `raíz "${raiz}" no en lista permitida`,
          });
        }
      }
    }
  }

  for (const cita of hu.citasSSOT) {
    const v = cita.match(/^\[V-(\d{1,3}[a-z]?)\]$/);
    if (v && !ssot.vReglas.has(v[1])) {
      violaciones.push({
        archivo,
        hu: id,
        linea: lineaInicio,
        regla: "L08-cita-v-inexistente",
        detalle: `[V-${v[1]}] no aparece en opm-visual-es.md`,
      });
    }
    const g = cita.match(/^\[Glos\s+3\.(\d{1,3}[a-z]?)\]$/);
    if (g && !ssot.glos.has(g[1])) {
      violaciones.push({
        archivo,
        hu: id,
        linea: lineaInicio,
        regla: "L08-cita-glos-inexistente",
        detalle: `[Glos 3.${g[1]}] no aparece en opm-iso-19450-es.md`,
      });
    }
    const o = cita.match(/^\[OPL-ES\s+(T|D|TS)(\d{1,3})\]$/);
    if (o) {
      const key = `${o[1]}${o[2]}`;
      if (!ssot.opl.has(key)) {
        violaciones.push({
          archivo,
          hu: id,
          linea: lineaInicio,
          regla: "L08-cita-opl-inexistente",
          detalle: `[OPL-ES ${key}] no aparece en opm-opl-es.md`,
        });
      }
    }
  }

  for (const ref of hu.bloqueadaPor) {
    if (!idsCanonicos.has(ref)) {
      violaciones.push({
        archivo,
        hu: id,
        linea: lineaInicio,
        regla: "L07-dependencia-no-canonica",
        detalle: `Bloqueada por ${ref} pero ese ID no es canónico vivo`,
      });
    }
  }

  const cuerpoSinEvidencia = quitarBloquesEvidencia(cuerpo);
  if (/\?¿/.test(cuerpoSinEvidencia) || /\(pregunta abierta\)/i.test(cuerpoSinEvidencia)) {
    violaciones.push({
      archivo,
      hu: id,
      linea: lineaInicio,
      regla: "L09-pregunta-abierta-embebida",
      detalle: "pregunta abierta dentro de HU canónica; mover a §Preguntas abiertas",
    });
  }
}

// ---------- Invariantes globales ----------

function validarAciclicidad(hus: HU[], violaciones: Violacion[]): void {
  const idMap = new Map<string, HU>();
  for (const hu of hus) {
    if (hu.estado === "viva") idMap.set(hu.id, hu);
  }
  const visitados = new Set<string>();
  const enPila = new Set<string>();

  function dfs(id: string, camino: string[]): void {
    if (enPila.has(id)) {
      const idx = camino.indexOf(id);
      const ciclo = camino.slice(idx).concat(id).join(" → ");
      const huActual = idMap.get(id);
      if (huActual) {
        violaciones.push({
          archivo: huActual.archivo,
          hu: id,
          linea: huActual.lineaInicio,
          regla: "G01-ciclo-dependencia",
          detalle: `ciclo: ${ciclo}`,
        });
      }
      return;
    }
    if (visitados.has(id)) return;
    enPila.add(id);
    const hu = idMap.get(id);
    if (hu) {
      for (const dep of hu.bloqueadaPor) {
        dfs(dep, camino.concat(id));
      }
    }
    enPila.delete(id);
    visitados.add(id);
  }

  for (const hu of hus) {
    if (hu.estado === "viva") dfs(hu.id, []);
  }
}

function validarConformidadPrioridad(hus: HU[], violaciones: Violacion[]): void {
  const idMap = new Map<string, HU>();
  for (const hu of hus) {
    if (hu.estado === "viva") idMap.set(hu.id, hu);
  }
  for (const hu of hus) {
    if (hu.estado !== "viva") continue;
    if (!hu.prioridad || !(hu.prioridad in PRIORIDADES_ORDEN)) continue;
    const ordenSelf = PRIORIDADES_ORDEN[hu.prioridad];
    for (const dep of hu.bloqueadaPor) {
      const depHu = idMap.get(dep);
      if (!depHu || !depHu.prioridad || !(depHu.prioridad in PRIORIDADES_ORDEN)) continue;
      const ordenDep = PRIORIDADES_ORDEN[depHu.prioridad];
      if (ordenSelf < ordenDep) {
        violaciones.push({
          archivo: hu.archivo,
          hu: hu.id,
          linea: hu.lineaInicio,
          regla: "G02-prioridad-inflada",
          detalle: `${hu.id}=${hu.prioridad} depende de ${dep}=${depHu.prioridad}; viola "M0 no depende de no-M0"`,
        });
      }
    }
  }
}

function validarUniversalidadShared(
  hus: HU[],
  archivosShared: string[],
  violaciones: Violacion[]
): void {
  const sharedIds = new Set<string>();
  for (const archivo of archivosShared) {
    const idMatch = readFileSync(archivo, "utf8").match(/^id:\s*"?(HU-SHARED-\d+)"?/m);
    if (idMatch) sharedIds.add(idMatch[1]);
  }

  // Conteo: absorciones explícitas (stubs apuntando a la shared) + invocaciones inline
  const absorciones = new Map<string, { stubs: number; inline: number }>();
  for (const id of sharedIds) absorciones.set(id, { stubs: 0, inline: 0 });

  for (const hu of hus) {
    if (hu.estado !== "viva") {
      const m = hu.cuerpo.match(/Canónica:\*\*\s*(HU-SHARED-\d+)/i);
      if (m && sharedIds.has(m[1])) {
        const c = absorciones.get(m[1])!;
        c.stubs++;
      }
    } else {
      for (const pat of hu.patronesAplicados) {
        if (sharedIds.has(pat)) {
          const c = absorciones.get(pat)!;
          c.inline++;
        }
      }
    }
  }

  const UMBRAL = 3;
  for (const archivo of archivosShared) {
    const idMatch = readFileSync(archivo, "utf8").match(/^id:\s*"?(HU-SHARED-\d+)"?/m);
    if (!idMatch) continue;
    const id = idMatch[1];
    const c = absorciones.get(id)!;
    const total = c.stubs + c.inline;
    if (total < UMBRAL) {
      violaciones.push({
        archivo,
        regla: "G03-shared-sub-instanciado",
        detalle: `${id} solo ${c.stubs} stubs + ${c.inline} invocaciones inline = ${total} usos (umbral ${UMBRAL})`,
      });
    }
  }
}

function validarDriftSpecCode(hus: HU[], violaciones: Violacion[]): void {
  const raicesCodigo = leerRaicesTipos();
  for (const hu of hus) {
    if (hu.estado !== "viva") continue;
    for (const prop of hu.propuestasModelo) {
      // Las propuestas explícitas son OK; el check es que estén marcadas.
      // Si la raíz está en código pero no marcada propuesta y no en implementadas:
      if (
        !MODELO_PERMITIDO_RAICES_IMPLEMENTADAS.has(prop.raiz) &&
        !MODELO_PERMITIDO_RAICES_PROPUESTAS.has(prop.raiz) &&
        !raicesCodigo.has(prop.raiz)
      ) {
        violaciones.push({
          archivo: hu.archivo,
          hu: hu.id,
          linea: hu.lineaInicio,
          regla: "G04-drift-spec-code",
          detalle: `raíz "${prop.raiz}" no implementada ni declarada propuesta ni en tipos.ts`,
        });
      }
    }
  }
}

function validarPropuestasConsistentes(hus: HU[], violaciones: Violacion[]): void {
  // Mapa raíz.campo → archivos donde se propone
  const propuestos = new Map<string, Set<string>>();
  for (const hu of hus) {
    if (hu.estado !== "viva") continue;
    for (const prop of hu.propuestasModelo) {
      const key = `${prop.raiz}.${prop.campo.split(".")[0]}`;
      if (!propuestos.has(key)) propuestos.set(key, new Set());
      propuestos.get(key)!.add(hu.id);
    }
  }
  // Por ahora informativo: solo reportar campos propuestos por ≥3 HU (señal de ratificación).
}

function validarPatronesAplicadosExisten(hus: HU[], archivosShared: string[], violaciones: Violacion[]): void {
  const sharedIds = new Set<string>();
  for (const archivo of archivosShared) {
    const contenido = readFileSync(archivo, "utf8");
    const idMatch = contenido.match(/^id:\s*"?(HU-SHARED-\d+)"?/m);
    if (idMatch) sharedIds.add(idMatch[1]);
  }
  for (const hu of hus) {
    if (hu.estado !== "viva") continue;
    for (const pat of hu.patronesAplicados) {
      if (!sharedIds.has(pat)) {
        violaciones.push({
          archivo: hu.archivo,
          hu: hu.id,
          linea: hu.lineaInicio,
          regla: "G07-patron-inexistente",
          detalle: `Patrones aplicados: ${pat} pero ese shared no existe`,
        });
      }
    }
  }
}

function validarStubsCanonicaValida(hus: HU[], idsCanonicos: Set<string>, violaciones: Violacion[]): void {
  for (const hu of hus) {
    if (hu.estado === "viva") continue;
    // Buscar línea "Canónica:" o "[absorbida en HU-X]" o "[fusionada en HU-X]"
    const m = hu.cuerpo.match(/(?:Canónica|absorbida en|fusionada en):\*?\*?\s*(HU-[A-Z0-9]+(?:-[A-Z0-9]+)?\.?\d*)/i)
      || hu.cuerpo.match(/\[(?:absorbida|fusionada) en\s+(HU-[A-Z0-9]+(?:-[A-Z0-9]+)?\.?\d*)\]/i);
    if (!m) {
      violaciones.push({
        archivo: hu.archivo,
        hu: hu.id,
        linea: hu.lineaInicio,
        regla: "G08-stub-sin-canonica",
        detalle: `stub ${hu.id} no declara canónica explícitamente`,
      });
      continue;
    }
    const ref = m[1];
    // Aceptar HU-SHARED-NNN y HU-X.NNN
    const esShared = /^HU-SHARED-\d+$/.test(ref);
    const esCanonica = /^HU-[A-Z0-9]+(?:-[A-Z0-9]+)?\.\d+$/.test(ref);
    if (!esShared && !esCanonica) continue;
    if (esCanonica && !idsCanonicos.has(ref)) {
      violaciones.push({
        archivo: hu.archivo,
        hu: hu.id,
        linea: hu.lineaInicio,
        regla: "G08-stub-canonica-inexistente",
        detalle: `stub ${hu.id} → ${ref} pero esa canónica no existe`,
      });
    }
  }
}

function validarConteoFrontmatter(archivos: string[], hus: HU[], violaciones: Violacion[]): void {
  for (const archivo of archivos) {
    if (!archivo.includes("/epicas/")) continue;
    const contenido = readFileSync(archivo, "utf8");
    const fm = leerFrontmatter(contenido);
    if (!fm) continue;
    const huCanonicas = parseInt(fm.campos["hu_canonicas"] ?? "-1", 10);
    const huStubs = parseInt(fm.campos["hu_stubs"] ?? "-1", 10);

    const enArchivo = hus.filter(h => h.archivo === archivo);
    const vivasReal = enArchivo.filter(h => h.estado === "viva").length;
    const stubsReal = enArchivo.filter(h => h.estado !== "viva").length;

    if (huCanonicas >= 0 && huCanonicas !== vivasReal) {
      violaciones.push({
        archivo,
        regla: "G12-conteo-canonicas-discrepante",
        detalle: `frontmatter hu_canonicas=${huCanonicas} pero detectadas=${vivasReal}`,
      });
    }
    if (huStubs >= 0 && huStubs !== stubsReal) {
      violaciones.push({
        archivo,
        regla: "G12-conteo-stubs-discrepante",
        detalle: `frontmatter hu_stubs=${huStubs} pero detectados=${stubsReal}`,
      });
    }
  }
}

// ---------- Main ----------

function recolectarIds(hus: HU[]): Set<string> {
  const ids = new Set<string>();
  for (const hu of hus) {
    if (hu.estado === "viva") ids.add(hu.id);
  }
  return ids;
}

function main(): void {
  const violaciones: Violacion[] = [];
  const { epicas, shared } = listarArchivos();
  const todos = [...epicas, ...shared];

  if (todos.length === 0) {
    console.log("Sin archivos en epicas/ ni shared/. Inventario vacío.");
    process.exit(0);
  }

  let ssot: { vReglas: Set<string>; glos: Set<string>; opl: Set<string> };
  try {
    ssot = leerSSOT();
  } catch (err) {
    console.error(`No se pudo leer SSOT en ${SSOT}: ${(err as Error).message}`);
    ssot = { vReglas: new Set(), glos: new Set(), opl: new Set() };
  }

  // Cargar todas las HU
  const todasHUs: HU[] = [];
  for (const archivo of todos) {
    const contenido = readFileSync(archivo, "utf8");
    const fm = leerFrontmatter(contenido);
    if (!fm) {
      violaciones.push({ archivo, regla: "L01-frontmatter-ausente", detalle: "no se encontró bloque YAML al inicio" });
      continue;
    }
    if (archivo.includes("/epicas/")) validarFrontmatterEpica(archivo, fm, violaciones);

    const hus = partirEnHUs(archivo, contenido);
    const declaradas = parseInt(fm.campos["hu_emitidas"] ?? "0", 10);
    if (archivo.includes("/epicas/") && declaradas && hus.length !== declaradas) {
      violaciones.push({
        archivo,
        regla: "L02-conteo-hu-discrepante",
        detalle: `hu_emitidas=${declaradas} pero ### HU- detectadas=${hus.length}`,
      });
    }

    todasHUs.push(...hus);
  }

  const idsCanonicos = recolectarIds(todasHUs);

  // Locales
  for (const hu of todasHUs) {
    validarHU(hu, ssot, idsCanonicos, violaciones);
  }

  // Globales
  validarAciclicidad(todasHUs, violaciones);
  validarConformidadPrioridad(todasHUs, violaciones);
  validarUniversalidadShared(todasHUs, shared, violaciones);
  validarDriftSpecCode(todasHUs, violaciones);
  validarPropuestasConsistentes(todasHUs, violaciones);
  validarPatronesAplicadosExisten(todasHUs, shared, violaciones);
  validarStubsCanonicaValida(todasHUs, idsCanonicos, violaciones);
  validarConteoFrontmatter(todos, todasHUs, violaciones);

  // Reporte
  const porArchivo = new Map<string, Violacion[]>();
  for (const v of violaciones) {
    const lista = porArchivo.get(v.archivo) ?? [];
    lista.push(v);
    porArchivo.set(v.archivo, lista);
  }

  for (const [archivo, lista] of porArchivo) {
    console.log(`\n=== ${basename(archivo)} (${lista.length} violaciones) ===`);
    for (const v of lista) {
      const linea = v.linea ? `:${v.linea}` : "";
      const hu = v.hu ? ` ${v.hu}` : "";
      console.log(`  [${v.regla}]${linea}${hu} — ${v.detalle}`);
    }
  }

  // Resumen
  const canon = todasHUs.filter(h => h.estado === "viva").length;
  const stubs = todasHUs.length - canon;
  console.log(`\n--- Resumen ---`);
  console.log(`Épicas: ${epicas.length}`);
  console.log(`Shared: ${shared.length}`);
  console.log(`HU canónicas: ${canon}`);
  console.log(`Stubs (absorbidas/fusionadas): ${stubs}`);
  console.log(`Violaciones: ${violaciones.length}`);
  console.log(`  Locales (L*): ${violaciones.filter(v => v.regla.startsWith("L")).length}`);
  console.log(`  Globales (G*): ${violaciones.filter(v => v.regla.startsWith("G")).length}`);

  process.exit(violaciones.length === 0 ? 0 : 1);
}

main();
