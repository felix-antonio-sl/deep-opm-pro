import { describe, expect, test } from "bun:test";
import type { Apariencia, Posicion } from "../../modelo/tipos";
import { calcularGeometriaAbanico, calcularGeometriaAbanicoDesdePuntos } from "./abanicoOverlay";

const PUERTO: Apariencia = {
  id: "puerto",
  entidadId: "ent",
  opdId: "opd",
  x: 100,
  y: 100,
  width: 135,
  height: 60,
};

function distancia(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// El centro del overlay esta a `padding` del origen y coincide con el dock.
function dockDesdeGeometria(g: { position: { x: number; y: number }; size: { width: number; height: number } }): { x: number; y: number } {
  return { x: g.position.x + g.size.width / 2, y: g.position.y + g.size.height / 2 };
}

describe("calcularGeometriaAbanico", () => {
  test("dock para puerto rectangular cae sobre el borde del bbox", () => {
    // Dos extremos abajo del puerto: dock debe quedar en el borde inferior.
    const geometria = calcularGeometriaAbanico({
      aparienciaPuerto: PUERTO,
      tipoEntidadPuerto: "objeto",
      centrosOtros: [
        { x: 80, y: 300 },
        { x: 250, y: 300 },
      ],
      operador: "O",
    });
    expect(geometria).not.toBeNull();
    const dock = dockDesdeGeometria(geometria!);
    // Borde inferior del bbox: y = 100 + 60 = 160. Centroide en x = (80+250)/2 = 165.
    expect(dock.y).toBeCloseTo(160, 1);
    expect(dock.x).toBeGreaterThan(135); // entre centro del puerto y centroide
    expect(dock.x).toBeLessThan(170);
  });

  test("dock para puerto eliptico cae sobre la elipse, no el bbox", () => {
    // Mismo caso pero con tipo="proceso" (elipse). Para una elipse 135x60
    // y direccion vertical, el dock tiene que estar a y = centro + halfH = 160
    // pero para direccion oblicua, debe quedar EN la curva (mas cerca del
    // centro que el rectangulo del bbox). Verificamos que dock-centro no
    // exceda min(halfW, halfH) cuando la direccion no es axial.
    const geometria = calcularGeometriaAbanico({
      aparienciaPuerto: PUERTO,
      tipoEntidadPuerto: "proceso",
      centrosOtros: [
        { x: 250, y: 300 }, // direccion oblicua
        { x: 250, y: 320 },
      ],
      operador: "O",
    });
    expect(geometria).not.toBeNull();
    const dock = dockDesdeGeometria(geometria!);
    const centroPuerto = { x: PUERTO.x + PUERTO.width / 2, y: PUERTO.y + PUERTO.height / 2 };
    // Pertenecer a la elipse: (dx/a)^2 + (dy/b)^2 == 1 (con a=halfW, b=halfH).
    const dx = dock.x - centroPuerto.x;
    const dy = dock.y - centroPuerto.y;
    const elipseCheck = (dx / (PUERTO.width / 2)) ** 2 + (dy / (PUERTO.height / 2)) ** 2;
    expect(elipseCheck).toBeCloseTo(1, 2);
  });

  test("dock eliptico difiere del rectangular para direccion oblicua", () => {
    // Si la geometria fuera identica entre objeto y proceso, el bug no
    // estaria arreglado. Para direccion oblicua (45-ish) la diferencia entre
    // borde rectangular y borde eliptico es mas pronunciada.
    const direccion = [
      { x: 280, y: 240 },
      { x: 320, y: 260 },
    ];
    const gRect = calcularGeometriaAbanico({
      aparienciaPuerto: PUERTO,
      tipoEntidadPuerto: "objeto",
      centrosOtros: direccion,
      operador: "O",
    });
    const gElipse = calcularGeometriaAbanico({
      aparienciaPuerto: PUERTO,
      tipoEntidadPuerto: "proceso",
      centrosOtros: direccion,
      operador: "O",
    });
    const dockRect = dockDesdeGeometria(gRect!);
    const dockElipse = dockDesdeGeometria(gElipse!);
    expect(distancia(dockRect, dockElipse)).toBeGreaterThan(2);
  });

  test("retorna null cuando hay menos de dos extremos", () => {
    const geometria = calcularGeometriaAbanico({
      aparienciaPuerto: PUERTO,
      tipoEntidadPuerto: "proceso",
      centrosOtros: [{ x: 250, y: 300 }],
      operador: "O",
    });
    expect(geometria).toBeNull();
  });

  test("calcularGeometriaAbanicoDesdePuntos centra el path en el dock dado", () => {
    // Dock arbitrario, dos puntos sample casi simetricos al norte/oeste.
    const dock: Posicion = { x: 500, y: 400 };
    const geometria = calcularGeometriaAbanicoDesdePuntos({
      dock,
      puntosOtros: [
        { x: 470, y: 380 },
        { x: 530, y: 380 },
      ],
      operador: "O",
    });
    expect(geometria).not.toBeNull();
    const center = {
      x: geometria!.position.x + geometria!.size.width / 2,
      y: geometria!.position.y + geometria!.size.height / 2,
    };
    expect(center.x).toBeCloseTo(dock.x, 5);
    expect(center.y).toBeCloseTo(dock.y, 5);
    expect(geometria!.d.match(/A 30 30/g)?.length).toBe(1);
    expect(geometria!.d.match(/A 35 35/g)?.length).toBe(1);
  });

  test("operador O genera dos arcos r=30 y r=35; XOR solo uno", () => {
    const o = calcularGeometriaAbanico({
      aparienciaPuerto: PUERTO,
      tipoEntidadPuerto: "proceso",
      centrosOtros: [
        { x: 50, y: 250 },
        { x: 290, y: 250 },
      ],
      operador: "O",
    });
    const xor = calcularGeometriaAbanico({
      aparienciaPuerto: PUERTO,
      tipoEntidadPuerto: "proceso",
      centrosOtros: [
        { x: 50, y: 250 },
        { x: 290, y: 250 },
      ],
      operador: "XOR",
    });
    expect(o!.d.match(/A 30 30/g)?.length).toBe(1);
    expect(o!.d.match(/A 35 35/g)?.length).toBe(1);
    expect(xor!.d.match(/A 30 30/g)?.length).toBe(1);
    expect(xor!.d.includes("A 35 35")).toBe(false);
  });
});
