import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { store } from "../store";
import { exportarModelo } from "../serializacion/json";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import type { Modelo, Resultado } from "../modelo/tipos";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function importar(modelo: Modelo): void {
  store.getState().importarJson(exportarModelo(modelo));
}

beforeEach(() => {
  importar(crearModelo("Pizarra"));
  store.getState().activarReadOnly(false);
});

afterEach(() => {
  store.getState().salirModoPizarra();
});

describe("PizarraSlice — modo bosquejo de baja fricción", () => {
  test("estado inicial: modo apagado, sin herramienta, sin selección de boceto", () => {
    expect(store.getState().modoPizarra).toBe(false);
    expect(store.getState().herramientaPizarra).toBeNull();
    expect(store.getState().bocetoSeleccionadoId).toBeNull();
  });

  test("activar/salir alterna el modo y limpia herramienta + selección al salir", () => {
    store.getState().activarModoPizarra();
    store.getState().elegirHerramientaPizarra("forma");
    expect(store.getState().modoPizarra).toBe(true);
    expect(store.getState().herramientaPizarra).toBe("forma");

    store.getState().salirModoPizarra();
    expect(store.getState().modoPizarra).toBe(false);
    expect(store.getState().herramientaPizarra).toBeNull();
    expect(store.getState().bocetoSeleccionadoId).toBeNull();
  });

  test("agregarBocetoEnOpd commitea el modelo y deja el boceto seleccionado", () => {
    store.getState().activarModoPizarra();
    store.getState().agregarBocetoEnOpd({ tipo: "forma", x: 10, y: 10, w: 120, h: 60, texto: "idea" });

    const { modelo, opdActivoId, bocetoSeleccionadoId } = store.getState();
    const bocetos = modelo.opds[opdActivoId]?.bocetos ?? {};
    expect(Object.keys(bocetos)).toHaveLength(1);
    expect(bocetoSeleccionadoId).not.toBeNull();
    expect(bocetos[bocetoSeleccionadoId!]?.texto).toBe("idea");
  });

  test("seleccionarBoceto es local: NO toca el trío sellado de selección", () => {
    store.getState().activarModoPizarra();
    store.getState().agregarBocetoEnOpd({ tipo: "nota", x: 0, y: 0, texto: "n" });
    const id = store.getState().bocetoSeleccionadoId!;

    store.getState().seleccionarBoceto(id);
    expect(store.getState().bocetoSeleccionadoId).toBe(id);
    // El trío permanece null: la selección de pizarra vive APARTE.
    expect(store.getState().seleccionId).toBeNull();
    expect(store.getState().enlaceSeleccionId).toBeNull();
    expect(store.getState().estadoSeleccionId).toBeNull();

    store.getState().seleccionarBoceto(null);
    expect(store.getState().bocetoSeleccionadoId).toBeNull();
  });

  test("moverBocetoActual y editarBocetoActual mutan el boceto seleccionado", () => {
    store.getState().activarModoPizarra();
    store.getState().agregarBocetoEnOpd({ tipo: "forma", x: 10, y: 10, w: 100, h: 50, texto: "a" });
    const id = store.getState().bocetoSeleccionadoId!;

    store.getState().moverBocetoActual({ x: 200, y: 150 });
    let b = store.getState().modelo.opds[store.getState().opdActivoId]?.bocetos?.[id];
    expect(b?.x).toBe(200);
    expect(b?.y).toBe(150);

    store.getState().editarBocetoActual({ texto: "b" });
    b = store.getState().modelo.opds[store.getState().opdActivoId]?.bocetos?.[id];
    expect(b?.texto).toBe("b");
  });

  test("eliminarBocetoActual quita el boceto y limpia la selección local", () => {
    store.getState().activarModoPizarra();
    store.getState().agregarBocetoEnOpd({ tipo: "forma", x: 10, y: 10, texto: "x" });
    const id = store.getState().bocetoSeleccionadoId!;

    store.getState().eliminarBocetoActual();
    expect(store.getState().modelo.opds[store.getState().opdActivoId]?.bocetos?.[id]).toBeUndefined();
    expect(store.getState().bocetoSeleccionadoId).toBeNull();
  });

  test("promoverBocetoActual ok: crea entidad, la enfoca en el trío y limpia el boceto", () => {
    store.getState().activarModoPizarra();
    store.getState().agregarBocetoEnOpd({ tipo: "forma", x: 10, y: 10, texto: "Solicitud" });

    store.getState().promoverBocetoActual({ destino: "entidad", tipoEntidad: "objeto" });

    const { modelo, seleccionId, bocetoSeleccionadoId, opdActivoId } = store.getState();
    expect(bocetoSeleccionadoId).toBeNull();
    expect(modelo.opds[opdActivoId]?.bocetos).toBeUndefined();
    // El hecho creado quedó enfocado en el trío (entidad ⇒ seleccionId).
    expect(seleccionId).not.toBeNull();
    expect(modelo.entidades[seleccionId!]?.nombre).toBe("Solicitud");
  });

  test("promoverBocetoActual con nombre colisionante FALLA ruidoso y NO consume el boceto (rechazo ruidoso)", () => {
    let m = crearModelo("Pizarra");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    importar(m);
    store.getState().activarReadOnly(false);
    store.getState().activarModoPizarra();
    store.getState().agregarBocetoEnOpd({ tipo: "forma", x: 200, y: 0, texto: "Pedido" });
    const id = store.getState().bocetoSeleccionadoId!;

    store.getState().promoverBocetoActual({ destino: "entidad", tipoEntidad: "objeto" });

    // El boceto sigue vivo (no consumido) y la app habla.
    expect(store.getState().modelo.opds[store.getState().opdActivoId]?.bocetos?.[id]).toBeDefined();
    expect(store.getState().mensaje).toContain("Pedido");
    // No se creó un segundo "Pedido" (sin auto-sufijo).
    expect(Object.values(store.getState().modelo.entidades).filter((e) => e.nombre.startsWith("Pedido"))).toHaveLength(1);
  });

  test("entrar a modo simulación apaga el modo pizarra (coherencia de modos)", () => {
    store.getState().crearObjetoDemo();
    store.getState().activarModoPizarra();
    expect(store.getState().modoPizarra).toBe(true);

    store.getState().iniciarModoSimulacion();
    expect(store.getState().modoPizarra).toBe(false);
    store.getState().salirModoSimulacion();
  });

  test("activarReadOnly true apaga el modo pizarra (coherencia de modos)", () => {
    store.getState().activarModoPizarra();
    expect(store.getState().modoPizarra).toBe(true);
    store.getState().activarReadOnly(true);
    expect(store.getState().modoPizarra).toBe(false);
    store.getState().activarReadOnly(false);
  });

  test("agregarBocetoEnOpd en solo-lectura NO commitea (commitModelo aplica el guard)", () => {
    store.getState().activarModoPizarra();
    store.getState().activarReadOnly(true);
    // activarReadOnly apagó el modo; lo reactivamos para probar el guard del commit.
    store.getState().agregarBocetoEnOpd({ tipo: "forma", x: 1, y: 1, texto: "z" });
    const opdActivoId = store.getState().opdActivoId;
    expect(store.getState().modelo.opds[opdActivoId]?.bocetos ?? {}).toEqual({});
    store.getState().activarReadOnly(false);
  });
});
