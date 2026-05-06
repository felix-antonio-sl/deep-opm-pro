import { describe, expect, test } from "bun:test";
import {
  crearLineaOplInteractiva,
  referenciaEnlaceEspecifico,
  type OplReferencia,
} from "./interaccion";

describe("interaccion OPL", () => {
  test("referenciaEnlaceEspecifico retorna el enlace del token verbo", () => {
    const linea = crearLineaOplInteractiva(
      "l1",
      "*Procesar* consume **Entrada**.",
      1,
      [{ tipo: "enlace", id: "e1" }, { tipo: "entidad", id: "p1" }, { tipo: "entidad", id: "o1" }],
      [{ texto: "consume", ref: { tipo: "enlace", id: "e1" }, rol: "verbo" }],
    );

    expect(referenciaEnlaceEspecifico(linea, 1)).toEqual({ tipo: "enlace", id: "e1" });
  });

  test("referenciaEnlaceEspecifico distingue endpoint de segunda rama multi-enlace", () => {
    const refs: OplReferencia[] = [
      { tipo: "entidad", id: "puerto" },
      { tipo: "enlace", id: "e1" },
      { tipo: "entidad", id: "puerto" },
      { tipo: "entidad", id: "a" },
      { tipo: "enlace", id: "e2" },
      { tipo: "entidad", id: "puerto" },
      { tipo: "entidad", id: "b" },
    ];
    const linea = crearLineaOplInteractiva(
      "l2",
      "**Puerto** consume al menos uno de **A** o **B**.",
      1,
      refs,
      [
        { texto: "**A**", ref: { tipo: "entidad", id: "a" }, rol: "nombre", markdown: "objeto" },
        { texto: "**B**", ref: { tipo: "entidad", id: "b" }, rol: "nombre", markdown: "objeto" },
      ],
    );

    const indiceB = linea.tokens.findIndex((token) => token.texto === "**B**");
    expect(referenciaEnlaceEspecifico(linea, indiceB)).toEqual({ tipo: "enlace", id: "e2" });
  });

  test("referenciaEnlaceEspecifico no reemplaza entidad simple sin enlace adyacente", () => {
    const linea = crearLineaOplInteractiva(
      "l3",
      "**Entrada** es un objeto.",
      1,
      [{ tipo: "entidad", id: "o1" }],
      [{ texto: "**Entrada**", ref: { tipo: "entidad", id: "o1" }, rol: "nombre", markdown: "objeto" }],
    );

    expect(referenciaEnlaceEspecifico(linea, 0)).toBeNull();
  });

  test("referenciaEnlaceEspecifico retorna null para token fuera de rango", () => {
    const linea = crearLineaOplInteractiva("l4", "Texto libre.", 1, []);

    expect(referenciaEnlaceEspecifico(linea, 99)).toBeNull();
  });
});
