import type { AvisoDiagnostico } from "../../modelo/diagnostico";
import type { OpmStore } from "../../store";

export interface DiagnosticsPort {
  avisos: AvisoDiagnostico[];
  navegarAviso: OpmStore["navegarAviso"];
}
