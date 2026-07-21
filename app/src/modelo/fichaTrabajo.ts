import type {
  FichaTrabajo,
  LenteConocimiento,
  Modelo,
  Resultado,
  TipoModelo,
} from "./tipos";

export const TIPOS_MODELO_ORDEN = [
  "dominio",
  "realizacion",
  "introduccion-operacion",
] as const satisfies readonly TipoModelo[];

export const LENTES_CONOCIMIENTO_ORDEN = [
  "sistemas",
  "software",
  "salud",
] as const satisfies readonly LenteConocimiento[];

const CAMPOS_TEXTO = [
  "preguntaHabilitante",
  "duenoSignificado",
  "responsableDecision",
  "criterioSuficiencia",
  "revisarCuando",
] as const satisfies readonly (keyof FichaTrabajo)[];

export function normalizarFichaTrabajo(ficha: FichaTrabajo | undefined): FichaTrabajo | undefined {
  if (!ficha) return undefined;
  const normalizada: FichaTrabajo = {};
  for (const campo of CAMPOS_TEXTO) {
    const valor = ficha[campo];
    if (typeof valor === "string" && valor.trim()) normalizada[campo] = valor.trim();
  }
  const tiposModelo = TIPOS_MODELO_ORDEN.filter((tipo) => ficha.tiposModelo?.includes(tipo));
  if (tiposModelo.length > 0) normalizada.tiposModelo = tiposModelo;
  if (ficha.vidaUtil === "respuesta-puntual" || ficha.vidaUtil === "referencia-viva") {
    normalizada.vidaUtil = ficha.vidaUtil;
  }
  return Object.keys(normalizada).length > 0 ? normalizada : undefined;
}

export function normalizarLentesConocimiento(
  lentes: readonly LenteConocimiento[] | undefined,
): LenteConocimiento[] | undefined {
  if (!lentes) return undefined;
  const normalizadas = LENTES_CONOCIMIENTO_ORDEN.filter((lente) => lentes.includes(lente));
  return normalizadas.length > 0 ? normalizadas : undefined;
}

export function actualizarFichaTrabajo(
  modelo: Modelo,
  ficha: FichaTrabajo | undefined,
): Resultado<Modelo> {
  if (modelo.procedencia) {
    return {
      ok: false,
      error: "La ficha pertenece a la fuente upstream; re-elicita allí el cambio.",
    };
  }
  const normalizada = normalizarFichaTrabajo(ficha);
  const { fichaTrabajo: _actual, ...base } = modelo;
  return {
    ok: true,
    value: normalizada ? { ...base, fichaTrabajo: normalizada } : base,
  };
}

export function actualizarLentesConocimiento(
  modelo: Modelo,
  lentes: readonly LenteConocimiento[] | undefined,
): Modelo {
  const normalizadas = normalizarLentesConocimiento(lentes);
  const { lentesConocimiento: _actuales, ...base } = modelo;
  return normalizadas ? { ...base, lentesConocimiento: normalizadas } : base;
}
