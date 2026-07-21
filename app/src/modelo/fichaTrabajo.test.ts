import { beforeEach, describe, expect, test } from "bun:test";
import { generarOpl } from "../opl/generar";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import { store } from "../store";
import {
  actualizarFichaTrabajo,
  actualizarLentesConocimiento,
  normalizarFichaTrabajo,
  normalizarLentesConocimiento,
} from "./fichaTrabajo";
import { crearModelo } from "./operaciones";

describe("FichaTrabajo y lentes — metadatos metodológicos locales", () => {
  test("normaliza trim, vacíos, enums, duplicados y orden canónico", () => {
    expect(normalizarFichaTrabajo({
      preguntaHabilitante: "  ¿Qué transforma?  ",
      duenoSignificado: "   ",
      tiposModelo: ["realizacion", "dominio", "realizacion"],
      vidaUtil: "referencia-viva",
    })).toEqual({
      preguntaHabilitante: "¿Qué transforma?",
      tiposModelo: ["dominio", "realizacion"],
      vidaUtil: "referencia-viva",
    });
    expect(normalizarFichaTrabajo({ preguntaHabilitante: " " })).toBeUndefined();
    expect(normalizarLentesConocimiento(["salud", "sistemas", "salud"])).toEqual([
      "sistemas",
      "salud",
    ]);
  });

  test("no crea una ficha local paralela cuando existe procedencia", () => {
    const modelo = {
      ...crearModelo("Emitido"),
      procedencia: { protoHash: "abc", autoriaVersion: "1", layoutVersion: "1" },
    };
    const resultado = actualizarFichaTrabajo(modelo, { preguntaHabilitante: "Cambio" });
    expect(resultado).toEqual({
      ok: false,
      error: "La ficha pertenece a la fuente upstream; re-elicita allí el cambio.",
    });
  });

  test("roundtrip conserva ficha y lentes sin alterar OPL", () => {
    const base = crearModelo("Trabajo");
    const conFicha = actualizarFichaTrabajo(base, {
      preguntaHabilitante: "  ¿Qué decisión habilita? ",
      responsableDecision: " Comité ",
      tiposModelo: ["introduccion-operacion", "dominio"],
    });
    if (!conFicha.ok) throw new Error(conFicha.error);
    const conLentes = actualizarLentesConocimiento(conFicha.value, ["software", "sistemas"]);
    const json = exportarModelo(conLentes);
    const hidratado = hidratarModelo(json);
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.fichaTrabajo).toEqual({
      preguntaHabilitante: "¿Qué decisión habilita?",
      responsableDecision: "Comité",
      tiposModelo: ["dominio", "introduccion-operacion"],
    });
    expect(hidratado.value.lentesConocimiento).toEqual(["sistemas", "software"]);
    expect(generarOpl(hidratado.value)).toEqual(generarOpl(base));
    expect(exportarModelo(hidratado.value)).toBe(json);
  });

  test("legacy no materializa los campos y valores inválidos se rechazan", () => {
    const legacy = exportarModelo(crearModelo("Legacy"));
    const hidratado = hidratarModelo(legacy);
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.fichaTrabajo).toBeUndefined();
    expect(hidratado.value.lentesConocimiento).toBeUndefined();

    const invalido = JSON.parse(legacy);
    invalido.modelo.fichaTrabajo = { vidaUtil: "para-siempre" };
    expect(hidratarModelo(JSON.stringify(invalido))).toEqual({
      ok: false,
      error: "Modelo inválido: fichaTrabajo.vidaUtil",
    });
    invalido.modelo.fichaTrabajo = undefined;
    invalido.modelo.lentesConocimiento = ["finanzas"];
    expect(hidratarModelo(JSON.stringify(invalido))).toEqual({
      ok: false,
      error: "Modelo inválido: lentesConocimiento",
    });
  });
});

describe("FichaTrabajo — store reversible", () => {
  beforeEach(() => {
    store.getState().importarJson(exportarModelo(crearModelo("Ficha")));
  });

  test("cada edición cruza un commit con undo y redo", () => {
    const antes = exportarModelo(store.getState().modelo);
    store.getState().actualizarFichaTrabajo({
      preguntaHabilitante: "¿Para qué sirve?",
      tiposModelo: ["dominio"],
    });
    const despues = exportarModelo(store.getState().modelo);
    expect(despues).not.toBe(antes);
    expect(store.getState().puedeDeshacer).toBe(true);

    store.getState().deshacer();
    expect(exportarModelo(store.getState().modelo)).toBe(antes);
    store.getState().rehacer();
    expect(exportarModelo(store.getState().modelo)).toBe(despues);
  });
});
