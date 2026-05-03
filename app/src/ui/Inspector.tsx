import { useOpmStore } from "../store";
import { PersistenciaJson } from "./PersistenciaJson";

export function Inspector() {
  const modelo = useOpmStore((s) => s.modelo);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const renombrar = useOpmStore((s) => s.renombrarSeleccionada);
  const fijarEsencia = useOpmStore((s) => s.fijarEsenciaSeleccionada);
  const fijarAfiliacion = useOpmStore((s) => s.fijarAfiliacionSeleccionada);
  const eliminar = useOpmStore((s) => s.eliminarSeleccion);
  const entidad = seleccionId ? modelo.entidades[seleccionId] : undefined;
  const enlace = enlaceSeleccionId ? modelo.enlaces[enlaceSeleccionId] : undefined;

  if (!entidad) {
    if (enlace) {
      const origen = modelo.entidades[enlace.origenId];
      const destino = modelo.entidades[enlace.destinoId];
      return (
        <aside style={style.panel}>
          <div style={style.header}>
            <span style={style.kind}>Enlace {etiquetaTipoEnlace(enlace.tipo)}</span>
            <code style={style.id}>{enlace.id}</code>
          </div>

          <div style={style.summary}>
            <span>{origen?.nombre ?? enlace.origenId}</span>
            <span style={style.arrow}>{"->"}</span>
            <span>{destino?.nombre ?? enlace.destinoId}</span>
          </div>

          <button type="button" style={style.dangerButton} onClick={eliminar}>Eliminar enlace</button>
          <PersistenciaJson />
        </aside>
      );
    }

    return (
      <aside style={style.panel}>
        <div style={style.empty}>Sin selección</div>
        <PersistenciaJson />
      </aside>
    );
  }

  return (
    <aside style={style.panel}>
      <div style={style.header}>
        <span style={style.kind}>{entidad.tipo === "objeto" ? "Objeto" : "Proceso"}</span>
        <code style={style.id}>{entidad.id}</code>
      </div>

      <label style={style.field}>
        <span style={style.label}>Nombre</span>
        <input
          style={style.input}
          value={entidad.nombre}
          onInput={(event) => renombrar(event.currentTarget.value)}
        />
      </label>

      <div style={style.field}>
        <span style={style.label}>Esencia</span>
        <div style={style.segmented}>
          <Segment label="Informacional" active={entidad.esencia === "informacional"} onClick={() => fijarEsencia("informacional")} />
          <Segment label="Física" active={entidad.esencia === "fisica"} onClick={() => fijarEsencia("fisica")} />
        </div>
      </div>

      <div style={style.field}>
        <span style={style.label}>Afiliación</span>
        <div style={style.segmented}>
          <Segment label="Sistémica" active={entidad.afiliacion === "sistemica"} onClick={() => fijarAfiliacion("sistemica")} />
          <Segment label="Ambiental" active={entidad.afiliacion === "ambiental"} onClick={() => fijarAfiliacion("ambiental")} />
        </div>
      </div>

      <button type="button" style={style.dangerButton} onClick={eliminar}>Eliminar entidad</button>
      <PersistenciaJson />
    </aside>
  );
}

function Segment(props: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      style={props.active ? style.segmentActive : style.segment}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

function etiquetaTipoEnlace(tipo: string): string {
  return tipo.charAt(0).toUpperCase() + tipo.slice(1);
}

const style = {
  panel: {
    minWidth: 0,
    overflow: "auto",
    padding: "14px",
    background: "#ffffff",
    borderLeft: "1px solid #d9e0ea",
  },
  empty: {
    color: "#667085",
    fontSize: "13px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "16px",
  },
  kind: {
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
  },
  id: {
    color: "#667085",
    fontSize: "12px",
  },
  field: {
    display: "grid",
    gap: "6px",
    marginBottom: "14px",
  },
  label: {
    color: "#475467",
    fontSize: "12px",
    fontWeight: 700,
  },
  summary: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
    padding: "10px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 600,
  },
  arrow: {
    color: "#586D8C",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    height: "34px",
    padding: "0 10px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    color: "#1f2937",
    background: "#ffffff",
    outlineColor: "#586D8C",
  },
  segmented: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "6px",
  },
  segment: {
    height: "32px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#475467",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
  },
  segmentActive: {
    height: "32px",
    border: "1px solid #586D8C",
    borderRadius: "4px",
    background: "#e8eef5",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },
  dangerButton: {
    width: "100%",
    height: "32px",
    border: "1px solid #d92d20",
    borderRadius: "4px",
    background: "#fff5f5",
    color: "#b42318",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
