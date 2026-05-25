// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useState } from "preact/hooks";
import { useBarraPestanasViewModel } from "../app/viewmodels/barraPestanasViewModel";
import type { Pestana } from "../modelo/tipos";
import { useConfirmarCierreDirty } from "./ConfirmacionContext";
import { tokens } from "./tokens";
import "./BarraPestanas.css";

const MIME_PESTANA = "text/pestana-id";

export function BarraPestanas() {
  const {
    pestanas,
    activa,
    abrirPestanaNueva,
    cambiarPestanaActiva,
    cerrarPestana,
    reordenarPestanas,
    guardarLocal,
  } = useBarraPestanasViewModel();
  const confirmarCierreDirty = useConfirmarCierreDirty();
  const [arrastrandoId, setArrastrandoId] = useState<string | null>(null);
  const [cerrarHoverId, setCerrarHoverId] = useState<string | null>(null);

  const cerrarConConfirmacion = (pestana: Pestana) => {
    if (pestana.dirty) {
      confirmarCierreDirty(
        () => cerrarPestana(pestana.id, { forzar: true }),
        {
          dirty: true,
          onGuardar: () => {
            if (pestana.id !== activa) cambiarPestanaActiva(pestana.id);
            guardarLocal();
          },
        },
      );
      return;
    }
    cerrarPestana(pestana.id);
  };

  const activarConConfirmacion = (pestana: Pestana) => {
    if (pestana.id === activa) return;
    const pestanaActiva = pestanas.find((item) => item.id === activa);
    confirmarCierreDirty(
      () => cambiarPestanaActiva(pestana.id),
      { dirty: pestanaActiva?.dirty ?? false },
    );
  };

  const soltarSobre = (event: preact.JSX.TargetedDragEvent<HTMLDivElement>, destinoId: string) => {
    event.preventDefault();
    const origenId = event.dataTransfer?.getData(MIME_PESTANA) || arrastrandoId;
    setArrastrandoId(null);
    if (!origenId || origenId === destinoId) return;
    const orden = pestanas.map((pestana) => pestana.id);
    const origenIndex = orden.indexOf(origenId);
    const destinoIndex = orden.indexOf(destinoId);
    if (origenIndex < 0 || destinoIndex < 0) return;
    orden.splice(origenIndex, 1);
    orden.splice(destinoIndex, 0, origenId);
    reordenarPestanas(orden);
  };

  return (
    <div data-testid="barra-pestanas" style={style.barra}>
      {/*
        Ronda Codex v2 L2 (auditoría rev2 §05): el Breadcrumb se trasladó al
        header de CodexFrame (columna central, reemplazando el literal "Codex").
        Aquí se retira para no duplicar el testid `breadcrumb-opd`. La barra de
        pestañas queda enfocada solo en las pestañas.
      */}
      <div style={style.tabsSlot}>
        <div role="tablist" aria-label="Modelos abiertos" className="barra-pestanas__lista" style={style.lista}>
          {pestanas.map((pestana) => {
            const activaActual = pestana.id === activa;
            return (
              <div
                key={pestana.id}
                role="tab"
                aria-selected={activaActual}
                data-testid={`pestana-${pestana.id}`}
                draggable
                onDragStart={(event) => {
                  setArrastrandoId(pestana.id);
                  event.dataTransfer?.setData(MIME_PESTANA, pestana.id);
                  if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => soltarSobre(event, pestana.id)}
                style={{
                  ...style.pestana,
                  ...(activaActual ? style.pestanaActiva : {}),
                  ...(pestana.dirty ? style.pestanaDirty : {}),
                }}
                onClick={() => activarConConfirmacion(pestana)}
              >
                <span style={style.etiqueta} title={pestana.etiqueta}>
                  {pestana.etiqueta}
                </span>
                {pestanas.length > 1 ? (
                  <button
                    type="button"
                    aria-label="Cerrar pestana"
                    data-testid={`cerrar-pestana-${pestana.id}`}
                    style={{
                      ...style.cerrar,
                      ...(cerrarHoverId === pestana.id ? style.cerrarHover : {}),
                    }}
                    onMouseEnter={() => setCerrarHoverId(pestana.id)}
                    onMouseLeave={() => setCerrarHoverId((actual) => (actual === pestana.id ? null : actual))}
                    onClick={(event) => {
                      event.stopPropagation();
                      cerrarConConfirmacion(pestana);
                    }}
                  >
                    ×
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          aria-label="Nueva pestana"
          data-testid="nueva-pestana-btn"
          style={style.nueva}
          onClick={abrirPestanaNueva}
        >
          +
        </button>
      </div>
    </div>
  );
}

/**
 * Estilos de BarraPestanas — Codex v1.1 tabs tipograficas.
 *
 *   - Sin chip/background propio: la barra provee el papel.
 *   - Pestana inactiva: inkMid regular, sin borde.
 *   - Pestana activa: ink semibold + underline 2px crimson.
 *   - Dirty: italic (preserva la convención existente).
 */
const style = {
  barra: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    alignItems: "stretch",
    minWidth: 0,
    height: "100%",
    background: "transparent",
    fontFamily: tokens.typography.serif,
  },
  tabsSlot: {
    minWidth: 0,
    minHeight: 0,
    display: "flex",
    alignItems: "stretch",
    overflow: "hidden",
  },
  lista: {
    display: "flex",
    minWidth: 0,
    overflowX: "auto",
    flex: "1 1 auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  pestana: {
    minWidth: 120,
    maxWidth: 220,
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 10px 0 12px",
    border: 0,
    background: "transparent",
    color: tokens.colors.inkMid,
    cursor: "pointer",
    userSelect: "none",
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.normal,
    letterSpacing: 0,
    transition: "color 120ms ease, border-color 120ms ease",
  },
  pestanaActiva: {
    color: tokens.colors.ink,
    fontWeight: tokens.typography.weights.semibold,
    borderBottom: `2px solid ${tokens.colors.crimson}`,
  },
  pestanaDirty: {
    fontStyle: "italic",
  },
  etiqueta: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: "1 1 auto",
  },
  cerrar: {
    width: 18,
    height: 20,
    display: "grid",
    placeItems: "center",
    border: 0,
    background: "transparent",
    color: tokens.colors.inkFaint,
    cursor: "pointer",
    lineHeight: 1,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.sizes.base}px`,
    fontWeight: tokens.typography.weights.normal,
    letterSpacing: 0,
    padding: 0,
    transition: "color 120ms ease",
  },
  cerrarHover: {
    color: tokens.colors.inkMid,
  },
  nueva: {
    width: 36,
    height: "100%",
    display: "grid",
    placeItems: "center",
    border: 0,
    background: "transparent",
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.sizes.xl}px`,
    fontWeight: tokens.typography.weights.normal,
    letterSpacing: 0,
    lineHeight: 1,
    padding: 0,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
