import { describe, expect, test } from "bun:test";
import { cambiarLinealidad, crearEnlace, crearModelo, crearObjeto, crearProceso } from "./operaciones";
import { checkRecursoLinealMultiplesConsumidores } from "./checkers";
import type { Id, Modelo, Resultado } from "./tipos";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}
function idPorNombre(m: Modelo, nombre: string): Id {
  return Object.values(m.entidades).find((e) => e.nombre === nombre)!.id;
}

/** Objeto consumido por dos procesos. `lineal` controla si es recurso lineal. */
function modeloDosConsumidores(lineal: boolean): Modelo {
  let m = crearModelo();
  m = must(crearObjeto(m, m.opdRaizId, { x: 100, y: 100 }, "Recurso"));
  m = must(crearProceso(m, m.opdRaizId, { x: 300, y: 60 }, "Usar A"));
  m = must(crearProceso(m, m.opdRaizId, { x: 300, y: 180 }, "Usar B"));
  const recurso = idPorNombre(m, "Recurso");
  if (lineal) m = must(cambiarLinealidad(m, recurso, true));
  m = must(crearEnlace(m, m.opdRaizId, recurso, idPorNombre(m, "Usar A"), "consumo"));
  m = must(crearEnlace(m, m.opdRaizId, recurso, idPorNombre(m, "Usar B"), "consumo"));
  return m;
}

describe("checkRecursoLinealMultiplesConsumidores", () => {
  test("recurso lineal con dos consumidores → un aviso navegable", () => {
    const m = modeloDosConsumidores(true);
    const avisos = checkRecursoLinealMultiplesConsumidores(m);
    expect(avisos).toHaveLength(1);
    expect(avisos[0]!.codigo).toBe("RECURSO_LINEAL_MULTIPLES_CONSUMIDORES");
    expect(avisos[0]!.entidadId).toBe(idPorNombre(m, "Recurso"));
    expect(avisos[0]!.navegarA?.id).toBe(idPorNombre(m, "Recurso"));
  });

  test("objeto copiable (no lineal) con dos consumidores → sin aviso", () => {
    expect(checkRecursoLinealMultiplesConsumidores(modeloDosConsumidores(false))).toEqual([]);
  });
});
