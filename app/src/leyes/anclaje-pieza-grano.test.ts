// LEY ANCLAJE — GRANO DE PIEZA (C4): el drift se mide en la VECINDAD RADIO-1 de la Pieza, no en la
// biblioteca entera. Es la pinza del corte C4 y, en su tercera mandíbula, el INVERSO falsable de la
// amarra 2b de la ley de composabilidad.
//
// Diseño RATIFICADO (frente Anclaje, C4): la frontera de `firmaPieza` es la entidad-pieza + sus
// estados + sus enlaces incidentes (los vecinos entran por ID, no por contenido) + los abanicos que
// intersecten esos enlaces. La PRESENCIA de `Anclaje.frozenAtPieza` decide el grano (aditivo).
//
// Tres mandíbulas (el grano grueso ya las tiene en `anclaje-quietud`/`anclaje-sensibilidad`/
// `anclaje-composabilidad`; aquí valen para el grano FINO):
//   (1) QUIETUD-PIEZA   — re-layout / round-trip / mutar una pieza AJENA ⇒ `sincronizado`.
//   (2) SENSIBILIDAD-PIEZA — mutar la entidad-pieza, sus estados o un enlace incidente ⇒ `divergente`.
//   (3) COMPOSICIÓN (INVERSO de 2b) — dos cosas ancladas a piezas DISTINTAS de la MISMA biblioteca;
//       mutar la pieza de A ⇒ A `divergente`, B `sincronizado`. La amarra 2b (grano biblioteca) hacía
//       diverger a AMBOS ante la misma mutación; este inverso prueba que C4 mata ese ruido. Si la
//       lógica de vecindad se rompe (firmaPieza hashea de más), B enrojece y la ley cae.
import { describe, expect, test } from "bun:test";
import type { Anclaje, Id, Modelo } from "../modelo/tipos";
import {
  anclarAPieza,
  evaluarDriftEntidad,
  evaluarDriftModelo,
  firmaBiblioteca,
  firmaPieza,
  firmaVivaAnclaje,
  CENTINELA_PIEZA_AUSENTE,
} from "../modelo/operaciones";
import { construirResolverHashVivo } from "../store/modelo/acciones-anclaje";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import fixture from "./_fixtures/fixture-anclaje-v0.json";

const FORMATO = "deep-opm-pro.modelo.v0" as const;

/**
 * Biblioteca con DOS piezas de vecindades DISJUNTAS:
 *   · ent-A (objeto "Greda") con estado st-A0, enlace de objeto enl-A (A→P), enlace de estado
 *     enl-As (st-A0→P) y abanico ab-A sobre enl-A.
 *   · ent-X (objeto "Horno") con estado st-X0 y enlace enl-X (X→P).
 *   · ent-P (proceso "Cocer") es el VECINO común — entra a ambas vecindades solo por ID (vía los
 *     destinos de los enlaces), nunca por contenido. Sus enlaces propios NO se cruzan: enl-A/enl-As
 *     no tocan a X, enl-X no toca a A ⇒ las vecindades de A y X son disjuntas.
 */
function bibliotecaBase(): Modelo {
  return {
    id: "lib-c4",
    nombre: "Biblioteca C4",
    opdRaizId: "opd-0",
    nextSeq: 99,
    opds: {
      "opd-0": {
        id: "opd-0",
        nombre: "SD",
        padreId: null,
        ordenInzoom: [["ent-P"]],
        ordenLocal: 1,
        apariencias: {
          "ap-A": { id: "ap-A", entidadId: "ent-A", opdId: "opd-0", x: 10, y: 10, width: 100, height: 60 },
          "ap-X": { id: "ap-X", entidadId: "ent-X", opdId: "opd-0", x: 300, y: 10, width: 100, height: 60 },
          "ap-P": { id: "ap-P", entidadId: "ent-P", opdId: "opd-0", x: 150, y: 200, width: 100, height: 60 },
        },
        enlaces: {},
      },
    },
    entidades: {
      "ent-A": { id: "ent-A", tipo: "objeto", nombre: "Greda", esencia: "fisica", afiliacion: "sistemica", descripcion: "barro", imagen: { url: "x://a", modo: "imagen" }, layoutEstados: "horizontal" },
      "ent-X": { id: "ent-X", tipo: "objeto", nombre: "Horno", esencia: "fisica", afiliacion: "sistemica" },
      "ent-P": { id: "ent-P", tipo: "proceso", nombre: "Cocer", esencia: "fisica", afiliacion: "sistemica" },
    },
    estados: {
      "st-A0": { id: "st-A0", entidadId: "ent-A", nombre: "húmeda", esInicial: true, designaciones: ["inicial"], duracion: { unidad: "h", min: 1, nominal: 2, max: 3 }, orden: 0, suprimido: false, x: 5, y: 5, width: 30, height: 14 },
      "st-X0": { id: "st-X0", entidadId: "ent-X", nombre: "frío", orden: 0 },
    },
    enlaces: {
      "enl-A": { id: "enl-A", tipo: "consumo", origenId: { kind: "entidad", id: "ent-A" }, destinoId: { kind: "entidad", id: "ent-P" }, etiqueta: "", multiplicidadOrigen: "1", tasa: "2", rutaEtiqueta: "arriba", mostrarRequisitos: false },
      "enl-As": { id: "enl-As", tipo: "efecto", origenId: { kind: "estado", id: "st-A0" }, destinoId: { kind: "entidad", id: "ent-P" }, etiqueta: "" },
      "enl-X": { id: "enl-X", tipo: "instrumento", origenId: { kind: "entidad", id: "ent-X" }, destinoId: { kind: "entidad", id: "ent-P" }, etiqueta: "" },
    },
    abanicos: {
      "ab-A": { id: "ab-A", opdId: "opd-0", puertoComun: { entidadId: "ent-P", lado: "origen", portId: "port-1" }, puertoEntidadId: "ent-P", operador: "XOR", enlaceIds: ["enl-A"] },
    },
  } as Modelo;
}

const base = bibliotecaBase();
const PIEZA_A: Id = "ent-A";
const PIEZA_X: Id = "ent-X";

/** Deep clone por JSON (datos planos) para mutar sin tocar `base`. */
function clon(): Modelo {
  return JSON.parse(JSON.stringify(base)) as Modelo;
}

/** Ancla `entidadId` de un modelo consumidor a la pieza `piezaId` a GRANO PIEZA (congela `frozenAtPieza`). */
function anclarGranoPieza(modelo: Modelo, entidadId: Id, piezaId: Id): Modelo {
  const frozenAtPieza = firmaPieza(base, piezaId);
  if (frozenAtPieza === null) throw new Error(`pieza inexistente: ${piezaId}`);
  const r = anclarAPieza(modelo, entidadId, { modeloId: base.id, frozenAtHash: firmaBiblioteca(base) }, piezaId, frozenAtPieza);
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

// Una cosa anclada a la pieza A, a grano pieza. El consumidor reusa la forma de `base` como vehículo.
const consumidorA = anclarGranoPieza({ ...base, id: "consumidor-A" }, "ent-A", PIEZA_A);
const cosaA = consumidorA.entidades["ent-A"]!;
const frozenA = firmaPieza(base, PIEZA_A)!;

/** Veredicto de drift de la cosa anclada a A contra una biblioteca VIVA (o `null`), a grano pieza. */
function driftA(libViva: Modelo | null) {
  return evaluarDriftEntidad(cosaA, firmaVivaAnclaje(cosaA.anclaje as Anclaje, libViva));
}

describe("LEY GRANO-PIEZA — el anclaje nace a grano pieza (frozenAtPieza presente)", () => {
  test("el gesto a grano pieza congela `frozenAtPieza` = firma de la vecindad (no la de biblioteca)", () => {
    expect(cosaA.anclaje?.frozenAtPieza).toBe(frozenA);
    expect(cosaA.anclaje?.frozenAtPieza).not.toBe(firmaBiblioteca(base)); // el grano fino ≠ grano grueso
    expect(driftA(base)).toBe("sincronizado"); // control: arranca sincronizado contra la biblioteca intacta
  });
});

// (1) QUIETUD-PIEZA — presentación dentro de la vecindad + cualquier mutación AJENA ⇒ `sincronizado`.
const QUIETUD: Array<[string, (m: Modelo) => void]> = [
  // — presentación dentro de la vecindad de A (campos EXCLUIDOS de la partición) —
  ["pres: st-A0.x/y/w/h", (m) => { const s = m.estados["st-A0"]!; s.x = 1; s.y = 1; s.width = 1; s.height = 1; }],
  ["pres: st-A0.suprimido", (m) => { m.estados["st-A0"]!.suprimido = true; }],
  ["pres: ent-A.imagen", (m) => { m.entidades["ent-A"]!.imagen = { url: "x://otra", modo: "texto" }; }],
  ["pres: ent-A.layoutEstados", (m) => { m.entidades["ent-A"]!.layoutEstados = "vertical"; }],
  ["pres: enl-A.rutaEtiqueta", (m) => { m.enlaces["enl-A"]!.rutaEtiqueta = "abajo"; }],
  ["pres: enl-A.mostrarRequisitos", (m) => { m.enlaces["enl-A"]!.mostrarRequisitos = true; }],
  ["pres: ab-A.puertoComun.portId", (m) => { m.abanicos!["ab-A"]!.puertoComun.portId = "port-OTRO"; }],
  ["pres: apariencias (OPD)", (m) => { m.opds["opd-0"]!.apariencias["ap-A"]!.x = 9999; }],
  // — mutaciones de piezas AJENAS (fuera de la vecindad de A) —
  ["ajena: ent-X.nombre", (m) => { m.entidades["ent-X"]!.nombre = "Caldera"; }],
  ["ajena: ent-X.esencia", (m) => { m.entidades["ent-X"]!.esencia = "informacional"; }],
  ["ajena: st-X0.nombre", (m) => { m.estados["st-X0"]!.nombre = "tibio"; }],
  ["ajena: enl-X.tipo", (m) => { m.enlaces["enl-X"]!.tipo = "agente"; }],
  ["ajena: ent-P.nombre (VECINO por id, no por contenido)", (m) => { m.entidades["ent-P"]!.nombre = "Hornear"; }],
  ["ajena: ent-P.tipo (VECINO por id)", (m) => { m.entidades["ent-P"]!.tipo = "objeto"; }],
  ["ajena: +entidad nueva", (m) => { m.entidades["ent-Z"] = { id: "ent-Z", tipo: "objeto", nombre: "Z", esencia: "fisica", afiliacion: "sistemica" }; }],
  ["ajena: +enlace X→P (no toca a A)", (m) => { m.enlaces["enl-X2"] = { id: "enl-X2", tipo: "resultado", origenId: { kind: "entidad", id: "ent-P" }, destinoId: { kind: "entidad", id: "ent-X" }, etiqueta: "" }; }],
];

describe("LEY GRANO-PIEZA (1) QUIETUD — presentación de la vecindad y mutación AJENA ⇒ `sincronizado`", () => {
  for (const [nombre, mutar] of QUIETUD) {
    test(`${nombre} ⇒ sincronizado`, () => {
      const m = clon();
      mutar(m);
      expect(firmaPieza(m, PIEZA_A)).toBe(frozenA); // la firma de la PIEZA no se mueve
      expect(driftA(m)).toBe("sincronizado");
    });
  }

  test("round-trip de persistencia (datos REALES del fixture) es invariante de firma de PIEZA", () => {
    const bib = hidratar(fixture.biblioteca);
    const f1 = firmaPieza(bib, "ent-Category")!;
    const bib2 = roundtrip(bib);
    expect(firmaPieza(bib2, "ent-Category")).toBe(f1);
  });
});

// (2) SENSIBILIDAD-PIEZA — cada parte de la vecindad de A, al mutar, mueve la firma ⇒ `divergente`.
const SENSIBILIDAD: Array<[string, (m: Modelo) => void]> = [
  ["pieza: ent-A.nombre", (m) => { m.entidades["ent-A"]!.nombre = "Arcilla"; }],
  ["pieza: ent-A.esencia", (m) => { m.entidades["ent-A"]!.esencia = "informacional"; }],
  ["pieza: ent-A.afiliacion", (m) => { m.entidades["ent-A"]!.afiliacion = "ambiental"; }],
  ["pieza: ent-A.descripcion", (m) => { m.entidades["ent-A"]!.descripcion = "otra"; }],
  ["estado: st-A0.nombre", (m) => { m.estados["st-A0"]!.nombre = "seca"; }],
  ["estado: st-A0.designaciones", (m) => { m.estados["st-A0"]!.designaciones = ["final"]; }],
  ["estado: st-A0.orden", (m) => { m.estados["st-A0"]!.orden = 7; }],
  ["estado: st-A0.duracion", (m) => { m.estados["st-A0"]!.duracion = { unidad: "min", min: 0, nominal: 1, max: 2 }; }],
  ["estado: +estado de A", (m) => { m.estados["st-A1"] = { id: "st-A1", entidadId: "ent-A", nombre: "seca", orden: 1 }; }],
  ["estado: -quita st-A0", (m) => { delete m.estados["st-A0"]; }],
  ["enlace(obj): enl-A.tasa", (m) => { m.enlaces["enl-A"]!.tasa = "9"; }],
  ["enlace(obj): enl-A.tipo", (m) => { m.enlaces["enl-A"]!.tipo = "resultado"; }],
  ["enlace(obj): enl-A redirige destino", (m) => { m.enlaces["enl-A"]!.destinoId = { kind: "entidad", id: "ent-X" }; }],
  ["enlace(obj): -quita enl-A", (m) => { delete m.enlaces["enl-A"]; }],
  ["enlace(estado): enl-As.tipo (incidente vía estado de A)", (m) => { m.enlaces["enl-As"]!.tipo = "consumo"; }],
  ["enlace(estado): -quita enl-As", (m) => { delete m.enlaces["enl-As"]; }],
  ["enlace: +nuevo incidente a A (la frontera crece)", (m) => { m.enlaces["enl-A2"] = { id: "enl-A2", tipo: "resultado", origenId: { kind: "entidad", id: "ent-P" }, destinoId: { kind: "entidad", id: "ent-A" }, etiqueta: "" }; }],
  ["abanico: ab-A.operador (intersecta enl-A)", (m) => { m.abanicos!["ab-A"]!.operador = "O"; }],
];

describe("LEY GRANO-PIEZA (2) SENSIBILIDAD — la vecindad de A, al mutar, ⇒ `divergente` (el aviso no es ciego)", () => {
  for (const [nombre, mutar] of SENSIBILIDAD) {
    test(`${nombre} ⇒ divergente`, () => {
      const m = clon();
      mutar(m);
      expect(firmaPieza(m, PIEZA_A)).not.toBe(frozenA);
      expect(driftA(m)).toBe("divergente");
    });
  }
});

// (3) COMPOSICIÓN — el INVERSO falsable de la amarra 2b.
/** Dos cosas ancladas a piezas DISTINTAS (A y X) de la MISMA biblioteca, ambas a grano pieza. */
function consumidorDosAnclajes(): { modelo: Modelo; idA: Id; idX: Id } {
  let m: Modelo = { ...base, id: "consumidor-AX" };
  m = anclarGranoPieza(m, "ent-A", PIEZA_A);
  m = anclarGranoPieza(m, "ent-X", PIEZA_X);
  return { modelo: m, idA: "ent-A", idX: "ent-X" };
}

describe("LEY GRANO-PIEZA (3) COMPOSICIÓN — INVERSO de la amarra 2b: el ruido de biblioteca se apaga", () => {
  const { modelo, idA, idX } = consumidorDosAnclajes();

  test("biblioteca intacta ⇒ AMBAS sincronizadas (a través del resolutor real del store)", () => {
    const drift = evaluarDriftModelo(modelo, construirResolverHashVivo({ [base.id]: base }));
    expect(drift[idA]).toBe("sincronizado");
    expect(drift[idX]).toBe("sincronizado");
  });

  test("mutar la pieza de A ⇒ A `divergente`, X `sincronizado` (C4 mata el ruido; 2b los hundía a ambos)", () => {
    const viva = clon();
    viva.entidades["ent-A"]!.nombre = "Arcilla"; // muta SOLO la vecindad de A
    const drift = evaluarDriftModelo(modelo, construirResolverHashVivo({ [base.id]: viva }));
    expect(drift[idA]).toBe("divergente");
    expect(drift[idX]).toBe("sincronizado"); // ← la prueba dura: X NO se entera
  });

  test("simétrico: mutar la pieza de X ⇒ X `divergente`, A `sincronizado`", () => {
    const viva = clon();
    viva.estados["st-X0"]!.nombre = "tibio"; // muta SOLO la vecindad de X (su estado)
    const drift = evaluarDriftModelo(modelo, construirResolverHashVivo({ [base.id]: viva }));
    expect(drift[idX]).toBe("divergente");
    expect(drift[idA]).toBe("sincronizado");
  });

  test("inverso sobre DATOS REALES (fixture: 3 piezas sin enlaces ⇒ vecindades disjuntas)", () => {
    const bib = hidratar(fixture.biblioteca);
    let cons: Modelo = { ...bib, id: "consumidor-real" };
    const congelarReal = (m: Modelo, ent: Id, pieza: Id): Modelo => {
      const fp = firmaPieza(bib, pieza)!;
      const r = anclarAPieza(m, ent, { modeloId: bib.id, frozenAtHash: firmaBiblioteca(bib) }, pieza, fp);
      if (!r.ok) throw new Error(r.error);
      return r.value;
    };
    cons = congelarReal(cons, "ent-Category", "ent-Category");
    cons = congelarReal(cons, "ent-Component", "ent-Component");

    const vivaMut: Modelo = { ...bib, entidades: { ...bib.entidades, "ent-Category": { ...bib.entidades["ent-Category"]!, nombre: "Categoría (mutada)" } } };
    const drift = evaluarDriftModelo(cons, construirResolverHashVivo({ [bib.id]: vivaMut }));
    expect(drift["ent-Category"]).toBe("divergente");
    expect(drift["ent-Component"]).toBe("sincronizado");
  });
});

// (4) PIEZA AUSENTE — la pieza desaparece de la biblioteca viva: `divergente`, NO `no-resuelto`.
describe("LEY GRANO-PIEZA (4) PIEZA AUSENTE — pieza borrada de la biblioteca leída ⇒ `divergente`", () => {
  test("biblioteca SÍ leída pero sin la Pieza ⇒ `divergente` (centinela de pieza ausente, no `no-resuelto`)", () => {
    const viva = clon();
    delete viva.entidades["ent-A"]; // la Pieza desaparece bajo los pies de la cosa anclada
    expect(firmaPieza(viva, PIEZA_A)).toBeNull();
    expect(firmaVivaAnclaje(cosaA.anclaje as Anclaje, viva)).toBe(CENTINELA_PIEZA_AUSENTE);
    expect(driftA(viva)).toBe("divergente");
  });

  test("biblioteca NO leída (null) ⇒ `no-resuelto` (honestidad temporal: no se inventa divergencia)", () => {
    expect(driftA(null)).toBe("no-resuelto");
  });
});

// — helpers de persistencia (pipeline real de opforja) —
function hidratar(modeloCrudo: unknown): Modelo {
  const crudo = structuredClone(modeloCrudo) as Record<string, unknown>;
  const conScaffold = { nextSeq: 1, ...crudo };
  const r = hidratarModelo(JSON.stringify({ formato: FORMATO, modelo: conScaffold }));
  if (!r.ok) throw new Error(`fixture inhidratable: ${r.error}`);
  return r.value;
}

function roundtrip(m: Modelo): Modelo {
  const r = hidratarModelo(exportarModelo(m));
  if (!r.ok) throw new Error(`round-trip inhidratable: ${r.error}`);
  return r.value;
}
