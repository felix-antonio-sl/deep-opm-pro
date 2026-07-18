// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useRef, useState } from "preact/hooks";
import type { DesignacionEstado } from "../modelo/tipos";
import { useOpmStore } from "../store";
import { tokens } from "./tokens";

/**
 * Halo flotante mínimo del Estado seleccionado (paquete "Estados ciudadanos
 * de primera clase", 2026-05-23). Aparece sobre la cápsula cuando
 * `estadoSeleccionId !== null`.
 *
 * Tres acciones rápidas (rename inline, designación, eliminar) que duplican
 * lo que ya está en el InspectorEstado y el MenuContextualEstado pero a un
 * clic de distancia y con la cápsula visible al lado. Es affordance UI
 * pura (V-202): no exporta nada al canon.
 *
 * Posicionamiento: localiza la cápsula via `[data-estado-id=...]` en el DOM
 * y la cuelga justo encima usando `getBoundingClientRect` (coordenadas
 * pantalla, no modelo — el halo es chrome, no overlay del paper).
 *
 * Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §5.1.
 */
export function HaloEstado() {
  const estadoSeleccionId = useOpmStore((s) => s.estadoSeleccionId);
  const colaRenombradoPendiente = useOpmStore((s) => s.colaRenombradoPendiente);
  const pendienteEstado = colaRenombradoPendiente[0]?.tipo === "estado"
    ? colaRenombradoPendiente[0]
    : null;
  const estadoActivoId = pendienteEstado?.id ?? estadoSeleccionId;
  // Selector resolved siempre desde el id actual del store (no cerramos
  // sobre `estadoSeleccionId` de la clausura externa porque el hook
  // `useOpmStore` no lo re-evalúa cuando cambia la dependencia externa).
  const estado = useOpmStore((s) => (estadoActivoId ? s.modelo.estados?.[estadoActivoId] : undefined));
  const designaciones = estado?.designaciones ?? [];
  const renombrar = useOpmStore((s) => s.renombrarEstadoDesdeOpl);
  const designar = useOpmStore((s) => s.designarEstadoSeleccionado);
  const quitarDesignacion = useOpmStore((s) => s.quitarDesignacionEstadoSeleccionado);
  const eliminar = useOpmStore((s) => s.eliminarEstadoSeleccionado);
  const avanzarRenombradoPendiente = useOpmStore((s) => s.avanzarRenombradoPendiente);
  const cancelarRenombradoPendiente = useOpmStore((s) => s.cancelarRenombradoPendiente);

  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [popoverAbierto, setPopoverAbierto] = useState(false);
  const [renombradoInline, setRenombradoInline] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const cerrandoRenombradoRef = useRef(false);
  const esRenombradoEncadenado = pendienteEstado?.id === estadoActivoId;

  // Reposiciona via ResizeObserver/scroll/animation frame.
  useEffect(() => {
    if (!estadoActivoId) {
      setPos(null);
      setPopoverAbierto(false);
      setRenombradoInline(null);
      return;
    }
    let raf = 0;
    const actualizar = () => {
      if (document.querySelector(".joint-paper[data-opm-state-gesture='true']")) {
        setPos(null);
        return;
      }
      const node = document.querySelector(
        `.joint-paper [joint-selector^="stateCapsule"][data-estado-id="${escapeSelectorAttr(estadoActivoId)}"]`,
      );
      if (!node) {
        setPos(null);
        return;
      }
      const rect = node.getBoundingClientRect();
      setPos({ left: Math.round(rect.left + rect.width / 2), top: Math.round(rect.top - 6) });
    };
    const tick = () => {
      actualizar();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [estadoActivoId]);

  // Foco al input cuando entra en modo rename.
  useEffect(() => {
    if (renombradoInline !== null) inputRef.current?.focus();
  }, [renombradoInline]);

  useEffect(() => {
    if (!pendienteEstado) return;
    if (pendienteEstado.id !== estadoActivoId || !estado) {
      cancelarRenombradoPendiente();
      return;
    }
    cerrandoRenombradoRef.current = false;
    setRenombradoInline(estado.nombre);
  }, [
    pendienteEstado?.id,
    estadoActivoId,
    estado?.nombre,
    cancelarRenombradoPendiente,
  ]);

  // Esc cierra rename/popover (no la selección — eso lo maneja atajos.ts).
  useEffect(() => {
    if (!renombradoInline && !popoverAbierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (esRenombradoEncadenado) cancelarRenombradoPendiente();
        setRenombradoInline(null);
        setPopoverAbierto(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    renombradoInline,
    popoverAbierto,
    esRenombradoEncadenado,
    cancelarRenombradoPendiente,
  ]);

  // Eventos disparados por atajos globales (F2/D) — sólo aplican cuando el
  // halo está activo (estadoSeleccionId !== null garantizado por el sello).
  useEffect(() => {
    if (!estadoActivoId || !estado) return;
    const onRename = () => setRenombradoInline(estado.nombre);
    const onPopover = () => setPopoverAbierto((v) => !v);
    window.addEventListener("opm:halo-estado-rename", onRename);
    window.addEventListener("opm:halo-estado-popover-designar", onPopover);
    return () => {
      window.removeEventListener("opm:halo-estado-rename", onRename);
      window.removeEventListener("opm:halo-estado-popover-designar", onPopover);
    };
  }, [estadoActivoId, estado]);

  if (!estadoActivoId || !estado || !pos) return null;

  const toggleDesignacion = (designacion: DesignacionEstado) => {
    if (designaciones.includes(designacion)) quitarDesignacion(designacion);
    else designar(designacion);
  };

  const confirmarRenombrado = () => {
    if (cerrandoRenombradoRef.current || renombradoInline === null) return;
    cerrandoRenombradoRef.current = true;
    const limpio = renombradoInline.trim();
    if (limpio && limpio !== estado.nombre) renombrar(estadoActivoId, limpio);
    setRenombradoInline(null);
    if (esRenombradoEncadenado) {
      if (limpio) avanzarRenombradoPendiente();
      else cancelarRenombradoPendiente();
    }
  };

  const cancelarRenombrado = () => {
    if (cerrandoRenombradoRef.current) return;
    cerrandoRenombradoRef.current = true;
    setRenombradoInline(null);
    if (esRenombradoEncadenado) cancelarRenombradoPendiente();
  };

  return (
    <div
      style={{
        ...style.halo,
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        transform: "translate(-50%, -100%)",
      }}
      role="toolbar"
      aria-label="Acciones de estado"
      data-testid="halo-estado"
      data-halo-estado-id={estadoActivoId}
      onClick={(e) => e.stopPropagation()}
    >
      {renombradoInline !== null ? (
        <input
          ref={inputRef}
          data-testid="halo-estado-rename-input"
          type="text"
          value={renombradoInline}
          onInput={(e) => setRenombradoInline((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              confirmarRenombrado();
            } else if (e.key === "Escape") {
              e.preventDefault();
              cancelarRenombrado();
            }
          }}
          onBlur={confirmarRenombrado}
          style={style.input}
        />
      ) : (
        <>
          <button
            type="button"
            data-testid="halo-estado-rename"
            style={style.boton}
            onClick={() => setRenombradoInline(estado.nombre)}
            title="Renombrar (F2)"
          >
            ✎
          </button>
          <button
            type="button"
            data-testid="halo-estado-designar"
            style={popoverAbierto ? style.botonActivo : style.boton}
            onClick={() => setPopoverAbierto((v) => !v)}
            title="Designaciones (D)"
            aria-haspopup="true"
            aria-expanded={popoverAbierto}
          >
            ★
          </button>
          <button
            type="button"
            data-testid="halo-estado-eliminar"
            style={style.botonDanger}
            onClick={eliminar}
            title="Eliminar (Del)"
          >
            ✕
          </button>
        </>
      )}
      {popoverAbierto && renombradoInline === null ? (
        <div style={style.popover} data-testid="halo-estado-popover-designar">
          {(["inicial", "final", "default", "current"] as const).map((designacion) => (
            <button
              key={designacion}
              type="button"
              data-testid={`halo-estado-designar-${designacion}`}
              style={designaciones.includes(designacion) ? style.popoverItemActivo : style.popoverItem}
              onClick={() => toggleDesignacion(designacion)}
              disabled={
                (designacion === "default" && designaciones.includes("current")) ||
                (designacion === "current" && designaciones.includes("default"))
              }
            >
              {designaciones.includes(designacion) ? `✓ ${designacion}` : designacion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function escapeSelectorAttr(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(value);
  return value.replace(/["\\]/g, "\\$&");
}

const style = {
  halo: {
    position: "fixed" as const,
    zIndex: 30,
    display: "flex",
    gap: "2px",
    padding: "2px",
    border: `1.5px solid ${tokens.colors.ink}`,
    background: tokens.colors.paper,
    boxShadow: "none",
    pointerEvents: "auto" as const,
  },
  boton: {
    width: "24px",
    height: "24px",
    border: `1px solid ${tokens.colors.bordeChrome}`,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontSize: "12px",
    lineHeight: 1,
    fontWeight: 700,
  },
  botonActivo: {
    width: "24px",
    height: "24px",
    border: `1px solid ${tokens.colors.ink}`,
    background: tokens.colors.ink04,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontSize: "12px",
    lineHeight: 1,
    fontWeight: 700,
  },
  botonDanger: {
    width: "24px",
    height: "24px",
    border: `1px solid ${tokens.colors.bordeChrome}`,
    background: tokens.colors.paper,
    color: tokens.colors.accentDark,
    cursor: "pointer",
    fontSize: "12px",
    lineHeight: 1,
    fontWeight: 700,
  },
  input: {
    width: "120px",
    height: "24px",
    padding: "0 6px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontSize: "12px",
    fontFamily: tokens.typography.familyChrome,
  },
  popover: {
    position: "absolute" as const,
    top: "calc(100% + 4px)",
    left: 0,
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
    padding: "4px",
    border: `1.5px solid ${tokens.colors.ink}`,
    background: tokens.colors.paper,
    boxShadow: "none",
    minWidth: "120px",
  },
  popoverItem: {
    height: "24px",
    border: 0,
    background: "transparent",
    color: tokens.colors.ink,
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 500,
    textAlign: "left" as const,
    padding: "0 6px",
  },
  popoverItemActivo: {
    height: "24px",
    border: 0,
    background: tokens.colors.ink04,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
    textAlign: "left" as const,
    padding: "0 6px",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
