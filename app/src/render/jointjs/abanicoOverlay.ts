import { CANON } from "../../modelo/constantes";
import { entidadIdDeExtremo } from "../../modelo/extremos";
import type { Abanico, Apariencia, Id, Modelo, Opd, Posicion, TipoEntidad } from "../../modelo/tipos";
import type { JointCellJson } from "./proyeccion";

// Radios canonicos del arco logico (ver opm-extracted shared.ts:5908-5912):
// XOR = un solo arco a r=30; O = dos arcos concentricos a r=30 y r=35.
const RADIO_INTERNO = 30;
const RADIO_EXTERNO = 35;
const PADDING_CELL = 8;
const STROKE_DASHARRAY = "4 1";

export interface GeometriaAbanico {
  d: string;
  position: Posicion;
  size: { width: number; height: number };
}

export function calcularGeometriaAbanicoDesdePuntos(args: {
  dock: Posicion;
  // Un punto sample por rama, a ~RADIO_INTERNO sobre cada link real
  // (proviene de linkView.getPointAtLength en sync con LinkView). Los
  // angulos del arco se calculan desde el dock a estos puntos, igual que
  // OpCloud (shared.ts:5039-5051).
  puntosOtros: Posicion[];
  operador: "O" | "XOR";
}): GeometriaAbanico | null {
  if (args.puntosOtros.length < 2) return null;
  const angulos = args.puntosOtros.map((p) => anguloDesdeDock(args.dock, p));
  const { startAngle, endAngle } = angulosExtremos(angulos);

  const radioMax = args.operador === "O" ? RADIO_EXTERNO : RADIO_INTERNO;
  const padding = radioMax + PADDING_CELL;
  const cellOrigen: Posicion = { x: args.dock.x - padding, y: args.dock.y - padding };
  const tamano = padding * 2;
  const centroLocal: Posicion = { x: padding, y: padding };

  const arcoInterno = describeArc(centroLocal, RADIO_INTERNO, startAngle, endAngle);
  const d = args.operador === "O"
    ? `${arcoInterno} ${describeArc(centroLocal, RADIO_EXTERNO, startAngle, endAngle)}`
    : arcoInterno;

  return {
    d,
    position: cellOrigen,
    size: { width: tamano, height: tamano },
  };
}

export function calcularGeometriaAbanico(args: {
  aparienciaPuerto: Apariencia;
  tipoEntidadPuerto: TipoEntidad;
  centrosOtros: Posicion[];
  operador: "O" | "XOR";
}): GeometriaAbanico | null {
  if (args.centrosOtros.length < 2) return null;
  // Cold render (sin paper aun): aproximamos el dock con interseccion
  // recta-elipse/rect. La sincronizacion definitiva se hace desde el
  // LinkView una vez existe el paper (abanicoLinkViewSync).
  const dock = puntoDockEnPuerto(args.aparienciaPuerto, args.tipoEntidadPuerto, args.centrosOtros);
  return calcularGeometriaAbanicoDesdePuntos({
    dock,
    puntosOtros: args.centrosOtros,
    operador: args.operador,
  });
}

export function proyectarOverlayAbanicoCanonico(args: {
  modelo: Modelo;
  opd: Opd;
  abanico: Abanico;
  aparienciaPuerto: Apariencia;
  aparienciaPorEntidad: Map<Id, Apariencia>;
}): JointCellJson[] {
  const tipoPuerto = args.modelo.entidades[args.abanico.puertoEntidadId]?.tipo;
  if (!tipoPuerto) return [];
  const centrosOtros = centrosOtrosExtremos(args);
  const geometria = calcularGeometriaAbanico({
    aparienciaPuerto: args.aparienciaPuerto,
    tipoEntidadPuerto: tipoPuerto,
    centrosOtros,
    operador: args.abanico.operador,
  });
  if (!geometria) return [];

  return [{
    id: `overlay-abanico-${args.abanico.id}`,
    type: "opm.AbanicoArc",
    position: geometria.position,
    size: geometria.size,
    attrs: {
      body: {
        d: geometria.d,
        fill: "none",
        stroke: CANON.colores.enlace,
        strokeWidth: 1.5,
        strokeDasharray: STROKE_DASHARRAY,
        strokeLinecap: "round",
        cursor: "default",
      },
    },
    opm: {
      kind: "overlay-abanico",
      opdId: args.abanico.opdId,
      abanicoId: args.abanico.id,
      operador: args.abanico.operador,
    },
    z: 5,
  }];
}

function centrosOtrosExtremos(args: {
  modelo: Modelo;
  abanico: Abanico;
  aparienciaPorEntidad: Map<Id, Apariencia>;
}): Posicion[] {
  const centros: Posicion[] = [];
  for (const enlaceId of args.abanico.enlaceIds) {
    const enlace = args.modelo.enlaces[enlaceId];
    if (!enlace) continue;
    const origenEntId = entidadIdDeExtremo(args.modelo, enlace.origenId);
    const destinoEntId = entidadIdDeExtremo(args.modelo, enlace.destinoId);
    if (!origenEntId || !destinoEntId) continue;
    const otroEntId = origenEntId === args.abanico.puertoEntidadId ? destinoEntId : origenEntId;
    const otroAp = args.aparienciaPorEntidad.get(otroEntId);
    if (!otroAp) continue;
    centros.push({
      x: otroAp.x + otroAp.width / 2,
      y: otroAp.y + otroAp.height / 2,
    });
  }
  return centros;
}

// Punto de convergencia: interseccion del borde de la entidad puerto con la
// recta que une su centro al centroide de los otros extremos. Para puertos
// elipticos (procesos) se usa la formula de interseccion recta-elipse; para
// puertos rectangulares (objetos) la del bbox. Sin esto los procesos quedaban
// con dock fuera del borde real (capturas: arco flotando en el lado equivocado).
// Equivalente al dockPoint de OpCloud (shared.ts:5023-5031), pero geometrico.
function puntoDockEnPuerto(puerto: Apariencia, tipo: TipoEntidad, otros: Posicion[]): Posicion {
  const centroPuerto: Posicion = {
    x: puerto.x + puerto.width / 2,
    y: puerto.y + puerto.height / 2,
  };
  const centroide: Posicion = {
    x: otros.reduce((s, p) => s + p.x, 0) / otros.length,
    y: otros.reduce((s, p) => s + p.y, 0) / otros.length,
  };
  const dx = centroide.x - centroPuerto.x;
  const dy = centroide.y - centroPuerto.y;
  if (dx === 0 && dy === 0) return centroPuerto;
  const halfW = puerto.width / 2;
  const halfH = puerto.height / 2;
  if (tipo === "proceso") {
    // Interseccion recta-elipse: (t*dx)^2/a^2 + (t*dy)^2/b^2 = 1
    const len2 = (dx / halfW) ** 2 + (dy / halfH) ** 2;
    if (len2 === 0) return centroPuerto;
    const t = 1 / Math.sqrt(len2);
    return { x: centroPuerto.x + dx * t, y: centroPuerto.y + dy * t };
  }
  // Rectangulo: el borde mas cercano por el lado dominante de la direccion.
  const tx = dx === 0 ? Number.POSITIVE_INFINITY : halfW / Math.abs(dx);
  const ty = dy === 0 ? Number.POSITIVE_INFINITY : halfH / Math.abs(dy);
  const t = Math.min(tx, ty);
  return {
    x: centroPuerto.x + dx * t,
    y: centroPuerto.y + dy * t,
  };
}

// Convencion: 0 grados = norte (12 en punto), CW. Matches OpCloud
// describeArc/polarToCartesian (shared.ts:6053-6080).
function anguloDesdeDock(dock: Posicion, hacia: Posicion): number {
  const dx = hacia.x - dock.x;
  const dy = hacia.y - dock.y;
  const grados = Math.atan2(dy, dx) * 180 / Math.PI; // 0 = este, +90 = sur
  return (grados + 90 + 360) % 360;
}

// Encuentra el par de angulos extremos del fan eligiendo el mayor "hueco"
// angular y haciendo que el arco lo evite. Equivalente al pair-search de
// OpCloud (shared.ts:5039-5051) pero estable cuando la apertura cruza 0/360.
function angulosExtremos(angulos: number[]): { startAngle: number; endAngle: number } {
  const ordenados = [...angulos].sort((a, b) => a - b);
  const primero = ordenados[0] ?? 0;
  const ultimo = ordenados[ordenados.length - 1] ?? 0;
  if (ordenados.length <= 1) return { startAngle: primero, endAngle: primero };
  let huecoMax = 360 - ultimo + primero;
  let inicioGap = ultimo;
  let finGap = primero;
  for (let i = 1; i < ordenados.length; i++) {
    const actual = ordenados[i] ?? 0;
    const previo = ordenados[i - 1] ?? 0;
    const hueco = actual - previo;
    if (hueco > huecoMax) {
      huecoMax = hueco;
      inicioGap = previo;
      finGap = actual;
    }
  }
  const startAngle = finGap;
  let endAngle = inicioGap;
  if (endAngle < startAngle) endAngle += 360;
  return { startAngle, endAngle };
}

function polarToCartesian(centro: Posicion, radio: number, anguloGrados: number): Posicion {
  const rad = (anguloGrados - 90) * Math.PI / 180;
  return {
    x: centro.x + radio * Math.cos(rad),
    y: centro.y + radio * Math.sin(rad),
  };
}

function describeArc(centro: Posicion, radio: number, startAngle: number, endAngle: number): string {
  const inicio = polarToCartesian(centro, radio, endAngle);
  const fin = polarToCartesian(centro, radio, startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${redondear(inicio.x)} ${redondear(inicio.y)} A ${radio} ${radio} 0 ${largeArcFlag} 0 ${redondear(fin.x)} ${redondear(fin.y)}`;
}

function redondear(valor: number): number {
  return Math.round(valor * 100) / 100;
}
