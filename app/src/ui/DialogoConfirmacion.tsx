// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useRef } from "preact/hooks";
import { Dialogo, DialogoAccion } from "./Dialogo";

interface DialogoConfirmacionProps {
  open: boolean;
  onGuardar: () => void;
  onDescartar: () => void;
  onCancelar: () => void;
}

// Ronda Codex v1 · L3 — acciones como palabras (`·`). Guardar es la acción
// primaria; Descartar es destructiva (pierde cambios); Cancelar es default.
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
          <DialogoAccion innerRef={guardarRef} tono="primaria" onClick={props.onGuardar}>Guardar</DialogoAccion>
          <DialogoAccion tono="destructiva" onClick={props.onDescartar}>Descartar</DialogoAccion>
          <DialogoAccion onClick={props.onCancelar}>Cancelar</DialogoAccion>
        </>
      )}
    >
      <span data-testid="dialogo-confirmacion-cerrar-dirty">
        Hay cambios sin guardar. ¿Qué quieres hacer?
      </span>
    </Dialogo>
  );
}
