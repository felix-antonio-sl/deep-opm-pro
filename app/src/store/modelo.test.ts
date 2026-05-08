import { describe, expect, test } from "bun:test";
import { store } from "../store";

describe("slice modelo", () => {
  test("deshacer y rehacer conservan el historial publico", () => {
    store.getState().nuevoModelo();
    expect(store.getState().puedeDeshacer).toBe(false);

    store.getState().crearObjetoDemo();
    expect(store.getState().puedeDeshacer).toBe(true);
    const conObjeto = Object.keys(store.getState().modelo.entidades).length;

    store.getState().deshacer();
    expect(Object.keys(store.getState().modelo.entidades)).toHaveLength(0);
    expect(store.getState().puedeRehacer).toBe(true);

    store.getState().rehacer();
    expect(Object.keys(store.getState().modelo.entidades)).toHaveLength(conObjeto);
  });

  test("aplicarLayoutSugerido incrementa solicitudFitToken cuando hay cambio (P0-5)", () => {
    // P0-5 (informe UI/UX 2026-05-07): la accion de auto-layout debe gatillar
    // fit-to-view tras reordenar. El canvas observa solicitudFitToken y hace
    // fit; aqui verificamos el contrato del store.
    store.getState().nuevoModelo();
    store.getState().crearObjetoDemo();
    store.getState().crearProcesoDemo();
    const tokenAntes = store.getState().solicitudFitToken;

    store.getState().aplicarLayoutSugerido();
    const tokenDespues = store.getState().solicitudFitToken;

    expect(tokenDespues).toBeGreaterThan(tokenAntes);
  });

  test("aplicarLayoutSugerido NO incrementa solicitudFitToken cuando layout ya esta aplicado", () => {
    store.getState().nuevoModelo();
    store.getState().crearObjetoDemo();
    store.getState().aplicarLayoutSugerido();
    const tokenInicial = store.getState().solicitudFitToken;

    // Aplicar otra vez sobre el mismo modelo no produce cambio: no se hace
    // fit innecesario.
    store.getState().aplicarLayoutSugerido();
    expect(store.getState().solicitudFitToken).toBe(tokenInicial);
  });
});
