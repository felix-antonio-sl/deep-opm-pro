import { describe, expect, test } from "bun:test";
import type { Apariencia, AparienciaEnlace, Enlace, Entidad, Modelo, Opd, TipoEnlace } from "../tipos";
import { observarPreservacionFrontera } from "./preservacion";

// Una descomposición es coherente cuando preserva la FRONTERA del proceso: el
// OPD hijo debe ejercer sobre las entidades de contorno los mismos roles netos
// (consumo/resultado/efecto/…) que el proceso abstracto en su OPD padre.
// Esta es la ley in-zoom ↔ out-zoom expresada con la firma de frontera (F2).

function ent(id: string, tipo: "objeto" | "proceso"): Entidad {
  return { id, tipo, nombre: id, esencia: "informacional", afiliacion: "sistemica" };
}
function ap(id: string, entidadId: string, opdId: string): Apariencia {
  return { id, entidadId, opdId, x: 0, y: 0, width: 100, height: 50 };
}
function enl(id: string, tipo: TipoEnlace, origen: string, destino: string): Enlace {
  return { id, tipo, origenId: { kind: "entidad", id: origen }, destinoId: { kind: "entidad", id: destino }, etiqueta: "" };
}
function ae(id: string, enlaceId: string, opdId: string): AparienciaEnlace {
  return { id, enlaceId, opdId, vertices: [] };
}
function opd(id: string, padreId: string | null, aps: Apariencia[], aes: AparienciaEnlace[]): Opd {
  return {
    id,
    nombre: id,
    padreId,
    apariencias: Object.fromEntries(aps.map((a) => [a.id, a])),
    enlaces: Object.fromEntries(aes.map((x) => [x.id, x])),
  };
}

/**
 * Proceso P en el OPD raíz: A→P (consumo), P→B (resultado). P se descompone en
 * el OPD "z" (padre = raíz). `preserva` decide si el contorno de "z" mantiene el
 * consumo de A o lo omite (descomposición incoherente).
 */
function modelo(preserva: boolean): Modelo {
  const P: Entidad = { ...ent("P", "proceso"), refinamientos: { descomposicion: { opdId: "z" } } };
  const entidades: Record<string, Entidad> = {
    P, A: ent("A", "objeto"), B: ent("B", "objeto"), P1: ent("P1", "proceso"),
  };
  const enlaces: Record<string, Enlace> = {
    cA: enl("cA", "consumo", "A", "P"), rB: enl("rB", "resultado", "P", "B"),
    rB1: enl("rB1", "resultado", "P1", "B"),
    ...(preserva ? { cA1: enl("cA1", "consumo", "A", "P1") } : {}),
  };
  const aesZ = [ae("zR", "rB1", "z"), ...(preserva ? [ae("zC", "cA1", "z")] : [])];
  const opds: Record<string, Opd> = {
    r: opd("r", null, [ap("rP", "P", "r"), ap("rA", "A", "r"), ap("rB", "B", "r")], [ae("rC", "cA", "r"), ae("rR", "rB", "r")]),
    z: opd("z", "r", [ap("zA", "A", "z"), ap("zB", "B", "z"), ap("zP1", "P1", "z")], aesZ),
  };
  return { id: "m", nombre: "m", opdRaizId: "r", opds, entidades, estados: {}, enlaces, nextSeq: 100 };
}

describe("observarPreservacionFrontera (F2 · ley in-zoom/out-zoom)", () => {
  test("descomposición que preserva la frontera: sin observaciones", () => {
    expect(observarPreservacionFrontera(modelo(true))).toEqual([]);
  });

  test("descomposición que rompe la frontera: una observación con la diferencia", () => {
    const obs = observarPreservacionFrontera(modelo(false));
    expect(obs).toHaveLength(1);
    expect(obs[0]!.procesoId).toBe("P");
    expect(obs[0]!.opdDescomposicionId).toBe("z");
    expect(obs[0]!.diferencias.some((d) => d.includes("consumo"))).toBe(true);
  });

  test("proceso sin descomposición: no se evalúa", () => {
    const m = modelo(true);
    delete m.entidades["P"]!.refinamientos;
    expect(observarPreservacionFrontera(m)).toEqual([]);
  });
});
