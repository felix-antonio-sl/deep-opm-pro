import { crearModelo } from "../../modelo/operaciones";
import type { Modelo, VersionResumen } from "../../modelo/tipos";
import {
  guardarModeloLocal,
  actualizarMetadataModeloLocal,
  renombrarModeloLocal,
  type ModeloPersistido,
} from "../../persistencia/local";
import { guardarModeloBackend, persistenciaBackendHabilitada } from "../../persistencia/backend";
import {
  validarNombreModeloLocal,
  workspaceDesdeModelo,
  type WorkspaceIndice,
} from "../../persistencia/workspace";
import { crearVersionResultado } from "../../persistencia/versiones";
import { exportarModelo, hidratarModelo } from "../../serializacion/json";
import {
  activarPestanaNueva,
  escribirIndiceWorkspace,
  escribirPreferenciaBooleana,
  estadoModelo,
  leerIndiceWorkspace,
  listarModelosGuardadosSeguro,
  mapaWorkspaceDesdeEstado,
  marcarSnapshotModelo,
  modelosRecientesDeIndice,
  obtenerEstadoStore,
  opdActivoSeguro,
  pestanaReemplazable,
  resetHistorial,
  PREF_MOSTRAR_ARCHIVADOS_KEY,
  sincronizarIndiceConModelosGuardados,
  type GetStore,
  type SetStore,
} from "../runtime";
import { crearPestanaNueva } from "../pestanas";
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
        modelosGuardados: listarModelosGuardadosSeguro(),
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
      const modelosGuardados = listarModelosGuardadosSeguro();
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
      const { modelo, modelosGuardados, opdActivoId, carpetaActualId, indice } = get();
      const validacion = validarNombreModeloLocal(input.nombre, modelosGuardados);
      if (!validacion.ok) {
        set({ mensaje: validacion.error ?? "Nombre de modelo inválido" });
        return;
      }
      const descripcion = input.descripcion?.trim() ?? "";
      const modeloNombrado: Modelo = { ...modelo, nombre: validacion.nombre };
      const carpetaParaGuardar = carpetaActualId;
      const json = exportarModelo(modeloNombrado, carpetaParaGuardar);
      const guardado = guardarModeloLocal({
        id: null,
        nombre: validacion.nombre,
        descripcion,
        json,
        ...(carpetaParaGuardar !== undefined ? { carpetaId: carpetaParaGuardar } : {}),
        ...(input.crearVersionAlGuardar !== undefined ? { crearVersionAlGuardar: input.crearVersionAlGuardar } : {}),
      });
      if (!guardado.ok) {
        set({ mensaje: guardado.error });
        return;
      }
      sincronizarGuardadoBackendGuardadoComo(guardado.value, set);
      // Snapshot para dirty tracking sin carpetaId (normalizado)
      marcarSnapshotModelo(modeloNombrado);
      let versiones: VersionResumen[] = [];
      if (input.crearVersionAlGuardar) {
        const version = crearVersionResultado(modeloNombrado, { descripcion: "Versión inicial" });
        if (version.ok) {
          versiones = [version.value];
          actualizarMetadataModeloLocal(guardado.value.id, {
            versiones,
            crearVersionAlGuardar: true,
          });
        }
      }
      const nuevoIndice: WorkspaceIndice = {
        ...indice,
        modelos: [
          ...indice.modelos.filter((m) => m.id !== guardado.value.id),
          {
            id: guardado.value.id,
            carpetaId: carpetaParaGuardar ?? null,
            mapa: mapaWorkspaceDesdeEstado(get()),
            ...(versiones.length > 0 ? { versiones } : {}),
          },
        ],
        recientes: [guardado.value.id, ...indice.recientes.filter((r) => r !== guardado.value.id)].slice(0, 10),
      };
      escribirIndiceWorkspace(nuevoIndice);
      set(estadoModelo(modeloNombrado, {
        opdActivoId: opdActivoSeguro(modeloNombrado, opdActivoId),
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "Modelo guardado exitosamente",
        dirty: false,
        dirtyModelo: false,
        modeloPersistidoId: guardado.value.id,
        descripcionModeloLocal: guardado.value.descripcion,
        modelosGuardados: listarModelosGuardadosSeguro(),
        dialogoGuardarComoAbierto: false,
        indice: nuevoIndice,
        workspaceLocal: workspaceDesdeModelo(modeloNombrado, guardado.value.id, guardado.value.descripcion, carpetaParaGuardar ?? null),
      }));
    },

    guardarComoLocalConDescripcion(input) {
      const { modelo, modeloPersistidoId, modelosGuardados, opdActivoId, carpetaActualId, indice } = get();
      const validacion = validarNombreModeloLocal(input.nombre, modelosGuardados, modeloPersistidoId);
      if (!validacion.ok) {
        set({ mensaje: validacion.error ?? "Nombre de modelo inválido" });
        return;
      }
      const descripcion = input.descripcion?.trim() ?? "";
      const modeloNombrado: Modelo = { ...modelo, nombre: validacion.nombre, ...(descripcion ? { descripcion } : {}) };
      const carpetaParaGuardar = carpetaActualId;
      const json = exportarModelo(modeloNombrado, carpetaParaGuardar);
      const modeloActualPersistido = modeloPersistidoId
        ? modelosGuardados.find((guardado) => guardado.id === modeloPersistidoId)
        : undefined;
      const actualizarModeloActual = modeloPersistidoId !== null &&
        nombresModeloIguales(modeloActualPersistido?.nombre ?? modelo.nombre, validacion.nombre);
      const guardado = guardarModeloLocal({
        id: actualizarModeloActual ? modeloPersistidoId : null,
        nombre: validacion.nombre,
        descripcion,
        json,
        ...(carpetaParaGuardar !== undefined ? { carpetaId: carpetaParaGuardar } : {}),
        ...(input.crearVersionAlGuardar !== undefined ? { crearVersionAlGuardar: input.crearVersionAlGuardar } : {}),
      });
      if (!guardado.ok) {
        set({ mensaje: guardado.error });
        return;
      }
      sincronizarGuardadoBackendGuardadoComo(guardado.value, set);
      marcarSnapshotModelo(modeloNombrado);
      let versiones: VersionResumen[] = actualizarModeloActual ? guardado.value.versiones ?? [] : [];
      if (input.crearVersionAlGuardar) {
        const version = crearVersionResultado(modeloNombrado, { descripcion: "Versión inicial" });
        if (version.ok) {
          versiones = [version.value, ...versiones];
          actualizarMetadataModeloLocal(guardado.value.id, {
            versiones,
            crearVersionAlGuardar: true,
          });
        }
      }
      const nuevoIndice: WorkspaceIndice = {
        ...indice,
        modelos: [
          ...indice.modelos.filter((m) => m.id !== guardado.value.id),
          {
            id: guardado.value.id,
            carpetaId: carpetaParaGuardar ?? null,
            descripcion,
            mapa: mapaWorkspaceDesdeEstado(get()),
            ...(versiones.length > 0 ? { versiones } : {}),
          },
        ],
        recientes: [guardado.value.id, ...indice.recientes.filter((r) => r !== guardado.value.id)].slice(0, 12),
      };
      escribirIndiceWorkspace(nuevoIndice);
      set(estadoModelo(modeloNombrado, {
        opdActivoId: opdActivoSeguro(modeloNombrado, opdActivoId),
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "Modelo guardado exitosamente",
        dirty: false,
        dirtyModelo: false,
        modeloPersistidoId: guardado.value.id,
        descripcionModeloLocal: guardado.value.descripcion,
        modelosGuardados: listarModelosGuardadosSeguro(),
        dialogoGuardarComoAbierto: false,
        indice: nuevoIndice,
        workspaceLocal: workspaceDesdeModelo(modeloNombrado, guardado.value.id, guardado.value.descripcion, carpetaParaGuardar ?? null),
      }));
    },

    abrirCargarModelo(opciones) {
      const modelosGuardados = listarModelosGuardadosSeguro();
      const indiceSinc = sincronizarIndiceConModelosGuardados(modelosGuardados, leerIndiceWorkspace());
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
        modelosGuardados: listarModelosGuardadosSeguro(),
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
      const { modelo, modeloPersistidoId, descripcionModeloLocal, modelosGuardados, carpetaActualId } = get();
      if (!modeloPersistidoId) {
        set({ mensaje: "Guarda el modelo antes de renombrarlo" });
        return;
      }
      const validacion = validarNombreModeloLocal(nombre, modelosGuardados, modeloPersistidoId);
      if (!validacion.ok) {
        set({ mensaje: validacion.error ?? "Nombre de modelo inválido" });
        return;
      }
      const renombrado = renombrarModeloLocal(modeloPersistidoId, validacion.nombre);
      if (!renombrado.ok) {
        set({ mensaje: renombrado.error });
        return;
      }
      const modeloRenombrado: Modelo = { ...modelo, nombre: validacion.nombre };
      marcarSnapshotModelo(modeloRenombrado);
      const indice = {
        ...get().indice,
        modelos: get().indice.modelos.map((item) => item.id === modeloPersistidoId ? { ...item } : item),
      };
      escribirIndiceWorkspace(indice);
      set(estadoModelo(modeloRenombrado, {
        dialogoConfiguracionAbierto: false,
        modelosGuardados: listarModelosGuardadosSeguro(),
        indice,
        workspaceLocal: workspaceDesdeModelo(modeloRenombrado, modeloPersistidoId, descripcionModeloLocal, carpetaActualId),
        mensaje: "Modelo renombrado",
        dirty: false,
        dirtyModelo: false,
      }));
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
        }));
        return;
      }
      const pestana = crearPestanaNueva({ modelo });
      activarPestanaNueva(set, get, pestana, "Nuevo modelo en pestana");
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
  };
}

function sincronizarGuardadoBackendGuardadoComo(modelo: ModeloPersistido, set: SetStore): void {
  if (!persistenciaBackendHabilitada()) return;
  void guardarModeloBackend(modelo).then((resultado) => {
    if (!resultado.ok) set({ mensaje: `Modelo guardado localmente; ${resultado.error}` });
  });
}

function nombresModeloIguales(a: string, b: string): boolean {
  return a.trim().toLocaleLowerCase("es-CL") === b.trim().toLocaleLowerCase("es-CL");
}
