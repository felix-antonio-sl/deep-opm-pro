import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import { exportarModelo } from "../serializacion/json";
import { feedbackStore } from "../store/feedback";
import { store } from "../store";
import type { Modelo, Resultado } from "../modelo/tipos";

/**
 * LEY silencio-cero (auditoría UX 2026-06-12, C-1): ninguna acción de edición
 * bloqueada por solo-lectura es muda ni miente.
 *
 * Tres cláusulas, para cada acción mutadora bajo readOnly:
 *   1. el modelo NO cambia;
 *   2. `mensaje` queda poblado (el bloqueo HABLA);
 *   3. ningún flash de éxito («✓ …») se emite (el bloqueo NO MIENTE —
 *      el bug original: `addFlash("✓ Enlace creado")` corría incondicional
 *      tras un commit rechazado).
 *
 * Cláusula extra: bajo modo SIMULACIÓN el mensaje nombra el modo y la salida
 * («Modo simulación … ⎋ …»), no el genérico de solo-lectura.
 */

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function modeloBase(): Modelo {
  let m = crearModelo("Ley silencio");
  m = must(crearObjeto(m, m.opdRaizId, { x: 300, y: 0 }, "Pedido"));
  m = must(crearProceso(m, m.opdRaizId, { x: 0, y: 0 }, "Aprobar"));
  return m;
}

function ids(): { objetoId: string; procesoId: string } {
  const entidades = Object.values(store.getState().modelo.entidades);
  return {
    objetoId: entidades.find((e) => e.tipo === "objeto")!.id,
    procesoId: entidades.find((e) => e.tipo === "proceso")!.id,
  };
}

function flashesDeExito(): string[] {
  return feedbackStore.getState().overlays
    .filter((o) => o.tipo === "flash" && o.mensaje.includes("✓"))
    .map((o) => o.mensaje);
}

beforeEach(() => {
  store.getState().salirModoSimulacion();
  store.getState().importarJson(exportarModelo(modeloBase()));
  feedbackStore.getState().clearAll();
  store.setState({ readOnly: true, mensaje: null });
});

afterEach(() => {
  store.setState({ readOnly: false });
  feedbackStore.getState().clearAll();
});

const ACCIONES_MUTADORAS: Array<{ nombre: string; ejecutar: () => void }> = [
  { nombre: "crearObjetoDemo", ejecutar: () => store.getState().crearObjetoDemo() },
  { nombre: "crearProcesoDemo", ejecutar: () => store.getState().crearProcesoDemo() },
  {
    nombre: "crearEnlaceEntreEntidades",
    ejecutar: () => {
      const { objetoId, procesoId } = ids();
      store.getState().crearEnlaceEntreEntidades(objetoId, procesoId, "consumo");
    },
  },
  {
    nombre: "agregarEstadoSmart",
    ejecutar: () => {
      const { objetoId } = ids();
      store.setState({ seleccionId: objetoId });
      store.getState().agregarEstadoSmart();
    },
  },
  {
    nombre: "descomponerSeleccionada",
    ejecutar: () => {
      const { procesoId } = ids();
      store.setState({ seleccionId: procesoId });
      store.getState().descomponerSeleccionada();
    },
  },
];

describe("LEY silencio-cero bajo readOnly", () => {
  for (const accion of ACCIONES_MUTADORAS) {
    test(`${accion.nombre}: no muta, habla y no miente`, () => {
      const antes = exportarModelo(store.getState().modelo);

      accion.ejecutar();

      expect(exportarModelo(store.getState().modelo)).toBe(antes);
      expect(store.getState().mensaje).not.toBeNull();
      expect(flashesDeExito()).toEqual([]);
    });
  }

  test("elegirTipoEnlace: no activa modoEnlace y habla", () => {
    const { objetoId } = ids();
    store.setState({ seleccionId: objetoId });

    store.getState().elegirTipoEnlace("consumo", objetoId);

    expect(store.getState().modoEnlace).toBeNull();
    expect(store.getState().mensaje).not.toBeNull();
  });

  test("iniciarConexionDesdeApariencia: no activa modoEnlace y habla", () => {
    const { objetoId } = ids();
    const opd = store.getState().modelo.opds[store.getState().modelo.opdRaizId]!;
    const apariencia = Object.values(opd.apariencias).find((a) => a.entidadId === objetoId)!;

    store.getState().iniciarConexionDesdeApariencia(apariencia.id, "E");

    expect(store.getState().modoEnlace).toBeNull();
    expect(store.getState().mensaje).not.toBeNull();
  });
});

describe("LEY silencio-cero bajo modo simulación", () => {
  test("el mensaje nombra el modo simulación y cómo salir", () => {
    store.setState({ readOnly: false });
    store.getState().iniciarModoSimulacion();
    expect(store.getState().contextoSimulacion).not.toBeNull();
    store.setState({ mensaje: null });

    const { objetoId, procesoId } = ids();
    store.getState().crearEnlaceEntreEntidades(objetoId, procesoId, "consumo");

    expect(store.getState().mensaje).toContain("Modo simulación");
    expect(store.getState().mensaje).toContain("⎋");
    expect(flashesDeExito()).toEqual([]);

    store.getState().salirModoSimulacion();
  });

  test("elegirTipoEnlace en simulación no enciende el modo enlace", () => {
    store.setState({ readOnly: false });
    store.getState().iniciarModoSimulacion();
    const { objetoId } = ids();

    store.getState().elegirTipoEnlace("consumo", objetoId);

    expect(store.getState().modoEnlace).toBeNull();
    expect(store.getState().mensaje).toContain("Modo simulación");

    store.getState().salirModoSimulacion();
  });
});
