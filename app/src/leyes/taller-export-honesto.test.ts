import { describe, expect, test } from "bun:test";
import { crearModelo, crearProceso } from "../modelo/operaciones/creacion";
import { crearOpdSuelto } from "../modelo/operaciones/opdSuelto";
import { exportarModeloConPerfil, gateOpdsSinAdoptar } from "../serializacion/perfilesExport";
import type { Modelo, Resultado } from "../modelo/tipos";

/** Desempaqueta un Resultado en tests (idioma del repo: lanza ante fallo). */
function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

describe("LEY: export honesto (R-OPD-REF-20)", () => {
  test("modelo con OPD sin adoptar → export canónico BLOQUEA con causa", () => {
    const { modelo } = crearOpdSuelto(crearModelo("M"));
    const r = exportarModeloConPerfil(modelo, "canon-diagrama");
    expect(r.ok).toBe(false);
    expect((r as { error: string }).error).toContain("sin adoptar");
  });

  test("apunte con OPD sin adoptar → NO bloquea (observación)", () => {
    const { modelo } = crearOpdSuelto(crearModelo("M"));
    const r = exportarModeloConPerfil(modelo, "canon-diagrama", null, { esApunte: true });
    expect(r.ok).toBe(true);
  });

  test("modelo sin sueltos → gate ok", () => {
    const m = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "P"));
    expect(gateOpdsSinAdoptar(m).ok).toBe(true);
  });

  test("export intercambio ignora el gate de sueltos (histórico)", () => {
    const { modelo } = crearOpdSuelto(crearModelo("M"));
    expect(exportarModeloConPerfil(modelo, "intercambio").ok).toBe(true);
  });

  test("ruta ZIP (helper de gating): un suelto fugaría al ZIP en modelo → bloquea; en apunte pasa", () => {
    // descargarTodosLosOpdsPngZip itera modelo.opds; un suelto ES un OPD y fugaría.
    // La ruta ZIP consume gateOpdsSinAdoptar(modelo, { esApunte }); falsamos la fuga aquí.
    const { modelo } = crearOpdSuelto(crearModelo("M"));
    expect(gateOpdsSinAdoptar(modelo).ok).toBe(false);
    expect(gateOpdsSinAdoptar(modelo, { esApunte: true }).ok).toBe(true);
  });
});
