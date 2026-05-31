import type { Abanico } from "./abanico";
import type { Id } from "./comunes";
import type { Entidad } from "./entidad";
import type { Enlace } from "./enlace";
import type { Estado } from "./estado";
import type {
  OntologiaOrganizacional,
  ReferenciaPadreSubmodelo,
  SatisfaccionRequisito,
  SubmodeloReferencia,
} from "./extensiones";
import type { Opd } from "./opd";

/**
 * Tipo Modelo: raíz del documento OPM. Agrega entidades, estados, enlaces,
 * apariencias por OPD, abanicos lógicos y metadata de versión/archivado.
 *
 * Refs: SSOT opm-iso-19450-es.md (Object-Process Methodology canónica),
 *       opm-extracted/src/app/models/json.model.ts:6-611 (JsonModel concentrador).
 */

export interface VersionResumen {
  id: Id;
  creadoEn: string;
  nombre: string;
  descripcion?: string;
  preservar?: boolean;
  modeloPayloadKey: string;
  bytes: number;
}

export interface Modelo {
  id: Id;
  nombre: string;
  descripcion?: string;
  opdRaizId: Id;
  opds: Record<Id, Opd>;
  entidades: Record<Id, Entidad>;
  estados: Record<Id, Estado>;
  enlaces: Record<Id, Enlace>;
  abanicos?: Record<Id, Abanico>;
  ontologia?: OntologiaOrganizacional;
  satisfaccionesRequisito?: Record<Id, SatisfaccionRequisito>;
  submodelos?: Record<Id, SubmodeloReferencia>;
  referenciaPadreSubmodelo?: ReferenciaPadreSubmodelo;
  archivado?: boolean;
  archivadoEn?: string;
  versiones?: VersionResumen[];
  crearVersionAlGuardar?: boolean;
  nextSeq: number;
}
