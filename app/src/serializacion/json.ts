import { validarFirmaEnlace } from "../modelo/operaciones";
import type {
  Afiliacion,
  Apariencia,
  AparienciaEnlace,
  Enlace,
  Entidad,
  Esencia,
  Id,
  Modelo,
  Opd,
  RefinamientoEntidad,
  Resultado,
  TipoEnlace,
  TipoEntidad,
} from "../modelo/tipos";

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

  const documento = validarDocumento(parsed);
  if (!documento.ok) return documento;
  return { ok: true, value: normalizarModelo(documento.value.modelo) };
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

function validarDocumento(value: unknown): Resultado<DocumentoModelo> {
  if (!esRecord(value) || value.formato !== FORMATO) return fallo("Documento de modelo inválido");
  const modelo = validarModelo(value.modelo);
  if (!modelo.ok) return modelo;
  return ok({ formato: FORMATO, modelo: modelo.value });
}

function validarModelo(value: unknown): Resultado<Modelo> {
  if (!esRecord(value)) return fallo("Modelo inválido");
  const { id, nombre, opdRaizId, nextSeq, opds, entidades, enlaces } = value;
  if (typeof id !== "string") return fallo("Modelo inválido: id");
  if (typeof nombre !== "string") return fallo("Modelo inválido: nombre");
  if (typeof opdRaizId !== "string") return fallo("Modelo inválido: opdRaizId");
  if (!esEnteroSeguro(nextSeq) || nextSeq < 1) return fallo("Modelo inválido: nextSeq");
  if (!esRecord(entidades)) return fallo("Modelo inválido: entidades");
  if (!esRecord(opds)) return fallo("Modelo inválido: opds");
  if (!esRecord(enlaces)) return fallo("Modelo inválido: enlaces");

  const entidadesValidadas = validarEntidades(entidades);
  if (!entidadesValidadas.ok) return entidadesValidadas;
  const opdsValidados = validarOpds(opds, entidadesValidadas.value);
  if (!opdsValidados.ok) return opdsValidados;
  if (!opdsValidados.value[opdRaizId]) return fallo(`OPD raíz no existe: ${opdRaizId}`);
  const enlacesValidados = validarEnlaces(enlaces, entidadesValidadas.value);
  if (!enlacesValidados.ok) return enlacesValidados;

  const modelo: Modelo = {
    id,
    nombre,
    opdRaizId,
    nextSeq,
    entidades: entidadesValidadas.value,
    opds: opdsValidados.value,
    enlaces: enlacesValidados.value,
  };
  const referencias = validarReferenciasOpd(modelo);
  return referencias.ok ? ok(modelo) : referencias;
}

function validarEntidades(value: Record<string, unknown>): Resultado<Record<Id, Entidad>> {
  const entidades: Record<Id, Entidad> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`Entidad inválida: ${id}`);
    if (raw.id !== id) return fallo(`Entidad inválida: ${id}.id`);
    if (!esTipoEntidad(raw.tipo)) return fallo(`Entidad inválida: ${id}.tipo`);
    if (typeof raw.nombre !== "string") return fallo(`Entidad inválida: ${id}.nombre`);
    if (!esEsencia(raw.esencia)) return fallo(`Entidad inválida: ${id}.esencia`);
    if (!esAfiliacion(raw.afiliacion)) return fallo(`Entidad inválida: ${id}.afiliacion`);
    const refinamiento = validarRefinamiento(id, raw.refinamiento);
    if (!refinamiento.ok) return refinamiento;
    if (refinamiento.value && raw.tipo !== "proceso") return fallo(`Refinamiento inválido: ${id}.tipo`);
    entidades[id] = {
      id,
      tipo: raw.tipo,
      nombre: raw.nombre,
      esencia: raw.esencia,
      afiliacion: raw.afiliacion,
      ...(refinamiento.value ? { refinamiento: refinamiento.value } : {}),
    };
  }
  return ok(entidades);
}

function validarRefinamiento(entidadId: Id, value: unknown): Resultado<RefinamientoEntidad | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Refinamiento inválido: ${entidadId}`);
  if (value.tipo !== "descomposicion") return fallo(`Refinamiento inválido: ${entidadId}.tipo`);
  if (typeof value.opdId !== "string") return fallo(`Refinamiento inválido: ${entidadId}.opdId`);
  return ok({ tipo: "descomposicion", opdId: value.opdId });
}

function validarOpds(value: Record<string, unknown>, entidades: Record<Id, Entidad>): Resultado<Record<Id, Opd>> {
  const opds: Record<Id, Opd> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`OPD inválido: ${id}`);
    if (raw.id !== id) return fallo(`OPD inválido: ${id}.id`);
    if (typeof raw.nombre !== "string") return fallo(`OPD inválido: ${id}.nombre`);
    if (raw.padreId !== undefined && raw.padreId !== null && typeof raw.padreId !== "string") {
      return fallo(`OPD inválido: ${id}.padreId`);
    }
    if (!esRecord(raw.apariencias)) return fallo(`OPD inválido: ${id}.apariencias`);
    if (!esRecord(raw.enlaces)) return fallo(`OPD inválido: ${id}.enlaces`);

    const apariencias = validarApariencias(id, raw.apariencias, entidades);
    if (!apariencias.ok) return apariencias;
    const enlaces = validarAparienciasEnlace(id, raw.enlaces);
    if (!enlaces.ok) return enlaces;
    opds[id] = {
      id,
      nombre: raw.nombre,
      padreId: raw.padreId ?? null,
      apariencias: apariencias.value,
      enlaces: enlaces.value,
    };
  }
  return ok(opds);
}

function validarApariencias(
  opdId: Id,
  value: Record<string, unknown>,
  entidades: Record<Id, Entidad>,
): Resultado<Record<Id, Apariencia>> {
  const apariencias: Record<Id, Apariencia> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`Apariencia inválida: ${id}`);
    if (raw.id !== id) return fallo(`Apariencia inválida: ${id}.id`);
    if (raw.opdId !== opdId) return fallo(`Apariencia inválida: ${id}.opdId`);
    if (typeof raw.entidadId !== "string" || !entidades[raw.entidadId]) {
      return fallo(`Apariencia inválida: ${id}.entidadId`);
    }
    if (!esNumeroFinito(raw.x)) return fallo(`Apariencia inválida: ${id}.x`);
    if (!esNumeroFinito(raw.y)) return fallo(`Apariencia inválida: ${id}.y`);
    if (!esNumeroPositivo(raw.width)) return fallo(`Apariencia inválida: ${id}.width`);
    if (!esNumeroPositivo(raw.height)) return fallo(`Apariencia inválida: ${id}.height`);
    apariencias[id] = {
      id,
      entidadId: raw.entidadId,
      opdId,
      x: raw.x,
      y: raw.y,
      width: raw.width,
      height: raw.height,
    };
  }
  return ok(apariencias);
}

function validarAparienciasEnlace(opdId: Id, value: Record<string, unknown>): Resultado<Record<Id, AparienciaEnlace>> {
  const apariencias: Record<Id, AparienciaEnlace> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`Apariencia de enlace inválida: ${id}`);
    if (raw.id !== id) return fallo(`Apariencia de enlace inválida: ${id}.id`);
    if (raw.opdId !== opdId) return fallo(`Apariencia de enlace inválida: ${id}.opdId`);
    if (typeof raw.enlaceId !== "string") return fallo(`Apariencia de enlace inválida: ${id}.enlaceId`);
    if (!Array.isArray(raw.vertices)) return fallo(`Apariencia de enlace inválida: ${id}.vertices`);
    const vertices = validarVertices(id, raw.vertices);
    if (!vertices.ok) return vertices;
    apariencias[id] = { id, enlaceId: raw.enlaceId, opdId, vertices: vertices.value };
  }
  return ok(apariencias);
}

function validarVertices(aparienciaId: Id, value: unknown[]): Resultado<Array<{ x: number; y: number }>> {
  const vertices: Array<{ x: number; y: number }> = [];
  for (const [index, raw] of value.entries()) {
    if (!esRecord(raw)) return fallo(`Vértice inválido: ${aparienciaId}[${index}]`);
    if (!esNumeroFinito(raw.x) || !esNumeroFinito(raw.y)) {
      return fallo(`Vértice inválido: ${aparienciaId}[${index}]`);
    }
    vertices.push({ x: raw.x, y: raw.y });
  }
  return ok(vertices);
}

function validarEnlaces(value: Record<string, unknown>, entidades: Record<Id, Entidad>): Resultado<Record<Id, Enlace>> {
  const enlaces: Record<Id, Enlace> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`Enlace inválido: ${id}`);
    if (raw.id !== id) return fallo(`Enlace inválido: ${id}.id`);
    if (!esTipoEnlace(raw.tipo)) return fallo(`Enlace inválido: ${id}.tipo`);
    const origenId = typeof raw.origenId === "string" ? raw.origenId : null;
    const destinoId = typeof raw.destinoId === "string" ? raw.destinoId : null;
    if (!origenId) return fallo(`Enlace inválido: ${id}.origenId`);
    if (!destinoId) return fallo(`Enlace inválido: ${id}.destinoId`);
    const origen = origenId ? entidades[origenId] : undefined;
    const destino = destinoId ? entidades[destinoId] : undefined;
    if (!origen) return fallo(`Enlace inválido: ${id}.origenId`);
    if (!destino) return fallo(`Enlace inválido: ${id}.destinoId`);
    if (origenId === destinoId) return fallo(`Enlace inválido: ${id}.self`);
    if (typeof raw.etiqueta !== "string") return fallo(`Enlace inválido: ${id}.etiqueta`);
    const firma = validarFirmaEnlace(raw.tipo, origen, destino);
    if (!firma.ok) return fallo(`Enlace inválido: ${id}.firma`);
    enlaces[id] = {
      id,
      tipo: raw.tipo,
      origenId,
      destinoId,
      etiqueta: raw.etiqueta,
    };
  }
  return ok(enlaces);
}

function validarReferenciasOpd(modelo: Modelo): Resultado<true> {
  const enlacesConApariencia = new Set<Id>();
  for (const entidad of Object.values(modelo.entidades)) {
    if (!entidad.refinamiento) continue;
    const opdRefinado = modelo.opds[entidad.refinamiento.opdId];
    if (!opdRefinado) return fallo(`Refinamiento inválido: ${entidad.id}.opdId`);
    if (!Object.values(opdRefinado.apariencias).some((apariencia) => apariencia.entidadId === entidad.id)) {
      return fallo(`Refinamiento inválido: ${entidad.id}.apariencia`);
    }
  }
  for (const [opdId, opd] of Object.entries(modelo.opds)) {
    const visibles = new Set(Object.values(opd.apariencias).map((apariencia) => apariencia.entidadId));
    for (const [aparienciaId, apariencia] of Object.entries(opd.enlaces)) {
      const enlace = modelo.enlaces[apariencia.enlaceId];
      if (!enlace) return fallo(`Apariencia de enlace inválida: ${aparienciaId}.enlaceId`);
      enlacesConApariencia.add(enlace.id);
      if (!visibles.has(enlace.origenId) || !visibles.has(enlace.destinoId)) {
        return fallo(`Apariencia de enlace inválida: ${aparienciaId}.endpoints`);
      }
      if (apariencia.opdId !== opdId) return fallo(`Apariencia de enlace inválida: ${aparienciaId}.opdId`);
    }
  }
  for (const enlaceId of Object.keys(modelo.enlaces)) {
    if (!enlacesConApariencia.has(enlaceId)) return fallo(`Enlace inválido: ${enlaceId}.apariencia`);
  }
  return ok(true);
}

function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function esTipoEntidad(value: unknown): value is TipoEntidad {
  return value === "objeto" || value === "proceso";
}

function esEsencia(value: unknown): value is Esencia {
  return value === "informacional" || value === "fisica";
}

function esAfiliacion(value: unknown): value is Afiliacion {
  return value === "sistemica" || value === "ambiental";
}

function esTipoEnlace(value: unknown): value is TipoEnlace {
  return (
    value === "agregacion" ||
    value === "agente" ||
    value === "instrumento" ||
    value === "consumo" ||
    value === "resultado" ||
    value === "efecto" ||
    value === "invocacion"
  );
}

function esNumeroFinito(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function esNumeroPositivo(value: unknown): value is number {
  return esNumeroFinito(value) && value > 0;
}

function esEnteroSeguro(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value);
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
