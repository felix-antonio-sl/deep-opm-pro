import { describe, expect, test } from "bun:test";
import { layoutRadial } from "./layoutRadial";

describe("layoutRadial", () => {
  test("distribuye posiciones alrededor del centro con radio adaptativo", () => {
    const posiciones = layoutRadial({ x: 200, y: 200 }, 4, []);
    expect(posiciones).toHaveLength(4);
    expect(new Set(posiciones.map((p) => `${p.x}:${p.y}`)).size).toBe(4);
  });

  test("evita cajas ocupadas expandiendo o rotando candidatos", () => {
    const ocupadas = [
      { x: 132, y: 50, width: 135, height: 60 },
      { x: 270, y: 170, width: 135, height: 60 },
      { x: 132, y: 290, width: 135, height: 60 },
    ];
    const [posicion] = layoutRadial({ x: 200, y: 200 }, 1, ocupadas, { radioInicial: 120 });
    expect(posicion).toBeDefined();
    expect(ocupadas.some((caja) => intersectan(caja, { ...posicion!, width: 135, height: 60 }))).toBe(false);
  });
});

function intersectan(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }): boolean {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}
