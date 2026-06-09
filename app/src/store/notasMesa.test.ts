import { describe, expect, test } from "bun:test";
import { enumerarNotasMesa } from "../modelo/notasMesa";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import type { Modelo, Resultado } from "../modelo/tipos";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

// W6.5-a: acciones de store para notas de mesa — commitModelo ⇒ undoables y
// persistidas con el modelo. La fecha la inyecta la acción (hoy ISO).

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function sembrarModelo(): string {
  let modelo: Modelo = crearModelo("MesaStore");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Paciente"));
  store.getState().importarJson(exportarModelo(modelo));
  return Object.values(store.getState().modelo.entidades).find((e) => e.nombre === "Paciente")!.id;
}

describe("store notasMesa — W6.5-a", () => {
  test("agregarNotaMesa crea la nota con fecha de hoy y es undoable", () => {
    const objetoId = sembrarModelo();
    store.getState().agregarNotaMesa({ tipo: "entidad", id: objetoId }, "¿dividir en dos procesos?");

    const notas = enumerarNotasMesa(store.getState().modelo);
    expect(notas).toHaveLength(1);
    expect(notas[0]?.texto).toBe("¿dividir en dos procesos?");
    expect(notas[0]?.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    store.getState().deshacer();
    expect(enumerarNotasMesa(store.getState().modelo)).toHaveLength(0);
  });

  test("texto vacío deja mensaje de error y no muta", () => {
    sembrarModelo();
    store.getState().agregarNotaMesa({ tipo: "modelo" }, "   ");
    expect(enumerarNotasMesa(store.getState().modelo)).toHaveLength(0);
    expect(store.getState().mensaje).toContain("vacía");
  });

  test("editar y eliminar operan sobre la nota por id", () => {
    const objetoId = sembrarModelo();
    store.getState().agregarNotaMesa({ tipo: "entidad", id: objetoId }, "borrador");
    const notaId = enumerarNotasMesa(store.getState().modelo)[0]!.id;

    store.getState().editarNotaMesa(notaId, "texto final");
    expect(enumerarNotasMesa(store.getState().modelo)[0]?.texto).toBe("texto final");

    store.getState().eliminarNotaMesa(notaId);
    expect(enumerarNotasMesa(store.getState().modelo)).toHaveLength(0);
  });
});
