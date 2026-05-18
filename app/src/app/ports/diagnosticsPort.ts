import type { AvisoDiagnostico } from "../../modelo/diagnostico";
import type { Aviso } from "../../modelo/validaciones";

export interface DiagnosticsPort {
  avisos: AvisoDiagnostico[];
  navegarAviso: (aviso: Aviso) => void;
}
