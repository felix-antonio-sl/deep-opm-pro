import { naturalezaDeEnlace } from "./constantes";
import { entidadIdDeExtremo } from "./extremos";
import type { AnclajeSimboloEstructural, AnclajesSimboloEstructural, Apariencia, Enlace, Id, Modelo, Posicion } from "./tipos";

export const MITAD_SIMBOLO_ESTRUCTURAL = 15;

interface RamaSimbolo {
  aparienciaEnlaceId: Id;
  enlace: Enlace;
  refinador?: Apariencia;
}

export function anclajeRefinableSimbolo(): AnclajeSimboloEstructural {
  return { dx: 0, dy: -MITAD_SIMBOLO_ESTRUCTURAL };
}

export function anclajeRefinadorSimbolo(index: number, total: number): AnclajeSimboloEstructural {
  void index;
  void total;
  // OPCloud reutiliza un unico puerto "out" del triangulo fundamental para
  // las ramas del mismo grupo; la separacion se expresa creando otro grupo.
  return { dx: 0, dy: MITAD_SIMBOLO_ESTRUCTURAL };
}

export function anclajeSimboloConFallback(
  anclaje: AnclajeSimboloEstructural | undefined,
  fallback: AnclajeSimboloEstructural,
): AnclajeSimboloEstructural {
  const normalizado = normalizarAnclajeSimbolo(anclaje);
  return normalizado ?? { ...fallback };
}

export function normalizarAnclajeSimbolo(
  anclaje: AnclajeSimboloEstructural | undefined,
): AnclajeSimboloEstructural | null {
  if (!anclaje || !Number.isFinite(anclaje.dx) || !Number.isFinite(anclaje.dy)) return null;
  return { dx: Math.round(anclaje.dx), dy: Math.round(anclaje.dy) };
}

export function limitarAnclajeSimbolo(anclaje: AnclajeSimboloEstructural): AnclajeSimboloEstructural {
  return {
    dx: limitarOffset(anclaje.dx),
    dy: limitarOffset(anclaje.dy),
  };
}

export function anclajeSimboloHaciaPunto(
  centroSimbolo: Posicion,
  objetivo: Posicion | undefined,
  fallback: AnclajeSimboloEstructural,
): AnclajeSimboloEstructural {
  if (!objetivo || !Number.isFinite(objetivo.x) || !Number.isFinite(objetivo.y)) return { ...fallback };
  const dx = objetivo.x - centroSimbolo.x;
  const dy = objetivo.y - centroSimbolo.y;
  const interseccion = interseccionRayoTrianguloEstructural(dx, dy);
  return interseccion ?? { ...fallback };
}

export function normalizarAnclajesSimbolo(
  anclajes: AnclajesSimboloEstructural | undefined,
): AnclajesSimboloEstructural | undefined {
  if (!anclajes) return undefined;
  const refinable = normalizarAnclajeSimbolo(anclajes.refinable);
  const refinador = normalizarAnclajeSimbolo(anclajes.refinador);
  if (!refinable && !refinador) return undefined;
  return {
    ...(refinable ? { refinable } : {}),
    ...(refinador ? { refinador } : {}),
  };
}

export function mismosAnclajesSimbolo(
  a: AnclajesSimboloEstructural | undefined,
  b: AnclajesSimboloEstructural | undefined,
): boolean {
  const normalA = normalizarAnclajesSimbolo(a);
  const normalB = normalizarAnclajesSimbolo(b);
  return mismoAnclaje(normalA?.refinable, normalB?.refinable)
    && mismoAnclaje(normalA?.refinador, normalB?.refinador);
}

export function anclajesSimboloPorDefecto(
  modelo: Modelo,
  opdId: Id,
  aparienciaEnlaceIds: readonly Id[],
): Record<Id, AnclajesSimboloEstructural> {
  const opd = modelo.opds[opdId];
  if (!opd) return {};
  const ids = Array.from(new Set(aparienciaEnlaceIds));
  const items = ids.flatMap((aparienciaEnlaceId) => {
    const apariencia = opd.enlaces[aparienciaEnlaceId];
    if (!apariencia) return [];
    const enlace = modelo.enlaces[apariencia.enlaceId];
    if (!enlace || naturalezaDeEnlace(enlace.tipo) !== "estructural") return [];
    return [{ aparienciaEnlaceId, enlace }];
  });
  if (items.length === 0) return {};

  const ladoRefinable = ladoRefinableComun(modelo, items);
  const aparienciaPorEntidad = new Map(Object.values(opd.apariencias).map((apariencia) => [apariencia.entidadId, apariencia]));
  const ramas: RamaSimbolo[] = items.map((item) => {
    const extremoRefinador = ladoRefinable === "origen" ? item.enlace.destinoId : item.enlace.origenId;
    const refinadorId = entidadIdDeExtremo(modelo, extremoRefinador);
    const refinador = refinadorId ? aparienciaPorEntidad.get(refinadorId) : undefined;
    return {
      ...item,
      ...(refinador ? { refinador } : {}),
    };
  }).sort(compararRamasSimbolo);

  const resultado: Record<Id, AnclajesSimboloEstructural> = {};
  ramas.forEach((rama, index) => {
    resultado[rama.aparienciaEnlaceId] = {
      refinable: anclajeRefinableSimbolo(),
      refinador: anclajeRefinadorSimbolo(index, ramas.length),
    };
  });
  return resultado;
}

function ladoRefinableComun(modelo: Modelo, items: Array<{ enlace: Enlace }>): "origen" | "destino" {
  return ladoCompatible(modelo, items, "origen") ? "origen" : "destino";
}

function ladoCompatible(modelo: Modelo, items: Array<{ enlace: Enlace }>, lado: "origen" | "destino"): boolean {
  const keys = new Set(items.map(({ enlace }) => {
    const extremo = lado === "origen" ? enlace.origenId : enlace.destinoId;
    const refinableId = entidadIdDeExtremo(modelo, extremo);
    return refinableId ? `${enlace.tipo}:${refinableId}:${enlace.grupoEstructuralId ?? "auto"}` : "";
  }));
  return keys.size === 1 && !keys.has("");
}

function compararRamasSimbolo(a: RamaSimbolo, b: RamaSimbolo): number {
  const centroA = a.refinador ? centro(a.refinador) : null;
  const centroB = b.refinador ? centro(b.refinador) : null;
  if (centroA && centroB) return centroA.y - centroB.y || centroA.x - centroB.x || a.enlace.id.localeCompare(b.enlace.id);
  if (centroA) return -1;
  if (centroB) return 1;
  return a.enlace.id.localeCompare(b.enlace.id);
}

function centro(apariencia: Apariencia): Posicion {
  return {
    x: apariencia.x + apariencia.width / 2,
    y: apariencia.y + apariencia.height / 2,
  };
}

function mismoAnclaje(
  a: AnclajeSimboloEstructural | undefined,
  b: AnclajeSimboloEstructural | undefined,
): boolean {
  if (!a && !b) return true;
  return !!a && !!b && a.dx === b.dx && a.dy === b.dy;
}

function limitarOffset(valor: number): number {
  if (!Number.isFinite(valor)) return 0;
  return Math.max(-MITAD_SIMBOLO_ESTRUCTURAL, Math.min(MITAD_SIMBOLO_ESTRUCTURAL, Math.round(valor)));
}

interface PuntoLocal {
  x: number;
  y: number;
}

const TRIANGULO_ESTRUCTURAL_LOCAL: readonly PuntoLocal[] = [
  { x: 0, y: -MITAD_SIMBOLO_ESTRUCTURAL },
  { x: MITAD_SIMBOLO_ESTRUCTURAL, y: MITAD_SIMBOLO_ESTRUCTURAL },
  { x: -MITAD_SIMBOLO_ESTRUCTURAL, y: MITAD_SIMBOLO_ESTRUCTURAL },
];

function interseccionRayoTrianguloEstructural(dx: number, dy: number): AnclajeSimboloEstructural | null {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return null;
  if (Math.hypot(dx, dy) < 0.0001) return null;

  let mejor: { t: number; punto: PuntoLocal } | null = null;
  for (let index = 0; index < TRIANGULO_ESTRUCTURAL_LOCAL.length; index += 1) {
    const inicio = TRIANGULO_ESTRUCTURAL_LOCAL[index]!;
    const fin = TRIANGULO_ESTRUCTURAL_LOCAL[(index + 1) % TRIANGULO_ESTRUCTURAL_LOCAL.length]!;
    const segmento = { x: fin.x - inicio.x, y: fin.y - inicio.y };
    const denominador = cross({ x: dx, y: dy }, segmento);
    if (Math.abs(denominador) < 0.0001) continue;

    const t = cross(inicio, segmento) / denominador;
    const u = cross(inicio, { x: dx, y: dy }) / denominador;
    if (t < -0.0001 || u < -0.0001 || u > 1.0001) continue;
    if (!mejor || t < mejor.t) {
      mejor = {
        t,
        punto: {
          x: dx * t,
          y: dy * t,
        },
      };
    }
  }

  if (!mejor) return null;
  return {
    dx: redondearMedioPixel(mejor.punto.x),
    dy: redondearMedioPixel(mejor.punto.y),
  };
}

function cross(a: PuntoLocal, b: PuntoLocal): number {
  return a.x * b.y - a.y * b.x;
}

function redondearMedioPixel(valor: number): number {
  if (!Number.isFinite(valor)) return 0;
  const redondeado = Math.round(valor * 2) / 2;
  return Math.max(-MITAD_SIMBOLO_ESTRUCTURAL, Math.min(MITAD_SIMBOLO_ESTRUCTURAL, redondeado));
}
