import type { Id, Modelo, Resultado } from "../modelo/tipos";
import { hidratarModelo, exportarModelo } from "../serializacion/json";

export const PERFIL_CONTINUIDAD_DOCUMENTO = "opforja.document-continuity.v1" as const;
export type TargetDocumentProfile = typeof PERFIL_CONTINUIDAD_DOCUMENTO;
export type EspecieLegada = "apunte" | "modelo" | "biblioteca" | "desconocida" | "ambigua";

export interface DatosNoRepresentados {
  path: string;
  value: unknown;
}

export interface ResultadoMigracionDocumento {
  document: Modelo;
  targetProfile: TargetDocumentProfile;
  sourceProfile: {
    species: EspecieLegada;
    archived: boolean | null;
    looseOpdIds: Id[];
  };
  differences: string[];
  recoverableOriginal: string;
  unrepresentedData: DatosNoRepresentados[];
}

/**
 * Adapta documentos v0 al contrato de continuidad sin reescribir hechos OPM ni
 * workspace. Las especies sólo se reconocen cuando vienen en el record; no se
 * inventan para un JSON independiente. El original textual queda disponible para
 * recuperación cuando el normalizador descarta un dato.
 */
export function migrateDocument(
  input: string | unknown,
  targetProfile: TargetDocumentProfile = PERFIL_CONTINUIDAD_DOCUMENTO,
): Resultado<ResultadoMigracionDocumento> {
  const recoverableOriginal = typeof input === "string" ? input : snapshot(input);
  if (recoverableOriginal === null) return { ok: false, error: "No se pudo conservar el documento original" };
  const parsed: Resultado<unknown> = typeof input === "string"
    ? parseJson(input)
    : { ok: true, value: input };
  if (!parsed.ok) return parsed;

  const extracted = extractDocument(parsed.value);
  if (!extracted.ok) return extracted;
  const hydrated = hidratarModelo(extracted.value.json);
  if (!hydrated.ok) return hydrated;
  const canonicalJson = exportarModelo(hydrated.value);
  const canonical = parseJson(canonicalJson);
  if (!canonical.ok || !isRecord(canonical.value) || !isRecord(canonical.value.modelo)) {
    return { ok: false, error: "No se pudo generar el documento canónico" };
  }
  const rawDocument = parseJson(extracted.value.json);
  const rawModel = rawDocument.ok && isRecord(rawDocument.value) && isRecord(rawDocument.value.modelo)
    ? rawDocument.value.modelo
    : {};
  const unrepresentedData = collectUnrepresented(rawModel, canonical.value.modelo, "modelo");
  if (isRecord(parsed.value) && !extracted.value.wasPersistedRecord) {
    for (const [key, value] of Object.entries(parsed.value)) {
      if (key !== "formato" && key !== "modelo" && key !== "carpetaId") {
        unrepresentedData.push({ path: key, value });
      }
    }
  }

  const species = speciesOf(extracted.value.catalogue);
  const sourceProfile = {
    species,
    archived: typeof extracted.value.catalogue?.archivado === "boolean"
      ? extracted.value.catalogue.archivado
      : null,
    looseOpdIds: Object.values(hydrated.value.opds)
      .filter((opd) => opd.id !== hydrated.value.opdRaizId && opd.padreId === null)
      .map((opd) => opd.id),
  };
  const differences = [
    ...(unrepresentedData.length > 0
      ? [`${unrepresentedData.length} campo(s) no tienen representación canónica y sólo pueden recuperarse desde el original.`]
      : []),
    ...(sourceProfile.looseOpdIds.length > 0
      ? [`Se conservan ${sourceProfile.looseOpdIds.length} OPD(s) suelto(s); no se integran ni gradúan automáticamente.`]
      : []),
  ];

  return {
    ok: true,
    value: {
      document: hydrated.value,
      targetProfile,
      sourceProfile,
      differences,
      recoverableOriginal,
      unrepresentedData,
    },
  };
}

interface ExtractedDocument {
  json: string;
  wasPersistedRecord: boolean;
  catalogue?: { esApunte?: boolean; esBiblioteca?: boolean; archivado?: boolean };
}

function extractDocument(input: unknown): Resultado<ExtractedDocument> {
  if (!isRecord(input)) return { ok: false, error: "Documento de modelo inválido" };
  if (typeof input.json === "string") {
    const { json, ...catalogue } = input;
    return {
      ok: true,
      value: {
        json,
        wasPersistedRecord: true,
        catalogue: {
          ...(typeof catalogue.esApunte === "boolean" ? { esApunte: catalogue.esApunte } : {}),
          ...(typeof catalogue.esBiblioteca === "boolean" ? { esBiblioteca: catalogue.esBiblioteca } : {}),
          ...(typeof catalogue.archivado === "boolean" ? { archivado: catalogue.archivado } : {}),
        },
      },
    };
  }
  if (input.formato !== "deep-opm-pro.modelo.v0" || !isRecord(input.modelo)) {
    return { ok: false, error: "Documento de modelo inválido" };
  }
  return { ok: true, value: { json: JSON.stringify(input), wasPersistedRecord: false } };
}

function speciesOf(catalogue: ExtractedDocument["catalogue"]): EspecieLegada {
  if (!catalogue || (catalogue.esApunte === undefined && catalogue.esBiblioteca === undefined)) return "desconocida";
  if (catalogue.esApunte === true && catalogue.esBiblioteca === true) return "ambigua";
  if (catalogue.esApunte === true) return "apunte";
  if (catalogue.esBiblioteca === true) return "biblioteca";
  return "modelo";
}

function collectUnrepresented(source: unknown, canonical: unknown, path: string): DatosNoRepresentados[] {
  if (!isRecord(source) || !isRecord(canonical)) {
    if (Array.isArray(source) && Array.isArray(canonical)) {
      return JSON.stringify(source) === JSON.stringify(canonical) ? [] : [{ path, value: source }];
    }
    return JSON.stringify(source) === JSON.stringify(canonical) ? [] : [{ path, value: source }];
  }
  const missing: DatosNoRepresentados[] = [];
  for (const [key, value] of Object.entries(source)) {
    const childPath = `${path}.${key}`;
    if (!Object.hasOwn(canonical, key)) {
      missing.push({ path: childPath, value });
      continue;
    }
    missing.push(...collectUnrepresented(value, canonical[key], childPath));
  }
  return missing;
}

function parseJson(json: string): Resultado<unknown> {
  try {
    return { ok: true, value: JSON.parse(json) };
  } catch {
    return { ok: false, error: "JSON inválido" };
  }
}

function snapshot(input: unknown): string | null {
  try {
    const serialized = JSON.stringify(input);
    return typeof serialized === "string" ? serialized : null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
