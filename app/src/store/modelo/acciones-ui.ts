import { crearModelo } from "../../modelo/operaciones";
import type { Modelo, PestanaId, VersionResumen } from "../../modelo/tipos";
import {
  construirModeloPersistido,
  resumenDesdeModeloPersistido,
  type ModeloPersistido,
  type ResumenModeloPersistido,
} from "../../persistencia/modelos";
import {
  confirmarRevisionBackend,
  guardarModeloBackend,
  guardarVersionBackend,
  persistenciaBackendHabilitada,
} from "../../persistencia/backend";
import {
  validarNombreModeloLocal,
  workspaceDesdeModelo,
  type WorkspaceIndice,
  type WorkspacePersistido,
} from "../../persistencia/workspace";
import { construirVersionPersistible } from "../../persistencia/versiones";
import { exportarModelo, hidratarModelo } from "../../serializacion/json";
import { nombreApunteDeFecha } from "../../persistencia/nombreApunte";
import {
  activarPestanaNueva,
  crearIdModeloLocal,
  escribirIndiceWorkspace,
  escribirPreferenciaBooleana,
  estadoModelo,
  leerIndiceWorkspace,
  listarModelosGuardadosSeguro,
  mapaWorkspaceDesdeEstado,
  marcarSnapshotModelo,
  mergeWorkspaceBootstrap,
  modelosRecientesDeIndice,
  observePersistedWorkspace,
  obtenerEstadoStore,
  pestanaReemplazable,
  resetHistorial,
  PREF_MOSTRAR_ARCHIVADOS_KEY,
  sincronizarIndiceConModelosGuardados,
  conBaseRevision,
  type GetStore,
  type SetStore,
} from "../runtime";
import { crearPestanaNueva, etiquetaPestana } from "../pestanas";
import { captureSessionEpoch, isSessionEpochCurrent } from "../sessionEpoch";
import type { ModeloSlice } from "../tipos";

let limpiarResaltadoTimer: number | null = null;

/**
 * Acciones de UI: limpiar mensaje, abrir/cerrar menú principal y diálogos
 * (guardar como, cargar modelo), guardar como local, cargar local desde
 * diálogo, nuevo modelo (reemplaza pestaña vacía o abre nueva), modal URLs.
 *
 * L3 traer conectados: [Met §multi-OPD], [Glos 3.6].
 * L1 persistencia/carga: [Met §6].
 */
export function accionesUI(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  let secuenciaIntentPersistencia = 0;
  const ultimoIntentPorPestana = new Map<PestanaId, { id: number; nombre: string }>();
  const registrarIntent = (pestanaId: PestanaId, nombre: string) => {
    const intent = { id: ++secuenciaIntentPersistencia, nombre };
    ultimoIntentPorPestana.set(pestanaId, intent);
    return intent;
  };

  return {
    dialogoConfiguracionAbierto: false,
    dialogoSimulacionNumericaAbierto: false,
    dialogoTraerConectadosAbierto: false,
    // Brecha B3/B4: estado del diálogo de colisión de nombre. null = cerrado.
    colisionPendiente: null,

    limpiarMensaje() {
      set({ mensaje: null });
    },

    abrirMenuPrincipal() {
      // P0-2: cerrar el menu ⋯ Mas si estaba abierto. Solo un menu primario
      // visible a la vez para evitar solapamientos.
      set({
        menuPrincipalAbierto: true,
        toolbarMasAbierto: false,
        modelosGuardados: persistenciaBackendHabilitada() ? get().modelosGuardados : listarModelosGuardadosSeguro(),
        mensaje: null,
      });
    },

    cerrarMenuPrincipal() {
      set({ menuPrincipalAbierto: false });
    },

    fijarToolbarMasAbierto(abierto: boolean) {
      // P0-2: si se abre el menu ⋯ Mas, cerrar MenuPrincipal lateral.
      if (abierto) {
        set({ toolbarMasAbierto: true, menuPrincipalAbierto: false });
        return;
      }
      set({ toolbarMasAbierto: false });
    },

    abrirGuardarComo() {
      const { modelo, modeloPersistidoId, descripcionModeloLocal, indice } = get();
      const modelosGuardados = persistenciaBackendHabilitada() ? get().modelosGuardados : listarModelosGuardadosSeguro();
      const indiceSinc = sincronizarIndiceConModelosGuardados(modelosGuardados, indice);
      const carpetaId = modeloPersistidoId
        ? indiceSinc.modelos.find((m) => m.id === modeloPersistidoId)?.carpetaId ?? null
        : get().carpetaActualId;
      set({
        menuPrincipalAbierto: false,
        dialogoGuardarComoAbierto: true,
        workspaceLocal: workspaceDesdeModelo(modelo, modeloPersistidoId, descripcionModeloLocal, carpetaId),
        modelosGuardados,
        indice: indiceSinc,
        carpetaActualId: carpetaId,
        mensaje: null,
      });
    },

    cerrarGuardarComo() {
      set({ dialogoGuardarComoAbierto: false });
    },

    guardarComoLocal(input) {
      const sessionEpoch = captureSessionEpoch();
      const {
        modelo,
        modelosGuardados,
        descripcionModeloLocal,
        carpetaActualId,
        pestanaActivaId,
      } = get();
      const validacion = validarNombreModeloLocal(input.nombre, modelosGuardados);
      if (!validacion.ok) {
        set({ mensaje: validacion.error ?? "Nombre de modelo inválido" });
        return;
      }
      const intent = registrarIntent(pestanaActivaId, validacion.nombre);
      const descripcion = input.descripcion?.trim() ?? "";
      const modeloNombrado: Modelo = { ...modelo, nombre: validacion.nombre };
      const carpetaParaGuardar = carpetaActualId;
      const indiceInicial = get().indice;
      const json = exportarModelo(modeloNombrado, carpetaParaGuardar);
      const mapaParaGuardar = mapaWorkspaceDesdeEstado(get());
      const inputGuardado = {
        // Nacimiento (R-OPD-REF-15): `nacerApunte` pre-genera el id y lo enhebra
        // aquí para que `modelo.id === record.id` (la especie se deriva del índice
        // por ese id; sin esta reconciliación la cinta «Apunte» no encendería).
        // Los demás llamadores omiten `id` → null → id nuevo (comportamiento previo).
        id: input.id ?? null,
        nombre: validacion.nombre,
        descripcion,
        json,
        autosalvado: false,
        // NOTA: `esApunte` NO va al record. La especie es un flag SÓLO-ÍNDICE
        // (invariante documentado en `mesa/especieWorkspace.ts`): el record de
        // Postgres no es su SSOT. Marcarlo en el record re-infectaría el índice al
        // sincronizar (runtime.ts::sincronizarIndiceConModelosGuardados) y
        // des-graduaría un apunte. Se enhebra sólo a la entrada de índice (abajo).
        ...(carpetaParaGuardar !== undefined ? { carpetaId: carpetaParaGuardar } : {}),
        ...(input.crearVersionAlGuardar !== undefined ? { crearVersionAlGuardar: input.crearVersionAlGuardar } : {}),
      };
      const modeloPersistido = construirModeloPersistido(inputGuardado);
      const finalizarGuardadoComo = (
        guardadoBase: ModeloPersistido,
        mensaje = "Modelo guardado exitosamente",
        confirmado?: {
          versiones: VersionResumen[];
          workspace: WorkspacePersistido;
        },
      ) => {
        let guardado = guardadoBase;
        let versiones: VersionResumen[] = confirmado?.versiones ?? [];
        if (confirmado) {
          guardado = { ...guardado, versiones };
          observePersistedWorkspace(confirmado.workspace);
        } else if (input.crearVersionAlGuardar) {
          const version = construirVersionPersistible(modeloNombrado, { descripcion: "Versión inicial" });
          versiones = [version.version];
          guardado = { ...guardado, versiones, crearVersionAlGuardar: true };
          void guardarVersionBackend(guardado.id, version.version, version.json).then((resultado) => {
            if (isSessionEpochCurrent(sessionEpoch) && !resultado.ok && !get().requiereLogin) {
              set({ mensaje: `Modelo guardado; no se pudo guardar versión en servidor: ${resultado.error}` });
            }
          });
        }
        reconciliarGuardadoComo({
          set,
          get,
          guardado,
          pestanaOrigenId: pestanaActivaId,
          intentVigente: ultimoIntentPorPestana.get(pestanaActivaId)?.id === intent.id,
          modeloInicial: modelo,
          modeloEnviado: modeloNombrado,
          descripcionInicial: descripcionModeloLocal,
          descripcionEnviada: descripcion,
          carpetaEnviada: carpetaParaGuardar,
          mapaEnviado: mapaParaGuardar,
          indiceInicial,
          esApunte: input.esApunte === true,
          versiones,
          mensaje,
          ...(confirmado
            ? { workspaceConfirmado: confirmado.workspace }
            : {}),
        });
      };
      if (persistenciaBackendHabilitada()) {
        if (input.esApunte === true) {
          const version = construirVersionPersistible(modeloNombrado, {
            descripcion: "Versión inicial",
          });
          set({ mensaje: "Creando apunte en servidor..." });
          void confirmarRevisionBackend({
            model: modeloPersistido,
            version: version.version,
            base: { kind: "new" },
            speciesOnCreate: "apunte",
          }).then((resultado) => {
            if (!isSessionEpochCurrent(sessionEpoch)) return;
            if (resultado.ok) {
              if (get().requiereLogin) return;
              finalizarGuardadoComo(
                resultado.value.model,
                "Apunte creado",
                {
                  versiones: [resultado.value.version],
                  workspace: resultado.value.workspace,
                },
              );
              return;
            }
            if (!get().requiereLogin) {
              set({ mensaje: `No se pudo crear el apunte: ${resultado.error}` });
            }
          });
          return;
        }
        set({ mensaje: "Guardando modelo en servidor..." });
        void guardarModeloBackend(modeloPersistido).then((resultado) => {
          if (!isSessionEpochCurrent(sessionEpoch)) return;
          if (resultado.ok) {
            if (get().requiereLogin) return;
            finalizarGuardadoComo(resultado.value);
            return;
          }
          if (!get().requiereLogin) {
            set({ mensaje: `No se pudo guardar en servidor: ${resultado.error}` });
          }
        });
        return;
      }
      set({ mensaje: "Backend de modelos no disponible" });
    },

    guardarComoLocalConDescripcion(input) {
      const sessionEpoch = captureSessionEpoch();
      const {
        modelo,
        modeloPersistidoId,
        modelosGuardados,
        descripcionModeloLocal,
        carpetaActualId,
        pestanaActivaId,
        revisionBasePorModelo,
      } = get();
      const validacion = validarNombreModeloLocal(input.nombre, modelosGuardados, modeloPersistidoId);
      if (!validacion.ok) {
        set({ mensaje: validacion.error ?? "Nombre de modelo inválido" });
        return;
      }
      const intent = registrarIntent(pestanaActivaId, validacion.nombre);
      const descripcion = input.descripcion?.trim() ?? "";
      const modeloNombrado: Modelo = { ...modelo, nombre: validacion.nombre, ...(descripcion ? { descripcion } : {}) };
      const carpetaParaGuardar = carpetaActualId;
      const indiceInicial = get().indice;
      const json = exportarModelo(modeloNombrado, carpetaParaGuardar);
      const mapaParaGuardar = mapaWorkspaceDesdeEstado(get());
      const modeloActualPersistido = modeloPersistidoId
        ? modelosGuardados.find((guardado) => guardado.id === modeloPersistidoId)
        : undefined;
      const actualizarModeloActual = modeloPersistidoId !== null &&
        nombresModeloIguales(modeloActualPersistido?.nombre ?? modelo.nombre, validacion.nombre);
      const baseRevision = modeloPersistidoId
        ? revisionBasePorModelo[modeloPersistidoId]
        : undefined;
      if (actualizarModeloActual && typeof baseRevision !== "number") {
        set({ mensaje: "No se puede guardar: recarga el modelo para fijar su revisión base" });
        return;
      }
      const inputGuardado = {
        id: actualizarModeloActual ? modeloPersistidoId : null,
        nombre: validacion.nombre,
        descripcion,
        json,
        autosalvado: false,
        ...(actualizarModeloActual && typeof baseRevision === "number"
          ? { revision: baseRevision }
          : {}),
        ...(carpetaParaGuardar !== undefined ? { carpetaId: carpetaParaGuardar } : {}),
        ...(input.crearVersionAlGuardar !== undefined ? { crearVersionAlGuardar: input.crearVersionAlGuardar } : {}),
      };
      const modeloPersistido = construirModeloPersistido(inputGuardado, actualizarModeloActual ? modeloActualPersistido : undefined);
      const finalizarGuardadoComo = (guardadoBase: ModeloPersistido, mensaje = "Modelo guardado exitosamente") => {
        let guardado = guardadoBase;
        let versiones: VersionResumen[] = actualizarModeloActual ? guardado.versiones ?? [] : [];
        if (input.crearVersionAlGuardar) {
          const version = construirVersionPersistible(modeloNombrado, { descripcion: "Versión inicial" });
          versiones = [version.version, ...versiones];
          guardado = { ...guardado, versiones, crearVersionAlGuardar: true };
          void guardarVersionBackend(guardado.id, version.version, version.json).then((resultado) => {
            if (isSessionEpochCurrent(sessionEpoch) && !resultado.ok && !get().requiereLogin) {
              set({ mensaje: `Modelo guardado; no se pudo guardar versión en servidor: ${resultado.error}` });
            }
          });
        }
        reconciliarGuardadoComo({
          set,
          get,
          guardado,
          pestanaOrigenId: pestanaActivaId,
          intentVigente: ultimoIntentPorPestana.get(pestanaActivaId)?.id === intent.id,
          modeloInicial: modelo,
          modeloEnviado: modeloNombrado,
          descripcionInicial: descripcionModeloLocal,
          descripcionEnviada: descripcion,
          carpetaEnviada: carpetaParaGuardar,
          mapaEnviado: mapaParaGuardar,
          indiceInicial,
          esApunte: false,
          versiones,
          mensaje,
          descripcionIndice: descripcion,
          limiteRecientes: 12,
        });
      };
      if (persistenciaBackendHabilitada()) {
        set({ mensaje: "Guardando modelo en servidor..." });
        void guardarModeloBackend(modeloPersistido).then((resultado) => {
          if (!isSessionEpochCurrent(sessionEpoch)) return;
          if (resultado.ok) {
            if (get().requiereLogin) return;
            finalizarGuardadoComo(resultado.value);
            return;
          }
          if (!get().requiereLogin) {
            set({ mensaje: `No se pudo guardar en servidor: ${resultado.error}` });
          }
        });
        return;
      }
      set({ mensaje: "Backend de modelos no disponible" });
    },

    abrirCargarModelo(opciones) {
      const modelosGuardados = persistenciaBackendHabilitada() ? get().modelosGuardados : listarModelosGuardadosSeguro();
      const indiceBase = persistenciaBackendHabilitada() ? get().indice : leerIndiceWorkspace();
      const indiceSinc = sincronizarIndiceConModelosGuardados(modelosGuardados, indiceBase);
      const activarArchivados = opciones?.mostrarArchivados === true;
      if (activarArchivados && !get().mostrarArchivados) {
        escribirPreferenciaBooleana(PREF_MOSTRAR_ARCHIVADOS_KEY, true);
      }
      set({
        menuPrincipalAbierto: false,
        dialogoCargarModeloAbierto: true,
        modelosGuardados,
        indice: indiceSinc,
        carpetaActualId: null,
        modelosRecientes: modelosRecientesDeIndice(indiceSinc, modelosGuardados),
        mensaje: null,
        ...(activarArchivados ? { mostrarArchivados: true } : {}),
      });
    },

    cerrarCargarModelo() {
      set({ dialogoCargarModeloAbierto: false });
    },

    abrirDialogoImportarExportarJson() {
      set({
        menuPrincipalAbierto: false,
        dialogoImportarExportarJsonAbierto: true,
        modelosGuardados: persistenciaBackendHabilitada() ? get().modelosGuardados : listarModelosGuardadosSeguro(),
        mensaje: null,
      });
    },

    cerrarDialogoImportarExportarJson() {
      set({ dialogoImportarExportarJsonAbierto: false });
    },

    cargarLocalDesdeDialogo(id) {
      get().cargarLocal(id);
      if (obtenerEstadoStore().modeloPersistidoId === id) {
        set({ dialogoCargarModeloAbierto: false });
      }
    },

    abrirDialogoConfiguracion() {
      set({ dialogoConfiguracionAbierto: true, menuPrincipalAbierto: false, mensaje: null });
    },

    cerrarDialogoConfiguracion() {
      set({ dialogoConfiguracionAbierto: false });
    },

    abrirDialogoSimulacionNumerica() {
      set({ dialogoSimulacionNumericaAbierto: true, menuPrincipalAbierto: false, mensaje: null });
    },

    cerrarDialogoSimulacionNumerica() {
      set({ dialogoSimulacionNumericaAbierto: false });
    },

    abrirDialogoTraerConectados() {
      set({ dialogoTraerConectadosAbierto: true, mensaje: null });
    },

    cerrarDialogoTraerConectados() {
      set({ dialogoTraerConectadosAbierto: false });
    },

    resaltarTemporalmente(ids, ms = 3000) {
      if (limpiarResaltadoTimer !== null) {
        window.clearTimeout(limpiarResaltadoTimer);
      }
      set({ idsResaltadosTemporales: [...ids] });
      limpiarResaltadoTimer = window.setTimeout(() => {
        set({ idsResaltadosTemporales: [] });
        limpiarResaltadoTimer = null;
      }, ms);
    },

    renombrarModeloActual(nombre) {
      const sessionEpoch = captureSessionEpoch();
      const {
        modelo,
        modeloPersistidoId,
        descripcionModeloLocal,
        modelosGuardados,
        carpetaActualId,
        pestanaActivaId,
        revisionBasePorModelo,
      } = get();
      if (!modeloPersistidoId) {
        set({ mensaje: "Guarda el modelo antes de renombrarlo" });
        return;
      }
      const baseRevision = revisionBasePorModelo[modeloPersistidoId];
      if (typeof baseRevision !== "number") {
        set({ mensaje: "No se puede renombrar: recarga el modelo para fijar su revisión base" });
        return;
      }
      const validacion = validarNombreModeloLocal(nombre, modelosGuardados, modeloPersistidoId);
      if (!validacion.ok) {
        set({ mensaje: validacion.error ?? "Nombre de modelo inválido" });
        return;
      }
      const intent = registrarIntent(pestanaActivaId, validacion.nombre);
      const modeloRenombrado: Modelo = { ...modelo, nombre: validacion.nombre };
      if (persistenciaBackendHabilitada()) {
        const json = exportarModelo(modeloRenombrado, carpetaActualId);
        const existente = modelosGuardados.find((item) => item.id === modeloPersistidoId);
        const persistido = construirModeloPersistido({
          id: modeloPersistidoId,
          nombre: validacion.nombre,
          descripcion: descripcionModeloLocal,
          json,
          autosalvado: false,
          revision: baseRevision,
          ...(carpetaActualId !== undefined ? { carpetaId: carpetaActualId } : {}),
        }, existente);
        set({ mensaje: "Renombrando modelo en servidor..." });
        void guardarModeloBackend(persistido).then((resultado) => {
          if (!isSessionEpochCurrent(sessionEpoch)) return;
          if (!resultado.ok) {
            if (!get().requiereLogin) {
              set({ mensaje: `No se pudo renombrar en servidor: ${resultado.error}` });
            }
            return;
          }
          const estadoActual = get();
          if (estadoActual.requiereLogin) return;
          if (revisionGuardadoObsoleta(
            get,
            resultado.value.id,
            resultado.value.revision,
          )) {
            return;
          }
          const modelosActualizados = upsertModeloGuardadoComo(
            estadoActual.modelosGuardados,
            resultado.value,
          );
          const revisionesActualizadas = conBaseRevision(
            estadoActual.revisionBasePorModelo,
            resultado.value.id,
            resultado.value.revision,
          );
          const pestanaOrigen = estadoActual.pestanasAbiertas.find(
            (pestana) => pestana.id === pestanaActivaId,
          );
          if (!pestanaOrigen) {
            set({
              modelosGuardados: modelosActualizados,
              revisionBasePorModelo: revisionesActualizadas,
              mensaje: "Modelo renombrado",
            });
            return;
          }

          const origenSigueActivo = estadoActual.pestanaActivaId === pestanaActivaId;
          const modeloVivoBase = origenSigueActivo ? estadoActual.modelo : pestanaOrigen.modelo;
          const descripcionViva = origenSigueActivo
            ? estadoActual.descripcionModeloLocal
            : (pestanaOrigen.descripcionModeloLocal ?? descripcionModeloLocal);
          const intentMasReciente = ultimoIntentPorPestana.get(pestanaActivaId);
          const nombreVivo = intentMasReciente && intentMasReciente.id !== intent.id
            ? intentMasReciente.nombre
            : (modeloVivoBase.nombre === modelo.nombre
                ? validacion.nombre
                : modeloVivoBase.nombre);
          const modeloVivo = { ...modeloVivoBase, nombre: nombreVivo };
          const carpetaViva = estadoActual.indice.modelos
            .find((item) => item.id === modeloPersistidoId)?.carpetaId ?? null;
          const huboCambiosPosteriores =
            exportarModelo(modeloVivo) !== exportarModelo(modeloRenombrado) ||
            descripcionViva !== descripcionModeloLocal ||
            carpetaViva !== (carpetaActualId ?? null);
          const indice = {
            ...estadoActual.indice,
            modelos: estadoActual.indice.modelos.map((item) =>
              item.id === modeloPersistidoId ? { ...item } : item
            ),
          };
          escribirIndiceWorkspace(indice);
          const mensaje = huboCambiosPosteriores
            ? "Modelo renombrado; hay cambios posteriores pendientes"
            : "Modelo renombrado";
          const snapshotConfirmado = exportarModelo(modeloRenombrado);

          if (!origenSigueActivo) {
            set({
              pestanasAbiertas: estadoActual.pestanasAbiertas.map((pestana) =>
                pestana.id === pestanaActivaId
                  ? {
                      ...pestana,
                      modelo: modeloVivo,
                      etiqueta: etiquetaPestana({ nombre: modeloVivo.nombre, modeloId: modeloPersistidoId }),
                      dirty: huboCambiosPosteriores,
                      snapshotJson: snapshotConfirmado,
                    }
                  : pestana
              ),
              dialogoConfiguracionAbierto: false,
              modelosGuardados: modelosActualizados,
              revisionBasePorModelo: revisionesActualizadas,
              indice,
              mensaje,
            });
            return;
          }

          marcarSnapshotModelo(modeloRenombrado);
          const parcial = estadoModelo(modeloVivo, {
            dialogoConfiguracionAbierto: false,
            modelosGuardados: modelosActualizados,
            // A′-vitrina: renombrar es un guardado del modelo activo → avanza la base.
            revisionBasePorModelo: revisionesActualizadas,
            indice,
            workspaceLocal: workspaceDesdeModelo(
              modeloVivo,
              modeloPersistidoId,
              descripcionViva,
              carpetaViva,
            ),
            mensaje,
            dirty: huboCambiosPosteriores,
            dirtyModelo: huboCambiosPosteriores ? estadoActual.dirtyModelo : false,
          });
          const pestanasAbiertas = (
            parcial.pestanasAbiertas ?? estadoActual.pestanasAbiertas
          ).map((pestana) =>
            pestana.id === pestanaActivaId
              ? { ...pestana, snapshotJson: snapshotConfirmado }
              : pestana
          );
          set({ ...parcial, pestanasAbiertas });
        });
        return;
      }
      set({ mensaje: "Backend de modelos no disponible" });
    },

    nuevoModelo() {
      const actual = get().pestanasAbiertas.find((pestana) => pestana.id === get().pestanaActivaId);
      const modelo = crearModelo("Modelo");
      if (actual && pestanaReemplazable(actual)) {
        resetHistorial(modelo);
        set(estadoModelo(modelo, {
          opdActivoId: modelo.opdRaizId,
          seleccionId: null,
          seleccionados: [],
          modoSeleccion: "simple",
          enlaceSeleccionId: null,
          modoEnlace: null,
          modoCreacion: null,
          hoverOplRef: null,
          modeloPersistidoId: null,
          descripcionModeloLocal: "",
          menuPrincipalAbierto: false,
          dialogoGuardarComoAbierto: false,
          dialogoCargarModeloAbierto: false,
          workspaceLocal: workspaceDesdeModelo(modelo, null),
          mensaje: "Nuevo modelo",
          // B5: un modelo nuevo nunca es biblioteca — limpia la cinta de modo
          // y el solo-lectura por si venía de tener una biblioteca abierta.
          readOnly: false,
          esBibliotecaAbierta: false,
        }));
        return;
      }
      const pestana = crearPestanaNueva({ modelo });
      activarPestanaNueva(set, get, pestana, "Nuevo modelo en pestana");
      get().gobernarAperturaBiblioteca(false);
    },

    // «Todo nace apunte» (diseño §3, R-OPD-REF-15): la puerta humana «Nuevo» abre
    // AL INSTANTE un apunte editable con persistencia inmediata para habilitar el
    // autosalvado desde el primer trazo. Sin diálogo, sin ceremonia.
    //
    // Correcciones de verificación adversarial:
    //  (1) `guardarComoLocal` es ASÍNCRONO — su respuesta se reconcilia contra
    //      la pestaña/intención de origen para no borrar los primeros trazos.
    //      Modelo, versión inicial, especie y workspace se confirman mediante
    //      el mismo commit atómico antes de reconciliar la interfaz.
    //  (2) `modelo.id` NO se reconcilia con el id del record en el save normal
    //      (queda «modelo-1»); pero la especie se deriva del índice por
    //      `m.id === modelo.id`. Se pre-genera el id y se enhebra por
    //      `guardarComoLocal({ id })` para que `modelo.id === record.id` y la cinta
    //      «Apunte» encienda. Nace apunte, no modelo plano.
    nacerApunte() {
      const id = crearIdModeloLocal();
      const nombre = nombreApunteUnico(nombreApunteDeFecha(new Date()), get().modelosGuardados);
      const modelo: Modelo = { ...crearModelo(nombre), id };
      resetHistorial(modelo);
      set(estadoModelo(modelo, {
        opdActivoId: modelo.opdRaizId,
        seleccionId: null,
        seleccionados: [],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        modoCreacion: null,
        hoverOplRef: null,
        modeloPersistidoId: null,
        descripcionModeloLocal: "",
        menuPrincipalAbierto: false,
        dialogoGuardarComoAbierto: false,
        dialogoCargarModeloAbierto: false,
        workspaceLocal: workspaceDesdeModelo(modelo, null),
        mensaje: "Nuevo apunte",
        // Un apunte se edita: nunca solo-lectura ni biblioteca.
        readOnly: false,
        esBibliotecaAbierta: false,
      }));
      // Persiste el modelo de inmediato y, al confirmar, registra APUNTE en el
      // workspace. El id enhebrado hace `record.id === modelo.id`; el `.then`
      // fija `modeloPersistidoId` sin reemplazar trazos creados durante la red.
      get().guardarComoLocal({ id, nombre, descripcion: "", esApunte: true });
    },

    abrirModalUrls(entidadId) {
      if (!get().modelo.entidades[entidadId]) return;
      set({ modalUrlsAbierto: entidadId, menuPrincipalAbierto: false, mensaje: null });
    },

    cerrarModalUrls() {
      set({ modalUrlsAbierto: null });
    },

    abrirModalImagen(entidadId) {
      const entidad = get().modelo.entidades[entidadId];
      if (!entidad || entidad.tipo !== "objeto") return;
      set({ modalImagenAbierto: entidadId, menuPrincipalAbierto: false, mensaje: null });
    },

    cerrarModalImagen() {
      set({ modalImagenAbierto: null });
    },

    fijarModoImagenGlobal(modo) {
      const { modelo } = get();
      set({ uiModoImagenGlobal: modo, modelo: { ...modelo } });
    },

    activarReadOnly(activo) {
      set({ readOnly: activo, mensaje: activo ? "Modelo en solo lectura" : null });
    },

    // B5 (gesto de anclar): gobernanza de apertura. Una biblioteca se abre en
    // solo-lectura global (reusando `readOnly`) y enciende la cinta de modo
    // (`esBibliotecaAbierta`); un modelo normal limpia ambos. Es la única
    // fuente de verdad de esta transición — la invocan los puntos de apertura
    // (`cargarLocal`, `abrirPestanaConModelo`) y de reemplazo a no-biblioteca
    // (`nuevoModelo`, imports). El desbloqueo «Editar biblioteca» se hace con
    // `activarReadOnly(false)` (la cinta sigue mostrándose porque
    // `esBibliotecaAbierta` permanece `true`).
    gobernarAperturaBiblioteca(esBiblioteca) {
      set({ esBibliotecaAbierta: esBiblioteca, readOnly: esBiblioteca });
    },
  };
}

function reconciliarGuardadoComo(opts: {
  set: SetStore;
  get: GetStore;
  guardado: ModeloPersistido;
  pestanaOrigenId: PestanaId;
  intentVigente: boolean;
  modeloInicial: Modelo;
  modeloEnviado: Modelo;
  descripcionInicial: string;
  descripcionEnviada: string;
  carpetaEnviada: string | null | undefined;
  mapaEnviado: ReturnType<typeof mapaWorkspaceDesdeEstado>;
  indiceInicial: WorkspaceIndice;
  esApunte: boolean;
  versiones: VersionResumen[];
  mensaje: string;
  workspaceConfirmado?: WorkspacePersistido;
  descripcionIndice?: string;
  limiteRecientes?: number;
}): void {
  const estadoActual = opts.get();
  if (estadoActual.requiereLogin) return;
  if (revisionGuardadoObsoleta(
    opts.get,
    opts.guardado.id,
    opts.guardado.revision,
  )) {
    return;
  }
  const pestanaOrigen = opts.intentVigente
    ? estadoActual.pestanasAbiertas.find(
        (pestana) => pestana.id === opts.pestanaOrigenId,
      )
    : undefined;
  const origenSigueActivo = opts.intentVigente &&
    estadoActual.pestanaActivaId === opts.pestanaOrigenId;
  const puedeReconciliarOrigen = pestanaOrigen !== undefined;
  const modeloVivoBase = origenSigueActivo ? estadoActual.modelo : pestanaOrigen?.modelo;
  const descripcionVivaBase = origenSigueActivo
    ? estadoActual.descripcionModeloLocal
    : (pestanaOrigen?.descripcionModeloLocal ?? opts.descripcionInicial);
  const modeloVivo = modeloVivoBase
    ? aplicarIntentSobreModeloVivo(modeloVivoBase, opts.modeloInicial, opts.modeloEnviado)
    : opts.modeloEnviado;
  const descripcionViva = descripcionVivaBase === opts.descripcionInicial
    ? opts.descripcionEnviada
    : descripcionVivaBase;

  const indiceBase = opts.workspaceConfirmado
    ? mergeWorkspaceBootstrap(
        opts.workspaceConfirmado.indice,
        opts.indiceInicial,
        estadoActual.indice,
      )
    : estadoActual.indice;
  const entradaViva = estadoActual.indice.modelos.find(
    (modelo) => modelo.id === opts.guardado.id,
  ) ?? indiceBase.modelos.find((modelo) => modelo.id === opts.guardado.id);
  const carpetaViva = entradaViva?.carpetaId ?? opts.carpetaEnviada ?? null;
  const huboCambiosPosteriores = puedeReconciliarOrigen && (
    exportarModelo(modeloVivo) !== exportarModelo(opts.modeloEnviado) ||
    descripcionViva !== opts.descripcionEnviada ||
    carpetaViva !== (opts.carpetaEnviada ?? null)
  );
  const descripcionIndice = puedeReconciliarOrigen
    ? descripcionViva
    : opts.descripcionEnviada;
  let entradaActualizada: WorkspaceIndice["modelos"][number] = {
    ...(entradaViva ?? {
      id: opts.guardado.id,
      carpetaId: opts.carpetaEnviada ?? null,
      mapa: opts.mapaEnviado,
    }),
    id: opts.guardado.id,
    carpetaId: carpetaViva,
    ...(opts.descripcionIndice !== undefined ? { descripcion: descripcionIndice } : {}),
    ...(opts.versiones.length > 0 ? { versiones: opts.versiones } : {}),
  };
  if (opts.esApunte) {
    const { esBiblioteca: _esBiblioteca, ...sinBiblioteca } = entradaActualizada;
    entradaActualizada = { ...sinBiblioteca, esApunte: true };
  }
  const indiceActualizado: WorkspaceIndice = {
    ...indiceBase,
    modelos: [
      ...indiceBase.modelos.filter((modelo) => modelo.id !== opts.guardado.id),
      entradaActualizada,
    ],
    recientes: [
      opts.guardado.id,
      ...indiceBase.recientes.filter((id) => id !== opts.guardado.id),
    ].slice(0, opts.limiteRecientes ?? 10),
  };
  if (!opts.workspaceConfirmado) {
    escribirIndiceWorkspace(indiceActualizado);
  }

  const modelosGuardados = upsertModeloGuardadoComo(
    estadoActual.modelosGuardados,
    opts.guardado,
  );
  const revisionBasePorModelo = conBaseRevision(
    estadoActual.revisionBasePorModelo,
    opts.guardado.id,
    opts.guardado.revision,
  );
  const mensaje = huboCambiosPosteriores
    ? "Modelo guardado; hay cambios posteriores pendientes"
    : opts.mensaje;

  if (!puedeReconciliarOrigen) {
    opts.set({
      modelosGuardados,
      revisionBasePorModelo,
      indice: indiceActualizado,
      ...(opts.intentVigente
        ? {
            dialogoGuardarComoAbierto: false,
            mensaje: opts.mensaje,
          }
        : {}),
    });
    return;
  }

  const snapshotConfirmado = exportarModelo(opts.modeloEnviado);
  if (!origenSigueActivo) {
    const pestanasAbiertas = estadoActual.pestanasAbiertas.map((pestana) =>
      pestana.id === opts.pestanaOrigenId
        ? {
            ...pestana,
            modelo: modeloVivo,
            modeloId: opts.guardado.id,
            descripcionModeloLocal: descripcionViva,
            etiqueta: etiquetaPestana({ nombre: modeloVivo.nombre, modeloId: opts.guardado.id }),
            dirty: huboCambiosPosteriores,
            snapshotJson: snapshotConfirmado,
          }
        : pestana
    );
    opts.set({
      pestanasAbiertas,
      modelosGuardados,
      revisionBasePorModelo,
      indice: indiceActualizado,
      dialogoGuardarComoAbierto: false,
      mensaje,
    });
    return;
  }

  marcarSnapshotModelo(opts.modeloEnviado);
  const parcial = estadoModelo(modeloVivo, {
    mensaje,
    dirty: huboCambiosPosteriores,
    dirtyModelo: huboCambiosPosteriores ? estadoActual.dirtyModelo : false,
    modeloPersistidoId: opts.guardado.id,
    descripcionModeloLocal: descripcionViva,
    modelosGuardados,
    revisionBasePorModelo,
    dialogoGuardarComoAbierto: false,
    indice: indiceActualizado,
    workspaceLocal: workspaceDesdeModelo(
      modeloVivo,
      opts.guardado.id,
      descripcionViva,
      carpetaViva,
    ),
  });
  const pestanasAbiertas = (
    parcial.pestanasAbiertas ?? estadoActual.pestanasAbiertas
  ).map((pestana) =>
    pestana.id === opts.pestanaOrigenId
      ? { ...pestana, snapshotJson: snapshotConfirmado }
      : pestana
  );
  opts.set({ ...parcial, pestanasAbiertas });
}

function aplicarIntentSobreModeloVivo(
  modeloVivo: Modelo,
  modeloInicial: Modelo,
  modeloEnviado: Modelo,
): Modelo {
  let reconciliado = modeloVivo;
  if (modeloVivo.nombre === modeloInicial.nombre) {
    reconciliado = { ...reconciliado, nombre: modeloEnviado.nombre };
  }
  if (
    modeloEnviado.descripcion !== modeloInicial.descripcion &&
    modeloVivo.descripcion === modeloInicial.descripcion
  ) {
    reconciliado = modeloEnviado.descripcion === undefined
      ? (() => {
          const { descripcion: _descripcion, ...sinDescripcion } = reconciliado;
          return sinDescripcion as Modelo;
        })()
      : { ...reconciliado, descripcion: modeloEnviado.descripcion };
  }
  return reconciliado;
}

function upsertModeloGuardadoComo(modelos: ResumenModeloPersistido[], modelo: ModeloPersistido): ResumenModeloPersistido[] {
  const actual = modelos.find((item) => item.id === modelo.id);
  if (
    typeof actual?.revision === "number" &&
    typeof modelo.revision === "number" &&
    actual.revision > modelo.revision
  ) {
    return modelos;
  }
  return [resumenDesdeModeloPersistido(modelo), ...modelos.filter((item) => item.id !== modelo.id)]
    .sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn));
}

function revisionGuardadoObsoleta(
  get: GetStore,
  modeloId: string,
  revision: number | undefined,
): boolean {
  if (typeof revision !== "number") return false;
  const estado = get();
  const resumen = estado.modelosGuardados.find((modelo) => modelo.id === modeloId)?.revision;
  const base = estado.revisionBasePorModelo[modeloId];
  const remota = estado.revisionRemota?.modeloId === modeloId
    ? estado.revisionRemota.revision
    : undefined;
  return revision < Math.max(
    typeof resumen === "number" ? resumen : -1,
    typeof base === "number" ? base : -1,
    typeof remota === "number" ? remota : -1,
  );
}

function nombresModeloIguales(a: string, b: string): boolean {
  return a.trim().toLocaleLowerCase("es-CL") === b.trim().toLocaleLowerCase("es-CL");
}

/**
 * Nombre de apunte por defecto («Apunte AAAA-MM-DD»), desambiguado con un sufijo
 * « (N)» SOLO si ya existe un local con ese nombre. El gestor local exige unicidad
 * (`validarNombreModeloLocal`), así que nacer dos apuntes el mismo día requiere
 * distinguirlos; el caso común (uno por día) conserva el nombre limpio del diseño.
 */
function nombreApunteUnico(base: string, existentes: ResumenModeloPersistido[]): string {
  const usados = new Set(existentes.map((m) => m.nombre.trim().toLocaleLowerCase("es-CL")));
  if (!usados.has(base.toLocaleLowerCase("es-CL"))) return base;
  for (let i = 2; i < 10_000; i += 1) {
    const candidato = `${base} (${i})`;
    if (!usados.has(candidato.toLocaleLowerCase("es-CL"))) return candidato;
  }
  return `${base} (${Date.now()})`;
}
