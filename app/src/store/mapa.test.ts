import { describe, expect, test } from "bun:test";
import { store } from "../store";

describe("slice mapa", () => {
  test("abrirVistaMapa crea descriptor derivado y cerrarVistaMapa lo limpia", () => {
    store.getState().cargarDemo();

    store.getState().abrirVistaMapa();
    expect(store.getState().vistaMapaActiva).toBe(true);
    expect(store.getState().descriptorMapaCache).not.toBeNull();

    store.getState().cerrarVistaMapa();
    expect(store.getState().vistaMapaActiva).toBe(false);
    expect(store.getState().descriptorMapaCache).toBeNull();
  });

  test("abrirVistaMapa sale de modo simulacion si esta activo", () => {
    store.getState().cargarDemo();
    store.getState().crearObjetoDemo();
    store.getState().cerrarVistaMapa();
    // Entrar a simulacion
    store.getState().iniciarModoSimulacion();
    expect(store.getState().contextoSimulacion).not.toBeNull();

    // Abrir mapa — debe salir de simulacion
    store.getState().abrirVistaMapa();
    expect(store.getState().vistaMapaActiva).toBe(true);
    expect(store.getState().contextoSimulacion).toBeNull();
    expect(store.getState().readOnlyPrevSimulacion).toBeNull();
  });

  test("abrirVistaMapa cancela modoEnlace y modoCreacion", () => {
    store.getState().cargarDemo();
    store.getState().crearObjetoDemo();
    store.getState().cancelarEnlace();
    store.getState().fijarModoCreacion(null);
    // Activar modoEnlace requiere seleccion previa
    const id = Object.keys(store.getState().modelo.entidades)[0]!;
    store.getState().seleccionarEntidad(id);
    store.getState().elegirTipoEnlace("agregacion");
    store.getState().fijarModoCreacion("objeto");
    expect(store.getState().modoEnlace).not.toBeNull();
    expect(store.getState().modoCreacion).toBe("objeto");

    // Abrir mapa — debe cancelar ambos
    store.getState().abrirVistaMapa();
    expect(store.getState().modoEnlace).toBeNull();
    expect(store.getState().modoCreacion).toBeNull();
  });
});

describe("slice simulacion (P0-2 exclusion mutua)", () => {
  test("iniciarModoSimulacion sale de vista mapa si esta activa", () => {
    store.getState().cargarDemo();
    store.getState().crearObjetoDemo();
    store.getState().cancelarEnlace();
    store.getState().fijarModoCreacion(null);
    // Entrar a mapa
    store.getState().abrirVistaMapa();
    expect(store.getState().vistaMapaActiva).toBe(true);

    // Entrar a simulacion — debe salir de mapa
    store.getState().iniciarModoSimulacion();
    expect(store.getState().contextoSimulacion).not.toBeNull();
    expect(store.getState().vistaMapaActiva).toBe(false);
    expect(store.getState().descriptorMapaCache).toBeNull();
  });

  test("iniciarModoSimulacion cancela modoEnlace y modoCreacion", () => {
    store.getState().cargarDemo();
    store.getState().crearObjetoDemo();
    store.getState().cancelarEnlace();
    store.getState().fijarModoCreacion(null);
    // Activar modoEnlace requiere seleccion previa
    const id = Object.keys(store.getState().modelo.entidades)[0]!;
    store.getState().seleccionarEntidad(id);
    store.getState().elegirTipoEnlace("agregacion");
    store.getState().fijarModoCreacion("proceso");
    expect(store.getState().modoEnlace).not.toBeNull();
    expect(store.getState().modoCreacion).toBe("proceso");

    // Entrar a simulacion — debe cancelar ambos
    store.getState().iniciarModoSimulacion();
    expect(store.getState().modoEnlace).toBeNull();
    expect(store.getState().modoCreacion).toBeNull();
  });
});
