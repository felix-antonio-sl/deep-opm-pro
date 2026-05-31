import { abanicoDeEnlace } from "../../modelo/abanicos";
import { resolverDecisionAbanico, resolverDecisionEnlace } from "../../modelo/decision";
import {
  conectarSubmodelo,
  crearRequirementView,
  crearRequisito,
  definirOntologiaOrganizacional,
  desconectarSubmodelo,
  distribuirEnlaceExternoEnRefinamiento,
  marcarEntidadComoRequisito,
  marcarEstadoSubmodelo,
  recolectarEnlaceExternoEnRefinamiento,
  satisfacerRequisito,
  splitEffectParcial,
} from "../../modelo/operaciones";
import { posicionLibre } from "../../modelo/layout";
import type { Id, Modelo, TargetSatisfaccionRequisito } from "../../modelo/tipos";
import { commitModelo, type GetStore, type SetStore } from "../runtime";
import type { ModeloSlice } from "../tipos";

export function accionesCapacidades(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
    dialogoOntologiaAbierto: false,
    dialogoRequisitoAbierto: null,
    dialogoSubmodeloAbierto: false,

    abrirDialogoOntologia() {
      set({ dialogoOntologiaAbierto: true, mensaje: null });
    },

    cerrarDialogoOntologia() {
      set({ dialogoOntologiaAbierto: false });
    },

    definirOntologiaOrganizacionalActual(ontologia) {
      const { modelo } = get();
      const resultado = definirOntologiaOrganizacional(modelo, ontologia);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        dialogoOntologiaAbierto: false,
        mensaje: ontologia ? "Ontología organizacional actualizada" : "Ontología organizacional desactivada",
      });
    },

    abrirDialogoRequisito(modo) {
      set({ dialogoRequisitoAbierto: modo, mensaje: null });
    },

    cerrarDialogoRequisito() {
      set({ dialogoRequisitoAbierto: null });
    },

    crearRequisitoEnOpd(input) {
      const { modelo, opdActivoId } = get();
      const resultado = crearRequisito(
        modelo,
        opdActivoId,
        posicionLibre(modelo, opdActivoId, "objeto"),
        input.nombre,
        input.metadata,
      );
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value.modelo, {
        seleccionId: resultado.value.requisitoEntidadId,
        seleccionados: [resultado.value.requisitoEntidadId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        estadoSeleccionId: null,
        dialogoRequisitoAbierto: null,
        mensaje: "Requisito creado",
      });
    },

    marcarSeleccionComoRequisito(metadata) {
      const { modelo, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona un objeto para marcar como requisito" });
        return;
      }
      const resultado = marcarEntidadComoRequisito(modelo, seleccionId, metadata);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId,
        seleccionados: [seleccionId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        estadoSeleccionId: null,
        dialogoRequisitoAbierto: null,
        mensaje: "Objeto marcado como requisito",
      });
    },

    satisfacerSeleccionConRequisito(input) {
      const { modelo } = get();
      const target = targetSeleccionActual(get());
      if (!target) {
        set({ mensaje: "Selecciona una cosa o enlace para satisfacer el requisito" });
        return;
      }
      const resultado = satisfacerRequisito(
        modelo,
        input.requisitoEntidadId,
        target,
        input.estado ?? "satisface",
        input.descripcion,
      );
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        dialogoRequisitoAbierto: null,
        mensaje: "Satisfacción de requisito registrada",
      });
    },

    crearRequirementViewSeleccionado() {
      const { modelo, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona un requisito para crear su vista" });
        return;
      }
      const resultado = crearRequirementView(modelo, seleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value.modelo, {
        opdActivoId: resultado.value.opdId,
        seleccionId,
        seleccionados: [seleccionId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        estadoSeleccionId: null,
        mensaje: "Vista de requisito creada",
      });
    },

    abrirDialogoSubmodelo() {
      set({ dialogoSubmodeloAbierto: true, mensaje: null });
    },

    cerrarDialogoSubmodelo() {
      set({ dialogoSubmodeloAbierto: false });
    },

    conectarSubmodeloSeleccionado(input) {
      const { modelo, seleccionId, opdActivoId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona la cosa que ancla el submodelo" });
        return;
      }
      const resultado = conectarSubmodelo(modelo, {
        anchorEntidadId: seleccionId,
        modeloId: input.modeloId,
        nombre: input.nombre,
        ...(input.compartidas ? { compartidas: input.compartidas } : {}),
      });
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value.modelo, {
        opdActivoId,
        seleccionId,
        seleccionados: [seleccionId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        estadoSeleccionId: null,
        dialogoSubmodeloAbierto: false,
        mensaje: "Submodelo conectado",
      });
    },

    marcarEstadoSubmodeloSeleccionado(refId, estado) {
      const { modelo } = get();
      const resultado = marcarEstadoSubmodelo(modelo, refId, estado);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { mensaje: `Submodelo ${estado}` });
    },

    desconectarSubmodeloSeleccionado(refId) {
      const { modelo, seleccionId, opdActivoId } = get();
      const id = refId ?? refSubmodeloDesdeContexto(modelo, seleccionId, opdActivoId);
      if (!id) {
        set({ mensaje: "No hay submodelo asociado a la selección" });
        return;
      }
      const resultado = desconectarSubmodelo(modelo, id);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        dialogoSubmodeloAbierto: false,
        mensaje: "Submodelo desconectado",
      });
    },

    splitEffectParcialSeleccionado() {
      const { modelo, opdActivoId, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) {
        set({ mensaje: "Selecciona un enlace de efecto para split parcial" });
        return;
      }
      const resultado = splitEffectParcial(modelo, opdActivoId, enlaceSeleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const nuevoEnlaceId = enlaceEscindidoDesdePadre(resultado.value, enlaceSeleccionId);
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        seleccionados: nuevoEnlaceId ? [nuevoEnlaceId] : [],
        modoSeleccion: "simple",
        enlaceSeleccionId: nuevoEnlaceId,
        estadoSeleccionId: null,
        modoEnlace: null,
        mensaje: "Efecto convertido en split parcial",
      });
    },

    recolectarEnlaceContornoSeleccionado() {
      const { modelo, opdActivoId, enlaceSeleccionId } = get();
      const enlacePadreId = enlacePadreContorno(modelo, enlaceSeleccionId);
      if (!enlacePadreId) {
        set({ mensaje: "Selecciona un enlace de contorno en un OPD de refinamiento" });
        return;
      }
      const resultado = recolectarEnlaceExternoEnRefinamiento(modelo, opdActivoId, enlacePadreId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        seleccionados: [enlacePadreId],
        modoSeleccion: "simple",
        enlaceSeleccionId: enlacePadreId,
        estadoSeleccionId: null,
        modoEnlace: null,
        mensaje: "Enlace de contorno recolectado",
      });
    },

    distribuirEnlaceContornoSeleccionado() {
      const { modelo, opdActivoId, enlaceSeleccionId } = get();
      const enlacePadreId = enlacePadreContorno(modelo, enlaceSeleccionId);
      if (!enlacePadreId) {
        set({ mensaje: "Selecciona un enlace de contorno para distribuir" });
        return;
      }
      const resultado = distribuirEnlaceExternoEnRefinamiento(modelo, opdActivoId, enlacePadreId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const derivadoId = enlaceDerivadoEnOpd(resultado.value, opdActivoId, enlacePadreId);
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        seleccionados: derivadoId ? [derivadoId] : [],
        modoSeleccion: "simple",
        enlaceSeleccionId: derivadoId,
        estadoSeleccionId: null,
        modoEnlace: null,
        mensaje: "Enlace de contorno distribuido",
      });
    },

    resolverDecisionSeleccionada() {
      const { modelo, enlaceSeleccionId } = get();
      if (!enlaceSeleccionId) {
        set({ mensaje: "Selecciona una rama o enlace de decisión" });
        return;
      }
      const abanico = abanicoDeEnlace(modelo, enlaceSeleccionId);
      const resultado = abanico
        ? resolverDecisionAbanico(modelo, abanico.id)
        : resolverDecisionEnlace(modelo, enlaceSeleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const elegido = resultado.value.enlaceId ? ` · rama ${resultado.value.enlaceId}` : "";
      set({ mensaje: `Decisión resuelta (${resultado.value.modo})${elegido}` });
    },
  };
}

function targetSeleccionActual(state: ReturnType<GetStore>): TargetSatisfaccionRequisito | null {
  if (state.seleccionId) return { tipo: "entidad", id: state.seleccionId };
  if (state.enlaceSeleccionId) return { tipo: "enlace", id: state.enlaceSeleccionId };
  return null;
}

function refSubmodeloDesdeContexto(modelo: Modelo, seleccionId: Id | null, opdActivoId: Id): Id | null {
  const vista = modelo.opds[opdActivoId]?.vista;
  if (vista?.kind === "submodel-view") return vista.submodeloRefId;
  if (!seleccionId) return null;
  return Object.values(modelo.submodelos ?? {}).find((ref) => ref.anchorEntidadId === seleccionId)?.id ?? null;
}

function enlacePadreContorno(modelo: Modelo, enlaceSeleccionId: Id | null): Id | null {
  if (!enlaceSeleccionId) return null;
  const enlace = modelo.enlaces[enlaceSeleccionId];
  if (!enlace) return null;
  return enlace.derivado?.enlacePadreId ?? enlace.id;
}

function enlaceEscindidoDesdePadre(modelo: Modelo, enlacePadreId: Id): Id | null {
  return Object.values(modelo.enlaces).find((enlace) => enlace.efectoEscindido?.enlacePadreId === enlacePadreId)?.id ?? null;
}

function enlaceDerivadoEnOpd(modelo: Modelo, opdId: Id, enlacePadreId: Id): Id | null {
  const opd = modelo.opds[opdId];
  if (!opd) return null;
  return Object.values(opd.enlaces)
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .find((enlace) => enlace?.derivado?.enlacePadreId === enlacePadreId)?.id ?? null;
}
