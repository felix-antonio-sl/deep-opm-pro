import { useMemo } from "preact/hooks";
import { useOpmStore } from "../../store";
import { crearDiagnosticsPort, crearDiagnosticsQueryPort, type DiagnosticsPort, type DiagnosticsQueryPort } from "./diagnosticsPort";

export function useZustandDiagnosticsPort(revisionToken = 0): DiagnosticsPort {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const navegarAviso = useOpmStore((s) => s.navegarAviso);

  return useMemo(
    () => crearDiagnosticsPort({ modelo, opdActivoId, navegarAviso }),
    [modelo, opdActivoId, navegarAviso, revisionToken],
  );
}

export function useZustandDiagnosticsQueryPort(revisionToken = 0): DiagnosticsQueryPort {
  const modelo = useOpmStore((s) => s.modelo);
  return useMemo(() => crearDiagnosticsQueryPort(modelo), [modelo, revisionToken]);
}
