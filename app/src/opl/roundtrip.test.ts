// [Ronda 26 / L6 B1] Framework de roundtrip bisimetrico OPL.
//
// Para cada fixture declarada en `fixtures-roundtrip.ts` verifica el ciclo
// completo:
//
//   1. Construye el modelo inicial.
//   2. Genera OPL con `generarOpl`.
//   3. Verifica que la OPL coincide con `oracionesEsperadas` (sanity check
//      del generador antes de reverse-aplicar).
//   4. Crea un modelo vacio y planifica la edicion libre OPL del texto
//      generado en el paso 2.
//   5. Aplica los patches sobre el modelo vacio.
//   6. Genera OPL del modelo recuperado.
//   7. Si la fixture es bisimetricaEstricta, exige que OPL paso 2 == paso 6.
//
// El framework es extensible: agregando fixtures en `fixturesRoundtripExtra`
// o re-armando el catalogo, los tests se actualizan sin tocar este archivo.
// Cuando las lineas L1/L2/L5 merguen sus parsers/aplicadores, sus fixtures
// pasaran a estar cubiertas por bisimetria automaticamente.

import { describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import { fixturesRoundtrip, type FixtureRoundtrip } from "./fixtures-roundtrip";
import { generarOpl } from "./generar";
import { aplicarPatchesOpl, planificarEdicionOplLibre } from "./parser";

describe("OPL roundtrip bisimetrico", () => {
  // Smoke del propio framework: que el catalogo no este vacio. Si alguien
  // elimina fixtures por error la suite explota antes que un test silente.
  test("catalogo de fixtures no esta vacio", () => {
    expect(fixturesRoundtrip().length).toBeGreaterThan(0);
  });

  for (const fixture of fixturesRoundtrip()) {
    test(`roundtrip: ${fixture.nombre}`, () => {
      ejecutarRoundtrip(fixture);
    });
  }
});

/**
 * Ciclo bisimetrico: build → generar → parsear+aplicar sobre vacio → generar.
 *
 * Si `bisimetricaEstricta` es `true` la igualdad linea-por-linea entre OPL
 * inicial y OPL recuperada se exige; en caso contrario se valida solo que
 * el generador inicial produzca lo esperado (util para regresiones de OPL
 * cuyo reverse aun no esta cubierto por el aplicador).
 */
function ejecutarRoundtrip(fixture: FixtureRoundtrip): void {
  const modeloInicial = fixture.construir();

  const opl1 = generarOpl(modeloInicial);
  expect(opl1).toEqual(fixture.oracionesEsperadas);

  if (!fixture.bisimetricaEstricta) return;

  // Reverse desde un modelo vacio: NO heredamos entidades, asi forzamos al
  // aplicador a recrear todo a partir del texto. Si la rueda OPL→AST→patches
  // tiene fugas, las veremos como diff en `opl2`.
  const modeloVacio = crearModelo("roundtrip");
  const texto = opl1.join("\n");
  const preview = planificarEdicionOplLibre(modeloVacio, texto, {
    opdActivoId: modeloVacio.opdRaizId,
  });
  const errores = preview.diagnosticos.filter((diag) => diag.severidad === "error");
  expect(errores).toEqual([]);

  const aplicacion = aplicarPatchesOpl(modeloVacio, preview.patches, modeloVacio.opdRaizId);
  if (!aplicacion.ok) {
    throw new Error(`aplicarPatchesOpl fallo para fixture '${fixture.nombre}': ${aplicacion.error}`);
  }
  const modeloRecuperado = aplicacion.value;

  const opl2 = generarOpl(modeloRecuperado);
  expect(opl2).toEqual(opl1);
}
