import { ejecutarCorrida, ejecutarPaso, iniciarSimulacion, reiniciarSimulacion } from "../modelo/simulacion/runner";
import type { ContextoSimulacion, ModoSimulacion } from "../modelo/simulacion/tipos";
import type { Id } from "../modelo/tipos";
import type { CrearSlice, SimulacionSlice } from "./sliceTypes";
import type { OpmStore } from "./tipos";

/**
 * Slice de simulación (Beta2 / Ronda 17 L2).
 *
 * El contexto vive aquí pero la lógica determinista está en `modelo/simulacion/*`
 * (kernel puro). El slice solo orquesta:
 *   - Snapshot del `readOnly` previo al entrar a modo (P0-readOnly se preserva
 *     para que salir del modo no destruya el solo-lectura del modelo).
 *   - Forzado de `readOnly=true` mientras el modo está activo (impide mutar
 *     `modelo` desde acciones de canvas/inspector vía `commitModelo`).
 *   - Acciones expuestas al UI (BarraSimulacion) para play/step/stop/reset.
 *
 * Decisiones documentadas en HANDOFF tras cierre Beta2.
 */
export const createSimulacionSlice: CrearSlice<SimulacionSlice> = (set, get) => ({
  contextoSimulacion: null,
  readOnlyPrevSimulacion: null,
  autoAvanceSimulacionActivo: false,
  velocidadSimulacion: 1,
  headlessSimulacion: false,

  iniciarModoSimulacion() {
    const { modelo, opdActivoId, contextoSimulacion, readOnly } = get();
    if (contextoSimulacion !== null) return;
    const contexto = iniciarSimulacion(modelo, opdActivoId);
    set({
      contextoSimulacion: contexto,
      readOnlyPrevSimulacion: readOnly,
      autoAvanceSimulacionActivo: false,
      readOnly: true,
      opdActivoId: contexto.plan[0]?.opdId ?? opdActivoId,
      // P0-2 ronda 4: Mapa y Simulacion son mutuamente excluyentes.
      // Al entrar a simulacion, cerramos mapa y modos de edicion.
      vistaMapaActiva: false,
      descriptorMapaCache: null,
      modoEnlace: null,
      modoCreacion: null,
      // P1-5 ronda 4: descartar editor inline al cambiar de modo.
      nuevaCosaPendiente: null,
      mensaje: contexto.plan.length === 0
        ? "Modo simulacion: el OPD activo no tiene procesos."
        : `Modo simulacion: ${contexto.plan.length} ${contexto.plan.length === 1 ? "paso" : "pasos"} planificados.`,
    });
  },

  salirModoSimulacion() {
    const { readOnlyPrevSimulacion, contextoSimulacion } = get();
    if (contextoSimulacion === null) return;
    set({
      contextoSimulacion: null,
      readOnly: readOnlyPrevSimulacion ?? false,
      readOnlyPrevSimulacion: null,
      autoAvanceSimulacionActivo: false,
      mensaje: "Modo simulación cerrado.",
    });
  },

  ejecutarPasoSimulacion() {
    const { contextoSimulacion, modelo, opdActivoId } = get();
    if (!contextoSimulacion) return;
    if (contextoSimulacion.estado === "completado") {
      if (get().autoAvanceSimulacionActivo) set({ autoAvanceSimulacionActivo: false });
      return;
    }
    const pasoPrevio = contextoSimulacion.plan[contextoSimulacion.pasoActual];
    const siguiente = ejecutarPaso(modelo, contextoSimulacion);
    const destino = opdParaMostrar(siguiente, opdActivoId);
    const patch: Partial<OpmStore> = { contextoSimulacion: siguiente };
    if (siguiente.estado === "completado") {
      patch.autoAvanceSimulacionActivo = false;
    }
    if (destino !== opdActivoId) {
      Object.assign(patch, patchNavegacionSimulacion(destino));
    }
    const pasoSiguiente = siguiente.plan[siguiente.pasoActual];
    if (pasoPrevio && pasoSiguiente && pasoPrevio.opdId !== pasoSiguiente.opdId) {
      patch.mensaje = `Simulación: ${pasoSiguiente.opdNombre}`;
    }
    set(patch);
  },

  ejecutarCorridaSimulacion() {
    const { contextoSimulacion, modelo, opdActivoId } = get();
    if (!contextoSimulacion) return;
    const final = ejecutarCorrida(modelo, contextoSimulacion);
    const ultimo = final.plan[final.plan.length - 1];
    const destino = ultimo?.opdId ?? opdActivoId;
    set({
      contextoSimulacion: final,
      autoAvanceSimulacionActivo: false,
      ...(destino !== opdActivoId ? patchNavegacionSimulacion(destino) : {}),
    });
  },

  reiniciarSimulacionActual() {
    const { contextoSimulacion, modelo, opdActivoId } = get();
    if (!contextoSimulacion) return;
    const ctx = reiniciarSimulacion(modelo, contextoSimulacion);
    const destino = ctx.plan[0]?.opdId ?? ctx.opdId;
    set({
      contextoSimulacion: ctx,
      autoAvanceSimulacionActivo: false,
      ...(destino !== opdActivoId ? patchNavegacionSimulacion(destino) : {}),
    });
  },

  iniciarAutoAvanceSimulacion() {
    const { contextoSimulacion } = get();
    if (!contextoSimulacion || contextoSimulacion.plan.length === 0 || contextoSimulacion.estado === "completado") return;
    set({
      autoAvanceSimulacionActivo: true,
      mensaje: "Simulación automática iniciada.",
    });
  },

  pausarAutoAvanceSimulacion() {
    if (!get().autoAvanceSimulacionActivo) return;
    set({
      autoAvanceSimulacionActivo: false,
      mensaje: "Simulación pausada.",
    });
  },

  fijarVelocidadSimulacion(velocidad) {
    set({ velocidadSimulacion: normalizarVelocidadSimulacion(velocidad) });
  },

  alternarHeadlessSimulacion() {
    set({ headlessSimulacion: !get().headlessSimulacion });
  },

  fijarModoSimulacion(modo: ModoSimulacion) {
    const { contextoSimulacion } = get();
    if (!contextoSimulacion) return;
    set({ contextoSimulacion: { ...contextoSimulacion, modo } });
  },

  fijarSemillaSimulacion(semilla: number) {
    const { contextoSimulacion } = get();
    if (!contextoSimulacion) return;
    set({ contextoSimulacion: { ...contextoSimulacion, semilla } });
  },

  asignarValorRuntimeSimulacion(entidadId, valor) {
    const { contextoSimulacion } = get();
    if (!contextoSimulacion) return;
    set({
      contextoSimulacion: {
        ...contextoSimulacion,
        valoresRuntime: { ...contextoSimulacion.valoresRuntime, [entidadId]: valor },
      },
    });
  },
});

export function normalizarVelocidadSimulacion(velocidad: number): number {
  if (!Number.isFinite(velocidad)) return velocidad === Number.POSITIVE_INFINITY ? 4 : 1;
  return Math.min(4, Math.max(0.25, velocidad));
}

function opdParaMostrar(contexto: ContextoSimulacion, fallback: Id): Id {
  return contexto.plan[contexto.pasoActual]?.opdId ?? fallback;
}

function patchNavegacionSimulacion(opdActivoId: Id): Partial<OpmStore> {
  return {
    opdActivoId,
    seleccionId: null,
    seleccionados: [],
    modoSeleccion: "simple",
    enlaceSeleccionId: null,
    modoEnlace: null,
    modoCreacion: null,
    nuevaCosaPendiente: null,
    hoverOplRef: null,
  };
}
