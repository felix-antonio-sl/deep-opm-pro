import { describe, expect, test } from "bun:test";
import { Context, vistaActivaIFML } from "./contexto";

type EstadoVista = Parameters<typeof vistaActivaIFML>[0];

const base: EstadoVista = {
  contextoSimulacion: null,
  vistaMapaActiva: false,
  modoEnlace: null,
  modoCreacion: null,
};

describe("Context IFML canonico", () => {
  test("Context.Device.dimension delega en los breakpoints OPM", () => {
    expect(Context.Device.dimension(390)).toBe("mobile");
    expect(Context.Device.dimension(800)).toBe("tablet");
    expect(Context.Device.dimension(1280)).toBe("desktop");
  });

  test("Context.Modo declara edicion, mapa, simulacion y submodos de edicion", () => {
    expect(Context.Modo.activacion(base)).toBe("edicion");
    expect(Context.Modo.subModo(base)).toBeNull();

    expect(Context.Modo.activacion({ ...base, vistaMapaActiva: true })).toBe("mapa");
    expect(Context.Modo.subModo({ ...base, vistaMapaActiva: true, modoCreacion: "objeto" })).toBeNull();

    const conectando: EstadoVista = {
      ...base,
      modoEnlace: { tipo: "resultado", origenId: "o1" },
    };
    expect(Context.Modo.subModo(conectando)).toBe("conectando");
    expect(Context.Modo.subModo({ ...base, modoCreacion: "proceso" })).toBe("insertando");
  });

  test("vistaActivaIFML expone device, modo y submodo sin depender de window", () => {
    expect(vistaActivaIFML({ ...base, modoCreacion: "objeto" }, 390)).toEqual({
      device: "mobile",
      modo: "edicion",
      subModo: "insertando",
    });
  });
});
