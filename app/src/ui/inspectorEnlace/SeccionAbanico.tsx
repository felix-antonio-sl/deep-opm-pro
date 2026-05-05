import type { Abanico, OperadorAbanico } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";

interface Props {
  abanico: Abanico | undefined;
  onAlternarOperador: (operador: OperadorAbanico) => void;
  onQuitarRama: () => void;
  onDisolver: () => void;
}

export function SeccionAbanico(props: Props) {
  if (!props.abanico) return null;
  return (
    <section style={sectionStyle}>
      <h3 style={titleStyle}>Abanico {props.abanico.operador}</h3>
      <div style={helpStyle}>
        {props.abanico.enlaceIds.length} ramas comparten puerto.{" "}
        {props.abanico.operador === "XOR" ? "Exactamente una se cumple." : "Al menos una se cumple."}
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

const sectionStyle = { display: "grid", gap: "8px", marginBottom: "14px", padding: "8px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px" } satisfies preact.JSX.CSSProperties;
const titleStyle = { margin: "0 0 8px", color: "#1f2937", fontSize: "13px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const helpStyle = { color: "#667085", fontSize: "12px", fontWeight: 600 } satisfies preact.JSX.CSSProperties;
const buttonRowStyle = { display: "grid", gap: "8px", gridTemplateColumns: "1fr" } satisfies preact.JSX.CSSProperties;
