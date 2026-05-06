import type { Enlace, EnlaceEstilo, Id } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";

interface Props {
  enlace: Enlace;
  hayPortapapeles: boolean;
  onAbrirDialogo: () => void;
  onCopiar: (enlaceId: Id) => void;
  onPegar: (enlaceId: Id) => void;
  onReset: (enlaceId: Id) => void;
  onAplicar: (enlaceId: Id, estilo: Partial<EnlaceEstilo>) => void;
}

export function SeccionEstilo(props: Props) {
  return (
    <section style={sectionStyle}>
      <h3 style={titleStyle}>Propiedades visuales</h3>
      <div style={rowStyle}>
        <button type="button" style={style.secondaryButton} onClick={props.onAbrirDialogo} data-testid="abrir-dialogo-estilo-enlace">Estilo</button>
        <button type="button" style={style.secondaryButton} onClick={() => props.onCopiar(props.enlace.id)}>Copiar estilo</button>
        <button type="button" style={style.secondaryButton} disabled={!props.hayPortapapeles} onClick={() => props.onPegar(props.enlace.id)}>Pegar estilo</button>
        <button type="button" style={style.secondaryButton} disabled={!props.enlace.estilo} onClick={() => props.onReset(props.enlace.id)}>Reset</button>
      </div>
      <div style={rowStyle}>
        <button type="button" style={style.secondaryButton} onClick={() => props.onAplicar(props.enlace.id, { dashArray: "" })}>Continua</button>
        <button type="button" style={style.secondaryButton} onClick={() => props.onAplicar(props.enlace.id, { dashArray: "4 4" })}>Discontinua</button>
        <button type="button" style={style.secondaryButton} onClick={() => props.onAplicar(props.enlace.id, { dashArray: "2 4" })}>Punteada</button>
      </div>
    </section>
  );
}

const sectionStyle = { display: "grid", gap: "8px", marginBottom: "14px", padding: "8px", background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "6px" } satisfies preact.JSX.CSSProperties;
const titleStyle = { margin: "0 0 4px", color: "#1f2937", fontSize: "13px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const rowStyle = { display: "flex", gap: "6px", flexWrap: "wrap" } satisfies preact.JSX.CSSProperties;
