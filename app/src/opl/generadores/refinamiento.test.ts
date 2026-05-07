import { describe, expect, test } from "bun:test";
import type { Modelo } from "../../modelo/tipos";
import { oracionParalelo, oracionRefinamiento } from "./refinamiento";

describe("refinamiento OPL", () => {
  test("descomposicion ordena subprocesos por y", () => {
    const modelo = modeloRefinamiento("descomposicion");
    const padre = modelo.entidades.padre!;
    const apariencia = modelo.opds.opd!.apariencias.ap!;
    expect(oracionRefinamiento(modelo, apariencia, padre)).toBe("*Atender* se descompone en *A*, *B* en esa secuencia.");
  });

  test("despliegue agregacion emite se despliega en", () => {
    const modelo = modeloRefinamiento("despliegue");
    const padre = modelo.entidades.padre!;
    const apariencia = modelo.opds.opd!.apariencias.ap!;
    expect(oracionRefinamiento(modelo, apariencia, padre)).toBe("*Atender* se despliega en *A* y *B*.");
  });

  test("descomposicion detecta paralelo por tolerancia Y", () => {
    const modelo = modeloRefinamiento("descomposicion");
    modelo.opds.hijo!.apariencias.b!.y = 23;
    const padre = modelo.entidades.padre!;
    const apariencia = modelo.opds.opd!.apariencias.ap!;

    expect(oracionRefinamiento(modelo, apariencia, padre)).toBe("*Atender* se descompone en paralelo *A* y *B*.");
  });

  test("oracionParalelo emite ocurren en paralelo", () => {
    expect(oracionParalelo([modeloRefinamiento("descomposicion").entidades.a!, modeloRefinamiento("descomposicion").entidades.b!])).toBe("*A* y *B* ocurren en paralelo.");
  });

  test("descomposicion de objeto lista componentes como objetos", () => {
    const modelo = modeloRefinamientoObjeto();
    const padre = modelo.entidades.padre!;
    const apariencia = modelo.opds.opd!.apariencias.ap!;

    expect(oracionRefinamiento(modelo, apariencia, padre)).toBe("**Vehiculo** se descompone en **Motor** y **Rueda** en esa secuencia.");
  });

  test("descomposicion de objeto separa operaciones internas de componentes", () => {
    const modelo = modeloRefinamientoObjeto();
    modelo.entidades.operar = { id: "operar", tipo: "proceso", nombre: "Operar", esencia: "informacional", afiliacion: "sistemica" };
    modelo.opds.hijo!.apariencias.operar = { id: "operar", entidadId: "operar", opdId: "hijo", x: 120, y: 140, width: 80, height: 40 };
    const padre = modelo.entidades.padre!;
    const apariencia = modelo.opds.opd!.apariencias.ap!;

    expect(oracionRefinamiento(modelo, apariencia, padre)).toBe("**Vehiculo** se descompone en **Motor** y **Rueda** en esa secuencia, así como *Operar*.");
  });
});

function modeloRefinamiento(tipo: "descomposicion" | "despliegue"): Modelo {
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: {
      opd: {
        id: "opd",
        nombre: "SD",
        padreId: null,
        apariencias: { ap: { id: "ap", entidadId: "padre", opdId: "opd", x: 0, y: 0, width: 200, height: 120 } },
        enlaces: {},
      },
      hijo: {
        id: "hijo",
        nombre: "SD1",
        padreId: "opd",
        apariencias: {
          contorno: { id: "contorno", entidadId: "padre", opdId: "hijo", x: 0, y: 0, width: 300, height: 200 },
          a: { id: "a", entidadId: "a", opdId: "hijo", x: 20, y: 20, width: 80, height: 40 },
          b: { id: "b", entidadId: "b", opdId: "hijo", x: 20, y: 80, width: 80, height: 40 },
        },
        enlaces: {},
      },
    },
    entidades: {
      padre: { id: "padre", tipo: "proceso", nombre: "Atender", esencia: "informacional", afiliacion: "sistemica", refinamiento: { tipo, opdId: "hijo" } },
      a: { id: "a", tipo: "proceso", nombre: "A", esencia: "informacional", afiliacion: "sistemica" },
      b: { id: "b", tipo: "proceso", nombre: "B", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {},
    nextSeq: 1,
  };
}

function modeloRefinamientoObjeto(): Modelo {
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: {
      opd: {
        id: "opd",
        nombre: "SD",
        padreId: null,
        apariencias: { ap: { id: "ap", entidadId: "padre", opdId: "opd", x: 0, y: 0, width: 200, height: 120 } },
        enlaces: {},
      },
      hijo: {
        id: "hijo",
        nombre: "SD1",
        padreId: "opd",
        apariencias: {
          contorno: { id: "contorno", entidadId: "padre", opdId: "hijo", x: 0, y: 0, width: 300, height: 220 },
          motor: { id: "motor", entidadId: "motor", opdId: "hijo", x: 20, y: 20, width: 80, height: 40 },
          rueda: { id: "rueda", entidadId: "rueda", opdId: "hijo", x: 20, y: 80, width: 80, height: 40 },
        },
        enlaces: {},
      },
    },
    entidades: {
      padre: { id: "padre", tipo: "objeto", nombre: "Vehiculo", esencia: "informacional", afiliacion: "sistemica", refinamiento: { tipo: "descomposicion", opdId: "hijo" } },
      motor: { id: "motor", tipo: "objeto", nombre: "Motor", esencia: "informacional", afiliacion: "sistemica" },
      rueda: { id: "rueda", tipo: "objeto", nombre: "Rueda", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {},
    nextSeq: 1,
  };
}
