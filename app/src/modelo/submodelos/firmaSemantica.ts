/**
 * Proyección SEMÁNTICA de un `Modelo` — el subset que la firma del Centinela (y la firma de
 * snapshot de submodelos) hashea. Firma SIGNIFICADO, no PRESENTACIÓN.
 *
 * Doctrina y partición RATIFICADAS: `docs/auditorias/2026-06-26-acta-quietud-firma-centinela.md`
 * (iteración 3 «firma semántica» + «Ratificación HITL del custodio (Félix, 2026-06-27)»).
 *
 * Por qué: el Centinela solo vale si NO grita cuando nada cambió. La firma cruda mezclaba
 * coords/tamaño/`modoPlegado`/ports con tipos/nombres/enlaces; un round-trip de persistencia o un
 * re-layout reescribían la representación sin cambio semántico ⇒ falso-divergente, riesgo de PRIMER
 * orden (un grito de lobo reclasifica el oráculo a ruido). Proyectar el significado disuelve quietud
 * Y re-layout de raíz: es «`ordenarJson` terminado» — ignorar no solo el orden de claves, sino todo
 * lo que no es la cosa.
 *
 * PARTICIÓN = SINGLE SOURCE OF TRUTH. Cada tipo declara un mapa `Record<keyof T, ClaseCampo>` que es
 * exhaustivo POR CONSTRUCCIÓN: si se agrega un campo al tipo y no se clasifica aquí, el TYPECHECK
 * falla (la `Ley de partición` lo refuerza en runtime). `firmado` ⇒ entra a la firma; `excluido` ⇒
 * presentación / fuera del alcance del snapshot. Los `id` y las claves de los `Record` se conservan
 * (identidad referencial) — `id` se clasifica `firmado`.
 *
 * Frontera de naturaleza (regla del custodio para campos futuros): geometría/visual = `excluido`;
 * estructura/relación/valor = `firmado`.
 */
import type {
  Abanico,
  Apariencia,
  AparienciaEnlace,
  Entidad,
  Enlace,
  Estado,
  ExtremoEnlace,
  Id,
  Modelo,
  Opd,
} from "../tipos";

export type ClaseCampo = "firmado" | "excluido";

/**
 * Entidad — la cosa OPM. Significado: tipo/esencia/afiliación, nombre/alias/unidad/descripción,
 * refinamientos, atributo+slot, simulación, estereotipo, anclaje (relación viva), requisito, urls,
 * linealidad, tipos fundamentales ordenados. Presentación: imagen, layout de estados.
 */
export const PARTICION_ENTIDAD: Record<keyof Entidad, ClaseCampo> = {
  id: "firmado",
  tipo: "firmado",
  nombre: "firmado",
  esencia: "firmado",
  afiliacion: "firmado",
  refinamientos: "firmado",
  alias: "firmado",
  unidad: "firmado",
  esAtributo: "firmado",
  valorSlot: "firmado",
  simulacion: "firmado",
  descripcion: "firmado",
  estereotipoId: "firmado",
  anclaje: "firmado",
  requisito: "firmado",
  urls: "firmado",
  lineal: "firmado",
  orderedFundamentalTypes: "firmado",
  imagen: "excluido",
  layoutEstados: "excluido",
};

/**
 * Estado — designación + duración + orden = significado. Supresión y geometría (x/y/w/h) =
 * presentación. `entidadId` es identidad referencial (qué objeto lo posee) ⇒ firmado.
 */
export const PARTICION_ESTADO: Record<keyof Estado, ClaseCampo> = {
  id: "firmado",
  entidadId: "firmado",
  nombre: "firmado",
  esInicial: "firmado",
  esFinal: "firmado",
  designaciones: "firmado",
  duracion: "firmado",
  orden: "firmado",
  suprimido: "excluido",
  width: "excluido",
  height: "excluido",
  x: "excluido",
  y: "excluido",
};

/**
 * Enlace — tipo, extremos, etiqueta, multiplicidad, modificador, probabilidad/demora/tasa/tiempos,
 * requisitos, grupos estructurales, estados de transición y procedencia de escisión/derivación =
 * significado completo. Presentación: ruta de etiqueta, flag de mostrar requisitos.
 */
export const PARTICION_ENLACE: Record<keyof Enlace, ClaseCampo> = {
  id: "firmado",
  tipo: "firmado",
  origenId: "firmado",
  destinoId: "firmado",
  etiqueta: "firmado",
  multiplicidadOrigen: "firmado",
  multiplicidadDestino: "firmado",
  modificador: "firmado",
  subtipoModificador: "firmado",
  probabilidad: "firmado",
  demora: "firmado",
  backwardTag: "firmado",
  requisitos: "firmado",
  tasa: "firmado",
  unidadesTasa: "firmado",
  tiempoMaximo: "firmado",
  unidadTiempoMaximo: "firmado",
  tiempoMinimo: "firmado",
  unidadTiempoMinimo: "firmado",
  grupoEstructuralId: "firmado",
  estadoEntradaId: "firmado",
  estadoSalidaId: "firmado",
  efectoEscindido: "firmado",
  derivado: "firmado",
  rutaEtiqueta: "excluido",
  mostrarRequisitos: "excluido",
};

/**
 * Abanico — estructura semántica del fan (operador XOR/OR + miembros + cosa común + decisión).
 * `puertoComun` se firma PARCIALMENTE: `entidadId`+`lado` son significado; `portId` es referencia a
 * un puerto visual (presentación, como `Apariencia.ports`, que regenera y dispararía falso-positivo)
 * ⇒ la proyección lo descarta (ver `proyectarAbanico`). `puertoEntidadId` es alias derivado.
 */
export const PARTICION_ABANICO: Record<keyof Abanico, ClaseCampo> = {
  id: "firmado",
  opdId: "firmado",
  puertoComun: "firmado",
  puertoEntidadId: "firmado",
  operador: "firmado",
  enlaceIds: "firmado",
  decision: "firmado",
};

/**
 * OPD — jerarquía (padreId), orden temporal de in-zoom (ordenInzoom), nombre y vista = significado.
 * Las apariencias (geometría de cosas) y los enlaces (AparienciaEnlace = geometría de enlaces) y el
 * orden local de hermanos = presentación. La jerarquía de refinamiento se preserva por
 * `padreId`+`ordenInzoom`+`Entidad.refinamientos`, NO por las apariencias.
 */
export const PARTICION_OPD: Record<keyof Opd, ClaseCampo> = {
  id: "firmado",
  nombre: "firmado",
  padreId: "firmado",
  preguntaGuia: "excluido",
  vista: "firmado",
  ordenInzoom: "firmado",
  apariencias: "excluido",
  enlaces: "excluido",
  ordenLocal: "excluido",
};

/** Apariencia — ENTERA presentación (geometría de la cosa en un OPD). No entra a la firma. */
export const PARTICION_APARIENCIA: Record<keyof Apariencia, ClaseCampo> = {
  id: "excluido",
  entidadId: "excluido",
  opdId: "excluido",
  x: "excluido",
  y: "excluido",
  width: "excluido",
  height: "excluido",
  modoTamano: "excluido",
  modoPlegado: "excluido",
  ordenPartes: "excluido",
  parteExtraidaDe: "excluido",
  contextoRefinamiento: "excluido",
  ports: "excluido",
  estadosSuprimidos: "excluido",
};

/** AparienciaEnlace — ENTERA presentación (geometría del enlace en un OPD). No entra a la firma. */
export const PARTICION_APARIENCIA_ENLACE: Record<keyof AparienciaEnlace, ClaseCampo> = {
  id: "excluido",
  enlaceId: "excluido",
  opdId: "excluido",
  vertices: "excluido",
  symbolPos: "excluido",
  symbolAnchors: "excluido",
  labelPositions: "excluido",
};

/**
 * Modelo (nivel raíz) — se firma id/nombre/opdRaizId + las colecciones (proyectadas). Aquí
 * `excluido` significa «fuera del alcance del snapshot» (no necesariamente presentación): se
 * mantiene el alcance de HOY (la firma cruda ya omitía ontología, estereotipos-catálogo, sellos,
 * submodelos, versiones, archivado, nextSeq). Nota de alcance: `Modelo.estereotipos` (el catálogo)
 * NO se firma aunque `Entidad.estereotipoId` sí — frontera heredada, registrada para ratificación.
 */
export const PARTICION_MODELO: Record<keyof Modelo, ClaseCampo> = {
  id: "firmado",
  nombre: "firmado",
  opdRaizId: "firmado",
  opds: "firmado",
  entidades: "firmado",
  estados: "firmado",
  enlaces: "firmado",
  abanicos: "firmado",
  descripcion: "excluido",
  ontologia: "excluido",
  satisfaccionesRequisito: "excluido",
  declaracionesNoNucleares: "excluido",
  anclasNormativas: "excluido",
  notasMesa: "excluido",
  estereotipos: "excluido",
  procedencia: "excluido",
  fichaTrabajo: "excluido",
  lentesConocimiento: "excluido",
  submodelos: "excluido",
  referenciaPadreSubmodelo: "excluido",
  archivado: "excluido",
  archivadoEn: "excluido",
  versiones: "excluido",
  crearVersionAlGuardar: "excluido",
  nextSeq: "excluido",
};

/** Claves `firmado` de una partición (deriva de la SSOT; consumida por proyección y por la ley). */
export function camposFirmados<T>(particion: Record<keyof T, ClaseCampo>): (keyof T)[] {
  return (Object.keys(particion) as (keyof T)[]).filter((k) => particion[k] === "firmado");
}

/** Proyecta un objeto a sus campos `firmado` definidos (omite `undefined`: irrelevante para el hash). */
function proyectar<T extends object>(obj: T, particion: Record<keyof T, ClaseCampo>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(particion) as (keyof T)[]) {
    if (particion[k] === "firmado" && obj[k] !== undefined) out[k as string] = obj[k];
  }
  return out;
}

/** Abanico con `puertoComun` reducido a su parte semántica (descarta `portId`, puerto visual). */
function proyectarAbanico(a: Abanico): Record<string, unknown> {
  const out = proyectar(a, PARTICION_ABANICO);
  if (a.puertoComun) out.puertoComun = { entidadId: a.puertoComun.entidadId, lado: a.puertoComun.lado };
  return out;
}

function mapRecord<V>(rec: Record<string, V>, f: (v: V) => Record<string, unknown>): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = {};
  for (const [k, v] of Object.entries(rec)) out[k] = f(v);
  return out;
}

/**
 * Proyección semántica del modelo completo: lo único que la firma hashea. Las claves de cada
 * `Record` (ids de entidades/estados/enlaces/opds/abanicos) se conservan = identidad referencial.
 */
export function proyectarSemantico(modelo: Modelo): Record<string, unknown> {
  return {
    id: modelo.id,
    nombre: modelo.nombre,
    opdRaizId: modelo.opdRaizId,
    opds: mapRecord(modelo.opds, (o) => proyectar(o, PARTICION_OPD)),
    entidades: mapRecord(modelo.entidades, (e) => proyectar(e, PARTICION_ENTIDAD)),
    estados: mapRecord(modelo.estados, (s) => proyectar(s, PARTICION_ESTADO)),
    enlaces: mapRecord(modelo.enlaces, (l) => proyectar(l, PARTICION_ENLACE)),
    abanicos: mapRecord(modelo.abanicos ?? {}, proyectarAbanico),
  };
}

/** Indexa items con `id` en un `Record` keyado por id (identidad referencial; orden-libre tras `ordenarJson`). */
function indexarPorId<T extends { id: Id }>(
  items: T[],
  f: (v: T) => Record<string, unknown>,
): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = {};
  for (const item of items) out[item.id] = f(item);
  return out;
}

/** `true` si un extremo de enlace incide en la pieza: la entidad-pieza misma o uno de sus estados. */
function incideEnPieza(extremo: ExtremoEnlace, piezaId: Id, estadoIds: ReadonlySet<Id>): boolean {
  return (
    (extremo.kind === "entidad" && extremo.id === piezaId) ||
    (extremo.kind === "estado" && estadoIds.has(extremo.id))
  );
}

/**
 * Proyección semántica de la VECINDAD RADIO-1 de una Pieza (C4) — el subset que la firma de PIEZA
 * hashea. Frontera RATIFICADA por el custodio:
 *   (a) la entidad-pieza (`piezaId`);
 *   (b) sus estados (`entidadId === piezaId`);
 *   (c) sus enlaces incidentes (origen O destino resuelven a la pieza o a uno de sus estados);
 *   (d) abanicos cuyos `enlaceIds` intersecten esos enlaces incidentes.
 *
 * Los VECINOS entran por ID, no por contenido: un enlace incidente trae el id del otro extremo
 * (campo `firmado` del enlace), pero la entidad vecina NO se proyecta ⇒ renombrar un vecino NO mueve
 * la firma de la pieza. Reusa `proyectar` + las `PARTICION_*` (misma SSOT que la firma de biblioteca):
 * una mutación de un campo `firmado` de la pieza / sus estados / un enlace incidente mueve la firma;
 * una mutación de una pieza AJENA no la toca. Eso es lo que mata el ruido «toda la biblioteca cambió».
 *
 * Devuelve `null` si `piezaId` no existe en la biblioteca (lo usa el caller para mapear «pieza
 * ausente»: el caller decide el veredicto —`divergente`, no `no-resuelto`— porque la biblioteca SÍ
 * se leyó).
 */
export function proyectarSemanticoPieza(biblioteca: Modelo, piezaId: Id): Record<string, unknown> | null {
  const pieza = biblioteca.entidades[piezaId];
  if (!pieza) return null;

  const estados = Object.values(biblioteca.estados).filter((s) => s.entidadId === piezaId);
  const estadoIds = new Set<Id>(estados.map((s) => s.id));

  const enlacesIncidentes = Object.values(biblioteca.enlaces).filter(
    (l) => incideEnPieza(l.origenId, piezaId, estadoIds) || incideEnPieza(l.destinoId, piezaId, estadoIds),
  );
  const enlaceIdsIncidentes = new Set<Id>(enlacesIncidentes.map((l) => l.id));

  const abanicosIncidentes = Object.values(biblioteca.abanicos ?? {}).filter((a) =>
    a.enlaceIds.some((id) => enlaceIdsIncidentes.has(id)),
  );

  return {
    piezaId,
    pieza: proyectar(pieza, PARTICION_ENTIDAD),
    estados: indexarPorId(estados, (s) => proyectar(s, PARTICION_ESTADO)),
    enlaces: indexarPorId(enlacesIncidentes, (l) => proyectar(l, PARTICION_ENLACE)),
    abanicos: indexarPorId(abanicosIncidentes, proyectarAbanico),
  };
}
