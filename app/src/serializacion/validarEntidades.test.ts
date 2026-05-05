import { describe, expect, test } from "bun:test";
import { camposEntidadAvanzada, validarEntidades } from "./validarEntidades";

describe("validarEntidades", () => {
  test("acepta entidad canonica y campos avanzados", () => {
    const resultado = validarEntidades({
      "e-1": {
        id: "e-1",
        tipo: "objeto",
        nombre: "Sensor",
        esencia: "fisica",
        afiliacion: "sistemica",
        alias: "iP",
        unidad: "°C",
        descripcion: "Mide temperatura",
        urls: [{ id: "u-1", url: "https://example.com/img.png", tipo: "imagen" }],
        layoutEstados: "vertical",
      },
    });

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value["e-1"]?.alias).toBe("iP");
    expect(resultado.value["e-1"]?.urls?.[0]?.tipo).toBe("imagen");
  });

  test("rechaza entidad sin nombre", () => {
    const resultado = validarEntidades({
      "e-1": { id: "e-1", tipo: "objeto", esencia: "fisica", afiliacion: "sistemica" },
    });

    expect(resultado.ok).toBe(false);
  });

  test("acepta legacy sin campos opcionales", () => {
    const resultado = validarEntidades({
      "e-1": { id: "e-1", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "ambiental" },
    });

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value["e-1"]?.alias).toBeUndefined();
  });

  test("camposEntidadAvanzada rechaza urls no array", () => {
    const resultado = camposEntidadAvanzada("e-1", { urls: "no-array" });

    expect(resultado.ok).toBe(false);
  });
});
