import { CANON } from "../../modelo/constantes";
import { crearCosaEnPosicion } from "../../modelo/creacionInterna";
import { posicionLibre } from "../../modelo/layout";
import {
	  ajustarAlTexto,
	  alternarModoTamano,
	  asignarValorAtributo,
	  cambiarAfiliacion,
	  cambiarEsencia,
	  cambiarTipoValorAtributo,
	  crearAtributoEnObjeto,
	  crearObjeto,
	  crearProceso,
  redimensionarApariencia,
  renombrarEntidad,
  volverAAutoTamano,
} from "../../modelo/operaciones";
import {
  agregarUrl,
  cambiarModoImagen,
  editarImagen,
  editarAlias,
  editarDescripcion,
  editarUnidad,
  eliminarUrl,
  quitarImagen,
  reordenarUrls,
} from "../../modelo/objetoMetadata";
import type { Apariencia, Id, LayoutEstados, Modelo, ModoImagenEntidad, TipoValorSlot } from "../../modelo/tipos";
import { fijarOpcionesProyeccionGlobal } from "../../render/jointjs/proyeccion";
import { commitModelo, entidadNueva, type GetStore, type SetStore } from "../runtime";
import type { ModeloSlice } from "../tipos";

/**
 * Acciones de creación/edición de entidad: crearObjetoDemo, crearProcesoDemo,
 * crearEntidadEnCanvas, fijarModoCreacion, renombrar/esencia/afiliación,
 * metadata aditiva (alias, unidad, descripción, URLs), layoutEstados, toggles
 * de visibilidad alias/descripciones.
 */
export function accionesEntidad(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
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
      emitirNuevaCosa(resultado.value.entidadId, resultado.value.aparienciaId, resultado.value.modelo.entidades[resultado.value.entidadId]?.nombre);
    },

    crearAparienciaEntidadEnCanvas(entidadId, posicion) {
      const { modelo, opdActivoId } = get();
      const entidad = modelo.entidades[entidadId];
      const opd = modelo.opds[opdActivoId];
      if (!entidad || !opd) {
        set({ mensaje: "La cosa no existe en el modelo activo" });
        return;
      }
      const existente = Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === entidadId);
      if (existente) {
        set({
          seleccionId: entidadId,
          seleccionados: [entidadId],
          modoSeleccion: "simple",
          enlaceSeleccionId: null,
          modoEnlace: null,
          mensaje: "La cosa ya aparece en este OPD",
        });
        return;
      }
      const aparienciaId = `a-${modelo.nextSeq}`;
      const apariencia: Apariencia = {
        id: aparienciaId,
        entidadId,
        opdId: opdActivoId,
        x: Math.round(posicion.x),
        y: Math.round(posicion.y),
        width: CANON.dims.cosaWidth,
        height: CANON.dims.cosaHeight,
      };
      const siguiente: Modelo = {
        ...modelo,
        nextSeq: modelo.nextSeq + 1,
        opds: {
          ...modelo.opds,
          [opdActivoId]: {
            ...opd,
            apariencias: {
              ...opd.apariencias,
              [aparienciaId]: apariencia,
            },
          },
        },
      };
      commitModelo(set, modelo, siguiente, {
        seleccionId: entidadId,
        seleccionados: [entidadId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
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

    renombrarSeleccionada(nombre) {
      const { modelo, seleccionId } = get();
      if (!seleccionId) return;
      const resultado = renombrarEntidad(modelo, seleccionId, nombre);
	      if (resultado.ok) commitModelo(set, modelo, resultado.value, { mensaje: null });
	    },

	    crearAtributoEnObjetoSeleccionado(input = {}) {
	      const { modelo, opdActivoId, seleccionId } = get();
	      if (!seleccionId) {
	        set({ mensaje: "Selecciona un objeto para crear atributo" });
	        return;
	      }
	      const entidad = modelo.entidades[seleccionId];
	      if (!entidad || entidad.tipo !== "objeto") {
	        set({ mensaje: "Selecciona un objeto para crear atributo" });
	        return;
	      }
	      const nombre = input.nombre ?? "Valor [u]";
	      const resultado = crearAtributoEnObjeto(modelo, opdActivoId, seleccionId, nombre, {
	        tipoSlot: input.tipoSlot ?? "float",
	        ...(input.unidad ? { unidad: input.unidad } : {}),
	      });
	      if (!resultado.ok) {
	        set({ mensaje: resultado.error });
	        return;
	      }
	      commitModelo(set, modelo, resultado.value.modelo, {
	        seleccionId: resultado.value.atributoId,
	        seleccionados: [resultado.value.atributoId],
	        modoSeleccion: "simple",
	        enlaceSeleccionId: null,
	        modoEnlace: null,
	        mensaje: null,
	      });
	    },

	    asignarValorAtributoSeleccionado(valor) {
	      const { modelo, seleccionId } = get();
	      if (!seleccionId) return;
	      const resultado = asignarValorAtributo(modelo, seleccionId, valor);
	      if (!resultado.ok) {
	        set({ mensaje: resultado.error });
	        return;
	      }
	      commitModelo(set, modelo, resultado.value, { seleccionId, seleccionados: [seleccionId], enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
	    },

	    cambiarTipoValorAtributoSeleccionado(tipo: TipoValorSlot) {
	      const { modelo, seleccionId } = get();
	      if (!seleccionId) return;
	      const resultado = cambiarTipoValorAtributo(modelo, seleccionId, tipo);
	      if (!resultado.ok) {
	        set({ mensaje: resultado.error });
	        return;
	      }
	      commitModelo(set, modelo, resultado.value, { seleccionId, seleccionados: [seleccionId], enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
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

    redimensionarSeleccionada(width, height) {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) return;
      const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
        .find((item) => item.entidadId === seleccionId);
      if (!apariencia) {
        set({ mensaje: "La entidad seleccionada no tiene apariencia en el OPD activo" });
        return;
      }
      const resultado = redimensionarApariencia(modelo, opdActivoId, apariencia.id, width, height);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId, seleccionados: [seleccionId], modoSeleccion: "simple", mensaje: null });
    },

    redimensionarAparienciaEnCanvas(aparienciaId, x, y, width, height) {
      const { modelo, opdActivoId } = get();
      const apariencia = modelo.opds[opdActivoId]?.apariencias[aparienciaId];
      const resultado = redimensionarApariencia(modelo, opdActivoId, aparienciaId, width, height, { x, y });
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: apariencia?.entidadId ?? null,
        seleccionados: apariencia?.entidadId ? [apariencia.entidadId] : [],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
    },

    ajustarSeleccionadaAlTexto() {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) return;
      const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
        .find((item) => item.entidadId === seleccionId);
      if (!apariencia) return;
      const resultado = ajustarAlTexto(modelo, opdActivoId, apariencia.id);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId, seleccionados: [seleccionId], modoSeleccion: "simple", mensaje: null });
    },

    volverSeleccionadaAAuto() {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) return;
      const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
        .find((item) => item.entidadId === seleccionId);
      if (!apariencia) return;
      const resultado = volverAAutoTamano(modelo, opdActivoId, apariencia.id);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId, seleccionados: [seleccionId], modoSeleccion: "simple", mensaje: null });
    },

    alternarModoTamanoSeleccionado() {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) return;
      const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
        .find((item) => item.entidadId === seleccionId);
      if (!apariencia) return;
      const resultado = alternarModoTamano(modelo, opdActivoId, apariencia.id);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId, seleccionados: [seleccionId], modoSeleccion: "simple", mensaje: null });
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

    editarImagenEntidad(entidadId, imagen) {
      const { modelo } = get();
      const resultado = editarImagen(modelo, entidadId, imagen);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const modoForzado = resultado.value.entidades[entidadId]?.imagen?.modo === "texto" && imagen.modo !== "texto";
      commitModelo(set, modelo, resultado.value, {
        seleccionId: entidadId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        modalImagenAbierto: null,
        mensaje: modoForzado ? "Imagen guardada en modo texto por estados visibles o URL caída" : null,
      });
    },

    quitarImagenEntidad(entidadId) {
      const { modelo } = get();
      const resultado = quitarImagen(modelo, entidadId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, modalImagenAbierto: null, mensaje: null });
    },

    cambiarModoImagenEntidad(entidadId, modo) {
      const { modelo } = get();
      const resultado = cambiarModoImagen(modelo, entidadId, modo);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const modoForzado = resultado.value.entidades[entidadId]?.imagen?.modo === "texto" && modo !== "texto";
      commitModelo(set, modelo, resultado.value, {
        seleccionId: entidadId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: modoForzado ? "Imagen en modo texto por estados visibles o URL caída" : null,
      });
    },

    alternarModoImagenEntidad(entidadId) {
      const entidad = get().modelo.entidades[entidadId];
      if (!entidad?.imagen) return;
      get().cambiarModoImagenEntidad(entidadId, siguienteModoImagen(entidad.imagen.modo));
    },

    fijarLayoutEstadosEntidad(entidadId, layout: LayoutEstados) {
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
      const { uiAliasVisibles, uiDescripcionesVisibles, uiModoImagenGlobal, modelo } = get();
      const aliasVisibles = !uiAliasVisibles;
      fijarOpcionesProyeccionGlobal({ aliasVisibles, descripcionesVisibles: uiDescripcionesVisibles, modoImagenGlobal: uiModoImagenGlobal });
      set({ uiAliasVisibles: aliasVisibles, modelo: { ...modelo } });
    },

    toggleDescripcionesVisibles() {
      const { uiAliasVisibles, uiDescripcionesVisibles, uiModoImagenGlobal, modelo } = get();
      const descripcionesVisibles = !uiDescripcionesVisibles;
      fijarOpcionesProyeccionGlobal({ aliasVisibles: uiAliasVisibles, descripcionesVisibles, modoImagenGlobal: uiModoImagenGlobal });
      set({ uiDescripcionesVisibles: descripcionesVisibles, modelo: { ...modelo } });
    },
  };
}

function emitirNuevaCosa(entidadId: Id, aparienciaId: Id, nombre?: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("opm:nueva-cosa", { detail: { entidadId, aparienciaId, nombre } }));
}

function siguienteModoImagen(modo: ModoImagenEntidad): ModoImagenEntidad {
  if (modo === "imagen-texto") return "imagen";
  if (modo === "imagen") return "texto";
  return "imagen-texto";
}
