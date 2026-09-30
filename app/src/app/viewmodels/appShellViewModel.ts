import { useZustandAppShellOverlaysPort } from "../ports/zustandAppShellOverlaysPort";
import { useZustandAppShellWorkbenchPort } from "../ports/zustandAppShellWorkbenchPort";
import { useOpmStore } from "../../store";
import { deriveDocumentPolicy } from "../../modelo/documentPolicy";

export function useAppShellViewModel() {
  const workbench = useZustandAppShellWorkbenchPort();
  const catalogEntry = useOpmStore((state) => state.indice.modelos.find((entry) => entry.id === workbench.modeloPersistidoId));
  const readOnly = useOpmStore((state) => state.readOnly);
  return {
    ...workbench,
    documentPolicy: deriveDocumentPolicy({
      ...workbench.modelo,
      ...(catalogEntry?.esApunte === true ? { esApunte: true } : {}),
      ...(catalogEntry?.esBiblioteca === true ? { esBiblioteca: true } : {}),
      ...(catalogEntry?.archivado === true ? { archivado: true } : {}),
      readOnly,
    }),
  };
}

export function useAppShellDialogsViewModel() {
  return useZustandAppShellOverlaysPort();
}

export type AppShellViewModel = ReturnType<typeof useAppShellViewModel>;
