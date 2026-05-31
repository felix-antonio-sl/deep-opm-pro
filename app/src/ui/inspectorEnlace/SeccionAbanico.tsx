// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { puertoExactoCompartidoDeAbanico } from "../../modelo/abanicos";
import { anclaEnlaceMasCercana, OPCIONES_ANCLA_RELOJ_ENLACE } from "../../modelo/anclajesEnlace";
import { estadosDeEntidad } from "../../modelo/operaciones";
import type { Abanico, Enlace, Id, Modelo, OperadorAbanico } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";

interface Props {
  abanico: Abanico | undefined;
  modelo: Modelo;
  onAlternarOperador: (operador: OperadorAbanico) => void;
  onQuitarRama: () => void;
  onDisolver: () => void;
  onResolver: () => void;
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
  const decision = props.abanico.operador === "XOR" ? describirDecision(props.modelo, props.abanico) : null;
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
      {decision ? (
        <div data-testid="abanico-decision" style={puertoPanelStyle}>
          <span style={puertoLabelStyle}>Decisión</span>
          <span style={puertoValorStyle}>{decision.label}</span>
          <span style={decisionTraceStyle}>{decision.detail}</span>
          <button type="button" style={style.secondaryButton} disabled={!decision.resoluble} onClick={props.onResolver}>
            Resolver ahora
          </button>
        </div>
      ) : null}
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

function describirDecision(modelo: Modelo, abanico: Abanico): { label: string; detail: string; resoluble: boolean } {
  const enlaces = abanico.enlaceIds.map((id) => modelo.enlaces[id]).filter((enlace): enlace is Enlace => !!enlace);
  if (abanico.decision) {
    if (abanico.decision.modo === "estado-fijo") return { label: "Estado fijo", detail: modelo.estados[abanico.decision.estadoId]?.nombre ?? abanico.decision.estadoId, resoluble: true };
    if (abanico.decision.modo === "uniforme") return { label: "Uniforme", detail: "Distribuye las ramas en partes iguales.", resoluble: true };
    if (abanico.decision.modo === "probabilidades") return { label: "Probabilidades explícitas", detail: "Usa los pesos definidos en la política.", resoluble: true };
    return { label: "Función registrada", detail: abanico.decision.funcionId, resoluble: false };
  }
  if (enlaces.length > 0 && enlaces.every((enlace) => enlace.probabilidad !== undefined)) {
    return { label: "Probabilidades explícitas", detail: enlaces.map((enlace) => `${enlace.id}: ${enlace.probabilidad}`).join(" · "), resoluble: true };
  }
  const objetoId = objetoComunDestino(enlaces);
  if (objetoId && estadosDeEntidad(modelo, objetoId).length > 0) {
    return { label: "Uniforme", detail: `${modelo.entidades[objetoId]?.nombre ?? objetoId}: estados equiprobables`, resoluble: true };
  }
  return { label: "Sin política resoluble", detail: "Define probabilidades o ramas hacia estados para resolver.", resoluble: false };
}

function objetoComunDestino(enlaces: readonly Enlace[]): Id | null {
  const ids = new Set(enlaces.map((enlace) => enlace.destinoId.kind === "entidad" ? enlace.destinoId.id : null).filter((id): id is Id => !!id));
  return ids.size === 1 ? [...ids][0]! : null;
}

const sectionStyle = { display: "grid", gap: "8px", marginBottom: "14px", padding: "8px", background: tokens.colors.paper, border: `1px solid ${tokens.colors.ink15}`, borderRadius: tokens.radii.xs } satisfies preact.JSX.CSSProperties;
const titleStyle = { margin: "0 0 8px", color: tokens.colors.textoPrimario, fontSize: "13px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const helpStyle = { color: tokens.colors.textoTerciario, fontSize: "12px", fontWeight: 600 } satisfies preact.JSX.CSSProperties;
const puertoPanelStyle = { display: "grid", gap: "4px", padding: "8px", border: `1px solid ${tokens.colors.ink15}`, borderRadius: tokens.radii.xs, background: tokens.colors.paper } satisfies preact.JSX.CSSProperties;
const puertoLabelStyle = { color: tokens.colors.ink70, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em" } satisfies preact.JSX.CSSProperties;
const puertoValorStyle = { color: tokens.colors.textoPrimario, fontSize: "12px", fontWeight: 700, overflowWrap: "anywhere" } satisfies preact.JSX.CSSProperties;
const puertoCodeStyle = { color: tokens.colors.textoTerciario, fontSize: "11px", overflowWrap: "anywhere" } satisfies preact.JSX.CSSProperties;
const puertoIncompletoStyle = { color: tokens.colors.errorTexto, fontSize: "12px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const decisionTraceStyle = { color: tokens.colors.ink50, fontFamily: tokens.typography.fontFamilyMono, fontSize: "10px", overflowWrap: "anywhere" } satisfies preact.JSX.CSSProperties;
const buttonRowStyle = { display: "grid", gap: "8px", gridTemplateColumns: "1fr" } satisfies preact.JSX.CSSProperties;
