/**
 * ViewContainer ToolbarMas: menu manual ⋯ Más para acciones secundarias del Toolbar.
 * [JOYAS §1-3], [V-0c], IFML H-2/H-5/H-12, ronda 15 L2.
 *
 * Decisión de diseño explícita:
 * - No usa IntersectionObserver ni medición de overflow (rechazo de T2.1 opción C).
 * - Las acciones se mueven manualmente desde ToolbarBase/Creacion/Seleccion/Multiseleccion.
 * - Accesibilidad: aria-haspopup="menu", aria-expanded, items con role="menuitem",
 *   Enter/Space abre, Escape cierra, click-outside cierra. Tooltips/atajos visibles.
 */
import { useEffect, useId, useRef, useState } from "preact/hooks";
import { tokens } from "../tokens";
import { toolbarStyle as style } from "./toolbarStyles";

export type ToolbarMasItem =
  | {
      kind: "accion";
      id: string;
      label: string;
      atajo?: string;
      title?: string;
      disabled?: boolean;
      activo?: boolean;
      onClick: () => void;
      testId?: string;
    }
  | {
      kind: "separador";
      id: string;
      label?: string;
    };

interface ToolbarMasProps {
  items: ToolbarMasItem[];
  /** Etiqueta accesible del botón (default: "Más acciones"). */
  ariaLabel?: string;
  /** Texto visible junto al icono ⋯ (default: "Más"). */
  triggerLabel?: string;
  /** testId del botón trigger (default: "toolbar-mas-trigger"). */
  testId?: string;
}

export function ToolbarMas({
  items,
  ariaLabel = "Más acciones",
  triggerLabel = "Más",
  testId = "toolbar-mas-trigger",
}: ToolbarMasProps) {
  const [abierto, setAbierto] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const abiertoRef = useRef(false);
  abiertoRef.current = abierto;
  const menuId = useId();
  const accionVisibles = items.filter((item) => item.kind === "accion") as Array<Extract<ToolbarMasItem, { kind: "accion" }>>;
  const habilitado = accionVisibles.length > 0;

  // Listener de Escape registrado SIEMPRE en captura. El orden de useEffect en
  // hijos corre antes que en padres durante el mount, asi que este listener
  // queda antes que el atajo global de App.tsx en la lista de captura. Solo
  // actua cuando el menu esta abierto y stop-detiene propagacion para que el
  // atajo global no vacie la seleccion ni cierre otro modal.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (!abiertoRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setAbierto(false);
      triggerRef.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!abiertoRef.current) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setAbierto(false);
    }
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("pointerdown", onPointerDown, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (!abierto || !menuRef.current) return;
    const primero = menuRef.current.querySelector<HTMLButtonElement>('button[role="menuitem"]:not([disabled])');
    primero?.focus();
  }, [abierto]);

  function toggle() {
    if (!habilitado) return;
    setAbierto((prev) => !prev);
  }
  function handleTriggerKey(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      toggle();
    } else if (event.key === "ArrowDown" && !abierto) {
      event.preventDefault();
      setAbierto(true);
    }
  }
  function ejecutar(item: Extract<ToolbarMasItem, { kind: "accion" }>) {
    if (item.disabled) return;
    setAbierto(false);
    item.onClick();
  }

  return (
    <div style={masStyle.wrapper}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={abierto ? menuId : undefined}
        aria-label={ariaLabel}
        title={ariaLabel}
        onClick={toggle}
        onKeyDown={handleTriggerKey}
        disabled={!habilitado}
        data-testid={testId}
        style={!habilitado ? style.disabledButton : abierto ? style.activeButton : style.button}
      >
        <span aria-hidden="true" style={masStyle.dots}>⋯</span>
        {triggerLabel}
      </button>
      {abierto ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={ariaLabel}
          data-testid="toolbar-mas-menu"
          style={masStyle.menu}
        >
          {items.map((item) => {
            if (item.kind === "separador") {
              return (
                <div key={item.id} style={masStyle.separadorWrap}>
                  {item.label ? <span style={masStyle.separadorLabel}>{item.label}</span> : null}
                  <div style={masStyle.separadorLinea} aria-hidden="true" />
                </div>
              );
            }
            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                title={item.title ?? item.label}
                onClick={() => ejecutar(item)}
                data-testid={item.testId}
                aria-pressed={item.activo === undefined ? undefined : item.activo}
                style={item.disabled ? masStyle.itemDisabled : item.activo ? masStyle.itemActivo : masStyle.item}
              >
                <span style={masStyle.itemLabel}>{item.label}</span>
                {item.atajo ? <span style={masStyle.itemAtajo}>{item.atajo}</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

const masStyle = {
  wrapper: {
    position: "relative",
    flex: "0 0 auto",
  },
  dots: {
    fontSize: "16px",
    fontWeight: 800,
    marginRight: "4px",
    letterSpacing: "1px",
    lineHeight: 1,
  },
  menu: {
    position: "absolute",
    top: "40px",
    right: 0,
    zIndex: 900,
    minWidth: "240px",
    maxWidth: "320px",
    padding: "6px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoChrome,
    boxShadow: tokens.shadows.menuPrincipal,
    display: "grid",
    gap: "2px",
  },
  item: {
    width: "100%",
    minHeight: "34px",
    padding: "0 10px",
    border: "1px solid transparent",
    borderRadius: tokens.radii.sm,
    background: "transparent",
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  itemActivo: {
    width: "100%",
    minHeight: "34px",
    padding: "0 10px",
    border: `1px solid ${tokens.colors.acentoUi}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.acentoUiSuave,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 800,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  itemDisabled: {
    width: "100%",
    minHeight: "34px",
    padding: "0 10px",
    border: "1px solid transparent",
    borderRadius: tokens.radii.sm,
    background: "transparent",
    color: tokens.colors.textoDeshabilitado,
    cursor: "not-allowed",
    fontSize: "13px",
    fontWeight: 700,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  itemLabel: {
    flex: "1 1 auto",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  itemAtajo: {
    flex: "0 0 auto",
    color: tokens.colors.textoTerciario,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.4px",
  },
  separadorWrap: {
    display: "grid",
    gap: "2px",
    margin: "4px 0 2px",
  },
  separadorLabel: {
    padding: "0 10px",
    color: tokens.colors.textoTerciario,
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.4px",
    textTransform: "uppercase",
  },
  separadorLinea: {
    height: "1px",
    background: tokens.colors.bordeChrome,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
