import type { Id, ImagenEntidad } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";

interface Props {
  entidadId: Id;
  imagen?: ImagenEntidad | undefined;
  onAbrirImagen: (entidadId: Id) => void;
  onQuitarImagen: (entidadId: Id) => void;
}

export function SeccionImagen(props: Props) {
  return (
    <div data-testid="inspector-seccion-imagen" style={styles.panel}>
      {props.imagen ? (
        <>
          <div style={styles.preview}>
            <img src={props.imagen.url} alt="" style={styles.thumb} />
            <div style={styles.meta}>
              <span style={styles.modo}>{etiquetaModo(props.imagen.modo)}</span>
              <span style={styles.url}>{props.imagen.url}</span>
            </div>
          </div>
          <div style={styles.actions}>
            <button type="button" style={style.secondaryButton} onClick={() => props.onAbrirImagen(props.entidadId)}>
              Editar imagen
            </button>
            <button type="button" style={style.dangerButton} onClick={() => props.onQuitarImagen(props.entidadId)}>
              Quitar imagen
            </button>
          </div>
        </>
      ) : (
        <button type="button" style={style.secondaryButton} onClick={() => props.onAbrirImagen(props.entidadId)}>
          Agregar imagen
        </button>
      )}
    </div>
  );
}

function etiquetaModo(modo: ImagenEntidad["modo"]): string {
  if (modo === "imagen") return "Imagen";
  if (modo === "texto") return "Texto";
  return "Imagen + texto";
}

const styles = {
  panel: { display: "grid", gap: "8px" },
  preview: { display: "grid", gridTemplateColumns: "54px minmax(0, 1fr)", alignItems: "center", gap: "8px", padding: "8px", border: "1px solid #d9e0ea", borderRadius: "4px" },
  thumb: { width: "54px", height: "40px", objectFit: "cover", border: "1px solid #c8d2df", borderRadius: "4px", background: "#f2f4f7" },
  meta: { display: "grid", gap: "3px", minWidth: 0 },
  modo: { color: "#1f2937", fontSize: "12px", fontWeight: 800 },
  url: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#586D8C", fontSize: "11px", fontWeight: 700 },
  actions: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" },
} satisfies Record<string, preact.JSX.CSSProperties>;
