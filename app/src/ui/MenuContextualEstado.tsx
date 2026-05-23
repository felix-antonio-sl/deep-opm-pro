// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import type { DesignacionEstado, Id } from "../modelo/tipos";
import { useOpmStore } from "../store";
import { tokens } from "./tokens";

interface Props {
  estadoId: Id;
  entidadId: Id;
  x: number;
  y: number;
  onCerrar: () => void;
}

/**
 * Menú contextual del Estado seleccionado (paquete "Estados ciudadanos de
 * primera clase", 2026-05-23). Aparece tras right-click sobre la cápsula
 * en modo normal (handler `seleccion.ts` dispara `opm:menu-contextual-estado`).
 *
 * V-202: este menú es affordance UI, no gramática OPM. NO incluye
 * jump-to-OPL — fuera de scope del paquete; será parte del siguiente
 * (descubribilidad) que dispara la migración a B.
 *
 * Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §5.3.
 */
export function MenuContextualEstado(props: Props) {
  const designaciones = useOpmStore((s) => s.modelo.estados?.[props.estadoId]?.designaciones ?? []);
  const renombrar = useOpmStore((s) => s.renombrarEstadoSeleccionadoSmart);
  const designar = useOpmStore((s) => s.designarEstadoSeleccionado);
  const quitarDesignacion = useOpmStore((s) => s.quitarDesignacionEstadoSeleccionado);
  const suprimir = useOpmStore((s) => s.suprimirEstadoSeleccionado);
  const abrirDuracion = useOpmStore((s) => s.abrirModalDuracionEstadoSeleccionado);
  const eliminar = useOpmStore((s) => s.eliminarEstadoSeleccionado);
  const agregarHermano = useOpmStore((s) => s.agregarEstadoHermanoDeSeleccionado);

  const intentarRenombrar = () => {
    // Renombrado simple vía prompt — la versión inline vive en HaloEstado.
    const nombre = window.prompt("Nuevo nombre del estado");
    if (nombre && nombre.trim()) renombrar(nombre.trim());
    props.onCerrar();
  };

  const toggleDesignacion = (designacion: DesignacionEstado) => {
    if (designaciones.includes(designacion)) quitarDesignacion(designacion);
    else designar(designacion);
    props.onCerrar();
  };

  return (
    <div
      style={{ ...style.menu, left: props.x, top: props.y }}
      role="menu"
      data-testid="menu-contextual-estado"
      data-estado-id={props.estadoId}
    >
      <button type="button" role="menuitem" style={style.item} onClick={intentarRenombrar}>
        Renombrar (F2)
      </button>
      <div style={style.separator} />
      <button
        type="button"
        role="menuitem"
        style={designaciones.includes("inicial") ? style.itemActivo : style.item}
        onClick={() => toggleDesignacion("inicial")}
      >
        {designaciones.includes("inicial") ? "✓ Inicial" : "Designar inicial"}
      </button>
      <button
        type="button"
        role="menuitem"
        style={designaciones.includes("final") ? style.itemActivo : style.item}
        onClick={() => toggleDesignacion("final")}
      >
        {designaciones.includes("final") ? "✓ Final" : "Designar final"}
      </button>
      <button
        type="button"
        role="menuitem"
        style={designaciones.includes("default") ? style.itemActivo : style.item}
        onClick={() => toggleDesignacion("default")}
        disabled={designaciones.includes("current")}
        title={designaciones.includes("current") ? "Excluido por current (SSOT D5–D8)" : undefined}
      >
        {designaciones.includes("default") ? "✓ Default" : "Designar default"}
      </button>
      <button
        type="button"
        role="menuitem"
        style={designaciones.includes("current") ? style.itemActivo : style.item}
        onClick={() => toggleDesignacion("current")}
        disabled={designaciones.includes("default")}
        title={designaciones.includes("default") ? "Excluido por default (SSOT D5–D8)" : undefined}
      >
        {designaciones.includes("current") ? "✓ Current" : "Designar current"}
      </button>
      <div style={style.separator} />
      <button
        type="button"
        role="menuitem"
        style={style.item}
        onClick={() => { abrirDuracion(); props.onCerrar(); }}
      >
        Editar duración (T)
      </button>
      <button
        type="button"
        role="menuitem"
        style={style.item}
        onClick={() => { suprimir(); props.onCerrar(); }}
      >
        Suprimir
      </button>
      <button
        type="button"
        role="menuitem"
        style={style.item}
        onClick={() => { agregarHermano(); props.onCerrar(); }}
      >
        Agregar estado hermano
      </button>
      <div style={style.separator} />
      <button
        type="button"
        role="menuitem"
        style={style.danger}
        onClick={() => { eliminar(); props.onCerrar(); }}
      >
        Eliminar (Del)
      </button>
    </div>
  );
}

const baseItem = {
  width: "100%",
  minHeight: "32px",
  border: 0,
  background: "transparent",
  color: tokens.colors.ink,
  textAlign: "left" as const,
  padding: "8px 16px",
  cursor: "pointer",
  fontFamily: tokens.typography.fontFamily,
  fontSize: `${tokens.typography.sizes.base}px`,
  fontWeight: tokens.typography.weights.medium,
  transition: "background 150ms ease-out",
} satisfies preact.JSX.CSSProperties;

const style = {
  menu: {
    position: "fixed" as const,
    zIndex: 45,
    width: "210px",
    padding: "6px",
    border: `1.5px solid ${tokens.colors.ink}`,
    background: tokens.colors.paper,
    boxShadow: `8px 8px 0 0 ${tokens.colors.ink15}`,
  },
  item: baseItem,
  itemActivo: { ...baseItem, background: tokens.colors.ink04, fontWeight: tokens.typography.weights.bold },
  separator: {
    height: "1px",
    background: tokens.colors.ink15,
    margin: "4px 0",
  },
  danger: { ...baseItem, color: tokens.colors.accentDark },
} satisfies Record<string, preact.JSX.CSSProperties>;
