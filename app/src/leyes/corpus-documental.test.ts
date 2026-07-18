// Ley editorial del corpus operativo publicado en docs/.
//
// Los manuales son las fuentes propietarias y las hojas rápidas son
// proyecciones derivadas. Esta ley evita cuatro formas de deriva:
// - documentos principales sin una jerarquía inequívoca;
// - rutas o anclas locales rotas;
// - hojas rápidas huérfanas, sin procedencia ni navegación de regreso;
// - atajos, registro o etiquetas retiradas que vuelven por una proyección.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { describe, expect, test } from "bun:test";

const RAIZ_REPO = resolve(import.meta.dir, "../../..");
const DOCS = resolve(RAIZ_REPO, "docs");
const CHEATSHEETS = resolve(DOCS, "cheatsheets");

const DOCUMENTOS_PRINCIPALES = [
  "README.md",
  "uso-productivo.md",
  "manual-opm-puro.md",
  "manual-opforja.md",
  "manual-sistemas-opm.md",
  "manual-sanitarios-opm.md",
  "manual-software-opm.md",
  "cheatsheets/README.md",
].map((ruta) => resolve(DOCS, ruta));

const HOJAS_RAPIDAS = readdirSync(CHEATSHEETS)
  .filter((nombre) => nombre.endsWith(".html"))
  .map((nombre) => resolve(CHEATSHEETS, nombre));

interface EnlaceLocal {
  ruta: string;
  ancla?: string;
}

function enlacesMarkdown(texto: string): EnlaceLocal[] {
  return [...texto.matchAll(/!?\[[^\]]*]\(([^)]+)\)/g)]
    .map((match) => match[1]!.trim().replace(/^<|>$/g, ""))
    .filter((destino) => !/^[a-z][a-z0-9+.-]*:/i.test(destino))
    .map((destino) => destino.split(/\s+["'(]/, 1)[0]!)
    .map((destino) => {
      const [ruta = "", ancla] = destino.split("#", 2);
      return ancla === undefined ? { ruta } : { ruta, ancla };
    });
}

function anclasMarkdown(texto: string): Set<string> {
  const anclas = new Set<string>();
  const repeticiones = new Map<string, number>();
  let enCodigo = false;

  for (const linea of texto.split("\n")) {
    if (/^\s*```/.test(linea)) {
      enCodigo = !enCodigo;
      continue;
    }
    if (enCodigo) continue;

    const match = linea.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!match) continue;
    const base = match[1]!
      .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/[`*_~]/g, "")
      .trim()
      .toLocaleLowerCase("es")
      .replace(/[^\p{L}\p{N}\s_-]/gu, "")
      .replace(/\s+/g, "-");
    const repeticion = repeticiones.get(base) ?? 0;
    repeticiones.set(base, repeticion + 1);
    anclas.add(repeticion === 0 ? base : `${base}-${repeticion}`);
  }
  return anclas;
}

describe("corpus documental · una fuente por concepto y proyecciones navegables", () => {
  test("cada documento principal tiene exactamente un H1", () => {
    for (const archivo of DOCUMENTOS_PRINCIPALES) {
      const texto = readFileSync(archivo, "utf8");
      expect(
        texto.match(/^#\s+/gm) ?? [],
        `${archivo} debe tener exactamente un H1`,
      ).toHaveLength(1);
    }
  });

  test("ningún enlace Markdown local de los documentos principales está roto", () => {
    for (const archivo of DOCUMENTOS_PRINCIPALES) {
      const texto = readFileSync(archivo, "utf8");
      for (const enlace of enlacesMarkdown(texto)) {
        if (!enlace.ruta) continue;
        const absoluto = resolve(dirname(archivo), enlace.ruta);
        expect(
          existsSync(absoluto),
          `${archivo} enlaza un destino local inexistente: ${enlace.ruta}`,
        ).toBe(true);
      }
    }
  });

  test("ningún enlace Markdown local apunta a una sección inexistente", () => {
    for (const archivo of DOCUMENTOS_PRINCIPALES) {
      const texto = readFileSync(archivo, "utf8");
      for (const enlace of enlacesMarkdown(texto)) {
        if (!enlace.ancla) continue;
        const destino = enlace.ruta
          ? resolve(dirname(archivo), enlace.ruta)
          : archivo;
        if (!destino.endsWith(".md") || !existsSync(destino)) continue;
        const anclas = anclasMarkdown(readFileSync(destino, "utf8"));
        const ancla = decodeURIComponent(enlace.ancla);
        expect(
          anclas.has(ancla),
          `${archivo} enlaza una sección inexistente: ${enlace.ruta}#${ancla}`,
        ).toBe(true);
      }
    }
  });

  test("cada hoja rápida declara idioma, un H1, procedencia e índices", () => {
    expect(HOJAS_RAPIDAS.length).toBeGreaterThan(0);
    const indice = readFileSync(resolve(CHEATSHEETS, "README.md"), "utf8");
    for (const archivo of HOJAS_RAPIDAS) {
      const html = readFileSync(archivo, "utf8");
      expect(
        html.includes('<html lang="es-CL">'),
        `${archivo} debe declarar español de Chile`,
      ).toBe(true);
      expect(
        html.match(/<h1\b/gi) ?? [],
        `${archivo} debe tener exactamente un H1`,
      ).toHaveLength(1);
      expect(
        /<link rel="icon" href="data:image\/svg\+xml,%3Csvg[^"]+%3C\/svg%3E">/.test(
          html,
        ),
        `${archivo} debe usar un favicon SVG autocontenido y correctamente codificado`,
      ).toBe(true);
      expect(
        indice.includes(`(${basename(archivo)})`),
        `${archivo} debe estar visible en el índice de hojas rápidas`,
      ).toBe(true);
      expect(
        html.includes('href="README.md"'),
        `${archivo} debe volver al índice de hojas`,
      ).toBe(true);
      expect(
        html.includes('href="../README.md"'),
        `${archivo} debe volver al índice del corpus`,
      ).toBe(true);
      expect(
        /href="\.\.\/(?:manual-[^"]+|uso-productivo)\.md(?:#[^"]*)?"/.test(
          html,
        ),
        `${archivo} debe declarar su manual propietario`,
      ).toBe(true);
      expect(
        html.includes("text-decoration:underline") ||
          html.includes("text-decoration: underline"),
        `${archivo} debe distinguir enlaces sin depender solo del color`,
      ).toBe(true);
      expect(
        html.includes("color-scheme: light; --paper: #fff"),
        `${archivo} debe forzar variables claras al imprimir`,
      ).toBe(true);

      const tablas = [...html.matchAll(/<table\b[\s\S]*?<\/table>/gi)].map(
        (match) => match[0],
      );
      for (const tabla of tablas) {
        expect(
          /<table\b[^>]*(?:aria-label|aria-labelledby)="[^"]+"/i.test(tabla),
          `${archivo} debe dar un nombre accesible a cada tabla`,
        ).toBe(true);
        expect(
          !/<tr>\s*<td\b/i.test(tabla),
          `${archivo} debe identificar el encabezado de cada fila con th`,
        ).toBe(true);
      }

      if (basename(archivo) === "opforja-avanzado.html") {
        expect(
          html.includes("@media (max-width: 600px)") &&
            html.includes(".mast { grid-template-columns: 1fr; }"),
          `${archivo} debe evitar desborde del encabezado en pantallas estrechas`,
        ).toBe(true);
      }
    }
  });

  test("ningún enlace local de las hojas rápidas está roto", () => {
    for (const archivo of HOJAS_RAPIDAS) {
      const html = readFileSync(archivo, "utf8");
      const destinos = [...html.matchAll(/href="([^"]+)"/g)].map(
        (match) => match[1]!,
      );
      for (const destino of destinos) {
        if (destino.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(destino)) {
          continue;
        }
        const ruta = destino.split("#", 1)[0]!;
        expect(
          existsSync(resolve(dirname(archivo), ruta)),
          `${archivo} enlaza un destino local inexistente: ${ruta}`,
        ).toBe(true);
      }
    }
  });

  test("las hojas no reintroducen atajos, registro o etiquetas retiradas", () => {
    for (const archivo of HOJAS_RAPIDAS) {
      const html = readFileSync(archivo, "utf8");
      expect(
        !/Ctrl\+N/.test(html),
        `${archivo} promete Ctrl+N, atajo que no existe`,
      ).toBe(true);
      expect(
        !/Ctrl\+O/.test(html),
        `${archivo} promete Ctrl+O, atajo que no existe`,
      ).toBe(true);
      expect(
        !/\b(?:Relajá|Deshacé|Probá|probá)\b/.test(html),
        `${archivo} usa voseo en lugar del registro editorial es-CL`,
      ).toBe(true);
      expect(
        !/<span class="cap">\s*(?:HOY|CORTO|FUERA)\s*<\/span>/.test(html),
        `${archivo} usa etiquetas de capacidad fuera del vocabulario vigente`,
      ).toBe(true);
      expect(
        !html.includes("«Revisión nueva»"),
        `${archivo} usa el nombre retirado del chip de revisión`,
      ).toBe(true);
    }
  });

  test("las afirmaciones operativas críticas reflejan el comportamiento vigente", () => {
    const uso = readFileSync(resolve(DOCS, "uso-productivo.md"), "utf8");
    const manualOpforja = readFileSync(resolve(DOCS, "manual-opforja.md"), "utf8");
    const manualPuro = readFileSync(resolve(DOCS, "manual-opm-puro.md"), "utf8");
    const manualSanitario = readFileSync(resolve(DOCS, "manual-sanitarios-opm.md"), "utf8");
    const hojasPuente = [
      "opforja-software.html",
      "opforja-skill-flujo.html",
      "opforja-interaccion-skill.html",
    ].map((archivo) => readFileSync(resolve(CHEATSHEETS, archivo), "utf8"));

    expect(uso).toContain("el clic no fuerza por sí mismo el guardado");
    expect(uso).not.toContain("fondo ámbar");
    expect(manualOpforja).toContain("`Testigo-Base`");
    expect(manualOpforja).toContain("--base <Testigo-Base>");
    expect(manualOpforja).toContain("dentro de la misma transacción");
    expect(manualOpforja).toContain("responde `409` y no escribe nada");
    expect(manualOpforja).toContain("`404/405/501`");
    expect(manualOpforja).toContain("modelo, versión y");
    expect(manualOpforja).toContain("especie —incluida la marca de apunte");
    expect(manualOpforja).toContain("workspace también porta una revisión monotónica");
    expect(manualOpforja).toContain("No convierte la");
    expect(manualOpforja).toContain("mesa en editor colaborativo");
    expect(manualOpforja).toContain("ligadas a la identidad de sesión");
    expect(manualOpforja).toContain("no una firma criptográfica");
    expect(manualOpforja).not.toContain("lo emite solo el compilador");
    expect(manualOpforja).not.toContain("el bundle no queda ligado");
    expect(manualOpforja).not.toContain("etiquetado parcial");
    expect(manualOpforja).not.toContain("segundo gesto");
    expect(manualOpforja).not.toContain("directo contra el backend desplegado");
    expect(manualOpforja).not.toContain("Soltar desancla irreversible");
    expect(readFileSync(resolve(DOCS, "manual-software-opm.md"), "utf8"))
      .not.toContain("no liga el bundle a la revisión de un `pull` anterior");
    for (const hoja of hojasPuente) {
      expect(hoja).toContain("404/405/501");
      expect(hoja).toContain("W6.0");
      expect(hoja).not.toContain("directo contra el backend desplegado");
    }
    expect(hojasPuente[1]).toContain("--especie apunte|modelo");
    expect(hojasPuente[1]).toContain("la creación omite");
    expect(hojasPuente[1]).toContain("Push sí crea una revisión");
    expect(hojasPuente[1]).toContain("dirty</em> solo advierte ediciones locales aún no guardadas");
    expect(hojasPuente[1]).toContain("El sello no la demuestra por sí solo");
    expect(hojasPuente[1]).not.toContain("Las herramientas del agente son <strong>read-through</strong>");
    expect(hojasPuente[1]).not.toContain("detectar si la mesa lo editó tras la emisión");
    expect(readFileSync(resolve(CHEATSHEETS, "opforja-sistemas.html"), "utf8"))
      .toContain("ni implica factibilidad validada o prioridad");
    const specPuenteHistorica = readFileSync(
      resolve(DOCS, "superpowers/specs/2026-07-06-puente-directo-mesa-skill-design.md"),
      "utf8",
    );
    expect(specPuenteHistorica).toContain("HISTÓRICO PARCIAL");
    expect(specPuenteHistorica).toContain("protocolo 2.0, todavía no desplegado");
    expect(specPuenteHistorica).toContain("../../manual-opforja.md#a6-puente-directo-mesaskill-cli");
    const hojasConRecetaMesa = HOJAS_RAPIDAS
      .filter((ruta) => readFileSync(ruta, "utf8").includes("bun run mesa"))
      .map((ruta) => basename(ruta));
    expect(hojasConRecetaMesa).toEqual(["opforja-skill-flujo.html"]);
    expect(manualPuro).toContain("ISO 19450:2024");
    expect(manualPuro).not.toContain("ISO/PAS 19450");
    expect(manualSanitario).not.toContain("soltar (irreversible)");
  });
});
