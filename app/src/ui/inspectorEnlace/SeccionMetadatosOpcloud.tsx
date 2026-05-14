import { enlaceAdmiteTasa } from "../../modelo/constantes";
import type { Enlace } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";

interface Props {
  enlace: Enlace;
  backwardTag: string;
  requisitos: string;
  mostrarRequisitos: boolean;
  tasa: string;
  unidadesTasa: string;
  onBackwardTag: (value: string) => void;
  onRequisitos: (value: string, mostrar: boolean) => void;
  onTasa: (tasa: string, unidadesTasa: string) => void;
}

export function SeccionMetadatosOpcloud(props: Props) {
  return (
    <section style={cardStyle}>
      <h3 style={titleStyle}>OPCloud</h3>
      {props.enlace.tipo === "etiquetadoBidireccional" ? (
        <label style={style.field}>
          <span style={style.label}>Etiqueta inversa</span>
          <input
            data-testid="backward-tag-input"
            placeholder="pertenece a"
            style={style.input}
            value={props.backwardTag}
            onInput={(event) => props.onBackwardTag(event.currentTarget.value)}
          />
        </label>
      ) : null}
      {enlaceAdmiteTasa(props.enlace.tipo) ? (
        <div style={grid2Style}>
          <label style={style.field}>
            <span style={style.label}>Tasa</span>
            <input
              data-testid="tasa-enlace-input"
              placeholder="10"
              style={style.input}
              value={props.tasa}
              onInput={(event) => props.onTasa(event.currentTarget.value, props.unidadesTasa)}
            />
          </label>
          <label style={style.field}>
            <span style={style.label}>Unidades</span>
            <input
              data-testid="unidades-tasa-enlace-input"
              placeholder="kg/min"
              style={style.input}
              value={props.unidadesTasa}
              onInput={(event) => props.onTasa(props.tasa, event.currentTarget.value)}
            />
          </label>
        </div>
      ) : null}
      <label style={style.field}>
        <span style={style.label}>Requisitos satisfechos</span>
        <input
          data-testid="requisitos-enlace-input"
          placeholder="REQ-1, REQ-2"
          style={style.input}
          value={props.requisitos}
          onInput={(event) => props.onRequisitos(event.currentTarget.value, props.mostrarRequisitos)}
        />
      </label>
      <label style={checkRowStyle}>
        <input
          type="checkbox"
          data-testid="mostrar-requisitos-enlace"
          checked={props.mostrarRequisitos}
          disabled={props.requisitos.trim().length === 0}
          onChange={(event) => props.onRequisitos(props.requisitos, event.currentTarget.checked)}
        />
        <span>Mostrar Satisfied</span>
      </label>
    </section>
  );
}

const cardStyle = { display: "grid", gap: "8px", marginBottom: "14px", padding: "8px", background: tokens.colors.fondoChrome, border: `1px solid ${tokens.colors.bordeTabla}`, borderRadius: tokens.radii.md } satisfies preact.JSX.CSSProperties;
const titleStyle = { margin: "0 0 8px", color: tokens.colors.textoPrimario, fontSize: "13px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const grid2Style = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" } satisfies preact.JSX.CSSProperties;
const checkRowStyle = { display: "flex", alignItems: "center", gap: "8px", color: tokens.colors.textoSecundario, fontSize: "12px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
