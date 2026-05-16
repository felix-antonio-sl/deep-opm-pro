import { describe, expect, test } from "bun:test";
import {
  resolverContextDeviceWorkbench,
  resolverContextModoWorkbench,
  resolverContextSubModoWorkbench,
  resolverContextoWorkbench,
  resolverViewPointWorkbench,
  tituloViewPointWorkbench,
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

describe("resolverContextSubModoWorkbench — Context.Modo.subModo IFML", () => {
  test("declara null cuando edicion no tiene gesto modal", () => {
    expect(resolverContextSubModoWorkbench({
      vistaMapaActiva: false,
      modoSimulacionActivo: false,
      modoEnlaceActivo: false,
      modoCreacionActivo: false,
    })).toBeNull();
  });

  test("declara conectando e insertando solo dentro de edicion", () => {
    expect(resolverContextSubModoWorkbench({
      vistaMapaActiva: false,
      modoSimulacionActivo: false,
      modoEnlaceActivo: true,
      modoCreacionActivo: false,
    })).toBe("conectando");
    expect(resolverContextSubModoWorkbench({
      vistaMapaActiva: false,
      modoSimulacionActivo: false,
      modoEnlaceActivo: false,
      modoCreacionActivo: true,
    })).toBe("insertando");
  });

  test("mapa y simulacion anulan submodo de edicion", () => {
    expect(resolverContextSubModoWorkbench({
      vistaMapaActiva: true,
      modoSimulacionActivo: false,
      modoEnlaceActivo: true,
      modoCreacionActivo: true,
    })).toBeNull();
    expect(resolverContextSubModoWorkbench({
      vistaMapaActiva: false,
      modoSimulacionActivo: true,
      modoEnlaceActivo: true,
      modoCreacionActivo: true,
    })).toBeNull();
  });
});

describe("resolverViewPointWorkbench — ViewPoint efectivo", () => {
  test("Bienvenida prevalece como ViewPoint de boot sin modelo cargado", () => {
    expect(resolverViewPointWorkbench({ device: "desktop", modo: "edicion", bienvenidaActiva: true })).toBe("Bienvenida");
    expect(resolverViewPointWorkbench({ device: "mobile", modo: "edicion", bienvenidaActiva: true })).toBe("Bienvenida");
  });

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
      subModo: null,
      viewPoint: "Edicion",
      viewPointDefault: true,
    });
  });

  test("declara Mapa y Simulacion como ViewPoint no default", () => {
    expect(resolverContextoWorkbench({ breakpoint: "desktop", vistaMapaActiva: true, modoSimulacionActivo: false }).viewPointDefault).toBe(false);
    expect(resolverContextoWorkbench({ breakpoint: "desktop", vistaMapaActiva: false, modoSimulacionActivo: true }).viewPointDefault).toBe(false);
  });

  test("declara Bienvenida como ViewPoint no default antes de Edicion", () => {
    expect(resolverContextoWorkbench({
      breakpoint: "desktop",
      vistaMapaActiva: false,
      modoSimulacionActivo: false,
      bienvenidaActiva: true,
    })).toEqual({
      device: "desktop",
      modo: "edicion",
      subModo: null,
      viewPoint: "Bienvenida",
      viewPointDefault: false,
    });
  });
});

describe("tituloViewPointWorkbench — heading accesible del ViewPoint", () => {
  test("nombra los ViewPoints top-level y submodos de edicion", () => {
    expect(tituloViewPointWorkbench({ viewPoint: "Edicion", subModo: null })).toBe("Workbench OPM - edición");
    expect(tituloViewPointWorkbench({ viewPoint: "Edicion", subModo: "conectando" })).toBe("Workbench OPM - conectando");
    expect(tituloViewPointWorkbench({ viewPoint: "Edicion", subModo: "insertando" })).toBe("Workbench OPM - inserción continua");
    expect(tituloViewPointWorkbench({ viewPoint: "Mapa", subModo: null })).toBe("Mapa del sistema OPM");
    expect(tituloViewPointWorkbench({ viewPoint: "Simulacion", subModo: null })).toBe("Simulación conceptual OPM");
    expect(tituloViewPointWorkbench({ viewPoint: "Mobile", subModo: null })).toBe("Revisión mobile OPM");
    expect(tituloViewPointWorkbench({ viewPoint: "Bienvenida", subModo: null })).toBe("Bienvenida deep-opm-pro");
  });
});
