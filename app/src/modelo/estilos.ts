import type { EstiloApariencia, Id, Modelo, Resultado } from "./tipos";

export const PALETA_ESTILO_COSA = [
  "#70e483",
  "#3bc3ff",
  "#586d8c",
  "#ffffff",
  "#fef3c7",
] as const;

const HEX_COLOR_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export function aplicarEstiloApariencia(
  modelo: Modelo,
  opdId: Id,
  aparienciaId: Id,
  patch: EstiloApariencia,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return fallo(`Apariencia no existe: ${aparienciaId}`);

  const patchNormalizado = normalizarPatchEstilo(patch);
  if (!patchNormalizado.ok) return patchNormalizado;

  const siguienteEstilo = normalizarEstiloApariencia({
    ...(apariencia.estilo ?? {}),
    ...patchNormalizado.value,
  });

  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: {
          ...opd.apariencias,
          [aparienciaId]: {
            ...apariencia,
            ...(siguienteEstilo ? { estilo: siguienteEstilo } : {}),
          },
        },
      },
    },
  });
}

export function resetearEstiloApariencia(modelo: Modelo, opdId: Id, aparienciaId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return fallo(`Apariencia no existe: ${aparienciaId}`);
  if (!apariencia.estilo) return ok(modelo);

  const { estilo: _estilo, ...sinEstilo } = apariencia;
  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: {
          ...opd.apariencias,
          [aparienciaId]: sinEstilo,
        },
      },
    },
  });
}

const FONT_FAMILIES = ["Arial", "Helvetica", "Times New Roman", "Courier New", "Verdana"] as const;

export function normalizarEstiloApariencia(value: unknown): EstiloApariencia | undefined {
  if (value === undefined) return undefined;
  if (!esRecord(value)) return undefined;

  const estilo: EstiloApariencia = {};
  if (typeof value.fill === "string" && esColorEstilo(value.fill)) estilo.fill = normalizarColor(value.fill);
  if (typeof value.borderColor === "string" && esColorEstilo(value.borderColor)) estilo.borderColor = normalizarColor(value.borderColor);

  // Campos de texto
  if (typeof value.fontFamily === "string" && FONT_FAMILIES.includes(value.fontFamily as typeof FONT_FAMILIES[number])) {
    estilo.fontFamily = value.fontFamily;
  }
  if (typeof value.fontSize === "number" && value.fontSize >= 8 && value.fontSize <= 24) {
    estilo.fontSize = value.fontSize;
  }
  if (typeof value.fontWeight === "number" && [100, 200, 300, 400, 500, 600, 700, 800, 900].includes(value.fontWeight)) {
    estilo.fontWeight = value.fontWeight;
  } else if (value.fontWeight === "normal" || value.fontWeight === "bold") {
    estilo.fontWeight = value.fontWeight;
  }
  if (value.fontStyle === "normal" || value.fontStyle === "italic") {
    estilo.fontStyle = value.fontStyle;
  }
  if (typeof value.textColor === "string" && esColorEstilo(value.textColor)) {
    estilo.textColor = normalizarColor(value.textColor);
  }
  if (value.textAnchor === "start" || value.textAnchor === "middle" || value.textAnchor === "end") {
    estilo.textAnchor = value.textAnchor;
  }

  return Object.keys(estilo).length > 0 ? estilo : undefined;
}

export const FAMILIAS_TIPOGRAFICAS = [...FONT_FAMILIES] as string[];

export function esColorEstilo(value: string): boolean {
  return HEX_COLOR_RE.test(value);
}

function normalizarPatchEstilo(patch: EstiloApariencia): Resultado<EstiloApariencia> {
  const normalizado: EstiloApariencia = {};
  if (patch.fill !== undefined) {
    if (!esColorEstilo(patch.fill)) return fallo("Color de relleno inválido");
    normalizado.fill = normalizarColor(patch.fill);
  }
  if (patch.borderColor !== undefined) {
    if (!esColorEstilo(patch.borderColor)) return fallo("Color de borde inválido");
    normalizado.borderColor = normalizarColor(patch.borderColor);
  }
  return ok(normalizado);
}

function normalizarColor(value: string): string {
  return value.toLowerCase();
}

function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
