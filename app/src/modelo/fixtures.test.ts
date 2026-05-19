import { describe, expect, test } from "bun:test";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import { verificarMetodologia } from "./checkers";
import {
  crearOnStarSystem,
  crearSdSyncInzoomed,
  crearSystemDiagramFixture,
  fixtureTodos,
  fixturesPorCategoria,
} from "./fixtures";
import { refinamientosDe, tieneRefinamiento } from "./refinamientos";
import type { Apariencia, Id, Modelo } from "./tipos";

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

function entidadIdPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  expect(entidad).toBeDefined();
  return entidad!.id;
}

function opdIdPorNombre(modelo: Modelo, nombre: string): Id {
  const opd = Object.values(modelo.opds).find((item) => item.nombre === nombre);
  expect(opd).toBeDefined();
  return opd!.id;
}

function aparienciaPorNombre(modelo: Modelo, opdId: Id, nombre: string): Apariencia {
  const entidadId = entidadIdPorNombre(modelo, nombre);
  const apariencia = Object.values(modelo.opds[opdId]?.apariencias ?? {}).find((item) => item.entidadId === entidadId);
  expect(apariencia).toBeDefined();
  return apariencia!;
}

describe("fixture SD Sync", () => {
  const modelo = crearSdSyncInzoomed().modelo;
  const sd1Id = opdIdPorNombre(modelo, "SD1");

  test("replica el SD1 del sandbox sin duplicar input/output locales", () => {
    const nombres = Object.values(modelo.entidades).map((entidad) => entidad.nombre);
    expect(nombres).not.toContain("SD1 Main Input");
    expect(nombres).not.toContain("SD1 Main Output");
    expect(nombres).toContain("Main Input");
    expect(nombres).toContain("Main Output");
  });

  test("reancla el resultado externo final desde Last Processing hacia Main Output", () => {
    const last = entidadIdPorNombre(modelo, "Last Processing");
    const mainOutput = entidadIdPorNombre(modelo, "Main Output");

    expect(
      Object.values(modelo.enlaces).some(
        (enlace) =>
          enlace.tipo === "resultado" &&
          enlace.derivado?.origen === "manual" &&
          enlace.origenId.kind === "entidad" &&
          enlace.origenId.id === last &&
          enlace.destinoId.kind === "entidad" &&
          enlace.destinoId.id === mainOutput,
      ),
    ).toBe(true);
  });

  test("mantiene el in-zoom central y los externos separados como en OPCloud", () => {
    expect(aparienciaPorNombre(modelo, sd1Id, "Main System Doing")).toMatchObject({
      x: 180,
      y: 110,
      width: 340,
      height: 455,
    });
    expect(aparienciaPorNombre(modelo, sd1Id, "Main Input")).toMatchObject({ x: 55, y: 255 });
    expect(aparienciaPorNombre(modelo, sd1Id, "Main Output")).toMatchObject({ x: 620, y: 505 });
    expect(aparienciaPorNombre(modelo, sd1Id, "First Processing")).toMatchObject({ x: 285, y: 210 });
    expect(aparienciaPorNombre(modelo, sd1Id, "Last Processing")).toMatchObject({ x: 315, y: 505 });
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
