import {
  abanicoDeEnlace,
  alternarOperadorAbanico as alternarOperadorAbanicoOp,
  candidatosAbanicoExacto,
  definirProbabilidadesAbanico as definirProbabilidadesAbanicoOp,
  disolverAbanico as disolverAbanicoOp,
  formarAbanico,
  quitarRamaDeAbanico as quitarRamaDeAbanicoOp,
} from "../../modelo/abanicos";
import { anclaEnlaceMasCercana, type AnclaRelojEnlace } from "../../modelo/anclajesEnlace";
import { crearAutoInvocacion } from "../../modelo/autoinvocacion";
import { tipoInicialConexionDesdeEntidad } from "../../canvas/modoEnlace";
import { extremoEstado } from "../../modelo/extremos";
import { renombrarEtiquetaEnlace } from "../../modelo/etiquetasEnlace";
import { crearEnlaceTransaccional } from "../../modelo/transaccionEnlace";
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
  compartirAnclaExtremosEnlaces,
  fijarAnclaExtremoEnlace,
  definirBackwardTag,
  definirRequisitosEnlace,
  definirTasaEnlace,
  definirTiempoExcepcionEnlace,
  moverPuertoEnlace as moverPuertoEnlaceOp,
  reanclarEnlaceExternoDerivado as reanclarEnlaceExternoDerivadoOp,
  splitEffectEnPar,
  volverEnlaceExternoDerivadoAAutomatico as volverEnlaceExternoDerivadoAAutomaticoOp,
} from "../../modelo/operaciones";
import { definirRutaEtiqueta } from "../../modelo/rutas";
import { commitModelo, enlaceNuevo, mensajeBloqueoEdicion, type GetStore, type SetStore } from "../runtime";
import { addFlash } from "../feedback";
import type { Id, Modelo } from "../../modelo/tipos";
import type { ModeloSlice } from "../tipos";

/**
 * Acciones de enlace: tipo de enlace en modo creación, multiplicidad,
 * extremos (apuntar/reanclar derivados), split de efecto, abanicos
 * (operador/quitar rama/disolver), auto-invocación, modificadores
 * (condición/evento/no), probabilidad, demora, etiqueta, ruta.
 */
export function accionesEnlace(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
    elegirTipoEnlace(tipo, origenExplicitoId) {
      // Ley silencio-cero (C-1): en solo lectura el modo enlace ni se
      // enciende — encenderlo pinta targets "conectables" que mienten.
      const bloqueo = mensajeBloqueoEdicion(get());
      if (bloqueo) {
        set({ mensaje: bloqueo });
        return;
      }
      const { modelo, seleccionId, modoEnlace } = get();
      const origenId = origenExplicitoId ?? modoEnlace?.origenId ?? seleccionId;
      if (!origenId || !modelo.entidades[origenId]) {
        set({ mensaje: "Selecciona primero la cosa origen del enlace" });
        return;
      }
      // P1-5 ronda 4: activar modoEnlace cambia el contexto a "conectar";
      // cualquier editor inline previo se descarta.
      set({ modoEnlace: { tipo, origenId, fase: "boton" }, modoCreacion: null, nuevaCosaPendiente: null, mensaje: "Selecciona la entidad destino" });
    },

    iniciarConexionDesdeApariencia(aparienciaId, anchor, estadoOrigenId) {
      const bloqueo = mensajeBloqueoEdicion(get());
      if (bloqueo) {
        set({ mensaje: bloqueo });
        return;
      }
      const { modelo, opdActivoId } = get();
      const apariencia = modelo.opds[opdActivoId]?.apariencias[aparienciaId];
      if (!apariencia) {
        set({ mensaje: "Apariencia origen no encontrada para conectar" });
        return;
      }
      const entidad = modelo.entidades[apariencia.entidadId];
      if (!entidad) {
        set({ mensaje: "Entidad origen no encontrada para conectar" });
        return;
      }
      const estadoOrigen = estadoOrigenId ? modelo.estados[estadoOrigenId] : undefined;
      if (estadoOrigenId && (!estadoOrigen || estadoOrigen.entidadId !== entidad.id)) {
        set({ mensaje: "Estado origen no encontrado para conectar" });
        return;
      }
      const tipo = tipoInicialConexionDesdeEntidad(modelo, opdActivoId, entidad.id);
      set({
        modoEnlace: {
          tipo,
          origenId: entidad.id,
          ...(estadoOrigen ? { origenExtremo: extremoEstado(estadoOrigen.id) } : {}),
          fase: "drag-from-anchor",
          origenAparienciaId: apariencia.id,
          anchor,
        },
        modoCreacion: null,
        nuevaCosaPendiente: null,
        mensaje: "Arrastra hacia la cosa destino",
      });
    },

    crearEnlaceEntreEntidades(origenId, destinoId, tipo, opciones) {
      const { modelo, opdActivoId } = get();
      const resultado = crearEnlaceTransaccional(modelo, opdActivoId, origenId, destinoId, tipo, opciones);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const { modelo: modeloFinal, enlaceId: enlaceCreadoId } = resultado.value;
      const commiteado = commitModelo(set, modelo, modeloFinal, {
        seleccionId: null,
        seleccionados: enlaceCreadoId ? [enlaceCreadoId] : [],
        modoSeleccion: "simple",
        enlaceSeleccionId: enlaceCreadoId,
        modoEnlace: null,
        mensaje: null,
        // P1-5: crear enlace cambia contexto al enlace; cerramos editor inline.
        nuevaCosaPendiente: null,
      });
      // Ley silencio-cero: el flash de éxito solo si el commit ocurrió —
      // antes corría incondicional y MENTÍA tras un rechazo por solo-lectura.
      if (commiteado) addFlash("✓ Enlace creado");
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

    definirProbabilidadesAbanicoSeleccionado(probabilidades) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) {
        set({ mensaje: "Selecciona un enlace del abanico para definir probabilidades" });
        return;
      }
      const abanico = abanicoDeEnlace(modelo, enlaceSeleccionId);
      if (!abanico) {
        set({ mensaje: "El enlace no pertenece a un abanico" });
        return;
      }
      const resultado = definirProbabilidadesAbanicoOp(modelo, abanico.id, probabilidades);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        mensaje: probabilidades ? "Probabilidades del abanico actualizadas" : "Probabilidades del abanico eliminadas",
      });
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

    crearAbanicoDesdeEnlaceSeleccionado(lado, operador = "O") {
      const { modelo, opdActivoId, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) {
        set({ mensaje: "Selecciona una rama para crear fan" });
        return;
      }
      const candidato = candidatosAbanicoExacto(modelo, opdActivoId, enlaceSeleccionId)
        .find((item) => item.lado === lado);
      if (!candidato) {
        set({ mensaje: "No hay ramas compatibles para crear fan" });
        return;
      }
      const ancla = anclaActualDelExtremoComun(modelo, opdActivoId, enlaceSeleccionId, lado);
      const alineado = compartirAnclaExtremosEnlaces(modelo, opdActivoId, candidato.enlaceIds, lado, ancla);
      if (!alineado.ok) {
        set({ mensaje: alineado.error });
        return;
      }
      const formado = formarAbanico(alineado.value, opdActivoId, candidato.enlaceIds, operador);
      if (!formado.ok) {
        set({ mensaje: formado.error });
        return;
      }
      commitModelo(set, modelo, formado.value, {
        seleccionId: null,
        enlaceSeleccionId,
        modoEnlace: null,
        mensaje: `Fan ${operador} creado`,
      });
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

    definirBackwardTagSeleccionado(tag) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) return;
      const resultado = definirBackwardTag(modelo, enlaceSeleccionId, tag);
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

    definirRequisitosEnlaceSeleccionado(requisitos, mostrar) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) return;
      const resultado = definirRequisitosEnlace(modelo, enlaceSeleccionId, requisitos, mostrar);
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

    definirTasaEnlaceSeleccionada(tasa, unidadesTasa) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) return;
      const resultado = definirTasaEnlace(modelo, enlaceSeleccionId, tasa, unidadesTasa);
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

    definirTiempoExcepcionEnlaceSeleccionado(valores) {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) return;
      const resultado = definirTiempoExcepcionEnlace(modelo, enlaceSeleccionId, valores);
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

    moverPuertoEnlaceSeleccionado(lado, extremo, opcionRemover = false, ancla) {
      const { modelo, opdActivoId, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) {
        set({ mensaje: "Selecciona un enlace para mover puerto" });
        return;
      }
      const resultado = moverPuertoEnlaceOp(modelo, enlaceSeleccionId, lado, extremo, opcionRemover);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      let modeloFinal = resultado.value;
      const enlaceExiste = !!modeloFinal.enlaces[enlaceSeleccionId];
      if (enlaceExiste && ancla && !opcionRemover) {
        const anclado = fijarAnclaExtremoEnlace(modeloFinal, opdActivoId, enlaceSeleccionId, lado, ancla);
        if (!anclado.ok) {
          set({ mensaje: anclado.error });
          return;
        }
        modeloFinal = anclado.value;
      }
      commitModelo(set, modelo, modeloFinal, {
        seleccionId: null,
        enlaceSeleccionId: enlaceExiste ? enlaceSeleccionId : null,
        modoEnlace: null,
        mensaje: opcionRemover ? "Relacion removida" : "Reanclaje aplicado",
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

function anclaActualDelExtremoComun(modelo: Modelo, opdId: Id, enlaceId: Id, lado: "origen" | "destino"): AnclaRelojEnlace {
  const enlace = modelo.enlaces[enlaceId];
  const extremo = lado === "origen" ? enlace?.origenId : enlace?.destinoId;
  if (!extremo || extremo.kind !== "entidad" || !extremo.portId) return lado === "origen" ? "E" : "O";
  const apariencia = Object.values(modelo.opds[opdId]?.apariencias ?? {})
    .find((item) => item.entidadId === extremo.id);
  const puerto = apariencia?.ports?.[extremo.portId];
  return puerto ? anclaEnlaceMasCercana(puerto) : lado === "origen" ? "E" : "O";
}
