import { describe, expect, test } from "bun:test";
import { estadoVitrinaDelStore } from "./chipRevisionViewModel";

describe("estadoVitrinaDelStore (resolución de base desde el mapa por-modelo)", () => {
  test("no persistido → oculto", () => {
    expect(estadoVitrinaDelStore({
      modeloPersistidoId: null,
      revisionRemota: { modeloId: "m", revision: 9 },
      revisionBasePorModelo: { m: 3 },
      dirty: false,
    })).toEqual({ visible: false });
  });
  test("base del modelo activo resuelta del mapa; remota > base, limpio → Recargar", () => {
    expect(estadoVitrinaDelStore({
      modeloPersistidoId: "m",
      revisionRemota: { modeloId: "m", revision: 6 },
      revisionBasePorModelo: { m: 5, otro: 99 },
      dirty: false,
    })).toEqual({ visible: true, revisionRemota: 6, hayCambiosLocales: false });
  });
  test("remota > base, dirty → rama no-destructiva", () => {
    expect(estadoVitrinaDelStore({
      modeloPersistidoId: "m",
      revisionRemota: { modeloId: "m", revision: 6 },
      revisionBasePorModelo: { m: 5 },
      dirty: true,
    })).toEqual({ visible: true, revisionRemota: 6, hayCambiosLocales: true });
  });
  test("base ausente en el mapa → oculto (no falso positivo)", () => {
    expect(estadoVitrinaDelStore({
      modeloPersistidoId: "m",
      revisionRemota: { modeloId: "m", revision: 6 },
      revisionBasePorModelo: {},
      dirty: false,
    })).toEqual({ visible: false });
  });
});
