import { describe, expect, test } from "bun:test";
import { contextoExternoDescomposicion } from "./contextoRefinamiento";
import { extremoEntidad } from "./extremos";
import {
  crearEnlace,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
} from "./operaciones";
import { listarAvisosVisuales } from "./diagnosticoVisual";
import type { Apariencia, AparienciaEnlace, Modelo, Resultado } from "./tipos";

describe("diagnostico visual", () => {
  test("detecta solape entre apariencias visibles que no son contorno", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 120, y: 96 }, "Procesar"));

    const avisos = listarAvisosVisuales(modelo, modelo.opdRaizId);

    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-solape-apariencias",
      severidad: "info",
      elementoTipo: "entidad",
      opdId: modelo.opdRaizId,
    }));
  });

  test("ignora el solape esperado entre contorno refinable y apariencias internas", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Procesar"));
    const procesoId = Object.values(modelo.entidades)[0]!.id;
    const descompuesto = descomponerProceso(modelo, modelo.opdRaizId, procesoId);
    if (!descompuesto.ok) throw new Error(descompuesto.error);
    modelo = descompuesto.value.modelo;

    const avisos = listarAvisosVisuales(modelo, descompuesto.value.opdId);

    expect(avisos.filter((aviso) => aviso.reglaId === "visual-solape-apariencias")).toEqual([]);
  });

  test("detecta enlace visible cuyo extremo no tiene apariencia local", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
    const [entradaId, procesarId] = Object.keys(modelo.entidades);
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entradaId!, procesarId!, "consumo"));
    const procesoAparienciaId = Object.values(modelo.opds[modelo.opdRaizId]!.apariencias)
      .find((apariencia) => apariencia.entidadId === procesarId)!.id;
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...modelo.opds[modelo.opdRaizId]!,
          apariencias: sinClave(modelo.opds[modelo.opdRaizId]!.apariencias, procesoAparienciaId),
        },
      },
    };

    const avisos = listarAvisosVisuales(modelo, modelo.opdRaizId);

    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-enlace-extremo-no-visible",
      severidad: "error",
      elementoTipo: "enlace",
      elementoId: Object.keys(modelo.enlaces)[0],
    }));
  });

  test("detecta cosa externa materializada dentro del contorno refinado", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Procesar"));
    const procesoId = Object.values(modelo.entidades)[0]!.id;
    const descompuesto = descomponerProceso(modelo, modelo.opdRaizId, procesoId);
    if (!descompuesto.ok) throw new Error(descompuesto.error);
    modelo = descompuesto.value.modelo;
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 20 }, "Actor externo"));

    const externoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Actor externo")!.id;
    const contorno = Object.values(modelo.opds[descompuesto.value.opdId]!.apariencias)
      .find((apariencia) => apariencia.entidadId === procesoId)!;
    const aparienciaExterna: Apariencia = {
      id: "a-externo-dentro",
      entidadId: externoId,
      opdId: descompuesto.value.opdId,
      x: contorno.x + 40,
      y: contorno.y + 60,
      width: 135,
      height: 60,
      contextoRefinamiento: contextoExternoDescomposicion(procesoId, contorno.id),
    };
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [descompuesto.value.opdId]: {
          ...modelo.opds[descompuesto.value.opdId]!,
          apariencias: {
            ...modelo.opds[descompuesto.value.opdId]!.apariencias,
            [aparienciaExterna.id]: aparienciaExterna,
          },
        },
      },
    };

    const avisos = listarAvisosVisuales(modelo, descompuesto.value.opdId);

    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-externo-dentro-contorno",
      severidad: "error",
      elementoTipo: "entidad",
      elementoId: externoId,
    }));
  });

  test("detecta puertos de enlace persistidos en el centro de la cosa", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
    const [entradaId, procesarId] = Object.keys(modelo.entidades);
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(entradaId!), extremoEntidad(procesarId!), "consumo"));
    const enlace = Object.values(modelo.enlaces)[0]!;
    const entradaApariencia = Object.values(modelo.opds[modelo.opdRaizId]!.apariencias)
      .find((apariencia) => apariencia.entidadId === entradaId)!;
    modelo = {
      ...modelo,
      enlaces: {
        ...modelo.enlaces,
        [enlace.id]: {
          ...enlace,
          origenId: { ...enlace.origenId, portId: "p-centro" },
        },
      },
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...modelo.opds[modelo.opdRaizId]!,
          apariencias: {
            ...modelo.opds[modelo.opdRaizId]!.apariencias,
            [entradaApariencia.id]: {
              ...entradaApariencia,
              ports: { "p-centro": { x: 0.5, y: 0.5 } },
            },
          },
        },
      },
    };

    const avisos = listarAvisosVisuales(modelo, modelo.opdRaizId);

    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-puerto-enlace-interior",
      elementoTipo: "enlace",
      elementoId: enlace.id,
    }));
  });

  test("detecta vertices no finitos en apariencias de enlace", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
    const [entradaId, procesarId] = Object.keys(modelo.entidades);
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entradaId!, procesarId!, "consumo"));
    const aparienciaEnlace = Object.values(modelo.opds[modelo.opdRaizId]!.enlaces)[0]!;
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...modelo.opds[modelo.opdRaizId]!,
          enlaces: {
            ...modelo.opds[modelo.opdRaizId]!.enlaces,
            [aparienciaEnlace.id]: {
              ...aparienciaEnlace,
              vertices: [{ x: Number.NaN, y: 120 }],
            },
          },
        },
      },
    };

    const avisos = listarAvisosVisuales(modelo, modelo.opdRaizId);

    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-vertices-enlace-invalidos",
      elementoTipo: "enlace",
      elementoId: aparienciaEnlace.enlaceId,
    }));
  });

  test("detecta apariencias con entidad ausente, OPD inconsistente o geometria invalida", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Entrada"));
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]!.apariencias)[0]!;
    const aparienciaFantasma: Apariencia = {
      id: "a-fantasma",
      entidadId: "entidad-fantasma",
      opdId: modelo.opdRaizId,
      x: 260,
      y: 80,
      width: 135,
      height: 60,
    };
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...modelo.opds[modelo.opdRaizId]!,
          apariencias: {
            ...modelo.opds[modelo.opdRaizId]!.apariencias,
            [apariencia.id]: {
              ...apariencia,
              opdId: "opd-ajeno",
              width: 0,
            },
            [aparienciaFantasma.id]: aparienciaFantasma,
          },
        },
      },
    };

    const avisos = listarAvisosVisuales(modelo, modelo.opdRaizId);

    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-apariencia-opd-inconsistente",
      elementoTipo: "entidad",
      elementoId: apariencia.entidadId,
    }));
    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-geometria-apariencia-invalida",
      elementoTipo: "entidad",
      elementoId: apariencia.entidadId,
    }));
    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-apariencia-entidad-inexistente",
      elementoTipo: "entidad",
      elementoId: aparienciaFantasma.entidadId,
    }));
  });

  test("detecta contexto de refinamiento y parte extraida huerfanos", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Parte visible"));
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]!.apariencias)[0]!;
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...modelo.opds[modelo.opdRaizId]!,
          apariencias: {
            ...modelo.opds[modelo.opdRaizId]!.apariencias,
            [apariencia.id]: {
              ...apariencia,
              contextoRefinamiento: {
                tipo: "descomposicion",
                refinableEntidadId: "proceso-ausente",
                rol: "externo",
                contenedorAparienciaId: "contenedor-ausente",
              },
              parteExtraidaDe: {
                padreAparienciaId: "padre-ausente",
                parteEntidadId: "parte-ausente",
              },
            },
          },
        },
      },
    };

    const avisos = listarAvisosVisuales(modelo, modelo.opdRaizId);

    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-contexto-refinamiento-huerfano",
      elementoTipo: "entidad",
      elementoId: apariencia.entidadId,
    }));
    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-parte-extraida-huerfana",
      elementoTipo: "entidad",
      elementoId: apariencia.entidadId,
    }));
  });

  test("detecta enlaces visibles con OPD inconsistente o extremo logico ausente", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
    const [entradaId, procesarId] = Object.keys(modelo.entidades);
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entradaId!, procesarId!, "consumo"));
    const enlace = Object.values(modelo.enlaces)[0]!;
    const aparienciaEnlace = Object.values(modelo.opds[modelo.opdRaizId]!.enlaces)[0]!;
    modelo = {
      ...modelo,
      enlaces: {
        ...modelo.enlaces,
        [enlace.id]: {
          ...enlace,
          destinoId: extremoEntidad("entidad-ausente"),
        },
      },
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...modelo.opds[modelo.opdRaizId]!,
          enlaces: {
            ...modelo.opds[modelo.opdRaizId]!.enlaces,
            [aparienciaEnlace.id]: {
              ...aparienciaEnlace,
              opdId: "opd-ajeno",
            },
          },
        },
      },
    };

    const avisos = listarAvisosVisuales(modelo, modelo.opdRaizId);

    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-enlace-opd-inconsistente",
      elementoTipo: "enlace",
      elementoId: enlace.id,
    }));
    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-enlace-extremo-logico-inexistente",
      elementoTipo: "enlace",
      elementoId: enlace.id,
    }));
  });

  test("detecta puerto referenciado por enlace que no existe en la apariencia", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
    const [entradaId, procesarId] = Object.keys(modelo.entidades);
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entradaId!, procesarId!, "consumo"));
    const enlace = Object.values(modelo.enlaces)[0]!;
    modelo = {
      ...modelo,
      enlaces: {
        ...modelo.enlaces,
        [enlace.id]: {
          ...enlace,
          origenId: { ...enlace.origenId, portId: "puerto-ausente" },
        },
      },
    };

    const avisos = listarAvisosVisuales(modelo, modelo.opdRaizId);

    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-puerto-enlace-inexistente",
      elementoTipo: "enlace",
      elementoId: enlace.id,
    }));
  });

  test("detecta puertos declarados con coordenadas fuera del rango relativo", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Entrada"));
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]!.apariencias)[0]!;
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...modelo.opds[modelo.opdRaizId]!,
          apariencias: {
            ...modelo.opds[modelo.opdRaizId]!.apariencias,
            [apariencia.id]: {
              ...apariencia,
              ports: { "p-fuera": { x: 1.2, y: 0.5 } },
            },
          },
        },
      },
    };

    const avisos = listarAvisosVisuales(modelo, modelo.opdRaizId);

    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-puerto-coordenadas-invalidas",
      elementoTipo: "entidad",
      elementoId: apariencia.entidadId,
    }));
  });

  test("detecta labels y simbolos estructurales con metadata no finita", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Parte"));
    const [todoId, parteId] = Object.keys(modelo.entidades);
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId!, parteId!, "agregacion"));
    const aparienciaEnlace = Object.values(modelo.opds[modelo.opdRaizId]!.enlaces)[0]!;
    const corrupta: AparienciaEnlace = {
      ...aparienciaEnlace,
      symbolPos: { x: Number.NaN, y: 120 },
      symbolAnchors: { refinable: { dx: Number.POSITIVE_INFINITY, dy: 0 } },
      labelPositions: { etiqueta: { distance: Number.NaN } },
    };
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...modelo.opds[modelo.opdRaizId]!,
          enlaces: {
            ...modelo.opds[modelo.opdRaizId]!.enlaces,
            [aparienciaEnlace.id]: corrupta,
          },
        },
      },
    };

    const avisos = listarAvisosVisuales(modelo, modelo.opdRaizId);

    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-simbolo-estructural-invalido",
      elementoTipo: "enlace",
      elementoId: aparienciaEnlace.enlaceId,
    }));
    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-label-enlace-invalida",
      elementoTipo: "enlace",
      elementoId: aparienciaEnlace.enlaceId,
    }));
  });

  test("detecta enlace transformador visible en contorno que no fue distribuido", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 120 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 120 }, "Procesar"));
    const entrada = entidadPorNombre(modelo, "Entrada");
    const procesar = entidadPorNombre(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entrada.id, procesar.id, "consumo"));
    const enlacePadre = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "consumo" && !enlace.derivado);
    if (!enlacePadre) throw new Error("La prueba esperaba enlace padre");
    const descompuesto = descomponerProceso(modelo, modelo.opdRaizId, procesar.id);
    if (!descompuesto.ok) throw new Error(descompuesto.error);
    modelo = descompuesto.value.modelo;
    const opdHijo = modelo.opds[descompuesto.value.opdId]!;
    const derivadosVisibles = new Set(Object.values(opdHijo.enlaces)
      .filter((apariencia) => modelo.enlaces[apariencia.enlaceId]?.derivado)
      .map((apariencia) => apariencia.id));
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [opdHijo.id]: {
          ...opdHijo,
          enlaces: {
            ...Object.fromEntries(Object.entries(opdHijo.enlaces).filter(([id]) => !derivadosVisibles.has(id))),
            "ae-contorno": { id: "ae-contorno", enlaceId: enlacePadre.id, opdId: opdHijo.id, vertices: [] },
          },
        },
      },
    };

    const avisos = listarAvisosVisuales(modelo, opdHijo.id);

    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-transformador-contorno-no-distribuido",
      elementoTipo: "enlace",
      elementoId: enlacePadre.id,
      opdId: opdHijo.id,
    }));
  });

  test("no marca contorno si existe una proyección transformadora al subproceso", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 120 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 120 }, "Procesar"));
    const entrada = entidadPorNombre(modelo, "Entrada");
    const procesar = entidadPorNombre(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entrada.id, procesar.id, "consumo"));
    const enlacePadre = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "consumo" && !enlace.derivado);
    if (!enlacePadre) throw new Error("La prueba esperaba enlace padre");
    const descompuesto = descomponerProceso(modelo, modelo.opdRaizId, procesar.id);
    if (!descompuesto.ok) throw new Error(descompuesto.error);
    modelo = descompuesto.value.modelo;
    const opdHijo = modelo.opds[descompuesto.value.opdId]!;
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [opdHijo.id]: {
          ...opdHijo,
          enlaces: {
            ...opdHijo.enlaces,
            "ae-contorno": { id: "ae-contorno", enlaceId: enlacePadre.id, opdId: opdHijo.id, vertices: [] },
          },
        },
      },
    };

    const avisos = listarAvisosVisuales(modelo, opdHijo.id);

    expect(avisos.filter((aviso) =>
      aviso.reglaId === "visual-transformador-contorno-no-distribuido" &&
      aviso.elementoId === enlacePadre.id
    )).toEqual([]);
  });

  test("detecta subproceso interno sin objeto transformado", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 120 }, "Procesar"));
    const procesar = entidadPorNombre(modelo, "Procesar");
    const descompuesto = descomponerProceso(modelo, modelo.opdRaizId, procesar.id);
    if (!descompuesto.ok) throw new Error(descompuesto.error);
    modelo = descompuesto.value.modelo;
    const subproceso = entidadPorNombre(modelo, "Procesar 1");

    const avisos = listarAvisosVisuales(modelo, descompuesto.value.opdId);

    expect(avisos).toContainEqual(expect.objectContaining({
      reglaId: "visual-subproceso-sin-transformado",
      elementoTipo: "entidad",
      elementoId: subproceso.id,
      opdId: descompuesto.value.opdId,
    }));
  });

  test("no marca subprocesos que transforman objetos visibles", () => {
    let modelo = crearModelo("Visual");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 120 }, "Procesar"));
    const procesar = entidadPorNombre(modelo, "Procesar");
    const descompuesto = descomponerProceso(modelo, modelo.opdRaizId, procesar.id);
    if (!descompuesto.ok) throw new Error(descompuesto.error);
    modelo = descompuesto.value.modelo;
    modelo = must(crearObjeto(modelo, descompuesto.value.opdId, { x: 520, y: 180 }, "Insumo"));
    const insumo = entidadPorNombre(modelo, "Insumo");
    for (const nombre of ["Procesar 1", "Procesar 2", "Procesar 3"]) {
      const subproceso = entidadPorNombre(modelo, nombre);
      modelo = must(crearEnlace(modelo, descompuesto.value.opdId, insumo.id, subproceso.id, "consumo"));
    }

    const avisos = listarAvisosVisuales(modelo, descompuesto.value.opdId);

    expect(avisos.filter((aviso) => aviso.reglaId === "visual-subproceso-sin-transformado")).toEqual([]);
  });
});

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function entidadPorNombre(modelo: Modelo, nombre: string): { id: string } {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad;
}

function sinClave<T>(record: Record<string, T>, key: string): Record<string, T> {
  const siguiente = { ...record };
  delete siguiente[key];
  return siguiente;
}
