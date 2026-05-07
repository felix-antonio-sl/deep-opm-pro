export type Combo = string;

// HU-11.007: gesto único multi-al-todo, SSOT textual [OPL-ES RF1].
export const ATAJO_CONECTAR_MULTI_AL_TODO = "Ctrl+Alt+T" as const;

export type ContextoAtajo =
  | "global"
  | "canvas"
  | "panel-opl"
  | "panel-arbol"
  | "modal-input"
  | "vista-mapa";

export type CategoriaAtajo = "navegacion" | "edicion" | "archivo" | "vista" | "seleccion";

export interface RegistroAtajo {
  combo: Combo;
  handler: (e: KeyboardEvent) => void;
  ctx: ContextoAtajo;
  descripcion: string;
  categoria: CategoriaAtajo;
  preventDefault?: boolean;
}

interface OpcionesContextoAtajos {
  vistaMapaActiva?: () => boolean;
}

let registros: RegistroAtajo[] = [];
let escuchando = false;
let contexto: OpcionesContextoAtajos = {};

export function configurarContextoAtajos(opciones: OpcionesContextoAtajos): () => void {
  contexto = { ...contexto, ...opciones };
  return () => {
    contexto = {};
  };
}

export function registrarAtajo(reg: RegistroAtajo): () => void {
  const normalizado: RegistroAtajo = {
    ...reg,
    combo: normalizarCombo(reg.combo),
    preventDefault: reg.preventDefault ?? true,
  };
  const duplicado = registros.some((item) => item.combo === normalizado.combo && item.ctx === normalizado.ctx);
  if (duplicado && ambienteDev()) {
    console.warn(`[atajos] atajo duplicado: ${normalizado.combo} (${normalizado.ctx}); se usara el ultimo registro`);
  }
  registros = [...registros, normalizado];
  return () => {
    registros = registros.filter((item) => item !== normalizado);
  };
}

export function desregistrarAtajo(combo: Combo, ctx: ContextoAtajo): void {
  const buscado = normalizarCombo(combo);
  registros = registros.filter((item) => !(item.combo === buscado && item.ctx === ctx));
}

export function escucharGlobal(): () => void {
  if (escuchando) return () => {};
  escuchando = true;
  window.addEventListener("keydown", manejarKeydown, { capture: true });
  return () => {
    window.removeEventListener("keydown", manejarKeydown, { capture: true });
    escuchando = false;
  };
}

export function listarAtajos(): RegistroAtajo[] {
  return [...registros];
}

export function limpiarAtajosParaTest(): void {
  registros = [];
  contexto = {};
  escuchando = false;
}

export function formatearCombo(combo: Combo): string {
  const normalizado = normalizarCombo(combo);
  if (!esMac()) return normalizado;
  return normalizado
    .replaceAll("Ctrl+", "⌃")
    .replaceAll("Shift+", "⇧")
    .replaceAll("Alt+", "⌥")
    .replace("ArrowUp", "↑")
    .replace("ArrowDown", "↓")
    .replace("ArrowLeft", "←")
    .replace("ArrowRight", "→");
}

function manejarKeydown(e: KeyboardEvent): void {
  // Cualquier diálogo modal abierto consume sus propios atajos (Escape,
  // Enter, Tab focus trap). El registry global se hace a un lado para no
  // robar el evento via stopImmediatePropagation.
  if (e.target instanceof Element && e.target.closest('[role="dialog"][aria-modal="true"]')) return;

  const combo = comboDesdeEvento(e);
  const ctx = contextoDesdeEvento(e);
  const candidato = registroAplicable(combo, ctx, e);
  if (!candidato) return;

  if (candidato.preventDefault !== false) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
  candidato.handler(e);
}

function registroAplicable(combo: Combo, ctx: ContextoAtajo, e: KeyboardEvent): RegistroAtajo | null {
  if (ctx === "modal-input") {
    if (combo !== "Escape" && combo !== "Enter") return null;
    return ultimoRegistro(combo, "modal-input") ?? ultimoRegistro(combo, "global");
  }
  if (ctx === "vista-mapa") {
    return ultimoRegistro(combo, "vista-mapa") ?? ultimoRegistro(combo, "global");
  }
  if (ctx === "panel-arbol") {
    return ultimoRegistro(combo, "panel-arbol") ?? ultimoRegistro(combo, "global");
  }
  if (ctx === "panel-opl") {
    return ultimoRegistro(combo, "panel-opl") ?? ultimoRegistro(combo, "global");
  }
  if (esEditable(e.target)) return null;
  return ultimoRegistro(combo, "canvas") ?? ultimoRegistro(combo, "global");
}

function ultimoRegistro(combo: Combo, ctx: ContextoAtajo): RegistroAtajo | null {
  for (let i = registros.length - 1; i >= 0; i -= 1) {
    const registro = registros[i];
    if (!registro) continue;
    if (registro.combo === combo && registro.ctx === ctx) return registro;
  }
  return null;
}

function contextoDesdeEvento(e: KeyboardEvent): ContextoAtajo {
  if (esEditable(e.target)) return "modal-input";
  if (contexto.vistaMapaActiva?.()) return "vista-mapa";
  const target = e.target instanceof Element ? e.target : document.activeElement;
  const contextual = target?.closest?.("[data-atajos-contexto]");
  const value = contextual?.getAttribute("data-atajos-contexto");
  if (value === "panel-arbol" || value === "panel-opl" || value === "canvas") return value;
  return "canvas";
}

function esEditable(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target.closest("[data-modo='inline-rename']")) return true;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return true;
  return target.closest("[contenteditable='true']") !== null;
}

function comboDesdeEvento(e: KeyboardEvent): Combo {
  const partes: string[] = [];
  if (e.ctrlKey || e.metaKey) partes.push("Ctrl");
  if (e.altKey) partes.push("Alt");
  if (e.shiftKey) partes.push("Shift");
  partes.push(teclaNormalizada(e.key));
  return partes.join("+");
}

function normalizarCombo(combo: Combo): Combo {
  return combo
    .split("+")
    .map((parte) => {
      const limpio = parte.trim();
      if (/^ctrl$/i.test(limpio) || /^cmd$/i.test(limpio) || /^meta$/i.test(limpio)) return "Ctrl";
      if (/^shift$/i.test(limpio)) return "Shift";
      if (/^alt$/i.test(limpio) || /^option$/i.test(limpio)) return "Alt";
      return teclaNormalizada(limpio);
    })
    .join("+");
}

function teclaNormalizada(key: string): string {
  if (key.length === 1) return key.toUpperCase();
  if (key === " ") return "Space";
  if (key === "Esc") return "Escape";
  return key;
}

function esMac(): boolean {
  const nav = globalThis.navigator as Navigator | undefined;
  return /Mac|iPhone|iPad|iPod/.test(nav?.platform ?? "");
}

function ambienteDev(): boolean {
  return Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);
}
