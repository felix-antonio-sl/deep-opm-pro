// LEY L7 — Dependencias unidireccionales: render ↛ SSOT (frente #1 del diseño).
//
// El renderer JointJS (src/render/) es un adaptador DESECHABLE y NUNCA fuente de
// verdad (CLAUDE.md §Arquitectura). Las CAPAS FUENTE —kernel OPM (src/modelo),
// runtime (src/store), serialización (src/serializacion), OPL (src/opl), geometría
// de canvas (src/canvas) y persistencia (src/persistencia)— NO deben importar nada
// desde src/render. El flujo de dependencia es estrictamente
//
//     modelo → store → render → ui          (render proyecta el modelo, no al revés)
//
// y un import inverso (capa-fuente ← render) corrompería la SSOT: el modelo
// quedaría amarrado a un detalle de presentación reemplazable.
//
// Enunciado:
//
//   (a) ESTÁTICO: ningún archivo de PRODUCCIÓN bajo las capas fuente importa,
//       reexporta ni `import()`-dinámica desde src/render. Se escanean todas las
//       formas de specifier relativo que resuelvan dentro de src/render/.
//   (b) ALLOWLIST CONGELADO: las excepciones legítimas vigentes HOY se enumeran
//       y comentan explícitamente. Hoy el allowlist de PRODUCCIÓN está VACÍO: no
//       existe ningún import producción capa-fuente → render. (Las dos únicas
//       referencias capa-fuente → render viven en TESTS de leyes —proyecciones y
//       supresión de estados, que verifican la frontera cruzándola— y por eso el
//       escaneo excluye `*.test.ts`/`*.test.tsx`, igual que renderUiBoundary.test.ts.)
//   (c) CONTROL DE NO-TAUTOLOGÍA: se inyecta una cadena de import PROHIBIDA en una
//       fixture temporal escrita dentro de una capa fuente; el MISMO detector la
//       atrapa y la nombra. Esto demuestra que el verde de (a) es falsable, no
//       trivial. La fixture se elimina al terminar.
//
// El estilo de escaneo (sourceFiles recursivo + exclusión de tests + import.meta.url)
// replica src/render/jointjs/renderUiBoundary.test.ts, su dual de frontera.

import { afterAll, describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const LEYES_ROOT = dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = resolve(LEYES_ROOT, "..");
const RENDER_ROOT = join(SRC_ROOT, "render");

// Las capas fuente que NUNCA pueden depender de render: kernel, runtime,
// serialización, OPL, geometría de canvas (independiente de JointJS) y el
// contrato de persistencia (SSOT backend). canvas/persistencia se incluyen para
// congelar la ley a su intención plena (verificado: cero imports a render hoy).
const CAPAS_FUENTE = ["modelo", "store", "serializacion", "opl", "canvas", "persistencia"] as const;

// ALLOWLIST CONGELADO de excepciones de PRODUCCIÓN. Cada entrada es una ruta
// relativa a SRC_ROOT (p.ej. "modelo/foo.ts") cuyo import a render se tolera por
// una razón documentada. HOY ESTÁ VACÍO: no existe ninguna excepción de
// producción. Cualquier adición debe justificarse aquí y revisarse contra la ley.
const ALLOWLIST_PRODUCCION: ReadonlyArray<string> = [
  // (vacío — congela el estado actual: cero imports producción capa-fuente → render)
];

describe("L7 — render ↛ SSOT: las capas fuente no importan de src/render", () => {
  test("(a) ningún archivo de producción de las capas fuente importa desde src/render", () => {
    const violaciones = detectarImportsARender(CAPAS_FUENTE.map((capa) => join(SRC_ROOT, capa)))
      .filter((v) => !ALLOWLIST_PRODUCCION.includes(v.archivoRelativo));

    expect(violaciones).toEqual([]);
  });

  test("(b) el allowlist de producción está congelado en VACÍO", () => {
    // Si esto cambia, hay una decisión arquitectónica que documentar arriba.
    expect(ALLOWLIST_PRODUCCION).toEqual([]);
  });

  describe("(c) control de no-tautología — el detector SÍ atrapa una cadena prohibida", () => {
    // Fixture temporal con un import prohibido inyectado en una capa fuente.
    const fixtureDir = join(SRC_ROOT, "modelo");
    const fixtureFile = join(fixtureDir, "__l7_fixture_violacion_render.ts");

    afterAll(() => {
      // Limpieza garantizada aunque la aserción falle.
      rmSync(fixtureFile, { force: true });
    });

    test("una capa fuente que importa de render es detectada y nombrada", () => {
      writeFileSync(
        fixtureFile,
        [
          "// Fixture de control L7 (no-tautología). Import PROHIBIDO inyectado a propósito.",
          'import { proyectarModeloAJointCells } from "../render/jointjs/proyeccion";',
          "export const _l7Fixture = typeof proyectarModeloAJointCells;",
          "",
        ].join("\n"),
        "utf8",
      );

      const violaciones = detectarImportsARender([fixtureDir]);
      const relativa = relative(SRC_ROOT, fixtureFile).replaceAll("\\", "/");

      // El detector debe nombrar exactamente el archivo ofensor y su specifier.
      const ofensora = violaciones.find((v) => v.archivoRelativo === relativa);
      expect(ofensora).toBeDefined();
      expect(ofensora?.specifier).toBe("../render/jointjs/proyeccion");
    });
  });
});

// ── Detector estático ────────────────────────────────────────────────────────

interface ViolacionImport {
  /** Ruta del archivo ofensor relativa a src/ (p.ej. "modelo/foo.ts"). */
  archivoRelativo: string;
  /** Specifier literal del import ofensor (p.ej. "../render/jointjs/proyeccion"). */
  specifier: string;
}

/**
 * Escanea (recursivamente, sólo producción) las raíces dadas y devuelve los
 * imports/reexports/import()-dinámicos cuyo specifier RELATIVO resuelve dentro
 * de src/render/. Los specifiers no-relativos (paquetes npm) se ignoran: no hay
 * paquete `render`, y el repo no usa alias de paths (tsconfig sin `paths`).
 */
function detectarImportsARender(raices: string[]): ViolacionImport[] {
  return raices.flatMap((raiz) =>
    sourceFiles(raiz).flatMap((archivo) => {
      const texto = readFileSync(archivo, "utf8");
      return extraerSpecifiers(texto)
        .filter((spec) => esRelativo(spec) && resuelveDentroDeRender(archivo, spec))
        .map<ViolacionImport>((spec) => ({
          archivoRelativo: relative(SRC_ROOT, archivo).replaceAll("\\", "/"),
          specifier: spec,
        }));
    }),
  );
}

/** Lista recursiva de archivos .ts/.tsx de PRODUCCIÓN (excluye tests). */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const file = join(dir, name);
    const stat = statSync(file);
    if (stat.isDirectory()) return sourceFiles(file);
    if (!/\.(?:ts|tsx)$/.test(file) || file.endsWith(".test.ts") || file.endsWith(".test.tsx")) return [];
    return [file];
  });
}

/**
 * Extrae los specifiers de módulo de las tres formas relevantes:
 *   import ... from "x"   ·   export ... from "x"   ·   import("x")
 * (incluye `import "x"` con efecto colateral). Regex sobre texto: suficiente
 * para esta ley estructural; el código del repo no ofusca imports.
 */
function extraerSpecifiers(texto: string): string[] {
  const specs: string[] = [];
  const patrones = [
    // import ... from "x"  |  export ... from "x"  |  import "x"
    /\b(?:import|export)\b[^;'"]*?from\s*['"]([^'"]+)['"]/g,
    /\bimport\s*['"]([^'"]+)['"]/g,
    // import("x")  (dinámico)
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const re of patrones) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(texto)) !== null) {
      if (m[1]) specs.push(m[1]);
    }
  }
  return specs;
}

function esRelativo(spec: string): boolean {
  return spec.startsWith("./") || spec.startsWith("../");
}

/** ¿El specifier relativo de `archivo` resuelve a una ruta bajo src/render/? */
function resuelveDentroDeRender(archivo: string, spec: string): boolean {
  const destino = resolve(dirname(archivo), spec);
  const rel = relative(RENDER_ROOT, destino);
  // Dentro de RENDER_ROOT si la relativa no sube (`..`) ni es absoluta.
  return rel === "" || (!rel.startsWith("..") && !resolve(rel).startsWith(".."));
}
