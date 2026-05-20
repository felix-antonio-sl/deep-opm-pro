import type { AvisoDiagnostico } from "../../modelo/diagnostico";
import { clasificarSeveridad, type SeveridadIssue } from "../../modelo/diagnosticoSeveridad";
import type { CodigoChecker } from "../../modelo/tipos";
import type { Aviso, SeveridadAviso } from "../../modelo/validaciones";

export type SeveridadDiagnostico = SeveridadIssue;

/**
 * Issue individual derivado de un aviso del diagnóstico. Lleva `titulo`
 * (humano) y `codigo` (machine-readable, usado como testid en e2e).
 */
export interface DiagnosticoIssue {
  id: string;
  testIdCodigo: string;
  severidad: SeveridadDiagnostico;
  codigo: string;
  titulo: string;
  mensaje: string;
  destino: string;
  cita: string;
  navegar: () => void;
}

/**
 * Grupo de issues con la misma regla (ronda23 L2 #8). El representante
 * (primer issue) provee testid, navegación y la línea principal; las
 * `instancias` adicionales se exponen como cuenta y lista de destinos para
 * que el panel pueda resumir "3 procesos sin entradas ni salidas" en vez
 * de tres filas idénticas.
 */
export interface DiagnosticoIssueAgrupado {
  id: string;
  testIdCodigo: string;
  severidad: SeveridadDiagnostico;
  codigo: string;
  titulo: string;
  mensaje: string;
  destino: string;
  cita: string;
  navegar: () => void;
  /**
   * Issues que comparten {@link DiagnosticoIssue.testIdCodigo} con el
   * representante, en orden de aparición. Incluye al representante en la
   * posición 0; nunca está vacío.
   */
  instancias: DiagnosticoIssue[];
}

export interface GruposDiagnostico {
  bloqueo: DiagnosticoIssueAgrupado[];
  mejora: DiagnosticoIssueAgrupado[];
  estilo: DiagnosticoIssueAgrupado[];
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
    titulo: aviso.titulo,
    mensaje: aviso.mensaje,
    destino: aviso.destino,
    cita: aviso.cita,
    navegar: () => {
      if (aviso.avisoNavegable) navegarAviso(aviso.avisoNavegable);
    },
  }));
}

/**
 * Agrupa los issues en tres severidades y, dentro de cada una, colapsa los
 * que comparten el mismo `testIdCodigo` (= mismo `reglaId` / `codigo` de
 * regla). El orden relativo se preserva por orden de aparición del primer
 * issue de cada grupo.
 *
 * Ronda23 L2 #8: el panel debe mostrar "Proceso sin entradas ni salidas (3)"
 * en vez de tres filas idénticas con destinos distintos.
 */
export function agruparIssuesDiagnostico(issues: DiagnosticoIssue[]): GruposDiagnostico {
  return {
    bloqueo: agruparPorRegla(issues.filter((issue) => issue.severidad === "bloqueo")),
    mejora: agruparPorRegla(issues.filter((issue) => issue.severidad === "mejora")),
    estilo: agruparPorRegla(issues.filter((issue) => issue.severidad === "estilo")),
  };
}

function agruparPorRegla(issues: DiagnosticoIssue[]): DiagnosticoIssueAgrupado[] {
  const indicePorCodigo = new Map<string, DiagnosticoIssueAgrupado>();
  const orden: DiagnosticoIssueAgrupado[] = [];

  for (const issue of issues) {
    const clave = issue.testIdCodigo;
    const existente = indicePorCodigo.get(clave);
    if (existente) {
      existente.instancias.push(issue);
      continue;
    }
    const grupo: DiagnosticoIssueAgrupado = {
      id: issue.id,
      testIdCodigo: issue.testIdCodigo,
      severidad: issue.severidad,
      codigo: issue.codigo,
      titulo: issue.titulo,
      mensaje: issue.mensaje,
      destino: issue.destino,
      cita: issue.cita,
      navegar: issue.navegar,
      instancias: [issue],
    };
    indicePorCodigo.set(clave, grupo);
    orden.push(grupo);
  }

  return orden;
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
