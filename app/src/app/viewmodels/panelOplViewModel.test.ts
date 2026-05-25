import { describe, expect, test } from "bun:test";
import { crearModelo } from "../../modelo/operaciones";
import type { Modelo } from "../../modelo/tipos/modelo";
import { codigoCanonicoSeleccion, panelOplMinimizadoEfectivo } from "./panelOplViewModel";

describe("panelOplMinimizadoEfectivo", () => {
  test("queda expandido por default en la marginalia izquierda Codex v1.1", () => {
    expect(panelOplMinimizadoEfectivo(undefined, null, null)).toBe(false);
  });

  test("expande por DataFlow cuando hay seleccion y el usuario no lo minimizo explicitamente", () => {
    expect(panelOplMinimizadoEfectivo(undefined, "ent-1", null)).toBe(false);
    expect(panelOplMinimizadoEfectivo(undefined, null, "link-1")).toBe(false);
  });

  test("respeta la preferencia explicita del usuario", () => {
    expect(panelOplMinimizadoEfectivo(false, null, null)).toBe(false);
    expect(panelOplMinimizadoEfectivo(true, "ent-1", null)).toBe(true);
  });
});

describe("codigoCanonicoSeleccion [Codex L6 · chip filtro G7]", () => {
  const modelo: Modelo = {
    ...crearModelo(),
    entidades: {
      "o-6": { id: "o-6", tipo: "objeto", nombre: "Cliente", esencia: "informacional", afiliacion: "sistemica" },
      "p-2": { id: "p-2", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {
      "s-3": { id: "s-3", entidadId: "o-6", nombre: "activo", orden: 0 },
    },
  } as Modelo;

  test("objeto y proceso usan prefijo por clase + secuencia zero-pad", () => {
    expect(codigoCanonicoSeleccion(modelo, { tipo: "entidad", id: "o-6" })).toBe("o.06");
    expect(codigoCanonicoSeleccion(modelo, { tipo: "entidad", id: "p-2" })).toBe("p.02");
  });

  test("estado usa prefijo s.", () => {
    expect(codigoCanonicoSeleccion(modelo, { tipo: "estado", id: "s-3" })).toBe("s.03");
  });

  test("enlace y selección ausente no llevan código", () => {
    expect(codigoCanonicoSeleccion(modelo, { tipo: "enlace", id: "l-1" })).toBeNull();
    expect(codigoCanonicoSeleccion(modelo, null)).toBeNull();
  });

  test("id inexistente devuelve null sin romper", () => {
    expect(codigoCanonicoSeleccion(modelo, { tipo: "entidad", id: "o-99" })).toBeNull();
  });
});
