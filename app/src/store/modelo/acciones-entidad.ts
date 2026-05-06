import { crearCosaEnPosicion } from "../../modelo/creacionInterna";
import { posicionLibre } from "../../modelo/layout";
import {
  cambiarAfiliacion,
  cambiarEsencia,
  crearObjeto,
  crearProceso,
  renombrarEntidad,
} from "../../modelo/operaciones";
import {
  agregarUrl,
  editarAlias,
  editarDescripcion,
  editarUnidad,
  eliminarUrl,
  reordenarUrls,
} from "../../modelo/objetoMetadata";
import type { LayoutEstados, Modelo } from "../../modelo/tipos";
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
      const { uiAliasVisibles, uiDescripcionesVisibles, modelo } = get();
      const aliasVisibles = !uiAliasVisibles;
      fijarOpcionesProyeccionGlobal({ aliasVisibles, descripcionesVisibles: uiDescripcionesVisibles });
      set({ uiAliasVisibles: aliasVisibles, modelo: { ...modelo } });
    },

    toggleDescripcionesVisibles() {
      const { uiAliasVisibles, uiDescripcionesVisibles, modelo } = get();
      const descripcionesVisibles = !uiDescripcionesVisibles;
      fijarOpcionesProyeccionGlobal({ aliasVisibles: uiAliasVisibles, descripcionesVisibles });
      set({ uiDescripcionesVisibles: descripcionesVisibles, modelo: { ...modelo } });
    },
  };
}
