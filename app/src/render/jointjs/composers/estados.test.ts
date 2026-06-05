import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearModelo, crearObjeto, estadosDeEntidad, moverEstado, renombrarEstado } from "../../../modelo/operaciones";
import type { Apariencia, Modelo, Resultado } from "../../../modelo/tipos";
import { anchoCapsulaEstado, dimensionesConEstados, puntoCapsulaEstado, rectCapsulaEstado } from "./estados";

describe("composer estados", () => {
  test("dimensiona capsulas con minimo y layout horizontal", () => {
    expect(anchoCapsulaEstado("ok")).toBe(52);
    expect(anchoCapsulaEstado("estado extremadamente largo")).toBeGreaterThan(150);

    const size = dimensionesConEstados(apariencia, "Pedido", [
      { id: "s1", entidadId: "obj-1", nombre: "pendiente" },
      { id: "s2", entidadId: "obj-1", nombre: "cerrado" },
    ], "horizontal");

    expect(size.width).toBeGreaterThanOrEqual(135);
    expect(size.height).toBe(100);
  });

  // BUG-20260604T045849Z-7ae086: nombres largos perdian la ultima letra porque la
  // heuristica (7 px/char) subestima la serif italica y no compensa el stroke grueso
  // de estados designados inicial/final. Piso: factor de entidades (8 px/char).
  test("capsula cubre nombres largos en italica y compensa designacion inicial/final", () => {
    // factor por caracter alineado al de entidades (entidad.ts usa length*8+28)
    expect(anchoCapsulaEstado("competente")).toBeGreaterThanOrEqual(10 * 8 + 12);
    expect(anchoCapsulaEstado("programada")).toBeGreaterThanOrEqual(10 * 8 + 12);
    // designacion inicial/final agrega stroke (3px inicial, doble contorno final)
    const base = anchoCapsulaEstado({ id: "s", entidadId: "o", nombre: "programada" });
    const inicial = anchoCapsulaEstado({ id: "s", entidadId: "o", nombre: "programada", esInicial: true });
    const final = anchoCapsulaEstado({ id: "s", entidadId: "o", nombre: "programada", esFinal: true });
    expect(inicial).toBeGreaterThan(base);
    expect(final).toBeGreaterThan(base);
    // La geometria manual persistida debe participar en la cápsula interactiva.
    expect(anchoCapsulaEstado({ id: "s", entidadId: "o", nombre: "ok", width: 200 })).toBe(200);
  });

  test("calcula punto absoluto de capsula de estado visible", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Pedido"));
    const entidad = Object.values(modelo.entidades)[0];
    if (!entidad) throw new Error("Entidad no encontrada");
    modelo = must(crearEstadosIniciales(modelo, entidad.id)).modelo;
    const [estado] = estadosDeEntidad(modelo, entidad.id);
    if (!estado) throw new Error("Estado no encontrado");
    modelo = must(renombrarEstado(modelo, estado.id, "pendiente"));
    const ap = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!ap) throw new Error("Apariencia no encontrada");

    const punto = puntoCapsulaEstado(modelo, ap, estado.id);

    expect(punto?.x).toBeGreaterThan(ap.x);
    expect(punto?.y).toBeGreaterThan(ap.y);
  });

  test("respeta posición manual persistida y la limita dentro del objeto", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Pedido"));
    const entidad = Object.values(modelo.entidades)[0];
    if (!entidad) throw new Error("Entidad no encontrada");
    const iniciales = must(crearEstadosIniciales(modelo, entidad.id));
    modelo = iniciales.modelo;
    const estadoId = iniciales.estadoIds[0];
    modelo = must(moverEstado(modelo, estadoId, 34, 58));
    const ap = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!ap) throw new Error("Apariencia no encontrada");

    const rect = rectCapsulaEstado(modelo, ap, estadoId);
    const punto = puntoCapsulaEstado(modelo, ap, estadoId);

    expect(rect?.x).toBe(ap.x + 34);
    expect(rect?.y).toBe(ap.y + 58);
    expect((rect?.x ?? 0) + (rect?.width ?? 0)).toBeLessThanOrEqual(ap.x + ap.width);
    expect((rect?.y ?? 0) + (rect?.height ?? 0)).toBeLessThanOrEqual(ap.y + 100);
    expect(punto).toMatchObject({ x: (rect?.x ?? 0) + (rect?.width ?? 0) / 2, y: (rect?.y ?? 0) + (rect?.height ?? 0) / 2 });
  });

  test("limita posición manual extrema dentro del objeto", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Pedido"));
    const entidad = Object.values(modelo.entidades)[0];
    if (!entidad) throw new Error("Entidad no encontrada");
    const iniciales = must(crearEstadosIniciales(modelo, entidad.id));
    modelo = iniciales.modelo;
    const estadoId = iniciales.estadoIds[0];
    modelo = must(moverEstado(modelo, estadoId, 2200, -310));
    const ap = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!ap) throw new Error("Apariencia no encontrada");

    const rect = rectCapsulaEstado(modelo, ap, estadoId);
    const size = dimensionesConEstados(ap, "Pedido", estadosDeEntidad(modelo, entidad.id), entidad.layoutEstados);

    expect(rect?.x).toBeGreaterThanOrEqual(ap.x);
    expect(rect?.y).toBeGreaterThanOrEqual(ap.y);
    expect((rect?.x ?? 0) + (rect?.width ?? 0)).toBeLessThanOrEqual(ap.x + size.width);
    expect((rect?.y ?? 0) + (rect?.height ?? 0)).toBeLessThanOrEqual(ap.y + size.height);
  });
});

const apariencia: Apariencia = {
  id: "ap-1",
  entidadId: "obj-1",
  opdId: "opd-1",
  x: 80,
  y: 90,
  width: 135,
  height: 60,
};

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
