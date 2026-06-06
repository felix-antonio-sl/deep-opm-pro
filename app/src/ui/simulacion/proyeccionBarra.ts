import type { Modelo } from "../../modelo/tipos";
import type { ContextoSimulacion, EntradaTraceSim, PasoSimulacion, TransicionEstadoSim } from "../../modelo/simulacion/tipos";
import { descriptorFaseSimulacion, transicionesVigentesSimulacion } from "../../modelo/simulacion/fases";

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
    textoProgreso: textoProgresoVivo(contexto, autoAvance),
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

  const fase = descriptorFaseSimulacion(modelo, paso, contexto.faseActual);
  return {
    tono: autoAvance ? "activo" : "neutro",
    titulo: `${tituloFase(fase?.fase, autoAvance)}: ${paso.procesoNombre}`,
    detalle: describirFasePlanificada(modelo, paso, contexto.estadosCurrent, fase?.fase),
    contexto: [
      `paso ${Math.min(contexto.pasoActual + 1, totalPasos)} de ${totalPasos}`,
      fase ? `fase ${fase.indice}/${fase.total}` : "sin fase",
      paso.opdNombre,
      modo,
    ],
  };
}

function textoProgresoVivo(
  contexto: ContextoSimulacion,
  autoAvance: boolean,
): string {
  const totalPasos = contexto.plan.length;
  const pasoTexto = `paso ${Math.min(contexto.pasoActual + 1, totalPasos)} de ${totalPasos}`;
  const faseReal = contexto.faseActual;
  return `${autoAvance ? "Reproduciendo" : "Listo para simular"} · ${pasoTexto}${faseReal ? ` · ${rotuloProgresoFase(faseReal)}` : ""}`;
}

function describirFasePlanificada(
  modelo: Modelo,
  paso: PasoSimulacion,
  estadosCurrent: Record<string, string>,
  fase: ContextoSimulacion["faseActual"],
): string {
  const transiciones = transicionesVigentesSimulacion(paso, estadosCurrent);
  if (fase === "preparacion") {
    return "Se verifican condiciones y habilitadores; todavía no se consume ni produce estado.";
  }
  if (fase === "consumo") {
    if (transiciones.length === 0) return "El proceso toma sus entradas de consumo; no hay cambio de estado inferido.";
    return `Inicio del proceso: consume ${describirTransiciones(modelo, transiciones)}.`;
  }
  if (fase === "proceso") {
    return transiciones.length > 0
      ? "El proceso está activo; los objetos afectados quedan en transición hasta el resultado."
      : "El proceso está activo y se registrará como avance de traza.";
  }
  if (fase === "resultado") {
    if (transiciones.length === 0) return "Cierre del proceso: no hay resultado de estado inferido.";
    return `Cierre del proceso: produce ${describirTransiciones(modelo, transiciones)}.`;
  }
  if (fase === "cierre") {
    return "La traza se consolidará y la simulación avanzará al siguiente proceso.";
  }
  return "Este proceso no tiene cambios de estado inferidos; se registrará como avance de traza.";
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

function describirTransiciones(modelo: Modelo, transiciones: readonly TransicionEstadoSim[]): string {
  const visibles = transiciones.slice(0, 2).map((transicion) => describirTransicion(modelo, transicion));
  const restantes = transiciones.length - visibles.length;
  return restantes > 0 ? `${visibles.join("; ")} y ${restantes} más` : visibles.join("; ");
}

function tituloFase(fase: ContextoSimulacion["faseActual"], autoAvance: boolean): string {
  if (autoAvance) return "Ejecutando";
  if (fase === "preparacion") return "Preparación";
  if (fase === "consumo") return "Consumo";
  if (fase === "proceso") return "Proceso activo";
  if (fase === "resultado") return "Resultado";
  if (fase === "cierre") return "Cierre";
  return "Próximo";
}

function rotuloProgresoFase(fase: NonNullable<ContextoSimulacion["faseActual"]>): string {
  if (fase === "preparacion") return "preparación";
  if (fase === "consumo") return "consumo";
  if (fase === "proceso") return "proceso";
  if (fase === "resultado") return "resultado";
  return "cierre";
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
