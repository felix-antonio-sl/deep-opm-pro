import { describe, expect, test } from "bun:test";
import type { Modelo } from "../../../modelo/tipos";
import type { OpmJointMetadata } from "../proyeccion";
import { opdRefinadoPorDobleClick } from "./seleccion";

describe("handlers/seleccion", () => {
  test("doble click en cosa descompuesta navega al OPD de descomposicion", () => {
    const modelo = modeloRefinado();
    expect(opdRefinadoPorDobleClick(modelo, metaEntidad("proc-a"))).toBe("opd-descompuesto");
  });

  test("doble click usa despliegue si no hay descomposicion", () => {
    const modelo = modeloRefinado();
    expect(opdRefinadoPorDobleClick(modelo, metaEntidad("obj-a"))).toBe("opd-desplegado");
  });

  test("descomposicion gana sobre despliegue cuando coexisten", () => {
    const modelo = modeloRefinado();
    expect(opdRefinadoPorDobleClick(modelo, metaEntidad("proc-ambos"))).toBe("opd-descompuesto");
  });

  test("ignora refinamientos huerfanos o metadata no entidad", () => {
    const modelo = modeloRefinado();
    expect(opdRefinadoPorDobleClick(modelo, metaEntidad("proc-huerfano"))).toBeNull();
    expect(opdRefinadoPorDobleClick(modelo, {
      kind: "enlace",
      enlaceId: "e",
      aparienciaEnlaceId: "ae",
      opdId: "opd-raiz",
      tipo: "consumo",
    })).toBeNull();
  });
});

function metaEntidad(entidadId: string): OpmJointMetadata {
  return { kind: "entidad", entidadId, aparienciaId: `ap-${entidadId}`, opdId: "opd-raiz", rol: "externo" };
}

function modeloRefinado(): Modelo {
  return {
    id: "m",
    nombre: "Modelo",
    opdRaizId: "opd-raiz",
    nextSeq: 1,
    entidades: {
      "proc-a": {
        id: "proc-a",
        tipo: "proceso",
        nombre: "Procesar",
        esencia: "informacional",
        afiliacion: "sistemica",
        refinamientos: { descomposicion: { opdId: "opd-descompuesto" } },
      },
      "obj-a": {
        id: "obj-a",
        tipo: "objeto",
        nombre: "Orden",
        esencia: "informacional",
        afiliacion: "sistemica",
        refinamientos: { despliegue: { opdId: "opd-desplegado", modo: "agregacion" } },
      },
      "proc-ambos": {
        id: "proc-ambos",
        tipo: "proceso",
        nombre: "Revisar",
        esencia: "informacional",
        afiliacion: "sistemica",
        refinamientos: {
          descomposicion: { opdId: "opd-descompuesto" },
          despliegue: { opdId: "opd-desplegado", modo: "agregacion" },
        },
      },
      "proc-huerfano": {
        id: "proc-huerfano",
        tipo: "proceso",
        nombre: "Huerfano",
        esencia: "informacional",
        afiliacion: "sistemica",
        refinamientos: { descomposicion: { opdId: "opd-inexistente" } },
      },
    },
    estados: {},
    enlaces: {},
    opds: {
      "opd-raiz": { id: "opd-raiz", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} },
      "opd-descompuesto": { id: "opd-descompuesto", nombre: "SD1", padreId: "opd-raiz", apariencias: {}, enlaces: {} },
      "opd-desplegado": { id: "opd-desplegado", nombre: "SD2", padreId: "opd-raiz", apariencias: {}, enlaces: {} },
    },
  };
}
