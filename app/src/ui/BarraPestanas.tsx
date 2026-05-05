import { useState } from "preact/hooks";
import { useOpmStore } from "../store";
import type { Pestana } from "../modelo/tipos";

const MIME_PESTANA = "text/pestana-id";

export function BarraPestanas() {
  const pestanas = useOpmStore((s) => s.pestanasAbiertas);
  const activa = useOpmStore((s) => s.pestanaActivaId);
  const abrirPestanaNueva = useOpmStore((s) => s.abrirPestanaNueva);
  const cambiarPestanaActiva = useOpmStore((s) => s.cambiarPestanaActiva);
  const cerrarPestana = useOpmStore((s) => s.cerrarPestana);
  const reordenarPestanas = useOpmStore((s) => s.reordenarPestanas);
  const [arrastrandoId, setArrastrandoId] = useState<string | null>(null);

  const cerrarConConfirmacion = (pestana: Pestana) => {
    if (pestana.dirty && typeof globalThis.confirm === "function") {
      const confirmado = globalThis.confirm("Hay cambios sin guardar. Cerrar pestana?");
      if (!confirmado) return;
      cerrarPestana(pestana.id, { forzar: true });
      return;
    }
    cerrarPestana(pestana.id);
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
    <div role="tablist" aria-label="Modelos abiertos" data-testid="barra-pestanas" style={style.barra}>
      <div style={style.lista}>
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
              onClick={() => cambiarPestanaActiva(pestana.id)}
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
  );
}

const style = {
  barra: {
    display: "flex",
    alignItems: "stretch",
    minWidth: 0,
    borderBottom: "1px solid #d9e0ea",
    background: "#eef3f8",
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
    height: 36,
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "0 8px 0 10px",
    borderRight: "1px solid #d9e0ea",
    borderTop: "2px solid transparent",
    background: "#f8fafc",
    color: "#475467",
    cursor: "pointer",
    userSelect: "none",
    fontSize: "12px",
    fontWeight: 700,
  },
  pestanaActiva: {
    background: "#ffffff",
    color: "#1f2937",
    borderTop: "2px solid #586D8C",
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
    color: "#667085",
    cursor: "pointer",
    lineHeight: 1,
    fontSize: "13px",
    fontWeight: 700,
    padding: 0,
  },
  nueva: {
    width: 38,
    height: 36,
    border: 0,
    borderLeft: "1px solid #d9e0ea",
    background: "#ffffff",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: 1,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
