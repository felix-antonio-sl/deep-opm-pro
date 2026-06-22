import { normalizarExtremo } from "../modelo/extremos";
import { rutaEtiquetaNormalizada } from "../modelo/rutas";
import type {
  Apariencia,
  Entidad,
  Enlace,
  Id,
  Modelo,
  VersionResumen,
} from "../modelo/tipos";
import { esRecord } from "./validarGuards";

/**
 * Normalizadores lossless del documento JSON OPM.
 *
 * Consumidores conocidos: `serializacion/json.ts` y tests de serializacion.
 * Anclaje: OPCloud concentra toJson/fromJson en
 * `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/json.model.ts:15`
 * y normaliza antes de emitir JSON; aqui se conserva el formato v0 propio.
 */

export function normalizarModelo(modelo: Modelo): Modelo {
  const opds = Object.fromEntries(
    Object.entries(modelo.opds).map(([id, opd]) => {
      // Política import-02: el árbol OPD se sana colgando de la raíz cualquier OPD
      // con padreId inválido (BACKWARD-COMPAT: nunca rechaza — documentos legacy sin
      // padreId hidratan). Pero el saneamiento de un padreId NO benigno (declarado y
      // colgante: apunta a un OPD inexistente o a sí mismo) deja de ser SILENCIOSO:
      // se avisa para que la corrupción del árbol sea visible. El caso benigno
      // (padreId ausente/null en documentos previos al campo) se sana sin ruido.
      const padreInvalidoVisible =
        id !== modelo.opdRaizId &&
        opd.padreId != null &&
        (opd.padreId === id || !modelo.opds[opd.padreId]);
      if (padreInvalidoVisible) {
        console.warn(`[normalizar] OPD "${id}" declara padreId "${opd.padreId}" colgante (inexistente o auto-referencia); se sana colgándolo de la raíz "${modelo.opdRaizId}".`);
      }
      const padreId = id === modelo.opdRaizId
        ? null
        : opd.padreId && opd.padreId !== id && modelo.opds[opd.padreId]
          ? opd.padreId
          : modelo.opdRaizId;
      const apariencias = Object.fromEntries(
        Object.entries(opd.apariencias).map(([aparienciaId, apariencia]) => [aparienciaId, apariencia]),
      ) as Record<Id, Apariencia>;
      return [id, { ...opd, padreId, apariencias }];
    }),
  );
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).map(([id, enlace]) => [
      id,
      normalizarEnlace(enlace),
    ]),
  ) as Record<Id, Enlace>;
  const entidades = Object.fromEntries(
    Object.entries(modelo.entidades).map(([id, entidad]) => [id, normalizarEntidad(entidad)]),
  ) as Record<Id, Entidad>;
  const versiones = normalizarVersiones(modelo.versiones);
  return {
    id: modelo.id,
    nombre: modelo.nombre,
    opdRaizId: modelo.opdRaizId,
    entidades,
    estados: modelo.estados,
    nextSeq: modelo.nextSeq,
    opds,
    enlaces,
    abanicos: modelo.abanicos ?? {},
    ...(modelo.ontologia ? { ontologia: modelo.ontologia } : {}),
    ...(modelo.satisfaccionesRequisito ? { satisfaccionesRequisito: modelo.satisfaccionesRequisito } : {}),
    // W5.1: extensión meta del autor; allowlist condicional (ausente/{} ⇒ no se emite = byte-identidad).
    ...(modelo.anclasNormativas && Object.keys(modelo.anclasNormativas).length > 0 ? { anclasNormativas: modelo.anclasNormativas } : {}),
    // W6.5-a: notas de mesa; allowlist condicional (ausente/{} ⇒ no se emite = byte-identidad).
    ...(modelo.notasMesa && Object.keys(modelo.notasMesa).length > 0 ? { notasMesa: modelo.notasMesa } : {}),
    // D6: catálogo de estereotipos; allowlist condicional (ausente/{} ⇒ no se emite = byte-identidad).
    ...(modelo.estereotipos && Object.keys(modelo.estereotipos).length > 0 ? { estereotipos: modelo.estereotipos } : {}),
    // W5.3/L6: sello de procedencia; allowlist condicional (ausente ⇒ no se emite = byte-identidad).
    ...(modelo.procedencia ? { procedencia: modelo.procedencia } : {}),
    ...(modelo.submodelos ? { submodelos: modelo.submodelos } : {}),
    ...(modelo.referenciaPadreSubmodelo ? { referenciaPadreSubmodelo: modelo.referenciaPadreSubmodelo } : {}),
    ...(modelo.archivado ? { archivado: true } : {}),
    ...(typeof modelo.archivadoEn === "string" ? { archivadoEn: modelo.archivadoEn } : {}),
    ...(versiones.length > 0 ? { versiones } : {}),
    ...(modelo.crearVersionAlGuardar ? { crearVersionAlGuardar: true } : {}),
  };
}

export function normalizarEntidad(entidad: Entidad): Entidad {
  if (!entidad.imagen) return entidad;
  const { cache: _cache, ...imagen } = entidad.imagen;
  return { ...entidad, imagen };
}

export function normalizarEnlace(enlace: Enlace): Enlace {
  const rutaEtiqueta = rutaEtiquetaNormalizada(enlace.rutaEtiqueta);
  const backwardTag = textoOpcional(enlace.backwardTag);
  const requisitos = textoOpcional(enlace.requisitos);
  const tasa = textoOpcional(enlace.tasa);
  const unidadesTasa = tasa ? textoOpcional(enlace.unidadesTasa) : undefined;
  const tiempoMinimo = textoOpcional(enlace.tiempoMinimo);
  const unidadTiempoMinimo = tiempoMinimo ? textoOpcional(enlace.unidadTiempoMinimo) : undefined;
  const tiempoMaximo = textoOpcional(enlace.tiempoMaximo);
  const unidadTiempoMaximo = tiempoMaximo ? textoOpcional(enlace.unidadTiempoMaximo) : undefined;
  const grupoEstructuralId = typeof enlace.grupoEstructuralId === "string" && enlace.grupoEstructuralId.trim()
    ? enlace.grupoEstructuralId.trim()
    : undefined;
  const {
    rutaEtiqueta: _rutaEtiqueta,
    grupoEstructuralId: _grupoEstructuralId,
    backwardTag: _backwardTag,
    requisitos: _requisitos,
    mostrarRequisitos: _mostrarRequisitos,
    tasa: _tasa,
    unidadesTasa: _unidadesTasa,
    tiempoMinimo: _tiempoMinimo,
    unidadTiempoMinimo: _unidadTiempoMinimo,
    tiempoMaximo: _tiempoMaximo,
    unidadTiempoMaximo: _unidadTiempoMaximo,
    ...base
  } = enlace;
  return {
    ...base,
    origenId: normalizarExtremo(enlace.origenId),
    destinoId: normalizarExtremo(enlace.destinoId),
    ...(rutaEtiqueta ? { rutaEtiqueta } : {}),
    ...(backwardTag ? { backwardTag } : {}),
    ...(requisitos ? { requisitos } : {}),
    ...(requisitos && enlace.mostrarRequisitos ? { mostrarRequisitos: true } : {}),
    ...(tasa ? { tasa } : {}),
    ...(tasa && unidadesTasa ? { unidadesTasa } : {}),
    ...(tiempoMinimo ? { tiempoMinimo } : {}),
    ...(tiempoMinimo && unidadTiempoMinimo ? { unidadTiempoMinimo } : {}),
    ...(tiempoMaximo ? { tiempoMaximo } : {}),
    ...(tiempoMaximo && unidadTiempoMaximo ? { unidadTiempoMaximo } : {}),
    ...(grupoEstructuralId ? { grupoEstructuralId } : {}),
  };
}

function textoOpcional(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function normalizarVersiones(value: unknown): VersionResumen[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((raw): VersionResumen | null => {
      if (!esRecord(raw) ||
        typeof raw.id !== "string" ||
        typeof raw.creadoEn !== "string" ||
        typeof raw.nombre !== "string" ||
        typeof raw.modeloPayloadKey !== "string" ||
        typeof raw.bytes !== "number") {
        return null;
      }
      return {
        id: raw.id,
        creadoEn: raw.creadoEn,
        nombre: raw.nombre,
        ...(typeof raw.descripcion === "string" ? { descripcion: raw.descripcion } : {}),
        ...(raw.preservar === true ? { preservar: true } : {}),
        modeloPayloadKey: raw.modeloPayloadKey,
        bytes: raw.bytes,
      };
    })
    .filter((version): version is VersionResumen => version !== null);
}
