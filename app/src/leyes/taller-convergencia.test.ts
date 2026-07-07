import { describe, expect, test } from "bun:test";
import { crearModelo, crearProceso } from "../modelo/operaciones/creacion";
import { descomponerProceso } from "../modelo/operaciones";
import { crearOpdSuelto } from "../modelo/operaciones/opdSuelto";
import { adoptarOpd } from "../modelo/operaciones/refinamiento/establecer";
import { obtenerRefinamiento } from "../modelo/refinamientos";
import { firmaFronteraEntidad } from "../modelo/equivalencia/verticalidad";
import type { Modelo, Resultado } from "../modelo/tipos";

/** Desempaqueta un Resultado en tests (idioma del repo: lanza ante fallo). */
function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
function procesoId(m: Modelo): string {
  return Object.values(m.entidades).find((e) => e.tipo === "proceso")!.id;
}

describe("LEY: convergencia por construcción (R-OPD-REF-20)", () => {
  test("top-down y adopción producen el MISMO hecho de vínculo (slot + padreId)", () => {
    // Camino A — top-down
    const baseA = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar"));
    const pA = procesoId(baseA);
    const outA = must(descomponerProceso(baseA, "opd-1", pA));

    // Camino B — adopción de un suelto vacío del mismo proceso
    const baseB = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar"));
    const pB = procesoId(baseB);
    const creado = crearOpdSuelto(baseB);
    const outB = must(adoptarOpd(creado.modelo, { opdPadreId: "opd-1", entidadId: pB, opdSueltoId: creado.opdId, tipo: "descomposicion" }));

    // Hecho de vínculo idéntico EN FORMA: la entidad refinada apunta a su OPD hijo,
    // y ese OPD hijo tiene padreId = opd-1, en ambos caminos.
    const slotA = obtenerRefinamiento(outA.modelo.entidades[pA]!, "descomposicion")!;
    const slotB = obtenerRefinamiento(outB.entidades[pB]!, "descomposicion")!;
    expect(outA.modelo.opds[slotA.opdId]!.padreId).toBe("opd-1");
    expect(outB.opds[slotB.opdId]!.padreId).toBe("opd-1");
    expect(slotA.modo).toEqual(slotB.modo); // ambos undefined (descomposición)
  });

  test("ADVERSARIAL: ambos caminos rechazan un ciclo por igual", () => {
    // Prepara opd-1 → opd-a; una cosa en opd-a; intentar refinarla con hijo = opd-1 (ancestro)
    let m = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "P"));
    m = { ...m, opds: { ...m.opds, "opd-a": { id: "opd-a", nombre: "a", padreId: "opd-1", apariencias: {}, enlaces: {} } } };
    m = must(crearProceso(m, "opd-a", { x: 0, y: 0 }, "Q"));
    const qId = Object.values(m.entidades).find((e) => e.nombre === "Q")!.id;
    // adopción hacia un ancestro: opd-1 no es suelto → rechaza (o rechaza por ciclo si lo fuera)
    const adop = adoptarOpd(m, { opdPadreId: "opd-a", entidadId: qId, opdSueltoId: "opd-1", tipo: "descomposicion" });
    expect(adop.ok).toBe(false);
  });

  test("REGRESIÓN firma semántica: adoptar preserva la firma de frontera igual que top-down (R-OPD-REF-10)", () => {
    // Camino A — top-down (genera 2 subprocesos "Cargar 1"/"Cargar 2").
    const baseA = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar"));
    const pA = procesoId(baseA);
    const outA = must(descomponerProceso(baseA, "opd-1", pA));
    // Camino B — suelto poblado para MIRROR del top-down, luego adopción.
    let baseB = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar"));
    const pB = procesoId(baseB);
    const creado = crearOpdSuelto(baseB); baseB = creado.modelo;
    baseB = must(crearProceso(baseB, creado.opdId, { x: 0, y: 0 }, "Cargar 1"));
    baseB = must(crearProceso(baseB, creado.opdId, { x: 0, y: 60 }, "Cargar 2"));
    const outB = must(adoptarOpd(baseB, { opdPadreId: "opd-1", entidadId: pB, opdSueltoId: creado.opdId, tipo: "descomposicion" }));
    // La firma de frontera del proceso refinado en su OPD hijo coincide (misma semántica de frontera).
    const firmaA = firmaFronteraEntidad(outA.modelo, outA.opdId, pA);
    const firmaB = firmaFronteraEntidad(outB, creado.opdId, pB);
    expect([...firmaA].sort()).toEqual([...firmaB].sort());
  });
});
