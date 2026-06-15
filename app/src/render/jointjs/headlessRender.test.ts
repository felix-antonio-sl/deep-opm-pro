import { describe, expect, test } from "bun:test";
import { crearModelo } from "../../modelo/operaciones";
import { exportarModelo } from "../../serializacion/json";
import { renderModeloHeadless, seleccionarOpds } from "./headlessRender";

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

describe("seleccionarOpds (--solo-opd)", () => {
  const opds = [{ opdId: "opd-1" }, { opdId: "opd-2" }, { opdId: "opd-3" }];

  test("sin --solo-opd devuelve todos los OPDs y ningún error", () => {
    const r = seleccionarOpds(opds);

    expect(r.error).toBeUndefined();
    expect(r.seleccion).toEqual(opds);
  });

  test("--solo-opd existente filtra al OPD pedido", () => {
    const r = seleccionarOpds(opds, "opd-2");

    expect(r.error).toBeUndefined();
    expect(r.seleccion).toEqual([{ opdId: "opd-2" }]);
  });

  test("--solo-opd inexistente devuelve error con los OPDs disponibles (H1H2-04)", () => {
    const r = seleccionarOpds(opds, "opd-99");

    expect(r.seleccion).toEqual([]);
    expect(r.error).toBe("OPD opd-99 no existe; disponibles: opd-1, opd-2, opd-3");
  });

  test("--solo-opd inexistente sobre modelo sin OPDs lista '(ninguno)'", () => {
    const r = seleccionarOpds([], "opd-1");

    expect(r.seleccion).toEqual([]);
    expect(r.error).toBe("OPD opd-1 no existe; disponibles: (ninguno)");
  });
});
