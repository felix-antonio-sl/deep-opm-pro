import type { Afiliacion, DesignacionEstado, Esencia, Id, Modificador, TipoEnlace, TipoEntidad } from "../../modelo/tipos";

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
 */
export interface AstProcedimentalBase {
  tipoEnlace: Extract<TipoEnlace, "agente" | "instrumento" | "consumo" | "resultado" | "efecto" | "invocacion">;
  proceso?: string;
  objeto?: string;
  origen?: string;
  destino?: string;
  estadoEntrada?: string;
  estadoSalida?: string;
}

export type OracionOplAst =
  | {
      kind: "descripcion-cosa";
      linea: number;
      nombre: string;
      tipoEntidad: TipoEntidad;
      esencia: Esencia;
      afiliacion: Afiliacion;
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
  | { tipo: "crear-entidad"; linea: number; nombre: string; entidadTipo: TipoEntidad; esencia: Esencia; afiliacion: Afiliacion }
  | { tipo: "sincronizar-estados"; linea: number; objetoId: Id; nombres: string[] }
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
    }
  | { tipo: "fijar-etiqueta-enlace"; linea: number; enlaceId: Id; anterior: string; siguiente: string }
  | { tipo: "aplicar-designacion-estado"; linea: number; entidadId: Id; estadoNombre: string; designacion: DesignacionEstado };

export interface PrevisualizacionOplReverse {
  ast: OracionOplAst[];
  diagnosticos: DiagnosticoOpl[];
  patches: PatchOplPropuesto[];
}
