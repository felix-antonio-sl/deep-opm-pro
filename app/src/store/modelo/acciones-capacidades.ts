import { abanicoDeEnlace } from "../../modelo/abanicos";
import { esRequisito } from "../../modelo/estereotipos";
import { componerModelos, verificarLinealidad } from "../../modelo/composicion";
import { resolverDecisionAbanico, resolverDecisionEnlace } from "../../modelo/decision";
import {
  actualizarMaterializacionSubmodelo,
  conectarSubmodelo,
  crearEstereotipoDesdeSeleccion,
  crearRequirementView,
  crearRequisito,
  definirOntologiaOrganizacional,
  descargarVistaSubmodelo,
  desconectarSubmodelo,
  distribuirEnlaceExternoEnRefinamiento,
  injertarEstereotipo,
  marcarEntidadComoRequisito,
  marcarEstadoSubmodelo,
  recolectarEnlaceExternoEnRefinamiento,
  satisfacerRequisito,
  splitEffectParcial,
} from "../../modelo/operaciones";
import { posicionLibre, solapa } from "../../modelo/layout";
import { derivar } from "../../modelo/razonamiento";
import { observarPreservacionFrontera } from "../../modelo/equivalencia";
import { obtenerRefinamiento } from "../../modelo/refinamientos";
import type { Id, Modelo, Resultado, TargetSatisfaccionRequisito } from "../../modelo/tipos";
import { cargarModeloBackend, persistenciaBackendHabilitada } from "../../persistencia/backend";
import { exportarModelo, hidratarModelo } from "../../serializacion/json";
import { validarReferenciasOpd } from "../../serializacion/validarIntegridad";
import { commitModelo, estadoSeleccionDesdeIds, type GetStore, type SetStore } from "../runtime";
import { captureSessionEpoch, isSessionEpochCurrent } from "../sessionEpoch";
import type { ModeloSlice } from "../tipos";

export function accionesCapacidades(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
    dialogoOntologiaAbierto: false,
    dialogoRequisitoAbierto: null,
    dialogoSubmodeloAbierto: false,
    dialogoComposicionAbierto: false,
    vitrinaEstereotiposAbierta: false,

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
      const state = get();
      const { modelo, opdActivoId } = state;
      const target = targetInicialRequisito(state);
      const resultado = crearRequisito(
        modelo,
        opdActivoId,
        posicionNuevoRequisito(modelo, opdActivoId, target),
        input.nombre,
        input.metadata,
      );
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      let modeloFinal = resultado.value.modelo;
      let mensaje = "Requisito creado";
      if (target) {
        const vinculado = satisfacerRequisito(
          modeloFinal,
          resultado.value.requisitoEntidadId,
          target,
          input.metadata.satisfaction ?? "pendiente",
        );
        if (!vinculado.ok) {
          set({ mensaje: vinculado.error });
          return;
        }
        modeloFinal = vinculado.value;
        mensaje = target.tipo === "entidad" ? "Requisito creado y vinculado a la cosa" : "Requisito creado y vinculado al enlace";
      }
      commitModelo(set, modelo, modeloFinal, {
        seleccionId: target?.tipo === "entidad" ? target.id : target ? null : resultado.value.requisitoEntidadId,
        seleccionados: target ? [target.id] : [resultado.value.requisitoEntidadId],
        modoSeleccion: "simple",
        enlaceSeleccionId: target?.tipo === "enlace" ? target.id : null,
        estadoSeleccionId: null,
        dialogoRequisitoAbierto: null,
        mensaje,
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
      const existente = opdVistaRequisito(modelo, seleccionId);
      if (existente) {
        set({
          opdActivoId: existente,
          seleccionId,
          seleccionados: [seleccionId],
          modoSeleccion: "simple",
          enlaceSeleccionId: null,
          estadoSeleccionId: null,
          modoEnlace: null,
          mensaje: "Vista de requisito abierta",
        });
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

    abrirDialogoComposicion() {
      set({ dialogoComposicionAbierto: true, mensaje: null });
    },

    cerrarDialogoComposicion() {
      set({ dialogoComposicionAbierto: false });
    },

    componerConModeloGuardado(input) {
      const { modelo } = get();
      const sessionEpoch = captureSessionEpoch();
      const pestanaOrigenId = get().pestanaActivaId;
      const snapshotOrigen = exportarModelo(modelo);
      const aplicarComposicion = (modeloB: Modelo) => {
        if (!asyncOriginIsCurrent(get, sessionEpoch, pestanaOrigenId, snapshotOrigen)) return;
        const resultado = componerModelos(modelo, modeloB, input.compartidas ?? {});
        if (!resultado.ok) {
          set({ mensaje: resultado.error });
          return;
        }
        const integridad = validarReferenciasOpd(resultado.value);
        if (!integridad.ok) {
          set({ mensaje: `Composición bloqueada · integridad rota · ${integridad.error}` });
          return;
        }
        const totalCompartidas = Object.keys(input.compartidas ?? {}).length;
        // Confianza calibrada: advertir si la fusión creó un conflicto de recurso
        // lineal (objeto lineal con múltiples consumidores). No bloquea —es undoable—
        // pero no se fusiona a un estado inválido en silencio.
        const conflictosLineal = verificarLinealidad(resultado.value).filter((o) => o.severidad === "error-linealidad");
        const avisoLineal = conflictosLineal.length > 0
          ? ` · △ ${conflictosLineal.length} mejora${conflictosLineal.length === 1 ? "" : "s"} de linealidad; no bloquea`
          : "";
        commitModelo(set, modelo, resultado.value, {
          opdActivoId: modelo.opdRaizId,
          seleccionId: null,
          seleccionados: [],
          modoSeleccion: "simple",
          enlaceSeleccionId: null,
          estadoSeleccionId: null,
          modoEnlace: null,
          dialogoComposicionAbierto: false,
          mensaje: `Modelo compuesto con "${modeloB.nombre}" (${totalCompartidas} compartida${totalCompartidas === 1 ? "" : "s"})${avisoLineal}`,
        });
      };
      if (persistenciaBackendHabilitada()) {
        set({ mensaje: "Cargando modelo para composición desde servidor..." });
        void cargarModeloBackend(input.modeloId).then((cargado) => {
          if (!asyncOriginIsCurrent(get, sessionEpoch, pestanaOrigenId, snapshotOrigen)) return;
          if (!cargado.ok) {
            set({ mensaje: cargado.error });
            return;
          }
          const hidratado = hidratarModelo(cargado.value.json);
          if (!hidratado.ok) {
            set({ mensaje: `No se pudo cargar el modelo para composición: ${hidratado.error}` });
            return;
          }
          aplicarComposicion(hidratado.value);
        });
        return;
      }
      set({ mensaje: "Backend de modelos no disponible" });
    },

    abrirVitrinaEstereotipos() {
      set({ vitrinaEstereotiposAbierta: true, mensaje: null });
    },

    cerrarVitrinaEstereotipos() {
      set({ vitrinaEstereotiposAbierta: false });
    },

    injertarEstereotipoEnOpd(estereotipoId) {
      const { modelo, opdActivoId } = get();
      const posicion = posicionLibre(modelo, opdActivoId, "objeto");
      const resultado = injertarEstereotipo(modelo, estereotipoId, opdActivoId, posicion);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const { modelo: modeloNuevo, entidadesCreadas, anclaId } = resultado.value;
      commitModelo(set, modelo, modeloNuevo, {
        seleccionId: anclaId ?? null,
        seleccionados: entidadesCreadas,
        modoSeleccion: entidadesCreadas.length > 1 ? "multi" : "simple",
        enlaceSeleccionId: null,
        estadoSeleccionId: null,
        mensaje: "Estereotipo injertado",
      });
    },

    crearEstereotipoDesdeSeleccionActual(nombre, opts) {
      const { modelo, opdActivoId, seleccionados } = get();
      if (seleccionados.length === 0) {
        set({ mensaje: "Selecciona cosas para guardar como estereotipo" });
        return;
      }
      const resultado = crearEstereotipoDesdeSeleccion(modelo, opdActivoId, seleccionados, nombre, opts);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      // No cambia la selección: el autor conserva el subgrafo que acaba de curar.
      commitModelo(set, modelo, resultado.value.modelo, {
        mensaje: `Estereotipo creado: ${nombre}`,
      });
    },

    conectarSubmodeloSeleccionado(input) {
      const { modelo, seleccionId, opdActivoId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona la cosa que ancla el submodelo" });
        return;
      }
      const sessionEpoch = captureSessionEpoch();
      const pestanaOrigenId = get().pestanaActivaId;
      const snapshotOrigen = exportarModelo(modelo);
      const conectar = (snapshot: Resultado<Modelo | undefined>) => {
        if (!asyncOriginIsCurrent(get, sessionEpoch, pestanaOrigenId, snapshotOrigen)) return;
        if (!snapshot.ok) {
          set({ mensaje: snapshot.error });
          return;
        }
        const resultado = conectarSubmodelo(modelo, {
          anchorEntidadId: seleccionId,
          modeloId: input.modeloId,
          nombre: input.nombre,
          anchorOpdId: opdActivoId,
          ...(input.compartidas ? { compartidas: input.compartidas } : {}),
          ...(snapshot.value ? { snapshot: snapshot.value } : {}),
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
          mensaje: snapshot.value ? "Submodelo conectado y cargado" : "Submodelo conectado",
        });
      };
      if (persistenciaBackendHabilitada()) {
        set({ mensaje: "Cargando submodelo desde servidor..." });
        void cargarSnapshotSubmodelo(input.modeloId).then(conectar);
        return;
      }
      set({ mensaje: "Backend de modelos no disponible" });
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

    actualizarSubmodeloSeleccionado(refId) {
      const { modelo, seleccionId, opdActivoId } = get();
      const id = refId ?? refSubmodeloDesdeContexto(modelo, seleccionId, opdActivoId);
      if (!id) {
        set({ mensaje: "No hay submodelo asociado a la selección" });
        return;
      }
      const ref = modelo.submodelos?.[id];
      if (!ref) {
        set({ mensaje: "Submodelo no encontrado" });
        return;
      }
      const sessionEpoch = captureSessionEpoch();
      const pestanaOrigenId = get().pestanaActivaId;
      const snapshotOrigen = exportarModelo(modelo);
      const actualizar = (snapshot: Resultado<Modelo | undefined>) => {
        if (!asyncOriginIsCurrent(get, sessionEpoch, pestanaOrigenId, snapshotOrigen)) return;
        if (!snapshot.ok) {
          set({ mensaje: snapshot.error });
          return;
        }
        if (!snapshot.value) {
          set({ mensaje: "No se encontró el modelo del submodelo" });
          return;
        }
        const resultado = actualizarMaterializacionSubmodelo(modelo, id, snapshot.value);
        if (!resultado.ok) {
          set({ mensaje: resultado.error });
          return;
        }
        commitModelo(set, modelo, resultado.value.modelo, {
          mensaje: "Submodelo actualizado",
        });
      };
      if (persistenciaBackendHabilitada()) {
        set({ mensaje: "Cargando submodelo desde servidor..." });
        void cargarSnapshotSubmodelo(ref.source?.modeloId ?? ref.modeloId).then(actualizar);
        return;
      }
      set({ mensaje: "Backend de modelos no disponible" });
    },

    descargarSubmodeloSeleccionado(refId) {
      const { modelo, seleccionId, opdActivoId } = get();
      const id = refId ?? refSubmodeloDesdeContexto(modelo, seleccionId, opdActivoId);
      if (!id) {
        set({ mensaje: "No hay submodelo asociado a la selección" });
        return;
      }
      const resultado = descargarVistaSubmodelo(modelo, id);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { mensaje: "Vista de submodelo descargada" });
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

    consultarRazonamiento(consulta) {
      const { modelo } = get();
      const derivados = derivar(modelo, consulta);
      const nombre = (id: Id): string => modelo.entidades[id]?.nombre ?? "(?)";

      // impacto-de-eliminar: advertencia. El resultado son sobre todo enlaces,
      // que no encajan en la multiselección (singular); se reporta por toast.
      if (consulta.tipo === "impacto-de-eliminar") {
        set({ mensaje: `Eliminar "${nombre(consulta.elementoId)}" afectaría ${derivados.length} hecho(s) derivado(s)` });
        return;
      }

      // alcanzable: ¿la entidad puede llegar al estado meta? (no vacío = sí). Se
      // reporta por toast; el camino son estados+procesos, no encaja en multiselección.
      if (consulta.tipo === "alcanzable") {
        const objetivo = nombre(consulta.entidadId);
        set({
          mensaje: derivados.length > 0
            ? `El estado "${consulta.estado}" de "${objetivo}" es alcanzable`
            : `El estado "${consulta.estado}" de "${objetivo}" NO es alcanzable`,
        });
        return;
      }

      // impacto-aguas-abajo: se resalta el CONO COMPLETO en el canvas — las cosas
      // afectadas y los enlaces que propagan el impacto (las rutas de la cascada).
      // estadoSeleccionDesdeIds + la proyección admiten ids mixtos entidad/enlace.
      if (consulta.tipo === "impacto-aguas-abajo") {
        const cosas = [...new Set(derivados.map((h) => h.entidadId).filter((id): id is Id => Boolean(id)))];
        if (cosas.length === 0) {
          set({ mensaje: `Cono estructural desde "${nombre(consulta.elementoId)}" · sin cosas alcanzables aguas abajo; no prueba causalidad` });
          return;
        }
        const enlaces = derivados.map((h) => h.enlaceId).filter((id): id is Id => Boolean(id));
        set({
          ...estadoSeleccionDesdeIds(modelo, [...new Set([...cosas, ...enlaces])], "simple"),
          mensaje: `Cono estructural desde "${nombre(consulta.elementoId)}" · ${cosas.length} cosa(s) y ${enlaces.length} enlace(s) alcanzables aguas abajo; no prueba causalidad ni equivalencia conductual`,
        });
        return;
      }

      // afectan-a / requerido-por: el subgrafo derivado son COSAS; se proyectan
      // a la selección múltiple del canvas (halo existente) + toast con conteo.
      const cosas =
        consulta.tipo === "afectan-a"
          ? derivados.map((h) => h.procesoId)
          : derivados.map((h) => h.entidadId);
      const ids = [...new Set(cosas.filter((id): id is Id => Boolean(id)))];

      if (ids.length === 0) {
        const objetivo = consulta.tipo === "afectan-a" ? consulta.entidadId : consulta.procesoId;
        set({
          mensaje:
            consulta.tipo === "afectan-a"
              ? `Nada afecta a "${nombre(objetivo)}"`
              : `"${nombre(objetivo)}" no requiere precondiciones`,
        });
        return;
      }

      const mensaje =
        consulta.tipo === "afectan-a"
          ? `${ids.length} proceso(s) afectan a "${nombre(consulta.entidadId)}"`
          : `"${nombre(consulta.procesoId)}" requiere ${ids.length} cosa(s)`;
      set({ ...estadoSeleccionDesdeIds(modelo, ids, "simple"), mensaje });
    },

    verificarCoherenciaDescomposicion() {
      const { modelo, seleccionId } = get();
      const entidad = seleccionId ? modelo.entidades[seleccionId] : null;
      if (!entidad || entidad.tipo !== "proceso" || !obtenerRefinamiento(entidad, "descomposicion")) {
        set({ mensaje: "Selecciona un proceso descompuesto para verificar la coherencia de su frontera" });
        return;
      }
      // Preservación de firma (F2): condición necesaria, no suficiente, de
      // equivalencia conductual. observarPreservacionFrontera lista las incoherentes.
      const incoherencia = observarPreservacionFrontera(modelo).find((obs) => obs.procesoId === entidad.id);
      if (!incoherencia) {
        set({ mensaje: `✓ La descomposición de "${entidad.nombre}" preserva su frontera` });
        return;
      }
      set({ mensaje: `La descomposición de "${entidad.nombre}" NO preserva la frontera: difiere en ${incoherencia.diferencias.join(", ")}` });
    },
  };
}

function targetSeleccionActual(state: ReturnType<GetStore>): TargetSatisfaccionRequisito | null {
  if (state.seleccionId) return { tipo: "entidad", id: state.seleccionId };
  if (state.enlaceSeleccionId) return { tipo: "enlace", id: state.enlaceSeleccionId };
  return null;
}

function targetInicialRequisito(state: ReturnType<GetStore>): TargetSatisfaccionRequisito | null {
  const target = targetSeleccionActual(state);
  if (!target) return null;
  if (target.tipo === "entidad" && esRequisito(state.modelo.entidades[target.id])) return null;
  return target;
}

function posicionNuevoRequisito(modelo: Modelo, opdActivoId: Id, target: TargetSatisfaccionRequisito | null): { x: number; y: number } {
  const fallback = posicionLibre(modelo, opdActivoId, "objeto");
  if (target?.tipo !== "entidad") return fallback;
  const opd = modelo.opds[opdActivoId];
  const apariencia = Object.values(opd?.apariencias ?? {}).find((item) => item.entidadId === target.id);
  if (!apariencia) return fallback;
  const candidata = {
    x: apariencia.x + apariencia.width + 76,
    y: apariencia.y,
  };
  const ocupada = Object.values(opd?.apariencias ?? {}).some((item) => solapa(candidata, item));
  return ocupada ? fallback : candidata;
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

function opdVistaRequisito(modelo: Modelo, requisitoEntidadId: Id): Id | null {
  return Object.values(modelo.opds).find((opd) => opd.vista?.kind === "requirement-view" && opd.vista.requisitoEntidadId === requisitoEntidadId)?.id ?? null;
}

function asyncOriginIsCurrent(
  get: GetStore,
  sessionEpoch: number,
  pestanaOrigenId: string,
  snapshotOrigen: string,
): boolean {
  const estado = get();
  return isSessionEpochCurrent(sessionEpoch) &&
    !estado.requiereLogin &&
    estado.pestanaActivaId === pestanaOrigenId &&
    exportarModelo(estado.modelo) === snapshotOrigen;
}

async function cargarSnapshotSubmodelo(modeloId: Id): Promise<Resultado<Modelo | undefined>> {
  const cargado = await cargarModeloBackend(modeloId);
  if (!cargado.ok) return { ok: false, error: cargado.error };
  const hidratado = hidratarModelo(cargado.value.json);
  if (!hidratado.ok) return { ok: false, error: `No se pudo cargar el submodelo: ${hidratado.error}` };
  return { ok: true, value: hidratado.value };
}
