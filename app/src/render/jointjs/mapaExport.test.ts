import { describe, expect, test } from "bun:test";
import { crearModelo } from "../../modelo/operaciones";
import { descargarMapa, exportarMapa, exportarTodosLosOpdsPngZip, nombreArchivoMapa, nombreArchivoOpdPng, nombreArchivoOpdsPngZip } from "./mapaExport";

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
  test("exportarMapa retorna PNG rasterizado desde el paper", async () => {
    const blob = await exportarMapa(paperFalso(), crearModelo("Mapa"), {});

    expect(blob.type).toBe("image/png");
  });

  test("exportarMapa funciona con el SVG DOM del paper OSS sin plugin toSVG", async () => {
    const blob = await exportarMapa(paperOssFalso(), crearModelo("Mapa"), {});

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
      await descargarMapa(paperFalso("<svg></svg>"), crearModelo("Mapa"), {});
    } finally {
      URL.createObjectURL = originalCreate;
      URL.revokeObjectURL = originalRevoke;
    }

    if (typeof document === "undefined") {
      expect(urls).toEqual([]);
    } else {
      expect(urls).toEqual(["image/png"]);
    }
  });

  test("nombreArchivoMapa normaliza nombre y fecha", () => {
    expect(nombreArchivoMapa(crearModelo("Mi Modelo"), new Date("2026-05-05T12:00:00.000Z")))
      .toBe("mi-modelo-mapa-2026-05-05.png");
  });

  test("nombreArchivoOpd deriva nombre portable desde modelo y OPD", () => {
    expect(nombreArchivoOpdPng(crearModelo("Mi Modelo"), "SD Principal", new Date("2026-05-05T12:00:00.000Z")))
      .toBe("mi-modelo-sd-principal-2026-05-05.png");
  });

  test("nombreArchivoOpdsPngZip deriva paquete portable", () => {
    expect(nombreArchivoOpdsPngZip(crearModelo("Mi Modelo"), new Date("2026-05-05T12:00:00.000Z")))
      .toBe("mi-modelo-opds-png-2026-05-05.zip");
  });

  test("exportarTodosLosOpdsPngZip empaqueta una imagen PNG por OPD", async () => {
    const modelo = crearModelo("Mi Modelo");
    modelo.opds["opd-hijo"] = {
      id: "opd-hijo",
      nombre: "SD Hijo",
      padreId: modelo.opdRaizId,
      apariencias: {},
      enlaces: {},
    };

    const zip = await exportarTodosLosOpdsPngZip(modelo);
    const bytes = new Uint8Array(await zip.arrayBuffer());
    const texto = new TextDecoder().decode(bytes);

    expect(zip.type).toBe("application/zip");
    expect(bytes[0]).toBe(0x50);
    expect(bytes[1]).toBe(0x4b);
    expect(texto).toContain("01-sd.png");
    expect(texto).toContain("02-sd-hijo.png");
  });
});
