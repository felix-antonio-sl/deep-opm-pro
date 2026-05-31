import { describe, expect, test } from "bun:test";
import type { AccionContextual } from "../store/acciones-contextuales";
import type { RegistroAtajo } from "./atajosTeclado";
import {
  SECCIONES_COMMAND_PALETTE,
  agruparItemsCommandPalette,
  construirAccionesMenuCommandPalette,
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

  test("agrupa visualmente en las secciones Codex sin alterar categorias internas", () => {
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

  test("P0 elimina comandos de asistente, ejemplos y plantillas", () => {
    const acciones = construirAccionesMenuCommandPalette(depsAccionesMenu());
    const ids = acciones.map((accion) => accion.id);
    const abrirImportar = acciones.find((accion) => accion.id === "abrir-importar");
    const items = construirItemsCommandPalette([], [], acciones);

    expect(ids).not.toContain("asistente-guiado");
    expect(ids).not.toContain("guardar-plantilla");
    expect(ids).not.toContain("plantillas");
    expect(abrirImportar?.descripcion).not.toMatch(/ejempl/i);
    expect(filtrarItemsCommandPalette(items, "asistente")).toEqual([]);
    expect(filtrarItemsCommandPalette(items, "plantilla")).toEqual([]);
    expect(filtrarItemsCommandPalette(items, "ejemplo")).toEqual([]);
  });

  test("P1 con busqueda activa agrupa solo secciones con resultados", () => {
    const items = filtrarItemsCommandPalette(
      construirItemsCommandPalette(atajos, acciones, accionesMenu),
      "tabla enlaces",
    );
    const grupos = agruparItemsCommandPalette(items, { incluirSeccionesVacias: false });

    expect(grupos.map((grupo) => grupo.seccion)).toEqual(["VISTA"]);
    expect(grupos[0]?.items.map((item) => item.label)).toEqual(["Tabla de enlaces"]);
  });

  test("EXPORTAR incluye exportar diagnóstico (JSON) y enruta a EXPORTAR", () => {
    let copiado = false;
    const deps = { ...depsAccionesMenu(), exportarDiagnostico: () => { copiado = true; } };
    const acciones = construirAccionesMenuCommandPalette(deps);
    const accion = acciones.find((item) => item.id === "exportar-diagnostico");

    expect(accion?.label).toBe("Exportar diagnóstico (JSON)");
    expect(accion?.categoria).toBe("archivo");
    accion?.run();
    expect(copiado).toBe(true);

    const items = construirItemsCommandPalette([], [], acciones);
    const item = items.find((i) => i.menuActionId === "exportar-diagnostico");
    expect(item ? seccionVisualCommandPalette(item) : null).toBe("EXPORTAR");
    // El comando es encontrable buscando "diagnostico" y "json".
    expect(filtrarItemsCommandPalette(items, "diagnostico").map((i) => i.label)).toContain("Exportar diagnóstico (JSON)");
    expect(filtrarItemsCommandPalette(items, "json").map((i) => i.label)).toContain("Exportar diagnóstico (JSON)");
  });

  test("MODELO incluye renombrar modelo como comando explícito", () => {
    const deps = depsAccionesMenu();
    const acciones = construirAccionesMenuCommandPalette(deps);
    const items = construirItemsCommandPalette([], [], acciones);
    const renombrar = items.find((item) => item.menuActionId === "renombrar-modelo");

    expect(renombrar?.label).toBe("Renombrar modelo");
    expect(renombrar ? seccionVisualCommandPalette(renombrar) : null).toBe("MODELO");
  });

  test("expone capacidades OPCloud isomorfas como comandos canónicos", () => {
    const acciones = construirAccionesMenuCommandPalette(depsAccionesMenu({
      hayEntidadSeleccionada: true,
      hayEnlaceSeleccionado: true,
    }));
    const items = construirItemsCommandPalette([], [], acciones);

    expect(filtrarItemsCommandPalette(items, "ontologia canon sinonimo").map((i) => i.menuActionId)).toContain("configurar-ontologia");
    expect(filtrarItemsCommandPalette(items, "requisito").map((i) => i.menuActionId)).toEqual(expect.arrayContaining([
      "crear-requisito",
      "marcar-requisito",
      "satisfacer-requisito",
    ]));
    expect(filtrarItemsCommandPalette(items, "submodelo").map((i) => i.menuActionId)).toContain("conectar-submodelo");
    expect(filtrarItemsCommandPalette(items, "contorno").map((i) => i.menuActionId)).toEqual(expect.arrayContaining([
      "recolectar-contorno",
      "distribuir-contorno",
    ]));
    expect(filtrarItemsCommandPalette(items, "split parcial").map((i) => i.menuActionId)).toContain("split-parcial");
    expect(filtrarItemsCommandPalette(items, "decision").map((i) => i.menuActionId)).toContain("resolver-decision");
  });
});

function depsAccionesMenu(
  overrides: Partial<Parameters<typeof construirAccionesMenuCommandPalette>[0]> = {},
): Parameters<typeof construirAccionesMenuCommandPalette>[0] {
  return {
    nuevoModelo: () => {},
    abrirCargarModelo: () => {},
    abrirGuardarComo: () => {},
    abrirDialogoConfiguracion: () => {},
    abrirDialogoVersiones: null,
    modeloPersistidoId: null,
    gridActiva: false,
    toggleGrid: () => {},
    aplicarLayoutSugerido: () => {},
    iniciarModoSimulacion: () => {},
    abrirDialogoSimulacionNumerica: () => {},
    abrirTablaEnlaces: () => {},
    abrirCheatsheetAtajos: () => {},
    exportarJson: () => {},
    exportarDiagnostico: () => {},
    exportarOplModeloMarkdown: () => {},
    exportarOpdSvg: null,
    abrirPestanaNueva: () => {},
    abrirBusquedaCosas: () => {},
    abrirBusquedaGlobal: () => {},
    abrirUrlsObjeto: null,
    editarImagenObjeto: null,
    toggleAliasVisibles: () => {},
    aliasVisibles: false,
    toggleDescripcionesVisibles: () => {},
    descripcionesVisibles: false,
    ciclarModoImagenGlobal: () => {},
    etiquetaModoImagenGlobal: "por cosa",
    modoImagenGlobalActivo: false,
    toggleMostrarArchivados: () => {},
    mostrarArchivados: false,
    toggleMostrarVersiones: () => {},
    mostrarVersiones: false,
    abrirCapturadorBug: () => {},
    abrirBugLedger: () => {},
    abrirDialogoOntologia: () => {},
    abrirCrearRequisito: () => {},
    abrirMarcarRequisito: () => {},
    abrirSatisfacerRequisito: () => {},
    abrirDialogoSubmodelo: () => {},
    splitEffectParcial: () => {},
    recolectarContorno: () => {},
    distribuirContorno: () => {},
    resolverDecision: () => {},
    hayEntidadSeleccionada: false,
    hayEnlaceSeleccionado: false,
    ...overrides,
  };
}
