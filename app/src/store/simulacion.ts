import { ejecutarCorrida, ejecutarPaso, iniciarSimulacion, reiniciarSimulacion } from "../modelo/simulacion/runner";
import type { CrearSlice, SimulacionSlice } from "./sliceTypes";

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

  iniciarModoSimulacion() {
    const { modelo, opdActivoId, contextoSimulacion, readOnly } = get();
    if (contextoSimulacion !== null) return;
    const contexto = iniciarSimulacion(modelo, opdActivoId);
    set({
      contextoSimulacion: contexto,
      readOnlyPrevSimulacion: readOnly,
      readOnly: true,
      mensaje: contexto.plan.length === 0
        ? "Modo simulación: el OPD activo no tiene procesos."
        : `Modo simulación: ${contexto.plan.length} ${contexto.plan.length === 1 ? "paso" : "pasos"} planificados.`,
    });
  },

  salirModoSimulacion() {
    const { readOnlyPrevSimulacion, contextoSimulacion } = get();
    if (contextoSimulacion === null) return;
    set({
      contextoSimulacion: null,
      readOnly: readOnlyPrevSimulacion ?? false,
      readOnlyPrevSimulacion: null,
      mensaje: "Modo simulación cerrado.",
    });
  },

  ejecutarPasoSimulacion() {
    const { contextoSimulacion, modelo } = get();
    if (!contextoSimulacion) return;
    if (contextoSimulacion.estado === "completado") return;
    const siguiente = ejecutarPaso(modelo, contextoSimulacion);
    set({ contextoSimulacion: siguiente });
  },

  ejecutarCorridaSimulacion() {
    const { contextoSimulacion, modelo } = get();
    if (!contextoSimulacion) return;
    const final = ejecutarCorrida(modelo, contextoSimulacion);
    set({ contextoSimulacion: final });
  },

  reiniciarSimulacionActual() {
    const { contextoSimulacion, modelo } = get();
    if (!contextoSimulacion) return;
    const ctx = reiniciarSimulacion(modelo, contextoSimulacion);
    set({ contextoSimulacion: ctx });
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
