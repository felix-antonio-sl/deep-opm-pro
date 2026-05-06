import { cambiarAfiliacion, cambiarEsencia, crearEnlace, crearModelo, crearObjeto, crearProceso } from "../../modelo/operaciones";
import type { Modelo, VersionResumen } from "../../modelo/tipos";
import {
  guardarModeloLocal,
  actualizarMetadataModeloLocal,
  renombrarModeloLocal,
} from "../../persistencia/local";
import {
  validarNombreModeloLocal,
  workspaceDesdeModelo,
  type WorkspaceIndice,
} from "../../persistencia/workspace";
import { crearVersion } from "../../persistencia/versiones";
import { fijarOpcionesProyeccionGlobal } from "../../render/jointjs/proyeccion";
import { exportarModelo } from "../../serializacion/json";
import {
  activarPestanaNueva,
  escribirIndiceWorkspace,
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
  sincronizarIndiceConModelosGuardados,
  type GetStore,
  type SetStore,
} from "../runtime";
import { crearPestanaNueva } from "../pestanas";
import type { ModeloSlice } from "../tipos";

/**
 * Acciones de UI: limpiar mensaje, abrir/cerrar menú principal y diálogos
 * (guardar como, cargar modelo), guardar como local, cargar local desde
 * diálogo, nuevo modelo (reemplaza pestaña vacía o abre nueva), modal URLs.
 */
export function accionesUI(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
    pantallaInicioCerrada: false,
    dialogoRenombrarModeloAbierto: false,

    limpiarMensaje() {
      set({ mensaje: null });
    },

    abrirMenuPrincipal() {
      set({
        menuPrincipalAbierto: true,
        modelosGuardados: listarModelosGuardadosSeguro(),
        mensaje: null,
      });
    },

    cerrarMenuPrincipal() {
      set({ menuPrincipalAbierto: false });
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
        try {
          const version = crearVersion(modeloNombrado, { descripcion: "Versión inicial" });
          versiones = [version];
          actualizarMetadataModeloLocal(guardado.value.id, {
            versiones,
            crearVersionAlGuardar: true,
          });
        } catch { /* storage lleno/no disponible: se conserva el guardado */ }
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
        try {
          const version = crearVersion(modeloNombrado, { descripcion: "Versión inicial" });
          versiones = [version];
          actualizarMetadataModeloLocal(guardado.value.id, {
            versiones,
            crearVersionAlGuardar: true,
          });
        } catch { /* storage lleno/no disponible: se conserva el guardado */ }
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
        modeloPersistidoId: guardado.value.id,
        descripcionModeloLocal: guardado.value.descripcion,
        modelosGuardados: listarModelosGuardadosSeguro(),
        dialogoGuardarComoAbierto: false,
        pantallaInicioCerrada: true,
        indice: nuevoIndice,
        workspaceLocal: workspaceDesdeModelo(modeloNombrado, guardado.value.id, guardado.value.descripcion, carpetaParaGuardar ?? null),
      }));
    },

    abrirCargarModelo() {
      const modelosGuardados = listarModelosGuardadosSeguro();
      const indiceSinc = sincronizarIndiceConModelosGuardados(modelosGuardados, leerIndiceWorkspace());
      set({
        menuPrincipalAbierto: false,
        dialogoCargarModeloAbierto: true,
        modelosGuardados,
        indice: indiceSinc,
        carpetaActualId: null,
        modelosRecientes: modelosRecientesDeIndice(indiceSinc, modelosGuardados),
        mensaje: null,
      });
    },

    cerrarCargarModelo() {
      set({ dialogoCargarModeloAbierto: false });
    },

    cargarLocalDesdeDialogo(id) {
      get().cargarLocal(id);
      if (obtenerEstadoStore().modeloPersistidoId === id) {
        set({ dialogoCargarModeloAbierto: false });
      }
    },

    cerrarPantallaInicio() {
      set({ pantallaInicioCerrada: true });
    },

    abrirRenombrarModelo() {
      if (!get().modeloPersistidoId) {
        set({ mensaje: "Guarda el modelo antes de renombrarlo" });
        return;
      }
      set({ dialogoRenombrarModeloAbierto: true, menuPrincipalAbierto: false, mensaje: null });
    },

    cerrarRenombrarModelo() {
      set({ dialogoRenombrarModeloAbierto: false });
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
        dialogoRenombrarModeloAbierto: false,
        modelosGuardados: listarModelosGuardadosSeguro(),
        indice,
        workspaceLocal: workspaceDesdeModelo(modeloRenombrado, modeloPersistidoId, descripcionModeloLocal, carpetaActualId),
        mensaje: "Modelo renombrado",
        dirty: false,
      }));
    },

    cargarEjemploOrganizacional() {
      let modelo = crearModelo("Ejemplo organizacional");
      modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Cliente"));
      modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 340, y: 90 }, "Equipo de soporte"));
      modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 600, y: 90 }, "Base de conocimiento"));
      modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 330, y: 245 }, "Resolver solicitud"));
      const cliente = entidadPorNombre(modelo, "Cliente");
      const equipo = entidadPorNombre(modelo, "Equipo de soporte");
      const conocimiento = entidadPorNombre(modelo, "Base de conocimiento");
      const resolver = entidadPorNombre(modelo, "Resolver solicitud");
      modelo = must(cambiarEsencia(modelo, cliente, "fisica"));
      modelo = must(cambiarAfiliacion(modelo, cliente, "ambiental"));
      modelo = must(crearEnlace(modelo, modelo.opdRaizId, cliente, resolver, "agente"));
      modelo = must(crearEnlace(modelo, modelo.opdRaizId, equipo, resolver, "instrumento"));
      modelo = must(crearEnlace(modelo, modelo.opdRaizId, conocimiento, resolver, "instrumento"));
      resetHistorial(modelo);
      set(estadoModelo(modelo, {
        opdActivoId: modelo.opdRaizId,
        seleccionId: null,
        seleccionados: [],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        modoCreacion: null,
        modeloPersistidoId: null,
        descripcionModeloLocal: "Ejemplo organizacional local",
        carpetaActualId: null,
        dialogoCargarModeloAbierto: false,
        pantallaInicioCerrada: true,
        workspaceLocal: workspaceDesdeModelo(modelo, null, "Ejemplo organizacional local"),
        mensaje: "Ejemplo organizacional cargado",
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
      const { uiAliasVisibles, uiDescripcionesVisibles, modelo } = get();
      fijarOpcionesProyeccionGlobal({ aliasVisibles: uiAliasVisibles, descripcionesVisibles: uiDescripcionesVisibles, modoImagenGlobal: modo });
      set({ uiModoImagenGlobal: modo, modelo: { ...modelo } });
    },
  };
}

function entidadPorNombre(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad ejemplo no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
