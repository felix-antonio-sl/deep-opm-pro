import type { AnclaNormativa, NotaMesa, EstadoAncla, EstadoRatificacion, EstadoSatisfaccionRequisito, Id, Modelo, NivelAutoridad, RatificacionAncla, ReferenciaNorma, Resultado, SatisfaccionRequisito } from "../modelo/tipos";
import { esRequisito } from "../modelo/estereotipos";
import { esRecord, fallo, ok } from "./validarHelpers";

export function validarSatisfaccionesRequisito(
  value: unknown,
  entidades: Modelo["entidades"],
  enlaces: Modelo["enlaces"],
): Resultado<Record<Id, SatisfaccionRequisito>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: satisfaccionesRequisito");
  const satisfacciones: Record<Id, SatisfaccionRequisito> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw) || raw.id !== id) return fallo(`Satisfacción de requisito inválida: ${id}`);
    if (typeof raw.requisitoEntidadId !== "string" || !esRequisito(entidades[raw.requisitoEntidadId])) {
      return fallo(`Satisfacción de requisito inválida: ${id}.requisitoEntidadId`);
    }
    if (!esRecord(raw.target) || (raw.target.tipo !== "entidad" && raw.target.tipo !== "enlace") || typeof raw.target.id !== "string") {
      return fallo(`Satisfacción de requisito inválida: ${id}.target`);
    }
    if (raw.target.tipo === "entidad" && !entidades[raw.target.id]) return fallo(`Satisfacción de requisito inválida: ${id}.target.id`);
    if (raw.target.tipo === "enlace" && !enlaces[raw.target.id]) return fallo(`Satisfacción de requisito inválida: ${id}.target.id`);
    if (!esEstadoSatisfaccion(raw.estado)) return fallo(`Satisfacción de requisito inválida: ${id}.estado`);
    satisfacciones[id] = {
      id,
      requisitoEntidadId: raw.requisitoEntidadId,
      target: { tipo: raw.target.tipo, id: raw.target.id },
      estado: raw.estado,
      ...(typeof raw.descripcion === "string" && raw.descripcion.trim() ? { descripcion: raw.descripcion.trim() } : {}),
    };
  }
  return ok(satisfacciones);
}

/**
 * Valida `anclasNormativas` (W5.1). Extensión aditiva: ausente ⇒ `{}` (byte-identidad
 * sobre opcional ausente). Cada ancla exige `claveProto` presente, `estado` legal y
 * `target` RESOLUBLE contra entidades/enlaces/opds (o `tipo:"modelo"` sin id). Un target
 * irresoluble se RECHAZA con diagnóstico (no se descarta en silencio — L8 fixture negativo).
 */
export function validarAnclasNormativas(
  value: unknown,
  entidades: Modelo["entidades"],
  enlaces: Modelo["enlaces"],
  opds: Modelo["opds"],
): Resultado<Record<Id, AnclaNormativa>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: anclasNormativas");
  const anclas: Record<Id, AnclaNormativa> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw) || raw.id !== id) return fallo(`Ancla normativa inválida: ${id}`);
    if (typeof raw.claveProto !== "string" || !raw.claveProto.trim()) {
      return fallo(`Ancla normativa inválida: ${id}.claveProto`);
    }
    if (!esEstadoAncla(raw.estado)) return fallo(`Ancla normativa inválida: ${id}.estado`);
    const target = validarTargetAncla(id, raw.target, entidades, enlaces, opds);
    if (!target.ok) return target;
    const referencias = validarReferenciasNorma(id, raw.referencias);
    if (!referencias.ok) return referencias;
    const ratificacion = validarRatificacionAncla(id, raw.ratificacion);
    if (!ratificacion.ok) return ratificacion;
    anclas[id] = {
      id,
      claveProto: raw.claveProto.trim(),
      target: target.value,
      estado: raw.estado,
      ...(referencias.value.length > 0 ? { referencias: referencias.value } : {}),
      ...(typeof raw.nota === "string" && raw.nota.trim() ? { nota: raw.nota.trim() } : {}),
      ...(ratificacion.value ? { ratificacion: ratificacion.value } : {}),
    };
  }
  return ok(anclas);
}

/**
 * Valida `notasMesa` (W6.5-a). Extensión aditiva: ausente ⇒ `{}` (byte-identidad sobre
 * opcional ausente). Cada nota exige `texto` y `fecha` presentes y `target` RESOLUBLE
 * (mismo contrato que las anclas: irresoluble se RECHAZA con diagnóstico, no silencio).
 */
export function validarNotasMesa(
  value: unknown,
  entidades: Modelo["entidades"],
  enlaces: Modelo["enlaces"],
  opds: Modelo["opds"],
): Resultado<Record<Id, NotaMesa>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: notasMesa");
  const notas: Record<Id, NotaMesa> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw) || raw.id !== id) return fallo(`Nota de mesa inválida: ${id}`);
    if (typeof raw.texto !== "string" || !raw.texto.trim()) return fallo(`Nota de mesa inválida: ${id}.texto`);
    if (typeof raw.fecha !== "string" || !raw.fecha.trim()) return fallo(`Nota de mesa inválida: ${id}.fecha`);
    const target = validarTargetAncla(id, raw.target, entidades, enlaces, opds);
    if (!target.ok) return target;
    notas[id] = { id, target: target.value, texto: raw.texto.trim(), fecha: raw.fecha.trim() };
  }
  return ok(notas);
}

function validarTargetAncla(
  id: Id,
  value: unknown,
  entidades: Modelo["entidades"],
  enlaces: Modelo["enlaces"],
  opds: Modelo["opds"],
): Resultado<AnclaNormativa["target"]> {
  if (!esRecord(value)) return fallo(`Ancla normativa inválida: ${id}.target`);
  if (value.tipo === "modelo") return ok({ tipo: "modelo" });
  if (typeof value.id !== "string") return fallo(`Ancla normativa inválida: ${id}.target`);
  if (value.tipo === "entidad") {
    if (!entidades[value.id]) return fallo(`Ancla normativa con target irresoluble: ${id}.target.id (entidad ${value.id})`);
    return ok({ tipo: "entidad", id: value.id });
  }
  if (value.tipo === "enlace") {
    if (!enlaces[value.id]) return fallo(`Ancla normativa con target irresoluble: ${id}.target.id (enlace ${value.id})`);
    return ok({ tipo: "enlace", id: value.id });
  }
  if (value.tipo === "opd") {
    if (!opds[value.id]) return fallo(`Ancla normativa con target irresoluble: ${id}.target.id (opd ${value.id})`);
    return ok({ tipo: "opd", id: value.id });
  }
  return fallo(`Ancla normativa inválida: ${id}.target.tipo`);
}

function validarReferenciasNorma(id: Id, value: unknown): Resultado<ReferenciaNorma[]> {
  if (value === undefined) return ok([]);
  if (!Array.isArray(value)) return fallo(`Ancla normativa inválida: ${id}.referencias`);
  const referencias: ReferenciaNorma[] = [];
  for (const item of value) {
    if (!esRecord(item) || typeof item.norma !== "string" || !item.norma.trim()) {
      return fallo(`Ancla normativa inválida: ${id}.referencias.norma`);
    }
    if (item.articulos !== undefined && (!Array.isArray(item.articulos) || item.articulos.some((a: unknown) => typeof a !== "string"))) {
      return fallo(`Ancla normativa inválida: ${id}.referencias.articulos`);
    }
    const articulos = Array.isArray(item.articulos) ? (item.articulos as string[]).map((a) => a.trim()).filter((a) => a) : [];
    referencias.push({
      norma: item.norma.trim(),
      ...(articulos.length > 0 ? { articulos } : {}),
      ...(typeof item.seccion === "string" && item.seccion.trim() ? { seccion: item.seccion.trim() } : {}),
    });
  }
  return ok(referencias);
}

function validarRatificacionAncla(id: Id, value: unknown): Resultado<RatificacionAncla | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Ancla normativa inválida: ${id}.ratificacion`);
  if (!esNivelAutoridad(value.nivelAutoridad)) return fallo(`Ancla normativa inválida: ${id}.ratificacion.nivelAutoridad`);
  if (!esEstadoRatificacion(value.estadoRatificacion)) return fallo(`Ancla normativa inválida: ${id}.ratificacion.estadoRatificacion`);
  // `ratificado-con-fuente` exige fuente (C1): el salto a hecho confirmado no existe sin fuente.
  if (value.estadoRatificacion === "ratificado-con-fuente" && (typeof value.fuente !== "string" || !value.fuente.trim())) {
    return fallo(`Ancla normativa inválida: ${id}.ratificacion.fuente (obligatoria para ratificado-con-fuente)`);
  }
  return ok({
    nivelAutoridad: value.nivelAutoridad,
    estadoRatificacion: value.estadoRatificacion,
    ...(typeof value.fuente === "string" && value.fuente.trim() ? { fuente: value.fuente.trim() } : {}),
    ...(typeof value.responsable === "string" && value.responsable.trim() ? { responsable: value.responsable.trim() } : {}),
    ...(typeof value.anotadoEn === "string" && value.anotadoEn.trim() ? { anotadoEn: value.anotadoEn.trim() } : {}),
    ...(typeof value.ratificadoEn === "string" && value.ratificadoEn.trim() ? { ratificadoEn: value.ratificadoEn.trim() } : {}),
  });
}

function esEstadoAncla(value: unknown): value is EstadoAncla {
  return value === "vigente" || value === "pendiente-ratificacion";
}

function esNivelAutoridad(value: unknown): value is NivelAutoridad {
  return value === "operador-modelado" || value === "mesa" || value === "dt-seremi-legal";
}

function esEstadoRatificacion(value: unknown): value is EstadoRatificacion {
  return value === "pendiente" || value === "anotado-en-mesa" || value === "ratificado-con-fuente";
}

function esEstadoSatisfaccion(value: unknown): value is EstadoSatisfaccionRequisito {
  return value === "pendiente" || value === "satisface" || value === "parcial" || value === "no-satisface";
}
