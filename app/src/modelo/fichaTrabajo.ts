import type {
  ContextoModalidadDocumento,
  FichaTrabajo,
  LenteConocimiento,
  Modelo,
  ModalidadDocumento,
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

const MODALIDADES_DOCUMENTO = ["existente", "propuesto", "exploratorio"] as const satisfies readonly ModalidadDocumento[];

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
  if (ficha.modalidad && MODALIDADES_DOCUMENTO.includes(ficha.modalidad)) {
    normalizada.modalidad = ficha.modalidad;
  }
  const historialModalidad = (ficha.historialModalidad ?? []).flatMap((cambio) => {
    if (!MODALIDADES_DOCUMENTO.includes(cambio.modalidad)) return [];
    const contexto: ContextoModalidadDocumento = {};
    for (const campo of ["preguntaHabilitante", "criterioSuficiencia", "responsableDecision", "motivoCambio"] as const) {
      const valor = textoNoVacio(cambio.contexto?.[campo]);
      if (valor !== undefined) contexto[campo] = valor;
    }
    return [{ modalidad: cambio.modalidad, contexto }];
  });
  if (historialModalidad.length > 0) normalizada.historialModalidad = historialModalidad;
  const revisionesHumanas = (ficha.revisionesHumanas ?? []).flatMap((revision) => {
    if (!revision.actorId.trim() || !Number.isSafeInteger(revision.revision) || revision.revision < 0 ||
      !revision.revisadoEn.trim() || !Array.isArray(revision.scope) ||
      !revision.scope.every((id) => typeof id === "string" && id.trim()) ||
      !["aceptado", "requiere-cambios", "abierto"].includes(revision.outcome)) return [];
    return [{ ...revision, actorId: revision.actorId.trim(), revisadoEn: revision.revisadoEn.trim(), scope: revision.scope.map((id) => id.trim()) }];
  });
  if (revisionesHumanas.length > 0) normalizada.revisionesHumanas = revisionesHumanas;
  return Object.keys(normalizada).length > 0 ? normalizada : undefined;
}

function textoNoVacio(value: string | undefined): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
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

/** Cambia la modalidad sin borrar el marco bajo el que se declaró la anterior. */
export function actualizarModalidadDocumento(
  modelo: Modelo,
  modalidad: ModalidadDocumento,
  motivoCambio?: string,
): Resultado<Modelo> {
  if (modelo.procedencia) {
    return { ok: false, error: "La modalidad pertenece a la fuente upstream; re-elicita allí el cambio." };
  }
  const actual = normalizarFichaTrabajo(modelo.fichaTrabajo) ?? {};
  const historial = [...(actual.historialModalidad ?? [])];
  if (actual.modalidad && actual.modalidad !== modalidad) {
    historial.push({
      modalidad: actual.modalidad,
      contexto: {
        ...(actual.preguntaHabilitante ? { preguntaHabilitante: actual.preguntaHabilitante } : {}),
        ...(actual.criterioSuficiencia ? { criterioSuficiencia: actual.criterioSuficiencia } : {}),
        ...(actual.responsableDecision ? { responsableDecision: actual.responsableDecision } : {}),
        ...(motivoCambio?.trim() ? { motivoCambio: motivoCambio.trim() } : {}),
      },
    });
  }
  const fichaTrabajo = normalizarFichaTrabajo({ ...actual, modalidad, historialModalidad: historial });
  const { fichaTrabajo: _anterior, ...base } = modelo;
  return { ok: true, value: fichaTrabajo ? { ...base, fichaTrabajo } : base };
}

export function actualizarLentesConocimiento(
  modelo: Modelo,
  lentes: readonly LenteConocimiento[] | undefined,
): Modelo {
  const normalizadas = normalizarLentesConocimiento(lentes);
  const { lentesConocimiento: _actuales, ...base } = modelo;
  return normalizadas ? { ...base, lentesConocimiento: normalizadas } : base;
}
