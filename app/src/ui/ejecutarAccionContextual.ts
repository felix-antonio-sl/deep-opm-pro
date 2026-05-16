import { store } from "../store";
import type { AccionContextualId } from "../store/acciones-contextuales";
import { primerEnlaceVisualDeEntidad } from "./BarraHerramientasElemento";

interface OpcionesEjecucionAccionContextual {
  onEditarAlias?: () => void;
}

export function ejecutarAccionContextualEntidad(
  accionId: AccionContextualId,
  opciones: OpcionesEjecucionAccionContextual = {},
): boolean {
  const state = store.getState();
  const entidad = state.seleccionId ? state.modelo.entidades[state.seleccionId] ?? null : null;
  const enlaceEstiloId = entidad ? primerEnlaceVisualDeEntidad(state.modelo, state.opdActivoId, entidad.id) : null;

  switch (accionId) {
    case "cambiar-tipo-enlace":
      return false;
    case "copiar-estilo":
      if (!enlaceEstiloId) return false;
      state.copiarEstiloEnlaceAlPortapapeles(enlaceEstiloId);
      return true;
    case "pegar-estilo":
      if (!enlaceEstiloId) return false;
      state.pegarEstiloEnlaceDesdePortapapeles(enlaceEstiloId);
      return true;
    case "agregar-estado":
      if (entidad?.tipo !== "objeto") return false;
      state.agregarEstadoSmart();
      return true;
    case "inzoom":
      if (!entidad) return false;
      state.descomponerSeleccionada();
      return true;
    case "unfold":
      if (!entidad) return false;
      state.desplegarSeleccionada();
      return true;
    case "quitar-descomposicion":
      if (!entidad?.refinamientos?.descomposicion) return false;
      state.quitarDescomposicionSeleccionada();
      return true;
    case "quitar-despliegue":
      if (!entidad?.refinamientos?.despliegue) return false;
      state.quitarDespliegueSeleccionado();
      return true;
    case "editar-alias":
      if (!entidad) return false;
      opciones.onEditarAlias?.();
      return true;
    case "editar-imagen":
      if (entidad?.tipo !== "objeto") return false;
      state.abrirModalImagen(entidad.id);
      return true;
    case "eliminar-seleccion":
      if (state.seleccionados.length === 0 && !state.seleccionId && !state.enlaceSeleccionId) return false;
      state.eliminarSeleccion();
      return true;
    case "agregar-como-partes": {
      if (state.seleccionados.length < 2) return false;
      const todo = state.seleccionados[state.seleccionados.length - 1];
      if (!todo) return false;
      state.conectarSeleccionAlTodo(todo, "agregacion");
      return true;
    }
    case "alinear-seleccion":
      if (state.seleccionados.length < 2) return false;
      state.alinearSeleccion("izq");
      return true;
    case "distribuir-seleccion":
      if (state.seleccionados.length < 2) return false;
      state.distribuirSeleccion("horizontal");
      return true;
    case "traer-conectados":
      if (!entidad) return false;
      state.abrirDialogoTraerConectados();
      return true;
    case "traer-conectados-default":
      if (!entidad) return false;
      state.traerConectadosSeleccionado();
      return true;
    case "traer-enlaces":
      if (state.seleccionados.length < 2) return false;
      state.traerEnlacesEntreSeleccionadas();
      return true;
    case "ocultar-apariencia":
      if (!entidad) return false;
      state.ocultarAparienciaSeleccionada();
      return true;
    case "mas-opciones":
      return false;
  }
}
