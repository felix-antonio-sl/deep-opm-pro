// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import type { ComponentChildren, RefObject } from "preact";
import { createPortal } from "preact/compat";
import { useLayoutEffect, useMemo, useRef } from "preact/hooks";
import { tokens } from "./tokens";

/**
 * Diálogo modal accesible con captura Esc obligatoria [HU-30.037, Met §6]
 * y prop opcional `size?` que mapea a un ancho canónico [JOYAS §2].
 * El default `"md"` mantiene comportamiento histórico (ronda <= 12).
 *
 * Ronda 15 L1: el árbol del modal vive en un portal anclado a `body` para
 * desacoplarlo del subárbol del workbench (`<main display:grid>` + canvas
 * SVG/composite layers). Esta es la regla canónica para overlays modales y
 * coincide con el patrón OPCloud `cdk-overlay-pane`
 * (`opm-extracted/src/app/modules/layout/main/main.component.ts:206`,
 * `MatDialog.open` con `panelClass`). Sin portal, cualquier ancestro que
 * forme containing block para `position: fixed` (transform/filter/perspective/
 * `contain: paint`/`will-change: transform`) hace que el modal pinte
 * relativo al ancestro y deje de cubrir el viewport — el síntoma observado
 * en los tres reverts: modal montado pero invisible, o clicks robados por
 * el SVG del paper cuando éste compartía contexto de stacking.
 */

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export type DialogoSize = "sm" | "md" | "lg" | "xl";
export type DialogoIfmlStereotype = "Modal" | "Modeless";

const ANCHO_POR_TAMANO: Record<DialogoSize, string> = {
  sm: "min(360px, calc(100vw - 32px))",
  md: "min(460px, calc(100vw - 32px))",
  lg: "min(720px, calc(100vw - 32px))",
  xl: "min(960px, calc(100vw - 32px))",
};

interface DialogoProps {
  open: boolean;
  title: string;
  children: ComponentChildren;
  actions: ComponentChildren;
  onCancel: () => void;
  initialFocusRef?: RefObject<HTMLElement>;
  size?: DialogoSize;
  /**
   * IFML V9: estereotipo explicito del dialogo. Default `true` preserva el
   * contrato historico de overlay modal con portal, foco contenido y Escape.
   */
  modal?: boolean;
  /**
   * `data-testid` opcional aplicado al elemento `<section role="dialog">`.
   * Permite que smokes existentes (p. ej. `08-mvp-alpha-residual.spec.ts`)
   * sigan usando `getByTestId(...)` para alcanzar tanto el body como las
   * acciones del dialogo. Sin este prop el testid solo cubre el subarbol
   * que el cliente decida marcar.
   */
  testId?: string;
}

export function Dialogo(props: DialogoProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const titleId = useRef(`dialogo-${Math.random().toString(36).slice(2)}`);
  const tamano: DialogoSize = props.size ?? "md";
  const modal = props.modal ?? true;
  const stereotype = estereotipoDialogo(modal);
  const dialogStyle = useMemo(
    () => ({ ...style.dialog, width: ANCHO_POR_TAMANO[tamano] }),
    [tamano],
  );

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
  if (typeof document === "undefined") return null;

  const overlay = (
    <div
      style={style.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) event.preventDefault();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal={modal ? "true" : "false"}
        aria-labelledby={titleId.current}
        tabIndex={-1}
        style={dialogStyle}
        data-testid={props.testId}
        data-ifml-stereotype={stereotype}
        data-ifml-modal={modal ? "true" : "false"}
      >
        <div style={style.header}>
          <h2 id={titleId.current} style={style.title}>{props.title}</h2>
        </div>
        <div style={style.body}>{props.children}</div>
        <div style={style.actions}>{props.actions}</div>
      </section>
    </div>
  );

  // Portal a `document.body` para desacoplar del workbench grid + canvas SVG.
  // Inspiración: `cdk-overlay-pane` de Angular CDK, usado por OPCloud
  // (`MatDialog.open(..., { panelClass: "choose-link-dialog", ... })`).
  return createPortal(overlay, document.body);
}

export function estereotipoDialogo(modal = true): DialogoIfmlStereotype {
  return modal ? "Modal" : "Modeless";
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

// Ronda 28 L5: dialogo base Bauhaus.
// - Backdrop ink 30% (no negro puro), sin blur.
// - Container 1.5px ink border, paper bg, sombra plana flatXl, sin radius.
// - Header padding 24 + border-bottom 1.5px ink; titulo Inter Tight 700/20.
// - Body padding 24/28.
// - Footer padding 16/24 + border-top 1.5px ink-15 (provisto por cada diálogo
//   en su slot de `actions`).
const style = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background: "rgba(10, 10, 10, 0.30)",
  },
  dialog: {
    padding: 0,
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    boxShadow: tokens.shadows.flatXl,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    outline: "none",
    maxHeight: "calc(100vh - 48px)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    flex: "0 0 auto",
    padding: "24px 24px 20px",
    borderBottom: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
  },
  title: {
    margin: 0,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "20px",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
  },
  body: {
    minHeight: 0,
    overflow: "auto",
    padding: "24px 28px",
    color: tokens.colors.ink90,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: 1.55,
  },
  actions: {
    flex: "0 0 auto",
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "16px 24px",
    borderTop: `${tokens.stroke.base}px solid ${tokens.colors.ink15}`,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
