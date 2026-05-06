import {
  abanicoDeEnlace,
  alternarOperadorAbanico as alternarOperadorAbanicoOp,
  disolverAbanico as disolverAbanicoOp,
  quitarRamaDeAbanico as quitarRamaDeAbanicoOp,
} from "../../modelo/abanicos";
import { crearAutoInvocacion } from "../../modelo/autoinvocacion";
import { renombrarEtiquetaEnlace } from "../../modelo/etiquetasEnlace";
import {
  aplicarModificador,
  aplicarSubtipoModificador,
  definirDemora,
  definirProbabilidad,
  quitarModificador,
} from "../../modelo/modificadores";
import {
  ajustarMultiplicidad,
  apuntarExtremoEnlace,
  moverPuertoEnlace as moverPuertoEnlaceOp,
  reanclarEnlaceExternoDerivado as reanclarEnlaceExternoDerivadoOp,
  splitEffectEnPar,
  volverEnlaceExternoDerivadoAAutomatico as volverEnlaceExternoDerivadoAAutomaticoOp,
} from "../../modelo/operaciones";
import { definirRutaEtiqueta } from "../../modelo/rutas";
import { commitModelo, enlaceNuevo, type GetStore, type SetStore } from "../runtime";
import type { ModeloSlice } from "../tipos";

/**
 * Acciones de enlace: tipo de enlace en modo creación, multiplicidad,
 * extremos (apuntar/reanclar derivados), split de efecto, abanicos
 * (operador/quitar rama/disolver), auto-invocación, modificadores
 * (condición/evento/no), probabilidad, demora, etiqueta, ruta.
 */
export function accionesEnlace(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
    elegirTipoEnlace(tipo) {
      const { modelo, seleccionId, modoEnlace } = get();
      const origenId = modoEnlace?.origenId ?? seleccionId;
      if (!origenId || !modelo.entidades[origenId]) {
        set({ mensaje: "Selecciona primero la entidad origen del enlace" });
        return;
      }
      set({ modoEnlace: { tipo, origenId }, modoCreacion: null, mensaje: "Selecciona la entidad destino" });
    },

    cancelarEnlace() {
      set({ modoEnlace: null, mensaje: null });
    },

    ajustarMultiplicidadSeleccionada(lado, texto) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) return;
      const resultado = ajustarMultiplicidad(modelo, enlaceSeleccionId, lado, texto);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId,
        modoEnlace: null,
        mensaje: null,
      });
    },

    apuntarExtremoEnlaceSeleccionado(lado, extremo) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) return;
      const resultado = apuntarExtremoEnlace(modelo, enlaceSeleccionId, lado, extremo);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      if (resultado.value === modelo) return;
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId,
        modoEnlace: null,
        mensaje: null,
      });
    },

    reanclarEnlaceExternoDerivado(aparienciaEnlaceId, nuevoEndpointEntidadId) {
      const { modelo, opdActivoId, enlaceSeleccionId } = get();
      const resultado = reanclarEnlaceExternoDerivadoOp(modelo, opdActivoId, aparienciaEnlaceId, nuevoEndpointEntidadId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId,
        modoEnlace: null,
        mensaje: "Enlace derivado reanclado",
      });
    },

    splitEffectSeleccionado() {
      const { modelo, opdActivoId, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) {
        set({ mensaje: "Selecciona un enlace de efecto para splittear" });
        return;
      }
      const resultado = splitEffectEnPar(modelo, opdActivoId, enlaceSeleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "Efecto descompuesto en consumo + resultado intermedio",
      });
    },

    volverEnlaceExternoDerivadoAAutomatico(aparienciaEnlaceId) {
      const { modelo, opdActivoId, enlaceSeleccionId } = get();
      const resultado = volverEnlaceExternoDerivadoAAutomaticoOp(modelo, opdActivoId, aparienciaEnlaceId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const enlaceActual = enlaceSeleccionId ? resultado.value.enlaces[enlaceSeleccionId] : undefined;
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId: enlaceActual ? enlaceSeleccionId : null,
        modoEnlace: null,
        mensaje: "Enlace derivado automatico",
      });
    },

    alternarOperadorAbanicoSeleccionado(operador) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) {
        set({ mensaje: "Selecciona un enlace para alternar el operador del abanico" });
        return;
      }
      const abanico = abanicoDeEnlace(modelo, enlaceSeleccionId);
      if (!abanico) {
        set({ mensaje: "El enlace no pertenece a un abanico" });
        return;
      }
      const resultado = alternarOperadorAbanicoOp(modelo, abanico.id, operador);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { mensaje: `Operador actualizado a ${operador}` });
    },

    quitarRamaDeAbanicoSeleccionado() {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) {
        set({ mensaje: "Selecciona un enlace para quitar del abanico" });
        return;
      }
      const abanico = abanicoDeEnlace(modelo, enlaceSeleccionId);
      if (!abanico) {
        set({ mensaje: "El enlace no pertenece a un abanico" });
        return;
      }
      const resultado = quitarRamaDeAbanicoOp(modelo, abanico.id, enlaceSeleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { mensaje: "Rama removida del abanico" });
    },

    disolverAbanicoSeleccionado() {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) {
        set({ mensaje: "Selecciona un enlace del abanico a disolver" });
        return;
      }
      const abanico = abanicoDeEnlace(modelo, enlaceSeleccionId);
      if (!abanico) {
        set({ mensaje: "El enlace no pertenece a un abanico" });
        return;
      }
      const resultado = disolverAbanicoOp(modelo, abanico.id);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { mensaje: "Abanico disuelto" });
    },

    crearAutoInvocacionSeleccionada() {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona un proceso para crear auto-invocacion" });
        return;
      }
      const entidad = modelo.entidades[seleccionId];
      if (!entidad || entidad.tipo !== "proceso") {
        set({ mensaje: "Selecciona un proceso para crear auto-invocacion" });
        return;
      }
      const resultado = crearAutoInvocacion(modelo, opdActivoId, seleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const enlaceId = enlaceNuevo(modelo, resultado.value);
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId: enlaceId,
        modoEnlace: null,
        mensaje: "Auto-invocacion creada",
      });
    },

    aplicarModificadorEnlaceSeleccionado(modificador) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) {
        set({ mensaje: "Selecciona un enlace para aplicar modificador" });
        return;
      }
      const resultado = aplicarModificador(modelo, enlaceSeleccionId, modificador);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId,
        modoEnlace: null,
        mensaje: null,
      });
    },

    aplicarSubtipoModificadorEnlaceSeleccionado(subtipo) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) {
        set({ mensaje: "Selecciona un enlace para aplicar subtipo" });
        return;
      }
      const resultado = aplicarSubtipoModificador(modelo, enlaceSeleccionId, subtipo);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId,
        modoEnlace: null,
        mensaje: null,
      });
    },

    quitarModificadorEnlaceSeleccionado() {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) return;
      const resultado = quitarModificador(modelo, enlaceSeleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId,
        modoEnlace: null,
        mensaje: null,
      });
    },

    definirProbabilidadEventoSeleccionada(probabilidad) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) return;
      const resultado = definirProbabilidad(modelo, enlaceSeleccionId, probabilidad);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId,
        modoEnlace: null,
        mensaje: null,
      });
    },

    definirDemoraInvocacionSeleccionada(demora) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) return;
      const resultado = definirDemora(modelo, enlaceSeleccionId, demora);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId,
        modoEnlace: null,
        mensaje: null,
      });
    },

    moverPuertoEnlaceSeleccionado(lado, extremo, opcionRemover = false) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) {
        set({ mensaje: "Selecciona un enlace para mover puerto" });
        return;
      }
      const resultado = moverPuertoEnlaceOp(modelo, enlaceSeleccionId, lado, extremo, opcionRemover);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const enlaceExiste = !!resultado.value.enlaces[enlaceSeleccionId];
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId: enlaceExiste ? enlaceSeleccionId : null,
        modoEnlace: null,
        mensaje: opcionRemover ? "Relacion removida" : "Puerto movido",
      });
    },

    renombrarEtiquetaEnlaceSeleccionado(etiqueta) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) return;
      const resultado = renombrarEtiquetaEnlace(modelo, enlaceSeleccionId, etiqueta);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId,
        modoEnlace: null,
        mensaje: null,
      });
    },

    definirRutaEtiquetaSeleccionada(etiqueta) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) return;
      const resultado = definirRutaEtiqueta(modelo, enlaceSeleccionId, etiqueta);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId,
        modoEnlace: null,
        mensaje: null,
      });
    },
  };
}
