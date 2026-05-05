import { describe, expect, test } from "bun:test";
import { crearLineaOplInteractiva } from "./interaccion";
import { agruparOracionesPorOpd, aplanarBloquesOpl, chevronEstadoBloque, togglearColapsoBloque } from "./bloquesJerarquicos";
import { crearModelo } from "../modelo/operaciones";
import type { Modelo } from "../modelo/tipos";

describe("bloques OPL jerarquicos", () => {
  test("agruparOracionesPorOpd agrupa 5 oraciones en 2 OPDs", () => {
    const modelo = modeloConDosOpds();
    const oraciones = [
      crearLineaOplInteractiva("l1", "a", 1, [], [], { opdId: "opd-1", opdNombre: "SD", opdProfundidad: 0 }),
      crearLineaOplInteractiva("l2", "b", 2, [], [], { opdId: "opd-1", opdNombre: "SD", opdProfundidad: 0 }),
      crearLineaOplInteractiva("l3", "c", 3, [], [], { opdId: "opd-1", opdNombre: "SD", opdProfundidad: 0 }),
      crearLineaOplInteractiva("l4", "d", 1, [], [], { opdId: "opd-2", opdNombre: "SD1", opdProfundidad: 1 }),
      crearLineaOplInteractiva("l5", "e", 2, [], [], { opdId: "opd-2", opdNombre: "SD1", opdProfundidad: 1 }),
    ];

    const bloques = agruparOracionesPorOpd(oraciones, modelo);

    expect(bloques).toHaveLength(2);
    expect(bloques[0]?.opdId).toBe("opd-1");
    expect(bloques[0]?.oraciones).toHaveLength(3);
    expect(bloques[1]?.opdId).toBe("opd-2");
    expect(bloques[1]?.profundidad).toBe(1);
  });

  test("aplanarBloquesOpl omite oraciones colapsadas y conserva chevron", () => {
    const modelo = modeloConDosOpds();
    const bloques = agruparOracionesPorOpd([
      crearLineaOplInteractiva("l1", "a", 1, [], [], { opdId: "opd-1" }),
      crearLineaOplInteractiva("l2", "b", 1, [], [], { opdId: "opd-2" }),
    ], modelo);
    const colapsados = togglearColapsoBloque(new Set(), "opd-2");

    expect(chevronEstadoBloque(colapsados, "opd-2")).toBe("colapsado");
    expect(aplanarBloquesOpl(bloques, colapsados).map((linea) => linea.texto)).toEqual(["a"]);
  });
});

function modeloConDosOpds(): Modelo {
  const modelo = crearModelo("Bloques");
  return {
    ...modelo,
    opds: {
      ...modelo.opds,
      "opd-2": {
        id: "opd-2",
        nombre: "SD1",
        padreId: modelo.opdRaizId,
        apariencias: {},
        enlaces: {},
      },
    },
  };
}
