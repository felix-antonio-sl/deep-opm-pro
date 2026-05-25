import type { VarianteChipTipo } from "../ChipPersistencia";
import { toolbarStyle as style } from "./toolbarStyles";

interface ToolbarActionButtonProps {
  label: string;
  shortcut: string;
  glyph: preact.ComponentChildren;
  active?: boolean;
  disabled?: boolean;
  className?: string | undefined;
  testId: string;
  title: string;
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaHaspopup?: "dialog" | "menu" | "listbox" | "tree" | "grid" | true;
  ariaExpanded?: boolean;
  buttonRef?: preact.Ref<HTMLButtonElement> | undefined;
  draggable?: boolean;
  semanticColor?: string;
  onClick: (event: MouseEvent) => void;
  onDragStart?: (event: DragEvent) => void;
}

export function ToolbarActionButton(props: ToolbarActionButtonProps): preact.JSX.Element {
  const buttonStyle = props.disabled
    ? style.creatorButtonDisabled
    : props.active
      ? style.creatorButtonActive
      : style.creatorButton;
  const refProp = props.buttonRef ? { ref: props.buttonRef } : {};

  return (
    <button
      {...refProp}
      type="button"
      style={buttonStyle}
      aria-label={props.ariaLabel ?? props.label}
      aria-keyshortcuts={props.shortcut}
      aria-pressed={props.ariaPressed}
      aria-haspopup={props.ariaHaspopup}
      aria-expanded={props.ariaExpanded}
      className={props.className ?? ""}
      disabled={props.disabled}
      draggable={props.draggable}
      onClick={props.onClick}
      onDragStart={props.onDragStart}
      data-testid={props.testId}
      title={props.title}
    >
      <span aria-hidden="true" style={style.creatorGlyphSlot}>{props.glyph}</span>
      <span aria-hidden="true" style={style.creatorLabel}>{props.label}</span>
      <span aria-hidden="true" style={style.creatorShortcutDivider} />
      <kbd aria-hidden="true" style={kbdStyle(props.semanticColor)}>{props.shortcut}</kbd>
    </button>
  );
}

function kbdStyle(semanticColor: string | undefined): preact.JSX.CSSProperties {
  if (!semanticColor) return style.creatorKbd;
  return {
    ...style.creatorKbd,
    border: `1px solid ${semanticColor}`,
    color: semanticColor,
  };
}

export function labelPersistenciaToolbar(tipo: VarianteChipTipo, label: string, salvando: boolean): string {
  if (salvando) return label;
  if (tipo === "local-clean") return label.replace(/ · \d{2}:\d{2}$/, "");
  if (tipo === "local-dirty") return "Sin guardar ⌃S";
  if (label.startsWith("Sin guardar")) return "Sin guardar ⌃S";
  return label.replace(" · Ctrl+S", " ⌃S");
}
