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
// nuclear. Diseño adjudicado v0: diseno-ancla-normativa.md (retirado 2a83c1c5, en git).

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

// --- NotaMesa (W6.5-a) -------------------------------------------------------
// Extensión ADITIVA y OPCIONAL del formato `deep-opm-pro.modelo.v0`: comentario
// de revisión del operador anclado a un componente. Es contenido META de la mesa
// (mismo estatuto que AnclaNormativa, V-204): NO emite OPL, NO cuenta como cosa,
// NO altera `validarModelo` nuclear. A diferencia de la `descripcion` de entidad
// (que define QUÉ ES la cosa), la nota registra QUÉ SE PREGUNTA la mesa sobre
// ella: viaja en el contexto W6.0 como insumo de re-elicitación y se resuelve
// corrigiendo el proto — desechable una vez resuelta, no definición.

/** Comentario de mesa anclado a un componente. Reusa `TargetAncla` (4 niveles). */
export interface NotaMesa {
  id: Id;
  target: TargetAncla;
  texto: string;
  /** ISO date (YYYY-MM-DD) — cuándo se anotó en la mesa. */
  fecha: string;
}

// --- SelloProcedencia (W5.3 / L6) -------------------------------------------
// Extensión ADITIVA y OPCIONAL del formato `deep-opm-pro.modelo.v0`: sello de
// origen del bundle emitido por `autoria/compilar` (acta mesa flujo-canónico
// 2026-06-04, L6). Staleness definida sobre ARTEFACTOS ESTABLES (hash del
// contenido del proto), no sobre ids internos. Honestidad temporal:
// la divergencia se REPORTA, no degrada — el proto-modelo sigue siendo el
// portador canónico de la trazabilidad legal aunque diverja.
// (Glosario eliminado 2026-06-09: el proto es la fuente única autoral; el sello
// pasó de 4 a 3 componentes. Bundles viejos con `glosarioHash` se toleran al
// deserializar — el campo huérfano se descarta.)

/** Las 3 componentes REQUERIDAS del sello: `{protoHash, autoriaVersion, layoutVersion}`. */
export interface SelloProcedencia {
  /** Hash del contenido del proto-modelo (markdown) del que se compiló el bundle. */
  protoHash: string;
  /** Versión declarada del módulo de autoría (DSL + compilador) que emitió. */
  autoriaVersion: string;
  /** Versión declarada del motor de layout canónico aplicado (re-pin la incrementa). */
  layoutVersion: string;
  /**
   * Testigo de deriva doctrinal del cordón (corte C2, decisión D-DOCTRINA, spec
   * §5.2): hash de contenido de las 4 SSOT forja en orden canónico. ADITIVO,
   * OPCIONAL y ROLLBACK-FREE — un bundle sin esta clave hidrata byte-idéntico.
   * NO entra en `COMPONENTES_SELLO` (que son los REQUERIDOS): vive en
   * `COMPONENTES_SELLO_OPCIONALES` y solo se compara cuando está presente en
   * ambos sellos.
   */
  doctrinaVersion?: string;
}

/**
 * Componentes REQUERIDOS del sello, en orden estable. ÚNICO punto de verdad: lo
 * consumen el constructor (`autoria/procedencia`) y el validador
 * (`serializacion/json`). Añadir un testigo REQUERIDO nuevo se hace SOLO aquí +
 * en `SelloProcedencia`; `satisfies` impide que la lista y el tipo diverjan.
 */
export const COMPONENTES_SELLO = ["protoHash", "autoriaVersion", "layoutVersion"] as const satisfies ReadonlyArray<keyof SelloProcedencia>;

/**
 * Componentes OPCIONALES del sello, en orden estable. Se comparan SOLO cuando
 * están presentes en ambos sellos (rollback-free: un sello legacy sin ellas
 * hidrata y no diverge). Lista extensible: `skillVersion` se unirá en un corte
 * futuro. `satisfies` mantiene la lista alineada con el tipo.
 */
export const COMPONENTES_SELLO_OPCIONALES = ["doctrinaVersion"] as const satisfies ReadonlyArray<keyof SelloProcedencia>;

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
    }
  // Vista ad-hoc libre (E-1, solicitud upstream hd-opm): reúne apariciones
  // arbitrarias SIN semántica de refinamiento (no in-zoom, no unfold). Excluida
  // de los checkers de frontera/descomposición. Para vistas como la causal de
  // ingreso, donde el unfold mixto no es realizable (sin raíz todo-parte común).
  | {
      kind: "generic-view";
      readOnly?: boolean;
    };

export type DecisionPolicy =
  | { modo: "estado-fijo"; estadoId: Id }
  | { modo: "uniforme"; objetoId: Id }
  | { modo: "probabilidades"; pesos: Record<Id, number> }
  | { modo: "funcion"; funcionId: Id; fallback?: "uniforme" | "probabilidades" };
