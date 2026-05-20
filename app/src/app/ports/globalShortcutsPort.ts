import type { Id } from "../../modelo/tipos";

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
  enlaceSeleccionId: Id | null;
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

  return [
    registrarAtajo({ combo: "Ctrl+S", ctx: "global", categoria: "archivo", descripcion: "Guardar modelo", descripcionLarga: "Persiste el modelo activo en el workspace local", handler: () => s().guardarLocal() }),
    registrarAtajo({ combo: "Ctrl+K", ctx: "global", categoria: "navegacion", descripcion: "Buscar comandos", descripcionLarga: "Abre este buscador de comandos y atajos", handler: () => s().abrirDialogoComandos() }),
    registrarAtajo({ combo: "Ctrl+F", ctx: "canvas", categoria: "navegacion", descripcion: "Buscar cosas en el modelo", descripcionLarga: "Busca objetos y procesos por nombre en el modelo activo", handler: () => s().abrirBusquedaCosas() }),
    registrarAtajo({ combo: "Ctrl+Shift+F", ctx: "global", categoria: "navegacion", descripcion: "Buscar en el workspace", descripcionLarga: "Busca en todos los modelos guardados del workspace", handler: () => s().abrirDialogoBuscarGlobal() }),
    registrarAtajo({ combo: "Ctrl+D", ctx: "global", categoria: "navegacion", descripcion: "Abrir gestión del árbol OPD", descripcionLarga: "Gestiona la jerarquía completa de OPDs en panel lateral", handler: () => s().abrirGestionArbol() }),
    registrarAtajo({ combo: "Ctrl+Z", ctx: "global", categoria: "edicion", descripcion: "Deshacer", descripcionLarga: "Revierte el último cambio en el modelo activo", handler: () => s().deshacer() }),
    registrarAtajo({ combo: "Ctrl+Y", ctx: "global", categoria: "edicion", descripcion: "Rehacer", descripcionLarga: "Reaplica el último cambio deshecho", handler: () => s().rehacer() }),
    registrarAtajo({ combo: "Ctrl+Shift+Z", ctx: "global", categoria: "edicion", descripcion: "Rehacer", descripcionLarga: "Reaplica el último cambio deshecho", handler: () => s().rehacer() }),
    registrarAtajo({ combo: "Ctrl+A", ctx: "canvas", categoria: "seleccion", descripcion: "Seleccionar todo en el OPD activo", handler: () => s().seleccionarTodoEnOpd() }),
    registrarAtajo({ combo: "Ctrl+C", ctx: "canvas", categoria: "seleccion", descripcion: "Copiar selección visual", handler: () => s().copiarSeleccionAlBuffer() }),
    registrarAtajo({ combo: "Ctrl+V", ctx: "canvas", categoria: "seleccion", descripcion: "Pegar selección visual", handler: () => s().pegarBufferEnOpdActivo() }),
    registrarAtajo({ combo: "Delete", ctx: "canvas", categoria: "seleccion", descripcion: "Eliminar selección", handler: () => s().eliminarSeleccion() }),
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
    registrarAtajo({ combo: "Ctrl+B", ctx: "global", categoria: "vista", descripcion: "Abrir/cerrar biblioteca dock", descripcionLarga: "Muestra u oculta la biblioteca lateral de plantillas y formas", handler: () => s().toggleBibliotecaDock() }),
  ];
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
