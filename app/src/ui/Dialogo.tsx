// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import type { ComponentChildren, JSX, RefObject } from "preact";
import { Children, createPortal } from "preact/compat";
import { useLayoutEffect, useMemo, useRef } from "preact/hooks";
import { GLIFO_SEP } from "./codex/glifos";
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
        <div style={style.actions}>{intercalarSeparadores(props.actions)}</div>
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

// Ronda Codex v1 · L3 — Acción de diálogo como PALABRA tipográfica.
//
// Patrón prohibido (`ui-forja/02-components §Apéndice`): "Button con background
// + radius + shadow". Las acciones del diálogo son palabras separadas por `·`
// (`ui-forja/02-components §8`, `01-design-spec §8`). `DialogoAccion` mantiene
// el `<button>` real (rol/nombre accesible = texto visible, testIds intactos)
// pero lo pinta como palabra: sin fondo, sin borde, sin radius, sin sombra.
//   - default   → tinta media (inkMid), serif.
//   - primaria  → tinta plena (ink), peso bold + subrayado hairline ink.
//   - destructiva → crimson (canal UI V-203, `01-design-spec §3.3`).
//   - disabled  → inkSoft, sin cursor (HU-SHARED-003: no oculta acciones
//                 no permitidas; las muestra atenuadas).
export type DialogoAccionTono = "default" | "primaria" | "destructiva";

interface DialogoAccionProps {
  children: ComponentChildren;
  onClick?: JSX.MouseEventHandler<HTMLButtonElement>;
  tono?: DialogoAccionTono;
  disabled?: boolean;
  type?: "button" | "submit";
  /** `form` id para acciones `type="submit"` fuera del `<form>` (submit remoto). */
  form?: string;
  title?: string;
  "aria-label"?: string;
  testId?: string;
  innerRef?: RefObject<HTMLButtonElement>;
}

export function DialogoAccion(props: DialogoAccionProps) {
  const tono: DialogoAccionTono = props.tono ?? "default";
  const estilo = props.disabled
    ? accionStyle.disabled
    : tono === "primaria"
      ? accionStyle.primaria
      : tono === "destructiva"
        ? accionStyle.destructiva
        : accionStyle.default;
  const extra: Record<string, unknown> = {};
  if (props.innerRef) extra.ref = props.innerRef;
  if (props.onClick) extra.onClick = props.onClick;
  if (props.disabled) extra.disabled = true;
  if (props.form) extra.form = props.form;
  if (props.title) extra.title = props.title;
  if (props["aria-label"]) extra["aria-label"] = props["aria-label"];
  if (props.testId) extra["data-testid"] = props.testId;
  return (
    <button type={props.type ?? "button"} style={estilo} {...extra}>
      {props.children}
    </button>
  );
}

// Intercala el separador `·` (inkFaint, `01-design-spec §3.1`) entre cada
// acción del footer. El separador es decorativo (`aria-hidden`) y vive FUERA de
// los `<button>`, así el nombre accesible de cada acción permanece exacto.
function intercalarSeparadores(actions: ComponentChildren): ComponentChildren {
  const items = Children.toArray(actions).filter((child) => child != null);
  if (items.length <= 1) return actions;
  return items.flatMap((item, index) =>
    index === 0
      ? [item]
      : [
          <span key={`sep-${index}`} aria-hidden="true" style={accionStyle.separador}>
            {GLIFO_SEP}
          </span>,
          item,
        ],
  );
}

// Ronda Codex v1 · L3 — diálogo base re-pielado a lenguaje Codex.
// - Backdrop: papel translúcido (no negro puro), blur 2px — sin overlay oscuro
//   (`02-components §Apéndice`, §8). Derivado de tokens.colors.paper.
// - Container: hairline `ruleStrong` (`01-design-spec §6`), paper bg, sin radius,
//   sin sombra (`§6`: "No usar shadows. No usar elevación.").
// - Header: hairline `ruleStrong` inferior; título Inria Serif 700/20, tracking
//   tight (`§4.3`, `§5`).
// - Body: serif 13.5/1.55, tracking body (`§4.2`).
// - Footer: hairline `rule` superior; acciones-palabra alineadas a la derecha.
const PAPER_BACKDROP = "rgba(250, 250, 248, 0.78)"; // tokens.colors.paper @ 78%

const style = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background: PAPER_BACKDROP,
    backdropFilter: "blur(2px)",
  },
  dialog: {
    padding: 0,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    boxShadow: tokens.shadows.none,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    outline: "none",
    maxHeight: "calc(100vh - 48px)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    flex: "0 0 auto",
    padding: "24px 24px 20px",
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
  },
  title: {
    margin: 0,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs20}px`,
    fontWeight: tokens.typography.weights.bold,
    lineHeight: tokens.typography.lh.tight,
    letterSpacing: tokens.typography.ls.tight,
  },
  body: {
    minHeight: 0,
    overflow: "auto",
    padding: "24px 28px",
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs13}px`,
    fontWeight: tokens.typography.weights.regular,
    lineHeight: tokens.typography.lh.opl,
    letterSpacing: tokens.typography.ls.body,
  },
  actions: {
    flex: "0 0 auto",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    justifyContent: "flex-end",
    gap: "0",
    padding: "16px 24px",
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

const accionBase = {
  appearance: "none",
  border: "none",
  borderRadius: 0,
  background: "transparent",
  boxShadow: "none",
  padding: "2px 2px",
  margin: 0,
  fontFamily: tokens.typography.serif,
  fontSize: `${tokens.typography.fs.fs14}px`,
  lineHeight: tokens.typography.lh.tight,
  letterSpacing: tokens.typography.ls.body,
  cursor: "pointer",
  whiteSpace: "nowrap",
  transition: tokens.transitions.fast,
} satisfies preact.JSX.CSSProperties;

const accionStyle = {
  default: {
    ...accionBase,
    color: tokens.colors.inkMid,
    fontWeight: tokens.typography.weights.regular,
  },
  primaria: {
    ...accionBase,
    color: tokens.colors.ink,
    fontWeight: tokens.typography.weights.bold,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
  },
  destructiva: {
    ...accionBase,
    color: tokens.colors.crimson,
    fontWeight: tokens.typography.weights.regular,
  },
  disabled: {
    ...accionBase,
    color: tokens.colors.inkSoft,
    fontWeight: tokens.typography.weights.regular,
    cursor: "not-allowed",
  },
  separador: {
    color: tokens.colors.inkFaint,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs14}px`,
    padding: "0 10px",
    userSelect: "none",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
