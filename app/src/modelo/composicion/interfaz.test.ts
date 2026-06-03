import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../operaciones";
import type { Id, Modelo, Resultado } from "../tipos";
import { resumenComposicion, sugerirCompartidasPorInterfaz } from "./interfaz";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

describe("sugerirCompartidasPorInterfaz", () => {
  test("sugiere compartidas por nombre normalizado y mismo tipo", () => {
    let a = crearModelo("A");
    a = must(crearObjeto(a, a.opdRaizId, { x: 0, y: 0 }, "Cliente"));
    let b = crearModelo("B");
    b = must(crearObjeto(b, b.opdRaizId, { x: 0, y: 0 }, " cliente "));

    expect(sugerirCompartidasPorInterfaz(a, b)).toEqual({
      [Object.values(b.entidades)[0]!.id]: entidadId(a, "Cliente"),
    });
  });

  test("no sugiere si el nombre coincide pero el tipo OPM difiere", () => {
    let a = crearModelo("A");
    a = must(crearObjeto(a, a.opdRaizId, { x: 0, y: 0 }, "Atender"));
    let b = crearModelo("B");
    b = must(crearProceso(b, b.opdRaizId, { x: 0, y: 0 }, "Atender"));

    expect(sugerirCompartidasPorInterfaz(a, b)).toEqual({});
  });

  test("sugiere por id SOLO cuando el nombre también coincide (versión/derivado de A)", () => {
    let a = crearModelo("A");
    a = must(crearObjeto(a, a.opdRaizId, { x: 0, y: 0 }, "Cuenta"));
    let b = crearModelo("B");
    b = must(crearObjeto(b, b.opdRaizId, { x: 0, y: 0 }, "Cuenta"));
    const aId = entidadId(a, "Cuenta");
    const bOriginal = b.entidades[entidadId(b, "Cuenta")]!;
    // B reusa el id de A para la misma entidad (derivado/versión): mismo id + mismo nombre.
    b = {
      ...b,
      entidades: {
        [aId]: { ...bOriginal, id: aId },
      },
      opds: {
        ...b.opds,
        [b.opdRaizId]: {
          ...b.opds[b.opdRaizId]!,
          apariencias: Object.fromEntries(
            Object.values(b.opds[b.opdRaizId]!.apariencias).map((ap) => [ap.id, { ...ap, entidadId: aId }]),
          ),
        },
      },
    };

    expect(sugerirCompartidasPorInterfaz(a, b)).toEqual({ [aId]: aId });
  });

  test("NO fusiona por id si los nombres difieren (modelos independientes con ids secuenciales colisionados)", () => {
    // Dos modelos creados por separado comparten ids secuenciales (o-1, p-1…),
    // pero son entidades semánticamente distintas: el id coincidente es
    // coincidencia, no identidad. Fusionarlas corrompería la composición.
    let a = crearModelo("A");
    a = must(crearObjeto(a, a.opdRaizId, { x: 0, y: 0 }, "Paciente"));
    let b = crearModelo("B");
    b = must(crearObjeto(b, b.opdRaizId, { x: 0, y: 0 }, "Factura"));
    // Precondición del caso: el primer objeto de ambos comparte id secuencial.
    expect(Object.values(a.entidades)[0]!.id).toBe(Object.values(b.entidades)[0]!.id);

    expect(sugerirCompartidasPorInterfaz(a, b)).toEqual({});
  });
});

describe("resumenComposicion (preview del delta antes de componer)", () => {
  test("cuenta entidades nuevas, compartidas y conflictos de linealidad", () => {
    let a = crearModelo("A");
    a = must(crearObjeto(a, a.opdRaizId, { x: 0, y: 0 }, "Cliente"));
    let b = crearModelo("B");
    b = must(crearObjeto(b, b.opdRaizId, { x: 0, y: 0 }, "Cliente"));
    b = must(crearObjeto(b, b.opdRaizId, { x: 100, y: 0 }, "Factura"));
    const clienteA = entidadId(a, "Cliente");
    const clienteB = entidadId(b, "Cliente");

    const r = resumenComposicion(a, b, { [clienteB]: clienteA });
    expect(r).not.toBeNull();
    expect(r!.compartidas).toBe(1);
    expect(r!.entidadesNuevas).toBe(1); // solo "Factura" entra; "Cliente" se fusiona
    expect(r!.conflictosLineal).toBe(0);
  });

  test("reporta conflicto de linealidad en el preview (sin componer en firme)", () => {
    let a = crearModelo("A");
    a = must(crearObjeto(a, a.opdRaizId, { x: 0, y: 0 }, "Bateria"));
    const objA = entidadId(a, "Bateria");
    a = { ...a, entidades: { ...a.entidades, [objA]: { ...a.entidades[objA]!, lineal: true } } };
    a = must(crearProceso(a, a.opdRaizId, { x: 200, y: 0 }, "Motor A"));
    a = must(crearEnlace(a, a.opdRaizId, objA, entidadId(a, "Motor A"), "consumo"));
    let b = crearModelo("B");
    b = must(crearObjeto(b, b.opdRaizId, { x: 0, y: 0 }, "Bateria"));
    const objB = entidadId(b, "Bateria");
    b = { ...b, entidades: { ...b.entidades, [objB]: { ...b.entidades[objB]!, lineal: true } } };
    b = must(crearProceso(b, b.opdRaizId, { x: 200, y: 0 }, "Motor B"));
    b = must(crearEnlace(b, b.opdRaizId, objB, entidadId(b, "Motor B"), "consumo"));

    const r = resumenComposicion(a, b, { [objB]: objA });
    expect(r!.conflictosLineal).toBeGreaterThan(0);
  });
});
