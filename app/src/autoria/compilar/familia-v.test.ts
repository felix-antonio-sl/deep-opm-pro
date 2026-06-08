// TDD de la Familia V — verbos/patrones extendidos del compilador proto→Modelo.
//
// Cada test corresponde a uno de los 15 mapeos decididos por el operador
// (sesión W4.3-rechazos, 2026-06-04). El oráculo es el EFECTO en el modelo
// emitido (enlaces, modificadores, etiquetas, abanicos, anclas) más, donde el
// generador tiene superficie, el round-trip OPL forward. Y los NEGATIVOS:
//   - `restringe` sobre estado NO binario sigue rechazado;
//   - las 5 oraciones EN REFLEXIÓN del operador siguen rechazadas;
//   - idempotencia del normalizador intacta.
//
// SSOT de la decisión: `docs/proto-modelo/gramatica-subdialecto-v0.md` §«Familia V».

import { describe, expect, test } from "bun:test";
import { compilarProto } from "./compilador";
import type { ResultadoCompilacion } from "./compilador";
import { emitirBundle } from "../bundle";
import { generarOpl } from "../../opl/generar";
import { construirContextoProto, normalizarBloqueOpl } from "./normalizador";
import type { ContextoProto, LineaNormalizada } from "./tipos";

// ── Helpers ──────────────────────────────────────────────────────────────

function compilar(opl: string, id = "v"): ResultadoCompilacion {
  const proto = `# SD0 — fixture familia V\n\n\`\`\`opl\n${opl}\n\`\`\`\n`;
  return compilarProto(proto, { id, nombre: id });
}

function sinErrores(r: ResultadoCompilacion): void {
  const bundle = emitirBundle(r.autor, { lanzarEnError: false });
  expect(bundle.avisos.filter((a) => a.severidad === "error")).toHaveLength(0);
}

function idDe(modelo: ResultadoCompilacion["modelo"], nombre: string): string | undefined {
  return Object.values(modelo.entidades).find((e) => e.nombre === nombre)?.id;
}

/** Enlaces de un tipo cuyo origen-entidad y destino-entidad coinciden por nombre. */
function enlacesEntre(
  modelo: ResultadoCompilacion["modelo"],
  origenNombre: string,
  destinoNombre: string,
  tipo: string,
) {
  const oid = idDe(modelo, origenNombre);
  const did = idDe(modelo, destinoNombre);
  return Object.values(modelo.enlaces).filter((l) => {
    if (l.tipo !== tipo) return false;
    const entDe = (ext: { kind: string; id: string }) =>
      ext.kind === "estado" ? modelo.estados[ext.id]?.entidadId : ext.id;
    return entDe(l.origenId) === oid && entDe(l.destinoId) === did;
  });
}

function ledgerRechazadas(r: ResultadoCompilacion): string[] {
  return r.ledger.entradas
    .filter((e): e is Extract<ResultadoCompilacion["ledger"]["entradas"][number], { tipo: "rechazada" }> => e.tipo === "rechazada")
    .map((e) => e.original);
}

function norm(lineas: string[], ctx?: ContextoProto): LineaNormalizada[] {
  return normalizarBloqueOpl(lineas, ctx ?? construirContextoProto([lineas]));
}

// ── V1: `X [en 's'] habilita P` (obj→proc) → instrumento-condición ──────────

describe("V1 — `habilita` (objeto→proceso) → instrumento-condición", () => {
  test("`X en 's' habilita P` crea instrumento condición desde X en `s`", () => {
    const r = compilar(`Atención de acciones emergentes es un proceso físico y sistémico.
Cupo HODOM es un objeto físico y sistémico.
Cupo HODOM puede estar 'disponible' o 'ocupado'.
Cupo HODOM en 'disponible' habilita Atención de acciones emergentes.`);
    sinErrores(r);
    const instr = enlacesEntre(r.modelo, "Cupo HODOM", "Atención de acciones emergentes", "instrumento");
    expect(instr).toHaveLength(1);
    expect(instr[0]!.modificador).toBe("condicion");
    expect(instr[0]!.origenId.kind).toBe("estado");
  });

  test("`X habilita P` SIN estado (X objeto, P proceso) → instrumento-condición sin estado", () => {
    const r = compilar(`Atención de acciones emergentes es un proceso físico y sistémico.
Evento de deterioro clínico es un objeto físico y sistémico.
Evento de deterioro clínico habilita Atención de acciones emergentes.`);
    sinErrores(r);
    const instr = enlacesEntre(r.modelo, "Evento de deterioro clínico", "Atención de acciones emergentes", "instrumento");
    expect(instr).toHaveLength(1);
    expect(instr[0]!.modificador).toBe("condicion");
    expect(instr[0]!.origenId.kind).toBe("entidad");
  });
});

// ── V2: `X en 'e' restringe P` → condición sobre el estado complementario ───

describe("V2 — `restringe` → condición sobre estado complementario (binario)", () => {
  test("`Cupo en 'ocupado' restringe P` ≡ instrumento-condición desde Cupo en 'disponible'", () => {
    const r = compilar(`Evaluación de la solicitud de ingreso es un proceso físico y sistémico.
Cupo HODOM es un objeto físico y sistémico.
Cupo HODOM puede estar 'disponible' o 'ocupado'.
Cupo HODOM en 'ocupado' restringe Evaluación de la solicitud de ingreso.`);
    sinErrores(r);
    const instr = enlacesEntre(r.modelo, "Cupo HODOM", "Evaluación de la solicitud de ingreso", "instrumento");
    expect(instr).toHaveLength(1);
    expect(instr[0]!.modificador).toBe("condicion");
    // El estado-gatillo es el COMPLEMENTARIO ('disponible').
    expect(instr[0]!.origenId.kind).toBe("estado");
    const estadoId = instr[0]!.origenId.kind === "estado" ? instr[0]!.origenId.id : "";
    expect(r.modelo.estados[estadoId]?.nombre).toBe("disponible");
  });

  test("NEGATIVO: `restringe` sobre estado NO binario (≥3 estados) sigue rechazado con diagnóstico", () => {
    const r = compilar(`Evaluar es un proceso físico y sistémico.
Semáforo es un objeto físico y sistémico.
Semáforo puede estar 'rojo', 'amarillo' o 'verde'.
Semáforo en 'rojo' restringe Evaluar.`);
    const rechazadas = ledgerRechazadas(r);
    expect(rechazadas.some((o) => /restringe/.test(o))).toBe(true);
  });
});

// ── V3 RETIRADA (F5-parcial): `puede iniciar` laxo rechaza; E2 `inicia` compila ─
// El de-risking probó equivalencia byte-idéntica; la skill emite E2 directo.

describe("V3 retirada — `puede iniciar` (unidestino) rechaza; E2 `inicia` compila el evento", () => {
  test("laxo `X en 's' puede iniciar P` ya NO se puentea (rechazo ruidoso)", () => {
    const r = compilar(`Ajuste terapéutico es un proceso físico y sistémico.
Discrepancia de conciliación es un objeto físico y sistémico.
Discrepancia de conciliación puede estar 'detectada' o 'resuelta'.
Discrepancia de conciliación en 'detectada' puede iniciar Ajuste terapéutico.`);
    expect(enlacesEntre(r.modelo, "Discrepancia de conciliación", "Ajuste terapéutico", "instrumento")).toHaveLength(0);
    expect(ledgerRechazadas(r).some((o) => /puede iniciar Ajuste/.test(o))).toBe(true);
  });
  test("E2 `X en estado 's' inicia P` crea instrumento-evento desde X en `s` (ruta estricta)", () => {
    const r = compilar(`Ajuste terapéutico es un proceso físico y sistémico.
Discrepancia de conciliación es un objeto físico y sistémico.
Discrepancia de conciliación puede estar 'detectada' o 'resuelta'.
Discrepancia de conciliación en estado 'detectada' inicia Ajuste terapéutico.`);
    sinErrores(r);
    const instr = enlacesEntre(r.modelo, "Discrepancia de conciliación", "Ajuste terapéutico", "instrumento");
    expect(instr).toHaveLength(1);
    expect(instr[0]!.modificador).toBe("evento");
    expect(instr[0]!.origenId.kind).toBe("estado");
  });
});

// ── V4 RETIRADA (F5-parcial): `alimenta` laxo rechaza; E2 `requiere` compila ───

describe("V4 retirada — `alimenta` rechaza R3; E2 `P requiere O` crea instrumento", () => {
  test("laxo `O alimenta P` ya NO se puentea (rechazo ruidoso)", () => {
    const r = compilar(`Evaluación clínica evolutiva es un proceso físico y sistémico.
Resultado de examen es un objeto informacional y sistémico.
Resultado de examen alimenta Evaluación clínica evolutiva.`);
    expect(enlacesEntre(r.modelo, "Resultado de examen", "Evaluación clínica evolutiva", "instrumento")).toHaveLength(0);
    expect(ledgerRechazadas(r).some((o) => /alimenta/.test(o))).toBe(true);
  });
  test("E2 `P requiere O` crea instrumento O→P por ruta estricta", () => {
    const r = compilar(`Evaluación clínica evolutiva es un proceso físico y sistémico.
Resultado de examen es un objeto informacional y sistémico.
Evaluación clínica evolutiva requiere Resultado de examen.`);
    sinErrores(r);
    expect(enlacesEntre(r.modelo, "Resultado de examen", "Evaluación clínica evolutiva", "instrumento")).toHaveLength(1);
    const opl = generarOpl(r.modelo, r.modelo.opdRaizId);
    expect(opl.join("\n")).toContain("requiere");
  });
});

// ── V5 RETIRADA (F5-parcial): `detecta` laxo rechaza; E2 `genera` compila ──────

describe("V5 retirada — `detecta` rechaza R3; E2 `P genera O` crea resultado", () => {
  test("laxo `P detecta O` ya NO se puentea (rechazo ruidoso)", () => {
    const r = compilar(`Monitorización de signos vitales es un proceso físico y sistémico.
Evento de deterioro clínico es un objeto físico y sistémico.
Monitorización de signos vitales detecta Evento de deterioro clínico.`);
    expect(enlacesEntre(r.modelo, "Monitorización de signos vitales", "Evento de deterioro clínico", "resultado")).toHaveLength(0);
    expect(ledgerRechazadas(r).some((o) => /detecta/.test(o))).toBe(true);
  });
  test("E2 `P genera O` crea resultado P→O por ruta estricta", () => {
    const r = compilar(`Monitorización de signos vitales es un proceso físico y sistémico.
Evento de deterioro clínico es un objeto físico y sistémico.
Monitorización de signos vitales genera Evento de deterioro clínico.`);
    sinErrores(r);
    expect(enlacesEntre(r.modelo, "Monitorización de signos vitales", "Evento de deterioro clínico", "resultado")).toHaveLength(1);
  });
});

// ── V6: `P compromete/libera O` → `P afecta O` + verbo en `etiqueta` ────────

describe("V6 — `compromete`/`libera` → afecta + verbo original anotado en etiqueta", () => {
  test("`P compromete O` crea afecta P→O con etiqueta 'compromete'", () => {
    const r = compilar(`Ingreso HODOM es un proceso físico y sistémico.
Capacidad de prestaciones es un objeto físico y sistémico.
Ingreso HODOM compromete Capacidad de prestaciones.`);
    sinErrores(r);
    const af = enlacesEntre(r.modelo, "Ingreso HODOM", "Capacidad de prestaciones", "efecto");
    expect(af).toHaveLength(1);
    expect(af[0]!.etiqueta).toBe("compromete");
    const opl = generarOpl(r.modelo, r.modelo.opdRaizId).join("\n");
    expect(opl).toContain("[etiqueta: compromete]");
  });

  test("`P libera O` crea afecta P→O con etiqueta 'libera'", () => {
    const r = compilar(`Cierre del episodio HODOM es un proceso físico y sistémico.
Capacidad de prestaciones es un objeto físico y sistémico.
Cierre del episodio HODOM libera Capacidad de prestaciones.`);
    sinErrores(r);
    const af = enlacesEntre(r.modelo, "Cierre del episodio HODOM", "Capacidad de prestaciones", "efecto");
    expect(af).toHaveLength(1);
    expect(af[0]!.etiqueta).toBe("libera");
  });
});

// ── V7 RETIRADA (F5-parcial): `precede a` laxo rechaza R7; E2 `invoca` compila ─

describe("V7 retirada — `precede a` rechaza R7; E2 `A invoca B` crea invocación", () => {
  test("laxo `A precede a B` ya NO se puentea (rechazo ruidoso)", () => {
    const r = compilar(`Traslado del paciente al establecimiento es un proceso físico y sistémico.
Cierre por reingreso hospitalario es un proceso físico y sistémico.
Traslado del paciente al establecimiento precede a Cierre por reingreso hospitalario.`);
    expect(enlacesEntre(r.modelo, "Traslado del paciente al establecimiento", "Cierre por reingreso hospitalario", "invocacion")).toHaveLength(0);
    expect(ledgerRechazadas(r).some((o) => /precede a/.test(o))).toBe(true);
  });
  test("E2 `A invoca B` crea invocación A→B por ruta estricta", () => {
    const r = compilar(`Traslado del paciente al establecimiento es un proceso físico y sistémico.
Cierre por reingreso hospitalario es un proceso físico y sistémico.
Traslado del paciente al establecimiento invoca Cierre por reingreso hospitalario.`);
    sinErrores(r);
    expect(enlacesEntre(r.modelo, "Traslado del paciente al establecimiento", "Cierre por reingreso hospitalario", "invocacion")).toHaveLength(1);
  });
});

// ── V8-V11: estructurales etiquetados (tagged) ──────────────────────────────

describe("V8 — `A puede suceder a un B [opcional]` → tagged «sucede a» (+ 0..1)", () => {
  test("crea enlace etiquetado «sucede a» A→B con multiplicidad 0..1 si opcional", () => {
    const r = compilar(`Episodio HODOM es un objeto físico y sistémico.
Episodio HODOM puede suceder a un Episodio HODOM previo opcional.`);
    sinErrores(r);
    const tagged = Object.values(r.modelo.enlaces).filter((l) => l.tipo === "etiquetado" && l.etiqueta === "sucede a");
    expect(tagged).toHaveLength(1);
    expect(tagged[0]!.multiplicidadDestino).toBe("0..1");
    const opl = generarOpl(r.modelo, r.modelo.opdRaizId).join("\n");
    expect(opl).toContain("sucede a");
  });
});

describe("V9 — `A corresponde a un B` → tagged «corresponde a»", () => {
  test("crea enlace etiquetado «corresponde a» A→B", () => {
    const r = compilar(`Parada es un objeto físico y sistémico.
Domicilio es un objeto físico y sistémico.
Parada corresponde a un Domicilio.`);
    sinErrores(r);
    const tagged = Object.values(r.modelo.enlaces).filter((l) => l.tipo === "etiquetado" && l.etiqueta === "corresponde a");
    expect(tagged).toHaveLength(1);
    const opl = generarOpl(r.modelo, r.modelo.opdRaizId).join("\n");
    expect(opl).toContain("corresponde a");
  });
});

describe("V10 — `A cumple B [para …]` → tagged «cumple» + cola anotada", () => {
  test("crea enlace etiquetado «cumple» y adjunta la cola como ancla pendiente", () => {
    const r = compilar(`Profesional ejecutor es un objeto físico y sistémico.
Competencia requerida es un objeto informacional y sistémico.
Profesional ejecutor cumple Competencia requerida para el acto.`);
    sinErrores(r);
    const tagged = Object.values(r.modelo.enlaces).filter((l) => l.tipo === "etiquetado" && l.etiqueta === "cumple");
    expect(tagged).toHaveLength(1);
    // La cola «para el acto» queda como ancla normativa pendiente sobre el enlace.
    const anclas = Object.values(r.modelo.anclasNormativas ?? {});
    expect(anclas.some((a) => a.estado === "pendiente-ratificacion" && /para el acto/i.test(a.nota ?? ""))).toBe(true);
  });
});

describe("V11 — `A habilita B` (ambos objetos) → tagged «habilita»", () => {
  test("crea enlace etiquetado «habilita» objeto→objeto", () => {
    const r = compilar(`Autorización sanitaria es un objeto informacional y sistémico.
Establecimiento que otorga prestaciones de Hospitalización Domiciliaria es un objeto físico y sistémico.
Autorización sanitaria habilita Establecimiento que otorga prestaciones de Hospitalización Domiciliaria.`);
    sinErrores(r);
    const tagged = Object.values(r.modelo.enlaces).filter((l) => l.tipo === "etiquetado" && l.etiqueta === "habilita");
    expect(tagged).toHaveLength(1);
  });
});

// ── V12: colas condicionales → hecho principal + cola anotada ───────────────

describe("V12 — cola condicional (`cuando`/`según`/`por una`) → hecho + cola anotada", () => {
  test("`P cambia X a 'e' cuando …` compila la TS y deja la cola como ancla pendiente", () => {
    const r = compilar(`Registro de la atención es un proceso físico y sistémico.
Indicación médica es un objeto informacional y sistémico.
Indicación médica puede estar 'pendiente' o 'cumplida'.
Registro de la atención cambia Indicación médica a 'cumplida' cuando se completa la orden.`);
    sinErrores(r);
    // El hecho principal (la transición / efecto) se aplicó.
    expect(enlacesEntre(r.modelo, "Registro de la atención", "Indicación médica", "efecto")).toHaveLength(1);
    const anclas = Object.values(r.modelo.anclasNormativas ?? {});
    expect(anclas.some((a) => /cuando se completa la orden/i.test(a.nota ?? ""))).toBe(true);
  });

  test("R4: `P requiere Domicilio dentro del Radio …` → requiere Domicilio + cola anotada", () => {
    const r = compilar(`Verificación de condición domiciliaria y territorial es un proceso físico y sistémico.
Domicilio es un objeto físico y sistémico.
Radio de cobertura es un objeto informacional y sistémico.
Verificación de condición domiciliaria y territorial requiere Domicilio dentro del Radio de cobertura.`);
    sinErrores(r);
    expect(enlacesEntre(r.modelo, "Domicilio", "Verificación de condición domiciliaria y territorial", "instrumento")).toHaveLength(1);
    const anclas = Object.values(r.modelo.anclasNormativas ?? {});
    expect(anclas.some((a) => /radio de cobertura/i.test(a.nota ?? ""))).toBe(true);
  });
});

// ── V13: guard compuesto → evento + instrumento-condición ───────────────────

describe("V13 — guard compuesto (`X en 'a' con Y 'b' inicia P`)", () => {
  test("compila evento desde X en 'a' MÁS instrumento-condición desde Y en 'b'", () => {
    const r = compilar(`Notificación a la autoridad sanitaria es un proceso físico y sistémico.
Evento adverso es un objeto físico y sistémico.
Evento adverso puede estar 'detectado' o 'notificado'.
Notificabilidad es un objeto informacional y sistémico.
Notificabilidad puede estar 'no notificable' o 'notificable'.
Evento adverso en 'detectado' con Notificabilidad 'notificable' inicia Notificación a la autoridad sanitaria.`);
    sinErrores(r);
    const ev = enlacesEntre(r.modelo, "Evento adverso", "Notificación a la autoridad sanitaria", "instrumento");
    expect(ev).toHaveLength(1);
    expect(ev[0]!.modificador).toBe("evento");
    const cond = enlacesEntre(r.modelo, "Notificabilidad", "Notificación a la autoridad sanitaria", "instrumento");
    expect(cond).toHaveLength(1);
    expect(cond[0]!.modificador).toBe("condicion");
  });
});

// ── V14: `P cambia X a 'e', o inicia Q` → TS + evento (+ XOR anotado) ───────
// La decisión del operador es XOR sobre ambas consecuencias. El kernel exige
// abanicos HOMOGÉNEOS: un efecto-TS y una invocación-evento NO son del mismo
// tipo, así que el abanico no se forma; ambos enlaces se conservan y la decisión
// XOR queda ANOTADA como ancla pendiente sobre cada rama (modelado fino).

describe("V14 — `P cambia X a 'e', o inicia Q` → TS + evento (XOR heterogéneo anotado)", () => {
  test("crea la transición y la invocación evento; la decisión XOR queda anotada", () => {
    const r = compilar(`Atención de acciones emergentes es un proceso físico y sistémico.
Condición de estabilidad clínica es un objeto físico y sistémico.
Condición de estabilidad clínica puede estar 'inestable' o 'estable'.
Cierre por reingreso hospitalario es un proceso físico y sistémico.
Atención de acciones emergentes cambia Condición de estabilidad clínica a 'estable', o inicia Cierre por reingreso hospitalario.`);
    sinErrores(r);
    // El efecto (TS) y la invocación-evento existen.
    expect(enlacesEntre(r.modelo, "Atención de acciones emergentes", "Condición de estabilidad clínica", "efecto")).toHaveLength(1);
    const inv = enlacesEntre(r.modelo, "Atención de acciones emergentes", "Cierre por reingreso hospitalario", "invocacion");
    expect(inv).toHaveLength(1);
    // El kernel NO forma un abanico heterogéneo (efecto + invocación). La decisión
    // XOR se preserva como ancla pendiente (no se pierde, no falla el hecho).
    const anclas = Object.values(r.modelo.anclasNormativas ?? {});
    expect(anclas.some((a) => /XOR/.test(a.nota ?? ""))).toBe(true);
  });
});

// ── V15: `X en 's' inicia A o B` / `S puede iniciar A o B` → ramas + XOR ────

describe("V15 — disyunción de consecuencias → dos ramas evento + abanico XOR", () => {
  test("`X en 's' inicia A o B` (X objeto) crea dos instrumentos-evento; XOR sobre gatillo-estado anotado", () => {
    const r = compilar(`Cierre por alta médica por recuperación es un proceso físico y sistémico.
Cierre por cumplimiento del plan terapéutico es un proceso físico y sistémico.
Decisión de conducta clínica es un objeto físico y sistémico.
Decisión de conducta clínica puede estar 'en curso' o 'proceder a egreso'.
Decisión de conducta clínica en 'proceder a egreso' inicia Cierre por alta médica por recuperación o Cierre por cumplimiento del plan terapéutico.`);
    sinErrores(r);
    const a = enlacesEntre(r.modelo, "Decisión de conducta clínica", "Cierre por alta médica por recuperación", "instrumento");
    const b = enlacesEntre(r.modelo, "Decisión de conducta clínica", "Cierre por cumplimiento del plan terapéutico", "instrumento");
    expect(a).toHaveLength(1);
    expect(b).toHaveLength(1);
    expect(a[0]!.modificador).toBe("evento");
    // Ambas ramas comparten el GATILLO-ESTADO (puerto sobre un estado): el kernel
    // forma abanicos sólo sobre puertos de ENTIDAD, así que la decisión XOR queda
    // anotada como ancla pendiente (no se pierde, no falla el hecho).
    const anclas = Object.values(r.modelo.anclasNormativas ?? {});
    expect(anclas.some((x) => /XOR/.test(x.nota ?? ""))).toBe(true);
  });

  test("`S puede iniciar A o B` (S proceso) crea dos invocaciones evento y un abanico XOR", () => {
    const r = compilar(`Suspensión de la atención es un proceso físico y sistémico.
Cierre por alta disciplinaria es un proceso físico y sistémico.
Cierre por renuncia voluntaria es un proceso físico y sistémico.
Suspensión de la atención puede iniciar Cierre por alta disciplinaria o Cierre por renuncia voluntaria.`);
    sinErrores(r);
    expect(enlacesEntre(r.modelo, "Suspensión de la atención", "Cierre por alta disciplinaria", "invocacion")).toHaveLength(1);
    expect(enlacesEntre(r.modelo, "Suspensión de la atención", "Cierre por renuncia voluntaria", "invocacion")).toHaveLength(1);
    const abanicos = Object.values(r.modelo.abanicos ?? {});
    expect(abanicos.some((ab) => ab.operador === "XOR" && ab.enlaceIds.length === 2)).toBe(true);
  });
});

// ── NEGATIVOS: las oraciones EN REFLEXIÓN del operador siguen rechazadas ──
// (eran 5; «está acotado por» SALIÓ de la lista al ser ADJUDICADA — dov-dori
// 2026-06-05 §1(d): V17 bifurcado por firma de extremos. Cobertura positiva en
// `adjudicacion-dov-dori.test.ts` P2-d; acta en
// `docs/proto-modelo/adjudicacion-dov-dori-2026-06-05.md`.)

describe("EN REFLEXIÓN — las 4 oraciones del operador siguen rechazadas con diagnóstico", () => {
  const enReflexion: Array<[string, string]> = [
    ["proyecta", "Cupo HODOM proyecta la Capacidad de prestaciones comprometida como día-cama para REM."],
    ["determinan…como", "Evaluación clínica de elegibilidad, Informe social, Veredicto de voluntariedad y los demás veredictos parciales determinan Solicitud de ingreso HODOM como 'aceptada', 'en espera' o 'rechazada'."],
    ["consta…y Otros…según", "Equipo HODOM consta de Dirección Técnica, Coordinación, Médico de Atención Directa, Médico Regulador, Enfermero clínico, Kinesiólogo, Técnico de enfermería, Trabajador Social y Otros profesionales según prestaciones."],
    ["habilita…para 'estado' (proc→obj)", "Inspección pre-ruta habilita Vehículo de transporte para 'en ruta'."],
  ];
  for (const [etq, oracion] of enReflexion) {
    test(`«${etq}» permanece rechazada`, () => {
      const l = norm([oracion]);
      expect(l.every((x) => x.clase === "rechazada")).toBe(true);
    });
  }

  test("`Inspección pre-ruta habilita Vehículo …` NO la captura V1 (proceso→objeto con cola `para`)", () => {
    const r = compilar(`Inspección pre-ruta es un proceso físico y sistémico.
Vehículo de transporte es un objeto físico y sistémico.
Vehículo de transporte puede estar 'disponible' o 'en ruta'.
Inspección pre-ruta habilita Vehículo de transporte para 'en ruta'.`);
    // NO se creó un instrumento-condición (V1 exige objeto→proceso).
    expect(enlacesEntre(r.modelo, "Inspección pre-ruta", "Vehículo de transporte", "instrumento")).toHaveLength(0);
    expect(ledgerRechazadas(r).some((o) => /Inspección pre-ruta habilita/.test(o))).toBe(true);
  });
});

// ── Idempotencia del normalizador (intacta sobre la familia V) ─────────────

describe("idempotencia — normalizar(normalizar(x)) estable para la familia V", () => {
  const fixtures = [
    // V4/V5/V7 retiradas en F5-parcial: las formas vivas son sus E2 estrictas.
    "Evaluación clínica evolutiva requiere Resultado de examen.",
    "Monitorización de signos vitales genera Evento de deterioro clínico.",
    "Ingreso HODOM compromete Capacidad de prestaciones.",
    "Traslado del paciente invoca Cierre por reingreso hospitalario.",
    "Parada corresponde a un Domicilio.",
  ];
  for (const f of fixtures) {
    test(`«${f.slice(0, 40)}…» clase estable`, () => {
      const ctx = construirContextoProto([fixtures]);
      const primera = norm([f], ctx)[0]!;
      // La clase de una línea compuesta/normalizada no debe cambiar al re-normalizar
      // las oraciones que produce (las directivas no son texto re-normalizable, pero
      // las oraciones-emisión sí deben ser estrictas estables).
      if (primera.clase === "compuesta") {
        for (const em of primera.emisiones) {
          if (em.via === "oracion") {
            const re = norm([em.oracion], ctx)[0]!;
            expect(["estricta", "normalizada"]).toContain(re.clase);
          }
        }
      } else {
        expect(["estricta", "normalizada", "compuesta", "estructura"]).toContain(primera.clase);
      }
    });
  }
});
