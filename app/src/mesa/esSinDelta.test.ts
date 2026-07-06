import { describe, expect, test } from "bun:test";
import { esSinDelta } from "./esSinDelta";
import { exportarModelo } from "../serializacion/json";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import { agregarNotaMesa } from "../modelo/notasMesa";
import { ratificarAnclaConFuente } from "../modelo/logDecisiones";
import type { AnclaNormativa, Modelo } from "../modelo/tipos";

/**
 * Fixture de ancla PENDIENTE (misma forma que `contextoSkill.test.ts`): la
 * ratificación real (`ratificarAnclaConFuente`) exige `estado ===
 * "pendiente-ratificacion"` + `ratificacion` ya presente.
 */
function anclaPendiente(): AnclaNormativa {
  return {
    id: "an-1",
    claveProto: "ratificar:convenio-ges",
    target: { tipo: "modelo" },
    estado: "pendiente-ratificacion",
    nota: "convenio GES vigente",
    ratificacion: { nivelAutoridad: "mesa", estadoRatificacion: "pendiente" },
  };
}

describe("esSinDelta", () => {
  test("mismo bundle (idéntico) → sin delta", () => {
    const bundle = exportarModelo(crearModelo("RT"));
    expect(esSinDelta(bundle, bundle)).toBe(true);
  });

  test("push de vuelta EXACTAMENTE lo pulled, re-serializado (no-op genuino) → sin delta", () => {
    const bundle = exportarModelo(crearModelo("RT"));
    const compacto = JSON.stringify(JSON.parse(bundle));
    expect(compacto).not.toBe(bundle); // confirma que de verdad son bytes distintos
    expect(esSinDelta(bundle, compacto)).toBe(true);
  });

  test("edición OPM real (nueva entidad) → hay delta", () => {
    const base = crearModelo("RT");
    const r = crearObjeto(base, base.opdRaizId, { x: 0, y: 0 }, "Cosa");
    if (!r.ok) throw new Error(`setup falló: ${r.error}`);
    expect(esSinDelta(exportarModelo(base), exportarModelo(r.value))).toBe(false);
  });

  test("REGRESIÓN CRÍTICA: agregar una nota de mesa → hay delta (antes se perdía silenciosamente)", () => {
    const base = crearModelo("RT");
    const bundleAntes = exportarModelo(base);
    const r = agregarNotaMesa(base, { tipo: "modelo" }, "revisar con hd-dt antes de ratificar", "2026-07-06");
    if (!r.ok) throw new Error(`setup falló: ${r.error}`);
    const bundleDespues = exportarModelo(r.value);
    // Prueba negativa: si esto diera `true`, `cmdPush` abortaría el push que
    // lleva la nota y la mesa la perdería en silencio (el bug hallado en
    // revisión sobre el oráculo `firmaSnapshotSubmodelo`, que excluye `notasMesa`).
    expect(esSinDelta(bundleAntes, bundleDespues)).toBe(false);
  });

  test("REGRESIÓN CRÍTICA: ratificar un ancla normativa pendiente → hay delta (antes se perdía silenciosamente)", () => {
    const base: Modelo = { ...crearModelo("RT"), anclasNormativas: { "an-1": anclaPendiente() } };
    const bundleAntes = exportarModelo(base);
    const r = ratificarAnclaConFuente(base, "ratificar:convenio-ges", "acta mesa 2026-07-06", "2026-07-06");
    if (!r.ok) throw new Error(`setup falló: ${r.error}`);
    const bundleDespues = exportarModelo(r.value);
    // Prueba negativa: si esto diera `true`, `cmdPush` abortaría el push que
    // lleva la ratificación y la mesa la perdería en silencio (`anclasNormativas`
    // también está excluido de `firmaSnapshotSubmodelo`).
    expect(esSinDelta(bundleAntes, bundleDespues)).toBe(false);
  });

  test("cambio de procedencia (sello) → hay delta", () => {
    const base = crearModelo("RT");
    const bundleAntes = exportarModelo(base);
    const modeloB: Modelo = { ...base, procedencia: { protoHash: "abc123", autoriaVersion: "1", layoutVersion: "1" } };
    expect(esSinDelta(bundleAntes, exportarModelo(modeloB))).toBe(false);
  });

  test("cambio de descripción del modelo → hay delta", () => {
    const base = crearModelo("RT");
    const bundleAntes = exportarModelo(base);
    const modeloB: Modelo = { ...base, descripcion: "notas para la próxima mesa técnica" };
    expect(esSinDelta(bundleAntes, exportarModelo(modeloB))).toBe(false);
  });

  test("re-layout puro (mover una apariencia) → HAY delta (dirección segura: ya no se ignora la presentación)", () => {
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
    // Antes (oráculo del Centinela) esto daba `true` (excluye layout); el
    // diseño de Task 7 pedía preservar exactamente ese comportamiento. El
    // fix invierte la decisión a propósito: el guard NUNCA debe volverse
    // "inteligente" sobre qué presentación ignorar — más escrituras de las
    // estrictamente necesarias es el precio correcto de no perder contenido.
    expect(esSinDelta(exportarModelo(modeloA), exportarModelo(modeloB))).toBe(false);
  });

  test("JSON inválido en cualquiera de los dos lados → hay delta (falla abierta, no bloquea)", () => {
    const bundle = exportarModelo(crearModelo("RT"));
    expect(esSinDelta("{esto no es json valido", bundle)).toBe(false);
    expect(esSinDelta(bundle, "{esto no es json valido")).toBe(false);
    expect(esSinDelta("{esto no es json valido", "{tampoco esto}")).toBe(false);
  });
});
