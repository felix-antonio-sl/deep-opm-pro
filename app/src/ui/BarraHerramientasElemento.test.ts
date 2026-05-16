import { describe, expect, test } from "bun:test";
import type { Entidad, Modelo } from "../modelo/tipos";
import {
  accionesBarraEnlace,
  accionesBarraMulti,
  accionesPilotoBarra,
  anchoEstimadoAccionesBarra,
  anchoEstimadoBarra,
  anchoEstimadoControlesBarra,
  aparienciaActivaDeEnlace,
  aparienciaActivaDeEntidad,
  cellIdActivoDeSeleccion,
  endpointPerteneceAEntidad,
  entidadSeleccionUnica,
  enlaceSeleccionUnico,
  limitar,
  posicionarBarraConColisiones,
  primerEnlaceVisualDeEntidad,
  rectOverlayAViewport,
  rectRelativoAContenedor,
  rectVisibleEnViewport,
  resolverContextoBarra,
  unirBboxesOverlay,
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

describe("enlaceSeleccionUnico", () => {
  test("retorna el enlace cuando hay un solo enlace seleccionado", () => {
    expect(enlaceSeleccionUnico(modeloBase(), "enlace-1", ["enlace-1"])?.id).toBe("enlace-1");
  });

  test("oculta la barra de enlace con multiseleccion", () => {
    expect(enlaceSeleccionUnico(modeloBase(), "enlace-1", ["enlace-1", "obj-1"])).toBeNull();
  });

  test("oculta la barra de enlace si el id no existe", () => {
    expect(enlaceSeleccionUnico(modeloBase(), "missing", ["missing"])).toBeNull();
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

describe("aparienciaActivaDeEnlace", () => {
  test("resuelve la apariencia de enlace en el OPD activo", () => {
    expect(aparienciaActivaDeEnlace(modeloBase(), "opd-1", "enlace-1")?.id).toBe("ae-1");
  });

  test("retorna null si el enlace no está visible en el OPD", () => {
    expect(aparienciaActivaDeEnlace(modeloBase(), "opd-vacio", "enlace-1")).toBeNull();
  });
});

describe("resolverContextoBarra", () => {
  test("resuelve contexto de entidad con apariencia activa", () => {
    expect(resolverContextoBarra(modeloBase(), "opd-1", "obj-1", null, ["obj-1"])).toMatchObject({
      tipo: "entidad",
      nombre: "Objeto",
      anchorCellIds: ["ap-obj"],
      enlaceEstiloId: "enlace-1",
    });
  });

  test("resuelve contexto de enlace con apariencia activa", () => {
    expect(resolverContextoBarra(modeloBase(), "opd-1", null, "enlace-1", ["enlace-1"])).toMatchObject({
      tipo: "enlace",
      nombre: "enlace consumo",
      anchorCellIds: ["ae-1"],
      enlaceEstiloId: "enlace-1",
    });
  });

  test("resuelve contexto multi con celdas visibles de entidades y enlaces", () => {
    expect(resolverContextoBarra(modeloBase(), "opd-1", null, null, ["obj-1", "proc-1", "enlace-1"])).toMatchObject({
      tipo: "multi",
      nombre: "3 seleccionadas",
      anchorCellIds: ["ap-obj", "ap-proc", "ae-1"],
      enlaceEstiloId: null,
    });
  });
});

describe("cellIdActivoDeSeleccion", () => {
  test("resuelve celdas visibles por id logico", () => {
    expect(cellIdActivoDeSeleccion(modeloBase(), "opd-1", "obj-1")).toBe("ap-obj");
    expect(cellIdActivoDeSeleccion(modeloBase(), "opd-1", "enlace-1")).toBe("ae-1");
  });

  test("retorna null para ids no visibles", () => {
    expect(cellIdActivoDeSeleccion(modeloBase(), "opd-vacio", "obj-1")).toBeNull();
    expect(cellIdActivoDeSeleccion(modeloBase(), "opd-1", "missing")).toBeNull();
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
  test("expone seis primarias para objeto en orden IFML", () => {
    expect(accionesPilotoBarra(objeto, "enlace-1", true, true).filter((accion) => accion.visible).map((accion) => accion.id)).toEqual([
      "inzoom",
      "unfold",
      "agregar-estado",
      "editar-imagen",
      "editar-alias",
      "mas-opciones",
    ]);
  });

  test("expone cuatro primarias para proceso", () => {
    const acciones = accionesPilotoBarra(proceso, "enlace-1", true, true).filter((accion) => accion.visible);
    expect(acciones.map((accion) => accion.id)).toEqual([
      "inzoom",
      "unfold",
      "editar-alias",
      "mas-opciones",
    ]);
    expect(acciones.find((accion) => accion.id === "editar-alias")?.enabled).toBe(true);
  });

  test("expone unfold para objeto y proceso", () => {
    expect(accionesPilotoBarra(objeto, null, false, true).find((accion) => accion.id === "unfold")?.enabled).toBe(true);
    expect(accionesPilotoBarra(proceso, null, false, true).find((accion) => accion.id === "unfold")?.enabled).toBe(true);
  });

  test("oculta agregar estado para proceso", () => {
    expect(accionesPilotoBarra(proceso, null, false, true).map((accion) => accion.id as string)).not.toContain("agregar-estado");
  });

  test("mantiene copiar/pegar estilo fuera de primarias aunque haya enlace operable", () => {
    const acciones = accionesPilotoBarra(objeto, "enlace-1", true, true);
    const idsAcciones = acciones.map((accion) => accion.id as string);
    expect(idsAcciones).not.toContain("copiar-estilo");
    expect(idsAcciones).not.toContain("pegar-estilo");
  });

  test("cambia el label de mas opciones segun estado del Inspector", () => {
    expect(accionesPilotoBarra(objeto, null, false, true).find((accion) => accion.id === "mas-opciones")?.label).toBe("Cerrar Inspector lateral");
    expect(accionesPilotoBarra(objeto, null, false, false).find((accion) => accion.id === "mas-opciones")?.label).toBe("Abrir Inspector lateral");
  });
});

describe("accionesBarraEnlace", () => {
  test("expone primarias de enlace en orden IFML", () => {
    const enlace = modeloBase().enlaces["enlace-1"] ?? null;
    expect(accionesBarraEnlace(enlace, true, false).filter((accion) => accion.visible).map((accion) => accion.id)).toEqual([
      "cambiar-tipo-enlace",
      "copiar-estilo",
      "pegar-estilo",
      "mas-opciones",
    ]);
  });

  test("mantiene pegar formato visible pero deshabilitado sin portapapeles", () => {
    const enlace = modeloBase().enlaces["enlace-1"] ?? null;
    const pegar = accionesBarraEnlace(enlace, false, false).find((accion) => accion.id === "pegar-estilo");
    expect(pegar?.visible).toBe(true);
    expect(pegar?.enabled).toBe(false);
  });
});

describe("accionesBarraMulti", () => {
  test("expone primarias de multiseleccion en orden IFML", () => {
    expect(accionesBarraMulti(3, false).filter((accion) => accion.visible).map((accion) => accion.id)).toEqual([
      "eliminar-seleccion",
      "agregar-como-partes",
      "traer-enlaces",
      "alinear-seleccion",
      "distribuir-seleccion",
      "mas-opciones",
    ]);
  });

  test("oculta primarias multi si no hay cardinalidad suficiente", () => {
    expect(accionesBarraMulti(1, false)).toEqual([]);
  });
});

describe("posicionamiento", () => {
  test("estima ancho a partir de botones, padding y gaps", () => {
    expect(anchoEstimadoBarra(7)).toBe(274);
  });

  test("estima ancho real con botones de texto", () => {
    const enlace = modeloBase().enlaces["enlace-1"] ?? null;
    expect(anchoEstimadoAccionesBarra(accionesBarraEnlace(enlace, true, false))).toBe(286);
  });

  test("estima ancho con resumen de multiseleccion", () => {
    expect(anchoEstimadoControlesBarra(accionesBarraMulti(3, false), true)).toBe(566);
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

  test("une bboxes overlay y las convierte contra scroll del viewport", () => {
    const bbox = unirBboxesOverlay([
      { x: 100, y: 80, width: 30, height: 20 },
      { x: 150, y: 120, width: 40, height: 30 },
    ]);
    expect(bbox).toEqual({ x: 100, y: 80, width: 90, height: 70 });
    expect(rectOverlayAViewport(bbox!, { scrollLeft: 60, scrollTop: 20 } as HTMLElement)).toEqual({
      left: 40,
      top: 60,
      right: 130,
      bottom: 130,
      width: 90,
      height: 70,
    });
  });

  test("detecta si el bbox overlay queda fuera del viewport scrolleado", () => {
    const viewport = { scrollLeft: 100, scrollTop: 100, clientWidth: 200, clientHeight: 160 } as HTMLElement;
    expect(rectVisibleEnViewport({ x: 120, y: 120, width: 40, height: 40 }, viewport)).toBe(true);
    expect(rectVisibleEnViewport({ x: 10, y: 120, width: 40, height: 40 }, viewport)).toBe(false);
    expect(rectVisibleEnViewport({ x: 120, y: 280, width: 40, height: 40 }, viewport)).toBe(false);
  });

  test("limitar acota por minimo y maximo", () => {
    expect(limitar(-2, 0, 10)).toBe(0);
    expect(limitar(12, 0, 10)).toBe(10);
    expect(limitar(4, 0, 10)).toBe(4);
  });
});
