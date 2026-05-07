import { describe, expect, test } from "bun:test";
import type { Entidad, Modelo } from "../modelo/tipos";
import {
  accionesPilotoBarra,
  anchoEstimadoBarra,
  aparienciaActivaDeEntidad,
  endpointPerteneceAEntidad,
  entidadSeleccionUnica,
  limitar,
  posicionarBarraConColisiones,
  primerEnlaceVisualDeEntidad,
  rectRelativoAContenedor,
} from "./BarraHerramientasElemento";

const objeto: Entidad = { id: "obj-1", tipo: "objeto", nombre: "Objeto", esencia: "informacional", afiliacion: "sistemica" };
const proceso: Entidad = { id: "proc-1", tipo: "proceso", nombre: "Proceso", esencia: "informacional", afiliacion: "sistemica" };

function modeloBase(): Modelo {
  return {
    id: "m-1",
    nombre: "Modelo",
    opdRaizId: "opd-1",
    nextSeq: 1,
    entidades: {
      [objeto.id]: objeto,
      [proceso.id]: proceso,
    },
    estados: {
      "estado-1": { id: "estado-1", entidadId: objeto.id, nombre: "Listo" },
    },
    enlaces: {
      "enlace-1": {
        id: "enlace-1",
        tipo: "consumo",
        origenId: { kind: "entidad", id: objeto.id },
        destinoId: { kind: "entidad", id: proceso.id },
        etiqueta: "",
        estilo: { color: "azul" },
      },
      "enlace-2": {
        id: "enlace-2",
        tipo: "resultado",
        origenId: { kind: "entidad", id: proceso.id },
        destinoId: { kind: "estado", id: "estado-1" },
        etiqueta: "",
      },
    },
    opds: {
      "opd-1": {
        id: "opd-1",
        nombre: "SD1",
        padreId: null,
        apariencias: {
          "ap-obj": { id: "ap-obj", entidadId: objeto.id, opdId: "opd-1", x: 10, y: 20, width: 135, height: 60 },
          "ap-proc": { id: "ap-proc", entidadId: proceso.id, opdId: "opd-1", x: 220, y: 20, width: 135, height: 60 },
        },
        enlaces: {
          "ae-1": { id: "ae-1", enlaceId: "enlace-1", opdId: "opd-1", vertices: [] },
          "ae-2": { id: "ae-2", enlaceId: "enlace-2", opdId: "opd-1", vertices: [] },
        },
      },
      "opd-vacio": {
        id: "opd-vacio",
        nombre: "SD2",
        padreId: null,
        apariencias: {},
        enlaces: {},
      },
    },
  };
}

describe("entidadSeleccionUnica", () => {
  test("retorna la entidad cuando hay una sola entidad seleccionada", () => {
    expect(entidadSeleccionUnica(modeloBase(), "obj-1", null, ["obj-1"])?.id).toBe("obj-1");
  });

  test("oculta la barra sin seleccionId", () => {
    expect(entidadSeleccionUnica(modeloBase(), null, null, [])).toBeNull();
  });

  test("oculta la barra cuando hay enlace seleccionado", () => {
    expect(entidadSeleccionUnica(modeloBase(), null, "enlace-1", ["enlace-1"])).toBeNull();
  });

  test("oculta la barra con multiseleccion", () => {
    expect(entidadSeleccionUnica(modeloBase(), "obj-1", null, ["obj-1", "proc-1"])).toBeNull();
  });

  test("oculta la barra si seleccionados no contiene seleccionId", () => {
    expect(entidadSeleccionUnica(modeloBase(), "obj-1", null, ["proc-1"])).toBeNull();
  });

  test("oculta la barra si el id no existe en modelo.entidades", () => {
    expect(entidadSeleccionUnica(modeloBase(), "missing", null, ["missing"])).toBeNull();
  });

  test("acepta proceso como cosa seleccionada unica", () => {
    expect(entidadSeleccionUnica(modeloBase(), "proc-1", null, ["proc-1"])?.tipo).toBe("proceso");
  });
});

describe("aparienciaActivaDeEntidad", () => {
  test("resuelve la apariencia de la entidad en el OPD activo", () => {
    expect(aparienciaActivaDeEntidad(modeloBase(), "opd-1", "obj-1")?.id).toBe("ap-obj");
  });

  test("retorna null si el OPD no existe", () => {
    expect(aparienciaActivaDeEntidad(modeloBase(), "missing", "obj-1")).toBeNull();
  });

  test("retorna null si la entidad no tiene apariencia en el OPD", () => {
    expect(aparienciaActivaDeEntidad(modeloBase(), "opd-vacio", "obj-1")).toBeNull();
  });

  test("no confunde apariencia de proceso con objeto", () => {
    expect(aparienciaActivaDeEntidad(modeloBase(), "opd-1", "proc-1")?.id).toBe("ap-proc");
  });
});

describe("enlace visual relacionado", () => {
  test("detecta extremo entidad como perteneciente a la entidad", () => {
    expect(endpointPerteneceAEntidad(modeloBase(), "obj-1", { kind: "entidad", id: "obj-1" })).toBe(true);
  });

  test("rechaza extremo entidad de otra entidad", () => {
    expect(endpointPerteneceAEntidad(modeloBase(), "obj-1", { kind: "entidad", id: "proc-1" })).toBe(false);
  });

  test("detecta extremo estado como perteneciente al objeto dueño", () => {
    expect(endpointPerteneceAEntidad(modeloBase(), "obj-1", { kind: "estado", id: "estado-1" })).toBe(true);
  });

  test("rechaza extremo estado inexistente", () => {
    expect(endpointPerteneceAEntidad(modeloBase(), "obj-1", { kind: "estado", id: "missing" })).toBe(false);
  });

  test("retorna el primer enlace visual incidente en el OPD", () => {
    expect(primerEnlaceVisualDeEntidad(modeloBase(), "opd-1", "obj-1")).toBe("enlace-1");
  });

  test("retorna null cuando la entidad no tiene enlace visual en el OPD", () => {
    expect(primerEnlaceVisualDeEntidad(modeloBase(), "opd-vacio", "obj-1")).toBeNull();
  });
});

describe("accionesPilotoBarra", () => {
  test("expone siete botones para objeto: seis acciones piloto mas mas opciones", () => {
    expect(accionesPilotoBarra(objeto, "enlace-1", true, true).filter((accion) => accion.visible)).toHaveLength(7);
  });

  test("expone cinco botones visibles para proceso", () => {
    expect(accionesPilotoBarra(proceso, "enlace-1", true, true).filter((accion) => accion.visible)).toHaveLength(5);
  });

  test("habilita copiar estilo si hay enlace relacionado", () => {
    expect(accionesPilotoBarra(objeto, "enlace-1", false, true).find((accion) => accion.id === "copiar-estilo")?.enabled).toBe(true);
  });

  test("deshabilita copiar estilo sin enlace relacionado", () => {
    expect(accionesPilotoBarra(objeto, null, false, true).find((accion) => accion.id === "copiar-estilo")?.enabled).toBe(false);
  });

  test("habilita pegar estilo solo con enlace y portapapeles", () => {
    expect(accionesPilotoBarra(objeto, "enlace-1", true, true).find((accion) => accion.id === "pegar-estilo")?.enabled).toBe(true);
  });

  test("deshabilita pegar estilo sin portapapeles", () => {
    expect(accionesPilotoBarra(objeto, "enlace-1", false, true).find((accion) => accion.id === "pegar-estilo")?.enabled).toBe(false);
  });

  test("oculta agregar estado para proceso", () => {
    expect(accionesPilotoBarra(proceso, null, false, true).find((accion) => accion.id === "agregar-estado")?.visible).toBe(false);
  });

  test("cambia el label de mas opciones segun estado del Inspector", () => {
    expect(accionesPilotoBarra(objeto, null, false, true).find((accion) => accion.id === "mas-opciones")?.label).toBe("Cerrar Inspector lateral");
    expect(accionesPilotoBarra(objeto, null, false, false).find((accion) => accion.id === "mas-opciones")?.label).toBe("Abrir Inspector lateral");
  });
});

describe("posicionamiento", () => {
  test("estima ancho a partir de botones, padding y gaps", () => {
    expect(anchoEstimadoBarra(7)).toBe(274);
  });

  test("retorna cero para barra sin botones", () => {
    expect(anchoEstimadoBarra(0)).toBe(0);
  });

  test("posiciona arriba cuando hay espacio", () => {
    const pos = posicionarBarraConColisiones({ left: 100, top: 100, right: 235, bottom: 160, width: 135, height: 60 }, { width: 800, height: 600 }, 278);
    expect(pos).toEqual({ x: 28.5, y: 48, placement: "arriba" });
  });

  test("posiciona abajo cuando arriba colisiona", () => {
    const pos = posicionarBarraConColisiones({ left: 100, top: 30, right: 235, bottom: 90, width: 135, height: 60 }, { width: 800, height: 600 }, 278);
    expect(pos.placement).toBe("abajo");
    expect(pos.y).toBe(98);
  });

  test("limita x contra borde izquierdo", () => {
    const pos = posicionarBarraConColisiones({ left: 0, top: 120, right: 80, bottom: 180, width: 80, height: 60 }, { width: 800, height: 600 }, 278);
    expect(pos.x).toBe(8);
  });

  test("limita x contra borde derecho", () => {
    const pos = posicionarBarraConColisiones({ left: 760, top: 120, right: 820, bottom: 180, width: 60, height: 60 }, { width: 800, height: 600 }, 278);
    expect(pos.x).toBe(514);
  });

  test("limita y inferior si tampoco cabe abajo", () => {
    const pos = posicionarBarraConColisiones({ left: 100, top: 20, right: 235, bottom: 95, width: 135, height: 75 }, { width: 800, height: 130 }, 278);
    expect(pos).toEqual({ x: 28.5, y: 78, placement: "abajo" });
  });

  test("calcula rect relativo a canvas pane", () => {
    expect(rectRelativoAContenedor(
      { left: 160, top: 100, right: 295, bottom: 160, width: 135, height: 60 },
      { left: 40, top: 20, right: 840, bottom: 620, width: 800, height: 600 },
    )).toEqual({ left: 120, top: 80, right: 255, bottom: 140, width: 135, height: 60 });
  });

  test("limitar acota por minimo y maximo", () => {
    expect(limitar(-2, 0, 10)).toBe(0);
    expect(limitar(12, 0, 10)).toBe(10);
    expect(limitar(4, 0, 10)).toBe(4);
  });
});
