import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearModelo, crearObjeto, crearProceso } from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { estadosCurrentDeclarados } from "./plan";
import { desplegar, iniciarSimulacion, reiniciarSimulacion } from "./runner";
import {
  crearEscenario,
  validarEscenario,
  type EscenarioSimulacion,
  type ResultadoPasoEscenario,
} from "./scenario";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Fixture fail: ${resultado.error}`);
  return resultado.value;
}

function modeloConEstadosSinDesignacion(): { modelo: Modelo; objetoId: string; primeroId: string } {
  let modelo = crearModelo("Escenario explícito");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Pedido"));
  const objetoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Pedido")!.id;
  const estados = must(crearEstadosIniciales(modelo, objetoId));
  modelo = estados.modelo;
  const primeroId = estados.estadoIds[0]!;
  return { modelo, objetoId, primeroId };
}

describe("EscenarioSimulacion", () => {
  test("no inventa estado inicial cuando el modelo no lo designa", () => {
    const { modelo, objetoId } = modeloConEstadosSinDesignacion();
    expect(estadosCurrentDeclarados(modelo)[objetoId]).toBeUndefined();
  });

  test("conserva unknown como conocimiento del escenario sin crear un estado de dominio", () => {
    const { modelo, objetoId, primeroId } = modeloConEstadosSinDesignacion();
    const estados: Record<string, { estado: "conocido"; valor: string } | { estado: "desconocido"; motivo?: string }> = {
      [objetoId]: { estado: "desconocido", motivo: "no se observó el estado inicial" },
    };
    const presencia: Record<string, { estado: "conocido"; valor: "presente" | "ausente" } | { estado: "desconocido" }> = {
      [objetoId]: { estado: "conocido", valor: "presente" },
    };
    const supuestos = [{ id: "supuesto-1", descripcion: "Sin asumir el estado", referencias: [primeroId] }];
    const entrada: EscenarioSimulacion = {
      id: "scenario-1",
      modeloId: modelo.id,
      revisionBase: "rev-17",
      proposito: "Examinar disponibilidad de un pedido",
      alcanceIds: [objetoId],
      conocimientoInicial: { presencia, estadosCurrent: estados },
      supuestos,
      parametros: { intentos: 1 },
      capacidadesSoportadas: ["state-transition"],
    };

    const escenario = crearEscenario(entrada);
    expect(escenario.conocimientoInicial.estadosCurrent[objetoId]).toEqual({
      estado: "desconocido",
      motivo: "no se observó el estado inicial",
    });
    expect(escenario.conocimientoInicial.presencia[objetoId]).toEqual({ estado: "conocido", valor: "presente" });
    expect(escenario.alcanceIds).not.toBe(entrada.alcanceIds);
    expect(escenario.supuestos[0]?.referencias).not.toBe(supuestos[0]?.referencias);
    expect(validarEscenario(modelo, escenario)).toEqual({ ok: true, value: escenario });
    expect(Object.keys(modelo.estados)).toContain(primeroId);
    expect(Object.keys(modelo.estados)).not.toContain("desconocido");
  });

  test("rechaza una asignación de estado que pertenece a otra cosa", () => {
    const { modelo, objetoId, primeroId } = modeloConEstadosSinDesignacion();
    const otroModelo = crearModelo("Otro");
    const escenario = crearEscenario({
      id: "scenario-1",
      modeloId: modelo.id,
      revisionBase: 1,
      proposito: "Validar referencias",
      alcanceIds: [objetoId],
      conocimientoInicial: {
        presencia: {},
        estadosCurrent: { ["objeto-distinto"]: { estado: "conocido", valor: primeroId } },
      },
      supuestos: [],
      parametros: {},
      capacidadesSoportadas: [],
    });

    expect(validarEscenario(modelo, escenario)).toEqual({ ok: false, error: "Estado inicial inválido para objeto-distinto" });
    expect(validarEscenario(otroModelo, escenario).ok).toBe(false);
  });

  test("el runner fija la revisión del escenario y usa su conocimiento inicial explícito", () => {
    const { modelo, objetoId, primeroId } = modeloConEstadosSinDesignacion();
    const escenario = crearEscenario({
      id: "scenario-pinned",
      modeloId: modelo.id,
      revisionBase: "revision-4",
      proposito: "Fijar datos iniciales",
      alcanceIds: [objetoId],
      conocimientoInicial: {
        presencia: { [objetoId]: { estado: "conocido", valor: "presente" } },
        estadosCurrent: { [objetoId]: { estado: "conocido", valor: primeroId } },
      },
      supuestos: [],
      parametros: {},
      capacidadesSoportadas: [],
    });

    const inicial = iniciarSimulacion(modelo, modelo.opdRaizId, { escenario });
    const reiniciado = reiniciarSimulacion(modelo, inicial);

    expect(inicial.estadosCurrent[objetoId]).toBe(primeroId);
    expect(inicial.escenario?.revisionBase).toBe("revision-4");
    expect(reiniciado.escenario?.id).toBe("scenario-pinned");
    expect(reiniciado.estadosCurrent[objetoId]).toBe(primeroId);
  });

  test("el límite de pasos queda registrado como truncamiento", () => {
    let modelo = crearModelo("Truncado");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Ejecutar"));
    const salida = desplegar(modelo, iniciarSimulacion(modelo, modelo.opdRaizId), 0);
    expect(salida.estado).toBe("bloqueado");
    expect(salida.trace[0]?.resultadoEscenario).toBe("truncado");
  });

  test("preserva salidas distintas para espera, omisión, eventos, indeterminación, soporte y truncamiento", () => {
    const resultados: ResultadoPasoEscenario[] = [
      "espera",
      "omision",
      "evento-no-ocurrido",
      "evento-perdido",
      "indeterminado",
      "no-soportado",
      "truncado",
    ];
    expect(new Set(resultados).size).toBe(resultados.length);
  });
});
