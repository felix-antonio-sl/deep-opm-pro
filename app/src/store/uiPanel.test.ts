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
});
