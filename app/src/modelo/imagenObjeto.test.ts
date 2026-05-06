import { afterEach, describe, expect, test } from "bun:test";
import {
  degradarSiFallido,
  limpiarCacheImagenes,
  precargarBitmap,
  registrarCacheImagen,
  validarUrlImagen,
} from "./imagenObjeto";
import { crearModelo, crearObjeto } from "./operaciones";
import type { Modelo, Resultado } from "./tipos";

describe("imagenObjeto", () => {
  afterEach(() => {
    limpiarCacheImagenes();
    delete (globalThis as { Image?: unknown }).Image;
  });

  test("valida URL pública con extensión de imagen", () => {
    expect(validarUrlImagen("https://example.com/foto.webp?cache=1")).toEqual({ ok: true, value: "https://example.com/foto.webp?cache=1" });
    expect(validarUrlImagen("ftp://example.com/foto.png").ok).toBe(false);
    expect(validarUrlImagen("https://example.com/foto.txt").ok).toBe(false);
  });

  test("precarga bitmap usando Image y retorna null al fallar", async () => {
    instalarImageMock("ok");
    await expect(precargarBitmap("https://example.com/a.png", 50)).resolves.toBeTruthy();

    instalarImageMock("error");
    await expect(precargarBitmap("https://example.com/a.png", 50)).resolves.toBeNull();
  });

  test("degrada modo a texto si cache marca fallo", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Objeto"));
    const entidadId = Object.keys(modelo.entidades)[0]!;
    const cache = registrarCacheImagen("https://example.com/a.png", "fallido", 123);
    modelo = {
      ...modelo,
      entidades: {
        ...modelo.entidades,
        [entidadId]: {
          ...modelo.entidades[entidadId]!,
          imagen: { url: "https://example.com/a.png", modo: "imagen", cache },
        },
      },
    };

    expect(degradarSiFallido(modelo, entidadId).entidades[entidadId]?.imagen?.modo).toBe("texto");
  });
});

function instalarImageMock(resultado: "ok" | "error"): void {
  class ImageMock {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    set src(_url: string) {
      queueMicrotask(() => {
        if (resultado === "ok") this.onload?.();
        else this.onerror?.();
      });
    }
  }
  (globalThis as { Image?: unknown }).Image = ImageMock;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
