// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import {
  mismaReferencia,
  type OplReferencia,
  type OplToken,
} from "../../opl/interaccion";
import { estilos as oplTipografia } from "../codex/oplTipografia";
import { tokens } from "../tokens";

export interface EdicionOpl {
  tipo: "entidad" | "estado";
  id: string;
  tokenId: string;
  valor: string;
}

interface RenderTokenProps {
  token: OplToken;
  hoverOplRef: OplReferencia | null;
  edicion: EdicionOpl | null;
  setEdicion: (value: EdicionOpl | null) => void;
  seleccionarDesdeOpl: (ref: OplReferencia) => void;
  renombrarEntidadDesdeOpl: (entidadId: string, nombre: string) => void;
  renombrarEstadoDesdeOpl: (estadoId: string, nombre: string) => void;
  abrirInspectorEnlaceDesdeOpl: (enlaceId: string) => void;
  fijarHoverOpl: (ref: OplReferencia | null) => void;
}

/**
 * Renderiza un token OPL interactivo. Lo consume PanelOpl/Bloques para mantener
 * la edicion inline y hover OPL-canvas fuera del barrel publico.
 */
export function RenderToken(props: RenderTokenProps) {
  const editando = props.edicion && props.edicion.tokenId === props.token.id;

  if (props.token.ref?.tipo === "entidad" && editando && props.edicion?.tipo === "entidad") {
    return (
      <input
        key={props.token.id}
        aria-label="Renombrar desde OPL"
        value={props.edicion.valor}
        autoFocus
        style={style.inputInline}
        onInput={(event) =>
          props.setEdicion({
            ...props.edicion!,
            valor: (event.currentTarget as HTMLInputElement).value,
          })
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            props.renombrarEntidadDesdeOpl(props.edicion!.id, props.edicion!.valor);
            props.setEdicion(null);
          }
          if (event.key === "Escape") props.setEdicion(null);
        }}
        onBlur={() => props.setEdicion(null)}
      />
    );
  }

  if (props.token.ref?.tipo === "estado" && editando && props.edicion?.tipo === "estado") {
    return (
      <input
        key={props.token.id}
        aria-label="Renombrar estado desde OPL"
        value={props.edicion.valor}
        autoFocus
        style={style.inputInline}
        onInput={(event) =>
          props.setEdicion({
            ...props.edicion!,
            valor: (event.currentTarget as HTMLInputElement).value,
          })
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            props.renombrarEstadoDesdeOpl(props.edicion!.id, props.edicion!.valor);
            props.setEdicion(null);
          }
          if (event.key === "Escape") props.setEdicion(null);
        }}
        onBlur={() => props.setEdicion(null)}
      />
    );
  }

  const interactivo = !!props.token.ref;
  const seleccionado = props.token.ref && props.hoverOplRef
    ? mismaReferencia(props.token.ref, props.hoverOplRef)
    : false;
  const contenido = textoVisibleToken(props.token);
  const isEnlaceDestino = props.token.rol === "nombre" && props.token.ref?.tipo === "enlace";
  const enlaceRef = props.token.ref?.tipo === "enlace" ? props.token.ref : null;
  const common = {
    key: props.token.id,
    "data-opl-token": props.token.ref ? `${props.token.ref.tipo}:${props.token.ref.id}` : undefined,
    "data-opl-rol": props.token.rol,
    style: {
      ...style.token,
      ...(interactivo ? style.tokenInteractivo : {}),
      ...(seleccionado ? style.tokenHover : {}),
      ...styleTokenMarkdown(props.token),
      ...(isEnlaceDestino ? style.tokenMultiEnlace : {}),
    },
    onMouseEnter: () => props.token.ref && props.fijarHoverOpl(props.token.ref),
    onMouseLeave: () => props.token.ref && props.fijarHoverOpl(null),
    onClick: () => {
      if (props.token.ref) props.seleccionarDesdeOpl(props.token.ref);
    },
    onDblClick: () => {
      if (props.token.ref?.tipo === "entidad") {
        props.setEdicion({ tipo: "entidad", id: props.token.ref.id, tokenId: props.token.id, valor: contenido });
        return;
      }
      if (props.token.ref?.tipo === "estado") {
        props.setEdicion({ tipo: "estado", id: props.token.ref.id, tokenId: props.token.id, valor: props.token.texto.replace(/`/g, "") });
        return;
      }
      if (props.token.rol === "verbo" && enlaceRef) {
        props.abrirInspectorEnlaceDesdeOpl(enlaceRef.id);
        return;
      }
      if (props.token.ref?.tipo === "enlace") props.abrirInspectorEnlaceDesdeOpl(props.token.ref.id);
    },
  };

  if (props.token.markdown === "objeto") return <strong {...common}>{contenido}</strong>;
  if (props.token.markdown === "proceso") return <em {...common}>{contenido}</em>;
  if (props.token.markdown === "estado") return <code {...common}>{props.token.texto}</code>;
  return <span {...common}>{props.token.texto}</span>;
}

export function textoVisibleToken(token: OplToken): string {
  if (token.markdown === "objeto") return token.texto.replace(/\*\*([^*]+)\*\*/g, "$1");
  if (token.markdown === "proceso") return token.texto.replace(/\*([^*\s][^*]*?)\*/g, "$1");
  return token.texto.replace(/`/g, "");
}

// Ronda Codex v1 · L1: la tipografia OPL de objeto/proceso/estado se centraliza
// en `codex/oplTipografia` (contrato que L2/L3 tambien consumen). RenderToken la
// reusa para no duplicar estilos inline; conserva la interaccion (hover, click,
// edicion inline) y el estilo de verbo/multi-enlace propios del token.
function styleTokenMarkdown(token: OplToken): preact.JSX.CSSProperties {
  if (token.markdown === "objeto") return oplTipografia.objeto;
  if (token.markdown === "proceso") return oplTipografia.proceso;
  if (token.markdown === "estado") return oplTipografia.estado;
  if (token.rol === "verbo") return style.verbo;
  return {};
}

// Estilos propios del token interactivo (no de la tipografia canonica):
//   - Verbo: el verbo OPL en tinta media — info-pointer canonico de la oracion.
//   - tokenMultiEnlace: nombre de enlace con varias instancias, subrayado
//     punteado crimson para distinguir el destino seleccionable.
const style = {
  token: { borderRadius: tokens.radii.xs },
  tokenInteractivo: { cursor: "pointer" },
  tokenHover: { background: tokens.colors.ink04 },
  tokenMultiEnlace: { borderBottom: `1px dotted ${tokens.colors.accent}` },
  verbo: {
    color: tokens.colors.focus,
    fontWeight: tokens.typography.weights.medium,
  },
  inputInline: {
    width: "14ch",
    minWidth: 80,
    maxWidth: 220,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    borderRadius: tokens.radii.xs,
    padding: "1px 4px",
    font: "inherit",
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    caretColor: tokens.colors.accent,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
