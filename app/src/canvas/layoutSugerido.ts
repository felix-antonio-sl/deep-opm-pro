import { entidadIdDeExtremo } from "../modelo/extremos";
import { CANON } from "../modelo/constantes";
import { moverAparienciaPorId } from "../modelo/operaciones";
import type { Apariencia, Id, Modelo, Posicion, Resultado } from "../modelo/tipos";

/**
 * Layout sugerido para el OPD activo (Sugerir layout / Aplicar layout).
 *
 * Algoritmo: layered top-down por niveles segun grafo de enlaces procedurales.
 * - Nivel 0: apariencias sin enlaces entrantes (fuentes / raices).
 * - Nivel n: apariencias alcanzadas desde nivel n-1.
 * - Apariencias huerfanas (sin enlaces) caen al ultimo nivel.
 * - Cada nivel se distribuye horizontalmente con paso fijo.
 *
 * Decision deliberada (vs OpCloud): OpCloud no incluye autolayout integrado;
 * los modeladores reorganizan a mano. Aca lo exponemos como accion explicita
 * para acelerar la primera puesta en pagina sin sobrescribir trabajo previo
 * sin consentimiento. La accion permanece undoable atomicamente desde el store.
 *
 * No persiste sin invocacion explicita: la funcion es pura. Quien decide si
 * aplicar es la accion del store o la UI (preview vs apply).
 */
export interface OpcionesLayoutSugerido {
  /** Coordenada X del primer nivel. Default 80. */
  origenX?: number;
  /** Coordenada Y del primer nivel. Default 80. */
  origenY?: number;
  /** Separacion horizontal entre apariencias del mismo nivel. Default 60. */
  gapHorizontal?: number;
  /** Separacion vertical entre niveles. Default 100. */
  gapVertical?: number;
}

export interface PosicionSugerida {
  aparienciaId: Id;
  x: number;
  y: number;
}

export function calcularLayoutSugerido(
  modelo: Modelo,
  opdId: Id,
  opciones: OpcionesLayoutSugerido = {},
): PosicionSugerida[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const apariencias = Object.values(opd.apariencias);
  if (apariencias.length === 0) return [];

  const origenX = opciones.origenX ?? 80;
  const origenY = opciones.origenY ?? 80;
  const gapH = opciones.gapHorizontal ?? 60;
  const gapV = opciones.gapVertical ?? 100;

  const aparienciaPorEntidad = new Map<Id, Apariencia>();
  for (const apariencia of apariencias) aparienciaPorEntidad.set(apariencia.entidadId, apariencia);

  // Grafo dirigido entidad->entidad solo con enlaces que aparecen en este OPD.
  const aristas: Array<{ origen: Id; destino: Id }> = [];
  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (!origen || !destino || origen === destino) continue;
    if (!aparienciaPorEntidad.has(origen) || !aparienciaPorEntidad.has(destino)) continue;
    aristas.push({ origen, destino });
  }

  const entradasPorEntidad = new Map<Id, number>();
  const salidasPorEntidad = new Map<Id, Id[]>();
  for (const apariencia of apariencias) {
    entradasPorEntidad.set(apariencia.entidadId, 0);
    salidasPorEntidad.set(apariencia.entidadId, []);
  }
  for (const arista of aristas) {
    entradasPorEntidad.set(arista.destino, (entradasPorEntidad.get(arista.destino) ?? 0) + 1);
    salidasPorEntidad.get(arista.origen)?.push(arista.destino);
  }

  // BFS por niveles: cola arranca con todas las raices conectadas (sin
  // entradas pero con al menos una salida). Apariencias totalmente sin
  // enlaces visibles caen al ultimo nivel (huerfanas), separadas del flujo.
  const nivelPorEntidad = new Map<Id, number>();
  const cola: Id[] = [];
  for (const apariencia of apariencias) {
    const entradas = entradasPorEntidad.get(apariencia.entidadId) ?? 0;
    const salidas = (salidasPorEntidad.get(apariencia.entidadId) ?? []).length;
    if (entradas === 0 && salidas > 0) {
      nivelPorEntidad.set(apariencia.entidadId, 0);
      cola.push(apariencia.entidadId);
    }
  }
  while (cola.length > 0) {
    const actual = cola.shift()!;
    const nivelActual = nivelPorEntidad.get(actual) ?? 0;
    const vecinos = salidasPorEntidad.get(actual) ?? [];
    for (const vecino of vecinos) {
      const nivelExistente = nivelPorEntidad.get(vecino);
      const candidato = nivelActual + 1;
      if (nivelExistente === undefined || candidato > nivelExistente) {
        nivelPorEntidad.set(vecino, candidato);
        cola.push(vecino);
      }
    }
  }

  // Apariencias en ciclos puros (sin raiz alcanzable) caen al ultimo nivel.
  let nivelMaximo = 0;
  for (const nivel of nivelPorEntidad.values()) {
    if (nivel > nivelMaximo) nivelMaximo = nivel;
  }
  const huerfanas: Id[] = [];
  for (const apariencia of apariencias) {
    if (!nivelPorEntidad.has(apariencia.entidadId)) huerfanas.push(apariencia.entidadId);
  }
  if (huerfanas.length > 0) {
    nivelMaximo += 1;
    for (const id of huerfanas) nivelPorEntidad.set(id, nivelMaximo);
  }

  // Agrupa apariencias por nivel preservando orden estable (id alfabetico).
  const aparienciasPorNivel = new Map<number, Apariencia[]>();
  for (const apariencia of apariencias) {
    const nivel = nivelPorEntidad.get(apariencia.entidadId) ?? 0;
    if (!aparienciasPorNivel.has(nivel)) aparienciasPorNivel.set(nivel, []);
    aparienciasPorNivel.get(nivel)!.push(apariencia);
  }
  for (const lista of aparienciasPorNivel.values()) {
    lista.sort((a, b) => a.id.localeCompare(b.id, "es-CL"));
  }

  const posiciones: PosicionSugerida[] = [];
  for (const [nivel, lista] of [...aparienciasPorNivel.entries()].sort((a, b) => a[0] - b[0])) {
    const y = origenY + nivel * gapV;
    let x = origenX;
    for (const apariencia of lista) {
      posiciones.push({ aparienciaId: apariencia.id, x: Math.round(x), y: Math.round(y) });
      x += apariencia.width + gapH;
    }
  }

  return posiciones;
}

/**
 * Aplica las posiciones sugeridas al modelo via moverAparienciaPorId.
 * Devuelve el modelo modificado (Resultado<Modelo>) sin tocar el store; el
 * caller decide si commitear (undoable) o descartar.
 */
export function aplicarLayoutSugerido(
  modelo: Modelo,
  opdId: Id,
  opciones: OpcionesLayoutSugerido = {},
): Resultado<Modelo> {
  const posiciones = calcularLayoutSugerido(modelo, opdId, opciones);
  if (posiciones.length === 0) return { ok: true, value: modelo };
  let siguiente = modelo;
  for (const { aparienciaId, x, y } of posiciones) {
    const apariencia = siguiente.opds[opdId]?.apariencias[aparienciaId];
    if (!apariencia) continue;
    if (apariencia.x === x && apariencia.y === y) continue;
    const resultado = moverAparienciaPorId(siguiente, opdId, aparienciaId, { x, y });
    if (!resultado.ok) return resultado;
    siguiente = resultado.value;
  }
  return { ok: true, value: siguiente };
}

/** Helper: dimension total que ocuparia el preview (sin mutar). */
export function dimensionesLayoutSugerido(
  modelo: Modelo,
  opdId: Id,
  opciones: OpcionesLayoutSugerido = {},
): { width: number; height: number; nivelesUsados: number } {
  const posiciones = calcularLayoutSugerido(modelo, opdId, opciones);
  if (posiciones.length === 0) return { width: 0, height: 0, nivelesUsados: 0 };
  const opd = modelo.opds[opdId];
  let maxX = 0;
  let maxY = 0;
  const nivelesY = new Set<number>();
  for (const pos of posiciones) {
    const apariencia = opd?.apariencias[pos.aparienciaId];
    const w = apariencia?.width ?? CANON.dims.cosaWidth;
    const h = apariencia?.height ?? CANON.dims.cosaHeight;
    nivelesY.add(pos.y);
    if (pos.x + w > maxX) maxX = pos.x + w;
    if (pos.y + h > maxY) maxY = pos.y + h;
  }
  return { width: maxX, height: maxY, nivelesUsados: nivelesY.size };
}

export type Posicion2D = Posicion;
