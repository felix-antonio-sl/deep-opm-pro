import { describe, expect, test } from "bun:test";
import { store } from "../store";

describe("slice uiPanel", () => {
  test("toggleAliasVisibles cambia solo el flag publico esperado", () => {
    const previo = store.getState().uiAliasVisibles;

    store.getState().toggleAliasVisibles();
    expect(store.getState().uiAliasVisibles).toBe(!previo);

    store.getState().toggleAliasVisibles();
    expect(store.getState().uiAliasVisibles).toBe(previo);
  });

  test("MenuPrincipal y ToolbarMas son mutuamente excluyentes (P0-2)", () => {
    // P0-2 (informe UI/UX 2026-05-07): ambos menus primarios no pueden
    // coexistir abiertos. La accion `abrirMenuPrincipal` cierra
    // `toolbarMasAbierto`, y `fijarToolbarMasAbierto(true)` cierra
    // `menuPrincipalAbierto`. Asi se evita el solapamiento documentado
    // en `48-main-menu-duplicate-action-attempt.png`.
    store.getState().cerrarMenuPrincipal();
    store.getState().fijarToolbarMasAbierto(false);

    // Abrir ToolbarMas con MenuPrincipal cerrado
    store.getState().fijarToolbarMasAbierto(true);
    expect(store.getState().toolbarMasAbierto).toBe(true);
    expect(store.getState().menuPrincipalAbierto).toBe(false);

    // Abrir MenuPrincipal cierra ToolbarMas
    store.getState().abrirMenuPrincipal();
    expect(store.getState().menuPrincipalAbierto).toBe(true);
    expect(store.getState().toolbarMasAbierto).toBe(false);

    // Reabrir ToolbarMas cierra MenuPrincipal
    store.getState().fijarToolbarMasAbierto(true);
    expect(store.getState().menuPrincipalAbierto).toBe(false);
    expect(store.getState().toolbarMasAbierto).toBe(true);

    // Cleanup
    store.getState().fijarToolbarMasAbierto(false);
  });
});
