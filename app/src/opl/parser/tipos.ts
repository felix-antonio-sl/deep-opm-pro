import type { Afiliacion, DesignacionEstado, Esencia, Id, TipoEnlace, TipoEntidad } from "../../modelo/tipos";

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
  | {
      kind: "procedimental";
      linea: number;
      tipoEnlace: Extract<TipoEnlace, "agente" | "instrumento" | "consumo" | "resultado" | "efecto" | "invocacion">;
      proceso?: string;
      objeto?: string;
      origen?: string;
      destino?: string;
      estadoEntrada?: string;
      estadoSalida?: string;
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
  | { tipo: "crear-enlace"; linea: number; tipoEnlace: TipoEnlace; origen: ReferenciaEntidadPatch; destino: ReferenciaEntidadPatch; etiqueta?: string }
  | { tipo: "fijar-etiqueta-enlace"; linea: number; enlaceId: Id; anterior: string; siguiente: string }
  | { tipo: "aplicar-designacion-estado"; linea: number; entidadId: Id; estadoNombre: string; designacion: DesignacionEstado };

export interface PrevisualizacionOplReverse {
  ast: OracionOplAst[];
  diagnosticos: DiagnosticoOpl[];
  patches: PatchOplPropuesto[];
}
