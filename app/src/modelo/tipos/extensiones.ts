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

// --- AnclaNormativa (W5.1) -------------------------------------------------
// Extensión ADITIVA y OPCIONAL del formato `deep-opm-pro.modelo.v0`: trazabilidad
// de procedencia normativa del autor sobre el modelo. NO es una cuarta primitiva
// ontológica (R-DOC-7: es *extensión declarada*; V-204: contenido meta del autor);
// NO emite OPL nuclear (R-BR-4); NO cuenta como cosa; NO altera `validarModelo`
// nuclear. Diseño adjudicado v0: docs/proto-modelo/diseno-ancla-normativa.md.

/**
 * Una referencia normativa atómica (una sola norma). Los rangos de artículos del
 * corpus ("arts. 8, 15-17, 21") se modelan como `articulos: string[]` verbatim
 * (la expansión de rangos es presentación, no dato — §10 decisión 5).
 */
export interface ReferenciaNorma {
  /** "DS 1/2022", "NT 2024", "Ley 20.584" — texto libre del autor. */
  norma: string;
  /** ["15", "17"], ["art. 16 letra c"] — verbatim del proto. */
  articulos?: string[];
  /** "§Protocolos clínicos", "§emergencias". */
  seccion?: string;
}

/** Estado del ancla en el eje hecho↔supuesto. `[RATIFICAR]` = `pendiente-ratificacion`. */
export type EstadoAncla = "vigente" | "pendiente-ratificacion";

/** Nivel de autoridad declarado en el proto para resolver un pendiente (C1). La app NO decide. */
export type NivelAutoridad = "operador-modelado" | "mesa" | "dt-seremi-legal";

/** Estados del ciclo de ratificación (C1). El salto a `ratificado-con-fuente` exige fuente. */
export type EstadoRatificacion = "pendiente" | "anotado-en-mesa" | "ratificado-con-fuente";

/** A qué se adjunta el ancla. Amplía el patrón `{target}` a cuatro niveles. */
export type TargetAncla =
  | { tipo: "entidad"; id: Id }
  | { tipo: "enlace"; id: Id }
  | { tipo: "opd"; id: Id }
  | { tipo: "modelo" };

/** Sub-estructura C1: solo presente cuando `estado === "pendiente-ratificacion"`. */
export interface RatificacionAncla {
  /** Quién debe resolver — declarado en el proto, no decidido por la app. */
  nivelAutoridad: NivelAutoridad;
  estadoRatificacion: EstadoRatificacion;
  /** Acta/fuente; OBLIGATORIO para `ratificado-con-fuente`. */
  fuente?: string;
  /** Dueño del pendiente (C1: sin dueño envejece invisible). */
  responsable?: string;
  /** ISO date — cuándo se marcó `anotado-en-mesa`. */
  anotadoEn?: string;
  /** ISO date — cuándo pasó a `ratificado-con-fuente`. */
  ratificadoEn?: string;
}

export interface AnclaNormativa {
  /** Id del Record (posicional en el bundle). El grafo interno lo usa. */
  id: Id;
  /**
   * Clave estable nacida en el proto (slug kebab-case con prefijo de género,
   * p.ej. `ancla:frontera-art17`, `ratificar:convenio-ges`). Es la **clave de
   * trazabilidad** que viaja al log/registro y sobrevive a CUALQUIER reedición
   * (mover, reescribir la nota, reordenar el OPD). Paralela al `id` posicional
   * (§10 decisión 2): no toca el esquema de ids del bundle.
   */
  claveProto: string;
  /** A qué se adjunta (entidad / enlace / opd / modelo). */
  target: TargetAncla;
  estado: EstadoAncla;
  /** 0..N normas; ausente/[] permitido para pendientes puros. */
  referencias?: ReferenciaNorma[];
  /** Glosa del autor: "requisitos", "exclusiones", "6 causales". */
  nota?: string;
  /** Solo cuando `estado === "pendiente-ratificacion"` (rama [RATIFICAR], C1). */
  ratificacion?: RatificacionAncla;
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
