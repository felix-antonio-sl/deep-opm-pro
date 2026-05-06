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
  reinsertarParteEnPlegado as reinsertarParteEnPlegadoOp,
} from "../../modelo/plegado";
import {
  actualizarVerticesEnlace as actualizarVerticesEnlaceOp,
  moverApariencia as moverAparienciaEntidad,
  moverAparienciaPorId,
  renombrarEntidad,
  renombrarEstado,
} from "../../modelo/operaciones";
import { renombrarEtiquetaEnlace } from "../../modelo/etiquetasEnlace";
import { mismaReferencia } from "../../opl/interaccion";
import { generarOpl } from "../../opl/generar";
import {
  aparienciaSeleccionadaActiva,
  commitModelo,
  deshacerRuntime,
  enlaceNuevo,
  generarHtmlOpl,
  limitar,
  rehacerRuntime,
  validarSubprocesoTimeline,
  type GetStore,
  type SetStore,
} from "../runtime";
import type { ModeloSlice } from "../tipos";

/**
 * Acciones de canvas: selección (entidad/estado/enlace + multi vía Ctrl/Shift),
 * selección desde OPL, edición OPL inversa (renombrar entidad/estado/etiqueta),
 * filtros y hover OPL, plegado (modo + orden partes + extracción/reinserción),
 * estilo apariencia, mover apariencia y vértices de enlace, copiar/exportar OPL,
 * deshacer/rehacer.
 */
export function accionesCanvas(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
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
  };
}
