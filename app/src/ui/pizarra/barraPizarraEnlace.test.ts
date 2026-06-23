import { describe, expect, test } from "bun:test";
import {
  entidadesPromocionablesEnOpd,
  puedePromoverEnlace,
  TIPOS_ENLACE_PROMOCION,
} from "./barraPizarraEnlace";
import { crearModelo, crearObjeto, crearProceso, descomponerProceso } from "../../modelo/operaciones";
import type { Modelo, Resultado } from "../../modelo/tipos";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function entId(modelo: Modelo, nombre: string): string {
  return Object.values(modelo.entidades).find((e) => e.nombre === nombre)!.id;
}

describe("barraPizarraEnlace — lógica pura del mini-form de promoción a enlace", () => {
  test("entidadesPromocionablesEnOpd lista solo las cosas con apariencia en el OPD activo", () => {
    let m = crearModelo("Pizarra enlace");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Insumo"));
    m = must(crearProceso(m, m.opdRaizId, { x: 240, y: 0 }, "Procesar"));

    const lista = entidadesPromocionablesEnOpd(m, m.opdRaizId);
    expect(lista.map((e) => e.nombre).sort()).toEqual(["Insumo", "Procesar"]);
    expect(lista.find((e) => e.nombre === "Insumo")?.tipo).toBe("objeto");
    expect(lista.find((e) => e.nombre === "Procesar")?.tipo).toBe("proceso");
  });

  test("entidadesPromocionablesEnOpd NO incluye cosas de otros OPD (deriva de apariencias, no del modelo)", () => {
    let m = crearModelo("Pizarra enlace");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Insumo"));
    m = must(crearProceso(m, m.opdRaizId, { x: 240, y: 0 }, "Procesar"));
    const procesarId = entId(m, "Procesar");
    const desc = must(descomponerProceso(m, m.opdRaizId, procesarId));
    m = desc.modelo;
    const opdHijoId = desc.opdId;

    // En el OPD raíz: las dos cosas raíz son promocionables.
    const enRaiz = entidadesPromocionablesEnOpd(m, m.opdRaizId).map((e) => e.id);
    expect(enRaiz).toContain(entId(m, "Insumo"));
    // El OPD hijo NO contiene a "Insumo" (no tiene apariencia ahí).
    const enHijo = entidadesPromocionablesEnOpd(m, opdHijoId).map((e) => e.id);
    expect(enHijo).not.toContain(entId(m, "Insumo"));
  });

  test("entidadesPromocionablesEnOpd con OPD inexistente devuelve lista vacía (sin throw)", () => {
    const m = crearModelo("Pizarra enlace");
    expect(entidadesPromocionablesEnOpd(m, "opd-fantasma")).toEqual([]);
  });

  test("puedePromoverEnlace exige origen, destino y tipo, y por defecto extremos distintos", () => {
    expect(puedePromoverEnlace({ origenId: null, destinoId: "b", tipo: "consumo" })).toBe(false);
    expect(puedePromoverEnlace({ origenId: "a", destinoId: null, tipo: "consumo" })).toBe(false);
    expect(puedePromoverEnlace({ origenId: "a", destinoId: "b", tipo: null })).toBe(false);
    // origen === destino se rechaza por defecto (sin auto-enlace).
    expect(puedePromoverEnlace({ origenId: "a", destinoId: "a", tipo: "consumo" })).toBe(false);
    // firma completa con extremos distintos ⇒ habilitado.
    expect(puedePromoverEnlace({ origenId: "a", destinoId: "b", tipo: "consumo" })).toBe(true);
  });

  test("TIPOS_ENLACE_PROMOCION ofrece los tipos canónicos (procedurales y estructurales)", () => {
    const tipos = TIPOS_ENLACE_PROMOCION.map((t) => t.tipo);
    // Procedurales canónicos.
    expect(tipos).toContain("consumo");
    expect(tipos).toContain("resultado");
    expect(tipos).toContain("efecto");
    expect(tipos).toContain("agente");
    expect(tipos).toContain("instrumento");
    // Estructurales canónicos.
    expect(tipos).toContain("agregacion");
    expect(tipos).toContain("generalizacion");
    // Cada opción trae una etiqueta legible.
    expect(TIPOS_ENLACE_PROMOCION.every((t) => typeof t.label === "string" && t.label.length > 0)).toBe(true);
  });
});
