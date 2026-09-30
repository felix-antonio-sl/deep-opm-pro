import type { FichaTrabajo, Id, Modelo, ModalidadDocumento, RevisionHumanaDocumento } from "./tipos";

export type ModalidadDocumentoDeclarada = ModalidadDocumento | "sin-declarar";
export type EspecieDocumento = "apunte" | "modelo" | "biblioteca";

export interface DocumentPolicyDocument {
  id: Id;
  opdRaizId?: Id;
  opds?: Modelo["opds"];
  procedencia?: Modelo["procedencia"];
  fichaTrabajo?: FichaTrabajo;
  declaracionesNoNucleares?: Modelo["declaracionesNoNucleares"];
  anclasNormativas?: Modelo["anclasNormativas"];
  notasMesa?: Modelo["notasMesa"];
  mesaExploracion?: Modelo["mesaExploracion"];
  submodelos?: Modelo["submodelos"];
  esApunte?: boolean;
  esBiblioteca?: boolean;
  archivado?: boolean;
  readOnly?: boolean;
}

export type PendienteDocumento =
  | { kind: "opd-suelto" | "declaracion" | "ancla" | "propuesta" | "pieza-externa" | "revision"; id: string; label: string };

export interface DocumentPolicy {
  ownership: "nativa" | "upstream" | "indeterminada";
  modality: ModalidadDocumentoDeclarada;
  pending: PendienteDocumento[];
  contextNotes: Array<{ id: string; label: string }>;
  profile: {
    species: EspecieDocumento;
    archived: boolean;
    looseOpdIds: Id[];
  };
  actions: {
    edit: "available" | "read-only" | "read-only-by-default" | "upstream-owned" | "indeterminate";
    changeModality: "available" | "read-only" | "read-only-by-default" | "upstream-owned" | "indeterminate";
    canGraduateApunte: boolean;
    canRemoveLibraryRole: boolean;
  };
}

/**
 * Proyección informativa de límites ya vigentes. No concede permisos: la escritura
 * sigue pasando por el kernel y el workspace, que vuelven a validar sus guardas.
 * Acepta tanto el Modelo completo como su resumen del catálogo; el resumen produce
 * una proyección parcial y no inventa procedencia ni pendientes.
 */
export function deriveDocumentPolicy(document: DocumentPolicyDocument): DocumentPolicy {
  const species: EspecieDocumento = document.esApunte
    ? "apunte"
    : document.esBiblioteca
      ? "biblioteca"
      : "modelo";
  const ownership = document.procedencia
    ? "upstream"
    : document.opds
      ? "nativa"
      : "indeterminada";
  const looseOpdIds = Object.entries(document.opds ?? {})
    .filter(([id, opd]) => id !== document.opdRaizId && opd.padreId === null)
    .map(([id]) => id);
  const pending = collectPending(document, looseOpdIds);
  const edit = ownership === "upstream"
    ? "upstream-owned"
    : document.readOnly === true
      ? "read-only"
      : ownership === "indeterminada"
        ? "indeterminate"
        : document.readOnly === false
          ? "available"
          : species === "biblioteca"
            ? "read-only-by-default"
            : "available";

  return {
    ownership,
    modality: document.fichaTrabajo?.modalidad ?? "sin-declarar",
    pending,
    contextNotes: Object.entries(document.notasMesa ?? {}).map(([id, note]) => ({ id, label: note.texto })),
    profile: { species, archived: document.archivado === true, looseOpdIds },
    actions: {
      edit,
      changeModality: edit,
      // These describe an available transition only; destination and readiness
      // are checked by graduarApunte / the workspace operation itself.
      canGraduateApunte: species === "apunte" && ownership !== "upstream",
      canRemoveLibraryRole: species === "biblioteca" && ownership !== "upstream",
    },
  };
}

function collectPending(document: DocumentPolicyDocument, looseOpdIds: Id[]): PendienteDocumento[] {
  const pending: PendienteDocumento[] = looseOpdIds.map((id) => ({
    kind: "opd-suelto",
    id,
    label: `OPD sin integrar: ${document.opds?.[id]?.nombre ?? id}`,
  }));

  for (const [id, declaration] of Object.entries(document.declaracionesNoNucleares ?? {})) {
    if (declaration.estadoAsercion === "hipotesis" || declaration.estadoAsercion === "pendiente") {
      pending.push({ kind: "declaracion", id, label: declaration.afirmacion });
    }
  }
  for (const [id, anchor] of Object.entries(document.anclasNormativas ?? {})) {
    if (anchor.estado === "pendiente-ratificacion") {
      pending.push({ kind: "ancla", id, label: anchor.nota || `Ratificación pendiente: ${id}` });
    }
  }
  for (const [id, proposal] of Object.entries(document.mesaExploracion?.propuestas ?? {})) {
    if (proposal.estado === "pendiente") {
      pending.push({ kind: "propuesta", id, label: `Propuesta de exploración pendiente: ${id}` });
    }
  }
  for (const [id, reference] of Object.entries(document.submodelos ?? {})) {
    if (reference.estado === "desconectado" || reference.estado === "cargado-no-sincronizado") {
      pending.push({ kind: "pieza-externa", id, label: `${reference.nombre}: ${reference.estado}` });
    }
  }
  for (const [index, review] of (document.fichaTrabajo?.revisionesHumanas ?? []).entries()) {
    if (review.outcome !== "aceptado") {
      pending.push({ kind: "revision", id: `${review.revision}:${index}`, label: `Revisión humana ${review.outcome}` });
    }
  }
  return pending;
}
