import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearModelo } from "./operaciones";
import type { Entidad, Modelo } from "./tipos";
import { listarAvisosDiagnostico } from "./diagnostico";

describe("diagnostico unificado", () => {
  test("combina validacion estructural y metodologia en una fuente comun", () => {
    const modelo = modeloConProcesoPlaceholder();

    const avisos = listarAvisosDiagnostico(modelo, { tipo: "opd", opdId: modelo.opdRaizId });
    const codigos = avisos.map((aviso) => aviso.reglaId);

    expect(codigos.filter((codigo) => codigo === "PROCESO_NO_TRANSFORMA")).toHaveLength(1);
    expect(codigos).not.toContain("proceso-sin-entrada-ni-salida");
    expect(codigos).toContain("PROCESO_NOMBRE_FORMA_VERBAL");
    expect(avisos.find((aviso) => aviso.reglaId === "PROCESO_NO_TRANSFORMA")).toMatchObject({
      origen: "metodologia",
      testIdCodigo: "PROCESO_NO_TRANSFORMA",
    });
    expect(avisos.find((aviso) => aviso.reglaId === "PROCESO_NOMBRE_FORMA_VERBAL")).toMatchObject({
      origen: "metodologia",
      titulo: "Nombre de proceso no es canónico",
      severidad: "info",
      elementoTipo: "entidad",
      destino: "Proceso",
      citaSSOT: "urn:fxsl:kb:reglas-opm-estrictas-es R-NOM-PROC-1 / urn:fxsl:kb:opl-es §1.1",
      fuente: "urn:fxsl:kb:reglas-opm-estrictas-es R-NOM-PROC-1 / urn:fxsl:kb:opl-es §1.1",
      fundamento: expect.any(String),
      acciones: expect.arrayContaining([expect.stringContaining("Renombra")]),
    });
  });

  test("deduplica avisos al calcular alcance de modelo completo", () => {
    const modelo = modeloConProcesoPlaceholder();

    const avisos = listarAvisosDiagnostico(modelo, { tipo: "modelo" });
    const ids = avisos.map((aviso) => aviso.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  test("incluye diagnostico visual como origen propio", () => {
    const modelo = modeloConSolapeVisual();

    const avisos = listarAvisosDiagnostico(modelo, { tipo: "opd", opdId: modelo.opdRaizId });

    expect(avisos).toContainEqual(expect.objectContaining({
      origen: "visual",
      reglaId: "visual-solape-apariencias",
      severidad: "info",
      elementoTipo: "entidad",
    }));
  });

  test("el alcance OPD excluye hallazgos de entidades que solo viven en otro OPD", () => {
    const modelo = modeloConProcesosEnDosOpds();

    const raiz = listarAvisosDiagnostico(modelo, { tipo: "opd", opdId: modelo.opdRaizId });
    const procesosSinTransformar = raiz.filter((aviso) => aviso.codigo === "PROCESO_NO_TRANSFORMA");

    expect(procesosSinTransformar.map((aviso) => aviso.destino)).toEqual(["Procesar Raíz"]);
  });

  test("el alcance modelo conserva dos roturas visuales iguales en OPDs distintos", () => {
    const modelo = modeloConGeometriaInvalidaEnDosOpds();

    const avisos = listarAvisosDiagnostico(modelo, { tipo: "modelo" })
      .filter((aviso) => aviso.reglaId === "visual-geometria-apariencia-invalida");

    expect(avisos).toHaveLength(2);
    expect(new Set(avisos.map((aviso) => aviso.id)).size).toBe(2);
    expect(new Set(avisos.map((aviso) => aviso.opdId))).toEqual(new Set([modelo.opdRaizId, "opd-hijo"]));
  });

  test("reporta estados placeholder como diagnostico y no como OPL valida", () => {
    const modelo = modeloConEstadosPlaceholder();

    const avisos = listarAvisosDiagnostico(modelo, { tipo: "opd", opdId: modelo.opdRaizId });

    expect(avisos).toContainEqual(expect.objectContaining({
      origen: "metodologia",
      reglaId: "ESTADO_NOMBRE_CANONICO",
      titulo: "Estado tiene nombre no canónico",
      severidad: "advertencia",
      destino: "Pedido",
      citaSSOT: "urn:fxsl:kb:reglas-opm-estrictas-es R-NOM-EST-1 / urn:fxsl:kb:opl-es §1.3",
    }));
  });
});

function modeloConProcesoPlaceholder(): Modelo {
  const base = crearModelo("Modelo");
  const proceso: Entidad = {
    id: "p-proceso",
    tipo: "proceso",
    nombre: "Proceso",
    esencia: "informacional",
    afiliacion: "sistemica",
  };
  return {
    ...base,
    entidades: { [proceso.id]: proceso },
    opds: {
      [base.opdRaizId]: {
        ...base.opds[base.opdRaizId]!,
        apariencias: {
          "a-proceso": {
            id: "a-proceso",
            entidadId: proceso.id,
            opdId: base.opdRaizId,
            x: 80,
            y: 80,
            width: 135,
            height: 60,
          },
        },
      },
    },
  };
}

function modeloConSolapeVisual(): Modelo {
  const base = crearModelo("Modelo");
  const entrada: Entidad = {
    id: "o-entrada",
    tipo: "objeto",
    nombre: "Entrada",
    esencia: "informacional",
    afiliacion: "sistemica",
  };
  const proceso: Entidad = {
    id: "p-procesar",
    tipo: "proceso",
    nombre: "Procesar",
    esencia: "informacional",
    afiliacion: "sistemica",
  };
  return {
    ...base,
    entidades: { [entrada.id]: entrada, [proceso.id]: proceso },
    opds: {
      [base.opdRaizId]: {
        ...base.opds[base.opdRaizId]!,
        apariencias: {
          "a-entrada": {
            id: "a-entrada",
            entidadId: entrada.id,
            opdId: base.opdRaizId,
            x: 80,
            y: 80,
            width: 135,
            height: 60,
          },
          "a-procesar": {
            id: "a-procesar",
            entidadId: proceso.id,
            opdId: base.opdRaizId,
            x: 100,
            y: 96,
            width: 135,
            height: 60,
          },
        },
      },
    },
  };
}

function modeloConEstadosPlaceholder(): Modelo {
  let base = crearModelo("Modelo");
  const pedido: Entidad = {
    id: "o-pedido",
    tipo: "objeto",
    nombre: "Pedido",
    esencia: "informacional",
    afiliacion: "sistemica",
  };
  base = {
    ...base,
    entidades: { [pedido.id]: pedido },
    opds: {
      [base.opdRaizId]: {
        ...base.opds[base.opdRaizId]!,
        apariencias: {
          "a-pedido": {
            id: "a-pedido",
            entidadId: pedido.id,
            opdId: base.opdRaizId,
            x: 80,
            y: 80,
            width: 135,
            height: 60,
          },
        },
      },
    },
  };
  const estados = crearEstadosIniciales(base, pedido.id);
  if (!estados.ok) throw new Error(estados.error);
  return estados.value.modelo;
}

function modeloConProcesosEnDosOpds(): Modelo {
  const base = crearModelo("Dos OPD");
  const raiz: Entidad = {
    id: "p-raiz",
    tipo: "proceso",
    nombre: "Procesar Raíz",
    esencia: "informacional",
    afiliacion: "sistemica",
  };
  const hijo: Entidad = {
    id: "p-hijo",
    tipo: "proceso",
    nombre: "Procesar Hijo",
    esencia: "informacional",
    afiliacion: "sistemica",
  };
  return {
    ...base,
    entidades: { [raiz.id]: raiz, [hijo.id]: hijo },
    opds: {
      [base.opdRaizId]: {
        ...base.opds[base.opdRaizId]!,
        apariencias: {
          "a-raiz": { id: "a-raiz", entidadId: raiz.id, opdId: base.opdRaizId, x: 80, y: 80, width: 135, height: 60 },
        },
      },
      "opd-hijo": {
        id: "opd-hijo",
        nombre: "SD1",
        padreId: base.opdRaizId,
        apariencias: {
          "a-hijo": { id: "a-hijo", entidadId: hijo.id, opdId: "opd-hijo", x: 80, y: 80, width: 135, height: 60 },
        },
        enlaces: {},
      },
    },
  };
}

function modeloConGeometriaInvalidaEnDosOpds(): Modelo {
  const base = crearModelo("Geometría");
  const objeto: Entidad = {
    id: "o-compartido",
    tipo: "objeto",
    nombre: "Objeto Compartido",
    esencia: "informacional",
    afiliacion: "sistemica",
  };
  return {
    ...base,
    entidades: { [objeto.id]: objeto },
    opds: {
      [base.opdRaizId]: {
        ...base.opds[base.opdRaizId]!,
        apariencias: {
          "a-raiz": { id: "a-raiz", entidadId: objeto.id, opdId: base.opdRaizId, x: Number.NaN, y: 80, width: 135, height: 60 },
        },
      },
      "opd-hijo": {
        id: "opd-hijo",
        nombre: "SD1",
        padreId: base.opdRaizId,
        apariencias: {
          "a-hijo": { id: "a-hijo", entidadId: objeto.id, opdId: "opd-hijo", x: Number.NaN, y: 80, width: 135, height: 60 },
        },
        enlaces: {},
      },
    },
  };
}
