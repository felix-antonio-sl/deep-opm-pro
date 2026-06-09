import { describe, expect, test } from "bun:test";
import { crearModelo } from "../../modelo/operaciones";
import { exportarModelo } from "../../serializacion/json";
import { renderModeloHeadless } from "./headlessRender";

describe("headlessRender", () => {
  test("renderModeloHeadless rechaza JSON inválido con el error de hidratación", async () => {
    const r = await renderModeloHeadless("{ esto no es un modelo válido");

    expect(r.ok).toBe(false);
    expect(r.opds).toEqual([]);
    expect(r.error).toBeTruthy();
  });

  test("renderModeloHeadless señala render-sin-DOM con un modelo válido fuera del navegador", async () => {
    const json = exportarModelo(crearModelo("Mi Modelo"));

    const r = await renderModeloHeadless(json);

    expect(r.ok).toBe(false);
    expect(r.error).toBe("render-sin-DOM");
  });
});
