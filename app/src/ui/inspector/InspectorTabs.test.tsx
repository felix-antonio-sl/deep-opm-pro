import { beforeEach, describe, expect, test } from "bun:test";
import { store } from "../../store";
import type { TabInspectorEntidad, TabInspectorEnlace } from "../../store/tipos";
import { InspectorTabs, type InspectorTabDef } from "./InspectorTabs";

const TABS_ENTIDAD: ReadonlyArray<InspectorTabDef<TabInspectorEntidad>> = [
  { id: "semantica", label: "Semántica", testid: "inspector-tab-semantica" },
  { id: "enlaces", label: "Enlaces", testid: "inspector-tab-enlaces" },
  { id: "refinamiento", label: "Refinamiento", testid: "inspector-tab-refinamiento" },
  { id: "apariciones", label: "Apariciones", testid: "inspector-tab-apariciones" },
  { id: "estilo", label: "Estilo", testid: "inspector-tab-estilo" },
];

const TABS_ENLACE: ReadonlyArray<InspectorTabDef<TabInspectorEnlace>> = [
  { id: "propiedades", label: "Propiedades", testid: "inspector-enlace-tab-propiedades" },
  { id: "extremos", label: "Extremos", testid: "inspector-enlace-tab-extremos" },
  { id: "estilo", label: "Estilo", testid: "inspector-enlace-tab-estilo" },
];

/**
 * Estos tests cubren la API y el contrato declarativo de InspectorTabs sin
 * montar DOM (el harness Bun de este repo no incluye preact/test-utils).
 * El contrato visual (aria, roles, focus) se valida en el smoke
 * `e2e/20-inspector-tabs.spec.ts` ejecutado por Playwright.
 */

describe("InspectorTabs contrato declarativo", () => {
  test("export es función componente con un único parámetro de props", () => {
    expect(typeof InspectorTabs).toBe("function");
    expect(InspectorTabs.length).toBe(1);
  });

  test("acepta tabs con la unión TabInspectorEntidad y compila sin errores", () => {
    const vnode = (
      <InspectorTabs
        tabs={TABS_ENTIDAD}
        activo="semantica"
        onCambiar={() => {}}
        ariaLabel="Inspector entidad"
      />
    );
    expect(vnode).toBeDefined();
  });

  test("acepta tabs con la unión TabInspectorEnlace", () => {
    const vnode = (
      <InspectorTabs
        tabs={TABS_ENLACE}
        activo="propiedades"
        onCambiar={() => {}}
        ariaLabel="Inspector enlace"
      />
    );
    expect(vnode).toBeDefined();
  });
});

describe("Persistencia de tab activo en store (uiPanel)", () => {
  beforeEach(() => {
    // Reset al default después de cualquier mutación previa.
    store.getState().cambiarTabInspectorEntidad("semantica");
    store.getState().cambiarTabInspectorEnlace("propiedades");
  });

  test("tabInspectorEntidadActivo arranca en 'semantica' por default", () => {
    expect(store.getState().tabInspectorEntidadActivo).toBe("semantica");
  });

  test("tabInspectorEnlaceActivo arranca en 'propiedades' por default", () => {
    expect(store.getState().tabInspectorEnlaceActivo).toBe("propiedades");
  });

  test("cambiarTabInspectorEntidad actualiza el store con cada uno de los 5 tabs", () => {
    const valores: TabInspectorEntidad[] = ["enlaces", "refinamiento", "apariciones", "estilo", "semantica"];
    for (const valor of valores) {
      store.getState().cambiarTabInspectorEntidad(valor);
      expect(store.getState().tabInspectorEntidadActivo).toBe(valor);
    }
  });

  test("cambiarTabInspectorEnlace actualiza el store con cada uno de los 3 tabs", () => {
    const valores: TabInspectorEnlace[] = ["extremos", "estilo", "propiedades"];
    for (const valor of valores) {
      store.getState().cambiarTabInspectorEnlace(valor);
      expect(store.getState().tabInspectorEnlaceActivo).toBe(valor);
    }
  });

  test("cambiar tab entidad no afecta tab enlace", () => {
    store.getState().cambiarTabInspectorEnlace("estilo");
    store.getState().cambiarTabInspectorEntidad("apariciones");
    expect(store.getState().tabInspectorEnlaceActivo).toBe("estilo");
    expect(store.getState().tabInspectorEntidadActivo).toBe("apariciones");
  });
});

describe("InspectorTabs contrato sobre el array de tabs", () => {
  test("el array de tabs entidad expone los 5 IDs canónicos en orden estricto", () => {
    expect(TABS_ENTIDAD.map((t) => t.id)).toEqual(["semantica", "enlaces", "refinamiento", "apariciones", "estilo"]);
  });

  test("cada tab entidad expone un testid único con prefijo inspector-tab-", () => {
    const testids = TABS_ENTIDAD.map((t) => t.testid);
    expect(testids.every((id) => id.startsWith("inspector-tab-"))).toBe(true);
    expect(new Set(testids).size).toBe(testids.length);
  });

  test("el array de tabs enlace expone los 3 IDs canónicos en orden estricto", () => {
    expect(TABS_ENLACE.map((t) => t.id)).toEqual(["propiedades", "extremos", "estilo"]);
  });

  test("cada tab enlace expone un testid único con prefijo inspector-enlace-tab-", () => {
    const testids = TABS_ENLACE.map((t) => t.testid);
    expect(testids.every((id) => id.startsWith("inspector-enlace-tab-"))).toBe(true);
    expect(new Set(testids).size).toBe(testids.length);
  });
});
