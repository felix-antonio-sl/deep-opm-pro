// TDD de la compilación de anclas normativas del proto → `AnclaNormativa` (W5.2).
//
// Cubre los tres frentes del diseño adjudicado
// (`diseno-ancla-normativa.md (retirado 2a83c1c5, en git)`):
//
//   (1) EXTRACCIÓN por forma inline en líneas de hecho (DS/NT/Ley, [RATIFICAR]),
//       con strip que NO rompe el parseo de la oración limpia.
//   (2) COMPILACIÓN al emisor: target correcto por tipo de línea (enlace si la
//       línea emite enlace; entidad si declara cosa; OPD si el ancla vive en un
//       comentario de bloque), estado `vigente`/`pendiente-ratificacion`.
//   (3) claveProto estable: `#clave` explícita manda; si no, derivación
//       determinista que sobrevive a la edición de la nota. `[C1]`-style JAMÁS
//       compila (candidata conservada). Ancla sobre línea RECHAZADA → al ledger.
//
// L8 (contabilidad): anclas detectadas == compiladas + candidatas-conservadas +
// las de líneas rechazadas. Ninguna se pierde en silencio.

import { describe, expect, test } from "bun:test";
import { construirContextoProto, normalizarBloqueOpl, extraerAnclasDeLinea } from "./normalizador";
import { compilarProto } from "./compilador";
import { enumerarAnclas, anclasPendientes, anclaPorClaveProto, anclasDeTarget } from "../../modelo/anclasNormativas";
import type { AnclaNormativa } from "../../modelo/tipos";

// ── (1) Extracción por forma (función pura del normalizador) ──────────────────

describe("extracción de anclas inline por forma", () => {
  test("(DS art. N) → referencia DS con un artículo", () => {
    const anclas = extraerAnclasDeLinea("Categorización clínica requiere Paciente (DS art. 12).");
    const norma = anclas.find((a) => a.clase === "norma");
    expect(norma).toBeDefined();
    expect(norma!.clase).toBe("norma");
    if (norma!.clase !== "norma") throw new Error("nunca");
    expect(norma!.referencias).toEqual([{ norma: "DS", articulos: ["12"] }]);
  });

  test("(DS art. 15, 17) → multi-artículo verbatim (sin expandir rangos)", () => {
    const anclas = extraerAnclasDeLinea("Algo requiere Cosa (DS art. 15, 17).");
    const norma = anclas.find((a) => a.clase === "norma");
    if (!norma || norma.clase !== "norma") throw new Error("esperaba norma");
    expect(norma.referencias).toEqual([{ norma: "DS", articulos: ["15", "17"] }]);
  });

  test("(DS art. 15-17) → rango VERBATIM (decisión §10.5: no expandir)", () => {
    const anclas = extraerAnclasDeLinea("Algo requiere Cosa (DS art. 15-17).");
    const norma = anclas.find((a) => a.clase === "norma");
    if (!norma || norma.clase !== "norma") throw new Error("esperaba norma");
    expect(norma.referencias[0]!.articulos).toEqual(["15-17"]);
  });

  test("(NT 2024 §emergencias) → sección sin artículos", () => {
    const anclas = extraerAnclasDeLinea("Algo requiere Cosa (NT 2024 §emergencias).");
    const norma = anclas.find((a) => a.clase === "norma");
    if (!norma || norma.clase !== "norma") throw new Error("esperaba norma");
    expect(norma.referencias[0]!.norma).toBe("NT 2024");
    expect(norma.referencias[0]!.seccion).toBe("§emergencias");
    expect(norma.referencias[0]!.articulos).toBeUndefined();
  });

  test("(Ley 20.584 art. 12-13) → norma con número y artículo verbatim", () => {
    const anclas = extraerAnclasDeLinea("Algo requiere Cosa (Ley 20.584 art. 12-13).");
    const norma = anclas.find((a) => a.clase === "norma");
    if (!norma || norma.clase !== "norma") throw new Error("esperaba norma");
    expect(norma.referencias[0]!.norma).toBe("Ley 20.584");
    expect(norma.referencias[0]!.articulos).toEqual(["12-13"]);
  });

  test("[RATIFICAR: texto] → pendiente con la nota", () => {
    const anclas = extraerAnclasDeLinea("Algo requiere Cosa [RATIFICAR: ¿es objeto-frontera?].");
    const rat = anclas.find((a) => a.clase === "ratificacion");
    if (!rat || rat.clase !== "ratificacion") throw new Error("esperaba ratificacion");
    expect(rat.nota).toBe("¿es objeto-frontera?");
    expect(rat.claveExplicita).toBeUndefined();
  });

  test("[RATIFICAR #clave: texto] → pendiente con clave explícita y nota", () => {
    const anclas = extraerAnclasDeLinea("Algo requiere Cosa [RATIFICAR #convenio-ges: ¿el Convenio es frontera?].");
    const rat = anclas.find((a) => a.clase === "ratificacion");
    if (!rat || rat.clase !== "ratificacion") throw new Error("esperaba ratificacion");
    expect(rat.claveExplicita).toBe("convenio-ges");
    expect(rat.nota).toBe("¿el Convenio es frontera?");
  });

  test("[RATIFICAR] desnudo → pendiente puro sin nota", () => {
    const anclas = extraerAnclasDeLinea("Algo requiere Cosa [RATIFICAR].");
    const rat = anclas.find((a) => a.clase === "ratificacion");
    if (!rat || rat.clase !== "ratificacion") throw new Error("esperaba ratificacion");
    expect(rat.nota).toBeUndefined();
  });

  test("`#clave` explícita en cita de norma inline (no entre paréntesis)", () => {
    const anclas = extraerAnclasDeLinea("Anclaje DS art. 17 #frontera-art17.");
    const norma = anclas.find((a) => a.clase === "norma");
    if (!norma || norma.clase !== "norma") throw new Error("esperaba norma");
    expect(norma.claveExplicita).toBe("frontera-art17");
    expect(norma.referencias[0]).toEqual({ norma: "DS", articulos: ["17"] });
  });

  test("compilar-01: `#clave` DENTRO de paréntesis se extrae UNA sola vez (no se duplica con la inline)", () => {
    // Bug: el mismo `(DS art. 17 #clave-mia)` lo capturaba ANCLA_PAREN_LOCALIZADOR_RE
    // (con la `#clave`) Y ANCLA_NORMA_INLINE_RE (sin paréntesis), produciendo DOS
    // anclas idénticas → claveProto duplicada (`ancla:clave-mia` + `…-2`) e infla los
    // conteos. La inline contenida en un rango-paréntesis YA extraído debe descartarse.
    const anclas = extraerAnclasDeLinea("Sistema genera Documento (DS art. 17 #clave-mia).");
    const normas = anclas.filter((a) => a.clase === "norma");
    expect(normas).toHaveLength(1);
    const norma = normas[0];
    if (!norma || norma.clase !== "norma") throw new Error("esperaba norma");
    expect(norma.claveExplicita).toBe("clave-mia");
    expect(norma.referencias[0]).toEqual({ norma: "DS", articulos: ["17"] });
  });

  test("compilar-01: una cita inline LEGÍTIMA fuera de paréntesis sigue extrayéndose junto a una entre paréntesis", () => {
    // El descarte es por CONTENCIÓN ESTRICTA del span: una inline real fuera de todo
    // paréntesis no se ve afectada por el rango de un paréntesis previo en la línea.
    const anclas = extraerAnclasDeLinea("Algo requiere Cosa (DS art. 5) y se ancla en NT 2024 §x #frontera-libre.");
    const normas = anclas.filter((a): a is Extract<(typeof anclas)[number], { clase: "norma" }> => a.clase === "norma");
    expect(normas).toHaveLength(2);
    expect(normas.some((n) => n.claveExplicita === "frontera-libre")).toBe(true);
    expect(normas.some((n) => n.referencias[0]?.articulos?.includes("5"))).toBe(true);
  });

  test("multi-norma `DS … arts. …; NT 2024 §…` → varias referencias, artículos verbatim", () => {
    const anclas = extraerAnclasDeLinea("Algo requiere Cosa (DS 1/2022 arts. 8, 15-17, 21; NT 2024 §emergencias).");
    const norma = anclas.find((a) => a.clase === "norma");
    if (!norma || norma.clase !== "norma") throw new Error("esperaba norma");
    expect(norma.referencias).toEqual([
      { norma: "DS 1/2022", articulos: ["8", "15-17", "21"] },
      { norma: "NT 2024", seccion: "§emergencias" },
    ]);
  });

  test("[C1]/[Q14]/[B3] → CANDIDATA, jamás norma ni ratificación (§10.3)", () => {
    for (const marca of ["[C1]", "[Q14]", "[B3]", "[C4/D]", "[Q8 — pata logística]"]) {
      const anclas = extraerAnclasDeLinea(`# Flota y móviles ${marca}`);
      expect(anclas.every((a) => a.clase === "candidata")).toBe(true);
      expect(anclas.some((a) => a.clase === "norma" || a.clase === "ratificacion")).toBe(false);
    }
  });
});

// ── (1b) Strip NO rompe el parseo: la oración limpia sigue su camino normal ────

describe("strip de anclas no contamina la clasificación", () => {
  const ctx = construirContextoProto([[
    "Categorización clínica es un proceso físico y sistémico.",
    "Paciente es un objeto físico y sistémico.",
  ]]);

  test("una cita normativa inline no cambia la clase de la oración (sigue estricta)", () => {
    const conAncla = normalizarBloqueOpl(["Categorización clínica requiere Paciente (DS art. 12)."], ctx);
    const sinAncla = normalizarBloqueOpl(["Categorización clínica requiere Paciente."], ctx);
    expect(conAncla[0]!.clase).toBe(sinAncla[0]!.clase);
    if (conAncla[0]!.clase !== "estricta" || sinAncla[0]!.clase !== "estricta") throw new Error("esperaba estricta");
    expect(conAncla[0]!.oracion).toBe(sinAncla[0]!.oracion);
    // y el ancla viaja adjunta a la línea
    expect((conAncla[0] as { anclas?: unknown[] }).anclas?.length).toBe(1);
  });

  test("[RATIFICAR] tras una oración estricta no la degrada", () => {
    const out = normalizarBloqueOpl(["Categorización clínica requiere Paciente [RATIFICAR: dudoso]."], ctx);
    expect(out[0]!.clase).toBe("estricta");
  });
});

// ── (2) Compilación al modelo: target por tipo de línea ───────────────────────

describe("compilación de anclas a AnclaNormativa (target por tipo de línea)", () => {
  const PROTO = `# SD0 — Demo anclas

\`\`\`opl
Categorización clínica es un proceso físico y sistémico.
Paciente es un objeto físico y sistémico (DS art. 5).
Categorización clínica requiere Paciente (DS art. 12).
Categorización clínica afecta Paciente [RATIFICAR #frontera: ¿separar episodio del programa?].
\`\`\`
`;

  const { modelo } = compilarProto(PROTO, { id: "demo-anclas" });

  test("la línea que declara una cosa → ancla con target entidad", () => {
    const anclas = enumerarAnclas(modelo);
    const sobreEntidad = anclas.find((a) => a.target.tipo === "entidad");
    expect(sobreEntidad).toBeDefined();
    expect(sobreEntidad!.estado).toBe("vigente");
    expect(sobreEntidad!.referencias?.[0]).toEqual({ norma: "DS", articulos: ["5"] });
  });

  test("la línea que emite un enlace (requiere) → ancla con target enlace", () => {
    const anclas = enumerarAnclas(modelo);
    const sobreEnlace = anclas.filter((a) => a.target.tipo === "enlace" && a.estado === "vigente");
    expect(sobreEnlace.length).toBeGreaterThanOrEqual(1);
    const conDs12 = sobreEnlace.find((a) => a.referencias?.some((r) => r.articulos?.includes("12")));
    expect(conDs12).toBeDefined();
    // el target enlace existe en el modelo
    if (conDs12!.target.tipo !== "enlace") throw new Error("nunca");
    expect(modelo.enlaces[conDs12!.target.id]).toBeDefined();
  });

  test("[RATIFICAR] sobre un enlace → ancla pendiente-ratificacion con la nota", () => {
    const ancla = anclaPorClaveProto(modelo, "ratificar:frontera");
    expect(ancla).toBeDefined();
    expect(ancla!.estado).toBe("pendiente-ratificacion");
    expect(ancla!.nota).toContain("separar episodio");
    expect(ancla!.target.tipo).toBe("enlace");
    expect(ancla!.ratificacion?.estadoRatificacion).toBe("pendiente");
  });

  test("clave explícita de RATIFICAR usa el prefijo de género `ratificar:`", () => {
    expect(anclaPorClaveProto(modelo, "ratificar:frontera")).toBeDefined();
  });
});

// ── (2b) Ancla en comentario de bloque → target OPD ───────────────────────────

describe("ancla normativa en comentario de bloque", () => {
  const PROTO = `# SD0 — Demo comentario

\`\`\`opl
# Bloque clínico (DS art. 8)
Categorización clínica es un proceso físico y sistémico.
Paciente es un objeto físico y sistémico.
Categorización clínica requiere Paciente.
\`\`\`
`;
  const { modelo } = compilarProto(PROTO, { id: "demo-comentario" });

  test("la cita normativa del comentario → ancla con target OPD del bloque", () => {
    const sobreOpd = enumerarAnclas(modelo).filter((a) => a.target.tipo === "opd");
    expect(sobreOpd.length).toBe(1);
    expect(sobreOpd[0]!.referencias?.[0]).toEqual({ norma: "DS", articulos: ["8"] });
    if (sobreOpd[0]!.target.tipo !== "opd") throw new Error("nunca");
    expect(modelo.opds[sobreOpd[0]!.target.id]).toBeDefined();
  });

  test("una etiqueta [C1] en comentario NO produce ninguna ancla (candidata)", () => {
    const PROTO_C1 = `# SD0 — C1

\`\`\`opl
# Flota y móviles [C1]
Despacho es un proceso físico y sistémico.
Vehículo es un objeto físico y sistémico.
Despacho requiere Vehículo.
\`\`\`
`;
    const { modelo: m } = compilarProto(PROTO_C1, { id: "demo-c1" });
    expect(enumerarAnclas(m).length).toBe(0);
  });
});

// ── (3) claveProto estable ante edición de la nota ────────────────────────────

describe("claveProto determinista estable", () => {
  function compilarConNota(nota: string): AnclaNormativa | undefined {
    const proto = `# SD0

\`\`\`opl
Proceso A es un proceso físico y sistémico.
Objeto B es un objeto físico y sistémico.
Proceso A requiere Objeto B (DS art. 17).
\`\`\`
`;
    void nota;
    return enumerarAnclas(compilarProto(proto, { id: "k" }).modelo).find((a) => a.target.tipo === "enlace");
  }

  test("la clave derivada NO depende de la nota libre (sobrevive a la edición)", () => {
    // Misma cita DS art. 17 sobre el mismo enlace → misma clave, con o sin nota.
    const protoConNota = `# SD0

\`\`\`opl
Proceso A es un proceso físico y sistémico.
Objeto B es un objeto físico y sistémico.
Proceso A requiere Objeto B (DS art. 17) [RATIFICAR: nota larga que el autor edita].
\`\`\`
`;
    const protoNotaEditada = `# SD0

\`\`\`opl
Proceso A es un proceso físico y sistémico.
Objeto B es un objeto físico y sistémico.
Proceso A requiere Objeto B (DS art. 17) [RATIFICAR: OTRA nota completamente distinta].
\`\`\`
`;
    const a = enumerarAnclas(compilarProto(protoConNota, { id: "k1" }).modelo).find((x) => x.estado === "vigente" && x.target.tipo === "enlace");
    const b = enumerarAnclas(compilarProto(protoNotaEditada, { id: "k2" }).modelo).find((x) => x.estado === "vigente" && x.target.tipo === "enlace");
    expect(a?.claveProto).toBeDefined();
    expect(a?.claveProto).toBe(b?.claveProto);
  });

  test("la clave derivada SÍ incluye la norma+artículos (dos citas distintas → claves distintas)", () => {
    const base = compilarConNota("");
    expect(base?.claveProto).toContain("ds");
    expect(base?.claveProto).toContain("17");
  });
});

// ── (4) L8: contabilidad en el ledger — ancla sobre línea RECHAZADA no se pierde

describe("L8 — contabilidad de anclas en el ledger", () => {
  test("ancla inline sobre una línea RECHAZADA → visible en el ledger, no silenciada", () => {
    const PROTO = `# SD0 — rechazo con ancla

\`\`\`opl
Cosa A es un objeto físico y sistémico.
Cosa B es un objeto físico y sistémico.
Cosa A proyecta Cosa B (DS art. 99).
\`\`\`
`;
    const { ledger, modelo } = compilarProto(PROTO, { id: "rechazo-ancla" });
    const rechazada = ledger.entradas.find((e) => e.tipo === "rechazada");
    expect(rechazada).toBeDefined();
    if (rechazada!.tipo !== "rechazada") throw new Error("nunca");
    // El ancla de la línea rechazada queda registrada JUNTO al diagnóstico, no se pierde.
    expect(rechazada!.anclas).toBeDefined();
    expect(rechazada!.anclas!.length).toBeGreaterThanOrEqual(1);
    expect(rechazada!.anclas!.some((a) => a.clase === "norma")).toBe(true);
    // Y NO se compiló a AnclaNormativa (el hecho fue rechazado, no hay target).
    const compiladaConDs99 = enumerarAnclas(modelo).some((a) => a.referencias?.some((r) => r.articulos?.includes("99")));
    expect(compiladaConDs99).toBe(false);
  });

  test("el resumen del ledger contabiliza anclas: compiladas + candidatas + en-rechazadas", () => {
    const PROTO = `# SD0 — contabilidad

\`\`\`opl
# Bloque [C1] (DS art. 3)
Proceso A es un proceso físico y sistémico.
Objeto B es un objeto físico y sistémico.
Proceso A requiere Objeto B (DS art. 12).
Objeto B proyecta Proceso A (NT 2024 §X).
\`\`\`
`;
    const { resumen } = compilarProto(PROTO, { id: "contab" });
    // detectadas = (DS art.3 comentario) + [C1] candidata + (DS art.12 hecho) + (NT 2024 hecho rechazado) = 4
    expect(resumen.anclasDetectadas).toBe(4);
    expect(resumen.anclasCompiladas).toBe(2); // DS art.3 (OPD) + DS art.12 (enlace)
    expect(resumen.anclasCandidatas).toBe(1); // [C1]
    expect(resumen.anclasEnRechazadas).toBe(1); // NT 2024 sobre `proyecta` rechazado
    // L8: detectadas == compiladas + candidatas + en-rechazadas
    expect(resumen.anclasDetectadas).toBe(
      resumen.anclasCompiladas + resumen.anclasCandidatas + resumen.anclasEnRechazadas,
    );
  });
});

// ── (5) idempotencia y registro consultable ───────────────────────────────────

describe("registro consultable y idempotencia", () => {
  const PROTO = `# SD0 — registro

\`\`\`opl
Proceso A es un proceso físico y sistémico.
Objeto B es un objeto físico y sistémico.
Proceso A requiere Objeto B (DS art. 12) [RATIFICAR #pend: dudoso].
\`\`\`
`;

  test("anclasPendientes filtra solo las pendiente-ratificacion", () => {
    const { modelo } = compilarProto(PROTO, { id: "reg1" });
    const pend = anclasPendientes(modelo);
    expect(pend.length).toBe(1);
    expect(pend[0]!.claveProto).toBe("ratificar:pend");
    expect(pend.every((a) => a.estado === "pendiente-ratificacion")).toBe(true);
  });

  test("compilar dos veces el mismo proto produce el mismo conjunto de claves (idempotencia)", () => {
    const a = enumerarAnclas(compilarProto(PROTO, { id: "i1" }).modelo).map((x) => x.claveProto).sort();
    const b = enumerarAnclas(compilarProto(PROTO, { id: "i2" }).modelo).map((x) => x.claveProto).sort();
    expect(a).toEqual(b);
  });

  test("REENTRANCIA: la claveProto de cola condicional (V12 R4 `dentro del`) NO depende del estado del proceso", () => {
    // El contador de `cola-fina-N` debe vivir por-compilación, no módulo-global:
    // compilar el MISMO proto dos veces en el mismo proceso debe dar la MISMA clave.
    // (Bug detectado por el de-risking F4 2026-06-07: contador global no reentrante.)
    // Auditoría 2026-06-09: las colas `cuando` (F5-V12) y `según` (pérdida silenciosa)
    // se retiraron; R4 (`requiere X dentro del Y`) es la única forma viva que sigue
    // produciendo `cola-fina-N` por V12.
    const PROTO_COLA = `# SD0 — cola fina

\`\`\`opl
Verificación es un proceso físico y sistémico.
Domicilio es un objeto físico y sistémico.
Radio de cobertura es un objeto informacional y sistémico.
Verificación requiere Domicilio dentro del Radio de cobertura.
\`\`\`
`;
    const a = enumerarAnclas(compilarProto(PROTO_COLA, { id: "c1" }).modelo).map((x) => x.claveProto).sort();
    const b = enumerarAnclas(compilarProto(PROTO_COLA, { id: "c2" }).modelo).map((x) => x.claveProto).sort();
    expect(a.some((k) => k.startsWith("cola-fina-"))).toBe(true);
    expect(a).toEqual(b);
  });

  test("anclasDeTarget recupera las anclas de un enlace por su id", () => {
    const { modelo } = compilarProto(PROTO, { id: "reg2" });
    const enlaceConAnclas = enumerarAnclas(modelo).find((a) => a.target.tipo === "enlace");
    if (!enlaceConAnclas || enlaceConAnclas.target.tipo !== "enlace") throw new Error("esperaba enlace");
    const deEseEnlace = anclasDeTarget(modelo, "enlace", enlaceConAnclas.target.id);
    expect(deEseEnlace.length).toBeGreaterThanOrEqual(1);
  });
});
