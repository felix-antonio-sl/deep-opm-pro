// LEY ANCLAJE — SENSIBILIDAD de la firma semántica (la DUAL de la quietud; sella el falso-negativo).
//
// Acta gobernante: docs/auditorias/2026-06-26-acta-quietud-firma-centinela.md (iteración 3, Ley 2:
// «batería de mutaciones SEMÁNTICAS — cada una DEBE volver `divergente`»). Es la definición
// operacional, enumerada y auditable, de «qué es la misma Pieza».
//
// La quietud sola sería satisfecha por una firma constante (no grita nunca = no avisa nunca = perro
// guardián dormido). Esta ley es la otra mandíbula de la pinza: CADA campo FIRMADO, al mutar, mueve
// la firma ⇒ `divergente`; CADA campo EXCLUIDO, al mutar, NO la mueve ⇒ `sincronizado`. Si alguien
// reclasifica un campo de significado a presentación (debilita la firma), una de estas filas enrojece.
import { describe, expect, test } from "bun:test";
import type { Id, Modelo } from "../modelo/tipos";
import { anclarAPieza, evaluarDriftEntidad, firmaBiblioteca } from "../modelo/operaciones";

const PIEZA: Id = "ent-A";

/** Biblioteca base rica: una cosa con estado, un proceso, un enlace, un abanico y apariencia (presentación). */
function bibliotecaBase(): Modelo {
  return {
    id: "lib-0",
    nombre: "Biblioteca de prueba",
    opdRaizId: "opd-0",
    nextSeq: 99,
    opds: {
      "opd-0": {
        id: "opd-0",
        nombre: "SD",
        padreId: null,
        ordenInzoom: [["ent-B"]],
        ordenLocal: 3,
        apariencias: {
          "ap-0": { id: "ap-0", entidadId: "ent-A", opdId: "opd-0", x: 10, y: 20, width: 100, height: 60, modoPlegado: "completo", estadosSuprimidos: [] },
          "ap-1": { id: "ap-1", entidadId: "ent-B", opdId: "opd-0", x: 200, y: 20, width: 100, height: 60 },
        },
        enlaces: {
          "ae-0": { id: "ae-0", enlaceId: "enl-0", opdId: "opd-0", vertices: [{ x: 1, y: 1 }] },
        },
      },
    },
    entidades: {
      "ent-A": { id: "ent-A", tipo: "objeto", nombre: "Greda", esencia: "fisica", afiliacion: "sistemica", descripcion: "barro", estereotipoId: "stereo-1", urls: [{ id: "u1", url: "x://a", tipo: "articulo" }], refinamientos: { descomposicion: { opdId: "opd-0" } }, imagen: { url: "x://img", modo: "imagen" }, layoutEstados: "horizontal" },
      "ent-B": { id: "ent-B", tipo: "proceso", nombre: "Cocer", esencia: "fisica", afiliacion: "sistemica" },
    },
    estados: {
      "st-0": { id: "st-0", entidadId: "ent-A", nombre: "húmeda", esInicial: true, designaciones: ["inicial"], duracion: { unidad: "h", min: 1, nominal: 2, max: 3 }, orden: 0, suprimido: false, x: 5, y: 5, width: 30, height: 14 },
    },
    enlaces: {
      "enl-0": { id: "enl-0", tipo: "consumo", origenId: { kind: "entidad", id: "ent-A" }, destinoId: { kind: "entidad", id: "ent-B" }, etiqueta: "", multiplicidadOrigen: "1", modificador: "no", tasa: "2", rutaEtiqueta: "arriba", mostrarRequisitos: false },
    },
    abanicos: {
      "ab-0": { id: "ab-0", opdId: "opd-0", puertoComun: { entidadId: "ent-B", lado: "origen", portId: "port-XYZ" }, puertoEntidadId: "ent-B", operador: "XOR", enlaceIds: ["enl-0"] },
    },
  } as Modelo;
}

const base = bibliotecaBase();

/** Ancla una cosa (en un modelo consumidor cualquiera) a la `base`; el frozenAtHash congela la firma de `base`. */
function cosaAnclada(): Modelo {
  const consumidor: Modelo = { ...base, id: "consumidor" };
  const r = anclarAPieza(consumidor, "ent-A", { modeloId: base.id, frozenAtHash: firmaBiblioteca(base) }, PIEZA);
  if (!r.ok) throw new Error(r.error);
  return r.value;
}
const consumidor = cosaAnclada();

/** Veredicto de drift de la cosa anclada contra una versión VIVA de la biblioteca. */
function driftContra(libViva: Modelo) {
  return evaluarDriftEntidad(consumidor.entidades["ent-A"]!, firmaBiblioteca(libViva));
}

// Cada mutación produce una biblioteca viva alterada en UN campo. `clon` es deep por JSON (datos planos).
function clon(): Modelo {
  return JSON.parse(JSON.stringify(base)) as Modelo;
}

const MUTACIONES_SEMANTICAS: Array<[string, (m: Modelo) => void]> = [
  ["entidad.tipo", (m) => { m.entidades["ent-B"]!.tipo = "objeto"; }],
  ["entidad.nombre", (m) => { m.entidades["ent-A"]!.nombre = "Arcilla"; }],
  ["entidad.esencia", (m) => { m.entidades["ent-A"]!.esencia = "informacional"; }],
  ["entidad.afiliacion", (m) => { m.entidades["ent-A"]!.afiliacion = "ambiental"; }],
  ["entidad.descripcion", (m) => { m.entidades["ent-A"]!.descripcion = "otra"; }],
  ["entidad.urls", (m) => { m.entidades["ent-A"]!.urls = [{ id: "u2", url: "x://b", tipo: "video" }]; }],
  ["entidad.refinamientos", (m) => { m.entidades["ent-A"]!.refinamientos = { despliegue: { opdId: "opd-0", modo: "agregacion" } }; }],
  ["entidad.estereotipoId", (m) => { m.entidades["ent-A"]!.estereotipoId = "stereo-2"; }],
  ["entidad +nueva", (m) => { m.entidades["ent-C"] = { id: "ent-C", tipo: "objeto", nombre: "Nueva", esencia: "fisica", afiliacion: "sistemica" }; }],
  ["entidad -quita", (m) => { delete m.entidades["ent-B"]; }],
  ["estado +nuevo", (m) => { m.estados["st-1"] = { id: "st-1", entidadId: "ent-A", nombre: "seca" }; }],
  ["estado -quita", (m) => { delete m.estados["st-0"]; }],
  ["estado.designaciones", (m) => { m.estados["st-0"]!.designaciones = ["final"]; }],
  ["estado.duracion", (m) => { m.estados["st-0"]!.duracion = { unidad: "min", min: 0, nominal: 1, max: 2 }; }],
  ["estado.orden", (m) => { m.estados["st-0"]!.orden = 7; }],
  ["enlace +nuevo", (m) => { m.enlaces["enl-1"] = { id: "enl-1", tipo: "resultado", origenId: { kind: "entidad", id: "ent-B" }, destinoId: { kind: "entidad", id: "ent-A" }, etiqueta: "" }; }],
  ["enlace -quita", (m) => { delete m.enlaces["enl-0"]; }],
  ["enlace redirige destino", (m) => { m.enlaces["enl-0"]!.destinoId = { kind: "entidad", id: "ent-A" }; }],
  ["enlace.multiplicidad", (m) => { m.enlaces["enl-0"]!.multiplicidadOrigen = "n"; }],
  ["enlace.modificador", (m) => { m.enlaces["enl-0"]!.modificador = "evento"; }],
  ["enlace.tasa", (m) => { m.enlaces["enl-0"]!.tasa = "9"; }],
  ["opd.ordenInzoom", (m) => { m.opds["opd-0"]!.ordenInzoom = [["ent-B"], ["ent-A"]]; }],
  ["abanico.operador", (m) => { m.abanicos!["ab-0"]!.operador = "O"; }],
];

const MUTACIONES_PRESENTACION: Array<[string, (m: Modelo) => void]> = [
  ["apariencia.x/y", (m) => { m.opds["opd-0"]!.apariencias["ap-0"]!.x = 9999; m.opds["opd-0"]!.apariencias["ap-0"]!.y = -9999; }],
  ["apariencia.width/height", (m) => { m.opds["opd-0"]!.apariencias["ap-0"]!.width = 5; m.opds["opd-0"]!.apariencias["ap-0"]!.height = 5; }],
  ["apariencia.modoPlegado", (m) => { m.opds["opd-0"]!.apariencias["ap-0"]!.modoPlegado = "plegado"; }],
  ["apariencia.estadosSuprimidos", (m) => { m.opds["opd-0"]!.apariencias["ap-0"]!.estadosSuprimidos = ["st-0"]; }],
  ["aparienciaEnlace.vertices", (m) => { m.opds["opd-0"]!.enlaces["ae-0"]!.vertices = [{ x: 50, y: 50 }, { x: 60, y: 60 }]; }],
  ["opd.ordenLocal", (m) => { m.opds["opd-0"]!.ordenLocal = 99; }],
  ["estado.suprimido", (m) => { m.estados["st-0"]!.suprimido = true; }],
  ["estado.x/y/w/h", (m) => { m.estados["st-0"]!.x = 1; m.estados["st-0"]!.y = 1; m.estados["st-0"]!.width = 1; m.estados["st-0"]!.height = 1; }],
  ["entidad.imagen", (m) => { m.entidades["ent-A"]!.imagen = { url: "x://otra", modo: "texto" }; }],
  ["entidad.layoutEstados", (m) => { m.entidades["ent-A"]!.layoutEstados = "vertical"; }],
  ["enlace.rutaEtiqueta", (m) => { m.enlaces["enl-0"]!.rutaEtiqueta = "abajo"; }],
  ["enlace.mostrarRequisitos", (m) => { m.enlaces["enl-0"]!.mostrarRequisitos = true; }],
  ["abanico.puertoComun.portId", (m) => { m.abanicos!["ab-0"]!.puertoComun.portId = "port-OTRO"; }],
];

describe("LEY ANCLAJE SENSIBILIDAD — cada campo FIRMADO mutado ⇒ `divergente` (el aviso no es ciego)", () => {
  test("la cosa anclada arranca `sincronizado` contra la biblioteca intacta (control)", () => {
    expect(driftContra(base)).toBe("sincronizado");
  });

  for (const [nombre, mutar] of MUTACIONES_SEMANTICAS) {
    test(`mutar ${nombre} ⇒ divergente`, () => {
      const m = clon();
      mutar(m);
      expect(firmaBiblioteca(m)).not.toBe(firmaBiblioteca(base));
      expect(driftContra(m)).toBe("divergente");
    });
  }
});

describe("LEY ANCLAJE SENSIBILIDAD (dual) — cada campo EXCLUIDO mutado ⇒ `sincronizado` (presentación es muda)", () => {
  for (const [nombre, mutar] of MUTACIONES_PRESENTACION) {
    test(`mutar ${nombre} ⇒ sincronizado`, () => {
      const m = clon();
      mutar(m);
      expect(firmaBiblioteca(m)).toBe(firmaBiblioteca(base));
      expect(driftContra(m)).toBe("sincronizado");
    });
  }
});
