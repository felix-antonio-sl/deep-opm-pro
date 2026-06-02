import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, crearEnlace } from "../operaciones";
import type { Id, Modelo, Resultado } from "../tipos";
import { derivar } from "./derivar";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}
function idPorNombre(modelo: Modelo, nombre: string): Id {
  return Object.values(modelo.entidades).find((e) => e.nombre === nombre)!.id;
}

/** Doc (objeto) consumido por Editar (proceso). */
function modeloAfecta(): Modelo {
  let m = crearModelo();
  m = must(crearObjeto(m, m.opdRaizId, { x: 100, y: 100 }, "Doc"));
  m = must(crearProceso(m, m.opdRaizId, { x: 320, y: 100 }, "Editar"));
  m = must(crearEnlace(m, m.opdRaizId, idPorNombre(m, "Doc"), idPorNombre(m, "Editar"), "consumo"));
  return m;
}

/** Fabricar →(resultado) Pieza →(consumo) Ensamblar : cadena de precondición. */
function modeloCadena(): Modelo {
  let m = crearModelo();
  m = must(crearProceso(m, m.opdRaizId, { x: 100, y: 100 }, "Fabricar"));
  m = must(crearObjeto(m, m.opdRaizId, { x: 300, y: 100 }, "Pieza"));
  m = must(crearProceso(m, m.opdRaizId, { x: 500, y: 100 }, "Ensamblar"));
  m = must(crearEnlace(m, m.opdRaizId, idPorNombre(m, "Fabricar"), idPorNombre(m, "Pieza"), "resultado"));
  m = must(crearEnlace(m, m.opdRaizId, idPorNombre(m, "Pieza"), idPorNombre(m, "Ensamblar"), "consumo"));
  return m;
}

describe("razonamiento/derivar", () => {
  test("afectan-a: lista el proceso que consume/afecta a un objeto", () => {
    const m = modeloAfecta();
    const editar = idPorNombre(m, "Editar");
    const r = derivar(m, { tipo: "afectan-a", entidadId: idPorNombre(m, "Doc") });
    expect(r.some((h) => h.inferido && h.procesoId === editar)).toBe(true);
  });

  test("requerido-por: cierre transitivo de precondiciones (Pieza y su productor Fabricar)", () => {
    const m = modeloCadena();
    const r = derivar(m, { tipo: "requerido-por", procesoId: idPorNombre(m, "Ensamblar") });
    const ids = new Set(r.map((h) => h.entidadId));
    expect(ids.has(idPorNombre(m, "Pieza"))).toBe(true);
    expect(ids.has(idPorNombre(m, "Fabricar"))).toBe(true); // transitivo: productor de Pieza
  });

  test("impacto-de-eliminar: incluye los enlaces incidentes al elemento", () => {
    const m = modeloAfecta();
    const r = derivar(m, { tipo: "impacto-de-eliminar", elementoId: idPorNombre(m, "Doc") });
    expect(r.some((h) => h.enlaceId !== undefined)).toBe(true);
  });

  test("todo HechoDerivado está marcado inferido (nunca se confunde con hecho declarado)", () => {
    const m = modeloCadena();
    const r = derivar(m, { tipo: "requerido-por", procesoId: idPorNombre(m, "Ensamblar") });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((h) => h.inferido === true)).toBe(true);
  });

  test("derivar es puro y determinista", () => {
    const m = modeloCadena();
    const antes = JSON.stringify(m);
    const r1 = derivar(m, { tipo: "requerido-por", procesoId: idPorNombre(m, "Ensamblar") });
    const r2 = derivar(m, { tipo: "requerido-por", procesoId: idPorNombre(m, "Ensamblar") });
    expect(JSON.stringify(m)).toBe(antes);
    expect(r1).toEqual(r2);
  });

  test("impacto-de-eliminar: distingue cada estado de la entidad por estadoId", () => {
    const base = modeloAfecta();
    const doc = idPorNombre(base, "Doc");
    const m: Modelo = {
      ...base,
      estados: {
        ...base.estados,
        e1: { id: "e1", entidadId: doc, nombre: "borrador" },
        e2: { id: "e2", entidadId: doc, nombre: "final" },
      },
    };
    const r = derivar(m, { tipo: "impacto-de-eliminar", elementoId: doc });
    const estados = new Set(r.map((h) => h.estadoId).filter(Boolean));
    // sin estadoId, eliminar Doc producía N hechos {entidadId:Doc} indistinguibles.
    expect(estados.has("e1")).toBe(true);
    expect(estados.has("e2")).toBe(true);
  });

  // Controles NEGATIVOS (la auditoría halló la unidad solo con casos positivos):
  // la derivación no debe inferir lo que la estructura no implica.
  test("control negativo: entidad aislada no es afectada por ningún proceso", () => {
    let m = crearModelo();
    m = must(crearObjeto(m, m.opdRaizId, { x: 100, y: 100 }, "Aislado"));
    expect(derivar(m, { tipo: "afectan-a", entidadId: idPorNombre(m, "Aislado") })).toHaveLength(0);
  });

  test("control negativo: proceso sin precondiciones no requiere nada", () => {
    let m = crearModelo();
    m = must(crearProceso(m, m.opdRaizId, { x: 100, y: 100 }, "Solo"));
    expect(derivar(m, { tipo: "requerido-por", procesoId: idPorNombre(m, "Solo") })).toHaveLength(0);
  });

  test("control negativo: elemento sin incidencias no impacta nada al eliminarse", () => {
    let m = crearModelo();
    m = must(crearObjeto(m, m.opdRaizId, { x: 100, y: 100 }, "Suelto"));
    expect(derivar(m, { tipo: "impacto-de-eliminar", elementoId: idPorNombre(m, "Suelto") })).toHaveLength(0);
  });
});

/** Huevo: crudo -(Cocinar)-> cocido; `podrido` queda desconectado del inicial. */
function modeloTransicionEstados(): Modelo {
  return {
    id: "m",
    nombre: "m",
    opdRaizId: "raiz",
    nextSeq: 100,
    entidades: {
      Huevo: { id: "Huevo", tipo: "objeto", nombre: "Huevo", esencia: "fisica", afiliacion: "sistemica" },
      Cocinar: { id: "Cocinar", tipo: "proceso", nombre: "Cocinar", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {
      crudo: { id: "crudo", entidadId: "Huevo", nombre: "crudo", designaciones: ["inicial"] },
      cocido: { id: "cocido", entidadId: "Huevo", nombre: "cocido" },
      podrido: { id: "podrido", entidadId: "Huevo", nombre: "podrido" },
    },
    enlaces: {
      cons: { id: "cons", tipo: "consumo", origenId: { kind: "estado", id: "crudo" }, destinoId: { kind: "entidad", id: "Cocinar" }, etiqueta: "c" },
      res: { id: "res", tipo: "resultado", origenId: { kind: "entidad", id: "Cocinar" }, destinoId: { kind: "estado", id: "cocido" }, etiqueta: "r" },
    },
    opds: { raiz: { id: "raiz", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
  };
}

describe("razonamiento/derivar — alcanzable (reachability de estados)", () => {
  test("estado conectado por transición desde el inicial: alcanzable (con evidencia)", () => {
    const m = modeloTransicionEstados();
    const r = derivar(m, { tipo: "alcanzable", entidadId: "Huevo", estado: "cocido" });
    expect(r.length).toBeGreaterThan(0); // no vacío = alcanzable
    expect(r.some((h) => h.estadoId === "cocido")).toBe(true);
    expect(r.some((h) => h.procesoId === "Cocinar")).toBe(true); // el proceso del camino
  });

  test("control negativo: estado sin transición entrante desde el inicial NO es alcanzable", () => {
    const m = modeloTransicionEstados();
    expect(derivar(m, { tipo: "alcanzable", entidadId: "Huevo", estado: "podrido" })).toHaveLength(0);
  });

  test("control negativo: estado inexistente NO es alcanzable", () => {
    const m = modeloTransicionEstados();
    expect(derivar(m, { tipo: "alcanzable", entidadId: "Huevo", estado: "fosilizado" })).toHaveLength(0);
  });
});
