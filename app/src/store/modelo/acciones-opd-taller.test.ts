import { describe, expect, test, beforeEach } from "bun:test";
import { store } from "../../store";
import { crearModelo, crearProceso } from "../../modelo/operaciones";
import { exportarModelo } from "../../serializacion/json";
import { obtenerRefinamiento } from "../../modelo/refinamientos";
import { esOpdSuelto } from "../../modelo/opdSueltos";
import type { Modelo, Resultado } from "../../modelo/tipos";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function procesoId(modelo: Modelo): string {
  return Object.values(modelo.entidades).find((e) => e.tipo === "proceso")!.id;
}

beforeEach(() => {
  store.getState().importarJson(exportarModelo(crearModelo("Taller store")));
});

describe("acciones de Taller en el store", () => {
  test("nuevoOpdSuelto crea un suelto vacío y lo activa", () => {
    const nuevoModelo = must(crearProceso(store.getState().modelo, store.getState().modelo.opdRaizId, { x: 0, y: 0 }, "Cargar"));
    store.getState().importarJson(exportarModelo(nuevoModelo));

    store.getState().nuevoOpdSuelto();

    const estado = store.getState();
    const opdId = estado.opdActivoId;
    expect(esOpdSuelto(estado.modelo, opdId)).toBe(true);
    expect(estado.modelo.opds[opdId]!.apariencias).toEqual({});
    expect(estado.seleccionId).toBeNull();
  });

  test("adoptarOpdEnSeleccion vincula el suelto como refinamiento de la cosa seleccionada", () => {
    const raizId = store.getState().modelo.opdRaizId;
    const conProceso = must(crearProceso(store.getState().modelo, raizId, { x: 0, y: 0 }, "Cargar"));
    store.getState().importarJson(exportarModelo(conProceso));
    const pId = procesoId(store.getState().modelo);

    store.getState().nuevoOpdSuelto();
    const sueltoId = store.getState().opdActivoId;

    // Vuelve a la raíz y selecciona el proceso (el suelto se adopta desde ahí).
    store.getState().cambiarOpdActivo(raizId);
    store.getState().seleccionarEntidad(pId);

    store.getState().adoptarOpdEnSeleccion(sueltoId, "descomposicion");

    const estado = store.getState();
    expect(esOpdSuelto(estado.modelo, sueltoId)).toBe(false); // adoptado: ya no es suelto
    expect(estado.modelo.opds[sueltoId]!.padreId).toBe(raizId);
    expect(obtenerRefinamiento(estado.modelo.entidades[pId]!, "descomposicion")?.opdId).toBe(sueltoId);
    expect(estado.opdActivoId).toBe(sueltoId);
  });

  test("adoptarOpdEnSeleccion sin selección avisa y no muta", () => {
    store.getState().nuevoOpdSuelto();
    const sueltoId = store.getState().opdActivoId;
    store.getState().vaciarSeleccion();
    const antes = exportarModelo(store.getState().modelo);

    store.getState().adoptarOpdEnSeleccion(sueltoId, "descomposicion");

    expect(exportarModelo(store.getState().modelo)).toBe(antes);
    expect(store.getState().mensaje).toBe("Selecciona la cosa que adoptará el OPD suelto");
  });
});
