import { CANON } from "../modelo/constantes";
import type { Apariencia, Posicion } from "../modelo/tipos";

/**
 * Layout radial para apariencias traidas.
 *
 * SSOT: [Met §multi-OPD] traer conectados solo agrega apariencias al OPD
 * activo. [Glos 3.6] apariencia como proyeccion visual. [JOYAS §2] conserva
 * dimensiones canonicas 135x60 para cosas OPCloud.
 */

export interface CajaLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OpcionesLayoutRadial {
  width?: number;
  height?: number;
  minDistance?: number;
  intentosPorRadio?: number;
  radioInicial?: number;
  pasoRadio?: number;
}

export function layoutRadial(
  centro: Posicion,
  cantidad: number,
  ocupadas: readonly CajaLayout[] = [],
  opciones: OpcionesLayoutRadial = {},
): Posicion[] {
  if (cantidad <= 0) return [];
  const width = opciones.width ?? CANON.dims.cosaWidth;
  const height = opciones.height ?? CANON.dims.cosaHeight;
  const minDistance = opciones.minDistance ?? 12;
  const intentosPorRadio = opciones.intentosPorRadio ?? 12;
  const pasoRadio = opciones.pasoRadio ?? 40;
  const radioBase = opciones.radioInicial ?? Math.max(120, 60 + 30 * cantidad);
  const posiciones: Posicion[] = [];
  const cajas = [...ocupadas];

  for (let index = 0; index < cantidad; index += 1) {
    const anguloBase = (-Math.PI / 2) + (2 * Math.PI * index) / cantidad;
    let elegido: Posicion | null = null;
    for (let expansion = 0; expansion < 8 && !elegido; expansion += 1) {
      const radio = radioBase + expansion * pasoRadio;
      for (let intento = 0; intento < intentosPorRadio; intento += 1) {
        const angulo = anguloBase + (intento * Math.PI) / 6;
        const candidato = {
          x: Math.round(centro.x + Math.cos(angulo) * radio - width / 2),
          y: Math.round(centro.y + Math.sin(angulo) * radio - height / 2),
        };
        const caja = { ...candidato, width, height };
        if (!cajas.some((ocupada) => intersectan(expandir(ocupada, minDistance), caja))) {
          elegido = candidato;
          break;
        }
      }
    }
    const posicion = elegido ?? posicionEspiral(centro, index, width, height, radioBase + pasoRadio * 8);
    posiciones.push(posicion);
    cajas.push({ ...posicion, width, height });
  }

  return posiciones;
}

export function centroApariencia(apariencia: Pick<Apariencia, "x" | "y" | "width" | "height">): Posicion {
  return {
    x: apariencia.x + apariencia.width / 2,
    y: apariencia.y + apariencia.height / 2,
  };
}

function posicionEspiral(centro: Posicion, index: number, width: number, height: number, radio: number): Posicion {
  const columna = index % 4;
  const fila = Math.floor(index / 4);
  return {
    x: Math.round(centro.x - width / 2 + (columna - 1.5) * (width + 24)),
    y: Math.round(centro.y - height / 2 + radio + fila * (height + 24)),
  };
}

function expandir(caja: CajaLayout, padding: number): CajaLayout {
  return {
    x: caja.x - padding,
    y: caja.y - padding,
    width: caja.width + padding * 2,
    height: caja.height + padding * 2,
  };
}

function intersectan(a: CajaLayout, b: CajaLayout): boolean {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}
