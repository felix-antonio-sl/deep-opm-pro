import { extremoEstado } from "../../modelo/extremos";
import {
  aplicarEstiloApariencia,
  resetearEstiloApariencia,
} from "../../modelo/estilos";
import { formarAbanicoAutomatico } from "../../modelo/abanicos";
import {
  cambiarOrdenPartes as cambiarOrdenPartesOp,
  cambiarModoPlegado as cambiarModoPlegadoOp,
  crearEnlaceConExtremoPlegado,
  extraerParteDePlegado as extraerParteDePlegadoOp,
  extraerTodasLasPartesDePlegado as extraerTodasLasPartesDePlegadoOp,
  reinsertarParteEnPlegado as reinsertarParteEnPlegadoOp,
} from "../../modelo/plegado";
import {
  actualizarPosicionSimboloEstructural as actualizarPosicionSimboloEstructuralOp,
  actualizarVerticesEnlace as actualizarVerticesEnlaceOp,
  actualizarPuertosEnlacesDesdePuntos,
  moverApariencia as moverAparienciaEntidad,
  moverAparienciaPorId,
  quitarPlegadoCompletoEstructural,
  quitarSemiplegadoEstructural,
  renombrarEntidad,
  renombrarEstado,
  traerAgregacionesInzoomFaltantes,
} from "../../modelo/operaciones";
import { renombrarEtiquetaEnlace } from "../../modelo/etiquetasEnlace";
import { anclajesSimboloPorDefecto } from "../../modelo/simboloEstructural";
import { mismaReferencia } from "../../opl/interaccion";
import { generarOpl } from "../../opl/generar";
import { aplicarPatchesOpl, planificarEdicionOplLibre } from "../../opl/parser";
import { cargarPlantilla } from "../../persistencia/plantillas";
import { hidratarModelo } from "../../serializacion/json";
import {
  aparienciaSeleccionadaActiva,
  commitModelo,
  deshacerRuntime,
  escribirIndiceWorkspace,
  enlaceNuevo,
  generarHtmlOpl,
  actualizarPreferenciasUi,
  limitar,
  rehacerRuntime,
  validarSubprocesoTimeline,
  type GetStore,
  type SetStore,
} from "../runtime";
import type { ModeloSlice } from "../tipos";
import {
  alinearPorEje,
  distribuirUniformemente,
  insertarPlantillaBatch,
  ocultarAparienciaBatch,
  traerConectadosBatch,
  traerEnlacesEntreBatch,
} from "../../canvas/operacionesBatch";
import { FAMILIAS_TRAER_DEFAULT, normalizarFamiliasTraer } from "../../canvas/reglasTraer";
import { cuantizarPosicion, normalizarGridConfig, type GridConfig } from "../../canvas/grid";
import { aplicarLayoutSugerido as aplicarLayoutSugeridoOp } from "../../canvas/layoutSugerido";

/**
 * Acciones de canvas: selección (entidad/estado/enlace + multi vía Ctrl/Shift),
 * selección desde OPL, edición OPL inversa (renombrar entidad/estado/etiqueta),
 * filtros y hover OPL, plegado (modo + orden partes + extracción/reinserción),
 * estilo apariencia, mover apariencia y vértices de enlace, copiar/exportar OPL,
 * deshacer/rehacer.
 *
 * L4 plantillas privadas: [Met §8.8], [V-52], [V-123].
 */
export function accionesCanvas(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
    seleccionarEntidad(id) {
      const { modelo, modoEnlace, opdActivoId, nuevaCosaPendiente } = get();
      // P1-5 ronda 4: si el editor inline esta vivo sobre otra entidad,
      // se descarta al cambiar la seleccion. Si seleccionamos la misma
      // entidad pendiente, se preserva (mismo contexto).
      const limpiezaPendiente = nuevaCosaPendiente && nuevaCosaPendiente.entidadId !== id
        ? { nuevaCosaPendiente: null }
        : {};
      if (!modoEnlace) {
        set({ seleccionId: id, seleccionados: [id], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: null, ...limpiezaPendiente });
        return;
      }

      const resultado = crearEnlaceConExtremoPlegado(modelo, opdActivoId, modoEnlace.origenId, id, modoEnlace.tipo);
      if (!resultado.ok) {
        set({ seleccionId: id, seleccionados: [id], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: resultado.error, ...limpiezaPendiente });
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
        // P1-5: al crearse el enlace, salimos del editor inline.
        nuevaCosaPendiente: null,
      });
    },

    seleccionarEstadoComoExtremo(estadoId) {
      const { modelo, modoEnlace, opdActivoId, nuevaCosaPendiente } = get();
      const estado = modelo.estados[estadoId];
      if (!estado) {
        set({ mensaje: `Estado no existe: ${estadoId}` });
        return;
      }
      const limpiezaPendiente = nuevaCosaPendiente && nuevaCosaPendiente.entidadId !== estado.entidadId
        ? { nuevaCosaPendiente: null }
        : {};
      if (!modoEnlace) {
        set({ seleccionId: estado.entidadId, seleccionados: [estado.entidadId], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: null, ...limpiezaPendiente });
        return;
      }

      const resultado = crearEnlaceConExtremoPlegado(modelo, opdActivoId, modoEnlace.origenId, extremoEstado(estadoId), modoEnlace.tipo);
      if (!resultado.ok) {
        set({ seleccionId: estado.entidadId, seleccionados: [estado.entidadId], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: resultado.error, ...limpiezaPendiente });
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
        nuevaCosaPendiente: null,
      });
    },

    seleccionarEnlace(id) {
      const { modelo } = get();
      const enlace = modelo.enlaces[id];
      if (!enlace) {
        set({ mensaje: `Enlace no existe: ${id}` });
        return;
      }
      // P1-5 ronda 4: al pasar a contexto enlace, el editor inline de
      // cualquier entidad se descarta (contextos disjuntos).
      set({ seleccionId: null, seleccionados: [id], modoSeleccion: "simple", enlaceSeleccionId: id, modoEnlace: null, mensaje: null, nuevaCosaPendiente: null });
    },

    seleccionarGrupoEstructural(id, enlaceIds) {
      const { modelo } = get();
      const enlace = modelo.enlaces[id];
      if (!enlace) {
        set({ mensaje: `Enlace no existe: ${id}` });
        return;
      }
      const ids = [id, ...enlaceIds].filter((enlaceId, index, todos) => (
        todos.indexOf(enlaceId) === index && !!modelo.enlaces[enlaceId]
      ));
      set({
        seleccionId: null,
        seleccionados: ids.length > 0 ? ids : [id],
        modoSeleccion: ids.length > 1 ? "multi" : "simple",
        enlaceSeleccionId: id,
        modoEnlace: null,
        mensaje: null,
        nuevaCosaPendiente: null,
      });
    },

    seleccionarDesdeOpl(ref) {
      const { modelo, nuevaCosaPendiente } = get();
      // P1-5 ronda 4: navegacion desde OPL es cambio de contexto explicito
      // pedido por el usuario; el editor inline no debe sobrevivir.
      const entidadDestino = ref.tipo === "entidad" ? ref.id : ref.tipo === "estado" ? modelo.estados[ref.id]?.entidadId : null;
      const limpiezaPendiente = nuevaCosaPendiente && nuevaCosaPendiente.entidadId !== entidadDestino
        ? { nuevaCosaPendiente: null }
        : {};
      if (ref.tipo === "enlace") {
        if (!modelo.enlaces[ref.id]) {
          set({ mensaje: `Enlace no existe: ${ref.id}` });
          return;
        }
        set({ seleccionId: null, seleccionados: [ref.id], modoSeleccion: "simple", enlaceSeleccionId: ref.id, modoEnlace: null, mensaje: null, nuevaCosaPendiente: null });
        return;
      }
      if (ref.tipo === "estado") {
        const estado = modelo.estados[ref.id];
        if (!estado) {
          set({ mensaje: `Estado no existe: ${ref.id}` });
          return;
        }
        set({ seleccionId: estado.entidadId, seleccionados: [estado.entidadId], modoSeleccion: "simple", enlaceSeleccionId: null, modoEnlace: null, mensaje: null, ...limpiezaPendiente });
        return;
      }
      if (!modelo.entidades[ref.id]) {
        set({ mensaje: `Entidad no existe: ${ref.id}` });
        return;
      }
      set({ seleccionId: ref.id, seleccionados: [ref.id], modoSeleccion: "simple", enlaceSeleccionId: null, modoEnlace: null, mensaje: null, ...limpiezaPendiente });
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

    buscarEnPanelOpl(texto) {
      get().fijarBusquedaOpl(texto);
    },

    alternarNumeracionOpl() {
      const estado = get();
      const oplNumeracionVisible = !(estado.indice.preferenciasUi?.oplNumeracionVisible ?? true);
      const indice = actualizarPreferenciasUi(estado.indice, { oplNumeracionVisible });
      escribirIndiceWorkspace(indice);
      set({ indice });
    },

    cambiarPosicionOpl(posicion) {
      const estado = get();
      const actual = estado.indice.preferenciasUi?.oplPosicion ?? "inferior";
      const oplPosicion = posicion ?? (actual === "inferior" ? "lateral-derecho" : "inferior");
      const indice = actualizarPreferenciasUi(estado.indice, { oplPosicion });
      escribirIndiceWorkspace(indice);
      set({ indice });
    },

    minimizarOpl() {
      const estado = get();
      const indice = actualizarPreferenciasUi(estado.indice, { oplMinimizado: true });
      escribirIndiceWorkspace(indice);
      set({ indice });
    },

    restaurarOpl() {
      const estado = get();
      const indice = actualizarPreferenciasUi(estado.indice, { oplMinimizado: false });
      escribirIndiceWorkspace(indice);
      set({ indice });
    },

    alternarBloqueOplContraido(opdId) {
      const estado = get();
      const bloques = { ...(estado.indice.preferenciasUi?.oplBloquesContraidos ?? {}) };
      if (bloques[opdId]) delete bloques[opdId];
      else bloques[opdId] = true;
      const indice = actualizarPreferenciasUi(estado.indice, { oplBloquesContraidos: bloques });
      escribirIndiceWorkspace(indice);
      set({ indice });
    },

    mostrarPlaceholderAiOpl() {
      set({ mensaje: "Próximamente: oraciones generadas por LLM" });
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

    aplicarEdicionOplLibre(texto) {
      const { modelo, opdActivoId } = get();
      const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId });
      const bloqueante = preview.diagnosticos.find((diagnostico) => diagnostico.severidad === "error");
      if (bloqueante) {
        set({ mensaje: `OPL no aplicado: linea ${bloqueante.linea}: ${bloqueante.mensaje}` });
        return;
      }
      if (preview.patches.length === 0) {
        set({ mensaje: "OPL sin cambios aplicables" });
        return;
      }
      const resultado = aplicarPatchesOpl(modelo, preview.patches, opdActivoId);
      if (!resultado.ok) {
        set({ mensaje: `OPL no aplicado: ${resultado.error}` });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: `OPL aplicado: ${preview.patches.length} cambio${preview.patches.length === 1 ? "" : "s"}`,
      });
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
      anchor.download = `${modelo.nombre.replace(/[^a-zA-Z0-9À-ɏ_-]/g, "_")}-opl.html`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      set({ mensaje: null });
    },

    deshacer() {
      deshacerRuntime(set, get);
    },

    rehacer() {
      rehacerRuntime(set, get);
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

    extraerTodasLasPartesSeleccionadas() {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) return;
      const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
        .find((item) => item.entidadId === seleccionId);
      if (!apariencia) {
        set({ mensaje: "La entidad seleccionada no tiene apariencia en el OPD activo" });
        return;
      }
      const resultado = extraerTodasLasPartesDePlegadoOp(modelo, opdActivoId, apariencia.id);
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

    quitarSemiplegadoEstructuralSeleccionado() {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona una entidad semiplegada" });
        return;
      }
      const resultado = quitarSemiplegadoEstructural(modelo, opdActivoId, seleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value.modelo, {
        seleccionId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: resultado.value.agregadas > 0
          ? `Semiplegado estructural quitado: ${resultado.value.agregadas} relaciones`
          : "No hay relaciones estructurales semiplegadas",
      });
    },

    quitarPlegadoCompletoEstructuralSeleccionado() {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona una entidad con plegado estructural" });
        return;
      }
      const resultado = quitarPlegadoCompletoEstructural(modelo, opdActivoId, seleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value.modelo, {
        seleccionId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: resultado.value.agregadas > 0
          ? `Plegado estructural quitado: ${resultado.value.agregadas} relaciones`
          : "No hay relaciones estructurales plegadas",
      });
    },

    traerAgregacionesInzoomFaltantesSeleccionadas() {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona una entidad con in-zoom" });
        return;
      }
      const resultado = traerAgregacionesInzoomFaltantes(modelo, opdActivoId, seleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value.modelo, {
        seleccionId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: resultado.value.agregadas > 0
          ? `Agregaciones de in-zoom traídas: ${resultado.value.agregadas}`
          : "No hay agregaciones de in-zoom faltantes",
      });
    },

    moverEntidad(id, x, y) {
      const { modelo, opdActivoId, dirtyModelo } = get();
      const pos = cuantizarDesdeEstado(get(), x, y);
      const resultado = moverAparienciaEntidad(modelo, opdActivoId, id, pos);
      if (resultado.ok) commitModelo(set, modelo, resultado.value, { dirtyModelo });
    },

    moverApariencia(aparienciaId, x, y) {
      const { modelo, opdActivoId, dirtyModelo } = get();
      const pos = cuantizarDesdeEstado(get(), x, y);
      const resultado = moverAparienciaPorId(modelo, opdActivoId, aparienciaId, pos);
      if (resultado.ok) commitModelo(set, modelo, resultado.value, { dirtyModelo });
    },

    moverAparienciaConPuertos(aparienciaId, x, y, ajustes) {
      const { modelo, opdActivoId, dirtyModelo } = get();
      const pos = cuantizarDesdeEstado(get(), x, y);
      const movido = moverAparienciaPorId(modelo, opdActivoId, aparienciaId, pos);
      if (!movido.ok) {
        set({ mensaje: movido.error });
        return;
      }
      const embellecido = actualizarPuertosEnlacesDesdePuntos(movido.value, opdActivoId, ajustes);
      if (!embellecido.ok) {
        set({ mensaje: embellecido.error });
        return;
      }
      commitModelo(set, modelo, embellecido.value, { dirtyModelo });
    },

    toggleGrid() {
      const estado = get();
      const actual = gridConfigDesdeEstado(estado);
      const gridConfig = { ...actual, activa: !actual.activa };
      const indice = actualizarPreferenciasUi(estado.indice, { gridConfig });
      escribirIndiceWorkspace(indice);
      set({ indice, gridConfig, modelo: { ...estado.modelo } });
    },

    fijarGridConfig(patch) {
      const estado = get();
      const gridConfig = normalizarGridConfig({ ...gridConfigDesdeEstado(estado), ...(patch as Partial<GridConfig>) });
      const indice = actualizarPreferenciasUi(estado.indice, { gridConfig });
      escribirIndiceWorkspace(indice);
      set({ indice, gridConfig, modelo: { ...estado.modelo } });
    },

    alinearSeleccion(eje) {
      const { modelo, opdActivoId, seleccionados } = get();
      const resultado = alinearPorEje(modelo, opdActivoId, seleccionados, eje);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionados: [...seleccionados], mensaje: "Selección alineada" });
    },

    distribuirSeleccion(orientacion) {
      const { modelo, opdActivoId, seleccionados } = get();
      const resultado = distribuirUniformemente(modelo, opdActivoId, seleccionados, orientacion);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionados: [...seleccionados], mensaje: "Selección distribuida" });
    },

    aplicarLayoutSugerido() {
      // Ronda 15 L4: layout sugerido aplicable bajo accion explicita.
      // Undoable atomicamente porque commitModelo crea una sola entrada en
      // el ledger; deshacer revierte el batch entero. No persiste al cargar.
      //
      // P0-5 (informe UI/UX 2026-05-07): incrementa solicitudFitToken para
      // que el canvas haga fit-to-view tras el reordenamiento. Antes el
      // autolayout dejaba elementos fuera del viewport y la accion se
      // sentia incompleta. El fit es secundario al commit (no se confirma
      // si el commit falla) y se observa en JointCanvas via useEffect.
      // P0 ronda 4: dirtyModelo se conserva (layoutSolo), no bloquea carga.
      const { modelo, opdActivoId, seleccionados, solicitudFitToken, dirtyModelo } = get();
      const resultado = aplicarLayoutSugeridoOp(modelo, opdActivoId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      if (resultado.value === modelo) {
        set({ mensaje: "Layout ya esta aplicado" });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionados: [...seleccionados],
        mensaje: "Layout sugerido aplicado",
        solicitudFitToken: solicitudFitToken + 1,
        dirtyModelo,
      });
    },

    reordenarSubprocesoEnTimeline(opdId, aparienciaId, nuevaY) {
      const { modelo, dirtyModelo } = get();
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
        dirtyModelo,
      });
    },

    actualizarVerticesEnlace(aparienciaEnlaceId, vertices) {
      const { modelo, opdActivoId, dirtyModelo } = get();
      const resultado = actualizarVerticesEnlaceOp(modelo, opdActivoId, aparienciaEnlaceId, vertices);
      if (resultado.ok) commitModelo(set, modelo, resultado.value, { dirtyModelo });
    },

    actualizarPosicionSimboloEstructural(aparienciaEnlaceIds, posicion) {
      const { modelo, opdActivoId, dirtyModelo } = get();
      const pos = cuantizarDesdeEstado(get(), posicion.x, posicion.y);
      const anclajes = anclajesSimboloPorDefecto(modelo, opdActivoId, aparienciaEnlaceIds);
      const resultado = actualizarPosicionSimboloEstructuralOp(modelo, opdActivoId, aparienciaEnlaceIds, pos, anclajes);
      if (resultado.ok) commitModelo(set, modelo, resultado.value, { dirtyModelo });
      else set({ mensaje: resultado.error });
    },

    insertarPlantillaEnOpdActivo(plantillaId) {
      const estado = get();
      if (estado.readOnly) {
        set({ mensaje: "Modelo en solo lectura. Usa Guardar como para crear copia editable." });
        return;
      }
      const plantilla = cargarPlantilla(plantillaId);
      if (!plantilla.ok) {
        set({ mensaje: plantilla.error });
        return;
      }
      const fuente = hidratarModelo(plantilla.value.contenido.json);
      if (!fuente.ok) {
        set({ mensaje: fuente.error });
        return;
      }
      const resultado = insertarPlantillaBatch(estado.modelo, estado.opdActivoId, fuente.value, fuente.value.opdRaizId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const idsEntidades = resultado.value.idsNuevos.filter((id) => !!resultado.value.modelo.entidades[id]);
      commitModelo(set, estado.modelo, resultado.value.modelo, {
        seleccionId: idsEntidades[0] ?? null,
        seleccionados: resultado.value.idsNuevos,
        modoSeleccion: resultado.value.idsNuevos.length > 1 ? "multi" : "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        dialogoPlantillasAbierto: false,
        mensaje: `Insertar plantilla: ${resultado.value.entidadesInsertadas} entidades, ${resultado.value.enlacesInsertados} enlaces`,
      });
      get().resaltarTemporalmente(resultado.value.idsNuevos, 3000);
    },

    traerConectadosSeleccionado(familiasInput) {
      const estado = get();
      const { modelo, opdActivoId } = estado;
      const apariencia = aparienciaSeleccionadaParaTraer(modelo, opdActivoId, estado.seleccionId, estado.seleccionados);
      if (!apariencia) {
        set({ mensaje: "Selecciona una cosa visible para traer conectados" });
        return;
      }
      const familias = normalizarFamiliasTraer(familiasInput ?? estado.indice.preferenciasUi?.traerConectadosUltimo ?? FAMILIAS_TRAER_DEFAULT);
      const resultado = traerConectadosBatch(modelo, opdActivoId, apariencia.id, familias);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      if (resultado.value === modelo) {
        set({ mensaje: "Sin cambios", dialogoTraerConectadosAbierto: false });
        return;
      }
      const indice = actualizarPreferenciasUi(estado.indice, { traerConectadosUltimo: [...familias] });
      escribirIndiceWorkspace(indice);
      const antesApariencias = Object.keys(modelo.opds[opdActivoId]?.apariencias ?? {}).length;
      const antesEnlaces = Object.keys(modelo.opds[opdActivoId]?.enlaces ?? {}).length;
      const despuesApariencias = Object.keys(resultado.value.opds[opdActivoId]?.apariencias ?? {}).length;
      const despuesEnlaces = Object.keys(resultado.value.opds[opdActivoId]?.enlaces ?? {}).length;
      commitModelo(set, modelo, resultado.value, {
        indice,
        seleccionId: apariencia.entidadId,
        seleccionados: [apariencia.entidadId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        dialogoTraerConectadosAbierto: false,
        mensaje: `Traer conectados: ${Math.max(0, despuesApariencias - antesApariencias)} cosas, ${Math.max(0, despuesEnlaces - antesEnlaces)} enlaces`,
      });
    },

    traerEnlacesEntreSeleccionadas() {
      const { modelo, opdActivoId, seleccionados } = get();
      if (seleccionados.length < 2) {
        set({ mensaje: "Selecciona al menos dos cosas visibles" });
        return;
      }
      const resultado = traerEnlacesEntreBatch(modelo, opdActivoId, seleccionados);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      if (resultado.value === modelo) {
        set({ mensaje: "Sin cambios" });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionados: [...seleccionados],
        modoSeleccion: seleccionados.length > 1 ? "multi" : "simple",
        mensaje: "Enlaces internos traídos",
      });
    },

    ocultarAparienciaSeleccionada() {
      const { modelo, opdActivoId, seleccionId, seleccionados } = get();
      const apariencia = aparienciaSeleccionadaParaTraer(modelo, opdActivoId, seleccionId, seleccionados);
      if (!apariencia) {
        set({ mensaje: "Selecciona una cosa visible para ocultar" });
        return;
      }
      const resultado = ocultarAparienciaBatch(modelo, opdActivoId, apariencia.id);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        seleccionados: [],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        mensaje: "Apariencia oculta del OPD actual",
      });
    },
  };
}

function gridConfigDesdeEstado(estado: ReturnType<GetStore>): GridConfig {
  return normalizarGridConfig(estado.gridConfig ?? estado.indice.preferenciasUi?.gridConfig);
}

function cuantizarDesdeEstado(estado: ReturnType<GetStore>, x: number, y: number): { x: number; y: number } {
  return cuantizarPosicion(x, y, gridConfigDesdeEstado(estado));
}

function aparienciaSeleccionadaParaTraer(
  modelo: ReturnType<GetStore>["modelo"],
  opdId: string,
  seleccionId: string | null,
  seleccionados: readonly string[],
) {
  const opd = modelo.opds[opdId];
  if (!opd) return null;
  const ids = [seleccionId, ...seleccionados].filter((id): id is string => !!id);
  for (const id of ids) {
    const apariencia = opd.apariencias[id] ?? Object.values(opd.apariencias).find((item) => item.entidadId === id);
    if (apariencia) return apariencia;
  }
  return null;
}
