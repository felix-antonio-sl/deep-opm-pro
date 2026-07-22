import { describe, expect, test } from "bun:test";
import { crearAutor } from "../autoria";
import type { DeclaracionNoNuclear } from "../modelo/tipos";
import { exportarModelo, hidratarModelo } from "./json";
import { filtrarModeloPorPerfil } from "./perfilesExport";

function modeloConDeclaraciones() {
  const autor = crearAutor({ id: "declaraciones", nombre: "Declaraciones" });
  autor.opd("sd0", "SD0", null);
  autor.entidad("o", "objeto", "Objeto", "informacional", "sistemica");
  const declaracion: DeclaracionNoNuclear = {
    id: "R-05",
    clase: "restriccion",
    afirmacion: "La responsabilidad permanece en el sistema.",
    targets: [
      { tipo: "modelo" },
      { tipo: "opd", id: autor.idOpd("sd0") },
      { tipo: "entidad", id: autor.id("o") },
    ],
    propietarioSemantico: "autor del modelo",
    procedencia: ["acta D-025"],
    estadoAsercion: "ratificada",
  };
  autor.modelo.declaracionesNoNucleares = { [declaracion.id]: declaracion };
  return autor.modelo;
}

describe("declaraciones no nucleares — serialización y perfiles", () => {
  test("hidratar y reexportar conserva bytes canónicos y no inventa estadoEvaluacion", () => {
    const json = exportarModelo(modeloConDeclaraciones());
    const hidratado = hidratarModelo(json);
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;

    expect(hidratado.value.declaracionesNoNucleares?.["R-05"]).toBeDefined();
    expect(hidratado.value.declaracionesNoNucleares?.["R-05"]?.estadoEvaluacion).toBeUndefined();
    expect(exportarModelo(hidratado.value)).toBe(json);
  });

  test("targets colgantes y clases no declaradas fallan cerrado", () => {
    const base = JSON.parse(exportarModelo(modeloConDeclaraciones())) as {
      modelo: { declaracionesNoNucleares: Record<string, unknown> };
    };
    const colgante = structuredClone(base) as typeof base;
    colgante.modelo.declaracionesNoNucleares["R-05"] = {
      ...(colgante.modelo.declaracionesNoNucleares["R-05"] as object),
      targets: [{ tipo: "enlace", id: "inexistente" }],
    };
    expect(hidratarModelo(JSON.stringify(colgante)).ok).toBe(false);

    const claseInvalida = structuredClone(base) as typeof base;
    claseInvalida.modelo.declaracionesNoNucleares["R-05"] = {
      ...(claseInvalida.modelo.declaracionesNoNucleares["R-05"] as object),
      clase: "workflow",
    };
    expect(hidratarModelo(JSON.stringify(claseInvalida)).ok).toBe(false);

    const idVacio = structuredClone(base) as typeof base;
    idVacio.modelo.declaracionesNoNucleares[""] = {
      ...(idVacio.modelo.declaracionesNoNucleares["R-05"] as object),
      id: "",
    };
    delete idVacio.modelo.declaracionesNoNucleares["R-05"];
    expect(hidratarModelo(JSON.stringify(idVacio)).ok).toBe(false);
  });

  test("intercambio y documento incluyen el portador; diagrama nuclear lo excluye", () => {
    const modelo = modeloConDeclaraciones();
    expect(filtrarModeloPorPerfil(modelo, "intercambio").declaracionesNoNucleares).toBeDefined();
    expect(filtrarModeloPorPerfil(modelo, "canon-documento").declaracionesNoNucleares).toBeDefined();
    expect(filtrarModeloPorPerfil(modelo, "canon-diagrama").declaracionesNoNucleares).toBeUndefined();
  });
});
