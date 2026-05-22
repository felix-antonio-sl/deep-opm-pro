// [Ronda 26 / L6 B4] Tests del aviso contextual sobre familias OPL generadas
// desde el canvas (no editables desde el editor libre).
//
// Estos tests cubren la pieza pura del feature: el texto canonico del aviso
// y la regla de activacion (cuando hay >=1 linea no-aplicable por razon
// estructural). El render del componente Preact se valida via smoke
// Playwright (no via bun:test, este repo no tiene DOM-render library en
// el stack de unit tests).
//
// Stack: bun:test (sin DOM).

import { describe, expect, test } from "bun:test";
import { clasificarEdicionOpl } from "../../opl/clasificadorEdicion";
import type { PrevisualizacionOplReverse } from "../../opl/parser";
import { AVISO_FAMILIAS_NO_EDITABLES_TEXTO, hayLineasGeneradasDelCanvas } from "./EditorOplHonesto";

describe("aviso de familias OPL no editables · texto canonico (L6 B4)", () => {
  test("texto del aviso es estable y NO lista familias soportadas", () => {
    // Lista NEGATIVA de palabras que NO deben aparecer (familias soportadas).
    expect(AVISO_FAMILIAS_NO_EDITABLES_TEXTO).not.toContain("descripción");
    expect(AVISO_FAMILIAS_NO_EDITABLES_TEXTO).not.toContain("estructural");
    expect(AVISO_FAMILIAS_NO_EDITABLES_TEXTO).not.toContain("procedural");
    expect(AVISO_FAMILIAS_NO_EDITABLES_TEXTO).not.toContain("agregación");
    expect(AVISO_FAMILIAS_NO_EDITABLES_TEXTO).not.toContain("generalización");
  });

  test("texto del aviso menciona explicitamente las familias NO soportadas", () => {
    expect(AVISO_FAMILIAS_NO_EDITABLES_TEXTO).toContain("abanicos");
    expect(AVISO_FAMILIAS_NO_EDITABLES_TEXTO).toContain("eventos");
    expect(AVISO_FAMILIAS_NO_EDITABLES_TEXTO).toContain("condiciones");
    expect(AVISO_FAMILIAS_NO_EDITABLES_TEXTO).toContain("excepciones");
  });

  test("texto del aviso reconoce el origen canvas para que el usuario sepa donde editar", () => {
    expect(AVISO_FAMILIAS_NO_EDITABLES_TEXTO).toContain("automáticamente desde el canvas");
    expect(AVISO_FAMILIAS_NO_EDITABLES_TEXTO).toContain("no pueden editarse desde aquí");
  });
});

describe("aviso de familias OPL no editables · regla de activacion (L6 B4)", () => {
  test("clasificacion sin lineas no-aplicables NO dispara el aviso", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [],
      patches: [
        { tipo: "renombrar-entidad", linea: 1, entidadId: "e1", anterior: "A", siguiente: "B" },
      ],
    };
    const { lineas } = clasificarEdicionOpl("B es un objeto.", preview);
    expect(hayLineasGeneradasDelCanvas(lineas)).toBe(false);
  });

  test("clasificacion con forma-no-reconocida (syntax-error generico) SI dispara el aviso", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [
        {
          codigo: "syntax-error",
          severidad: "error",
          linea: 1,
          columna: 1,
          mensaje: "La oracion OPL-ES no calza con ninguna sentencia canonica.",
        },
      ],
      patches: [],
    };
    const { lineas } = clasificarEdicionOpl(
      "X es manejado por al menos uno de Y y Z.",
      preview,
    );
    expect(hayLineasGeneradasDelCanvas(lineas)).toBe(true);
  });

  test("clasificacion con unsupported-kernel (familia parsada pero no aplicada) SI dispara el aviso", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [
        {
          codigo: "unsupported-kernel",
          severidad: "error",
          linea: 1,
          columna: 1,
          mensaje: "Edicion inversa no soportada para este tipo.",
        },
      ],
      patches: [],
    };
    const { lineas } = clasificarEdicionOpl(
      "*Proceso* se descompone en *Paso A* y *Paso B*.",
      preview,
    );
    expect(hayLineasGeneradasDelCanvas(lineas)).toBe(true);
  });

  test("clasificacion con unknown-symbol (error de usuario, no estructural) NO dispara el aviso", () => {
    // entidad-no-existe es error del usuario (referencia rota), NO familia generada
    // desde el canvas. El aviso no debe aparecer en ese caso porque el usuario sí
    // puede editar la oración: solo necesita corregir la referencia.
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [
        {
          codigo: "unknown-symbol",
          severidad: "error",
          linea: 1,
          columna: 1,
          mensaje: "La entidad referida no existe en el modelo.",
        },
      ],
      patches: [],
    };
    const { lineas } = clasificarEdicionOpl(
      "*Procesar* consume **Inexistente**.",
      preview,
    );
    expect(hayLineasGeneradasDelCanvas(lineas)).toBe(false);
  });

  test("clasificacion con puntuacion-faltante NO dispara el aviso", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [
        {
          codigo: "syntax-error",
          severidad: "error",
          linea: 1,
          columna: 1,
          mensaje: "La oracion OPL-ES debe terminar en punto.",
        },
      ],
      patches: [],
    };
    const { lineas } = clasificarEdicionOpl("Cliente es un objeto", preview);
    expect(hayLineasGeneradasDelCanvas(lineas)).toBe(false);
  });

  test("clasificacion mixta (1 estructural + 1 aplicable) SI dispara el aviso", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [
        {
          codigo: "unsupported-kernel",
          severidad: "error",
          linea: 2,
          columna: 1,
          mensaje: "Edicion inversa no soportada para este tipo.",
        },
      ],
      patches: [
        { tipo: "renombrar-entidad", linea: 1, entidadId: "e1", anterior: "A", siguiente: "B" },
      ],
    };
    const { lineas } = clasificarEdicionOpl(
      "B es un objeto.\n*Proceso* se descompone en *Paso A*.",
      preview,
    );
    expect(hayLineasGeneradasDelCanvas(lineas)).toBe(true);
  });
});
