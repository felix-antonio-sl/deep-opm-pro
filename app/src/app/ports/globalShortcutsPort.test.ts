import { describe, expect, test } from "bun:test";
import {
  registrarAtajosAplicacion,
  type GlobalShortcutsPort,
  type GlobalShortcutsSnapshot,
  type ShortcutRegistration,
} from "./globalShortcutsPort";

// KeyboardEvent is a browser API not available in Bun's Node-like test runtime.
// Our handlers ignore the event object entirely (they only read from snapshot),
// so passing a minimal stub is safe and correct for unit-level testing.
const fakeKeyEvent = {} as KeyboardEvent;

function setup(sim: { activa: boolean; auto: boolean }) {
  const calls = { play: 0, pausa: 0 };

  const baseSnapshot = (): GlobalShortcutsSnapshot => ({
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

  return { registros, calls };
}

describe("atajo Espacio en simulación", () => {
  test("no actúa fuera de simulación", () => {
    const { registros, calls } = setup({ activa: false, auto: false });
    const espacio = registros.find((r) => r.combo === "Space");
    expect(espacio).toBeDefined();
    espacio!.handler(fakeKeyEvent);
    expect(calls.play + calls.pausa).toBe(0);
  });

  test("play cuando sim activa y no auto-avanzando", () => {
    const { registros, calls } = setup({ activa: true, auto: false });
    registros.find((r) => r.combo === "Space")!.handler(fakeKeyEvent);
    expect(calls.play).toBe(1);
    expect(calls.pausa).toBe(0);
  });

  test("pausa cuando sim activa y auto-avanzando", () => {
    const { registros, calls } = setup({ activa: true, auto: true });
    registros.find((r) => r.combo === "Space")!.handler(fakeKeyEvent);
    expect(calls.pausa).toBe(1);
    expect(calls.play).toBe(0);
  });
});
