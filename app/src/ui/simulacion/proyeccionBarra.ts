import type { Modelo } from "../../modelo/tipos";
import type { ContextoSimulacion, EntradaTraceSim, PasoSimulacion, TransicionEstadoSim } from "../../modelo/simulacion/tipos";

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

export interface NarrativaSimulacion {
  tono: "neutro" | "activo" | "exito" | "alerta";
  titulo: string;
  detalle: string;
  contexto: string[];
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

export function proyectarNarrativaSimulacion(
  modelo: Modelo,
  contexto: ContextoSimulacion,
  autoAvance: boolean,
): NarrativaSimulacion {
  const totalPasos = contexto.plan.length;
  const ejecutados = contexto.trace.length;
  const modo = contexto.modo ?? "determinista";
  const baseContexto = [`${ejecutados}/${totalPasos}`, modo];

  if (totalPasos === 0) {
    return {
      tono: "neutro",
      titulo: "No hay procesos simulables",
      detalle: "Agrega procesos al OPD para generar una traza de simulación.",
      contexto: ["sin plan"],
    };
  }

  const ultimaEntrada = contexto.trace.at(-1);
  if (contexto.estado === "bloqueado") {
    return {
      tono: "alerta",
      titulo: "Simulación bloqueada",
      detalle: ultimaEntrada?.diagnostico ?? "La corrida no puede avanzar con el estado actual del modelo.",
      contexto: baseContexto,
    };
  }

  if (contexto.estado === "completado") {
    return {
      tono: "exito",
      titulo: "Simulación completada",
      detalle: ultimaEntrada ? describirEntradaTrace(modelo, ultimaEntrada) : "La simulación recorrió todo el plan.",
      contexto: baseContexto,
    };
  }

  const paso = contexto.plan[contexto.pasoActual];
  if (!paso) {
    return {
      tono: "neutro",
      titulo: "Sin paso activo",
      detalle: "La simulación no tiene un próximo proceso que ejecutar.",
      contexto: baseContexto,
    };
  }

  return {
    tono: autoAvance ? "activo" : "neutro",
    titulo: `${autoAvance ? "Ejecutando" : "Próximo"}: ${paso.procesoNombre}`,
    detalle: describirPasoPlanificado(modelo, paso, contexto.estadosCurrent),
    contexto: [`paso ${Math.min(ejecutados + 1, totalPasos)} de ${totalPasos}`, paso.opdNombre, modo],
  };
}

function describirPasoPlanificado(
  modelo: Modelo,
  paso: PasoSimulacion,
  estadosCurrent: Record<string, string>,
): string {
  const transiciones = transicionesVigentes(paso, estadosCurrent);
  if (transiciones.length === 0) {
    return "Este proceso no tiene cambios de estado inferidos; se registrará como avance de traza.";
  }
  return `Aplicará ${describirTransiciones(modelo, transiciones)}.`;
}

function describirEntradaTrace(modelo: Modelo, entrada: EntradaTraceSim): string {
  if (entrada.omitido) {
    return entrada.diagnostico ?? `${entrada.procesoNombre} fue omitido por condición.`;
  }
  if (entrada.diagnostico) {
    return entrada.diagnostico;
  }
  const partes: string[] = [];
  if (entrada.transicionesAplicadas.length > 0) {
    partes.push(`Aplicó ${describirTransiciones(modelo, entrada.transicionesAplicadas)}`);
  }
  if (entrada.cambiosValor.length > 0) {
    partes.push(`${entrada.cambiosValor.length} ${entrada.cambiosValor.length === 1 ? "cambio de valor" : "cambios de valor"}`);
  }
  if (entrada.eventosTemporales?.length) {
    partes.push(`${entrada.eventosTemporales.length} ${entrada.eventosTemporales.length === 1 ? "evento temporal" : "eventos temporales"}`);
  }
  return partes.length > 0 ? `${partes.join("; ")}.` : `${entrada.procesoNombre} se ejecutó sin cambios de estado.`;
}

function transicionesVigentes(paso: PasoSimulacion, estadosCurrent: Record<string, string>): TransicionEstadoSim[] {
  const grupos = new Map<string, TransicionEstadoSim[]>();
  for (const transicion of paso.transicionesPlanificadas) {
    const previas = grupos.get(transicion.entidadId);
    if (previas) previas.push(transicion);
    else grupos.set(transicion.entidadId, [transicion]);
  }

  const vigentes: TransicionEstadoSim[] = [];
  for (const [entidadId, transiciones] of grupos) {
    if (transiciones.length === 1) {
      vigentes.push(transiciones[0]!);
      continue;
    }
    const compatibles = transiciones.filter(
      (transicion) => transicion.estadoAntesId === null || estadosCurrent[entidadId] === transicion.estadoAntesId,
    );
    vigentes.push(...(compatibles.length > 0 ? compatibles : transiciones));
  }
  return vigentes;
}

function describirTransiciones(modelo: Modelo, transiciones: readonly TransicionEstadoSim[]): string {
  const visibles = transiciones.slice(0, 2).map((transicion) => describirTransicion(modelo, transicion));
  const restantes = transiciones.length - visibles.length;
  return restantes > 0 ? `${visibles.join("; ")} y ${restantes} más` : visibles.join("; ");
}

function describirTransicion(modelo: Modelo, transicion: TransicionEstadoSim): string {
  const entidad = modelo.entidades[transicion.entidadId]?.nombre ?? transicion.entidadId;
  const antes = nombreEstado(modelo, transicion.estadoAntesId);
  const despues = nombreEstado(modelo, transicion.estadoDespuesId);
  const ruta = transicion.rutaEtiqueta ? ` por ruta ${transicion.rutaEtiqueta}` : "";
  return `${entidad}: ${antes} -> ${despues}${ruta}`;
}

function nombreEstado(modelo: Modelo, estadoId: string | null): string {
  if (estadoId === null) return "sin estado";
  return modelo.estados[estadoId]?.nombre ?? estadoId;
}
