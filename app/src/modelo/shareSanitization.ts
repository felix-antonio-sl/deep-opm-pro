import type { Modelo } from "./tipos";
import type { Entidad } from "./tipos/entidad";

const SECRET_PARAMETER = /(?:token|secret|password|passwd|api[-_]?key|credential|authorization|signature|cookie)/i;
const INVALID_WEB_URL = "[URL web no válida omitida]";
const REDACTED = "[redacted]";

export interface SanitizedPublicLocator {
  value: string;
  redactedParams: string[];
}

/** Removes credentials from an HTTP(S) locator while retaining safe locator data. */
export function sanitizePublicLocator(value: string): string {
  return sanitizePublicLocatorDetails(value).value;
}

/** Same sanitizer with the names of changed credential fields for audit displays. */
export function sanitizePublicLocatorDetails(value: string): SanitizedPublicLocator {
  if (!/^https?:/i.test(value.trim())) return { value, redactedParams: [] };
  let url: URL;
  try { url = new URL(value); }
  catch { return { value: INVALID_WEB_URL, redactedParams: ["invalid-url"] }; }

  const redactedParams: string[] = [];
  if (url.username || url.password) {
    url.username = "";
    url.password = "";
    redactedParams.push("userinfo");
  }
  redactParams(url.searchParams, redactedParams);

  if (url.hash.length > 1) {
    const fragment = url.hash.slice(1);
    const queryIndex = fragment.indexOf("?");
    const prefix = queryIndex >= 0 ? fragment.slice(0, queryIndex + 1) : "";
    const paramsText = queryIndex >= 0 ? fragment.slice(queryIndex + 1) : fragment;
    const params = new URLSearchParams(paramsText);
    const before = redactedParams.length;
    redactParams(params, redactedParams);
    if (redactedParams.length > before) url.hash = `${prefix}${params.toString()}`;
  }

  return { value: url.toString(), redactedParams: [...new Set(redactedParams)] };
}

/**
 * Copies the model paths that may carry public links, without changing the
 * source model. OPM entities and catalog stereotype templates use the same
 * typed URL fields, so both must pass through one policy.
 */
export function sanitizePublicModelUrls(model: Modelo): Modelo {
  return {
    ...model,
    entidades: sanitizeEntityMap(model.entidades),
    ...(model.estereotipos ? {
      estereotipos: Object.fromEntries(Object.entries(model.estereotipos).map(([id, stereotype]) => {
        const template = stereotype.plantilla;
        return [id, template ? {
          ...stereotype,
          plantilla: { ...template, entidades: sanitizeEntityMap(template.entidades) },
        } : stereotype];
      })),
    } : {}),
  };
}

function sanitizeEntityMap(entities: Record<string, Entidad>): Record<string, Entidad> {
  return Object.fromEntries(Object.entries(entities).map(([id, entity]) => {
    if (!entity.urls?.length && !entity.imagen) return [id, entity];
    return [id, {
      ...entity,
      ...(entity.urls ? { urls: entity.urls.map((item) => ({ ...item, url: sanitizePublicLocator(item.url) })) } : {}),
      ...(entity.imagen ? { imagen: { ...entity.imagen, url: sanitizePublicLocator(entity.imagen.url) } } : {}),
    }];
  }));
}

function redactParams(params: URLSearchParams, redacted: string[]): void {
  for (const key of [...params.keys()]) {
    if (!SECRET_PARAMETER.test(key)) continue;
    params.set(key, REDACTED);
    redacted.push(key);
  }
}
