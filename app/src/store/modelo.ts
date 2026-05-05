import { crearCosaEnPosicion } from "../modelo/creacionInterna";
import { extremoEstado } from "../modelo/extremos";
import {
  designarCurrent,
  designarDefault,
  designarFinal,
  designarInicial,
  quitarDesignacion,
  restaurarEstado,
  suprimirEstado,
} from "../modelo/estadosDesignaciones";
import {
  aplicarEstiloApariencia,
  resetearEstiloApariencia,
} from "../modelo/estilos";
import {
  contenedorRefinamiento,
  dentroDeApariencia,
  posicionLibre,
} from "../modelo/layout";
import {
  actualizarVerticesEnlace as actualizarVerticesEnlaceOp,
  ajustarMultiplicidad,
  apuntarExtremoEnlace,
  cambiarAfiliacion,
  cambiarEsencia,
  agregarEstado,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  designarEstadoFinal as designarEstadoFinalOp,
  designarEstadoInicial as designarEstadoInicialOp,
  descomponerProceso,
  desplegarObjeto,
  eliminarEnlace,
  eliminarEstado as eliminarEstadoOp,
  moverApariencia as moverAparienciaEntidad,
  moverAparienciaPorId,
  quitarDescomposicionProceso,
  quitarDespliegueObjeto,
  quitarEstadosObjeto,
  reanclarEnlaceExternoDerivado as reanclarEnlaceExternoDerivadoOp,
  renombrarEntidad,
  renombrarEstado,
  splitEffectEnPar,
  volverEnlaceExternoDerivadoAAutomatico as volverEnlaceExternoDerivadoAAutomaticoOp,
} from "../modelo/operaciones";
import {
  agregarUrl,
  editarAlias,
  editarDescripcion,
  editarUnidad,
  eliminarUrl,
  reordenarUrls,
} from "../modelo/objetoMetadata";
import { fijarDuracion, quitarDuracion } from "../modelo/objetoDuracion";
import {
  cambiarOrdenPartes as cambiarOrdenPartesOp,
  cambiarModoPlegado as cambiarModoPlegadoOp,
  crearEnlaceConExtremoPlegado,
  extraerParteDePlegado as extraerParteDePlegadoOp,
  reinsertarParteEnPlegado as reinsertarParteEnPlegadoOp,
} from "../modelo/plegado";
import {
  abanicoDeEnlace,
  alternarOperadorAbanico as alternarOperadorAbanicoOp,
  disolverAbanico as disolverAbanicoOp,
  formarAbanicoAutomatico,
  quitarRamaDeAbanico as quitarRamaDeAbanicoOp,
  sincronizarAbanicos,
} from "../modelo/abanicos";
import { crearAutoInvocacion } from "../modelo/autoinvocacion";
import { eliminarOpdHoja } from "../modelo/opdEliminacion";
import {
  listarHermanos,
  moverNodo,
  ordenSegunCanvasPadre,
  reordenarHermanos,
  validarMovimientoSinCiclo,
} from "../modelo/opdReorden";
import {
  aplicarModificador,
  definirDemora,
  definirProbabilidad,
  quitarModificador,
} from "../modelo/modificadores";
import { renombrarEtiquetaEnlace } from "../modelo/etiquetasEnlace";
import { definirRutaEtiqueta } from "../modelo/rutas";
import {
  aplicarEstiloEnlace,
  copiarEstiloEnlace,
  pegarEstiloEnlace,
  resetEstiloEnlace,
} from "../modelo/enlaceEstilo";
import {
  fijarMultiplicidadOrigen,
  fijarMultiplicidadDestino,
  quitarMultiplicidad,
} from "../modelo/enlaceMultiplicidad";
import {
  insertarVerticeApariencia,
  reposicionarVerticeApariencia,
  reanclarExtremoEnlace as reanclarExtremoEnlaceOp,
} from "../modelo/enlaceVertices";
import {
  borrarModeloLocal,
  cargarModeloLocal,
  guardarModeloLocal,
  listarModelosLocales,
  actualizarMetadataModeloLocal,
  type ResumenModeloPersistido,
} from "../persistencia/local";
import {
  archivarCarpeta as archivarCarpetaEnIndiceOp,
  archivarModelo as archivarModeloEnIndiceOp,
  buscarGlobal,
  validarNombreModeloLocal,
  workspaceDesdeModelo,
  type WorkspaceModeloLocal,
  type CarpetaIndice,
  type BusquedaGlobalEstado,
  type PortapapelesWorkspace,
  type ResultadoBusquedaGlobal,
  type WorkspaceIndice,
  type MapaWorkspace,
  indiceVacio,
  crearCarpeta as crearCarpetaEnIndice,
  renombrarCarpeta as renombrarCarpetaEnIndiceOp,
  eliminarCarpeta as eliminarCarpetaEnIndiceOp,
  moverModeloACarpeta as moverModeloACarpetaEnIndiceOp,
  listarHijosDeCarpeta,
  restaurarCarpeta as restaurarCarpetaEnIndiceOp,
  restaurarModelo as restaurarModeloEnIndiceOp,
  rutaDeCarpeta,
} from "../persistencia/workspace";
import {
  cortarCarpeta as cortarCarpetaWorkspace,
  cortarModelo as cortarModeloWorkspace,
  moverCarpeta,
  moverModelo,
  pegarCarpeta,
  pegarModelo,
} from "../persistencia/movimientoModelos";
import {
  crearVersion,
  eliminarVersion,
  restaurarVersion,
} from "../persistencia/versiones";
import {
  crearAutosalvado,
  type AutosalvadoEstado,
  type AutosalvadoControl,
} from "../persistencia/autosalvado";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import type { Aviso } from "../modelo/validaciones";
import type { Afiliacion, Apariencia, DesignacionEstado, DuracionTemporal, EnlaceEstilo, Esencia, EstiloApariencia, ExtremoEnlace, Id, LayoutEstados, Modelo, Modificador, ModoDespliegueObjeto, ModoPlegado, Opd, OperadorAbanico, OrdenPartesPlegado, Pestana, PestanaId, Posicion, TipoEnlace, TipoEntidad, UrlObjetoTipada, UiPortapapelesVisual, VersionResumen } from "../modelo/tipos";
import { mismaReferencia, type OplReferencia } from "../opl/interaccion";
import { datosAsistenteVacio, sembrarModeloDesdeAsistente, validarDatosAsistente, type DatosAsistente, type EtapaAsistente } from "../modelo/creacionWizard";
import { generarOpl } from "../opl/generar";
import {
  aplicarMarcadores,
  calcularEstadisticas,
  construirDescriptorMapa,
  filtrarPorProfundidad,
  filtrarPorSubarbol,
  resaltarPorTipo,
  type CriterioResaltado,
  type DescriptorMapa,
  type EstadisticasModelo,
} from "../render/jointjs/mapaSistema";
import { fijarOpcionesProyeccionGlobal } from "../render/jointjs/proyeccion";
import {
  abrirPestana as abrirPestanaEstado,
  cambiarActiva as cambiarPestanaActivaEstado,
  cerrarPestana as cerrarPestanaEstado,
  clonarModelo,
  crearPestanaDesdeModelo,
  crearPestanaNueva,
  duplicarPestana as duplicarPestanaEstado,
  reordenarPestanas as reordenarPestanasEstado,
} from "./pestanas";
import {
  agregar as seleccionAgregar,
  quitar as seleccionQuitar,
  setSeleccion as seleccionSet,
  todasDelOpd,
  toggle as seleccionToggle,
  vacia as seleccionVacia,
  type ModoSeleccion,
} from "../canvas/seleccionMultiple";
import {
  alinearEnlacesAbajo,
  alinearEnlacesArriba,
  alinearEnlacesDerecha,
  alinearEnlacesIzquierda,
  aplicarEstiloApariencias,
  aplicarEstiloEnlaces,
  conectarMultiAlTodo,
  copiarSeleccion,
  eliminarBatch,
  nudgeApariencias,
  nudgeEnlaces,
  pegarSeleccion,
} from "../canvas/operacionesBatch";
import type { CrearSlice, ModeloSlice } from "./tipos";
import {
  ANCHO_PANEL_ARBOL_DEFAULT, ANCHO_PANEL_ARBOL_MAX, ANCHO_PANEL_ARBOL_MIN, PORTAPAPELES_WORKSPACE_TTL_MS, PREF_MOSTRAR_ARCHIVADOS_KEY, PREF_MOSTRAR_VERSIONES_KEY, activarEstadoPestanas, activarPestanaNueva, aparienciaSeleccionadaActiva, commitModelo, confirmarEliminacionOpd, crearDemo, crearIdModeloLocal, entidadNueva, enlaceNuevo, escribirIndiceWorkspace, escribirPreferenciaBooleana, estadoModelo, estadoSeleccionDesdeIds, generarHtmlOpl, hermanosOrdenados, leerIndiceWorkspace, leerPreferenciaBooleana, leerPreferenciasMapa, limitar, limitarAnchoPanelArbol, listarModelosGuardadosSeguro, mapaWorkspaceDesdeEstado, marcarSnapshotJson, marcarSnapshotModelo, modelosRecientesDeIndice, obtenerAutosalvadoControl, obtenerEstadoStore, opdActivoSeguro, opdDestinoDeAviso, persistirPreferenciasMapa, fijarAutosalvadoControl, resetHistorial, setEstadoStore, sincronizarIndiceConModelosGuardados, actualizarPreferenciasUi, validarSubprocesoTimeline,
  pestanaReemplazable,
  deshacerRuntime,
  rehacerRuntime,
} from "./runtime";
export const pestanaInicial = crearPestanaNueva();
export const modeloInicial = pestanaInicial.modelo;

export type { ModeloSlice } from "./tipos";

export const createModeloSlice: CrearSlice<ModeloSlice> = (set, get) => ({
  modelo: modeloInicial,
  opdActivoId: modeloInicial.opdRaizId,
  mensaje: null,
  dirty: false,
  puedeDeshacer: false,
  puedeRehacer: false,

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

  crearObjetoDemo() {
    const { modelo, opdActivoId } = get();
    const resultado = crearObjeto(modelo, opdActivoId, posicionLibre(modelo, opdActivoId, "objeto"));
    if (resultado.ok) {
      const nueva = entidadNueva(modelo, resultado.value);
      commitModelo(set, modelo, resultado.value, { seleccionId: nueva, seleccionados: nueva ? [nueva] : [], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: null });
    }
  },

  crearProcesoDemo() {
    const { modelo, opdActivoId } = get();
    const resultado = crearProceso(modelo, opdActivoId, posicionLibre(modelo, opdActivoId, "proceso"));
    if (resultado.ok) {
      const nueva = entidadNueva(modelo, resultado.value);
      commitModelo(set, modelo, resultado.value, { seleccionId: nueva, seleccionados: nueva ? [nueva] : [], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: null });
    }
  },

  crearEntidadEnCanvas(tipo, posicion) {
    const { modelo, opdActivoId } = get();
    const resultado = crearCosaEnPosicion(modelo, opdActivoId, tipo, posicion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, {
      seleccionId: resultado.value.entidadId,
      seleccionados: [resultado.value.entidadId],
      modoSeleccion: "simple",
      enlaceSeleccionId: null,
      modoEnlace: null,
      modoCreacion: tipo,
      mensaje: null,
    });
  },

  fijarModoCreacion(tipo) {
    set({
      modoCreacion: tipo,
      modoEnlace: null,
      mensaje: tipo ? `Haz clic en el canvas para crear ${tipo === "objeto" ? "un objeto" : "un proceso"}` : null,
    });
  },

  descomponerSeleccionada() {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un proceso para descomponer" });
      return;
    }
    const entidad = modelo.entidades[seleccionId];
    if (!entidad || entidad.tipo !== "proceso") {
      set({ mensaje: "Selecciona un proceso para descomponer" });
      return;
    }

    const resultado = descomponerProceso(modelo, opdActivoId, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, {
      opdActivoId: resultado.value.opdId,
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: resultado.value.creado ? "OPD hijo creado" : null,
    });
  },

  desplegarSeleccionada(modo = "agregacion") {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un objeto para desplegar" });
      return;
    }
    const entidad = modelo.entidades[seleccionId];
    if (!entidad || entidad.tipo !== "objeto") {
      set({ mensaje: "Selecciona un objeto para desplegar" });
      return;
    }

    const resultado = desplegarObjeto(modelo, opdActivoId, seleccionId, modo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, {
      opdActivoId: resultado.value.opdId,
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: resultado.value.creado ? "OPD de despliegue creado" : null,
    });
  },

  quitarDescomposicionSeleccionada() {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un proceso descompuesto" });
      return;
    }
    const entidad = modelo.entidades[seleccionId];
    if (!entidad || entidad.tipo !== "proceso" || entidad.refinamiento?.tipo !== "descomposicion") {
      set({ mensaje: "Selecciona un proceso descompuesto" });
      return;
    }

    const resultado = quitarDescomposicionProceso(modelo, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      opdActivoId: opdActivoSeguro(resultado.value, opdActivoId),
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "Descomposición eliminada",
    });
  },

  quitarDespliegueSeleccionado() {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un objeto desplegado" });
      return;
    }
    const entidad = modelo.entidades[seleccionId];
    if (!entidad || entidad.tipo !== "objeto" || entidad.refinamiento?.tipo !== "despliegue") {
      set({ mensaje: "Selecciona un objeto desplegado" });
      return;
    }

    const resultado = quitarDespliegueObjeto(modelo, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      opdActivoId: opdActivoSeguro(resultado.value, opdActivoId),
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "Despliegue eliminado",
    });
  },

  eliminarOpdDesdeArbol(opdId) {
    const { modelo, opdActivoId } = get();
    const resultado = eliminarOpdHoja(modelo, opdId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const opd = modelo.opds[opdId];
    if (!confirmarEliminacionOpd(opd?.nombre ?? opdId)) return;
    commitModelo(set, modelo, resultado.value.modelo, {
      opdActivoId: opdActivoId === opdId ? resultado.value.opdActivoSugerido : opdActivoSeguro(resultado.value.modelo, opdActivoId),
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "OPD eliminado",
    });
  },

  cambiarOpdActivo(id) {
    const { modelo, opdActivoId } = get();
    if (!modelo.opds[id]) {
      set({ mensaje: `OPD no existe: ${id}` });
      return;
    }
    if (id === opdActivoId) {
      set({ mensaje: null });
      return;
    }
    set({ opdActivoId: id, seleccionId: null, seleccionados: [], modoSeleccion: "simple", enlaceSeleccionId: null, modoEnlace: null, modoCreacion: null, hoverOplRef: null, mensaje: null });
  },

  seleccionarEntidad(id) {
    const { modelo, modoEnlace, opdActivoId } = get();
    if (!modoEnlace) {
      set({ seleccionId: id, seleccionados: [id], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: null });
      return;
    }

    const resultado = crearEnlaceConExtremoPlegado(modelo, opdActivoId, modoEnlace.origenId, id, modoEnlace.tipo);
    if (!resultado.ok) {
      set({ seleccionId: id, seleccionados: [id], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: resultado.error });
      return;
    }
    let modeloFinal = resultado.value;
    const enlaceCreadoId = enlaceNuevo(modelo, modeloFinal);
    if (enlaceCreadoId) {
      const auto = formarAbanicoAutomatico(modeloFinal, opdActivoId, enlaceCreadoId);
      if (auto.ok) modeloFinal = auto.value;
    }
    commitModelo(set, modelo, modeloFinal, {
      seleccionId: id,
      seleccionados: [id],
      modoSeleccion: "simple",
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  seleccionarEstadoComoExtremo(estadoId) {
    const { modelo, modoEnlace, opdActivoId } = get();
    const estado = modelo.estados[estadoId];
    if (!estado) {
      set({ mensaje: `Estado no existe: ${estadoId}` });
      return;
    }
    if (!modoEnlace) {
      set({ seleccionId: estado.entidadId, seleccionados: [estado.entidadId], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: null });
      return;
    }

    const resultado = crearEnlaceConExtremoPlegado(modelo, opdActivoId, modoEnlace.origenId, extremoEstado(estadoId), modoEnlace.tipo);
    if (!resultado.ok) {
      set({ seleccionId: estado.entidadId, seleccionados: [estado.entidadId], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: resultado.error });
      return;
    }
    let modeloFinal = resultado.value;
    const enlaceCreadoId = enlaceNuevo(modelo, modeloFinal);
    if (enlaceCreadoId) {
      const auto = formarAbanicoAutomatico(modeloFinal, opdActivoId, enlaceCreadoId);
      if (auto.ok) modeloFinal = auto.value;
    }
    commitModelo(set, modelo, modeloFinal, {
      seleccionId: estado.entidadId,
      seleccionados: [estado.entidadId],
      modoSeleccion: "simple",
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  seleccionarEnlace(id) {
    const { modelo } = get();
    const enlace = modelo.enlaces[id];
    if (!enlace) {
      set({ mensaje: `Enlace no existe: ${id}` });
      return;
    }
    set({ seleccionId: null, seleccionados: [id], modoSeleccion: "simple", enlaceSeleccionId: id, modoEnlace: null, mensaje: null });
  },

  seleccionarDesdeOpl(ref) {
    const { modelo } = get();
    if (ref.tipo === "enlace") {
      if (!modelo.enlaces[ref.id]) {
        set({ mensaje: `Enlace no existe: ${ref.id}` });
        return;
      }
      set({ seleccionId: null, seleccionados: [ref.id], modoSeleccion: "simple", enlaceSeleccionId: ref.id, modoEnlace: null, mensaje: null });
      return;
    }
    if (ref.tipo === "estado") {
      const estado = modelo.estados[ref.id];
      if (!estado) {
        set({ mensaje: `Estado no existe: ${ref.id}` });
        return;
      }
      set({ seleccionId: estado.entidadId, seleccionados: [estado.entidadId], modoSeleccion: "simple", enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
      return;
    }
    if (!modelo.entidades[ref.id]) {
      set({ mensaje: `Entidad no existe: ${ref.id}` });
      return;
    }
    set({ seleccionId: ref.id, seleccionados: [ref.id], modoSeleccion: "simple", enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  renombrarEntidadDesdeOpl(entidadId, nombre) {
    const { modelo } = get();
    const resultado = renombrarEntidad(modelo, entidadId, nombre);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: entidadId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  fijarFiltroOplPorSeleccion(activo) {
    set({ filtroOplPorSeleccion: activo });
  },

  fijarHoverOpl(ref) {
    const actual = get().hoverOplRef;
    if ((actual === null && ref === null) || (actual && ref && mismaReferencia(actual, ref))) return;
    set({ hoverOplRef: ref });
  },

  fijarBusquedaOpl(texto) {
    set({ busquedaOpl: texto });
  },

  editarEtiquetaEnlaceDesdeOpl(enlaceId, etiqueta) {
    const { modelo } = get();
    const resultado = renombrarEtiquetaEnlace(modelo, enlaceId, etiqueta);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId: enlaceId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  renombrarEstadoDesdeOpl(estadoId, nombre) {
    const { modelo } = get();
    const resultado = renombrarEstado(modelo, estadoId, nombre);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const estadoResultado = resultado.value.estados[estadoId];
    commitModelo(set, modelo, resultado.value, {
      seleccionId: estadoResultado?.entidadId ?? null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  abrirInspectorEnlaceDesdeOpl(enlaceId) {
    const { modelo } = get();
    if (!modelo.enlaces[enlaceId]) {
      set({ mensaje: `Enlace no existe: ${enlaceId}` });
      return;
    }
    set({ seleccionId: null, enlaceSeleccionId: enlaceId, modoEnlace: null, mensaje: null });
  },

  async copiarOplActualAlPortapapeles() {
    const { modelo, opdActivoId } = get();
    const lineas = generarOpl(modelo, opdActivoId);
    const texto = lineas.join("\n");
    try {
      await navigator.clipboard.writeText(texto);
      set({ mensaje: "OPL copiado al portapapeles" });
    } catch {
      set({ mensaje: "No se pudo copiar al portapapeles" });
    }
  },

  async exportarOplActualHtml() {
    const { modelo, opdActivoId } = get();
    const lineas = generarOpl(modelo, opdActivoId);
    if (lineas.length === 0) {
      set({ mensaje: "Sin OPL para exportar" });
      return;
    }
    // Generar HTML usando los tokens con estilos canónicos (JOYAS §1)
    const html = generarHtmlOpl(lineas, modelo.nombre);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${modelo.nombre.replace(/[^a-zA-Z0-9\u00C0-\u024F_-]/g, "_")}-opl.html`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    set({ mensaje: null });
  },

  navegarAviso(aviso) {
    const { modelo, opdActivoId } = get();
    const opdDestino = opdDestinoDeAviso(modelo, aviso, opdActivoId);

    if (aviso.elementoTipo === "entidad" && aviso.elementoId && modelo.entidades[aviso.elementoId]) {
      set({
        opdActivoId: opdDestino ?? opdActivoId,
        seleccionId: aviso.elementoId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
      return;
    }

    if (aviso.elementoTipo === "enlace" && aviso.elementoId && modelo.enlaces[aviso.elementoId]) {
      set({
        opdActivoId: opdDestino ?? opdActivoId,
        seleccionId: null,
        enlaceSeleccionId: aviso.elementoId,
        modoEnlace: null,
        mensaje: null,
      });
      return;
    }

    if (aviso.elementoTipo === "opd") {
      const destino = aviso.elementoId && modelo.opds[aviso.elementoId] ? aviso.elementoId : opdDestino;
      if (destino) {
        set({
          opdActivoId: destino,
          seleccionId: null,
          enlaceSeleccionId: null,
          modoEnlace: null,
          mensaje: null,
        });
        return;
      }
    }

    set({ mensaje: "Aviso sin elemento navegable" });
  },

  elegirTipoEnlace(tipo) {
    const { modelo, seleccionId, modoEnlace } = get();
    const origenId = modoEnlace?.origenId ?? seleccionId;
    if (!origenId || !modelo.entidades[origenId]) {
      set({ mensaje: "Selecciona primero la entidad origen del enlace" });
      return;
    }
    set({ modoEnlace: { tipo, origenId }, modoCreacion: null, mensaje: "Selecciona la entidad destino" });
  },

  cancelarEnlace() {
    set({ modoEnlace: null, mensaje: null });
  },

  deshacer() {
    deshacerRuntime(set, get);
  },

  rehacer() {
    rehacerRuntime(set, get);
  },

  renombrarSeleccionada(nombre) {
    const { modelo, seleccionId } = get();
    if (!seleccionId) return;
    const resultado = renombrarEntidad(modelo, seleccionId, nombre);
    if (resultado.ok) commitModelo(set, modelo, resultado.value, { mensaje: null });
  },

  fijarEsenciaSeleccionada(esencia) {
    const { modelo, seleccionId } = get();
    if (!seleccionId) return;
    const resultado = cambiarEsencia(modelo, seleccionId, esencia);
    if (resultado.ok) commitModelo(set, modelo, resultado.value, { mensaje: null });
  },

  fijarAfiliacionSeleccionada(afiliacion) {
    const { modelo, seleccionId } = get();
    if (!seleccionId) return;
    const resultado = cambiarAfiliacion(modelo, seleccionId, afiliacion);
    if (resultado.ok) commitModelo(set, modelo, resultado.value, { mensaje: null });
  },

  cambiarModoPlegadoSeleccionado(modo) {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) return;
    const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
      .find((item) => item.entidadId === seleccionId);
    if (!apariencia) {
      set({ mensaje: "La entidad seleccionada no tiene apariencia en el OPD activo" });
      return;
    }
    const resultado = cambiarModoPlegadoOp(modelo, opdActivoId, apariencia.id, modo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  cambiarModoPlegadoApariencia(aparienciaId, modo) {
    const { modelo, opdActivoId } = get();
    const resultado = cambiarModoPlegadoOp(modelo, opdActivoId, aparienciaId, modo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const apariencia = modelo.opds[opdActivoId]?.apariencias[aparienciaId];
    commitModelo(set, modelo, resultado.value, {
      seleccionId: apariencia?.entidadId ?? null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  fijarModoPlegadoApariencia(aparienciaId, modo) {
    get().cambiarModoPlegadoApariencia(aparienciaId, modo);
  },

  cambiarOrdenPartesSeleccionado(orden) {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) return;
    const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
      .find((item) => item.entidadId === seleccionId);
    if (!apariencia) {
      set({ mensaje: "La entidad seleccionada no tiene apariencia en el OPD activo" });
      return;
    }
    const resultado = cambiarOrdenPartesOp(modelo, opdActivoId, apariencia.id, orden);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  fijarOrdenPartesApariencia(aparienciaId, orden) {
    const { modelo, opdActivoId } = get();
    const resultado = cambiarOrdenPartesOp(modelo, opdActivoId, aparienciaId, orden);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const apariencia = modelo.opds[opdActivoId]?.apariencias[aparienciaId];
    commitModelo(set, modelo, resultado.value, {
      seleccionId: apariencia?.entidadId ?? null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  aplicarEstiloSeleccionado(patch) {
    const { modelo, opdActivoId, seleccionId } = get();
    const apariencia = aparienciaSeleccionadaActiva(modelo, opdActivoId, seleccionId);
    if (!apariencia) {
      set({ mensaje: "Selecciona una cosa con apariencia activa" });
      return;
    }
    const resultado = aplicarEstiloApariencia(modelo, opdActivoId, apariencia.id, patch);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  resetearEstiloSeleccionado() {
    const { modelo, opdActivoId, seleccionId } = get();
    const apariencia = aparienciaSeleccionadaActiva(modelo, opdActivoId, seleccionId);
    if (!apariencia) {
      set({ mensaje: "Selecciona una cosa con apariencia activa" });
      return;
    }
    const resultado = resetearEstiloApariencia(modelo, opdActivoId, apariencia.id);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  seleccionarPartePlegada(_padreAparienciaId, parteEntidadId) {
    const { modelo, modoEnlace, opdActivoId } = get();
    if (!modoEnlace) {
      set({ seleccionId: parteEntidadId, enlaceSeleccionId: null, mensaje: null });
      return;
    }

    const resultado = crearEnlaceConExtremoPlegado(modelo, opdActivoId, modoEnlace.origenId, parteEntidadId, modoEnlace.tipo);
    if (!resultado.ok) {
      set({ seleccionId: parteEntidadId, enlaceSeleccionId: null, mensaje: resultado.error });
      return;
    }
    let modeloFinal = resultado.value;
    const enlaceCreadoId = enlaceNuevo(modelo, modeloFinal);
    if (enlaceCreadoId) {
      const auto = formarAbanicoAutomatico(modeloFinal, opdActivoId, enlaceCreadoId);
      if (auto.ok) modeloFinal = auto.value;
    }
    commitModelo(set, modelo, modeloFinal, {
      seleccionId: parteEntidadId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  extraerParteDePlegado(padreAparienciaId, parteEntidadId) {
    const { modelo, opdActivoId } = get();
    const resultado = extraerParteDePlegadoOp(modelo, opdActivoId, padreAparienciaId, parteEntidadId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: parteEntidadId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  reinsertarParteExtraidaSeleccionada() {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) return;
    const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
      .find((item) => item.entidadId === seleccionId && item.parteExtraidaDe);
    if (!apariencia?.parteExtraidaDe) {
      set({ mensaje: "Selecciona una parte extraída" });
      return;
    }
    const padre = modelo.opds[opdActivoId]?.apariencias[apariencia.parteExtraidaDe.padreAparienciaId];
    const resultado = reinsertarParteEnPlegadoOp(modelo, apariencia.id);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: padre?.entidadId ?? null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  agregarEstadosObjeto() {
    const { modelo, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un objeto para agregar estados" });
      return;
    }
    const resultado = crearEstadosIniciales(modelo, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: resultado.value.creado ? "Estados iniciales agregados" : null,
    });
  },

  agregarEstadoObjeto() {
    const { modelo, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un objeto para agregar un estado" });
      return;
    }
    const resultado = agregarEstado(modelo, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  eliminarEstado(estadoId) {
    const { modelo, seleccionId } = get();
    const resultado = eliminarEstadoOp(modelo, estadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  quitarEstadosObjetoSeleccionado() {
    const { modelo, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un objeto para quitar estados" });
      return;
    }
    const resultado = quitarEstadosObjeto(modelo, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "Estados eliminados",
    });
  },

  renombrarEstadoSeleccionado(estadoId, nombre) {
    const { modelo, seleccionId } = get();
    const resultado = renombrarEstado(modelo, estadoId, nombre);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  designarEstadoInicial(estadoId) {
    const { modelo, seleccionId } = get();
    const resultado = designarInicial(modelo, estadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  designarEstadoFinal(estadoId) {
    const { modelo, seleccionId } = get();
    const resultado = designarFinal(modelo, estadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  editarAliasEntidad(entidadId, alias) {
    const { modelo } = get();
    const resultado = editarAlias(modelo, entidadId, alias);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  editarUnidadEntidad(entidadId, unidad) {
    const { modelo } = get();
    const resultado = editarUnidad(modelo, entidadId, unidad);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  editarDescripcionEntidad(entidadId, descripcion) {
    const { modelo } = get();
    const resultado = editarDescripcion(modelo, entidadId, descripcion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  abrirModalUrls(entidadId) {
    if (!get().modelo.entidades[entidadId]) return;
    set({ modalUrlsAbierto: entidadId, menuPrincipalAbierto: false, mensaje: null });
  },

  cerrarModalUrls() {
    set({ modalUrlsAbierto: null });
  },

  agregarUrlAEntidad(entidadId, url) {
    const { modelo } = get();
    const resultado = agregarUrl(modelo, entidadId, {
      id: `url-${modelo.nextSeq}`,
      tipo: url.tipo,
      url: url.url,
    });
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, { ...resultado.value, nextSeq: modelo.nextSeq + 1 }, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  eliminarUrlDeEntidad(entidadId, urlId) {
    const { modelo } = get();
    const resultado = eliminarUrl(modelo, entidadId, urlId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  reordenarUrlsEntidad(entidadId, urlIds) {
    const { modelo } = get();
    const resultado = reordenarUrls(modelo, entidadId, urlIds);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  designarEstadoComo(estadoId, designacion) {
    const { modelo, seleccionId } = get();
    const acciones: Record<DesignacionEstado, (m: Modelo, id: Id) => ReturnType<typeof designarInicial>> = {
      inicial: designarInicial,
      final: designarFinal,
      default: designarDefault,
      current: designarCurrent,
    };
    const resultado = acciones[designacion](modelo, estadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  quitarDesignacionEstado(estadoId, designacion) {
    const { modelo, seleccionId } = get();
    const resultado = quitarDesignacion(modelo, estadoId, designacion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  suprimirEstadoPorId(estadoId) {
    const { modelo, seleccionId } = get();
    const resultado = suprimirEstado(modelo, estadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: "Estado suprimido" });
  },

  restaurarEstadoPorId(estadoId) {
    const { modelo, seleccionId } = get();
    const resultado = restaurarEstado(modelo, estadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  abrirModalDuracion(estadoId) {
    if (!get().modelo.estados[estadoId]) return;
    set({ modalDuracionAbierto: estadoId, mensaje: null });
  },

  cerrarModalDuracion() {
    set({ modalDuracionAbierto: null });
  },

  fijarDuracionEstado(estadoId, duracion) {
    const { modelo, seleccionId } = get();
    const resultado = fijarDuracion(modelo, estadoId, duracion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, modalDuracionAbierto: null, mensaje: null });
  },

  quitarDuracionEstado(estadoId) {
    const { modelo, seleccionId } = get();
    const resultado = quitarDuracion(modelo, estadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, modalDuracionAbierto: null, mensaje: null });
  },

  fijarLayoutEstadosEntidad(entidadId, layout) {
    const { modelo } = get();
    const entidad = modelo.entidades[entidadId];
    if (!entidad || entidad.tipo !== "objeto") return;
    const siguiente: Modelo = {
      ...modelo,
      entidades: {
        ...modelo.entidades,
        [entidadId]: { ...entidad, layoutEstados: layout },
      },
    };
    commitModelo(set, modelo, siguiente, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  toggleAliasVisibles() {
    const { uiAliasVisibles, uiDescripcionesVisibles, modelo } = get();
    const aliasVisibles = !uiAliasVisibles;
    fijarOpcionesProyeccionGlobal({ aliasVisibles, descripcionesVisibles: uiDescripcionesVisibles });
    set({ uiAliasVisibles: aliasVisibles, modelo: { ...modelo } });
  },

  toggleDescripcionesVisibles() {
    const { uiAliasVisibles, uiDescripcionesVisibles, modelo } = get();
    const descripcionesVisibles = !uiDescripcionesVisibles;
    fijarOpcionesProyeccionGlobal({ aliasVisibles: uiAliasVisibles, descripcionesVisibles });
    set({ uiDescripcionesVisibles: descripcionesVisibles, modelo: { ...modelo } });
  },

  moverEntidad(id, x, y) {
    const { modelo, opdActivoId } = get();
    const resultado = moverAparienciaEntidad(modelo, opdActivoId, id, { x, y });
    if (resultado.ok) commitModelo(set, modelo, resultado.value);
  },

  moverApariencia(aparienciaId, x, y) {
    const { modelo, opdActivoId } = get();
    const resultado = moverAparienciaPorId(modelo, opdActivoId, aparienciaId, { x, y });
    if (resultado.ok) commitModelo(set, modelo, resultado.value);
  },

  reordenarSubprocesoEnTimeline(opdId, aparienciaId, nuevaY) {
    const { modelo } = get();
    const validado = validarSubprocesoTimeline(modelo, opdId, aparienciaId);
    if (!validado.ok) {
      set({ mensaje: validado.error });
      return;
    }
    if (!Number.isFinite(nuevaY)) {
      set({ mensaje: "Y de timeline inválida" });
      return;
    }
    const { apariencia, contorno } = validado;
    const y = limitar(nuevaY, contorno.y, contorno.y + contorno.height - apariencia.height);
    const resultado = moverAparienciaPorId(modelo, opdId, aparienciaId, { x: apariencia.x, y });
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: apariencia.entidadId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  actualizarVerticesEnlace(aparienciaEnlaceId, vertices) {
    const { modelo, opdActivoId } = get();
    const resultado = actualizarVerticesEnlaceOp(modelo, opdActivoId, aparienciaEnlaceId, vertices);
    if (resultado.ok) commitModelo(set, modelo, resultado.value);
  },

  ajustarMultiplicidadSeleccionada(lado, texto) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) return;
    const resultado = ajustarMultiplicidad(modelo, enlaceSeleccionId, lado, texto);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  apuntarExtremoEnlaceSeleccionado(lado, extremo) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) return;
    const resultado = apuntarExtremoEnlace(modelo, enlaceSeleccionId, lado, extremo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    if (resultado.value === modelo) return;
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  reanclarEnlaceExternoDerivado(aparienciaEnlaceId, nuevoEndpointEntidadId) {
    const { modelo, opdActivoId, enlaceSeleccionId } = get();
    const resultado = reanclarEnlaceExternoDerivadoOp(modelo, opdActivoId, aparienciaEnlaceId, nuevoEndpointEntidadId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: "Enlace derivado reanclado",
    });
  },

  splitEffectSeleccionado() {
    const { modelo, opdActivoId, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) {
      set({ mensaje: "Selecciona un enlace de efecto para splittear" });
      return;
    }
    const resultado = splitEffectEnPar(modelo, opdActivoId, enlaceSeleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "Efecto descompuesto en consumo + resultado intermedio",
    });
  },

  volverEnlaceExternoDerivadoAAutomatico(aparienciaEnlaceId) {
    const { modelo, opdActivoId, enlaceSeleccionId } = get();
    const resultado = volverEnlaceExternoDerivadoAAutomaticoOp(modelo, opdActivoId, aparienciaEnlaceId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const enlaceActual = enlaceSeleccionId ? resultado.value.enlaces[enlaceSeleccionId] : undefined;
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId: enlaceActual ? enlaceSeleccionId : null,
      modoEnlace: null,
      mensaje: "Enlace derivado automatico",
    });
  },

  alternarOperadorAbanicoSeleccionado(operador) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) {
      set({ mensaje: "Selecciona un enlace para alternar el operador del abanico" });
      return;
    }
    const abanico = abanicoDeEnlace(modelo, enlaceSeleccionId);
    if (!abanico) {
      set({ mensaje: "El enlace no pertenece a un abanico" });
      return;
    }
    const resultado = alternarOperadorAbanicoOp(modelo, abanico.id, operador);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: `Operador actualizado a ${operador}` });
  },

  quitarRamaDeAbanicoSeleccionado() {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) {
      set({ mensaje: "Selecciona un enlace para quitar del abanico" });
      return;
    }
    const abanico = abanicoDeEnlace(modelo, enlaceSeleccionId);
    if (!abanico) {
      set({ mensaje: "El enlace no pertenece a un abanico" });
      return;
    }
    const resultado = quitarRamaDeAbanicoOp(modelo, abanico.id, enlaceSeleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: "Rama removida del abanico" });
  },

  disolverAbanicoSeleccionado() {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) {
      set({ mensaje: "Selecciona un enlace del abanico a disolver" });
      return;
    }
    const abanico = abanicoDeEnlace(modelo, enlaceSeleccionId);
    if (!abanico) {
      set({ mensaje: "El enlace no pertenece a un abanico" });
      return;
    }
    const resultado = disolverAbanicoOp(modelo, abanico.id);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: "Abanico disuelto" });
  },

  crearAutoInvocacionSeleccionada() {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un proceso para crear auto-invocacion" });
      return;
    }
    const entidad = modelo.entidades[seleccionId];
    if (!entidad || entidad.tipo !== "proceso") {
      set({ mensaje: "Selecciona un proceso para crear auto-invocacion" });
      return;
    }
    const resultado = crearAutoInvocacion(modelo, opdActivoId, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const enlaceId = enlaceNuevo(modelo, resultado.value);
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId: enlaceId,
      modoEnlace: null,
      mensaje: "Auto-invocacion creada",
    });
  },

  aplicarModificadorEnlaceSeleccionado(modificador) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) {
      set({ mensaje: "Selecciona un enlace para aplicar modificador" });
      return;
    }
    const resultado = aplicarModificador(modelo, enlaceSeleccionId, modificador);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  quitarModificadorEnlaceSeleccionado() {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) return;
    const resultado = quitarModificador(modelo, enlaceSeleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  definirProbabilidadEventoSeleccionada(probabilidad) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) return;
    const resultado = definirProbabilidad(modelo, enlaceSeleccionId, probabilidad);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  definirDemoraInvocacionSeleccionada(demora) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) return;
    const resultado = definirDemora(modelo, enlaceSeleccionId, demora);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  renombrarEtiquetaEnlaceSeleccionado(etiqueta) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) return;
    const resultado = renombrarEtiquetaEnlace(modelo, enlaceSeleccionId, etiqueta);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  definirRutaEtiquetaSeleccionada(etiqueta) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) return;
    const resultado = definirRutaEtiqueta(modelo, enlaceSeleccionId, etiqueta);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  }
});
