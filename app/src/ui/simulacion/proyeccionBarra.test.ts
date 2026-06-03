import { describe, expect, test } from "bun:test";
import type { ContextoSimulacion, EntradaTraceSim } from "../../modelo/simulacion/tipos";
import { proyectarEstadoBarraSimulacion, rotuloTraceSimulacion } from "./proyeccionBarra";

describe("proyeccionBarraSimulacion", () => {
  test("proyecta bloqueo como estado no ejecutable con texto visible", () => {
    const ctx = contexto({
      estado: "bloqueado",
      trace: [entrada(1), entrada(2), entrada(3, { diagnostico: "Bloqueado: límite de 3 pasos alcanzado" })],
    });

    const ui = proyectarEstadoBarraSimulacion(ctx, true);

    expect(ui.bloqueado).toBe(true);
    expect(ui.puedeEjecutar).toBe(false);
    expect(ui.textoProgreso).toBe("Bloqueada · 3 pasos");
  });

  test("rotula pasos omitidos por condicion sin perder diagnostico", () => {
    const rotulo = rotuloTraceSimulacion(entrada(1, {
      omitido: true,
      diagnostico: "Omitido: condición no satisfecha (Pedido no existe)",
    }));

    expect(rotulo).toEqual({
      tipo: "omitido",
      texto: "omitido",
      titulo: "Omitido: condición no satisfecha (Pedido no existe)",
    });
  });

  test("rotula diagnosticos no omitidos como alerta compacta", () => {
    const rotulo = rotuloTraceSimulacion(entrada(1, {
      diagnostico: "No simulable: Pedido no está en estado pendiente",
    }));

    expect(rotulo).toEqual({
      tipo: "diagnostico",
      texto: "!",
      titulo: "No simulable: Pedido no está en estado pendiente",
    });
  });
});

function contexto(overrides: Partial<ContextoSimulacion> = {}): ContextoSimulacion {
  return {
    modeloId: "m",
    opdId: "opd",
    plan: [{
      opdId: "opd",
      opdNombre: "SD",
      profundidad: 0,
      procesoId: "p",
      procesoNombre: "P",
      ordenY: 0,
      enlacesEntradaIds: [],
      enlacesSalidaIds: [],
      transicionesPlanificadas: [],
    }],
    pasoActual: 0,
    estado: "preparado",
    estadosCurrent: {},
    valoresRuntime: {},
    trace: [],
    ...overrides,
  };
}

function entrada(numero: number, overrides: Partial<EntradaTraceSim> = {}): EntradaTraceSim {
  return {
    numero,
    opdId: "opd",
    opdNombre: "SD",
    procesoId: "p",
    procesoNombre: "P",
    transicionesAplicadas: [],
    cambiosValor: [],
    ...overrides,
  };
}
