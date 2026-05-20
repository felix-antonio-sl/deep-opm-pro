// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { puertoExactoCompartidoDeAbanico } from "../../modelo/abanicos";
import { anclaEnlaceMasCercana, OPCIONES_ANCLA_RELOJ_ENLACE } from "../../modelo/anclajesEnlace";
import type { Abanico, Modelo, OperadorAbanico } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";

interface Props {
  abanico: Abanico | undefined;
  modelo: Modelo;
  onAlternarOperador: (operador: OperadorAbanico) => void;
  onQuitarRama: () => void;
  onDisolver: () => void;
}

export function SeccionAbanico(props: Props) {
  if (!props.abanico) return null;
  const puerto = puertoExactoCompartidoDeAbanico(props.modelo, props.abanico);
  const entidadPuerto = puerto ? props.modelo.entidades[puerto.entidadId] : undefined;
  const aparienciaPuerto = puerto
    ? Object.values(props.modelo.opds[props.abanico.opdId]?.apariencias ?? {})
      .find((apariencia) => apariencia.entidadId === puerto.entidadId)
    : undefined;
  const puertoApariencia = puerto ? aparienciaPuerto?.ports?.[puerto.portId] : undefined;
  const ancla = puertoApariencia ? OPCIONES_ANCLA_RELOJ_ENLACE.find((opcion) => opcion.id === anclaEnlaceMasCercana(puertoApariencia)) : undefined;
  return (
    <section style={sectionStyle}>
      <h3 style={titleStyle}>Abanico {props.abanico.operador}</h3>
      <div style={helpStyle}>
        {props.abanico.enlaceIds.length} ramas comparten puerto.{" "}
        {props.abanico.operador === "XOR" ? "Exactamente una se cumple." : "Al menos una se cumple."}
      </div>
      <div data-testid="abanico-puerto-exacto" style={puertoPanelStyle}>
        <span style={puertoLabelStyle}>Puerto común</span>
        {puerto && entidadPuerto ? (
          <>
            <span style={puertoValorStyle}>
              {entidadPuerto.nombre} · {puerto.lado} · {ancla?.hora ?? "puerto exacto"}
            </span>
            <code style={puertoCodeStyle}>{puerto.portId}</code>
          </>
        ) : (
          <span style={puertoIncompletoStyle}>sin puerto exacto visible</span>
        )}
      </div>
      <div style={buttonRowStyle}>
        <button type="button" data-testid="abanico-toggle-O" style={style.secondaryButton} disabled={props.abanico.operador === "O"} onClick={() => props.onAlternarOperador("O" satisfies OperadorAbanico)}>O</button>
        <button type="button" data-testid="abanico-toggle-XOR" style={style.secondaryButton} disabled={props.abanico.operador === "XOR"} onClick={() => props.onAlternarOperador("XOR" satisfies OperadorAbanico)}>XOR</button>
      </div>
      <div style={buttonRowStyle}>
        <button type="button" style={style.secondaryButton} onClick={props.onQuitarRama}>Quitar rama</button>
        <button type="button" style={style.secondaryButton} onClick={props.onDisolver}>Disolver abanico</button>
      </div>
    </section>
  );
}

const sectionStyle = { display: "grid", gap: "8px", marginBottom: "14px", padding: "8px", background: tokens.colors.fondoTabla, border: `1px solid ${tokens.colors.bordeTabla}`, borderRadius: tokens.radii.md } satisfies preact.JSX.CSSProperties;
const titleStyle = { margin: "0 0 8px", color: tokens.colors.textoPrimario, fontSize: "13px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const helpStyle = { color: tokens.colors.textoTerciario, fontSize: "12px", fontWeight: 600 } satisfies preact.JSX.CSSProperties;
const puertoPanelStyle = { display: "grid", gap: "4px", padding: "8px", border: `1px solid ${tokens.colors.infoBordeSuave}`, borderRadius: tokens.radii.sm, background: tokens.colors.infoFondoAlterno } satisfies preact.JSX.CSSProperties;
const puertoLabelStyle = { color: tokens.colors.infoTextoOscuro, fontSize: "11px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const puertoValorStyle = { color: tokens.colors.textoPrimario, fontSize: "12px", fontWeight: 700, overflowWrap: "anywhere" } satisfies preact.JSX.CSSProperties;
const puertoCodeStyle = { color: tokens.colors.textoTerciario, fontSize: "11px", overflowWrap: "anywhere" } satisfies preact.JSX.CSSProperties;
const puertoIncompletoStyle = { color: tokens.colors.errorTexto, fontSize: "12px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const buttonRowStyle = { display: "grid", gap: "8px", gridTemplateColumns: "1fr" } satisfies preact.JSX.CSSProperties;
