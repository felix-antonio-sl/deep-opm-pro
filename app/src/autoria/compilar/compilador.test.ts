// TDD del compilador proto-modelo → Modelo (W4.2).
//
// Tres frentes:
//   (i)  un proto sintético mínimo (estilo cafetera) compila a un Modelo OPM
//        VÁLIDO — `emitirBundle` PASS sin errores de diagnóstico.
//   (ii) LEY L2: contabilidad completa sin pérdidas silenciosas — ninguna línea
//        del proto sin destino; CON fixture negativo (una línea inventada que no
//        cae en ninguna clase canónica → el ledger DEBE capturarla).
//  (iii) round-trip: `generarOpl` del modelo compilado contiene las oraciones
//        aplicadas (comparando CONJUNTOS de hechos normalizados, no strings).

import { describe, expect, test } from "bun:test";
import { compilarProto } from "./compilador";
import type { ResultadoCompilacion } from "./compilador";
import { emitirBundle } from "../bundle";
import { generarOpl } from "../../opl/generar";
import { parsearParrafoOpl, claveNombre } from "../../opl/parser/parsear";

// ── Fixture sintético mínimo (cafetera): SD + 1 in-zoom + estados + agente/
//    instrumento/TS ──────────────────────────────────────────────────────────

const PROTO_CAFE = `# SD0 — Hacer café (sistema)

Visión sistémica de la cafetera (prosa libre, no compila).

\`\`\`opl
Hacer café es físico y sistémico.
Persona es física y ambiental.
Persona maneja Hacer café.
Cafetera es física y sistémica.
Cafetera maneja Hacer café.
Hacer café requiere Cafetera.
Agua es física y ambiental.
Hacer café consume Agua.
Café es físico y ambiental.
Hacer café genera Café.
Café puede estar 'caliente' o 'frío'.
\`\`\`

Razonamiento del modelador entre bloques.

# SD1 — in-zoom de Hacer café

\`\`\`opl
Hacer café se descompone en Calentar agua y Verter.
Calentar agua y Verter son físicas y sistémicas.
Calentar agua consume Agua.
Calentar agua cambia Café de 'frío' a 'caliente'.
Verter genera Café.
\`\`\`
`;

function compilarCafe(): ResultadoCompilacion {
  return compilarProto(PROTO_CAFE, { id: "cafe", nombre: "Café" });
}

/** Conjunto de claves de hecho de un texto OPL (normalizado: tipo + extremos por clave). */
function hechosDeOpl(lineas: string[]): Set<string> {
  const set = new Set<string>();
  for (const linea of lineas) {
    if (!linea.trim() || linea.startsWith("#")) continue;
    const { ast } = parsearParrafoOpl(linea.trim());
    for (const a of ast) {
      switch (a.kind) {
        case "descripcion-cosa":
          set.add(`cosa:${claveNombre(a.nombre)}:${a.tipoEntidad}`);
          break;
        case "estados":
          set.add(`estados:${claveNombre(a.objeto)}`);
          break;
        case "procedimental":
          set.add(`${a.tipoEnlace}:${claveNombre(a.proceso ?? a.origen ?? "")}:${claveNombre(a.objeto ?? a.destino ?? "")}`);
          break;
        case "estructural":
          for (const d of a.destinos) set.add(`${a.tipoEnlace}:${claveNombre(a.origen)}:${claveNombre(d)}`);
          break;
        default:
          break;
      }
    }
  }
  return set;
}

// ── (i) compila a Modelo válido ────────────────────────────────────────────

describe("(i) proto sintético mínimo compila a Modelo válido", () => {
  test("emitirBundle PASS sin errores de diagnóstico", () => {
    const { autor } = compilarCafe();
    const bundle = emitirBundle(autor, { lanzarEnError: false });
    expect(bundle.avisos.filter((a) => a.severidad === "error")).toHaveLength(0);
    expect(bundle.conteos.opds).toBe(2);
    // 6 entidades (Hacer café, Persona, Cafetera, Agua, Café + Calentar agua, Verter).
    expect(bundle.conteos.entidades).toBe(7);
    // 2 estados (caliente, frío).
    expect(bundle.conteos.estados).toBe(2);
  });

  test("el modelo tiene un raíz y un in-zoom (refDescomp registrado)", () => {
    const { modelo } = compilarCafe();
    const raiz = modelo.opds[modelo.opdRaizId]!;
    expect(raiz.padreId).toBeNull();
    const proceso = Object.values(modelo.entidades).find((e) => e.nombre === "Hacer café");
    expect(proceso?.tipo).toBe("proceso");
    expect(proceso?.refinamientos?.descomposicion).toBeDefined();
  });

  test("los agentes son objetos físicos (firma `agente` legal)", () => {
    const { modelo } = compilarCafe();
    const persona = Object.values(modelo.entidades).find((e) => e.nombre === "Persona")!;
    expect(persona.tipo).toBe("objeto");
    expect(persona.esencia).toBe("fisica");
  });
});

// ── (ii) LEY L2: contabilidad sin pérdidas silenciosas ──────────────────────

describe("(ii) L2 — ninguna línea sin destino", () => {
  test("cada hecho aplicable produce ≥1 hecho; nada se pierde", () => {
    const { ledger, resumen } = compilarCafe();
    // El número de hechos aplicados == número de oraciones aplicables (con la
    // contabilidad de A1: `Calentar agua y Verter son físicas...` se parte en 2).
    expect(resumen.fallos).toBe(0);
    expect(resumen.excluidas).toBe(0);
    expect(resumen.aplicadas).toBeGreaterThan(0);
    // Toda entrada del ledger tiene un `tipo` reconocido (ninguna sin destino).
    const tiposValidos = new Set([
      "aplicada", "estructura", "rechazada", "excluida", "comentario", "estructural-md", "fallo",
    ]);
    for (const e of ledger.entradas) expect(tiposValidos.has(e.tipo)).toBe(true);
    // Cada `aplicada` aporta ≥1 hecho (A1/A6 trazados: una línea→N hechos).
    for (const e of ledger.entradas) {
      if (e.tipo === "aplicada") expect(e.hechos.length).toBeGreaterThanOrEqual(1);
    }
  });

  test("la suma de hechos del resumen == hechos en el ledger (sin doble conteo)", () => {
    const { ledger, resumen } = compilarCafe();
    const hechosLedger = ledger.entradas
      .filter((e) => e.tipo === "aplicada")
      .reduce((acc, e) => acc + (e.tipo === "aplicada" ? e.hechos.length : 0), 0);
    expect(hechosLedger).toBe(resumen.hechos);
  });

  test("fixture negativo: una línea inventada que no cae en ninguna clase → el ledger la captura como fallo o rechazada", () => {
    // `borbotea` no es verbo del catálogo cerrado (R3); el normalizador la rechaza.
    const protoConBarro = `# SD0

\`\`\`opl
Hacer café es físico y sistémico.
Agua es física y ambiental.
La cafetera borbotea misteriosamente el agua del cosmos.
\`\`\`
`;
    const { ledger } = compilarProto(protoConBarro, { id: "x", nombre: "X" });
    const capturada = ledger.entradas.find(
      (e) => e.tipo === "rechazada" || e.tipo === "fallo",
    );
    expect(capturada).toBeDefined();
    // NO desaparece en silencio: queda con su diagnóstico/razón.
    if (capturada?.tipo === "rechazada") {
      expect(capturada.diagnostico.length).toBeGreaterThan(0);
    } else if (capturada?.tipo === "fallo") {
      expect(capturada.razon.length).toBeGreaterThan(0);
    }
  });

  test("fixture negativo 2: comentario y prosa se conservan, no se compilan", () => {
    const proto = `# Encabezado de prueba

Prosa interbloque que es razonamiento, no hecho.

\`\`\`opl
# este es un comentario dentro del bloque
Hacer café es físico y sistémico.
\`\`\`
`;
    const { ledger } = compilarProto(proto, { id: "y", nombre: "Y" });
    expect(ledger.entradas.some((e) => e.tipo === "comentario")).toBe(true);
    expect(ledger.entradas.some((e) => e.tipo === "estructural-md" && e.clase === "prosa")).toBe(true);
    expect(ledger.entradas.some((e) => e.tipo === "estructural-md" && e.clase === "encabezado")).toBe(true);
  });
});

// ── (iii) round-trip: generarOpl ⊇ hechos aplicados ─────────────────────────

describe("(iii) round-trip — el OPL del modelo compilado contiene los hechos aplicados", () => {
  test("los hechos del SD0 sobreviven el round-trip (comparando conjuntos)", () => {
    const { autor, modelo } = compilarCafe();
    // Aplica layout/canon (no muta los hechos) para emitir el OPL canónico.
    emitirBundle(autor, { lanzarEnError: false });
    const oplRaiz = generarOpl(modelo, modelo.opdRaizId);
    const hechos = hechosDeOpl(oplRaiz);

    // Hechos esperados del SD0 (forma canónica por clave; el orden/forma no importa).
    const esperados = [
      "agente:hacer cafe:persona",
      "agente:hacer cafe:cafetera",
      "instrumento:hacer cafe:cafetera",
      "consumo:hacer cafe:agua",
      "resultado:hacer cafe:cafe",
      "estados:cafe",
    ];
    for (const h of esperados) expect(hechos).toContain(h);
  });

  test("el in-zoom emite sus subprocesos y sus enlaces", () => {
    const { autor, modelo } = compilarCafe();
    emitirBundle(autor, { lanzarEnError: false });
    const inzoom = Object.values(modelo.opds).find((o) => o.padreId !== null)!;
    const opl = generarOpl(modelo, inzoom.id);
    const hechos = hechosDeOpl(opl);
    expect(hechos).toContain("consumo:calentar agua:agua");
    // Verter genera Café — debe aparecer en el in-zoom.
    expect(hechos).toContain("resultado:verter:cafe");
  });
});
