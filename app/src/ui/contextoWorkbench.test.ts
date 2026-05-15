import { describe, expect, test } from "bun:test";
import {
  resolverContextDeviceWorkbench,
  resolverContextModoWorkbench,
  resolverContextoWorkbench,
  resolverViewPointWorkbench,
} from "./contextoWorkbench";

describe("resolverContextDeviceWorkbench — Context.Device IFML", () => {
  test("conserva el breakpoint OPM como device canonico", () => {
    expect(resolverContextDeviceWorkbench("mobile")).toBe("mobile");
    expect(resolverContextDeviceWorkbench("tablet")).toBe("tablet");
    expect(resolverContextDeviceWorkbench("desktop")).toBe("desktop");
  });
});

describe("resolverContextModoWorkbench — Context.Modo IFML", () => {
  test("edicion es el modo default sin mapa ni simulacion", () => {
    expect(resolverContextModoWorkbench({ vistaMapaActiva: false, modoSimulacionActivo: false })).toBe("edicion");
  });

  test("mapa desplaza edicion cuando esta activo", () => {
    expect(resolverContextModoWorkbench({ vistaMapaActiva: true, modoSimulacionActivo: false })).toBe("mapa");
  });

  test("simulacion prevalece ante flags incompatibles", () => {
    expect(resolverContextModoWorkbench({ vistaMapaActiva: true, modoSimulacionActivo: true })).toBe("simulacion");
  });
});

describe("resolverViewPointWorkbench — ViewPoint efectivo", () => {
  test("mobile sustituye la composicion aunque el modo sea alternativo", () => {
    expect(resolverViewPointWorkbench({ device: "mobile", modo: "edicion" })).toBe("Mobile");
    expect(resolverViewPointWorkbench({ device: "mobile", modo: "mapa" })).toBe("Mobile");
  });

  test("desktop/tablet expresan el XOR de modo", () => {
    expect(resolverViewPointWorkbench({ device: "desktop", modo: "edicion" })).toBe("Edicion");
    expect(resolverViewPointWorkbench({ device: "tablet", modo: "mapa" })).toBe("Mapa");
    expect(resolverViewPointWorkbench({ device: "desktop", modo: "simulacion" })).toBe("Simulacion");
  });
});

describe("resolverContextoWorkbench — contrato integrado", () => {
  test("declara Edicion como ViewPoint default", () => {
    expect(resolverContextoWorkbench({ breakpoint: "desktop", vistaMapaActiva: false, modoSimulacionActivo: false })).toEqual({
      device: "desktop",
      modo: "edicion",
      viewPoint: "Edicion",
      viewPointDefault: true,
    });
  });

  test("declara Mapa y Simulacion como ViewPoint no default", () => {
    expect(resolverContextoWorkbench({ breakpoint: "desktop", vistaMapaActiva: true, modoSimulacionActivo: false }).viewPointDefault).toBe(false);
    expect(resolverContextoWorkbench({ breakpoint: "desktop", vistaMapaActiva: false, modoSimulacionActivo: true }).viewPointDefault).toBe(false);
  });
});
