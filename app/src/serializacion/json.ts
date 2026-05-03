import type { Modelo, Resultado } from "../modelo/tipos";

const FORMATO = "deep-opm-pro.modelo.v0";

export interface DocumentoModelo {
  formato: typeof FORMATO;
  modelo: Modelo;
}

export function exportarModelo(modelo: Modelo): string {
  const documento: DocumentoModelo = { formato: FORMATO, modelo };
  return JSON.stringify(documento, null, 2);
}

export function hidratarModelo(json: string): Resultado<Modelo> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: "JSON inválido" };
  }

  if (!esDocumentoModelo(parsed)) {
    return { ok: false, error: "Documento de modelo inválido" };
  }
  return { ok: true, value: normalizarModelo(parsed.modelo) };
}

function normalizarModelo(modelo: Modelo): Modelo {
  const opds = Object.fromEntries(
    Object.entries(modelo.opds).map(([id, opd]) => {
      const padreId = id === modelo.opdRaizId
        ? null
        : opd.padreId && opd.padreId !== id && modelo.opds[opd.padreId]
          ? opd.padreId
          : modelo.opdRaizId;
      return [id, { ...opd, padreId }];
    }),
  );
  return { ...modelo, opds };
}

function esDocumentoModelo(value: unknown): value is DocumentoModelo {
  if (!esRecord(value)) return false;
  if (value.formato !== FORMATO) return false;
  if (!esRecord(value.modelo)) return false;
  const modelo = value.modelo;
  return (
    typeof modelo.id === "string" &&
    typeof modelo.nombre === "string" &&
    typeof modelo.opdRaizId === "string" &&
    typeof modelo.nextSeq === "number" &&
    esRecord(modelo.opds) &&
    esRecord(modelo.entidades) &&
    esRecord(modelo.enlaces)
  );
}

function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
