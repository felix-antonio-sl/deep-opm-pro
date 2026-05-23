import { enlaceAdmiteTasa, enlaceAdmiteTiempoMaximo, enlaceAdmiteTiempoMinimo } from "../../modelo/constantes";
import { UNIDADES_TIEMPO } from "../../modelo/objetoDuracion";
import type { Enlace, UnidadTiempo } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";

interface Props {
  enlace: Enlace;
  backwardTag: string;
  requisitos: string;
  mostrarRequisitos: boolean;
  tasa: string;
  unidadesTasa: string;
  tiempoMinimo: string;
  unidadTiempoMinimo: UnidadTiempo | "";
  tiempoMaximo: string;
  unidadTiempoMaximo: UnidadTiempo | "";
  onBackwardTag: (value: string) => void;
  onRequisitos: (value: string, mostrar: boolean) => void;
  onTasa: (tasa: string, unidadesTasa: string) => void;
  onTiempoExcepcion: (valores: {
    tiempoMinimo: string;
    unidadTiempoMinimo: UnidadTiempo | "";
    tiempoMaximo: string;
    unidadTiempoMaximo: UnidadTiempo | "";
  }) => void;
}

export function SeccionMetadatosOpcloud(props: Props) {
  return (
    <section style={cardStyle}>
      <h3 style={titleStyle}>OPCloud</h3>
      {props.enlace.tipo === "etiquetadoBidireccional" ? (
        <label style={style.field}>
          <span class="opm-label-uppercase" style={style.label}>Etiqueta inversa</span>
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
            <span class="opm-label-uppercase" style={style.label}>Tasa</span>
            <input
              data-testid="tasa-enlace-input"
              placeholder="10"
              style={style.input}
              value={props.tasa}
              onInput={(event) => props.onTasa(event.currentTarget.value, props.unidadesTasa)}
            />
          </label>
          <label style={style.field}>
            <span class="opm-label-uppercase" style={style.label}>Unidades</span>
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
      {enlaceAdmiteTiempoMinimo(props.enlace.tipo) || enlaceAdmiteTiempoMaximo(props.enlace.tipo) ? (
        <div style={grid2Style}>
          {enlaceAdmiteTiempoMinimo(props.enlace.tipo) ? (
            <CampoTiempo
              label="Tiempo mínimo"
              value={props.tiempoMinimo}
              unidad={props.unidadTiempoMinimo}
              testid="tiempo-minimo-excepcion-input"
              onValor={(value) => props.onTiempoExcepcion({ ...valoresTiempo(props), tiempoMinimo: value })}
              onUnidad={(value) => props.onTiempoExcepcion({ ...valoresTiempo(props), unidadTiempoMinimo: value })}
            />
          ) : null}
          {enlaceAdmiteTiempoMaximo(props.enlace.tipo) ? (
            <CampoTiempo
              label="Tiempo máximo"
              value={props.tiempoMaximo}
              unidad={props.unidadTiempoMaximo}
              testid="tiempo-maximo-excepcion-input"
              onValor={(value) => props.onTiempoExcepcion({ ...valoresTiempo(props), tiempoMaximo: value })}
              onUnidad={(value) => props.onTiempoExcepcion({ ...valoresTiempo(props), unidadTiempoMaximo: value })}
            />
          ) : null}
        </div>
      ) : null}
      <label style={style.field}>
        <span class="opm-label-uppercase" style={style.label}>Requisitos satisfechos</span>
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

function CampoTiempo(props: {
  label: string;
  value: string;
  unidad: UnidadTiempo | "";
  testid: string;
  onValor: (value: string) => void;
  onUnidad: (value: UnidadTiempo | "") => void;
}) {
  return (
    <div style={timeFieldStyle}>
      <label style={style.field}>
        <span class="opm-label-uppercase" style={style.label}>{props.label}</span>
        <input
          data-testid={props.testid}
          placeholder="10"
          style={style.input}
          value={props.value}
          onInput={(event) => props.onValor(event.currentTarget.value)}
        />
      </label>
      <select
        aria-label={`${props.label} unidad`}
        style={style.input}
        value={props.unidad}
        onChange={(event) => props.onUnidad(event.currentTarget.value as UnidadTiempo | "")}
      >
        <option value="">Unidad</option>
        {UNIDADES_TIEMPO.map((unidad) => <option key={unidad} value={unidad}>{unidad}</option>)}
      </select>
    </div>
  );
}

function valoresTiempo(props: Props) {
  return {
    tiempoMinimo: props.tiempoMinimo,
    unidadTiempoMinimo: props.unidadTiempoMinimo,
    tiempoMaximo: props.tiempoMaximo,
    unidadTiempoMaximo: props.unidadTiempoMaximo,
  };
}

const cardStyle = { display: "grid", gap: "8px", marginBottom: "14px", padding: "8px", background: tokens.colors.fondoChrome, border: `1px solid ${tokens.colors.bordeTabla}`, borderRadius: tokens.radii.md } satisfies preact.JSX.CSSProperties;
const titleStyle = { margin: "0 0 8px", color: tokens.colors.textoPrimario, fontSize: "13px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const grid2Style = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "8px" } satisfies preact.JSX.CSSProperties;
const timeFieldStyle = { display: "grid", gridTemplateColumns: "1fr 78px", gap: "6px", alignItems: "end" } satisfies preact.JSX.CSSProperties;
const checkRowStyle = { display: "flex", alignItems: "center", gap: "8px", color: tokens.colors.textoSecundario, fontSize: "12px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
