import {
  agregarBoceto,
  editarBoceto,
  eliminarBoceto,
  moverBoceto,
  promoverBoceto,
} from "../modelo/operaciones";
import type { CrearSlice, PizarraSlice } from "./tipos";
import { commitModelo, estadoSeleccionDesdeIds } from "./runtime";
import { addFlash } from "./feedback";

/**
 * Slice de modo pizarra / bosquejo (D7.2).
 *
 * La capa de boceto es parte del Modelo (`Opd.bocetos`) pero NO-SEMÁNTICA: el
 * kernel la ignora (`law-bocetos-no-contaminan`). Por eso mutar bocetos ES
 * commit de modelo (pasa por `commitModelo`, que aplica el guard de solo-lectura
 * y empuja el undo/redo).
 *
 * CRÍTICO (spec D7 / CLAUDE.md §Deuda categorial): `bocetoSeleccionadoId` vive
 * AQUÍ, NUNCA en el trío sellado `seleccionId/enlaceSeleccionId/estadoSeleccionId`.
 * Meterlo ahí dispararía la deuda O(N²) del coproducto-tagged. La selección de
 * pizarra es estado de UI puro (`set` local, sin commit, sin tocar el trío).
 *
 * Coherencia de modos: al entrar a simulación (`simulacion.ts`) o a solo-lectura
 * (`acciones-ui.ts::activarReadOnly`) se apaga este modo desde esas acciones.
 */
export const createPizarraSlice: CrearSlice<PizarraSlice> = (set, get) => ({
  modoPizarra: false,
  herramientaPizarra: null,
  bocetoSeleccionadoId: null,

  activarModoPizarra() {
    set({ modoPizarra: true, mensaje: "Modo pizarra: dibuja bocetos; promuévelos a modelo cuando estén listos." });
  },

  salirModoPizarra() {
    set({ modoPizarra: false, herramientaPizarra: null, bocetoSeleccionadoId: null });
  },

  elegirHerramientaPizarra(tipo) {
    set({ herramientaPizarra: tipo });
  },

  agregarBocetoEnOpd(boceto) {
    const { modelo, opdActivoId } = get();
    const resultado = agregarBoceto(modelo, opdActivoId, boceto);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const commiteado = commitModelo(set, modelo, resultado.value.modelo, {
      bocetoSeleccionadoId: resultado.value.bocetoId,
      mensaje: null,
    });
    if (commiteado) addFlash("✓ Boceto agregado");
  },

  moverBocetoActual(posicion) {
    const { modelo, opdActivoId, bocetoSeleccionadoId } = get();
    if (!bocetoSeleccionadoId) {
      set({ mensaje: "Selecciona un boceto para moverlo" });
      return;
    }
    const resultado = moverBoceto(modelo, opdActivoId, bocetoSeleccionadoId, posicion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { dirtyModelo: false });
  },

  editarBocetoActual(parche) {
    const { modelo, opdActivoId, bocetoSeleccionadoId } = get();
    if (!bocetoSeleccionadoId) {
      set({ mensaje: "Selecciona un boceto para editarlo" });
      return;
    }
    const resultado = editarBoceto(modelo, opdActivoId, bocetoSeleccionadoId, parche);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: null });
  },

  eliminarBocetoActual() {
    const { modelo, opdActivoId, bocetoSeleccionadoId } = get();
    if (!bocetoSeleccionadoId) {
      set({ mensaje: "Selecciona un boceto para eliminarlo" });
      return;
    }
    const resultado = eliminarBoceto(modelo, opdActivoId, bocetoSeleccionadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const commiteado = commitModelo(set, modelo, resultado.value, { bocetoSeleccionadoId: null, mensaje: null });
    if (commiteado) addFlash("✓ Boceto eliminado");
  },

  seleccionarBoceto(id) {
    // Selección LOCAL de pizarra: NO commitModelo, NO toca el trío sellado.
    set({ bocetoSeleccionadoId: id });
  },

  promoverBocetoActual(opciones = {}) {
    const { modelo, opdActivoId, bocetoSeleccionadoId } = get();
    if (!bocetoSeleccionadoId) {
      set({ mensaje: "Selecciona un boceto para promoverlo a modelo" });
      return;
    }
    const resultado = promoverBoceto(modelo, opdActivoId, bocetoSeleccionadoId, opciones);
    if (!resultado.ok) {
      // RECHAZO RUIDOSO: el boceto NO se consume; la app habla y conserva la
      // selección de pizarra para que el autor corrija (p.ej. el nombre).
      set({ mensaje: resultado.error });
      return;
    }
    // Enfoca el hecho creado en el trío sellado (entidad ⇒ seleccionId,
    // enlace ⇒ enlaceSeleccionId), vía el punto único de selección tipada.
    const focoTrio = estadoSeleccionDesdeIds(resultado.value.modelo, [resultado.value.hechoId], "simple");
    const commiteado = commitModelo(set, modelo, resultado.value.modelo, {
      ...focoTrio,
      bocetoSeleccionadoId: null,
      mensaje: null,
    });
    if (commiteado) {
      addFlash(resultado.value.clase === "enlace" ? "✓ Boceto promovido a enlace" : "✓ Boceto promovido a modelo");
    }
  },
});
