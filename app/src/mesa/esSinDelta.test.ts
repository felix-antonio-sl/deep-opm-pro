import { describe, expect, test } from "bun:test";
import { esSinDelta } from "./esSinDelta";
import { exportarModelo } from "../serializacion/json";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import type { Modelo } from "../modelo/tipos";

describe("esSinDelta", () => {
  test("mismo bundle (idéntico) → sin delta", () => {
    const bundle = exportarModelo(crearModelo("RT"));
    expect(esSinDelta(bundle, bundle)).toBe(true);
  });

  test("edición real (nueva entidad) → hay delta", () => {
    const base = crearModelo("RT");
    const r = crearObjeto(base, base.opdRaizId, { x: 0, y: 0 }, "Cosa");
    if (!r.ok) throw new Error(`setup falló: ${r.error}`);
    const bundleAntes = exportarModelo(base);
    const bundleDespues = exportarModelo(r.value);
    expect(esSinDelta(bundleAntes, bundleDespues)).toBe(false);
  });

  test("cambio SOLO de presentación (mover apariencia) → sin delta (excluye layout)", () => {
    const base = crearModelo("RT");
    const r = crearObjeto(base, base.opdRaizId, { x: 0, y: 0 }, "Cosa");
    if (!r.ok) throw new Error(`setup falló: ${r.error}`);
    const modeloA = r.value;
    const opd = modeloA.opds[modeloA.opdRaizId]!;
    const aparienciaId = Object.keys(opd.apariencias)[0];
    if (!aparienciaId) throw new Error("setup falló: sin apariencia");
    const apariencia = opd.apariencias[aparienciaId]!;
    const modeloB: Modelo = {
      ...modeloA,
      opds: {
        ...modeloA.opds,
        [modeloA.opdRaizId]: {
          ...opd,
          apariencias: {
            ...opd.apariencias,
            [aparienciaId]: { ...apariencia, x: 999, y: 999 },
          },
        },
      },
    };
    expect(esSinDelta(exportarModelo(modeloA), exportarModelo(modeloB))).toBe(true);
  });

  test("re-serialización compacta (mismos datos, bytes distintos) → sin delta", () => {
    const bundle = exportarModelo(crearModelo("RT"));
    const compacto = JSON.stringify(JSON.parse(bundle));
    expect(compacto).not.toBe(bundle); // confirma que de verdad son bytes distintos
    expect(esSinDelta(bundle, compacto)).toBe(true);
  });

  test("JSON inválido en cualquiera de los dos lados → hay delta (falla abierta, no bloquea)", () => {
    const bundle = exportarModelo(crearModelo("RT"));
    expect(esSinDelta("{esto no es json valido", bundle)).toBe(false);
    expect(esSinDelta(bundle, "{esto no es json valido")).toBe(false);
    expect(esSinDelta("{esto no es json valido", "{tampoco esto}")).toBe(false);
  });
});
