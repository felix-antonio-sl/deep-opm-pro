import { beforeEach, describe, expect, test } from "bun:test";
import { store } from "../../store";
import type { TabInspectorEntidad, TabInspectorEnlace } from "../../store/tipos";

/**
 * Ronda Codex v2 / L3 (C9): el Inspector dejó de ser un sistema de tabs y pasó
 * a una ficha continua (`InspectorTabs.tsx` fue retirado). Estos tests ya no
 * cubren el componente de tabs; sí defienden que los campos de estado del
 * store (`tabInspector*Activo` / `cambiarTabInspector*`) siguen vivos —
 * los consumen ports y persistencia fuera del scope de esta línea, así que no
 * deben desaparecer aunque la UI ya no los lea. El contrato visual de la
 * ficha (kicker por sección, sin `role="tablist"`) se valida en el smoke
 * `e2e/20-inspector-tabs.spec.ts`.
 */

describe("Estado de tab del Inspector preservado en store (uiPanel)", () => {
  beforeEach(() => {
    store.getState().cambiarTabInspectorEntidad("semantica");
    store.getState().cambiarTabInspectorEnlace("propiedades");
  });

  test("tabInspectorEntidadActivo arranca en 'semantica' por default", () => {
    expect(store.getState().tabInspectorEntidadActivo).toBe("semantica");
  });

  test("tabInspectorEnlaceActivo arranca en 'propiedades' por default", () => {
    expect(store.getState().tabInspectorEnlaceActivo).toBe("propiedades");
  });

  test("cambiarTabInspectorEntidad actualiza el store con cada uno de los 5 valores", () => {
    const valores: TabInspectorEntidad[] = ["enlaces", "refinamiento", "apariciones", "estilo", "semantica"];
    for (const valor of valores) {
      store.getState().cambiarTabInspectorEntidad(valor);
      expect(store.getState().tabInspectorEntidadActivo).toBe(valor);
    }
  });

  test("cambiarTabInspectorEnlace actualiza el store con cada uno de los 3 valores", () => {
    const valores: TabInspectorEnlace[] = ["extremos", "estilo", "propiedades"];
    for (const valor of valores) {
      store.getState().cambiarTabInspectorEnlace(valor);
      expect(store.getState().tabInspectorEnlaceActivo).toBe(valor);
    }
  });

  test("cambiar estado de tab entidad no afecta el de enlace", () => {
    store.getState().cambiarTabInspectorEnlace("estilo");
    store.getState().cambiarTabInspectorEntidad("apariciones");
    expect(store.getState().tabInspectorEnlaceActivo).toBe("estilo");
    expect(store.getState().tabInspectorEntidadActivo).toBe("apariciones");
  });
});
