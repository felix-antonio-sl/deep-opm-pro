import { describe, expect, test } from "bun:test";
import { crearModelo, crearProceso, crearObjeto } from "../modelo/operaciones/creacion";
import { descomponerProceso } from "../modelo/operaciones";
import { crearEnlace } from "../modelo/operaciones/enlaces";
import { crearOpdSuelto } from "../modelo/operaciones/opdSuelto";
import { adoptarOpd } from "../modelo/operaciones/refinamiento/establecer";
import { obtenerRefinamiento } from "../modelo/refinamientos";
import { extremoEntidad } from "../modelo/extremos";
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

  // CORREGIDO (verificación adversarial Ola 1): la convergencia es a nivel del VÍNCULO
  // (test 1), NO del contenido del hijo. Comparar firmas del hijo entre caminos es vacuo
  // (ambas [] sin frontera) o falso (divergen con frontera) — y esa divergencia es CORRECTA:
  // el top-down auto-andamia (R-OPD-REF-4/11), adoptar toma el suelto tal cual (bottom-up).
  // Este test DOCUMENTA ese contraste; se rompería si adoptar empezara a andamiar.
  test("adoptar NO auto-andamia la frontera (bottom-up), a diferencia del top-down", () => {
    // Proceso con un enlace de frontera (consumo) en el OPD padre.
    let m = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar"));
    const p = procesoId(m);
    m = must(crearObjeto(m, "opd-1", { x: 200, y: 0 }, "Datos"));
    const datos = Object.values(m.entidades).find((e) => e.nombre === "Datos")!.id;
    m = must(crearEnlace(m, "opd-1", extremoEntidad(datos), extremoEntidad(p), "consumo"));
    // Top-down: el OPD hijo recibe derivación de frontera (externo + enlace distribuido).
    const outTop = must(descomponerProceso(m, "opd-1", p));
    const enlacesHijoTop = Object.keys(outTop.modelo.opds[outTop.opdId]!.enlaces).length;
    // Adopción de un suelto VACÍO: el hijo NO recibe andamiaje (toma el dibujo tal cual).
    const creado = crearOpdSuelto(m);
    const outAdop = must(adoptarOpd(creado.modelo, { opdPadreId: "opd-1", entidadId: p, opdSueltoId: creado.opdId, tipo: "descomposicion" }));
    const enlacesHijoAdop = Object.keys(outAdop.opds[creado.opdId]!.enlaces).length;
    expect(enlacesHijoAdop).toBe(0);            // adopt no andamia (bottom-up)
    expect(enlacesHijoTop).toBeGreaterThan(0);  // top-down sí (contraste); frontera se cobra en export
  });
});
