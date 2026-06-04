// Normalizador del sub-dialecto del proto-modelo (W1.2). Funcion PURA.
//
// Entrada:  lineas crudas de un bloque ```opl (mas un ContextoProto acumulado
//           por una pasada previa).
// Salida:   una `LineaNormalizada[]` (puede expandir una linea a varias: A1, A6).
//
// SSOT:     `docs/proto-modelo/gramatica-subdialecto-v0.md`.
// Arbitro:  `src/opl/parser/parsear.ts` — una oracion es "estricta" si el parser
//           la acepta sin `unsupported-kernel` (ni `syntax-error`). El
//           normalizador apunta a las formas estrictas REALES verificadas contra
//           el parser, que en varios casos divergen de la spec v0 (ver cabecera
//           de cada regla y el reporte de falsacion).
//
// Sin IO, sin JointJS, sin Zustand: solo strings -> clasificacion.

import type { Ancla, CategoriaRechazo, ContextoProto, Directiva, Emision, LineaNormalizada, ReglaT2 } from "./tipos";

// ── Lexico canonico ─────────────────────────────────────────────────────

/** Verbos procedurales/estructurales del enum cerrado que el parser entiende.
 *  Si la oracion usa un verbo que no esta aqui (ni es copular/estado), es R3. */
const VERBOS_CANONICOS = new Set<string>([
  "maneja",
  "manejan",
  "requiere",
  "requieren",
  "consume",
  "consumen",
  "genera",
  "generan",
  "afecta",
  "afectan",
  "cambia",
  "invoca",
  "invocan",
  "exhibe",
  "exhiben",
  "consta",
  "constan",
]);

/** Regex que localiza un verbo CANONICO en cualquier posicion de la oracion
 *  (la frase nominal del sujeto puede tener varias palabras). Permite distinguir
 *  formas validas de R3 sin una heuristica posicional fragil. */
const VERBO_CANONICO_RE =
  /\s(maneja|manejan|requiere|requieren|consume|consumen|genera|generan|afecta|afectan|cambia|invoca|invocan|exhibe|exhiben|consta|constan)\s/iu;

/** Verbos NO canonicos observados en el corpus, separados por categoria de
 *  rechazo. R7 = relacionales con preposicion (no hay verbo OPM directo);
 *  R3 = verbos transitivos fuera del enum. */
const VERBOS_R7_RE = /\s(precede\s+a|acotad[oa]\s+por|suceder\s+a|sucede\s+a|corresponde\s+a)\s/iu;
const VERBOS_R3_RE =
  /\s(alimenta|alimentan|compromete|comprometen|libera|liberan|proyecta|proyectan|restringe|restringen|habilita|habilitan|detecta|detectan|determina|determinan|cumple|cumplen|otorga|otorgan)\s/iu;

/** Conectores no canonicos que A8 reescribe a `y`. */
const CONECTOR_E_RE = /\s+e\s+/giu;
const CONECTOR_ASI_COMO_RE = /\s+as[ií]\s+como\s+/giu;

/** Detector de clausula condicional (R1): `cuando`/`según`/`por una`/`por la`/
 *  guard compuesto `con <X> '<estado>'` dentro de un evento. */
const R1_CUANDO_RE = /\bcuando\b/iu;
const R1_SEGUN_RE = /\bseg[uú]n\b/iu;
const R1_CON_GUARD_RE = /\s+con\s+[A-ZÁÉÍÓÚÑ].*?['`].+?['`]\s+inicia\s+/iu;

/** Disyuncion de clausulas (R2): `puede iniciar A o B`, `inicia A o B`,
 *  `, o inicia`. La disyuncion `o` dentro de una LISTA de estados
 *  (`'a', 'b' o 'c'`) NO es R2 — se distingue por el verbo. */
const R2_PUEDE_INICIAR_RE = /\bpuede\s+iniciar\b.+\bo\b/iu;
const R2_O_INICIA_RE = /,\s*o\s+inicia\b/iu;
/** R2 (gramatica v0 §R2): `… inicia A o B` — dos procesos-consecuencia
 *  alternativos en un solo evento. La spec ya lo lista como R2; el parser lo
 *  absorbía como un proceso de nombre compuesto (`A o B`). El `o` debe estar
 *  FUERA de comillas/backticks (una lista de estados `'a' o 'b'` no es R2). */
const R2_INICIA_DISYUNCION_RE = /\binicia\s+(?:(?!['`]).)*\bo\b(?:(?!['`]).)*$/iu;

/** Cola informal de lista (R6): `y los demás ...`, `y otros ... según ...`,
 *  `y los demas <algo> parciales`. */
const R6_COLA_INFORMAL_RE =
  /\sy\s+(?:los\s+dem[aá]s|las\s+dem[aá]s|otros|otras|los\s+otros)\b/iu;

// ── API de contexto ──────────────────────────────────────────────────────

/**
 * Pasada previa: recorre TODOS los bloques y acumula (i) los estados declarados
 * por entidad (para A4/R4) y (ii) el tipo inferido de cada entidad (para AESS).
 *
 * Inferencia de tipo: una entidad es PROCESO si es sujeto de un verbo procedural
 * activo cuyo sujeto es el proceso (`maneja`* invertido: el sujeto es el objeto;
 * pero `consume/genera/afecta/requiere/invoca/cambia` tienen al proceso como
 * sujeto del verbo). Es tambien proceso si aparece como sujeto de `se descompone
 * en`. Es OBJETO si es sujeto de `puede estar`, `exhibe`, `consta de`, o sujeto
 * de `maneja` (el agente que maneja un proceso es un objeto). Ante conflicto,
 * gana la primera evidencia fuerte de proceso (las cadenas procedurales son mas
 * informativas que el default objeto).
 */
export function construirContextoProto(bloques: string[][]): ContextoProto {
  const estadosPorEntidad = new Map<string, Set<string>>();
  const tipoPorEntidad = new Map<string, "objeto" | "proceso">();
  const entidades = new Map<string, string>();
  // Entidades con una clase OPM declarada EXPLÍCITAMENTE (descripción `es un
  // objeto/proceso`, sujeto de `puede estar`/`exhibe`/`consta de`, refinable de
  // `se descompone/despliega`, o sujeto de un verbo procedural). Distingue una
  // clase fuerte de la heredada por agregación homogénea (tensión 4): una parte
  // de `consta de` SIN clase explícita hereda la del todo; una parte con clase
  // contraria explícita es contradicción real (diagnóstico, no silencio).
  const claseExplicita = new Set<string>();
  // Agentes: sujeto de `maneja` (rol agente OPM). Un agente es SIEMPRE objeto
  // físico; esta evidencia es decisiva y gana sobre el heurístico débil de
  // "sujeto de genera/afecta ⇒ proceso" (instituciones como la SEREMI "generan"
  // documentos de forma laxa pero son agentes, no procesos). Tensión 5.
  const esAgente = new Set<string>();

  const registrar = (nombre: string) => {
    const limpio = nombre.trim();
    const clave = claveNombre(limpio);
    if (clave && !entidades.has(clave)) entidades.set(clave, limpio);
  };

  const marcarTipo = (nombre: string, tipo: "objeto" | "proceso", explicita = false) => {
    registrar(nombre);
    const clave = claveNombre(nombre);
    if (!clave) return;
    if (explicita) claseExplicita.add(clave);
    // El proceso "gana": una vez proceso, no se degrada a objeto.
    if (tipo === "proceso") {
      tipoPorEntidad.set(clave, "proceso");
    } else if (!tipoPorEntidad.has(clave)) {
      tipoPorEntidad.set(clave, "objeto");
    }
  };

  for (const bloque of bloques) {
    for (const cruda of bloque) {
      const linea = limpiarCruda(cruda);
      if (!linea || linea.startsWith("#")) continue;
      const sinPunto = linea.replace(/\.\s*$/, "").trim();

      // Estados declarados: `X puede estar [en uno de los estados] 'a' o 'b'`.
      const estados = capturarEstados(sinPunto);
      if (estados) {
        const clave = claveNombre(estados.entidad);
        const set = estadosPorEntidad.get(clave) ?? new Set<string>();
        for (const e of estados.estados) set.add(claveEstado(e));
        estadosPorEntidad.set(clave, set);
        // Portar estados es evidencia explícita de OBJETO (clase fuerte).
        marcarTipo(estados.entidad, "objeto", true);
        continue;
      }

      // Estados introducidos IMPLICITAMENTE por transiciones/resultados:
      // `P cambia X de 'a' a 'b'`, `P cambia X a 'b'`, `P genera X en estado 'e'`,
      // `X en estado 'e' inicia P`. En OPM mencionar un estado en una transicion
      // lo declara para el objeto; el corpus lo hace sin repetirlo en `puede
      // estar`. Cosechar estos estados evita falsos R4 (la entidad SI tiene el
      // estado, solo que declarado por uso). El objeto es siempre el portador.
      for (const declarado of cosecharEstadosImplicitos(sinPunto)) {
        const claveEnt = claveNombre(declarado.entidad);
        const set = estadosPorEntidad.get(claveEnt) ?? new Set<string>();
        for (const e of declarado.estados) set.add(claveEstado(e));
        estadosPorEntidad.set(claveEnt, set);
        registrar(declarado.entidad);
      }

      // Sujeto de verbo procedural -> evidencia de tipo.
      const proc = /^(.+?)\s+(maneja|manejan|requiere|requieren|consume|consumen|genera|generan|afecta|afectan|cambia|invoca|invocan|exhibe|exhiben|consta|constan)\s+(.+)$/iu.exec(
        sinPunto,
      );
      if (proc) {
        const sujeto = (proc[1] ?? "").trim();
        const verbo = (proc[2] ?? "").toLocaleLowerCase("es");
        const complemento = (proc[3] ?? "").trim();
        if (verbo.startsWith("maneja")) {
          // "Agente maneja Proceso": sujeto=objeto (rol agente, evidencia decisiva
          // — tensión 5), complemento=proceso (manejado). El complemento NO se
          // marca como clase explícita: la lista del proto puede contener nombres
          // con ` y ` interno (`Vigilancia y seguridad asistencial`) que
          // `dividirListaSimple` fragmenta; un fragmento espurio NO debe sellar una
          // clase contraria que dispare un falso diagnóstico de agregación
          // heterogénea (tensión 4). El tipo seguido (proceso) basta como semilla.
          marcarTipo(sujeto, "objeto", true);
          esAgente.add(claveNombre(sujeto));
          for (const item of dividirListaSimple(complemento)) marcarTipo(item, "proceso", false);
        } else if (verbo.startsWith("exhibe") || verbo.startsWith("consta")) {
          // "Objeto exhibe/consta de ...": el sujeto es objeto con clase explícita.
          // Para `consta de` (agregación homogénea, tensión 3/4) registramos las
          // PARTES como entidades conocidas — sin tiparlas: la parte sin clase
          // propia hereda la del todo en el emisor. El registro permite además
          // que un nombre con ` en ` (`Resumen clínico en domicilio`) declarado en
          // una lista `consta de` se reconozca como entidad completa, no como
          // `objeto + estado` (tensión 3).
          marcarTipo(sujeto, "objeto", true);
          if (verbo.startsWith("consta")) {
            // Registra los segmentos de la lista CONSERVANDO el ` y ` interno de
            // los nombres compuestos (`Vigilancia y monitorización clínica`), para
            // que el emisor pueda preferir el nombre conocido más largo y la
            // agregación homogénea cierre sobre el ítem entero (tensión 3/4). El
            // `consta DE …` deja la preposición pegada al primer ítem: la quitamos.
            const lista = quitarColaMultiplicidad(complemento).replace(/^de\s+/iu, "");
            for (const item of segmentosLista(lista)) registrar(item);
          }
        } else {
          // consume/genera/afecta/requiere/invoca/cambia: sujeto=proceso. Es clase
          // explícita SALVO `genera` (instituciones agente "generan" documentos de
          // forma laxa; no es evidencia fuerte de proceso — tensión 5). El sujeto
          // de `genera` que además es agente (`maneja`) se resolverá a objeto.
          marcarTipo(sujeto, "proceso", !verbo.startsWith("genera"));
        }
        continue;
      }

      // Sujeto de un refinamiento `se descompone en` -> proceso (y registra las
      // partes como entidades conocidas).
      const desc = /^(.+?)\s+se\s+(?:descompone|despliega)(?:\s+tambi[eé]n)?\s+en\s+(.+)$/iu.exec(sinPunto);
      if (desc) {
        const esDespliegue = /\bse\s+despliega(?:\s+tambi[eé]n)?\s+en\b/iu.test(sinPunto);
        // `se descompone en` refina un PROCESO (clase explícita fuerte); `se
        // despliega en` puede refinar un objeto — no forzamos proceso ahí.
        if (!esDespliegue) marcarTipo((desc[1] ?? "").trim(), "proceso", true);
        else registrar((desc[1] ?? "").trim());
        for (const parte of dividirListaSimple((desc[2] ?? "").replace(/\s+en\s+esa\s+secuencia$/iu, ""))) {
          registrar(parte);
        }
        continue;
      }

      // Descripcion explicita con `un objeto/proceso` -> registra y tipa (explícita).
      const dcanon = /^(.+?)\s+es\s+un\s+(objeto|proceso)\s+/iu.exec(sinPunto);
      if (dcanon) {
        marcarTipo((dcanon[1] ?? "").trim(), dcanon[2] === "proceso" ? "proceso" : "objeto", true);
        continue;
      }

      // Esencia/afiliacion bare (`X es físico y sistémico`): registra como objeto
      // por defecto (otra evidencia procedural puede promoverla a proceso).
      const ess = /^(.+?)\s+es\s+(?:f[ií]sic[oa]|informacional)\s+y\s+(?:sist[eé]mic[oa]|ambiental)$/iu.exec(sinPunto);
      if (ess) {
        registrar((ess[1] ?? "").trim());
        continue;
      }
    }
  }

  // Reconciliación final (tensión 5): un agente (sujeto de `maneja`) es objeto
  // físico por regla OPM. Si quedó tipado `proceso` por un heurístico débil
  // (`X genera …` con X institución), lo forzamos a objeto — la evidencia de
  // rol-agente es decisiva. No tocamos un agente que ya es objeto.
  for (const clave of esAgente) {
    if (tipoPorEntidad.get(clave) === "proceso") {
      tipoPorEntidad.set(clave, "objeto");
      claseExplicita.add(clave);
    }
  }

  return { estadosPorEntidad, tipoPorEntidad, entidades, claseExplicita };
}

/** Quita la cola `… con multiplicidad N..M` que el corpus pega a una parte de
 *  `consta de` (`Parada con multiplicidad 1..N`). El registro de la parte no la
 *  necesita; el parser la maneja por separado. */
function quitarColaMultiplicidad(texto: string): string {
  return texto.replace(/\s+con\s+multiplicidad\s+[\d.Nn*+]+\s*$/iu, "").trim();
}

// ── Normalizador principal ───────────────────────────────────────────────

/**
 * Clasifica/normaliza cada linea no vacia de un bloque. Una linea puede
 * expandirse a varias salidas (A1 distribuye esencia; A6 expande TS).
 */
export function normalizarBloqueOpl(lineas: string[], contexto: ContextoProto): LineaNormalizada[] {
  const salida: LineaNormalizada[] = [];
  for (const cruda of lineas) {
    const linea = limpiarCruda(cruda);
    if (!linea) continue;
    salida.push(...normalizarLinea(linea, contexto));
  }
  return salida;
}

function normalizarLinea(linea: string, contexto: ContextoProto): LineaNormalizada[] {
  // 1) Comentario.
  if (linea.startsWith("#")) {
    const texto = linea.replace(/^#\s*/, "");
    return [{ clase: "comentario", texto, anclas: extraerAnclas(linea) }];
  }

  // 2) Extraer anclas inline (se conservan junto a la linea; no compilan ni rechazan).
  const anclas = extraerAnclas(linea);
  const sinAnclas = quitarAnclas(linea).trim();
  const sinPuntoCrudo = sinAnclas.replace(/\.\s*$/, "").trim();
  const conAnclas = <T extends LineaNormalizada>(l: T): T => (anclas.length ? { ...l, anclas } : l);

  // A12 (tensión 2): disyunción `u` (ante sonido /o/) → `o` en LISTAS DE ESTADOS.
  // El español exige `u` ante palabra que empieza por /o/ (`'disponible' u
  // 'ocupado'`), pero el divisor de listas del parser parte SOLO por ` o `. Se
  // reescribe ` u '`/`` u ` `` → ` o '`/`` o ` `` únicamente tras `puede estar`
  // (contexto de estados) para no tocar otras `u`. El canónico queda con `o`
  // uniforme, igual que el generador forward (GAP ortográfico aceptado, §A12).
  const a12 = aplicarA12(sinPuntoCrudo);
  const sinPunto = a12.texto;
  // Si A12 reescribió, la línea es `normalizada` con regla A12 — salvo que aún
  // requiera otra clase (estructura/rechazo): esos pasos corren sobre el texto ya
  // reescrito y el wrapper preserva el `original` previo a A12.
  const conA12 = <T extends LineaNormalizada>(l: T): T =>
    a12.aplico && l.clase === "estricta"
      ? ({ clase: "normalizada", oracion: l.oracion, original: asegurarPunto(sinPuntoCrudo), regla: "A12" } as unknown as T)
      : l;

  // 3) Refinamiento (clase estructura). Debe ir ANTES de los rechazos por verbo,
  //    porque `se descompone en` no es un verbo del enum procedural.
  const estructura = clasificarEstructura(sinPunto);
  if (estructura) return [conAnclas(estructura)];

  // 4) FAMILIA V — mapeos de verbos/patrones extendidos decididos por el operador
  //    (W4.3-rechazos, 2026-06-04). Reemplazan rechazos R1/R2/R3/R4/R7 por
  //    primitivas OPM. Se evalúan ANTES de los rechazos tempranos para
  //    interceptar las colas condicionales/guards/disyunciones que de otro modo
  //    serían R1/R2, y antes del R3/R7 para los verbos extendidos (habilita,
  //    alimenta, detecta, compromete, libera, precede a, sucede a, corresponde a,
  //    cumple, restringe, puede iniciar). Si NO mapea, sigue el flujo de rechazo.
  const familiaV = mapearFamiliaV(sinPunto, contexto);
  if (familiaV) return [conAnclas(familiaV)];

  // 5) Rechazos que el parser aceptaria como falso positivo si los dejamos
  //    pasar (R1 según/cuando/con-guard, R2 disyuncion, R6 cola informal).
  //    Se evaluan ANTES de las reescrituras para no "limpiar" la condicion.
  const rechazoTemprano = detectarRechazoTemprano(sinPunto);
  if (rechazoTemprano) return [conAnclas({ clase: "rechazada", original: sinAnclas, ...rechazoTemprano })];

  // 6) Reescrituras T2 que pueden EXPANDIR (A1 esencia-lista, A6 TS multi-destino).
  const expandida = expandir(sinPunto, contexto);
  if (expandida) return expandida.map((l) => conAnclas(l));

  // 7) Reescrituras T2 1:1 (A2, A3, A4/R4, A8, A9, AESS).
  const reescrita = reescribir1a1(sinPunto, contexto);
  if (reescrita) return [conAnclas(reescrita)];

  // 8) Verbo fuera del enum -> R3. Se evalua tras las reescrituras para no
  //    confundir formas validas (copular, estados, refinamiento) con R3.
  const r3 = detectarVerboNoCanonico(sinPunto);
  if (r3) return [conAnclas({ clase: "rechazada", original: sinAnclas, ...r3 })];

  // 8) Por defecto: ya es estricta (el parser la acepta tal cual). Si A12
  //    reescribió, se reporta como `normalizada` (regla A12) vía `conA12`.
  return [conAnclas(conA12({ clase: "estricta", oracion: asegurarPunto(sinPunto) }))];
}

/** A12: reescribe la disyunción de estados `… 'a' u 'b'` → `… 'a' o 'b'`.
 *  Solo en contexto de lista de estados (tras `puede estar`). */
function aplicarA12(sinPunto: string): { texto: string; aplico: boolean } {
  if (!/\bpuede\s+estar\b/iu.test(sinPunto) || !/\s+u\s+['`]/u.test(sinPunto)) {
    return { texto: sinPunto, aplico: false };
  }
  const texto = sinPunto.replace(/\s+u\s+(['`])/gu, " o $1");
  return { texto, aplico: texto !== sinPunto };
}

// ── Refinamiento (clase estructura) ──────────────────────────────────────

function clasificarEstructura(sinPunto: string): LineaNormalizada | null {
  // A5: continuacion aditiva.
  const aditiva = /\bse\s+(?:descompone|despliega)\s+tambi[eé]n\s+en\b/iu.test(sinPunto)
    || /\bconsta\s+tambi[eé]n\s+de\b/iu.test(sinPunto);
  // A10: orden secuencial.
  const secuencial = /\ben\s+esa\s+secuencia\b/iu.test(sinPunto);

  const esRefinamiento = /\bse\s+(?:descompone|despliega)(?:\s+tambi[eé]n)?\s+en\b/iu.test(sinPunto)
    || aditiva; // `consta también de` cuenta como continuacion estructural

  if (!esRefinamiento) return null;

  return {
    clase: "estructura",
    oracion: asegurarPunto(sinPunto),
    ...(secuencial ? { secuencial: true } : {}),
    ...(aditiva ? { aditiva: true } : {}),
  };
}

// ── Rechazos tempranos (R1/R2/R6) ────────────────────────────────────────

function detectarRechazoTemprano(sinPunto: string): { categoria: CategoriaRechazo; diagnostico: string } | null {
  // R6: cola informal de lista (debe ir antes de R1 para no confundir).
  if (R6_COLA_INFORMAL_RE.test(sinPunto)) {
    return {
      categoria: "R6",
      diagnostico:
        "Elemento de lista no nominal (`y los demás...`): nómbralo explícitamente o decláralo fuera del modelo.",
    };
  }
  // R2: disyuncion de clausulas alternativas.
  if (
    R2_PUEDE_INICIAR_RE.test(sinPunto) ||
    R2_O_INICIA_RE.test(sinPunto) ||
    R2_INICIA_DISYUNCION_RE.test(sinPunto)
  ) {
    return {
      categoria: "R2",
      diagnostico:
        "Dos hechos alternativos en una oración: sepáralos en dos oraciones o modela la decisión (abanico XOR).",
    };
  }
  // R1: clausula condicional.
  if (R1_CUANDO_RE.test(sinPunto) || R1_SEGUN_RE.test(sinPunto) || R1_CON_GUARD_RE.test(sinPunto)) {
    return {
      categoria: "R1",
      diagnostico:
        "Condición no modelable como cláusula (`cuando`/`según`/guard compuesto): modélala como estado-guard, evento, o declárala supuesto.",
    };
  }
  return null;
}

// ── FAMILIA V — verbos/patrones extendidos (decisiones del operador 2026-06-04) ──
//
// Cada mapeo convierte una oración que ANTES rechazaba el normalizador en una
// línea `normalizada` (1:1) o `compuesta` (1:N emisiones, opcionalmente con
// abanico). Las que conservan superficie de parser emiten `{via:"oracion"}`; las
// que el parser reverse no sabe re-leer (tagged, modificador con gatillo,
// anotaciones) emiten `{via:"directiva"}`. Ver `docs/proto-modelo/
// gramatica-subdialecto-v0.md` §«Familia V».

/** ¿La entidad es un OBJETO según el contexto (default objeto si no se vio)? */
function esObjeto(nombre: string, contexto: ContextoProto): boolean {
  return (contexto.tipoPorEntidad.get(claveNombre(nombre)) ?? "objeto") === "objeto";
}

/** ¿La entidad es un PROCESO según el contexto? */
function esProceso(nombre: string, contexto: ContextoProto): boolean {
  return contexto.tipoPorEntidad.get(claveNombre(nombre)) === "proceso";
}

/** Estados declarados (display) de una entidad, en orden de descubrimiento. */
function estadosDeclaradosDe(nombre: string, contexto: ContextoProto): string[] {
  const set = contexto.estadosPorEntidad.get(claveNombre(nombre));
  return set ? [...set] : [];
}

/** Construye una línea `compuesta` con trazabilidad. */
function compuesta(
  original: string,
  regla: ReglaT2,
  emisiones: Emision[],
  agrupar?: { operador: "O" | "XOR" },
): LineaNormalizada {
  return { clase: "compuesta", emisiones, original: asegurarPunto(original), regla, ...(agrupar ? { agrupar } : {}) };
}

const dir = (directiva: Directiva): Emision => ({ via: "directiva", directiva });
const ora = (oracion: string): Emision => ({ via: "oracion", oracion: asegurarPunto(oracion) });

/** Despacha una oración a su mapeo de familia V, o null si ninguno aplica. */
function mapearFamiliaV(sinPunto: string, contexto: ContextoProto): LineaNormalizada | null {
  return (
    mapearGuardCompuesto(sinPunto, contexto) ?? // V13 (antes que R1/R2)
    mapearTsODisyuncion(sinPunto, contexto) ?? // V14
    mapearInicioDisyuncion(sinPunto, contexto) ?? // V15
    mapearColaCondicional(sinPunto, contexto) ?? // V12 (antes que R1)
    mapearPuedeIniciar(sinPunto, contexto) ?? // V3
    mapearHabilita(sinPunto, contexto) ?? // V1 / V11
    mapearRestringe(sinPunto, contexto) ?? // V2
    mapearAlimenta(sinPunto) ?? // V4
    mapearDetecta(sinPunto) ?? // V5
    mapearCapacidad(sinPunto) ?? // V6
    mapearPrecedeA(sinPunto, contexto) ?? // V7
    mapearSucedeA(sinPunto) ?? // V8
    mapearCorrespondeA(sinPunto) ?? // V9
    mapearCumple(sinPunto) // V10
  );
}

// ── V1 / V11: `habilita` ────────────────────────────────────────────────────
// `X [en 's'] habilita P` con X objeto, P proceso → instrumento-condición.
// `A habilita B` con AMBOS objetos → enlace estructural tagged «habilita».
// Excluido (en reflexión): proceso→objeto con cola `para …` (Inspección pre-ruta).
const HABILITA_RE = /^(.+?)\s+habilita\s+(.+)$/iu;

function mapearHabilita(sinPunto: string, contexto: ContextoProto): LineaNormalizada | null {
  const m = HABILITA_RE.exec(sinPunto);
  if (!m) return null;
  const sujetoBruto = (m[1] ?? "").trim();
  const objetoBruto = (m[2] ?? "").trim();

  // En reflexión: `Inspección pre-ruta habilita Vehículo … para 'en ruta'` —
  // proceso→objeto con cola `para …`. NO se mapea (sigue R3). El `para …` o un
  // sujeto-proceso/destino-objeto delata este caso.
  const tieneColaPara = /\s+para\s+/iu.test(objetoBruto);

  const { entidad: sujeto, estado } = separarEstadoEnComillas(sujetoBruto);

  // V1: X objeto (con o sin estado) habilita P proceso.
  if (esObjeto(sujeto, contexto) && esProceso(objetoBruto, contexto) && !tieneColaPara) {
    return compuesta(sinPunto, "V1", [
      dir({ tipo: "instrumento-condicion", proceso: objetoBruto, objeto: sujeto, ...(estado ? { estado } : {}) }),
    ]);
  }

  // V11: A objeto habilita B objeto (sin estado-gatillo, sin cola) → tagged.
  if (esObjeto(sujetoBruto, contexto) && esObjeto(objetoBruto, contexto) && !estado && !tieneColaPara) {
    return compuesta(sinPunto, "V11", [
      dir({ tipo: "tagged", origen: sujetoBruto, destino: objetoBruto, etiqueta: "habilita" }),
    ]);
  }

  return null; // proceso→objeto con `para …`, u otra forma: sigue al rechazo.
}

// ── V2: `restringe` (solo binario) ──────────────────────────────────────────
// `X en 'e' restringe P` ≡ instrumento-condición desde X en el estado
// COMPLEMENTARIO, SOLO si X tiene exactamente 2 estados declarados.
const RESTRINGE_RE = /^(.+?)\s+en\s+(?:estado\s+)?['`]([^'`]+)['`]\s+restringe\s+(.+)$/iu;

function mapearRestringe(sinPunto: string, contexto: ContextoProto): LineaNormalizada | null {
  const m = RESTRINGE_RE.exec(sinPunto);
  if (!m) return null;
  const objeto = (m[1] ?? "").trim();
  const estadoRestrictor = (m[2] ?? "").trim();
  const proceso = (m[3] ?? "").trim();
  const estados = estadosDeclaradosDe(objeto, contexto);
  // Binariedad: exactamente 2 estados declarados; si no, sigue rechazado (R3).
  if (estados.length !== 2) return null;
  const restrictorClave = claveEstado(estadoRestrictor);
  const complemento = estados.find((e) => claveEstado(e) !== restrictorClave);
  if (!complemento) return null;
  return compuesta(sinPunto, "V2", [
    dir({ tipo: "instrumento-condicion", proceso, objeto, estado: complemento }),
  ]);
}

// ── V3: `puede iniciar` (forma de un solo destino) ──────────────────────────
// `X [en 's'] puede iniciar P` → misma ruta evento que `inicia`. La disyunción
// `puede iniciar A o B` la maneja V15 (mapearInicioDisyuncion), evaluada antes.
const PUEDE_INICIAR_RE = /^(.+?)\s+puede\s+iniciar\s+(.+)$/iu;

function mapearPuedeIniciar(sinPunto: string, contexto: ContextoProto): LineaNormalizada | null {
  const m = PUEDE_INICIAR_RE.exec(sinPunto);
  if (!m) return null;
  const destino = (m[2] ?? "").trim();
  // Disyunción → V15 (no aquí). Si quedó algo con ` o ` fuera de comillas, ceder.
  if (tieneDisyuncionDeProcesos(destino)) return null;
  const { entidad: iniciador, estado } = separarEstadoEnComillas((m[1] ?? "").trim());
  return compuesta(sinPunto, "V3", [
    dir({ tipo: "evento", iniciador, proceso: destino, ...(estado ? { estado } : {}) }),
  ]);
}

// ── V4: `alimenta` → instrumento (P requiere O) ─────────────────────────────
const ALIMENTA_RE = /^(.+?)\s+alimenta\s+(.+)$/iu;

function mapearAlimenta(sinPunto: string): LineaNormalizada | null {
  const m = ALIMENTA_RE.exec(sinPunto);
  if (!m) return null;
  const objeto = (m[1] ?? "").trim();
  const proceso = (m[2] ?? "").trim();
  return compuesta(sinPunto, "V4", [ora(`${proceso} requiere ${objeto}`)]);
}

// ── V5: `detecta` → resultado (P genera O) ──────────────────────────────────
const DETECTA_RE = /^(.+?)\s+detecta\s+(.+)$/iu;

function mapearDetecta(sinPunto: string): LineaNormalizada | null {
  const m = DETECTA_RE.exec(sinPunto);
  if (!m) return null;
  const proceso = (m[1] ?? "").trim();
  const objeto = (m[2] ?? "").trim();
  return compuesta(sinPunto, "V5", [ora(`${proceso} genera ${objeto}`)]);
}

// ── V6: `compromete`/`libera` → afecta + verbo original en etiqueta ─────────
const CAPACIDAD_RE = /^(.+?)\s+(compromete|libera)\s+(.+)$/iu;

function mapearCapacidad(sinPunto: string): LineaNormalizada | null {
  const m = CAPACIDAD_RE.exec(sinPunto);
  if (!m) return null;
  const proceso = (m[1] ?? "").trim();
  const verbo = (m[2] ?? "").toLocaleLowerCase("es");
  const objeto = (m[3] ?? "").trim();
  return compuesta(sinPunto, "V6", [
    dir({ tipo: "efecto-anotado", proceso, objeto, anotacionEtiqueta: verbo }),
  ]);
}

// ── V7: `precede a` (procesos) → invocación A→B ─────────────────────────────
const PRECEDE_RE = /^(.+?)\s+precede\s+a\s+(.+)$/iu;

function mapearPrecedeA(sinPunto: string, contexto: ContextoProto): LineaNormalizada | null {
  const m = PRECEDE_RE.exec(sinPunto);
  if (!m) return null;
  const origen = (m[1] ?? "").trim();
  const destino = (m[2] ?? "").trim();
  // El operador decidió: ambos procesos → invocación. Si el contexto los conoce
  // como objetos, igual se modela invocación (decisión del operador es el verbo).
  void contexto;
  return compuesta(sinPunto, "V7", [dir({ tipo: "invocacion", origen, destino })]);
}

// ── V8: `A puede suceder a un B [opcional]` → tagged «sucede a» (+0..1) ──────
const SUCEDE_RE = /^(.+?)\s+puede\s+suceder\s+a\s+un[ao]?\s+(.+)$/iu;

function mapearSucedeA(sinPunto: string): LineaNormalizada | null {
  const m = SUCEDE_RE.exec(sinPunto);
  if (!m) return null;
  const origen = (m[1] ?? "").trim();
  let destino = (m[2] ?? "").trim();
  const opcional = /\bopcional\b\.?$/iu.test(destino);
  destino = destino.replace(/\s*\bopcional\b\.?$/iu, "").trim();
  return compuesta(sinPunto, "V8", [
    dir({ tipo: "tagged", origen, destino, etiqueta: "sucede a", ...(opcional ? { multiplicidadDestino: "0..1" } : {}) }),
  ]);
}

// ── V9: `A corresponde a un B` → tagged «corresponde a» ─────────────────────
const CORRESPONDE_RE = /^(.+?)\s+corresponde\s+a\s+un[ao]?\s+(.+)$/iu;

function mapearCorrespondeA(sinPunto: string): LineaNormalizada | null {
  const m = CORRESPONDE_RE.exec(sinPunto);
  if (!m) return null;
  const origen = (m[1] ?? "").trim();
  const destino = (m[2] ?? "").trim();
  return compuesta(sinPunto, "V9", [
    dir({ tipo: "tagged", origen, destino, etiqueta: "corresponde a" }),
  ]);
}

// ── V10: `A cumple B [para …]` → tagged «cumple» + cola anotada ──────────────
const CUMPLE_RE = /^(.+?)\s+cumple\s+(.+)$/iu;

function mapearCumple(sinPunto: string): LineaNormalizada | null {
  const m = CUMPLE_RE.exec(sinPunto);
  if (!m) return null;
  const origen = (m[1] ?? "").trim();
  let destino = (m[2] ?? "").trim();
  let cola: string | undefined;
  const colaM = /^(.+?)\s+(para\s+.+)$/iu.exec(destino);
  if (colaM) {
    destino = (colaM[1] ?? "").trim();
    cola = (colaM[2] ?? "").trim();
  }
  return compuesta(sinPunto, "V10", [
    dir({ tipo: "tagged", origen, destino, etiqueta: "cumple", ...(cola ? { colaAnotada: cola } : {}) }),
  ]);
}

// ── V12: colas condicionales (`cuando`/`según`/`por una`) o R4 ──────────────
// `<hecho principal> cuando/según/por una <cola>` → compila el hecho principal
// (TS/efecto/requiere) y adjunta la cola como ancla pendiente sobre el enlace.
// También R4: `requiere Domicilio dentro del Radio de cobertura` → requiere
// Domicilio + cola anotada.
const COLA_CUANDO_RE = /^(.+?)\s+(cuando\s+.+)$/iu;
const COLA_SEGUN_RE = /^(.+?)\s+(seg[uú]n\s+.+)$/iu;

function mapearColaCondicional(sinPunto: string, contexto: ContextoProto): LineaNormalizada | null {
  // R4: `<proceso> requiere <objeto> dentro del <ámbito>` (estado no declarado
  // del corpus). Compila `requiere <objeto>` + cola `dentro del <ámbito>`.
  const r4 = /^(.+?)\s+requiere\s+(.+?)\s+(dentro\s+del?\s+.+)$/iu.exec(sinPunto);
  if (r4) {
    const proceso = (r4[1] ?? "").trim();
    const objeto = (r4[2] ?? "").trim();
    const cola = (r4[3] ?? "").trim();
    // La directiva `hecho-anotado` emite la oración principal Y adjunta la cola
    // sobre el enlace que crea (no duplicar con un `ora()` aparte).
    return compuesta(sinPunto, "V12", [
      dir({ tipo: "hecho-anotado", oracion: `${proceso} requiere ${objeto}`, colaAnotada: cola }),
    ]);
  }

  // NO capturar oraciones ESTRUCTURALES (`consta de`/`exhibe`/`se descompone`):
  // un `según prestaciones` tras una lista `consta de … y Otros profesionales` es
  // una cola informal de lista (R6, en reflexión del operador), no una cola
  // condicional de un hecho procedural.
  if (/\b(consta\s+(?:tambi[eé]n\s+)?de|exhibe[n]?|se\s+(?:descompone|despliega))\b/iu.test(sinPunto)) return null;

  const m = COLA_CUANDO_RE.exec(sinPunto) ?? COLA_SEGUN_RE.exec(sinPunto);
  if (!m) return null;
  let principal = (m[1] ?? "").trim();
  const cola = (m[2] ?? "").trim();

  // El guard compuesto `con Y 'b'` lo maneja V13; aquí solo `cuando`/`según`.
  // Si el principal trae `, o inicia` lo dejamos a V14.
  if (/,\s*o\s+inicia\b/iu.test(principal)) return null;

  principal = principal.replace(/,\s*$/u, "").trim();
  void contexto;

  // El principal puede ser una TS MULTI-DESTINO (`cambia X a 'a', 'b' o 'c'`),
  // que el parser no acepta en una sola oración: la expandimos a una TS por
  // destino (espejo de A6). Las primeras N-1 emiten como oración; la ÚLTIMA va por
  // `hecho-anotado` (emite la oración Y adjunta la cola sobre su enlace — sin
  // duplicar). Si el principal es 1:1, la única emisión es la `hecho-anotado`.
  const oraciones = expandirTsMultidestino(principal);
  const emisiones: Emision[] = oraciones.slice(0, -1).map((o) => ora(o));
  emisiones.push(dir({ tipo: "hecho-anotado", oracion: asegurarPunto(oraciones[oraciones.length - 1]!), colaAnotada: cola }));
  return compuesta(sinPunto, "V12", emisiones);
}

/** Expande `P cambia X a 'a', 'b' o 'c'` en N oraciones TS (una por destino).
 *  Si no es multi-destino, devuelve la oración tal cual (un único elemento). */
function expandirTsMultidestino(principal: string): string[] {
  const m = /^(.+?)\s+cambia\s+(.+?)\s+a\s+(.+)$/iu.exec(principal);
  if (m && !/\bde\b/iu.test(m[2] ?? "")) {
    const estados = dividirEstados(m[3] ?? "");
    if (estados.length >= 2) {
      const proceso = (m[1] ?? "").trim();
      const objeto = (m[2] ?? "").trim();
      return estados.map((e) => asegurarPunto(`${proceso} cambia ${objeto} a ${e}`));
    }
  }
  return [asegurarPunto(principal)];
}

// ── V13: guard compuesto `X en 'a' con Y 'b' inicia P` ──────────────────────
// → evento desde X en 'a' (ruta W4.3) + instrumento-condición desde Y en 'b'.
const GUARD_COMPUESTO_RE =
  /^(.+?)\s+en\s+(?:estado\s+)?['`]([^'`]+)['`]\s+con\s+(.+?)\s+['`]([^'`]+)['`]\s+inicia\s+(.+)$/iu;

function mapearGuardCompuesto(sinPunto: string, contexto: ContextoProto): LineaNormalizada | null {
  const m = GUARD_COMPUESTO_RE.exec(sinPunto);
  if (!m) return null;
  const iniciador = (m[1] ?? "").trim();
  const estadoIni = (m[2] ?? "").trim();
  const condicionante = (m[3] ?? "").trim();
  const estadoCond = (m[4] ?? "").trim();
  const proceso = (m[5] ?? "").trim();
  void contexto;
  return compuesta(sinPunto, "V13", [
    dir({ tipo: "evento", iniciador, proceso, estado: estadoIni }),
    dir({ tipo: "instrumento-condicion", proceso, objeto: condicionante, estado: estadoCond }),
  ]);
}

// ── V14: `P cambia X a 'e', o inicia Q` → TS + evento + abanico XOR ─────────
const TS_O_INICIA_RE = /^(.+?)\s+cambia\s+(.+?)\s+a\s+['`]([^'`]+)['`]\s*,\s*o\s+inicia\s+(.+)$/iu;

function mapearTsODisyuncion(sinPunto: string, contexto: ContextoProto): LineaNormalizada | null {
  const m = TS_O_INICIA_RE.exec(sinPunto);
  if (!m) return null;
  const proceso = (m[1] ?? "").trim();
  const objeto = (m[2] ?? "").trim();
  const estado = (m[3] ?? "").trim();
  const otroProceso = (m[4] ?? "").trim();
  void contexto;
  // La TS (efecto P→X a 'estado', vía directiva para resolver el objeto por nombre
  // completo) + la invocación-evento P→Q, agrupadas en XOR.
  return compuesta(
    sinPunto,
    "V14",
    [
      dir({ tipo: "transicion", proceso, objeto, estadoSalida: estado }),
      dir({ tipo: "evento", iniciador: proceso, proceso: otroProceso }),
    ],
    { operador: "XOR" },
  );
}

// ── V15: `X en 's' inicia A o B` / `S puede iniciar A o B` → ramas + XOR ────
const INICIA_DISYUNCION_RE = /^(.+?)\s+(?:puede\s+iniciar|inicia)\s+(.+)$/iu;

function mapearInicioDisyuncion(sinPunto: string, contexto: ContextoProto): LineaNormalizada | null {
  const m = INICIA_DISYUNCION_RE.exec(sinPunto);
  if (!m) return null;
  const destinos = (m[2] ?? "").trim();
  if (!tieneDisyuncionDeProcesos(destinos)) return null;
  const ramas = dividirProcesosDisyuncion(destinos);
  if (ramas.length < 2) return null;
  const { entidad: iniciador, estado } = separarEstadoEnComillas((m[1] ?? "").trim());
  void contexto;
  return compuesta(
    sinPunto,
    "V15",
    ramas.map((proc) => dir({ tipo: "evento", iniciador, proceso: proc, ...(estado ? { estado } : {}) })),
    { operador: "XOR" },
  );
}

// ── Helpers de familia V ─────────────────────────────────────────────────────

/** Separa `Nombre en 'estado'` → {entidad, estado}; si no hay estado, {entidad, undefined}. */
function separarEstadoEnComillas(texto: string): { entidad: string; estado?: string } {
  const m = /^(.+?)\s+en\s+(?:estado\s+)?['`]([^'`]+)['`]\s*$/iu.exec(texto.trim());
  if (m) return { entidad: (m[1] ?? "").trim(), estado: (m[2] ?? "").trim() };
  return { entidad: texto.trim() };
}

/** ¿La frase contiene una disyunción ` o ` de procesos FUERA de comillas (no una
 *  lista de estados `'a' o 'b'`)? */
function tieneDisyuncionDeProcesos(texto: string): boolean {
  return /\bo\b/iu.test(texto.replace(/['`][^'`]*['`]/gu, ""));
}

/** Divide `A o B [o C]` en procesos (sin tocar listas de estados entre comillas). */
function dividirProcesosDisyuncion(texto: string): string[] {
  return texto
    .split(/\s+o\s+/iu)
    .map((s) => s.trim().replace(/\.\s*$/u, "").trim())
    .filter(Boolean);
}

// ── Reescrituras que expanden (A1, A6) ───────────────────────────────────

function expandir(sinPunto: string, contexto: ContextoProto): LineaNormalizada[] | null {
  // A1: `A, B y C son <esencia> y <afiliacion>` -> una descripcion por entidad.
  const a1 = /^(.+?)\s+son\s+(f[ií]sic[oa]s?|informacionales?)\s+y\s+(sist[eé]mic[oa]s?|ambientales?)$/iu.exec(sinPunto);
  if (a1) {
    const lista = dividirListaSimple(a1[1] ?? "");
    if (lista.length >= 2) {
      // Rechazo si algun item es cola informal.
      if (lista.some((n) => /\b(?:los\s+dem[aá]s|otros|otras)\b/iu.test(n))) {
        return [{
          clase: "rechazada",
          original: asegurarPunto(sinPunto),
          categoria: "R6",
          diagnostico: "Elemento de lista no nominal en una lista de esencia: nómbralo explícitamente.",
        }];
      }
      const esencia = normalizarEsencia(a1[2] ?? "");
      const afiliacion = normalizarAfiliacion(a1[3] ?? "");
      return lista.map((nombre): LineaNormalizada => {
        const tipo = tipoEntidadDe(nombre, contexto);
        const { e, a } = concordar(tipo, esencia, afiliacion);
        return {
          clase: "normalizada",
          oracion: `${nombre} es un ${tipo} ${e} y ${a}.`,
          original: asegurarPunto(sinPunto),
          regla: "A1",
        };
      });
    }
  }

  // A6: `P cambia X a 'a', 'b' o 'c'` (multi-destino, sin estado de origen) ->
  // una TS por destino. Solo cuando hay >=2 estados destino.
  const a6 = /^(.+?)\s+cambia\s+(.+?)\s+a\s+(.+)$/iu.exec(sinPunto);
  if (a6 && !/\bde\b/iu.test(`${a6[2] ?? ""}`)) {
    const estados = dividirEstados(a6[3] ?? "");
    if (estados.length >= 2) {
      const proceso = (a6[1] ?? "").trim();
      const objeto = (a6[2] ?? "").trim();
      return estados.map((estado): LineaNormalizada => ({
        clase: "normalizada",
        oracion: `${proceso} cambia ${objeto} a ${estado}.`,
        original: asegurarPunto(sinPunto),
        regla: "A6",
      }));
    }
  }

  // A6b: `P cambia X de 'o' a 'a', 'b' o 'c'` (multi-destino con origen).
  const a6b = /^(.+?)\s+cambia\s+(.+?)\s+de\s+(.+?)\s+a\s+(.+)$/iu.exec(sinPunto);
  if (a6b) {
    const estados = dividirEstados(a6b[4] ?? "");
    if (estados.length >= 2) {
      const proceso = (a6b[1] ?? "").trim();
      const objeto = (a6b[2] ?? "").trim();
      const origen = (a6b[3] ?? "").trim();
      return estados.map((estado): LineaNormalizada => ({
        clase: "normalizada",
        oracion: `${proceso} cambia ${objeto} de ${origen} a ${estado}.`,
        original: asegurarPunto(sinPunto),
        regla: "A6",
      }));
    }
  }

  return null;
}

// ── Reescrituras 1:1 (A2, A3, A4, A8, A9, AESS) ──────────────────────────

function reescribir1a1(sinPunto: string, contexto: ContextoProto): LineaNormalizada | null {
  const original = asegurarPunto(sinPunto);

  // AESS: esencia/afiliacion sin `un objeto/proceso`. El parser la mapea a
  // `metadata` (falso positivo) si no inyectamos el tipo de entidad.
  const aess = /^(.+?)\s+es\s+(f[ií]sic[oa]|informacional)\s+y\s+(sist[eé]mic[oa]|ambiental)$/iu.exec(sinPunto);
  if (aess) {
    const nombre = (aess[1] ?? "").trim();
    const esencia = normalizarEsencia(aess[2] ?? "");
    const afiliacion = normalizarAfiliacion(aess[3] ?? "");
    const tipo = tipoEntidadDe(nombre, contexto);
    const { e, a } = concordar(tipo, esencia, afiliacion);
    return { clase: "normalizada", oracion: `${nombre} es un ${tipo} ${e} y ${a}.`, original, regla: "AESS" };
  }

  // A4-comillas: `... en estado 'e'` -> `... en \`e\``. El parser deja la palabra
  // `estado` dentro del nombre del estado cuando viene con comillas simples
  // (`estado 'abierto'`); en backticks la captura limpia. Reescritura segura que
  // conserva la semantica y elimina la degradacion silenciosa. SOLO si la
  // oracion tiene un verbo canonico o es un evento (`inicia`): si el verbo es no
  // canonico (`restringe`, `habilita`) o disyuntivo (`puede iniciar`), la linea
  // es R2/R3 y debe rechazarse, no normalizarse.
  if (/\ben\s+estado\s+'[^']+'/iu.test(sinPunto)) {
    const tieneVerboValido = verboPrincipal(sinPunto) !== null || /\binicia\b/iu.test(sinPunto);
    const esDisyuncion = /\bpuede\s+iniciar\b/iu.test(sinPunto);
    if (tieneVerboValido && !esDisyuncion) {
      const reescrito = sinPunto.replace(/\ben\s+estado\s+'([^']+)'/giu, (_m, e: string) => `en \`${e}\``);
      if (reescrito !== sinPunto) {
        return { clase: "normalizada", oracion: asegurarPunto(reescrito), original, regla: "A4" };
      }
    }
  }

  // A2: estados con prefijo `en uno de los estados` -> STRIP del prefijo (el
  // parser mangla el prefijo dentro del primer estado).
  const a2 = /^(.+?)\s+puede\s+estar\s+en\s+uno\s+de\s+los\s+estados\s+(.+)$/iu.exec(sinPunto);
  if (a2) {
    const entidad = (a2[1] ?? "").trim();
    const estados = (a2[2] ?? "").trim();
    return { clase: "normalizada", oracion: `${entidad} puede estar ${estados}.`, original, regla: "A2" };
  }

  // A3: `P afecta X (de 'a' a 'b')` -> `P cambia X de 'a' a 'b'`.
  const a3 = /^(.+?)\s+afecta\s+(.+?)\s*\(\s*de\s+(.+?)\s+a\s+(.+?)\s*\)$/iu.exec(sinPunto);
  if (a3) {
    const proceso = (a3[1] ?? "").trim();
    const objeto = (a3[2] ?? "").trim();
    const o1 = normalizarEstadoLiteral(a3[3] ?? "");
    const o2 = normalizarEstadoLiteral(a3[4] ?? "");
    return { clase: "normalizada", oracion: `${proceso} cambia ${objeto} de ${o1} a ${o2}.`, original, regla: "A3" };
  }

  // A9: `X exhibe Y como su operación[ de programa]` -> `X exhibe Y` + etiqueta.
  const a9 = /^(.+?)\s+exhibe\s+(.+?)\s+como\s+su\s+operaci[oó]n(?:\s+de\s+programa)?$/iu.exec(sinPunto);
  if (a9) {
    const sujeto = (a9[1] ?? "").trim();
    const objeto = (a9[2] ?? "").trim();
    return { clase: "normalizada", oracion: `${sujeto} exhibe ${objeto}.`, original, regla: "A9" };
  }

  // A8: conectores no canonicos `e` / `así como` -> `y`. Solo si el verbo es
  // canonico (para no tocar prosa que se colo). Aplica tras detectar verbo.
  if (CONECTOR_E_RE.test(sinPunto) || CONECTOR_ASI_COMO_RE.test(sinPunto)) {
    const verbo = verboPrincipal(sinPunto);
    if (verbo && VERBOS_CANONICOS.has(verbo)) {
      const reescrito = sinPunto
        .replace(CONECTOR_ASI_COMO_RE, " y ")
        .replace(CONECTOR_E_RE, " y ");
      if (reescrito !== sinPunto) {
        return { clase: "normalizada", oracion: asegurarPunto(reescrito), original, regla: "A8" };
      }
    }
  }

  // A4 / R4: estado pegado sin comillas en un habilitador `requiere X <estado>`.
  // Solo `requiere`/`maneja` con un estado pegado (no entre comillas/backticks).
  const a4 = /^(.+?)\s+(requiere|maneja)\s+(.+)$/iu.exec(sinPunto);
  if (a4 && !/['`]/u.test(a4[3] ?? "") && !/\ben\s+estado\b/iu.test(a4[3] ?? "")) {
    const proceso = (a4[1] ?? "").trim();
    const verbo = (a4[2] ?? "").toLocaleLowerCase("es");
    const complemento = (a4[3] ?? "").trim();
    const resuelto = resolverEstadoPegado(complemento, contexto);
    if (resuelto) {
      if (resuelto.tipo === "no-declarado") {
        return {
          clase: "rechazada",
          original,
          categoria: "R4",
          diagnostico: `El estado '${resuelto.estado}' no está declarado para ${resuelto.entidad} en este proto.`,
        };
      }
      // resuelto.tipo === "declarado"
      const verboCanon = verbo === "maneja" ? "maneja" : "requiere";
      return {
        clase: "normalizada",
        oracion: `${proceso} ${verboCanon} ${resuelto.entidad} en \`${resuelto.estado}\`.`,
        original,
        regla: "A4",
      };
    }
  }

  return null;
}

/**
 * Intenta partir `Entidad estado-pegado` donde la entidad esta declarada en el
 * contexto y el resto es un estado declarado para ella. Devuelve:
 * - `declarado`: la entidad y el estado existen y el estado esta declarado.
 * - `no-declarado`: la entidad existe pero el estado NO esta declarado (R4).
 * - `null`: no parece un estado pegado (es un instrumento/agente simple).
 */
function resolverEstadoPegado(
  complemento: string,
  contexto: ContextoProto,
): { tipo: "declarado" | "no-declarado"; entidad: string; estado: string } | null {
  // Si el complemento completo es una entidad conocida, es un instrumento simple
  // (`requiere Plan terapéutico y de cuidados`): no hay estado pegado.
  if (contexto.entidades.has(claveNombre(complemento))) return null;

  // Una lista (`A y B`, `A, B`) nunca es un estado pegado: es un agente/
  // instrumento múltiple, no un calificador de estado. A4 no aplica.
  if (/(?:,|\s+y\s+)/iu.test(complemento)) return null;

  const palabras = complemento.split(/\s+/u);
  if (palabras.length < 2) return null;

  // Buscar el corte que deja un prefijo = entidad CON estados declarados, y un
  // sufijo = estado declarado para esa entidad (A4). El corte mas largo gana.
  for (let corte = palabras.length - 1; corte >= 1; corte--) {
    const entidadCruda = palabras.slice(0, corte).join(" ");
    const estado = palabras.slice(corte).join(" ");
    const claveEnt = claveNombre(entidadCruda);
    const estados = contexto.estadosPorEntidad.get(claveEnt);
    if (estados?.has(claveEstado(estado))) {
      return { tipo: "declarado", entidad: contexto.entidades.get(claveEnt) ?? entidadCruda, estado };
    }
  }

  // Ningun corte casa con un estado declarado. Si ALGUN prefijo es una entidad
  // PORTADORA DE ESTADOS (pero sin este estado concreto), es un intento de
  // estado pegado no declarado -> R4 (no se adivina). Exigir que la entidad
  // tenga estados evita confundir un instrumento simple desconocido con R4.
  for (let corte = palabras.length - 1; corte >= 1; corte--) {
    const entidadCruda = palabras.slice(0, corte).join(" ");
    const claveEnt = claveNombre(entidadCruda);
    if (contexto.estadosPorEntidad.has(claveEnt)) {
      const estado = palabras.slice(corte).join(" ");
      return { tipo: "no-declarado", entidad: contexto.entidades.get(claveEnt) ?? entidadCruda, estado };
    }
  }

  // El prefijo no es entidad portadora de estados: probablemente es un
  // instrumento simple cuyo nombre el contexto no vio (proto incompleto). No A4.
  return null;
}

// ── R3: verbo fuera del enum ─────────────────────────────────────────────

function detectarVerboNoCanonico(sinPunto: string): { categoria: CategoriaRechazo; diagnostico: string } | null {
  const conEspacios = ` ${sinPunto} `;

  // Formas validas que NO usan un verbo del enum procedural: si encaja alguna,
  // no es R3 (la oracion es estricta por otra via).
  if (/\bpuede\s+(?:estar|ser)\b/iu.test(sinPunto)) return null; // estados / especializacion
  if (/^.+?\s+es\s+(?:un|una)\s+/iu.test(sinPunto)) return null; // descripcion / generalizacion
  if (/^.+?\s+es\s+(?:f[ií]sic[oa]|informacional|sist[eé]mic[oa]|ambiental|inicial|final)\b/iu.test(sinPunto)) return null; // copular / designacion
  if (/^.+?\s+es\s+una\s+instancia\s+de\b/iu.test(sinPunto)) return null; // clasificacion
  if (/\binicia\b/iu.test(sinPunto)) return null; // evento

  // Verbo canonico en cualquier posicion -> forma valida.
  if (VERBO_CANONICO_RE.test(conEspacios)) return null;

  // R7: relacional con preposicion (no hay verbo OPM directo).
  const r7 = VERBOS_R7_RE.exec(conEspacios);
  if (r7) {
    return {
      categoria: "R7",
      diagnostico:
        `Relación no primitiva ('${(r7[1] ?? "").trim()}'): usa un enlace etiquetado canónico o una exhibición.`,
    };
  }

  // R3: verbo transitivo fuera del enum cerrado.
  const r3 = VERBOS_R3_RE.exec(conEspacios);
  if (r3) {
    return {
      categoria: "R3",
      diagnostico:
        `El verbo '${(r3[1] ?? "").trim()}' no pertenece al catálogo cerrado: elige el verbo OPM correspondiente o declara el hecho como pendiente.`,
    };
  }

  // No hay verbo reconocible (ni canonico ni del corpus de offenders). R3 generico.
  return {
    categoria: "R3",
    diagnostico: "No se reconoce un verbo OPM canónico en la oración: reformúlala con una plantilla del catálogo.",
  };
}

// ── Anclas ───────────────────────────────────────────────────────────────

const ANCLA_CORCHETE_RE = /\[([^\]]+)\]/gu;
const ANCLA_PAREN_NORMA_RE = /\(((?:DS|NT|DTO|Ley|Decreto)[^)]*)\)/giu;

function extraerAnclas(texto: string): Ancla[] {
  const anclas: Ancla[] = [];
  for (const m of texto.matchAll(ANCLA_CORCHETE_RE)) {
    const bruto = m[0];
    const id = (m[1] ?? "").trim();
    anclas.push({ tipo: tipoDeAnclaCorchete(id), id: idDeAncla(id), bruto });
  }
  for (const m of texto.matchAll(ANCLA_PAREN_NORMA_RE)) {
    anclas.push({ tipo: "norma", id: (m[1] ?? "").trim(), bruto: m[0] });
  }
  return anclas;
}

function tipoDeAnclaCorchete(id: string): Ancla["tipo"] {
  if (/^RATIFICAR/iu.test(id)) return "pendiente";
  if (/^Q\d/iu.test(id)) return "pregunta";
  if (/^C\d/iu.test(id)) return "consenso";
  return "otro";
}

function idDeAncla(id: string): string {
  // `Q14 — pata logística` -> `Q14`; `C4/D` -> `C4/D`; `RATIFICAR: x` -> `RATIFICAR`.
  const m = /^([A-Z]+\d+[A-Za-z0-9/]*|RATIFICAR)/iu.exec(id.trim());
  return m ? (m[1] ?? id).trim() : id.trim();
}

function quitarAnclas(texto: string): string {
  return texto
    .replace(ANCLA_PAREN_NORMA_RE, "")
    .replace(ANCLA_CORCHETE_RE, "")
    .replace(/\s{2,}/gu, " ")
    .replace(/\s+\./gu, ".")
    .trim();
}

// ── Estados ──────────────────────────────────────────────────────────────

/**
 * Cosecha estados declarados IMPLICITAMENTE por transiciones/resultados/eventos,
 * para el contexto (A4/R4). El portador del estado es siempre el OBJETO:
 * - `P cambia X de 'a' a 'b'`   -> X: {a, b}
 * - `P cambia X a 'b'`          -> X: {b}
 * - `P genera X en estado 'e'`  -> X: {e}
 * - `X en estado 'e' inicia P`  -> X: {e}
 * Devuelve 0..1 declaraciones (entidad + estados). Tolerante a comillas simples.
 */
function cosecharEstadosImplicitos(sinPunto: string): Array<{ entidad: string; estados: string[] }> {
  const out: Array<{ entidad: string; estados: string[] }> = [];

  // `X en estado 'e' inicia P` -> el iniciador X porta 'e'.
  const ev = /^(.+?)\s+en\s+estado\s+'([^']+)'\s+inicia\b/iu.exec(sinPunto);
  if (ev) out.push({ entidad: (ev[1] ?? "").trim(), estados: [ev[2] ?? ""] });

  // `... genera|cambia X en estado 'e'` (resultado con estado).
  const gen = /\b(?:genera|generan|cambia)\s+(.+?)\s+en\s+estado\s+'([^']+)'/iu.exec(sinPunto);
  if (gen) out.push({ entidad: (gen[1] ?? "").trim(), estados: [gen[2] ?? ""] });

  // `... cambia X de 'a' a 'b'` (TS con origen y destino).
  const ts = /\bcambia\s+(.+?)\s+de\s+'([^']+)'\s+a\s+'([^']+)'/iu.exec(sinPunto);
  if (ts) out.push({ entidad: (ts[1] ?? "").trim(), estados: [ts[2] ?? "", ts[3] ?? ""] });
  else {
    // `... cambia X a 'b'` (TS sin origen). Evitar doble-conteo si ya hubo `de..a`.
    const tsA = /\bcambia\s+(.+?)\s+a\s+'([^']+)'/iu.exec(sinPunto);
    if (tsA) out.push({ entidad: (tsA[1] ?? "").trim(), estados: [tsA[2] ?? ""] });
  }

  return out;
}

/** Captura `X puede estar [en uno de los estados] <lista>` (para contexto). */
function capturarEstados(sinPunto: string): { entidad: string; estados: string[] } | null {
  const m = /^(.+?)\s+puede\s+estar\s+(?:en\s+uno\s+de\s+los\s+estados\s+)?(.+)$/iu.exec(sinPunto);
  if (!m) return null;
  return { entidad: (m[1] ?? "").trim(), estados: dividirEstados(m[2] ?? "") };
}

/** Divide una lista de estados `'a', 'b' o 'c'` en tokens normalizados con sus
 *  comillas (`'a'`), descartando designaciones `(inicial)` adosadas. Parte por
 *  coma, ` o ` y ` u ` (la disyunción española ante sonido /o/, p.ej. `'disponible'
 *  u 'ocupado'`): sin esto, el contexto contaba dos estados como uno solo, lo que
 *  rompía la binariedad de V2 (`restringe`). */
function dividirEstados(texto: string): string[] {
  // Normaliza la disyunción ` u '` → ` o '` (solo ante comilla, igual que A12)
  // antes de partir, para no tocar un ` u ` interno de un nombre sin comillas.
  const normalizado = texto.replace(/\s+u\s+(['`])/giu, " o $1");
  return normalizado
    .split(/\s*,\s*|\s+o\s+/iu)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/\s*\([^)]*\)\s*$/u, "").trim()) // quitar (inicial)/(final)
    .filter(Boolean);
}

/** Normaliza un literal de estado a la forma con comillas simples. */
function normalizarEstadoLiteral(texto: string): string {
  const limpio = texto.trim().replace(/^['"`]|['"`]$/gu, "");
  return `'${limpio}'`;
}

// ── Inferencia de tipo y concordancia ────────────────────────────────────

function tipoEntidadDe(nombre: string, contexto: ContextoProto): "objeto" | "proceso" {
  return contexto.tipoPorEntidad.get(claveNombre(nombre)) ?? "objeto";
}

function normalizarEsencia(raw: string): "fisica" | "informacional" {
  const base = raw.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es");
  return base.startsWith("fisic") ? "fisica" : "informacional";
}

function normalizarAfiliacion(raw: string): "sistemica" | "ambiental" {
  const base = raw.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es");
  return base.startsWith("sistemic") ? "sistemica" : "ambiental";
}

/** Concordancia de genero del adjetivo segun el tipo (objeto=masc, proceso=masc;
 *  ambos masculinos en `un objeto/proceso ...`). Emite la forma masculina que el
 *  parser acepta: `físico`, `sistémico`, `informacional`, `ambiental`. */
function concordar(
  _tipo: "objeto" | "proceso",
  esencia: "fisica" | "informacional",
  afiliacion: "sistemica" | "ambiental",
): { e: string; a: string } {
  const e = esencia === "fisica" ? "físico" : "informacional";
  const a = afiliacion === "sistemica" ? "sistémico" : "ambiental";
  return { e, a };
}

// ── Utilidades de texto ──────────────────────────────────────────────────

/** Limpia numeracion de lista / bullets de markdown y espacios. */
function limpiarCruda(cruda: string): string {
  return cruda.replace(/^\s*(?:\d+(?:\.\d+)*[.)]|[-*•])\s+/u, "").trim();
}

function asegurarPunto(texto: string): string {
  const t = texto.trim();
  return /\.\s*$/.test(t) ? t : `${t}.`;
}

function verboPrincipal(sinPunto: string): string | null {
  // Localiza el primer verbo CANONICO en la oracion (en cualquier posicion: el
  // sujeto puede ser una frase nominal larga). Devuelve null si no hay ninguno.
  const m = VERBO_CANONICO_RE.exec(` ${sinPunto} `);
  return m ? (m[1] ?? "").toLocaleLowerCase("es") : null;
}

/** Divide una lista de nombres por `,` y ` y ` (sin tocar comillas internas). */
function dividirListaSimple(texto: string): string[] {
  return texto
    .split(/\s*,\s*|\s+y\s+/iu)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Segmenta una lista CONSERVANDO el ` y ` interno de los nombres compuestos
 * (`Vigilancia y monitorización clínica`). La convención del proto: los ítems
 * van separados por COMA; el último ítem se une con `, y ` o ` y `. Esta función
 * parte por comas y, en el ÚLTIMO segmento, separa por el ` y ` final SOLO si lo
 * que queda a cada lado no forma parte de un nombre con ` y ` interno conocido.
 * Como heurística sin registro, parte el último segmento por su PRIMER ` y `
 * únicamente cuando hubo comas (lista multi-ítem con cierre `, y X`); si no hubo
 * comas (`A y B`) trata todo como un solo nombre candidato y también ofrece la
 * partición. Devuelve los segmentos candidatos (nombres compuestos potenciales),
 * NO la fragmentación máxima. Sirve para REGISTRAR nombres con ` y ` interno.
 */
function segmentosLista(texto: string): string[] {
  const partes = texto.split(/\s*,\s*/u).map((s) => s.trim()).filter(Boolean);
  if (partes.length === 0) return [];
  // El último segmento puede traer un ` y ` de cierre (`X y Y` → dos ítems) o ser
  // un nombre compuesto (`Coordinación y criterios de escalamiento`). Registramos
  // AMBAS lecturas: el segmento completo y, si hay ` y `, sus dos mitades por el
  // último ` y `. El emisor (con registro) elige el nombre conocido más largo.
  const ultimo = partes[partes.length - 1]!;
  const out = [...partes];
  const mY = /^(.+)\s+y\s+(.+)$/iu.exec(ultimo);
  if (mY) {
    out.push((mY[1] ?? "").trim(), (mY[2] ?? "").trim());
  }
  return out.filter(Boolean);
}

/** Clave de comparacion de estados: como `claveNombre` pero ademas descarta
 *  comillas/backticks y designaciones `(inicial)` para que `'hospitalizado en
 *  domicilio'` (declarado) y `hospitalizado en domicilio` (pegado) colisionen. */
function claveEstado(raw: string): string {
  return claveNombre(raw.replace(/['"`]/gu, "").replace(/\([^)]*\)/gu, ""));
}

/** Clave de comparacion de nombres (sin acentos, minusculas, sin markdown). */
function claveNombre(raw: string): string {
  return raw
    .replace(/[*`_]/gu, "")
    .replace(/^\s*(?:\d+(?:\.\.(?:\d+|N|\*))?|\*|\+)\s+/iu, "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("es")
    .replace(/\s+/gu, " ")
    .trim();
}
