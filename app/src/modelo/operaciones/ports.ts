import { entidadIdDeExtremo } from "../extremos";
import type { Apariencia, Enlace, Id, Modelo, Posicion, PuertoApariencia } from "../tipos";

type LadoExtremo = "origen" | "destino";
type PuertoPerimetro = { portId: Id; puerto: PuertoApariencia; s: number };

const GAP_PUERTO_PX = 24;

/**
 * Materializa ports dinámicos por enlace al estilo OPCloud
 * (`OpmEntity.findClosestEmptyPort`). Es aditivo y determinista: modelos
 * antiguos sin `portId` ganan ports renderizables sin migración previa.
 */
export function sincronizarPuertosEnlaces(modelo: Modelo, opdId: Id): Modelo {
  const opd = modelo.opds[opdId];
  if (!opd) return modelo;

  const aparienciasPorEntidad = new Map<Id, Apariencia>();
  for (const apariencia of Object.values(opd.apariencias)) {
    aparienciasPorEntidad.set(apariencia.entidadId, apariencia);
  }
  const enlacesEnAbanico = new Set(
    Object.values(modelo.abanicos ?? {})
      .filter((abanico) => abanico.opdId === opdId)
      .flatMap((abanico) => abanico.enlaceIds),
  );

  let enlaces = modelo.enlaces;
  let apariencias = opd.apariencias;
  const puertosUsadosPorApariencia = new Map<Id, Set<Id>>();

  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    if (enlacesEnAbanico.has(aparienciaEnlace.enlaceId)) continue;
    const enlace = enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (!origen || !destino) continue;
    const apOrigen = aparienciasPorEntidad.get(origen);
    const apDestino = aparienciasPorEntidad.get(destino);
    if (!apOrigen || !apDestino || apOrigen.id === apDestino.id) continue;

    const syncOrigen = sincronizarExtremo(enlace, "origen", apOrigen, centro(apDestino));
    const syncDestino = sincronizarExtremo(syncOrigen.enlace, "destino", apDestino, centro(apOrigen));
    if (syncDestino.enlace !== enlace) {
      enlaces = { ...enlaces, [enlace.id]: syncDestino.enlace };
    }
    if (syncOrigen.apariencia !== apOrigen) {
      apariencias = { ...apariencias, [apOrigen.id]: syncOrigen.apariencia };
      aparienciasPorEntidad.set(origen, syncOrigen.apariencia);
    }
    if (syncDestino.apariencia !== apDestino) {
      apariencias = { ...apariencias, [apDestino.id]: syncDestino.apariencia };
      aparienciasPorEntidad.set(destino, syncDestino.apariencia);
    }
    registrarPuerto(puertosUsadosPorApariencia, apOrigen.id, syncOrigen.portId);
    registrarPuerto(puertosUsadosPorApariencia, apDestino.id, syncDestino.portId);
  }

  const aparienciasDistribuidas = distribuirPuertosCercanos(apariencias, puertosUsadosPorApariencia);
  const aparienciasLimpias = limpiarPuertosNoUsados(aparienciasDistribuidas, puertosUsadosPorApariencia);
  if (enlaces === modelo.enlaces && aparienciasLimpias === opd.apariencias) return modelo;

  return {
    ...modelo,
    enlaces,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: aparienciasLimpias,
      },
    },
  };
}

export function sincronizarPuertosTodosLosOpd(modelo: Modelo): Modelo {
  return Object.keys(modelo.opds).reduce((actual, opdId) => sincronizarPuertosEnlaces(actual, opdId), modelo);
}

function sincronizarExtremo(
  enlace: Enlace,
  lado: LadoExtremo,
  apariencia: Apariencia,
  puntoOpuesto: Posicion,
): { enlace: Enlace; apariencia: Apariencia; portId: Id } {
  const campo = lado === "origen" ? "origenId" : "destinoId";
  const extremo = enlace[campo];
  if (extremo.kind !== "entidad") {
    return { enlace, apariencia, portId: puertoDeterminista(enlace.id, lado) };
  }
  const portId = extremo.portId ?? puertoDeterminista(enlace.id, lado);
  const puerto = calcularPuertoRelativo(apariencia, puntoOpuesto);
  const siguienteExtremo = extremo.portId === portId ? extremo : { ...extremo, portId };
  const siguienteEnlace = siguienteExtremo === extremo ? enlace : { ...enlace, [campo]: siguienteExtremo };
  const ports = apariencia.ports ?? {};
  const actual = ports[portId];
  const siguienteApariencia = actual && mismoPuerto(actual, puerto)
    ? apariencia
    : { ...apariencia, ports: { ...ports, [portId]: puerto } };
  return { enlace: siguienteEnlace, apariencia: siguienteApariencia, portId };
}

export function calcularPuertoRelativo(apariencia: Apariencia, puntoOpuesto: Posicion): PuertoApariencia {
  return {
    x: clamp01((puntoOpuesto.x - apariencia.x) / apariencia.width),
    y: clamp01((puntoOpuesto.y - apariencia.y) / apariencia.height),
  };
}

function limpiarPuertosNoUsados(
  apariencias: Record<Id, Apariencia>,
  usados: Map<Id, Set<Id>>,
): Record<Id, Apariencia> {
  let resultado = apariencias;
  for (const [id, apariencia] of Object.entries(apariencias)) {
    if (!apariencia.ports) continue;
    const mantener = usados.get(id) ?? new Set<Id>();
    const entries = Object.entries(apariencia.ports).filter(([portId]) => mantener.has(portId));
    if (entries.length === Object.keys(apariencia.ports).length) continue;
    const siguiente: Apariencia = { ...apariencia };
    if (entries.length > 0) siguiente.ports = Object.fromEntries(entries);
    else delete siguiente.ports;
    resultado = { ...resultado, [id]: siguiente };
  }
  return resultado;
}

function distribuirPuertosCercanos(
  apariencias: Record<Id, Apariencia>,
  usados: Map<Id, Set<Id>>,
): Record<Id, Apariencia> {
  let resultado = apariencias;
  for (const [aparienciaId, apariencia] of Object.entries(apariencias)) {
    if (!apariencia.ports) continue;
    const mantener = usados.get(aparienciaId);
    if (!mantener || mantener.size < 2) continue;

    let siguientePorts = apariencia.ports;
    for (let pass = 0; pass < 3; pass += 1) {
      let cambioEnPass = false;
      const aparienciaActual = { ...apariencia, ports: siguientePorts };
      for (const cluster of clusterizarPuertosCercanos(aparienciaActual, mantener)) {
        if (cluster.length < 2) continue;
        const distribuidos = distribuirCluster(aparienciaActual, cluster);
        for (const [portId, puerto] of distribuidos) {
          const actual = siguientePorts[portId];
          if (actual && mismoPuerto(actual, puerto)) continue;
          siguientePorts = { ...siguientePorts, [portId]: puerto };
          cambioEnPass = true;
        }
      }
      if (!cambioEnPass) break;
    }
    if (siguientePorts !== apariencia.ports) {
      resultado = { ...resultado, [aparienciaId]: { ...apariencia, ports: siguientePorts } };
    }
  }
  return resultado;
}

function clusterizarPuertosCercanos(
  apariencia: Apariencia,
  usados: Set<Id>,
): Array<PuertoPerimetro[]> {
  const ordenados = Object.entries(apariencia.ports ?? {})
    .filter(([portId]) => usados.has(portId))
    .map(([portId, puerto]) => ({ portId, puerto, s: posicionPerimetral(apariencia, puerto) }))
    .sort((a, b) => a.s - b.s || a.portId.localeCompare(b.portId));
  const clusters: PuertoPerimetro[][] = [];
  for (const item of ordenados) {
    const ultimoCluster = clusters[clusters.length - 1];
    const ultimoItem = ultimoCluster?.[ultimoCluster.length - 1];
    if (!ultimoCluster || !ultimoItem || item.s - ultimoItem.s >= GAP_PUERTO_PX) {
      clusters.push([item]);
    } else {
      ultimoCluster.push(item);
    }
  }
  const first = clusters[0];
  const last = clusters[clusters.length - 1];
  const perimeter = perimetro(apariencia);
  if (clusters.length > 1 && first && last) {
    const firstItem = first[0];
    const lastItem = last[last.length - 1];
    if (firstItem && lastItem && firstItem.s + perimeter - lastItem.s < GAP_PUERTO_PX) {
      clusters[0] = [...last, ...first];
      clusters.pop();
    }
  }
  return clusters;
}

function distribuirCluster(
  apariencia: Apariencia,
  cluster: PuertoPerimetro[],
): Array<[Id, PuertoApariencia]> {
  const perimeter = perimetro(apariencia);
  const ordenados = desenvolverCluster(cluster, perimeter);
  const centroGrupo = ordenados.reduce((acc, item) => acc + item.s, 0) / ordenados.length;
  const ancho = Math.min(perimeter - GAP_PUERTO_PX, GAP_PUERTO_PX * (ordenados.length - 1));
  const gap = ordenados.length > 1 ? ancho / (ordenados.length - 1) : 0;
  const start = centroGrupo - ancho / 2;
  return ordenados.map((item, index) => [
    item.portId,
    puertoDesdePerimetro(apariencia, modulo(start + gap * index, perimeter)),
  ]);
}

function desenvolverCluster(cluster: PuertoPerimetro[], perimeter: number): PuertoPerimetro[] {
  const ordenados = [...cluster].sort((a, b) => a.s - b.s || a.portId.localeCompare(b.portId));
  if (ordenados.length < 2) return ordenados;
  if (ordenados[ordenados.length - 1]!.s - ordenados[0]!.s <= perimeter / 2) return ordenados;
  return ordenados
    .map((item) => ({ ...item, s: item.s < perimeter / 2 ? item.s + perimeter : item.s }))
    .sort((a, b) => a.s - b.s || a.portId.localeCompare(b.portId));
}

function posicionPerimetral(apariencia: Apariencia, puerto: PuertoApariencia): number {
  const width = Math.max(1, apariencia.width);
  const height = Math.max(1, apariencia.height);
  const x = clamp01(puerto.x) * width;
  const y = clamp01(puerto.y) * height;
  const distTop = y;
  const distRight = width - x;
  const distBottom = height - y;
  const distLeft = x;
  const min = Math.min(distTop, distRight, distBottom, distLeft);
  if (min === distTop) return x;
  if (min === distRight) return width + y;
  if (min === distBottom) return width + height + (width - x);
  return 2 * width + height + (height - y);
}

function puertoDesdePerimetro(apariencia: Apariencia, s: number): PuertoApariencia {
  const width = Math.max(1, apariencia.width);
  const height = Math.max(1, apariencia.height);
  if (s <= width) return { x: s / width, y: 0 };
  if (s <= width + height) return { x: 1, y: (s - width) / height };
  if (s <= 2 * width + height) return { x: 1 - (s - width - height) / width, y: 1 };
  return { x: 0, y: 1 - (s - 2 * width - height) / height };
}

function perimetro(apariencia: Apariencia): number {
  return 2 * (Math.max(1, apariencia.width) + Math.max(1, apariencia.height));
}

function modulo(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function registrarPuerto(map: Map<Id, Set<Id>>, aparienciaId: Id, portId: Id): void {
  const actuales = map.get(aparienciaId) ?? new Set<Id>();
  actuales.add(portId);
  map.set(aparienciaId, actuales);
}

function centro(apariencia: Apariencia): Posicion {
  return {
    x: apariencia.x + apariencia.width / 2,
    y: apariencia.y + apariencia.height / 2,
  };
}

function puertoDeterminista(enlaceId: Id, lado: LadoExtremo): Id {
  return `port-${enlaceId}-${lado}`;
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0.5;
  return Math.min(1, Math.max(0, value));
}

function mismoPuerto(a: PuertoApariencia, b: PuertoApariencia): boolean {
  return Math.abs(a.x - b.x) < 0.0001 && Math.abs(a.y - b.y) < 0.0001;
}
