import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, crearEnlace, desplegarObjeto, descomponerProceso } from "../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../modelo/tipos";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";
import { ejecutarAccionContextualEntidad } from "./ejecutarAccionContextual";

describe("ejecutarAccionContextualEntidad", () => {
  test("quita inzoom desde el catálogo contextual común", () => {
    const { modelo, entidadId } = modeloConDescomposicion();
    store.getState().importarJson(exportarModelo(modelo));
    store.getState().seleccionarEntidad(entidadId);

    expect(ejecutarAccionContextualEntidad("quitar-descomposicion")).toEqual({
      actionId: "quitar-descomposicion",
      kind: "normal",
    });

    expect(store.getState().modelo.entidades[entidadId]?.refinamientos?.descomposicion).toBeUndefined();
  });

  test("quita despliegue desde el catálogo contextual común", () => {
    const { modelo, entidadId } = modeloConDespliegue();
    store.getState().importarJson(exportarModelo(modelo));
    store.getState().seleccionarEntidad(entidadId);

    expect(ejecutarAccionContextualEntidad("quitar-despliegue")).toEqual({
      actionId: "quitar-despliegue",
      kind: "normal",
    });

    expect(store.getState().modelo.entidades[entidadId]?.refinamientos?.despliegue).toBeUndefined();
  });

  test("devuelve ActionEvent exceptional cuando la accion no aplica", () => {
    const modelo = crearModelo("Contextual sin seleccion");
    store.getState().importarJson(exportarModelo(modelo));

    expect(ejecutarAccionContextualEntidad("agregar-estado")).toMatchObject({
      actionId: "agregar-estado",
      kind: "exceptional",
    });
  });

  test("razonar-afectan-a (objeto) selecciona los procesos que lo afectan", () => {
    const { modelo, docId, editarId } = modeloDocEditar();
    store.getState().importarJson(exportarModelo(modelo));
    store.getState().seleccionarEntidad(docId);

    expect(ejecutarAccionContextualEntidad("razonar-afectan-a")).toEqual({
      actionId: "razonar-afectan-a",
      kind: "normal",
    });
    expect(store.getState().seleccionados).toContain(editarId);
  });

  test("razonar-afectan-a es exceptional si la selección no es objeto", () => {
    const { modelo, editarId } = modeloDocEditar();
    store.getState().importarJson(exportarModelo(modelo));
    store.getState().seleccionarEntidad(editarId); // proceso

    expect(ejecutarAccionContextualEntidad("razonar-afectan-a")).toMatchObject({
      actionId: "razonar-afectan-a",
      kind: "exceptional",
    });
  });

  test("razonar-impacto-eliminar informa por toast para cualquier cosa", () => {
    const { modelo, editarId } = modeloDocEditar();
    store.getState().importarJson(exportarModelo(modelo));
    store.getState().seleccionarEntidad(editarId);

    expect(ejecutarAccionContextualEntidad("razonar-impacto-eliminar")).toEqual({
      actionId: "razonar-impacto-eliminar",
      kind: "normal",
    });
    expect(store.getState().mensaje).toMatch(/afectar[íi]a/i);
  });
});

function modeloDocEditar(): { modelo: Modelo; docId: Id; editarId: Id } {
  let modelo = crearModelo("Contextual razonamiento");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Doc"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Editar"));
  const docId = entidad(modelo, "Doc");
  const editarId = entidad(modelo, "Editar");
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, docId, editarId, "consumo"));
  return { modelo, docId, editarId };
}

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
