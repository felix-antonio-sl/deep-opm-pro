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
import type { CrearSlice, EnlacesSlice } from "./tipos";
import {
  ANCHO_PANEL_ARBOL_DEFAULT, ANCHO_PANEL_ARBOL_MAX, ANCHO_PANEL_ARBOL_MIN, PORTAPAPELES_WORKSPACE_TTL_MS, PREF_MOSTRAR_ARCHIVADOS_KEY, PREF_MOSTRAR_VERSIONES_KEY, activarEstadoPestanas, activarPestanaNueva, aparienciaSeleccionadaActiva, commitModelo, confirmarEliminacionOpd, crearDemo, crearIdModeloLocal, entidadNueva, enlaceNuevo, escribirIndiceWorkspace, escribirPreferenciaBooleana, estadoModelo, estadoSeleccionDesdeIds, generarHtmlOpl, hermanosOrdenados, leerIndiceWorkspace, leerPreferenciaBooleana, leerPreferenciasMapa, limitar, limitarAnchoPanelArbol, listarModelosGuardadosSeguro, mapaWorkspaceDesdeEstado, marcarSnapshotJson, marcarSnapshotModelo, modelosRecientesDeIndice, obtenerAutosalvadoControl, obtenerEstadoStore, opdActivoSeguro, opdDestinoDeAviso, persistirPreferenciasMapa, fijarAutosalvadoControl, resetHistorial, setEstadoStore, sincronizarIndiceConModelosGuardados, actualizarPreferenciasUi, validarSubprocesoTimeline,
  pestanaReemplazable,
  deshacerRuntime,
  rehacerRuntime,
} from "./runtime";

export type { EnlacesSlice } from "./tipos";

export const createEnlacesSlice: CrearSlice<EnlacesSlice> = (set, get) => ({
  modoEnlace: null,
  modoCreacion: null,
  tablaEnlacesAbierta: false,
  tablaEnlacesFiltroTipo: "todos",
  tablaEnlacesOrdenColumna: null,
  tablaEnlacesOrdenDireccion: "asc",
  enlaceEstiloPortapapeles: null,

  fijarMultiplicidadEnlace(enlaceId, lado, valor) {
    const { modelo } = get();
    const resultado = lado === "origen"
      ? fijarMultiplicidadOrigen(modelo, enlaceId, valor)
      : fijarMultiplicidadDestino(modelo, enlaceId, valor);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: null, enlaceSeleccionId: enlaceId, modoEnlace: null, mensaje: null });
  },

  quitarMultiplicidadEnlace(enlaceId, lado) {
    const { modelo } = get();
    const resultado = quitarMultiplicidad(modelo, enlaceId, lado);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: null, enlaceSeleccionId: enlaceId, modoEnlace: null, mensaje: null });
  },

  aplicarEstiloEnlaceAccion(enlaceId, estilo) {
    const { modelo } = get();
    const resultado = aplicarEstiloEnlace(modelo, enlaceId, estilo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: null, enlaceSeleccionId: enlaceId, modoEnlace: null, mensaje: null });
  },

  resetEstiloEnlaceAccion(enlaceId) {
    const { modelo } = get();
    const resultado = resetEstiloEnlace(modelo, enlaceId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: null, enlaceSeleccionId: enlaceId, modoEnlace: null, mensaje: null });
  },

  copiarEstiloEnlaceAlPortapapeles(enlaceId) {
    const { modelo } = get();
    const copiado = copiarEstiloEnlace(modelo, enlaceId);
    set({ enlaceEstiloPortapapeles: copiado, mensaje: copiado ? "Estilo copiado" : "Sin estilo que copiar" });
  },

  pegarEstiloEnlaceDesdePortapapeles(enlaceId) {
    const { modelo, enlaceEstiloPortapapeles } = get();
    if (!enlaceEstiloPortapapeles) {
      set({ mensaje: "No hay estilo de enlace en el portapapeles" });
      return;
    }
    const resultado = pegarEstiloEnlace(modelo, enlaceId, enlaceEstiloPortapapeles);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: null, enlaceSeleccionId: enlaceId, modoEnlace: null, mensaje: "Estilo pegado" });
  },

  aplicarEstiloTextoAccion(aparienciaId, estilo) {
    const { modelo, opdActivoId } = get();
    const opd = modelo.opds[opdActivoId];
    if (!opd?.apariencias[aparienciaId]) {
      set({ mensaje: "Apariencia no existe" });
      return;
    }
    const resultado = aplicarEstiloApariencia(modelo, opdActivoId, aparienciaId, estilo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const entidadId = opd.apariencias[aparienciaId]?.entidadId ?? null;
    commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  resetEstiloTextoAccion(aparienciaId) {
    const { modelo, opdActivoId } = get();
    const opd = modelo.opds[opdActivoId];
    if (!opd?.apariencias[aparienciaId]) {
      set({ mensaje: "Apariencia no existe" });
      return;
    }
    // Solo resetea campos de texto, preserva fill/border
    const resultado = aplicarEstiloApariencia(modelo, opdActivoId, aparienciaId, { fontFamily: undefined, fontSize: undefined, fontWeight: undefined, fontStyle: undefined, textColor: undefined, textAnchor: undefined } as Record<string, undefined> as unknown as EstiloApariencia);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const entidadId = opd.apariencias[aparienciaId]?.entidadId ?? null;
    commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  insertarVerticeAccion(aparienciaEnlaceId, posicion) {
    const { modelo } = get();
    const resultado = insertarVerticeApariencia(modelo, aparienciaEnlaceId, posicion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: null });
  },

  reposicionarVerticeAccion(aparienciaEnlaceId, indice, posicion) {
    const { modelo } = get();
    const resultado = reposicionarVerticeApariencia(modelo, aparienciaEnlaceId, indice, posicion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: null });
  },

  reanclarExtremoAccion(enlaceId, lado, nuevoExtremo) {
    const { modelo } = get();
    const resultado = reanclarExtremoEnlaceOp(modelo, enlaceId, lado, nuevoExtremo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, { seleccionId: null, enlaceSeleccionId: enlaceId, modoEnlace: null, mensaje: resultado.value.advertencia ?? null });
  },

  borrarEnlacesEnLote(enlaceIds) {
    const { modelo } = get();
    if (enlaceIds.length === 0) return;
    let actual = modelo;
    for (const enlaceId of enlaceIds) {
      const res = eliminarEnlace(actual, enlaceId);
      if (!res.ok) {
        set({ mensaje: res.error });
        return;
      }
      actual = res.value;
    }
    commitModelo(set, modelo, actual, { seleccionId: null, enlaceSeleccionId: null, modoEnlace: null, mensaje: `${enlaceIds.length} enlaces eliminados` });
  },

  abrirTablaEnlaces() {
    set({ tablaEnlacesAbierta: true, menuPrincipalAbierto: false });
  },

  cerrarTablaEnlaces() {
    set({ tablaEnlacesAbierta: false });
  },

  fijarFiltroTablaEnlaces(tipo) {
    set({ tablaEnlacesFiltroTipo: tipo });
  },

  fijarOrdenTablaEnlaces(columna) {
    const { tablaEnlacesOrdenColumna, tablaEnlacesOrdenDireccion } = get();
    if (tablaEnlacesOrdenColumna === columna) {
      set({
        tablaEnlacesOrdenDireccion: tablaEnlacesOrdenDireccion === "asc" ? "desc" : "asc",
      });
    } else {
      set({ tablaEnlacesOrdenColumna: columna, tablaEnlacesOrdenDireccion: "asc" });
    }
  },

  navegarAEnlaceDesdeTabla(enlaceId) {
    const { modelo } = get();
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) {
      set({ mensaje: `Enlace no existe: ${enlaceId}` });
      return;
    }
    // Encontrar el primer OPD donde el enlace tiene apariencia
    for (const opdId of Object.keys(modelo.opds)) {
      const opd = modelo.opds[opdId];
      if (!opd) continue;
      for (const ae of Object.values(opd.enlaces)) {
        if (ae.enlaceId === enlaceId) {
          set({
            opdActivoId: opdId,
            seleccionId: null,
            enlaceSeleccionId: enlaceId,
            modoEnlace: null,
            tablaEnlacesAbierta: false,
            mensaje: null,
          });
          return;
        }
      }
    }
    set({ mensaje: "Enlace sin apariencia en ningún OPD" });
  },

  /**
   * Beta1 (ronda 16 L1): "Ir a origen" / "Ir a destino" desde TablaEnlaces.
   * Cambia opdActivoId al primer OPD donde la entidad portadora del extremo
   * tiene apariencia (si el extremo es estado, se busca por la entidad
   * portadora del estado — mismo contrato que el panel OPL describe).
   * Cierra la tabla y deja la entidad seleccionada.
   */
  irAExtremoEnlaceTabla(enlaceId, lado) {
    const { modelo } = get();
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) {
      set({ mensaje: `Enlace no existe: ${enlaceId}` });
      return;
    }
    const extremo = lado === "origen" ? enlace.origenId : enlace.destinoId;
    const entidadId = extremo.kind === "entidad"
      ? extremo.id
      : (modelo.estados[extremo.id]?.entidadId ?? null);
    if (!entidadId || !modelo.entidades[entidadId]) {
      set({ mensaje: `No se pudo resolver el extremo ${lado} del enlace` });
      return;
    }
    // Encontrar el primer OPD donde la entidad portadora aparece
    for (const opdId of Object.keys(modelo.opds)) {
      const opd = modelo.opds[opdId];
      if (!opd) continue;
      const apariencia = Object.values(opd.apariencias).find((a) => a.entidadId === entidadId);
      if (!apariencia) continue;
      set({
        opdActivoId: opdId,
        seleccionId: entidadId,
        seleccionados: [entidadId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        tablaEnlacesAbierta: false,
        mensaje: null,
      });
      return;
    }
    set({ mensaje: `Extremo ${lado} sin apariencia en ningún OPD` });
  },

  /**
   * Beta1 (ronda 16 L1): eliminar enlace desde TablaEnlaces. Reusa
   * eliminarEnlace cross-OPD; mantiene la tabla abierta para edición continua
   * y emite mensaje informativo (la fila desaparece tras el commit).
   */
  eliminarEnlaceDesdeTabla(enlaceId) {
    const { modelo } = get();
    if (!modelo.enlaces[enlaceId]) {
      set({ mensaje: `Enlace no existe: ${enlaceId}` });
      return;
    }
    const resultado = eliminarEnlace(modelo, enlaceId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      seleccionados: [],
      modoSeleccion: "simple",
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "Enlace eliminado",
    });
  }
});
