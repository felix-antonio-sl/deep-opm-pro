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
import { useZustandPersistencePort } from "../app/ports/zustandPersistencePort";
import { DialogoConfirmacion } from "./DialogoConfirmacion";

type ConfirmarSiDirty = (accion: () => void) => void;
type ConfirmarCierreDirty = (accion: () => void, opciones?: { dirty?: boolean; onGuardar?: () => void }) => void;

interface ConfirmacionPendiente {
  accion: () => void;
  onGuardar: () => void;
}

interface ConfirmacionApi {
  confirmarSiDirty: ConfirmarSiDirty;
  confirmarCierreDirty: ConfirmarCierreDirty;
}

const ConfirmacionContext = createContext<ConfirmacionApi | null>(null);

interface ProviderProps {
  children: preact.ComponentChildren;
}

export function ConfirmacionProvider({ children }: ProviderProps) {
  const persistencia = useZustandPersistencePort();
  const [pendiente, setPendiente] = useState<ConfirmacionPendiente | null>(null);

  const confirmarSiDirty: ConfirmarSiDirty = (accion) => {
    // P0 ronda 4: dirtyModelo solo se activa con cambios semanticos.
    // Layout puro (auto-layout, drag) no bloquea la carga de otro modelo.
    if (!persistencia.hayDirtyModelo()) {
      accion();
      return;
    }
    setPendiente({ accion, onGuardar: persistencia.guardarLocal });
  };

  const confirmarCierreDirty: ConfirmarCierreDirty = (accion, opciones) => {
    const dirty = opciones?.dirty ?? persistencia.hayDirtyModelo();
    if (!dirty) {
      accion();
      return;
    }
    setPendiente({ accion, onGuardar: opciones?.onGuardar ?? persistencia.guardarLocal });
  };

  const cancelar = () => setPendiente(null);
  const descartar = () => {
    const accion = pendiente?.accion;
    setPendiente(null);
    accion?.();
  };
  const guardarYContinuar = () => {
    if (!pendiente) return;
    pendiente.onGuardar();
    if (!persistencia.hayDirty()) {
      const accion = pendiente.accion;
      setPendiente(null);
      accion();
    }
  };

  return (
    <ConfirmacionContext.Provider value={{ confirmarSiDirty, confirmarCierreDirty }}>
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
  return ctx.confirmarSiDirty;
}

export function useConfirmarCierreDirty(): ConfirmarCierreDirty {
  const ctx = useContext(ConfirmacionContext);
  if (!ctx) {
    throw new Error("useConfirmarCierreDirty requiere <ConfirmacionProvider>");
  }
  return ctx.confirmarCierreDirty;
}
