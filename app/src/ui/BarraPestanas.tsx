// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useState } from "preact/hooks";
import { useBarraPestanasViewModel } from "../app/viewmodels/barraPestanasViewModel";
import type { Pestana } from "../modelo/tipos";
import { Breadcrumb } from "./Breadcrumb";
import { useConfirmarCierreDirty } from "./ConfirmacionContext";
import { tokens } from "./tokens";

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
      <div style={style.breadcrumbSlot}>
        <Breadcrumb />
      </div>
      <div style={style.tabsSlot}>
        <div role="tablist" aria-label="Modelos abiertos" style={style.lista}>
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
                  {pestana.etiqueta}{pestana.dirty ? " *" : ""}
                </span>
                {pestanas.length > 1 ? (
                  <button
                    type="button"
                    aria-label="Cerrar pestana"
                    data-testid={`cerrar-pestana-${pestana.id}`}
                    style={style.cerrar}
                    onClick={(event) => {
                      event.stopPropagation();
                      cerrarConConfirmacion(pestana);
                    }}
                  >
                    x
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

const style = {
  barra: {
    display: "grid",
    gridTemplateColumns: "minmax(180px, 42%) minmax(0, 1fr)",
    alignItems: "stretch",
    minWidth: 0,
    height: 32,
    borderBottom: `1px solid ${tokens.colors.bordeIntermedio}`,
    background: tokens.colors.fondoIcono,
  },
  breadcrumbSlot: {
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
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
  },
  pestana: {
    minWidth: 120,
    maxWidth: 220,
    height: 32,
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "0 8px 0 10px",
    borderRight: `1px solid ${tokens.colors.bordeIntermedio}`,
    borderTop: "2px solid transparent",
    background: tokens.colors.fondoElevado,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    userSelect: "none",
    fontSize: "12px",
    fontWeight: 700,
  },
  pestanaActiva: {
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoPrimario,
    // ronda 23 chrome: acento UI en lugar de chrome neutro — la pestaña
    // activa gana presencia sin sumar peso visual al resto de la barra.
    borderTop: `2px solid ${tokens.colors.acentoUi}`,
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
    width: 20,
    height: 20,
    border: "1px solid transparent",
    borderRadius: 4,
    background: "transparent",
    color: tokens.colors.textoTerciario,
    cursor: "pointer",
    lineHeight: 1,
    fontSize: "13px",
    fontWeight: 700,
    padding: 0,
  },
  nueva: {
    width: 36,
    height: 32,
    border: 0,
    borderLeft: `1px solid ${tokens.colors.bordeIntermedio}`,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: 1,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
