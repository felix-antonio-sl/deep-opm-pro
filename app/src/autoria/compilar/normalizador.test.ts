// TDD del normalizador del sub-dialecto del proto-modelo (W1.2).
//
// Estructura: un describe por regla T2 (A1-A11), un describe por categoria de
// rechazo (R1-R7), idempotencia, y el test CLAVE de la ley L1 (toda salida
// estricta|normalizada -salvo `estructura`- parsea de verdad con el parser real
// sin `unsupported-kernel`). Los fixtures positivos se reutilizan en
// idempotencia y en L1, de modo que un solo conjunto de superficies defiende
// las tres propiedades.

import { describe, expect, test } from "bun:test";
import { parsearParrafoOpl } from "../../opl/parser/parsear";
import { construirContextoProto, normalizarBloqueOpl } from "./normalizador";
import type { ContextoProto, LineaNormalizada } from "./tipos";

// ── Helpers ──────────────────────────────────────────────────────────────

/** Normaliza un bloque de una sola pasada con contexto vacio (la mayoria de
 *  las reglas no dependen del contexto). */
function norm(lineas: string[], ctx?: ContextoProto): LineaNormalizada[] {
  return normalizarBloqueOpl(lineas, ctx ?? construirContextoProto([lineas]));
}

/** Normaliza una sola linea con contexto vacio y devuelve la clasificacion. */
function una(linea: string, ctx?: ContextoProto): LineaNormalizada {
  const r = norm([linea], ctx);
  expect(r).toHaveLength(1);
  return r[0]!;
}

/** Texto canonico que el consumidor entregaria al parser para una clase
 *  `estricta` o `normalizada`. */
function oracionDe(l: LineaNormalizada): string {
  if (l.clase === "estricta" || l.clase === "normalizada" || l.clase === "estructura") return l.oracion;
  throw new Error(`la clase ${l.clase} no tiene oracion`);
}

/** Verdadero si el parser real acepta la oracion sin `unsupported-kernel` y sin
 *  `syntax-error` (arbitro operativo de "estricto" de la ley L1). */
function parserAcepta(oracion: string): boolean {
  const texto = oracion.trim().endsWith(".") ? oracion : `${oracion}.`;
  const { ast, diagnosticos } = parsearParrafoOpl(texto);
  if (ast.some((a) => a.kind === "unsupported")) return false;
  return !diagnosticos.some((d) => d.codigo === "unsupported-kernel" || d.codigo === "syntax-error");
}

// ── T1 — formas estrictas (identidad) ───────────────────────────────────

describe("T1 — formas ya estrictas se clasifican `estricta` sin tocar", () => {
  test("descripcion con `un objeto/proceso` (forma del generador)", () => {
    const l = una("Paciente es un objeto físico y ambiental.");
    expect(l.clase).toBe("estricta");
    expect(oracionDe(l)).toBe("Paciente es un objeto físico y ambiental.");
  });

  test("agente / instrumento / consumo / resultado canonicos", () => {
    for (const s of [
      "Equipo HODOM maneja Hospitalización en domicilio.",
      "Hospitalización en domicilio requiere Plan terapéutico y de cuidados.",
      "Procesar consume Entrada.",
      "Procesar genera Salida.",
    ]) {
      expect(una(s).clase).toBe("estricta");
    }
  });

  test("TS canonica `cambia X de a a b`", () => {
    const l = una("Cierre del episodio HODOM cambia Episodio HODOM de 'abierto' a 'cerrado'.");
    expect(l.clase).toBe("estricta");
  });

  test("exhibicion y agregacion (`consta de`) canonicas", () => {
    expect(una("Auto exhibe Color.").clase).toBe("estricta");
    expect(una("Vehículo consta de Motor.").clase).toBe("estricta");
  });
});

// ── A1 — distribuir esencia/afiliacion sobre lista ──────────────────────

describe("A1 — `A, B y C son físicas y sistémicas` -> una oracion por entidad", () => {
  test("tres procesos en lista", () => {
    const l = norm([
      "Admisión e instalación en domicilio, Operación clínica en domicilio y Cierre del episodio HODOM son físicas y sistémicas.",
    ]);
    expect(l).toHaveLength(3);
    for (const item of l) {
      expect(item.clase).toBe("normalizada");
      if (item.clase === "normalizada") expect(item.regla).toBe("A1");
    }
    // cada salida es una descripcion-cosa estricta para el parser
    expect(oracionDe(l[0]!)).toContain("Admisión e instalación en domicilio es");
    expect(oracionDe(l[2]!)).toContain("Cierre del episodio HODOM es");
  });

  test("dos objetos en lista (femenino plural)", () => {
    const l = norm(["Evaluación de la solicitud de ingreso, Ingreso HODOM y Evaluación inicial son físicas y sistémicas."]);
    expect(l).toHaveLength(3);
    expect(l.every((x) => x.clase === "normalizada")).toBe(true);
  });
});

// ── A2 — estados con prefijo "en uno de los estados" ────────────────────
// REALIDAD vs spec: el parser MANGLA el prefijo "en uno de los estados" (lo
// mete dentro del primer estado). La forma estricta real es SIN prefijo:
// `X puede estar 'a' o 'b'`. A2 por tanto STRIPEA el prefijo (no lo agrega).

describe("A2 — normaliza el prefijo `en uno de los estados`", () => {
  test("strip del prefijo y conservacion de estados", () => {
    const l = una("Episodio HODOM puede estar en uno de los estados 'abierto' o 'cerrado'.");
    expect(l.clase).toBe("normalizada");
    if (l.clase === "normalizada") expect(l.regla).toBe("A2");
    expect(oracionDe(l)).toBe("Episodio HODOM puede estar 'abierto' o 'cerrado'.");
  });

  test("forma sin prefijo (corpus) es estricta de una vez", () => {
    const l = una("Domicilio puede estar 'asistencialmente viable' o 'no asistencialmente viable'.");
    expect(l.clase).toBe("estricta");
  });

  test("cuatro estados con prefijo", () => {
    const l = una(
      "Solicitud de ingreso HODOM puede estar en uno de los estados 'recibida', 'aceptada', 'en espera' o 'rechazada'.",
    );
    expect(l.clase).toBe("normalizada");
    expect(oracionDe(l)).toBe(
      "Solicitud de ingreso HODOM puede estar 'recibida', 'aceptada', 'en espera' o 'rechazada'.",
    );
  });
});

// ── A3 — `afecta X (de a a b)` -> `cambia X de a a b` ────────────────────

describe("A3 — efecto con transicion entre parentesis -> TS canonica", () => {
  test("reescribe a `cambia ... de ... a ...`", () => {
    const l = una("Curación avanzada afecta Lesión (de 'activa' a 'cerrada').");
    expect(l.clase).toBe("normalizada");
    if (l.clase === "normalizada") expect(l.regla).toBe("A3");
    expect(oracionDe(l)).toBe("Curación avanzada cambia Lesión de 'activa' a 'cerrada'.");
  });

  test("efecto simple `afecta X` sin parentesis queda estricto", () => {
    expect(una("Curación avanzada afecta Lesión.").clase).toBe("estricta");
  });
});

// ── A4 — estado pegado sin comillas (depende del contexto) ──────────────

describe("A4 — estado pegado al nombre se reescribe si esta declarado", () => {
  const ctx = construirContextoProto([
    [
      "Paciente es físico y ambiental.",
      "Paciente puede estar 'hospitalizado en domicilio' o 'egresado de HODOM'.",
      "Operación clínica en domicilio requiere Paciente hospitalizado en domicilio.",
    ],
  ]);

  test("estado declarado -> `requiere X en `estado``", () => {
    const l = una("Operación clínica en domicilio requiere Paciente hospitalizado en domicilio.", ctx);
    expect(l.clase).toBe("normalizada");
    if (l.clase === "normalizada") expect(l.regla).toBe("A4");
    expect(oracionDe(l)).toBe("Operación clínica en domicilio requiere Paciente en `hospitalizado en domicilio`.");
  });

  test("forma `en estado 'x'` se reescribe a backticks (limpia la fuga de `estado`)", () => {
    // El parser deja la palabra `estado` dentro del nombre cuando viene con
    // comillas simples; en backticks la captura limpia. Por eso se normaliza.
    const l = una("Hospitalización en domicilio requiere Domicilio en estado 'asistencialmente viable'.", ctx);
    expect(l.clase).toBe("normalizada");
    if (l.clase === "normalizada") {
      expect(l.regla).toBe("A4");
      expect(oracionDe(l)).toBe("Hospitalización en domicilio requiere Domicilio en `asistencialmente viable`.");
    }
    expect(parserAcepta(oracionDe(l))).toBe(true);
  });
});

// ── A5 — continuacion aditiva (`consta también de`, `se descompone también en`) ──

describe("A5 — continuacion aditiva -> clase estructura con `aditiva`", () => {
  test("`consta también de`", () => {
    const l = una("Equipo HODOM consta también de Conductor.");
    expect(l.clase).toBe("estructura");
    if (l.clase === "estructura") expect(l.aditiva).toBe(true);
  });

  test("`se descompone también en`", () => {
    const l = una("Operación territorial se descompone también en Ejecución de ruta y Despacho de recursos.");
    expect(l.clase).toBe("estructura");
    if (l.clase === "estructura") expect(l.aditiva).toBe(true);
  });
});

// ── A6 — `cambia X a a, b o c` (multi-destino) -> una TS por destino ─────

describe("A6 — TS multi-destino se expande", () => {
  test("tres destinos -> tres oraciones", () => {
    const l = norm(["Verificación cambia Solicitud a 'aceptada', 'en espera' o 'rechazada'."]);
    expect(l).toHaveLength(3);
    for (const item of l) {
      expect(item.clase).toBe("normalizada");
      if (item.clase === "normalizada") expect(item.regla).toBe("A6");
    }
    expect(oracionDe(l[0]!)).toBe("Verificación cambia Solicitud a 'aceptada'.");
    expect(oracionDe(l[1]!)).toBe("Verificación cambia Solicitud a 'en espera'.");
    expect(oracionDe(l[2]!)).toBe("Verificación cambia Solicitud a 'rechazada'.");
  });
});

// ── A7 — `cambia X a b` sin origen (el parser lo acepta -> NO degrada R5) ──

describe("A7 — TS compacta sin origen es aceptada por el parser", () => {
  test("`cambia X a b` se clasifica estricta (parser la soporta)", () => {
    const l = una("Transporte de muestra al laboratorio cambia Muestra a 'en tránsito a laboratorio'.");
    expect(l.clase).toBe("estricta");
    expect(parserAcepta(oracionDe(l))).toBe(true);
  });
});

// ── A8 — conector `así como` / `e` -> `y` ───────────────────────────────

describe("A8 — conectores no canonicos se normalizan a `y`", () => {
  test("`e` en lista de agente", () => {
    const l = una("Médico de Atención Directa maneja Evaluación de la solicitud de ingreso e Ingreso HODOM.");
    expect(l.clase).toBe("normalizada");
    if (l.clase === "normalizada") expect(l.regla).toBe("A8");
    expect(oracionDe(l)).toBe("Médico de Atención Directa maneja Evaluación de la solicitud de ingreso y Ingreso HODOM.");
  });

  test("`así como` -> `y`", () => {
    const l = una("Vehículo consta de Motor así como Chasis.");
    expect(l.clase).toBe("normalizada");
    if (l.clase === "normalizada") expect(l.regla).toBe("A8");
    expect(oracionDe(l)).toContain(" y Chasis");
  });
});

// ── A9 — `exhibe Y como su operación[ de programa]` -> `exhibe Y` + etiqueta ──

describe("A9 — cola `como su operación` se separa", () => {
  test("`exhibe Y como su operación`", () => {
    const l = una(
      "Establecimiento que otorga prestaciones de Hospitalización Domiciliaria exhibe Hospitalización en domicilio como su operación.",
    );
    expect(l.clase).toBe("normalizada");
    if (l.clase === "normalizada") expect(l.regla).toBe("A9");
    expect(oracionDe(l)).toBe(
      "Establecimiento que otorga prestaciones de Hospitalización Domiciliaria exhibe Hospitalización en domicilio.",
    );
  });

  test("`exhibe Y como su operación de programa`", () => {
    const l = una("Sistema exhibe Operación como su operación de programa.");
    expect(l.clase).toBe("normalizada");
    expect(oracionDe(l)).toBe("Sistema exhibe Operación.");
  });
});

// ── A10 — `... en esa secuencia` -> estructura secuencial ────────────────

describe("A10 — refinamiento con orden secuencial", () => {
  test("`se descompone en A, B y C en esa secuencia`", () => {
    const l = una(
      "Cierre del episodio HODOM se descompone en Cierre por causal de egreso, Aplicación de la encuesta y Cierre documental en esa secuencia.",
    );
    expect(l.clase).toBe("estructura");
    if (l.clase === "estructura") expect(l.secuencial).toBe(true);
  });
});

// ── A11 / AESS — esencia/afiliacion sin `un objeto/proceso` ──────────────
// REALIDAD vs spec: la forma del corpus `X es físico/a y sistémico/a` (sin
// "un objeto/proceso") NO es descripcion-cosa para el parser: cae a `metadata`
// (falso positivo). AESS inyecta el tipo de entidad (de contexto) y produce la
// forma estricta `X es un objeto/proceso F y A`.

describe("AESS — esencia/afiliacion sin `un objeto/proceso` se completa", () => {
  const ctx = construirContextoProto([
    [
      "Paciente es físico y ambiental.",
      "Equipo HODOM maneja Hospitalización en domicilio.",
      "Hospitalización en domicilio es física y sistémica.",
    ],
  ]);

  test("objeto (no usado como sujeto de verbo activo)", () => {
    const l = una("Paciente es físico y ambiental.", ctx);
    expect(l.clase).toBe("normalizada");
    if (l.clase === "normalizada") expect(l.regla).toBe("AESS");
    expect(oracionDe(l)).toBe("Paciente es un objeto físico y ambiental.");
    expect(parserAcepta(oracionDe(l))).toBe(true);
  });

  test("proceso (sujeto de `maneja`/usado como proceso) -> `un proceso`", () => {
    const l = una("Hospitalización en domicilio es física y sistémica.", ctx);
    expect(l.clase).toBe("normalizada");
    expect(oracionDe(l)).toBe("Hospitalización en domicilio es un proceso físico y sistémico.");
    expect(parserAcepta(oracionDe(l))).toBe(true);
  });

  test("concordancia de genero: `informacional y sistémico`", () => {
    const c = construirContextoProto([["Plan terapéutico y de cuidados es informacional y sistémico."]]);
    const l = una("Plan terapéutico y de cuidados es informacional y sistémico.", c);
    expect(l.clase).toBe("normalizada");
    expect(parserAcepta(oracionDe(l))).toBe(true);
  });
});

// ── Comentarios y anclas ────────────────────────────────────────────────

describe("Comentarios `#` y anclas inline", () => {
  test("comentario con etiqueta `[C1]` → ancla CANDIDATA (no compila; W5.2 §10.3)", () => {
    const l = una("# Flota y móviles [C1]");
    expect(l.clase).toBe("comentario");
    if (l.clase === "comentario") {
      expect(l.anclas.some((a) => a.clase === "candidata" && a.id === "C1")).toBe(true);
    }
  });

  test("comentario con etiqueta `[Q14]` → ancla CANDIDATA", () => {
    const l = una("# Cadena de custodia / trazabilidad de dominio [Q14]");
    expect(l.clase).toBe("comentario");
    if (l.clase === "comentario") {
      expect(l.anclas.some((a) => a.clase === "candidata" && a.id === "Q14")).toBe(true);
    }
  });

  test("ancla normativa inline en un hecho se conserva, no rechaza", () => {
    const l = una("Domicilio puede estar 'viable' o 'no viable' (DS art. 17).");
    expect(l.clase === "estricta" || l.clase === "normalizada").toBe(true);
    expect(l.anclas?.some((a) => a.clase === "norma")).toBe(true);
  });
});

// ── Estructura (refinamiento simple) ────────────────────────────────────

describe("estructura — `se descompone en` / `se despliega en`", () => {
  test("`se descompone en` -> clase estructura (no aditiva, no secuencial)", () => {
    const l = una(
      "Hospitalización en domicilio se descompone en Admisión e instalación, Operación clínica y Cierre del episodio.",
    );
    expect(l.clase).toBe("estructura");
    if (l.clase === "estructura") {
      expect(l.aditiva).toBeFalsy();
      expect(l.secuencial).toBeFalsy();
    }
  });
});

// ── Familia V — colas condicionales y guard compuesto (antes R1) ─────────
// El operador decidió mapear las colas `cuando`/`según` (V12) y el guard
// compuesto (V13) hacia primitivas OPM. Estas oraciones ya NO se rechazan.

describe("V12/V13 — colas condicionales y guard compuesto se mapean (antes R1)", () => {
  test("`según` adosado a una TS → V12 (hecho principal + cola anotada)", () => {
    const l = una(
      "Verificación cambia Solicitud a 'aceptada', 'en espera' o 'rechazada' según Disponibilidad de admisión.",
    );
    expect(l.clase).toBe("compuesta");
    if (l.clase === "compuesta") expect(l.regla).toBe("V12");
  });

  test("`cuando` adosado a un resultado → V12", () => {
    const l = una("Vigilancia y prevención de IAAS genera Evento adverso cuando detecta una IAAS.");
    expect(l.clase).toBe("compuesta");
    if (l.clase === "compuesta") expect(l.regla).toBe("V12");
  });

  test("guard compuesto con `con` en un evento → V13", () => {
    const l = una(
      "Evento adverso en estado 'detectado' con Notificabilidad 'notificable' inicia Notificación a la autoridad sanitaria.",
    );
    expect(l.clase).toBe("compuesta");
    if (l.clase === "compuesta") expect(l.regla).toBe("V13");
  });
});

// ── Familia V — disyunción de consecuencias (antes R2) ───────────────────
// El operador decidió mapear `inicia A o B` / `puede iniciar A o B` (V15) a dos
// ramas evento + abanico XOR. Ya NO se rechazan.

describe("V15 — disyunción de consecuencias se mapea (antes R2)", () => {
  test("`puede iniciar A o B` → V15", () => {
    const l = una("Suspensión de la atención puede iniciar Cierre por alta disciplinaria o Cierre por renuncia voluntaria.");
    expect(l.clase).toBe("compuesta");
    if (l.clase === "compuesta") {
      expect(l.regla).toBe("V15");
      expect(l.agrupar?.operador).toBe("XOR");
    }
  });

  test("`X en `s` inicia A o B` (disyunción de consecuencias) → V15", () => {
    const l = una("Decisión de conducta clínica en `proceder a egreso` inicia Cierre por alta o Cierre por cumplimiento.");
    expect(l.clase).toBe("compuesta");
    if (l.clase === "compuesta") expect(l.regla).toBe("V15");
  });

  test("un evento simple `X en `s` inicia P` (sin `o`) NO es V15 ni rechazo", () => {
    const l = una("Paciente en `hospitalizado en domicilio` inicia Operación clínica.");
    expect(l.clase).not.toBe("rechazada");
    expect(l.clase).not.toBe("compuesta");
  });
});

// ── A12 — disyuncion `u` -> `o` en listas de estados (tensión 2) ─────────

describe("A12 — disyuncion `u` (ante sonido /o/) se normaliza a `o`", () => {
  test("`puede estar 'disponible' u 'ocupado'` → `… 'disponible' o 'ocupado'` (A12)", () => {
    const l = una("Cupo HODOM puede estar 'disponible' u 'ocupado'.");
    expect(l.clase).toBe("normalizada");
    if (l.clase === "normalizada") {
      expect(l.regla).toBe("A12");
      expect(l.oracion).toContain("'disponible' o 'ocupado'");
      expect(l.oracion).not.toContain(" u '");
    }
  });

  test("A12 también opera con el prefijo `en uno de los estados` (combina con A2)", () => {
    const l = una("Consentimiento informado puede estar en uno de los estados 'pendiente' u 'otorgado'.");
    expect(l.clase).toBe("normalizada");
    if (l.clase === "normalizada") {
      // El `u` ya quedó reescrito a `o` (lo aplica A12 antes que A2 strippee el prefijo).
      expect(l.oracion).toContain("'pendiente' o 'otorgado'");
      expect(l.oracion).not.toContain(" u '");
    }
  });

  test("fixture negativo: `u` fuera de una lista de estados NO se toca", () => {
    // Sin `puede estar`, A12 no aplica (no es contexto de estados).
    const l = una("Unidad u oficina coordina la ruta.");
    if (l.clase === "normalizada") expect(l.regla).not.toBe("A12");
    // (la oración puede caer en otra clase; lo esencial es que A12 no la reescribe)
  });
});

// ── R3 — verbo fuera del enum cerrado ───────────────────────────────────

describe("R3 — verbos no canonicos se rechazan (los SIN mapeo) / familia V (los mapeados)", () => {
  test("`alimenta` → V4 (instrumento), ya no R3", () => {
    const l = una("Resultado de interconsulta alimenta Evaluación clínica evolutiva.");
    expect(l.clase).toBe("compuesta");
    if (l.clase === "compuesta") expect(l.regla).toBe("V4");
  });

  test("`precede a` (procesos) → V7 (invocación), ya no R3/R7", () => {
    const l = una("Evaluación de entorno seguro precede a Realización de la atención en domicilio.");
    expect(l.clase).toBe("compuesta");
    if (l.clase === "compuesta") expect(l.regla).toBe("V7");
  });

  test("`compromete` / `libera` → V6 (afecta + verbo anotado); `proyecta` SIGUE R3", () => {
    const compromete = una("Ingreso HODOM compromete Capacidad de prestaciones.");
    expect(compromete.clase).toBe("compuesta");
    if (compromete.clase === "compuesta") expect(compromete.regla).toBe("V6");
    const libera = una("Cierre del episodio HODOM libera Capacidad de prestaciones.");
    expect(libera.clase).toBe("compuesta");
    // `proyecta` está EN REFLEXIÓN del operador: sigue rechazada (R3).
    const proyecta = una("Cupo HODOM proyecta la Capacidad de prestaciones comprometida como día-cama para REM.");
    expect(proyecta.clase).toBe("rechazada");
    if (proyecta.clase === "rechazada") expect(proyecta.categoria).toBe("R3");
  });
});

// ── R4 — estado no declarado usado por A4 ────────────────────────────────

describe("R4 — estado pegado NO declarado se rechaza (no se adivina)", () => {
  test("estado inexistente para la entidad", () => {
    // Paciente declara estados, pero NO 'hospitalizado en domicilio': R4.
    const ctx = construirContextoProto([
      [
        "Paciente es físico y ambiental.",
        "Paciente puede estar 'requiere prestaciones' o 'egresado de HODOM'.",
      ],
    ]);
    const l = una("Operación clínica en domicilio requiere Paciente hospitalizado en domicilio.", ctx);
    expect(l.clase).toBe("rechazada");
    if (l.clase === "rechazada") expect(l.categoria).toBe("R4");
  });
});

// ── R6 — cola informal en lista ─────────────────────────────────────────

describe("R6 — elemento de lista no nominal se rechaza", () => {
  test("`y los demás veredictos parciales`", () => {
    const l = una(
      "Evaluación clínica de elegibilidad, Informe social y los demás veredictos parciales son físicas y sistémicas.",
    );
    expect(l.clase).toBe("rechazada");
    if (l.clase === "rechazada") expect(l.categoria).toBe("R6");
  });
});

// ── R7 — relacion no primitiva ──────────────────────────────────────────

describe("R7 — relacion libre se rechaza", () => {
  test("`está acotado por` YA NO es R7: lo mapea V17 (adjudicación dov-dori 2026-06-05)", () => {
    // Histórico: era rechazo R3/R7 y una de las 5 en-reflexión del operador.
    // La adjudicación (d) lo bifurcó por firma de extremos: abstracto↔abstracto
    // → estructural etiquetado «está acotado por». Detalle en
    // `adjudicacion-dov-dori.test.ts` (P2-d).
    const l = una("Acceso del colaborador de cuidado a la información clínica está acotado por Deber de reserva.");
    expect(l.clase).toBe("compuesta");
    if (l.clase === "compuesta") {
      expect(l.regla).toBe("V17");
    }
  });

  test("`puede suceder a` → V8 (tagged «sucede a»), ya no R7", () => {
    const l = una("Episodio HODOM puede suceder a un Episodio HODOM previo opcional.");
    expect(l.clase).toBe("compuesta");
    if (l.clase === "compuesta") expect(l.regla).toBe("V8");
  });

  test("`corresponde a` → V9 (tagged «corresponde a»), ya no R7", () => {
    const l = una("Parada corresponde a un Domicilio.");
    expect(l.clase).toBe("compuesta");
    if (l.clase === "compuesta") expect(l.regla).toBe("V9");
  });
});

// ── Idempotencia: normalizar∘normalizar = normalizar ─────────────────────

describe("idempotencia — re-normalizar las salidas no cambia su clasificacion", () => {
  const positivos: string[] = [
    "Paciente es un objeto físico y ambiental.",
    "Episodio HODOM puede estar en uno de los estados 'abierto' o 'cerrado'.",
    "Curación avanzada afecta Lesión (de 'activa' a 'cerrada').",
    "Verificación cambia Solicitud a 'aceptada', 'en espera' o 'rechazada'.",
    "Médico de Atención Directa maneja Evaluación de la solicitud de ingreso e Ingreso HODOM.",
    "Establecimiento que otorga prestaciones de Hospitalización Domiciliaria exhibe Hospitalización en domicilio como su operación.",
    "Admisión e instalación en domicilio, Operación clínica en domicilio y Cierre del episodio HODOM son físicas y sistémicas.",
    "Auto exhibe Color.",
    "Equipo HODOM maneja Hospitalización en domicilio.",
  ];

  test("aplicar la normalizacion sobre las oraciones de salida es estable", () => {
    for (const s of positivos) {
      const ctx = construirContextoProto([[s]]);
      const primera = normalizarBloqueOpl([s], ctx);
      // Reconstruir las oraciones de salida (estricta|normalizada) y re-normalizar.
      const oraciones = primera
        .filter((l): l is Extract<LineaNormalizada, { oracion: string }> => "oracion" in l)
        .map((l) => l.oracion);
      const ctx2 = construirContextoProto([oraciones]);
      const segunda = normalizarBloqueOpl(oraciones, ctx2);
      const oraciones2 = segunda
        .filter((l): l is Extract<LineaNormalizada, { oracion: string }> => "oracion" in l)
        .map((l) => l.oracion);
      expect(oraciones2).toEqual(oraciones);
      // Y todas deben ser estrictas en la segunda pasada (ya estan en forma canonica).
      expect(segunda.every((l) => l.clase === "estricta" || l.clase === "estructura")).toBe(true);
    }
  });
});

// ── Ley L1 — toda salida estricta|normalizada parsea de verdad ───────────

describe("L1 — estricta|normalizada parsean sin `unsupported-kernel` (parser real)", () => {
  const ctx = construirContextoProto([
    [
      "Paciente es físico y ambiental.",
      "Paciente puede estar 'hospitalizado en domicilio' o 'egresado de HODOM'.",
      "Equipo HODOM maneja Hospitalización en domicilio.",
      "Hospitalización en domicilio es física y sistémica.",
    ],
  ]);

  const superficies: string[] = [
    "Paciente es un objeto físico y ambiental.",
    "Paciente es físico y ambiental.",
    "Hospitalización en domicilio es física y sistémica.",
    "Episodio HODOM puede estar en uno de los estados 'abierto' o 'cerrado'.",
    "Domicilio puede estar 'viable' o 'no viable'.",
    "Curación avanzada afecta Lesión (de 'activa' a 'cerrada').",
    "Verificación cambia Solicitud a 'aceptada', 'en espera' o 'rechazada'.",
    "Transporte cambia Muestra a 'en tránsito'.",
    "Médico de Atención Directa maneja Evaluación e Ingreso HODOM.",
    "Establecimiento exhibe Hospitalización en domicilio como su operación.",
    "Admisión, Operación y Cierre son físicas y sistémicas.",
    "Equipo HODOM maneja Hospitalización en domicilio.",
    "Operación clínica en domicilio requiere Paciente hospitalizado en domicilio.",
    "Auto exhibe Color.",
  ];

  test("cada oracion estricta|normalizada producida es aceptada por el parser", () => {
    for (const s of superficies) {
      const lineas = normalizarBloqueOpl([s], ctx);
      for (const l of lineas) {
        if (l.clase === "estricta" || l.clase === "normalizada") {
          expect({ oracion: l.oracion, acepta: parserAcepta(l.oracion) }).toEqual({
            oracion: l.oracion,
            acepta: true,
          });
        }
      }
    }
  });
});
