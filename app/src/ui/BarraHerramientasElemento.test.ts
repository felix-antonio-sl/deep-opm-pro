import { describe, expect, test } from "bun:test";
import type { Entidad, Modelo } from "../modelo/tipos";
import {
  accionesBarraEnlace,
  accionesBarraMulti,
  accionesParaContextoBarra,
  accionesPilotoBarra,
  anchoEstimadoAccionesBarra,
  anchoEstimadoBarra,
  anchoEstimadoControlesBarra,
  aparienciaActivaDeEnlace,
  aparienciaActivaDeEntidad,
  ariaLabelBarra,
  atajoAria,
  cellIdActivoDeSeleccion,
  entidadSeleccionUnica,
  enlaceSeleccionUnico,
  limitar,
  posicionarBarraConColisiones,
  rectOverlayAViewport,
  rectRelativoAContenedor,
  rectVisibleEnViewport,
  resolverContextoBarra,
  textoLiveBarra,
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
    });
  });

  test("resuelve contexto de enlace con apariencia activa", () => {
    expect(resolverContextoBarra(modeloBase(), "opd-1", null, "enlace-1", ["enlace-1"])).toMatchObject({
      tipo: "enlace",
      nombre: "enlace consumo",
      anchorCellIds: ["ae-1"],
    });
  });

  test("resuelve contexto multi con celdas visibles de entidades y enlaces", () => {
    expect(resolverContextoBarra(modeloBase(), "opd-1", null, null, ["obj-1", "proc-1", "enlace-1"])).toMatchObject({
      tipo: "multi",
      nombre: "3 seleccionadas",
      anchorCellIds: ["ap-obj", "ap-proc", "ae-1"],
    });
  });
});

describe("a11y de barra contextual", () => {
  test("describe una cosa seleccionada con label canonico y anuncio live", () => {
    const contexto = resolverContextoBarra(modeloBase(), "opd-1", "obj-1", null, ["obj-1"]);
    expect(contexto).not.toBeNull();
    expect(ariaLabelBarra(contexto!)).toBe("Acciones sobre Objeto");
    expect(textoLiveBarra(contexto!)).toBe("Cosa seleccionada: Objeto");
  });

  test("anuncia cardinalidad de multiseleccion", () => {
    const contexto = resolverContextoBarra(modeloBase(), "opd-1", null, null, ["obj-1", "proc-1", "enlace-1"]);
    expect(contexto).not.toBeNull();
    expect(ariaLabelBarra(contexto!)).toBe("Acciones sobre selección múltiple: 3 cosas");
    expect(textoLiveBarra(contexto!)).toBe("Selección múltiple: 3 cosas");
  });

  test("normaliza atajos visibles a aria-keyshortcuts", () => {
    expect(atajoAria("Ctrl+Alt+T")).toBe("Control+Alt+T");
    expect(atajoAria("Shift+I")).toBe("Shift+I");
    expect(atajoAria("⌫")).toBe("Delete");
    expect(atajoAria(undefined)).toBeUndefined();
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

describe("accionesPilotoBarra", () => {
  test("expone seis primarias para objeto en orden IFML", () => {
    expect(accionesPilotoBarra(objeto, true).filter((accion) => accion.visible).map((accion) => accion.id)).toEqual([
      "inzoom",
      "unfold",
      "agregar-estado",
      "editar-imagen",
      "editar-alias",
      "mas-opciones",
    ]);
  });

  test("expone cuatro primarias para proceso", () => {
    const acciones = accionesPilotoBarra(proceso, true).filter((accion) => accion.visible);
    expect(acciones.map((accion) => accion.id)).toEqual([
      "inzoom",
      "unfold",
      "editar-alias",
      "mas-opciones",
    ]);
    expect(acciones.find((accion) => accion.id === "editar-alias")?.enabled).toBe(true);
  });

  test("expone unfold para objeto y proceso", () => {
    expect(accionesPilotoBarra(objeto, true).find((accion) => accion.id === "unfold")?.enabled).toBe(true);
    expect(accionesPilotoBarra(proceso, true).find((accion) => accion.id === "unfold")?.enabled).toBe(true);
  });

  test("oculta agregar estado para proceso", () => {
    expect(accionesPilotoBarra(proceso, true).map((accion) => accion.id as string)).not.toContain("agregar-estado");
  });

  test("cambia el label de mas opciones segun estado del Inspector", () => {
    expect(accionesPilotoBarra(objeto, true).find((accion) => accion.id === "mas-opciones")?.label).toBe("Cerrar Inspector lateral");
    expect(accionesPilotoBarra(objeto, false).find((accion) => accion.id === "mas-opciones")?.label).toBe("Abrir Inspector lateral");
  });

  // Ronda24 L5 #9: la mini-toolbar contextual ahora muestra texto visible
  // corto junto al ícono para las 3 acciones primarias (Descomponer,
  // Desplegar, Editar alias). Las demás acciones contextuales mantienen su
  // render previo (sólo ícono o sólo texto del catálogo).
  test("decora inzoom, unfold y editar-alias con texto visible y bandera compactaIconoTexto", () => {
    const acciones = accionesPilotoBarra(objeto, false);
    const inzoom = acciones.find((accion) => accion.id === "inzoom");
    const unfold = acciones.find((accion) => accion.id === "unfold");
    const editarAlias = acciones.find((accion) => accion.id === "editar-alias");
    expect(inzoom?.texto).toBe("Descomp.");
    expect(inzoom?.compactaIconoTexto).toBe(true);
    expect(unfold?.texto).toBe("Desplegar");
    expect(unfold?.compactaIconoTexto).toBe(true);
    expect(editarAlias?.texto).toBe("Alias");
    expect(editarAlias?.compactaIconoTexto).toBe(true);
  });

  test("no fuerza texto visible en agregar-estado (mantiene icono sin label para no saturar la barra)", () => {
    const acciones = accionesPilotoBarra(objeto, false);
    const agregarEstado = acciones.find((accion) => accion.id === "agregar-estado");
    expect(agregarEstado?.texto).toBeUndefined();
    expect(agregarEstado?.compactaIconoTexto).toBeUndefined();
  });

  test("no aplica compactaIconoTexto a editar-imagen ni mas-opciones (ya tienen texto en catalogo)", () => {
    const acciones = accionesPilotoBarra(objeto, false);
    const editarImagen = acciones.find((accion) => accion.id === "editar-imagen");
    const masOpciones = acciones.find((accion) => accion.id === "mas-opciones");
    expect(editarImagen?.compactaIconoTexto).toBeUndefined();
    expect(editarImagen?.texto).toBe("Img");
    expect(masOpciones?.compactaIconoTexto).toBeUndefined();
    expect(masOpciones?.texto).toBe("Inspector");
  });
});

describe("accionesBarraEnlace", () => {
  test("expone primarias de enlace en orden IFML", () => {
    const enlace = modeloBase().enlaces["enlace-1"] ?? null;
    expect(accionesBarraEnlace(enlace, false).filter((accion) => accion.visible).map((accion) => accion.id)).toEqual([
      "cambiar-tipo-enlace",
      "mas-opciones",
    ]);
    expect(accionesBarraEnlace(enlace, false).find((accion) => accion.id === "cambiar-tipo-enlace")?.texto).toBe("Propiedades");
    expect(accionesBarraEnlace(enlace, false).find((accion) => accion.id === "mas-opciones")?.texto).toBe("Inspector");
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
    expect(anchoEstimadoAccionesBarra(accionesBarraEnlace(enlace, false))).toBe(168);
  });

  // Ronda24 L5 #9: la barra contextual de objeto suma 3 botones
  // icono+texto compactos (Descomp./Desplegar/Alias = 92px c/u) + 2 botones
  // sin texto visible reservado (agregar-estado y editar-imagen quedan en
  // ancho icono = 34px porque su texto opcional cabe centrado) + 1 botón
  // ancho clásico (Inspector = 76px). Ancho = 12 (padding) + 3*92 + 2*34 +
  // 76 + 5*4 (gaps) = 452.
  test("estima ancho real de acciones contextuales para objeto con icono+texto", () => {
    expect(anchoEstimadoAccionesBarra(accionesPilotoBarra(objeto, false))).toBe(452);
  });

  // Proceso no expone agregar-estado ni editar-imagen: 3 botones icono+texto
  // (Descomp./Desplegar/Alias = 92px c/u) + 1 texto (Inspector = 76px).
  // Ancho = 12 (padding) + 3*92 + 76 + 3*4 (gaps) = 376.
  test("estima ancho real de acciones contextuales para proceso", () => {
    expect(anchoEstimadoAccionesBarra(accionesPilotoBarra(proceso, false))).toBe(376);
  });

  test("estima ancho con resumen de multiseleccion", () => {
    expect(anchoEstimadoControlesBarra(accionesBarraMulti(3, false), true)).toBe(608);
  });

  test("estima ancho con resumen de enlace", () => {
    const enlace = modeloBase().enlaces["enlace-1"] ?? null;
    expect(anchoEstimadoControlesBarra(accionesBarraEnlace(enlace, false), false, true)).toBe(288);
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

describe("barra contextual en solo lectura (ley silencio-cero C-1)", () => {
  test("readOnly suprime TODAS las acciones de edición de la barra", () => {
    const modelo = modeloBase();
    const contexto = resolverContextoBarra(modelo, "opd-1", objeto.id, null, [objeto.id]);

    const acciones = accionesParaContextoBarra(contexto, false, true);

    expect(acciones).toEqual([]);
  });

  test("readOnly también vacía la barra de enlace y la de multiselección", () => {
    const modelo = modeloBase();
    const ctxEnlace = resolverContextoBarra(modelo, "opd-1", null, "enlace-1", []);
    const ctxMulti = resolverContextoBarra(modelo, "opd-1", null, null, [objeto.id, proceso.id]);

    expect(accionesParaContextoBarra(ctxEnlace, false, true)).toEqual([]);
    expect(accionesParaContextoBarra(ctxMulti, false, true)).toEqual([]);
  });

  test("sin readOnly la barra conserva sus acciones (no regresión)", () => {
    const modelo = modeloBase();
    const contexto = resolverContextoBarra(modelo, "opd-1", objeto.id, null, [objeto.id]);

    const acciones = accionesParaContextoBarra(contexto, false, false);

    expect(acciones.length).toBeGreaterThan(0);
  });
});
