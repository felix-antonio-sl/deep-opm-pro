import { describe, expect, test } from "bun:test";
import { crearModelo } from "./operaciones";
import type { Apariencia, AparienciaEnlace, Enlace, Entidad, Id, Modelo } from "./tipos";
import { validarModelo } from "./validaciones";

describe("validaciones metodologicas pasivas", () => {
  test("modelo limpio retorna lista vacia", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-entrada", "objeto", "Entrada", "informacional"),
        entidad("p-procesar", "proceso", "Procesar", "informacional"),
      ],
      enlaces: [
        enlace("e-consumo", "consumo", "o-entrada", "p-procesar"),
      ],
    });

    expect(validarModelo(modelo, modelo.opdRaizId)).toEqual([]);
  });

  test("agregacion entre objeto fisico e informacional reporta advertencia con cita", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-whole", "objeto", "Motor", "fisica"),
        entidad("o-part", "objeto", "Configuracion", "informacional"),
      ],
      enlaces: [
        enlace("e-agregacion", "agregacion", "o-whole", "o-part"),
      ],
    });

    const avisos = validarModelo(modelo, modelo.opdRaizId);

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      reglaId: "agregacion-misma-esencia",
      severidad: "advertencia",
      citaSSOT: "[V-1]",
      elementoTipo: "enlace",
      elementoId: "e-agregacion",
    });
  });

  test("generalizacion objeto a proceso reporta error", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-general", "objeto", "Clase", "informacional"),
        entidad("p-especial", "proceso", "Especializar", "informacional"),
      ],
      enlaces: [
        enlace("e-generalizacion", "generalizacion", "o-general", "p-especial"),
      ],
    });

    const avisos = validarModelo(modelo, modelo.opdRaizId);

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      reglaId: "generalizacion-mismo-tipo",
      severidad: "error",
      citaSSOT: "[V-239]",
    });
  });

  test("consumo objeto a objeto reporta error procedural", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-entrada", "objeto", "Entrada", "informacional"),
        entidad("o-salida", "objeto", "Salida", "informacional"),
      ],
      enlaces: [
        enlace("e-consumo", "consumo", "o-entrada", "o-salida"),
      ],
    });

    const avisos = validarModelo(modelo, modelo.opdRaizId);

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      reglaId: "procedural-no-objeto-objeto",
      severidad: "error",
      citaSSOT: "[V-239]",
    });
  });

  test("dos agregaciones identicas reportan solo la segunda como duplicada", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-whole", "objeto", "Todo", "informacional"),
        entidad("o-part", "objeto", "Parte", "informacional"),
      ],
      enlaces: [
        enlace("e-agregacion-1", "agregacion", "o-whole", "o-part"),
        enlace("e-agregacion-2", "agregacion", "o-whole", "o-part"),
      ],
    });

    const avisos = validarModelo(modelo, modelo.opdRaizId);

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      reglaId: "estructural-sin-duplicar",
      severidad: "advertencia",
      elementoId: "e-agregacion-2",
    });
  });

  test("subproceso interno enlazado al refinable padre reporta error", () => {
    const modelo = modeloConDescomposicionConEnlaceAlPadre();

    const avisos = validarModelo(modelo, "opd-hijo");

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      reglaId: "subproceso-no-conecta-al-padre",
      severidad: "error",
      citaSSOT: "[Glos 3.33]",
      opdId: "opd-hijo",
      elementoId: "e-padre-hijo",
    });
  });

  test("combinacion de violaciones conserva todos los avisos", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-fisico", "objeto", "Motor", "fisica"),
        entidad("o-info", "objeto", "Configuracion", "informacional"),
        entidad("o-a", "objeto", "A", "informacional"),
        entidad("o-b", "objeto", "B", "informacional"),
        entidad("p-x", "proceso", "Procesar", "informacional"),
      ],
      enlaces: [
        enlace("e-agregacion", "agregacion", "o-fisico", "o-info"),
        enlace("e-generalizacion", "generalizacion", "o-info", "p-x"),
        enlace("e-consumo", "consumo", "o-a", "o-b"),
        enlace("e-dup-1", "agregacion", "o-a", "o-b"),
        enlace("e-dup-2", "agregacion", "o-a", "o-b"),
      ],
    });

    const avisos = validarModelo(modelo, modelo.opdRaizId);

    expect(avisos.map((aviso) => aviso.reglaId)).toEqual([
      "agregacion-misma-esencia",
      "generalizacion-mismo-tipo",
      "procedural-no-objeto-objeto",
      "estructural-sin-duplicar",
    ]);
  });
});

function modeloCon(params: { entidades: Entidad[]; enlaces?: Enlace[] }): Modelo {
  const base = crearModelo("Modelo validaciones");
  const opdRaiz = base.opds[base.opdRaizId];
  if (!opdRaiz) throw new Error("OPD raiz ausente");
  const enlaces = params.enlaces ?? [];

  return {
    ...base,
    nextSeq: 100,
    entidades: Object.fromEntries(params.entidades.map((item) => [item.id, item])),
    enlaces: Object.fromEntries(enlaces.map((item) => [item.id, item])),
    opds: {
      [base.opdRaizId]: {
        ...opdRaiz,
        apariencias: Object.fromEntries(params.entidades.map((item, index) => [
          `a-${item.id}`,
          apariencia(`a-${item.id}`, item.id, base.opdRaizId, index),
        ])),
        enlaces: Object.fromEntries(enlaces.map((item) => [
          `ae-${item.id}`,
          aparienciaEnlace(`ae-${item.id}`, item.id, base.opdRaizId),
        ])),
      },
    },
  };
}

function modeloConDescomposicionConEnlaceAlPadre(): Modelo {
  const base = crearModelo("Modelo inzoom");
  const opdRaiz = base.opds[base.opdRaizId];
  if (!opdRaiz) throw new Error("OPD raiz ausente");

  const padre = entidad("p-padre", "proceso", "Atender", "informacional", {
    tipo: "descomposicion",
    opdId: "opd-hijo",
  });
  const hijo = entidad("p-hijo", "proceso", "Examinar", "informacional");
  const enlacePadreHijo = enlace("e-padre-hijo", "generalizacion", padre.id, hijo.id);

  return {
    ...base,
    nextSeq: 100,
    entidades: {
      [padre.id]: padre,
      [hijo.id]: hijo,
    },
    enlaces: {
      [enlacePadreHijo.id]: enlacePadreHijo,
    },
    opds: {
      [base.opdRaizId]: {
        ...opdRaiz,
        apariencias: {
          "a-padre-raiz": {
            id: "a-padre-raiz",
            entidadId: padre.id,
            opdId: base.opdRaizId,
            x: 100,
            y: 100,
            width: 135,
            height: 60,
          },
        },
        enlaces: {},
      },
      "opd-hijo": {
        id: "opd-hijo",
        nombre: "SD1",
        padreId: base.opdRaizId,
        apariencias: {
          "a-padre-hijo": {
            id: "a-padre-hijo",
            entidadId: padre.id,
            opdId: "opd-hijo",
            x: 100,
            y: 80,
            width: 420,
            height: 280,
          },
          "a-subproceso": {
            id: "a-subproceso",
            entidadId: hijo.id,
            opdId: "opd-hijo",
            x: 150,
            y: 140,
            width: 135,
            height: 60,
          },
        },
        enlaces: {
          "ae-padre-hijo": aparienciaEnlace("ae-padre-hijo", enlacePadreHijo.id, "opd-hijo"),
        },
      },
    },
  };
}

function entidad(
  id: Id,
  tipo: Entidad["tipo"],
  nombre: string,
  esencia: Entidad["esencia"],
  refinamiento?: Entidad["refinamiento"],
): Entidad {
  return {
    id,
    tipo,
    nombre,
    esencia,
    afiliacion: "sistemica",
    ...(refinamiento ? { refinamiento } : {}),
  };
}

function enlace(id: Id, tipo: Enlace["tipo"], origenId: Id, destinoId: Id): Enlace {
  return {
    id,
    tipo,
    origenId,
    destinoId,
    etiqueta: "",
  };
}

function apariencia(id: Id, entidadId: Id, opdId: Id, index: number): Apariencia {
  return {
    id,
    entidadId,
    opdId,
    x: 40 + index * 180,
    y: 80,
    width: 135,
    height: 60,
  };
}

function aparienciaEnlace(id: Id, enlaceId: Id, opdId: Id): AparienciaEnlace {
  return {
    id,
    enlaceId,
    opdId,
    vertices: [],
  };
}
