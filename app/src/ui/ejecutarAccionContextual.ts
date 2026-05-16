import { store } from "../store";
import type { AccionContextualId, ActionEvent } from "../store/acciones-contextuales";
import { primerEnlaceVisualDeEntidad } from "./BarraHerramientasElemento";

interface OpcionesEjecucionAccionContextual {
  onEditarAlias?: () => void;
}

export function ejecutarAccionContextualEntidad(
  accionId: AccionContextualId,
  opciones: OpcionesEjecucionAccionContextual = {},
): ActionEvent {
  const state = store.getState();
  const entidad = state.seleccionId ? state.modelo.entidades[state.seleccionId] ?? null : null;
  const enlaceEstiloId = entidad ? primerEnlaceVisualDeEntidad(state.modelo, state.opdActivoId, entidad.id) : null;

  switch (accionId) {
    case "cambiar-tipo-enlace":
      return excepcional(accionId, "La acción se resuelve desde el Inspector de enlace.");
    case "copiar-estilo":
      if (!enlaceEstiloId) return excepcional(accionId, "No hay enlace visual disponible para copiar formato.");
      state.copiarEstiloEnlaceAlPortapapeles(enlaceEstiloId);
      return normal(accionId);
    case "pegar-estilo":
      if (!enlaceEstiloId) return excepcional(accionId, "No hay enlace visual disponible para pegar formato.");
      state.pegarEstiloEnlaceDesdePortapapeles(enlaceEstiloId);
      return normal(accionId);
    case "agregar-estado":
      if (entidad?.tipo !== "objeto") return excepcional(accionId, "Agregar estado requiere un objeto seleccionado.");
      state.agregarEstadoSmart();
      return normal(accionId);
    case "inzoom":
      if (!entidad) return excepcional(accionId, "Inzoom requiere una cosa seleccionada.");
      state.descomponerSeleccionada();
      return normal(accionId);
    case "unfold":
      if (!entidad) return excepcional(accionId, "Unfold requiere una cosa seleccionada.");
      state.desplegarSeleccionada();
      return normal(accionId);
    case "quitar-descomposicion":
      if (!entidad?.refinamientos?.descomposicion) return excepcional(accionId, "La cosa seleccionada no tiene inzoom.");
      state.quitarDescomposicionSeleccionada();
      return normal(accionId);
    case "quitar-despliegue":
      if (!entidad?.refinamientos?.despliegue) return excepcional(accionId, "La cosa seleccionada no tiene despliegue.");
      state.quitarDespliegueSeleccionado();
      return normal(accionId);
    case "editar-alias":
      if (!entidad) return excepcional(accionId, "Editar alias requiere una cosa seleccionada.");
      opciones.onEditarAlias?.();
      return normal(accionId);
    case "editar-imagen":
      if (entidad?.tipo !== "objeto") return excepcional(accionId, "Editar imagen requiere un objeto seleccionado.");
      state.abrirModalImagen(entidad.id);
      return normal(accionId);
    case "eliminar-seleccion":
      if (state.seleccionados.length === 0 && !state.seleccionId && !state.enlaceSeleccionId) return excepcional(accionId, "No hay selección para eliminar.");
      state.eliminarSeleccion();
      return normal(accionId);
    case "agregar-como-partes": {
      if (state.seleccionados.length < 2) return excepcional(accionId, "Agregar como partes requiere multiselección.");
      const todo = state.seleccionados[state.seleccionados.length - 1];
      if (!todo) return excepcional(accionId, "No se pudo resolver el todo de la multiselección.");
      state.conectarSeleccionAlTodo(todo, "agregacion");
      return normal(accionId);
    }
    case "alinear-seleccion":
      if (state.seleccionados.length < 2) return excepcional(accionId, "Alinear requiere multiselección.");
      state.alinearSeleccion("izq");
      return normal(accionId);
    case "distribuir-seleccion":
      if (state.seleccionados.length < 2) return excepcional(accionId, "Distribuir requiere multiselección.");
      state.distribuirSeleccion("horizontal");
      return normal(accionId);
    case "traer-conectados":
      if (!entidad) return excepcional(accionId, "Traer conectados requiere una cosa seleccionada.");
      state.abrirDialogoTraerConectados();
      return normal(accionId);
    case "traer-conectados-default":
      if (!entidad) return excepcional(accionId, "Traer conectados requiere una cosa seleccionada.");
      state.traerConectadosSeleccionado();
      return normal(accionId);
    case "traer-enlaces":
      if (state.seleccionados.length < 2) return excepcional(accionId, "Traer enlaces requiere multiselección.");
      state.traerEnlacesEntreSeleccionadas();
      return normal(accionId);
    case "ocultar-apariencia":
      if (!entidad) return excepcional(accionId, "Ocultar apariencia requiere una cosa seleccionada.");
      state.ocultarAparienciaSeleccionada();
      return normal(accionId);
    case "mas-opciones":
      return excepcional(accionId, "Más opciones se resuelve en la superficie que la invoca.");
  }
}

function normal(actionId: AccionContextualId): ActionEvent {
  return { actionId, kind: "normal" };
}

function excepcional(actionId: AccionContextualId, reason: string): ActionEvent {
  return { actionId, kind: "exceptional", reason };
}
