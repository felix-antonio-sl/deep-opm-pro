import { describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import type { Modelo, Resultado } from "../modelo/tipos";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

// W6.5-b: acciones de store del registro [RATIFICAR] — commitModelo ⇒ undoables
// y persistidas; export del LogDecisiones v0 al portapapeles.

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function sembrarConPendiente(): void {
  // El store es singleton compartido entre archivos: otro test puede dejar
  // readOnly activo y commitModelo se bloquearía (patrón workspaceMod.test).
  store.getState().activarReadOnly(false);
  const modelo: Modelo = {
    ...crearModelo("RegistroStore"),
    procedencia: { protoHash: "h-123", autoriaVersion: "1", layoutVersion: "2" },
    anclasNormativas: {
      "an-1": {
        id: "an-1",
        claveProto: "ratificar:convenio-ges",
        target: { tipo: "modelo" },
        estado: "pendiente-ratificacion",
        ratificacion: { nivelAutoridad: "mesa", estadoRatificacion: "pendiente" },
      },
    },
  };
  store.getState().importarJson(exportarModelo(modelo));
}

function registroDe(clave: string) {
  const ancla = Object.values(store.getState().modelo.anclasNormativas ?? {}).find((a) => a.claveProto === clave);
  return ancla?.ratificacion?.estadoRatificacion;
}

describe("store logDecisiones — W6.5-b", () => {
  test("anotarAnclaEnMesa transiciona el registro y es undoable", () => {
    sembrarConPendiente();
    store.getState().anotarAnclaEnMesa("ratificar:convenio-ges");
    expect(registroDe("ratificar:convenio-ges")).toBe("anotado-en-mesa");

    store.getState().deshacer();
    expect(registroDe("ratificar:convenio-ges")).toBe("pendiente");
  });

  test("ratificarAnclaConFuente sin fuente deja mensaje de error y no muta", () => {
    sembrarConPendiente();
    store.getState().ratificarAnclaConFuente("ratificar:convenio-ges", "  ");
    expect(registroDe("ratificar:convenio-ges")).toBe("pendiente");
    expect(store.getState().mensaje).toContain("fuente");
  });

  test("copiarLogDecisionesAlPortapapeles copia el JSON v0 con las entradas", async () => {
    const escrito: string[] = [];
    const navegadorOriginal = globalThis.navigator;
    Object.defineProperty(globalThis, "navigator", {
      value: { clipboard: { writeText: (t: string) => { escrito.push(t); return Promise.resolve(); } } },
      configurable: true,
    });
    try {
      sembrarConPendiente();
      store.getState().anotarAnclaEnMesa("ratificar:convenio-ges");
      await store.getState().copiarLogDecisionesAlPortapapeles();

      expect(escrito).toHaveLength(1);
      const log = JSON.parse(escrito[0]!);
      expect(log.schema).toBe("deep-opm-pro.log-decisiones.v0");
      expect(log.modeloHash).toBe("h-123");
      expect(log.entradas).toHaveLength(1);
      expect(store.getState().mensaje).toContain("1 entrada");
    } finally {
      Object.defineProperty(globalThis, "navigator", { value: navegadorOriginal, configurable: true });
    }
  });

  test("export sin sello de procedencia reporta el bloqueo como mensaje", async () => {
    store.getState().importarJson(exportarModelo(crearModelo("SinSello")));
    await store.getState().copiarLogDecisionesAlPortapapeles();
    expect(store.getState().mensaje).toContain("procedencia");
  });
});
