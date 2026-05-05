import { describe, expect, test } from "bun:test";
import { accionDropDesdeEvento, puedeAceptarDrop } from "./handlersDragDrop";

describe("handlers drag-drop de carpetas", () => {
  test("drag de carpeta sobre carpeta destino permite mover", () => {
    expect(puedeAceptarDrop({ tipo: "carpeta", itemId: "carpeta-a" }, "carpeta-b")).toBe(true);
    expect(accionDropDesdeEvento({ ctrlKey: false, metaKey: false })).toBe("mover");
  });

  test("drag con Ctrl o Meta retorna copiar", () => {
    expect(accionDropDesdeEvento({ ctrlKey: true, metaKey: false })).toBe("copiar");
    expect(accionDropDesdeEvento({ ctrlKey: false, metaKey: true })).toBe("copiar");
  });
});
