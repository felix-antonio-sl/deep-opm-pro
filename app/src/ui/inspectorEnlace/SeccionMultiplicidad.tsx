// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { etiquetaEnlaceNormalizada, validarEtiquetaEnlace } from "../../modelo/etiquetasEnlace";
import { validarMultiplicidad } from "../../modelo/operaciones";
import type { Enlace, Modificador, SubtipoModificador } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";

interface Props {
  enlace: Enlace;
  multiplicidadOrigen: string;
  multiplicidadDestino: string;
  probabilidad: string;
  demora: string;
  onMultiplicidad: (lado: "origen" | "destino", value: string) => void;
  onModificador: (value: string) => void;
  onSubtipoModificador: (value: SubtipoModificador) => void;
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
  const modificadorActual = props.enlace.modificador;
  const subtipoActual = modificadorActual ? props.enlace.subtipoModificador ?? subtipoDefault(modificadorActual) : undefined;
  return (
    <>
      <section style={sectionStyle}>
        <h3 style={titleStyle}>Multiplicidad</h3>
        <span style={hintStyle} data-testid="tabla-filtrada-direccion-tipo">Tabla filtrada por dirección y tipo vigente</span>
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
          {modificadorActual ? (
            <div style={style.field}>
              <span style={style.label}>Subtipo</span>
              <div role="group" aria-label="Subtipo modificador" style={subtipoGroupStyle}>
                {subtiposPermitidos(modificadorActual).map((subtipo) => (
                  <button
                    key={subtipo}
                    type="button"
                    data-testid={`subtipo-modificador-${subtipo}`}
                    aria-pressed={subtipoActual === subtipo}
                    style={subtipoActual === subtipo ? subtipoActivoStyle : subtipoButtonStyle}
                    onClick={() => props.onSubtipoModificador(subtipo)}
                  >
                    {subtipo === "no" ? "¬" : subtipo}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
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
  return tipo === "agente" ||
    tipo === "instrumento" ||
    tipo === "consumo" ||
    tipo === "resultado" ||
    tipo === "efecto" ||
    tipo === "invocacion" ||
    tipo === "excepcionSobretiempo" ||
    tipo === "excepcionSubtiempo" ||
    tipo === "excepcionSubSobretiempo";
}

export function probabilidadValida(value: string): boolean {
  if (!/^(?:0(?:\.\d+)?|1(?:\.0+)?)$/.test(value)) return false;
  const numero = Number(value);
  return Number.isFinite(numero) && numero >= 0 && numero <= 1;
}

function subtiposPermitidos(modificador: Modificador): SubtipoModificador[] {
  if (modificador === "condicion") return ["C"];
  if (modificador === "evento") return ["E"];
  return ["no"];
}

function subtipoDefault(modificador: Modificador): SubtipoModificador {
  if (modificador === "condicion") return "C";
  if (modificador === "evento") return "E";
  return "no";
}

const sectionStyle = { display: "grid", gap: "2px", marginBottom: "14px" } satisfies preact.JSX.CSSProperties;
const cardStyle = { display: "grid", gap: "8px", marginBottom: "14px", padding: "8px", background: tokens.colors.fondoChrome, border: `1px solid ${tokens.colors.bordeTabla}`, borderRadius: tokens.radii.md } satisfies preact.JSX.CSSProperties;
const titleStyle = { margin: "0 0 8px", color: tokens.colors.textoPrimario, fontSize: "13px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const hintStyle = { color: tokens.colors.textoTerciario, fontSize: "11px", fontWeight: 600 } satisfies preact.JSX.CSSProperties;
const subtipoGroupStyle = { display: "flex", gap: "6px" } satisfies preact.JSX.CSSProperties;
const subtipoButtonStyle = { minWidth: "32px", height: "28px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.md, background: tokens.colors.fondoChrome, color: tokens.colors.textoControl, fontFamily: tokens.typography.familyCanvas, fontSize: "13px", fontWeight: 700, cursor: "pointer" } satisfies preact.JSX.CSSProperties;
const subtipoActivoStyle = { ...subtipoButtonStyle, borderColor: tokens.colors.chromeNeutral, background: tokens.colors.infoMuySuave, color: tokens.colors.textoPrimario } satisfies preact.JSX.CSSProperties;
const inputErrorStyle = { ...style.input, borderColor: tokens.colors.errorBase, outlineColor: tokens.colors.errorBase } satisfies preact.JSX.CSSProperties;
const errorStyle = { color: tokens.colors.errorTexto, fontSize: "12px", fontWeight: 600 } satisfies preact.JSX.CSSProperties;
