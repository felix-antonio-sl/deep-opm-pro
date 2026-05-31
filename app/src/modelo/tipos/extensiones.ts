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

export interface SubmodeloReferencia {
  id: Id;
  modeloId: Id;
  nombre: string;
  anchorEntidadId: Id;
  opdVistaId?: Id;
  estado: EstadoCargaSubmodelo;
  compartidas?: Record<Id, Id>;
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
