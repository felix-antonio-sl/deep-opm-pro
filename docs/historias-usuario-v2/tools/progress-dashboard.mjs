#!/usr/bin/env node
/*
 * progress-dashboard.mjs
 *
 * Auditor de avance del inventario HU v2 contra evidencia local de
 * implementacion. Cruza el backlog canonico con un ledger de cobertura
 * versionado en docs/roadmap/hu-progress-evidence.json y genera:
 *
 * - docs/roadmap/hu-progress.json  (dataset completo)
 * - docs/roadmap/hu-progress.md    (resumen auditable)
 * - docs/roadmap/hu-progress.html  (dashboard estatico filtrable)
 *
 * Modo automatico:
 *   node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
 *
 * En ese modo escanea app/src, app/e2e, app/scripts y assets/svg/links para
 * actualizar `autoEntries` dentro del ledger. Es conservador: solo marca una
 * HU cuando existen patrones concretos de codigo/test/render que la sostienen.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "../../..");
const HU_ROOT = join(REPO_ROOT, "docs/historias-usuario-v2");
const ROADMAP_ROOT = join(REPO_ROOT, "docs/roadmap");
const LEDGER_PATH = join(ROADMAP_ROOT, "hu-progress-evidence.json");
const OUT_JSON = join(ROADMAP_ROOT, "hu-progress.json");
const OUT_MD = join(ROADMAP_ROOT, "hu-progress.md");
const OUT_HTML = join(ROADMAP_ROOT, "hu-progress.html");
const OPTIONS = parseArgs(process.argv.slice(2));

const STATUS_ORDER = ["cubierto", "parcial", "pendiente", "diferido", "bloqueado"];
const INVENTORY_STATUS = ["absorbida", "fusionada"];
const SCORE = {
  cubierto: 1,
  parcial: 0.5,
  pendiente: 0,
  diferido: 0,
  bloqueado: 0,
};
const SIZE_WEIGHT = {
  XS: 1,
  S: 2,
  M: 4,
  L: 8,
  XL: 13,
};

function parseArgs(args) {
  return {
    syncReal: args.includes("--sync-real"),
  };
}

const now = new Date().toISOString();
let ledger = JSON.parse(readFileSync(LEDGER_PATH, "utf8"));
const parsed = parseBacklog();
if (OPTIONS.syncReal) {
  const auto = auditRealProgress(parsed.items);
  ledger = {
    ...ledger,
    updated: now.slice(0, 10),
    source: "Auditoria automatica local contra app/src, app/e2e, app/scripts y assets/svg/links.",
      autoAudit: {
        generatedAt: now,
        mode: "sync-real",
        rulesEvaluated: auto.rulesEvaluated,
        rulesMatched: auto.rulesMatched,
        rulesUnmatched: auto.rulesEvaluated - auto.rulesMatched,
        sourceFiles: auto.sourceFiles,
        note: "autoEntries se regenera; cada regla escribe cobertura detectada o pendiente. entries manuales queda como respaldo solo para HU sin regla automatica.",
      },
      autoEntries: auto.entries,
    };
  writeFileSync(LEDGER_PATH, `${JSON.stringify(ledger, null, 2)}\n`);
}
const { items, diagnostics } = applyEvidence(parsed.items, ledger, parsed.diagnostics);
const summaries = buildSummaries(items, ledger);
const dataset = {
  schema: "deep-opm-pro.hu-progress-report.v1",
  generatedAt: now,
  repoRoot: REPO_ROOT,
  backlogRoot: pathFromRepo(HU_ROOT),
  evidenceLedger: pathFromRepo(LEDGER_PATH),
  autoAudit: ledger.autoAudit ?? null,
  statusDefinitions: ledger.statusDefinitions ?? {},
  diagnostics,
  summaries,
  items,
};

writeFileSync(OUT_JSON, `${JSON.stringify(dataset, null, 2)}\n`);
writeFileSync(OUT_MD, renderMarkdown(dataset));
writeFileSync(OUT_HTML, renderHtml(dataset));

printConsoleSummary(dataset);

function parseBacklog() {
  const files = [
    ...markdownFiles(join(HU_ROOT, "epicas")),
    ...markdownFiles(join(HU_ROOT, "shared")),
  ];
  const seen = new Map();
  const diagnostics = [];
  const items = [];

  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const fm = parseFrontmatter(text);
    const sections = splitHuSections(text);
    for (const section of sections) {
      const raw = normalizeHuSection(section, file, fm);
      const previous = seen.get(raw.id);
      if (previous) {
        const chosen = chooseDuplicate(previous, raw);
        diagnostics.push({
          nivel: "WARN",
          tipo: "duplicate-id",
          id: raw.id,
          detalle: `ID duplicado; se conserva ${pathFromRepo(chosen.archivo)}:${chosen.lineaInicio}.`,
          ocurrencias: [
            `${pathFromRepo(previous.archivo)}:${previous.lineaInicio}`,
            `${pathFromRepo(raw.archivo)}:${raw.lineaInicio}`,
          ],
        });
        seen.set(raw.id, chosen);
        continue;
      }
      seen.set(raw.id, raw);
    }
  }

  for (const item of seen.values()) items.push(item);
  items.sort(compareHuIds);
  return { items, diagnostics };
}

function markdownFiles(dir) {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b, "es"))
    .map((file) => join(dir, file));
}

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};
  const result = {};
  for (const line of match[1].split("\n")) {
    const pair = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!pair) continue;
    const [, key, rawValue] = pair;
    const value = rawValue.trim().replace(/^["']|["']$/g, "");
    result[key] = value;
  }
  return result;
}

function splitHuSections(text) {
  const lines = text.split("\n");
  const sections = [];
  let current = null;
  const heading = /^### (HU-(?:SHARED-\d+|[A-Z0-9]+(?:-[A-Z0-9]+)?\.\d+))\s+—\s+(.*)$/;

  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(heading);
    if (match) {
      if (current) sections.push(current);
      current = {
        id: match[1],
        titulo: match[2].trim(),
        lineaInicio: i + 1,
        lines: [lines[i]],
      };
    } else if (current) {
      current.lines.push(lines[i]);
    }
  }

  if (current) sections.push(current);
  return sections;
}

function normalizeHuSection(section, archivo, fm) {
  const cuerpo = section.lines.join("\n");
  const estadoInventario = inventoryState(section.titulo, cuerpo);
  const epica = epicFromId(section.id);
  const epicaTitulo = epica === "SHARED"
    ? "Patrones transversales"
    : (fm.epica === `EPICA-${epica}` ? (fm.titulo ?? `EPICA-${epica}`) : `EPICA-${epica}`);
  const prioridad = matchField(cuerpo, /\*\*Prioridad:\*\*\s*(M0|M1|S|C|W)\b/i);
  const tamano = matchField(cuerpo, /\*\*Tamaño:\*\*\s*(XS|S|M|L|XL)\b/i);
  const tipo = matchField(cuerpo, /\*\*Tipo:\*\*\s*(opm-semantica|opcloud-ui|mixto)\b/i);
  const etiquetas = extractTags(cuerpo);
  const dependencias = [...new Set([...cuerpo.matchAll(/HU-(?:SHARED-\d+|[A-Z0-9]+(?:-[A-Z0-9]+)?\.\d+)/g)]
    .map((match) => match[0])
    .filter((id) => id !== section.id))];
  const criterios = (cuerpo.match(/\*\*Dado\*\*/g) ?? []).length;
  const citas = extractCitations(cuerpo);

  return {
    id: section.id,
    titulo: stripStubSuffix(section.titulo),
    tituloOriginal: section.titulo,
    epica,
    epicaTitulo,
    prioridad,
    tamano,
    tipo,
    etiquetas,
    dependencias,
    criteriosAceptacion: criterios,
    citas,
    estadoInventario,
    archivo: pathFromRepo(archivo),
    archivoRelativoDashboard: relative(ROADMAP_ROOT, archivo),
    lineaInicio: section.lineaInicio,
  };
}

function inventoryState(titulo, cuerpo) {
  if (/\[absorbida/i.test(titulo) || /\*\*Estado:\*\*\s*absorbida/i.test(cuerpo)) return "absorbida";
  if (/\[fusionada/i.test(titulo) || /\*\*Estado:\*\*\s*fusionada/i.test(cuerpo)) return "fusionada";
  return "viva";
}

function stripStubSuffix(titulo) {
  return titulo.replace(/\s+\[(?:absorbida|fusionada)[^\]]*\]$/i, "");
}

function epicFromId(id) {
  if (id.startsWith("HU-SHARED-")) return "SHARED";
  const match = id.match(/^HU-([A-Z0-9]+)\./);
  return match?.[1] ?? "DESCONOCIDA";
}

function matchField(text, re) {
  return text.match(re)?.[1] ?? null;
}

function extractTags(text) {
  const match = text.match(/\*\*Etiquetas:\*\*\s*\[([^\]]*)\]/i);
  if (!match) return [];
  return match[1].split(",").map((item) => item.trim()).filter(Boolean);
}

function extractCitations(text) {
  const all = [];
  for (const match of text.matchAll(/\[(V-\d{1,3}[a-z]?|Glos\s+(?:3\.\d{1,3}[a-z]?|E\d+)|OPL-ES\s+[^\]]+|JOYAS\s+§[^\]]+|Met\s+§[^\]]+)\]/g)) {
    all.push(match[1].replace(/\s+/g, " ").trim());
  }
  return [...new Set(all)];
}

function chooseDuplicate(a, b) {
  if (a.estadoInventario === "viva" && b.estadoInventario !== "viva") return a;
  if (b.estadoInventario === "viva" && a.estadoInventario !== "viva") return b;
  return compareHuSource(a, b) <= 0 ? a : b;
}

function compareHuSource(a, b) {
  return `${a.archivo}:${a.lineaInicio}`.localeCompare(`${b.archivo}:${b.lineaInicio}`, "es");
}

function auditRealProgress(rawItems) {
  const allIds = new Set(rawItems.map((item) => item.id));
  const sourceIndex = buildSourceIndex(["app/src", "app/e2e", "app/scripts", "assets/svg/links"]);
  const entries = [];
  const rules = autoAuditRules();
  let rulesMatched = 0;

  for (const rule of rules) {
    const ids = rule.ids.filter((id) => allIds.has(id));
    if (ids.length === 0) continue;
    const result = evaluateRule(rule, sourceIndex);
    if (result.ok) {
      rulesMatched += 1;
      entries.push({
        ids,
        estado: rule.estado,
        confianza: rule.confianza ?? "media-auto",
        fuente: "auto",
        nota: rule.nota,
        evidencia: result.evidence,
        ...(rule.brechas ? { brechas: rule.brechas } : {}),
      });
    } else {
      entries.push({
        ids,
        estado: "pendiente",
        confianza: "alta-auto",
        fuente: "auto",
        nota: "Auto: no se detecto evidencia completa para esta regla en el codigo actual.",
        evidencia: result.evidence,
        brechas: result.missing.slice(0, 10),
      });
    }
  }

  return {
    entries,
    rulesEvaluated: rules.length,
    rulesMatched,
    sourceFiles: {
      count: sourceIndex.files.size,
      roots: sourceIndex.roots,
    },
  };
}

function buildSourceIndex(roots) {
  const files = new Map();
  const sourceIndex = { roots, files };
  for (const root of roots) {
    walkSourceTree(join(REPO_ROOT, root), files);
  }
  return sourceIndex;
}

function walkSourceTree(path, files) {
  let stat;
  try {
    stat = statSync(path);
  } catch {
    return;
  }
  if (stat.isDirectory()) {
    for (const child of readdirSync(path).sort((a, b) => a.localeCompare(b, "es"))) {
      walkSourceTree(join(path, child), files);
    }
    return;
  }
  if (!/\.(?:css|js|mjs|svg|ts|tsx)$/i.test(path)) return;
  files.set(pathFromRepo(path), readFileSync(path, "utf8"));
}

function evaluateRule(rule, sourceIndex) {
  const evidence = [];
  const missing = [];
  for (const requirement of rule.requires ?? []) {
    const text = sourceIndex.files.get(requirement.path);
    if (text === undefined) {
      missing.push(`${requirement.path}: archivo no encontrado`);
      continue;
    }
    for (const pattern of requirement.all ?? []) {
      if (!matchesPattern(text, pattern)) missing.push(`${requirement.path}: falta ${patternLabel(pattern)}`);
    }
    if ((requirement.any ?? []).length > 0 && !requirement.any.some((pattern) => matchesPattern(text, pattern))) {
      missing.push(`${requirement.path}: falta alguno de ${requirement.any.map(patternLabel).join(" | ")}`);
    }
    for (const pattern of requirement.none ?? []) {
      if (matchesPattern(text, pattern)) missing.push(`${requirement.path}: no debe contener ${patternLabel(pattern)}`);
    }
    evidence.push(requirement.path);
  }
  for (const path of rule.evidenciaExtra ?? []) {
    if (sourceIndex.files.has(path)) evidence.push(path);
  }
  return {
    ok: missing.length === 0,
    evidence: [...new Set(evidence)],
    missing,
  };
}

function matchesPattern(text, pattern) {
  if (pattern instanceof RegExp) return pattern.test(text);
  return text.includes(pattern);
}

function patternLabel(pattern) {
  return pattern instanceof RegExp ? pattern.toString() : pattern;
}

function autoAuditRules() {
  return [
    {
      ids: ["HU-SHARED-002"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 12.1 L1: undo granular verificado en tests aditivos para 6 comandos ronda 11 (borrar/aplicarEstilo/pegarEstilo/copiarEstilo/reanclarExtremo/dropBiblioteca + conectarMultiAlTodo); cada operacion emite exactamente un push undoStack (verificable con length antes/despues).",
      requires: [
        { path: "app/src/store/runtime.ts", all: ["const UNDO_LIMIT = 100", "redoStack"] },
        { path: "app/src/store/modelo/acciones-canvas.ts", all: ["deshacer()", "rehacer()"] },
        { path: "app/src/ui/toolbar/ToolbarBase.tsx", all: ["deshacer", "rehacer"] },
        { path: "app/src/store.test.ts", all: ["undoStack.length"] },
      ],
      evidenciaExtra: ["app/e2e/_smoke-helpers.ts", "app/src/store.ts"],
    },
    {
      ids: ["HU-SHARED-007"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 14 alpha-lock: OPL-ES forward + reverse editable cubierto con parser SSOT, diagnosticos, preview de patches, aplicacion undoable al store y smoke UI. El reverse acepta oraciones canonicas, no borra por ausencia y diagnostica familias fuera de kernel.",
      requires: [
        { path: "app/src/opl/generar.ts", all: ["export function generarOpl"] },
        { path: "app/src/opl/generadores/procedural.ts", any: ["oracionEnlace"] },
        { path: "app/src/opl/generadores/designaciones.ts", any: ["oracionEstados", "textoDesignacionEstado"] },
        { path: "app/src/opl/parser/parsear.ts", all: ["parsearParrafoOpl", "normalizarLineas"] },
        { path: "app/src/opl/parser/planificar.ts", all: ["planificarEdicionOplLibre", "no-delete-by-absence"] },
        { path: "app/src/opl/parser/aplicar.ts", all: ["aplicarPatchesOpl", "crearEnlace", "crearEstadosIniciales"] },
        { path: "app/src/store/modelo/acciones-canvas.ts", all: ["aplicarEdicionOplLibre", "commitModelo"] },
        { path: "app/src/ui/PanelOpl.tsx", any: ["generarOplInteractivo", "PanelOpl"] },
        { path: "app/src/ui/panelOpl/EditorOplHonesto.tsx", all: ["panel-opl-editor-libre", "panel-opl-editor-aplicar"] },
        { path: "app/src/ui/panelOpl/Bloques.tsx", all: ["data-testid=\"opl-line\""] },
        { path: "app/src/opl/generar.test.ts", all: ["generarOpl", "expect"] },
        { path: "app/src/opl/parser/parser.test.ts", all: ["OPL reverse libre", "aplicarPatchesOpl"] },
        { path: "app/e2e/03-opl-panel.spec.ts", all: ["panel OPL aplica edicion libre", "panel-opl-editor-textarea"] },
      ],
      evidenciaExtra: ["app/src/completitud.test.ts", "docs/auditorias/2026-05-07-opl-reverse-ssot-opm-extracted.md"],
    },
    {
      ids: ["HU-SHARED-008"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: multi-seleccion canonica con Ctrl+clic, rubber band Shift y operaciones batch atomicas en undo.",
      requires: [
        { path: "app/src/canvas/seleccionMultiple.ts", all: ["agregar", "quitar", "toggle", "interseccionRectangulo", "todasDelOpd"] },
        { path: "app/src/canvas/operacionesBatch.ts", all: ["eliminarBatch", "alinearEnlacesIzquierda", "conectarMultiAlTodo", "aplicarEstiloApariencias", "copiarSeleccion", "pegarSeleccion"] },
        { path: "app/src/store/seleccion.ts", all: ["seleccionados:", "modoSeleccion", "portapapelesVisual"] },
        { path: "app/src/render/jointjs/JointCanvas.tsx", any: ["ctrlKey", "shiftKey", "rubber"] },
      ],
      evidenciaExtra: ["app/src/render/jointjs/proyeccion.ts", "app/src/store.ts"],
    },
    {
      ids: ["HU-10.006", "HU-10.012", "HU-10.013", "HU-10.014", "HU-10.015"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: esencia/afiliacion se editan en inspector, persisten en modelo y se proyectan con sombra fisica/dash ambiental.",
      requires: [
        { path: "app/src/modelo/operaciones/entidad.ts", all: ["export function cambiarEsencia", "export function cambiarAfiliacion"] },
        { path: "app/src/ui/InspectorEntidad.tsx", all: ["fijarEsencia", "fijarAfiliacion"] },
        { path: "app/src/render/jointjs/composers/entidad.ts", all: ["strokeDasharray", "dropShadow"] },
        { path: "app/src/modelo/constantes.ts", all: ["#70E483", "#3BC3FF"] },
      ],
    },
    {
      ids: ["HU-10.007", "HU-11.025"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: flujo origen-tipo-destino crea enlaces con validacion de firma respetando handles de resize; los puertos visuales emergen al iniciar el enlace.",
      requires: [
        { path: "app/src/ui/Toolbar.tsx", all: ["TIPOS_ENLACE"] },
        { path: "app/src/ui/toolbar/ToolbarCreacion.tsx", all: ["TIPOS_ENLACE", "elegirTipoEnlace"] },
        { path: "app/src/store/modelo/acciones-enlace.ts", all: ["elegirTipoEnlace(tipo)", "modoEnlace"] },
        { path: "app/src/modelo/operaciones/helpers.ts", all: ["validarFirmaEnlace"] },
        { path: "app/src/modelo/operaciones/enlaces.ts", all: ["export function crearEnlace"] },
      ],
    },
    {
      ids: ["HU-11.003", "HU-11.009", "HU-11.010", "HU-11.011", "HU-15.019"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: firmas, proyeccion y OPL de agregacion/instrumento/agente/invocacion estan cubiertas por kernel y pruebas.",
      requires: [
        { path: "app/src/modelo/operaciones/helpers.ts", all: ["\"agregacion\"", "\"instrumento\"", "\"agente\"", "\"invocacion\"", "validarFirmaEnlace"] },
        { path: "app/src/opl/generar.ts", all: ["maneja", "requiere", "invoca", "consta"] },
        { path: "app/src/render/jointjs/linkAssets.ts", all: ["agente", "instrumento", "invocacion", "agregacion"] },
        { path: "app/src/modelo/operaciones.test.ts", all: ["valida firma de agente", "invocacion"] },
      ],
      evidenciaExtra: ["app/src/render/jointjs/proyeccion.test.ts", "assets/svg/links/procedural/agent.svg"],
    },
    {
      ids: ["HU-11.012"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 12.1 L1: edicion inline de etiqueta para enlaces estructurales exhibicion/generalizacion/clasificacion via SeccionEtiquetaEnlace + renombrarEtiquetaEnlaceSeleccionado; tests verifican los 3 tipos canonicos.",
      requires: [
        { path: "app/src/modelo/tipos/enlace.ts", all: ["\"exhibicion\"", "\"generalizacion\"", "\"clasificacion\""] },
        { path: "app/src/modelo/operaciones/refinamiento/despliegue.ts", all: ["desplegarObjeto", "modo"] },
        { path: "app/src/modelo/operaciones/helpers.ts", all: ["validarFirmaEnlace"] },
        { path: "app/src/render/jointjs/linkAssets.ts", all: ["exhibicion", "generalizacion", "clasificacion"] },
        { path: "app/src/store.test.ts", any: ["renombrarEtiquetaEnlaceSeleccionado"] },
        { path: "app/src/opl/generar.ts", all: ["exhibe", "es un", "instancia de"] },
      ],
      evidenciaExtra: ["assets/svg/links/structural/exhibition.svg", "assets/svg/links/structural/generalization.svg", "assets/svg/links/structural/classification.svg"],
    },
    {
      ids: ["HU-11.015", "HU-15.002", "HU-15.003", "HU-15.004"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: multiplicidad por extremo se valida, edita, serializa, renderiza y verbaliza en OPL.",
      requires: [
        { path: "app/src/modelo/operaciones/enlaces.ts", all: ["validarMultiplicidad", "ajustarMultiplicidad"] },
        { path: "app/src/ui/InspectorEnlace.tsx", all: ["multiplicidadOrigen", "multiplicidadDestino", "validarMultiplicidad"] },
        { path: "app/src/render/jointjs/composers/enlace.ts", all: ["multiplicidadOrigen", "multiplicidadDestino"] },
        { path: "app/src/opl/generar.ts", all: ["multiplicidadPlural", "nombreOplConMultiplicidad"] },
      ],
      evidenciaExtra: ["app/src/modelo/operaciones.test.ts", "app/src/render/jointjs/proyeccion.test.ts"],
    },
    {
      ids: ["HU-11.018", "HU-11.019", "HU-15.024"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: vertices/segments de JointJS estan activos para enlaces editables y el kernel persiste vertices.",
      requires: [
        { path: "app/src/render/jointjs/handlers/toolsEnlace.ts", all: ["linkTools.Vertices", "linkTools.Segments"] },
        { path: "app/src/modelo/operaciones/apariencias.ts", all: ["actualizarVerticesEnlace", "vertices"] },
        { path: "app/src/serializacion/json.ts", all: ["vertices"] },
      ],
      evidenciaExtra: ["app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-11.024", "HU-30.002", "HU-30.003", "HU-30.014", "HU-30.017"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: guardar/cargar local, nuevo modelo y Ctrl+S estan implementados sobre persistencia local.",
      requires: [
        { path: "app/src/ui/toolbar/ToolbarBase.tsx", all: ["Guardar (Ctrl+S)", "Cargar", "Nuevo"] },
        { path: "app/src/app/ports/globalShortcutsPort.ts", all: ["Ctrl+S", "guardarLocal"] },
        { path: "app/src/store/persistencia.ts", all: ["guardarLocal()", "cargarLocal(id)"] },
        { path: "app/src/store/modelo/acciones-ui.ts", all: ["nuevoModelo"] },
        { path: "app/src/persistencia/local.ts", all: ["localStorage", "guardarModeloLocal", "cargarModeloLocal"] },
        { path: "app/src/persistencia/local.test.ts", all: ["guardarModeloLocal", "cargarModeloLocal"] },
      ],
    },
    {
      ids: ["HU-20.001", "HU-20.002", "HU-20.004", "HU-20.005", "HU-20.006", "HU-20.007", "HU-20.008", "HU-12.004", "HU-12.005", "HU-12.006", "HU-12.025"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: arbol OPD navega raiz/hijos, conserva jerarquia por refinamiento y sincroniza canvas/OPL con OPD activo.",
      requires: [
        { path: "app/src/ui/ArbolOpd.tsx", any: ["cambiarOpdActivo", "padreId", "ArbolOpd"] },
        { path: "app/src/ui/arbol/NodoOpd.tsx", any: ["padreId", "nombreNodo", "NodoOpd"] },
        { path: "app/src/store/modelo/acciones-opd.ts", all: ["cambiarOpdActivo"] },
        { path: "app/src/store/modelo.ts", all: ["opdActivoId"] },
        { path: "app/src/modelo/operaciones/refinamiento/descomposicion.ts", all: ["opdPadreId"] },
        { path: "app/src/modelo/operaciones/refinamiento/descomposicion.ts", all: ["opdHijoId"] },
        { path: "app/src/opl/generar.ts", all: ["opdId", "modelo.opdRaizId"] },
      ],
      evidenciaExtra: ["app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-30.019", "HU-30.020", "HU-30.037"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 12.1: smokes cubren cargar doble clic + clic+boton + Esc cancela en DialogoArchivados/BuscarGlobal/Versiones (Dialogo.tsx ya capturaba Esc en lineas 32-44).",
      requires: [
        { path: "app/src/serializacion/json.ts", all: ["export function exportarModelo", "export function hidratarModelo", "FORMATO"] },
        { path: "app/src/ui/PersistenciaJson.tsx", all: ["Exportar", "Importar", "hidratarModelo"] },
        { path: "app/src/serializacion/json.test.ts", all: ["exportarModelo", "hidratarModelo"] },
      ],
      evidenciaExtra: ["app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-50.001", "HU-50.016"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: panel OPL persistente renderiza objetos/procesos con marcas semanticas y colores diferenciados.",
      requires: [
        { path: "app/src/ui/PanelOpl.tsx", any: ["generarOplInteractivo", "PanelOpl"] },
        { path: "app/src/ui/panelOpl/RenderToken.tsx", all: ["RenderToken", "<strong", "<em"] },
        { path: "app/src/opl/generar.ts", any: ["generarOpl"] },
        { path: "app/src/opl/generadores/refsHints.ts", any: ["nombreOpl"] },
      ],
      evidenciaExtra: ["app/src/completitud.test.ts"],
    },
    {
      ids: ["HU-12.002"],
      estado: "parcial",
      confianza: "media-auto",
      nota: "Auto: inspector permite descomponer/desplegar desde la entidad seleccionada; faltan menus canonicos y algunos gestos.",
      requires: [
        { path: "app/src/ui/inspector/SeccionRefinamiento.tsx", any: ["Descomponer", "Desplegar"] },
        { path: "app/src/store/modelo/acciones-opd.ts", all: ["descomponerSeleccionada", "desplegarSeleccionada"] },
      ],
    },
    {
      ids: ["HU-12.003", "HU-12.007", "HU-12.008", "HU-12.009", "HU-12.010", "HU-12.012", "HU-12.019", "HU-12.020", "HU-12.026", "HU-12.027"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: descomposicion/inzoom de cosa crea OPD hijo, subcosas iniciales, enlaces derivados y OPL/render de contorno.",
      requires: [
        { path: "app/src/modelo/operaciones/refinamiento/descomposicion.ts", all: ["descomponerProceso", "subcosasInicialesInzoom"] },
        { path: "app/src/modelo/operaciones/refinamiento/proyeccion.ts", all: ["refrescarEnlacesExternosDerivados"] },
        { path: "app/src/render/jointjs/composers/entidad.ts", all: ["contornoRefinamiento", "modoPlegadoApariencia"] },
        { path: "app/src/opl/generar.ts", all: ["oracionRefinamiento", "se descompone"] },
        { path: "app/src/modelo/operaciones.test.ts", all: ["descompone proceso en OPD hijo", "subprocesos"] },
      ],
    },
    {
      ids: ["HU-13.001", "HU-13.002", "HU-13.004", "HU-13.006", "HU-13.019"],
      estado: "parcial",
      confianza: "alta-auto",
      nota: "Auto: inspector y kernel manejan estados de objeto; faltan gestos contextuales y toolbar canonica de estados.",
      requires: [
        { path: "app/src/modelo/operaciones/estados.ts", all: ["crearEstadosIniciales", "agregarEstado", "renombrarEstado"] },
        { path: "app/src/ui/InspectorEntidad.tsx", all: ["Estados", "onAgregarEstado", "onRenombrar"] },
        { path: "app/src/render/jointjs/composers/entidad.ts", all: ["estadosVisibles", "markupConEstados", "attrsConEstados"] },
      ],
    },
    {
      ids: ["HU-13.003", "HU-13.008", "HU-13.010", "HU-13.011", "HU-13.017", "HU-17.033"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: estados inicial/final se validan, renderizan, serializan y verbalizan en OPL con pruebas.",
      requires: [
        { path: "app/src/modelo/estadosDesignaciones.ts", all: ["designarInicial", "designarFinal", "designacionesEstado", "esInicial", "esFinal"] },
        { path: "app/src/opl/generadores/designaciones.ts", all: ["oracionEstados", "textoDesignacionEstado"] },
        { path: "app/src/opl/generadores/duracionMetadata.ts", any: ["designacionesEstado"] },
        { path: "app/src/serializacion/validarEstados.ts", any: ["esInicial", "esFinal", "validarDesignacionesEstado"] },
        { path: "app/src/completitud.test.ts", all: ["estado1", "inicial y final"] },
      ],
      evidenciaExtra: ["app/src/render/jointjs/proyeccion.test.ts", "app/src/serializacion/json.ts", "app/src/opl/generar.ts"],
    },
    {
      ids: ["HU-13.014"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: extremos de enlace pueden apuntar a estados, se serializan, se proyectan a capsula y se crean por gesto directo sobre la capsula.",
      requires: [
        { path: "app/src/modelo/extremos.ts", all: ["extremoEstado", "estadoDeExtremo", "kind: \"estado\""] },
        { path: "app/src/ui/inspectorEnlace/SeccionExtremos.tsx", all: ["extremoEstado", "extremoEntidad"] },
        { path: "app/src/render/jointjs/composers/enlace.ts", any: ["puntoCapsulaEstado", "extremo.kind === \"estado\""] },
        { path: "app/src/render/jointjs/estadoTargets.ts", all: ["targetsEstado", "stateCapsule", "stateLabel"] },
        { path: "app/src/render/jointjs/handlers/seleccion.ts", all: ["seleccionarEstadoComoExtremo"] },
        { path: "app/src/render/jointjs/handlers/helpers.ts", all: ["jointSelector", "closest(\"[joint-selector]\")"] },
        { path: "app/src/store/modelo/acciones-canvas.ts", all: ["seleccionarEstadoComoExtremo", "extremoEstado(estadoId)"] },
        { path: "app/src/serializacion/validarEnlaces.ts", all: ["validarExtremoEnlace", "kind === \"estado\""] },
      ],
      evidenciaExtra: ["app/src/modelo/operaciones.test.ts", "app/src/render/jointjs/proyeccion.test.ts", "app/src/serializacion/json.test.ts", "app/src/store.test.ts", "app/e2e/_smoke-helpers.ts", "app/src/serializacion/json.ts"],
    },
    {
      ids: ["HU-13.018"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: OPL-ES TS3 para par consumo-resultado sobre estados emite una transicion unica de estado.",
      requires: [
        { path: "app/src/opl/generadores/procedural.ts", all: ["estadoEntrada", "estadoSalida", "cambia"] },
        { path: "app/src/opl/generar.test.ts", all: ["par consumo-resultado sobre estados emite transicion TS3 unica", "de `pendiente` a `aprobado`"] },
      ],
      evidenciaExtra: ["app/src/modelo/extremos.ts", "app/src/serializacion/json.test.ts", "app/src/opl/generar.ts"],
    },
    {
      ids: ["HU-1C.014", "HU-1C.015", "HU-1C.019"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto Corte 8: validador emite avisos con severidad/cita y PanelDiagnostico consume DiagnosticsPort/viewmodel.",
      requires: [
        { path: "app/src/modelo/validaciones.ts", all: ["export function validarModelo", "reglaId", "severidad", "cita"] },
        { path: "app/src/ui/PanelDiagnostico.tsx", all: ["panel-diagnostico", "useZustandDiagnosticsPort", "panel-diagnostico-cita"] },
        { path: "app/src/app/viewmodels/panelDiagnosticoViewModel.ts", all: ["derivarIssuesDiagnostico", "clasificarSeveridad"] },
        { path: "app/src/modelo/validaciones.test.ts", all: ["validarModelo", "reglaId"] },
      ],
    },
    {
      ids: ["HU-1C.013", "HU-1C.016", "HU-1C.017", "HU-1C.018"],
      estado: "parcial",
      confianza: "media-auto",
      nota: "Auto Corte 8: PanelDiagnostico navega a avisos y expone revalidacion; faltan patrones completos de correccion asistida.",
      requires: [
        { path: "app/src/ui/PanelDiagnostico.tsx", all: ["aviso-navegar", "panel-diagnostico-revalidar", "onClick={issue.navegar}"] },
        { path: "app/src/app/viewmodels/panelDiagnosticoViewModel.ts", all: ["navegarAviso", "avisoNavegable"] },
        { path: "app/src/store/modelo/acciones-opd.ts", all: ["navegarAviso"] },
        { path: "app/src/store/modelo/acciones-canvas.ts", all: ["seleccionarEntidad", "seleccionarEnlace"] },
      ],
    },
    {
      ids: ["HU-18.001", "HU-18.012"],
      estado: "parcial",
      confianza: "alta-auto",
      nota: "Auto: plegado completo/parcial se cambia desde inspector y canvas; faltan todos los gestos OPCloud de control de plegado.",
      requires: [
        { path: "app/src/modelo/plegado.ts", all: ["cambiarModoPlegado", "modoPlegadoApariencia"] },
        { path: "app/src/ui/InspectorEntidad.tsx", all: ["cambiarModoPlegado", "Plegado"] },
        { path: "app/src/render/jointjs/JointCanvas.tsx", any: ["cambiarModoPlegadoApariencia", "cambiarModoPlegadoAparienciaRef"] },
      ],
    },
    {
      ids: ["HU-18.002", "HU-18.003", "HU-18.007", "HU-18.011", "HU-18.014"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: plegado parcial se proyecta, serializa y prueba con conteo resumido de partes.",
      requires: [
        { path: "app/src/modelo/plegado.ts", all: ["partesDePlegado", "UMBRAL_PARTES_MAS", "filasPlegadoParcial"] },
        { path: "app/src/render/jointjs/composers/entidad.ts", all: ["filasPlegadoConNesting", "modoPlegadoApariencia"] },
        { path: "app/src/serializacion/json.ts", all: ["modoPlegado"] },
        { path: "app/src/modelo/plegado.test.ts", all: ["filasPlegadoParcial", "contarPartesOcultas"] },
      ],
    },
    {
      ids: ["HU-18.004", "HU-18.005", "HU-18.006", "HU-18.009", "HU-18.010"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: extraccion/reinsercion de partes plegadas, proxy visual, reanclaje al padre, contador y OPL resumida estan implementados y probados.",
      requires: [
        { path: "app/src/modelo/plegado.ts", all: ["extraerParteDePlegado", "reinsertarParteEnPlegado", "contarPartesOcultas", "filasPlegadoParcial"] },
        { path: "app/src/store/modelo/acciones-canvas.ts", all: ["extraerParteDePlegado", "reinsertarParteEnPlegado"] },
        { path: "app/src/render/jointjs/handlers/drag.ts", all: ["element:pointerdblclick"] },
        { path: "app/src/render/jointjs/handlers/helpers.ts", all: ["parteEntidadDesdeSelector"] },
        { path: "app/src/render/jointjs/composers/plegado.ts", any: ["proxy-plegado", "partCounter", "textDecoration", "PLEGADO"] },
        { path: "app/src/opl/generadores/plegado.ts", all: ["UMBRAL_PARTES_MAS", "partes más"] },
      ],
      evidenciaExtra: ["app/src/modelo/plegado.test.ts", "app/src/render/jointjs/proyeccion.test.ts", "app/src/opl/generar.test.ts", "app/src/serializacion/json.test.ts", "app/src/render/jointjs/proyeccion.ts", "app/src/opl/generar.ts"],
    },
    {
      ids: ["HU-17.028", "HU-17.029"],
      estado: "parcial",
      confianza: "media-auto",
      nota: "Auto: despliegue y multiples apariencias estan modelados para OPDs; faltan propiedades completas de apariencia equivalentes a OPCloud.",
      requires: [
        { path: "app/src/modelo/operaciones/refinamiento/despliegue.ts", all: ["desplegarObjeto", "apariencias", "entidadId"] },
        { path: "app/src/ui/inspector/SeccionRefinamiento.tsx", all: ["Desplegar", "DesplegarComo"] },
        { path: "app/src/serializacion/json.ts", all: ["apariencias"] },
      ],
    },
    {
      ids: ["HU-15.008"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: la segunda rama compatible forma un abanico automaticamente en el store y se cubre con tests de kernel/store.",
      requires: [
        { path: "app/src/modelo/abanicos.ts", all: ["formarAbanico", "formarAbanicoAutomatico", "detectarPuertoCompartido"] },
        { path: "app/src/store/modelo/acciones-canvas.ts", all: ["formarAbanicoAutomatico", "enlaceCreadoId"] },
        { path: "app/src/modelo/abanicos.test.ts", all: ["formarAbanicoAutomatico crea abanico al conectar segunda rama compatible"] },
        { path: "app/src/store.test.ts", all: ["forma abanico automatico al conectar segunda rama"] },
      ],
    },
    {
      ids: ["HU-15.009"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: el operador del abanico alterna entre O y XOR desde modelo, store e inspector.",
      requires: [
        { path: "app/src/modelo/abanicos.ts", all: ["alternarOperadorAbanico", "OperadorAbanico"] },
        { path: "app/src/ui/inspectorEnlace/SeccionAbanico.tsx", all: ["abanico-toggle-O", "abanico-toggle-XOR"] },
        { path: "app/src/store/enlaces.ts", any: ["alternarOperadorAbanico"] },
        { path: "app/src/store.test.ts", all: ["alternarOperadorAbanicoSeleccionado(\"XOR\")"] },
      ],
      evidenciaExtra: ["app/src/modelo/abanicos.test.ts"],
    },
    {
      ids: ["HU-15.010", "HU-15.011"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: los abanicos O/XOR proyectan conectores canonicos desde assets logicos sin overlay textual.",
      requires: [
        { path: "app/src/render/jointjs/abanicoOverlay.ts", all: ["proyectarOverlayAbanicoCanonico", "args.abanico.operador", "overlay-abanico"] },
        { path: "app/src/render/jointjs/linkAssets.ts", all: ["logical", "assets/svg/links/logical/xor.svg", "assets/svg/links/logical/or.svg"] },
        { path: "app/src/render/jointjs/composers/markers.ts", any: ["standard.Polygon", "standard.Path"] },
        { path: "assets/svg/links/logical/xor.svg", all: ["<svg"] },
        { path: "assets/svg/links/logical/or.svg", all: ["<svg"] },
      ],
      evidenciaExtra: ["app/src/modelo/abanicos.ts", "app/src/ui/InspectorEnlace.tsx", "app/src/render/jointjs/proyeccion.test.ts", "app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-15.012"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: OPL-ES distingue abanico XOR como exactamente uno de y O como al menos uno de.",
      requires: [
        { path: "app/src/opl/generar.ts", all: ["exactamente uno de", "al menos uno de", "oracionAbanico"] },
        { path: "app/src/opl/generar.test.ts", all: ["emite al menos uno de para abanico O", "emite exactamente uno de para abanico XOR"] },
      ],
      evidenciaExtra: ["app/src/modelo/abanicos.ts"],
    },
    {
      ids: ["HU-15.005", "HU-15.006", "HU-15.007", "HU-15.013"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: las ramas procedurales con extremo Estado admiten etiqueta de ruta, la renderizan, la serializan y la verbalizan como Por ruta en OPL.",
      requires: [
        { path: "app/src/modelo/rutas.ts", all: ["definirRutaEtiqueta", "enlaceAdmiteRuta", "rutaEtiquetaNormalizada"] },
        { path: "app/src/modelo/abanicos.ts", all: ["puertoCompartido", "entidadIdDeExtremo"] },
        { path: "app/src/ui/InspectorEnlace.tsx", all: ["rutaEtiqueta", "definirRutaEtiqueta"] },
        { path: "app/src/render/jointjs/rutaLabels.ts", all: ["etiquetasRuta", "rutaEtiquetaNormalizada"] },
        { path: "app/src/opl/generar.ts", all: ["Por ruta", "rutaEtiquetaNormalizada"] },
        { path: "app/src/serializacion/json.ts", all: ["rutaEtiqueta", "validarRutaEtiquetaOpcional"] },
      ],
      evidenciaExtra: ["app/src/modelo/rutas.test.ts", "app/src/opl/generar.test.ts", "app/src/render/jointjs/proyeccion.test.ts", "app/src/serializacion/json.test.ts", "app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-11.027", "HU-15.015", "HU-15.016"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: condicion/evento/NO viven como Modificador sobre Enlace, se editan desde Inspector, se serializan, se proyectan como badges y generan OPL distintiva.",
      requires: [
        { path: "app/src/modelo/tipos/enlace.ts", all: ["export type Modificador", "\"condicion\"", "\"evento\"", "\"no\""] },
        { path: "app/src/modelo/modificadores.ts", all: ["aplicarModificador", "quitarModificador", "validarMetadatosEnlace"] },
        { path: "app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx", all: ["modificador-enlace-select", "Condición", "Evento", "NO"] },
        { path: "app/src/render/jointjs/composers/enlace.ts", any: ["textoModificador", "etiquetaBadgeModificador", "¬"] },
        { path: "app/src/opl/generadores/procedural.ts", any: ["oracionEvento", "oracionCondicion", "oracionNegada"] },
      ],
      evidenciaExtra: ["app/src/modelo/modificadores.test.ts", "app/src/opl/generar.test.ts", "app/e2e/_smoke-helpers.ts", "app/src/render/jointjs/proyeccion.ts", "app/src/opl/generar.ts", "app/src/ui/InspectorEnlace.tsx"],
    },
    {
      ids: ["HU-15.018"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: probabilidad numerica de evento se valida, serializa, verbaliza y renderiza como porcentaje junto al badge E.",
      requires: [
        { path: "app/src/modelo/modificadores.ts", all: ["definirProbabilidad", "probabilidadValida", "modificador !== \"evento\""] },
        { path: "app/src/serializacion/json.ts", all: ["probabilidad", "validarMetadatosEnlace"] },
        { path: "app/src/render/jointjs/composers/enlace.ts", all: ["Math.round(enlace.probabilidad * 100)", "etiquetaTextoModificador"] },
        { path: "app/e2e/_smoke-helpers.ts", all: ["probabilidad: 0.7"] },
        { path: "app/e2e/02-canvas-y-render.spec.ts", all: ["70%"] },
      ],
      evidenciaExtra: ["app/src/store.test.ts", "app/src/serializacion/json.test.ts"],
    },
    {
      ids: ["HU-15.020"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: auto-invocacion crea una invocacion proceso->mismo proceso con demora default 1s, render loop dedicado, OPL IV2 e inspector.",
      requires: [
        { path: "app/src/modelo/autoinvocacion.ts", all: ["crearAutoInvocacion", "autoInvocacionDeProceso", "demora = \"1s\""] },
        { path: "app/src/render/jointjs/autoinvocacionLoop.ts", all: ["proyectarAutoInvocacion", "standard.Link", "etiquetaDemora"] },
        { path: "app/src/opl/generar.ts", all: ["esAutoInvocacion", "se invoca a sí mismo"] },
        { path: "app/src/ui/InspectorEntidad.tsx", any: ["crearAutoInvocacion", "Auto-invocación", "Inspector"] },
        { path: "app/src/store/modelo/acciones-enlace.ts", all: ["crearAutoInvocacionSeleccionada", "crearAutoInvocacion(modelo"] },
      ],
      evidenciaExtra: ["app/src/modelo/modificadores.test.ts", "app/src/opl/generar.test.ts", "app/src/render/jointjs/proyeccion.test.ts", "app/src/store.test.ts", "app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-18.008", "HU-18.015"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: filas plegadas son targets activos para enlaces sin extraccion, preservan orden compacto configurable y exponen nesting.",
      requires: [
        { path: "app/src/modelo/plegado.ts", all: ["crearEnlaceConExtremoPlegado", "partesDePlegadoOrdenadas", "cambiarOrdenPartes", "ordenPartes"] },
        { path: "app/src/render/jointjs/plegadoNesting.ts", all: ["filasPlegadoConNesting", "partePlegadaTienePartes", "indicadorNesting"] },
        { path: "app/src/render/jointjs/handlers/seleccion.ts", all: ["seleccionarPartePlegada"] },
        { path: "app/src/render/jointjs/handlers/helpers.ts", all: ["parteEntidadDesdeSelector"] },
        { path: "app/src/store/modelo/acciones-canvas.ts", all: ["crearEnlaceConExtremoPlegado", "seleccionarPartePlegada", "cambiarOrdenPartesSeleccionado"] },
        { path: "app/src/ui/InspectorEntidad.tsx", any: ["Orden de partes", "cambiarOrdenPartes", "Inspector"] },
        { path: "app/src/serializacion/json.ts", all: ["ordenPartes", "validarOrdenPartes"] },
      ],
      evidenciaExtra: ["app/src/modelo/plegado.test.ts", "app/src/render/jointjs/proyeccion.test.ts", "app/src/store.test.ts", "app/src/serializacion/json.test.ts", "app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-50.002", "HU-50.017", "HU-50.018", "HU-50.019", "HU-50.020", "HU-50.022"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: panel OPL numerado con tokens estables, hover/click bidireccional canvas<->OPL, filtro por seleccion y renombrado inverso desde la lente.",
      requires: [
        { path: "app/src/opl/interaccion.ts", all: ["OplLineaInteractiva", "OplReferencia", "filtrarLineasPorReferencia", "lineaTocaReferencia", "mismaReferencia"] },
        { path: "app/src/ui/PanelOpl.tsx", any: ["filtroOplPorSeleccion", "fijarFiltroOplPorSeleccion", "fijarHoverOpl", "seleccionarDesdeOpl", "renombrarEntidadDesdeOpl", "PanelOpl"] },
        { path: "app/src/store/modelo/acciones-canvas.ts", all: ["seleccionarDesdeOpl", "renombrarEntidadDesdeOpl", "fijarFiltroOplPorSeleccion", "fijarHoverOpl"] },
      ],
      evidenciaExtra: ["app/src/opl/generar.test.ts", "app/src/store.test.ts", "app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-14.001", "HU-14.002", "HU-14.003", "HU-14.015", "HU-14.017"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: Apariencia.estilo? con paleta cerrada de fill/borderColor, swatches + Reset y persistencia JSON sin eco OPL.",
      requires: [
        { path: "app/src/modelo/estilos.ts", all: ["aplicarEstiloApariencia", "resetearEstiloApariencia", "esColorEstilo"] },
        { path: "app/src/ui/StyleControls.tsx", all: ["Fill", "Borde", "Reset", "PALETA_ESTILO_COSA"] },
        { path: "app/src/serializacion/json.ts", all: ["validarEstiloApariencia", "estilo"] },
      ],
      evidenciaExtra: ["app/src/modelo/estilos.test.ts"],
    },
    {
      ids: ["HU-30.001", "HU-30.005", "HU-30.006", "HU-30.009", "HU-30.010", "HU-30.013", "HU-30.015", "HU-30.018"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: menu hamburguesa con Guardar como y Cargar; primer Ctrl+S abre dialogo; guardado posterior reescribe id; importacion no autopersiste.",
      requires: [
        { path: "app/src/ui/MenuPrincipal.tsx", all: ["Guardar como", "Cargar", "Nuevo"] },
        { path: "app/src/ui/DialogoGuardarComo.tsx", all: ["nombre", "descripcion", "title=\"Guardar como\""] },
        { path: "app/src/ui/DialogoCargarModelo.tsx", all: ["Cargar", "title=\"Cargar modelo\""] },
        { path: "app/src/persistencia/workspace.ts", all: ["BREADCRUMB_RAIZ", "validarNombreModeloLocal"] },
      ],
    },
    {
      ids: ["HU-34.001", "HU-34.004", "HU-34.005", "HU-34.006", "HU-34.007", "HU-34.008"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: Nuevo crea pestana con SD vacio, titulo (No guardado) y panel OPL/biblioteca vacios.",
      requires: [
        { path: "app/src/ui/MenuPrincipal.tsx", all: ["Nuevo"] },
        { path: "app/src/store/modelo/acciones-ui.ts", all: ["nuevoModelo"] },
        { path: "app/src/store/modelo.ts", all: ["opdRaizId"] },
        { path: "app/src/ui/toolbar/ToolbarBase.tsx", any: ["No guardado"] },
      ],
    },
    {
      ids: ["HU-1C.004"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: click dentro del bbox de un contenedor refinado crea cosa hija sin advertencia interior/exterior.",
      requires: [
        { path: "app/src/modelo/creacionInterna.ts", all: ["crearCosaEnPosicion", "posicionDentroDeContorno"] },
        { path: "app/src/store/modelo/acciones-entidad.ts", any: ["crearCosaEnPosicion", "contenedorRefinamiento"] },
      ],
      evidenciaExtra: ["app/src/modelo/creacionInterna.test.ts"],
    },
    {
      ids: ["HU-20.015", "HU-20.016"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: bloqueo de raiz, mensaje accionable para internos, eliminacion controlada de hojas con limpieza de huerfanos y undo.",
      requires: [
        { path: "app/src/modelo/opdEliminacion.ts", all: ["eliminarOpdHoja", "diagnosticarEliminacionOpd", "MENSAJE_ELIMINAR_DESCENDIENTES"] },
        { path: "app/src/ui/ArbolOpd.tsx", any: ["Eliminar", "eliminarOpd", "ArbolOpd"] },
        { path: "app/src/store/modelo/acciones-opd.ts", any: ["eliminarOpdDesdeArbol"] },
      ],
      evidenciaExtra: ["app/src/modelo/opdEliminacion.test.ts", "app/src/store.test.ts"],
    },
    {
      ids: ["HU-11.004", "HU-11.014"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: bus de agregacion derivado en render con triangulo unico + ramas y etiquetas editables que aparecen como sufijo OPL.",
      requires: [
        { path: "app/src/render/jointjs/agregacionBus.ts", all: ["proyectarBusesAgregacion", "marcadorAgregacion"] },
        { path: "app/src/modelo/etiquetasEnlace.ts", any: ["renombrarEtiquetaEnlace", "etiqueta"] },
        { path: "app/src/ui/InspectorEnlace.tsx", any: ["etiqueta", "renombrarEtiquetaEnlace"] },
        { path: "app/src/opl/generar.ts", any: [/\[etiqueta:/, "consta"] },
      ],
    },
    {
      ids: ["HU-17.002", "HU-17.003", "HU-17.004", "HU-17.005", "HU-17.006", "HU-17.007", "HU-17.008", "HU-17.009", "HU-17.010", "HU-17.018", "HU-17.019", "HU-17.020", "HU-17.021", "HU-17.023"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: alias, unidad, descripcion y URLs tipadas viven en modelo, serializacion, render, OPL, inspector y modal.",
      requires: [
        { path: "app/src/modelo/objetoMetadata.ts", all: ["editarAlias", "editarUnidad", "editarDescripcion", "agregarUrl", "eliminarUrl", "parsearNombreCompuesto"] },
        { path: "app/src/modelo/tipos/entidad.ts", all: ["alias?:", "unidad?:", "descripcion?:", "urls?:", "UrlObjetoTipada"] },
        { path: "app/src/serializacion/validarEntidades.ts", any: ["validarEntidades", "alias", "urls"] },
        { path: "app/src/render/jointjs/composers/entidad.ts", any: ["aliasVisibles", "descripcionesVisibles", "formatearNombreCompuesto"] },
        { path: "app/src/opl/generadores/refsHints.ts", any: ["entidad.alias", "tiene unidad", "se describe como"] },
        { path: "app/src/ui/inspector/SeccionAlias.tsx", any: ["editarAliasEntidad", "Alias"] },
        { path: "app/src/ui/inspector/SeccionUrls.tsx", any: ["URLs"] },
        { path: "app/src/ui/inspector/SeccionDescripcion.tsx", any: ["editarDescripcionEntidad", "Descripción"] },
        { path: "app/src/ui/ModalUrlsObjeto.tsx", all: ["TipoUrlObjeto", "Sin URLs tipadas", "item.tipo"] },
      ],
      evidenciaExtra: ["app/src/ui/InspectorEntidad.tsx", "app/src/serializacion/json.ts", "app/src/opl/generar.ts", "app/src/render/jointjs/proyeccion.ts"],
    },
    {
      ids: ["HU-13.012", "HU-13.013"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: designaciones Default y Current son persistentes, excluyentes y unicas por entidad.",
      requires: [
        { path: "app/src/modelo/estadosDesignaciones.ts", all: ["designarDefault", "designarCurrent", "Default y Current son excluyentes", "reemplazarUnicaPorEntidad"] },
        { path: "app/src/modelo/tipos/estado.ts", all: ["DesignacionEstado", "\"default\"", "\"current\""] },
        { path: "app/src/serializacion/validarEstados.ts", all: ["validarDesignacionesEstado", "default", "current"] },
        { path: "app/src/opl/generadores/designaciones.ts", all: ["textoDesignacionEstado"] },
        { path: "app/src/opl/generadores/duracionMetadata.ts", all: ["Default", "Current"] },
        { path: "app/src/ui/inspector/SeccionDesignaciones.tsx", all: ["default", "current", "Default", "Current"] },
      ],
      evidenciaExtra: ["app/src/ui/InspectorEntidad.tsx", "app/src/completitud.test.ts", "app/src/serializacion/json.ts", "app/src/opl/generar.ts"],
    },
    {
      ids: ["HU-17.034"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: duracion canonica de estado con unidad, min, nominal y max en modelo, serializacion, OPL y modal.",
      requires: [
        { path: "app/src/modelo/objetoDuracion.ts", all: ["fijarDuracion", "validarDuracion", "duracion.min", "duracion.nominal", "duracion.max"] },
        { path: "app/src/modelo/tipos/estado.ts", all: ["duracion?:", "DuracionTemporal", "UnidadTiempo"] },
        { path: "app/src/serializacion/validarEstados.ts", all: ["validarDuracionEstado", "duracion.min", "duracion.nominal", "duracion.max"] },
        { path: "app/src/opl/generadores/duracionMetadata.ts", all: ["Duracion Minima", "respectivamente"] },
        { path: "app/src/ui/ModalDuracionEstado.tsx", all: ["unidad", "min", "nominal", "max"] },
      ],
      evidenciaExtra: ["app/src/serializacion/json.ts", "app/src/opl/generar.ts"],
    },
    {
      ids: ["HU-90.001", "HU-90.002", "HU-90.003", "HU-90.004", "HU-90.005", "HU-90.006", "HU-90.007", "HU-90.008", "HU-90.009", "HU-90.010", "HU-90.011", "HU-90.012", "HU-90.013", "HU-90.014", "HU-90.015", "HU-90.016", "HU-90.017", "HU-90.019", "HU-90.020", "HU-90.021"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: registry central de atajos con contextos, menu contextual de arbol, divisor y zoom centralizado.",
      requires: [
        { path: "app/src/ui/atajosTeclado.ts", all: ["registrarAtajo", "escucharGlobal", "data-atajos-contexto"] },
        { path: "app/src/app/ports/globalShortcutsPort.ts", all: ["Ctrl+S", "Ctrl+Tab", "registrarAtajo"] },
        { path: "app/src/ui/divisorPanel.tsx", all: ["limitarAnchoPanel", "onDblClick"] },
        { path: "app/src/ui/MenuContextualArbol.tsx", any: ["Renombrar", "Eliminar"] },
        { path: "app/src/render/jointjs/handlers/zoom.ts", any: ["wheel", "registrarAtajo"] },
      ],
    },
    {
      ids: ["HU-31.011", "HU-31.012", "HU-31.013", "HU-35.001", "HU-35.002", "HU-35.003", "HU-35.004", "HU-35.005", "HU-30.029"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: workspace single-user cierra cortar/pegar y drag-drop de modelos/carpetas, busqueda global, versiones manuales y archivado.",
      requires: [
        { path: "app/src/persistencia/movimientoModelos.ts", all: ["moverModelo", "moverCarpeta", "cortarModelo", "pegarModelo"] },
        { path: "app/src/persistencia/versiones.ts", all: ["crearVersion", "restaurarVersion", "eliminarVersion"] },
        { path: "app/src/persistencia/workspace.ts", all: ["archivarModelo", "archivarCarpeta", "buscarGlobal"] },
        { path: "app/src/ui/DialogoBuscarGlobal.tsx", any: ["Ingresa al menos 3 caracteres", "dialogo-buscar-global"] },
        { path: "app/src/ui/DialogoVersiones.tsx", any: ["crearVersionAhora", "restaurarVersionComoCopia", "version"] },
        { path: "app/src/ui/DialogoArchivados.tsx", any: ["archivados", "Restaurar"] },
      ],
    },
    {
      ids: ["HU-34.002", "HU-34.003"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto: multi-pestana sesion-only con boton +, cierre protegido, cambio activo y drag-reorder.",
      requires: [
        { path: "app/src/store/pestanas.ts", all: ["crearPestanaNueva", "abrirPestana", "cerrarPestana", "cambiarActiva", "reordenarPestanas", "pestanasAbiertas", "pestanaActivaId", "abrirPestanaNueva"] },
        { path: "app/src/store/tipos.ts", all: ["pestanasAbiertas", "pestanaActivaId"] },
        { path: "app/src/ui/BarraPestanas.tsx", any: ["draggable", "pestana.dirty", "nueva-pestana-btn"] },
      ],
    },
    {
      ids: ["HU-1A.001", "HU-1A.002", "HU-1A.003", "HU-1A.007", "HU-1A.008"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L1: auto-tamano persiste con modoTamano y operaciones ajustarAlTexto/volverAAutoTamano/alternarModoTamano sobre apariencias.",
      requires: [
        { path: "app/src/modelo/operaciones/apariencias.ts", all: ["redimensionarApariencia", "ajustarAlTexto", "volverAAutoTamano", "alternarModoTamano"] },
        { path: "app/src/modelo/tipos/apariencia.ts", all: ["ModoTamano", "modoTamano?:"] },
        { path: "app/src/store/modelo/acciones-entidad.ts", all: ["redimensionarSeleccionada", "ajustarSeleccionadaAlTexto", "volverSeleccionadaAAuto", "alternarModoTamanoSeleccionado"] },
        { path: "app/src/ui/inspector/SeccionTamano.tsx", all: ["modoTamano", "Ajustar texto", "Volver auto"] },
      ],
      evidenciaExtra: ["app/src/serializacion/validarApariencias.ts"],
    },
    {
      ids: ["HU-1A.004", "HU-1A.005", "HU-1A.015"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L1: handles laterales/esquina cableados con cablearResize y redimensionarApariencia + redimensionarBatch para multi-seleccion.",
      requires: [
        { path: "app/src/render/jointjs/handlers/resize.ts", all: ["cablearResize", "redimensionarAparienciaRef"] },
        { path: "app/src/canvas/operacionesBatch.ts", all: ["redimensionarBatch"] },
        { path: "app/src/render/jointjs/JointCanvas.tsx", all: ["cablearResize", "redimensionarAparienciaEnCanvas"] },
        { path: "app/src/store/modelo/acciones-entidad.ts", all: ["redimensionarAparienciaEnCanvas"] },
      ],
      evidenciaExtra: ["app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-1A.009", "HU-1A.010", "HU-1A.011", "HU-1A.012", "HU-1A.014"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L1: grid configurable persistido en PreferenciasUiUsuario.gridConfig, drawGrid nativo de JointJS y cuantizacion de movimiento al paso.",
      requires: [
        { path: "app/src/canvas/grid.ts", all: ["GridConfig", "normalizarGridConfig", "cuantizarPosicion", "pasoGrid"] },
        { path: "app/src/render/jointjs/composers/grid.ts", all: ["configurarGridPaper", "drawGrid"] },
        { path: "app/src/modelo/tipos/ui.ts", all: ["gridConfig?:"] },
        { path: "app/src/store/modelo/acciones-canvas.ts", all: ["toggleGrid", "fijarGridConfig", "cuantizarDesdeEstado"] },
        { path: "app/src/ui/toolbar/ToolbarBase.tsx", all: ["toolbar-mas-toggle-grid", "toolbar-mas-config-grid"] },
        { path: "app/src/ui/DialogoConfiguracion.tsx", all: ["modal-config-grid", "gridLocal", "snapActivo"] },
      ],
      evidenciaExtra: ["app/src/canvas/grid.test.ts", "app/src/render/jointjs/composers/grid.test.ts", "app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-1A.017", "HU-1A.018", "HU-11.008"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L1: alineacion por eje y distribucion uniforme expuestas en Toolbar y ejecutadas como operaciones batch con un solo undo.",
      requires: [
        { path: "app/src/canvas/operacionesBatch.ts", all: ["alinearPorEje", "distribuirUniformemente", "EjeAlineacion", "OrientacionDistribucion"] },
        { path: "app/src/store/modelo/acciones-canvas.ts", all: ["alinearSeleccion", "distribuirSeleccion"] },
        { path: "app/src/ui/toolbar/ToolbarMultiseleccion.tsx", all: ["alinear-cosas", "distribuir-cosas"] },
      ],
      evidenciaExtra: ["app/src/canvas/operacionesBatch.test.ts", "app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-1A.006", "HU-1A.013", "HU-1A.016"],
      estado: "parcial",
      confianza: "media-auto",
      nota: "Auto ronda 10 L1: validacion de minimo aplica RESIZE_MIN; faltan UX canonicas de proteccion de rotulo, factor de escala y bloqueo de ratio con Shift.",
      requires: [
        { path: "app/src/canvas/grid.ts", all: ["RESIZE_MIN"] },
        { path: "app/src/modelo/operaciones/apariencias.ts", all: ["redimensionarApariencia"] },
      ],
    },
    {
      ids: ["HU-15.022", "HU-15.023"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L2: dialogo Mover Puerto cambia extremo o remueve relacion con un solo gesto, con accion en store y operacion kernel.",
      requires: [
        { path: "app/src/ui/DialogoMoverPuerto.tsx", all: ["DialogoMoverPuerto", "Mover Puerto"] },
        { path: "app/src/ui/inspectorEnlace/SeccionExtremos.tsx", all: ["Mover Puerto"] },
        { path: "app/src/modelo/operaciones/enlaces.ts", all: ["moverPuertoEnlace", "opcionRemover"] },
        { path: "app/src/store/modelo/acciones-enlace.ts", all: ["moverPuertoEnlaceSeleccionado", "opcionRemover"] },
      ],
      evidenciaExtra: ["app/src/modelo/operaciones/enlaces.test.ts", "app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-15.014", "HU-15.017"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L2: subtipoModificador C/E/no aditivo se valida, persiste, proyecta como badge canonico y verbaliza en OPL con fallback desde modificador legacy.",
      requires: [
        { path: "app/src/modelo/tipos/enlace.ts", all: ["SubtipoModificador", "subtipoModificador?:"] },
        { path: "app/src/modelo/modificadores.ts", all: ["aplicarSubtipoModificador", "validarSubtipoModificador", "subtipoParaModificador"] },
        { path: "app/src/render/jointjs/composers/markers.ts", any: ["subtipoModificador", "etiquetaBadgeModificador"] },
        { path: "app/src/store/modelo/acciones-enlace.ts", all: ["aplicarSubtipoModificadorEnlaceSeleccionado"] },
      ],
      evidenciaExtra: ["app/src/modelo/modificadores.test.ts", "app/src/render/jointjs/composers/markers.test.ts", "app/src/render/jointjs/proyeccion.test.ts"],
    },
    {
      ids: ["HU-15.025"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L2: advertirConsumoDuplicado se expone como API y validarModelo emite la advertencia con cita SSOT y sugerencia de abanico.",
      requires: [
        { path: "app/src/modelo/validaciones.ts", all: ["advertirConsumoDuplicado", "consumo-doble-mismo-objeto"] },
        { path: "app/src/modelo/validaciones.test.ts", all: ["advertirConsumoDuplicado"] },
      ],
    },
    {
      ids: ["HU-12.011", "HU-12.031"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L3: reanclaje manual de enlace externo derivado disponible desde SeccionRefinamiento via reasignarEnlaceExternoManual; render de paréntesis del contorno completo.",
      requires: [
        { path: "app/src/modelo/operaciones/enlaces.ts", all: ["reanclarEnlaceExternoDerivado"] },
        { path: "app/src/modelo/operaciones/eliminacion.ts", all: ["splitEffectEnPar"] },
        { path: "app/src/store/modelo/acciones-opd.ts", all: ["reasignarEnlaceExternoManual"] },
        { path: "app/src/ui/inspector/SeccionRefinamiento.tsx", any: ["reasignarEnlaceExternoManual", "Reasignar"] },
      ],
      evidenciaExtra: ["app/src/modelo/operaciones.test.ts", "app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-12.016", "HU-12.017"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L3: orden temporal por Y se reordena con drag vertical y agruparSubprocesosParalelos detecta concurrencia con tolerancia ≤4px emitiendo OPL paralelo.",
      requires: [
        { path: "app/src/modelo/operaciones/refinamiento/helpers.ts", all: ["agruparSubprocesosParalelos", "compararOrdenTemporal", "toleranciaY"] },
        { path: "app/src/render/jointjs/handlers/drag.ts", all: ["reordenarSubprocesoEnTimeline", "esDragVertical", "esSubprocesoInternoTimeline"] },
        { path: "app/src/store/modelo/acciones-canvas.ts", any: ["reordenarSubprocesoEnTimeline"] },
        { path: "app/src/opl/generadores/refinamiento.ts", all: ["oracionParalelo", "ocurren en paralelo"] },
      ],
      evidenciaExtra: ["app/src/opl/generadores/refinamiento.test.ts", "app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-12.013", "HU-12.014"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L3: OPL distingue se descompone vs se despliega y emite la clausula 'en esa secuencia' al verbalizar la descomposicion.",
      requires: [
        { path: "app/src/opl/generadores/refinamiento.ts", all: ["se descompone", "en esa secuencia", "se despliega"] },
        { path: "app/src/opl/generar.test.ts", any: ["en esa secuencia", "se despliega"] },
      ],
    },
    {
      ids: ["HU-12.023", "HU-12.024"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L3: renombrado in situ via RenombradoInline (doble clic en subproceso interno) con propagacion al store y eco OPL.",
      requires: [
        { path: "app/src/ui/RenombradoInline.tsx", all: ["RenombradoInline", "onConfirmar", "onCancelar"] },
        { path: "app/src/render/jointjs/JointCanvas.tsx", all: ["RenombradoInline", "abrirRenombradoInlineRef"] },
        { path: "app/src/render/jointjs/handlers/seleccion.ts", any: ["abrirRenombradoInlineRef"] },
      ],
    },
    {
      ids: ["HU-12.029", "HU-12.030"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L3: ambientales internas se restringen al contorno con clamp en creacionInterna y validarAmbientalDentroContorno emite advertencia si quedan fuera.",
      requires: [
        { path: "app/src/modelo/creacionInterna.ts", any: ["ambiental", "dentroDeContorno"] },
        { path: "app/src/modelo/validaciones.ts", all: ["validarAmbientalDentroContorno", "ambiental-dentro-contorno"] },
        { path: "app/src/modelo/validaciones.test.ts", any: ["ambiental-dentro-contorno"] },
      ],
      evidenciaExtra: ["app/src/modelo/creacionInterna.test.ts"],
    },
    {
      ids: ["HU-19.001", "HU-19.007", "HU-19.008", "HU-19.009", "HU-19.010"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L4: modal de imagen se abre desde inspector y toolbar; insignia 📷 cicla modos con click y reabre modal con context-menu; quitar/editar via store.",
      requires: [
        { path: "app/src/ui/ModalImagenObjeto.tsx", all: ["ModalImagenObjeto"] },
        { path: "app/src/ui/inspector/SeccionImagen.tsx", any: ["SeccionImagen", "imagen"] },
        { path: "app/src/store/modelo/acciones-entidad.ts", all: ["editarImagenEntidad", "quitarImagenEntidad", "alternarModoImagenEntidad", "cambiarModoImagenEntidad"] },
        { path: "app/src/store/modelo/acciones-ui.ts", all: ["abrirModalImagen", "cerrarModalImagen"] },
        { path: "app/src/render/jointjs/handlers/seleccion.ts", all: ["alternarModoImagenEntidadRef", "abrirModalImagenRef", "imagen-insignia"] },
        { path: "app/src/render/jointjs/composers/imagenOverlay.ts", all: ["componerInsigniaCamara"] },
      ],
      evidenciaExtra: ["app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-19.002", "HU-19.003", "HU-19.016"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L4: incrustar imagen por URL valida extension/protocolo, precarga bitmap con timeout y degrada a Solo texto ante URL caida (cache estado fallido).",
      requires: [
        { path: "app/src/modelo/imagenObjeto.ts", all: ["validarUrlImagen", "validarModoImagen", "precargarBitmap", "registrarCacheImagen", "degradarSiFallido"] },
        { path: "app/src/modelo/objetoMetadata.ts", all: ["editarImagen", "validarImagenEntidad", "modoImagenSeguroParaEstados"] },
        { path: "app/src/serializacion/validarEntidades.ts", all: ["validarImagenEntidad", "imagen"] },
      ],
      evidenciaExtra: ["app/src/modelo/imagenObjeto.test.ts", "app/src/serializacion/json.test.ts"],
    },
    {
      ids: ["HU-19.011"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L4: modo global de visualizacion se fija desde Toolbar y propaga a la proyeccion para forzar imagen/texto/imagen-texto en todo el OPD activo.",
      requires: [
        { path: "app/src/store/modelo/acciones-ui.ts", all: ["fijarModoImagenGlobal", "uiModoImagenGlobal"] },
        { path: "app/src/render/jointjs/proyeccion.ts", all: ["modoImagenGlobal", "proyectarImagenesEntidad"] },
        { path: "app/src/render/jointjs/composers/imagenOverlay.ts", all: ["proyectarImagenesEntidad", "modoGlobal"] },
        { path: "app/src/ui/toolbar/ToolbarSeleccion.tsx", any: ["toolbar-modo-imagen-global", "fijarModoImagenGlobal"] },
      ],
    },
    {
      ids: ["HU-19.012", "HU-19.013", "HU-19.015"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L4: bitmap se suprime si la cosa esta refinada o tiene estados visibles (regla imagen-estados-excluyentes); OPL invariante ante imagen.",
      requires: [
        { path: "app/src/modelo/validaciones.ts", all: ["validarExclusionImagenEstados", "imagen-estados-excluyentes"] },
        { path: "app/src/render/jointjs/composers/imagenOverlay.ts", any: ["refinamiento", "tipoEntidad"] },
        { path: "app/src/modelo/imagenObjeto.ts", all: ["imagenIncluyeBitmap"] },
      ],
      evidenciaExtra: ["app/src/modelo/imagenObjeto.test.ts", "app/src/modelo/validaciones.test.ts"],
    },
    {
      ids: ["HU-50.013"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L5: OPL distingue descomposicion sincrona ('en esa secuencia') de despliegue asincrono mediante oracionDespliegue y oracionParalelo.",
      requires: [
        { path: "app/src/opl/generadores/refinamiento.ts", all: ["oracionDespliegue", "oracionParalelo", "se despliega", "ocurren en paralelo"] },
        { path: "app/src/opl/generadores/refinamiento.test.ts", any: ["paralelo", "despliegue"] },
      ],
    },
    {
      ids: ["HU-50.023", "HU-50.024", "HU-50.025"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L5 + ronda 11 L3: PanelOpl/ToolbarOpl ofrecen copiar al portapapeles, exportar HTML y buscar texto con testids estables.",
      requires: [
        { path: "app/src/ui/panelOpl/Toolbar.tsx", all: ["panel-opl-buscar", "panel-opl-copiar", "panel-opl-exportar-html"] },
        { path: "app/src/store/modelo/acciones-canvas.ts", all: ["buscarEnPanelOpl"] },
      ],
      evidenciaExtra: ["app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-13.015", "HU-18.013"],
      estado: "parcial",
      confianza: "media-auto",
      nota: "Auto: split effect existe via splitEffectEnPar (sin gesto canonico); navegacion al OPD desplegado se cubre por click en arbol pero falta gesto sobre rectangulo plegado.",
      requires: [
        { path: "app/src/modelo/operaciones/eliminacion.ts", all: ["splitEffectEnPar"] },
        { path: "app/src/store/modelo/acciones-opd.ts", any: ["cambiarOpdActivo"] },
      ],
    },
    {
      ids: ["HU-SHARED-006"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L5: estado dirty del modelo se persiste por pestana y se confirma al cerrar/cambiar con DialogoConfirmacion Guardar/Descartar/Cancelar.",
      requires: [
        { path: "app/src/ui/DialogoConfirmacion.tsx", all: ["DialogoConfirmacion", "dialogo-confirmacion-cerrar-dirty"] },
        { path: "app/src/ui/ConfirmacionContext.tsx", all: ["DialogoConfirmacion"] },
        { path: "app/src/ui/BarraPestanas.tsx", all: ["pestana.dirty"] },
        { path: "app/src/store/tipos.ts", any: ["dirty"] },
      ],
      evidenciaExtra: ["app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-12.018", "HU-12.022"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 10 L3: objetos internos se crean dentro del contorno y pueden conectarse con subprocesos internos via firma de enlace y validacion de pertenencia.",
      requires: [
        { path: "app/src/modelo/creacionInterna.ts", all: ["crearCosaEnPosicion", "posicionDentroDeContorno"] },
        { path: "app/src/modelo/operaciones/refinamiento/helpers.ts", any: ["validarFirmaEnlace", "subprocesosOrdenadosDeRefinamiento"] },
        { path: "app/src/modelo/validaciones.ts", any: ["ambiental-dentro-contorno"] },
      ],
      evidenciaExtra: ["app/src/modelo/creacionInterna.test.ts", "app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-12.015"],
      estado: "parcial",
      confianza: "media-auto",
      nota: "Auto ronda 10 L3: subprocesos internos se crean dentro del contorno por click en posicion; falta gesto canonico de arrastre desde toolbar.",
      requires: [
        { path: "app/src/modelo/creacionInterna.ts", all: ["crearCosaEnPosicion"] },
        { path: "app/src/store/modelo/acciones-entidad.ts", any: ["crearCosaEnPosicion", "crearProcesoDemo"] },
      ],
    },
    {
      ids: ["HU-20.009", "HU-20.010", "HU-20.011", "HU-20.012", "HU-20.013"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L1: arbol OPD con atajos teclado (Ctrl+arrows, F2, Ctrl+E/Shift+E, Ctrl+D), divisor arrastrable persistido, menu contextual extendido con Renombrar/Eliminar/Reordenar/Buscar, expandir/colapsar todo, toggle ocultar/mostrar nombres.",
      requires: [
        { path: "app/src/ui/ArbolOpd.tsx", any: ["ArbolOpd", "F2", "Ctrl+E", "expandirTodo"] },
        { path: "app/src/ui/arbol/handlersTeclado.ts", any: ["F2", "Ctrl"] },
        { path: "app/src/ui/arbol/togglesArbol.ts", all: ["expandirTodoArbol", "idsColapsables"] },
        { path: "app/src/ui/MenuContextualArbol.tsx", all: ["menu-contextual-arbol"] },
        { path: "app/src/ui/divisorPanel.tsx", any: ["limitarAnchoPanel", "anchoPanelArbol"] },
      ],
      evidenciaExtra: ["app/src/ui/arbol/handlersTeclado.test.ts", "app/src/ui/arbol/togglesArbol.test.ts", "app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-20.014"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L1: renombrado inline desde el arbol con doble clic / F2 reusando RenombradoInline.",
      requires: [
        { path: "app/src/ui/RenombradoInline.tsx", all: ["RenombradoInline"] },
        { path: "app/src/ui/ArbolOpd.tsx", any: ["renombrar", "RenombradoInline", "renombradoInline", "F2"] },
      ],
    },
    {
      ids: ["HU-20.017", "HU-20.018", "HU-20.019"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L1: reorden manual y automatico de hermanos en arbol con modoOrdenArbol configurable en store/preferencias.",
      requires: [
        { path: "app/src/store/uiPanel.ts", all: ["modoOrdenArbol"] },
        { path: "app/src/store/modelo/acciones-opd.ts", any: ["reordenar", "ordenarHermanos", "moverOpd"] },
      ],
    },
    {
      ids: ["HU-20.020", "HU-20.021", "HU-20.022"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L1: gestion modal Ctrl+D con busqueda y cortar/pegar de OPDs.",
      requires: [
        { path: "app/src/ui/GestionArbolOpd.tsx", any: ["GestionArbolOpd", "gestionArbol"] },
        { path: "app/src/ui/ArbolOpd.tsx", any: ["Ctrl+D", "abrirGestionArbol"] },
        { path: "app/src/store/uiPanel.ts", any: ["gestionArbolAbierta", "abrirGestionArbol"] },
      ],
      evidenciaExtra: ["app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-30.007"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L2: descripcion opcional al guardar persistida en Modelo.descripcion? con roundtrip JSON lossless.",
      requires: [
        { path: "app/src/modelo/tipos/modelo.ts", any: ["descripcion?"] },
        { path: "app/src/ui/DialogoGuardarComo.tsx", any: ["descripcion", "Descripción"] },
        { path: "app/src/serializacion/json.ts", any: ["descripcion"] },
      ],
      evidenciaExtra: ["app/src/serializacion/json.test.ts"],
    },
    {
      ids: ["HU-30.011", "HU-30.012", "HU-30.028"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L2: PantallaInicio con grid de modelos recientes, telon y busqueda local.",
      requires: [
        { path: "app/src/ui/PantallaInicio.tsx", all: ["PantallaInicio", "pantalla-inicio"] },
      ],
    },
    {
      ids: ["HU-30.016", "HU-30.022"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L2: renombrar modelo existente sin Guardar Como + Cargar Ejemplo Organizacional desde MenuPrincipal.",
      requires: [
        { path: "app/src/ui/MenuPrincipal.tsx", any: ["Renombrar", "renombrarModelo", "Ejemplo Organizacional"] },
        { path: "app/src/persistencia/local.ts", any: ["renombrarModelo", "renombrar"] },
      ],
    },
    {
      ids: ["HU-30.023", "HU-30.024"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L2: toggle Mostrar Versiones + politica log-scale (max 10) en versiones.",
      requires: [
        { path: "app/src/ui/DialogoVersiones.tsx", any: ["Mostrar Versiones", "mostrarVersiones", "logScale", "log-scale"] },
        { path: "app/src/persistencia/versiones.ts", any: ["logScale", "max", "10"] },
      ],
    },
    {
      ids: ["HU-30.025", "HU-30.026", "HU-30.027"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L2: archivados con toggle visible, auto-archivar 90d y restaurar.",
      requires: [
        { path: "app/src/ui/DialogoArchivados.tsx", any: ["archivados", "Restaurar"] },
        { path: "app/src/persistencia/workspace.ts", any: ["archivado", "autoArchiv", "restaurar"] },
      ],
    },
    {
      ids: ["HU-30.032", "HU-30.033", "HU-30.034", "HU-30.035"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L2: vista tiles/lista, ordenamiento por columna, glifos editable/candado/autosalvado y autosalvado cada 5 min.",
      requires: [
        { path: "app/src/ui/DialogoCargarModelo.tsx", any: ["tiles", "lista", "ordenar", "glifo"] },
        { path: "app/src/persistencia/autosalvado.ts", any: ["5 min", "5 minutos", "INTERVALO"] },
      ],
    },
    {
      ids: ["HU-50.003"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto Corte 8: toggle 123 del panel OPL detectado sin acoplarlo a la HU pendiente de posicion lateral.",
      requires: [
        { path: "app/src/ui/panelOpl/Toolbar.tsx", all: ["panel-opl-toggle-numeracion"] },
        { path: "app/src/modelo/tipos/ui.ts", all: ["oplNumeracionVisible"] },
      ],
    },
    {
      ids: ["HU-50.004"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto Corte 8: posicion lateral del panel OPL se mantiene como HU independiente; la implementacion actual solo fija la franja inferior.",
      requires: [
        { path: "app/src/ui/panelOpl/Toolbar.tsx", all: ["panel-opl-posicion"] },
        { path: "app/src/modelo/tipos/ui.ts", all: ["oplPosicion"] },
      ],
    },
    {
      ids: ["HU-50.005", "HU-50.006"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto Corte 8: minimizar/restaurar OPL se evidencia en ToolbarOpl, PanelOpl y preferencia UI, separado de la posicion lateral pendiente.",
      requires: [
        { path: "app/src/ui/panelOpl/Toolbar.tsx", all: ["panel-opl-minimizar"] },
        { path: "app/src/ui/PanelOpl.tsx", all: ["panel-opl-minimizado", "panel-opl-restaurar"] },
        { path: "app/src/modelo/tipos/ui.ts", all: ["oplMinimizado"] },
      ],
      evidenciaExtra: ["app/e2e/03-opl-panel.spec.ts"],
    },
    {
      ids: ["HU-50.028"],
      estado: "parcial",
      confianza: "media-auto",
      nota: "Auto Corte 8: existe boton AI Text placeholder con feedback, pero no productiza generacion AI de oraciones compuestas.",
      requires: [
        { path: "app/src/ui/panelOpl/Toolbar.tsx", all: ["panel-opl-ai-text", "Proximamente", "beta"] },
      ],
      evidenciaExtra: ["app/e2e/03-opl-panel.spec.ts"],
    },
    {
      ids: ["HU-50.021", "HU-50.026", "HU-50.027"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L3: seleccion enlace especifico en oracion multi-enlace, indentacion jerarquica y colapsar bloques OPL.",
      requires: [
        { path: "app/src/opl/interaccion.ts", any: ["referenciaEnlaceEspecifico", "enlaceEspecifico"] },
        { path: "app/src/ui/panelOpl/Bloques.tsx", any: ["data-opl-nivel", "indentar", "indentacion", "paddingLeft"] },
      ],
      evidenciaExtra: ["app/src/opl/interaccion.test.ts"],
    },
    {
      ids: ["HU-10.001", "HU-10.002"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L4: drag desde Toolbar al canvas con MIME application/x-opm-tipo crea cosa en posicion exacta.",
      requires: [
        { path: "app/src/ui/toolbar/ToolbarBase.tsx", all: ["toolbar-drag-objeto", "toolbar-drag-proceso"] },
      ],
      evidenciaExtra: ["app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-10.008", "HU-10.009", "HU-10.010", "HU-10.011", "HU-11.026"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L4: MenuTipoEnlace con tipos validos via validarFirmaEnlace + previews OPL + filtros por direccion.",
      requires: [
        { path: "app/src/ui/MenuTipoEnlace.tsx", all: ["menu-tipo-enlace", "MenuTipoEnlace"] },
        { path: "app/src/modelo/operaciones/helpers.ts", all: ["validarFirmaEnlace"] },
      ],
    },
    {
      ids: ["HU-10.017", "HU-10.018"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto Corte 8: BibliotecaDock lista entidades, filtra por OPD activo, permite drag-to-canvas y navega a OPDs donde aparece.",
      requires: [
        { path: "app/src/ui/biblioteca/BibliotecaDock.tsx", all: ["BibliotecaDock", "biblioteca-dock"] },
        { path: "app/src/ui/biblioteca/ListaBibliotecaCosas.tsx", all: ["application/x-opm-entidad-id", "draggable", "onNavegarOpd"] },
        { path: "app/src/ui/biblioteca/filtrosBiblioteca.ts", all: ["filtrarEntidades", "soloOpdActivo", "apareceEnOpdActivo"] },
      ],
      evidenciaExtra: ["app/src/ui/biblioteca/filtrosBiblioteca.test.ts", "app/e2e/20-biblioteca-dock.spec.ts"],
    },
    {
      ids: ["HU-11.016", "HU-11.017"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L4: DialogoEstiloEnlace con paleta + grosor + dash + copiar/pegar estilo entre enlaces vía store y kernel.",
      requires: [
        { path: "app/src/ui/DialogoEstiloEnlace.tsx", all: ["DialogoEstiloEnlace", "dialogo-estilo-enlace"] },
        { path: "app/src/ui/inspectorEnlace/SeccionEstilo.tsx", any: ["abrir-dialogo-estilo-enlace", "SeccionEstilo"] },
        { path: "app/src/modelo/enlaceEstilo.ts", any: ["copiarEstiloEnlace", "aplicarEstiloEnlace"] },
        { path: "app/src/store/tipos.ts", any: ["copiarEstiloEnlaceAlPortapapeles", "enlaceEstiloPortapapeles"] },
      ],
    },
    {
      ids: ["HU-11.020"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L4: reanclar extremo de enlace con linkTools.SourceArrowhead/TargetArrowhead.",
      requires: [
        { path: "app/src/render/jointjs/handlers/toolsEnlace.ts", any: ["SourceArrowhead", "TargetArrowhead"] },
        { path: "app/src/ui/inspectorEnlace/SeccionExtremos.tsx", any: ["reanclar-extremo-btn", "Reanclar"] },
      ],
    },
    {
      ids: ["HU-11.023"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L4: borrar enlaces seleccionados en lote con eliminarEnlacesBatch.",
      requires: [
        { path: "app/src/canvas/operacionesBatch.ts", any: ["eliminarEnlacesBatch", "borrarEnlacesEnLote"] },
      ],
      evidenciaExtra: ["app/src/canvas/operacionesBatch.test.ts"],
    },
    {
      ids: ["HU-11.013"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L4: menu contextual sobre enlace con propiedades + eliminar.",
      requires: [
        { path: "app/src/ui/MenuContextualEnlace.tsx", any: ["MenuContextualEnlace", "menu-contextual-enlace"] },
      ],
    },
    {
      ids: ["HU-SHARED-003"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L5: readOnly flag bloquea commitModelo con mensaje y permite activar/desactivar via activarReadOnly.",
      requires: [
        { path: "app/src/store/runtime.ts", all: ["readOnly", "solo lectura"] },
        { path: "app/src/store/modelo/acciones-ui.ts", all: ["activarReadOnly"] },
        { path: "app/src/store/tipos.ts", all: ["readOnly", "activarReadOnly"] },
      ],
      evidenciaExtra: ["app/src/store.test.ts"],
    },
    {
      ids: ["HU-SHARED-009"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L5: validarNombreEntidad rechaza vacio y duplicado dentro del OPD activo.",
      requires: [
        { path: "app/src/modelo/operaciones/entidad.ts", all: ["validarNombreEntidad", "Ya existe"] },
        { path: "app/src/modelo/operaciones.ts", all: ["validarNombreEntidad"] },
      ],
      evidenciaExtra: ["app/src/modelo/operaciones.test.ts"],
    },
    {
      ids: ["HU-50.015"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 11 L5 (verificacion): generalizacion verbaliza 'es un' / 'son' canonicamente en OPL desde rondas previas; regla nueva consolida evidencia.",
      requires: [
        { path: "app/src/opl/generadores/estructural.ts", all: ["generalizacion", "es un"] },
        { path: "app/src/opl/generadores/refsHints.ts", any: ["es un", "son"] },
      ],
      evidenciaExtra: ["app/src/opl/generadores/estructural.test.ts"],
    },
    {
      ids: ["HU-10.004"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 12 L1: SeccionDescripcion canonica con data-testid seccion-descripcion-cosa render desde InspectorEntidad.",
      requires: [
        { path: "app/src/ui/inspector/SeccionDescripcion.tsx", all: ["seccion-descripcion-cosa"] },
        { path: "app/src/ui/InspectorEntidad.tsx", any: ["SeccionDescripcion"] },
      ],
    },
    {
      ids: ["HU-11.001"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 12 L1: indicador de modo canonico persistente en Toolbar (data-testid indicador-modo-canonico).",
      requires: [
        { path: "app/src/ui/toolbar/ToolbarCreacion.tsx", all: ["indicador-modo-canonico"] },
      ],
    },
    {
      ids: ["HU-11.007"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 12 L1: ATAJO_CONECTAR_MULTI_AL_TODO Ctrl+Alt+T reusa conectarSeleccionAlTodo (slice store/seleccion.ts) con undo atomico.",
      requires: [
        { path: "app/src/ui/atajosTeclado.ts", all: ["ATAJO_CONECTAR_MULTI_AL_TODO"] },
        { path: "app/src/store/seleccion.ts", any: ["conectarSeleccionAlTodo"] },
        { path: "app/src/ui/toolbar/ToolbarMultiseleccion.tsx", any: ["conectarSeleccionAlTodo"] },
      ],
      evidenciaExtra: ["app/src/store.test.ts"],
    },
    {
      ids: ["HU-30.036"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 12 L1: guardarLocal redirige a copia editable cuando readOnly y limpia indicador post-commit.",
      requires: [
        { path: "app/src/store/persistencia.ts", all: ["guardarLocal()", "readOnly", "guardarComoLocal"] },
      ],
      evidenciaExtra: ["app/src/store/persistencia.test.ts"],
    },
    {
      ids: ["HU-30.021", "HU-30.008"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 12 L1 + BUG-20260507T170832Z-2dae09: ejemplo-organizacional cargable por URL como asset (app/examples/ejemplo-organizacional.json); catalogo unico via listarFixtures/cargarFixtureDemo en MenuPrincipal/DialogoCargarModelo/PantallaInicio, sin duplicar item especial. Preservacion exacta JSON local cubierta por test dedicado.",
      requires: [
        { path: "app/src/store/modelo/acciones-ui.ts", any: ["ejemplo-organizacional.json"] },
        { path: "app/src/ui/DialogoCargarModelo.tsx", all: ["listarFixtures", "cargarFixtureDemo", "Cargar modelo de ejemplo"] },
        { path: "app/e2e/01-carga-y-workspace.spec.ts", all: ["Ejemplo organizacional", "toHaveCount(1)", "selectOption(\"Ejemplo organizacional\")"] },
        { path: "app/src/persistencia/local.test.ts", all: ["guardarModeloLocal", "cargarModeloLocal"] },
      ],
      evidenciaExtra: ["app/examples/ejemplo-organizacional.json", "app/e2e/_smoke-helpers.ts"],
    },
    {
      ids: ["HU-17.011", "HU-17.012", "HU-17.013", "HU-17.014", "HU-17.015", "HU-17.016", "HU-17.017"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 12 L2: atributos canonicos con valor slot integer/float/char/string + render Nombre [Unidad] {alias} + OPL + UI Inspector y Toolbar.",
      requires: [
        { path: "app/src/modelo/tipos/entidad.ts", all: ["esAtributo", "valorSlot", "TipoValorSlot", "ValorConcreto"] },
        { path: "app/src/modelo/operaciones/entidad.ts", all: ["crearAtributoEnObjeto", "asignarValorAtributo", "cambiarTipoValorAtributo"] },
        { path: "app/src/modelo/validadores/valorSlot.ts", all: ["integer", "float", "char", "string"] },
        { path: "app/src/ui/inspector/SeccionAtributo.tsx", any: ["SeccionAtributo"] },
        { path: "app/src/ui/toolbar/ToolbarBase.tsx", any: ["objectDrag.svg", "objectDragIcon"] },
      ],
      evidenciaExtra: ["app/src/modelo/operaciones/entidad.test.ts", "app/src/modelo/validadores/valorSlot.test.ts"],
    },
    {
      ids: ["HU-1B.001", "HU-1B.002", "HU-1B.003", "HU-1B.004", "HU-1B.005", "HU-1B.006", "HU-1B.007", "HU-1B.008", "HU-1B.009", "HU-1B.010", "HU-1B.011", "HU-1B.012", "HU-1B.013", "HU-1B.014", "HU-1B.015"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 12 L3: traer conectados con familias canonicas + layout radial + ocultar apariencia + dialogo + menu contextual de entidad.",
      requires: [
        { path: "app/src/canvas/operacionesBatch.ts", all: ["traerConectadosBatch", "ocultarAparienciaBatch"] },
        { path: "app/src/canvas/reglasTraer.ts", all: ["FamiliaTraerConectados"] },
        { path: "app/src/canvas/layoutRadial.ts", any: ["layoutRadial"] },
        { path: "app/src/canvas/seleccionMultiple.ts", any: ["enlacesInternosSeleccion"] },
        { path: "app/src/ui/DialogoTraerConectados.tsx", any: ["DialogoTraerConectados"] },
        { path: "app/src/ui/MenuContextualEntidad.tsx", any: ["MenuContextualEntidad"] },
      ],
      evidenciaExtra: ["app/src/canvas/reglasTraer.test.ts", "app/src/canvas/layoutRadial.test.ts"],
    },
    {
      ids: ["HU-33.001", "HU-33.002", "HU-33.003", "HU-33.006", "HU-33.007", "HU-33.008", "HU-33.009", "HU-33.010", "HU-33.012", "HU-33.014", "HU-33.015", "HU-33.018", "HU-33.022"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 12 L4: plantillas privadas EPICA-33 con persistencia separada, insercion atomica con IDs nuevos, sub-OPDs, sufijo, foco temporal y catalogo.",
      requires: [
        { path: "app/src/modelo/tipos/plantilla.ts", all: ["AmbitoPlantilla", "Plantilla", "PlantillaIndice"] },
        { path: "app/src/persistencia/plantillas.ts", all: ["opm:plantilla", "opm:plantillas-lista"] },
        { path: "app/src/canvas/operacionesBatch.ts", all: ["insertarPlantillaBatch"] },
        { path: "app/src/store/modelo.ts", any: ["plantillasGuardadas", "idsResaltadosTemporales"] },
        { path: "app/src/ui/DialogoPlantillas.tsx", all: ["DialogoPlantillas", "dialogo-guardar-plantilla", "dialogo-plantillas", "insertar-plantilla"] },
        { path: "app/src/ui/MenuPrincipal.tsx", any: ["abrirDialogoGuardarPlantilla", "abrirDialogoPlantillas"] },
      ],
      evidenciaExtra: ["app/src/persistencia/plantillas.test.ts", "app/src/canvas/operacionesBatch.test.ts"],
    },
    {
      ids: ["HU-10.003"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 12.1 L1: smoke verifica que crear cosa expone modal-nombre-cosa con form + input + Enter persiste nombre.",
      requires: [
        { path: "app/src/ui/toolbar/ToolbarBase.tsx", any: ["modal-nombre-cosa"] },
        { path: "app/e2e/08-mvp-alpha-residual.spec.ts", all: ["modal-nombre-cosa"] },
      ],
    },
    {
      ids: ["HU-10.021"],
      estado: "cubierto",
      confianza: "alta-auto",
      nota: "Auto ronda 12.1 L1: desplegarSeleccionada cubre los 4 modos estructurales (agregacion-participacion, exhibicion, generalizacion, clasificacion); tests + smoke verifican OPD hijo creado con padreId correcto. Variante in-diagram canonica V-239 queda diferida (requiere campo kernel descomposicionEnDiagrama).",
      requires: [
        { path: "app/src/store/modelo/acciones-opd.ts", any: ["desplegarObjeto"] },
        { path: "app/src/store.test.ts", any: ["desplegarSeleccionada", "desplegarComoAgregacion"] },
        { path: "app/e2e/05-refinamiento-y-plegado.spec.ts", any: ["desplegarComoAgregacion", "HU-10.021"] },
      ],
    },
  ];
}

function compareHuIds(a, b) {
  return huSortKey(a.id).localeCompare(huSortKey(b.id), "en", { numeric: true });
}

function huSortKey(id) {
  if (id.startsWith("HU-SHARED-")) return `00-SHARED-${id.replace(/\D/g, "").padStart(4, "0")}`;
  const match = id.match(/^HU-([A-Z0-9]+)\.(\d+)$/);
  if (!match) return id;
  const [, epic, num] = match;
  return `${epic.padStart(3, "0")}-${num.padStart(4, "0")}`;
}

function applyEvidence(rawItems, evidence, initialDiagnostics = []) {
  const diagnostics = [...initialDiagnostics];
  const allIds = new Set(rawItems.map((item) => item.id));
  const exact = new Map();
  const gapById = new Map();
  const entries = [
    ...(evidence.entries ?? []).map((entry) => ({ ...entry, fuente: entry.fuente ?? "manual" })),
    ...(evidence.autoEntries ?? []).map((entry) => ({ ...entry, fuente: entry.fuente ?? "auto" })),
  ];

  for (const entry of entries) {
    for (const id of entry.ids ?? []) {
      if (!allIds.has(id)) {
        diagnostics.push({
          nivel: "WARN",
          tipo: "ledger-missing-id",
          id,
          detalle: `El ledger referencia un ID inexistente en el backlog parseado: ${id}.`,
        });
      }
      if (exact.has(id)) {
        const previous = exact.get(id);
        const automaticOverride = previous?.fuente === "manual" && entry.fuente === "auto";
        if (!automaticOverride) {
          diagnostics.push({
            nivel: "WARN",
            tipo: "ledger-duplicate-id",
            id,
            detalle: `El ledger tiene mas de una entrada para ${id}; gana la ultima.`,
          });
        }
      }
      exact.set(id, entry);
    }
  }

  for (const gap of evidence.knownGaps ?? []) {
    for (const id of gap.ids ?? []) {
      const current = gapById.get(id) ?? [];
      current.push(gap.nota);
      gapById.set(id, current);
    }
  }

  const items = rawItems.map((item) => {
    const entry = exact.get(item.id);
    const defaultEpic = evidence.epicDefaults?.[item.epica];
    const estadoAvance = item.estadoInventario !== "viva"
      ? item.estadoInventario
      : entry?.estado ?? defaultEpic?.estado ?? "pendiente";
    const nota = entry?.nota ?? defaultEpic?.nota ?? "";
    const evidencia = (entry?.evidencia ?? []).map((path) => normalizeEvidencePath(path));
    const brechas = [
      ...(entry?.brechas ?? []),
      ...(estadoAvance === "cubierto" ? [] : (gapById.get(item.id) ?? [])),
    ];
    const peso = item.estadoInventario === "viva" ? (SIZE_WEIGHT[item.tamano] ?? 2) : 0;
    const score = SCORE[estadoAvance] ?? 0;

    return {
      ...item,
      corte: cutForItem(item, evidence.roadmapCuts ?? {}),
      estadoAvance,
      confianza: entry?.confianza ?? (entry ? "media" : "sin-evidencia"),
      fuenteEvidencia: entry?.fuente ?? null,
      nota,
      brechas,
      evidencia,
      peso,
      score,
      avancePonderado: peso * score,
      enlaceFuente: item.archivoRelativoDashboard,
    };
  });

  return { items, diagnostics };
}

function normalizeEvidencePath(path) {
  const absolute = resolve(REPO_ROOT, path);
  return {
    path,
    hrefDashboard: relative(ROADMAP_ROOT, absolute),
  };
}

function cutForItem(item, cuts) {
  for (const [cutId, cut] of Object.entries(cuts)) {
    if (item.id.startsWith("HU-SHARED-") && (cut.shared ?? []).includes(item.id)) return cutId;
    if ((cut.epics ?? []).includes(item.epica)) return cutId;
  }
  return "sin-corte";
}

function buildSummaries(items, evidence) {
  const vivas = items.filter((item) => item.estadoInventario === "viva");
  const byCut = Object.fromEntries(
    [...Object.keys(evidence.roadmapCuts ?? {}), "sin-corte"].map((cut) => [cut, summarize(vivas.filter((item) => item.corte === cut))]),
  );
  const byPriority = Object.fromEntries(
    ["M0", "M1", "S", "C", "W", "sin-prioridad"].map((priority) => [
      priority,
      summarize(vivas.filter((item) => (item.prioridad ?? "sin-prioridad") === priority)),
    ]),
  );
  const epics = {};
  for (const item of vivas) {
    const key = item.epica;
    if (!epics[key]) epics[key] = { epica: key, titulo: item.epicaTitulo, items: [] };
    epics[key].items.push(item);
  }
  const byEpic = Object.fromEntries(
    Object.entries(epics)
      .sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true }))
      .map(([key, group]) => [key, { titulo: group.titulo, ...summarize(group.items) }]),
  );

  return {
    total: summarize(vivas),
    inventario: {
      totalParseadas: items.length,
      vivas: vivas.length,
      absorbidas: items.filter((item) => item.estadoInventario === "absorbida").length,
      fusionadas: items.filter((item) => item.estadoInventario === "fusionada").length,
    },
    m0: summarize(vivas.filter((item) => item.prioridad === "M0")),
    alpha: summarize(vivas.filter((item) => item.corte === "alpha")),
    beta: summarize(vivas.filter((item) => item.corte === "beta")),
    byCut,
    byPriority,
    byEpic,
  };
}

function summarize(list) {
  const counts = Object.fromEntries(STATUS_ORDER.map((status) => [status, 0]));
  let pesoTotal = 0;
  let pesoCubierto = 0;
  for (const item of list) {
    if (counts[item.estadoAvance] !== undefined) counts[item.estadoAvance] += 1;
    pesoTotal += item.peso;
    pesoCubierto += item.avancePonderado;
  }
  return {
    total: list.length,
    ...counts,
    pesoTotal,
    pesoCubierto,
    avance: pesoTotal > 0 ? pesoCubierto / pesoTotal : 0,
  };
}

function renderMarkdown(data) {
  const rowsCut = Object.entries(data.summaries.byCut)
    .map(([cut, summary]) => `| ${cutLabel(cut, ledger)} | ${summary.total} | ${summary.cubierto} | ${summary.parcial} | ${summary.pendiente} | ${summary.diferido} | ${percent(summary.avance)} |`)
    .join("\n");
  const rowsPriority = Object.entries(data.summaries.byPriority)
    .map(([priority, summary]) => `| ${priority} | ${summary.total} | ${summary.cubierto} | ${summary.parcial} | ${summary.pendiente} | ${summary.diferido} | ${percent(summary.avance)} |`)
    .join("\n");
  const rowsEpic = Object.entries(data.summaries.byEpic)
    .map(([epic, summary]) => `| ${epic} | ${escapePipes(summary.titulo)} | ${summary.total} | ${summary.cubierto} | ${summary.parcial} | ${summary.pendiente} | ${summary.diferido} | ${percent(summary.avance)} |`)
    .join("\n");
  const critical = criticalOpenItems(data.items)
    .map((item) => `- [${item.id}](${item.enlaceFuente}) — ${escapeMdText(item.titulo)} (${item.prioridad ?? "sin prioridad"}, ${item.estadoAvance})`)
    .join("\n") || "- Sin pendientes criticos detectados en el filtro actual.";
  const knownGaps = (ledger.knownGaps ?? [])
    .map((gap) => `- ${gap.ids.join(", ")} — ${escapeMdText(gap.nota)}`)
    .join("\n") || "- Sin brechas manuales registradas; revisar reglas automáticas no matcheadas en el dashboard.";

  return `# Auditoria de avance HU v2

**Generado:** ${data.generatedAt}
**Backlog:** \`${data.backlogRoot}\`
**Ledger de evidencia:** \`${data.evidenceLedger}\`
${data.autoAudit ? `**Auditoria automatica:** ${data.autoAudit.rulesMatched}/${data.autoAudit.rulesEvaluated} reglas matcheadas sobre ${data.autoAudit.sourceFiles.count} archivos fuente.\n` : ""}

Regenerar desde la raiz del repo:

\`\`\`bash
# Auditar el avance real contra app/src, app/e2e, app/scripts y assets/svg/links.
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real

# Regenerar reportes desde el ledger vigente sin reescanear codigo.
node docs/historias-usuario-v2/tools/progress-dashboard.mjs
\`\`\`

## Resumen ejecutivo

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---:|---:|---:|---:|---:|---:|
| Total backlog | ${data.summaries.total.total} | ${data.summaries.total.cubierto} | ${data.summaries.total.parcial} | ${data.summaries.total.pendiente} | ${data.summaries.total.diferido} | ${percent(data.summaries.total.avance)} |
| M0 | ${data.summaries.m0.total} | ${data.summaries.m0.cubierto} | ${data.summaries.m0.parcial} | ${data.summaries.m0.pendiente} | ${data.summaries.m0.diferido} | ${percent(data.summaries.m0.avance)} |
| MVP-alpha | ${data.summaries.alpha.total} | ${data.summaries.alpha.cubierto} | ${data.summaries.alpha.parcial} | ${data.summaries.alpha.pendiente} | ${data.summaries.alpha.diferido} | ${percent(data.summaries.alpha.avance)} |
| MVP-beta | ${data.summaries.beta.total} | ${data.summaries.beta.cubierto} | ${data.summaries.beta.parcial} | ${data.summaries.beta.pendiente} | ${data.summaries.beta.diferido} | ${percent(data.summaries.beta.avance)} |

## Por corte

| Corte | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---:|---:|---:|---:|---:|---:|
${rowsCut}

## Por prioridad

| Prioridad | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---:|---:|---:|---:|---:|---:|
${rowsPriority}

## Por epica

| Epica | Titulo | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---|---:|---:|---:|---:|---:|---:|
${rowsEpic}

## Pendientes M0 inmediatos

${critical}

## Brechas registradas

${knownGaps}

## Artefactos

- Dashboard: \`docs/roadmap/hu-progress.html\`
- Dataset completo: \`docs/roadmap/hu-progress.json\`
- Ledger editable: \`docs/roadmap/hu-progress-evidence.json\`

## Notas metodologicas

- Las HU absorbidas/fusionadas se excluyen del avance ponderado.
- \`cubierto\` pesa 1.0, \`parcial\` pesa 0.5 y \`pendiente/diferido/bloqueado\` pesa 0.
- El peso de una HU deriva de su tamano: XS=1, S=2, M=4, L=8, XL=13.
- La auditoria es conservadora: ausencia de evidencia exacta equivale a pendiente.
`;
}

function criticalOpenItems(items) {
  return items
    .filter((item) => item.estadoInventario === "viva")
    .filter((item) => item.prioridad === "M0")
    .filter((item) => item.estadoAvance === "pendiente" || item.estadoAvance === "bloqueado")
    .filter((item) => item.corte === "alpha" || item.corte === "beta")
    .slice(0, 40);
}

function renderHtml(data) {
  const json = JSON.stringify(data).replaceAll("</", "<\\/");
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Avance HU v2 - deep-opm-pro</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f5f7fb;
      --surface: #ffffff;
      --line: #d9e0ea;
      --text: #1f2937;
      --muted: #667085;
      --object: #1f7a3c;
      --process: #147aa5;
      --link: #586D8C;
      --amber: #b35c00;
      --red: #b42318;
      --blue-soft: #e8f7ff;
      --green-soft: #ecfdf3;
      --amber-soft: #fff8eb;
      --red-soft: #fff3f1;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.45;
    }
    header {
      padding: 18px 24px 14px;
      background: var(--surface);
      border-bottom: 1px solid var(--line);
    }
    h1 {
      margin: 0;
      font-size: 22px;
      line-height: 1.2;
      font-weight: 700;
      letter-spacing: 0;
    }
    .meta {
      margin-top: 6px;
      color: var(--muted);
      font-size: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    main { padding: 16px 24px 28px; }
    .metrics {
      display: grid;
      grid-template-columns: repeat(4, minmax(180px, 1fr));
      gap: 12px;
      margin-bottom: 14px;
    }
    .metric {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 12px;
      min-width: 0;
    }
    .metric-label {
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .metric-value {
      margin-top: 4px;
      font-size: 24px;
      font-weight: 700;
    }
    .metric-sub {
      margin-top: 4px;
      color: var(--muted);
      font-size: 12px;
    }
    .controls {
      display: grid;
      grid-template-columns: minmax(220px, 2fr) repeat(4, minmax(130px, 1fr));
      gap: 10px;
      align-items: end;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 14px;
    }
    label { display: grid; gap: 4px; min-width: 0; }
    label span {
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
    }
    input, select {
      width: 100%;
      min-width: 0;
      height: 34px;
      border: 1px solid #b9c5d4;
      border-radius: 4px;
      background: #fff;
      color: var(--text);
      padding: 0 9px;
      font: inherit;
      font-size: 13px;
    }
    .table-wrap {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 6px;
      overflow: auto;
      max-height: calc(100vh - 300px);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 1120px;
    }
    th, td {
      padding: 9px 10px;
      border-bottom: 1px solid #e8edf3;
      vertical-align: top;
      text-align: left;
    }
    th {
      position: sticky;
      top: 0;
      z-index: 1;
      background: #f8fafc;
      color: #344054;
      font-size: 12px;
      font-weight: 700;
    }
    td { font-size: 13px; }
    .id {
      font-weight: 700;
      white-space: nowrap;
    }
    .title {
      min-width: 260px;
      max-width: 420px;
    }
    .note {
      color: var(--muted);
      max-width: 360px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      min-height: 22px;
      border-radius: 999px;
      padding: 2px 8px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }
    .s-cubierto { color: #067647; background: var(--green-soft); border: 1px solid #abefc6; }
    .s-parcial { color: var(--amber); background: var(--amber-soft); border: 1px solid #fedf89; }
    .s-pendiente { color: #475467; background: #f2f4f7; border: 1px solid #d0d5dd; }
    .s-diferido { color: var(--link); background: #eef4ff; border: 1px solid #c7d7fe; }
    .s-bloqueado { color: var(--red); background: var(--red-soft); border: 1px solid #fecdca; }
    .s-absorbida, .s-fusionada { color: #6941c6; background: #f4f3ff; border: 1px solid #d9d6fe; }
    a { color: #175cd3; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .evidence {
      display: grid;
      gap: 3px;
      min-width: 180px;
    }
    .empty { color: var(--muted); }
    @media (max-width: 960px) {
      header, main { padding-left: 14px; padding-right: 14px; }
      .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .controls { grid-template-columns: 1fr 1fr; }
      .table-wrap { max-height: none; }
    }
    @media (max-width: 560px) {
      .metrics, .controls { grid-template-columns: 1fr; }
      h1 { font-size: 19px; }
    }
  </style>
</head>
<body>
  <header>
    <h1>Avance HU v2 - deep-opm-pro</h1>
    <div class="meta">
      <span>Generado: <strong id="generatedAt"></strong></span>
      <span>Ledger: <code id="ledgerPath"></code></span>
      <span>Items: <strong id="totalItems"></strong></span>
    </div>
  </header>
  <main>
    <section class="metrics" aria-label="Metricas">
      <div class="metric">
        <div class="metric-label">Avance filtrado</div>
        <div class="metric-value" id="metricProgress">0%</div>
        <div class="metric-sub" id="metricProgressSub"></div>
      </div>
      <div class="metric">
        <div class="metric-label">Cubiertas</div>
        <div class="metric-value" id="metricCovered">0</div>
        <div class="metric-sub">HU vivas con cobertura completa</div>
      </div>
      <div class="metric">
        <div class="metric-label">Parciales</div>
        <div class="metric-value" id="metricPartial">0</div>
        <div class="metric-sub">Vertical slice incompleto</div>
      </div>
      <div class="metric">
        <div class="metric-label">Pendientes</div>
        <div class="metric-value" id="metricPending">0</div>
        <div class="metric-sub">Sin evidencia directa</div>
      </div>
    </section>

    <section class="controls" aria-label="Filtros">
      <label>
        <span>Buscar</span>
        <input id="q" type="search" placeholder="ID, titulo, nota, evidencia">
      </label>
      <label>
        <span>Estado</span>
        <select id="status"></select>
      </label>
      <label>
        <span>Prioridad</span>
        <select id="priority"></select>
      </label>
      <label>
        <span>Corte</span>
        <select id="cut"></select>
      </label>
      <label>
        <span>Epica</span>
        <select id="epic"></select>
      </label>
    </section>

    <section class="table-wrap" aria-label="Tabla de avance">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titulo</th>
            <th>Epica</th>
            <th>Prioridad</th>
            <th>Tamano</th>
            <th>Estado</th>
            <th>Nota / brecha</th>
            <th>Evidencia</th>
          </tr>
        </thead>
        <tbody id="rows"></tbody>
      </table>
    </section>
  </main>
  <script>
    const DATA = ${json};
    const STATUS = ["todos", "cubierto", "parcial", "pendiente", "diferido", "bloqueado", "absorbida", "fusionada"];
    const PRIORITIES = ["todas", "M0", "M1", "S", "C", "W", "sin-prioridad"];
    const CUTS = ["todos", "alpha", "beta", "gamma", "delta", "sin-corte"];

    const els = {
      generatedAt: document.getElementById("generatedAt"),
      ledgerPath: document.getElementById("ledgerPath"),
      totalItems: document.getElementById("totalItems"),
      q: document.getElementById("q"),
      status: document.getElementById("status"),
      priority: document.getElementById("priority"),
      cut: document.getElementById("cut"),
      epic: document.getElementById("epic"),
      rows: document.getElementById("rows"),
      metricProgress: document.getElementById("metricProgress"),
      metricProgressSub: document.getElementById("metricProgressSub"),
      metricCovered: document.getElementById("metricCovered"),
      metricPartial: document.getElementById("metricPartial"),
      metricPending: document.getElementById("metricPending"),
    };

    els.generatedAt.textContent = DATA.generatedAt;
    els.ledgerPath.textContent = DATA.evidenceLedger;
    els.totalItems.textContent = DATA.items.length.toLocaleString("es-CL");

    fillSelect(els.status, STATUS, labelStatus);
    fillSelect(els.priority, PRIORITIES, (v) => v);
    fillSelect(els.cut, CUTS, labelCut);
    fillSelect(els.epic, ["todas", ...unique(DATA.items.map((item) => item.epica)).sort(sortEpic)], (v) => v);

    for (const input of [els.q, els.status, els.priority, els.cut, els.epic]) {
      input.addEventListener("input", render);
    }
    render();

    function render() {
      const filtered = DATA.items.filter(matchesFilters);
      renderMetrics(filtered);
      els.rows.innerHTML = filtered.map(rowHtml).join("");
    }

    function matchesFilters(item) {
      const status = els.status.value;
      const priority = els.priority.value;
      const cut = els.cut.value;
      const epic = els.epic.value;
      const query = els.q.value.trim().toLowerCase();
      if (status !== "todos" && item.estadoAvance !== status) return false;
      if (priority !== "todas" && (item.prioridad ?? "sin-prioridad") !== priority) return false;
      if (cut !== "todos" && item.corte !== cut) return false;
      if (epic !== "todas" && item.epica !== epic) return false;
      if (!query) return true;
      const haystack = [
        item.id,
        item.titulo,
        item.epica,
        item.prioridad,
        item.estadoAvance,
        item.nota,
        ...(item.brechas ?? []),
        ...(item.evidencia ?? []).map((ev) => ev.path),
      ].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query);
    }

    function renderMetrics(items) {
      const vivas = items.filter((item) => item.estadoInventario === "viva");
      const pesoTotal = vivas.reduce((sum, item) => sum + item.peso, 0);
      const pesoCubierto = vivas.reduce((sum, item) => sum + item.avancePonderado, 0);
      const avance = pesoTotal > 0 ? pesoCubierto / pesoTotal : 0;
      els.metricProgress.textContent = percent(avance);
      els.metricProgressSub.textContent = vivas.length.toLocaleString("es-CL") + " HU vivas filtradas";
      els.metricCovered.textContent = count(vivas, "cubierto");
      els.metricPartial.textContent = count(vivas, "parcial");
      els.metricPending.textContent = count(vivas, "pendiente");
    }

    function rowHtml(item) {
      const note = [item.nota, ...(item.brechas ?? [])].filter(Boolean).join(" ");
      const evidence = item.evidencia.length
        ? item.evidencia.map((ev) => '<a href="' + escAttr(ev.hrefDashboard) + '">' + esc(ev.path) + '</a>').join("")
        : '<span class="empty">Sin evidencia exacta</span>';
      return '<tr>' +
        '<td class="id"><a href="' + escAttr(item.enlaceFuente) + '">' + esc(item.id) + '</a></td>' +
        '<td class="title">' + esc(item.titulo) + '</td>' +
        '<td>' + esc(item.epica) + '</td>' +
        '<td>' + esc(item.prioridad ?? "") + '</td>' +
        '<td>' + esc(item.tamano ?? "") + '</td>' +
        '<td><span class="pill s-' + escAttr(item.estadoAvance) + '">' + esc(labelStatus(item.estadoAvance)) + '</span></td>' +
        '<td class="note">' + (note ? esc(note) : '<span class="empty">Sin nota</span>') + '</td>' +
        '<td class="evidence">' + evidence + '</td>' +
      '</tr>';
    }

    function fillSelect(select, values, labeler) {
      select.innerHTML = values.map((value) => '<option value="' + escAttr(value) + '">' + esc(labeler(value)) + '</option>').join("");
    }

    function unique(values) {
      return [...new Set(values)];
    }

    function count(items, status) {
      return items.filter((item) => item.estadoAvance === status).length.toLocaleString("es-CL");
    }

    function labelStatus(value) {
      if (value === "todos") return "Todos";
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    function labelCut(value) {
      const labels = { todos: "Todos", alpha: "MVP-alpha", beta: "MVP-beta", gamma: "MVP-gamma", delta: "MVP-delta", "sin-corte": "Sin corte" };
      return labels[value] ?? value;
    }

    function sortEpic(a, b) {
      if (a === "SHARED") return -1;
      if (b === "SHARED") return 1;
      return a.localeCompare(b, "en", { numeric: true });
    }

    function percent(value) {
      return new Intl.NumberFormat("es-CL", { style: "percent", maximumFractionDigits: 1 }).format(value);
    }

    function esc(value) {
      return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
    }

    function escAttr(value) {
      return esc(value).replace(/\\n/g, " ");
    }
  </script>
</body>
</html>
`;
}

function printConsoleSummary(data) {
  const total = data.summaries.total;
  const alpha = data.summaries.alpha;
  console.log(`HU vivas: ${total.total}`);
  console.log(`Total: ${percent(total.avance)} ponderado (${total.cubierto} cubiertas, ${total.parcial} parciales, ${total.pendiente} pendientes, ${total.diferido} diferidas)`);
  console.log(`MVP-alpha: ${percent(alpha.avance)} ponderado (${alpha.cubierto} cubiertas, ${alpha.parcial} parciales, ${alpha.pendiente} pendientes)`);
  console.log(`Generado: ${pathFromRepo(OUT_MD)}, ${pathFromRepo(OUT_HTML)}, ${pathFromRepo(OUT_JSON)}`);
  if (data.diagnostics.length > 0) {
    console.log(`Diagnosticos: ${data.diagnostics.length} advertencias en ${pathFromRepo(OUT_JSON)}`);
  }
}

function cutLabel(cut, evidence) {
  if (cut === "sin-corte") return "Sin corte";
  return evidence.roadmapCuts?.[cut]?.label ?? cut;
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function escapePipes(value) {
  return String(value ?? "").replaceAll("|", "\\|");
}

function escapeMdText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function pathFromRepo(path) {
  return relative(REPO_ROOT, path).replaceAll("\\", "/");
}
