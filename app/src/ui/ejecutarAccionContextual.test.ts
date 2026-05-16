import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, desplegarObjeto, descomponerProceso } from "../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../modelo/tipos";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";
import { ejecutarAccionContextualEntidad } from "./ejecutarAccionContextual";

describe("ejecutarAccionContextualEntidad", () => {
  test("quita inzoom desde el catálogo contextual común", () => {
    const { modelo, entidadId } = modeloConDescomposicion();
    store.getState().importarJson(exportarModelo(modelo));
    store.getState().seleccionarEntidad(entidadId);

    expect(ejecutarAccionContextualEntidad("quitar-descomposicion")).toBe(true);

    expect(store.getState().modelo.entidades[entidadId]?.refinamientos?.descomposicion).toBeUndefined();
  });

  test("quita despliegue desde el catálogo contextual común", () => {
    const { modelo, entidadId } = modeloConDespliegue();
    store.getState().importarJson(exportarModelo(modelo));
    store.getState().seleccionarEntidad(entidadId);

    expect(ejecutarAccionContextualEntidad("quitar-despliegue")).toBe(true);

    expect(store.getState().modelo.entidades[entidadId]?.refinamientos?.despliegue).toBeUndefined();
  });
});

function modeloConDescomposicion(): { modelo: Modelo; entidadId: Id } {
  let modelo = crearModelo("Contextual inzoom");
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Procesar"));
  const entidadId = entidad(modelo, "Procesar");
  const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, entidadId));
  return { modelo: descompuesto.modelo, entidadId };
}

function modeloConDespliegue(): { modelo: Modelo; entidadId: Id } {
  let modelo = crearModelo("Contextual despliegue");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Sistema"));
  const entidadId = entidad(modelo, "Sistema");
  const desplegado = must(desplegarObjeto(modelo, modelo.opdRaizId, entidadId, "agregacion"));
  return { modelo: desplegado.modelo, entidadId };
}

function entidad(modelo: Modelo, nombre: string): Id {
  const encontrada = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!encontrada) throw new Error(`Entidad no encontrada: ${nombre}`);
  return encontrada.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
