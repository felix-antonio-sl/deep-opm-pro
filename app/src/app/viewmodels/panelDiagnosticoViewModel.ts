import type { AvisoDiagnostico } from "../../modelo/diagnostico";
import { severidadDesdeAviso, severidadDiagnostico, type SeveridadIssue } from "../../modelo/diagnosticoSeveridad";
import type { Aviso } from "../../modelo/validaciones";

export type SeveridadDiagnostico = SeveridadIssue;

// Reexportadas desde el kernel (modelo/diagnosticoSeveridad). La clasificación
// de severidad es lógica pura de dominio; vive en el kernel para que el
// exportador de diagnóstico (modelo/exportarDiagnostico) pueda compartirla sin
// que `modelo/` importe hacia `app/`. El panel las consume aquí por cercanía.
export { severidadDesdeAviso, severidadDiagnostico };

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
  fuente: string;
  fundamento?: string;
  acciones: string[];
  navegable: boolean;
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
  fuente: string;
  fundamento?: string;
  acciones: string[];
  navegable: boolean;
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
  opciones: { esApunte?: boolean } = {},
): DiagnosticoIssue[] {
  return avisos.map((aviso) => ({
    id: aviso.id,
    testIdCodigo: aviso.testIdCodigo,
    severidad: severidadDiagnostico(aviso, opciones),
    codigo: aviso.codigoVisible,
    titulo: aviso.titulo,
    mensaje: aviso.mensaje,
    destino: aviso.destino,
    cita: aviso.cita,
    fuente: (aviso.fuente ?? aviso.citaSSOT) || "SSOT OPM",
    ...(aviso.fundamento ? { fundamento: aviso.fundamento } : {}),
    acciones: [...(aviso.acciones ?? [])],
    navegable: aviso.avisoNavegable !== null,
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
      fuente: issue.fuente,
      ...(issue.fundamento ? { fundamento: issue.fundamento } : {}),
      acciones: issue.acciones,
      navegable: issue.navegable,
      navegar: issue.navegar,
      instancias: [issue],
    };
    indicePorCodigo.set(clave, grupo);
    orden.push(grupo);
  }

  return orden;
}

export interface ResumenPanelDiagnostico {
  texto: string;
  ariaLabel: string;
  dominante: SeveridadDiagnostico | "sin-hallazgos";
}

/** Resume solo cambios de identidad entre dos recomputaciones. El panel sigue
 * siendo el único propietario visual de los hallazgos; este texto alimenta su
 * live region accesible sin repetir el contenido de cada issue. */
export function resumirDeltaDiagnostico(
  anteriores: readonly string[],
  actuales: readonly string[],
): string {
  const previos = new Set(anteriores);
  const siguientes = new Set(actuales);
  const nuevos = [...siguientes].filter((id) => !previos.has(id)).length;
  const resueltos = [...previos].filter((id) => !siguientes.has(id)).length;
  if (nuevos === 0 && resueltos === 0) return "";
  const partes = [
    ...(nuevos > 0 ? [`${nuevos} ${nuevos === 1 ? "hallazgo nuevo" : "hallazgos nuevos"}`] : []),
    ...(resueltos > 0 ? [`${resueltos} ${resueltos === 1 ? "hallazgo resuelto" : "hallazgos resueltos"}`] : []),
  ];
  return `Diagnóstico actualizado: ${partes.join(" y ")}.`;
}

/** Resumen compacto para una columna estrecha. Nombra la severidad dominante
 * y conserva la existencia de las restantes sin degradarlas a "sugerencias". */
export function resumirPanelDiagnostico(issues: readonly DiagnosticoIssue[]): ResumenPanelDiagnostico {
  const conteos = {
    bloqueo: issues.filter((issue) => issue.severidad === "bloqueo").length,
    mejora: issues.filter((issue) => issue.severidad === "mejora").length,
    estilo: issues.filter((issue) => issue.severidad === "estilo").length,
  };
  const categorias = [
    { severidad: "bloqueo" as const, icono: "!", cantidad: conteos.bloqueo, singular: "bloqueo", plural: "bloqueos" },
    { severidad: "mejora" as const, icono: "△", cantidad: conteos.mejora, singular: "mejora", plural: "mejoras" },
    { severidad: "estilo" as const, icono: "·", cantidad: conteos.estilo, singular: "observación", plural: "observaciones" },
  ].filter((categoria) => categoria.cantidad > 0);
  if (categorias.length === 0) {
    return {
      texto: "sin hallazgos",
      ariaLabel: "Sin hallazgos en el OPD activo",
      dominante: "sin-hallazgos",
    };
  }
  const principal = categorias[0]!;
  const restantes = issues.length - principal.cantidad;
  const nombrePrincipal = principal.cantidad === 1 ? principal.singular : principal.plural;
  const ariaLabel = categorias
    .map((categoria) => `${categoria.cantidad} ${categoria.cantidad === 1 ? categoria.singular : categoria.plural}`)
    .join(", ");
  return {
    texto: `${principal.icono} ${principal.cantidad} ${nombrePrincipal}${restantes > 0 ? ` · ${restantes} más` : ""}`,
    ariaLabel,
    dominante: principal.severidad,
  };
}
