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

const baseButton = {
  height: "34px",
  minWidth: "92px",
  padding: "0 14px",
  borderRadius: tokens.radii.sm,
  cursor: "pointer",
  fontFamily: tokens.typography.familyChrome,
  fontSize: "14px",
  fontWeight: 700,
  whiteSpace: "nowrap",
} satisfies preact.JSX.CSSProperties;

const style = {
  primaryButton: {
    ...baseButton,
    border: `1px solid ${tokens.colors.infoBorde}`,
    background: tokens.colors.canvas.proceso,
    color: tokens.colors.azulProfundo,
  },
  secondaryButton: {
    ...baseButton,
    border: `1px solid ${tokens.colors.bordeControl}`,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoPrimario,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
