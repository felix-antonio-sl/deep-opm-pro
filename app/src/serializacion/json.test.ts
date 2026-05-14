import { describe, expect, test } from "bun:test";
import { extremoApuntaAEntidad, extremoEntidad, extremoEstado } from "../modelo/extremos";
import { aplicarModificador, definirDemora, definirProbabilidad } from "../modelo/modificadores";
import { aplicarEstiloApariencia } from "../modelo/estilos";
import { actualizarPosicionSimboloEstructural, ajustarMultiplicidad, crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, definirBackwardTag, definirRequisitosEnlace, definirTasaEnlace, designarEstadoFinal, designarEstadoInicial, descomponerProceso, desplegarObjeto, reanclarEnlaceExternoDerivado, sincronizarPuertosEnlaces } from "../modelo/operaciones";
import { renombrarEtiquetaEnlace } from "../modelo/etiquetasEnlace";
import { cambiarModoPlegado, extraerParteDePlegado, partesExtraidasEn } from "../modelo/plegado";
import { definirRutaEtiqueta } from "../modelo/rutas";
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

  test("preserva descripcion opcional del modelo y acepta legacy sin descripcion", () => {
    const modelo = { ...crearModelo("Con descripción"), descripcion: "Contexto del modelo" };
    const exportado = JSON.parse(exportarModelo(modelo));
    expect(exportado.modelo.descripcion).toBe("Contexto del modelo");

    const hidratado = hidratarModelo(JSON.stringify(exportado));
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.descripcion).toBe("Contexto del modelo");

    delete exportado.modelo.descripcion;
    const legacy = hidratarModelo(JSON.stringify(exportado));
    expect(legacy.ok).toBe(true);
    if (!legacy.ok) return;
    expect(legacy.value.descripcion).toBeUndefined();
  });

  test("preserva symbolPos y symbolAnchors de apariencias de enlace estructural", () => {
    let modelo = crearModelo("Simbolo estructural");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 20 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 240, y: 120 }, "Parte"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte"), "agregacion"));
    const aparienciaEnlaceId = Object.keys(modelo.opds[modelo.opdRaizId]!.enlaces)[0]!;
    modelo = must(actualizarPosicionSimboloEstructural(modelo, modelo.opdRaizId, [aparienciaEnlaceId], { x: 180, y: 230 }, {
      [aparienciaEnlaceId]: {
        refinable: { dx: 0, dy: -15 },
        refinador: { dx: 6, dy: 15 },
      },
    }));

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlaceId]?.symbolPos).toEqual({ x: 180, y: 230 });
    expect(hidratado.value.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlaceId]?.symbolAnchors).toEqual({
      refinable: { dx: 0, dy: -15 },
      refinador: { dx: 6, dy: 15 },
    });
  });

  test("preserva orderedFundamentalTypes de entidad refinable", () => {
    let modelo = crearModelo("Orden estructural");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 20 }, "Todo"));
    const todoId = entidadPorNombre(modelo, "Todo");
    modelo = {
      ...modelo,
      entidades: {
        ...modelo.entidades,
        [todoId]: {
          ...modelo.entidades[todoId]!,
          orderedFundamentalTypes: ["agregacion", "exhibicion"],
        },
      },
    };

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.entidades[todoId]?.orderedFundamentalTypes).toEqual(["agregacion", "exhibicion"]);
  });

  test("preserva estados y designaciones en round-trip", () => {
    let modelo = crearModelo("Estados");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Semaforo"));
    const objetoId = entidadPorNombre(modelo, "Semaforo");
    modelo = must(crearEstadosIniciales(modelo, objetoId)).modelo;
    const estados = Object.values(modelo.estados).filter((estado) => estado.entidadId === objetoId);
    const primero = estados[0];
    const segundo = estados[1];
    expect(primero).toBeDefined();
    expect(segundo).toBeDefined();
    if (!primero || !segundo) return;
    modelo = must(designarEstadoInicial(modelo, primero.id));
    modelo = must(designarEstadoFinal(modelo, segundo.id));

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.estados[primero.id]).toMatchObject({ nombre: "estado1", esInicial: true });
    expect(hidratado.value.estados[segundo.id]).toMatchObject({ nombre: "estado2", esFinal: true });
  });

  test("preserva extremos Estado de enlaces procedurales en round-trip", () => {
    let modelo = crearModelo("Extremos estado");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 240, y: 20 }, "Aprobar"));
    const pedidoId = entidadPorNombre(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [pendiente] = Object.values(modelo.estados).filter((estado) => estado.entidadId === pedidoId);
    if (!pendiente) throw new Error("La prueba esperaba estado");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendiente.id), entidadPorNombre(modelo, "Aprobar"), "consumo"));
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    expect(enlaceId).toBeDefined();
    if (!enlaceId) return;

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.enlaces[enlaceId]?.origenId).toEqual(extremoEstado(pendiente.id));
  });

  test("preserva ordenPartes opcional en apariencia y acepta legacy sin campo", () => {
    let modelo = crearModelo("Orden partes");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})
      .find((item) => item.entidadId === objetoId);
    if (!apariencia) throw new Error("La prueba esperaba apariencia");
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...modelo.opds[modelo.opdRaizId]!,
          apariencias: {
            ...modelo.opds[modelo.opdRaizId]!.apariencias,
            [apariencia.id]: { ...apariencia, modoPlegado: "parcial", ordenPartes: "creacion" },
          },
        },
      },
    };

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    const aparienciaHidratada = Object.values(hidratado.value.opds[hidratado.value.opdRaizId]?.apariencias ?? {})
      .find((item) => item.entidadId === objetoId);
    expect(aparienciaHidratada?.ordenPartes).toBe("creacion");

    const documentoLegacy = JSON.parse(exportarModelo(modelo));
    delete documentoLegacy.modelo.opds[modelo.opdRaizId].apariencias[apariencia.id].ordenPartes;
    const legacy = hidratarModelo(JSON.stringify(documentoLegacy));
    expect(legacy.ok).toBe(true);
    if (!legacy.ok) return;
    const aparienciaLegacy = Object.values(legacy.value.opds[legacy.value.opdRaizId]?.apariencias ?? {})
      .find((item) => item.entidadId === objetoId);
    expect(aparienciaLegacy?.ordenPartes).toBeUndefined();
  });

  test("hidrata legacy sin estilo y hace round-trip de estilo de apariencia", () => {
    let modelo = crearModelo("Estilo JSON");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Sistema"));
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!apariencia) throw new Error("La prueba esperaba apariencia");

    const documentoLegacy = JSON.parse(exportarModelo(modelo));
    delete documentoLegacy.modelo.opds[modelo.opdRaizId].apariencias[apariencia.id].estilo;
    const legacy = hidratarModelo(JSON.stringify(documentoLegacy));
    expect(legacy.ok).toBe(true);
    if (!legacy.ok) return;
    expect(legacy.value.opds[modelo.opdRaizId]?.apariencias[apariencia.id]?.estilo).toBeUndefined();

    modelo = must(aplicarEstiloApariencia(modelo, modelo.opdRaizId, apariencia.id, {
      fill: "#fef3c7",
      borderColor: "#3BC3FF",
    }));
    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.opds[modelo.opdRaizId]?.apariencias[apariencia.id]?.estilo).toEqual({
      fill: "#fef3c7",
      borderColor: "#3bc3ff",
    });
  });

  test("no serializa estado UI transitorio de selección ni portapapeles visual", () => {
    const modelo = crearModelo();
    const exportado = exportarModelo({
      ...modelo,
      seleccionados: ["o-1"],
      modoSeleccion: "multi",
      portapapelesVisual: { apariencias: [], enlaces: [], origenOpdId: modelo.opdRaizId },
    } as unknown as typeof modelo);

    expect(exportado).not.toContain("seleccionados");
    expect(exportado).not.toContain("modoSeleccion");
    expect(exportado).not.toContain("portapapelesVisual");
  });

  test("preserva metadatos workspace L4 y acepta legacy sin esos campos", () => {
    const modelo = {
      ...crearModelo("Workspace"),
      archivado: true,
      archivadoEn: "2026-05-05T00:00:00.000Z",
      crearVersionAlGuardar: true,
      versiones: [{
        id: "v1",
        creadoEn: "2026-05-05T00:00:01.000Z",
        nombre: "Manual",
        descripcion: "corte",
        modeloPayloadKey: "deep-opm-pro:version:modelo:v1",
        bytes: 42,
      }],
    };

    const documento = JSON.parse(exportarModelo(modelo));
    expect(documento.modelo.archivado).toBe(true);
    expect(documento.modelo.versiones).toHaveLength(1);

    const hidratado = hidratarModelo(JSON.stringify(documento));
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.archivado).toBe(true);
    expect(hidratado.value.versiones?.[0]?.id).toBe("v1");
    expect(hidratado.value.crearVersionAlGuardar).toBe(true);

    delete documento.modelo.archivado;
    delete documento.modelo.archivadoEn;
    delete documento.modelo.versiones;
    delete documento.modelo.crearVersionAlGuardar;
    const legacy = hidratarModelo(JSON.stringify(documento));
    expect(legacy.ok).toBe(true);
    if (!legacy.ok) return;
    expect(legacy.value.archivado).toBeUndefined();
    expect(legacy.value.versiones).toBeUndefined();
  });

  test("preserva imagen de objeto y no serializa cache transitorio", () => {
    let modelo = crearModelo("Imagen JSON");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Sistema"));
    const entidadId = entidadPorNombre(modelo, "Sistema");
    modelo = {
      ...modelo,
      entidades: {
        ...modelo.entidades,
        [entidadId]: {
          ...modelo.entidades[entidadId]!,
          imagen: { url: "https://example.com/sistema.png", modo: "imagen-texto", cache: { ts: 123, estado: "ok" } },
        },
      },
    };

    const exportado = JSON.parse(exportarModelo(modelo));
    expect(exportado.modelo.entidades[entidadId].imagen).toEqual({ url: "https://example.com/sistema.png", modo: "imagen-texto" });

    const hidratado = hidratarModelo(JSON.stringify(exportado));
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.entidades[entidadId]?.imagen).toEqual({ url: "https://example.com/sistema.png", modo: "imagen-texto" });
  });

  test("omite estilo vacio al exportar y rechaza colores invalidos", () => {
    let modelo = crearModelo("Estilo vacio");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Sistema"));
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!apariencia) throw new Error("La prueba esperaba apariencia");
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...modelo.opds[modelo.opdRaizId]!,
          apariencias: {
            ...modelo.opds[modelo.opdRaizId]!.apariencias,
            [apariencia.id]: { ...apariencia, estilo: {} },
          },
        },
      },
    };

    const exportado = JSON.parse(exportarModelo(modelo));
    expect(exportado.modelo.opds[modelo.opdRaizId].apariencias[apariencia.id].estilo).toBeUndefined();

    exportado.modelo.opds[modelo.opdRaizId].apariencias[apariencia.id].estilo = { fill: "red" };
    const hidratado = hidratarModelo(JSON.stringify(exportado));
    expect(hidratado.ok).toBe(false);
  });

  test("hidrata endpoints legacy string como extremos de entidad", () => {
    let modelo = crearModelo("Legacy endpoints");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 240, y: 20 }, "Procesar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Entrada"), entidadPorNombre(modelo, "Procesar"), "consumo"));
    const documento = JSON.parse(exportarModelo(modelo));
    const enlace = Object.values(documento.modelo.enlaces)[0] as { origenId: unknown; destinoId: unknown };
    enlace.origenId = entidadPorNombre(modelo, "Entrada");
    enlace.destinoId = entidadPorNombre(modelo, "Procesar");

    const hidratado = hidratarModelo(JSON.stringify(documento));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    const enlaceHidratado = Object.values(hidratado.value.enlaces)[0];
    expect(enlaceHidratado?.origenId).toEqual(extremoEntidad(entidadPorNombre(modelo, "Entrada")));
    expect(enlaceHidratado?.destinoId).toEqual(extremoEntidad(entidadPorNombre(modelo, "Procesar")));
  });

  test("hidratar modelo legacy sin estados asume conjunto vacio", () => {
    const modelo = crearModelo("Legacy estados");
    const { estados: _estados, ...sinEstados } = modelo;
    const json = JSON.stringify({
      formato: "deep-opm-pro.modelo.v0",
      modelo: sinEstados,
    });

    const hidratado = hidratarModelo(json);

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.estados).toEqual({});
  });

  test("rechaza estados huerfanos, duplicados o que violan axioma >= 2", () => {
    let modelo = crearModelo("Estados invalidos");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Objeto"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 20 }, "Proceso"));
    const objetoId = entidadPorNombre(modelo, "Objeto");
    const procesoId = entidadPorNombre(modelo, "Proceso");

    const unEstado = hidratarModelo(exportarModelo({
      ...modelo,
      estados: {
        "s-1": { id: "s-1", entidadId: objetoId, nombre: "solo" },
      },
    }));
    expect(unEstado.ok).toBe(false);

    const enProceso = hidratarModelo(exportarModelo({
      ...modelo,
      estados: {
        "s-1": { id: "s-1", entidadId: procesoId, nombre: "a" },
        "s-2": { id: "s-2", entidadId: procesoId, nombre: "b" },
      },
    }));
    expect(enProceso.ok).toBe(false);

    const duplicado = hidratarModelo(exportarModelo({
      ...modelo,
      estados: {
        "s-1": { id: "s-1", entidadId: objetoId, nombre: "abierto" },
        "s-2": { id: "s-2", entidadId: objetoId, nombre: " Abierto " },
      },
    }));
    expect(duplicado.ok).toBe(false);
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
          origenId: extremoEntidad(origen.id),
          destinoId: extremoEntidad(destino.id),
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

  test("preserva multiplicidad de enlace en round-trip", () => {
    let modelo = crearModelo("Multiplicidad");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Recurso"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    modelo = must(crearEnlace(
      modelo,
      modelo.opdRaizId,
      entidadPorNombre(modelo, "Recurso"),
      entidadPorNombre(modelo, "Procesar"),
      "consumo",
    ));
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    expect(enlaceId).toBeDefined();
    if (!enlaceId) return;
    modelo = must(ajustarMultiplicidad(modelo, enlaceId, "origen", "2..N"));
    modelo = must(ajustarMultiplicidad(modelo, enlaceId, "destino", "*"));

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.enlaces[enlaceId]?.multiplicidadOrigen).toBe("2..N");
    expect(hidratado.value.enlaces[enlaceId]?.multiplicidadDestino).toBe("*");
  });

  test("JSON OPM no serializa pestanas de sesion", () => {
    const modelo = crearModelo("Sin pestanas");
    const documento = JSON.parse(exportarModelo(modelo));

    expect(documento.pestanasAbiertas).toBeUndefined();
    expect(documento.pestanaActivaId).toBeUndefined();
    expect(documento.modelo.pestanasAbiertas).toBeUndefined();
    expect(documento.modelo.pestanaActivaId).toBeUndefined();
  });

  test("hidratar enlace legacy sin multiplicidad deja campos indefinidos", () => {
    let modelo = crearModelo("Legacy multiplicidad");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Recurso"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    modelo = must(crearEnlace(
      modelo,
      modelo.opdRaizId,
      entidadPorNombre(modelo, "Recurso"),
      entidadPorNombre(modelo, "Procesar"),
      "consumo",
    ));
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    expect(enlaceId).toBeDefined();
    if (!enlaceId) return;

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.enlaces[enlaceId]?.multiplicidadOrigen).toBeUndefined();
    expect(hidratado.value.enlaces[enlaceId]?.multiplicidadDestino).toBeUndefined();
  });

  test("rechaza multiplicidad de enlace no canonica", () => {
    let modelo = crearModelo("Multiplicidad invalida");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Recurso"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    modelo = must(crearEnlace(
      modelo,
      modelo.opdRaizId,
      entidadPorNombre(modelo, "Recurso"),
      entidadPorNombre(modelo, "Procesar"),
      "consumo",
    ));
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    expect(enlaceId).toBeDefined();
    if (!enlaceId) return;
    const corrupto: Modelo = {
      ...modelo,
      enlaces: {
        ...modelo.enlaces,
        [enlaceId]: {
          ...modelo.enlaces[enlaceId]!,
          multiplicidadOrigen: "1..n",
        },
      },
    };

    const hidratado = hidratarModelo(exportarModelo(corrupto));

    expect(hidratado.ok).toBe(false);
    if (hidratado.ok) return;
    expect(hidratado.error).toContain("multiplicidadOrigen");
  });

  test("preserva modificador evento, probabilidad y demora en round-trip", () => {
    let modelo = crearModelo("Modificadores JSON");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 80 }, "Procesar"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 420, y: 80 }, "Validar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Entrada"), entidadPorNombre(modelo, "Procesar"), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Procesar"), entidadPorNombre(modelo, "Validar"), "invocacion"));
    const consumoId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "consumo")?.id;
    const invocacionId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "invocacion")?.id;
    if (!consumoId || !invocacionId) throw new Error("La prueba esperaba enlaces");
    modelo = must(aplicarModificador(modelo, consumoId, "evento"));
    modelo = must(definirProbabilidad(modelo, consumoId, 0.7));
    modelo = must(definirDemora(modelo, invocacionId, "1s"));

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.enlaces[consumoId]?.modificador).toBe("evento");
    expect(hidratado.value.enlaces[consumoId]?.probabilidad).toBe(0.7);
    expect(hidratado.value.enlaces[invocacionId]?.demora).toBe("1s");
  });

  test("preserva rutaEtiqueta en round-trip y normaliza whitespace", () => {
    let modelo = crearModelo("Rutas JSON");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Aprobar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Pedido"));
    const pedidoId = entidadPorNombre(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [, aprobado] = Object.values(modelo.estados).filter((estado) => estado.entidadId === pedidoId);
    if (!aprobado) throw new Error("La prueba esperaba estado");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Aprobar"), extremoEstado(aprobado.id), "resultado"));
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    modelo = must(definirRutaEtiqueta(modelo, enlaceId, " exitoso "));

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.enlaces[enlaceId]?.rutaEtiqueta).toBe("exitoso");
  });

  test("preserva grupoEstructuralId en estructurales y lo normaliza", () => {
    let modelo = crearModelo("Grupos estructurales");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 240, y: 20 }, "Parte"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte"), "agregacion"));
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    modelo = { ...modelo, enlaces: { ...modelo.enlaces, [enlaceId]: { ...modelo.enlaces[enlaceId]!, grupoEstructuralId: " grupo-a " } } };

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.enlaces[enlaceId]?.grupoEstructuralId).toBe("grupo-a");
  });

  test("preserva metadatos OPCloud de enlaces etiquetados y tasa en round-trip", () => {
    let modelo = crearModelo("Metadatos OPCloud enlaces");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Sistema"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 240, y: 20 }, "Requisito"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 470, y: 20 }, "Procesar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Sistema"), entidadPorNombre(modelo, "Requisito"), "etiquetadoBidireccional"));
    const taggedId = Object.keys(modelo.enlaces)[0];
    if (!taggedId) throw new Error("La prueba esperaba enlace tagged");
    modelo = must(renombrarEtiquetaEnlace(modelo, taggedId, " satisface "));
    modelo = must(definirBackwardTag(modelo, taggedId, " es satisfecho por "));
    modelo = must(definirRequisitosEnlace(modelo, taggedId, " REQ-1 ", true));

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Sistema"), entidadPorNombre(modelo, "Procesar"), "consumo"));
    const consumoId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "consumo")?.id;
    if (!consumoId) throw new Error("La prueba esperaba enlace consumo");
    modelo = must(definirTasaEnlace(modelo, consumoId, " 2 ", " kg/h "));

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.enlaces[taggedId]).toMatchObject({
      etiqueta: "satisface",
      backwardTag: "es satisfecho por",
      requisitos: "REQ-1",
      mostrarRequisitos: true,
    });
    expect(hidratado.value.enlaces[consumoId]).toMatchObject({
      tasa: "2",
      unidadesTasa: "kg/h",
    });
  });

  test("rechaza metadatos OPCloud de enlace fuera de familia", () => {
    let modelo = crearModelo("Metadatos OPCloud invalidos");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Sistema"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 240, y: 20 }, "Requisito"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Sistema"), entidadPorNombre(modelo, "Requisito"), "etiquetado"));
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    const documento = JSON.parse(exportarModelo(modelo));
    const enlace = documento.modelo.enlaces[enlaceId] as Record<string, unknown>;

    enlace.backwardTag = "inverso";
    expect(hidratarModelo(JSON.stringify(documento)).ok).toBe(false);

    delete enlace.backwardTag;
    enlace.tasa = "2";
    expect(hidratarModelo(JSON.stringify(documento)).ok).toBe(false);

    delete enlace.tasa;
    enlace.unidadesTasa = "kg/h";
    expect(hidratarModelo(JSON.stringify(documento)).ok).toBe(false);

    delete enlace.unidadesTasa;
    enlace.grupoEstructuralId = "grupo-a";
    expect(hidratarModelo(JSON.stringify(documento)).ok).toBe(false);
  });

  test("preserva ports y portId dinamicos de enlaces en round-trip", () => {
    let modelo = crearModelo("Puertos dinamicos");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Entrada"), entidadPorNombre(modelo, "Procesar"), "consumo"));
    modelo = sincronizarPuertosEnlaces(modelo, modelo.opdRaizId);
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.enlaces[enlaceId]?.origenId.portId).toBe(modelo.enlaces[enlaceId]?.origenId.portId);
    expect(hidratado.value.enlaces[enlaceId]?.destinoId.portId).toBe(modelo.enlaces[enlaceId]?.destinoId.portId);
    const entrada = aparienciaPorNombre(hidratado.value, "Entrada");
    const procesar = aparienciaPorNombre(hidratado.value, "Procesar");
    expect(entrada.ports?.[hidratado.value.enlaces[enlaceId]?.origenId.portId ?? ""]).toEqual({ x: 1, y: 0.5 });
    expect(procesar.ports?.[hidratado.value.enlaces[enlaceId]?.destinoId.portId ?? ""]).toEqual({ x: 0, y: 0.5 });
  });

  test("hidratar rutaEtiqueta vacia la ignora y tipo no string falla", () => {
    const { modelo, enlaceId } = modeloConRutaManual("   ");
    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.enlaces[enlaceId]?.rutaEtiqueta).toBeUndefined();

    const documento = JSON.parse(exportarModelo(modelo));
    (documento.modelo.enlaces[enlaceId] as Record<string, unknown>).rutaEtiqueta = 123;
    const corrupto = hidratarModelo(JSON.stringify(documento));
    expect(corrupto.ok).toBe(false);
    if (corrupto.ok) return;
    expect(corrupto.error).toContain("rutaEtiqueta");
  });

  test("rechaza metadatos invalidos de modificador", () => {
    let modelo = crearModelo("Modificadores invalidos");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 80 }, "Procesar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Entrada"), entidadPorNombre(modelo, "Procesar"), "consumo"));
    const documento = JSON.parse(exportarModelo(modelo));
    const enlace = Object.values(documento.modelo.enlaces)[0] as Record<string, unknown>;

    enlace.modificador = "evento";
    enlace.probabilidad = 2;
    expect(hidratarModelo(JSON.stringify(documento)).ok).toBe(false);

    enlace.probabilidad = 0.5;
    enlace.modificador = undefined;
    expect(hidratarModelo(JSON.stringify(documento)).ok).toBe(false);
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
    expect(hidratado.value.entidades[procesoId]?.refinamientos?.descomposicion).toBeDefined();
    const opdHijoId = hidratado.value.entidades[procesoId]?.refinamientos?.descomposicion?.opdId;
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
      derivado: expect.objectContaining({
        tipo: "enlace-externo-refinamiento",
        refinamientoId: procesarId,
        enlacePadreId,
        origen: "automatico",
      }),
    }));
  });

  test("preserva origen manual de enlace derivado en round-trip", () => {
    let modelo = crearModelo("Derivado manual");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 100 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 120 }, "Procesar"));
    const entradaId = entidadPorNombre(modelo, "Entrada");
    const procesarId = entidadPorNombre(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entradaId, procesarId, "consumo"));
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesarId));
    modelo = descompuesto.modelo;
    const segundoId = entidadPorNombre(modelo, "Procesar 2");
    const aparienciaEnlaceId = Object.values(modelo.opds[descompuesto.opdId]?.enlaces ?? {})
      .find((apariencia) => modelo.enlaces[apariencia.enlaceId]?.tipo === "consumo")?.id;
    expect(aparienciaEnlaceId).toBeDefined();
    if (!aparienciaEnlaceId) return;
    modelo = must(reanclarEnlaceExternoDerivado(modelo, descompuesto.opdId, aparienciaEnlaceId, segundoId));

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(Object.values(hidratado.value.enlaces)).toContainEqual(expect.objectContaining({
      tipo: "consumo",
      destinoId: extremoEntidad(segundoId),
      derivado: expect.objectContaining({ origen: "manual" }),
    }));
  });

  test("carga derivados legacy sin origen como automaticos", () => {
    let modelo = crearModelo("Derivado legacy");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 100 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 120 }, "Procesar"));
    const entradaId = entidadPorNombre(modelo, "Entrada");
    const procesarId = entidadPorNombre(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entradaId, procesarId, "consumo"));
    modelo = must(descomponerProceso(modelo, modelo.opdRaizId, procesarId)).modelo;
    const documento = JSON.parse(exportarModelo(modelo));
    for (const enlace of Object.values(documento.modelo.enlaces) as Array<{ derivado?: { origen?: string } }>) {
      if (enlace.derivado) delete enlace.derivado.origen;
    }

    const hidratado = hidratarModelo(JSON.stringify(documento));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(Object.values(hidratado.value.enlaces).some((enlace) => enlace.derivado?.origen === "automatico")).toBe(true);
  });

  test("preserva refinamiento por despliegue en round-trip", () => {
    let modelo = crearModelo("Despliegue");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.entidades[objetoId]?.refinamientos?.despliegue).toBeDefined();
    const opdHijoId = hidratado.value.entidades[objetoId]?.refinamientos?.despliegue?.opdId;
    expect(opdHijoId).toBeDefined();
    if (!opdHijoId) return;
    expect(hidratado.value.opds[opdHijoId]?.padreId).toBe(modelo.opdRaizId);
    const agregaciones = Object.values(hidratado.value.enlaces).filter((enlace) => enlace.tipo === "agregacion" && extremoApuntaAEntidad(enlace.origenId, objetoId));
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
      expect(hidratado.value.entidades[objetoId]?.refinamientos?.despliegue?.modo).toBe(caso.modo);
      const enlaces = Object.values(hidratado.value.enlaces).filter((enlace) => enlace.tipo === caso.tipo && extremoApuntaAEntidad(enlace.origenId, objetoId));
      expect(enlaces).toHaveLength(3);
    }
  });

  test("hidratar despliegue legacy sin modo asume agregacion", () => {
    let modelo = crearModelo("Legacy despliegue");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;
    const entidad = modelo.entidades[objetoId];
    expect(entidad?.refinamientos?.despliegue).toBeDefined();
    const slotDesp = entidad?.refinamientos?.despliegue;
    if (!entidad || !slotDesp) return;
    // Inyecta el documento con el formato legacy `refinamiento` y SIN `modo`
    // (escenario pre-15.2 sin modo persistido); el migrador debe asumir
    // "agregacion" y hidratar al record nuevo `refinamientos`.
    const { refinamientos: _omit, ...sinNuevo } = entidad;
    const json = JSON.stringify({
      formato: "deep-opm-pro.modelo.v0",
      modelo: {
        ...modelo,
        entidades: {
          ...modelo.entidades,
          [objetoId]: {
            ...sinNuevo,
            refinamiento: { tipo: "despliegue", opdId: slotDesp.opdId },
          },
        },
      },
    });

    const hidratado = hidratarModelo(json);

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.entidades[objetoId]?.refinamientos?.despliegue?.modo).toBe("agregacion");
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

  test("round-trip preserva metadata de parte extraida", () => {
    let modelo = crearModelo("Plegado parcial avanzado");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;
    const padre = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, padre.id, "parcial"));
    const parteId = entidadPorNombre(modelo, "Vehiculo parte 1");
    modelo = must(extraerParteDePlegado(modelo, modelo.opdRaizId, padre.id, parteId));
    const extraida = partesExtraidasEn(modelo, modelo.opdRaizId, padre.id)[0];
    expect(extraida).toBeDefined();
    if (!extraida) return;

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.opds[modelo.opdRaizId]?.apariencias[extraida.id]?.parteExtraidaDe).toEqual({
      padreAparienciaId: padre.id,
      parteEntidadId: parteId,
    });
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

  test("ronda 15.2: hidratar JSON con campo legacy `refinamiento` migra a record `refinamientos`", () => {
    let modelo = crearModelo("Legacy migracion");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Procesar"));
    const procesoId = entidadPorNombre(modelo, "Procesar");
    modelo = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId)).modelo;
    const slot = modelo.entidades[procesoId]?.refinamientos?.descomposicion;
    if (!slot) throw new Error("La prueba esperaba descomposicion");
    const entidad = modelo.entidades[procesoId];
    if (!entidad) return;
    // Construye un documento al estilo pre-15.2: solo `refinamiento` legacy,
    // sin `refinamientos`. El migrador debe absorber el campo legacy.
    const { refinamientos: _omit, ...sinNuevo } = entidad;
    const doc = JSON.stringify({
      formato: "deep-opm-pro.modelo.v0",
      modelo: {
        ...modelo,
        entidades: {
          ...modelo.entidades,
          [procesoId]: {
            ...sinNuevo,
            refinamiento: { tipo: "descomposicion", opdId: slot.opdId },
          },
        },
      },
    });

    const hidratado = hidratarModelo(doc);
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    // Funtor faithful: el slot llega al record nuevo intacto.
    expect(hidratado.value.entidades[procesoId]?.refinamientos?.descomposicion?.opdId).toBe(slot.opdId);
    // Y el campo legacy ya no se conserva en runtime.
    expect((hidratado.value.entidades[procesoId] as unknown as { refinamiento?: unknown }).refinamiento).toBeUndefined();
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
          refinamientos: {
            descomposicion: { opdId: "opd-inexistente" },
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

function aparienciaPorNombre(modelo: Modelo, nombre: string): Apariencia {
  return aparienciaDeEntidad(modelo, modelo.opdRaizId, entidadPorNombre(modelo, nombre));
}

function sinModoPlegado(apariencia: Apariencia): Omit<Apariencia, "modoPlegado"> {
  const { modoPlegado: _modoPlegado, ...sinModo } = apariencia;
  return sinModo;
}

function modeloConRutaManual(rutaEtiqueta: string): { modelo: Modelo; enlaceId: string } {
  let modelo = crearModelo("Ruta manual");
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Aprobar"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Pedido"));
  const pedidoId = entidadPorNombre(modelo, "Pedido");
  modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
  const estado = Object.values(modelo.estados).find((item) => item.entidadId === pedidoId);
  if (!estado) throw new Error("La prueba esperaba estado");
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Aprobar"), extremoEstado(estado.id), "resultado"));
  const enlaceId = Object.keys(modelo.enlaces)[0];
  if (!enlaceId) throw new Error("La prueba esperaba enlace");
  return {
    modelo: {
      ...modelo,
      enlaces: {
        ...modelo.enlaces,
        [enlaceId]: { ...modelo.enlaces[enlaceId]!, rutaEtiqueta },
      },
    },
    enlaceId,
  };
}

  test("opd.ordenLocal opcional roundtrip lossless; legacy sin orden hidrata como undefined", () => {
    let modelo = crearModelo("Orden");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "A"));
    const a = Object.values(modelo.entidades).find((e) => e.nombre === "A")!;
    modelo = must(descomponerProceso(modelo, modelo.opdRaizId, a.id)).modelo;

    const sdId = modelo.opdRaizId;
    const hijos = Object.values(modelo.opds).filter((o) => o.padreId === sdId);

    // Asignar ordenLocal explícito
    if (hijos.length > 0) {
      modelo = {
        ...modelo,
        opds: {
          ...modelo.opds,
          [hijos[0]!.id]: { ...hijos[0]!, ordenLocal: 7 },
        },
      };
    }

    const json = exportarModelo(modelo);
    const hidratado = hidratarModelo(json);
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;

    const hijoHidratado = Object.values(hidratado.value.opds).find(
      (opd) => opd.ordenLocal !== undefined,
    );
    expect(hijoHidratado).toBeDefined();
    expect(hijoHidratado!.ordenLocal).toBe(7);

    // Legacy sin ordenLocal: debería ser undefined
    const sd = hidratado.value.opds[hidratado.value.opdRaizId];
    expect(sd).toBeDefined();
    expect(sd!.ordenLocal).toBeUndefined();
  });

  function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
