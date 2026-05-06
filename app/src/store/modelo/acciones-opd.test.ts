import { describe, expect, test } from "bun:test";
import { crearModelo } from "../../modelo/operaciones";
import type { Modelo } from "../../modelo/tipos";
import {
  moverOpdGestion,
  renombrarOpdDesdeArbol,
  reordenarHermanosAutomaticamente,
  reordenarOpdsHermanos,
} from "./acciones-opd";

describe("acciones OPD de arbol", () => {
  test("renombrarOpdDesdeArbol preserva nombre si el input queda vacio", () => {
    const modelo = modeloConHermanos();
    const resultado = renombrarOpdDesdeArbol(modelo, "opd-a", "   ");
    expect(resultado.ok).toBe(true);
    if (resultado.ok) expect(resultado.value.opds["opd-a"]?.nombre).toBe("SD1");
  });

  test("renombrarOpdDesdeArbol agrega sufijo si duplica a un hermano", () => {
    const modelo = modeloConHermanos();
    const resultado = renombrarOpdDesdeArbol(modelo, "opd-b", "SD1");
    expect(resultado.ok).toBe(true);
    if (resultado.ok) expect(resultado.value.opds["opd-b"]?.nombre).toBe("SD1 2");
  });

  test("reordenarOpdsHermanos persiste orden local lossless", () => {
    const modelo = modeloConHermanos();
    const resultado = reordenarOpdsHermanos(modelo, modelo.opdRaizId, ["opd-b", "opd-a"]);
    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      expect(resultado.value.opds["opd-b"]?.ordenLocal).toBe(0);
      expect(resultado.value.opds["opd-a"]?.ordenLocal).toBe(1);
    }
  });

  test("reordenarHermanosAutomaticamente ordena por Y del refinador en el padre", () => {
    const modelo = modeloConHermanos();
    const resultado = reordenarHermanosAutomaticamente(modelo, modelo.opdRaizId);
    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      expect(resultado.value.opds["opd-b"]?.ordenLocal).toBe(0);
      expect(resultado.value.opds["opd-a"]?.ordenLocal).toBe(1);
    }
  });

  test("moverOpdGestion rechaza pegar un OPD bajo su descendiente", () => {
    const modelo = modeloConHermanos();
    const resultado = moverOpdGestion(modelo, "opd-a", "opd-a-1");
    expect(resultado.ok).toBe(false);
  });
});

function modeloConHermanos(): Modelo {
  const modelo = crearModelo("Arbol");
  return {
    ...modelo,
    opdRaizId: "opd-raiz",
    entidades: {
      ...modelo.entidades,
      "proc-a": { id: "proc-a", tipo: "proceso", nombre: "A", esencia: "informacional", afiliacion: "sistemica", refinamiento: { tipo: "descomposicion", opdId: "opd-a" } },
      "proc-b": { id: "proc-b", tipo: "proceso", nombre: "B", esencia: "informacional", afiliacion: "sistemica", refinamiento: { tipo: "descomposicion", opdId: "opd-b" } },
    },
    opds: {
      "opd-raiz": {
        id: "opd-raiz",
        nombre: "SD",
        padreId: null,
        apariencias: {
          "ap-a": { id: "ap-a", entidadId: "proc-a", opdId: "opd-raiz", x: 100, y: 200, width: 135, height: 60 },
          "ap-b": { id: "ap-b", entidadId: "proc-b", opdId: "opd-raiz", x: 100, y: 100, width: 135, height: 60 },
        },
        enlaces: {},
      },
      "opd-a": { id: "opd-a", nombre: "SD1", padreId: "opd-raiz", apariencias: {}, enlaces: {} },
      "opd-b": { id: "opd-b", nombre: "SD2", padreId: "opd-raiz", apariencias: {}, enlaces: {} },
      "opd-a-1": { id: "opd-a-1", nombre: "SD1.1", padreId: "opd-a", apariencias: {}, enlaces: {} },
    },
  };
}
