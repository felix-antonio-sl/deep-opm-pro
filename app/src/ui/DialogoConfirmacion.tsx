import { useRef, useState } from "preact/hooks";
import { store, useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";

interface ConfirmacionPendiente {
  accion: () => void;
}

export function useConfirmarSiDirty() {
  const dirty = useOpmStore((s) => s.dirty);
  const guardarLocal = useOpmStore((s) => s.guardarLocal);
  const [pendiente, setPendiente] = useState<ConfirmacionPendiente | null>(null);

  const confirmarSiDirty = (accion: () => void) => {
    if (!dirty) {
      accion();
      return;
    }
    setPendiente({ accion });
  };

  const cancelar = () => setPendiente(null);
  const descartar = () => {
    const accion = pendiente?.accion;
    setPendiente(null);
    accion?.();
  };
  const guardarYContinuar = () => {
    if (!pendiente) return;
    guardarLocal();
    if (!store.getState().dirty) {
      const accion = pendiente.accion;
      setPendiente(null);
      accion();
    }
  };

  return {
    confirmarSiDirty,
    dialogoConfirmacion: (
      <DialogoConfirmacion
        open={pendiente !== null}
        onGuardar={guardarYContinuar}
        onDescartar={descartar}
        onCancelar={cancelar}
      />
    ),
  };
}

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
      Guarda el modelo antes de continuar, descarta los cambios actuales o cancela la acción.
    </Dialogo>
  );
}

const baseButton = {
  height: "34px",
  minWidth: "92px",
  padding: "0 14px",
  borderRadius: "4px",
  cursor: "pointer",
  fontFamily: "Arial, sans-serif",
  fontSize: "14px",
  fontWeight: 700,
  whiteSpace: "nowrap",
} satisfies preact.JSX.CSSProperties;

const style = {
  primaryButton: {
    ...baseButton,
    border: "1px solid #147aa5",
    background: "#3BC3FF",
    color: "#0b2f3f",
  },
  secondaryButton: {
    ...baseButton,
    border: "1px solid #c8d2df",
    background: "#f9fbfd",
    color: "#1f2937",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
