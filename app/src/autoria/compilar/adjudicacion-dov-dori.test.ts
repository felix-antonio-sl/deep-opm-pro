// TDD de la adjudicación dov-dori 2026-06-05 sobre los 5 hallazgos del segundo
// dominio (`docs/proto-modelo/adjudicacion-dov-dori-2026-06-05.md`).
//
// Lección rectora (§1 síntesis): un compilador honesto RECONOCE FORMAS y RECHAZA
// lo que no reconoce; no enumera instancias ni absorbe lo ambiguo.
//
//   P0 (c) — guard anti-silencio R9: un nombre-a-crear con residuo no nominal
//            (paréntesis colgante / localizador de cita) NO crea entidad en
//            silencio → fallo con diagnóstico. + check duplicado-por-absorción.
//   P1 (b) — detector de citas anclado en el LOCALIZADOR (art./§/N°/inc./letra,
//            conjunto cerrado), no en el enum de cuerpos (conjunto abierto).
//   P2 (a) — R8: plural sin sufijo Conjunto/Grupo se RECHAZA con sugerencia,
//            jamás se normaliza en silencio (R-NOM-OBJ-1/2).
//   P2 (d) — V17 `está acotado por` bifurcado por firma de extremos:
//            temporal → exhibición (`exhibe Plazo`); abstracto↔abstracto →
//            estructural etiquetado. Destraba la en-reflexión #2 de HODOM.
//   P2 (e) — V16 `notifica a` → `genera <Mensaje>` + tagged «dirigido a».
//            El enum de verbos OPL NUNCA se infla.

import { describe, expect, test } from "bun:test";
import { construirContextoProto, normalizarBloqueOpl, extraerAnclasDeLinea } from "./normalizador";
import { compilarProto } from "./compilador";
import { residuoNoNominal } from "./resolutor";
import { detectarDuplicadosPorAbsorcion } from "./absorcion";
import type { LineaNormalizada } from "./tipos";

function norm(lineas: string[], protoContexto = ""): LineaNormalizada[] {
  const bloques = protoContexto ? [DECLARACIONES, lineas] : [lineas];
  const contexto = construirContextoProto(bloques);
  return normalizarBloqueOpl(lineas, contexto);
}

function una(oracion: string, protoContexto = ""): LineaNormalizada {
  const r = norm([oracion], protoContexto);
  expect(r.length).toBeGreaterThanOrEqual(1);
  return r[0]!;
}

const DECLARACIONES = [
  "Revisión técnica del proyecto es un proceso físico y sistémico.",
  "Permiso de edificación es un objeto informacional y sistémico.",
  "Solicitante es un objeto físico y ambiental.",
  "Resolución del permiso es un proceso físico y sistémico.",
  "Acceso del colaborador es un objeto informacional y sistémico.",
  "Deber de reserva es un objeto informacional y sistémico.",
];

const PROTO_MINIMO = `# Dominio chico

\`\`\`opl
${DECLARACIONES.join("\n")}
\`\`\`
`;

// ════════════════════════════════════════════════════════════════════════════
// P0 (c) — guard anti-silencio R9
// ════════════════════════════════════════════════════════════════════════════

describe("P0 (c) — residuoNoNominal: detector de material no nominal en nombres", () => {
  test("paréntesis colgante → residuo", () => {
    expect(residuoNoNominal("Permiso de edificación (LGUC art. 116)")).toBeTruthy();
    expect(residuoNoNominal("Informe (borrador interno)")).toBeTruthy();
  });

  test("corchete y localizador suelto → residuo", () => {
    expect(residuoNoNominal("Permiso [C3]")).toBeTruthy();
    expect(residuoNoNominal("Plazo art. 118")).toBeTruthy();
    expect(residuoNoNominal("Garantía §5.1.6")).toBeTruthy();
  });

  test("nombres limpios → null", () => {
    expect(residuoNoNominal("Permiso de edificación")).toBeNull();
    expect(residuoNoNominal("Registro Evolutivo en Ficha Clínica")).toBeNull();
    expect(residuoNoNominal("Conjunto de planos de arquitectura")).toBeNull();
    // `Artículo` como palabra léxica del nombre NO es localizador de cita.
    expect(residuoNoNominal("Artículo de aseo")).toBeNull();
  });
});

describe("P0 (c) — el compilador NO crea entidades con residuo (fixture negativo L2/L8)", () => {
  test("cita no extraíble absorbida al nombre → FALLO con diagnóstico, no entidad duplicada", () => {
    // `(Anexo Técnico 4 capítulo 2)` no dispara el detector de citas (sin
    // localizador estándar, sin cuerpo+numeración-legal): por (c) NO debe
    // absorberse al nombre — la línea cae a fallo con diagnóstico R9.
    const md = PROTO_MINIMO + `
\`\`\`opl
Revisión técnica del proyecto genera Permiso de edificación (Anexo Técnico cuatro capítulo dos).
\`\`\`
`;
    const { modelo, ledger } = compilarProto(md, { id: "x", nombre: "X" });
    const conParen = Object.values(modelo.entidades).filter((e) => e.nombre.includes("("));
    expect(conParen).toEqual([]);
    const fallo = ledger.entradas.find(
      (e) => e.tipo === "fallo" && /R9|no nominal/iu.test((e as { razon: string }).razon),
    );
    expect(fallo).toBeDefined();
  });

  test("control: la misma oración SIN residuo compila normal", () => {
    const md = PROTO_MINIMO + `
\`\`\`opl
Revisión técnica del proyecto genera Permiso de edificación.
\`\`\`
`;
    const { modelo, resumen } = compilarProto(md, { id: "x", nombre: "X" });
    expect(resumen.fallos).toBe(0);
    expect(Object.values(modelo.entidades).some((e) => e.nombre === "Permiso de edificación")).toBe(true);
  });
});

describe("P0 (c) — check duplicado-por-absorción (capa semántica)", () => {
  test("base + base(sufijo parentético) → par detectado; con localizador → esCita", () => {
    const md = PROTO_MINIMO;
    const { modelo } = compilarProto(md, { id: "x", nombre: "X" });
    // Inyecta el caso corrupto directamente (simula un bundle pre-guard).
    modelo.entidades["e-test-1"] = { ...Object.values(modelo.entidades)[0]!, id: "e-test-1", nombre: "Permiso de edificación" };
    modelo.entidades["e-test-2"] = { ...Object.values(modelo.entidades)[0]!, id: "e-test-2", nombre: "Permiso de edificación (LGUC art. 116)" };
    modelo.entidades["e-test-3"] = { ...Object.values(modelo.entidades)[0]!, id: "e-test-3", nombre: "Informe" };
    modelo.entidades["e-test-4"] = { ...Object.values(modelo.entidades)[0]!, id: "e-test-4", nombre: "Informe (provisional)" };
    const pares = detectarDuplicadosPorAbsorcion(modelo);
    expect(pares).toHaveLength(2);
    const cita = pares.find((p) => p.sufijo.includes("art."));
    expect(cita?.esCita).toBe(true);
    const prov = pares.find((p) => p.sufijo.includes("provisional"));
    expect(prov?.esCita).toBe(false);
  });

  test("sin pares → vacío (no-tautología: nombres distintos de verdad no disparan)", () => {
    const { modelo } = compilarProto(PROTO_MINIMO, { id: "x", nombre: "X" });
    expect(detectarDuplicadosPorAbsorcion(modelo)).toEqual([]);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// P1 (b) — detector de citas por LOCALIZADOR (cerrado), no por cuerpo (abierto)
// ════════════════════════════════════════════════════════════════════════════

describe("P1 (b) — señal de localizador: cuerpos NO enumerados se reconocen", () => {
  const positivos: Array<[string, string, string[] | undefined]> = [
    ["(LGUC art. 116)", "LGUC", ["116"]],
    ["(OGUC §5.1.6)", "OGUC", undefined],
    ["(Ley 19.880 art. 64)", "Ley 19.880", ["64"]],
    ["(Código Civil art. 1545)", "Código Civil", ["1545"]],
    ["(ISO 19450 §7.3)", "ISO 19450", undefined],
  ];
  for (const [cita, norma, articulos] of positivos) {
    test(`${cita} → ancla norma "${norma}"`, () => {
      const anclas = extraerAnclasDeLinea(`Algo requiere Cosa ${cita}.`);
      const n = anclas.find((a) => a.clase === "norma");
      if (!n || n.clase !== "norma") throw new Error(`esperaba norma para ${cita}`);
      expect(n.referencias[0]!.norma).toBe(norma);
      if (articulos) expect(n.referencias[0]!.articulos).toEqual(articulos);
    });
  }

  test("(art. 17) sin cuerpo → ancla con artículo y sin cuerpo inventado", () => {
    const anclas = extraerAnclasDeLinea("Algo requiere Cosa (art. 17).");
    const n = anclas.find((a) => a.clase === "norma");
    if (!n || n.clase !== "norma") throw new Error("esperaba norma");
    expect(n.referencias[0]!.articulos).toEqual(["17"]);
  });

  test("señal cuerpo-con-numeración legal: (DFL 458) y (NCh 433) sin localizador", () => {
    for (const [cita, norma] of [["(DFL 458)", "DFL 458"], ["(NCh 433)", "NCh 433"]] as const) {
      const anclas = extraerAnclasDeLinea(`Algo requiere Cosa ${cita}.`);
      const n = anclas.find((a) => a.clase === "norma");
      if (!n || n.clase !== "norma") throw new Error(`esperaba norma para ${cita}`);
      expect(n.referencias[0]!.norma).toBe(norma);
    }
  });
});

describe("P1 (b) — anti-falso-positivo: paréntesis que NO son citas NO se extraen", () => {
  const negativos = ["(opcional)", "(ver SD1)", "(versión 2.1)", "(el grande)", "(de 'a' a 'b')"];
  for (const paren of negativos) {
    test(`${paren} NO es cita`, () => {
      const anclas = extraerAnclasDeLinea(`Algo requiere Cosa ${paren}.`);
      expect(anclas.find((a) => a.clase === "norma")).toBeUndefined();
    });
  }
});

describe("P1 (b) — regresión: el vocabulario HODOM sigue reconociéndose", () => {
  test("(DS art. 12), (NT 2024 §emergencias), (Ley 20.584 art. 12-13) intactos", () => {
    for (const [cita, norma] of [
      ["(DS art. 12)", "DS"],
      ["(NT 2024 §emergencias)", "NT 2024"],
      ["(Ley 20.584 art. 12-13)", "Ley 20.584"],
    ] as const) {
      const anclas = extraerAnclasDeLinea(`Algo requiere Cosa ${cita}.`);
      const n = anclas.find((a) => a.clase === "norma");
      if (!n || n.clase !== "norma") throw new Error(`esperaba norma para ${cita}`);
      expect(n.referencias[0]!.norma).toBe(norma);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// P2 (a) — R8: plural sin Conjunto/Grupo se RECHAZA con sugerencia
// ════════════════════════════════════════════════════════════════════════════

describe("P2 (a) — R8: esencia plural de sujeto no-lista", () => {
  test("`Planos de arquitectura son informacionales y ambientales` → R8 con sugerencia", () => {
    const l = una("Planos de arquitectura son informacionales y ambientales.");
    expect(l.clase).toBe("rechazada");
    if (l.clase !== "rechazada") throw new Error("nunca");
    expect(l.categoria).toBe("R8");
    expect(l.diagnostico).toMatch(/Conjunto de|singular/iu);
  });

  test("control A1: la LISTA con `son` sigue normalizándose (no es R8)", () => {
    const r = norm(["Ingreso de la solicitud, Revisión técnica y Resolución del permiso son físicas y sistémicas."]);
    expect(r.every((l) => l.clase !== "rechazada")).toBe(true);
  });

  test("control: esencia singular `es` intacta", () => {
    const l = una("Expediente de permiso es informacional y sistémico.");
    expect(l.clase === "estricta" || l.clase === "normalizada").toBe(true);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// P2 (d) — V17: `está acotado por` bifurcado por firma de extremos
// ════════════════════════════════════════════════════════════════════════════

describe("P2 (d) — V17 acotación", () => {
  test("rama temporal: `está acotada por un plazo de 30 días` → exhibe Plazo + cola anotada", () => {
    const l = una("Resolución del permiso está acotada por un plazo de 30 días.", PROTO_MINIMO);
    expect(l.clase).toBe("compuesta");
    if (l.clase !== "compuesta") throw new Error("nunca");
    expect(l.regla).toBe("V17");
    const directiva = l.emisiones.find((e) => e.via === "directiva");
    expect(directiva).toBeDefined();
    if (!directiva || directiva.via !== "directiva") throw new Error("nunca");
    expect(directiva.directiva.tipo).toBe("hecho-anotado");
    if (directiva.directiva.tipo !== "hecho-anotado") throw new Error("nunca");
    expect(directiva.directiva.oracion).toContain("exhibe Plazo");
    expect(directiva.directiva.colaAnotada).toContain("30 días");
  });

  test("rama abstracta (en-reflexión #2 HODOM): tagged «está acotado por»", () => {
    const l = una(
      "Acceso del colaborador está acotado por Deber de reserva.",
      PROTO_MINIMO,
    );
    expect(l.clase).toBe("compuesta");
    if (l.clase !== "compuesta") throw new Error("nunca");
    expect(l.regla).toBe("V17");
    const directiva = l.emisiones.find((e) => e.via === "directiva");
    if (!directiva || directiva.via !== "directiva") throw new Error("nunca");
    expect(directiva.directiva.tipo).toBe("tagged");
    if (directiva.directiva.tipo !== "tagged") throw new Error("nunca");
    expect(directiva.directiva.etiqueta).toBe("está acotado por");
    expect(directiva.directiva.origen).toBe("Acceso del colaborador");
    expect(directiva.directiva.destino).toBe("Deber de reserva");
  });

  test("punta a punta: el caso HODOM compila a enlace etiquetado", () => {
    const md = PROTO_MINIMO + `
\`\`\`opl
Acceso del colaborador está acotado por Deber de reserva.
\`\`\`
`;
    const { modelo, resumen } = compilarProto(md, { id: "x", nombre: "X" });
    expect(resumen.rechazadas).toBe(0);
    expect(resumen.fallos).toBe(0);
    const etiquetado = Object.values(modelo.enlaces).find(
      (e) => e.tipo === "etiquetado" && e.etiqueta === "está acotado por",
    );
    expect(etiquetado).toBeDefined();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// P2 (e) — V16: `notifica a` → genera <Mensaje> + tagged «dirigido a»
// ════════════════════════════════════════════════════════════════════════════

describe("P2 (e) — V16 notifica", () => {
  test("`P notifica al Solicitante la resolución adoptada` → genera Notificación + dirigido a", () => {
    const l = una("Resolución del permiso notifica al Solicitante la resolución adoptada.", PROTO_MINIMO);
    expect(l.clase).toBe("compuesta");
    if (l.clase !== "compuesta") throw new Error("nunca");
    expect(l.regla).toBe("V16");
    const oracion = l.emisiones.find((e) => e.via === "oracion");
    if (!oracion || oracion.via !== "oracion") throw new Error("esperaba oración genera");
    expect(oracion.oracion).toContain("genera Notificación");
    const directiva = l.emisiones.find((e) => e.via === "directiva");
    if (!directiva || directiva.via !== "directiva") throw new Error("esperaba tagged");
    expect(directiva.directiva.tipo).toBe("tagged");
    if (directiva.directiva.tipo !== "tagged") throw new Error("nunca");
    expect(directiva.directiva.origen).toBe("Notificación");
    expect(directiva.directiva.destino).toBe("Solicitante");
    expect(directiva.directiva.etiqueta).toBe("dirigido a");
  });

  test("punta a punta: genera + etiquetado en el modelo; el verbo NUNCA entra al enum", () => {
    const md = PROTO_MINIMO + `
\`\`\`opl
Resolución del permiso notifica al Solicitante la resolución adoptada.
\`\`\`
`;
    const { modelo, resumen } = compilarProto(md, { id: "x", nombre: "X" });
    expect(resumen.rechazadas).toBe(0);
    expect(resumen.fallos).toBe(0);
    expect(Object.values(modelo.entidades).some((e) => e.nombre === "Notificación")).toBe(true);
    const dirigido = Object.values(modelo.enlaces).find(
      (e) => e.tipo === "etiquetado" && e.etiqueta === "dirigido a",
    );
    expect(dirigido).toBeDefined();
    const resultado = Object.values(modelo.enlaces).find((e) => e.tipo === "resultado");
    expect(resultado).toBeDefined();
  });
});
