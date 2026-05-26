import { describe, expect, test } from "bun:test";
import {
  clasificarVariante,
  detallarChip,
  formatearHoraGuardado,
  formatearTiempoRelativo,
  labelChip,
} from "./ChipPersistencia";

describe("ChipPersistencia · clasificarVariante", () => {
  test("persistido sin dirty → local-clean", () => {
    const v = clasificarVariante({
      modeloPersistidoId: "modelo-abc",
      dirty: false,
      cargadoDesde: "persistido",
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
      versiones: 0,
      tiempoRelativo: null,
    });
    expect(v.tipo).toBe("importado");
    expect(v.tiempoRelativo).toBeNull();
  });

  test("no persistido + cargadoDesde=nuevo → nuevo", () => {
    const v = clasificarVariante({
      modeloPersistidoId: null,
      dirty: false,
      cargadoDesde: "nuevo",
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

describe("ChipPersistencia · formatearHoraGuardado", () => {
  test("timestamp inválido devuelve null", () => {
    expect(formatearHoraGuardado(null)).toBeNull();
    expect(formatearHoraGuardado(undefined)).toBeNull();
    expect(formatearHoraGuardado(Number.NaN)).toBeNull();
  });

  test("timestamp válido devuelve HH:mm en formato es-CL (24h)", () => {
    const formato = formatearHoraGuardado(1_700_000_000_000);
    expect(formato).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe("ChipPersistencia · labelChip (Ronda 24 L2 #5)", () => {
  // Ronda 24 L2 #5: el copy se descompone en 4 estados coherentes con el chip
  // `● Auto` del toolbar. `local-dirty` (persistido + cambios en cola) ya no
  // dice "Sin guardar · Ctrl+S" porque el autosalvado periodico los recogera;
  // dice "Cambios sin guardar". Las variantes no persistidas siguen diciendo
  // "Sin guardar · Ctrl+S" porque el autosalvado no opera sobre ellas.
  test("local-clean sin hora → Guardado", () => {
    expect(labelChip(
      { tipo: "local-clean", versiones: 3, tiempoRelativo: null },
      { horaGuardado: null },
    )).toBe("Guardado");
  });

  test("local-clean con hora → Guardado · HH:mm", () => {
    expect(labelChip(
      { tipo: "local-clean", versiones: 3, tiempoRelativo: null },
      { horaGuardado: "14:32" },
    )).toBe("Guardado · 14:32");
  });

  test("salvando en curso → Guardando…", () => {
    expect(labelChip(
      { tipo: "local-clean", versiones: 0, tiempoRelativo: null },
      { salvando: true, horaGuardado: "14:32" },
    )).toBe("Guardando…");
    expect(labelChip(
      { tipo: "nuevo", versiones: 0, tiempoRelativo: null },
      { salvando: true },
    )).toBe("Guardando…");
  });

  test("local-dirty (persistido + cambios) → Cambios sin guardar", () => {
    expect(labelChip({ tipo: "local-dirty", versiones: 3, tiempoRelativo: null })).toBe(
      "Cambios sin guardar",
    );
  });

  test("variantes no persistidas colapsan a Sin guardar · Ctrl+S", () => {
    expect(labelChip({ tipo: "importado", versiones: 0, tiempoRelativo: null })).toBe(
      "Sin guardar · Ctrl+S",
    );
    expect(labelChip({ tipo: "nuevo", versiones: 0, tiempoRelativo: null })).toBe(
      "Sin guardar · Ctrl+S",
    );
  });
});

describe("ChipPersistencia · detallarChip", () => {
  test("incluye nombre del modelo y origen para local-clean", () => {
    const tooltip = detallarChip(
      { tipo: "local-clean", versiones: 2, tiempoRelativo: "hace 1 min" },
      "Cafetera Doméstica",
      { horaGuardado: "14:32" },
    );
    expect(tooltip).toContain("Guardado · 14:32");
    expect(tooltip).toContain("Modelo: Cafetera Doméstica");
    expect(tooltip).toContain("persistido");
    expect(tooltip).toContain("Cambios pendientes: no");
  });

  test("local-dirty marca cambios pendientes: si", () => {
    const tooltip = detallarChip(
      { tipo: "local-dirty", versiones: 1, tiempoRelativo: null },
      "Modelo X",
    );
    expect(tooltip).toContain("Cambios sin guardar");
    expect(tooltip).toContain("Cambios pendientes: sí");
  });

  test("variantes no persistidas marcan no persistido", () => {
    const importadoTip = detallarChip(
      { tipo: "importado", versiones: 0, tiempoRelativo: null },
      "M",
    );
    expect(importadoTip).toContain("no persistido");
    const nuevoTip = detallarChip(
      { tipo: "nuevo", versiones: 0, tiempoRelativo: null },
      "M",
    );
    expect(nuevoTip).toContain("no persistido");
  });
});
