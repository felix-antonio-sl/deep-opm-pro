import { describe, expect, test } from "bun:test";
import { etiquetaEstadoAncla, formatearReferencia } from "./anclasPresentacion";

// W6.4: presentación de anclas en el Inspector. Los artículos viajan verbatim
// del proto (la expansión de rangos es presentación, no dato — §10 decisión 5);
// aquí solo se componen los segmentos presentes.

describe("formatearReferencia — W6.4", () => {
  test("norma + artículos + sección componen los tres segmentos", () => {
    expect(
      formatearReferencia({ norma: "DS 1/2022", articulos: ["15", "17"], seccion: "§Protocolos clínicos" }),
    ).toBe("DS 1/2022 · 15, 17 · §Protocolos clínicos");
  });

  test("solo norma no agrega separadores", () => {
    expect(formatearReferencia({ norma: "Ley 20.584" })).toBe("Ley 20.584");
  });

  test("artículos vacíos se omiten y los verbatim se respetan", () => {
    expect(formatearReferencia({ norma: "NT 2024", articulos: [] })).toBe("NT 2024");
    expect(formatearReferencia({ norma: "DS 1/2022", articulos: ["art. 16 letra c"] })).toBe("DS 1/2022 · art. 16 letra c");
  });
});

describe("etiquetaEstadoAncla — W6.4", () => {
  test("vigente se muestra tal cual; pendiente usa el vocabulario [RATIFICAR] del proto", () => {
    expect(etiquetaEstadoAncla("vigente")).toBe("vigente");
    expect(etiquetaEstadoAncla("pendiente-ratificacion")).toBe("[RATIFICAR]");
  });
});
