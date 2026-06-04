import { describe, expect, test } from "bun:test";
import type { ContextoSimulacion, EntradaTraceSim } from "../../modelo/simulacion/tipos";
import type { Modelo } from "../../modelo/tipos";
import { proyectarEstadoBarraSimulacion, proyectarNarrativaSimulacion, rotuloTraceSimulacion } from "./proyeccionBarra";

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

  test("narra el próximo paso con objeto, estados y ruta vigente", () => {
    const ui = proyectarNarrativaSimulacion(modeloAgua(), contexto({
      estadosCurrent: { agua: "s1" },
      plan: [{
        ...pasoBase(),
        procesoNombre: "Calentar",
        transicionesPlanificadas: [
          { entidadId: "agua", estadoAntesId: "s1", estadoDespuesId: "s2", rutaEtiqueta: "sol-liq" },
        ],
      }],
    }), false);

    expect(ui).toEqual({
      tono: "neutro",
      titulo: "Próximo: Calentar",
      detalle: "Aplicará Agua: solidificada -> líquida por ruta sol-liq.",
      contexto: ["paso 1 de 1", "SD", "determinista"],
    });
  });

  test("narra la corrida completada desde la última entrada de trace", () => {
    const ui = proyectarNarrativaSimulacion(modeloAgua(), contexto({
      estado: "completado",
      pasoActual: 1,
      trace: [entrada(1, {
        procesoNombre: "Calentar",
        transicionesAplicadas: [
          { entidadId: "agua", estadoAntesId: "s2", estadoDespuesId: "s3", rutaEtiqueta: "liq-gas" },
        ],
      })],
    }), false);

    expect(ui.tono).toBe("exito");
    expect(ui.titulo).toBe("Simulación completada");
    expect(ui.detalle).toBe("Aplicó Agua: líquida -> gaseosa por ruta liq-gas.");
  });

  test("narra diagnósticos bloqueantes como alerta visible", () => {
    const ui = proyectarNarrativaSimulacion(modeloAgua(), contexto({
      estado: "bloqueado",
      trace: [entrada(1, { diagnostico: "No simulable: Agua no está en estado solidificada" })],
    }), true);

    expect(ui).toEqual({
      tono: "alerta",
      titulo: "Simulación bloqueada",
      detalle: "No simulable: Agua no está en estado solidificada",
      contexto: ["1/1", "determinista"],
    });
  });
});

function contexto(overrides: Partial<ContextoSimulacion> = {}): ContextoSimulacion {
  return {
    modeloId: "m",
    opdId: "opd",
    plan: [pasoBase()],
    pasoActual: 0,
    estado: "preparado",
    estadosCurrent: {},
    valoresRuntime: {},
    trace: [],
    ...overrides,
  };
}

function pasoBase(): ContextoSimulacion["plan"][number] {
  return {
    opdId: "opd",
    opdNombre: "SD",
    profundidad: 0,
    procesoId: "p",
    procesoNombre: "P",
    ordenY: 0,
    enlacesEntradaIds: [],
    enlacesSalidaIds: [],
    transicionesPlanificadas: [],
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

function modeloAgua(): Modelo {
  return {
    id: "m",
    nombre: "Modelo",
    opdRaizId: "opd",
    opds: {},
    entidades: {
      agua: { id: "agua", tipo: "objeto", nombre: "Agua", esencia: "fisica", afiliacion: "sistemica" },
    },
    estados: {
      s1: { id: "s1", entidadId: "agua", nombre: "solidificada" },
      s2: { id: "s2", entidadId: "agua", nombre: "líquida" },
      s3: { id: "s3", entidadId: "agua", nombre: "gaseosa" },
    },
    enlaces: {},
    nextSeq: 1,
  };
}
