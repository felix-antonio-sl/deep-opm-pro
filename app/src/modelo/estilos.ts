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
  patch: Partial<EstiloApariencia>,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return fallo(`Apariencia no existe: ${aparienciaId}`);

  const patchNormalizado = normalizarPatchEstilo(patch);
  if (!patchNormalizado.ok) return patchNormalizado;

  const estiloBase: Record<string, unknown> = { ...(apariencia.estilo ?? {}) };
  for (const key of Object.keys(patchNormalizado.value) as Array<keyof EstiloApariencia>) {
    const value = patchNormalizado.value[key];
    if (value === undefined) delete estiloBase[key];
    else estiloBase[key] = value;
  }
  const siguienteEstilo = normalizarEstiloApariencia(estiloBase);

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

type EstiloPatchNormalizado = Partial<Record<keyof EstiloApariencia, EstiloApariencia[keyof EstiloApariencia] | undefined>>;

function normalizarPatchEstilo(patch: Partial<EstiloApariencia>): Resultado<EstiloPatchNormalizado> {
  const normalizado: EstiloPatchNormalizado = {};
  if (tienePatch(patch, "fill")) {
    if (patch.fill === undefined) normalizado.fill = undefined;
    else if (!esColorEstilo(patch.fill)) return fallo("Color de relleno inválido");
    else normalizado.fill = normalizarColor(patch.fill);
  }
  if (tienePatch(patch, "borderColor")) {
    if (patch.borderColor === undefined) normalizado.borderColor = undefined;
    else if (!esColorEstilo(patch.borderColor)) return fallo("Color de borde inválido");
    else normalizado.borderColor = normalizarColor(patch.borderColor);
  }
  if (tienePatch(patch, "fontFamily")) {
    if (patch.fontFamily === undefined) normalizado.fontFamily = undefined;
    else if (FONT_FAMILIES.includes(patch.fontFamily as typeof FONT_FAMILIES[number])) normalizado.fontFamily = patch.fontFamily;
    else return fallo("Familia tipográfica inválida");
  }
  if (tienePatch(patch, "fontSize")) {
    if (patch.fontSize === undefined) normalizado.fontSize = undefined;
    else if (typeof patch.fontSize === "number" && patch.fontSize >= 8 && patch.fontSize <= 24) normalizado.fontSize = patch.fontSize;
    else return fallo("Tamaño de fuente inválido");
  }
  if (tienePatch(patch, "fontWeight")) {
    if (patch.fontWeight === undefined) normalizado.fontWeight = undefined;
    else if (typeof patch.fontWeight === "number" && [100, 200, 300, 400, 500, 600, 700, 800, 900].includes(patch.fontWeight)) normalizado.fontWeight = patch.fontWeight;
    else if (patch.fontWeight === "normal" || patch.fontWeight === "bold") normalizado.fontWeight = patch.fontWeight;
    else return fallo("Peso tipográfico inválido");
  }
  if (tienePatch(patch, "fontStyle")) {
    if (patch.fontStyle === undefined) normalizado.fontStyle = undefined;
    else if (patch.fontStyle === "normal" || patch.fontStyle === "italic") normalizado.fontStyle = patch.fontStyle;
    else return fallo("Estilo tipográfico inválido");
  }
  if (tienePatch(patch, "textColor")) {
    if (patch.textColor === undefined) normalizado.textColor = undefined;
    else if (esColorEstilo(patch.textColor)) normalizado.textColor = normalizarColor(patch.textColor);
    else return fallo("Color de texto inválido");
  }
  if (tienePatch(patch, "textAnchor")) {
    if (patch.textAnchor === undefined) normalizado.textAnchor = undefined;
    else if (patch.textAnchor === "start" || patch.textAnchor === "middle" || patch.textAnchor === "end") normalizado.textAnchor = patch.textAnchor;
    else return fallo("Alineación de texto inválida");
  }
  return ok(normalizado);
}

function tienePatch<Key extends keyof EstiloApariencia>(patch: Partial<EstiloApariencia>, key: Key): patch is Partial<EstiloApariencia> & Record<Key, EstiloApariencia[Key] | undefined> {
  return Object.prototype.hasOwnProperty.call(patch, key);
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
