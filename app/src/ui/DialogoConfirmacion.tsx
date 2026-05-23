// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useRef } from "preact/hooks";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

interface DialogoConfirmacionProps {
  open: boolean;
  onGuardar: () => void;
  onDescartar: () => void;
  onCancelar: () => void;
}

export function DialogoConfirmacion(props: DialogoConfirmacionProps) {
  const guardarRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialogo
      open={props.open}
      title="Hay cambios sin guardar"
      onCancel={props.onCancelar}
      initialFocusRef={guardarRef}
      actions={(
        <>
          <button ref={guardarRef} type="button" style={style.primaryButton} onClick={props.onGuardar}>Guardar</button>
          <button type="button" style={style.secondaryButton} onClick={props.onDescartar}>Descartar</button>
          <button type="button" style={style.secondaryButton} onClick={props.onCancelar}>Cancelar</button>
        </>
      )}
    >
      <span data-testid="dialogo-confirmacion-cerrar-dirty">
        Hay cambios sin guardar. ¿Qué quieres hacer?
      </span>
    </Dialogo>
  );
}

// Ronda 28 L5: botones Bauhaus (ink/paper, sin radius, sombra plana, Inter Tight).
const baseButton = {
  minHeight: "32px",
  minWidth: "92px",
  padding: "8px 18px",
  borderRadius: 0,
  cursor: "pointer",
  fontFamily: tokens.typography.familyChrome,
  fontSize: "13px",
  fontWeight: 500,
  whiteSpace: "nowrap",
  transition: tokens.transitions.fast,
} satisfies preact.JSX.CSSProperties;

const style = {
  primaryButton: {
    ...baseButton,
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
  },
  secondaryButton: {
    ...baseButton,
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
