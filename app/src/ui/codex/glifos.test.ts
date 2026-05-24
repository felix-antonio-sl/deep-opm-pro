import { describe, expect, test } from "bun:test";
import {
  GLIFOS_CODEX,
  GLIFO_ALT,
  GLIFO_BORRAR,
  GLIFO_CARET,
  GLIFO_CERRAR,
  GLIFO_CHECK,
  GLIFO_CMD,
  GLIFO_COMILLA_APERTURA,
  GLIFO_COMILLA_CIERRE,
  GLIFO_CREAR,
  GLIFO_CTRL,
  GLIFO_ENTER,
  GLIFO_MARKER,
  GLIFO_NAV_DOWN,
  GLIFO_NAV_UP,
  GLIFO_REF,
  GLIFO_SEP,
  GLIFO_SHIFT,
  GLIFO_VACIO,
  GLIFO_WARN,
  formatearComboCodex,
} from "./glifos";

describe("glifos Codex", () => {
  test("expone los code points canonicos de ui-forja/07-glyphs.md", () => {
    expect(GLIFO_REF).toBe("※");
    expect(GLIFO_WARN).toBe("△");
    expect(GLIFO_MARKER).toBe("▸");
    expect(GLIFO_SEP).toBe("·");
    expect(GLIFO_CREAR).toBe("+");
    expect(GLIFO_CERRAR).toBe("✕");
    expect(GLIFO_CHECK).toBe("✓");
    expect(GLIFO_VACIO).toBe("—");
    expect(GLIFO_ENTER).toBe("↵");
    expect(GLIFO_BORRAR).toBe("⌫");
    expect(GLIFO_CMD).toBe("⌘");
    expect(GLIFO_CTRL).toBe("⌃");
    expect(GLIFO_SHIFT).toBe("⇧");
    expect(GLIFO_ALT).toBe("⌥");
    expect(GLIFO_NAV_UP).toBe("↑");
    expect(GLIFO_NAV_DOWN).toBe("↓");
    expect(GLIFO_CARET).toBe("▾");
    expect(GLIFO_COMILLA_APERTURA).toBe("«");
    expect(GLIFO_COMILLA_CIERRE).toBe("»");
  });

  test("no incluye glifos prohibidos por Codex", () => {
    const texto = Object.values(GLIFOS_CODEX).join("");

    expect(texto).not.toContain("•");
    expect(texto).not.toContain("★");
    expect(texto).not.toContain("☆");
    expect(texto).not.toContain(">");
    expect(texto).not.toContain("<");
    expect(texto).not.toContain("📁");
  });

  test("formatea kbd Codex con Cmd en macOS y sin separadores visuales", () => {
    expect(formatearComboCodex("Ctrl+Shift+ArrowLeft", { platform: "MacIntel" })).toBe("⌘⇧←");
    expect(formatearComboCodex("Ctrl+Alt+K", { platform: "MacIntel" })).toBe("⌘⌥K");
    expect(formatearComboCodex("Ctrl+Shift+ArrowLeft", { platform: "Linux x86_64" })).toBe("Ctrl+Shift+ArrowLeft");
  });
});
