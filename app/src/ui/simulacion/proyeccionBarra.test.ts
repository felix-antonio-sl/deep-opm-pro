import { describe, expect, test } from "bun:test";
import type { ContextoSimulacion, EntradaTraceSim } from "../../modelo/simulacion/tipos";
import type { Modelo } from "../../modelo/tipos";
import { faseTutorSimulacion } from "./BarraSimulacion";
import { proyectarDecisionXorSimulacion, proyectarEstadoBarraSimulacion, proyectarNarrativaSimulacion, rotuloTraceSimulacion } from "./proyeccionBarra";

describe("faseTutorSimulacion", () => {
  test("prioriza bloqueo, cierre y decisión antes del progreso", () => {
    expect(faseTutorSimulacion("bloqueado", 2, true, true)).toBe("blocked");
    expect(faseTutorSimulacion("completado", 2, true, true)).toBe("complete");
    expect(faseTutorSimulacion("ejecutando", 2, true, true)).toBe("decision");
  });

  test("distingue autoavance, paso manual y preflight desde estado real", () => {
    expect(faseTutorSimulacion("ejecutando", 0, true, false)).toBe("running");
    expect(faseTutorSimulacion("ejecutando", 1, false, false)).toBe("step");
    expect(faseTutorSimulacion("preparado", 0, false, false)).toBe("preflight");
  });
});

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

  test("F1.7: cuando no hay procesos, el copy es honesto y bloquea ejecución", () => {
    // BUG-20260608T171552Z-17477a ronda 2 (F1.7): antes el copy era
    // "Listo para simular · paso 0 de 0" y el botón estaba disabled — el
    // usuario veía un mensaje positivo y luego no podía actuar. Ahora
    // el copy es explícito y `puedeEjecutar: false` se propaga.
    const ctx = contexto({ plan: [], pasoActual: 0 });
    const ui = proyectarEstadoBarraSimulacion(ctx, true);
    expect(ui.textoProgreso).toBe("No hay procesos para simular");
    expect(ui.puedeEjecutar).toBe(false);
    expect(ui.bloqueado).toBe(false);
    expect(ui.completado).toBe(false);
  });

  test("presenta 'Listo' antes de iniciar aunque el motor ya preseleccione la primera fase", () => {
    const ui = proyectarEstadoBarraSimulacion(contexto({ faseActual: "consumo" }), false);

    expect(ui.textoProgreso).toBe("Listo para simular · paso 1 de 1");
  });

  test("presenta una transición manual activa como simulación y explicita su fase", () => {
    const ui = proyectarEstadoBarraSimulacion(contexto({
      estado: "ejecutando",
      faseActual: "proceso",
    }), false);

    expect(ui.textoProgreso).toBe("Simulando · paso 1 de 1 · fase: proceso");
    expect(ui.textoProgreso).not.toContain("Listo para simular");
  });

  test("presenta el autoavance como simulación incluso antes de activar su primera fase", () => {
    const ui = proyectarEstadoBarraSimulacion(contexto(), true);

    expect(ui.textoProgreso).toBe("Simulando · paso 1 de 1");
  });

  test("no confunde la fase de cierre con el estado completado de la corrida", () => {
    const ui = proyectarEstadoBarraSimulacion(contexto({
      estado: "ejecutando",
      faseActual: "cierre",
    }), false);

    expect(ui.textoProgreso).toBe("Simulando · paso 1 de 1 · fase: cierre");
    expect(ui.textoProgreso).not.toContain("completado");
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

    // BUG-20260608T171552Z-17477a ronda 2 (F1.19): el `modo` ya vive en
    // el segmented de la barra; no se duplica como chip en la narrativa.
    // Sin habilitadores no hay fase preparación: el primer beat con valor
    // semántico es el consumo (y con resultado, la lista omite el cierre).
    expect(ui).toEqual({
      tono: "neutro",
      titulo: "Consumo: Calentar",
      detalle: "Inicio del proceso: consume Agua: solidificada -> líquida por ruta sol-liq.",
      contexto: ["paso 1 de 1", "fase 1/3", "SD"],
    });
  });

  test("F1.19: narrativa sin procesos no emite chip 'sin plan'", () => {
    // BUG-20260608T171552Z-17477a ronda 2 (F1.19): el chip "sin plan" era
    // ruido — la marca `·` de la narrativa ya comunica estado de relleno.
    const ui = proyectarNarrativaSimulacion(modeloAgua(), contexto({ plan: [] }), false);
    expect(ui.tono).toBe("neutro");
    expect(ui.titulo).toBe("No hay procesos simulables");
    expect(ui.contexto).toEqual([]);
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
    // F1.19: contexto no incluye `modo` (duplicado con el segmented).
    expect(ui.contexto).toEqual(["1/1"]);
  });

  test("narra diagnósticos bloqueantes como alerta visible", () => {
    const ui = proyectarNarrativaSimulacion(modeloAgua(), contexto({
      estado: "bloqueado",
      trace: [entrada(1, { diagnostico: "No simulable: Agua no está en estado solidificada" })],
    }), true);

    // F1.19: contexto sin `modo` duplicado.
    expect(ui).toEqual({
      tono: "alerta",
      titulo: "Simulación bloqueada",
      detalle: "No simulable: Agua no está en estado solidificada",
      contexto: ["1/1"],
    });
  });
  test("decisión XOR: proyecta una opción por rama con rótulo y probabilidad", () => {
    const ramas = proyectarDecisionXorSimulacion(modeloVeredictoXor(), contexto());

    expect(ramas).toEqual([
      { enlaceId: "e1", rotulo: "aprobar", probabilidad: 0.7 },
      { enlaceId: "e2", rotulo: "Veredicto: rechazado", probabilidad: 0.3 },
    ]);
  });

  test("decisión XOR: sin etiqueta ni probabilidad el rótulo cae al estado destino", () => {
    const modelo = modeloVeredictoXor();
    const { probabilidad: _pr, ...sinPr } = modelo.enlaces["e1"]!;
    const enlaceSinMetadatos = { ...sinPr, etiqueta: "" };
    const ramas = proyectarDecisionXorSimulacion(
      { ...modelo, enlaces: { ...modelo.enlaces, e1: enlaceSinMetadatos } },
      contexto(),
    );

    expect(ramas?.[0]).toEqual({ enlaceId: "e1", rotulo: "Veredicto: aprobado" });
  });

  test("decisión XOR: sin abanico en el paso actual no hay opciones", () => {
    expect(proyectarDecisionXorSimulacion(modeloAgua(), contexto())).toBeNull();
  });

  test("decisión XOR: corrida completada no ofrece opciones", () => {
    expect(proyectarDecisionXorSimulacion(modeloVeredictoXor(), contexto({ estado: "completado" }))).toBeNull();
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

/** Proceso `p` (el de `pasoBase`) con abanico XOR de salida hacia dos estados de Veredicto. */
function modeloVeredictoXor(): Modelo {
  return {
    id: "m",
    nombre: "Modelo",
    opdRaizId: "opd",
    opds: {},
    entidades: {
      p: { id: "p", tipo: "proceso", nombre: "P", esencia: "informacional", afiliacion: "sistemica" },
      veredicto: { id: "veredicto", tipo: "objeto", nombre: "Veredicto", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {
      ok: { id: "ok", entidadId: "veredicto", nombre: "aprobado" },
      no: { id: "no", entidadId: "veredicto", nombre: "rechazado" },
    },
    enlaces: {
      e1: { id: "e1", tipo: "resultado", origenId: { kind: "entidad", id: "p" }, destinoId: { kind: "estado", id: "ok" }, etiqueta: "aprobar", probabilidad: 0.7 },
      e2: { id: "e2", tipo: "resultado", origenId: { kind: "entidad", id: "p" }, destinoId: { kind: "estado", id: "no" }, etiqueta: "", probabilidad: 0.3 },
    },
    abanicos: {
      ab1: { id: "ab1", opdId: "opd", puertoComun: { entidadId: "p", lado: "origen", portId: "puerto" }, puertoEntidadId: "p", operador: "XOR", enlaceIds: ["e1", "e2"] },
    },
    nextSeq: 1,
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
