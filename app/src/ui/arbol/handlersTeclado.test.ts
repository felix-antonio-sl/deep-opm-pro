import { describe, expect, test } from "bun:test";
import type { NodoOpdData } from "./NodoOpd";
import { siguienteFocoArbol } from "./handlersTeclado";

describe("handlers teclado del arbol OPD", () => {
  test("onCtrlArrow down mueve el foco al siguiente nodo en orden", () => {
    const nodos = [nodo("opd-1"), nodo("opd-2"), nodo("opd-3")];
    expect(siguienteFocoArbol(nodos, "opd-1", "down")).toBe("opd-2");
  });

  test("onCtrlArrow up mueve el foco al nodo anterior", () => {
    const nodos = [nodo("opd-1"), nodo("opd-2"), nodo("opd-3")];
    expect(siguienteFocoArbol(nodos, "opd-3", "up")).toBe("opd-2");
  });
});

function nodo(id: string): NodoOpdData {
  return {
    opd: { id, nombre: id, padreId: null, apariencias: {}, enlaces: {} },
    nivel: 0,
    hijos: [],
  };
}
