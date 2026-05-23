// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { enlaceAdmiteRuta } from "../../modelo/rutas";
import type { Enlace, Modelo } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";

interface Props {
  modelo: Modelo;
  enlace: Enlace;
  rutaEtiqueta: string;
  onRutaEtiqueta: (value: string) => void;
}

export function SeccionRuta(props: Props) {
  if (!enlaceAdmiteRuta(props.modelo, props.enlace.id)) return null;
  return (
    <section style={sectionStyle}>
      <h3 style={titleStyle}>Ruta</h3>
      <label style={style.field}>
        <span class="opm-label-uppercase" style={style.label}>Etiqueta</span>
        <input data-testid="ruta-etiqueta-input" placeholder="exitoso" style={style.input} value={props.rutaEtiqueta} onInput={(event) => props.onRutaEtiqueta(event.currentTarget.value)} />
      </label>
    </section>
  );
}

const sectionStyle = { display: "grid", gap: "8px", marginBottom: "14px" } satisfies preact.JSX.CSSProperties;
const titleStyle = { margin: "0 0 8px", color: tokens.colors.textoPrimario, fontSize: "13px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
