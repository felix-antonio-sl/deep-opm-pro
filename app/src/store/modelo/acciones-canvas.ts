import { extremoEstado } from "../../modelo/extremos";
import {
  cambiarOrdenPartes as cambiarOrdenPartesOp,
  cambiarModoPlegado as cambiarModoPlegadoOp,
  extraerParteDePlegado as extraerParteDePlegadoOp,
  extraerTodasLasPartesDePlegado as extraerTodasLasPartesDePlegadoOp,
  reinsertarParteEnPlegado as reinsertarParteEnPlegadoOp,
} from "../../modelo/plegado";
import {
  actualizarAnclajesSimboloEstructural as actualizarAnclajesSimboloEstructuralOp,
  actualizarPosicionLabelEnlace as actualizarPosicionLabelEnlaceOp,
  actualizarPosicionSimboloEstructural as actualizarPosicionSimboloEstructuralOp,
  actualizarVerticesEnlace as actualizarVerticesEnlaceOp,
  actualizarPuertosEnlacesDesdePuntos,
  moverApariencia as moverAparienciaEntidad,
  moverAparienciaPorId,
  quitarPlegadoCompletoEstructural,
  quitarSemiplegadoEstructural,
  renombrarEntidad,
  renombrarEstado,
  resetearAnclajesSimboloEstructural as resetearAnclajesSimboloEstructuralOp,
  traerAgregacionesInzoomFaltantes,
} from "../../modelo/operaciones";
import { renombrarEtiquetaEnlace } from "../../modelo/etiquetasEnlace";
import { crearEnlaceTransaccional } from "../../modelo/transaccionEnlace";
import { mismaReferencia } from "../../opl/interaccion";
import type { EsenciaVisibilidad } from "../../opl/opciones";
import { generarOpl } from "../../opl/generar";
import { exportarOplModeloMarkdown, exportarOplOpdMarkdown } from "../../opl/exportarMarkdown";
import { emitirDocumentoCanonico } from "../../serializacion/perfilesExport";
import { exportarContextoSkill } from "../../opl/contextoSkill";
import {
  agregarNotaMesa as agregarNotaMesaKernel,
  editarNotaMesa as editarNotaMesaKernel,
  eliminarNotaMesa as eliminarNotaMesaKernel,
} from "../../modelo/notasMesa";
import {
  anotarAnclaEnMesa as anotarAnclaEnMesaKernel,
  construirLogDecisiones,
  ratificarAnclaConFuente as ratificarAnclaConFuenteKernel,
} from "../../modelo/logDecisiones";
import { aplicarPatchesOpl, planificarEdicionOplLibre } from "../../opl/parser";
import {
  commitModelo,
  deshacerRuntime,
  escribirIndiceWorkspace,
  actualizarPreferenciasUi,
  limitar,
  rehacerRuntime,
  validarSubprocesoTimeline,
  type GetStore,
  type SetStore,
} from "../runtime";
import { addFlash } from "../feedback";
import type { ModeloSlice } from "../tipos";
import {
  alinearPorEje,
  distribuirUniformemente,
  ocultarAparienciaBatch,
  traerConectadosBatch,
  traerEnlacesEntreBatch,
  traerEntidadAlOpd,
} from "../../canvas/operacionesBatch";
import { FAMILIAS_TRAER_DEFAULT, normalizarFamiliasTraer } from "../../canvas/reglasTraer";
import { cuantizarPosicion, normalizarGridConfig, type GridConfig } from "../../canvas/grid";
import { aplicarLayoutSugerido as aplicarLayoutSugeridoOp } from "../../canvas/layoutSugerido";

/**
 * Acciones de canvas: selección (entidad/estado/enlace + multi vía Ctrl/Shift),
 * selección desde OPL, edición OPL inversa (renombrar entidad/estado/etiqueta),
 * filtros y hover OPL, plegado (modo + orden partes + extracción/reinserción),
 * mover apariencia y vértices de enlace, copiar/exportar OPL,
 * deshacer/rehacer.
 *
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
        set({ seleccionId: id, seleccionados: [id], modoSeleccion: "simple", enlaceSeleccionId: null, estadoSeleccionId: null, mensaje: null, ...limpiezaPendiente });
        return;
      }

      const resultado = crearEnlaceTransaccional(modelo, opdActivoId, modoEnlace.origenId, id, modoEnlace.tipo, {
        permitirExtremoPlegado: true,
      });
      if (!resultado.ok) {
        set({ seleccionId: id, seleccionados: [id], modoSeleccion: "simple", enlaceSeleccionId: null, estadoSeleccionId: null, mensaje: resultado.error, ...limpiezaPendiente });
        return;
      }
      const { modelo: modeloFinal } = resultado.value;
      const commiteado = commitModelo(set, modelo, modeloFinal, {
        seleccionId: id,
        seleccionados: [id],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        estadoSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
        // P1-5: al crearse el enlace, salimos del editor inline.
        nuevaCosaPendiente: null,
      });
      if (commiteado) addFlash("✓ Enlace creado");
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
        // Paquete "Estados ciudadanos de primera clase" (2026-05-23): este
        // path histórico redirigía al objeto propietario cuando NO había
        // modo enlace. Lo mantenemos por compat (existían callers fuera del
        // handler de seleccion), pero el handler real ya seleccionó el
        // estado vía `seleccionarEstadoRef`. Aquí dejamos seleccionado el
        // objeto como antes para no romper callers OPL/programáticos.
        set({ seleccionId: estado.entidadId, seleccionados: [estado.entidadId], modoSeleccion: "simple", enlaceSeleccionId: null, estadoSeleccionId: null, mensaje: null, ...limpiezaPendiente });
        return;
      }

      const resultado = crearEnlaceTransaccional(modelo, opdActivoId, modoEnlace.origenId, extremoEstado(estadoId), modoEnlace.tipo, {
        permitirExtremoPlegado: true,
      });
      if (!resultado.ok) {
        set({ seleccionId: estado.entidadId, seleccionados: [estado.entidadId], modoSeleccion: "simple", enlaceSeleccionId: null, estadoSeleccionId: null, mensaje: resultado.error, ...limpiezaPendiente });
        return;
      }
      const { modelo: modeloFinal } = resultado.value;
      const commiteado = commitModelo(set, modelo, modeloFinal, {
        seleccionId: estado.entidadId,
        seleccionados: [estado.entidadId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        estadoSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
        nuevaCosaPendiente: null,
      });
      if (commiteado) addFlash("✓ Enlace creado");
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
      set({ seleccionId: null, seleccionados: [id], modoSeleccion: "simple", enlaceSeleccionId: id, estadoSeleccionId: null, modoEnlace: null, mensaje: null, nuevaCosaPendiente: null });
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
        estadoSeleccionId: null,
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
        set({ seleccionId: null, seleccionados: [ref.id], modoSeleccion: "simple", enlaceSeleccionId: ref.id, estadoSeleccionId: null, modoEnlace: null, mensaje: null, nuevaCosaPendiente: null });
        return;
      }
      if (ref.tipo === "estado") {
        const estado = modelo.estados[ref.id];
        if (!estado) {
          set({ mensaje: `Estado no existe: ${ref.id}` });
          return;
        }
        set({ seleccionId: estado.entidadId, seleccionados: [estado.entidadId], modoSeleccion: "simple", enlaceSeleccionId: null, estadoSeleccionId: null, modoEnlace: null, mensaje: null, ...limpiezaPendiente });
        return;
      }
      if (!modelo.entidades[ref.id]) {
        set({ mensaje: `Entidad no existe: ${ref.id}` });
        return;
      }
      set({ seleccionId: ref.id, seleccionados: [ref.id], modoSeleccion: "simple", enlaceSeleccionId: null, estadoSeleccionId: null, modoEnlace: null, mensaje: null, ...limpiezaPendiente });
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
        estadoSeleccionId: null,
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

    fijarOplEsenciaVisibilidad(valor: EsenciaVisibilidad) {
      const estado = get();
      const indice = actualizarPreferenciasUi(estado.indice, { oplEsenciaVisibilidad: valor });
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
        estadoSeleccionId: null,
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
        estadoSeleccionId: null,
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
      set({ seleccionId: null, enlaceSeleccionId: enlaceId, estadoSeleccionId: null, modoEnlace: null, mensaje: null });
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
        estadoSeleccionId: null,
        modoEnlace: null,
        mensaje: `OPL aplicado: ${preview.patches.length} cambio${preview.patches.length === 1 ? "" : "s"}`,
      });
    },

    // Copia el OPL del OPD en vista como Markdown listo para pegar (título +
    // viñetas). Reemplaza la antigua exportación a archivo HTML.
    async copiarOplActualAlPortapapeles() {
      const { modelo, opdActivoId } = get();
      const texto = exportarOplOpdMarkdown(modelo, opdActivoId);
      try {
        await navigator.clipboard.writeText(texto);
        set({ mensaje: "OPL copiado al portapapeles" });
      } catch {
        set({ mensaje: "No se pudo copiar al portapapeles" });
      }
    },

    // Copia el OPL completo de TODO el modelo (todos los OPDs) como Markdown.
    // Lo dispara la paleta de comandos (sección EXPORTAR).
    async copiarOplModeloMarkdownAlPortapapeles() {
      const { modelo } = get();
      const texto = exportarOplModeloMarkdown(modelo);
      try {
        await navigator.clipboard.writeText(texto);
        set({ mensaje: "OPL del modelo copiado al portapapeles (Markdown)" });
      } catch {
        set({ mensaje: "No se pudo copiar al portapapeles" });
      }
    },

    // Documento canónico del modelo (perfil canon-documento, R-VIS-EXP-2) como
    // Markdown. Subordinado al gate de densidad: OPD bloqueado ⇒ rechazo con el
    // mensaje accionable del gate, nunca export degradado en silencio.
    async copiarCanonDocumentoAlPortapapeles() {
      const { modelo } = get();
      const documento = emitirDocumentoCanonico(modelo);
      if (!documento.ok) {
        set({ mensaje: documento.error });
        return;
      }
      try {
        await navigator.clipboard.writeText(documento.value);
        set({ mensaje: "Documento canónico copiado al portapapeles (Markdown)" });
      } catch {
        set({ mensaje: "No se pudo copiar al portapapeles" });
      }
    },

    // W6.5-a: notas de mesa — comentarios de revisión anclados a componentes.
    // commitModelo ⇒ undoables y persistidas con el modelo. La fecha la inyecta
    // la acción (la mesa anota HOY); el kernel queda puro/determinista.
    agregarNotaMesa(target, texto) {
      const { modelo } = get();
      const fecha = new Date().toISOString().slice(0, 10);
      const resultado = agregarNotaMesaKernel(modelo, target, texto, fecha);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { mensaje: "Nota de mesa agregada" });
    },

    editarNotaMesa(notaId, texto) {
      const { modelo } = get();
      const resultado = editarNotaMesaKernel(modelo, notaId, texto);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { mensaje: null });
    },

    eliminarNotaMesa(notaId) {
      const { modelo } = get();
      const resultado = eliminarNotaMesaKernel(modelo, notaId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { mensaje: null });
    },

    // W6.5-b (C1): registro [RATIFICAR] — la app registra transiciones
    // (pendiente → anotado-en-mesa → ratificado-con-fuente), no decide; el ancla
    // OPM solo transiciona vía re-elicitación de la skill. commitModelo ⇒
    // undoable y persistido con el modelo.
    anotarAnclaEnMesa(claveProto, responsable) {
      const { modelo } = get();
      const fecha = new Date().toISOString().slice(0, 10);
      const resultado = anotarAnclaEnMesaKernel(modelo, claveProto, fecha, responsable);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { mensaje: `Anotada en mesa: ${claveProto}` });
    },

    ratificarAnclaConFuente(claveProto, fuente, responsable) {
      const { modelo } = get();
      const fecha = new Date().toISOString().slice(0, 10);
      const resultado = ratificarAnclaConFuenteKernel(modelo, claveProto, fuente, fecha, responsable);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { mensaje: `Ratificada con fuente: ${claveProto}` });
    },

    // W6.5-b (C2): export del LogDecisiones v0 — el consumidor comprometido es
    // el estado `re-elicitar` de la skill (matchea por claveAncla + modeloHash).
    async copiarLogDecisionesAlPortapapeles() {
      const { modelo } = get();
      const resultado = construirLogDecisiones(modelo, new Date().toISOString().slice(0, 10));
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const texto = JSON.stringify(resultado.value, null, 2);
      try {
        await navigator.clipboard.writeText(texto);
        const n = resultado.value.entradas.length;
        set({ mensaje: `LogDecisiones v0 copiado (${n} ${n === 1 ? "entrada" : "entradas"})` });
      } catch {
        set({ mensaje: "No se pudo copiar al portapapeles" });
      }
    },

    // W6.0: puente de contexto 1-click app→skill. Copia el contexto de modelado
    // (procedencia + pendientes [RATIFICAR] + diagnóstico + OPL) listo para pegar
    // en la sesión de `modelamiento-opm`, y cuenta el cruce (observable g3).
    async copiarContextoSkillAlPortapapeles() {
      const { modelo } = get();
      const texto = exportarContextoSkill(modelo);
      try {
        await navigator.clipboard.writeText(texto);
        const cruces = get().registrarCrucePuenteSkill("export");
        set({ mensaje: `Contexto copiado para la skill (cruce #${cruces.exportes})` });
      } catch {
        set({ mensaje: "No se pudo copiar al portapapeles" });
      }
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
      commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, estadoSeleccionId: null, modoEnlace: null, mensaje: null });
    },

    cambiarModoPlegadoApariencia(aparienciaId, modo) {
      const { modelo, opdActivoId } = get();
      const resultado = cambiarModoPlegadoOp(modelo, opdActivoId, aparienciaId, modo);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const apariencia = modelo.opds[opdActivoId]?.apariencias[aparienciaId];
      const commiteado = commitModelo(set, modelo, resultado.value, {
        seleccionId: apariencia?.entidadId ?? null,
        enlaceSeleccionId: null,
        estadoSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
      if (commiteado) addFlash("✓ Plegado actualizado");
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

    seleccionarPartePlegada(_padreAparienciaId, parteEntidadId) {
      const { modelo, modoEnlace, opdActivoId } = get();
      if (!modoEnlace) {
        set({ seleccionId: parteEntidadId, enlaceSeleccionId: null, mensaje: null });
        return;
      }

      const resultado = crearEnlaceTransaccional(modelo, opdActivoId, modoEnlace.origenId, parteEntidadId, modoEnlace.tipo, {
        permitirExtremoPlegado: true,
      });
      if (!resultado.ok) {
        set({ seleccionId: parteEntidadId, enlaceSeleccionId: null, mensaje: resultado.error });
        return;
      }
      const { modelo: modeloFinal } = resultado.value;
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
      const commiteado = commitModelo(set, modelo, resultado.value, {
        seleccionados: [...seleccionados],
        mensaje: "Layout sugerido aplicado",
        solicitudFitToken: solicitudFitToken + 1,
        dirtyModelo,
      });
      if (commiteado) addFlash("✓ Layout aplicado");
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

    actualizarPosicionLabelEnlace(aparienciaEnlaceId, labelKey, posicion) {
      const { modelo, opdActivoId, dirtyModelo } = get();
      const resultado = actualizarPosicionLabelEnlaceOp(modelo, opdActivoId, aparienciaEnlaceId, labelKey, posicion);
      if (resultado.ok) commitModelo(set, modelo, resultado.value, { dirtyModelo });
      else set({ mensaje: resultado.error });
    },

    actualizarPosicionSimboloEstructural(aparienciaEnlaceIds, posicion, anclajesPorApariencia) {
      const { modelo, opdActivoId, dirtyModelo } = get();
      const pos = cuantizarDesdeEstado(get(), posicion.x, posicion.y);
      const anclajes = anclajesPorApariencia ?? {};
      const resultado = actualizarPosicionSimboloEstructuralOp(modelo, opdActivoId, aparienciaEnlaceIds, pos, anclajes);
      if (resultado.ok) commitModelo(set, modelo, resultado.value, { dirtyModelo });
      else set({ mensaje: resultado.error });
    },

    actualizarAnclajesSimboloEstructural(aparienciaEnlaceIds, anclajes) {
      const { modelo, opdActivoId, dirtyModelo } = get();
      const anclajesPorApariencia = Object.fromEntries(
        Array.from(new Set(aparienciaEnlaceIds)).map((id) => [id, anclajes]),
      );
      const resultado = actualizarAnclajesSimboloEstructuralOp(modelo, opdActivoId, anclajesPorApariencia);
      if (resultado.ok) commitModelo(set, modelo, resultado.value, { dirtyModelo });
      else set({ mensaje: resultado.error });
    },

    resetearAnclajesSimboloEstructural(aparienciaEnlaceIds) {
      const { modelo, opdActivoId, dirtyModelo } = get();
      const resultado = resetearAnclajesSimboloEstructuralOp(modelo, opdActivoId, aparienciaEnlaceIds);
      if (resultado.ok) commitModelo(set, modelo, resultado.value, { dirtyModelo });
      else set({ mensaje: resultado.error });
    },

    traerCosaAlOpdActivo(entidadId) {
      const estado = get();
      const { modelo, opdActivoId } = estado;
      const entidad = modelo.entidades[entidadId];
      if (!entidad) {
        set({ mensaje: "La cosa ya no existe en el modelo" });
        return;
      }
      const resultado = traerEntidadAlOpd(modelo, opdActivoId, entidadId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      if (resultado.value === modelo) {
        set({ mensaje: `«${entidad.nombre}» ya aparece en este OPD` });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: entidadId,
        seleccionados: [entidadId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        estadoSeleccionId: null,
        mensaje: `«${entidad.nombre}» traída a este OPD`,
      });
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
