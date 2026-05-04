import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso, descomponerProceso, desplegarObjeto } from "../modelo/operaciones";
import { cambiarModoPlegado } from "../modelo/plegado";
import type { Apariencia, Modelo, ModoDespliegueObjeto, RefinamientoEntidad, TipoEnlace } from "../modelo/tipos";
import { exportarModelo, hidratarModelo } from "./json";

describe("serializacion JSON", () => {
  test("hace round-trip del modelo minimo", () => {
    const creado = crearObjeto(crearModelo("Prueba"), "opd-1", { x: 10, y: 20 }, "Sistema");
    expect(creado.ok).toBe(true);
    if (!creado.ok) return;

    const json = exportarModelo(creado.value);
    const hidratado = hidratarModelo(json);

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.nombre).toBe("Prueba");
    expect(Object.values(hidratado.value.entidades)[0]?.nombre).toBe("Sistema");
  });

  test("normaliza padreId faltante en documentos anteriores", () => {
    const modelo = crearModelo("Legacy");
    const json = JSON.stringify({
      formato: "deep-opm-pro.modelo.v0",
      modelo: {
        ...modelo,
        opds: {
          [modelo.opdRaizId]: {
            id: modelo.opdRaizId,
            nombre: "SD",
            apariencias: {},
            enlaces: {},
          },
          "opd-2": {
            id: "opd-2",
            nombre: "SD1",
            apariencias: {},
            enlaces: {},
          },
        },
      },
    });

    const hidratado = hidratarModelo(json);

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.opds[modelo.opdRaizId]?.padreId).toBeNull();
    expect(hidratado.value.opds["opd-2"]?.padreId).toBe(modelo.opdRaizId);
  });

  test("rechaza OPDs corruptos antes de que lleguen al renderer", () => {
    const modelo = crearModelo("Corrupto");
    const json = JSON.stringify({
      formato: "deep-opm-pro.modelo.v0",
      modelo: {
        ...modelo,
        opds: {
          [modelo.opdRaizId]: null,
        },
      },
    });

    const hidratado = hidratarModelo(json);

    expect(hidratado.ok).toBe(false);
    if (hidratado.ok) return;
    expect(hidratado.error).toContain("OPD inválido");
  });

  test("rechaza apariencias que apuntan a entidades inexistentes", () => {
    const modelo = crearModelo("Referencia rota");
    const opd = modelo.opds[modelo.opdRaizId];
    expect(opd).toBeDefined();
    if (!opd) return;
    const json = JSON.stringify({
      formato: "deep-opm-pro.modelo.v0",
      modelo: {
        ...modelo,
        opds: {
          [modelo.opdRaizId]: {
            ...opd,
            apariencias: {
              "a-rota": {
                id: "a-rota",
                entidadId: "missing",
                opdId: modelo.opdRaizId,
                x: 0,
                y: 0,
                width: 135,
                height: 60,
              },
            },
          },
        },
      },
    });

    const hidratado = hidratarModelo(json);

    expect(hidratado.ok).toBe(false);
    if (hidratado.ok) return;
    expect(hidratado.error).toContain("entidadId");
  });

  test("rechaza enlaces con firma OPM ilegal", () => {
    let modelo = crearModelo("Firma rota");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Objeto A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Objeto B"));
    const entidades = Object.values(modelo.entidades);
    const origen = entidades[0];
    const destino = entidades[1];
    expect(origen).toBeDefined();
    expect(destino).toBeDefined();
    if (!origen || !destino) return;
    const corrupto: Modelo = {
      ...modelo,
      enlaces: {
        "e-roto": {
          id: "e-roto",
          tipo: "resultado",
          origenId: origen.id,
          destinoId: destino.id,
          etiqueta: "",
        },
      },
      opds: {
        [modelo.opdRaizId]: {
          ...modelo.opds[modelo.opdRaizId]!,
          enlaces: {
            "ae-roto": {
              id: "ae-roto",
              enlaceId: "e-roto",
              opdId: modelo.opdRaizId,
              vertices: [],
            },
          },
        },
      },
    };

    const hidratado = hidratarModelo(exportarModelo(corrupto));

    expect(hidratado.ok).toBe(false);
    if (hidratado.ok) return;
    expect(hidratado.error).toContain("firma");
  });

  test("rechaza apariencias de enlace cuyos extremos no son visibles en el OPD", () => {
    let modelo = crearModelo("Endpoints invisibles");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Objeto"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Proceso"));
    modelo = must(crearEnlace(
      modelo,
      modelo.opdRaizId,
      entidadPorNombre(modelo, "Objeto"),
      entidadPorNombre(modelo, "Proceso"),
      "instrumento",
    ));
    const enlace = Object.values(modelo.enlaces)[0];
    expect(enlace).toBeDefined();
    if (!enlace) return;
    const opds: Modelo["opds"] = {
      ...modelo.opds,
      "opd-2": {
        id: "opd-2",
        nombre: "SD1",
        padreId: modelo.opdRaizId,
        apariencias: {},
        enlaces: {
          "ae-invisible": {
            id: "ae-invisible",
            enlaceId: enlace.id,
            opdId: "opd-2",
            vertices: [],
          },
        },
      },
    };

    const hidratado = hidratarModelo(exportarModelo({ ...modelo, opds }));

    expect(hidratado.ok).toBe(false);
    if (hidratado.ok) return;
    expect(hidratado.error).toContain("endpoints");
  });

  test("rechaza enlaces globales sin apariencia en ningun OPD", () => {
    let modelo = crearModelo("Enlace invisible");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Objeto"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Proceso"));
    modelo = must(crearEnlace(
      modelo,
      modelo.opdRaizId,
      entidadPorNombre(modelo, "Objeto"),
      entidadPorNombre(modelo, "Proceso"),
      "instrumento",
    ));
    const opd = modelo.opds[modelo.opdRaizId];
    expect(opd).toBeDefined();
    if (!opd) return;
    const opds: Modelo["opds"] = {
      ...modelo.opds,
      [opd.id]: { ...opd, enlaces: {} },
    };
    const corrupto: Modelo = {
      ...modelo,
      opds,
    };

    const hidratado = hidratarModelo(exportarModelo(corrupto));

    expect(hidratado.ok).toBe(false);
    if (hidratado.ok) return;
    expect(hidratado.error).toContain("apariencia");
  });

  test("preserva refinamiento por descomposicion en round-trip", () => {
    let modelo = crearModelo("Descomposicion");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Atender Paciente"));
    const procesoId = entidadPorNombre(modelo, "Atender Paciente");
    modelo = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId)).modelo;

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.entidades[procesoId]?.refinamiento?.tipo).toBe("descomposicion");
    const opdHijoId = hidratado.value.entidades[procesoId]?.refinamiento?.opdId;
    expect(opdHijoId).toBeDefined();
    if (!opdHijoId) return;
    expect(hidratado.value.opds[opdHijoId]?.padreId).toBe(modelo.opdRaizId);
  });

  test("preserva metadatos de enlaces derivados en round-trip", () => {
    let modelo = crearModelo("Derivados");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 100 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 120 }, "Procesar"));
    const entradaId = entidadPorNombre(modelo, "Entrada");
    const procesarId = entidadPorNombre(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entradaId, procesarId, "consumo"));
    const enlacePadreId = Object.values(modelo.enlaces)[0]?.id;
    expect(enlacePadreId).toBeDefined();
    if (!enlacePadreId) return;
    modelo = must(descomponerProceso(modelo, modelo.opdRaizId, procesarId)).modelo;

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(Object.values(hidratado.value.enlaces)).toContainEqual(expect.objectContaining({
      tipo: "consumo",
      derivado: {
        tipo: "enlace-externo-refinamiento",
        refinamientoId: procesarId,
        enlacePadreId,
      },
    }));
  });

  test("preserva refinamiento por despliegue en round-trip", () => {
    let modelo = crearModelo("Despliegue");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.entidades[objetoId]?.refinamiento?.tipo).toBe("despliegue");
    const opdHijoId = hidratado.value.entidades[objetoId]?.refinamiento?.opdId;
    expect(opdHijoId).toBeDefined();
    if (!opdHijoId) return;
    expect(hidratado.value.opds[opdHijoId]?.padreId).toBe(modelo.opdRaizId);
    const agregaciones = Object.values(hidratado.value.enlaces).filter((enlace) => enlace.tipo === "agregacion" && enlace.origenId === objetoId);
    expect(agregaciones).toHaveLength(3);
  });

  test("preserva despliegues exhibicion/generalizacion/clasificacion en round-trip", () => {
    const casos: Array<{ modo: ModoDespliegueObjeto; tipo: TipoEnlace }> = [
      { modo: "exhibicion", tipo: "exhibicion" },
      { modo: "generalizacion", tipo: "generalizacion" },
      { modo: "clasificacion", tipo: "clasificacion" },
    ];

    for (const caso of casos) {
      let modelo = crearModelo(`Despliegue ${caso.modo}`);
      modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
      const objetoId = entidadPorNombre(modelo, "Vehiculo");
      modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId, caso.modo)).modelo;

      const hidratado = hidratarModelo(exportarModelo(modelo));

      expect(hidratado.ok).toBe(true);
      if (!hidratado.ok) return;
      expect(hidratado.value.entidades[objetoId]?.refinamiento?.modo).toBe(caso.modo);
      const enlaces = Object.values(hidratado.value.enlaces).filter((enlace) => enlace.tipo === caso.tipo && enlace.origenId === objetoId);
      expect(enlaces).toHaveLength(3);
    }
  });

  test("hidratar despliegue legacy sin modo asume agregacion", () => {
    let modelo = crearModelo("Legacy despliegue");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;
    const entidad = modelo.entidades[objetoId];
    expect(entidad?.refinamiento).toBeDefined();
    if (!entidad?.refinamiento) return;
    const json = JSON.stringify({
      formato: "deep-opm-pro.modelo.v0",
      modelo: {
        ...modelo,
        entidades: {
          ...modelo.entidades,
          [objetoId]: {
            ...entidad,
            refinamiento: sinModoDespliegue(entidad.refinamiento),
          },
        },
      },
    });

    const hidratado = hidratarModelo(json);

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.entidades[objetoId]?.refinamiento?.modo).toBe("agregacion");
  });

  test("round-trip preserva apariencia.modoPlegado parcial", () => {
    let modelo = crearModelo("Plegado parcial");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;
    const apariencia = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, apariencia.id, "parcial"));

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.opds[modelo.opdRaizId]?.apariencias[apariencia.id]?.modoPlegado).toBe("parcial");
  });

  test("hidratar modelo sin modoPlegado asume completo", () => {
    let modelo = crearModelo("Legacy plegado");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    const apariencia = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    const json = JSON.stringify({
      formato: "deep-opm-pro.modelo.v0",
      modelo: {
        ...modelo,
        opds: {
          [modelo.opdRaizId]: {
            ...modelo.opds[modelo.opdRaizId],
            apariencias: {
              [apariencia.id]: sinModoPlegado(apariencia),
            },
          },
        },
      },
    });

    const hidratado = hidratarModelo(json);

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.opds[modelo.opdRaizId]?.apariencias[apariencia.id]?.modoPlegado).toBe("completo");
  });

  test("rechaza refinamiento que apunta a OPD inexistente", () => {
    let modelo = crearModelo("Refinamiento roto");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Proceso"));
    const procesoId = entidadPorNombre(modelo, "Proceso");
    const corrupto: Modelo = {
      ...modelo,
      entidades: {
        ...modelo.entidades,
        [procesoId]: {
          ...modelo.entidades[procesoId]!,
          refinamiento: {
            tipo: "descomposicion",
            opdId: "opd-inexistente",
          },
        },
      },
    };

    const hidratado = hidratarModelo(exportarModelo(corrupto));

    expect(hidratado.ok).toBe(false);
    if (hidratado.ok) return;
    expect(hidratado.error).toContain("Refinamiento inválido");
  });
});

function entidadPorNombre(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  expect(entidad).toBeDefined();
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function aparienciaDeEntidad(modelo: Modelo, opdId: string, entidadId: string): Apariencia {
  const apariencia = Object.values(modelo.opds[opdId]?.apariencias ?? {})
    .find((item) => item.entidadId === entidadId);
  expect(apariencia).toBeDefined();
  if (!apariencia) throw new Error(`Apariencia no encontrada: ${entidadId}`);
  return apariencia;
}

function sinModoPlegado(apariencia: Apariencia): Omit<Apariencia, "modoPlegado"> {
  const { modoPlegado: _modoPlegado, ...sinModo } = apariencia;
  return sinModo;
}

function sinModoDespliegue(refinamiento: RefinamientoEntidad): Omit<RefinamientoEntidad, "modo"> {
  const { modo: _modo, ...sinModo } = refinamiento;
  return sinModo;
}

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
