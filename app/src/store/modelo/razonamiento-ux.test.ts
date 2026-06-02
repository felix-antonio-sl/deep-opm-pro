import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, crearEnlace } from "../../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../../modelo/tipos";
import { exportarModelo } from "../../serializacion/json";
import { store } from "../../store";

/**
 * UX ad-hoc del Piso 3 (Razonamiento). El kernel `derivar` ya está cubierto en
 * `modelo/razonamiento/derivar.test.ts`; aquí se verifica la PROYECCIÓN del
 * conjunto de hechos derivados a la superficie de runtime: selección del
 * subgrafo en canvas (afectan-a / requerido-por) y toast informativo.
 */

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}
function idPorNombre(modelo: Modelo, nombre: string): Id {
  return Object.values(modelo.entidades).find((e) => e.nombre === nombre)!.id;
}
function cargar(m: Modelo): void {
  store.getState().importarJson(exportarModelo(m));
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

describe("consultarRazonamiento — proyección UX del Piso 3", () => {
  test("afectan-a: selecciona los procesos que afectan al objeto + toast con conteo", () => {
    cargar(modeloAfecta());
    const docId = idPorNombre(store.getState().modelo, "Doc");
    const editarId = idPorNombre(store.getState().modelo, "Editar");

    store.getState().consultarRazonamiento({ tipo: "afectan-a", entidadId: docId });

    const s = store.getState();
    expect(s.seleccionados).toContain(editarId);
    expect(s.mensaje).toContain("afecta");
  });

  test("requerido-por: selecciona el cierre transitivo de precondiciones + toast", () => {
    cargar(modeloCadena());
    const ensamblarId = idPorNombre(store.getState().modelo, "Ensamblar");
    const piezaId = idPorNombre(store.getState().modelo, "Pieza");
    const fabricarId = idPorNombre(store.getState().modelo, "Fabricar");

    store.getState().consultarRazonamiento({ tipo: "requerido-por", procesoId: ensamblarId });

    const s = store.getState();
    expect(s.seleccionados).toContain(piezaId);
    expect(s.seleccionados).toContain(fabricarId); // transitivo
    expect(s.mensaje).toContain("requiere");
  });

  test("impacto-de-eliminar: NO altera la selección; solo advierte por toast con conteo", () => {
    cargar(modeloAfecta());
    const docId = idPorNombre(store.getState().modelo, "Doc");
    store.getState().vaciarSeleccion();

    store.getState().consultarRazonamiento({ tipo: "impacto-de-eliminar", elementoId: docId });

    const s = store.getState();
    expect(s.seleccionados).toEqual([]);
    expect(s.mensaje).toMatch(/afectar[íi]a/i);
  });

  test("consulta sin resultados: informa por toast y no introduce selección espuria", () => {
    let m = crearModelo();
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Solo"));
    cargar(m);
    const soloId = idPorNombre(store.getState().modelo, "Solo");
    store.getState().setSeleccion([soloId]);

    store.getState().consultarRazonamiento({ tipo: "afectan-a", entidadId: soloId });

    const s = store.getState();
    expect(s.mensaje).toContain("Nada");
    // No hay procesos: la selección no gana cosas que no existen.
    expect(s.seleccionados.every((id: Id) => Boolean(store.getState().modelo.entidades[id]))).toBe(true);
  });
});
