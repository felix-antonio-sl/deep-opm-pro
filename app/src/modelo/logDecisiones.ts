// Kernel del registro [RATIFICAR] tipificado + LogDecisiones v0 (W6.5-b, acta
// mesa equilibrio C1/C2). Puro: sin JointJS, sin DOM, sin Zustand.
//
// C1 — la app REGISTRA, no decide: las transiciones del registro
// (pendiente → anotado-en-mesa → ratificado-con-fuente) viven en
// `ancla.ratificacion` y se persisten con el modelo; el ancla OPM
// (`estado: pendiente-ratificacion → vigente`) SOLO cambia vía re-elicitación
// de la skill en la siguiente emisión del proto.
// C2 — log con schema versionado y consumidor comprometido: el formato calza
// 1:1 con lo que el estado `re-elicitar` de `modelamiento-opm` exige
// (claveAncla, transicion, nivelAutoridad, fecha, modeloHash; fuente
// obligatoria para ratificado-con-fuente). `modeloHash` = `protoHash` del
// sello de procedencia — sin sello no hay ancla confiable y el export se
// bloquea ruidoso.
import { anclaPorClaveProto, enumerarAnclas } from "./anclasNormativas";
import type { AnclaNormativa, EstadoRatificacion, Modelo, NivelAutoridad, Resultado } from "./tipos";

export const SCHEMA_LOG_DECISIONES = "deep-opm-pro.log-decisiones.v0";

export interface EntradaLogDecision {
  claveAncla: string;
  transicion: { de: EstadoRatificacion; a: EstadoRatificacion };
  nivelAutoridad: NivelAutoridad;
  /** ISO date de la transición (anotadoEn o ratificadoEn). */
  fecha: string;
  modeloHash: string;
  fuente?: string;
  responsable?: string;
}

export interface LogDecisiones {
  schema: typeof SCHEMA_LOG_DECISIONES;
  modeloHash: string;
  generadoEl: string;
  entradas: EntradaLogDecision[];
}

function fallo<T>(error: string): Resultado<T> {
  return { ok: false, error };
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function conRatificacion(
  modelo: Modelo,
  claveProto: string,
): Resultado<{ ancla: AnclaNormativa; registroActual: EstadoRatificacion }> {
  const ancla = anclaPorClaveProto(modelo, claveProto);
  if (!ancla) return fallo(`Ancla no existe: ${claveProto}`);
  if (ancla.estado !== "pendiente-ratificacion" || !ancla.ratificacion) {
    return fallo(`Ancla sin pendiente de ratificación: ${claveProto}`);
  }
  return ok({ ancla, registroActual: ancla.ratificacion.estadoRatificacion });
}

function reemplazarAncla(modelo: Modelo, ancla: AnclaNormativa): Modelo {
  return { ...modelo, anclasNormativas: { ...modelo.anclasNormativas, [ancla.id]: ancla } };
}

/** C1: marca in-app `anotado-en-mesa` (persistida). No retrocede un registro ratificado. */
export function anotarAnclaEnMesa(
  modelo: Modelo,
  claveProto: string,
  fecha: string,
  responsable?: string,
): Resultado<Modelo> {
  const encontrada = conRatificacion(modelo, claveProto);
  if (!encontrada.ok) return encontrada;
  const { ancla, registroActual } = encontrada.value;
  if (registroActual !== "pendiente") {
    return fallo(`El registro de ${claveProto} ya está en '${registroActual}' (no retrocede)`);
  }
  return ok(reemplazarAncla(modelo, {
    ...ancla,
    ratificacion: {
      ...ancla.ratificacion!,
      estadoRatificacion: "anotado-en-mesa",
      anotadoEn: fecha,
      ...(responsable?.trim() ? { responsable: responsable.trim() } : {}),
    },
  }));
}

/** C1: `ratificado-con-fuente` EXIGE fuente — el salto a hecho confirmado no existe sin ella. */
export function ratificarAnclaConFuente(
  modelo: Modelo,
  claveProto: string,
  fuente: string,
  fecha: string,
  responsable?: string,
): Resultado<Modelo> {
  const fuenteLimpia = fuente.trim();
  if (!fuenteLimpia) return fallo(`Ratificar ${claveProto} exige fuente (C1)`);
  const encontrada = conRatificacion(modelo, claveProto);
  if (!encontrada.ok) return encontrada;
  const { ancla, registroActual } = encontrada.value;
  if (registroActual === "ratificado-con-fuente") {
    return fallo(`${claveProto} ya está ratificada`);
  }
  return ok(reemplazarAncla(modelo, {
    ...ancla,
    ratificacion: {
      ...ancla.ratificacion!,
      estadoRatificacion: "ratificado-con-fuente",
      fuente: fuenteLimpia,
      ratificadoEn: fecha,
      ...(responsable?.trim() ? { responsable: responsable.trim() } : {}),
    },
  }));
}

/**
 * C2: construye el `LogDecisiones v0` con las transiciones registradas en la
 * mesa. Solo anclas OPM aún pendientes generan entradas (L9 app-side: un ancla
 * ya `vigente` fue re-elicitada — su ciclo cerró y no reaparece). Registro aún
 * `pendiente` = nada que reportar.
 */
export function construirLogDecisiones(modelo: Modelo, generadoEl: string): Resultado<LogDecisiones> {
  const modeloHash = modelo.procedencia?.protoHash;
  if (!modeloHash) {
    return fallo("LogDecisiones exige sello de procedencia (el log se ancla al protoHash; sin sello la skill no puede matchear)");
  }
  const entradas: EntradaLogDecision[] = [];
  // logdec-02: la skill (`re-elicitar`) matchea por `claveAncla`, NO posicional. Dos
  // entradas con la misma clave serían indistinguibles al re-elicitar → el log sería
  // ambiguo. Rechazo ruidoso app-side antes de emitir entradas ambiguas.
  const clavesEmitidas = new Set<string>();
  for (const ancla of enumerarAnclas(modelo)) {
    if (ancla.estado !== "pendiente-ratificacion" || !ancla.ratificacion) continue;
    const registro = ancla.ratificacion.estadoRatificacion;
    if (registro === "pendiente") continue;
    if (clavesEmitidas.has(ancla.claveProto)) {
      return fallo(`claveProto duplicada: ${ancla.claveProto} — el log sería ambiguo para re-elicitar (la skill matchea por claveAncla, no posicional)`);
    }
    clavesEmitidas.add(ancla.claveProto);
    // Fidelidad del registro: una ratificación que pasó por la mesa reporta su
    // `de` real (anotado-en-mesa); la directa, desde pendiente.
    const de: EstadoRatificacion = registro === "ratificado-con-fuente" && ancla.ratificacion.anotadoEn
      ? "anotado-en-mesa"
      : "pendiente";
    entradas.push({
      claveAncla: ancla.claveProto,
      transicion: { de, a: registro },
      nivelAutoridad: ancla.ratificacion.nivelAutoridad,
      fecha: (registro === "ratificado-con-fuente" ? ancla.ratificacion.ratificadoEn : ancla.ratificacion.anotadoEn) ?? generadoEl,
      modeloHash,
      ...(ancla.ratificacion.fuente ? { fuente: ancla.ratificacion.fuente } : {}),
      ...(ancla.ratificacion.responsable ? { responsable: ancla.ratificacion.responsable } : {}),
    });
  }
  return ok({ schema: SCHEMA_LOG_DECISIONES, modeloHash, generadoEl, entradas });
}
