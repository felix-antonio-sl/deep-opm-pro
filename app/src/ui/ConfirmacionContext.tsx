// Provider global de confirmacion de cambios sin guardar.
//
// Antes de este modulo, useConfirmarSiDirty montaba un <DialogoConfirmacion />
// por cada consumidor (Toolbar y PersistenciaJson), lo que producia dos
// instancias del modal con botones homonimos en el DOM y rompia los selectors
// "Guardar" en pruebas in-vivo. Ahora hay un unico DialogoConfirmacion
// renderizado por <ConfirmacionProvider> en App.tsx, y los componentes consumen
// la accion via useConfirmarSiDirty() que devuelve sólo la funcion.
import { createContext } from "preact";
import { useContext, useState } from "preact/hooks";
import { store, useOpmStore } from "../store";
import { DialogoConfirmacion } from "./DialogoConfirmacion";

type ConfirmarSiDirty = (accion: () => void) => void;

interface ConfirmacionPendiente {
  accion: () => void;
}

const ConfirmacionContext = createContext<ConfirmarSiDirty | null>(null);

interface ProviderProps {
  children: preact.ComponentChildren;
}

export function ConfirmacionProvider({ children }: ProviderProps) {
  // Subscripcion a dirty para que el provider re-renderice cuando cambie y
  // las decisiones de descartar/guardar se evaluen contra el ultimo estado.
  useOpmStore((s) => s.dirty);
  const guardarLocal = useOpmStore((s) => s.guardarLocal);
  const [pendiente, setPendiente] = useState<ConfirmacionPendiente | null>(null);

  const confirmarSiDirty: ConfirmarSiDirty = (accion) => {
    if (!store.getState().dirty) {
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

  return (
    <ConfirmacionContext.Provider value={confirmarSiDirty}>
      {children}
      <DialogoConfirmacion
        open={pendiente !== null}
        onGuardar={guardarYContinuar}
        onDescartar={descartar}
        onCancelar={cancelar}
      />
    </ConfirmacionContext.Provider>
  );
}

export function useConfirmarSiDirty(): ConfirmarSiDirty {
  const ctx = useContext(ConfirmacionContext);
  if (!ctx) {
    throw new Error("useConfirmarSiDirty requiere <ConfirmacionProvider>");
  }
  return ctx;
}
