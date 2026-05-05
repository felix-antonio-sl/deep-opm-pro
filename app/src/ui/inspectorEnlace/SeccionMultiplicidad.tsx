import { etiquetaEnlaceNormalizada, validarEtiquetaEnlace } from "../../modelo/etiquetasEnlace";
import { validarMultiplicidad } from "../../modelo/operaciones";
import type { Enlace, Modificador } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";

interface Props {
  enlace: Enlace;
  multiplicidadOrigen: string;
  multiplicidadDestino: string;
  probabilidad: string;
  demora: string;
  onMultiplicidad: (lado: "origen" | "destino", value: string) => void;
  onModificador: (value: string) => void;
  onProbabilidad: (value: string) => void;
  onDemora: (value: string) => void;
}

interface EtiquetaProps {
  enlace: Enlace;
  etiqueta: string;
  onEtiqueta: (value: string) => void;
}

export function SeccionMultiplicidad(props: Props) {
  const errorOrigen = props.multiplicidadOrigen !== "" && !validarMultiplicidad(props.multiplicidadOrigen);
  const errorDestino = props.multiplicidadDestino !== "" && !validarMultiplicidad(props.multiplicidadDestino);
  const errorProbabilidad = props.probabilidad !== "" && !probabilidadValida(props.probabilidad);
  return (
    <>
      <section style={sectionStyle}>
        <h3 style={titleStyle}>Multiplicidad</h3>
        <InputMult label="Origen" value={props.multiplicidadOrigen} error={errorOrigen} onInput={(value) => props.onMultiplicidad("origen", value)} />
        <InputMult label="Destino" value={props.multiplicidadDestino} error={errorDestino} onInput={(value) => props.onMultiplicidad("destino", value)} />
      </section>
      {enlaceProcedural(props.enlace.tipo) ? (
        <section style={cardStyle}>
          <h3 style={titleStyle}>Modificador</h3>
          <label style={style.field}>
            <span style={style.label}>Tipo</span>
            <select data-testid="modificador-enlace-select" style={style.input} value={props.enlace.modificador ?? ""} onChange={(event) => props.onModificador(event.currentTarget.value as Modificador | "")}>
              <option value="">Ninguno</option>
              <option value="condicion">Condición</option>
              <option value="evento">Evento</option>
              {props.enlace.tipo !== "invocacion" ? <option value="no">NO</option> : null}
            </select>
          </label>
          {props.enlace.modificador === "evento" ? (
            <label style={style.field}>
              <span style={style.label}>Probabilidad</span>
              <input data-testid="probabilidad-evento-input" aria-invalid={errorProbabilidad} placeholder="0.7" style={errorProbabilidad ? inputErrorStyle : style.input} value={props.probabilidad} onInput={(event) => props.onProbabilidad(event.currentTarget.value)} />
              {errorProbabilidad ? <span role="alert" style={errorStyle}>Usa un número entre 0 y 1</span> : null}
            </label>
          ) : null}
          {props.enlace.tipo === "invocacion" ? (
            <label style={style.field}>
              <span style={style.label}>Demora</span>
              <input data-testid="demora-invocacion-input" placeholder="1s, 5 min" style={style.input} value={props.demora} onInput={(event) => props.onDemora(event.currentTarget.value)} />
            </label>
          ) : null}
        </section>
      ) : null}
    </>
  );
}

export function SeccionEtiquetaEnlace(props: EtiquetaProps) {
  const errorEtiqueta = validarEtiquetaEnlace(props.enlace, etiquetaEnlaceNormalizada(props.etiqueta));
  return (
    <section style={cardStyle}>
      <h3 style={titleStyle}>Etiqueta</h3>
      <label style={style.field}>
        <span style={style.label}>Etiqueta</span>
        <input data-testid="enlace-etiqueta-input" aria-invalid={!errorEtiqueta.ok} placeholder="componente crítico" style={!errorEtiqueta.ok ? inputErrorStyle : style.input} value={props.etiqueta} onInput={(event) => props.onEtiqueta(event.currentTarget.value)} />
        {!errorEtiqueta.ok ? <span role="alert" style={errorStyle}>{errorEtiqueta.error}</span> : null}
      </label>
    </section>
  );
}

function InputMult(props: { label: string; value: string; error: boolean; onInput: (value: string) => void }) {
  return (
    <label style={style.field}>
      <span style={style.label}>{props.label}</span>
      <input aria-invalid={props.error} placeholder="1, 2..N, *" style={props.error ? inputErrorStyle : style.input} value={props.value} onInput={(event) => props.onInput(event.currentTarget.value)} />
      {props.error ? <span role="alert" style={errorStyle}>Sintaxis inválida: 1, *, 2..N o 1..5</span> : null}
    </label>
  );
}

export function enlaceProcedural(tipo: Enlace["tipo"]): boolean {
  return tipo === "agente" || tipo === "instrumento" || tipo === "consumo" || tipo === "resultado" || tipo === "efecto" || tipo === "invocacion";
}

export function probabilidadValida(value: string): boolean {
  if (!/^(?:0(?:\.\d+)?|1(?:\.0+)?)$/.test(value)) return false;
  const numero = Number(value);
  return Number.isFinite(numero) && numero >= 0 && numero <= 1;
}

const sectionStyle = { display: "grid", gap: "2px", marginBottom: "14px" } satisfies preact.JSX.CSSProperties;
const cardStyle = { display: "grid", gap: "8px", marginBottom: "14px", padding: "8px", background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "6px" } satisfies preact.JSX.CSSProperties;
const titleStyle = { margin: "0 0 8px", color: "#1f2937", fontSize: "13px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const inputErrorStyle = { ...style.input, borderColor: "#d92d20", outlineColor: "#d92d20" } satisfies preact.JSX.CSSProperties;
const errorStyle = { color: "#b42318", fontSize: "12px", fontWeight: 600 } satisfies preact.JSX.CSSProperties;
