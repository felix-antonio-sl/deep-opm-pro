import type { FichaTrabajo, LenteConocimiento, OntologiaOrganizacional, Resultado, SelloProcedencia } from "../modelo/tipos";
import { COMPONENTES_SELLO } from "../modelo/tipos";
import { LENTES_CONOCIMIENTO_ORDEN, TIPOS_MODELO_ORDEN, normalizarFichaTrabajo, normalizarLentesConocimiento } from "../modelo/fichaTrabajo";
import { esRecord, fallo, ok } from "./validarHelpers";

export function validarOntologiaOrganizacional(value: unknown): Resultado<OntologiaOrganizacional | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo("Modelo inválido: ontologia");
  if (value.modo !== "none" && value.modo !== "suggest" && value.modo !== "enforce") {
    return fallo("Modelo inválido: ontologia.modo");
  }
  if (!Array.isArray(value.terminos)) return fallo("Modelo inválido: ontologia.terminos");
  const terminos: OntologiaOrganizacional["terminos"] = [];
  for (const item of value.terminos) {
    if (!esRecord(item) || typeof item.canonico !== "string" || !item.canonico.trim()) {
      return fallo("Modelo inválido: ontologia.terminos");
    }
    if (item.sinonimos !== undefined && !Array.isArray(item.sinonimos)) {
      return fallo("Modelo inválido: ontologia.terminos.sinonimos");
    }
    const sinonimos = (item.sinonimos ?? []).map((sinonimo: unknown) => {
      if (typeof sinonimo !== "string") return null;
      const limpio = sinonimo.trim();
      return limpio || null;
    });
    if (sinonimos.some((sinonimo: string | null) => sinonimo === null)) {
      return fallo("Modelo inválido: ontologia.terminos.sinonimos");
    }
    terminos.push({
      canonico: item.canonico.trim(),
      ...(sinonimos.length > 0 ? { sinonimos: sinonimos as string[] } : {}),
      ...(typeof item.descripcion === "string" && item.descripcion.trim() ? { descripcion: item.descripcion.trim() } : {}),
    });
  }
  return ok({ modo: value.modo, terminos });
}

/**
 * Valida `procedencia` (W5.3/L6). Extensión aditiva: ausente ⇒ undefined (byte-identidad
 * sobre opcional ausente). Presente ⇒ las 3 componentes del sello deben ser strings no
 * vacíos; un sello malformado se RECHAZA con diagnóstico (no se descarta en silencio).
 */
export function validarFichaTrabajo(value: unknown): Resultado<FichaTrabajo | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo("Modelo inválido: fichaTrabajo");
  const ficha: FichaTrabajo = {};
  for (const campo of [
    "preguntaHabilitante",
    "duenoSignificado",
    "responsableDecision",
    "criterioSuficiencia",
    "revisarCuando",
  ] as const) {
    const campoValue = value[campo];
    if (campoValue === undefined) continue;
    if (typeof campoValue !== "string") return fallo(`Modelo inválido: fichaTrabajo.${campo}`);
    if (campoValue.trim()) ficha[campo] = campoValue.trim();
  }
  if (value.tiposModelo !== undefined) {
    if (!Array.isArray(value.tiposModelo) ||
      value.tiposModelo.some((tipo) =>
        typeof tipo !== "string" || !TIPOS_MODELO_ORDEN.includes(tipo as never)
      )) {
      return fallo("Modelo inválido: fichaTrabajo.tiposModelo");
    }
    if (value.tiposModelo.length > 0) {
      ficha.tiposModelo = value.tiposModelo as NonNullable<FichaTrabajo["tiposModelo"]>;
    }
  }
  if (value.vidaUtil !== undefined) {
    if (value.vidaUtil !== "respuesta-puntual" && value.vidaUtil !== "referencia-viva") {
      return fallo("Modelo inválido: fichaTrabajo.vidaUtil");
    }
    ficha.vidaUtil = value.vidaUtil;
  }
  if (value.modalidad !== undefined) {
    if (value.modalidad !== "existente" && value.modalidad !== "propuesto" && value.modalidad !== "exploratorio") {
      return fallo("Modelo inválido: fichaTrabajo.modalidad");
    }
    ficha.modalidad = value.modalidad;
  }
  if (value.historialModalidad !== undefined) {
    if (!Array.isArray(value.historialModalidad)) return fallo("Modelo inválido: fichaTrabajo.historialModalidad");
    const historial: NonNullable<FichaTrabajo["historialModalidad"]> = [];
    for (const item of value.historialModalidad) {
      if (!esRecord(item) || (item.modalidad !== "existente" && item.modalidad !== "propuesto" && item.modalidad !== "exploratorio") || !esRecord(item.contexto)) {
        return fallo("Modelo inválido: fichaTrabajo.historialModalidad");
      }
      const contexto: NonNullable<FichaTrabajo["historialModalidad"]>[number]["contexto"] = {};
      for (const campo of ["preguntaHabilitante", "criterioSuficiencia", "responsableDecision", "motivoCambio"] as const) {
        const valor = item.contexto[campo];
        if (valor !== undefined && typeof valor !== "string") {
          return fallo(`Modelo inválido: fichaTrabajo.historialModalidad.contexto.${campo}`);
        }
        if (typeof valor === "string" && valor.trim()) contexto[campo] = valor.trim();
      }
      historial.push({ modalidad: item.modalidad, contexto });
    }
    ficha.historialModalidad = historial;
  }
  if (value.revisionesHumanas !== undefined) {
    if (!Array.isArray(value.revisionesHumanas)) return fallo("Modelo inválido: fichaTrabajo.revisionesHumanas");
    const revisiones: NonNullable<FichaTrabajo["revisionesHumanas"]> = [];
    for (const item of value.revisionesHumanas) {
      if (!esRecord(item) || typeof item.actorId !== "string" || !item.actorId.trim() ||
        !Number.isSafeInteger(item.revision) || (item.revision as number) < 0 ||
        !Array.isArray(item.scope) || item.scope.length === 0 ||
        item.scope.some((id) => typeof id !== "string" || !id.trim()) ||
        (item.outcome !== "aceptado" && item.outcome !== "requiere-cambios" && item.outcome !== "abierto") ||
        typeof item.revisadoEn !== "string" || !item.revisadoEn.trim()) {
        return fallo("Modelo inválido: fichaTrabajo.revisionesHumanas");
      }
      revisiones.push({
        actorId: item.actorId.trim(),
        revision: item.revision as number,
        scope: item.scope.map((id) => (id as string).trim()),
        outcome: item.outcome,
        revisadoEn: item.revisadoEn.trim(),
      });
    }
    ficha.revisionesHumanas = revisiones;
  }
  return ok(normalizarFichaTrabajo(ficha));
}

export function validarLentesConocimiento(value: unknown): Resultado<LenteConocimiento[] | undefined> {
  if (value === undefined) return ok(undefined);
  if (!Array.isArray(value) ||
    value.some((lente) =>
      typeof lente !== "string" || !LENTES_CONOCIMIENTO_ORDEN.includes(lente as never)
    )) {
    return fallo("Modelo inválido: lentesConocimiento");
  }
  return ok(normalizarLentesConocimiento(value as LenteConocimiento[]));
}

export function validarProcedencia(value: unknown): Resultado<SelloProcedencia | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo("Modelo inválido: procedencia");
  // Glosario eliminado 2026-06-09: el sello vigente tiene 3 componentes. Un
  // `glosarioHash` presente en bundles viejos se TOLERA (no se valida ni se
  // copia → el campo huérfano se descarta sin romper la hidratación).
  for (const componente of COMPONENTES_SELLO) {
    const v = value[componente];
    if (typeof v !== "string" || !v.trim()) return fallo(`Modelo inválido: procedencia.${componente}`);
  }
  const sello: SelloProcedencia = {
    protoHash: (value.protoHash as string).trim(),
    autoriaVersion: (value.autoriaVersion as string).trim(),
    layoutVersion: (value.layoutVersion as string).trim(),
  };
  // doctrinaVersion (corte C2, D-DOCTRINA): testigo OPCIONAL y ROLLBACK-FREE. Se
  // valida SOLO si está presente; un sello legacy de 3 componentes hidrata sin
  // ella. Presente pero no string-no-vacío ⇒ RECHAZO (no se descarta en silencio).
  if (value.doctrinaVersion !== undefined) {
    const dv = value.doctrinaVersion;
    if (typeof dv !== "string" || !dv.trim()) return fallo("Modelo inválido: procedencia.doctrinaVersion");
    sello.doctrinaVersion = dv.trim();
  }
  return ok(sello);
}
