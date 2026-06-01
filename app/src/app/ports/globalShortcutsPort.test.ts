import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../../modelo/operaciones";
import type { Id, Modelo } from "../../modelo/tipos";
import {
  opdsEnOrdenDeArbol,
  registrarAtajosAplicacion,
  type GlobalShortcutsPort,
  type GlobalShortcutsSnapshot,
  type ShortcutRegistration,
} from "./globalShortcutsPort";

/**
 * Modelo de prueba con raíz `opd-1` (SD) + N hijos directos `opd-2..`, en
 * orden por `ordenLocal`. Sirve para verificar el mapeo ⌘1..9 → árbol.
 */
function modeloConOpds(cantidadHijos: number): Modelo {
  const modelo = crearModelo();
  for (let i = 0; i < cantidadHijos; i += 1) {
    const id = `opd-${i + 2}`;
    modelo.opds[id] = {
      id,
      nombre: `SD${i + 1}`,
      padreId: modelo.opdRaizId,
      apariencias: {},
      enlaces: {},
      ordenLocal: i,
    };
  }
  return modelo;
}

// KeyboardEvent is a browser API not available in Bun's Node-like test runtime.
// The Space handler calls e.preventDefault() when acting, so the stub must
// expose that method. For the no-op case it is never called.
const makeFakeEvent = () => ({ preventDefault: () => {} } as unknown as KeyboardEvent);

function setup(
  sim: { activa: boolean; auto: boolean },
  opl: { minimizada: boolean } = { minimizada: false },
  nav: { modelo?: Modelo; opdActivoId?: Id } = {},
  tabs: { abiertas?: Array<{ id: string }>; activa?: string | null } = {},
) {
  const calls = { play: 0, pausa: 0, oplMinimizar: 0, oplRestaurar: 0, eliminar: 0, soloCanvas: 0 };
  const navegados: Id[] = [];
  const pestanasCambiadas: string[] = [];
  const modelo = nav.modelo ?? crearModelo();
  const opdActivoId = nav.opdActivoId ?? modelo.opdRaizId;
  const pestanasAbiertas = tabs.abiertas ?? [];
  const pestanaActivaId = tabs.activa ?? pestanasAbiertas[0]?.id ?? null;

  const baseSnapshot = (): GlobalShortcutsSnapshot => ({
    modelo,
    opdActivoId,
    cambiarOpdActivo: (id: Id) => { navegados.push(id); },
    enlaceSeleccionId: null,
    seleccionId: null,
    crearObjetoDemo: () => {},
    crearProcesoDemo: () => {},
    agregarEstadoSmart: () => {},
    elegirTipoEnlace: () => {},
    estadoSeleccionId: null,
    abrirModalDuracionEstadoSeleccionado: () => {},
    seleccionados: [],
    nuevaCosaPendiente: null,
    dialogoComandosAbierto: false,
    cheatsheetAtajosAbierto: false,
    gestionArbolAbierta: false,
    dialogoGuardarComoAbierto: false,
    dialogoConfiguracionAbierto: false,
    dialogoImportarExportarJsonAbierto: false,
    dialogoCargarModeloAbierto: false,
    dialogoBuscarGlobalAbierto: false,
    dialogoVersionesAbierto: null,
    modalImagenAbierto: null,
    modalUrlsAbierto: null,
    modalDuracionAbierto: null,
    busquedaCosasAbierta: false,
    menuPrincipalAbierto: false,
    modoEnlace: null,
    pestanasAbiertas,
    pestanaActivaId,
    abrirDialogoTraerConectados: () => {},
    ocultarAparienciaSeleccionada: () => {},
    conectarSeleccionAlTodo: () => {},
    descartarNuevaCosaPendiente: () => {},
    cerrarDialogoComandos: () => {},
    cerrarCheatsheetAtajos: () => {},
    cerrarGestionArbol: () => {},
    cerrarGuardarComo: () => {},
    cerrarDialogoConfiguracion: () => {},
    cerrarDialogoImportarExportarJson: () => {},
    cerrarCargarModelo: () => {},
    cerrarDialogoBuscarGlobal: () => {},
    cerrarDialogoVersiones: () => {},
    cerrarModalImagen: () => {},
    cerrarModalUrls: () => {},
    cerrarModalDuracion: () => {},
    cerrarBusquedaCosas: () => {},
    cerrarMenuPrincipal: () => {},
    cancelarEnlace: () => {},
    vaciarSeleccion: () => {},
    guardarLocal: () => {},
    abrirDialogoComandos: () => {},
    toggleSoloCanvas: () => { calls.soloCanvas++; },
    abrirBusquedaCosas: () => {},
    abrirDialogoBuscarGlobal: () => {},
    abrirGestionArbol: () => {},
    deshacer: () => {},
    rehacer: () => {},
    seleccionarTodoEnOpd: () => {},
    copiarSeleccionAlBuffer: () => {},
    pegarBufferEnOpdActivo: () => {},
    eliminarSeleccion: () => { calls.eliminar++; },
    nudgeSeleccion: () => {},
    navegarOpdArriba: () => {},
    navegarOpdAbajo: () => {},
    navegarOpdIzquierda: () => {},
    navegarOpdDerecha: () => {},
    descomponerSeleccionada: () => {},
    desplegarSeleccionada: () => {},
    abrirPestanaNueva: () => {},
    cerrarPestana: () => {},
    cambiarPestanaActiva: (id: string) => { pestanasCambiadas.push(id); },
    toggleBibliotecaDock: () => {},
    // Simulation fields (B0.028)
    simulacionActiva: sim.activa,
    autoAvanceSimulacionActivo: sim.auto,
    iniciarAutoAvanceSimulacion: () => { calls.play++; },
    pausarAutoAvanceSimulacion: () => { calls.pausa++; },
    oplMarginaliaMinimizada: opl.minimizada,
    minimizarOpl: () => { calls.oplMinimizar++; },
    restaurarOpl: () => { calls.oplRestaurar++; },
  });

  const port: GlobalShortcutsPort = {
    vistaMapaActiva: () => false,
    snapshot: baseSnapshot,
  };

  const registros: ShortcutRegistration[] = [];
  registrarAtajosAplicacion(port, (r) => {
    registros.push(r);
    return () => {};
  });

  return { registros, calls, navegados, pestanasCambiadas };
}

describe("atajo Espacio en simulación", () => {
  test("no registra Ctrl+B cuando biblioteca dock está pausada como superficie de producto", () => {
    const { registros } = setup({ activa: false, auto: false });
    expect(registros.some((r) => r.combo === "Ctrl+B")).toBe(false);
  });

  test("no actúa fuera de simulación", () => {
    const { registros, calls } = setup({ activa: false, auto: false });
    const espacio = registros.find((r) => r.combo === "Space");
    expect(espacio).toBeDefined();
    espacio!.handler(makeFakeEvent());
    expect(calls.play + calls.pausa).toBe(0);
  });

  test("play cuando sim activa y no auto-avanzando", () => {
    const { registros, calls } = setup({ activa: true, auto: false });
    registros.find((r) => r.combo === "Space")!.handler(makeFakeEvent());
    expect(calls.play).toBe(1);
    expect(calls.pausa).toBe(0);
  });

  test("pausa cuando sim activa y auto-avanzando", () => {
    const { registros, calls } = setup({ activa: true, auto: true });
    registros.find((r) => r.combo === "Space")!.handler(makeFakeEvent());
    expect(calls.pausa).toBe(1);
    expect(calls.play).toBe(0);
  });
});

describe("atajo Ctrl+. toggle de marginalia OPL (05-interactions §1)", () => {
  test("registra el combo Ctrl+. en contexto global", () => {
    const { registros } = setup({ activa: false, auto: false });
    const atajo = registros.find((r) => r.combo === "Ctrl+.");
    expect(atajo).toBeDefined();
    expect(atajo!.ctx).toBe("global");
  });

  test("minimiza cuando la marginalia está visible", () => {
    const { registros, calls } = setup({ activa: false, auto: false }, { minimizada: false });
    registros.find((r) => r.combo === "Ctrl+.")!.handler(makeFakeEvent());
    expect(calls.oplMinimizar).toBe(1);
    expect(calls.oplRestaurar).toBe(0);
  });

  test("restaura cuando la marginalia está minimizada", () => {
    const { registros, calls } = setup({ activa: false, auto: false }, { minimizada: true });
    registros.find((r) => r.combo === "Ctrl+.")!.handler(makeFakeEvent());
    expect(calls.oplRestaurar).toBe(1);
    expect(calls.oplMinimizar).toBe(0);
  });
});

describe("atajo Ctrl+Shift+M modo solo canvas", () => {
  test("registra el combo global y alterna el modo de enfoque", () => {
    const { registros, calls } = setup({ activa: false, auto: false });
    const atajo = registros.find((r) => r.combo === "Ctrl+Shift+M");

    expect(atajo).toBeDefined();
    expect(atajo!.ctx).toBe("global");
    expect(atajo!.categoria).toBe("vista");
    atajo!.handler(makeFakeEvent());
    expect(calls.soloCanvas).toBe(1);
  });
});

describe("atajos de eliminación de selección", () => {
  test("Delete y Backspace comparten la acción de eliminar selección del canvas", () => {
    const { registros, calls } = setup({ activa: false, auto: false });
    const del = registros.find((r) => r.combo === "Delete" && r.ctx === "canvas");
    const backspace = registros.find((r) => r.combo === "Backspace" && r.ctx === "canvas");
    expect(del).toBeDefined();
    expect(backspace).toBeDefined();

    del!.handler(makeFakeEvent());
    backspace!.handler(makeFakeEvent());

    expect(calls.eliminar).toBe(2);
  });
});

describe("navegación de pestañas workspace ⌘/Ctrl+1..9 (Codex v1.1)", () => {
  test("registra los nueve combos Ctrl+1..9 en contexto global", () => {
    const { registros } = setup({ activa: false, auto: false });
    for (let n = 1; n <= 9; n += 1) {
      const atajo = registros.find((r) => r.combo === `Ctrl+${n}`);
      expect(atajo).toBeDefined();
      expect(atajo!.ctx).toBe("global");
      expect(atajo!.categoria).toBe("navegacion");
    }
  });

  test("opdsEnOrdenDeArbol pone el SD raíz primero y los SDN en orden", () => {
    const modelo = modeloConOpds(3);
    expect(opdsEnOrdenDeArbol(modelo)).toEqual(["opd-1", "opd-2", "opd-3", "opd-4"]);
  });

  test("Ctrl+1 salta a la primera pestaña del workspace", () => {
    const { registros, pestanasCambiadas, navegados } = setup(
      { activa: false, auto: false },
      undefined,
      {},
      { abiertas: [{ id: "tab-1" }, { id: "tab-2" }], activa: "tab-2" },
    );
    registros.find((r) => r.combo === "Ctrl+1")!.handler(makeFakeEvent());
    expect(pestanasCambiadas).toEqual(["tab-1"]);
    expect(navegados).toEqual([]);
  });

  test("Ctrl+2 y Ctrl+3 saltan a modelos abiertos, no a OPDs", () => {
    const { registros, pestanasCambiadas, navegados } = setup(
      { activa: false, auto: false },
      undefined,
      { modelo: modeloConOpds(2) },
      { abiertas: [{ id: "tab-1" }, { id: "tab-2" }, { id: "tab-3" }], activa: "tab-1" },
    );
    registros.find((r) => r.combo === "Ctrl+2")!.handler(makeFakeEvent());
    registros.find((r) => r.combo === "Ctrl+3")!.handler(makeFakeEvent());
    expect(pestanasCambiadas).toEqual(["tab-2", "tab-3"]);
    expect(navegados).toEqual([]);
  });

  test("Ctrl+N no actúa si el índice excede las pestañas abiertas", () => {
    const { registros, pestanasCambiadas, navegados } = setup(
      { activa: false, auto: false },
      undefined,
      {},
      { abiertas: [{ id: "tab-1" }], activa: "tab-1" },
    );
    registros.find((r) => r.combo === "Ctrl+5")!.handler(makeFakeEvent());
    expect(pestanasCambiadas).toEqual([]);
    expect(navegados).toEqual([]);
  });

  test("Ctrl+1 no re-activa si ya estás en la primera pestaña", () => {
    const { registros, pestanasCambiadas, navegados } = setup(
      { activa: false, auto: false },
      undefined,
      {},
      { abiertas: [{ id: "tab-1" }, { id: "tab-2" }], activa: "tab-1" },
    );
    registros.find((r) => r.combo === "Ctrl+1")!.handler(makeFakeEvent());
    expect(pestanasCambiadas).toEqual([]);
    expect(navegados).toEqual([]);
  });

  test("registra Ctrl+Shift+[ y Ctrl+Shift+] como anterior/siguiente tab", () => {
    const { registros, pestanasCambiadas } = setup(
      { activa: false, auto: false },
      undefined,
      {},
      { abiertas: [{ id: "tab-1" }, { id: "tab-2" }], activa: "tab-1" },
    );
    registros.find((r) => r.combo === "Ctrl+Shift+]")!.handler(makeFakeEvent());
    registros.find((r) => r.combo === "Ctrl+Shift+[")!.handler(makeFakeEvent());
    expect(pestanasCambiadas).toEqual(["tab-2", "tab-2"]);
  });
});

/**
 * Línea D (BUG-20260525T052239Z-445a97): atajos de creación con canvas activo.
 * O/P/S/R disparan las mismas acciones que toolbar/Inspector/modo enlace y
 * respetan los guards de selección. El guard de foco (no actuar en inputs ni
 * con diálogo abierto) vive en `atajosTeclado.ts` y se cubre en su propio test
 * — aquí verificamos el cableado y los guards de dominio del puerto.
 */
describe("atajos de creación O/P/S/R en canvas (BUG-445a97)", () => {
  function setupCreacion(opts: { seleccionId?: Id | null; entidadSeleccionada?: boolean } = {}) {
    let modelo = crearModelo();
    let entidadSeleccionadaId: Id | null = null;
    if (opts.entidadSeleccionada) {
      const res = crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 });
      if (res.ok) {
        modelo = res.value;
        entidadSeleccionadaId = Object.keys(modelo.entidades)[0] ?? null;
      }
    }
    const calls = { objeto: 0, proceso: 0, estado: 0 };
    const enlaces: Array<{ tipo: string; origenId?: Id }> = [];
    const seleccionId = opts.seleccionId !== undefined ? opts.seleccionId : entidadSeleccionadaId;

    const baseSnapshot = (): GlobalShortcutsSnapshot => ({
      modelo,
      opdActivoId: modelo.opdRaizId,
      cambiarOpdActivo: () => {},
      enlaceSeleccionId: null,
      seleccionId,
      crearObjetoDemo: () => { calls.objeto++; },
      crearProcesoDemo: () => { calls.proceso++; },
      agregarEstadoSmart: () => { calls.estado++; },
      elegirTipoEnlace: (tipo, origenId) => { enlaces.push({ tipo, ...(origenId ? { origenId } : {}) }); },
      estadoSeleccionId: null,
      abrirModalDuracionEstadoSeleccionado: () => {},
      seleccionados: [],
      nuevaCosaPendiente: null,
      dialogoComandosAbierto: false,
      cheatsheetAtajosAbierto: false,
      gestionArbolAbierta: false,
      dialogoGuardarComoAbierto: false,
      dialogoConfiguracionAbierto: false,
      dialogoImportarExportarJsonAbierto: false,
      dialogoCargarModeloAbierto: false,
      dialogoBuscarGlobalAbierto: false,
      dialogoVersionesAbierto: null,
      modalImagenAbierto: null,
      modalUrlsAbierto: null,
      modalDuracionAbierto: null,
      busquedaCosasAbierta: false,
      menuPrincipalAbierto: false,
      modoEnlace: null,
      pestanasAbiertas: [],
      pestanaActivaId: null,
      abrirDialogoTraerConectados: () => {},
      ocultarAparienciaSeleccionada: () => {},
      conectarSeleccionAlTodo: () => {},
      descartarNuevaCosaPendiente: () => {},
      cerrarDialogoComandos: () => {},
      cerrarCheatsheetAtajos: () => {},
      toggleSoloCanvas: () => {},
      cerrarGestionArbol: () => {},
      cerrarGuardarComo: () => {},
      cerrarDialogoConfiguracion: () => {},
      cerrarDialogoImportarExportarJson: () => {},
      cerrarCargarModelo: () => {},
      cerrarDialogoBuscarGlobal: () => {},
      cerrarDialogoVersiones: () => {},
      cerrarModalImagen: () => {},
      cerrarModalUrls: () => {},
      cerrarModalDuracion: () => {},
      cerrarBusquedaCosas: () => {},
      cerrarMenuPrincipal: () => {},
      cancelarEnlace: () => {},
      vaciarSeleccion: () => {},
      guardarLocal: () => {},
      abrirDialogoComandos: () => {},
      abrirBusquedaCosas: () => {},
      abrirDialogoBuscarGlobal: () => {},
      abrirGestionArbol: () => {},
      deshacer: () => {},
      rehacer: () => {},
      seleccionarTodoEnOpd: () => {},
      copiarSeleccionAlBuffer: () => {},
      pegarBufferEnOpdActivo: () => {},
      eliminarSeleccion: () => {},
      nudgeSeleccion: () => {},
      navegarOpdArriba: () => {},
      navegarOpdAbajo: () => {},
      navegarOpdIzquierda: () => {},
      navegarOpdDerecha: () => {},
      descomponerSeleccionada: () => {},
      desplegarSeleccionada: () => {},
      abrirPestanaNueva: () => {},
      cerrarPestana: () => {},
      cambiarPestanaActiva: () => {},
      toggleBibliotecaDock: () => {},
      simulacionActiva: false,
      autoAvanceSimulacionActivo: false,
      iniciarAutoAvanceSimulacion: () => {},
      pausarAutoAvanceSimulacion: () => {},
      oplMarginaliaMinimizada: false,
      minimizarOpl: () => {},
      restaurarOpl: () => {},
    });

    const port: GlobalShortcutsPort = { vistaMapaActiva: () => false, snapshot: baseSnapshot };
    const registros: ShortcutRegistration[] = [];
    registrarAtajosAplicacion(port, (r) => { registros.push(r); return () => {}; });
    const handler = (combo: string) => registros.find((r) => r.combo === combo && r.ctx === "canvas")?.handler;
    return { registros, calls, enlaces, handler, entidadSeleccionadaId };
  }

  test("O, P, S y R se registran en contexto canvas", () => {
    const { handler } = setupCreacion();
    for (const combo of ["O", "P", "S", "R"]) {
      expect(handler(combo)).toBeDefined();
    }
  });

  test("O crea objeto reutilizando crearObjetoDemo", () => {
    const { calls, handler } = setupCreacion();
    handler("O")!(makeFakeEvent());
    expect(calls.objeto).toBe(1);
    expect(calls.proceso + calls.estado).toBe(0);
  });

  test("P crea proceso reutilizando crearProcesoDemo", () => {
    const { calls, handler } = setupCreacion();
    handler("P")!(makeFakeEvent());
    expect(calls.proceso).toBe(1);
    expect(calls.objeto + calls.estado).toBe(0);
  });

  test("S agrega estado cuando hay un objeto seleccionado", () => {
    const { calls, handler } = setupCreacion({ entidadSeleccionada: true });
    handler("S")!(makeFakeEvent());
    expect(calls.estado).toBe(1);
  });

  test("S no actúa sin objeto seleccionado", () => {
    const { calls, handler } = setupCreacion({ seleccionId: null });
    handler("S")!(makeFakeEvent());
    expect(calls.estado).toBe(0);
  });

  test("R inicia modo enlace desde el origen seleccionado", () => {
    const { enlaces, handler, entidadSeleccionadaId } = setupCreacion({ entidadSeleccionada: true });
    handler("R")!(makeFakeEvent());
    expect(enlaces).toHaveLength(1);
    expect(enlaces[0]!.origenId).toBe(entidadSeleccionadaId!);
  });

  test("R no inicia enlace sin cosa seleccionada", () => {
    const { enlaces, handler } = setupCreacion({ seleccionId: null });
    handler("R")!(makeFakeEvent());
    expect(enlaces).toHaveLength(0);
  });
});
