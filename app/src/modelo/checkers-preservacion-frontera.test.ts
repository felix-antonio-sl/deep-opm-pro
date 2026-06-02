import { describe, expect, test } from "bun:test";
import { checkDescomposicionPreservaFrontera } from "./checkers";
import type { Apariencia, AparienciaEnlace, Enlace, Entidad, Modelo, Opd, TipoEnlace } from "./tipos";

function ent(id: string, tipo: "objeto" | "proceso", extra: Partial<Entidad> = {}): Entidad {
  return { id, tipo, nombre: id, esencia: "informacional", afiliacion: "sistemica", ...extra };
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
  return { id, nombre: id, padreId, apariencias: Object.fromEntries(aps.map((a) => [a.id, a])), enlaces: Object.fromEntries(aes.map((x) => [x.id, x])) };
}

/** P consume A y produce B; su descomposición "z" omite el consumo de A si !preserva. */
function modelo(preserva: boolean): Modelo {
  const P = ent("P", "proceso", { refinamientos: { descomposicion: { opdId: "z" } } });
  const entidades: Record<string, Entidad> = { P, A: ent("A", "objeto"), B: ent("B", "objeto"), P1: ent("P1", "proceso") };
  const enlaces: Record<string, Enlace> = {
    cA: enl("cA", "consumo", "A", "P"), rB: enl("rB", "resultado", "P", "B"), rB1: enl("rB1", "resultado", "P1", "B"),
    ...(preserva ? { cA1: enl("cA1", "consumo", "A", "P1") } : {}),
  };
  const aesZ = [ae("zR", "rB1", "z"), ...(preserva ? [ae("zC", "cA1", "z")] : [])];
  const opds: Record<string, Opd> = {
    r: opd("r", null, [ap("rP", "P", "r"), ap("rA", "A", "r"), ap("rB", "B", "r")], [ae("rC", "cA", "r"), ae("rR", "rB", "r")]),
    z: opd("z", "r", [ap("zA", "A", "z"), ap("zB", "B", "z"), ap("zP1", "P1", "z")], aesZ),
  };
  return { id: "m", nombre: "m", opdRaizId: "r", opds, entidades, estados: {}, enlaces, nextSeq: 100 };
}

describe("checkDescomposicionPreservaFrontera", () => {
  test("descomposición incoherente → un aviso navegable al proceso", () => {
    const avisos = checkDescomposicionPreservaFrontera(modelo(false));
    expect(avisos).toHaveLength(1);
    expect(avisos[0]!.codigo).toBe("DESCOMPOSICION_NO_PRESERVA_FRONTERA");
    expect(avisos[0]!.entidadId).toBe("P");
    expect(avisos[0]!.navegarA?.id).toBe("P");
    expect(avisos[0]!.mensaje).toContain("frontera");
  });

  test("descomposición coherente → sin aviso", () => {
    expect(checkDescomposicionPreservaFrontera(modelo(true))).toEqual([]);
  });
});
