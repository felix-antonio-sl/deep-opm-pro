// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import type { Id, ImagenEntidad } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";

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
  preview: { display: "grid", gridTemplateColumns: "54px minmax(0, 1fr)", alignItems: "center", gap: "8px", padding: "8px", border: `1px solid ${tokens.colors.bordeIntermedio}`, borderRadius: tokens.radii.sm },
  thumb: { width: "54px", height: "40px", objectFit: "cover", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoDeshabilitado },
  meta: { display: "grid", gap: "3px", minWidth: 0 },
  modo: { color: tokens.colors.textoPrimario, fontSize: "12px", fontWeight: 800 },
  url: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: tokens.colors.chromeNeutral, fontSize: "11px", fontWeight: 700 },
  actions: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" },
} satisfies Record<string, preact.JSX.CSSProperties>;
