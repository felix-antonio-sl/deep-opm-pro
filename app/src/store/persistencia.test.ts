import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import type { ModeloPersistido } from "../persistencia/modelos";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

let originalFetch: typeof fetch;
const cargarYEvaluarDriftOriginal = store.getState().cargarYEvaluarDrift;

describe("slice persistencia backend-only", () => {
  let backend: BackendMock;

  beforeEach(() => {
    backend = instalarBackendMock();
    store.setState({
      modelosGuardados: [],
      modelosRecientes: [],
      revisionBasePorModelo: {},
      revisionRemota: null,
      modeloPersistidoId: null,
      indice: { modelos: [], carpetas: [], recientes: [] },
      workspaceRevision: null,
    });
    store.getState().activarReadOnly(false);
    store.getState().importarJson(exportarModelo(crearModelo()));
  });

  afterEach(() => {
    store.setState({ cargarYEvaluarDrift: cargarYEvaluarDriftOriginal });
    store.setState({ requiereLogin: false });
    globalThis.fetch = originalFetch;
    Reflect.deleteProperty(globalThis, "window");
  });

  test("listarModelosGuardados conserva el contrato de arreglo publico", async () => {
    store.getState().listarModelosGuardados();
    await esperar(() => store.getState().mensaje === null);
    expect(Array.isArray(store.getState().modelosGuardados)).toBe(true);
  });

  test("bootstrap observa workspace sin reescribir su proyección derivada", async () => {
    store.getState().listarModelosGuardados();
    await esperar(() => store.getState().workspaceRevision === 0);
    await Promise.resolve();

    expect(backend.workspacePutCount).toBe(0);
  });

  test("bootstrap y reapertura conservan las versiones del indice persistido", async () => {
    const id = "modelo-con-historia";
    const ahora = "2026-07-21T12:00:00.000Z";
    const version = {
      id: "version-historica",
      nombre: "Corte verificable",
      creadoEn: ahora,
      modeloPayloadKey: "version-historica",
      bytes: 128,
    };
    backend.modelos.set(id, {
      id,
      nombre: "Modelo con historia",
      descripcion: "original",
      creadoEn: ahora,
      actualizadoEn: ahora,
      carpetaId: null,
      json: exportarModelo(crearModelo("Modelo con historia")),
      revision: 1,
    });
    backend.workspace = {
      modelos: [{ id, carpetaId: null, versiones: [version] }],
      carpetas: [],
      recientes: [id],
    };
    backend.workspaceRevision = 1;

    store.getState().listarModelosGuardados();
    await esperar(() => store.getState().modelosGuardados[0]?.versiones?.length === 1);
    expect(store.getState().modelosGuardados[0]?.versiones).toEqual([version]);

    store.getState().cargarLocal(id);
    await esperar(() => store.getState().mensaje === "Modelo cargado: Modelo con historia");
    expect(store.getState().modelosGuardados[0]?.versiones).toEqual([version]);
  });

  test("dos escrituras de la misma pestaña se confirman en orden CAS", async () => {
    store.getState().listarModelosGuardados();
    await esperar(() => store.getState().workspaceRevision === 0);
    const firstWrite = backend.bloquearSiguienteWorkspacePut();

    store.getState().fijarAnchoPanelArbol(250);
    store.getState().fijarAnchoPanelArbol(280);
    await firstWrite.iniciado;

    expect(backend.workspacePutCount).toBe(1);
    firstWrite.liberar();
    await esperar(() => backend.workspacePutCount === 2);

    expect(backend.workspaceRevisionBases).toEqual([0, 1]);
    expect(backend.workspace.preferenciasUi?.anchoPanelArbol).toBe(280);
    expect(store.getState().workspaceRevision).toBe(2);
  });

  test("una pestaña obsoleta no pisa el workspace confirmado por otra", async () => {
    store.getState().listarModelosGuardados();
    await esperar(() => store.getState().workspaceRevision === 0);
    backend.workspace = {
      ...backend.workspace,
      preferenciasUi: { anchoPanelArbol: 410 },
    };
    backend.workspaceRevision = 1;

    store.getState().fijarAnchoPanelArbol(260);
    await esperar(() => store.getState().mensaje?.includes("Workspace desactualizado") === true);

    expect(backend.workspace.preferenciasUi?.anchoPanelArbol).toBe(410);
    expect(store.getState().workspaceRevision).toBe(0);
  });

  test("bootstrap tardío conserva el cambio local y no emite un PUT adicional", async () => {
    backend.workspace = {
      ...backend.workspace,
      preferenciasUi: { anchoPanelInspector: 330 },
    };
    const staleList = backend.bloquearRespuestaSiguienteListado();
    store.getState().listarModelosGuardados();
    await staleList.iniciado;

    store.getState().fijarAnchoPanelArbol(275);
    await esperar(() => backend.workspacePutCount === 1);
    staleList.liberar();
    await esperar(() => store.getState().workspaceRevision === 1);
    await Promise.resolve();

    expect(backend.workspacePutCount).toBe(1);
    expect(store.getState().indice.preferenciasUi).toEqual({
      anchoPanelInspector: 330,
      anchoPanelArbol: 275,
    });
  });

  test("un listado viejo no puede bajar la revision observada por uno posterior", async () => {
    store.getState().guardarComoLocal({ nombre: "Modelo listado monotónico" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const respuestaVieja = backend.bloquearRespuestaSiguienteListado();

    store.getState().listarModelosGuardados();
    await respuestaVieja.iniciado;
    backend.modelos.set(id, { ...backend.modelos.get(id)!, revision: 2 });
    store.getState().listarModelosGuardados();
    await esperar(() => store.getState().modelosGuardados.find((modelo) => modelo.id === id)?.revision === 2);

    respuestaVieja.liberar();
    await Promise.resolve();
    await Promise.resolve();

    expect(store.getState().modelosGuardados.find((modelo) => modelo.id === id)?.revision).toBe(2);
  });

  test("guardarLocal en read-only redirige a Guardar Como y deja copia editable", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo publicado" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const idPublicado = store.getState().modeloPersistidoId;
    expect(idPublicado).toBeTruthy();

    store.getState().activarReadOnly(true);
    store.getState().guardarLocal();
    await esperar(() => store.getState().modeloPersistidoId !== idPublicado);

    expect(store.getState().readOnly).toBe(false);
    expect(store.getState().modeloPersistidoId).not.toBe(idPublicado);
    expect(store.getState().modelo.nombre).toBe("Modelo publicado copia");
    expect(store.getState().modelosGuardados.map((modelo) => modelo.nombre).sort()).toEqual([
      "Modelo publicado",
      "Modelo publicado copia",
    ]);
  });

  test("Guardar como permite actualizar el modelo actual con su mismo nombre", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "HODOM completo v14", descripcion: "Base" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const idPersistido = store.getState().modeloPersistidoId;
    expect(idPersistido).toBeTruthy();

    store.getState().crearProcesoDemo();
    expect(store.getState().dirty).toBe(true);
    store.getState().abrirGuardarComo();
    store.getState().guardarComoLocalConDescripcion({
      nombre: "HODOM completo v14",
      descripcion: "Actualizado desde Guardar como",
    });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");

    expect(store.getState().dialogoGuardarComoAbierto).toBe(false);
    expect(store.getState().modeloPersistidoId).toBe(idPersistido);
    expect(store.getState().dirty).toBe(false);
    expect(store.getState().descripcionModeloLocal).toBe("Actualizado desde Guardar como");
    expect(store.getState().modelosGuardados.filter((modelo) => modelo.nombre === "HODOM completo v14")).toHaveLength(1);
  });

  test("un guardado manual consolida y apaga un autosave previo", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo con autosave" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const persisted = backend.modelos.get(id)!;
    backend.modelos.set(id, { ...persisted, autosalvado: true });
    store.setState({
      modelosGuardados: store.getState().modelosGuardados.map((model) =>
        model.id === id ? { ...model, autosalvado: true } : model
      ),
    });

    store.getState().crearProcesoDemo();
    store.getState().guardarLocal();
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");

    expect(backend.modelos.get(id)?.autosalvado).toBe(false);
    expect(store.getState().modelosGuardados.find((model) => model.id === id)?.autosalvado).toBe(false);
  });

  test("guardado manual tardio preserva una edicion posterior y mantiene dirty", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo guardado con carrera" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;

    store.getState().crearProcesoDemo();
    const jsonEnviado = exportarModelo(store.getState().modelo);
    const gate = backend.bloquearSiguienteGuardado();
    store.getState().guardarLocal();
    await gate.iniciado;

    store.getState().crearObjetoDemo();
    const jsonVivo = exportarModelo(store.getState().modelo);
    gate.liberar();
    await esperar(() => store.getState().mensaje === "Modelo guardado; hay cambios posteriores pendientes");

    expect(store.getState().mensaje).toBe("Modelo guardado; hay cambios posteriores pendientes");
    expect(exportarModelo(store.getState().modelo)).toBe(jsonVivo);
    expect(store.getState().dirty).toBe(true);
    expect(JSON.parse(backend.modelos.get(id)!.json).modelo).toEqual(JSON.parse(jsonEnviado).modelo);
  });

  test("un listado nuevo no autoriza otro guardado hasta confirmar la base abierta", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo con respuestas invertidas" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;

    store.getState().crearProcesoDemo();
    const respuestaVieja = backend.bloquearRespuestaSiguienteGuardado();
    store.getState().guardarLocal();
    await respuestaVieja.iniciado;

    store.getState().listarModelosGuardados();
    await esperar(() => store.getState().modelosGuardados.find((modelo) => modelo.id === id)?.revision === 2);
    store.getState().crearObjetoDemo();
    const snapshotNuevo = exportarModelo(store.getState().modelo);
    store.getState().guardarLocal();
    await esperar(() => store.getState().mensaje === "No se pudo guardar en servidor: Conflicto de persistencia");
    expect(store.getState().revisionBasePorModelo[id]).toBe(1);
    expect(store.getState().dirty).toBe(true);

    respuestaVieja.liberar();
    await esperar(() => store.getState().revisionBasePorModelo[id] === 2);

    store.getState().guardarLocal();
    await esperar(() => store.getState().revisionBasePorModelo[id] === 3);

    const pestanaId = store.getState().pestanaActivaId;
    expect(store.getState().revisionBasePorModelo[id]).toBe(3);
    expect(store.getState().dirty).toBe(false);
    expect(store.getState().pestanasAbiertas.find((pestana) => pestana.id === pestanaId)?.snapshotJson)
      .toBe(snapshotNuevo);
  });

  test("guardarLocal usa la base del documento abierto, no la revision refrescada del listado", async () => {
    store.getState().guardarComoLocal({ nombre: "Base humana" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const base = store.getState().revisionBasePorModelo[id]!;
    const remoto = {
      ...backend.modelos.get(id)!,
      json: exportarModelo(crearModelo("Cambio del agente")),
      revision: base + 1,
    };
    backend.modelos.set(id, remoto);
    store.getState().listarModelosGuardados();
    await esperar(() => store.getState().modelosGuardados.find((modelo) => modelo.id === id)?.revision === base + 1);

    store.getState().crearObjetoDemo();
    store.getState().guardarLocal();
    await esperar(() => store.getState().mensaje === "No se pudo guardar en servidor: Conflicto de persistencia");

    expect(backend.modelos.get(id)).toEqual(remoto);
    expect(store.getState().revisionBasePorModelo[id]).toBe(base);
    expect(store.getState().dirty).toBe(true);
  });

  test("Guardar como sobre el actual conserva la base abierta frente a un refresco", async () => {
    store.getState().guardarComoLocal({ nombre: "Base descriptiva" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const base = store.getState().revisionBasePorModelo[id]!;
    const remoto = { ...backend.modelos.get(id)!, descripcion: "Agente", revision: base + 1 };
    backend.modelos.set(id, remoto);
    store.getState().listarModelosGuardados();
    await esperar(() => store.getState().modelosGuardados.find((modelo) => modelo.id === id)?.revision === base + 1);

    store.getState().guardarComoLocalConDescripcion({
      nombre: "Base descriptiva",
      descripcion: "Humano",
    });
    await esperar(() => store.getState().mensaje === "No se pudo guardar en servidor: Conflicto de persistencia");

    expect(backend.modelos.get(id)).toEqual(remoto);
    expect(store.getState().revisionBasePorModelo[id]).toBe(base);
  });

  test("renombrar conserva la base abierta frente a un refresco", async () => {
    store.getState().guardarComoLocal({ nombre: "Nombre base" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const base = store.getState().revisionBasePorModelo[id]!;
    const remoto = { ...backend.modelos.get(id)!, nombre: "Nombre agente", revision: base + 1 };
    backend.modelos.set(id, remoto);
    store.getState().listarModelosGuardados();
    await esperar(() => store.getState().modelosGuardados.find((modelo) => modelo.id === id)?.revision === base + 1);

    store.getState().renombrarModeloActual("Nombre humano");
    await esperar(() => store.getState().mensaje === "No se pudo renombrar en servidor: Conflicto de persistencia");

    expect(backend.modelos.get(id)).toEqual(remoto);
    expect(store.getState().revisionBasePorModelo[id]).toBe(base);
  });

  test("guardarConVersion no deja modelo ni versión si el commit atómico falla", async () => {
    store.getState().guardarComoLocal({ nombre: "Modelo versionable" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const postsAntes = backend.modelPostCount;
    const jsonServidor = backend.modelos.get(store.getState().modeloPersistidoId!)!.json;
    store.getState().crearObjetoDemo();
    backend.fallarSiguienteRevisionAtomica();

    await store.getState().guardarConVersion();

    expect(store.getState().mensaje).toBe(
      "No se pudo guardar modelo y versión: Fallo atómico",
    );
    expect(backend.modelPostCount).toBe(postsAntes);
    expect(backend.modelos.get(store.getState().modeloPersistidoId!)!.json).toBe(jsonServidor);
    expect(backend.workspace.modelos[0]?.versiones).toBeUndefined();
  });

  test("guardarConVersion confirma modelo, versión y workspace en una mutación", async () => {
    store.getState().guardarComoLocal({ nombre: "Modelo atómico" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const workspacePutsAntes = backend.workspacePutCount;
    store.getState().crearObjetoDemo();

    await store.getState().guardarConVersion();

    expect(store.getState().mensaje).toBe("Modelo y versión guardados");
    expect(backend.revisionPostCount).toBe(1);
    expect(backend.workspacePutCount).toBe(workspacePutsAntes);
    expect(backend.workspace.modelos.find((item) => item.id === id)?.versiones)
      .toHaveLength(1);
    expect(store.getState().dirty).toBe(false);
  });

  test("eliminarVersionPorId conserva el estado local si el backend falla", async () => {
    store.getState().guardarComoLocal({ nombre: "Modelo con versión" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const version = {
      id: "version-no-borrada",
      nombre: "Protegida por confirmación",
      creadoEn: "2026-07-18T12:00:00.000Z",
      modeloPayloadKey: "version-no-borrada",
      bytes: 10,
    };
    store.setState({
      modelosGuardados: store.getState().modelosGuardados.map((modelo) =>
        modelo.id === id ? { ...modelo, versiones: [version] } : modelo
      ),
      indice: {
        ...store.getState().indice,
        modelos: store.getState().indice.modelos.map((modelo) =>
          modelo.id === id ? { ...modelo, versiones: [version] } : modelo
        ),
      },
    });

    store.getState().eliminarVersionPorId(id, version.id);
    await esperar(() =>
      store.getState().mensaje === "No se pudo eliminar versión en servidor: Fallo backend"
    );

    expect(store.getState().modelosGuardados.find((modelo) => modelo.id === id)?.versiones)
      .toEqual([version]);
    expect(store.getState().indice.modelos.find((modelo) => modelo.id === id)?.versiones)
      .toEqual([version]);
  });

  test("borrar limpia la encarnación de revisión y permite recrear el mismo id", async () => {
    const id = "modelo-reencarnado";
    store.getState().guardarComoLocal({ id, nombre: "Primera encarnación" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    store.setState({ revisionRemota: { modeloId: id, revision: 1 } });

    store.getState().borrarLocal(id);
    await esperar(() => store.getState().mensaje === "Modelo borrado");

    expect(store.getState().revisionBasePorModelo[id]).toBeUndefined();
    expect(store.getState().revisionRemota).toBeNull();
    store.getState().guardarComoLocal({ id, nombre: "Segunda encarnación" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");

    expect(backend.modelos.get(id)?.revision).toBe(1);
    expect(store.getState().revisionBasePorModelo[id]).toBe(1);
  });

  test("guardado manual tardio confirma la pestana origen sin reemplazar la activa", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo guardado en origen" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const revisionInicial = backend.modelos.get(id)!.revision!;
    const pestanaOrigenId = store.getState().pestanaActivaId;

    store.getState().crearProcesoDemo();
    const snapshotEnviado = exportarModelo(store.getState().modelo);
    const gate = backend.bloquearSiguienteGuardado();
    store.getState().guardarLocal();
    await gate.iniciado;

    store.getState().abrirPestanaNueva();
    const pestanaActivaId = store.getState().pestanaActivaId;
    const jsonActivo = exportarModelo(store.getState().modelo);
    gate.liberar();
    await esperar(() => backend.modelos.get(id)?.revision === revisionInicial + 1);

    const estado = store.getState();
    const pestanaOrigen = estado.pestanasAbiertas.find(
      (pestana) => pestana.id === pestanaOrigenId,
    );
    expect(estado.pestanaActivaId).toBe(pestanaActivaId);
    expect(exportarModelo(estado.modelo)).toBe(jsonActivo);
    expect(pestanaOrigen?.snapshotJson).toBe(snapshotEnviado);
    expect(pestanaOrigen?.dirty).toBe(false);
  });

  test("Guardar como tardio actualiza la pestana origen sin tocar la activa", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo origen" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const revisionInicial = backend.modelos.get(id)!.revision!;
    const pestanaOrigenId = store.getState().pestanaActivaId;

    store.getState().crearProcesoDemo();
    const descripcion = "Descripción confirmada";
    const modeloEnviado = { ...store.getState().modelo, descripcion };
    const snapshotEnviado = exportarModelo(modeloEnviado);
    const gate = backend.bloquearSiguienteGuardado();
    store.getState().guardarComoLocalConDescripcion({
      nombre: "Modelo origen",
      descripcion,
    });
    await gate.iniciado;

    store.getState().crearObjetoDemo();
    const modeloVivoEsperado = { ...store.getState().modelo, descripcion };
    store.getState().abrirPestanaNueva();
    const pestanaActivaId = store.getState().pestanaActivaId;
    const jsonPestanaActiva = exportarModelo(store.getState().modelo);
    gate.liberar();
    await esperar(() => backend.modelos.get(id)?.revision === revisionInicial + 1);

    const estado = store.getState();
    const pestanaOrigen = estado.pestanasAbiertas.find((pestana) => pestana.id === pestanaOrigenId);
    expect(estado.pestanaActivaId).toBe(pestanaActivaId);
    expect(exportarModelo(estado.modelo)).toBe(jsonPestanaActiva);
    expect(exportarModelo(pestanaOrigen!.modelo)).toBe(exportarModelo(modeloVivoEsperado));
    expect(pestanaOrigen?.modeloId).toBe(id);
    expect(pestanaOrigen?.dirty).toBe(true);
    expect(pestanaOrigen?.snapshotJson).toBe(snapshotEnviado);
  });

  test("autosalvado tardio preserva una edicion posterior y mantiene dirty", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo autosalvado con carrera" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const revisionAntes = backend.modelos.get(id)!.revision;
    const jsonPrincipalAntes = backend.modelos.get(id)!.json;
    const postsAntes = backend.modelPostCount;

    const setIntervalOriginal = globalThis.setInterval;
    const clearIntervalOriginal = globalThis.clearInterval;
    let tick: (() => Promise<void>) | null = null;
    globalThis.setInterval = ((handler: () => Promise<void>) => {
      tick = handler;
      return 1;
    }) as unknown as typeof setInterval;
    globalThis.clearInterval = (() => undefined) as unknown as typeof clearInterval;

    try {
      store.getState().crearProcesoDemo();
      const jsonEnviado = exportarModelo(store.getState().modelo);
      const gate = backend.bloquearSiguienteGuardado();
      store.getState().iniciarAutosalvado();
      expect(tick).not.toBeNull();
      const tickPromise = tick!();
      await gate.iniciado;

      store.getState().crearObjetoDemo();
      const jsonVivo = exportarModelo(store.getState().modelo);
      gate.liberar();
      await tickPromise;

      expect(store.getState().mensaje).toBe("Autosalvado completado; hay cambios posteriores pendientes");
      expect(exportarModelo(store.getState().modelo)).toBe(jsonVivo);
      expect(store.getState().dirty).toBe(true);
      expect(JSON.parse(backend.autosaves.get(id)!.json).modelo).toEqual(JSON.parse(jsonEnviado).modelo);
      expect(backend.modelos.get(id)!.json).toBe(jsonPrincipalAntes);
      expect(backend.modelos.get(id)!.revision).toBe(revisionAntes);
      expect(store.getState().revisionBasePorModelo[id]).toBe(revisionAntes);
      expect(backend.modelPostCount).toBe(postsAntes);
      expect(backend.autosavePutCount).toBe(1);
    } finally {
      store.getState().detenerAutosalvado();
      globalThis.setInterval = setIntervalOriginal;
      globalThis.clearInterval = clearIntervalOriginal;
    }
  });

  test("renombrar despues de un autosalvado consolida el registro como guardado manual", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo antes de renombrar" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const persisted = backend.modelos.get(id)!;
    backend.modelos.set(id, { ...persisted, autosalvado: true });
    store.setState({
      modelosGuardados: store.getState().modelosGuardados.map((model) =>
        model.id === id ? { ...model, autosalvado: true } : model
      ),
    });

    store.getState().renombrarModeloActual("Modelo renombrado");
    await esperar(() => store.getState().mensaje === "Modelo renombrado");

    expect(backend.modelos.get(id)?.nombre).toBe("Modelo renombrado");
    expect(backend.modelos.get(id)?.autosalvado).toBe(false);
    expect(store.getState().modelosGuardados.find((model) => model.id === id)?.autosalvado).toBe(false);
  });

  test("una respuesta tardia de renombrado no fuerza un nombre posterior", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo antes del rename" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;

    const gate = backend.bloquearSiguienteGuardado();
    store.getState().renombrarModeloActual("Nombre enviado");
    await gate.iniciado;
    store.setState({
      modelo: { ...store.getState().modelo, nombre: "Nombre posterior" },
      dirty: true,
      dirtyModelo: true,
    });
    gate.liberar();
    await esperar(() => store.getState().mensaje === "Modelo renombrado; hay cambios posteriores pendientes");

    const pestana = store.getState().pestanasAbiertas.find(
      (item) => item.id === store.getState().pestanaActivaId,
    );
    expect(store.getState().modelo.nombre).toBe("Nombre posterior");
    expect(store.getState().dirty).toBe(true);
    expect(JSON.parse(pestana!.snapshotJson!).modelo.nombre).toBe("Nombre enviado");
    expect(backend.modelos.get(id)?.nombre).toBe("Nombre enviado");
  });

  test("renombrado tardio actualiza la pestana origen sin tocar la activa", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo a renombrar" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const pestanaOrigenId = store.getState().pestanaActivaId;
    const modeloEnviado = { ...store.getState().modelo, nombre: "Modelo renombrado en origen" };

    const gate = backend.bloquearSiguienteGuardado();
    store.getState().renombrarModeloActual("Modelo renombrado en origen");
    await gate.iniciado;
    store.getState().crearProcesoDemo();
    const modeloVivoEsperado = {
      ...store.getState().modelo,
      nombre: "Modelo renombrado en origen",
    };
    store.getState().abrirPestanaNueva();
    const pestanaActivaId = store.getState().pestanaActivaId;
    const jsonPestanaActiva = exportarModelo(store.getState().modelo);
    gate.liberar();
    await esperar(() => backend.modelos.get(id)?.nombre === "Modelo renombrado en origen");

    const estado = store.getState();
    const pestanaOrigen = estado.pestanasAbiertas.find((pestana) => pestana.id === pestanaOrigenId);
    expect(estado.pestanaActivaId).toBe(pestanaActivaId);
    expect(exportarModelo(estado.modelo)).toBe(jsonPestanaActiva);
    expect(exportarModelo(pestanaOrigen!.modelo)).toBe(exportarModelo(modeloVivoEsperado));
    expect(pestanaOrigen?.dirty).toBe(true);
    expect(pestanaOrigen?.snapshotJson).toBe(exportarModelo(modeloEnviado));
  });

  test("cargar modelo usa backend como unica fuente", async () => {
    const modeloServidor = crearModelo("Copia backend vigente");
    const ahora = "2026-06-06T00:00:00.000Z";
    backend.modelos.set("modelo-stale", {
      id: "modelo-stale",
      nombre: "Copia backend vigente",
      descripcion: "server",
      creadoEn: ahora,
      actualizadoEn: ahora,
      carpetaId: null,
      json: exportarModelo(modeloServidor),
      revision: 1,
    });
    store.setState({ modelosGuardados: [{
      id: "modelo-stale",
      nombre: "Copia backend vigente",
      descripcion: "server",
      creadoEn: ahora,
      actualizadoEn: ahora,
      revision: 1,
    }] });

    store.getState().cargarLocal("modelo-stale");
    await esperar(() => store.getState().mensaje === "Modelo cargado: Copia backend vigente");

    expect(store.getState().modelo.nombre).toBe("Copia backend vigente");
    expect(store.getState().descripcionModeloLocal).toBe("server");
  });

  test("cargar modelo reevalua drift despues de montar la revision hidratada", async () => {
    const modeloServidor = crearModelo("Revision del agente");
    const ahora = "2026-07-12T00:00:00.000Z";
    backend.modelos.set("modelo-agente", {
      id: "modelo-agente",
      nombre: "Revision del agente",
      descripcion: "server",
      creadoEn: ahora,
      actualizadoEn: ahora,
      carpetaId: null,
      json: exportarModelo(modeloServidor),
      revision: 2,
    });
    const modelosEvaluados: string[] = [];
    store.setState({
      cargarYEvaluarDrift: async () => {
        modelosEvaluados.push(store.getState().modelo.nombre);
      },
    });

    store.getState().cargarLocal("modelo-agente");
    await esperar(() => modelosEvaluados.length > 0);

    expect(modelosEvaluados).toEqual(["Revision del agente"]);
  });

  test("abrir pestaña descarta una respuesta vieja aunque la pestaña nueva ya se cerró", async () => {
    const id = "modelo-apertura-invertida";
    const revisionTres = {
      id,
      nombre: "Revisión 3",
      descripcion: "",
      creadoEn: "2026-07-18T00:00:00.000Z",
      actualizadoEn: "2026-07-18T00:00:00.000Z",
      json: exportarModelo(crearModelo("Revisión 3")),
      revision: 3,
    };
    backend.modelos.set(id, revisionTres);
    const respuestaVieja = backend.bloquearRespuestaSiguienteCarga();
    store.getState().abrirPestanaConModelo(id);
    await respuestaVieja.iniciado;

    backend.modelos.set(id, {
      ...revisionTres,
      nombre: "Revisión 4",
      json: exportarModelo(crearModelo("Revisión 4")),
      revision: 4,
    });
    store.getState().abrirPestanaConModelo(id);
    await esperar(() => store.getState().revisionBasePorModelo[id] === 4);
    const pestanaNueva = store.getState().pestanasAbiertas.find(
      (pestana) => pestana.modeloId === id,
    );
    expect(pestanaNueva).toBeDefined();
    store.getState().cerrarPestana(pestanaNueva!.id, { forzar: true });

    respuestaVieja.liberar();
    await Promise.resolve();
    await Promise.resolve();

    expect(store.getState().revisionBasePorModelo[id]).toBe(4);
    expect(store.getState().pestanasAbiertas.some((pestana) => pestana.modeloId === id)).toBe(false);
  });

  test("A′-vitrina: guardado propio NO gatilla el chip; push del agente SÍ", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo vitrina" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    // La base se fija al nacer el modelo.
    expect(typeof store.getState().revisionBasePorModelo[id]).toBe("number");
    // Guardado propio adicional: la base debe avanzar con la revisión.
    store.getState().crearProcesoDemo();
    store.getState().guardarLocal();
    await esperar(() => store.getState().dirty === false && store.getState().mensaje === "Modelo guardado exitosamente");
    const base1 = store.getState().revisionBasePorModelo[id]!;
    await store.getState().verificarRevisionRemota();
    // remota == base ⇒ el selector oculta el chip (mi propio guardado).
    expect(store.getState().revisionRemota).toEqual({ modeloId: id, revision: base1 });
    // Simular push del agente: el backend avanza una revisión por fuera.
    backend.modelos.set(id, { ...backend.modelos.get(id)!, revision: base1 + 1 });
    await store.getState().verificarRevisionRemota();
    expect(store.getState().revisionRemota).toEqual({ modeloId: id, revision: base1 + 1 });
    // Base intacta ⇒ remota > base ⇒ el selector mostrará el chip.
    expect(store.getState().revisionBasePorModelo[id]).toBe(base1);
  });

  test("el poll remoto no retrocede si sus respuestas llegan invertidas", async () => {
    store.getState().guardarComoLocal({ nombre: "Modelo poll monotónico" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const respuestaVieja = backend.bloquearRespuestaSiguienteCarga();

    const primerPoll = store.getState().verificarRevisionRemota();
    await respuestaVieja.iniciado;
    backend.modelos.set(id, { ...backend.modelos.get(id)!, revision: 2 });
    await store.getState().verificarRevisionRemota();
    expect(store.getState().revisionRemota).toEqual({ modeloId: id, revision: 2 });

    respuestaVieja.liberar();
    await primerPoll;

    expect(store.getState().revisionRemota).toEqual({ modeloId: id, revision: 2 });
  });

  test("A′-vitrina: traerRevisionDelAgente recarga y limpia revisionRemota", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo traer" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const base = store.getState().revisionBasePorModelo[id]!;
    backend.modelos.set(id, { ...backend.modelos.get(id)!, revision: base + 1 });
    await store.getState().verificarRevisionRemota();
    expect(store.getState().revisionRemota).not.toBeNull();
    store.getState().traerRevisionDelAgente();
    await esperar(() => store.getState().revisionRemota === null && store.getState().revisionBasePorModelo[id] === base + 1);
    expect(store.getState().revisionBasePorModelo[id]).toBe(base + 1); // base avanzó al recargar la revisión del agente
  });

  test("una respuesta tardia de renombrado no repuebla estado despues de logout", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo de la sesión" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;

    const gate = backend.bloquearSiguienteGuardado();
    store.getState().renombrarModeloActual("Nombre que llega tarde");
    await gate.iniciado;
    await store.getState().cerrarSesion();
    expect(store.getState().requiereLogin).toBe(true);
    expect(store.getState().modelosGuardados).toEqual([]);
    const nombreTrasLogout = store.getState().modelo.nombre;

    gate.liberar();
    await esperar(() => backend.modelos.get(id)?.nombre === "Nombre que llega tarde");

    expect(store.getState().modelosGuardados).toEqual([]);
    expect(store.getState().modelo.nombre).toBe(nombreTrasLogout);
  });
});

interface BackendMock {
  modelos: Map<string, ModeloPersistido>;
  autosaves: Map<string, { modeloId: string; creadoEn: string; json: string }>;
  modelPostCount: number;
  autosavePutCount: number;
  workspace: {
    modelos: Array<{
      id: string;
      carpetaId: string | null;
      versiones?: Array<{
        id: string;
        creadoEn: string;
        nombre: string;
        modeloPayloadKey: string;
        bytes: number;
      }>;
    }>;
    carpetas: [];
    recientes: string[];
    preferenciasUi?: {
      anchoPanelArbol?: number;
      anchoPanelInspector?: number;
    };
  };
  workspaceRevision: number;
  workspacePutCount: number;
  workspaceRevisionBases: number[];
  revisionPostCount: number;
  fallarSiguienteRevisionAtomica(): void;
  bloquearSiguienteGuardado(): { iniciado: Promise<void>; liberar(): void };
  bloquearSiguienteWorkspacePut(): { iniciado: Promise<void>; liberar(): void };
  bloquearRespuestaSiguienteGuardado(): { iniciado: Promise<void>; liberar(): void };
  bloquearRespuestaSiguienteListado(): { iniciado: Promise<void>; liberar(): void };
  bloquearRespuestaSiguienteCarga(): { iniciado: Promise<void>; liberar(): void };
}

function instalarBackendMock(): BackendMock {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  originalFetch = globalThis.fetch;
  let siguienteGuardado:
    | { iniciado: ReturnType<typeof diferido>; liberado: ReturnType<typeof diferido> }
    | null = null;
  let siguienteRespuestaGuardado:
    | { iniciado: ReturnType<typeof diferido>; liberado: ReturnType<typeof diferido> }
    | null = null;
  let siguienteRespuestaListado:
    | { iniciado: ReturnType<typeof diferido>; liberado: ReturnType<typeof diferido> }
    | null = null;
  let siguienteRespuestaCarga:
    | { iniciado: ReturnType<typeof diferido>; liberado: ReturnType<typeof diferido> }
    | null = null;
  let siguienteWorkspacePut:
    | { iniciado: ReturnType<typeof diferido>; liberado: ReturnType<typeof diferido> }
    | null = null;
  let fallaRevisionAtomica = false;
  const backend: BackendMock = {
    modelos: new Map(),
    autosaves: new Map(),
    modelPostCount: 0,
    autosavePutCount: 0,
    workspace: { modelos: [], carpetas: [], recientes: [] },
    workspaceRevision: 0,
    workspacePutCount: 0,
    workspaceRevisionBases: [],
    revisionPostCount: 0,
    fallarSiguienteRevisionAtomica() {
      fallaRevisionAtomica = true;
    },
    bloquearSiguienteGuardado() {
      const iniciado = diferido();
      const liberado = diferido();
      siguienteGuardado = { iniciado, liberado };
      return { iniciado: iniciado.promise, liberar: liberado.resolver };
    },
    bloquearSiguienteWorkspacePut() {
      const iniciado = diferido();
      const liberado = diferido();
      siguienteWorkspacePut = { iniciado, liberado };
      return { iniciado: iniciado.promise, liberar: liberado.resolver };
    },
    bloquearRespuestaSiguienteGuardado() {
      const iniciado = diferido();
      const liberado = diferido();
      siguienteRespuestaGuardado = { iniciado, liberado };
      return { iniciado: iniciado.promise, liberar: liberado.resolver };
    },
    bloquearRespuestaSiguienteListado() {
      const iniciado = diferido();
      const liberado = diferido();
      siguienteRespuestaListado = { iniciado, liberado };
      return { iniciado: iniciado.promise, liberar: liberado.resolver };
    },
    bloquearRespuestaSiguienteCarga() {
      const iniciado = diferido();
      const liberado = diferido();
      siguienteRespuestaCarga = { iniciado, liberado };
      return { iniciado: iniciado.promise, liberar: liberado.resolver };
    },
  };
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    if (url === "/__deep-opm/session") {
      return Promise.resolve(jsonResponse({ session: { tenantId: "tenant-test", userId: "user-test" } }));
    }
    if (url === "/__deep-opm/modelos?includePayload=1" && method === "GET") {
      const response = jsonResponse({ modelos: [...backend.modelos.values()] });
      const bloqueo = siguienteRespuestaListado;
      siguienteRespuestaListado = null;
      if (bloqueo) {
        bloqueo.iniciado.resolver();
        return bloqueo.liberado.promise.then(() => response);
      }
      return Promise.resolve(response);
    }
    if (url === "/__deep-opm/workspace" && method === "GET") {
      return Promise.resolve(jsonResponse({
        indice: backend.workspace,
        revision: backend.workspaceRevision,
      }));
    }
    if (url === "/__deep-opm/workspace" && method === "PUT") {
      backend.workspacePutCount += 1;
      backend.workspaceRevisionBases.push(body.revisionBase);
      const persist = () => {
        if (body.revisionBase !== backend.workspaceRevision) {
          return jsonResponse({
            error: "Workspace desactualizado; recarga antes de guardar",
          }, 409);
        }
        backend.workspace = body.indice;
        backend.workspaceRevision += 1;
        return jsonResponse({
          indice: backend.workspace,
          revision: backend.workspaceRevision,
        });
      };
      const bloqueo = siguienteWorkspacePut;
      siguienteWorkspacePut = null;
      if (bloqueo) {
        bloqueo.iniciado.resolver();
        return bloqueo.liberado.promise.then(persist);
      }
      return Promise.resolve(persist());
    }
    if (url === "/__deep-opm/modelos" && method === "POST") {
      backend.modelPostCount += 1;
      const incoming = body.modelo as ModeloPersistido;
      const persistir = () => {
        const actual = backend.modelos.get(incoming.id);
        if (actual && incoming.revision !== actual.revision) {
          return jsonResponse({ error: "Conflicto de persistencia" }, 409);
        }
        if (!actual && incoming.revision !== undefined) {
          return jsonResponse({ error: "El modelo ya no existe" }, 409);
        }
        const guardado = { ...incoming, revision: actual ? (actual.revision ?? 1) + 1 : 1 };
        backend.modelos.set(guardado.id, guardado);
        return jsonResponse({ modelo: guardado });
      };
      const bloqueo = siguienteGuardado;
      siguienteGuardado = null;
      if (bloqueo) {
        bloqueo.iniciado.resolver();
        return bloqueo.liberado.promise.then(persistir);
      }
      const bloqueoRespuesta = siguienteRespuestaGuardado;
      siguienteRespuestaGuardado = null;
      if (bloqueoRespuesta) {
        const response = persistir();
        bloqueoRespuesta.iniciado.resolver();
        return bloqueoRespuesta.liberado.promise.then(() => response);
      }
      return Promise.resolve(persistir());
    }
    if (url.endsWith("/autosave") && method === "PUT") {
      backend.autosavePutCount += 1;
      const partes = url.split("/");
      const id = decodeURIComponent(partes[partes.length - 2] ?? "");
      const persistir = () => {
        const actual = backend.modelos.get(id);
        if (!actual || actual.revision !== body.revisionBase) {
          return jsonResponse({ error: "Conflicto de persistencia" }, 409);
        }
        const autosave = {
          modeloId: id,
          creadoEn: body.creadoEn,
          json: body.json,
        };
        backend.autosaves.set(id, autosave);
        backend.modelos.set(id, { ...actual, autosalvado: true });
        return jsonResponse(autosave);
      };
      const bloqueo = siguienteGuardado;
      siguienteGuardado = null;
      if (bloqueo) {
        bloqueo.iniciado.resolver();
        return bloqueo.liberado.promise.then(persistir);
      }
      return Promise.resolve(persistir());
    }
    if (url.endsWith("/autosave") && method === "GET") {
      const partes = url.split("/");
      const id = decodeURIComponent(partes[partes.length - 2] ?? "");
      const autosave = backend.autosaves.get(id);
      return Promise.resolve(autosave
        ? jsonResponse(autosave)
        : jsonResponse({ error: "Autosalvado no encontrado" }, 404));
    }
    if (url.endsWith("/revisiones") && method === "POST") {
      backend.revisionPostCount += 1;
      if (fallaRevisionAtomica) {
        fallaRevisionAtomica = false;
        return Promise.resolve(jsonResponse({ error: "Fallo atómico" }, 503));
      }
      const incoming = body.model as ModeloPersistido;
      const actual = backend.modelos.get(incoming.id);
      if (!actual || actual.revision !== incoming.revision) {
        return Promise.resolve(jsonResponse({ error: "Conflicto de persistencia" }, 409));
      }
      const version = {
        ...body.version,
        modeloPayloadKey: body.version.id,
        bytes: incoming.json.length,
      };
      const guardado = {
        ...incoming,
        autosalvado: false,
        revision: (actual.revision ?? 0) + 1,
      };
      backend.modelos.set(guardado.id, guardado);
      backend.autosaves.delete(guardado.id);
      const entrada = backend.workspace.modelos.find((item) => item.id === guardado.id) ?? {
        id: guardado.id,
        carpetaId: guardado.carpetaId ?? null,
      };
      backend.workspace = {
        ...backend.workspace,
        modelos: [
          ...backend.workspace.modelos.filter((item) => item.id !== guardado.id),
          {
            ...entrada,
            versiones: [
              version,
              ...(entrada.versiones ?? []).filter((item) => item.id !== version.id),
            ],
          },
        ],
        recientes: [
          guardado.id,
          ...backend.workspace.recientes.filter((id) => id !== guardado.id),
        ],
      };
      backend.workspaceRevision += 1;
      return Promise.resolve(jsonResponse({
        model: guardado,
        version,
        workspace: {
          indice: backend.workspace,
          revision: backend.workspaceRevision,
        },
      }));
    }
    if (url.includes("/versiones/") && method === "DELETE") {
      return Promise.resolve(jsonResponse({ error: "Fallo backend" }, 503));
    }
    if (url.startsWith("/__deep-opm/modelos/") && method === "DELETE") {
      const id = decodeURIComponent(url.split("/").pop() ?? "");
      const deleted = backend.modelos.delete(id);
      backend.autosaves.delete(id);
      return Promise.resolve(deleted
        ? jsonResponse({ ok: true })
        : jsonResponse({ error: "Modelo no encontrado" }, 404));
    }
    if (url.startsWith("/__deep-opm/modelos/") && method === "GET") {
      const id = decodeURIComponent(url.split("/").pop() ?? "");
      const modelo = backend.modelos.get(id);
      const response = modelo ? jsonResponse({ modelo }) : jsonResponse({ error: "Modelo no encontrado" }, 404);
      const bloqueo = siguienteRespuestaCarga;
      siguienteRespuestaCarga = null;
      if (bloqueo) {
        bloqueo.iniciado.resolver();
        return bloqueo.liberado.promise.then(() => response);
      }
      return Promise.resolve(response);
    }
    return Promise.resolve(jsonResponse({ error: "unexpected" }, 404));
  }) as unknown as typeof fetch;
  return backend;
}

function diferido(): { promise: Promise<void>; resolver(): void } {
  let resolver = () => {};
  const promise = new Promise<void>((resolve) => {
    resolver = resolve;
  });
  return { promise, resolver };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function esperar(condicion: () => boolean): Promise<void> {
  for (let intento = 0; intento < 30; intento += 1) {
    if (condicion()) return;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  throw new Error("La condición esperada no se cumplió");
}
