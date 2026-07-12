import { describe, expect, test } from "bun:test";
import { crearModelo } from "../../modelo/operaciones";
import { crearOpdSuelto } from "../../modelo/operaciones/opdSuelto";
import type { Modelo } from "../../modelo/tipos";
import { construirArbol, nodosSueltosTaller } from "../../app/viewmodels/arbolOpdEstructura";
import { expandirTodoArbol, idsColapsables } from "./togglesArbol";

describe("toggles del arbol OPD", () => {
  test("expandirTodo deja set colapsados vacio", () => {
    expect(expandirTodoArbol().size).toBe(0);
  });

  test("idsColapsables identifica nodos con hijos", () => {
    const arbol = construirArbol(modeloConHijo());
    expect(idsColapsables(arbol).has("opd-raiz")).toBe(true);
  });

  test("idsColapsables preserva contrato de colapso total", () => {
    const arbol = construirArbol(modeloConHijo());
    expect(idsColapsables(arbol)).toEqual(new Set(["opd-raiz"]));
  });
});

describe("banda Taller en el árbol", () => {
  test("un suelto NO cuelga de la raíz; aparece en la banda Taller", () => {
    const { modelo, opdId } = crearOpdSuelto(crearModelo("M"));
    const arbol = construirArbol(modelo);
    const raiz = arbol[0]!;
    expect(raiz.hijos.some((h) => h.opd.id === opdId)).toBe(false);
    const taller = nodosSueltosTaller(modelo);
    expect(taller.map((n) => n.opd.id)).toContain(opdId);
  });

  test("un huérfano CORRUPTO (padre inexistente) sigue colgando de la raíz (defensivo)", () => {
    const m = crearModelo("M");
    const corrupto = { ...m, opds: { ...m.opds, "opd-x": { id: "opd-x", nombre: "x", padreId: "opd-fantasma", apariencias: {}, enlaces: {} } } };
    const raiz = construirArbol(corrupto)[0]!;
    expect(raiz.hijos.some((h) => h.opd.id === "opd-x")).toBe(true);
    expect(nodosSueltosTaller(corrupto).some((n) => n.opd.id === "opd-x")).toBe(false);
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
