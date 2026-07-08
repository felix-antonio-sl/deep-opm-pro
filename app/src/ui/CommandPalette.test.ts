import { describe, expect, test } from "bun:test";
import { accionesContextualesEntidad, accionesParaSuperficie, type AccionContextual } from "../store/acciones-contextuales";
import type { RegistroAtajo } from "./atajosTeclado";
import {
  SECCIONES_COMMAND_PALETTE,
  agruparItemsCommandPalette,
  construirAccionesMenuCommandPalette,
  construirItemsCommandPalette,
  filtrarItemsCommandPalette,
  gruposCommandPaletteParaRender,
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

// Estratos de la paleta: tres, no seis. CONTEXTUAL solo con selección; CREAR
// verbos de fundación; RECIENTES el grueso del catálogo por frecuencia de uso.
describe("CommandPalette — tres estratos deduplicados", () => {
  test("normaliza tildes y mayusculas para busqueda fuzzy simple", () => {
    expect(normalizarTextoBusqueda("Descomponer")).toBe("descomponer");
  });

  test("SECCIONES_COMMAND_PALETTE son exactamente los tres estratos", () => {
    expect([...SECCIONES_COMMAND_PALETTE]).toEqual(["CONTEXTUAL", "CREAR", "RECIENTES"]);
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

  test("agrupa en los tres estratos sin alterar categorias internas", () => {
    const items = construirItemsCommandPalette(atajos, acciones, accionesMenu);
    const grupos = agruparItemsCommandPalette(items);

    expect(grupos.map((grupo) => grupo.seccion)).toEqual([...SECCIONES_COMMAND_PALETTE]);
    expect(seccionVisualCommandPalette(items.find((item) => item.label === "Guardar modelo")!)).toBe("RECIENTES");
    expect(seccionVisualCommandPalette(items.find((item) => item.label === "Descomponer")!)).toBe("CONTEXTUAL");
    expect(seccionVisualCommandPalette(items.find((item) => item.label === "Tabla de enlaces")!)).toBe("RECIENTES");
    expect(items.find((item) => item.label === "Descomponer")?.categoria).toBe("refinamiento");
  });

  test("filtra tambien por el nombre del estrato visual", () => {
    const items = construirItemsCommandPalette(atajos, acciones, accionesMenu);

    expect(filtrarItemsCommandPalette(items, "recientes").map((item) => item.label)).toContain("Guardar modelo");
    expect(filtrarItemsCommandPalette(items, "contextual").map((item) => item.label)).toContain("Descomponer");
  });

  test("P0 elimina comandos de asistente, ejemplos y plantillas", () => {
    const acc = construirAccionesMenuCommandPalette(depsAccionesMenu());
    const ids = acc.map((accion) => accion.id);
    const abrirImportar = acc.find((accion) => accion.id === "abrir-importar");
    const items = construirItemsCommandPalette([], [], acc);

    expect(ids).not.toContain("asistente-guiado");
    expect(ids).not.toContain("guardar-plantilla");
    expect(ids).not.toContain("plantillas");
    expect(abrirImportar?.descripcion).not.toMatch(/ejempl/i);
    expect(filtrarItemsCommandPalette(items, "asistente")).toEqual([]);
    expect(filtrarItemsCommandPalette(items, "plantilla")).toEqual([]);
    expect(filtrarItemsCommandPalette(items, "ejemplo")).toEqual([]);
  });

  test("con busqueda activa agrupa solo estratos con resultados", () => {
    const items = filtrarItemsCommandPalette(
      construirItemsCommandPalette(atajos, acciones, accionesMenu),
      "tabla enlaces",
    );
    const grupos = agruparItemsCommandPalette(items, { incluirSeccionesVacias: false });

    expect(grupos.map((grupo) => grupo.seccion)).toEqual(["RECIENTES"]);
    expect(grupos[0]?.items.map((item) => item.label)).toEqual(["Tabla de enlaces"]);
  });

  test("exportar diagnóstico (JSON) existe, es buscable y cae en RECIENTES", () => {
    let copiado = false;
    const deps = { ...depsAccionesMenu(), exportarDiagnostico: () => { copiado = true; } };
    const acc = construirAccionesMenuCommandPalette(deps);
    const accion = acc.find((item) => item.id === "exportar-diagnostico");

    expect(accion?.label).toBe("Exportar diagnóstico (JSON)");
    expect(accion?.categoria).toBe("archivo");
    accion?.run();
    expect(copiado).toBe(true);

    const items = construirItemsCommandPalette([], [], acc);
    const item = items.find((i) => i.menuActionId === "exportar-diagnostico");
    // Taxonomía nueva: el export no es un estrato propio; el comando sigue siendo
    // encontrable por comportamiento (lo que importa al power-user).
    expect(item ? seccionVisualCommandPalette(item) : null).toBe("RECIENTES");
    expect(filtrarItemsCommandPalette(items, "diagnostico").map((i) => i.label)).toContain("Exportar diagnóstico (JSON)");
    expect(filtrarItemsCommandPalette(items, "json").map((i) => i.label)).toContain("Exportar diagnóstico (JSON)");
  });

  test("exportar PNG del OPD actual y ZIP de todos, sin SVG, en RECIENTES", () => {
    const acc = construirAccionesMenuCommandPalette(depsAccionesMenu({
      exportarOpdPng: () => {},
    }));
    const items = construirItemsCommandPalette([], [], acc);

    expect(items.map((i) => i.menuActionId)).not.toContain("exportar-opd-svg");
    expect(filtrarItemsCommandPalette(items, "exportar opd png").map((i) => i.menuActionId))
      .toContain("exportar-opd-png");
    expect(filtrarItemsCommandPalette(items, "todos opds png zip").map((i) => i.menuActionId))
      .toContain("exportar-opds-png-zip");
    expect(filtrarItemsCommandPalette(items, "exportar svg")).toEqual([]);
    const opdPng = items.find((item) => item.menuActionId === "exportar-opd-png");
    const zip = items.find((item) => item.menuActionId === "exportar-opds-png-zip");
    expect(opdPng ? seccionVisualCommandPalette(opdPng) : null).toBe("RECIENTES");
    expect(zip ? seccionVisualCommandPalette(zip) : null).toBe("RECIENTES");
  });

  test("renombrar modelo existe como comando explícito en RECIENTES", () => {
    const deps = depsAccionesMenu();
    const acc = construirAccionesMenuCommandPalette(deps);
    const items = construirItemsCommandPalette([], [], acc);
    const renombrar = items.find((item) => item.menuActionId === "renombrar-modelo");

    expect(renombrar?.label).toBe("Renombrar modelo");
    expect(renombrar ? seccionVisualCommandPalette(renombrar) : null).toBe("RECIENTES");
  });

  test("expone capacidades OPCloud isomorfas como comandos canónicos", () => {
    const acc = construirAccionesMenuCommandPalette(depsAccionesMenu({
      hayEntidadSeleccionada: true,
      hayEnlaceSeleccionado: true,
    }));
    const items = construirItemsCommandPalette([], [], acc);

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

  test("expone modo solo canvas buscable por 100% canvas en RECIENTES", () => {
    const acc = construirAccionesMenuCommandPalette(depsAccionesMenu());
    const items = construirItemsCommandPalette([], [], acc);
    const soloCanvas = filtrarItemsCommandPalette(items, "100 canvas").find((item) => item.menuActionId === "solo-canvas");

    expect(soloCanvas?.label).toBe("Modo solo canvas");
    expect(soloCanvas?.atajo).toBe("Ctrl+Shift+M");
    expect(soloCanvas ? seccionVisualCommandPalette(soloCanvas) : null).toBe("RECIENTES");
  });

  test("BUG-20260601T214534Z-98f2fb: deduplica Modo solo canvas entre atajo y accion de menu", () => {
    const registros: RegistroAtajo[] = [
      {
        combo: "Ctrl+Shift+M",
        ctx: "global",
        categoria: "vista",
        descripcion: "Modo solo canvas",
        descripcionLarga: "Alterna una superficie 100% canvas ocultando marginalia, índice e inspector",
        handler: () => {},
      },
    ];
    const acc = construirAccionesMenuCommandPalette(depsAccionesMenu());
    const items = construirItemsCommandPalette(registros, [], acc);
    const resultados = filtrarItemsCommandPalette(items, "modo solo canvas");

    expect(resultados).toHaveLength(1);
    expect(resultados[0]?.tipo).toBe("accion-menu");
    expect(resultados[0]?.menuActionId).toBe("solo-canvas");
  });
});

// Registros representativos de los atajos globales. Ctrl+T lleva la nueva
// `etiqueta` alineada al menú `abrir-pestana` (dedup m-5); Ctrl+Shift+M dedupea
// de forma natural porque su descripción coincide con el label de `solo-canvas`.
const registrosRepresentativos: RegistroAtajo[] = [
  { combo: "Ctrl+S", ctx: "global", categoria: "archivo", descripcion: "Guardar modelo", handler: () => {} },
  { combo: "Ctrl+T", ctx: "global", categoria: "navegacion", etiqueta: "Abrir como pestaña", descripcion: "Abrir pestaña nueva", handler: () => {} },
  { combo: "Ctrl+Shift+M", ctx: "global", categoria: "vista", descripcion: "Modo solo canvas", handler: () => {} },
];

const IDS_MENU_CONTEXTUAL = new Set([
  "marcar-requisito",
  "satisfacer-requisito",
  "conectar-submodelo",
  "split-parcial",
  "recolectar-contorno",
  "distribuir-contorno",
  "resolver-decision",
  "urls-objeto",
  "editar-imagen-objeto",
  "crear-requisito",
]);

describe("CommandPalette — invariantes de inventario", () => {
  test("cero combos duplicados y una sola fila Ctrl+T tras la dedup m-5", () => {
    const menu = construirAccionesMenuCommandPalette(depsAccionesMenu());
    const items = construirItemsCommandPalette(registrosRepresentativos, [], menu);

    // Una sola fila para Ctrl+T: gana la acción de menú «Abrir como pestaña»,
    // el atajo global queda subsumido por la `etiqueta` compartida.
    const ctrlT = items.filter((item) => item.atajo === "Ctrl+T");
    expect(ctrlT).toHaveLength(1);
    expect(ctrlT[0]?.menuActionId).toBe("abrir-pestana");

    // Ningún `combo` aparece en dos filas visibles distintas.
    const combos = items.filter((item) => item.atajo).map((item) => item.atajo!);
    const duplicados = combos.filter((combo, i) => combos.indexOf(combo) !== i);
    expect(duplicados).toEqual([]);
  });

  test("partición total: cada item cae en exactamente uno de los tres estratos", () => {
    const menu = construirAccionesMenuCommandPalette(depsAccionesMenu({
      hayEntidadSeleccionada: true,
      hayEnlaceSeleccionado: true,
      exportarOpdPng: () => {},
      abrirUrlsObjeto: () => {},
      editarImagenObjeto: () => {},
    }));
    const items = construirItemsCommandPalette(registrosRepresentativos, acciones, menu);

    // Cada item se clasifica en un estrato declarado.
    for (const item of items) {
      expect(SECCIONES_COMMAND_PALETTE).toContain(seccionVisualCommandPalette(item));
    }

    // agruparItemsCommandPalette reparte cada item una sola vez: la suma de los
    // grupos iguala al total (partición sin solape ni pérdida).
    const grupos = agruparItemsCommandPalette(items);
    const totalEnGrupos = grupos.reduce((n, grupo) => n + grupo.items.length, 0);
    expect(totalEnGrupos).toBe(items.length);
    expect(grupos.map((grupo) => grupo.seccion)).toEqual([...SECCIONES_COMMAND_PALETTE]);

    // Los tres estratos están poblados con esta selección de ejemplo.
    for (const seccion of SECCIONES_COMMAND_PALETTE) {
      const grupo = grupos.find((g) => g.seccion === seccion);
      expect(grupo?.items.length ?? 0).toBeGreaterThan(0);
    }
  });

  test("CONTEXTUAL solo contiene acciones contextuales o menús gated por selección", () => {
    const menu = construirAccionesMenuCommandPalette(depsAccionesMenu({
      hayEntidadSeleccionada: true,
      hayEnlaceSeleccionado: true,
      abrirUrlsObjeto: () => {},
      editarImagenObjeto: () => {},
    }));
    const items = construirItemsCommandPalette(registrosRepresentativos, acciones, menu);
    const contextuales = items.filter((item) => seccionVisualCommandPalette(item) === "CONTEXTUAL");

    expect(contextuales.length).toBeGreaterThan(0);
    for (const item of contextuales) {
      const gated = item.tipo === "accion-contextual"
        || (item.menuActionId ? IDS_MENU_CONTEXTUAL.has(item.menuActionId) : false);
      expect(gated).toBe(true);
    }

    // Comandos claramente NO contextuales no invaden el estrato de la selección.
    const guardar = items.find((item) => item.label === "Guardar modelo");
    expect(guardar ? seccionVisualCommandPalette(guardar) : null).toBe("RECIENTES");
    const tabla = items.find((item) => item.menuActionId === "tabla-enlaces");
    expect(tabla ? seccionVisualCommandPalette(tabla) : null).toBe("RECIENTES");
  });

  test("spec §4: sin selección, el estrato CONTEXTUAL queda vacío (ningún verbo always-on lo puebla)", () => {
    // Alimenta el conjunto contextual REAL sin selección (no el stub [inzoom]):
    // así se caza cualquier accion-contextual always-on — p. ej. componer-modelo,
    // que compone el modelo entero, no la selección — que colara «Para la
    // selección» con cero selección. Es la RED que gatea reclasificar
    // componer-modelo a CREAR (su casa semántica: verbo a nivel-modelo).
    const contextualesSinSeleccion = accionesParaSuperficie(
      accionesContextualesEntidad({ entidad: null, enlace: null, inspectorAbierto: true, multi: false }),
      "command-palette",
    ).filter((accion) => accion.enabled);
    const menu = construirAccionesMenuCommandPalette(depsAccionesMenu());
    const items = construirItemsCommandPalette([], contextualesSinSeleccion, menu);
    const grupos = agruparItemsCommandPalette(items, { incluirSeccionesVacias: false });

    expect(grupos.find((grupo) => grupo.seccion === "CONTEXTUAL")).toBeUndefined();
  });

  test("crear-requisito es dual: CREAR sin selección, CONTEXTUAL con selección", () => {
    const sinSeleccion = construirAccionesMenuCommandPalette(depsAccionesMenu());
    const itemsSin = construirItemsCommandPalette([], [], sinSeleccion);
    const crearSin = itemsSin.find((item) => item.menuActionId === "crear-requisito");
    expect(crearSin?.label).toBe("Crear requisito");
    expect(crearSin ? seccionVisualCommandPalette(crearSin) : null).toBe("CREAR");

    const conSeleccion = construirAccionesMenuCommandPalette(depsAccionesMenu({ hayEntidadSeleccionada: true }));
    const itemsCon = construirItemsCommandPalette([], [], conSeleccion);
    const crearCon = itemsCon.find((item) => item.menuActionId === "crear-requisito");
    expect(crearCon?.label).toBe("Crear requisito vinculado");
    expect(crearCon ? seccionVisualCommandPalette(crearCon) : null).toBe("CONTEXTUAL");
  });

  test("verbos de creación no contextuales viven en CREAR", () => {
    const menu = construirAccionesMenuCommandPalette(depsAccionesMenu());
    const items = construirItemsCommandPalette([], [], menu);
    const nuevoModelo = items.find((item) => item.menuActionId === "nuevo-modelo");
    const piezas = items.find((item) => item.menuActionId === "vitrina-estereotipos");

    expect(nuevoModelo ? seccionVisualCommandPalette(nuevoModelo) : null).toBe("CREAR");
    expect(piezas?.label).toBe("Piezas");
    expect(piezas ? seccionVisualCommandPalette(piezas) : null).toBe("CREAR");
  });

  test("M-5: las descripciones de requisito son es-CL llano, sin «<<Requirement>>»", () => {
    const menu = construirAccionesMenuCommandPalette(depsAccionesMenu({ hayEntidadSeleccionada: true }));
    const requisito = menu.filter((accion) => accion.id === "crear-requisito" || accion.id === "marcar-requisito");
    expect(requisito.length).toBe(2);
    for (const accion of requisito) {
      expect(accion.descripcion).not.toContain("Requirement");
      expect(accion.descripcion).not.toContain("<<");
      expect(accion.descripcion.toLocaleLowerCase("es")).toContain("requisito");
    }
  });
});

function depsAccionesMenu(
  overrides: Partial<Parameters<typeof construirAccionesMenuCommandPalette>[0]> = {},
): Parameters<typeof construirAccionesMenuCommandPalette>[0] {
  return {
    nacerApunte: () => {},
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
    exportarCanonDocumento: () => {},
    opdActivoBloqueadoDensidad: false,
    modeloBloqueadoDensidad: false,
    opdActivoBloqueadoSuelto: false,
    modeloBloqueadoSueltos: false,
    copiarContextoSkill: () => {},
    copiarLogDecisiones: () => {},
    cerrarSesion: () => {},
    exportarOpdPng: null,
    exportarOpdsPngZip: () => {},
    abrirPestanaNueva: () => {},
    abrirBusquedaCosas: () => {},
    abrirBusquedaGlobal: () => {},
    abrirUrlsObjeto: null,
    editarImagenObjeto: null,
    toggleAliasVisibles: () => {},
    aliasVisibles: false,
    toggleDescripcionesVisibles: () => {},
    descripcionesVisibles: false,
    toggleSoloCanvas: () => {},
    soloCanvasActivo: false,
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
    abrirVitrinaEstereotipos: () => {},
    splitEffectParcial: () => {},
    recolectarContorno: () => {},
    distribuirContorno: () => {},
    resolverDecision: () => {},
    hayEntidadSeleccionada: false,
    hayEnlaceSeleccionado: false,
    ...overrides,
  };
}

describe("auditoría UX 2026-06-12 — M-1/M-2 paleta", () => {
  const accionesMenuConAbrir: CommandPaletteMenuAction[] = [
    ...accionesMenu,
    {
      id: "abrir-importar",
      label: "Abrir / importar modelo",
      descripcion: "Abrir modelos guardados, archivados o importar JSON",
      categoria: "archivo",
      run: () => {},
    },
  ];

  test("M-2: el prefijo del label manda — «abrir» ejecuta Abrir/importar, no Tabla de enlaces", () => {
    const items = construirItemsCommandPalette(atajos, acciones, accionesMenuConAbrir);
    const filtrados = filtrarItemsCommandPalette(items, "abrir");

    const labels = filtrados.map((item) => item.label);
    expect(labels).toContain("Tabla de enlaces");
    expect(filtrados[0]?.label).toBe("Abrir / importar modelo");
  });

  test("M-2: sin match de prefijo, el orden por frecuencia se conserva", () => {
    const items = construirItemsCommandPalette(atajos, acciones, accionesMenuConAbrir, {
      "menu-tabla-enlaces": 5,
    });
    const filtrados = filtrarItemsCommandPalette(items, "enlaces");
    expect(filtrados[0]?.label).toBe("Tabla de enlaces");
  });

  test("M-1: Escape no es un comando — el pseudo-atajo no entra a la paleta", () => {
    const atajoEscape: RegistroAtajo = {
      combo: "Escape",
      ctx: "global",
      categoria: "seleccion",
      descripcion: "Cerrar modal superior o vaciar selección",
      handler: () => {},
    };
    const items = construirItemsCommandPalette([...atajos, atajoEscape], acciones, accionesMenu);

    expect(items.some((item) => item.atajo === "Escape")).toBe(false);
  });

  test("M-1: con query la lista es PLANA (orden visual = orden de ejecución)", () => {
    const items = construirItemsCommandPalette(atajos, acciones, accionesMenuConAbrir);
    const filtrados = filtrarItemsCommandPalette(items, "abrir");

    const grupos = gruposCommandPaletteParaRender(filtrados, "abrir");

    expect(grupos).toHaveLength(1);
    expect(grupos[0]?.seccion).toBeNull();
    expect(grupos[0]?.items.map((i) => i.id)).toEqual(filtrados.map((i) => i.id));
  });

  test("M-1: sin query se conserva la vista agrupada por estratos", () => {
    const items = construirItemsCommandPalette(atajos, acciones, accionesMenu);
    const grupos = gruposCommandPaletteParaRender(items, "");

    expect(grupos.length).toBeGreaterThan(1);
    expect(grupos.every((grupo) => grupo.seccion !== null)).toBe(true);
  });
});
