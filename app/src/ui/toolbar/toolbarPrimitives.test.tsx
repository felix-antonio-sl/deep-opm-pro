import { describe, expect, test } from "bun:test";
import { colors } from "../tokens";
import { labelPersistenciaToolbar, ToolbarActionButton } from "./toolbarPrimitives";
import { toolbarStyle } from "./toolbarStyles";

type Vnode = { type: unknown; props: Record<string, any> };

function hijos(v: Vnode): Vnode[] {
  const c = v.props.children;
  return (Array.isArray(c) ? c : [c]).filter((x): x is Vnode => !!x && typeof x === "object");
}

describe("ToolbarActionButton", () => {
  test("renderiza glifo, label, hairline y kbd manteniendo testId", () => {
    const glyph = <span>□</span>;
    const v = ToolbarActionButton({
      glyph,
      label: "Objeto",
      shortcut: "O",
      testId: "toolbar-drag-objeto",
      title: "Crear objeto",
      onClick: () => undefined,
    }) as unknown as Vnode;
    const [glyphSlot, label, divider, kbd] = hijos(v);

    expect(v.type).toBe("button");
    expect(v.props["data-testid"]).toBe("toolbar-drag-objeto");
    expect(v.props["aria-keyshortcuts"]).toBe("O");
    expect(glyphSlot!.props.children).toBe(glyph);
    expect(label!.props.children).toBe("Objeto");
    expect(divider!.props.style).toBe(toolbarStyle.creatorShortcutDivider);
    expect(kbd!.props.children).toBe("O");
  });
});

describe("labelPersistenciaToolbar", () => {
  test("colapsa estados pendientes a Sin guardar con atajo mecanico", () => {
    expect(labelPersistenciaToolbar("nuevo", "Sin guardar · Ctrl+S", false)).toBe("Sin guardar ⌃S");
    expect(labelPersistenciaToolbar("local-dirty", "Cambios sin guardar", false)).toBe("Sin guardar ⌃S");
  });

  test("mantiene guardando y limpia la hora del estado guardado", () => {
    expect(labelPersistenciaToolbar("local-clean", "Guardado · 14:20", false)).toBe("Guardado");
    expect(labelPersistenciaToolbar("local-clean", "Guardando…", true)).toBe("Guardando…");
  });

  test("el dot pendiente usa crimson en estilos compartidos", () => {
    expect(toolbarStyle.statusDotPending.color).toBe(colors.crimson);
  });
});
