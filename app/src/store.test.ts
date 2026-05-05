import { beforeEach, describe, expect, test } from "bun:test";
import { crearModelo } from "./modelo/operaciones";
import type { Modelo } from "./modelo/tipos";
import { exportarModelo } from "./serializacion/json";
import { store } from "./store";

describe("store undo/redo y dirty state", () => {
  beforeEach(() => {
    instalarLocalStorage();
    store.getState().importarJson(exportarModelo(crearModelo()));
    store.getState().listarModelosGuardados();
  });

  test("marca dirty con operaciones reversibles y deshacer hasta snapshot guardado lo limpia", () => {
    store.getState().crearObjetoDemo();
    expect(store.getState().dirty).toBe(true);
    expect(store.getState().puedeDeshacer).toBe(true);
    expect(cantidadEntidades()).toBe(1);

    store.getState().deshacer();
    expect(cantidadEntidades()).toBe(0);
    expect(store.getState().dirty).toBe(false);
    expect(store.getState().puedeDeshacer).toBe(false);
    expect(store.getState().puedeRehacer).toBe(true);

    store.getState().rehacer();
    expect(cantidadEntidades()).toBe(1);
    expect(store.getState().dirty).toBe(true);
    expect(store.getState().puedeDeshacer).toBe(true);
    expect(store.getState().puedeRehacer).toBe(false);
  });

  test("guardar limpia dirty sin purgar undo", () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarLocal();
    expect(store.getState().dirty).toBe(false);
    expect(store.getState().puedeDeshacer).toBe(true);

    store.getState().deshacer();
    expect(cantidadEntidades()).toBe(0);
    expect(store.getState().dirty).toBe(true);
    expect(store.getState().puedeRehacer).toBe(true);

    store.getState().rehacer();
    expect(cantidadEntidades()).toBe(1);
    expect(store.getState().dirty).toBe(false);
  });

  test("guardar local usa indice estructurado y cargar reinicia dirty e historial", () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarLocal();
    const primerId = store.getState().modeloPersistidoId;
    expect(primerId).toBeTruthy();
    expect(store.getState().modelosGuardados).toHaveLength(1);
    expect(store.getState().dirty).toBe(false);

    store.getState().crearProcesoDemo();
    expect(store.getState().dirty).toBe(true);
    store.getState().guardarLocal();
    expect(store.getState().modeloPersistidoId).toBe(primerId);
    expect(store.getState().modelosGuardados).toHaveLength(1);

    store.getState().crearObjetoDemo();
    expect(cantidadEntidades()).toBe(3);
    store.getState().cargarLocal(primerId ?? undefined);

    expect(cantidadEntidades()).toBe(2);
    expect(store.getState().dirty).toBe(false);
    expect(store.getState().puedeDeshacer).toBe(false);
    expect(store.getState().puedeRehacer).toBe(false);
  });

  test("nuevo modelo descarta historial local activo sin borrar registros guardados", () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarLocal();
    const primerId = store.getState().modeloPersistidoId;
    if (!primerId) throw new Error("La prueba esperaba id persistido");
    store.getState().crearProcesoDemo();

    store.getState().nuevoModelo();

    expect(cantidadEntidades()).toBe(0);
    expect(store.getState().modeloPersistidoId).toBeNull();
    expect(store.getState().dirty).toBe(false);
    expect(store.getState().puedeDeshacer).toBe(false);
    expect(store.getState().modelosGuardados.map((modelo) => modelo.id)).toContain(primerId);
  });

  test("borrar modelo local actual lo deja sin respaldo persistido", () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarLocal();
    const primerId = store.getState().modeloPersistidoId;
    if (!primerId) throw new Error("La prueba esperaba id persistido");

    store.getState().borrarLocal(primerId);

    expect(store.getState().modelosGuardados).toHaveLength(0);
    expect(store.getState().modeloPersistidoId).toBeNull();
    expect(store.getState().dirty).toBe(true);
    expect(cantidadEntidades()).toBe(1);
  });

  test("nueva operacion despues de undo purga redo", () => {
    store.getState().crearObjetoDemo();
    store.getState().deshacer();
    expect(store.getState().puedeRehacer).toBe(true);

    store.getState().crearProcesoDemo();
    expect(cantidadEntidades()).toBe(1);
    expect(store.getState().puedeRehacer).toBe(false);
  });

  test("seleccion y modo enlace no entran al historial ni activan dirty", () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarLocal();
    const id = primeraEntidadId();

    store.getState().seleccionarEntidad(id);
    store.getState().elegirTipoEnlace("agregacion");
    store.getState().cancelarEnlace();

    expect(store.getState().dirty).toBe(false);
    expect(store.getState().puedeDeshacer).toBe(true);
  });

  test("navegar OPDs no entra al historial ni activa dirty", () => {
    const modelo = modeloConOpdHijo();
    store.getState().importarJson(exportarModelo(modelo));
    expect(store.getState().opdActivoId).toBe(modelo.opdRaizId);
    expect(store.getState().dirty).toBe(false);
    expect(store.getState().puedeDeshacer).toBe(false);

    store.getState().cambiarOpdActivo("opd-2");
    expect(store.getState().opdActivoId).toBe("opd-2");
    expect(store.getState().dirty).toBe(false);
    expect(store.getState().puedeDeshacer).toBe(false);
  });

  test("crear cosa usa el OPD activo", () => {
    const modelo = modeloConOpdHijo();
    store.getState().importarJson(exportarModelo(modelo));
    store.getState().cambiarOpdActivo("opd-2");

    store.getState().crearObjetoDemo();

    expect(Object.values(store.getState().modelo.opds[modelo.opdRaizId]?.apariencias ?? {})).toHaveLength(0);
    expect(Object.values(store.getState().modelo.opds["opd-2"]?.apariencias ?? {})).toHaveLength(1);
    expect(store.getState().dirty).toBe(true);
    expect(store.getState().opdActivoId).toBe("opd-2");
  });

  test("ajustar multiplicidad seleccionada entra al historial y rechaza sintaxis invalida", () => {
    store.getState().crearObjetoDemo();
    store.getState().crearProcesoDemo();
    const entidades = Object.values(store.getState().modelo.entidades);
    const objeto = entidades.find((entidad) => entidad.tipo === "objeto");
    const proceso = entidades.find((entidad) => entidad.tipo === "proceso");
    expect(objeto).toBeDefined();
    expect(proceso).toBeDefined();
    if (!objeto || !proceso) return;
    store.getState().seleccionarEntidad(objeto.id);
    store.getState().elegirTipoEnlace("consumo");
    store.getState().seleccionarEntidad(proceso.id);
    const enlaceId = Object.values(store.getState().modelo.enlaces)[0]?.id;
    expect(enlaceId).toBeDefined();
    if (!enlaceId) return;
    store.getState().seleccionarEnlace(enlaceId);

    store.getState().ajustarMultiplicidadSeleccionada("origen", "2");

    expect(store.getState().modelo.enlaces[enlaceId]?.multiplicidadOrigen).toBe("2");
    expect(store.getState().dirty).toBe(true);
    expect(store.getState().puedeDeshacer).toBe(true);

    store.getState().ajustarMultiplicidadSeleccionada("origen", "2 ");
    expect(store.getState().modelo.enlaces[enlaceId]?.multiplicidadOrigen).toBe("2");
    expect(store.getState().mensaje).toContain("Multiplicidad inválida");

    store.getState().deshacer();
    expect(store.getState().modelo.enlaces[enlaceId]?.multiplicidadOrigen).toBeUndefined();
  });

  test("gestiona estados de objeto con historial y designaciones coexistentes", () => {
    store.getState().crearObjetoDemo();
    const objetoId = primeraEntidadId();
    store.getState().seleccionarEntidad(objetoId);

    store.getState().agregarEstadosObjeto();

    let estados = estadosObjeto(objetoId);
    expect(estados.map((estado) => estado.nombre)).toEqual(["estado1", "estado2"]);
    expect(store.getState().dirty).toBe(true);
    expect(store.getState().puedeDeshacer).toBe(true);

    store.getState().renombrarEstadoSeleccionado(estados[0]?.id ?? "", "pendiente");
    store.getState().designarEstadoInicial(estados[0]?.id ?? "");
    store.getState().designarEstadoFinal(estados[0]?.id ?? "");

    estados = estadosObjeto(objetoId);
    expect(estados[0]).toMatchObject({ nombre: "pendiente", esInicial: true, esFinal: true });

    store.getState().eliminarEstado(estados[1]?.id ?? "");
    expect(store.getState().mensaje).toContain("al menos dos estados");
    expect(estadosObjeto(objetoId)).toHaveLength(2);

    store.getState().agregarEstadoObjeto();
    estados = estadosObjeto(objetoId);
    expect(estados).toHaveLength(3);
    store.getState().eliminarEstado(estados[2]?.id ?? "");
    expect(estadosObjeto(objetoId)).toHaveLength(2);

    store.getState().quitarEstadosObjetoSeleccionado();
    expect(estadosObjeto(objetoId)).toHaveLength(0);

    store.getState().deshacer();
    expect(estadosObjeto(objetoId)).toHaveLength(2);
  });

  test("descomponer seleccionada crea OPD hijo, navega y conserva undo", () => {
    store.getState().crearProcesoDemo();
    const procesoId = primeraEntidadId();
    store.getState().seleccionarEntidad(procesoId);

    store.getState().descomponerSeleccionada();

    const estado = store.getState();
    const opdHijo = Object.values(estado.modelo.opds).find((opd) => opd.padreId === estado.modelo.opdRaizId);
    expect(opdHijo).toBeDefined();
    if (!opdHijo) return;
    expect(opdHijo.nombre).toBe("SD1");
    expect(estado.opdActivoId).toBe(opdHijo.id);
    expect(estado.modelo.entidades[procesoId]?.refinamiento).toEqual({
      tipo: "descomposicion",
      opdId: opdHijo.id,
    });
    expect(estado.dirty).toBe(true);
    expect(estado.puedeDeshacer).toBe(true);

    store.getState().deshacer();
    expect(Object.values(store.getState().modelo.opds)).toHaveLength(1);
    expect(store.getState().opdActivoId).toBe(store.getState().modelo.opdRaizId);
    expect(store.getState().dirty).toBe(true);

    store.getState().rehacer();
    expect(Object.values(store.getState().modelo.opds)).toHaveLength(2);
    expect(store.getState().opdActivoId).toBe(store.getState().modelo.opdRaizId);
  });

  test("desplegar seleccionada crea OPD hijo de objeto, navega y conserva undo", () => {
    store.getState().crearObjetoDemo();
    const objetoId = primeraEntidadId();
    store.getState().seleccionarEntidad(objetoId);

    store.getState().desplegarSeleccionada();

    const estado = store.getState();
    const opdHijo = Object.values(estado.modelo.opds).find((opd) => opd.padreId === estado.modelo.opdRaizId);
    expect(opdHijo).toBeDefined();
    if (!opdHijo) return;
    expect(opdHijo.nombre).toBe("SD1");
    expect(estado.opdActivoId).toBe(opdHijo.id);
    expect(estado.modelo.entidades[objetoId]?.refinamiento).toEqual({
      tipo: "despliegue",
      opdId: opdHijo.id,
      modo: "agregacion",
    });
    expect(estado.dirty).toBe(true);
    expect(estado.puedeDeshacer).toBe(true);

    store.getState().deshacer();
    expect(Object.values(store.getState().modelo.opds)).toHaveLength(1);
    expect(store.getState().opdActivoId).toBe(store.getState().modelo.opdRaizId);
  });

  test("desplegar seleccionada respeta modo estructural elegido", () => {
    store.getState().crearObjetoDemo();
    const objetoId = primeraEntidadId();
    store.getState().seleccionarEntidad(objetoId);

    store.getState().desplegarSeleccionada("exhibicion");

    const estado = store.getState();
    const opdHijo = Object.values(estado.modelo.opds).find((opd) => opd.padreId === estado.modelo.opdRaizId);
    expect(opdHijo).toBeDefined();
    if (!opdHijo) return;
    expect(estado.modelo.entidades[objetoId]?.refinamiento?.modo).toBe("exhibicion");
    const enlaces = Object.values(opdHijo.enlaces)
      .map((apariencia) => estado.modelo.enlaces[apariencia.enlaceId])
      .filter((enlace): enlace is NonNullable<typeof enlace> => enlace !== undefined);
    expect(enlaces).toHaveLength(3);
    expect(enlaces.every((enlace) => enlace.tipo === "exhibicion")).toBe(true);
  });

  test("cambiar plegado parcial entra al historial sin abrir otro OPD", () => {
    store.getState().crearObjetoDemo();
    const objetoId = primeraEntidadId();
    store.getState().seleccionarEntidad(objetoId);
    store.getState().desplegarSeleccionada();
    const opdHijoId = store.getState().opdActivoId;
    store.getState().cambiarOpdActivo(store.getState().modelo.opdRaizId);
    store.getState().seleccionarEntidad(objetoId);

    store.getState().cambiarModoPlegadoSeleccionado("parcial");

    const estado = store.getState();
    const apariencia = Object.values(estado.modelo.opds[estado.modelo.opdRaizId]?.apariencias ?? {})
      .find((item) => item.entidadId === objetoId);
    expect(apariencia?.modoPlegado).toBe("parcial");
    expect(estado.modelo.entidades[objetoId]?.refinamiento?.opdId).toBe(opdHijoId);
    expect(Object.values(estado.modelo.opds)).toHaveLength(2);
    expect(estado.dirty).toBe(true);
    expect(estado.puedeDeshacer).toBe(true);

    store.getState().deshacer();
    const revertida = Object.values(store.getState().modelo.opds[store.getState().modelo.opdRaizId]?.apariencias ?? {})
      .find((item) => item.entidadId === objetoId);
    expect(revertida?.modoPlegado).toBeUndefined();
    expect(Object.values(store.getState().modelo.opds)).toHaveLength(2);
  });

  test("quitar despliegue seleccionado elimina OPD hijo y conserva undo", () => {
    store.getState().crearObjetoDemo();
    const objetoId = primeraEntidadId();
    store.getState().seleccionarEntidad(objetoId);
    store.getState().desplegarSeleccionada();
    expect(Object.values(store.getState().modelo.opds)).toHaveLength(2);
    expect(Object.values(store.getState().modelo.enlaces)).toHaveLength(3);

    store.getState().quitarDespliegueSeleccionado();

    expect(Object.values(store.getState().modelo.opds)).toHaveLength(1);
    expect(store.getState().modelo.entidades[objetoId]?.refinamiento).toBeUndefined();
    expect(Object.values(store.getState().modelo.enlaces)).toHaveLength(0);
    expect(store.getState().opdActivoId).toBe(store.getState().modelo.opdRaizId);
    expect(store.getState().dirty).toBe(true);
    expect(store.getState().puedeDeshacer).toBe(true);

    store.getState().deshacer();
    expect(Object.values(store.getState().modelo.opds)).toHaveLength(2);
    expect(store.getState().modelo.entidades[objetoId]?.refinamiento?.tipo).toBe("despliegue");
  });

  test("quitar descomposicion seleccionada elimina OPD hijo y conserva undo", () => {
    store.getState().crearProcesoDemo();
    const procesoId = primeraEntidadId();
    store.getState().seleccionarEntidad(procesoId);
    store.getState().descomponerSeleccionada();
    expect(Object.values(store.getState().modelo.opds)).toHaveLength(2);

    store.getState().quitarDescomposicionSeleccionada();

    expect(Object.values(store.getState().modelo.opds)).toHaveLength(1);
    expect(store.getState().modelo.entidades[procesoId]?.refinamiento).toBeUndefined();
    expect(store.getState().opdActivoId).toBe(store.getState().modelo.opdRaizId);
    expect(store.getState().dirty).toBe(true);
    expect(store.getState().puedeDeshacer).toBe(true);

    store.getState().deshacer();
    expect(Object.values(store.getState().modelo.opds)).toHaveLength(2);
    expect(store.getState().modelo.entidades[procesoId]?.refinamiento?.tipo).toBe("descomposicion");
  });

  test("limita undo a 100 snapshots", () => {
    for (let index = 0; index < 105; index += 1) {
      store.getState().crearObjetoDemo();
    }

    for (let index = 0; index < 100; index += 1) {
      store.getState().deshacer();
    }

    expect(cantidadEntidades()).toBe(5);
    expect(store.getState().puedeDeshacer).toBe(false);
    expect(store.getState().puedeRehacer).toBe(true);
  });
});

function cantidadEntidades(): number {
  return Object.keys(store.getState().modelo.entidades).length;
}

function primeraEntidadId(): string {
  const id = Object.keys(store.getState().modelo.entidades)[0];
  if (!id) throw new Error("La prueba esperaba al menos una entidad");
  return id;
}

function estadosObjeto(entidadId: string) {
  return Object.values(store.getState().modelo.estados)
    .filter((estado) => estado.entidadId === entidadId)
    .sort((a, b) => a.id.localeCompare(b.id));
}

function modeloConOpdHijo(): Modelo {
  const modelo = crearModelo();
  return {
    ...modelo,
    opds: {
      ...modelo.opds,
      "opd-2": {
        id: "opd-2",
        nombre: "SD1",
        padreId: modelo.opdRaizId,
        apariencias: {},
        enlaces: {},
      },
    },
  };
}

function instalarLocalStorage(): void {
  const datos = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => datos.get(key) ?? null,
      setItem: (key: string, value: string) => datos.set(key, value),
      removeItem: (key: string) => datos.delete(key),
      clear: () => datos.clear(),
    },
  });
}
