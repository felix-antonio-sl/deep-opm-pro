import { crearModelo } from "../../modelo/operaciones";
import type { Modelo, VersionResumen } from "../../modelo/tipos";
import {
  guardarModeloLocal,
  actualizarMetadataModeloLocal,
  renombrarModeloLocal,
  type ModeloPersistido,
} from "../../persistencia/local";
import { guardarPlantilla, listarPlantillas } from "../../persistencia/plantillas";
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

let limpiarResaltadoPlantillaTimer: number | null = null;
const WELCOME_BANNER_DISMISSED_KEY = "opforja:welcome-banner-dismissed:v1";

/**
 * Acciones de UI: limpiar mensaje, abrir/cerrar menú principal y diálogos
 * (guardar como, cargar modelo), guardar como local, cargar local desde
 * diálogo, nuevo modelo (reemplaza pestaña vacía o abre nueva), modal URLs.
 *
 * L3 traer conectados: [Met §multi-OPD], [Glos 3.6].
 * L4 plantillas privadas: [Met §8.8], [V-52], [V-123], [JOYAS §1].
 * L1 persistencia/carga: [Met §6].
 */
export function accionesUI(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
    pantallaInicioCerrada: leerWelcomeBannerDescartado(),
    dialogoConfiguracionAbierto: false,
    dialogoSimulacionNumericaAbierto: false,
    dialogoTraerConectadosAbierto: false,
    dialogoPlantillasAbierto: false,
    dialogoGuardarPlantillaAbierto: false,
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
      const { modelo, modelosGuardados, opdActivoId, carpetaActualId, indice } = get();
      const validacion = validarNombreModeloLocal(input.nombre, modelosGuardados);
      if (!validacion.ok) {
        set({ mensaje: validacion.error ?? "Nombre de modelo inválido" });
        return;
      }
      const descripcion = input.descripcion?.trim() ?? "";
      const modeloNombrado: Modelo = { ...modelo, nombre: validacion.nombre, ...(descripcion ? { descripcion } : {}) };
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
        pantallaInicioCerrada: true,
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

    cerrarPantallaInicio() {
      escribirWelcomeBannerDescartado();
      set({ pantallaInicioCerrada: true });
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

    abrirDialogoPlantillas() {
      const listado = listarPlantillas("privado");
      if (!listado.ok) {
        set({ mensaje: listado.error, menuPrincipalAbierto: false });
        return;
      }
      set({
        plantillasGuardadas: listado.value,
        dialogoPlantillasAbierto: true,
        menuPrincipalAbierto: false,
        mensaje: null,
      });
    },

    cerrarDialogoPlantillas() {
      set({ dialogoPlantillasAbierto: false });
    },

    abrirDialogoGuardarPlantilla() {
      set({
        dialogoGuardarPlantillaAbierto: true,
        menuPrincipalAbierto: false,
        mensaje: null,
      });
    },

    cerrarDialogoGuardarPlantilla() {
      set({ dialogoGuardarPlantillaAbierto: false });
    },

    guardarComoPlantillaConfirmar(input) {
      const { modelo, descripcionModeloLocal, indice } = get();
      const ambito = input.ambito ?? "privado";
      if (ambito !== "privado") {
        set({ mensaje: "Disponible cuando se habilite multi-usuario" });
        return;
      }
      const ahora = new Date().toISOString();
      const modeloPersistido: ModeloPersistido = {
        id: `plantilla-contenido-${modelo.id}`,
        nombre: modelo.nombre,
        descripcion: descripcionModeloLocal || modelo.descripcion || "",
        creadoEn: ahora,
        actualizadoEn: ahora,
        json: exportarModelo(modelo),
      };
      const descripcion = input.descripcion?.trim();
      const guardada = guardarPlantilla({
        nombre: input.nombre,
        modeloPersistido,
        ambito,
        ...(descripcion ? { descripcion } : {}),
      });
      if (!guardada.ok) {
        set({ mensaje: guardada.error });
        return;
      }
      const listado = listarPlantillas("privado");
      const plantillasGuardadas = listado.ok ? listado.value : [guardada.value];
      const indiceActualizado = { ...indice, plantillas: plantillasGuardadas };
      escribirIndiceWorkspace(indiceActualizado);
      set({
        indice: indiceActualizado,
        plantillasGuardadas,
        dialogoGuardarPlantillaAbierto: false,
        dialogoPlantillasAbierto: false,
        mensaje: "Plantilla guardada",
      });
    },

    resaltarTemporalmente(ids, ms = 3000) {
      if (limpiarResaltadoPlantillaTimer !== null) {
        window.clearTimeout(limpiarResaltadoPlantillaTimer);
      }
      set({ idsResaltadosTemporales: [...ids] });
      limpiarResaltadoPlantillaTimer = window.setTimeout(() => {
        set({ idsResaltadosTemporales: [] });
        limpiarResaltadoPlantillaTimer = null;
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
          pantallaInicioCerrada: true,
          workspaceLocal: workspaceDesdeModelo(modelo, null),
          mensaje: "Nuevo modelo",
        }));
        // Ronda 23 L3 #7: si reemplazamos una pestaña etiquetada como
        // "bienvenida" (fixture precargado), hay que reetiquetarla como
        // "nuevo" para que el banner no reaparezca en el próximo render.
        if (actual.cargadoDesde === "bienvenida") {
          const pestanasActualizadas = get().pestanasAbiertas.map((p) => (
            p.id === actual.id
              ? { ...p, cargadoDesde: "nuevo" as const, etiqueta: "Modelo", dirty: false }
              : p
          ));
          set({ pestanasAbiertas: pestanasActualizadas });
        }
        return;
      }
      const pestana = crearPestanaNueva({ modelo });
      activarPestanaNueva(set, get, pestana, "Nuevo modelo en pestana");
      set({ pantallaInicioCerrada: true });
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

function leerWelcomeBannerDescartado(): boolean {
  try {
    return globalThis.localStorage?.getItem(WELCOME_BANNER_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

function escribirWelcomeBannerDescartado(): void {
  try {
    globalThis.localStorage?.setItem(WELCOME_BANNER_DISMISSED_KEY, "1");
  } catch {
    // localStorage puede no existir en tests unitarios o entornos embebidos.
  }
}
