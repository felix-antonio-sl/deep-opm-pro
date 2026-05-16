import { describe, expect, test } from "bun:test";
import type { AccionContextual } from "../store/acciones-contextuales";
import type { RegistroAtajo } from "./atajosTeclado";
import { construirItemsCommandPalette, filtrarItemsCommandPalette, normalizarTextoBusqueda, type CommandPaletteMenuAction } from "./CommandPalette";

const atajos: RegistroAtajo[] = [
  {
    combo: "Ctrl+S",
    ctx: "global",
    categoria: "archivo",
    descripcion: "Guardar modelo",
    handler: () => {},
  },
  {
    combo: "Ctrl+Shift+T",
    ctx: "canvas",
    categoria: "edicion",
    descripcion: "Traer conectados de la cosa seleccionada",
    handler: () => {},
  },
];

const acciones: AccionContextual[] = [
  {
    id: "inzoom",
    label: "Inzoom (descomposición)",
    testId: "barra-inzoom",
    categoria: "refinamiento",
    visible: true,
    enabled: true,
    superficies: ["command-palette"],
    atajo: "Shift+I",
  },
];

const accionesMenu: CommandPaletteMenuAction[] = [
  {
    id: "tabla-enlaces",
    label: "Tabla de enlaces",
    descripcion: "Abrir la tabla de enlaces del modelo",
    categoria: "vista",
    run: () => {},
  },
  {
    id: "renombrar-modelo",
    label: "Renombrar modelo",
    descripcion: "Cambiar el nombre del modelo actual",
    categoria: "archivo",
    enabled: false,
    run: () => {},
  },
];

describe("CommandPalette", () => {
  test("normaliza tildes y mayusculas para busqueda fuzzy simple", () => {
    expect(normalizarTextoBusqueda("Inzoom (descomposición)")).toBe("inzoom descomposicion");
  });

  test("construye items desde atajos y acciones contextuales", () => {
    const items = construirItemsCommandPalette(atajos, acciones, accionesMenu);

    expect(items.some((item) => item.tipo === "atajo" && item.label === "Guardar modelo")).toBe(true);
    expect(items.some((item) => item.tipo === "accion-contextual" && item.accionId === "inzoom")).toBe(true);
    expect(items.some((item) => item.tipo === "accion-menu" && item.menuActionId === "tabla-enlaces")).toBe(true);
    expect(items.some((item) => item.menuActionId === "renombrar-modelo")).toBe(false);
  });

  test("filtra por terminos de label, categoria o atajo", () => {
    const items = construirItemsCommandPalette(atajos, acciones, accionesMenu);

    expect(filtrarItemsCommandPalette(items, "descomposicion").map((item) => item.label)).toContain("Inzoom (descomposición)");
    expect(filtrarItemsCommandPalette(items, "ctrl s").map((item) => item.label)).toContain("Guardar modelo");
    expect(filtrarItemsCommandPalette(items, "refinamiento").map((item) => item.label)).toContain("Inzoom (descomposición)");
    expect(filtrarItemsCommandPalette(items, "tabla enlaces").map((item) => item.label)).toContain("Tabla de enlaces");
  });
});
