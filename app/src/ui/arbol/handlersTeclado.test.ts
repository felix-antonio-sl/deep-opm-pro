import { describe, expect, test } from "bun:test";
import type { NodoOpdData } from "../../app/viewmodels/arbolOpdEstructura";
import { atajoPanelArbolDesdeEvento, siguienteFocoArbol } from "./handlersTeclado";

describe("handlers teclado del arbol OPD", () => {
  test("onCtrlArrow down mueve el foco al siguiente nodo en orden", () => {
    const nodos = [nodo("opd-1"), nodo("opd-2"), nodo("opd-3")];
    expect(siguienteFocoArbol(nodos, "opd-1", "down")).toBe("opd-2");
  });

  test("onCtrlArrow up mueve el foco al nodo anterior", () => {
    const nodos = [nodo("opd-1"), nodo("opd-2"), nodo("opd-3")];
    expect(siguienteFocoArbol(nodos, "opd-3", "up")).toBe("opd-2");
  });

  test("detecta F2 para renombrado inline", () => {
    expect(atajoPanelArbolDesdeEvento(evento("F2"))).toBe("renombrar");
  });

  test("detecta Ctrl+E y Ctrl+Shift+E para expansion masiva", () => {
    expect(atajoPanelArbolDesdeEvento(evento("e", { ctrlKey: true }))).toBe("expandir-todo");
    expect(atajoPanelArbolDesdeEvento(evento("E", { ctrlKey: true, shiftKey: true }))).toBe("colapsar-todo");
  });

  test("detecta Ctrl+D para abrir gestion de arbol", () => {
    expect(atajoPanelArbolDesdeEvento(evento("d", { ctrlKey: true }))).toBe("abrir-gestion");
  });
});

function evento(key: string, opts: Partial<Pick<KeyboardEvent, "ctrlKey" | "metaKey" | "shiftKey">> = {}) {
  return {
    key,
    ctrlKey: opts.ctrlKey ?? false,
    metaKey: opts.metaKey ?? false,
    shiftKey: opts.shiftKey ?? false,
  };
}

function nodo(id: string): NodoOpdData {
  return {
    opd: { id, nombre: id, padreId: null, apariencias: {}, enlaces: {} },
    nivel: 0,
    hijos: [],
  };
}
