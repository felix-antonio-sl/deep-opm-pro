// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { anclasPendientes } from "../../modelo/anclasNormativas";
import type { AnclaNormativa } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";
import { useState } from "preact/hooks";

/**
 * W6.5-b: registro [RATIFICAR] tipificado (acta equilibrio C1) en la rama vacía
 * del Inspector — el panel modelo-nivel. La app REGISTRA transiciones
 * (pendiente → anotado-en-mesa → ratificado-con-fuente; la última EXIGE
 * fuente); el ancla OPM solo transiciona vía re-elicitación de la skill, que
 * consume el LogDecisiones v0 exportado aquí (C2: consumidor comprometido).
 */
export function SeccionRegistroRatificar() {
  const modelo = useOpmStore((s) => s.modelo);
  const pendientes = anclasPendientes(modelo);
  const copiarLog = useOpmStore((s) => s.copiarLogDecisionesAlPortapapeles);
  if (pendientes.length === 0) return null;

  return (
    <div style={style.field} data-testid="inspector-registro-ratificar">
      <span class="opm-label-uppercase" style={style.label}>
        Registro [RATIFICAR] · {pendientes.length}
      </span>
      {pendientes.map((ancla) => <FilaPendiente key={ancla.id} ancla={ancla} />)}
      <button
        type="button"
        style={registroStyles.boton}
        data-testid="registro-copiar-log"
        title="Copiar el LogDecisiones v0 para el estado re-elicitar de la skill"
        onClick={() => { void copiarLog(); }}
      >
        Copiar LogDecisiones v0
      </button>
    </div>
  );
}

function FilaPendiente(props: { ancla: AnclaNormativa }) {
  const anotarEnMesa = useOpmStore((s) => s.anotarAnclaEnMesa);
  const ratificar = useOpmStore((s) => s.ratificarAnclaConFuente);
  const [fuente, setFuente] = useState("");
  const registro = props.ancla.ratificacion?.estadoRatificacion ?? "pendiente";
  const ratificada = registro === "ratificado-con-fuente";

  return (
    <div style={registroStyles.fila} data-testid="registro-ratificar-fila">
      <div style={registroStyles.cabecera}>
        <code style={registroStyles.clave}>{props.ancla.claveProto}</code>
        <span style={registroStyles.metaTexto}>
          {props.ancla.ratificacion?.nivelAutoridad ?? "—"} · {registro}
        </span>
      </div>
      {props.ancla.nota ? <span style={registroStyles.nota}>{props.ancla.nota}</span> : null}
      {ratificada ? (
        <span style={registroStyles.metaTexto} title={props.ancla.ratificacion?.ratificadoEn}>
          fuente: {props.ancla.ratificacion?.fuente} — a la espera de re-elicitación
        </span>
      ) : (
        <div style={registroStyles.acciones}>
          {registro === "pendiente" ? (
            <button
              type="button"
              style={registroStyles.boton}
              data-testid="registro-anotar-mesa"
              onClick={() => anotarEnMesa(props.ancla.claveProto)}
            >
              Anotar en mesa
            </button>
          ) : null}
          <input
            type="text"
            style={registroStyles.inputFuente}
            placeholder="Fuente/acta (obligatoria)…"
            data-testid="registro-fuente-input"
            value={fuente}
            onInput={(event) => setFuente(event.currentTarget.value)}
          />
          <button
            type="button"
            style={registroStyles.boton}
            data-testid="registro-ratificar-fuente"
            disabled={!fuente.trim()}
            onClick={() => { ratificar(props.ancla.claveProto, fuente); setFuente(""); }}
          >
            Ratificar
          </button>
        </div>
      )}
    </div>
  );
}

const registroStyles = {
  fila: {
    display: "grid",
    gap: `${tokens.spacing.xs}px`,
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
  },
  cabecera: {
    display: "flex",
    justifyContent: "space-between",
    gap: `${tokens.spacing.xs}px`,
    alignItems: "baseline",
  },
  clave: {
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: `${tokens.typography.sizes.xxs}px`,
    color: tokens.colors.ink,
  },
  metaTexto: {
    color: tokens.colors.ink50,
    fontSize: `${tokens.typography.sizes.xxs}px`,
  },
  nota: {
    color: tokens.colors.ink,
    fontSize: `${tokens.typography.sizes.base}px`,
    lineHeight: 1.4,
  },
  acciones: {
    display: "flex",
    gap: `${tokens.spacing.xs}px`,
    alignItems: "center",
    flexWrap: "wrap" as const,
  },
  inputFuente: {
    flex: 1,
    minWidth: "120px",
    padding: "5px 8px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    outlineColor: tokens.colors.focus,
    caretColor: tokens.colors.accent,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.sizes.xxs}px`,
  },
  boton: {
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    fontSize: `${tokens.typography.sizes.xxs}px`,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
