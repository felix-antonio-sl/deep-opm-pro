import { estadosDeEntidad } from "../modelo/operaciones/estados";
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
      if (estadosDeEntidad(state.modelo, entidad.id).length < 2) state.agregarEstadosObjeto();
      else state.agregarEstadoObjeto();
      return true;
    case "inzoom":
      if (!entidad) return false;
      state.descomponerSeleccionada();
      return true;
    case "unfold":
      if (!entidad) return false;
      state.desplegarSeleccionada();
      return true;
    case "editar-alias":
      if (!entidad) return false;
      opciones.onEditarAlias?.();
      return true;
    case "editar-imagen":
      if (entidad?.tipo !== "objeto") return false;
      state.abrirModalImagen(entidad.id);
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
