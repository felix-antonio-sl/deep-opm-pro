import { describe, expect, test } from "bun:test";
import { crearModelo, crearProceso } from "../creacion";
import { obtenerRefinamiento } from "../../refinamientos";
import { establecerRefinamiento } from "./establecer";
import type { Modelo, Opd } from "../../tipos";

function primerProcesoId(m: Modelo): string {
  return Object.values(m.entidades).find((e) => e.tipo === "proceso")!.id;
}
function conOpdVacio(m: Modelo, id: string, padreId: string | null): Modelo {
  const opd: Opd = { id, nombre: id, padreId, apariencias: {}, enlaces: {} };
  return { ...m, opds: { ...m.opds, [id]: opd } };
}

describe("establecerRefinamiento", () => {
  test("fija el slot de la entidad y el padreId del hijo", () => {
    let m = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar").value as Modelo;
    const procesoId = primerProcesoId(m);
    m = conOpdVacio(m, "opd-hijo", null);
    const r = establecerRefinamiento(m, { opdPadreId: "opd-1", entidadId: procesoId, opdHijoId: "opd-hijo", tipo: "descomposicion" });
    expect(r.ok).toBe(true);
    const out = (r as { value: Modelo }).value;
    expect(obtenerRefinamiento(out.entidades[procesoId], "descomposicion")?.opdId).toBe("opd-hijo");
    expect(out.opds["opd-hijo"].padreId).toBe("opd-1");
  });

  test("rechaza si la entidad ya tiene refinamiento del mismo tipo", () => {
    let m = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar").value as Modelo;
    const procesoId = primerProcesoId(m);
    m = conOpdVacio(m, "opd-hijo", null);
    m = (establecerRefinamiento(m, { opdPadreId: "opd-1", entidadId: procesoId, opdHijoId: "opd-hijo", tipo: "descomposicion" }) as { value: Modelo }).value;
    m = conOpdVacio(m, "opd-hijo-2", null);
    const r = establecerRefinamiento(m, { opdPadreId: "opd-1", entidadId: procesoId, opdHijoId: "opd-hijo-2", tipo: "descomposicion" });
    expect(r.ok).toBe(false);
  });

  test("rechaza ciclo: el hijo es ancestro del padre", () => {
    // opd-1 (raíz) → opd-a → opd-b ; intentar refinar algo en opd-b con hijo opd-a
    let m = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "P").value as Modelo;
    m = conOpdVacio(m, "opd-a", "opd-1");
    m = conOpdVacio(m, "opd-b", "opd-a");
    // una cosa visible en opd-b
    m = crearProceso(m, "opd-b", { x: 0, y: 0 }, "Q").value as Modelo;
    const qId = Object.values(m.entidades).find((e) => e.nombre === "Q")!.id;
    const r = establecerRefinamiento(m, { opdPadreId: "opd-b", entidadId: qId, opdHijoId: "opd-a", tipo: "descomposicion" });
    expect(r.ok).toBe(false);
  });

  test("rechaza si la entidad no tiene apariencia en el OPD padre", () => {
    let m = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar").value as Modelo;
    const procesoId = primerProcesoId(m);
    m = conOpdVacio(m, "opd-otro", null);
    m = conOpdVacio(m, "opd-hijo", null);
    const r = establecerRefinamiento(m, { opdPadreId: "opd-otro", entidadId: procesoId, opdHijoId: "opd-hijo", tipo: "descomposicion" });
    expect(r.ok).toBe(false);
  });
});
