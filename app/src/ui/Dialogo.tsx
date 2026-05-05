import type { ComponentChildren, RefObject } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

interface DialogoProps {
  open: boolean;
  title: string;
  children: ComponentChildren;
  actions: ComponentChildren;
  onCancel: () => void;
  initialFocusRef?: RefObject<HTMLElement>;
}

export function Dialogo(props: DialogoProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const titleId = useRef(`dialogo-${Math.random().toString(36).slice(2)}`);

  useLayoutEffect(() => {
    if (!props.open) return undefined;
    const dialog = dialogRef.current;
    const initialFocus = props.initialFocusRef?.current ?? primerFoco(dialog);
    window.setTimeout(() => initialFocus?.focus(), 0);

    const manejarTecla = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Captura: corta antes de que el registry global de atajos consuma
        // Escape via stopImmediatePropagation. El diálogo abierto siempre
        // tiene prioridad sobre los atajos globales.
        event.preventDefault();
        event.stopImmediatePropagation();
        props.onCancel();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      mantenerFocoEnDialogo(event, dialog);
    };

    window.addEventListener("keydown", manejarTecla, true);
    return () => window.removeEventListener("keydown", manejarTecla, true);
    // Dep restringida: el listener solo necesita re-registrarse cuando cambia
    // el flag `open` o el callback `onCancel`. Antes la dep `[props]` causaba
    // re-registros en cada render del provider (objeto literal nuevo cada vez),
    // dejando una ventana intermitente sin listener — flaky para Escape.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open, props.onCancel]);

  if (!props.open) return null;

  return (
    <div
      style={style.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) event.preventDefault();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId.current}
        tabIndex={-1}
        style={style.dialog}
      >
        <h2 id={titleId.current} style={style.title}>{props.title}</h2>
        <div style={style.body}>{props.children}</div>
        <div style={style.actions}>{props.actions}</div>
      </section>
    </div>
  );
}

function primerFoco(dialog: HTMLElement | null): HTMLElement | null {
  return elementosConFoco(dialog)[0] ?? dialog;
}

function mantenerFocoEnDialogo(event: KeyboardEvent, dialog: HTMLElement): void {
  const focusables = elementosConFoco(dialog);
  if (focusables.length === 0) {
    event.preventDefault();
    dialog.focus();
    return;
  }

  const primero = focusables[0];
  const ultimo = focusables[focusables.length - 1];
  if (!primero || !ultimo) return;
  const activo = document.activeElement;

  if (event.shiftKey && activo === primero) {
    event.preventDefault();
    ultimo.focus();
    return;
  }

  if (!event.shiftKey && activo === ultimo) {
    event.preventDefault();
    primero.focus();
  }
}

function elementosConFoco(dialog: HTMLElement | null): HTMLElement[] {
  if (!dialog) return [];
  return Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter((element) => element.offsetParent !== null || element === document.activeElement);
}

const style = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background: "rgba(0, 0, 0, 0.5)",
  },
  dialog: {
    width: "min(460px, calc(100vw - 32px))",
    padding: "18px",
    border: "1px solid #c8d2df",
    borderRadius: "6px",
    background: "#ffffff",
    boxShadow: "0 18px 42px rgba(16, 24, 40, 0.24)",
    color: "#1f2937",
    fontFamily: "Arial, sans-serif",
    outline: "none",
  },
  title: {
    margin: "0 0 10px",
    color: "#1f2937",
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: 1.3,
  },
  body: {
    color: "#475467",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: 1.45,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "18px",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
