import type { AvisoDiagnostico } from "../../modelo/diagnostico";
import { clasificarSeveridad, type SeveridadIssue } from "../../modelo/diagnosticoSeveridad";
import type { CodigoChecker } from "../../modelo/tipos";
import type { Aviso, SeveridadAviso } from "../../modelo/validaciones";

export type SeveridadDiagnostico = SeveridadIssue;

export interface DiagnosticoIssue {
  id: string;
  testIdCodigo: string;
  severidad: SeveridadDiagnostico;
  codigo: string;
  mensaje: string;
  destino: string;
  cita: string;
  navegar: () => void;
}

export interface GruposDiagnostico {
  bloqueo: DiagnosticoIssue[];
  mejora: DiagnosticoIssue[];
  estilo: DiagnosticoIssue[];
}

export function derivarIssuesDiagnostico(
  avisos: AvisoDiagnostico[],
  navegarAviso: (aviso: Aviso) => void,
): DiagnosticoIssue[] {
  return avisos.map((aviso) => ({
    id: aviso.id,
    testIdCodigo: aviso.testIdCodigo,
    severidad: severidadDiagnostico(aviso),
    codigo: aviso.codigoVisible,
    mensaje: aviso.mensaje,
    destino: aviso.destino,
    cita: aviso.cita,
    navegar: () => {
      if (aviso.avisoNavegable) navegarAviso(aviso.avisoNavegable);
    },
  }));
}

export function agruparIssuesDiagnostico(issues: DiagnosticoIssue[]): GruposDiagnostico {
  return {
    bloqueo: issues.filter((issue) => issue.severidad === "bloqueo"),
    mejora: issues.filter((issue) => issue.severidad === "mejora"),
    estilo: issues.filter((issue) => issue.severidad === "estilo"),
  };
}

export function severidadDiagnostico(aviso: AvisoDiagnostico): SeveridadDiagnostico {
  if (aviso.origen === "metodologia") return clasificarSeveridad({ codigo: aviso.codigo as CodigoChecker });
  return severidadDesdeAviso(aviso.severidad);
}

export function severidadDesdeAviso(severidad: SeveridadAviso): SeveridadDiagnostico {
  if (severidad === "error") return "bloqueo";
  if (severidad === "advertencia") return "mejora";
  return "estilo";
}
