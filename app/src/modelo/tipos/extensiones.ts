import type { Id } from "./comunes";

export type ModoReforzamientoOntologia = "none" | "suggest" | "enforce";

export interface TerminoOntologia {
  canonico: string;
  sinonimos?: string[];
  descripcion?: string;
}

export interface OntologiaOrganizacional {
  modo: ModoReforzamientoOntologia;
  terminos: TerminoOntologia[];
}

export type DurezaRequisito = "hard" | "soft";
export type EstadoSatisfaccionRequisito = "pendiente" | "satisface" | "parcial" | "no-satisface";

export interface RequisitoEntidadMetadata {
  idLogico: string;
  descripcion: string;
  dureza: DurezaRequisito;
  actor?: string;
  satisfaction?: EstadoSatisfaccionRequisito;
}

export interface TargetSatisfaccionRequisito {
  tipo: "entidad" | "enlace";
  id: Id;
}

export interface SatisfaccionRequisito {
  id: Id;
  requisitoEntidadId: Id;
  target: TargetSatisfaccionRequisito;
  estado: EstadoSatisfaccionRequisito;
  descripcion?: string;
}

export type EstadoCargaSubmodelo =
  | "descargado"
  | "cargado-sincronizado"
  | "cargado-no-sincronizado"
  | "desconectado";

export interface SubmodeloSource {
  modeloId: Id;
  nombre?: string;
  revisionHash?: string;
}

export interface SubmodeloAnchor {
  entidadId: Id;
  opdId?: Id;
}

export interface SubmodeloContrato {
  compartidas?: Record<Id, Id>;
  frozenAtHash?: string;
}

export interface SubmodeloMaterializacion {
  opdVistaId: Id;
  scope: "sd-root";
  entidadMap: Record<Id, Id>;
  estadoMap: Record<Id, Id>;
  enlaceMap: Record<Id, Id>;
  abanicoMap: Record<Id, Id>;
  sourceHash?: string;
  materializedAt?: string;
}

export interface SubmodeloReferencia {
  id: Id;
  /** Compatibilidad v0: duplicado por source.modeloId. */
  modeloId: Id;
  nombre: string;
  /** Compatibilidad v0: duplicado por anchor.entidadId. */
  anchorEntidadId: Id;
  /** Compatibilidad v0: duplicado por materializacion.opdVistaId cuando está cargado. */
  opdVistaId?: Id;
  /** Estado de lectura rápida; el estado efectivo se deriva de source/materializacion. */
  estado: EstadoCargaSubmodelo;
  /** Compatibilidad v0: duplicado por contrato.compartidas. */
  compartidas?: Record<Id, Id>;
  source?: SubmodeloSource;
  anchor?: SubmodeloAnchor;
  contrato?: SubmodeloContrato;
  materializacion?: SubmodeloMaterializacion;
}

export interface ReferenciaPadreSubmodelo {
  modeloId: Id;
  refId: Id;
  anchorEntidadId: Id;
  estado: EstadoCargaSubmodelo;
}

export type OpdVista =
  | {
      kind: "requirement-view";
      requisitoEntidadId: Id;
      readOnly: true;
    }
  | {
      kind: "submodel-view";
      submodeloRefId: Id;
      readOnly: true;
      syncState: EstadoCargaSubmodelo;
    };

export type DecisionPolicy =
  | { modo: "estado-fijo"; estadoId: Id }
  | { modo: "uniforme"; objetoId: Id }
  | { modo: "probabilidades"; pesos: Record<Id, number> }
  | { modo: "funcion"; funcionId: Id; fallback?: "uniforme" | "probabilidades" };
