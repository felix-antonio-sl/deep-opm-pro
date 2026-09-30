import type { ExtremoEnlace, Id, Modelo, Posicion, TipoEntidad, TipoEnlace } from "../tipos";
import type { CreateRefinementOperation } from "./refinement";
import type { CreateXorExclusionOperation } from "./xor";
import type { ConnectPieceReferenceOperation, CopyPieceOperation, ReplaceSubmodelReferenceOperation } from "../reuse/piece";

/** Precondiciones observables sobre el modelo que el lote leyó para decidir. */
export type OperationPrecondition =
  | { kind: "idAbsent"; id: Id }
  | { kind: "opdExists"; id: Id }
  | { kind: "entity"; id: Id; expectedName?: string; expectedType?: TipoEntidad }
  | { kind: "state"; id: Id; expectedName?: string; expectedEntityId?: Id }
  | { kind: "link"; id: Id; expectedFingerprint?: string };

export interface OperationBase {
  /** Identidad estable de esta operación dentro del lote. */
  operationId: string;
  preconditions: OperationPrecondition[];
}

export type SemanticOperation =
  | (OperationBase & { kind: "createObject"; id: Id; opdId: Id; name: string; position: Posicion })
  | (OperationBase & { kind: "createProcess"; id: Id; opdId: Id; name: string; position: Posicion })
  | (OperationBase & { kind: "createState"; id: Id; entityId: Id; name: string })
  | (OperationBase & {
      kind: "renameEntity";
      entityId: Id;
      beforeName: string;
      afterName: string;
    })
  | (OperationBase & {
      kind: "renameState";
      stateId: Id;
      beforeName: string;
      afterName: string;
    })
  | (OperationBase & {
      kind: "createProceduralLink";
      id: Id;
      opdId: Id;
      source: ExtremoEnlace;
      destination: ExtremoEnlace;
      linkType: TipoEnlace;
      label?: string;
    })
  | (OperationBase & { kind: "deleteLink"; linkId: Id })
  | (OperationBase & { kind: "deleteState"; stateId: Id })
  | (OperationBase & { kind: "deleteEntity"; entityId: Id })
  | CreateXorExclusionOperation
  | CreateRefinementOperation
  | CopyPieceOperation
  | ConnectPieceReferenceOperation
  | ReplaceSubmodelReferenceOperation;

/** Entrada mínima del kernel; no conoce las capas de servidor/cliente. */
export interface SemanticChangeBatch {
  id: Id;
  operations: SemanticOperation[];
}

export type ChangeCollection = "entidades" | "estados" | "enlaces" | "opds" | "abanicos" | "submodelos" | "pieceLineage";
export type ModelPath = readonly [collection: ChangeCollection, id: Id, ...fields: string[]];

export interface ModelSlot {
  exists: boolean;
  value?: unknown;
}

/** Diferencia acotada a registros; no captura Modelo completo para deshacer. */
export interface ModelChange {
  path: ModelPath;
  before: ModelSlot;
  after: ModelSlot;
}

export interface ModelDiff {
  changes: ModelChange[];
}

export interface ValidatedEffects {
  changeId: Id;
  changes: ModelChange[];
  readIds: Id[];
  writeIds: Id[];
}

export interface SemanticInverse {
  id: Id;
  sourceChangeId: Id;
  /** Each patch checks the value written by the source change before restoring it. */
  patches: Array<{ path: ModelPath; expected: ModelSlot; restore: ModelSlot }>;
}

export type ChangeRejectionCode =
  | "invalid-change"
  | "precondition-failed"
  | "id-collision"
  | "out-of-scope"
  | "external-owned"
  | "invalid-model";

export type ChangeValidation =
  | {
      kind: "validated";
      candidate: Modelo;
      effects: ValidatedEffects;
      diff: ModelDiff;
      inverse: SemanticInverse;
      readIds: Id[];
      writeIds: Id[];
    }
  | {
      kind: "rejected";
      code: ChangeRejectionCode;
      message: string;
      references: Id[];
    };

export type InverseValidation =
  | {
      kind: "applicable";
      candidate: Modelo;
      diff: ModelDiff;
      readIds: Id[];
      writeIds: Id[];
    }
  | { kind: "conflict"; reason: string; references: Id[] };
