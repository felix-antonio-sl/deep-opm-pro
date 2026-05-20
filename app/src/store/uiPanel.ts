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
import { datosAsistenteVacio, ETAPA_FUNCION, ETAPA_SEMBRAR, sembrarModeloDesdeAsistente, validarDatosAsistente, type DatosAsistente, type EtapaAsistente } from "../modelo/creacionWizard";
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
} from "../canvas/mapaSistema";
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
import type { CrearSlice, UiPanelSlice } from "./tipos";
import {
  ANCHO_PANEL_ARBOL_DEFAULT, ANCHO_PANEL_ARBOL_MAX, ANCHO_PANEL_ARBOL_MIN, PORTAPAPELES_WORKSPACE_TTL_MS, PREF_MOSTRAR_ARCHIVADOS_KEY, PREF_MOSTRAR_VERSIONES_KEY, activarEstadoPestanas, activarPestanaNueva, aparienciaSeleccionadaActiva, commitModelo, confirmarEliminacionOpd, crearDemo, crearFixturePorNombre, crearIdModeloLocal, entidadNueva, enlaceNuevo, escribirIndiceWorkspace, escribirPreferenciaBooleana, estadoModelo, estadoSeleccionDesdeIds, generarHtmlOpl, hermanosOrdenados, leerIndiceWorkspace, leerPreferenciaBooleana, leerPreferenciasMapa, limitar, limitarAnchoPanelArbol, limitarAnchoPanelInspector, listarModelosGuardadosSeguro, mapaWorkspaceDesdeEstado, marcarSnapshotJson, marcarSnapshotModelo, modelosRecientesDeIndice, obtenerAutosalvadoControl, obtenerEstadoStore, opdActivoSeguro, opdDestinoDeAviso, persistirPreferenciasMapa, fijarAutosalvadoControl, resetHistorial, setEstadoStore, sincronizarIndiceConModelosGuardados, actualizarPreferenciasUi, validarSubprocesoTimeline,
  pestanaReemplazable,
  deshacerRuntime,
  rehacerRuntime,
} from "./runtime";
import { indiceInicial } from "./workspaceMod";
const preferenciasUiIniciales = indiceInicial.preferenciasUi ?? {};

export type { UiPanelSlice } from "./tipos";

export const createUiPanelSlice: CrearSlice<UiPanelSlice> = (set, get) => ({
  filtroOplPorSeleccion: false,
  hoverOplRef: null,
  busquedaOpl: "",
  menuPrincipalAbierto: false,
  toolbarMasAbierto: false,
  dialogoGuardarComoAbierto: false,
  dialogoCargarModeloAbierto: false,
  dialogoImportarExportarJsonAbierto: false,
  dialogoComandosAbierto: false,
  uiAliasVisibles: true,
  uiDescripcionesVisibles: true,
  solicitudFitToken: 0,
  readOnly: false,
  modalUrlsAbierto: null,
  modalImagenAbierto: null,
  uiModoImagenGlobal: null,
  modalDuracionAbierto: null,
  modoOrdenArbol: "automatico",
  gestionArbolAbierta: false,
  busquedaOpdGestion: "",
  anchoPanelArbol: limitarAnchoPanelArbol(preferenciasUiIniciales.anchoPanelArbol),
  anchoPanelInspector: limitarAnchoPanelInspector(preferenciasUiIniciales.anchoPanelInspector),
  nombresArbolVisibles: preferenciasUiIniciales.nombresArbolVisibles ?? true,
  cheatsheetAtajosAbierto: false,
  // L2 ronda 21: vista activa del modo revisión mobile. Solo se consume cuando
  // el breakpoint es "mobile". Default "canvas" porque ese es el primer valor
  // de revisión: ver el OPD activo antes de navegar tree/OPL/issues.
  vistaMobileActiva: "canvas",
  asistente: null,
  // L3 ronda 20 / ronda 22 S.2: biblioteca dock acoplable.
  bibliotecaDockAbierto: false,
  // L1 ronda 20: tabs Inspector. Defaults `semantica` y `propiedades`.
  tabInspectorEntidadActivo: "semantica",
  tabInspectorEnlaceActivo: "propiedades",
  // L4 ronda 23 (#15): bus de señal focus Nombre. Default `null`: no hay
  // creación pendiente. Lo escribe `crearObjetoDemo`/`crearProcesoDemo`/
  // `crearEntidadEnCanvas`; lo consume `InspectorEntidad` via `useEffect`.
  solicitarFocusNombre: null,

  fijarModoOrdenArbol(modo) {
    const { modelo } = get();
    if (modo === "automatico") {
      // Recomputar orden desde canvas
      const todosPadres = new Set<Id | null>();
      for (const opd of Object.values(modelo.opds)) {
        todosPadres.add(opd.padreId);
      }
      let siguiente = modelo;
      for (const padreId of todosPadres) {
        if (padreId === null) continue;
        const res = ordenSegunCanvasPadre(modelo, padreId);
        if (res.ok) {
          const reord = reordenarHermanos(siguiente, padreId, res.value);
          if (reord.ok) siguiente = reord.value;
        }
      }
      if (siguiente !== modelo) {
        commitModelo(set, modelo, siguiente, {
          modoOrdenArbol: "automatico",
          mensaje: "Orden automático aplicado",
        });
      } else {
        set({ modoOrdenArbol: "automatico" });
      }
    } else {
      set({ modoOrdenArbol: "manual" });
    }
  },

  moverHermano(padreId, opdId, posicion) {
    const { modelo, modoOrdenArbol } = get();
    if (modoOrdenArbol !== "manual") {
      set({ mensaje: "El orden está en modo automático; cámbialo para reordenar manualmente" });
      return;
    }
    const resultado = moverNodo(modelo, opdId, padreId, posicion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: "Hermano reordenado" });
  },

  moverOpdEnGestion(opdId, nuevoPadreId, posicion) {
    const { modelo } = get();
    const resultado = moverNodo(modelo, opdId, nuevoPadreId, posicion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: "OPD movido en gestión" });
  },

  // ── L5: Gestión árbol ────────────────────────────────────────────

  abrirGestionArbol() {
    set({ gestionArbolAbierta: true, busquedaOpdGestion: "", mensaje: null });
  },

  cerrarGestionArbol() {
    set({ gestionArbolAbierta: false, busquedaOpdGestion: "" });
  },

  fijarBusquedaOpdGestion(q) {
    set({ busquedaOpdGestion: q });
  },

  // ── L5: Renombrado OPD desde árbol ───────────────────────────────

	  renombrarOpdDesdeArbol(opdId, nombre) {
    const { modelo } = get();
    const opd = modelo.opds[opdId];
    if (!opd) {
      set({ mensaje: `OPD no existe: ${opdId}` });
      return;
    }
    const nombreTrim = nombre.trim();
    if (!nombreTrim) {
      set({ mensaje: "El nombre del OPD no puede estar vacío" });
      return;
    }
    // Validar unicidad de nombre dentro del mismo padre
    const hermanoConflicto = Object.values(modelo.opds).find(
      (otro) =>
        otro.id !== opdId &&
        otro.padreId === opd.padreId &&
        otro.nombre === nombreTrim,
    );
    if (hermanoConflicto) {
      set({ mensaje: `Ya existe un OPD con nombre "${nombreTrim}" en este nivel` });
      return;
    }
    const siguiente: Modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [opdId]: { ...opd, nombre: nombreTrim },
      },
    };
	    commitModelo(set, modelo, siguiente, { mensaje: "OPD renombrado" });
	  },

	  // ── L5: Atajos / árbol ─────────────────────────────────────────

	  fijarAnchoPanelArbol(px) {
	    const anchoPanelArbol = limitarAnchoPanelArbol(px);
	    const indice = actualizarPreferenciasUi(get().indice, { anchoPanelArbol });
	    escribirIndiceWorkspace(indice);
	    set({ indice, anchoPanelArbol });
	  },

	  // BUG-20260511T225343Z-696858: setter espejo a `fijarAnchoPanelArbol` que
	  // clamp [240, 560] y persiste en `indice.preferenciasUi.anchoPanelInspector`.
	  fijarAnchoPanelInspector(px) {
	    const anchoPanelInspector = limitarAnchoPanelInspector(px);
	    const indice = actualizarPreferenciasUi(get().indice, { anchoPanelInspector });
	    escribirIndiceWorkspace(indice);
	    set({ indice, anchoPanelInspector });
	  },

	  toggleNombresArbolVisibles() {
	    const nombresArbolVisibles = !get().nombresArbolVisibles;
	    const indice = actualizarPreferenciasUi(get().indice, { nombresArbolVisibles });
	    escribirIndiceWorkspace(indice);
	    set({ indice, nombresArbolVisibles });
	  },

	  abrirCheatsheetAtajos() {
	    set({ cheatsheetAtajosAbierto: true, menuPrincipalAbierto: false });
	  },

	  cerrarCheatsheetAtajos() {
	    set({ cheatsheetAtajosAbierto: false });
	  },

	  abrirDialogoComandos() {
	    set({ dialogoComandosAbierto: true, menuPrincipalAbierto: false, toolbarMasAbierto: false });
	  },

	  cerrarDialogoComandos() {
	    set({ dialogoComandosAbierto: false });
	  },

	  // ── L3 ronda 20 / ronda 22 S.2: Biblioteca dock acoplable ──

	  toggleBibliotecaDock() {
	    const abierto = !get().bibliotecaDockAbierto;
	    set({ bibliotecaDockAbierto: abierto });
	  },

	  abrirBibliotecaDock() {
	    set({ bibliotecaDockAbierto: true });
	  },

	  cerrarBibliotecaDock() {
	    set({ bibliotecaDockAbierto: false });
	  },

	  navegarOpdArriba() {
	    const { modelo, opdActivoId } = get();
	    const actual = modelo.opds[opdActivoId];
	    if (!actual) return;
	    const hermanos = hermanosOrdenados(modelo, actual.padreId);
	    const indice = hermanos.findIndex((opd) => opd.id === opdActivoId);
	    const destino = indice > 0 ? hermanos[indice - 1] : null;
	    if (destino) get().cambiarOpdActivo(destino.id);
	  },

	  navegarOpdAbajo() {
	    const { modelo, opdActivoId } = get();
	    const actual = modelo.opds[opdActivoId];
	    if (!actual) return;
	    const hermanos = hermanosOrdenados(modelo, actual.padreId);
	    const indice = hermanos.findIndex((opd) => opd.id === opdActivoId);
	    const destino = indice >= 0 && indice < hermanos.length - 1 ? hermanos[indice + 1] : null;
	    if (destino) get().cambiarOpdActivo(destino.id);
	  },

	  navegarOpdIzquierda() {
	    const { modelo, opdActivoId } = get();
	    const padreId = modelo.opds[opdActivoId]?.padreId;
	    if (padreId && modelo.opds[padreId]) get().cambiarOpdActivo(padreId);
	  },

	  navegarOpdDerecha() {
	    const { modelo, opdActivoId } = get();
	    const destino = hermanosOrdenados(modelo, opdActivoId)[0];
	    if (destino) get().cambiarOpdActivo(destino.id);
	  },

	  // ── L3: Asistente nuevo modelo ─────────────────────────────────

  iniciarAsistente() {
    set({
      asistente: {
        etapaActual: ETAPA_FUNCION,
        datos: datosAsistenteVacio(),
        cancelado: false,
      },
      mensaje: null,
    });
  },

  siguienteEtapa(parcial) {
    const actual = get().asistente;
    if (!actual) return;
    const datos = { ...actual.datos, ...parcial };
    const validacion = validarDatosAsistente(datos, actual.etapaActual);
    if (!validacion.ok) {
      set({ mensaje: validacion.error });
      return;
    }
    // Ronda 23 L3 #6: la última etapa es ETAPA_SEMBRAR; no avanzamos más
    // allá. El sembrado final lo dispara `confirmarAsistente`.
    const siguienteEtapa = Math.min(actual.etapaActual + 1, ETAPA_SEMBRAR) as EtapaAsistente;
    set({
      asistente: { ...actual, etapaActual: siguienteEtapa, datos },
      mensaje: null,
    });
  },

  etapaAnterior() {
    const actual = get().asistente;
    if (!actual || actual.etapaActual <= ETAPA_FUNCION) return;
    set({
      asistente: { ...actual, etapaActual: (actual.etapaActual - 1) as EtapaAsistente },
      mensaje: null,
    });
  },

  cancelarAsistente() {
    const actual = get().asistente;
    if (!actual) return;
    // Si no hay datos ingresados, cerrar directo.
    const datos = actual.datos;
    const tieneDatos = datos.funcionPrincipal?.trim() || datos.beneficiario?.trim();
    if (!tieneDatos) {
      set({ asistente: null, mensaje: null });
      return;
    }
    // Marcar como cancelado; el UI muestra confirmacion.
    set({ asistente: { ...actual, cancelado: true } });
  },

  /**
   * L2 ronda 21: cambia la vista activa del modo revisión mobile.
   * No-op funcional en desktop/tablet (App.tsx solo lo consume cuando el
   * breakpoint es "mobile"), pero la acción es segura de invocar siempre.
   */
  cambiarVistaMobile(vista) {
    set({ vistaMobileActiva: vista });
  },

  confirmarAsistente() {
    const actual = get().asistente;
    if (!actual) return;
    // Validar y sembrar.
    const datosCompletos = actual.datos as DatosAsistente;
    const resultado = sembrarModeloDesdeAsistente(datosCompletos);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const modelo = resultado.value;
    const actualPestana = get().pestanasAbiertas.find((pestana) => pestana.id === get().pestanaActivaId);
    if (actualPestana && pestanaReemplazable(actualPestana)) {
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
        asistente: null,
        menuPrincipalAbierto: false,
        dirty: true,
        mensaje: "Modelo creado desde asistente",
      }));
      return;
    }
    const pestana = crearPestanaDesdeModelo(modelo, {
      modeloId: null,
      nombre: "Modelo",
      cargadoDesde: "asistente",
      dirty: true,
    });
    activarPestanaNueva(set, get, pestana, "Modelo creado desde asistente");
    set({ asistente: null, menuPrincipalAbierto: false });
  },

  /**
   * Ronda 23 L3 #7: precarga el fixture canónico de bienvenida cuando el
   * primer paint detecta usuario nuevo (sin recientes, sin contenido). La
   * pestaña activa reemplazable se sustituye por el fixture y se etiqueta
   * con `cargadoDesde: "bienvenida"` — flag derivado que el banner consume
   * para distinguirse del estado "modelo recién guardado".
   *
   * Si no hay fixture con ese nombre o la pestaña no es reemplazable, el
   * caller mantiene su estado original (no-op silencioso).
   */
  precargarBienvenida(nombreFixture) {
    const modelo = crearFixturePorNombre(nombreFixture);
    if (!modelo) {
      set({ mensaje: `Fixture no encontrado: ${nombreFixture}` });
      return;
    }
    const actualPestana = get().pestanasAbiertas.find((pestana) => pestana.id === get().pestanaActivaId);
    if (!actualPestana || !pestanaReemplazable(actualPestana)) return;

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
      pantallaInicioCerrada: false,
      dirty: false,
      mensaje: null,
    }));
    // Re-etiqueta la pestaña activa con `cargadoDesde: "bienvenida"`; la
    // pestaña hereda el modelo recién aplicado a través del slice de
    // pestañas y la marca de origen.
    set((s) => ({
      pestanasAbiertas: s.pestanasAbiertas.map((p) => (
        p.id === s.pestanaActivaId
          ? { ...p, modelo, cargadoDesde: "bienvenida" as const, etiqueta: modelo.nombre, dirty: false }
          : p
      )),
    }));
  },

  // ── L1 ronda 20: tabs por intención del Inspector ────────────────

  cambiarTabInspectorEntidad(tab) {
    set({ tabInspectorEntidadActivo: tab });
  },

  cambiarTabInspectorEnlace(tab) {
    set({ tabInspectorEnlaceActivo: tab });
  },

  // ── L4 ronda 23 (#15): bus focus Nombre ──────────────────────────

  consumirFocusNombre() {
    if (get().solicitarFocusNombre === null) return;
    set({ solicitarFocusNombre: null });
  },
});
