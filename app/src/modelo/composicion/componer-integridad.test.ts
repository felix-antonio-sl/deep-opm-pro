import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, descomponerProceso } from "../operaciones";
import { validarReferenciasOpd } from "../../serializacion/validarIntegridad";
import type { Modelo, Resultado } from "../tipos";
import { componerModelos } from "./componer";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function modeloAnclaA(): Modelo {
  let a = crearModelo();
  a = must(crearObjeto(a, a.opdRaizId, { x: 100, y: 100 }, "Ancla"));
  return a;
}

describe("composicion/componer — integridad referencial (no huérfanos)", () => {
  test("componer un B con proceso descompuesto no deja refinamiento huérfano", () => {
    let b = crearModelo();
    b = must(crearProceso(b, b.opdRaizId, { x: 200, y: 120 }, "Operar"));
    const procB = Object.values(b.entidades).find((e) => e.tipo === "proceso")!;
    const desc = must(descomponerProceso(b, b.opdRaizId, procB.id));
    b = desc.modelo;

    const compuesto = must(componerModelos(modeloAnclaA(), b, {}));

    // El refinamiento de la entidad de B debe apuntar a un OPD que EXISTE en el compuesto.
    const procCompuesto = Object.values(compuesto.entidades).find((e) => e.nombre === "Operar")!;
    const opdRef = procCompuesto.refinamientos?.descomposicion?.opdId;
    expect(opdRef).toBeTruthy();
    expect(compuesto.opds[opdRef!]).toBeTruthy();

    // Integridad referencial global del modelo compuesto.
    expect(validarReferenciasOpd(compuesto).ok).toBe(true);
  });

  test("el OPD hijo de B se reidentifica y su padre apunta a un OPD existente", () => {
    let b = crearModelo();
    b = must(crearProceso(b, b.opdRaizId, { x: 200, y: 120 }, "Operar"));
    const procB = Object.values(b.entidades).find((e) => e.tipo === "proceso")!;
    b = must(descomponerProceso(b, b.opdRaizId, procB.id)).modelo;

    const compuesto = must(componerModelos(modeloAnclaA(), b, {}));

    for (const opd of Object.values(compuesto.opds)) {
      if (opd.padreId !== null) {
        expect(compuesto.opds[opd.padreId]).toBeTruthy();
      }
    }
  });
});
