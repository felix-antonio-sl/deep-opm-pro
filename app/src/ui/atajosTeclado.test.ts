import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
  configurarContextoAtajos,
  escucharGlobal,
  formatearCombo,
  limpiarAtajosParaTest,
  listarAtajos,
  registrarAtajo,
} from "./atajosTeclado";

interface EventoTeclaFake {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  target?: EventTarget | null;
  defaultPrevented: boolean;
  propagacionDetenida: boolean;
  propagacionInmediataDetenida: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
  stopImmediatePropagation: () => void;
}

describe("registry central de atajos", () => {
  let restaurarDom: () => void;

  beforeEach(() => {
    restaurarDom = instalarDomMinimo();
    limpiarAtajosParaTest();
  });

  afterEach(() => {
    limpiarAtajosParaTest();
    restaurarDom();
  });

  test("normaliza combos y ejecuta el ultimo handler registrado para el contexto", () => {
    const llamados: string[] = [];
    registrarAtajo({
      combo: "ctrl+s",
      ctx: "global",
      categoria: "archivo",
      descripcion: "Guardar",
      handler: () => llamados.push("primero"),
    });
    registrarAtajo({
      combo: "Ctrl+S",
      ctx: "global",
      categoria: "archivo",
      descripcion: "Guardar override",
      handler: () => llamados.push("segundo"),
    });
    escucharGlobal();

    const evento = eventoTecla("s", { ctrlKey: true });
    despachar(evento);

    expect(llamados).toEqual(["segundo"]);
    expect(evento.defaultPrevented).toBe(true);
    expect(listarAtajos().map((item) => item.combo)).toEqual(["Ctrl+S", "Ctrl+S"]);
  });

  test("bloquea atajos de canvas en entrada editable pero permite Escape global", () => {
    const llamados: string[] = [];
    registrarAtajo({
      combo: "Ctrl+C",
      ctx: "canvas",
      categoria: "seleccion",
      descripcion: "Copiar",
      handler: () => llamados.push("copiar"),
    });
    registrarAtajo({
      combo: "Escape",
      ctx: "global",
      categoria: "seleccion",
      descripcion: "Cerrar",
      handler: () => llamados.push("escape"),
    });
    escucharGlobal();

    despachar(eventoTecla("c", { ctrlKey: true, target: new HTMLInputElement() }));
    despachar(eventoTecla("Escape", { target: new HTMLInputElement() }));

    expect(llamados).toEqual(["escape"]);
  });

  test("prioriza vista mapa sobre canvas cuando el store declara mapa activo", () => {
    const llamados: string[] = [];
    configurarContextoAtajos({ vistaMapaActiva: () => true });
    registrarAtajo({
      combo: "Ctrl+0",
      ctx: "canvas",
      categoria: "vista",
      descripcion: "Fit canvas",
      handler: () => llamados.push("canvas"),
    });
    registrarAtajo({
      combo: "Ctrl+0",
      ctx: "vista-mapa",
      categoria: "vista",
      descripcion: "Fit mapa",
      handler: () => llamados.push("mapa"),
    });
    escucharGlobal();

    despachar(eventoTecla("0", { ctrlKey: true }));

    expect(llamados).toEqual(["mapa"]);
  });

  test("formatea combos para plataforma Mac sin remapear la definicion", () => {
    Object.defineProperty(globalThis.navigator, "platform", {
      configurable: true,
      value: "MacIntel",
    });

    expect(formatearCombo("Ctrl+Shift+ArrowLeft")).toBe("⌃⇧←");
    expect(listarAtajos()).toEqual([]);
  });
});

function instalarDomMinimo(): () => void {
  const previoWindow = (globalThis as { window?: unknown }).window;
  const previoDocument = (globalThis as { document?: unknown }).document;
  const previoElement = (globalThis as { Element?: unknown }).Element;
  const previoInput = (globalThis as { HTMLInputElement?: unknown }).HTMLInputElement;
  const previoTextArea = (globalThis as { HTMLTextAreaElement?: unknown }).HTMLTextAreaElement;
  const previoSelect = (globalThis as { HTMLSelectElement?: unknown }).HTMLSelectElement;
  const previoNavigator = (globalThis as { navigator?: unknown }).navigator;
  let listener: ((event: KeyboardEvent) => void) | null = null;

  class ElementFake {
    closest() {
      return null;
    }
  }
  class InputFake extends ElementFake {}
  class TextAreaFake extends ElementFake {}
  class SelectFake extends ElementFake {}

  Object.defineProperty(globalThis, "Element", { configurable: true, value: ElementFake });
  Object.defineProperty(globalThis, "HTMLInputElement", { configurable: true, value: InputFake });
  Object.defineProperty(globalThis, "HTMLTextAreaElement", { configurable: true, value: TextAreaFake });
  Object.defineProperty(globalThis, "HTMLSelectElement", { configurable: true, value: SelectFake });
  Object.defineProperty(globalThis, "document", { configurable: true, value: { activeElement: null } });
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { platform: "Linux x86_64" } });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      addEventListener: (_type: string, cb: (event: KeyboardEvent) => void) => {
        listener = cb;
      },
      removeEventListener: (_type: string, cb: (event: KeyboardEvent) => void) => {
        if (listener === cb) listener = null;
      },
      dispatchEvent: (event: KeyboardEvent) => {
        listener?.(event);
        return true;
      },
    },
  });

  return () => {
    restaurarGlobal("window", previoWindow);
    restaurarGlobal("document", previoDocument);
    restaurarGlobal("Element", previoElement);
    restaurarGlobal("HTMLInputElement", previoInput);
    restaurarGlobal("HTMLTextAreaElement", previoTextArea);
    restaurarGlobal("HTMLSelectElement", previoSelect);
    restaurarGlobal("navigator", previoNavigator);
  };
}

function restaurarGlobal(nombre: string, valor: unknown): void {
  if (valor === undefined) {
    Reflect.deleteProperty(globalThis, nombre);
    return;
  }
  Object.defineProperty(globalThis, nombre, { configurable: true, value: valor });
}

function eventoTecla(key: string, patch: Partial<EventoTeclaFake> = {}): EventoTeclaFake {
  const evento: EventoTeclaFake = {
    key,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    altKey: false,
    target: null,
    defaultPrevented: false,
    propagacionDetenida: false,
    propagacionInmediataDetenida: false,
    preventDefault() {
      evento.defaultPrevented = true;
    },
    stopPropagation() {
      evento.propagacionDetenida = true;
    },
    stopImmediatePropagation() {
      evento.propagacionInmediataDetenida = true;
    },
    ...patch,
  };
  return evento;
}

function despachar(evento: EventoTeclaFake): void {
  (window as unknown as { dispatchEvent(event: KeyboardEvent): void }).dispatchEvent(evento as unknown as KeyboardEvent);
}
