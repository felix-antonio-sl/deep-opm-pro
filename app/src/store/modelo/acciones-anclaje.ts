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
  firmaPieza,
  firmaVivaAnclaje,
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
 * Dado un mapa `modeloId → Modelo|null` (las bibliotecas HIDRATADAS que el caller leyó del backend),
 * devuelve la función que el kernel inyecta: `(anclaje) => firma viva de su biblioteca AL GRANO del
 * anclaje`. Delega en `firmaVivaAnclaje` (kernel): grano biblioteca ⇒ `firmaBiblioteca`; grano pieza
 * ⇒ `firmaPieza` (vecindad RADIO-1) o el centinela de pieza-ausente; biblioteca `null` ⇒ `null`
 * (no-resuelto). El mapa pasa de hash a Modelo porque DOS anclajes a la MISMA biblioteca con piezas
 * distintas necesitan hashes vivos DISTINTOS (la firma se computa por-anclaje, no por-biblioteca).
 *
 * Es el corazón puro y testeable de `cargarYEvaluarDrift`: las leyes del fixture
 * (`src/leyes/anclaje-composabilidad.test.ts`, `anclaje-pieza-grano.test.ts`) lo ejercitan sin red.
 */
export function construirResolverHashVivo(
  bibliotecasVivas: Record<Id, Modelo | null>,
): (anclaje: Anclaje) => string | null {
  return (anclaje) => firmaVivaAnclaje(anclaje, bibliotecasVivas[anclaje.biblioteca.modeloId] ?? null);
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
 * Carga UNA biblioteca HIDRATADA contra el backend PERSISTIDO. Cualquier fallo (no habilitado, no
 * encontrado, red, hidratación inválida) ⇒ `null` (no se inventa estado). El drift se mide contra lo
 * que el backend tiene guardado, NUNCA contra runtime de otra pestaña (acta de arranque, refuerzo #2).
 *
 * Devuelve el `Modelo` completo (no solo su hash) porque el grano PIEZA (C4) exige computar
 * `firmaPieza(biblioteca, piezaId)` por-anclaje: el hash agregado de biblioteca ya no basta.
 */
async function cargarBibliotecaViva(modeloId: Id): Promise<Modelo | null> {
  if (!persistenciaBackendHabilitada()) return null;
  const cargado = await cargarModeloBackend(modeloId);
  if (!cargado.ok) return null;
  const hidratado = hidratarModelo(cargado.value.json);
  if (!hidratado.ok) return null;
  return hidratado.value;
}

export function accionesAnclaje(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  let evaluacionDriftVigente = 0;

  return {
    driftMap: {},

    async cargarYEvaluarDrift(): Promise<void> {
      const evaluacionId = ++evaluacionDriftVigente;
      const { modelo } = get();
      const modeloIds = bibliotecasAncladas(modelo);
      if (modeloIds.length === 0) {
        if (evaluacionId === evaluacionDriftVigente) set({ driftMap: {} });
        return;
      }
      const bibliotecasVivas: Record<Id, Modelo | null> = {};
      await Promise.all(
        modeloIds.map(async (modeloId) => {
          bibliotecasVivas[modeloId] = await cargarBibliotecaViva(modeloId);
        }),
      );
      // Una evaluación anterior nunca puede sobrescribir una más reciente. Esto
      // importa al cambiar rápido de pestaña/modelo: cada corrida resuelve un
      // conjunto distinto de bibliotecas y las respuestas pueden llegar invertidas.
      if (evaluacionId !== evaluacionDriftVigente) return;
      const modeloVigente = get().modelo;
      const bibliotecasVigentes = bibliotecasAncladas(modeloVigente);
      if (!mismosIds(modeloIds, bibliotecasVigentes)) {
        void get().cargarYEvaluarDrift();
        return;
      }
      const driftMap = evaluarDriftModelo(modeloVigente, construirResolverHashVivo(bibliotecasVivas));
      set({ driftMap });
    },

    async reSincronizarAnclajeEntidad(id: Id): Promise<void> {
      const { modelo } = get();
      const entidad = modelo.entidades[id];
      const anclaje = entidad?.anclaje;
      if (!anclaje) {
        set({ mensaje: "La cosa no está anclada a ninguna biblioteca" });
        return;
      }
      const biblioteca = await cargarBibliotecaViva(anclaje.biblioteca.modeloId);
      if (biblioteca === null) {
        set({ mensaje: "No se pudo leer la biblioteca para re-sincronizar" });
        return;
      }
      const hashVivo = firmaBiblioteca(biblioteca);
      // Re-sync SUBE EL GRANO (C4): congela la firma viva de la Pieza ⇒ moderniza un anclaje legacy
      // a grano pieza. `?? undefined` ⇒ si la Pieza ya no existe, no se escribe `frozenAtPieza` (no
      // se modela una pieza fantasma); el frozen de biblioteca igual se refresca al hash vivo.
      const frozenAtPiezaVivo = firmaPieza(biblioteca, anclaje.piezaId) ?? undefined;
      const resultado = reSincronizarAnclaje(get().modelo, id, hashVivo, frozenAtPiezaVivo);
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
      // La firma VIVA se congela leyendo la biblioteca del backend PERSISTIDO (mismo cálculo del
      // Centinela), no del modelo en runtime: garantiza que el anclaje arranque sincronizado contra
      // lo que el Centinela comparará luego. `frozenAtHash` = firma de biblioteca (REQUERIDA, legacy);
      // `frozenAtPieza` = firma de la vecindad RADIO-1 de la Pieza (C4): el gesto ya nace a grano pieza.
      const bibliotecaViva = await cargarBibliotecaViva(input.modeloId);
      if (bibliotecaViva === null) {
        set({ mensaje: "No se pudo leer la biblioteca para anclar la Pieza" });
        return;
      }
      const frozenAtHash = firmaBiblioteca(bibliotecaViva);
      const frozenAtPieza = firmaPieza(bibliotecaViva, input.entidad.id) ?? undefined;
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
      const anclado = anclarAPieza(clon.value.modelo, clon.value.entidadId, biblioteca, input.entidad.id, frozenAtPieza);
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

function mismosIds(a: readonly Id[], b: readonly Id[]): boolean {
  return a.length === b.length && a.every((id) => b.includes(id));
}
