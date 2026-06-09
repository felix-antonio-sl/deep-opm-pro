// Fixtures de equivalencia laxo↔E2 de la familia V (F2 de la migración a skill).
//
// Cada fixture nace del ledger F1 (`ledger-familia-v-skill.md (retirado 2a83c1c5, en git)`)
// y su `claseE2` está MEDIDA empíricamente (sonda 2026-06-07), no supuesta:
//
//   - `estricto-reverse`: existe una forma OPL-ES estricta REVERSE-parseable que
//     compila SIN familia-V y produce el mismo modelo observable que la laxa.
//     Son los verbos→verbo-del-enum (V4/V5/V7) y el evento de estado (V3).
//     Estas 4 reglas YA SE RETIRARON del compilador (F5-parcial, 2026-06-08);
//     la skill emite la forma estricta. Los fixtures se conservan como guarda
//     de que el retiro fue limpio (laxo rechaza + E2 compila).
//   - `requiere-decision`: el mapeo emite un tagged (solo-forward, el reverse no
//     lo re-lee), un modificador condicion/evento sin superficie textual, o una
//     ancla/abanico. Su "salida E2" NO es texto OPL-ES estricto → necesita una
//     decisión de transporte (superficie reverse nueva o emisión estructurada)
//     antes de F4/F5. F2 los CLASIFICA; no finge equivalencia.
//
// Los negativos distinguen `rechazoLegacy: true` (el compilador legacy ya rechaza
// el barro) de `rechazoLegacy: false` (DEUDA: la skill deberá rechazarlo en E2,
// pero el legacy lo absorbe ciego — p.ej. V5 `detecta` no valida que el objeto
// sea evento producido).

export interface FixtureFamiliaV {
  regla: string;
  /** Superficie laxa que dispara la regla V por la ruta legacy. */
  laxo: string;
  /** Forma E2 candidata (texto), si existe una superficie comparable. */
  e2?: string;
  claseE2: "estricto-reverse" | "requiere-decision";
  positivo: boolean;
  /** Solo negativos: ¿el compilador legacy ya rechaza este barro? */
  rechazoLegacy?: boolean;
  nota?: string;
}

/** Declaraciones compartidas (entidades + estados + tipos) que los casos usan. */
export const PREAMBULO_FIXTURES = `# Fixtures familia-V F2

\`\`\`opl
Cupo HODOM es un objeto físico y sistémico.
Cupo HODOM puede estar 'disponible' u 'ocupado'.
Evaluación de la solicitud es un proceso físico y sistémico.
Evaluación de ingreso es un proceso físico y sistémico.
Inspección pre-ruta es un proceso físico y sistémico.
Vehículo de transporte es un objeto físico y sistémico.
Vehículo de transporte puede estar 'disponible' o 'en ruta'.
Semáforo es un objeto físico y sistémico.
Semáforo puede estar 'rojo', 'amarillo' o 'verde'.
Evaluar es un proceso físico y sistémico.
Discrepancia es un objeto informacional y sistémico.
Discrepancia puede estar 'detectada' o 'resuelta'.
Ajuste terapéutico es un proceso físico y sistémico.
Resultado de examen es un objeto informacional y sistémico.
Evaluación clínica evolutiva es un proceso físico y sistémico.
Monitorización es un proceso físico y sistémico.
Evento de deterioro clínico es un objeto informacional y sistémico.
Paciente es un objeto físico y ambiental.
Ingreso HODOM es un proceso físico y sistémico.
Capacidad de prestaciones es un objeto informacional y sistémico.
Traslado del paciente es un proceso físico y sistémico.
Cierre por reingreso es un proceso físico y sistémico.
Episodio HODOM es un objeto informacional y sistémico.
Episodio HODOM previo es un objeto informacional y sistémico.
Parada es un objeto físico y sistémico.
Domicilio es un objeto físico y ambiental.
Profesional ejecutor es un objeto físico y ambiental.
Competencia requerida es un objeto informacional y sistémico.
Autorización sanitaria es un objeto informacional y sistémico.
Establecimiento HODOM es un objeto físico y sistémico.
Evento adverso es un objeto informacional y sistémico.
Evento adverso puede estar 'detectado' o 'cerrado'.
Notificabilidad es un objeto informacional y sistémico.
Notificabilidad puede estar 'notificable' o 'no notificable'.
Notificación a la autoridad es un proceso físico y sistémico.
Atención es un proceso físico y sistémico.
Condición es un objeto informacional y sistémico.
Condición puede estar 'estable' o 'inestable'.
Suspensión es un proceso físico y sistémico.
Cierre disciplinario es un proceso físico y sistémico.
Cierre voluntario es un proceso físico y sistémico.
Solicitante es un objeto físico y ambiental.
Resolución del permiso es un proceso físico y sistémico.`;

export const FIXTURES_FAMILIA_V: FixtureFamiliaV[] = [
  // ── Migrable-estricto (E2 reverse-parseable, equivalencia verde) ──
  // RETIRADAS del compilador en F5-parcial (2026-06-08): su mapper legacy ya no
  // existe; la laxa rechaza ruidoso, la E2 compila estricto. Estos fixtores ahora
  // alimentan la guarda de retiro (ver `migracion-familia-v.test.ts`).
  {
    regla: "V3",
    laxo: "Discrepancia en 'detectada' puede iniciar Ajuste terapéutico.",
    e2: "Discrepancia en estado 'detectada' inicia Ajuste terapéutico.",
    claseE2: "estricto-reverse",
    positivo: true,
    nota: "evento de estado: la modalidad `puede` no agrega primitiva; el evento sí tiene forma T1 estricta.",
  },
  {
    regla: "V4",
    laxo: "Resultado de examen alimenta Evaluación clínica evolutiva.",
    e2: "Evaluación clínica evolutiva requiere Resultado de examen.",
    claseE2: "estricto-reverse",
    positivo: true,
    nota: "alimentar = instrumento persistente objeto→proceso.",
  },
  {
    regla: "V5",
    laxo: "Monitorización detecta Evento de deterioro clínico.",
    e2: "Monitorización genera Evento de deterioro clínico.",
    claseE2: "estricto-reverse",
    positivo: true,
    nota: "detectar = produce el objeto-evento detectado (resultado).",
  },
  {
    regla: "V7",
    laxo: "Traslado del paciente precede a Cierre por reingreso.",
    e2: "Traslado del paciente invoca Cierre por reingreso.",
    claseE2: "estricto-reverse",
    positivo: true,
    nota: "precedencia temporal proceso→proceso = invocación.",
  },

  // ── Requiere-decisión (tagged solo-forward / modificador / ancla / abanico) ──
  {
    regla: "V1",
    laxo: "Cupo HODOM en 'disponible' habilita Evaluación de la solicitud.",
    claseE2: "requiere-decision",
    positivo: true,
    nota: "instrumento-condición: el modificador `condicion` no tiene superficie OPL-ES reverse pura.",
  },
  {
    regla: "V2",
    laxo: "Cupo HODOM en 'ocupado' restringe Evaluación de ingreso.",
    claseE2: "requiere-decision",
    positivo: true,
    nota: "instrumento-condición desde el estado complementario (binario); modificador sin superficie reverse.",
  },
  {
    regla: "V6",
    laxo: "Ingreso HODOM compromete Capacidad de prestaciones.",
    claseE2: "requiere-decision",
    positivo: true,
    nota: "efecto + etiqueta `compromete`; la etiqueta es solo-forward.",
  },
  {
    regla: "V8",
    laxo: "Episodio HODOM puede suceder a un Episodio HODOM previo opcional.",
    e2: "Episodio HODOM sucede a Episodio HODOM previo.",
    claseE2: "requiere-decision",
    positivo: true,
    nota: "tagged `sucede a` + multiplicidad; la forma forward NO reproduce el enlace por ruta reverse.",
  },
  {
    regla: "V9",
    laxo: "Parada corresponde a un Domicilio.",
    e2: "Parada corresponde a Domicilio.",
    claseE2: "requiere-decision",
    positivo: true,
    nota: "tagged `corresponde a`; forward solo-forward.",
  },
  {
    regla: "V10",
    laxo: "Profesional ejecutor cumple Competencia requerida para el acto.",
    claseE2: "requiere-decision",
    positivo: true,
    nota: "tagged `cumple` + cola `para el acto` como ancla pendiente.",
  },
  {
    regla: "V11",
    laxo: "Autorización sanitaria habilita Establecimiento HODOM.",
    e2: "Autorización sanitaria habilita Establecimiento HODOM.",
    claseE2: "requiere-decision",
    positivo: true,
    nota: "tagged `habilita` objeto→objeto: la única superficie es la que dispara V11 (su E2 = su laxo, vuelve a usar familia-V).",
  },
  {
    regla: "V13",
    laxo: "Evento adverso en 'detectado' con Notificabilidad 'notificable' inicia Notificación a la autoridad.",
    claseE2: "requiere-decision",
    positivo: true,
    nota: "guard compuesto: evento + condición; dos flechas con modificador, sin superficie reverse única.",
  },
  {
    regla: "V14",
    laxo: "Atención cambia Condición a 'estable', o inicia Cierre por reingreso.",
    claseE2: "requiere-decision",
    positivo: true,
    nota: "transición + invocación-evento + pendiente XOR (ramas heterogéneas).",
  },
  {
    regla: "V15",
    laxo: "Suspensión puede iniciar Cierre disciplinario o Cierre voluntario.",
    claseE2: "requiere-decision",
    positivo: true,
    nota: "dos eventos + abanico XOR; el abanico no es texto OPL-ES lineal.",
  },
  {
    regla: "V16",
    laxo: "Resolución del permiso notifica al Solicitante la resolución adoptada.",
    claseE2: "requiere-decision",
    positivo: true,
    nota: "compuesta: genera Notificación + tagged `dirigido a`; el tagged es solo-forward.",
  },
  {
    regla: "V17",
    laxo: "Resolución del permiso está acotada por un plazo de 30 días.",
    claseE2: "requiere-decision",
    positivo: true,
    nota: "rama temporal: exhibe Plazo + cola anotada; la cola es ancla pendiente.",
  },

  // ── Negativos: el barro no se normaliza ──
  {
    regla: "V2",
    laxo: "Semáforo en 'rojo' restringe Evaluar.",
    claseE2: "requiere-decision",
    positivo: false,
    rechazoLegacy: true,
    nota: "no binario (3 estados) → V2 no aplica, se rechaza.",
  },
  {
    regla: "V3",
    laxo: "Cupo HODOM puede iniciar Evaluación de la solicitud o Evaluación de ingreso.",
    claseE2: "estricto-reverse",
    positivo: false,
    rechazoLegacy: true,
    nota: "disyunción → no es V3 unidestino; el legacy la rechaza con este sujeto.",
  },
  {
    regla: "V4",
    laxo: "Monitorización alimenta Atención.",
    claseE2: "estricto-reverse",
    positivo: false,
    rechazoLegacy: true,
    nota: "proceso→proceso: `requiere` exige objeto origen → firma ilegal, fallo.",
  },
  {
    regla: "V5",
    laxo: "Monitorización detecta Paciente.",
    claseE2: "estricto-reverse",
    positivo: false,
    rechazoLegacy: false,
    nota: "DEUDA: el legacy aplica V5 ciego (genera Paciente); la skill E2 debe exigir que el objeto sea evento producido, no receptor.",
  },
  {
    regla: "V7",
    laxo: "Resultado de examen precede a Capacidad de prestaciones.",
    claseE2: "estricto-reverse",
    positivo: false,
    rechazoLegacy: true,
    nota: "objeto→objeto: `invoca` exige procesos → firma ilegal, fallo.",
  },
];
