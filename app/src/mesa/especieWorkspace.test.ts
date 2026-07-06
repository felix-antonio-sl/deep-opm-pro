import { describe, expect, test } from "bun:test";
import { mapaEspeciePorModelo } from "./especieWorkspace";

/**
 * `mapaEspeciePorModelo` cruza el índice de workspace (única fuente que hoy
 * persiste `esApunte`/`esBiblioteca` — el record de Postgres NO los trae) por
 * id de modelo, reutilizando `especieDe` (ver ../persistencia/especie) sin
 * re-derivar la lógica. Pura: sin red, sin CLI.
 */
describe("mapaEspeciePorModelo", () => {
  test("modelo con esApunte → 'apunte'", () => {
    const mapa = mapaEspeciePorModelo({ modelos: [{ id: "m1", esApunte: true }] });
    expect(mapa.get("m1")).toBe("apunte");
  });

  test("modelo con esBiblioteca → 'biblioteca'", () => {
    const mapa = mapaEspeciePorModelo({ modelos: [{ id: "m1", esBiblioteca: true }] });
    expect(mapa.get("m1")).toBe("biblioteca");
  });

  test("modelo sin flags → 'modelo'", () => {
    const mapa = mapaEspeciePorModelo({ modelos: [{ id: "m1" }] });
    expect(mapa.get("m1")).toBe("modelo");
  });

  test("modelo ausente del índice → el mapa no trae esa id (el llamador decide el default 'modelo')", () => {
    const mapa = mapaEspeciePorModelo({ modelos: [{ id: "otro", esApunte: true }] });
    expect(mapa.has("m1")).toBe(false);
    expect(mapa.get("m1")).toBeUndefined();
  });

  test("índice con varios modelos → un entry por id, cada uno con su propia especie", () => {
    const mapa = mapaEspeciePorModelo({
      modelos: [
        { id: "a", esApunte: true },
        { id: "b", esBiblioteca: true },
        { id: "c" },
      ],
    });
    expect(mapa.size).toBe(3);
    expect(mapa.get("a")).toBe("apunte");
    expect(mapa.get("b")).toBe("biblioteca");
    expect(mapa.get("c")).toBe("modelo");
  });
});
