import { describe, expect, test } from "bun:test";
import {
  clasificarVariante,
  detallarChip,
  formatearTiempoRelativo,
  labelChip,
} from "./ChipPersistencia";

describe("ChipPersistencia · clasificarVariante", () => {
  test("persistido sin dirty → local-clean", () => {
    const v = clasificarVariante({
      modeloPersistidoId: "modelo-abc",
      dirty: false,
      cargadoDesde: "persistido",
      esFixture: false,
      versiones: 3,
      tiempoRelativo: "hace 2 min",
    });
    expect(v.tipo).toBe("local-clean");
    expect(v.versiones).toBe(3);
    expect(v.tiempoRelativo).toBe("hace 2 min");
  });

  test("persistido con dirty → local-dirty", () => {
    const v = clasificarVariante({
      modeloPersistidoId: "modelo-abc",
      dirty: true,
      cargadoDesde: "persistido",
      esFixture: false,
      versiones: 3,
      tiempoRelativo: "hace 2 min",
    });
    expect(v.tipo).toBe("local-dirty");
  });

  test("no persistido + cargadoDesde=importado → importado", () => {
    const v = clasificarVariante({
      modeloPersistidoId: null,
      dirty: true,
      cargadoDesde: "importado",
      esFixture: false,
      versiones: 0,
      tiempoRelativo: null,
    });
    expect(v.tipo).toBe("importado");
    expect(v.tiempoRelativo).toBeNull();
  });

  test("no persistido + modelo de fixture → fixture", () => {
    const v = clasificarVariante({
      modeloPersistidoId: null,
      dirty: false,
      cargadoDesde: "nuevo",
      esFixture: true,
      versiones: 0,
      tiempoRelativo: null,
    });
    expect(v.tipo).toBe("fixture");
  });

  test("no persistido + cargadoDesde=asistente → asistente", () => {
    const v = clasificarVariante({
      modeloPersistidoId: null,
      dirty: true,
      cargadoDesde: "asistente",
      esFixture: false,
      versiones: 0,
      tiempoRelativo: null,
    });
    expect(v.tipo).toBe("asistente");
  });

  test("no persistido + cargadoDesde=nuevo → nuevo", () => {
    const v = clasificarVariante({
      modeloPersistidoId: null,
      dirty: false,
      cargadoDesde: "nuevo",
      esFixture: false,
      versiones: 0,
      tiempoRelativo: null,
    });
    expect(v.tipo).toBe("nuevo");
  });

  test("persistido siempre gana sobre cargadoDesde", () => {
    const v = clasificarVariante({
      modeloPersistidoId: "modelo-abc",
      dirty: false,
      cargadoDesde: "importado",
      esFixture: true,
      versiones: 1,
      tiempoRelativo: null,
    });
    expect(v.tipo).toBe("local-clean");
  });
});

describe("ChipPersistencia · formatearTiempoRelativo", () => {
  const ahora = 1_700_000_000_000;
  test("delta < 5s → recién", () => {
    expect(formatearTiempoRelativo(ahora - 1_000, ahora)).toBe("recién");
    expect(formatearTiempoRelativo(ahora - 4_999, ahora)).toBe("recién");
  });

  test("delta 5s..59s → hace N s", () => {
    expect(formatearTiempoRelativo(ahora - 10_000, ahora)).toBe("hace 10 s");
    expect(formatearTiempoRelativo(ahora - 59_000, ahora)).toBe("hace 59 s");
  });

  test("delta 1min..59min → hace N min", () => {
    expect(formatearTiempoRelativo(ahora - 60_000, ahora)).toBe("hace 1 min");
    expect(formatearTiempoRelativo(ahora - 30 * 60_000, ahora)).toBe("hace 30 min");
    expect(formatearTiempoRelativo(ahora - 59 * 60_000, ahora)).toBe("hace 59 min");
  });

  test("delta 1h..23h → hace N h", () => {
    expect(formatearTiempoRelativo(ahora - 3_600_000, ahora)).toBe("hace 1 h");
    expect(formatearTiempoRelativo(ahora - 12 * 3_600_000, ahora)).toBe("hace 12 h");
  });

  test("delta >= 1d → hace N d", () => {
    expect(formatearTiempoRelativo(ahora - 86_400_000, ahora)).toBe("hace 1 d");
    expect(formatearTiempoRelativo(ahora - 5 * 86_400_000, ahora)).toBe("hace 5 d");
  });

  test("delta negativo → recién (no estalla)", () => {
    expect(formatearTiempoRelativo(ahora + 1_000, ahora)).toBe("recién");
  });
});

describe("ChipPersistencia · labelChip", () => {
  test("local-clean con versiones y tiempo", () => {
    expect(labelChip({ tipo: "local-clean", versiones: 3, tiempoRelativo: "hace 2 min" })).toBe(
      "Local · v3 · hace 2 min",
    );
  });

  test("local-clean sin versiones omite la pieza vN", () => {
    expect(labelChip({ tipo: "local-clean", versiones: 0, tiempoRelativo: "recién" })).toBe(
      "Local · recién",
    );
  });

  test("local-clean sin tiempo omite el sufijo de tiempo", () => {
    expect(labelChip({ tipo: "local-clean", versiones: 3, tiempoRelativo: null })).toBe("Local · v3");
  });

  test("local-dirty muestra version + 'sin guardar'", () => {
    expect(labelChip({ tipo: "local-dirty", versiones: 3, tiempoRelativo: null })).toBe(
      "Local · v3 · sin guardar",
    );
  });

  test("variantes simples", () => {
    expect(labelChip({ tipo: "importado", versiones: 0, tiempoRelativo: null })).toBe(
      "Importado · sin guardar",
    );
    expect(labelChip({ tipo: "fixture", versiones: 0, tiempoRelativo: null })).toBe(
      "Fixture · sin guardar",
    );
    expect(labelChip({ tipo: "asistente", versiones: 0, tiempoRelativo: null })).toBe(
      "Asistente · sin guardar",
    );
    expect(labelChip({ tipo: "nuevo", versiones: 0, tiempoRelativo: null })).toBe(
      "Nuevo · sin guardar",
    );
  });
});

describe("ChipPersistencia · detallarChip", () => {
  test("incluye nombre del modelo y origen para local-clean", () => {
    const tooltip = detallarChip(
      { tipo: "local-clean", versiones: 2, tiempoRelativo: "hace 1 min" },
      "Cafetera Doméstica",
    );
    expect(tooltip).toContain("Local · v2 · hace 1 min");
    expect(tooltip).toContain("Modelo: Cafetera Doméstica");
    expect(tooltip).toContain("persistido");
    expect(tooltip).toContain("Cambios pendientes: no");
  });

  test("local-dirty marca cambios pendientes: si", () => {
    const tooltip = detallarChip(
      { tipo: "local-dirty", versiones: 1, tiempoRelativo: null },
      "Modelo X",
    );
    expect(tooltip).toContain("Cambios pendientes: sí");
  });

  test("variantes no persistidas marcan no persistido", () => {
    const importadoTip = detallarChip(
      { tipo: "importado", versiones: 0, tiempoRelativo: null },
      "M",
    );
    expect(importadoTip).toContain("no persistido");
    const asistenteTip = detallarChip(
      { tipo: "asistente", versiones: 0, tiempoRelativo: null },
      "M",
    );
    expect(asistenteTip).toContain("no persistido");
    const fixtureTip = detallarChip(
      { tipo: "fixture", versiones: 0, tiempoRelativo: null },
      "M",
    );
    expect(fixtureTip).toContain("catálogo local");
    const nuevoTip = detallarChip(
      { tipo: "nuevo", versiones: 0, tiempoRelativo: null },
      "M",
    );
    expect(nuevoTip).toContain("no persistido");
  });
});
