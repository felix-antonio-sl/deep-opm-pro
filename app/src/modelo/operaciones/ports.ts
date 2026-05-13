import { naturalezaDeEnlace } from "../constantes";
import { entidadIdDeExtremo } from "../extremos";
import type { Apariencia, Enlace, Id, Modelo, Posicion, PuertoApariencia, Resultado } from "../tipos";
import { fallo, ok } from "./helpers";

export type LadoPuertoEnlace = "origen" | "destino";
type LadoExtremo = LadoPuertoEnlace;
type RanurasPorExtremo = Map<string, number>;

export interface AjustePuertoEnlace {
  enlaceId: Id;
  lado: LadoPuertoEnlace;
  puntoOpuesto: Posicion;
}

interface OpcionesPuertoExtremo {
  desplazamientoRanura?: number;
  portId?: Id;
  puntoOpuesto?: Posicion;
}

interface PuertoCompartidoEstado {
  portId: Id;
  puntoOpuesto: Posicion;
}

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
  const ranurasEstructurales = asignarRanurasEstructurales(modelo, opdId, aparienciasPorEntidad, enlacesEnAbanico);
  const puertosCompartidosEstado = asignarPuertosCompartidosEstado(modelo, opdId, aparienciasPorEntidad, enlacesEnAbanico);

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

    const syncOrigen = sincronizarExtremo(
      enlace,
      "origen",
      apOrigen,
      centro(apDestino),
      {
        ...puertosCompartidosEstado.get(keyExtremo(enlace.id, "origen")),
        desplazamientoRanura: ranurasEstructurales.get(keyExtremo(enlace.id, "origen")) ?? 0,
      },
    );
    const syncDestino = sincronizarExtremo(
      syncOrigen.enlace,
      "destino",
      apDestino,
      centro(apOrigen),
      {
        ...puertosCompartidosEstado.get(keyExtremo(enlace.id, "destino")),
        desplazamientoRanura: ranurasEstructurales.get(keyExtremo(enlace.id, "destino")) ?? 0,
      },
    );
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
  opciones: OpcionesPuertoExtremo = {},
): { enlace: Enlace; apariencia: Apariencia; portId: Id } {
  const campo = lado === "origen" ? "origenId" : "destinoId";
  const extremo = enlace[campo];
  if (extremo.kind !== "entidad") {
    return { enlace, apariencia, portId: puertoDeterminista(enlace.id, lado) };
  }
  const portId = opciones.portId ?? extremo.portId ?? puertoDeterminista(enlace.id, lado);
  const actual = apariencia.ports?.[portId];
  if (extremo.portId === portId && actual) {
    return { enlace, apariencia, portId };
  }
  const puerto = calcularPuertoRelativo(
    apariencia,
    opciones.puntoOpuesto ?? puntoOpuesto,
    opciones.desplazamientoRanura ?? 0,
  );
  const siguienteExtremo = extremo.portId === portId ? extremo : { ...extremo, portId };
  const siguienteEnlace = siguienteExtremo === extremo ? enlace : { ...enlace, [campo]: siguienteExtremo };
  const ports = apariencia.ports ?? {};
  const siguienteApariencia = ports[portId] && mismoPuerto(ports[portId], puerto)
    ? apariencia
    : { ...apariencia, ports: { ...ports, [portId]: puerto } };
  return { enlace: siguienteEnlace, apariencia: siguienteApariencia, portId };
}

export function actualizarPuertosEnlacesDesdePuntos(
  modelo: Modelo,
  opdId: Id,
  ajustes: readonly AjustePuertoEnlace[],
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  if (ajustes.length === 0) return ok(modelo);

  const aparienciaPorEntidad = new Map<Id, Apariencia>();
  for (const apariencia of Object.values(opd.apariencias)) {
    aparienciaPorEntidad.set(apariencia.entidadId, apariencia);
  }

  let enlaces = modelo.enlaces;
  let apariencias = opd.apariencias;

  for (const ajuste of ajustes) {
    const enlace = enlaces[ajuste.enlaceId];
    if (!enlace) continue;
    const campo = ajuste.lado === "origen" ? "origenId" : "destinoId";
    const extremo = enlace[campo];
    if (extremo.kind !== "entidad") continue;
    const entidadId = entidadIdDeExtremo(modelo, extremo);
    const apariencia = entidadId ? aparienciaPorEntidad.get(entidadId) : undefined;
    if (!apariencia) continue;

    const portId = extremo.portId ?? puertoDeterminista(enlace.id, ajuste.lado);
    const puerto = calcularPuertoRelativo(apariencia, ajuste.puntoOpuesto);
    const ports = apariencia.ports ?? {};
    const siguienteExtremo = extremo.portId === portId ? extremo : { ...extremo, portId };
    const siguienteEnlace = siguienteExtremo === extremo ? enlace : { ...enlace, [campo]: siguienteExtremo };
    const siguienteApariencia = ports[portId] && mismoPuerto(ports[portId], puerto)
      ? apariencia
      : { ...apariencia, ports: { ...ports, [portId]: puerto } };

    if (siguienteEnlace !== enlace) enlaces = { ...enlaces, [enlace.id]: siguienteEnlace };
    if (siguienteApariencia !== apariencia) {
      apariencias = { ...apariencias, [apariencia.id]: siguienteApariencia };
      aparienciaPorEntidad.set(apariencia.entidadId, siguienteApariencia);
    }
  }

  if (enlaces === modelo.enlaces && apariencias === opd.apariencias) return ok(modelo);
  return ok({
    ...modelo,
    enlaces,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias,
      },
    },
  });
}

export function calcularPuertoRelativo(
  apariencia: Apariencia,
  puntoOpuesto: Posicion,
  desplazamientoRanura = 0,
): PuertoApariencia {
  const base = {
    x: clamp01((puntoOpuesto.x - apariencia.x) / apariencia.width),
    y: clamp01((puntoOpuesto.y - apariencia.y) / apariencia.height),
  };
  return aplicarRanuraEstructural(base, desplazamientoRanura);
}

function asignarRanurasEstructurales(
  modelo: Modelo,
  opdId: Id,
  aparienciasPorEntidad: Map<Id, Apariencia>,
  enlacesEnAbanico: Set<Id>,
): RanurasPorExtremo {
  const opd = modelo.opds[opdId];
  const porApariencia = new Map<Id, string[]>();
  if (!opd) return new Map();

  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    if (enlacesEnAbanico.has(aparienciaEnlace.enlaceId)) continue;
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace || naturalezaDeEnlace(enlace.tipo) !== "estructural") continue;
    for (const lado of ["origen", "destino"] as const) {
      const extremo = lado === "origen" ? enlace.origenId : enlace.destinoId;
      if (extremo.kind !== "entidad") continue;
      const entidadId = entidadIdDeExtremo(modelo, extremo);
      const apariencia = entidadId ? aparienciasPorEntidad.get(entidadId) : undefined;
      if (!apariencia) continue;
      const actuales = porApariencia.get(apariencia.id) ?? [];
      actuales.push(keyExtremo(enlace.id, lado));
      porApariencia.set(apariencia.id, actuales);
    }
  }

  const resultado: RanurasPorExtremo = new Map();
  for (const keys of porApariencia.values()) {
    keys.sort((a, b) => a.localeCompare(b));
    keys.forEach((key, index) => resultado.set(key, deltaRanuraOpcloud(index)));
  }
  return resultado;
}

function asignarPuertosCompartidosEstado(
  modelo: Modelo,
  opdId: Id,
  aparienciasPorEntidad: Map<Id, Apariencia>,
  enlacesEnAbanico: Set<Id>,
): Map<string, PuertoCompartidoEstado> {
  const opd = modelo.opds[opdId];
  const grupos = new Map<string, Array<{ key: string; puntoOpuesto: Posicion }>>();
  if (!opd) return new Map();

  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    if (enlacesEnAbanico.has(aparienciaEnlace.enlaceId)) continue;
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;

    if (enlace.tipo === "resultado" && enlace.origenId.kind === "entidad" && enlace.destinoId.kind === "estado") {
      const procesoId = entidadIdDeExtremo(modelo, enlace.origenId);
      const objetoId = entidadIdDeExtremo(modelo, enlace.destinoId);
      if (procesoId && objetoId && modelo.entidades[procesoId]?.tipo === "proceso") {
        const objeto = aparienciasPorEntidad.get(objetoId);
        if (objeto) {
          agregarGrupoPuertoCompartido(
            grupos,
            `resultado:${procesoId}:${objetoId}:origen`,
            keyExtremo(enlace.id, "origen"),
            centroInferior(objeto),
          );
        }
      }
      continue;
    }

    if (
      (enlace.tipo === "consumo" || enlace.tipo === "agente" || enlace.tipo === "instrumento")
      && enlace.origenId.kind === "estado"
      && enlace.destinoId.kind === "entidad"
    ) {
      const objetoId = entidadIdDeExtremo(modelo, enlace.origenId);
      const procesoId = entidadIdDeExtremo(modelo, enlace.destinoId);
      if (objetoId && procesoId && modelo.entidades[procesoId]?.tipo === "proceso") {
        const objeto = aparienciasPorEntidad.get(objetoId);
        if (objeto) {
          const familia = enlace.tipo === "consumo" ? "consumo" : "agente-instrumento";
          agregarGrupoPuertoCompartido(
            grupos,
            `${familia}:${objetoId}:${procesoId}:destino`,
            keyExtremo(enlace.id, "destino"),
            centroInferior(objeto),
          );
        }
      }
    }
  }

  const resultado = new Map<string, PuertoCompartidoEstado>();
  for (const [grupoKey, items] of grupos.entries()) {
    if (items.length < 2) continue;
    const portId = `port-union-${sanitizarId(grupoKey)}`;
    for (const item of items) {
      resultado.set(item.key, { portId, puntoOpuesto: item.puntoOpuesto });
    }
  }
  return resultado;
}

function agregarGrupoPuertoCompartido(
  grupos: Map<string, Array<{ key: string; puntoOpuesto: Posicion }>>,
  grupoKey: string,
  key: string,
  puntoOpuesto: Posicion,
): void {
  const actuales = grupos.get(grupoKey) ?? [];
  actuales.push({ key, puntoOpuesto });
  grupos.set(grupoKey, actuales);
}

function aplicarRanuraEstructural(base: PuertoApariencia, desplazamiento: number): PuertoApariencia {
  if (Math.abs(desplazamiento) < 0.0001) return base;
  const lado = ladoMasCercano(base);
  if (lado === "left" || lado === "right") {
    return { x: base.x, y: redondearPuerto(clamp01(base.y + desplazamiento)) };
  }
  return { x: redondearPuerto(clamp01(base.x + desplazamiento)), y: base.y };
}

function ladoMasCercano(puerto: PuertoApariencia): "left" | "right" | "top" | "bottom" {
  const distancias = [
    ["left", puerto.x],
    ["right", 1 - puerto.x],
    ["top", puerto.y],
    ["bottom", 1 - puerto.y],
  ] as const;
  return distancias.reduce((min, item) => item[1] < min[1] ? item : min)[0];
}

function deltaRanuraOpcloud(index: number): number {
  if (index === 0) return 0;
  const magnitud = Math.min(0.9, Math.ceil(index / 2) * 0.1);
  return index % 2 === 1 ? magnitud : -magnitud;
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

function centroInferior(apariencia: Apariencia): Posicion {
  return {
    x: apariencia.x + apariencia.width / 2,
    y: apariencia.y + apariencia.height,
  };
}

function puertoDeterminista(enlaceId: Id, lado: LadoExtremo): Id {
  return `port-${enlaceId}-${lado}`;
}

function keyExtremo(enlaceId: Id, lado: LadoExtremo): string {
  return `${enlaceId}:${lado}`;
}

function sanitizarId(id: string): Id {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0.5;
  return Math.min(1, Math.max(0, value));
}

function redondearPuerto(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function mismoPuerto(a: PuertoApariencia, b: PuertoApariencia): boolean {
  return Math.abs(a.x - b.x) < 0.0001 && Math.abs(a.y - b.y) < 0.0001;
}
