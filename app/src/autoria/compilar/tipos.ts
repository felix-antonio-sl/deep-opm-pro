// Tipos del contrato del normalizador del sub-dialecto del proto-modelo (W1.2).
//
// SSOT de la gramatica: `docs/proto-modelo/gramatica-subdialecto-v0.md`.
// El arbitro operativo de "estricto" es lo que `src/opl/parser/parsear.ts`
// acepta sin diagnostico `unsupported-kernel` (ley L1). Este modulo es PURO:
// sin IO, sin JointJS, sin Zustand. Solo transforma texto en una clasificacion.
//
// La pieza central es `LineaNormalizada`: una union discriminada por `clase`
// que cubre exactamente las seis clases de la gramatica (estricta, normalizada,
// estructura, comentario, ancla -conservada dentro de comentario/linea-,
// rechazada). El consumidor (etapa 2/3 del compilador) decide a donde enrutar
// cada linea segun su `clase`.

/** Categorias de rechazo T3 (R1-R7) de la gramatica del sub-dialecto. */
export type CategoriaRechazo = "R1" | "R2" | "R3" | "R4" | "R5" | "R6" | "R7";

/** Reglas T2 de reescritura determinista (A1-A11), mas las variantes que el
 *  parser real obligo a introducir (esencia sin "un objeto", estados con
 *  prefijo "en uno de los estados"). Cada `normalizada` registra cual aplico.
 *
 *  La familia V (V1-V15) son los VERBOS/PATRONES EXTENDIDOS decididos por el
 *  operador (sesión W4.3-rechazos, 2026-06-04): mapeos de oraciones que el
 *  normalizador antes RECHAZABA (R1/R2/R3/R4/R6/R7) hacia primitivas OPM
 *  canónicas. Cada regla V se documenta en
 *  `docs/proto-modelo/gramatica-subdialecto-v0.md` §«Familia V». */
export type ReglaT2 =
  | "A1" // distribuir esencia/afiliacion sobre lista de entidades
  | "A2" // estados: normalizar "en uno de los estados" (la realidad: STRIP)
  | "A3" // "afecta X (de a a b)" -> "cambia X de a a b"
  | "A4" // estado pegado sin comillas -> "en `estado`" (si declarado)
  | "A5" // "consta tambien de" / "se descompone tambien en" -> estructura aditiva
  | "A6" // "cambia X a a, b o c" -> una TS por destino
  | "A7" // "cambia X a b" sin origen -> aceptado tal cual (el parser lo soporta)
  | "A8" // conector "asi como" / "e" -> "y"
  | "A9" // "exhibe Y como su operacion[ de programa]" -> "exhibe Y" + etiqueta
  | "A10" // "se descompone en ... en esa secuencia" -> estructura secuencial
  | "A11" // concordancia de genero del verbo copular
  | "A12" // disyuncion `u` (ante sonido /o/) -> `o` en listas de estados
  | "AESS" // esencia/afiliacion sin "un objeto/proceso" -> inyectar tipo entidad
  // ── Familia V — verbos/patrones extendidos (decisiones del operador) ──
  | "V1" // "X [en 's'] habilita P" (X obj, P proc) -> instrumento-condicion
  | "V2" // "X en 'e' restringe P" -> instrumento-condicion sobre estado complementario (binario)
  | "V3" // "X [en 's'] puede iniciar P" -> evento (misma ruta que `inicia`)
  | "V4" // "O alimenta P" -> "P requiere O" (instrumento)
  | "V5" // "P detecta O" -> "P genera O" (resultado)
  | "V6" // "P compromete/libera O" -> "P afecta O" + verbo original en `etiqueta`
  | "V7" // "A precede a B" (procesos) -> "A invoca B"
  | "V8" // "A puede suceder a un B [opcional]" -> tagged «sucede a» (+ 0..1 si opcional)
  | "V9" // "A corresponde a un B" -> tagged «corresponde a»
  | "V10" // "A cumple B [para …]" -> tagged «cumple» + cola anotada
  | "V11" // "A habilita B" (ambos objetos) -> tagged «habilita»
  | "V12" // cola condicional (`cuando`/`según`/`por una`) o R4 -> hecho + cola anotada
  | "V13" // guard compuesto (`X en 'a' con Y 'b' inicia P`) -> evento + instrumento-condicion
  | "V14" // "P cambia X a 'e', o inicia Q" -> TS + evento + abanico XOR
  | "V15"; // "X en 's' inicia A o B" / "S puede iniciar A o B" -> ramas + abanico XOR

/** Referencia normativa atómica extraída de una forma inline (`(DS art. N)`,
 *  `(NT 2024 §X)`, `(Ley N art. M)`). Espejo de `ReferenciaNorma` del kernel:
 *  `articulos` es VERBATIM (no se expanden rangos — diseño §10.5). */
export interface ReferenciaNormaExtraida {
  norma: string;
  articulos?: string[];
  seccion?: string;
}

/**
 * Ancla extraída inline de una línea del proto (W5.2). Unión discriminada por
 * `clase`, espejo del diseño adjudicado `diseno-ancla-normativa.md`:
 *
 *  - `norma`:        cita normativa explícita (DS/NT/Ley/Decreto). Compila a
 *                    `AnclaNormativa` con `estado: "vigente"`. `referencias` es la
 *                    lista de normas; `claveExplicita` el `#slug` si el autor lo puso.
 *  - `ratificacion`: marca `[RATIFICAR[ #clave][: texto]]`. Compila a
 *                    `AnclaNormativa` con `estado: "pendiente-ratificacion"`.
 *  - `candidata`:    etiqueta `[C1]`/`[Q14]`/`[B3]`-style. **JAMÁS compila** por
 *                    defecto (adjudicación §10.3): se conserva como anotación.
 *
 * `bruto` conserva el marcador completo tal cual aparece (trazabilidad).
 */
export type Ancla =
  | {
      clase: "norma";
      referencias: ReferenciaNormaExtraida[];
      /** `#slug` explícito junto a la cita, si el autor lo acuñó. */
      claveExplicita?: string;
      /** Glosa libre del autor adosada a la cita (rara; normalmente vacía). */
      nota?: string;
      bruto: string;
    }
  | {
      clase: "ratificacion";
      /** Texto libre tras los dos puntos (`[RATIFICAR: <texto>]`). */
      nota?: string;
      /** `#slug` explícito (`[RATIFICAR #clave: …]`). */
      claveExplicita?: string;
      bruto: string;
    }
  | {
      clase: "candidata";
      /** Identificador crudo de la etiqueta (`C1`, `Q14`, `B3`, `C4/D`). */
      id: string;
      bruto: string;
    };

/**
 * Una DIRECTIVA es una instrucción de emisión que el emisor aplica DIRECTAMENTE
 * (sin pasar por el parser→AST). Existe porque varios mapeos de la familia V
 * producen efectos que el parser reverse NO tiene superficie para re-leer:
 *
 *  - enlaces TAGGED (`etiquetado`): el generador OPL forward los emite (`A sucede
 *    a B.`), pero el parser reverse no los reconoce — no hay `kind` de AST. Por
 *    eso el emisor crea el enlace `etiquetado` a mano vía el DSL.
 *  - un modificador `condicion`/`evento` con un estado-gatillo o sin él, sin
 *    construir la superficie verbosa CT/CH/CS/ET que el parser exigiría para
 *    re-derivar el modificador desde texto.
 *  - anotaciones libres (cola `cuando …`, verbo de capacidad preservado) que se
 *    adjuntan al enlace por un canal serializable (etiqueta del enlace o ancla
 *    normativa pendiente), sin contaminar el verbo OPL nuclear.
 *
 * El emisor traduce cada directiva a 1..N llamadas del DSL (igual que una
 * oración, pero con control total de extremos/modificador/anotación). Toda
 * directiva devuelve el Id del enlace creado (para agrupar en abanico, V14/V15).
 */
export type Directiva =
  /** Instrumento (X→P) con `modificador: condicion`, estado-gatillo opcional en el origen. V1/V2/V13. */
  | { tipo: "instrumento-condicion"; proceso: string; objeto: string; estado?: string }
  /** Evento `X [en 's'] inicia P` por la ruta W4.3 (evento sin portador). V3/V13/V14/V15. */
  | { tipo: "evento"; iniciador: string; proceso: string; estado?: string }
  /** Instrumento simple P←O (X requiere O). V4. */
  | { tipo: "instrumento"; proceso: string; objeto: string }
  /** Resultado P→O (P genera O). V5. */
  | { tipo: "resultado"; proceso: string; objeto: string }
  /** Efecto P→O con el verbo original conservado en la `etiqueta` del enlace. V6. */
  | { tipo: "efecto-anotado"; proceso: string; objeto: string; anotacionEtiqueta: string }
  /**
   * Transición (efecto P→O con estado de salida). Resuelve el objeto por su nombre
   * COMPLETO (evita la degradación del parser que parte un nombre con ` de ` en
   * objeto+estado). Estado origen opcional. V14.
   */
  | { tipo: "transicion"; proceso: string; objeto: string; estadoSalida: string; estadoEntrada?: string }
  /** Invocación proceso→proceso (A invoca B). V7. */
  | { tipo: "invocacion"; origen: string; destino: string }
  /**
   * Enlace estructural TAGGED (`etiquetado`) origen→destino con `etiqueta`. La
   * cola opcional (`para el acto`, V10) y el `cuando …` se adjuntan como ancla
   * normativa pendiente sobre el enlace. `multiplicidadDestino` para V8 opcional.
   */
  | {
      tipo: "tagged";
      origen: string;
      destino: string;
      etiqueta: string;
      multiplicidadDestino?: string;
      colaAnotada?: string;
    }
  /**
   * Hecho principal (una oración estricta) MÁS una cola de modelado fino
   * adjuntada como ancla normativa PENDIENTE sobre el enlace que esa oración
   * crea. V12 (colas `cuando`/`según`/`por una`/R4). La oración se parsea y
   * emite normalmente; el emisor adjunta la nota al último enlace creado.
   */
  | { tipo: "hecho-anotado"; oracion: string; colaAnotada: string };

/** Una EMISIÓN dentro de una línea `compuesta`: o una oración (ruta parser) o
 *  una directiva (ruta directa del emisor). Ver `Directiva`. */
export type Emision =
  | { via: "oracion"; oracion: string }
  | { via: "directiva"; directiva: Directiva };

/**
 * Resultado de clasificar UNA linea de un bloque `opl`. Union discriminada por
 * `clase` (cf. contrato W1.2 de la gramatica):
 *
 * - `estricta`:    ya es OPL-ES canonico parseable -> parser.
 * - `normalizada`: azucar T2 reescrita a estricta -> parser, con trazas.
 * - `estructura`:  oracion de refinamiento (`se descompone/despliega en`) ->
 *                  lector de estructura (etapa 2). El parser reverse las parsea
 *                  pero las marca `unsupported-kernel` por diseno; por eso la
 *                  ley L1 las EXCLUYE del test de aceptacion del parser.
 * - `comentario`:  linea `#...` dentro del bloque; se conserva como anotacion.
 * - `compuesta`:   un mapeo de la familia V que produce 1..N emisiones (oraciones
 *                  y/o directivas), opcionalmente agrupadas en un abanico XOR/OR.
 *                  Conserva `{original, regla}` para trazabilidad, igual que
 *                  `normalizada`. El emisor expande cada emisión y, si `agrupar`
 *                  está presente, forma el abanico sobre los enlaces creados.
 * - `rechazada`:   excede T1+T2 y NO tiene mapeo decidido; diagnostico con
 *                  categoria + sugerencia.
 */
export type LineaNormalizada =
  | { clase: "estricta"; oracion: string; anclas?: Ancla[] }
  | { clase: "normalizada"; oracion: string; original: string; regla: ReglaT2; anclas?: Ancla[] }
  | { clase: "estructura"; oracion: string; secuencial?: boolean; aditiva?: boolean; anclas?: Ancla[] }
  | { clase: "comentario"; texto: string; anclas: Ancla[] }
  | {
      clase: "compuesta";
      emisiones: Emision[];
      original: string;
      regla: ReglaT2;
      /** Si presente, agrupa los enlaces creados por `emisiones` en un abanico. */
      agrupar?: { operador: "O" | "XOR" };
      anclas?: Ancla[];
    }
  | { clase: "rechazada"; original: string; categoria: CategoriaRechazo; diagnostico: string; anclas?: Ancla[] };

/**
 * Contexto acumulado por la pasada previa (`construirContextoProto`). Hoy solo
 * memoriza los estados declarados por entidad (clave normalizada del nombre) —
 * lo que A4/R4 necesitan: A4 reescribe un estado pegado SOLO si ya esta
 * declarado para esa entidad; si no, R4. Tambien conserva la esencia conocida
 * para inferir objeto/proceso (AESS): una entidad sujeto de un verbo procedural
 * activo (`maneja`, `consume`, `genera`, ...) es proceso.
 */
export interface ContextoProto {
  /** clave-nombre -> conjunto de nombres de estado declarados (normalizados). */
  estadosPorEntidad: Map<string, Set<string>>;
  /** clave-nombre -> tipo de entidad inferido por uso (objeto | proceso). */
  tipoPorEntidad: Map<string, "objeto" | "proceso">;
  /** clave-nombre -> nombre canonico (display) de toda entidad declarada. Permite
   *  a A4/R4 reconocer un estado pegado: si el prefijo es entidad conocida y el
   *  sufijo NO es estado declarado, es R4 (no se adivina). */
  entidades: Map<string, string>;
  /** clave-nombre de las entidades con clase OPM declarada EXPLICITAMENTE
   *  (descripcion `es un objeto/proceso`, sujeto de `puede estar`/`exhibe`/
   *  `consta de`/`maneja`/verbo procedural -salvo `genera`-, refinable de
   *  `se descompone`). Una parte de `consta de` que NO esta aqui hereda la clase
   *  del todo (agregacion homogenea, tension 4); una con clase contraria
   *  explicita es contradiccion real -> diagnostico. */
  claseExplicita: Set<string>;
}
