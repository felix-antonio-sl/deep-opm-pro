// D7.1 (decisión de consenso D7, spec §3-D7): LEY DE NO-CONTAMINACIÓN de la
// capa de pizarra / bosquejo. Un modelo CON bocetos y el MISMO modelo SIN
// bocetos producen IDÉNTICO conteo OPL, IDÉNTICOS avisos de checkers e IDÉNTICO
// resultado de validarModelo. La capa de boceto es NO-SEMÁNTICA: el kernel la
// IGNORA por completo (mismo estatuto que `generic-view` + AnclaNormativa +
// NotaMesa).
//
// Control de no-tautología (load-bearing): si la ley estuviera mal escrita —
// p.ej. contando los bocetos en el conteo, o derivando una huella distinta de
// un campo del boceto —, los tests de control de ESTE archivo deben FALLAR. Es
// decir, los bocetos SÍ son distinguibles por igualdad estructural (no son
// inertes por accidente: el modelo realmente los lleva), pero NINGÚN gate formal
// los ve. Patrón: réplica del invariante de generic-view en
// `src/opl/generic-view-opl.test.ts` ("el conteo es invariante a añadir una
// vista").

import { describe, expect, test } from "bun:test";
import { crearAutor } from "../autoria/index";
import { generarOpl } from "../opl/generar";
import { validarModelo } from "../modelo/validaciones";
import { verificarMetodologia } from "../modelo/checkers";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import type { Boceto, Id, Modelo, Opd } from "../modelo/tipos";

function autorBaseConHechos() {
  const a = crearAutor({ id: "x", nombre: "X" });
  a.entidad("p", "proceso", "Evaluacion de la solicitud", "fisica", "sistemica");
  a.entidad("o", "objeto", "Solicitud", "informacional", "sistemica");
  a.estados("o", ["recibida", "aceptada"], "recibida");
  a.opd("sd", "SD", null);
  a.ver("sd", "p", 0, 0);
  a.ver("sd", "o", 200, 0);
  const e = a.enlazar("sd", "p", "o", "efecto", { entrada: "recibida", salida: "aceptada" });
  if (!e) throw new Error("enlazar devolvió null");
  return a.modelo;
}

const BOCETOS_DEMO: Record<Id, Boceto> = {
  "bz-1": { id: "bz-1", tipo: "forma", x: 10, y: 20, w: 120, h: 60, texto: "idea cruda", estilo: { color: "#f00" } },
  "bz-2": { id: "bz-2", tipo: "flecha", puntos: [{ x: 0, y: 0 }, { x: 50, y: 80 }] },
  "bz-3": { id: "bz-3", tipo: "nota", x: 300, y: 0, texto: "preguntar a la mesa" },
};

/** Inserta bocetos en TODOS los OPDs del modelo (peor caso de contaminación). */
function conBocetos(modelo: Modelo, bocetos: Record<Id, Boceto> = BOCETOS_DEMO): Modelo {
  const opds: Record<Id, Opd> = {};
  for (const [id, opd] of Object.entries(modelo.opds)) {
    opds[id] = { ...opd, bocetos };
  }
  return { ...modelo, opds };
}

function oplTotal(modelo: Modelo): number {
  return Object.keys(modelo.opds).reduce((n, opdId) => n + generarOpl(modelo, opdId).length, 0);
}

function avisosValidacion(modelo: Modelo): string {
  return JSON.stringify(validarModelo(modelo, modelo.opdRaizId));
}

function avisosCheckers(modelo: Modelo): string {
  return JSON.stringify(verificarMetodologia(modelo));
}

describe("law-bocetos-no-contaminan", () => {
  test("conteo OPL: con bocetos === sin bocetos (invariante a añadirlos)", () => {
    const sin = autorBaseConHechos();
    const con = conBocetos(sin);
    expect(oplTotal(sin)).toBeGreaterThan(0);
    expect(oplTotal(con)).toBe(oplTotal(sin));
  });

  test("validarModelo: con bocetos === sin bocetos (mismo dictamen nuclear)", () => {
    const sin = autorBaseConHechos();
    const con = conBocetos(sin);
    expect(avisosValidacion(con)).toBe(avisosValidacion(sin));
  });

  test("checkers metodológicos: con bocetos === sin bocetos (mismos avisos)", () => {
    const sin = autorBaseConHechos();
    const con = conBocetos(sin);
    expect(avisosCheckers(con)).toBe(avisosCheckers(sin));
  });

  test("roundtrip: los bocetos sobreviven la serialización sin tocar el resto", () => {
    const con = conBocetos(autorBaseConHechos());
    const hidratado = hidratarModelo(exportarModelo(con));
    if (!hidratado.ok) throw new Error(hidratado.error);
    expect(hidratado.value.opds[con.opdRaizId]?.bocetos).toEqual(BOCETOS_DEMO);
    // Y el conteo OPL del hidratado sigue siendo el del modelo sin bocetos.
    expect(oplTotal(hidratado.value)).toBe(oplTotal(autorBaseConHechos()));
  });

  test("byte-identidad legacy: `bocetos: {}` vacío ⇒ export idéntico al modelo sin la clave", () => {
    // Ambos lados pasan por la MISMA normalización (hidratación) para aislar el
    // efecto de los bocetos del de la normalización (modoPlegado/orden de claves).
    const sin = hidratarModelo(exportarModelo(autorBaseConHechos()));
    const conVacio = hidratarModelo(exportarModelo(conBocetos(autorBaseConHechos(), {})));
    if (!sin.ok) throw new Error(sin.error);
    if (!conVacio.ok) throw new Error(conVacio.error);
    // El validador colapsa `bocetos: {}` a undefined ⇒ la clave no se serializa ⇒
    // un OPD legacy (sin la clave) hidrata byte-idéntico: rollback-free.
    expect(exportarModelo(conVacio.value)).toBe(exportarModelo(sin.value));
    expect(conVacio.value.opds[conVacio.value.opdRaizId]?.bocetos).toBeUndefined();
  });

  // --- Control de no-tautología -------------------------------------------
  // Estos tests prueban que la ley PODRÍA fallar si la segregación se rompiera.
  // Simulan un gate "mal escrito" que SÍ mira los bocetos y verifican que ESE
  // gate distingue con/sin. Si el kernel empezara a contar bocetos, el conteo
  // real divergiría y los tests positivos de arriba caerían — aquí mostramos
  // que la divergencia es DETECTABLE, no que la ley sea trivialmente cierta.

  test("control: un conteo que SÍ sumara bocetos distinguiría con/sin (la ley no es tautológica)", () => {
    const sin = autorBaseConHechos();
    const con = conBocetos(sin);
    const contarConBocetos = (m: Modelo): number =>
      oplTotal(m) + Object.values(m.opds).reduce((n, opd) => n + Object.keys(opd.bocetos ?? {}).length, 0);
    // El conteo REAL es invariante (ley); el conteo MAL ESCRITO no lo es.
    expect(oplTotal(con)).toBe(oplTotal(sin));
    expect(contarConBocetos(con)).not.toBe(contarConBocetos(sin));
  });

  test("control: los bocetos realmente viajan en el modelo (no son inertes por accidente)", () => {
    const con = conBocetos(autorBaseConHechos());
    expect(Object.keys(con.opds[con.opdRaizId]?.bocetos ?? {}).length).toBe(3);
  });
});
