import { useMemo } from "preact/hooks";
import { listarAvisosDiagnostico } from "../../modelo/diagnostico";
import { useOpmStore } from "../../store";
import type { DiagnosticsPort } from "./diagnosticsPort";

export function useZustandDiagnosticsPort(revisionToken: number): DiagnosticsPort {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const navegarAviso = useOpmStore((s) => s.navegarAviso);
  const avisos = useMemo(
    () => listarAvisosDiagnostico(modelo, { tipo: "opd", opdId: opdActivoId }),
    [modelo, opdActivoId, revisionToken],
  );

  return {
    avisos,
    navegarAviso,
  };
}
