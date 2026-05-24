import { describe, expect, test } from "bun:test";
import type { AccionContextual } from "../store/acciones-contextuales";
import type { RegistroAtajo } from "./atajosTeclado";
import {
  SECCIONES_COMMAND_PALETTE,
  agruparItemsCommandPalette,
  construirItemsCommandPalette,
  filtrarItemsCommandPalette,
  normalizarTextoBusqueda,
  seccionVisualCommandPalette,
  type CommandPaletteMenuAction,
} from "./CommandPalette";

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
    // Ronda23 L1 #10: label en castellano canónico; el id `inzoom`
    // permanece intacto para no romper handlers ni test-ids.
    id: "inzoom",
    label: "Descomponer",
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
    id: "versiones-modelo",
    label: "Versiones del modelo",
    descripcion: "Abrir el historial de versiones del modelo",
    categoria: "archivo",
    enabled: false,
    run: () => {},
  },
];

describe("CommandPalette", () => {
  test("normaliza tildes y mayusculas para busqueda fuzzy simple", () => {
    expect(normalizarTextoBusqueda("Descomponer")).toBe("descomponer");
  });

  test("ronda23/L1 #3: deduplica atajos con mismo combo y descripcion en contextos distintos", () => {
    // Ctrl+D se registra dos veces (global + panel-arbol) con la misma
    // descripcion. El palette debe mostrar un solo item.
    const atajosDuplicados: RegistroAtajo[] = [
      { combo: "Ctrl+D", ctx: "global", categoria: "navegacion", descripcion: "Abrir gestión del árbol OPD", handler: () => {} },
      { combo: "Ctrl+D", ctx: "panel-arbol", categoria: "navegacion", descripcion: "Abrir gestión del árbol OPD", handler: () => {} },
    ];
    const items = construirItemsCommandPalette(atajosDuplicados, [], []);
    const filas = items.filter((item) => item.tipo === "atajo" && item.label === "Abrir gestión del árbol OPD");
    expect(filas).toHaveLength(1);
  });

  test("construye items desde atajos y acciones contextuales", () => {
    const items = construirItemsCommandPalette(atajos, acciones, accionesMenu);

    expect(items.some((item) => item.tipo === "atajo" && item.label === "Guardar modelo")).toBe(true);
    expect(items.some((item) => item.tipo === "accion-contextual" && item.accionId === "inzoom")).toBe(true);
    expect(items.some((item) => item.tipo === "accion-menu" && item.menuActionId === "tabla-enlaces")).toBe(true);
    expect(items.some((item) => item.menuActionId === "versiones-modelo")).toBe(false);
  });

  test("filtra por terminos de label, categoria o atajo", () => {
    const items = construirItemsCommandPalette(atajos, acciones, accionesMenu);

    expect(filtrarItemsCommandPalette(items, "descomponer").map((item) => item.label)).toContain("Descomponer");
    expect(filtrarItemsCommandPalette(items, "ctrl s").map((item) => item.label)).toContain("Guardar modelo");
    expect(filtrarItemsCommandPalette(items, "refinamiento").map((item) => item.label)).toContain("Descomponer");
    expect(filtrarItemsCommandPalette(items, "tabla enlaces").map((item) => item.label)).toContain("Tabla de enlaces");
  });

  test("ordena por frecuencia de uso desc y luego por nombre", () => {
    const items = construirItemsCommandPalette(atajos, acciones, accionesMenu, {
      "menu-tabla-enlaces": 3,
      "accion-inzoom": 1,
    });

    expect(items.map((item) => item.id).slice(0, 2)).toEqual(["menu-tabla-enlaces", "accion-inzoom"]);
    expect(items.filter((item) => item.frecuenciaUso === 0).map((item) => item.label)).toEqual([
      "Guardar modelo",
      "Traer conectados de la cosa seleccionada",
    ]);
  });

  test("agrupa visualmente en las seis secciones Codex sin alterar categorias internas", () => {
    const items = construirItemsCommandPalette(atajos, acciones, accionesMenu);
    const grupos = agruparItemsCommandPalette(items);

    expect(grupos.map((grupo) => grupo.seccion)).toEqual([...SECCIONES_COMMAND_PALETTE]);
    expect(seccionVisualCommandPalette(items.find((item) => item.label === "Guardar modelo")!)).toBe("MODELO");
    expect(seccionVisualCommandPalette(items.find((item) => item.label === "Descomponer")!)).toBe("CREAR");
    expect(seccionVisualCommandPalette(items.find((item) => item.label === "Tabla de enlaces")!)).toBe("VISTA");
    expect(items.find((item) => item.label === "Descomponer")?.categoria).toBe("refinamiento");
  });

  test("filtra tambien por la seccion visual Codex", () => {
    const items = construirItemsCommandPalette(atajos, acciones, accionesMenu);

    expect(filtrarItemsCommandPalette(items, "modelo").map((item) => item.label)).toContain("Guardar modelo");
    expect(filtrarItemsCommandPalette(items, "crear").map((item) => item.label)).toContain("Descomponer");
    expect(filtrarItemsCommandPalette(items, "vista").map((item) => item.label)).toContain("Tabla de enlaces");
  });
});
