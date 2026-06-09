import { describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import type { Modelo } from "../modelo/tipos";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

// W6.0: contador automático de cruces del puente app↔skill (observable de g3,
// acta mesa equilibrio delib. 2: "sin contador, g3 es infalsable"). Un cruce es
// inequívoco en dos casos: exportar el contexto para la skill (lado app→skill)
// e importar un modelo CON sello de procedencia (lado skill→app: solo el
// compilador de autoría emite sellos). Los tests miden DELTAS (el store es
// singleton compartido entre archivos de test).

function cruces() {
  return store.getState().indice.preferenciasUi?.crucesPuenteSkill ?? { exportes: 0, importes: 0 };
}

function modeloConProcedencia(): Modelo {
  return {
    ...crearModelo("Emitido"),
    procedencia: { protoHash: "abc123", autoriaVersion: "1", layoutVersion: "2" },
  };
}

describe("crucesPuenteSkill — observable g3 del puente W6.0", () => {
  test("registrarCrucePuenteSkill('export') incrementa exportes y devuelve el acumulado", () => {
    const antes = cruces();
    const resultado = store.getState().registrarCrucePuenteSkill("export");
    expect(resultado.exportes).toBe(antes.exportes + 1);
    expect(resultado.importes).toBe(antes.importes);
    expect(cruces()).toEqual(resultado);
  });

  test("importarJson de un modelo CON procedencia cuenta un cruce de importación", () => {
    const antes = cruces();
    store.getState().importarJson(exportarModelo(modeloConProcedencia()));
    expect(cruces().importes).toBe(antes.importes + 1);
  });

  test("importarJson de un modelo SIN procedencia NO cuenta cruce (no vino del compilador)", () => {
    const antes = cruces();
    store.getState().importarJson(exportarModelo(crearModelo("Manual")));
    expect(cruces().importes).toBe(antes.importes);
  });

  test("importarJson inválido no cuenta cruce", () => {
    const antes = cruces();
    store.getState().importarJson("{esto no es un modelo}");
    expect(cruces()).toEqual(antes);
  });

  test("copiarContextoSkillAlPortapapeles copia el markdown, cuenta el cruce y reporta cruce #N", async () => {
    const escrito: string[] = [];
    const navegadorOriginal = globalThis.navigator;
    Object.defineProperty(globalThis, "navigator", {
      value: { clipboard: { writeText: (t: string) => { escrito.push(t); return Promise.resolve(); } } },
      configurable: true,
    });
    try {
      store.getState().importarJson(exportarModelo(modeloConProcedencia()));
      const antes = cruces();
      await store.getState().copiarContextoSkillAlPortapapeles();

      expect(escrito).toHaveLength(1);
      expect(escrito[0]).toContain("# Contexto de modelado — Emitido");
      expect(escrito[0]).toContain("## OPL");
      expect(cruces().exportes).toBe(antes.exportes + 1);
      expect(store.getState().mensaje).toBe(`Contexto copiado para la skill (cruce #${antes.exportes + 1})`);
    } finally {
      Object.defineProperty(globalThis, "navigator", { value: navegadorOriginal, configurable: true });
    }
  });
});
