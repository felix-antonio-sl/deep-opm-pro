import { describe, expect, test } from "bun:test";
import type { Modelo } from "../../modelo/tipos";
import { coberturaApariencias, etiquetaRefinamiento, listarApariciones } from "./aparicionesUtils";

function modeloBase(): Modelo {
  return {
    id: "m-1",
    nombre: "Modelo",
    opdRaizId: "opd-raiz",
    nextSeq: 1,
    entidades: {
      "p-padre": { id: "p-padre", tipo: "proceso", nombre: "Padre", esencia: "informacional", afiliacion: "sistemica", refinamientos: { descomposicion: { opdId: "opd-zoom" } } },
      "o-multi": { id: "o-multi", tipo: "objeto", nombre: "Multi", esencia: "informacional", afiliacion: "sistemica" },
      "o-solo": { id: "o-solo", tipo: "objeto", nombre: "Solo", esencia: "informacional", afiliacion: "sistemica" },
      "o-derivado": { id: "o-derivado", tipo: "objeto", nombre: "Derivado", esencia: "informacional", afiliacion: "sistemica", refinamientos: { despliegue: { opdId: "opd-unfold" } } },
    },
    estados: {},
    enlaces: {},
    opds: {
      "opd-raiz": {
        id: "opd-raiz",
        nombre: "SD",
        padreId: null,
        apariencias: {
          "ap-padre": { id: "ap-padre", entidadId: "p-padre", opdId: "opd-raiz", x: 0, y: 0, width: 100, height: 60 },
          "ap-multi-raiz": { id: "ap-multi-raiz", entidadId: "o-multi", opdId: "opd-raiz", x: 0, y: 0, width: 100, height: 60 },
          "ap-solo-raiz": { id: "ap-solo-raiz", entidadId: "o-solo", opdId: "opd-raiz", x: 0, y: 0, width: 100, height: 60 },
        },
        enlaces: {},
      },
      "opd-zoom": {
        id: "opd-zoom",
        nombre: "SD1 zoom",
        padreId: "opd-raiz",
        apariencias: {
          "ap-multi-zoom": { id: "ap-multi-zoom", entidadId: "o-multi", opdId: "opd-zoom", x: 0, y: 0, width: 100, height: 60 },
        },
        enlaces: {},
      },
      "opd-unfold": {
        id: "opd-unfold",
        nombre: "SD2 unfold",
        padreId: "opd-raiz",
        apariencias: {
          "ap-derivado": { id: "ap-derivado", entidadId: "o-derivado", opdId: "opd-unfold", x: 0, y: 0, width: 100, height: 60 },
        },
        enlaces: {},
      },
      "opd-extra-multi": {
        id: "opd-extra-multi",
        nombre: "Anexo",
        padreId: "opd-raiz",
        apariencias: {
          "ap-multi-extra": { id: "ap-multi-extra", entidadId: "o-multi", opdId: "opd-extra-multi", x: 0, y: 0, width: 100, height: 60 },
        },
        enlaces: {},
      },
    },
  } satisfies Modelo;
}

describe("listarApariciones", () => {
  test("retorna lista vacía cuando la entidad no aparece en ningún OPD", () => {
    const modelo = modeloBase();
    delete modelo.opds["opd-raiz"]?.apariencias["ap-solo-raiz"];
    expect(listarApariciones(modelo, "o-solo", "opd-raiz")).toEqual([]);
  });

  test("retorna apariencias ordenadas con OPD raíz primero", () => {
    const items = listarApariciones(modeloBase(), "o-multi", "opd-raiz");
    expect(items.map((i) => i.opdId)).toEqual(["opd-raiz", "opd-extra-multi", "opd-zoom"]);
  });

  test("incluye refinamientoTipo correcto cuando el OPD destino es descomposición", () => {
    const item = listarApariciones(modeloBase(), "o-multi", "opd-raiz")
      .find((i) => i.opdId === "opd-zoom");
    expect(item?.refinamientoTipo).toBe("descomposicion");
  });

  test("incluye refinamientoTipo despliegue para OPDs de unfold", () => {
    const item = listarApariciones(modeloBase(), "o-derivado", "opd-raiz")
      .find((i) => i.opdId === "opd-unfold");
    expect(item?.refinamientoTipo).toBe("despliegue");
  });

  test("marca como activo el OPD que coincide con opdActivoId", () => {
    const items = listarApariciones(modeloBase(), "o-multi", "opd-zoom");
    expect(items.find((i) => i.opdId === "opd-zoom")?.esActivo).toBe(true);
    expect(items.filter((i) => i.esActivo).length).toBe(1);
  });

  test("la apariencia del OPD raíz tiene refinamientoTipo null cuando ninguna entidad lo refina", () => {
    const items = listarApariciones(modeloBase(), "p-padre", "opd-raiz");
    expect(items[0]?.refinamientoTipo).toBeNull();
  });

  test("retorna una sola fila por OPD aunque haya múltiples apariencias en él", () => {
    const modelo = modeloBase();
    const opd = modelo.opds["opd-raiz"];
    if (!opd) throw new Error("opd-raiz no existe en fixture");
    opd.apariencias["ap-multi-raiz-2"] = {
      id: "ap-multi-raiz-2", entidadId: "o-multi", opdId: "opd-raiz", x: 200, y: 200, width: 100, height: 60,
    };
    const items = listarApariciones(modelo, "o-multi", "opd-raiz");
    expect(items.filter((i) => i.opdId === "opd-raiz").length).toBe(1);
  });
});

describe("coberturaApariencias", () => {
  test("cuenta total y opdsConEntidad para entidades multi-OPD", () => {
    expect(coberturaApariencias(modeloBase(), "o-multi")).toEqual({ totalApariencias: 3, opdsConEntidad: 3 });
  });

  test("retorna ceros cuando la entidad no tiene apariencias", () => {
    const modelo = modeloBase();
    delete modelo.opds["opd-raiz"]?.apariencias["ap-solo-raiz"];
    expect(coberturaApariencias(modelo, "o-solo")).toEqual({ totalApariencias: 0, opdsConEntidad: 0 });
  });

  test("cuenta múltiples apariencias del mismo OPD como un único OPD", () => {
    const modelo = modeloBase();
    const opd = modelo.opds["opd-raiz"];
    if (!opd) throw new Error("opd-raiz no existe en fixture");
    opd.apariencias["ap-solo-raiz-2"] = {
      id: "ap-solo-raiz-2", entidadId: "o-solo", opdId: "opd-raiz", x: 200, y: 200, width: 100, height: 60,
    };
    expect(coberturaApariencias(modelo, "o-solo")).toEqual({ totalApariencias: 2, opdsConEntidad: 1 });
  });
});

describe("etiquetaRefinamiento", () => {
  test("traduce descomposicion a in-zoom", () => {
    expect(etiquetaRefinamiento("descomposicion")).toBe("in-zoom");
  });

  test("traduce despliegue a unfold", () => {
    expect(etiquetaRefinamiento("despliegue")).toBe("unfold");
  });

  test("retorna 'raíz' cuando no hay refinamiento", () => {
    expect(etiquetaRefinamiento(null)).toBe("raíz");
  });
});
