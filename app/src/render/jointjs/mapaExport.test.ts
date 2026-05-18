import { describe, expect, test } from "bun:test";
import { crearModelo } from "../../modelo/operaciones";
import { descargarMapa, exportarMapa, nombreArchivoMapa, nombreArchivoOpd } from "./mapaExport";

function paperFalso(svg = "<svg width=\"320\" height=\"180\"><rect width=\"10\" height=\"10\"/></svg>") {
  return {
    toSVG() {
      return svg;
    },
  } as never;
}

function paperOssFalso(svg = "<svg width=\"320\" height=\"180\"><text>SD</text></svg>") {
  return {
    el: {
      querySelector(selector: string) {
        return selector === "svg" ? { outerHTML: svg } : null;
      },
    },
  } as never;
}

describe("mapaExport", () => {
  test("exportarMapa retorna SVG serializado", async () => {
    const blob = await exportarMapa(paperFalso(), crearModelo("Mapa"), { formato: "svg" });

    expect(blob.type).toBe("image/svg+xml");
    expect(await blob.text()).toContain("<svg");
  });

  test("exportarMapa funciona con el SVG DOM del paper OSS sin plugin toSVG", async () => {
    const blob = await exportarMapa(paperOssFalso(), crearModelo("Mapa"), { formato: "svg" });
    const svg = await blob.text();

    expect(blob.type).toBe("image/svg+xml");
    expect(svg).toContain("xmlns=\"http://www.w3.org/2000/svg\"");
    expect(svg).toContain("<text>SD</text>");
  });

  test("exportarMapa retorna PNG sin dependencia externa", async () => {
    const blob = await exportarMapa(paperFalso(), crearModelo("Mapa"), { formato: "png" });

    expect(blob.type).toBe("image/png");
  });

  test("descargarMapa no rechaza con paper vacío", async () => {
    const urls: string[] = [];
    const originalCreate = URL.createObjectURL;
    const originalRevoke = URL.revokeObjectURL;
    URL.createObjectURL = ((blob: Blob) => {
      urls.push(blob.type);
      return "blob:mapa";
    }) as typeof URL.createObjectURL;
    URL.revokeObjectURL = (() => undefined) as typeof URL.revokeObjectURL;
    try {
      await descargarMapa(paperFalso("<svg></svg>"), crearModelo("Mapa"), { formato: "svg" });
    } finally {
      URL.createObjectURL = originalCreate;
      URL.revokeObjectURL = originalRevoke;
    }

    if (typeof document === "undefined") {
      expect(urls).toEqual([]);
    } else {
      expect(urls).toEqual(["image/svg+xml"]);
    }
  });

  test("nombreArchivoMapa normaliza nombre y fecha", () => {
    expect(nombreArchivoMapa(crearModelo("Mi Modelo"), "svg", new Date("2026-05-05T12:00:00.000Z")))
      .toBe("mi-modelo-mapa-2026-05-05.svg");
  });

  test("nombreArchivoOpd deriva nombre portable desde modelo y OPD", () => {
    expect(nombreArchivoOpd(crearModelo("Mi Modelo"), "SD Principal", new Date("2026-05-05T12:00:00.000Z")))
      .toBe("mi-modelo-sd-principal-2026-05-05.svg");
  });
});
