import { describe, expect, test } from "bun:test";
import { extremoEntidad, extremoEstado } from "../modelo/extremos";
import { crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

describe("slice enlaces", () => {
  test("elegirTipoEnlace abre modo enlace y cancelarEnlace lo limpia", () => {
    store.getState().cargarDemo();
    const id = Object.keys(store.getState().modelo.entidades)[0]!;

    store.getState().seleccionarEntidad(id);
    store.getState().elegirTipoEnlace("instrumento");
    expect(store.getState().modoEnlace).toEqual({ tipo: "instrumento", origenId: id, fase: "boton" });

    store.getState().cancelarEnlace();
    expect(store.getState().modoEnlace).toBeNull();
  });

  test("elegirTipoEnlace acepta origen explicito sin depender de seleccion", () => {
    store.getState().cargarDemo();
    const [seleccionId, origenExplicitoId] = Object.keys(store.getState().modelo.entidades);
    if (!seleccionId || !origenExplicitoId) throw new Error("La prueba esperaba al menos dos entidades");

    store.getState().seleccionarEntidad(seleccionId);
    store.getState().elegirTipoEnlace("instrumento", origenExplicitoId);

    expect(store.getState().modoEnlace).toEqual({ tipo: "instrumento", origenId: origenExplicitoId, fase: "boton" });
  });

  test("iniciarConexionDesdeApariencia registra fase drag-from-anchor", () => {
    store.getState().cargarDemo();
    const opdId = store.getState().opdActivoId;
    const apariencia = Object.values(store.getState().modelo.opds[opdId]?.apariencias ?? {})[0]!;
    const entidad = store.getState().modelo.entidades[apariencia.entidadId]!;

    store.getState().iniciarConexionDesdeApariencia(apariencia.id, "E");

    expect(store.getState().modoEnlace).toMatchObject({
      origenId: entidad.id,
      origenAparienciaId: apariencia.id,
      anchor: "E",
      fase: "drag-from-anchor",
    });
    expect(store.getState().mensaje).toBe("Arrastra hacia la cosa destino");
  });

  test("acciones seleccionadas editan metadatos OPCloud de enlace", () => {
    let modelo = crearModelo("Store metadatos enlace");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Sistema"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Requisito"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 500, y: 80 }, "Procesar"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 740, y: 80 }, "Manejar Excepcion"));
    const sistemaId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Sistema")?.id;
    const requisitoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Requisito")?.id;
    const procesarId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Procesar")?.id;
    const manejarId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Manejar Excepcion")?.id;
    if (!sistemaId || !requisitoId || !procesarId || !manejarId) throw new Error("La prueba esperaba entidades");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, sistemaId, requisitoId, "etiquetadoBidireccional"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, sistemaId, procesarId, "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesarId, manejarId, "excepcionSubSobretiempo"));
    const taggedId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "etiquetadoBidireccional")?.id;
    const consumoId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "consumo")?.id;
    const excepcionId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "excepcionSubSobretiempo")?.id;
    if (!taggedId || !consumoId || !excepcionId) throw new Error("La prueba esperaba enlaces");
    store.getState().importarJson(exportarModelo(modelo));

    store.getState().seleccionarEnlace(taggedId);
    store.getState().definirBackwardTagSeleccionado(" pertenece a ");
    store.getState().definirRequisitosEnlaceSeleccionado(" REQ-1 ", true);
    store.getState().definirTasaEnlaceSeleccionada("2", "kg/h");

    expect(store.getState().modelo.enlaces[taggedId]?.backwardTag).toBe("pertenece a");
    expect(store.getState().modelo.enlaces[taggedId]?.requisitos).toBe("REQ-1");
    expect(store.getState().modelo.enlaces[taggedId]?.mostrarRequisitos).toBe(true);
    expect(store.getState().modelo.enlaces[taggedId]?.tasa).toBeUndefined();
    expect(store.getState().mensaje).toContain("tasa");

    store.getState().seleccionarEnlace(consumoId);
    store.getState().definirTasaEnlaceSeleccionada(" 2 ", " kg/h ");
    expect(store.getState().modelo.enlaces[consumoId]?.tasa).toBe("2");
    expect(store.getState().modelo.enlaces[consumoId]?.unidadesTasa).toBe("kg/h");

    store.getState().seleccionarEnlace(excepcionId);
    store.getState().definirTiempoExcepcionEnlaceSeleccionado({
      tiempoMinimo: " 5 ",
      unidadTiempoMinimo: "s",
      tiempoMaximo: " 30 ",
      unidadTiempoMaximo: "s",
    });
    expect(store.getState().modelo.enlaces[excepcionId]?.tiempoMinimo).toBe("5");
    expect(store.getState().modelo.enlaces[excepcionId]?.unidadTiempoMinimo).toBe("s");
    expect(store.getState().modelo.enlaces[excepcionId]?.tiempoMaximo).toBe("30");
    expect(store.getState().modelo.enlaces[excepcionId]?.unidadTiempoMaximo).toBe("s");
  });

  test("acciones store no reanclan excepcion temporal hacia objeto ni estado", () => {
    let modelo = crearModelo("Store excepcion temporal");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 500, y: 80 }, "Manejar Excepcion"));
    const pedidoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Pedido")?.id;
    const procesarId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Procesar")?.id;
    const manejarId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Manejar Excepcion")?.id;
    if (!pedidoId || !procesarId || !manejarId) throw new Error("La prueba esperaba entidades");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesarId, manejarId, "excepcionSubtiempo"));
    const excepcionId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "excepcionSubtiempo")?.id;
    const estadoId = estados.estadoIds[0];
    if (!excepcionId || !estadoId) throw new Error("La prueba esperaba excepcion temporal y estado");
    const original = modelo.enlaces[excepcionId]!;

    store.getState().importarJson(exportarModelo(modelo));
    store.getState().seleccionarEnlace(excepcionId);
    store.getState().apuntarExtremoEnlaceSeleccionado("destino", extremoEntidad(pedidoId));
    expect(store.getState().modelo.enlaces[excepcionId]?.destinoId).toEqual(original.destinoId);
    expect(store.getState().mensaje).toContain("Proceso");

    store.getState().moverPuertoEnlaceSeleccionado("origen", extremoEstado(estadoId));
    expect(store.getState().modelo.enlaces[excepcionId]?.origenId).toEqual(original.origenId);
    expect(store.getState().mensaje).toContain("Estado");
  });

  test("mover simbolo estructural conserva anclas manuales", () => {
    let modelo = crearModelo("Anclas estructurales");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Parte"));
    const todoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Todo")?.id;
    const parteId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Parte")?.id;
    expect(todoId).toBeDefined();
    expect(parteId).toBeDefined();
    if (!todoId || !parteId) return;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId, parteId, "agregacion"));
    const aparienciaEnlaceId = Object.keys(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0]!;
    store.getState().importarJson(exportarModelo(modelo));

    store.getState().actualizarAnclajesSimboloEstructural([aparienciaEnlaceId], {
      refinable: { dx: -10, dy: -15 },
      refinador: { dx: 8, dy: 15 },
    });
    store.getState().actualizarPosicionSimboloEstructural([aparienciaEnlaceId], { x: 210, y: 160 });

    expect(store.getState().modelo.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlaceId]?.symbolAnchors).toEqual({
      refinable: { dx: -10, dy: -15 },
      refinador: { dx: 8, dy: 15 },
    });
  });

  test("mover simbolo estructural sin anclas manuales no persiste defaults", () => {
    let modelo = crearModelo("Anclas automaticas");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Parte"));
    const todoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Todo")?.id;
    const parteId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Parte")?.id;
    expect(todoId).toBeDefined();
    expect(parteId).toBeDefined();
    if (!todoId || !parteId) return;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId, parteId, "agregacion"));
    const aparienciaEnlaceId = Object.keys(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0]!;
    store.getState().importarJson(exportarModelo(modelo));

    store.getState().actualizarPosicionSimboloEstructural([aparienciaEnlaceId], { x: 210, y: 160 });

    expect(store.getState().modelo.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlaceId]?.symbolPos).toEqual({ x: 210, y: 160 });
    expect(store.getState().modelo.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlaceId]?.symbolAnchors).toBeUndefined();
  });

  test("resetear anclas de simbolo estructural elimina override manual", () => {
    let modelo = crearModelo("Reset anclas estructurales");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Parte"));
    const todoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Todo")?.id;
    const parteId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Parte")?.id;
    expect(todoId).toBeDefined();
    expect(parteId).toBeDefined();
    if (!todoId || !parteId) return;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId, parteId, "agregacion"));
    const aparienciaEnlaceId = Object.keys(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0]!;
    store.getState().importarJson(exportarModelo(modelo));

    store.getState().actualizarAnclajesSimboloEstructural([aparienciaEnlaceId], {
      refinable: { dx: -10, dy: -15 },
      refinador: { dx: 8, dy: 15 },
    });
    store.getState().resetearAnclajesSimboloEstructural([aparienciaEnlaceId]);

    expect(store.getState().modelo.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlaceId]?.symbolAnchors).toBeUndefined();
  });
});

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
