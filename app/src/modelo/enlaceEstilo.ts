import type { Id, Modelo, Resultado } from "./tipos";

/**
 * Interfaz de estilo visual propio de un enlace.
 * No incluye dash ambiental (strokeDasharray se define en proyección).
 */
export interface EnlaceEstilo {
  color?: string; // HEX #RGB o #RRGGBB
  strokeWidth?: number; // 1-6 px
  dashArray?: string; // "" | "4 4" | "2 4" | "6 4 2 4"
}

const HEX_COLOR_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const DASH_PATTERNS = ["", "4 4", "2 4", "6 4 2 4"] as const;

export function aplicarEstiloEnlace(
  modelo: Modelo,
  enlaceId: Id,
  estilo: Partial<EnlaceEstilo>,
): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);

  const validado = validarPatchEstiloEnlace(estilo);
  if (!validado.ok) return validado;

  const actual = enlace.estilo ?? {};
  const merge: EnlaceEstilo = {
    ...actual,
    ...validado.value,
  };
  // Limpiar campos vacíos
  if (merge.color === undefined) delete merge.color;
  if (merge.strokeWidth === undefined) delete merge.strokeWidth;
  if (merge.dashArray === undefined) delete merge.dashArray;

  const actualizado = { ...enlace };
  if (Object.keys(merge).length > 0) {
    actualizado.estilo = merge;
  } else {
    delete actualizado.estilo;
  }

  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlaceId]: actualizado,
    },
  });
}

export function resetEstiloEnlace(modelo: Modelo, enlaceId: Id): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  if (!enlace.estilo) return ok(modelo);

  const { estilo: _estilo, ...sinEstilo } = enlace;
  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlaceId]: sinEstilo,
    },
  });
}

export function copiarEstiloEnlace(modelo: Modelo, enlaceId: Id): EnlaceEstilo | null {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace || !enlace.estilo || Object.keys(enlace.estilo).length === 0) return null;
  return { ...enlace.estilo };
}

export function pegarEstiloEnlace(
  modelo: Modelo,
  enlaceId: Id,
  estilo: EnlaceEstilo,
): Resultado<Modelo> {
  return aplicarEstiloEnlace(modelo, enlaceId, estilo);
}

function validarPatchEstiloEnlace(patch: Partial<EnlaceEstilo>): Resultado<Partial<EnlaceEstilo>> {
  const validado: Partial<EnlaceEstilo> = {};

  if (patch.color !== undefined) {
    if (typeof patch.color !== "string" || !HEX_COLOR_RE.test(patch.color)) {
      return fallo("Color inválido: usa #RGB o #RRGGBB");
    }
    validado.color = patch.color.toLowerCase();
  }

  if (patch.strokeWidth !== undefined) {
    if (typeof patch.strokeWidth !== "number" || patch.strokeWidth < 1 || patch.strokeWidth > 6) {
      return fallo("Grosor inválido: debe estar entre 1 y 6 px");
    }
    validado.strokeWidth = patch.strokeWidth;
  }

  if (patch.dashArray !== undefined) {
    if (!DASH_PATTERNS.includes(patch.dashArray as typeof DASH_PATTERNS[number])) {
      return fallo("Patrón de trazo inválido: usa \"\", \"4 4\", \"2 4\" o \"6 4 2 4\"");
    }
    if (patch.dashArray === "") {
      validado.dashArray = ""; // Explícitamente sólido
    } else {
      validado.dashArray = patch.dashArray;
    }
  }

  return ok(validado);
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
