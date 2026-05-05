import { describe, expect, test } from "bun:test";
import { crearModelo } from "../../modelo/operaciones";
import type { Modelo } from "../../modelo/tipos";
import { construirArbol, expandirTodoArbol, idsColapsables } from "./togglesArbol";

describe("toggles del arbol OPD", () => {
  test("expandirTodo deja set colapsados vacio", () => {
    expect(expandirTodoArbol().size).toBe(0);
  });

  test("idsColapsables identifica nodos con hijos", () => {
    const arbol = construirArbol(modeloConHijo());
    expect(idsColapsables(arbol).has("opd-raiz")).toBe(true);
  });
});

function modeloConHijo(): Modelo {
  const modelo = crearModelo("Arbol");
  return {
    ...modelo,
    opdRaizId: "opd-raiz",
    opds: {
      "opd-raiz": { id: "opd-raiz", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} },
      "opd-hijo": { id: "opd-hijo", nombre: "SD1", padreId: "opd-raiz", apariencias: {}, enlaces: {} },
    },
  };
}
