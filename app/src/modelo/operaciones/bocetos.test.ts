// D7.2 (decisión de consenso D7, spec §3-D7): CRUD PURO de la capa de pizarra.
// Las cuatro operaciones (`agregar/mover/editar/eliminar`) operan sobre
// `Opd.bocetos` devolviendo un Modelo nuevo (inmutable) y JAMÁS tocan
// entidades/enlaces/estados. Los ids de boceto usan `siguienteId` con prefijo
// `bo` (bo-N) para no colisionar con o-/p-/s-/e-/a-.
//
// Control de no-contaminación (load-bearing, replica el de promoción): tras
// CUALQUIER operación de boceto, `validarModelo` y el conteo OPL son IDÉNTICOS
// al modelo sin bocetos. Si una op tocara el kernel, este test caería.

import { describe, expect, test } from "bun:test";
import {
  agregarBoceto,
  editarBoceto,
  eliminarBoceto,
  moverBoceto,
} from "./bocetos";
import { crearModelo, crearObjeto, crearProceso } from "../operaciones";
import { generarOpl } from "../../opl/generar";
import { validarModelo } from "../validaciones";
import { exportarModelo } from "../../serializacion/json";
import type { Boceto, Id, Modelo, Resultado } from "../tipos";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function baseConHechos(): Modelo {
  let m = crearModelo("Pizarra");
  m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Solicitud"));
  m = must(crearProceso(m, m.opdRaizId, { x: 300, y: 0 }, "Evaluar"));
  return m;
}

function oplTotal(modelo: Modelo): number {
  return Object.keys(modelo.opds).reduce((n, opdId) => n + generarOpl(modelo, opdId).length, 0);
}

const FORMA: Omit<Boceto, "id"> = { tipo: "forma", x: 40, y: 60, w: 140, h: 70, texto: "idea cruda" };
const FLECHA: Omit<Boceto, "id"> = { tipo: "flecha", puntos: [{ x: 10, y: 10 }, { x: 90, y: 80 }] };

describe("operaciones/bocetos — CRUD puro", () => {
  test("agregarBoceto asigna id fresco con prefijo `bo` y lo mete en opd.bocetos", () => {
    const base = baseConHechos();
    const r = must(agregarBoceto(base, base.opdRaizId, FORMA));
    expect(r.bocetoId.startsWith("bo-")).toBe(true);
    // NO colisiona con o-/p-/s-/e-/a-.
    expect(r.bocetoId).not.toMatch(/^[opsea]-/);
    const boceto = r.modelo.opds[base.opdRaizId]?.bocetos?.[r.bocetoId];
    expect(boceto).toMatchObject({ ...FORMA, id: r.bocetoId });
    // Inmutable: la entrada no se mutó.
    expect(base.opds[base.opdRaizId]?.bocetos).toBeUndefined();
  });

  test("agregarBoceto sobre OPD inexistente falla ruidoso", () => {
    const base = baseConHechos();
    const r = agregarBoceto(base, "opd-fantasma", FORMA);
    expect(r.ok).toBe(false);
  });

  test("dos agregaciones consecutivas no colisionan de id (nextSeq avanza)", () => {
    const base = baseConHechos();
    const r1 = must(agregarBoceto(base, base.opdRaizId, FORMA));
    const r2 = must(agregarBoceto(r1.modelo, base.opdRaizId, FLECHA));
    expect(r1.bocetoId).not.toBe(r2.bocetoId);
    expect(Object.keys(r2.modelo.opds[base.opdRaizId]?.bocetos ?? {})).toHaveLength(2);
  });

  test("moverBoceto por posición absoluta actualiza x/y", () => {
    const base = baseConHechos();
    const { modelo, bocetoId } = must(agregarBoceto(base, base.opdRaizId, FORMA));
    const movido = must(moverBoceto(modelo, base.opdRaizId, bocetoId, { x: 200, y: 220 }));
    const b = movido.opds[base.opdRaizId]?.bocetos?.[bocetoId];
    expect(b?.x).toBe(200);
    expect(b?.y).toBe(220);
  });

  test("moverBoceto por delta desplaza x/y (y traslada los puntos si flecha)", () => {
    const base = baseConHechos();
    const { modelo, bocetoId } = must(agregarBoceto(base, base.opdRaizId, FLECHA));
    const movido = must(moverBoceto(modelo, base.opdRaizId, bocetoId, { dx: 15, dy: -5 }));
    const b = movido.opds[base.opdRaizId]?.bocetos?.[bocetoId];
    expect(b?.puntos).toEqual([{ x: 25, y: 5 }, { x: 105, y: 75 }]);
  });

  test("moverBoceto colgante (id inexistente) falla ruidoso", () => {
    const base = baseConHechos();
    const r = moverBoceto(base, base.opdRaizId, "bo-999", { x: 1, y: 1 });
    expect(r.ok).toBe(false);
  });

  test("editarBoceto aplica el parche (texto, estilo, w, h, puntos)", () => {
    const base = baseConHechos();
    const { modelo, bocetoId } = must(agregarBoceto(base, base.opdRaizId, FORMA));
    const editado = must(editarBoceto(modelo, base.opdRaizId, bocetoId, { texto: "concepto", w: 200, estilo: { color: "#abc" } }));
    const b = editado.opds[base.opdRaizId]?.bocetos?.[bocetoId];
    expect(b?.texto).toBe("concepto");
    expect(b?.w).toBe(200);
    expect(b?.estilo).toEqual({ color: "#abc" });
    // No tocó campos fuera del parche.
    expect(b?.h).toBe(70);
  });

  test("editarBoceto colgante falla ruidoso", () => {
    const base = baseConHechos();
    const r = editarBoceto(base, base.opdRaizId, "bo-999", { texto: "x" });
    expect(r.ok).toBe(false);
  });

  test("eliminarBoceto quita el boceto; si era el último, colapsa la clave bocetos", () => {
    const base = baseConHechos();
    const { modelo, bocetoId } = must(agregarBoceto(base, base.opdRaizId, FORMA));
    const sin = must(eliminarBoceto(modelo, base.opdRaizId, bocetoId));
    expect(sin.opds[base.opdRaizId]?.bocetos).toBeUndefined();
  });

  test("eliminarBoceto conserva los demás bocetos", () => {
    const base = baseConHechos();
    const r1 = must(agregarBoceto(base, base.opdRaizId, FORMA));
    const r2 = must(agregarBoceto(r1.modelo, base.opdRaizId, FLECHA));
    const sin = must(eliminarBoceto(r2.modelo, base.opdRaizId, r1.bocetoId));
    expect(sin.opds[base.opdRaizId]?.bocetos?.[r1.bocetoId]).toBeUndefined();
    expect(sin.opds[base.opdRaizId]?.bocetos?.[r2.bocetoId]).toBeDefined();
  });

  test("eliminarBoceto colgante falla ruidoso", () => {
    const base = baseConHechos();
    const r = eliminarBoceto(base, base.opdRaizId, "bo-999");
    expect(r.ok).toBe(false);
  });

  // --- No-contaminación (replica law-bocetos-no-contaminan) ----------------
  test("tras agregar un boceto, validarModelo y el conteo OPL son IDÉNTICOS al sin-bocetos", () => {
    const base = baseConHechos();
    const oplSin = oplTotal(base);
    const validacionSin = JSON.stringify(validarModelo(base, base.opdRaizId));

    const { modelo: con } = must(agregarBoceto(base, base.opdRaizId, FORMA));
    expect(oplTotal(con)).toBe(oplSin);
    expect(JSON.stringify(validarModelo(con, con.opdRaizId))).toBe(validacionSin);
  });

  test("byte-identidad: agregar y luego eliminar el boceto devuelve un export idéntico (salvo nextSeq)", () => {
    const base = baseConHechos();
    const { modelo, bocetoId } = must(agregarBoceto(base, base.opdRaizId, FORMA));
    const sin = must(eliminarBoceto(modelo, base.opdRaizId, bocetoId));
    // El OPD vuelve sin la clave `bocetos`; el modelo solo difiere en `nextSeq`.
    expect(sin.opds[base.opdRaizId]?.bocetos).toBeUndefined();
    const conNextSeqBase: Modelo = { ...sin, nextSeq: base.nextSeq };
    expect(exportarModelo(conNextSeqBase)).toBe(exportarModelo(base));
  });
});
