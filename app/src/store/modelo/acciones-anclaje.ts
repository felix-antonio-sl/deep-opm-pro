// Slice del Centinela de Drift (corte UI Anclaje α, Fase 1) — la orquestación con efecto
// alrededor del kernel PURO `src/modelo/operaciones/anclaje.ts` (INTOCABLE).
//
// El kernel ya sabe comparar hashes (`evaluarDrift*`), re-congelar (`reSincronizarAnclaje`)
// y soltar (`soltarAnclaje`). Lo que NO existía es el eslabón con persistencia: resolver el
// HASH VIVO de cada biblioteca anclada contra el backend (Postgres/API), para poder evaluar
// drift de verdad. Este slice cose ese eslabón.
//
// Nombres con sufijo `…Entidad` para NO colisionar con las funciones puras del kernel
// (`reSincronizarAnclaje`, `soltarAnclaje`), que se importan y se invocan dentro.
//
// Diseño rector: spec `docs/superpowers/specs/2026-06-26-corte-centinela-drift-ui-design.md`
// §4.1; acta `docs/auditorias/2026-06-26-acta-arranque-centinela-drift.md` (D-B, refuerzo #2:
// el drift se mide contra el backend PERSISTIDO, no contra ediciones de otra pestaña).
import {
  anclarAPieza,
  clonarEntidadConIdFresco,
  evaluarDriftModelo,
  firmaBiblioteca,
  reSincronizarAnclaje,
  soltarAnclaje,
} from "../../modelo/operaciones";
import { posicionLibre } from "../../modelo/layout";
import type { Anclaje, BibliotecaRef, Entidad, Estado, EstadoDrift, Id, Modelo } from "../../modelo/tipos";
import { cargarModeloBackend, persistenciaBackendHabilitada } from "../../persistencia/backend";
import { hidratarModelo } from "../../serializacion/json";
import { commitModelo, type GetStore, type SetStore } from "../runtime";
import type { ModeloSlice } from "../tipos";

/**
 * Fábrica PURA del resolutor de hash vivo que consume el kernel (`evaluarDriftModelo`).
 * Dado un mapa `modeloId → hashVivo|null` (lo que el caller resolvió contra el backend),
 * devuelve la función que el kernel inyecta: `(anclaje) => hashVivo de su biblioteca`.
 * `null` si esa biblioteca no se pudo resolver ⇒ el kernel reporta `no-resuelto` (no inventa).
 *
 * Es el corazón puro y testeable de `cargarYEvaluarDrift`: la ley falsable del fixture
 * (`src/leyes/anclaje-composabilidad.test.ts`) lo ejercita sin tocar la red.
 */
export function construirResolverHashVivo(
  hashesVivos: Record<Id, string | null>,
): (anclaje: Anclaje) => string | null {
  return (anclaje) => hashesVivos[anclaje.biblioteca.modeloId] ?? null;
}

/** modeloId únicos de las bibliotecas ancladas en el modelo (orden de aparición, sin repetir). */
function bibliotecasAncladas(modelo: Modelo): Id[] {
  const vistos = new Set<Id>();
  const ids: Id[] = [];
  for (const entidad of Object.values(modelo.entidades)) {
    const id = entidad.anclaje?.biblioteca.modeloId;
    if (id && !vistos.has(id)) {
      vistos.add(id);
      ids.push(id);
    }
  }
  return ids;
}

/**
 * Resuelve el hash VIVO de UNA biblioteca contra el backend PERSISTIDO. Cualquier fallo
 * (no habilitado, no encontrado, red, hidratación inválida) ⇒ `null` (no se inventa estado).
 * El drift se mide contra lo que el backend tiene guardado, NUNCA contra runtime de otra
 * pestaña (acta de arranque, refuerzo #2).
 */
async function resolverHashVivoBackend(modeloId: Id): Promise<string | null> {
  if (!persistenciaBackendHabilitada()) return null;
  const cargado = await cargarModeloBackend(modeloId);
  if (!cargado.ok) return null;
  const hidratado = hidratarModelo(cargado.value.json);
  if (!hidratado.ok) return null;
  return firmaBiblioteca(hidratado.value);
}

export function accionesAnclaje(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
    driftMap: {},

    async cargarYEvaluarDrift(): Promise<void> {
      const { modelo } = get();
      const modeloIds = bibliotecasAncladas(modelo);
      if (modeloIds.length === 0) {
        set({ driftMap: {} });
        return;
      }
      const hashesVivos: Record<Id, string | null> = {};
      await Promise.all(
        modeloIds.map(async (modeloId) => {
          hashesVivos[modeloId] = await resolverHashVivoBackend(modeloId);
        }),
      );
      // El modelo pudo cambiar mientras resolvíamos; re-leemos para barrer el vigente.
      const driftMap = evaluarDriftModelo(get().modelo, construirResolverHashVivo(hashesVivos));
      set({ driftMap });
    },

    async reSincronizarAnclajeEntidad(id: Id): Promise<void> {
      const { modelo } = get();
      const entidad = modelo.entidades[id];
      const modeloIdBiblioteca = entidad?.anclaje?.biblioteca.modeloId;
      if (!modeloIdBiblioteca) {
        set({ mensaje: "La cosa no está anclada a ninguna biblioteca" });
        return;
      }
      const hashVivo = await resolverHashVivoBackend(modeloIdBiblioteca);
      if (hashVivo === null) {
        set({ mensaje: "No se pudo leer la biblioteca para re-sincronizar" });
        return;
      }
      const resultado = reSincronizarAnclaje(get().modelo, id, hashVivo);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const aplicado = commitModelo(set, get().modelo, resultado.value, {
        mensaje: "Anclaje re-sincronizado con la biblioteca",
      });
      if (aplicado) {
        set({ driftMap: { ...get().driftMap, [id]: "sincronizado" satisfies EstadoDrift } });
      }
    },

    soltarAnclajeEntidad(id: Id): void {
      const { modelo } = get();
      const resultado = soltarAnclaje(modelo, id);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const aplicado = commitModelo(set, modelo, resultado.value, {
        mensaje: "Anclaje soltado: la cosa es ahora una copia propia",
      });
      if (aplicado) {
        const { [id]: _quitado, ...resto } = get().driftMap;
        set({ driftMap: resto });
      }
    },

    // ── La PUERTA del Anclaje (corte "gesto de anclar", B2+B3) ──────────────────
    // Calcar y Anclar son los dos verbos de fundación sobre una Pieza de biblioteca
    // externa. Calcar clona-y-olvida; Anclar = Calcar + atar (invariante "Unlink = Σ").
    // El Calco usa `clonarEntidadConIdFresco` (entidad cruda), NO `injertarEstereotipo`
    // (plantilla del catálogo local). La Pieza aterriza SELECCIONADA reusando el
    // `seleccionId` existente — sin 4º tipo seleccionable (no dispara la deuda O(N²)).
    // Spec: docs/superpowers/specs/2026-06-29-gesto-anclar-puerta-design.md §1.

    calcarPiezaBiblioteca(input: { entidad: Entidad; estados: Estado[] }): void {
      const { modelo, opdActivoId } = get();
      const posicion = posicionLibre(modelo, opdActivoId, input.entidad.tipo);
      const resultado = clonarEntidadConIdFresco(modelo, input.entidad, input.estados, opdActivoId, posicion);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const { modelo: modeloNuevo, entidadId } = resultado.value;
      commitModelo(set, modelo, modeloNuevo, {
        seleccionId: entidadId,
        seleccionados: [entidadId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        estadoSeleccionId: null,
        mensaje: "Pieza calcada al OPD",
      });
    },

    async anclarPiezaBiblioteca(input: {
      entidad: Entidad;
      estados: Estado[];
      modeloId: Id;
      nombre?: string;
    }): Promise<void> {
      // `frozenAtHash` = firma VIVA de la biblioteca leída del backend persistido
      // (mismo cálculo del Centinela), no del modelo en runtime: garantiza que el
      // anclaje arranque sincronizado contra lo que el Centinela comparará luego.
      const frozenAtHash = await resolverHashVivoBackend(input.modeloId);
      if (frozenAtHash === null) {
        set({ mensaje: "No se pudo leer la biblioteca para anclar la Pieza" });
        return;
      }
      const { modelo, opdActivoId } = get();
      const posicion = posicionLibre(modelo, opdActivoId, input.entidad.tipo);
      const clon = clonarEntidadConIdFresco(modelo, input.entidad, input.estados, opdActivoId, posicion);
      if (!clon.ok) {
        set({ mensaje: clon.error });
        return;
      }
      const biblioteca: BibliotecaRef = {
        modeloId: input.modeloId,
        frozenAtHash,
        ...(input.nombre ? { nombre: input.nombre } : {}),
      };
      const anclado = anclarAPieza(clon.value.modelo, clon.value.entidadId, biblioteca, input.entidad.id);
      if (!anclado.ok) {
        set({ mensaje: anclado.error });
        return;
      }
      const aplicado = commitModelo(set, modelo, anclado.value, {
        seleccionId: clon.value.entidadId,
        seleccionados: [clon.value.entidadId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        estadoSeleccionId: null,
        mensaje: "Pieza anclada a la biblioteca",
      });
      if (aplicado) {
        // Arranca sincronizado: el frozen recién congelado == la firma viva.
        set({ driftMap: { ...get().driftMap, [clon.value.entidadId]: "sincronizado" satisfies EstadoDrift } });
      }
    },
  };
}
