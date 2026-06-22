import type { Abanico } from "./abanico";
import type { Id } from "./comunes";
import type { Entidad } from "./entidad";
import type { Enlace } from "./enlace";
import type { Estado } from "./estado";
import type {
  AnclaNormativa,
  Estereotipo,
  NotaMesa,
  OntologiaOrganizacional,
  ReferenciaPadreSubmodelo,
  SatisfaccionRequisito,
  SelloProcedencia,
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
  /** W5.1: trazabilidad de procedencia normativa. Aditivo y opcional (extensión declarada). */
  anclasNormativas?: Record<Id, AnclaNormativa>;
  /** W6.5-a: notas de mesa (comentarios de revisión por componente). Aditivo y opcional. */
  notasMesa?: Record<Id, NotaMesa>;
  /** D6: catálogo de estereotipos (plantillas de subgrafo + de fábrica). Aditivo y opcional
   *  (hermano de anclasNormativas): excluido de validarModelo nuclear / conteo OPL / checkers. */
  estereotipos?: Record<Id, Estereotipo>;
  /** W5.3/L6: sello de origen del bundle emitido (proto+versiones). Aditivo y opcional. */
  procedencia?: SelloProcedencia;
  submodelos?: Record<Id, SubmodeloReferencia>;
  referenciaPadreSubmodelo?: ReferenciaPadreSubmodelo;
  archivado?: boolean;
  archivadoEn?: string;
  versiones?: VersionResumen[];
  crearVersionAlGuardar?: boolean;
  nextSeq: number;
}
