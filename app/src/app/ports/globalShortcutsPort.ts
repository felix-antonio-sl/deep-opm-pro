import { tipoInicialConexionDesdeEntidad } from "../../canvas/modoEnlace";
import type { Id, Modelo, TipoEnlace } from "../../modelo/tipos";
import { construirArbol } from "../../ui/arbol/togglesArbol";
import { APP_FEATURES } from "../features";

export interface ShortcutRegistration {
  combo: string;
  handler: (event: KeyboardEvent) => void;
  ctx: "global" | "canvas";
  etiqueta?: string;
  descripcion: string;
  descripcionLarga?: string;
  categoria: "navegacion" | "edicion" | "archivo" | "vista" | "seleccion";
  preventDefault?: boolean;
}

export type ShortcutRegistrar = (registro: ShortcutRegistration) => () => void;

export interface GlobalShortcutsSnapshot {
  /**
   * Ronda Codex v2 L5: navegación directa por número (⌘/Ctrl+1..9). El
   * snapshot ya expone el store completo; tipamos `modelo`, `opdActivoId` y
   * `cambiarOpdActivo` para resolver el OPD destino por índice del árbol.
   */
  modelo: Modelo;
  opdActivoId: Id;
  cambiarOpdActivo: (id: Id) => void;
  enlaceSeleccionId: Id | null;
  /**
   * Línea D (BUG-20260525T052239Z-445a97): atajos de creación con canvas
   * activo. `seleccionId` es la entidad seleccionada (guard de S y origen de
   * R). Las cuatro acciones reutilizan las mismas operaciones que la toolbar
   * ("Objeto"/"Proceso"), el Inspector ("Agregar estado") y el modo enlace.
   */
  seleccionId: Id | null;
  crearObjetoDemo: () => void;
  crearProcesoDemo: () => void;
  agregarEstadoSmart: () => void;
  elegirTipoEnlace: (tipo: TipoEnlace, origenId?: Id) => void;
  /**
   * Paquete "Estados ciudadanos de primera clase" (2026-05-23): tercer
   * ciudadano del coproducto. Guard para atajos F2/D/T del estado.
   */
  estadoSeleccionId: Id | null;
  abrirModalDuracionEstadoSeleccionado: () => void;
  seleccionados: Id[];
  nuevaCosaPendiente: unknown | null;
  dialogoComandosAbierto: boolean;
  cheatsheetAtajosAbierto: boolean;
  gestionArbolAbierta: boolean;
  dialogoGuardarComoAbierto: boolean;
  dialogoConfiguracionAbierto: boolean;
  dialogoImportarExportarJsonAbierto: boolean;
  dialogoCargarModeloAbierto: boolean;
  dialogoBuscarGlobalAbierto: boolean;
  dialogoVersionesAbierto: unknown | null;
  modalImagenAbierto: unknown | null;
  modalUrlsAbierto: unknown | null;
  modalDuracionAbierto: unknown | null;
  asistente: unknown | null;
  busquedaCosasAbierta: boolean;
  menuPrincipalAbierto: boolean;
  modoEnlace: unknown | null;
  pestanasAbiertas?: Array<{ id: string }>;
  pestanaActivaId?: string | null;
  abrirDialogoTraerConectados: () => void;
  ocultarAparienciaSeleccionada: () => void;
  copiarEstiloEnlaceAlPortapapeles: (enlaceId: Id) => void;
  pegarEstiloEnlaceDesdePortapapeles: (enlaceId: Id) => void;
  conectarSeleccionAlTodo: (todoId: Id, tipo: "agregacion") => void;
  descartarNuevaCosaPendiente: () => void;
  cerrarDialogoComandos: () => void;
  cerrarCheatsheetAtajos: () => void;
  cerrarGestionArbol: () => void;
  cerrarGuardarComo: () => void;
  cerrarDialogoConfiguracion: () => void;
  cerrarDialogoImportarExportarJson: () => void;
  cerrarCargarModelo: () => void;
  cerrarDialogoBuscarGlobal: () => void;
  cerrarDialogoVersiones: () => void;
  cerrarModalImagen: () => void;
  cerrarModalUrls: () => void;
  cerrarModalDuracion: () => void;
  cancelarAsistente: () => void;
  cerrarBusquedaCosas: () => void;
  cerrarMenuPrincipal: () => void;
  cancelarEnlace: () => void;
  vaciarSeleccion: () => void;
  guardarLocal: () => void;
  abrirDialogoComandos: () => void;
  abrirBusquedaCosas: () => void;
  abrirDialogoBuscarGlobal: () => void;
  abrirGestionArbol: () => void;
  deshacer: () => void;
  rehacer: () => void;
  seleccionarTodoEnOpd: () => void;
  copiarSeleccionAlBuffer: () => void;
  pegarBufferEnOpdActivo: () => void;
  eliminarSeleccion: () => void;
  nudgeSeleccion: (dx: number, dy: number) => void;
  navegarOpdArriba: () => void;
  navegarOpdAbajo: () => void;
  navegarOpdIzquierda: () => void;
  navegarOpdDerecha: () => void;
  descomponerSeleccionada: () => void;
  desplegarSeleccionada: () => void;
  abrirPestanaNueva?: () => void;
  cerrarPestana?: (id: string) => void;
  cambiarPestanaActiva?: (id: string) => void;
  toggleBibliotecaDock: () => void;
  /**
   * Paquete simulación B0.028: guard para atajo Espacio play/pausa.
   * `simulacionActiva` es true cuando `contextoSimulacion !== null`.
   */
  simulacionActiva: boolean;
  autoAvanceSimulacionActivo: boolean;
  iniciarAutoAvanceSimulacion: () => void;
  pausarAutoAvanceSimulacion: () => void;
  /**
   * Preferencia de usuario `indice.preferenciasUi.oplMinimizado` (no el efectivo
   * por selección). Lee el estado plegado para el toggle `Ctrl+.` (05-interactions §1).
   */
  oplMarginaliaMinimizada: boolean;
  minimizarOpl: () => void;
  restaurarOpl: () => void;
}

export interface GlobalShortcutsPort {
  vistaMapaActiva: () => boolean;
  snapshot: () => GlobalShortcutsSnapshot;
}

export function registrarAtajosAplicacion(port: GlobalShortcutsPort, registrarAtajo: ShortcutRegistrar): Array<() => void> {
  const s = () => port.snapshot();
  const abrirTraerConectados = () => s().abrirDialogoTraerConectados();
  const ocultarApariencia = () => s().ocultarAparienciaSeleccionada();
  const copiarEstiloEnlace = () => {
    const state = s();
    if (state.enlaceSeleccionId) state.copiarEstiloEnlaceAlPortapapeles(state.enlaceSeleccionId);
  };
  const pegarEstiloEnlace = () => {
    const state = s();
    if (state.enlaceSeleccionId) state.pegarEstiloEnlaceDesdePortapapeles(state.enlaceSeleccionId);
  };
  const conectarMultiAlTodo = () => {
    const state = s();
    const todo = state.seleccionados.length >= 2 ? state.seleccionados[state.seleccionados.length - 1] : null;
    if (todo) state.conectarSeleccionAlTodo(todo, "agregacion");
  };
  // Línea D (BUG-20260525T052239Z-445a97): atajos de creación con canvas
  // activo, cableados a las mismas operaciones que toolbar/Inspector/enlace.
  // O → objeto; P → proceso; S → estado en el objeto seleccionado (guard);
  // R → modo relación desde el origen seleccionado (tipo inicial sugerido).
  const crearObjetoAtajo = () => s().crearObjetoDemo();
  const crearProcesoAtajo = () => s().crearProcesoDemo();
  const agregarEstadoAtajo = () => {
    const state = s();
    if (!state.seleccionId) return;
    if (!state.modelo.entidades[state.seleccionId]) return;
    state.agregarEstadoSmart();
  };
  const iniciarRelacionAtajo = () => {
    const state = s();
    const origenId = state.seleccionId;
    if (!origenId || !state.modelo.entidades[origenId]) return;
    const tipo = tipoInicialConexionDesdeEntidad(state.modelo, state.opdActivoId, origenId);
    state.elegirTipoEnlace(tipo, origenId);
  };
  const toggleMarginaliaOpl = () => {
    const state = s();
    if (state.oplMarginaliaMinimizada) state.restaurarOpl();
    else state.minimizarOpl();
  };
  const togglePlaySimulacion = (e: KeyboardEvent) => {
    const state = s();
    if (!state.simulacionActiva) return;
    e.preventDefault();
    if (state.autoAvanceSimulacionActivo) state.pausarAutoAvanceSimulacion();
    else state.iniciarAutoAvanceSimulacion();
  };
  // Ronda Codex v2 L5: ⌘/Ctrl+1 → SD raíz; ⌘/Ctrl+2..9 → SDN siguientes en el
  // orden de despliegue del árbol OPD (mismo orden que muestra `ArbolOpd`).
  const navegarAOpdPorIndice = (indice: number) => () => {
    const state = s();
    const ordenados = opdsEnOrdenDeArbol(state.modelo);
    const destino = ordenados[indice];
    if (destino && destino !== state.opdActivoId) state.cambiarOpdActivo(destino);
  };
  const cerrarModalSuperiorOVaciarSeleccion = () => {
    const state = s();
    if (state.nuevaCosaPendiente) return state.descartarNuevaCosaPendiente();
    if (state.dialogoComandosAbierto) return state.cerrarDialogoComandos();
    if (state.cheatsheetAtajosAbierto) return state.cerrarCheatsheetAtajos();
    if (state.gestionArbolAbierta) return state.cerrarGestionArbol();
    if (state.dialogoGuardarComoAbierto) return state.cerrarGuardarComo();
    if (state.dialogoConfiguracionAbierto) return state.cerrarDialogoConfiguracion();
    if (state.dialogoImportarExportarJsonAbierto) return state.cerrarDialogoImportarExportarJson();
    if (state.dialogoCargarModeloAbierto) return state.cerrarCargarModelo();
    if (state.dialogoBuscarGlobalAbierto) return state.cerrarDialogoBuscarGlobal();
    if (state.dialogoVersionesAbierto) return state.cerrarDialogoVersiones();
    if (state.modalImagenAbierto) return state.cerrarModalImagen();
    if (state.modalUrlsAbierto) return state.cerrarModalUrls();
    if (state.modalDuracionAbierto) return state.cerrarModalDuracion();
    if (state.asistente) return state.cancelarAsistente();
    if (state.busquedaCosasAbierta) return state.cerrarBusquedaCosas();
    if (state.menuPrincipalAbierto) return state.cerrarMenuPrincipal();
    if (state.modoEnlace) return state.cancelarEnlace();
    return state.vaciarSeleccion();
  };

  const registrosBase = [
    registrarAtajo({ combo: "Ctrl+S", ctx: "global", categoria: "archivo", descripcion: "Guardar modelo", descripcionLarga: "Persiste el modelo activo en el workspace local", handler: () => s().guardarLocal() }),
    registrarAtajo({ combo: "Ctrl+K", ctx: "global", categoria: "navegacion", descripcion: "Buscar comandos", descripcionLarga: "Abre este buscador de comandos y atajos", handler: () => s().abrirDialogoComandos() }),
    registrarAtajo({ combo: "Ctrl+.", ctx: "global", categoria: "vista", descripcion: "Mostrar/ocultar marginalia OPL", descripcionLarga: "Pliega o despliega la columna derecha de marginalia OPL", handler: toggleMarginaliaOpl }),
    registrarAtajo({ combo: "Ctrl+F", ctx: "canvas", categoria: "navegacion", descripcion: "Buscar cosas en el modelo", descripcionLarga: "Busca objetos y procesos por nombre en el modelo activo", handler: () => s().abrirBusquedaCosas() }),
    registrarAtajo({ combo: "Ctrl+Shift+F", ctx: "global", categoria: "navegacion", descripcion: "Buscar en el workspace", descripcionLarga: "Busca en todos los modelos guardados del workspace", handler: () => s().abrirDialogoBuscarGlobal() }),
    registrarAtajo({ combo: "Ctrl+D", ctx: "global", categoria: "navegacion", descripcion: "Abrir gestión del árbol OPD", descripcionLarga: "Gestiona la jerarquía completa de OPDs en panel lateral", handler: () => s().abrirGestionArbol() }),
    registrarAtajo({ combo: "Ctrl+Z", ctx: "global", categoria: "edicion", descripcion: "Deshacer", descripcionLarga: "Revierte el último cambio en el modelo activo", handler: () => s().deshacer() }),
    registrarAtajo({ combo: "Ctrl+Y", ctx: "global", categoria: "edicion", descripcion: "Rehacer", descripcionLarga: "Reaplica el último cambio deshecho", handler: () => s().rehacer() }),
    registrarAtajo({ combo: "Ctrl+Shift+Z", ctx: "global", categoria: "edicion", descripcion: "Rehacer", descripcionLarga: "Reaplica el último cambio deshecho", handler: () => s().rehacer() }),
    // Línea D (BUG-20260525T052239Z-445a97): leyenda del footer-key
    // "O objeto · P proceso · S estado · R relación · ⌘K comandos". Cuatro
    // teclas simples en contexto canvas. El registry ya excluye inputs/textarea/
    // contenteditable (`esEditable`) y diálogos modales (`hayDialogoModalAbierto`).
    registrarAtajo({ combo: "O", ctx: "canvas", categoria: "edicion", descripcion: "Crear objeto", descripcionLarga: "Inserta un objeto nuevo en el OPD activo (misma acción que el botón Objeto)", handler: crearObjetoAtajo }),
    registrarAtajo({ combo: "P", ctx: "canvas", categoria: "edicion", descripcion: "Crear proceso", descripcionLarga: "Inserta un proceso nuevo en el OPD activo (misma acción que el botón Proceso)", handler: crearProcesoAtajo }),
    registrarAtajo({ combo: "S", ctx: "canvas", categoria: "edicion", descripcion: "Agregar estado al objeto seleccionado", descripcionLarga: "Agrega un estado al objeto seleccionado (no actúa sin objeto en selección)", handler: agregarEstadoAtajo }),
    registrarAtajo({ combo: "R", ctx: "canvas", categoria: "edicion", descripcion: "Iniciar relación desde lo seleccionado", descripcionLarga: "Activa el modo enlace con el tipo sugerido desde la cosa seleccionada como origen", handler: iniciarRelacionAtajo }),
    registrarAtajo({ combo: "Ctrl+A", ctx: "canvas", categoria: "seleccion", descripcion: "Seleccionar todo en el OPD activo", handler: () => s().seleccionarTodoEnOpd() }),
    registrarAtajo({ combo: "Ctrl+C", ctx: "canvas", categoria: "seleccion", descripcion: "Copiar selección visual", handler: () => s().copiarSeleccionAlBuffer() }),
    registrarAtajo({ combo: "Ctrl+V", ctx: "canvas", categoria: "seleccion", descripcion: "Pegar selección visual", handler: () => s().pegarBufferEnOpdActivo() }),
    registrarAtajo({ combo: "Delete", ctx: "canvas", categoria: "seleccion", descripcion: "Eliminar selección", handler: () => s().eliminarSeleccion() }),
    // Paquete "Estados ciudadanos de primera clase" (2026-05-23).
    // El guard `estadoSeleccionId !== null` viene del invariante sellado:
    // cuando hay estado seleccionado no hay entidad ni enlace seleccionado,
    // así que F2/D/T no colisionan con sus equivalentes de entidad/enlace.
    // F2 sobre canvas dispara el rename inline vía evento custom que escucha
    // `HaloEstado`. D abre popover de designación del halo. T abre modal
    // duración. Esc cae al handler existente (cerrarModalSuperiorOVaciarSeleccion).
    registrarAtajo({
      combo: "F2",
      ctx: "canvas",
      categoria: "edicion",
      descripcion: "Renombrar estado seleccionado",
      handler: () => {
        if (!s().estadoSeleccionId) return;
        window.dispatchEvent(new CustomEvent("opm:halo-estado-rename"));
      },
    }),
    registrarAtajo({
      combo: "D",
      ctx: "canvas",
      categoria: "edicion",
      descripcion: "Abrir popover de designación del estado seleccionado",
      handler: () => {
        if (!s().estadoSeleccionId) return;
        window.dispatchEvent(new CustomEvent("opm:halo-estado-popover-designar"));
      },
    }),
    registrarAtajo({
      combo: "T",
      ctx: "canvas",
      categoria: "edicion",
      descripcion: "Editar duración del estado seleccionado",
      handler: () => {
        const state = s();
        if (state.estadoSeleccionId) state.abrirModalDuracionEstadoSeleccionado();
      },
    }),
    registrarAtajo({ combo: "Ctrl+Shift+T", ctx: "canvas", categoria: "edicion", descripcion: "Traer conectados de la cosa seleccionada", handler: abrirTraerConectados }),
    registrarAtajo({ combo: "Ctrl+H", ctx: "canvas", categoria: "vista", descripcion: "Ocultar apariencia seleccionada", handler: ocultarApariencia }),
    registrarAtajo({ combo: "Ctrl+Alt+C", ctx: "canvas", categoria: "edicion", descripcion: "Copiar estilo del enlace seleccionado", handler: copiarEstiloEnlace }),
    registrarAtajo({ combo: "Ctrl+Alt+V", ctx: "canvas", categoria: "edicion", descripcion: "Pegar estilo al enlace seleccionado", handler: pegarEstiloEnlace }),
    registrarAtajo({
      combo: "Ctrl+Alt+T",
      ctx: "canvas",
      categoria: "edicion",
      etiqueta: "Agregar selección como partes...",
      descripcion: "Agregar selección como partes...",
      descripcionLarga: "Crea enlaces de agregación desde N-1 cosas hacia la última seleccionada",
      handler: conectarMultiAlTodo,
    }),
    registrarAtajo({ combo: "Escape", ctx: "global", categoria: "seleccion", descripcion: "Cerrar modal superior o vaciar selección", descripcionLarga: "Cierra el diálogo activo o quita la selección actual del canvas", handler: cerrarModalSuperiorOVaciarSeleccion }),
    registrarAtajo({ combo: "ArrowUp", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 1 px hacia arriba", handler: () => s().nudgeSeleccion(0, -1) }),
    registrarAtajo({ combo: "ArrowDown", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 1 px hacia abajo", handler: () => s().nudgeSeleccion(0, 1) }),
    registrarAtajo({ combo: "ArrowLeft", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 1 px a la izquierda", handler: () => s().nudgeSeleccion(-1, 0) }),
    registrarAtajo({ combo: "ArrowRight", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 1 px a la derecha", handler: () => s().nudgeSeleccion(1, 0) }),
    registrarAtajo({ combo: "Shift+ArrowUp", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 10 px hacia arriba", handler: () => s().nudgeSeleccion(0, -10) }),
    registrarAtajo({ combo: "Shift+ArrowDown", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 10 px hacia abajo", handler: () => s().nudgeSeleccion(0, 10) }),
    registrarAtajo({ combo: "Shift+ArrowLeft", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 10 px a la izquierda", handler: () => s().nudgeSeleccion(-10, 0) }),
    registrarAtajo({ combo: "Shift+ArrowRight", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 10 px a la derecha", handler: () => s().nudgeSeleccion(10, 0) }),
    registrarAtajo({ combo: "Ctrl+ArrowUp", ctx: "global", categoria: "navegacion", descripcion: "Ir al OPD hermano anterior", handler: () => s().navegarOpdArriba() }),
    registrarAtajo({ combo: "Ctrl+ArrowDown", ctx: "global", categoria: "navegacion", descripcion: "Ir al OPD hermano siguiente", handler: () => s().navegarOpdAbajo() }),
    registrarAtajo({ combo: "Ctrl+ArrowLeft", ctx: "global", categoria: "navegacion", descripcion: "Ir al OPD padre", handler: () => s().navegarOpdIzquierda() }),
    registrarAtajo({ combo: "Ctrl+ArrowRight", ctx: "global", categoria: "navegacion", descripcion: "Ir al primer OPD hijo", handler: () => s().navegarOpdDerecha() }),
    // Ronda Codex v2 L5 (05-interactions §1 navegación, §9 NAVEGAR): salto
    // directo por número. ⌘1 = SD raíz; ⌘2..9 = SDN en orden del árbol.
    registrarAtajo({ combo: "Ctrl+1", ctx: "global", categoria: "navegacion", descripcion: "Ir al SD raíz", descripcionLarga: "Activa el diagrama raíz (SD) del modelo", handler: navegarAOpdPorIndice(0) }),
    registrarAtajo({ combo: "Ctrl+2", ctx: "global", categoria: "navegacion", descripcion: "Ir al 2.º OPD del árbol", descripcionLarga: "Activa el segundo OPD en orden del árbol", handler: navegarAOpdPorIndice(1) }),
    registrarAtajo({ combo: "Ctrl+3", ctx: "global", categoria: "navegacion", descripcion: "Ir al 3.º OPD del árbol", descripcionLarga: "Activa el tercer OPD en orden del árbol", handler: navegarAOpdPorIndice(2) }),
    registrarAtajo({ combo: "Ctrl+4", ctx: "global", categoria: "navegacion", descripcion: "Ir al 4.º OPD del árbol", descripcionLarga: "Activa el cuarto OPD en orden del árbol", handler: navegarAOpdPorIndice(3) }),
    registrarAtajo({ combo: "Ctrl+5", ctx: "global", categoria: "navegacion", descripcion: "Ir al 5.º OPD del árbol", descripcionLarga: "Activa el quinto OPD en orden del árbol", handler: navegarAOpdPorIndice(4) }),
    registrarAtajo({ combo: "Ctrl+6", ctx: "global", categoria: "navegacion", descripcion: "Ir al 6.º OPD del árbol", descripcionLarga: "Activa el sexto OPD en orden del árbol", handler: navegarAOpdPorIndice(5) }),
    registrarAtajo({ combo: "Ctrl+7", ctx: "global", categoria: "navegacion", descripcion: "Ir al 7.º OPD del árbol", descripcionLarga: "Activa el séptimo OPD en orden del árbol", handler: navegarAOpdPorIndice(6) }),
    registrarAtajo({ combo: "Ctrl+8", ctx: "global", categoria: "navegacion", descripcion: "Ir al 8.º OPD del árbol", descripcionLarga: "Activa el octavo OPD en orden del árbol", handler: navegarAOpdPorIndice(7) }),
    registrarAtajo({ combo: "Ctrl+9", ctx: "global", categoria: "navegacion", descripcion: "Ir al 9.º OPD del árbol", descripcionLarga: "Activa el noveno OPD en orden del árbol", handler: navegarAOpdPorIndice(8) }),
    registrarAtajo({ combo: "Shift+I", ctx: "canvas", categoria: "edicion", descripcion: "Crear inzoom de la cosa seleccionada", handler: () => s().descomponerSeleccionada() }),
    registrarAtajo({ combo: "Shift+U", ctx: "canvas", categoria: "edicion", descripcion: "Desplegar selección", descripcionLarga: "Crea un OPD desplegado a partir de la cosa seleccionada", handler: () => s().desplegarSeleccionada() }),
    registrarAtajo({ combo: "Ctrl+Shift+C", ctx: "canvas", categoria: "edicion", descripcion: "Copiar formato de enlace seleccionado", handler: copiarEstiloEnlace }),
    registrarAtajo({ combo: "Ctrl+T", ctx: "global", categoria: "navegacion", descripcion: "Abrir pestaña nueva", descripcionLarga: "Duplica el modelo actual en una pestaña adicional para comparar", handler: () => s().abrirPestanaNueva?.() }),
    registrarAtajo({ combo: "Ctrl+W", ctx: "global", categoria: "navegacion", descripcion: "Cerrar pestaña activa", descripcionLarga: "Cierra el modelo abierto en la pestaña en foco", handler: () => {
      const state = s();
      if (state.pestanaActivaId) state.cerrarPestana?.(state.pestanaActivaId);
    } }),
    registrarAtajo({ combo: "Ctrl+Tab", ctx: "global", categoria: "navegacion", descripcion: "Siguiente pestaña", descripcionLarga: "Cambia el foco a la pestaña siguiente del workspace", handler: () => cambiarPestanaRelativa(s, 1) }),
    registrarAtajo({ combo: "Ctrl+Shift+Tab", ctx: "global", categoria: "navegacion", descripcion: "Pestaña anterior", descripcionLarga: "Cambia el foco a la pestaña previa del workspace", handler: () => cambiarPestanaRelativa(s, -1) }),
    registrarAtajo({ combo: "Space", ctx: "global", categoria: "edicion", descripcion: "Reproducir/Pausar simulación", descripcionLarga: "En modo simulación, alterna entre reproducir y pausar", preventDefault: false, handler: togglePlaySimulacion }),
  ];

  if (APP_FEATURES.bibliotecaDock) {
    registrosBase.push(registrarAtajo({ combo: "Ctrl+B", ctx: "global", categoria: "vista", descripcion: "Abrir/cerrar biblioteca dock", descripcionLarga: "Muestra u oculta la biblioteca lateral de plantillas y formas", handler: () => s().toggleBibliotecaDock() }));
  }

  return registrosBase;
}

/**
 * Ronda Codex v2 L5: aplana el árbol OPD a la lista de IDs en orden de
 * despliegue (DFS pre-orden), idéntico al recorrido visual de `ArbolOpd`.
 * El índice 0 es siempre el SD raíz. Exportada para test.
 */
export function opdsEnOrdenDeArbol(modelo: Modelo): Id[] {
  const ids: Id[] = [];
  const visitar = (nodos: ReturnType<typeof construirArbol>): void => {
    for (const nodo of nodos) {
      ids.push(nodo.opd.id);
      visitar(nodo.hijos);
    }
  };
  visitar(construirArbol(modelo));
  return ids;
}

function cambiarPestanaRelativa(snapshot: () => GlobalShortcutsSnapshot, delta: 1 | -1): void {
  const state = snapshot();
  const pestanas = state.pestanasAbiertas ?? [];
  if (pestanas.length === 0) return;
  const actual = pestanas.findIndex((pestana) => pestana.id === state.pestanaActivaId);
  const siguiente = (actual + delta + pestanas.length) % pestanas.length;
  const siguienteId = pestanas[siguiente]?.id;
  if (siguienteId) state.cambiarPestanaActiva?.(siguienteId);
}
