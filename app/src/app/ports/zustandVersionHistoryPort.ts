import { useOpmStore } from "../../store";
import type { VersionHistoryPort } from "./versionHistoryPort";

export function useZustandVersionHistoryPort(): VersionHistoryPort {
  const abierto = useOpmStore((s) => s.dialogoVersionesAbierto);
  const cerrar = useOpmStore((s) => s.cerrarDialogoVersiones);
  const modelos = useOpmStore((s) => s.modelosGuardados);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const crearVersionAhora = useOpmStore((s) => s.crearVersionAhora);
  const restaurar = useOpmStore((s) => s.restaurarVersionComoCopia);
  const eliminar = useOpmStore((s) => s.eliminarVersionPorId);
  const mostrarVersiones = useOpmStore((s) => s.mostrarVersiones);
  const toggleMostrarVersiones = useOpmStore((s) => s.toggleMostrarVersiones);

  return {
    abierto,
    cerrar,
    modelos,
    modeloPersistidoId,
    crearVersionAhora: async (opts) => {
      await crearVersionAhora(opts);
    },
    restaurar,
    eliminar,
    mostrarVersiones,
    toggleMostrarVersiones,
  };
}
