import { describe, expect, test } from "bun:test";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import { verificarMetodologia } from "./checkers";
import {
  crearOnStarSystem,
  crearSystemDiagramFixture,
  fixtureTodos,
  fixturesPorCategoria,
} from "./fixtures";
import { refinamientosDe, tieneRefinamiento } from "./refinamientos";

const CATALOGO_SANDBOX = [
  "System Diagram",
  "SD Sync",
  "SD Async",
  "OnStar System",
  "OPM Structure Meta Model",
  "Modelo Vacio",
] as const;

describe("catalogo OPCloud sandbox", () => {
  test("fixtureTodos es una lista cerrada de ejemplos sandbox", () => {
    const nombres = fixtureTodos().map((fixture) => fixture.modelo.nombre);
    expect(nombres).toEqual([...CATALOGO_SANDBOX]);
  });

  test("todos los fixtures declaran categoria opcloud-sandbox", () => {
    for (const fixture of fixtureTodos()) {
      expect(fixture.categoria).toBe("opcloud-sandbox");
    }
    expect(fixturesPorCategoria("opcloud-sandbox").map((fixture) => fixture.modelo.nombre)).toEqual([...CATALOGO_SANDBOX]);
  });

  test("no quedan anclas sinteticas ni demos propias en el catalogo", () => {
    const nombres = fixtureTodos().map((fixture) => fixture.modelo.nombre);
    for (const retirado of [
      "Cafetera Domestica",
      "Diagnostico Clinico",
      "Logistica de Envios",
      "Control de Calidad",
      "Ejemplo organizacional",
      "Prestamo Bibliotecario",
      "Comprar Pan",
      "App modeladora OPM deseada",
      "SD Generico",
    ]) {
      expect(nombres).not.toContain(retirado);
    }
  });
});

describe("fixture OnStar System", () => {
  const fixture = crearOnStarSystem();
  const modelo = fixture.modelo;

  test("conserva el ejemplo formativo del libro curado sin agregar otro modelo", () => {
    expect(fixture.descripcion).toContain("capitulo 8");
    expect(fixture.descripcion).toContain("sandbox");
  });

  test("incluye SD raiz y SD1 Driver Rescuing con estados observables", () => {
    expect(Object.keys(modelo.opds).length).toBeGreaterThanOrEqual(2);
    const rescuing = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Driver Rescuing");
    expect(rescuing).toBeDefined();
    expect(tieneRefinamiento(rescuing!, "descomposicion")).toBe(true);
    expect(refinamientosDe(rescuing!)).toHaveLength(1);

    const nombres = Object.values(modelo.entidades).map((entidad) => entidad.nombre);
    expect(nombres).toContain("Call Making");
    expect(nombres).toContain("Call Transmitting");
    expect(nombres).toContain("Call Handling");
    expect(nombres).toContain("Vehicle Location Calculating");

    const estados = Object.values(modelo.estados ?? {}).map((estado) => estado.nombre);
    expect(estados).toContain("endangered");
    expect(estados).toContain("safe");
    expect(estados).toContain("requested");
    expect(estados).toContain("online");
  });
});

describe("fixture System Diagram", () => {
  const modelo = crearSystemDiagramFixture().modelo;

  test("mantiene la estructura wizard SD observada en OPCloud sandbox", () => {
    expect(Object.keys(modelo.opds).length).toBe(1);
    expect(Object.keys(modelo.entidades).length).toBe(8);
    expect(Object.keys(modelo.enlaces).length).toBe(8);
    const estados = Object.values(modelo.estados ?? {}).map((estado) => estado.nombre).sort();
    expect(estados).toEqual(["problematic", "satisfactory"]);
  });
});

describe("round-trip exhaustivo del catalogo sandbox", () => {
  for (const fixture of fixtureTodos()) {
    test(`${fixture.modelo.nombre} hace round-trip sin perder conteos`, () => {
      const json = exportarModelo(fixture.modelo);
      const hidratado = hidratarModelo(json);
      expect(hidratado.ok).toBe(true);
      if (!hidratado.ok) return;
      const m2 = hidratado.value;
      expect(m2.nombre).toBe(fixture.modelo.nombre);
      expect(Object.keys(m2.entidades).length).toBe(Object.keys(fixture.modelo.entidades).length);
      expect(Object.keys(m2.enlaces).length).toBe(Object.keys(fixture.modelo.enlaces).length);
      expect(Object.keys(m2.opds).length).toBe(Object.keys(fixture.modelo.opds).length);
      expect(Object.keys(m2.estados ?? {}).length).toBe(Object.keys(fixture.modelo.estados ?? {}).length);
      expect(Array.isArray(verificarMetodologia(m2))).toBe(true);
    });
  }
});
