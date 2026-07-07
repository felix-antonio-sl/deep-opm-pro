import { describe, expect, test } from "bun:test";
import { crearModelo, crearProceso } from "./creacion";
import { crearOpdSuelto } from "./opdSuelto";
import { adoptarOpd } from "./refinamiento/establecer";
import { obtenerRefinamiento } from "../refinamientos";
import { esOpdSuelto } from "../opdSueltos";
import type { Modelo, Resultado } from "../tipos";

/** Desempaqueta un Resultado en tests (idioma del repo: lanza ante fallo). */
function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
function primerProcesoId(m: Modelo): string {
  return Object.values(m.entidades).find((e) => e.tipo === "proceso")!.id;
}

describe("crearOpdSuelto", () => {
  test("crea un OPD suelto (padreId null, ≠ raíz) e incrementa nextSeq", () => {
    const m0 = crearModelo("M");
    const seq0 = m0.nextSeq;
    const { modelo, opdId } = crearOpdSuelto(m0);
    expect(modelo.opds[opdId]!.padreId).toBeNull();
    expect(opdId).not.toBe(modelo.opdRaizId);
    expect(esOpdSuelto(modelo, opdId)).toBe(true);
    // nextSeq AVANZA (consume el contador único). En un modelo recién creado
    // salta la colisión con la raíz `opd-1`, por lo que puede avanzar más de 1;
    // la invariante falsable es la monotonía estricta, no un delta exacto.
    expect(modelo.nextSeq).toBeGreaterThan(seq0);
    expect(modelo.opds[opdId]!.apariencias).toEqual({});
  });

  test("dos sueltos consecutivos no colisionan de id", () => {
    const a = crearOpdSuelto(crearModelo("M"));
    const b = crearOpdSuelto(a.modelo);
    expect(a.opdId).not.toBe(b.opdId);
  });
});

describe("adoptarOpd", () => {
  test("adopta un suelto como descomposición: fija padre y slot", () => {
    let m: Modelo = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar"));
    const procesoId = primerProcesoId(m);
    const creado = crearOpdSuelto(m); m = creado.modelo;
    const r = adoptarOpd(m, { opdPadreId: "opd-1", entidadId: procesoId, opdSueltoId: creado.opdId, tipo: "descomposicion" });
    expect(r.ok).toBe(true);
    const out = must(r);
    expect(out.opds[creado.opdId]!.padreId).toBe("opd-1");
    expect(obtenerRefinamiento(out.entidades[procesoId]!, "descomposicion")?.opdId).toBe(creado.opdId);
    expect(esOpdSuelto(out, creado.opdId)).toBe(false); // ya no es suelto: fue adoptado
  });

  test("rechaza adoptar un OPD que no es suelto (ya tiene padre)", () => {
    let m: Modelo = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar"));
    const procesoId = primerProcesoId(m);
    m = { ...m, opds: { ...m.opds, "opd-con-padre": { id: "opd-con-padre", nombre: "x", padreId: "opd-1", apariencias: {}, enlaces: {} } } };
    const r = adoptarOpd(m, { opdPadreId: "opd-1", entidadId: procesoId, opdSueltoId: "opd-con-padre", tipo: "descomposicion" });
    expect(r.ok).toBe(false);
  });

  test("rechaza adoptar la raíz", () => {
    const m: Modelo = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar"));
    const procesoId = primerProcesoId(m);
    const r = adoptarOpd(m, { opdPadreId: "opd-1", entidadId: procesoId, opdSueltoId: m.opdRaizId, tipo: "descomposicion" });
    expect(r.ok).toBe(false);
  });
});
