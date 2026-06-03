import type { ContextoSimulacion, EntradaTraceSim } from "../../modelo/simulacion/tipos";

export interface ProyeccionEstadoBarraSimulacion {
  bloqueado: boolean;
  completado: boolean;
  puedeEjecutar: boolean;
  textoProgreso: string;
}

export interface RotuloTraceSimulacion {
  tipo: "omitido" | "diagnostico";
  texto: string;
  titulo: string;
}

export function proyectarEstadoBarraSimulacion(
  contexto: ContextoSimulacion,
  autoAvance: boolean,
): ProyeccionEstadoBarraSimulacion {
  const totalPasos = contexto.plan.length;
  const ejecutados = contexto.trace.length;
  const completado = contexto.estado === "completado";
  const bloqueado = contexto.estado === "bloqueado";

  if (bloqueado) {
    return {
      bloqueado,
      completado,
      puedeEjecutar: false,
      textoProgreso: `Bloqueada · ${ejecutados} ${ejecutados === 1 ? "paso" : "pasos"}`,
    };
  }

  if (completado) {
    return {
      bloqueado,
      completado,
      puedeEjecutar: false,
      textoProgreso: `Completada · ${totalPasos} ${totalPasos === 1 ? "paso" : "pasos"}`,
    };
  }

  return {
    bloqueado,
    completado,
    puedeEjecutar: totalPasos > 0,
    textoProgreso: `${autoAvance ? "Reproduciendo" : "Listo para simular"} · paso ${Math.min(ejecutados + 1, totalPasos)} de ${totalPasos}`,
  };
}

export function rotuloTraceSimulacion(entrada: EntradaTraceSim): RotuloTraceSimulacion | null {
  if (entrada.omitido) {
    return {
      tipo: "omitido",
      texto: "omitido",
      titulo: entrada.diagnostico ?? "Proceso omitido por condición",
    };
  }
  if (entrada.diagnostico) {
    return {
      tipo: "diagnostico",
      texto: "!",
      titulo: entrada.diagnostico,
    };
  }
  return null;
}
