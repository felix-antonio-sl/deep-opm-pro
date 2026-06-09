// H5 (solicitud upstream hd-opm observabilidad 2026-06-09): `aparecerEnlacePorTransicion`
// sube a la librería el lookup que el consumidor reimplementaba a mano (helper
// `idEnlaceTransicion` en hd-opm). Resuelve un multi-edge por (origen, destino,
// tipo) + (estadoEntrada, estadoSalida) — entrada/salida son nombres de estado de
// la entidad DESTINO — y co-aparece. Complementa F1 (aparecerEnlacePorId).

import { describe, expect, test } from "bun:test";
import { crearAutor } from "./index";

function autorMultiEdge() {
  const a = crearAutor({ id: "x", nombre: "X" });
  a.entidad("p", "proceso", "Evaluacion de la solicitud", "fisica", "sistemica");
  a.entidad("o", "objeto", "Solicitud", "informacional", "sistemica");
  a.estados("o", ["recibida", "aceptada", "rechazada"], "recibida");
  a.opd("sd", "SD", null);
  a.ver("sd", "p", 0, 0);
  a.ver("sd", "o", 200, 0);
  const eAcepta = a.enlazar("sd", "p", "o", "efecto", { entrada: "recibida", salida: "aceptada" });
  const eRechaza = a.enlazar("sd", "p", "o", "efecto", { entrada: "recibida", salida: "rechazada" });
  if (!eAcepta || !eRechaza) throw new Error("enlazar devolvió null");
  a.opd("vista", "SD-Vista", null);
  a.vistaGenerica("vista");
  return { a, eAcepta, eRechaza };
}

describe("H5 — aparecerEnlacePorTransicion (multi-edge por transición de estado)", () => {
  test("resuelve por (entrada, salida) y co-aparece el enlace correcto", () => {
    const { a, eAcepta } = autorMultiEdge();

    const apId = a.aparecerEnlacePorTransicion("vista", "p", "o", "efecto", "recibida", "aceptada");

    expect(apId).toMatch(/^ae-\d+$/);
    const apariciones = Object.values(a.modelo.opds["opd-vista"]!.enlaces);
    expect(apariciones).toHaveLength(1);
    expect(apariciones[0]!.enlaceId).toBe(eAcepta);
  });

  test("distingue las dos transiciones del mismo par origen→destino+tipo", () => {
    const { a, eAcepta, eRechaza } = autorMultiEdge();

    const apA = a.aparecerEnlacePorTransicion("vista", "p", "o", "efecto", "recibida", "aceptada");
    const apR = a.aparecerEnlacePorTransicion("vista", "p", "o", "efecto", "recibida", "rechazada");

    const enlaces = a.modelo.opds["opd-vista"]!.enlaces;
    expect(enlaces[apA]!.enlaceId).toBe(eAcepta);
    expect(enlaces[apR]!.enlaceId).toBe(eRechaza);
    expect(apA).not.toBe(apR);
  });

  test("es idempotente: misma transición → misma apariencia", () => {
    const { a } = autorMultiEdge();

    const primera = a.aparecerEnlacePorTransicion("vista", "p", "o", "efecto", "recibida", "aceptada");
    const segunda = a.aparecerEnlacePorTransicion("vista", "p", "o", "efecto", "recibida", "aceptada");

    expect(segunda).toBe(primera);
    expect(Object.values(a.modelo.opds["opd-vista"]!.enlaces)).toHaveLength(1);
  });

  test("lanza si un estado de la transición no existe (falla temprano y claro)", () => {
    const { a } = autorMultiEdge();

    expect(() => a.aparecerEnlacePorTransicion("vista", "p", "o", "efecto", "recibida", "inexistente")).toThrow(
      /Estado no registrado/,
    );
  });

  test("lanza si no hay enlace con esa transición aunque los estados existan", () => {
    const { a } = autorMultiEdge();

    // 'aceptada'→'rechazada': ambos estados válidos, pero ningún enlace los une.
    expect(() => a.aparecerEnlacePorTransicion("vista", "p", "o", "efecto", "aceptada", "rechazada")).toThrow(
      /no existe enlace/,
    );
  });
});
