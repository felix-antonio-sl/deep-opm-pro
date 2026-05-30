import { listarAvisosDiagnostico, type AvisoDiagnostico } from "./diagnostico";
import { severidadDiagnostico, type SeveridadIssue } from "./diagnosticoSeveridad";
import type { Modelo } from "./tipos";

/**
 * Sugerencia serializable del diagnóstico. Espejo de {@link AvisoDiagnostico}
 * recortado a lo que tiene sentido fuera de la app: omite los campos no
 * serializables (`navegar`, `avisoNavegable`) y reemplaza el `SeveridadAviso`
 * crudo por la severidad **visible** (bloqueo/mejora/estilo) que el usuario ve
 * en el panel.
 */
export interface SugerenciaDiagnosticoExport {
  id: string;
  origen: AvisoDiagnostico["origen"];
  severidad: SeveridadIssue;
  codigo: string;
  titulo: string;
  mensaje: string;
  destino: string;
  citaSSOT: string;
  opdId?: string;
  elementoId?: string;
  elementoTipo?: string;
}

export interface TotalesDiagnosticoExport {
  bloqueo: number;
  mejora: number;
  estilo: number;
  total: number;
}

export interface DiagnosticoExport {
  modelo: string;
  fecha: string;
  alcance: "modelo";
  totales: TotalesDiagnosticoExport;
  sugerencias: SugerenciaDiagnosticoExport[];
}

/**
 * Construye el objeto exportable del diagnóstico completo del modelo (alcance
 * = todo el modelo). Función pura del kernel: no toca DOM, store ni portapapeles
 * — solo proyecta `Modelo → DiagnosticoExport`. La severidad se clasifica con
 * {@link severidadDiagnostico} (kernel) para coincidir exactamente con la del
 * panel de diagnóstico.
 *
 * `now` se inyecta para fechas deterministas en tests (mismo patrón que
 * `nombreArchivoBackupJson` en ui/PersistenciaJson).
 */
export function construirDiagnosticoExport(modelo: Modelo, now: Date = new Date()): DiagnosticoExport {
  const avisos = listarAvisosDiagnostico(modelo, { tipo: "modelo" });
  const sugerencias = avisos.map(sugerenciaDesdeAviso);
  return {
    modelo: modelo.nombre,
    fecha: now.toISOString().slice(0, 10),
    alcance: "modelo",
    totales: totalesPorSeveridad(sugerencias),
    sugerencias,
  };
}

/**
 * Serializa el diagnóstico completo del modelo a JSON (indentación de 2
 * espacios). Es lo que copia al portapapeles el comando de la paleta.
 */
export function exportarDiagnosticoJson(modelo: Modelo, now: Date = new Date()): string {
  return JSON.stringify(construirDiagnosticoExport(modelo, now), null, 2);
}

function sugerenciaDesdeAviso(aviso: AvisoDiagnostico): SugerenciaDiagnosticoExport {
  return {
    id: aviso.id,
    origen: aviso.origen,
    severidad: severidadDiagnostico(aviso),
    codigo: aviso.codigo,
    titulo: aviso.titulo,
    mensaje: aviso.mensaje,
    destino: aviso.destino,
    citaSSOT: aviso.citaSSOT,
    ...(aviso.opdId ? { opdId: aviso.opdId } : {}),
    ...(aviso.elementoId ? { elementoId: aviso.elementoId } : {}),
    ...(aviso.elementoTipo ? { elementoTipo: aviso.elementoTipo } : {}),
  };
}

function totalesPorSeveridad(sugerencias: readonly SugerenciaDiagnosticoExport[]): TotalesDiagnosticoExport {
  const totales: TotalesDiagnosticoExport = { bloqueo: 0, mejora: 0, estilo: 0, total: sugerencias.length };
  for (const sugerencia of sugerencias) {
    totales[sugerencia.severidad] += 1;
  }
  return totales;
}
