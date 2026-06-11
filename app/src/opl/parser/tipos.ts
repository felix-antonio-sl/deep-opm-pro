import type { Afiliacion, DesignacionEstado, Esencia, Id, Modificador, OperadorAbanico, TipoEnlace, TipoEntidad } from "../../modelo/tipos";

export type SeveridadDiagnosticoOpl = "info" | "warning" | "error";

export interface DiagnosticoOpl {
  codigo:
    | "syntax-error"
    | "unknown-symbol"
    | "ambiguous-symbol"
    | "type-mismatch"
    | "unsupported-kernel"
    | "no-delete-by-absence"
    | "patch-conflict";
  severidad: SeveridadDiagnosticoOpl;
  linea: number;
  columna: number;
  mensaje: string;
  sugerencia?: string;
}

export interface LineaOplNormalizada {
  linea: number;
  original: string;
  texto: string;
  etiqueta?: string;
}

/**
 * Shape interno compartido entre la oracion `procedimental` y la sub-clausula de la
 * oracion `evento`. Reusable: una sub-clausula "que <verbo> ..." en una oracion
 * ET/EH/ETS/EHS expresa el mismo enlace procedural que el equivalente sin modificador.
 *
 * `multiplicidadOrigen` / `multiplicidadDestino`: cardinalidad de extremo capturada
 * como string literal (SSOT §12). El generador la emite como PREFIJO del nombre
 * (`2 **Pedidos**`, `1..N **Recursos**`, `* **Veces**`). El aplicador la traduce
 * a `ajustarMultiplicidad` post-creacion del enlace.
 *
 * `rutaEtiqueta`: etiqueta de ruta del enlace (SSOT §13). El generador la emite como
 * prefijo de oracion `Por ruta <etiqueta>, ...`. El aplicador la traduce a
 * `definirRutaEtiqueta` post-creacion del enlace.
 */
export interface AstProcedimentalBase {
  tipoEnlace: Extract<TipoEnlace, "agente" | "instrumento" | "consumo" | "resultado" | "efecto" | "invocacion">;
  proceso?: string;
  objeto?: string;
  origen?: string;
  destino?: string;
  estadoEntrada?: string;
  estadoSalida?: string;
  multiplicidadOrigen?: string;
  multiplicidadDestino?: string;
  rutaEtiqueta?: string;
  /** Demora de invocación/autoinvocación ("después de Ns", SSOT §8). */
  demora?: string;
}

export type OracionOplAst =
  | {
      kind: "descripcion-cosa";
      linea: number;
      nombre: string;
      tipoEntidad: TipoEntidad;
      // Forma colapsada (`X es un objeto F y A`) trae ambas dimensiones.
      // Forma escindida canónica G2 (`X es F.` / `X es A.`) trae solo una;
      // la otra queda `undefined` y el planificador no la fuerza.
      esencia?: Esencia;
      afiliacion?: Afiliacion;
      etiqueta?: string;
    }
  | {
      kind: "estados";
      linea: number;
      objeto: string;
      estados: string[];
      etiqueta?: string;
    }
  | ({
      kind: "procedimental";
      linea: number;
      etiqueta?: string;
    } & AstProcedimentalBase)
  | {
      /**
       * Oracion de evento (SSOT §6: ET1/ET2, EH1, ETS1/ETS2, EHS1).
       * Reconoce "X [en `s`] inicia Y[, que <verbo> Z [...]]" emitida por el generador
       * cuando el enlace procedural tiene `modificador === "evento"`.
       */
      kind: "evento";
      linea: number;
      /** Cosa (objeto o proceso) que dispara el evento. */
      iniciador: string;
      /** Estado del iniciador (oraciones ETS/EHS). */
      iniciadorEstado?: string;
      /** Proceso disparado por el evento. */
      proceso: string;
      /**
       * Sub-clausula procedural opcional. Si esta presente, define el enlace cuyo
       * `modificador` sera `"evento"` (consumo/resultado/instrumento/agente/efecto).
       * Si esta ausente ("X inicia Y" pelado), el planificador crea un enlace
       * `invocacion` con `modificador: "evento"`.
       */
      base?: AstProcedimentalBase;
      etiqueta?: string;
    }
  | {
      kind: "estructural";
      linea: number;
      tipoEnlace: Extract<TipoEnlace, "agregacion" | "exhibicion" | "generalizacion" | "clasificacion">;
      origen: string;
      destinos: string[];
      multiplicidadDestino?: string;
      etiqueta?: string;
    }
  | {
      kind: "contexto";
      linea: number;
      familia: "descomposicion" | "despliegue" | "plegado" | "otro";
      sujeto: string;
      etiqueta?: string;
    }
  | {
      kind: "metadata";
      linea: number;
      sujeto: string;
      campo: "unidad" | "descripcion" | "valor";
      valor: string;
      etiqueta?: string;
    }
  | {
      kind: "designacion-estado";
      linea: number;
      entidad: string;
      estado: string;
      designacion: DesignacionEstado;
      etiqueta?: string;
    }
  | {
      kind: "plegado-parcial";
      linea: number;
      entidad: string;
      partesExplicitas: string[];
      partesElididas: number;
      rol: "partes" | "rasgos";
      etiqueta?: string;
    }
  | {
      /**
       * Oracion de condicion (SSOT §7: CT1/CT2, CH1/CH2, CS1..CS6).
       * Reconoce "X ocurre si Y [existe|esta en `s`], [en cuyo caso ..., ]
       * de lo contrario X se omite" y "Y [en `s`] maneja X si Y [existe|esta en `s`],
       * de lo contrario X se omite".
       */
      kind: "condicion";
      linea: number;
      /** Proceso que se omite si la condicion no se cumple. */
      proceso: string;
      /** Cosa (objeto o agente) cuya existencia/estado condiciona el proceso. */
      condicionante: string;
      /** Estado especificado del condicionante (CS*, CH2-estado). */
      condicionanteEstado?: string;
      /**
       * Familia del enlace base que la condicion modifica:
       * - instrumento: CH2/CS6 (sin "en cuyo caso").
       * - agente: CH1/CS5 ("maneja .. si ...").
       * - consumo: CT1/CS1/CS3.
       * - efecto: CT2/CS2/CS4.
       */
      base: "agente" | "instrumento" | "consumo" | "efecto";
      /** Estado destino cuando la sub-clausula es "cambia ... a `s`" (CS2/CS4). */
      estadoSalida?: string;
      /** CH (sin sub-clausula "en cuyo caso"); el planificador mapea a instrumento/agente. */
      sinConsecuencia: boolean;
      etiqueta?: string;
    }
  | {
      /**
       * Oracion de abanico XOR/OR (SSOT §11.2-§11.4).
       *
       * Reconoce las dos familias canonicas emitidas por
       * `generadores/abanico.ts:oracionAbanico`:
       *
       * - Forma directa §11.2-§11.3: "Proceso (consume|genera|requiere|...)
       *   (exactamente uno de|al menos uno de) A y B." con variantes
       *   pasivas ("es manejado por", "es consumido por", ...) y forma con
       *   estado §11.3 ("Proceso cambia Objeto a/de (cuant) `s1` y `s2`.").
       *
       * - Forma con modificador `condicion` §11.4: "Proceso ocurre si
       *   (cuant) A y B existe[, en cuyo caso ...], de lo contrario Proceso
       *   se omite." (espejo de las oraciones individuales CT/CH/CS, pero
       *   tomando una *lista* de extremos en lugar de uno solo).
       *
       * El planificador traduce este AST a:
       * - N patches `crear-enlace` con el `tipoEnlace` resuelto y, si aplica,
       *   `modificador: "condicion"` en cada uno.
       * - Un patch `crear-abanico` que los agrupa (operador OR=`O` o XOR).
       *
       * Notas:
       * - `puertoEsOrigen=true` significa que el proceso es el extremo origen
       *   del enlace (caso resultado/invocacion + divergencia). Cuando es
       *   false, el proceso esta en el lado destino (consumo/agente/etc.
       *   convergente). El planificador usa esto para fijar origen/destino
       *   de cada enlace creado por el abanico.
       * - `otros` lista los nombres normalizados de los otros extremos.
       * - `otrosEstados` se llena solo en la forma §11.3 "cambia X a/de
       *   cuant `s1` y `s2`": cada entrada es el estado y `otros[i]` es la
       *   entidad portadora (siempre la misma para todas las ramas).
       */
      kind: "abanico";
      linea: number;
      proceso: string;
      operador: OperadorAbanico;
      tipoEnlace: Extract<TipoEnlace, "agente" | "instrumento" | "consumo" | "resultado" | "efecto" | "invocacion">;
      otros: string[];
      /**
       * Estados por rama (forma §11.3). Cuando esta presente, `otros`
       * contiene un unico nombre de entidad (repetido logicamente; el
       * planificador resuelve un solo objeto cuyos estados son
       * `otrosEstados`). Largo de `otrosEstados` >= 2.
       */
      otrosEstados?: string[];
      puertoEsOrigen: boolean;
      /** Modificador comun a todas las ramas (hoy solo "condicion" §11.4). */
      modificador?: Modificador;
      etiqueta?: string;
    }
  | {
      /**
       * Oracion de excepcion temporal (SSOT §8.1: EX1 sobretiempo, EX2 subtiempo).
       * Reconoce "X ocurre si duracion de Y (excede|es menor que) N unidad".
       */
      kind: "excepcion";
      linea: number;
      /** Proceso de manejo activado por la excepcion. */
      proceso: string;
      /** Proceso fuente cuya duracion dispara la excepcion. */
      fuente: string;
      limite: {
        tipo: "max" | "min";
        /** Valor numerico tal cual aparece en la oracion (ej. "30", "5", "1.5"). */
        valor: string;
        /** Token original de unidad (ej. "segundos", "minutos", "h"). */
        unidad: string;
      };
      etiqueta?: string;
    }
  | {
      kind: "unsupported";
      linea: number;
      texto: string;
      etiqueta?: string;
    };

export interface ParseResultOpl {
  ast: OracionOplAst[];
  diagnosticos: DiagnosticoOpl[];
  lineas: LineaOplNormalizada[];
}

export type ReferenciaEntidadPatch =
  | { tipo: "id"; id: Id }
  | { tipo: "nombre"; nombre: string; entidadTipo?: TipoEntidad };

export type PatchOplPropuesto =
  | { tipo: "renombrar-entidad"; linea: number; entidadId: Id; anterior: string; siguiente: string }
  | { tipo: "cambiar-esencia"; linea: number; entidadId: Id; anterior: Esencia; siguiente: Esencia }
  | { tipo: "cambiar-afiliacion"; linea: number; entidadId: Id; anterior: Afiliacion; siguiente: Afiliacion }
  // esencia/afiliacion opcionales: la clasificación escindida (G2) declara una
  // dimensión por oración; el aplicador usa el default del modelo para la
  // ausente. Dos oraciones consecutivas (esencia + afiliación) se fusionan en
  // un único `crear-entidad` (ver `PatchRegistry.add`).
  | { tipo: "crear-entidad"; linea: number; nombre: string; entidadTipo: TipoEntidad; esencia?: Esencia; afiliacion?: Afiliacion }
  // `objeto` admite referencia pendiente por nombre (cierre del ciclo
  // estado-objeto): la frase de estados puede referir a un objeto declarado en
  // una línea previa del mismo texto; el aplicador resuelve tras crear-entidad.
  | { tipo: "sincronizar-estados"; linea: number; objeto: ReferenciaEntidadPatch; nombres: string[] }
  | { tipo: "renombrar-estado"; linea: number; estadoId: Id; anterior: string; siguiente: string }
  | {
      tipo: "crear-enlace";
      linea: number;
      tipoEnlace: TipoEnlace;
      origen: ReferenciaEntidadPatch;
      destino: ReferenciaEntidadPatch;
      etiqueta?: string;
      /** Modificador a aplicar tras crear el enlace (SSOT §6-§7 evento/condicion/no). */
      modificador?: Modificador;
      /** Tiempo maximo para enlaces de excepcion por sobretiempo (SSOT §8.1 EX1). */
      tiempoMaximo?: string;
      unidadTiempoMaximo?: string;
      /** Tiempo minimo para enlaces de excepcion por subtiempo (SSOT §8.1 EX2). */
      tiempoMinimo?: string;
      unidadTiempoMinimo?: string;
      estadoEntrada?: string;
      estadoSalida?: string;
      /** Demora de invocación/autoinvocación a aplicar tras crear (SSOT §8). */
      demora?: string;
      multiplicidadOrigen?: string;
      multiplicidadDestino?: string;
      rutaEtiqueta?: string;
    }
  | { tipo: "fijar-etiqueta-enlace"; linea: number; enlaceId: Id; anterior: string; siguiente: string }
  | { tipo: "aplicar-designacion-estado"; linea: number; entidadId: Id; estadoNombre: string; designacion: DesignacionEstado }
  | {
      /**
       * Patch que agrupa N enlaces ya planificados (mismo origen/destino logico,
       * mismo tipo, mismo modificador) en un abanico XOR/OR. SSOT §11.2-§11.4.
       *
       * Estrategia del aplicador (`aplicar.ts`):
       *   1. Tras crear los enlaces "ordinarios" (fase enlace-procedimental) y
       *      ya tener todos los `Enlace` con `portId` de fan-out asignado,
       *      busca los enlaces creados por las claves
       *      (`tipoEnlace`, origenRef, destinoRef, modificador) listadas en
       *      `ramas`.
       *   2. Llama a `formarAbanico` (modelo/abanicos.ts) con el operador.
       *
       * Si alguna rama no se encuentra (ej. el AST listo dos extremos pero el
       * enlace no fue creado por colision previa), el patch es no-op para esa
       * rama y emite diagnostico via `patch-conflict`.
       */
      tipo: "crear-abanico";
      linea: number;
      operador: OperadorAbanico;
      tipoEnlace: Extract<TipoEnlace, "agente" | "instrumento" | "consumo" | "resultado" | "efecto" | "invocacion">;
      /**
       * Referencia al proceso pivote (puerto comun del abanico) y al lado
       * en que esta el proceso dentro de cada enlace de rama. El aplicador
       * usa esto para localizar el `portId` compartido tras crear enlaces.
       */
      procesoRef: ReferenciaEntidadPatch;
      procesoEsOrigen: boolean;
      ramas: Array<{ origen: ReferenciaEntidadPatch; destino: ReferenciaEntidadPatch; estado?: string }>;
      modificador?: Modificador;
    };

export interface PrevisualizacionOplReverse {
  ast: OracionOplAst[];
  diagnosticos: DiagnosticoOpl[];
  patches: PatchOplPropuesto[];
}
