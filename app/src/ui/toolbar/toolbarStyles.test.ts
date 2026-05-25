import { describe, expect, test } from "bun:test";
import { toolbarStyle } from "./toolbarStyles";
import { colors, stroke } from "../tokens";

describe("toolbarStyle clusters", () => {
  test("expone estilos para clusters por intención", () => {
    expect(toolbarStyle.cluster.display).toBe("inline-flex");
    expect(toolbarStyle.cluster.alignItems).toBe("center");
    expect(toolbarStyle.cluster.gap).toBe("6px");
    expect(toolbarStyle.clusterLabel.position).toBe("static");
    expect(toolbarStyle.clusterLabel.overflow).toBe("visible");
    expect(toolbarStyle.clusterLabel.textTransform).toBe("uppercase");
  });
});

describe("toolbarStyle Codex v1.1 mecanico", () => {
  test("los creadores son controles inline con separador hairline y kbd mecanico", () => {
    const style = toolbarStyle as Record<string, preact.JSX.CSSProperties>;

    expect(style.creatorButton?.background).toBe("transparent");
    expect(style.creatorButton?.border).toBe("1px solid transparent");
    expect(style.creatorButton?.boxShadow).toBe("none");
    expect(style.creatorShortcutDivider?.width).toBe(`${stroke.hairline}px`);
    expect(style.creatorShortcutDivider?.background).toBe(colors.rule);
    expect(style.creatorKbd?.border).toBe("none");
    expect(style.creatorKbd?.background).toBe("transparent");
  });

  test("status y busqueda no dibujan caja; el foco de busqueda subraya crimson", () => {
    const style = toolbarStyle as Record<string, preact.JSX.CSSProperties>;

    expect(style.inlineStatus?.border).toBe("none");
    expect(style.inlineStatus?.background).toBe("transparent");
    expect(style.statusDotPending?.color).toBe(colors.crimson);
    expect(style.searchButton?.background).toBe("transparent");
    expect(style.searchButton?.border).toBe("1px solid transparent");
    expect(style.searchButton?.boxShadow).toBeUndefined();
    expect(style.searchButtonFocus?.boxShadow).toBe(`inset 0 -${stroke.bold}px 0 0 ${colors.crimson}`);
  });
});
