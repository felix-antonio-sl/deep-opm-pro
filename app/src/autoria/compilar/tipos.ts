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
 *  prefijo "en uno de los estados"). Cada `normalizada` registra cual aplico. */
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
  | "AESS"; // esencia/afiliacion sin "un objeto/proceso" -> inyectar tipo entidad

/** Ancla normativa o de seccion extraida inline (W1.5/F5 la consumira; hoy se
 *  conserva junto a la linea, no compila). */
export interface Ancla {
  /** Tipo de ancla detectada. */
  tipo: "consenso" | "pregunta" | "norma" | "pendiente" | "otro";
  /** Identificador crudo tal cual aparece (`C1`, `Q14`, `DS art. 17`, ...). */
  id: string;
  /** Texto completo del marcador, incluida la decoracion (`[C1]`, `(DS art. 17)`). */
  bruto: string;
}

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
 * - `rechazada`:   excede T1+T2; diagnostico con categoria + sugerencia.
 */
export type LineaNormalizada =
  | { clase: "estricta"; oracion: string; anclas?: Ancla[] }
  | { clase: "normalizada"; oracion: string; original: string; regla: ReglaT2; anclas?: Ancla[] }
  | { clase: "estructura"; oracion: string; secuencial?: boolean; aditiva?: boolean; anclas?: Ancla[] }
  | { clase: "comentario"; texto: string; anclas: Ancla[] }
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
