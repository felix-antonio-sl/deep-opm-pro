// Testigo de cierre `manual:limites` (corte D4 / D-MANUAL).
//
// LEY: la §L "Límites de la mesa" del manual integrado (docs/manual-opforja.md)
// NO debe contradecir el registro de conformidad de la herramienta
// (docs/roadmap/registro-conformidad-ssot.md). El manual NO inventa su lista de
// límites: la deriva del registro. Por tanto, toda capacidad que §L declara
// AUSENTE debe tener una fila correspondiente en el registro marcada como
// PROGRAMADA (o, en general, declarada/no-implementada) — NUNCA una fila que el
// registro marca CERRADA=implementada, ni una capacidad que el registro
// desconoce.
//
// FALSABILIDAD: si §L lista una capacidad que el registro marca CERRADA, o que
// el registro no conoce, el test FALLA nombrando esa capacidad. Si §L y el
// registro coinciden, pasa.
//
// CONTROL DE NO-TAUTOLOGÍA: se verifica que (a) §L extrajo ≥1 capacidad real
// (si el parser devolviera vacío, la ley sería trivialmente verdadera), (b) el
// registro expone filas PROGRAMADA y CERRADA reales, y (c) el matcher
// discrimina: una capacidad-señuelo inexistente NO matchea ninguna fila del
// registro (si matcheara cualquier cosa, la verificación no probaría nada).
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "bun:test";

// docs/ cuelga de la raíz del repo; este test vive en app/src/leyes/.
const RAIZ_REPO = resolve(import.meta.dir, "../../..");
const MANUAL = resolve(RAIZ_REPO, "docs/manual-opforja.md");
const REGISTRO = resolve(RAIZ_REPO, "docs/roadmap/registro-conformidad-ssot.md");

const manual = readFileSync(MANUAL, "utf8");
const registro = readFileSync(REGISTRO, "utf8");

/** Stopwords sin valor discriminante para el matching capacidad↔fila. */
const STOPWORDS = new Set([
  "de", "la", "el", "los", "las", "un", "una", "del", "al", "y", "o", "en",
  "con", "por", "para", "sin", "que", "se", "su", "sus", "lo", "como", "es",
  "the", "of", "a", "caso", "modo", "regla", "familia",
]);

/** Tokens significativos (>=3 chars, sin stopwords, sin markdown). */
function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[`*_()\[\].,;:¿?¡!«»"']/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

/**
 * Extrae la primera celda (la capacidad) de cada fila de la tabla bajo el
 * encabezado `## L. Límites de la mesa`, hasta el siguiente encabezado `##`.
 * Ignora la fila de cabecera y la fila separadora `---`.
 */
function capacidadesSeccionL(md: string): string[] {
  const inicio = md.search(/^##\s+L\.\s+L[ií]mites de la mesa\b/m);
  if (inicio < 0) return [];
  const resto = md.slice(inicio + 1);
  const finRel = resto.search(/^##\s+/m);
  const seccion = finRel < 0 ? resto : resto.slice(0, finRel);
  const filas: string[] = [];
  for (const linea of seccion.split("\n")) {
    const l = linea.trim();
    if (!l.startsWith("|")) continue;
    const celdas = l.slice(1).split("|").map((c) => c.trim());
    const primera = celdas[0] ?? "";
    if (!primera) continue;
    if (/^[-\s|]+$/.test(primera)) continue; // separadora ---
    if (/^Capacidad$/i.test(primera)) continue; // cabecera
    // Quita marcadores de negrita/cursiva para quedarse con el nombre.
    filas.push(primera.replace(/\*\*/g, "").replace(/^\*|\*$/g, "").trim());
  }
  return filas;
}

/**
 * Filas del registro con su estado declarado. Devuelve { texto, estado } por
 * fila de tabla en todo el registro. `estado` se normaliza a CERRADA,
 * PROGRAMADA, PARCIAL u OTRO leyendo la 3.ª columna o el texto de la fila.
 */
type Estado = "CERRADA" | "PROGRAMADA" | "PARCIAL" | "OTRO";
interface FilaRegistro {
  sujeto: string; // primera celda = la regla/familia/capacidad de la fila
  texto: string; // fila completa (para el mensaje de error)
  estado: Estado;
}
function filasRegistro(md: string): FilaRegistro[] {
  const filas: FilaRegistro[] = [];
  for (const linea of md.split("\n")) {
    const l = linea.trim();
    if (!l.startsWith("|")) continue;
    if (/^[-\s|]+$/.test(l)) continue; // separadora
    const u = l.toUpperCase();
    if (/^\|\s*REGLA\b/.test(u) || /^\|\s*DECISI[ÓO]N\b/.test(u) || /^\|\s*REGLA \(ANEXO/.test(u)) {
      continue; // cabeceras conocidas
    }
    const sujeto = (l.slice(1).split("|")[0] ?? "").trim();
    let estado: Estado = "OTRO";
    if (/\bCERRADA\b/.test(u)) estado = "CERRADA";
    else if (/\bPROGRAMADA\b/.test(u)) estado = "PROGRAMADA";
    else if (/\bPARCIAL\b/.test(u)) estado = "PARCIAL";
    filas.push({ sujeto, texto: l, estado });
  }
  return filas;
}

/**
 * Núcleo identificador de una capacidad de §L: el texto ANTES del primer
 * paréntesis (la glosa entre paréntesis es explicación, no identidad). De ahí
 * se toman los tokens "fuertes" (>=4 chars), que son los discriminantes:
 * "out-zoom", "r-fan-prob-1", "caso"... y nunca palabras de relleno como
 * "proceso" o "descomposición" que viven solo en la glosa.
 */
function nucleoTokens(capacidad: string): string[] {
  const nucleo = capacidad.split("(")[0] ?? capacidad;
  return tokens(nucleo).filter((t) => t.length >= 4);
}

/**
 * ¿La fila de registro "cubre" la capacidad? El matching se hace contra el
 * SUJETO de la fila (su primera celda), no contra su prosa: una capacidad está
 * cubierta solo cuando existe una fila CUYO TEMA es esa capacidad, no una fila
 * que la menciona de pasada (referencia cruzada en la columna de notas, o una
 * palabra genérica compartida). Criterio: TODOS los tokens fuertes del núcleo
 * de la capacidad deben aparecer en el sujeto de la fila. Discriminante: una
 * capacidad-señuelo con tokens ajenos no cubre ningún sujeto.
 */
function filaCubre(nucleo: string[], sujeto: string): boolean {
  if (nucleo.length === 0) return false;
  const sujetoTok = new Set(tokens(sujeto));
  return nucleo.every((t) => sujetoTok.has(t));
}

const capacidades = capacidadesSeccionL(manual);
const filas = filasRegistro(registro);
const filasProgramadas = filas.filter((f) => f.estado === "PROGRAMADA");
const filasCerradas = filas.filter((f) => f.estado === "CERRADA");

describe("manual:limites — §L no contradice el registro de conformidad", () => {
  test("control de no-tautología: §L extrajo capacidades reales", () => {
    expect(capacidades.length).toBeGreaterThanOrEqual(1);
    // Las capacidades esperadas del corte D4 (out-zoom y R-FAN-PROB-1 caso C)
    // deben estar presentes; si el parser devolviera basura, esto fallaría.
    const blob = capacidades.join(" | ").toLowerCase();
    expect(blob).toContain("out-zoom");
    expect(blob).toContain("r-fan-prob-1");
  });

  test("control de no-tautología: el registro expone PROGRAMADA y CERRADA reales", () => {
    expect(filasProgramadas.length).toBeGreaterThanOrEqual(1);
    expect(filasCerradas.length).toBeGreaterThanOrEqual(1);
  });

  test("control de no-tautología: el matcher DISCRIMINA (señuelo inexistente no matchea)", () => {
    const senuelo = nucleoTokens("teletransportador cuántico de unicornios holográficos");
    expect(senuelo.length).toBeGreaterThanOrEqual(1); // el señuelo SÍ tiene tokens
    const matchea = filas.some((f) => filaCubre(senuelo, f.sujeto));
    expect(matchea).toBe(false);
  });

  test("toda capacidad de §L tiene fila PROGRAMADA en el registro (FALLA nombrándola si no)", () => {
    for (const cap of capacidades) {
      const capTok = nucleoTokens(cap);

      // 1) No debe corresponder (por sujeto) a una fila CERRADA=implementada.
      const cerradaQueCoincide = filasCerradas.find((f) => filaCubre(capTok, f.sujeto));
      expect(
        cerradaQueCoincide,
        `§L lista "${cap}" como límite, pero el registro la marca CERRADA=implementada: «${cerradaQueCoincide?.texto ?? ""}». Corregir §L o el registro.`,
      ).toBeUndefined();

      // 2) Debe existir una fila PROGRAMADA cuyo sujeto sea esa capacidad.
      const programadaQueCubre = filasProgramadas.some((f) => filaCubre(capTok, f.sujeto));
      expect(
        programadaQueCubre,
        `§L lista "${cap}" como límite, pero el registro NO tiene fila PROGRAMADA correspondiente (capacidad desconocida por el registro). Derivar §L del registro o programar la fila.`,
      ).toBe(true);
    }
  });
});
