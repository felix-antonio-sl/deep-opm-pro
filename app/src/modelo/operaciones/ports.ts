import { entidadIdDeExtremo } from "../extremos";
import type { Apariencia, Enlace, Id, Modelo, Posicion, PuertoApariencia } from "../tipos";

type LadoExtremo = "origen" | "destino";

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
    }
    if (syncDestino.apariencia !== apDestino) {
      apariencias = { ...apariencias, [apDestino.id]: syncDestino.apariencia };
    }
    registrarPuerto(puertosUsadosPorApariencia, apOrigen.id, syncOrigen.portId);
    registrarPuerto(puertosUsadosPorApariencia, apDestino.id, syncDestino.portId);
  }

  const aparienciasLimpias = limpiarPuertosNoUsados(apariencias, puertosUsadosPorApariencia);
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
