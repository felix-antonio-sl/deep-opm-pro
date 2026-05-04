import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso, descomponerProceso } from "../modelo/operaciones";
import type { Modelo } from "../modelo/tipos";
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

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
