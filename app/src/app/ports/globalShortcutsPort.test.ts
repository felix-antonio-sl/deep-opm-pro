import { describe, expect, test } from "bun:test";
import { crearModelo } from "../../modelo/operaciones";
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
) {
  const calls = { play: 0, pausa: 0, oplMinimizar: 0, oplRestaurar: 0 };
  const navegados: Id[] = [];
  const modelo = nav.modelo ?? crearModelo();
  const opdActivoId = nav.opdActivoId ?? modelo.opdRaizId;

  const baseSnapshot = (): GlobalShortcutsSnapshot => ({
    modelo,
    opdActivoId,
    cambiarOpdActivo: (id: Id) => { navegados.push(id); },
    enlaceSeleccionId: null,
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
    asistente: null,
    busquedaCosasAbierta: false,
    menuPrincipalAbierto: false,
    modoEnlace: null,
    pestanasAbiertas: [],
    pestanaActivaId: null,
    abrirDialogoTraerConectados: () => {},
    ocultarAparienciaSeleccionada: () => {},
    copiarEstiloEnlaceAlPortapapeles: () => {},
    pegarEstiloEnlaceDesdePortapapeles: () => {},
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
    cancelarAsistente: () => {},
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

  return { registros, calls, navegados };
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

describe("navegación directa ⌘/Ctrl+1..9 (05-interactions §1)", () => {
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

  test("Ctrl+1 navega al SD raíz desde un SDN", () => {
    const modelo = modeloConOpds(2);
    const { registros, navegados } = setup({ activa: false, auto: false }, undefined, { modelo, opdActivoId: "opd-2" });
    registros.find((r) => r.combo === "Ctrl+1")!.handler(makeFakeEvent());
    expect(navegados).toEqual(["opd-1"]);
  });

  test("Ctrl+2 navega al primer SDN; Ctrl+3 al siguiente", () => {
    const modelo = modeloConOpds(2);
    const { registros, navegados } = setup({ activa: false, auto: false }, undefined, { modelo });
    registros.find((r) => r.combo === "Ctrl+2")!.handler(makeFakeEvent());
    registros.find((r) => r.combo === "Ctrl+3")!.handler(makeFakeEvent());
    expect(navegados).toEqual(["opd-2", "opd-3"]);
  });

  test("Ctrl+N no navega si el índice excede los OPDs disponibles", () => {
    const modelo = modeloConOpds(1);
    const { registros, navegados } = setup({ activa: false, auto: false }, undefined, { modelo });
    registros.find((r) => r.combo === "Ctrl+5")!.handler(makeFakeEvent());
    expect(navegados).toEqual([]);
  });

  test("Ctrl+1 no re-navega si ya estás en el SD raíz", () => {
    const modelo = modeloConOpds(2);
    const { registros, navegados } = setup({ activa: false, auto: false }, undefined, { modelo, opdActivoId: "opd-1" });
    registros.find((r) => r.combo === "Ctrl+1")!.handler(makeFakeEvent());
    expect(navegados).toEqual([]);
  });
});
