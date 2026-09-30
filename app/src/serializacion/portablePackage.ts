import { exportarModelo, hidratarModelo } from "./json";
import { sanitizePublicLocatorDetails, sanitizePublicModelUrls } from "../modelo/shareSanitization";
import type { Modelo } from "../modelo/tipos";

export const PORTABLE_PACKAGE_FORMAT = "opforja.portable-package" as const;
export const PORTABLE_PACKAGE_VERSION = 1 as const;
export const PORTABLE_READER_PROFILE = {
  id: "deep-opm-pro.modelo",
  version: "deep-opm-pro.modelo.v0",
} as const;

export const PORTABLE_PACKAGE_MAX_BYTES = 40 * 1024 * 1024;
export const PORTABLE_SOURCE_MAX_BYTES = 1024 * 1024;
const PORTABLE_SOURCE_TOTAL_MAX_BYTES = 10 * 1024 * 1024;
const PORTABLE_MAX_REVISIONS = 50;
const PORTABLE_MAX_SOURCES = 200;

export interface PortableReaderProfile {
  id: string;
  version: string;
}

export interface PortableRevisionInput {
  id: string;
  modelJson: string;
  label: string;
  selectedOpdId: string;
  createdAt?: string;
  revision?: number;
}

export interface PortableIncludedSourceInput {
  id: string;
  title: string;
  locator: string;
  content: string;
  mediaType?: "text/plain" | "text/markdown";
  /** Identifies the model-owned Mesa source whose text this consent covers. */
  modelSourceId?: string;
  /** The exporter includes source text only after an explicit human grant. */
  authorizedByUser: true;
}

export interface PortableOmittedSourceInput {
  id: string;
  title: string;
  locator: string;
  reason: string;
  modelSourceId?: string;
}

export interface PortablePackageInput {
  profile: PortableReaderProfile;
  revisions: PortableRevisionInput[];
  selectedRevisionId?: string;
  includedSources?: PortableIncludedSourceInput[];
  omittedSources?: PortableOmittedSourceInput[];
  createdAt?: string;
}

export interface PortablePackageRevision extends PortableRevisionInput {
  modelId: string;
  createdAt: string;
  views: {
    selectedOpdId: string;
    opdIds: string[];
  };
}

export interface PortableIncludedSource {
  id: string;
  title: string;
  locator: string;
  mediaType: "text/plain" | "text/markdown";
  content: string;
  contentSha256: string;
  authorization: "human-authorized";
  modelSourceId?: string;
  redactedLocatorParams?: string[];
}

export interface PortableOmittedSource {
  id: string;
  title: string;
  locator: string;
  reason: string;
  modelSourceId?: string;
  redactedLocatorParams?: string[];
}

export interface PortablePackageData {
  manifest: {
    packageId: string;
    createdAt: string;
    selectedRevisionId: string;
  };
  profile: PortableReaderProfile;
  revisions: PortablePackageRevision[];
  sources: {
    included: PortableIncludedSource[];
    omitted: PortableOmittedSource[];
  };
}

export interface PortableRevisionView extends PortablePackageRevision {
  model: Modelo;
}

export type PortablePackageReadResult =
  | {
      kind: "ready";
      package: PortablePackageData;
      revisions: PortableRevisionView[];
      originalBytes: Uint8Array;
      integrity: "verified";
    }
  | {
      kind: "unsupported-profile";
      originalBytes: Uint8Array;
      integrity: "verified";
      message: string;
    }
  | {
      kind: "unsupported-version" | "unsupported-format";
      originalBytes: Uint8Array;
      integrity: "unverified";
      message: string;
    };

export class PortablePackageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PortablePackageError";
  }
}

/**
 * Builds one JSON-only package. Included source text is accepted only with an
 * explicit user authorization marker; binary attachments are left as locators.
 */
export async function createPortablePackage(input: PortablePackageInput): Promise<Uint8Array> {
  const now = input.createdAt ?? new Date().toISOString();
  if (!isDate(now)) throw new PortablePackageError("La fecha de exportación no es válida.");
  if (input.revisions.length < 1 || input.revisions.length > PORTABLE_MAX_REVISIONS) {
    throw new PortablePackageError(`El paquete debe contener entre 1 y ${PORTABLE_MAX_REVISIONS} revisiones.`);
  }
  validateProfile(input.profile);

  const includedSources = input.includedSources ?? [];
  const omittedSourcesInput = [...(input.omittedSources ?? [])];
  const includedModelSources = new Map<string, PortableIncludedSourceInput>();
  for (const source of includedSources) {
    if (source.modelSourceId === undefined) continue;
    const modelSourceId = requiredString(source.modelSourceId, "fuente.modelSourceId", 128);
    if (includedModelSources.has(modelSourceId)) throw new PortablePackageError("Una fuente de modelo no puede incluirse dos veces.");
    if (source.authorizedByUser !== true) throw new PortablePackageError(`La fuente «${source.title}» no tiene autorización explícita para incluir su contenido.`);
    includedModelSources.set(modelSourceId, source);
  }

  const revisionIds = new Set<string>();
  const revisions: PortablePackageRevision[] = [];
  const seenModelSourceIds = new Set<string>();
  const omittedModelSourceIds = new Set<string>();
  for (const revision of input.revisions) {
    const id = requiredString(revision.id, "revisión.id", 128);
    if (revisionIds.has(id)) throw new PortablePackageError("Hay revisiones duplicadas en el paquete.");
    revisionIds.add(id);
    const label = requiredString(revision.label, "revisión.label", 200);
    const createdAt = revision.createdAt ?? now;
    if (!isDate(createdAt)) throw new PortablePackageError(`La fecha de la revisión «${label}» no es válida.`);
    if (revision.revision !== undefined && (!Number.isSafeInteger(revision.revision) || revision.revision < 0)) {
      throw new PortablePackageError(`La revisión «${label}» tiene un número inválido.`);
    }
    const hydrated = hydrateModel(revision.modelJson, label);
    const sanitized = sanitizeModelForPortable(hydrated, new Set(includedModelSources.keys()));
    for (const modelSourceId of sanitized.modelSourceIds) {
      seenModelSourceIds.add(modelSourceId);
      if (includedModelSources.has(modelSourceId)) {
        const source = includedModelSources.get(modelSourceId)!;
        if (source.authorizedByUser !== true || source.content !== hydrated.mesaExploracion?.fuentes[modelSourceId]?.contenido) {
          throw new PortablePackageError(`La fuente «${modelSourceId}» solo puede incluirse con su contenido original y autorización explícita.`);
        }
      } else if (!omittedModelSourceIds.has(modelSourceId)) {
        omittedModelSourceIds.add(modelSourceId);
        omittedSourcesInput.push({
          id: `mesa-source:${hydrated.id}:${modelSourceId}`,
          modelSourceId,
          title: "Fuente de exploración omitida",
          locator: `opforja://mesa-exploracion/${encodeURIComponent(hydrated.id)}/${encodeURIComponent(modelSourceId)}`,
          reason: "No se autorizó el contenido de esta fuente. Se conservan su ID y la condición pendiente; el texto dependiente se omite.",
        });
      }
    }
    const selectedOpdId = requiredString(revision.selectedOpdId, "revisión.selectedOpdId", 128);
    if (!hydrated.opds[selectedOpdId]) throw new PortablePackageError(`El OPD seleccionado no existe en «${label}».`);
    revisions.push({
      id,
      modelId: hydrated.id,
      modelJson: exportarModelo(sanitized.model),
      label,
      createdAt,
      ...(revision.revision !== undefined ? { revision: revision.revision } : {}),
      selectedOpdId,
      views: { selectedOpdId, opdIds: Object.keys(hydrated.opds) },
    });
  }

  const selectedRevisionId = input.selectedRevisionId ?? revisions[0]!.id;
  if (!revisionIds.has(selectedRevisionId)) throw new PortablePackageError("La revisión inicial debe formar parte del paquete.");
  for (const modelSourceId of includedModelSources.keys()) {
    if (!seenModelSourceIds.has(modelSourceId)) throw new PortablePackageError(`La fuente autorizada «${modelSourceId}» no existe en las revisiones incluidas.`);
  }

  const omittedSources = omittedSourcesInput;
  if (includedSources.length + omittedSources.length > PORTABLE_MAX_SOURCES) {
    throw new PortablePackageError(`El paquete supera el máximo de ${PORTABLE_MAX_SOURCES} fuentes.`);
  }
  const sourceIds = new Set<string>();
  let totalSourceBytes = 0;
  const included = await Promise.all(includedSources.map(async (source): Promise<PortableIncludedSource> => {
    const id = requiredString(source.id, "fuente.id", 128);
    registerUnique(sourceIds, id, "fuente");
    if (source.authorizedByUser !== true) throw new PortablePackageError(`La fuente «${source.title}» no tiene autorización explícita para incluir su contenido.`);
    const title = requiredString(source.title, "fuente.title", 300);
    const locator = safeLocator(source.locator);
    const contentBytes = new TextEncoder().encode(source.content);
    if (contentBytes.byteLength > PORTABLE_SOURCE_MAX_BYTES) {
      throw new PortablePackageError(`La fuente «${title}» supera el límite de ${PORTABLE_SOURCE_MAX_BYTES} bytes; consérvala como localizador omitido.`);
    }
    totalSourceBytes += contentBytes.byteLength;
    if (totalSourceBytes > PORTABLE_SOURCE_TOTAL_MAX_BYTES) {
      throw new PortablePackageError(`El texto de fuentes supera el límite total de ${PORTABLE_SOURCE_TOTAL_MAX_BYTES} bytes.`);
    }
    const mediaType = source.mediaType ?? "text/plain";
    if (mediaType !== "text/plain" && mediaType !== "text/markdown") throw new PortablePackageError("El paquete portable solo admite fuentes textuales autorizadas.");
    return {
      id,
      title,
      locator: locator.value,
      mediaType,
      content: source.content,
      contentSha256: await sha256Hex(contentBytes),
      authorization: "human-authorized",
      ...(source.modelSourceId ? { modelSourceId: requiredString(source.modelSourceId, "fuente.modelSourceId", 128) } : {}),
      ...(locator.redacted.length ? { redactedLocatorParams: locator.redacted } : {}),
    };
  }));
  const omitted = omittedSources.map((source): PortableOmittedSource => {
    const id = requiredString(source.id, "fuente omitida.id", 128);
    registerUnique(sourceIds, id, "fuente");
    const locator = safeLocator(source.locator);
    return {
      id,
      title: requiredString(source.title, "fuente omitida.title", 300),
      locator: locator.value,
      reason: requiredString(source.reason, "fuente omitida.reason", 240),
      ...(source.modelSourceId ? { modelSourceId: requiredString(source.modelSourceId, "fuente omitida.modelSourceId", 128) } : {}),
      ...(locator.redacted.length ? { redactedLocatorParams: locator.redacted } : {}),
    };
  });

  const payload: PortablePackageData = {
    manifest: {
      packageId: randomId(),
      createdAt: now,
      selectedRevisionId,
    },
    profile: { id: input.profile.id, version: input.profile.version },
    revisions,
    sources: { included, omitted },
  };
  const payloadJson = canonicalJson(payload);
  const envelope = {
    format: PORTABLE_PACKAGE_FORMAT,
    version: PORTABLE_PACKAGE_VERSION,
    payload: payloadJson,
    integrity: { algorithm: "SHA-256", payloadDigest: await sha256Hex(new TextEncoder().encode(payloadJson)) },
  };
  const bytes = new TextEncoder().encode(JSON.stringify(envelope, null, 2));
  if (bytes.byteLength > PORTABLE_PACKAGE_MAX_BYTES) {
    throw new PortablePackageError(`El paquete supera el límite de ${PORTABLE_PACKAGE_MAX_BYTES} bytes.`);
  }
  return bytes;
}

/** Validates the envelope, payload bytes, package IDs, source hashes and each serialized model. */
export async function readPortablePackage(value: Uint8Array | ArrayBuffer | string): Promise<PortablePackageReadResult> {
  const originalBytes = toBytes(value);
  if (originalBytes.byteLength > PORTABLE_PACKAGE_MAX_BYTES) throw new PortablePackageError(`El archivo supera el límite de ${PORTABLE_PACKAGE_MAX_BYTES} bytes.`);
  let envelope: unknown;
  try { envelope = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(originalBytes)); }
  catch { throw new PortablePackageError("El paquete no contiene JSON UTF-8 válido."); }
  if (!isRecord(envelope)) throw new PortablePackageError("El paquete no tiene un manifiesto legible.");
  if (envelope.format !== PORTABLE_PACKAGE_FORMAT) {
    return { kind: "unsupported-format", originalBytes, integrity: "unverified", message: "Este archivo no declara un paquete portable opforja conocido. Se conserva intacto." };
  }
  if (envelope.version !== PORTABLE_PACKAGE_VERSION) {
    return { kind: "unsupported-version", originalBytes, integrity: "unverified", message: `La versión ${String(envelope.version)} del paquete no es compatible con este lector. El original se conserva sin reescritura.` };
  }
  assertExactKeys(envelope, ["format", "version", "payload", "integrity"], "manifest");
  const integrity = isRecord(envelope.integrity) ? envelope.integrity : null;
  if (!integrity || integrity.algorithm !== "SHA-256" || typeof integrity.payloadDigest !== "string" || typeof envelope.payload !== "string") {
    throw new PortablePackageError("El manifiesto no contiene una huella de integridad compatible.");
  }
  assertExactKeys(integrity, ["algorithm", "payloadDigest"], "integrity");
  const actualDigest = await sha256Hex(new TextEncoder().encode(envelope.payload));
  if (!constantTimeEqual(actualDigest, integrity.payloadDigest)) throw new PortablePackageError("La huella del contenido no coincide; el paquete pudo cambiar o estar dañado.");

  let payloadValue: unknown;
  try { payloadValue = JSON.parse(envelope.payload); }
  catch { throw new PortablePackageError("El contenido del paquete no es JSON válido."); }
  if (!isRecord(payloadValue) || !isRecord(payloadValue.profile)) throw new PortablePackageError("El paquete no declara un perfil legible.");
  const profile = validateProfile(payloadValue.profile);
  if (profile.id !== PORTABLE_READER_PROFILE.id || profile.version !== PORTABLE_READER_PROFILE.version) {
    return {
      kind: "unsupported-profile",
      originalBytes,
      integrity: "verified",
      message: `El paquete requiere el perfil ${profile.id} ${profile.version}; este lector admite ${PORTABLE_READER_PROFILE.id} ${PORTABLE_READER_PROFILE.version}. El original se conserva sin reescritura.`,
    };
  }
  const packageData = await validatePackageData(payloadValue);
  const revisions = packageData.revisions.map((revision) => ({ ...revision, model: hydrateModel(revision.modelJson, revision.label) }));
  return { kind: "ready", package: packageData, revisions, originalBytes, integrity: "verified" };
}

async function validatePackageData(value: unknown): Promise<PortablePackageData> {
  if (!isRecord(value) || !isRecord(value.manifest) || !isRecord(value.profile) || !Array.isArray(value.revisions) || !isRecord(value.sources)) {
    throw new PortablePackageError("El contenido del paquete no cumple el esquema esperado.");
  }
  assertExactKeys(value, ["manifest", "profile", "revisions", "sources"], "payload");
  assertExactKeys(value.manifest, ["packageId", "createdAt", "selectedRevisionId"], "manifest");
  assertExactKeys(value.sources, ["included", "omitted"], "sources");
  const packageId = requiredString(value.manifest.packageId, "manifest.packageId", 128);
  const createdAt = requiredString(value.manifest.createdAt, "manifest.createdAt", 60);
  if (!isDate(createdAt)) throw new PortablePackageError("La fecha del paquete no es válida.");
  const selectedRevisionId = requiredString(value.manifest.selectedRevisionId, "manifest.selectedRevisionId", 128);
  const profile = validateProfile(value.profile);
  if (value.revisions.length < 1 || value.revisions.length > PORTABLE_MAX_REVISIONS) throw new PortablePackageError("El paquete declara una cantidad de revisiones no admitida.");
  const ids = new Set<string>();
  const revisions = value.revisions.map((raw, index): PortablePackageRevision => {
    if (!isRecord(raw) || !isRecord(raw.views)) throw new PortablePackageError(`La revisión ${index + 1} está incompleta.`);
    assertExactKeys(raw, ["id", "modelId", "modelJson", "label", "createdAt", "revision", "selectedOpdId", "views"], `revisions[${index}]`);
    assertExactKeys(raw.views, ["selectedOpdId", "opdIds"], `revisions[${index}].views`);
    const id = requiredString(raw.id, `revisions[${index}].id`, 128);
    registerUnique(ids, id, "revisión");
    const label = requiredString(raw.label, `revisions[${index}].label`, 200);
    const modelId = requiredString(raw.modelId, `revisions[${index}].modelId`, 128);
    const modelJson = requiredString(raw.modelJson, `revisions[${index}].modelJson`, PORTABLE_PACKAGE_MAX_BYTES);
    const model = hydrateModel(modelJson, label);
    if (model.id !== modelId) throw new PortablePackageError(`El ID del modelo no coincide en «${label}».`);
    const createdAt = requiredString(raw.createdAt, `revisions[${index}].createdAt`, 60);
    if (!isDate(createdAt)) throw new PortablePackageError(`La fecha de «${label}» no es válida.`);
    if (raw.revision !== undefined && (!Number.isSafeInteger(raw.revision) || (raw.revision as number) < 0)) throw new PortablePackageError(`El número de revisión de «${label}» no es válido.`);
    const selectedOpdId = requiredString(raw.selectedOpdId, `revisions[${index}].selectedOpdId`, 128);
    const viewSelectedOpdId = requiredString(raw.views.selectedOpdId, `revisions[${index}].views.selectedOpdId`, 128);
    if (selectedOpdId !== viewSelectedOpdId || !model.opds[selectedOpdId]) throw new PortablePackageError(`La vista seleccionada de «${label}» no existe.`);
    if (!Array.isArray(raw.views.opdIds) || !raw.views.opdIds.every((item) => typeof item === "string")) throw new PortablePackageError(`La lista de vistas de «${label}» no es válida.`);
    const opdIds = raw.views.opdIds as string[];
    if (new Set(opdIds).size !== opdIds.length || opdIds.length !== Object.keys(model.opds).length || opdIds.some((opdId) => !model.opds[opdId])) {
      throw new PortablePackageError(`La lista de vistas de «${label}» perdió un OPD o contiene IDs inválidos.`);
    }
    return {
      id, modelId, modelJson, label, createdAt,
      ...(raw.revision !== undefined ? { revision: raw.revision as number } : {}),
      selectedOpdId,
      views: { selectedOpdId, opdIds: [...opdIds] },
    };
  });
  if (!ids.has(selectedRevisionId)) throw new PortablePackageError("La revisión inicial indicada no existe en el paquete.");

  const includedRaw = value.sources.included;
  const omittedRaw = value.sources.omitted;
  if (!Array.isArray(includedRaw) || !Array.isArray(omittedRaw) || includedRaw.length + omittedRaw.length > PORTABLE_MAX_SOURCES) {
    throw new PortablePackageError("El inventario de fuentes no es válido.");
  }
  const sourceIds = new Set<string>();
  let totalBytes = 0;
  const included = await Promise.all(includedRaw.map(async (raw, index): Promise<PortableIncludedSource> => {
    if (!isRecord(raw)) throw new PortablePackageError(`La fuente incluida ${index + 1} no es válida.`);
    assertExactKeys(raw, ["id", "title", "locator", "mediaType", "content", "contentSha256", "authorization", "modelSourceId", "redactedLocatorParams"], `sources.included[${index}]`);
    const id = requiredString(raw.id, `sources.included[${index}].id`, 128);
    registerUnique(sourceIds, id, "fuente");
    const content = requiredString(raw.content, `sources.included[${index}].content`, PORTABLE_SOURCE_MAX_BYTES);
    const contentBytes = new TextEncoder().encode(content);
    if (contentBytes.byteLength > PORTABLE_SOURCE_MAX_BYTES) throw new PortablePackageError(`La fuente «${String(raw.title)}» supera el límite permitido.`);
    totalBytes += contentBytes.byteLength;
    if (totalBytes > PORTABLE_SOURCE_TOTAL_MAX_BYTES) throw new PortablePackageError("El paquete supera el límite total de contenido de fuentes.");
    const mediaType = raw.mediaType;
    if (mediaType !== "text/plain" && mediaType !== "text/markdown") throw new PortablePackageError("El paquete contiene un tipo de fuente no admitido.");
    const locator = validateSafeLocator(raw.locator);
    const contentSha256 = requiredString(raw.contentSha256, `sources.included[${index}].contentSha256`, 64);
    if (!/^[a-f0-9]{64}$/.test(contentSha256)) throw new PortablePackageError("Una fuente contiene una huella de contenido inválida.");
    if (!constantTimeEqual(await sha256Hex(contentBytes), contentSha256)) throw new PortablePackageError(`La huella de la fuente «${String(raw.title)}» no coincide.`);
    if (raw.authorization !== "human-authorized") throw new PortablePackageError("Una fuente incluida carece de constancia de autorización humana.");
    const modelSourceId = raw.modelSourceId === undefined ? undefined : requiredString(raw.modelSourceId, `sources.included[${index}].modelSourceId`, 128);
    return {
      id,
      title: requiredString(raw.title, `sources.included[${index}].title`, 300),
      locator: locator.value,
      mediaType,
      content,
      contentSha256,
      authorization: "human-authorized",
      ...(modelSourceId ? { modelSourceId } : {}),
      ...validatedRedactionList(raw.redactedLocatorParams),
    };
  }));
  const omitted = omittedRaw.map((raw, index): PortableOmittedSource => {
    if (!isRecord(raw)) throw new PortablePackageError(`La fuente omitida ${index + 1} no es válida.`);
    assertExactKeys(raw, ["id", "title", "locator", "reason", "modelSourceId", "redactedLocatorParams"], `sources.omitted[${index}]`);
    const id = requiredString(raw.id, `sources.omitted[${index}].id`, 128);
    registerUnique(sourceIds, id, "fuente");
    const locator = validateSafeLocator(raw.locator);
    const modelSourceId = raw.modelSourceId === undefined ? undefined : requiredString(raw.modelSourceId, `sources.omitted[${index}].modelSourceId`, 128);
    return {
      id,
      title: requiredString(raw.title, `sources.omitted[${index}].title`, 300),
      locator: locator.value,
      reason: requiredString(raw.reason, `sources.omitted[${index}].reason`, 240),
      ...(modelSourceId ? { modelSourceId } : {}),
      ...validatedRedactionList(raw.redactedLocatorParams),
    };
  });
  return { manifest: { packageId, createdAt, selectedRevisionId }, profile, revisions, sources: { included, omitted } };
}

const OMITTED_MODEL_SOURCE_TEXT = "[Contenido omitido porque no se autorizó la fuente para este paquete]";
const OMITTED_DERIVED_TEXT = "[Texto dependiente omitido porque su fuente no fue autorizada]";
const OMITTED_PROPOSAL_NAME = "[Propuesta pendiente; contenido omitido por falta de autorización]";
const OMITTED_PROPOSAL_SIGNATURE = "[Firma base omitida junto al contenido no autorizado]";

function sanitizeModelForPortable(model: Modelo, authorizedSourceIds: ReadonlySet<string>): { model: Modelo; modelSourceIds: string[] } {
  // Hydration first discards non-schema fields; cloning the canonical model then
  // lets the portable package retain only model data this format understands.
  const copy = JSON.parse(JSON.stringify(model)) as Modelo;
  const mesa = copy.mesaExploracion;
  if (!mesa) return { model: sanitizePublicModelUrls(copy), modelSourceIds: [] };

  const modelSourceIds = Object.keys(mesa.fuentes);
  const redactedSourceIds = new Set(modelSourceIds.filter((id) => !authorizedSourceIds.has(id)));
  for (const id of redactedSourceIds) {
    const source = mesa.fuentes[id]!;
    mesa.fuentes[id] = {
      ...source,
      titulo: "Fuente omitida",
      contenido: OMITTED_MODEL_SOURCE_TEXT,
    };
  }
  const redactedTraceIds = new Set<string>();
  for (const trace of Object.values(mesa.trazos)) {
    if (trace.fuenteIds.some((id) => redactedSourceIds.has(id))) {
      trace.texto = OMITTED_DERIVED_TEXT;
      redactedTraceIds.add(trace.id);
    }
  }
  for (const proposal of Object.values(mesa.propuestas)) {
    if (proposal.trazoIds.some((id) => redactedTraceIds.has(id))) {
      proposal.operacion = { ...proposal.operacion, nombre: OMITTED_PROPOSAL_NAME };
      proposal.baseFirmaSemantica = OMITTED_PROPOSAL_SIGNATURE;
    }
  }
  return { model: sanitizePublicModelUrls(copy), modelSourceIds };
}

function validateProfile(value: unknown): PortableReaderProfile {
  if (!isRecord(value)) throw new PortablePackageError("El perfil del paquete no es válido.");
  assertExactKeys(value, ["id", "version"], "profile");
  return {
    id: requiredString(value.id, "profile.id", 128),
    version: requiredString(value.version, "profile.version", 128),
  };
}

function hydrateModel(json: string, label: string): Modelo {
  let parsed: unknown;
  try { parsed = JSON.parse(json); }
  catch { throw new PortablePackageError(`El modelo de «${label}» contiene JSON inválido.`); }
  if (!isRecord(parsed) || parsed.formato !== "deep-opm-pro.modelo.v0") throw new PortablePackageError(`El modelo de «${label}» usa un formato no compatible.`);
  const result = hidratarModelo(json);
  if (!result.ok) throw new PortablePackageError(`No se pudo validar «${label}»: ${result.error}.`);
  return result.value;
}

function safeLocator(value: string): { value: string; redacted: string[] } {
  const locator = requiredString(value, "fuente.locator", 2_000);
  const sanitized = sanitizePublicLocatorDetails(locator);
  if (sanitized.redactedParams.includes("invalid-url")) throw new PortablePackageError("Un localizador web no es válido.");
  return { value: sanitized.value, redacted: sanitized.redactedParams };
}

function validateSafeLocator(value: unknown): { value: string } {
  const locator = requiredString(value, "source.locator", 2_000);
  const safe = safeLocator(locator);
  if (safe.value !== locator) throw new PortablePackageError("El localizador contiene credenciales; usa un localizador saneado.");
  return { value: locator };
}

function validatedRedactionList(value: unknown): { redactedLocatorParams?: string[] } {
  if (value === undefined) return {};
  if (!Array.isArray(value) || value.length > 30 || !value.every((entry) => typeof entry === "string" && entry.length <= 128)) {
    throw new PortablePackageError("La lista de credenciales retiradas no es válida.");
  }
  return value.length ? { redactedLocatorParams: [...new Set(value as string[])] } : {};
}

function assertExactKeys(value: Record<string, unknown>, allowed: string[], label: string): void {
  const permitted = new Set(allowed);
  const unexpected = Object.keys(value).filter((key) => !permitted.has(key));
  if (unexpected.length) throw new PortablePackageError(`El campo ${label} contiene propiedades no admitidas: ${unexpected.slice(0, 3).join(", ")}.`);
}

function registerUnique(target: Set<string>, value: string, label: string): void {
  if (target.has(value)) throw new PortablePackageError(`Hay IDs duplicados de ${label} en el paquete.`);
  target.add(value);
}

function requiredString(value: unknown, label: string, maxLength: number): string {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > maxLength) throw new PortablePackageError(`El campo ${label} no es válido.`);
  return value;
}

function isDate(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  if (isRecord(value)) {
    const entries = Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`);
    return `{${entries.join(",")}}`;
  }
  throw new PortablePackageError("El paquete contiene un valor que no puede representarse como JSON.");
}

function toBytes(value: Uint8Array | ArrayBuffer | string): Uint8Array {
  if (typeof value === "string") return new TextEncoder().encode(value);
  return value instanceof Uint8Array ? new Uint8Array(value) : new Uint8Array(value);
}

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new PortablePackageError("Este entorno no puede verificar SHA-256.");
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes.buffer as ArrayBuffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

function randomId(): string {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  throw new PortablePackageError("Este entorno no dispone de un generador de identidad seguro.");
}
