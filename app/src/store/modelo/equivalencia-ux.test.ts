import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, crearEnlace, descomponerProceso } from "../../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../../modelo/tipos";
import { exportarModelo } from "../../serializacion/json";
import { store } from "../../store";

/**
 * UX ad-hoc del Piso 2 (Equivalencia). Verificación on-demand de coherencia de
 * una descomposición: ¿el OPD hijo preserva la frontera del proceso? (F2). El
 * kernel y el helper `observarPreservacionFrontera` están cubiertos aparte.
 */

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}
function idPorNombre(m: Modelo, n: string): Id {
  return Object.values(m.entidades).find((e) => e.nombre === n)!.id;
}
function cargar(m: Modelo): void {
  store.getState().importarJson(exportarModelo(m));
}

/** P consume A, produce B, descompuesto (inzoom fresco = coherente). */
function modeloDescompuesto(): Modelo {
  let m = crearModelo();
  m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "A"));
  m = must(crearProceso(m, m.opdRaizId, { x: 200, y: 0 }, "P"));
  m = must(crearObjeto(m, m.opdRaizId, { x: 400, y: 0 }, "B"));
  m = must(crearEnlace(m, m.opdRaizId, idPorNombre(m, "A"), idPorNombre(m, "P"), "consumo"));
  m = must(crearEnlace(m, m.opdRaizId, idPorNombre(m, "P"), idPorNombre(m, "B"), "resultado"));
  return must(descomponerProceso(m, m.opdRaizId, idPorNombre(m, "P"))).modelo;
}

describe("verificarCoherenciaDescomposicion — UX on-demand del Piso 2", () => {
  test("proceso descompuesto coherente → toast confirma que preserva la frontera", () => {
    cargar(modeloDescompuesto());
    const pId = idPorNombre(store.getState().modelo, "P");
    store.getState().seleccionarEntidad(pId);

    store.getState().verificarCoherenciaDescomposicion();

    expect(store.getState().mensaje).toContain("preserva");
  });

  test("selección sin descomposición → toast de guía, sin falso veredicto", () => {
    let m = crearModelo();
    m = must(crearProceso(m, m.opdRaizId, { x: 0, y: 0 }, "Suelto"));
    cargar(m);
    store.getState().seleccionarEntidad(idPorNombre(store.getState().modelo, "Suelto"));

    store.getState().verificarCoherenciaDescomposicion();

    expect(store.getState().mensaje).toContain("descompuesto");
  });
});
