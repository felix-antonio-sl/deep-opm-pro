import { entidadIdDeExtremo } from "../extremos";
import type { Enlace, Id, Modelo } from "../tipos";
import type { PasoSimulacion } from "./tipos";
import type { ConocimientoRuntimeEscenario } from "./scenario";

export type EstadoHabilitador = "satisfecha" | "incumplida" | "desconocida";

export interface PrecondicionHabilitador {
  enlaceId: Id;
  tipo: "agente" | "instrumento";
  entidadId: Id;
  estadoRequeridoId?: Id;
  estadoObservadoId?: Id;
  estado: EstadoHabilitador;
  motivo?: string;
}

export interface EvaluacionHabilitadores {
  estado: "satisfechos" | "impedidos" | "no-conocidos" | "no-soportado";
  precondiciones: PrecondicionHabilitador[];
  motivos: string[];
}

/**
 * Evaluate base agent and instrument links against scenario knowledge.
 * Unknown presence or state stays unknown; this function never invents an OPM state.
 */
export function evaluateEnablers(
  modelo: Modelo,
  paso: PasoSimulacion,
  scenario: ConocimientoRuntimeEscenario,
): EvaluacionHabilitadores {
  const precondiciones: PrecondicionHabilitador[] = [];
  const motivos: string[] = [];
  let noSoportado = false;

  for (const enlaceId of paso.enlacesEntradaIds) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace || (enlace.tipo !== "agente" && enlace.tipo !== "instrumento")) continue;

    const entidadId = entidadIdDeExtremo(modelo, enlace.origenId);
    const procesoId = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (!entidadId || procesoId !== paso.procesoId || entidadId === paso.procesoId) {
      noSoportado = true;
      motivos.push(`Enlace ${enlace.id} no representa un habilitador entrante de ${paso.procesoNombre}`);
      continue;
    }
    const entidad = modelo.entidades[entidadId];
    if (!entidad || entidad.tipo !== "objeto") {
      noSoportado = true;
      motivos.push(`El habilitador del enlace ${enlace.id} no es un objeto del modelo`);
      continue;
    }
    if (enlace.tipo === "agente" && entidad.esencia !== "fisica") {
      noSoportado = true;
      motivos.push(`El agente ${entidad.nombre} no tiene esencia física`);
      continue;
    }

    const extremoRequerido = enlace.origenId.kind === "estado" ? enlace.origenId : undefined;
    const estadoRequeridoId = extremoRequerido?.id;
    const estadoRequerido = estadoRequeridoId ? modelo.estados[estadoRequeridoId] : undefined;
    const estadoRuntime = scenario.estadosCurrent[entidadId];
    const presencia = scenario.presencia[entidadId];
    let estado: EstadoHabilitador;
    let estadoObservadoId: Id | undefined;
    let motivo: string | undefined;

    if (estadoRequeridoId && (!estadoRequerido || estadoRequerido.entidadId !== entidadId || estadoRequerido.suprimido)) {
      estado = "desconocida";
      noSoportado = true;
      motivo = `El estado requerido por el enlace ${enlace.id} no es válido para ${entidad.nombre}`;
    } else if (presencia?.estado === "conocido" && presencia.valor === "ausente") {
      estado = "incumplida";
      motivo = `${entidad.nombre} está declarado ausente en el escenario`;
    } else if (estadoRequeridoId) {
      if (estadoRuntime?.estado === "conocido") {
        estadoObservadoId = estadoRuntime.valor;
        const estadoObservado = modelo.estados[estadoRuntime.valor];
        if (!estadoObservado || estadoObservado.entidadId !== entidadId || estadoObservado.suprimido) {
          estado = "desconocida";
          noSoportado = true;
          motivo = `${entidad.nombre} tiene una referencia runtime de estado inválida`;
        } else {
          estado = estadoRuntime.valor === estadoRequeridoId ? "satisfecha" : "incumplida";
        }
        if (estado === "incumplida") {
          const requerido = modelo.estados[estadoRequeridoId]?.nombre ?? estadoRequeridoId;
          const observado = modelo.estados[estadoRuntime.valor]?.nombre ?? estadoRuntime.valor;
          motivo = `${entidad.nombre} está en ${observado}; el enlace requiere ${requerido}`;
        }
      } else {
        estado = "desconocida";
        motivo = `${entidad.nombre} no tiene un estado runtime conocido`;
      }
    } else if (estadoRuntime?.estado === "conocido") {
      // An explicit current state is evidence that the modeled object is present.
      estadoObservadoId = estadoRuntime.valor;
      const estadoObservado = modelo.estados[estadoRuntime.valor];
      if (!estadoObservado || estadoObservado.entidadId !== entidadId || estadoObservado.suprimido) {
        estado = "desconocida";
        noSoportado = true;
        motivo = `${entidad.nombre} tiene una referencia runtime de estado inválida`;
      } else {
        estado = "satisfecha";
      }
    } else if (presencia?.estado === "conocido") {
      estado = presencia.valor === "presente" ? "satisfecha" : "incumplida";
      if (estado === "incumplida") motivo = `${entidad.nombre} está declarado ausente en el escenario`;
    } else {
      estado = "desconocida";
      motivo = `${entidad.nombre} no tiene presencia declarada en el escenario`;
    }

    precondiciones.push({
      enlaceId: enlace.id,
      tipo: enlace.tipo,
      entidadId,
      ...(estadoRequeridoId ? { estadoRequeridoId } : {}),
      ...(estadoObservadoId ? { estadoObservadoId } : {}),
      estado,
      ...(motivo ? { motivo } : {}),
    });
  }

  if (noSoportado) return { estado: "no-soportado", precondiciones, motivos };
  if (precondiciones.some((item) => item.estado === "incumplida")) {
    return {
      estado: "impedidos",
      precondiciones,
      motivos: precondiciones.filter((item) => item.estado === "incumplida").map((item) => item.motivo ?? "Habilitador impedido"),
    };
  }
  if (precondiciones.some((item) => item.estado === "desconocida")) {
    return {
      estado: "no-conocidos",
      precondiciones,
      motivos: precondiciones.filter((item) => item.estado === "desconocida").map((item) => item.motivo ?? "Habilitador desconocido"),
    };
  }
  return { estado: "satisfechos", precondiciones, motivos };
}
