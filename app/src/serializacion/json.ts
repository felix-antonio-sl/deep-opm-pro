import { entidadDeExtremo, entidadIdDeExtremo, extremoEntidad, extremoVisibleEnOpd, normalizarExtremo } from "../modelo/extremos";
import { esModificador, validarMetadatosEnlace } from "../modelo/modificadores";
import { validarFirmaEnlace, validarMultiplicidad } from "../modelo/operaciones";
import { modoPlegadoApariencia, partesDePlegado } from "../modelo/plegado";
import { rutaEtiquetaNormalizada } from "../modelo/rutas";
import type {
  Afiliacion,
  Abanico,
  Apariencia,
  AparienciaEnlace,
  DerivacionEnlace,
  Enlace,
  Entidad,
  Esencia,
  Estado,
  ExtremoEnlace,
  ExtremoKind,
  Id,
  Modelo,
  ModoDespliegueObjeto,
  ModoPlegado,
  OperadorAbanico,
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
  const documento: DocumentoModelo = { formato: FORMATO, modelo: normalizarModelo(modelo) };
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
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).map(([id, enlace]) => [
      id,
      normalizarEnlace(enlace),
    ]),
  ) as Record<Id, Enlace>;
  return { ...modelo, opds, enlaces, abanicos: modelo.abanicos ?? {} };
}

function normalizarEnlace(enlace: Enlace): Enlace {
  const rutaEtiqueta = rutaEtiquetaNormalizada(enlace.rutaEtiqueta);
  return {
    ...enlace,
    origenId: normalizarExtremo(enlace.origenId),
    destinoId: normalizarExtremo(enlace.destinoId),
    ...(rutaEtiqueta ? { rutaEtiqueta } : {}),
  };
}

function validarDocumento(value: unknown): Resultado<DocumentoModelo> {
  if (!esRecord(value) || value.formato !== FORMATO) return fallo("Documento de modelo inválido");
  const modelo = validarModelo(value.modelo);
  if (!modelo.ok) return modelo;
  return ok({ formato: FORMATO, modelo: modelo.value });
}

function validarModelo(value: unknown): Resultado<Modelo> {
  if (!esRecord(value)) return fallo("Modelo inválido");
  const { id, nombre, opdRaizId, nextSeq, opds, entidades, estados, enlaces, abanicos } = value;
  if (typeof id !== "string") return fallo("Modelo inválido: id");
  if (typeof nombre !== "string") return fallo("Modelo inválido: nombre");
  if (typeof opdRaizId !== "string") return fallo("Modelo inválido: opdRaizId");
  if (!esEnteroSeguro(nextSeq) || nextSeq < 1) return fallo("Modelo inválido: nextSeq");
  if (!esRecord(entidades)) return fallo("Modelo inválido: entidades");
  if (!esRecord(opds)) return fallo("Modelo inválido: opds");
  if (!esRecord(enlaces)) return fallo("Modelo inválido: enlaces");

  const entidadesValidadas = validarEntidades(entidades);
  if (!entidadesValidadas.ok) return entidadesValidadas;
  const estadosValidados = validarEstados(estados, entidadesValidadas.value);
  if (!estadosValidados.ok) return estadosValidados;
  const opdsValidados = validarOpds(opds, entidadesValidadas.value);
  if (!opdsValidados.ok) return opdsValidados;
  if (!opdsValidados.value[opdRaizId]) return fallo(`OPD raíz no existe: ${opdRaizId}`);
  const enlacesValidados = validarEnlaces(enlaces, entidadesValidadas.value, estadosValidados.value);
  if (!enlacesValidados.ok) return enlacesValidados;
  const abanicosValidados = validarAbanicos(
    abanicos,
    opdsValidados.value,
    enlacesValidados.value,
    entidadesValidadas.value,
    estadosValidados.value,
  );
  if (!abanicosValidados.ok) return abanicosValidados;

  const modelo: Modelo = {
    id,
    nombre,
    opdRaizId,
    nextSeq,
    entidades: entidadesValidadas.value,
    estados: estadosValidados.value,
    opds: opdsValidados.value,
    enlaces: enlacesValidados.value,
    abanicos: abanicosValidados.value,
  };
  const referencias = validarReferenciasOpd(modelo);
  return referencias.ok ? ok(modelo) : referencias;
}

function validarAbanicos(
  value: unknown,
  opds: Record<Id, Opd>,
  enlaces: Record<Id, Enlace>,
  entidades: Record<Id, Entidad>,
  estados: Record<Id, Estado>,
): Resultado<Record<Id, Abanico>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: abanicos");

  const abanicos: Record<Id, Abanico> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`Abanico inválido: ${id}`);
    if (raw.id !== id) return fallo(`Abanico inválido: ${id}.id`);
    if (typeof raw.opdId !== "string" || !opds[raw.opdId]) return fallo(`Abanico inválido: ${id}.opdId`);
    if (typeof raw.puertoEntidadId !== "string" || !entidades[raw.puertoEntidadId]) {
      return fallo(`Abanico inválido: ${id}.puertoEntidadId`);
    }
    if (!esOperadorAbanico(raw.operador)) return fallo(`Abanico inválido: ${id}.operador`);
    if (!Array.isArray(raw.enlaceIds)) return fallo(`Abanico inválido: ${id}.enlaceIds`);
    const enlaceIds = raw.enlaceIds.filter((enlaceId): enlaceId is Id => typeof enlaceId === "string");
    if (enlaceIds.length !== raw.enlaceIds.length) return fallo(`Abanico inválido: ${id}.enlaceIds`);
    if (new Set(enlaceIds).size !== enlaceIds.length) return fallo(`Abanico inválido: ${id}.enlaceIds`);
    if (enlaceIds.length < 2) return fallo(`Abanico inválido: ${id}.min`);

    const miembros: Enlace[] = [];
    for (const enlaceId of enlaceIds) {
      const enlace = enlaces[enlaceId];
      if (!enlace) return fallo(`Abanico inválido: ${id}.enlaceIds`);
      if (!Object.values(opds[raw.opdId]?.enlaces ?? {}).some((apariencia) => apariencia.enlaceId === enlaceId)) {
        return fallo(`Abanico inválido: ${id}.opdId`);
      }
      miembros.push(enlace);
    }
    const tipo = miembros[0]?.tipo;
    if (!tipo || miembros.some((enlace) => enlace.tipo !== tipo)) return fallo(`Abanico inválido: ${id}.tipo`);
    const modeloParcial = modeloParaExtremos(entidades, estados);
    if (!miembros.every((enlace) => (
      entidadIdDeExtremo(modeloParcial, enlace.origenId) === raw.puertoEntidadId ||
      entidadIdDeExtremo(modeloParcial, enlace.destinoId) === raw.puertoEntidadId
    ))) {
      return fallo(`Abanico inválido: ${id}.puertoEntidadId`);
    }
    abanicos[id] = {
      id,
      opdId: raw.opdId,
      puertoEntidadId: raw.puertoEntidadId,
      operador: raw.operador,
      enlaceIds,
    };
  }

  return ok(abanicos);
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
    if (refinamiento.value?.tipo === "descomposicion" && raw.tipo !== "proceso") return fallo(`Refinamiento inválido: ${id}.tipo`);
    if (refinamiento.value?.tipo === "despliegue" && raw.tipo !== "objeto") return fallo(`Refinamiento inválido: ${id}.tipo`);
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

function validarEstados(value: unknown, entidades: Record<Id, Entidad>): Resultado<Record<Id, Estado>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: estados");

  const estados: Record<Id, Estado> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`Estado inválido: ${id}`);
    if (raw.id !== id) return fallo(`Estado inválido: ${id}.id`);
    if (typeof raw.entidadId !== "string") return fallo(`Estado inválido: ${id}.entidadId`);
    const entidad = entidades[raw.entidadId];
    if (!entidad) return fallo(`Estado inválido: ${id}.entidadId`);
    if (entidad.tipo !== "objeto") return fallo(`Estado inválido: ${id}.entidadId`);
    if (typeof raw.nombre !== "string" || raw.nombre.trim().length === 0) {
      return fallo(`Estado inválido: ${id}.nombre`);
    }
    if (raw.esInicial !== undefined && typeof raw.esInicial !== "boolean") {
      return fallo(`Estado inválido: ${id}.esInicial`);
    }
    if (raw.esFinal !== undefined && typeof raw.esFinal !== "boolean") {
      return fallo(`Estado inválido: ${id}.esFinal`);
    }
    estados[id] = {
      id,
      entidadId: raw.entidadId,
      nombre: raw.nombre.trim(),
      ...(raw.esInicial ? { esInicial: true } : {}),
      ...(raw.esFinal ? { esFinal: true } : {}),
    };
  }

  for (const entidad of Object.values(entidades).filter((item) => item.tipo === "objeto")) {
    const estadosObjeto = Object.values(estados).filter((estado) => estado.entidadId === entidad.id);
    if (estadosObjeto.length === 1) return fallo(`Estado inválido: ${entidad.id}.axioma`);
    const nombres = new Set<string>();
    for (const estado of estadosObjeto) {
      const normalizado = estado.nombre.toLocaleLowerCase("es");
      if (nombres.has(normalizado)) return fallo(`Estado inválido: ${entidad.id}.nombre`);
      nombres.add(normalizado);
    }
  }

  return ok(estados);
}

function validarRefinamiento(entidadId: Id, value: unknown): Resultado<RefinamientoEntidad | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Refinamiento inválido: ${entidadId}`);
  if (value.tipo !== "descomposicion" && value.tipo !== "despliegue") return fallo(`Refinamiento inválido: ${entidadId}.tipo`);
  if (typeof value.opdId !== "string") return fallo(`Refinamiento inválido: ${entidadId}.opdId`);
  if (value.tipo === "descomposicion") {
    if (value.modo !== undefined) return fallo(`Refinamiento inválido: ${entidadId}.modo`);
    return ok({ tipo: value.tipo, opdId: value.opdId });
  }
  const modo = validarModoDespliegue(entidadId, value.modo);
  if (!modo.ok) return modo;
  return ok({ tipo: value.tipo, opdId: value.opdId, modo: modo.value });
}

function validarModoDespliegue(entidadId: Id, value: unknown): Resultado<ModoDespliegueObjeto> {
  if (value === undefined) return ok("agregacion");
  if (esModoDespliegue(value)) return ok(value);
  return fallo(`Refinamiento inválido: ${entidadId}.modo`);
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
    const modoPlegado = validarModoPlegado(id, raw.modoPlegado);
    if (!modoPlegado.ok) return modoPlegado;
    const parteExtraidaDe = validarParteExtraidaDe(id, raw.parteExtraidaDe);
    if (!parteExtraidaDe.ok) return parteExtraidaDe;
    apariencias[id] = {
      id,
      entidadId: raw.entidadId,
      opdId,
      x: raw.x,
      y: raw.y,
      width: raw.width,
      height: raw.height,
      modoPlegado: modoPlegado.value,
      ...(parteExtraidaDe.value ? { parteExtraidaDe: parteExtraidaDe.value } : {}),
    };
  }
  return ok(apariencias);
}

function validarParteExtraidaDe(
  aparienciaId: Id,
  value: unknown,
): Resultado<Apariencia["parteExtraidaDe"] | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Apariencia inválida: ${aparienciaId}.parteExtraidaDe`);
  if (typeof value.padreAparienciaId !== "string") return fallo(`Apariencia inválida: ${aparienciaId}.parteExtraidaDe.padreAparienciaId`);
  if (typeof value.parteEntidadId !== "string") return fallo(`Apariencia inválida: ${aparienciaId}.parteExtraidaDe.parteEntidadId`);
  return ok({
    padreAparienciaId: value.padreAparienciaId,
    parteEntidadId: value.parteEntidadId,
  });
}

function validarModoPlegado(aparienciaId: Id, value: unknown): Resultado<ModoPlegado> {
  if (value === undefined) return ok("completo");
  if (value === "completo" || value === "parcial") return ok(value);
  return fallo(`Apariencia inválida: ${aparienciaId}.modoPlegado`);
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

function validarEnlaces(
  value: Record<string, unknown>,
  entidades: Record<Id, Entidad>,
  estados: Record<Id, Estado>,
): Resultado<Record<Id, Enlace>> {
  const enlaces: Record<Id, Enlace> = {};
  const modeloParcial = modeloParaExtremos(entidades, estados);
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`Enlace inválido: ${id}`);
    if (raw.id !== id) return fallo(`Enlace inválido: ${id}.id`);
    if (!esTipoEnlace(raw.tipo)) return fallo(`Enlace inválido: ${id}.tipo`);
    const origenExtremo = validarExtremoEnlace(id, "origenId", raw.origenId, entidades, estados);
    if (!origenExtremo.ok) return origenExtremo;
    const destinoExtremo = validarExtremoEnlace(id, "destinoId", raw.destinoId, entidades, estados);
    if (!destinoExtremo.ok) return destinoExtremo;
    const origen = entidadDeExtremo(modeloParcial, origenExtremo.value);
    const destino = entidadDeExtremo(modeloParcial, destinoExtremo.value);
    if (!origen) return fallo(`Enlace inválido: ${id}.origenId`);
    if (!destino) return fallo(`Enlace inválido: ${id}.destinoId`);
    if (origenExtremo.value.kind === destinoExtremo.value.kind && origenExtremo.value.id === destinoExtremo.value.id) {
      return fallo(`Enlace inválido: ${id}.self`);
    }
    if (typeof raw.etiqueta !== "string") return fallo(`Enlace inválido: ${id}.etiqueta`);
    const firma = validarFirmaEnlace(raw.tipo, origen, destino, {
      origen: origenExtremo.value,
      destino: destinoExtremo.value,
    });
    if (!firma.ok) return fallo(`Enlace inválido: ${id}.firma`);
    const derivado = validarDerivacionEnlace(id, raw.derivado);
    if (!derivado.ok) return derivado;
    const multiplicidadOrigen = validarMultiplicidadOpcional(id, "multiplicidadOrigen", raw.multiplicidadOrigen);
    if (!multiplicidadOrigen.ok) return multiplicidadOrigen;
    const multiplicidadDestino = validarMultiplicidadOpcional(id, "multiplicidadDestino", raw.multiplicidadDestino);
    if (!multiplicidadDestino.ok) return multiplicidadDestino;
    if (raw.modificador !== undefined && !esModificador(raw.modificador)) {
      return fallo(`Enlace inválido: ${id}.modificador`);
    }
    if (raw.probabilidad !== undefined && !esNumeroFinito(raw.probabilidad)) {
      return fallo(`Enlace inválido: ${id}.probabilidad`);
    }
    if (raw.demora !== undefined && typeof raw.demora !== "string") {
      return fallo(`Enlace inválido: ${id}.demora`);
    }
    const rutaEtiqueta = validarRutaEtiquetaOpcional(id, raw.rutaEtiqueta);
    if (!rutaEtiqueta.ok) return rutaEtiqueta;
    const enlace: Enlace = {
      id,
      tipo: raw.tipo,
      origenId: origenExtremo.value,
      destinoId: destinoExtremo.value,
      etiqueta: raw.etiqueta,
      ...(multiplicidadOrigen.value ? { multiplicidadOrigen: multiplicidadOrigen.value } : {}),
      ...(multiplicidadDestino.value ? { multiplicidadDestino: multiplicidadDestino.value } : {}),
      ...(raw.modificador ? { modificador: raw.modificador } : {}),
      ...(raw.probabilidad !== undefined ? { probabilidad: raw.probabilidad } : {}),
      ...(raw.demora ? { demora: raw.demora } : {}),
      ...(rutaEtiqueta.value ? { rutaEtiqueta: rutaEtiqueta.value } : {}),
      ...(derivado.value ? { derivado: derivado.value } : {}),
    };
    const metadatos = validarMetadatosEnlace(enlace);
    if (!metadatos.ok) return fallo(`Enlace inválido: ${id}.metadatos`);
    enlaces[id] = enlace;
  }
  return ok(enlaces);
}

function validarRutaEtiquetaOpcional(enlaceId: Id, value: unknown): Resultado<string | undefined> {
  if (value === undefined) return ok(undefined);
  if (typeof value !== "string") return fallo(`Enlace inválido: ${enlaceId}.rutaEtiqueta`);
  return ok(rutaEtiquetaNormalizada(value));
}

function validarExtremoEnlace(
  enlaceId: Id,
  campo: "origenId" | "destinoId",
  value: unknown,
  entidades: Record<Id, Entidad>,
  estados: Record<Id, Estado>,
): Resultado<ExtremoEnlace> {
  if (typeof value === "string") {
    if (!entidades[value]) return fallo(`Enlace inválido: ${enlaceId}.${campo}`);
    return ok(extremoEntidad(value));
  }
  if (!esRecord(value)) return fallo(`Enlace inválido: ${enlaceId}.${campo}`);
  if (!esExtremoKind(value.kind)) return fallo(`Enlace inválido: ${enlaceId}.${campo}.kind`);
  if (typeof value.id !== "string") return fallo(`Enlace inválido: ${enlaceId}.${campo}.id`);
  const extremo = normalizarExtremo({ kind: value.kind, id: value.id });
  if (extremo.kind === "entidad" && !entidades[extremo.id]) return fallo(`Enlace inválido: ${enlaceId}.${campo}.id`);
  if (extremo.kind === "estado" && !estados[extremo.id]) return fallo(`Enlace inválido: ${enlaceId}.${campo}.id`);
  return ok(extremo);
}

function validarMultiplicidadOpcional(
  enlaceId: Id,
  campo: "multiplicidadOrigen" | "multiplicidadDestino",
  value: unknown,
): Resultado<string | undefined> {
  if (value === undefined) return ok(undefined);
  if (typeof value !== "string" || !validarMultiplicidad(value)) return fallo(`Enlace inválido: ${enlaceId}.${campo}`);
  return ok(value);
}

function validarDerivacionEnlace(enlaceId: Id, value: unknown): Resultado<DerivacionEnlace | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Enlace inválido: ${enlaceId}.derivado`);
  if (value.tipo !== "enlace-externo-refinamiento") return fallo(`Enlace inválido: ${enlaceId}.derivado.tipo`);
  if (typeof value.refinamientoId !== "string") return fallo(`Enlace inválido: ${enlaceId}.derivado.refinamientoId`);
  if (typeof value.enlacePadreId !== "string") return fallo(`Enlace inválido: ${enlaceId}.derivado.enlacePadreId`);
  if (value.origen !== undefined && value.origen !== "automatico" && value.origen !== "manual") {
    return fallo(`Enlace inválido: ${enlaceId}.derivado.origen`);
  }
  return ok({
    tipo: "enlace-externo-refinamiento",
    refinamientoId: value.refinamientoId,
    enlacePadreId: value.enlacePadreId,
    origen: value.origen ?? "automatico",
  });
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
  for (const enlace of Object.values(modelo.enlaces)) {
    if (!enlace.derivado) continue;
    if (!modelo.entidades[enlace.derivado.refinamientoId]?.refinamiento) {
      return fallo(`Enlace inválido: ${enlace.id}.derivado.refinamientoId`);
    }
    if (!modelo.enlaces[enlace.derivado.enlacePadreId]) {
      return fallo(`Enlace inválido: ${enlace.id}.derivado.enlacePadreId`);
    }
  }
  for (const [opdId, opd] of Object.entries(modelo.opds)) {
    const extraidas = validarAparienciasExtraidas(modelo, opd);
    if (!extraidas.ok) return extraidas;
    for (const [aparienciaId, apariencia] of Object.entries(opd.enlaces)) {
      const enlace = modelo.enlaces[apariencia.enlaceId];
      if (!enlace) return fallo(`Apariencia de enlace inválida: ${aparienciaId}.enlaceId`);
      enlacesConApariencia.add(enlace.id);
      if (!endpointVisibleEnOpd(modelo, opd, enlace.origenId) || !endpointVisibleEnOpd(modelo, opd, enlace.destinoId)) {
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

function endpointVisibleEnOpd(modelo: Modelo, opd: Opd, extremo: ExtremoEnlace): boolean {
  if (extremoVisibleEnOpd(modelo, opd, extremo)) return true;
  const entidadId = entidadIdDeExtremo(modelo, extremo);
  if (!entidadId) return false;
  return Object.values(opd.apariencias).some((apariencia) => {
    if (modoPlegadoApariencia(apariencia) !== "parcial") return false;
    return partesDePlegado(modelo, apariencia.entidadId).some((parte) => parte.entidadId === entidadId);
  });
}

function validarAparienciasExtraidas(modelo: Modelo, opd: Opd): Resultado<true> {
  for (const [aparienciaId, apariencia] of Object.entries(opd.apariencias)) {
    const extraida = apariencia.parteExtraidaDe;
    if (!extraida) continue;
    const padre = opd.apariencias[extraida.padreAparienciaId];
    if (!padre) return fallo(`Apariencia inválida: ${aparienciaId}.parteExtraidaDe.padreAparienciaId`);
    if (modoPlegadoApariencia(padre) !== "parcial") return fallo(`Apariencia inválida: ${aparienciaId}.parteExtraidaDe.padreAparienciaId`);
    if (extraida.parteEntidadId !== apariencia.entidadId) return fallo(`Apariencia inválida: ${aparienciaId}.parteExtraidaDe.parteEntidadId`);
    if (!partesDePlegado(modelo, padre.entidadId).some((parte) => parte.entidadId === extraida.parteEntidadId)) {
      return fallo(`Apariencia inválida: ${aparienciaId}.parteExtraidaDe.parteEntidadId`);
    }
  }
  return ok(true);
}

function modeloParaExtremos(entidades: Record<Id, Entidad>, estados: Record<Id, Estado>): Modelo {
  return {
    id: "modelo-validacion",
    nombre: "modelo-validacion",
    opdRaizId: "opd-validacion",
    opds: {},
    entidades,
    estados,
    enlaces: {},
    nextSeq: 1,
  };
}

function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function esExtremoKind(value: unknown): value is ExtremoKind {
  return value === "entidad" || value === "estado";
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
    value === "exhibicion" ||
    value === "generalizacion" ||
    value === "clasificacion" ||
    value === "agente" ||
    value === "instrumento" ||
    value === "consumo" ||
    value === "resultado" ||
    value === "efecto" ||
    value === "invocacion"
  );
}

function esOperadorAbanico(value: unknown): value is OperadorAbanico {
  return value === "O" || value === "XOR";
}

function esModoDespliegue(value: unknown): value is ModoDespliegueObjeto {
  return value === "agregacion" || value === "exhibicion" || value === "generalizacion" || value === "clasificacion";
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
