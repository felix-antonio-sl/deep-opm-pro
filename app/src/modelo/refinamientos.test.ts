import { describe, expect, test } from "bun:test";
import {
  fijarRefinamiento,
  obtenerRefinamiento,
  opdIdDeRefinamiento,
  quitarRefinamiento,
  refinamientosDe,
  refinaA,
  tieneRefinamiento,
} from "./refinamientos";
import type { Entidad } from "./tipos";

/**
 * Helpers del producto parcial Entidad.refinamientos (ronda 15.2).
 * Verifica ortogonalidad descomposicion vs despliegue, preservacion del slot
 * complementario y migracion legacy → record.
 */

function entidadBase(): Entidad {
  return {
    id: "e1",
    tipo: "objeto",
    nombre: "X",
    esencia: "informacional",
    afiliacion: "sistemica",
  };
}

describe("refinamientos helpers", () => {
  test("obtenerRefinamiento devuelve undefined cuando no hay slot", () => {
    expect(obtenerRefinamiento(entidadBase(), "descomposicion")).toBeUndefined();
    expect(obtenerRefinamiento(entidadBase(), "despliegue")).toBeUndefined();
  });

  test("tieneRefinamiento responde por tipo o por presencia general", () => {
    const e = fijarRefinamiento(entidadBase(), "descomposicion", { opdId: "opd-d" });
    expect(tieneRefinamiento(e)).toBe(true);
    expect(tieneRefinamiento(e, "descomposicion")).toBe(true);
    expect(tieneRefinamiento(e, "despliegue")).toBe(false);
  });

  test("fijarRefinamiento NO destruye el slot complementario (ortogonalidad)", () => {
    const inzoom = fijarRefinamiento(entidadBase(), "descomposicion", { opdId: "opd-d" });
    const ambos = fijarRefinamiento(inzoom, "despliegue", { opdId: "opd-u", modo: "agregacion" });
    expect(obtenerRefinamiento(ambos, "descomposicion")?.opdId).toBe("opd-d");
    expect(obtenerRefinamiento(ambos, "despliegue")?.opdId).toBe("opd-u");
    expect(obtenerRefinamiento(ambos, "despliegue")?.modo).toBe("agregacion");
  });

  test("refinamientosDe enumera ambos slots cuando coexisten en orden Comportamiento → Estructura", () => {
    let e = fijarRefinamiento(entidadBase(), "despliegue", { opdId: "opd-u" });
    e = fijarRefinamiento(e, "descomposicion", { opdId: "opd-d" });
    const lista = refinamientosDe(e);
    expect(lista).toHaveLength(2);
    expect(lista[0]!.tipo).toBe("descomposicion");
    expect(lista[1]!.tipo).toBe("despliegue");
  });

  test("quitarRefinamiento conserva el slot complementario", () => {
    let e = fijarRefinamiento(entidadBase(), "descomposicion", { opdId: "opd-d" });
    e = fijarRefinamiento(e, "despliegue", { opdId: "opd-u", modo: "exhibicion" });
    const sinDescomp = quitarRefinamiento(e, "descomposicion");
    expect(obtenerRefinamiento(sinDescomp, "descomposicion")).toBeUndefined();
    expect(obtenerRefinamiento(sinDescomp, "despliegue")?.opdId).toBe("opd-u");
    const sinNada = quitarRefinamiento(sinDescomp, "despliegue");
    expect(sinNada.refinamientos).toBeUndefined();
  });

  test("opdIdDeRefinamiento y refinaA inversa por opdId", () => {
    const e = fijarRefinamiento(entidadBase(), "despliegue", { opdId: "opd-u", modo: "agregacion" });
    expect(opdIdDeRefinamiento(e, "despliegue")).toBe("opd-u");
    expect(refinaA(e, "opd-u")?.tipo).toBe("despliegue");
    expect(refinaA(e, "opd-no-existe")).toBeNull();
  });
});
