// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import type { Enlace, Id, Modelo } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";

interface Props {
  enlace: Enlace;
  modelo: Modelo;
  seleccionados: Id[];
  enlaceEstiloPortapapeles: unknown;
  onAplicarEstilo: (enlaceId: Id, patch: Partial<NonNullable<Enlace["estilo"]>>) => void;
  onReset: (enlaceId: Id) => void;
  onCopiar: (enlaceId: Id) => void;
  onPegar: (enlaceId: Id) => void;
  onAplicarSeleccion: (patch: NonNullable<Enlace["estilo"]>) => void;
}

export function SeccionEstiloEnlace(props: Props) {
  return (
    <section style={seccionEstiloStyle}>
      <div style={seccionEstiloHeaderStyle}>
        <h3 style={titleStyle}>Estilo del enlace</h3>
        <div style={styleRowButtonsStyle}>
          <button type="button" style={style.secondaryButton} onClick={() => props.onCopiar(props.enlace.id)}>Copiar</button>
          <button type="button" style={style.secondaryButton} disabled={!props.enlaceEstiloPortapapeles} onClick={() => props.onPegar(props.enlace.id)}>Pegar</button>
          <button type="button" style={style.secondaryButton} onClick={() => props.onReset(props.enlace.id)} disabled={!props.enlace.estilo}>Reset</button>
        </div>
      </div>
      <ColorPickerEnlace label="Color" value={props.enlace.estilo?.color} onChange={(color) => props.onAplicarEstilo(props.enlace.id, { color })} />
      <SliderGrosor label="Grosor" value={props.enlace.estilo?.strokeWidth ?? 2} min={1} max={6} onChange={(strokeWidth) => props.onAplicarEstilo(props.enlace.id, { strokeWidth })} />
      <SelectorPatron label="Patrón" value={props.enlace.estilo?.dashArray ?? "continuo"} onChange={(value) => props.onAplicarEstilo(props.enlace.id, { dashArray: value === "continuo" ? "" : value })} />
      {props.seleccionados.length >= 2 && props.seleccionados.every((id) => props.modelo.enlaces[id]) ? (
        <button type="button" style={style.secondaryButton} onClick={() => props.enlace.estilo ? props.onAplicarSeleccion(props.enlace.estilo) : undefined} disabled={!props.enlace.estilo}>
          Aplicar a selección
        </button>
      ) : null}
    </section>
  );
}

function ColorPickerEnlace(props: { label: string; value: string | undefined; onChange: (color: string) => void }) {
  const swatches = [tokens.colors.chromeNeutral, tokens.colors.canvas.objeto, tokens.colors.canvas.proceso, tokens.colors.canvas.texto, tokens.colors.errorBase, tokens.colors.naranja, tokens.colors.violeta, tokens.colors.negro];
  return (
    <div style={colorPickerRowStyle}>
      <span style={sliderLabelStyle}>{props.label}</span>
      <div style={swatchesRowStyle}>
        {swatches.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Color ${color}`}
            title={color}
            style={{ ...swatchStyle, background: color, borderColor: props.value?.toLowerCase() === color ? tokens.colors.textoPrimario : tokens.colors.bordeControl, boxShadow: props.value?.toLowerCase() === color ? `0 0 0 2px ${tokens.colors.fondoChrome}, 0 0 0 4px ${tokens.colors.chromeNeutral}` : "none" }}
            onClick={() => props.onChange(color)}
          />
        ))}
      </div>
    </div>
  );
}

function SliderGrosor(props: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div style={sliderRowStyle}>
      <span style={sliderLabelStyle}>{props.label} ({props.value}px)</span>
      <input type="range" min={props.min} max={props.max} value={props.value} style={sliderInputStyle} onInput={(event) => props.onChange(Number(event.currentTarget.value))} />
    </div>
  );
}

function SelectorPatron(props: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={sliderRowStyle}>
      <span style={sliderLabelStyle}>{props.label}</span>
      <select style={style.input} value={props.value} onChange={(event) => props.onChange(event.currentTarget.value)}>
        <option value="continuo">Continuo</option>
        <option value="4 4">Discontinuo</option>
        <option value="2 4">Punteado</option>
        <option value="6 4 2 4">Mixto</option>
      </select>
    </div>
  );
}

const titleStyle = { margin: "0 0 8px", color: tokens.colors.textoPrimario, fontSize: "13px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const seccionEstiloStyle = { display: "grid", gap: "8px", marginBottom: "14px", padding: "8px", background: tokens.colors.fondoChrome, border: `1px solid ${tokens.colors.bordeTabla}`, borderRadius: tokens.radii.md } satisfies preact.JSX.CSSProperties;
const seccionEstiloHeaderStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" } satisfies preact.JSX.CSSProperties;
const styleRowButtonsStyle = { display: "flex", gap: "4px" } satisfies preact.JSX.CSSProperties;
const colorPickerRowStyle = { display: "grid", gap: "4px" } satisfies preact.JSX.CSSProperties;
const swatchesRowStyle = { display: "flex", gap: "4px", flexWrap: "wrap" } satisfies preact.JSX.CSSProperties;
const swatchStyle: preact.JSX.CSSProperties = { width: "24px", height: "24px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, cursor: "pointer" };
const sliderRowStyle = { display: "grid", gap: "4px" } satisfies preact.JSX.CSSProperties;
const sliderLabelStyle = { color: tokens.colors.textoTerciario, fontSize: "12px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const sliderInputStyle: preact.JSX.CSSProperties = { width: "100%", height: "24px", accentColor: tokens.colors.chromeNeutral };
