import { describe, expect, test } from "bun:test";
import { seccionLocal, conjunto, type ConjuntoDeHechos, type Hecho } from "../hechos";
import type { Id, Modelo, Resultado } from "../tipos";
import { verificarEquivalencia, type RealizacionAlternativa } from "./verificar";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function hechosDeMap(c: ConjuntoDeHechos): Hecho[] {
  return [...c.values()];
}

function construirDosVariantesEquivalentes(): {
  modelo: Modelo;
  eq: RealizacionAlternativa;
} {
  const modelo = crearModeloRaiz();
  const { procesoId, aId, bId } = agregarProcesoConFrontiera(modelo);
  const opdA = crearOpdHijo(modelo, "SD1-A", "SD1");
  const opdB = crearOpdHijo(modelo, "SD1-B", "SD1");
  agregarApariencias(modelo, opdA, [aId, bId, procesoId]);
  agregarApariencias(modelo, opdB, [aId, bId, procesoId]);
  return { modelo, eq: { padreId: procesoId, opdA, opdB } };
}

function construirDosVariantesDistintas(): {
  modelo: Modelo;
  eq: RealizacionAlternativa;
} {
  const modelo = crearModeloRaiz();
  const { procesoId, aId } = agregarProcesoConFrontiera(modelo);
  const opdA = crearOpdHijo(modelo, "SD1-A", "SD1");
  const opdB = crearOpdHijo(modelo, "SD1-B", "SD1");
  agregarApariencias(modelo, opdA, [aId, procesoId]);
  agregarApariencias(modelo, opdB, [procesoId]);
  return { modelo, eq: { padreId: procesoId, opdA, opdB } };
}

let _nextSeq = 1000;

function crearModeloRaiz(): Modelo {
  return {
    id: "modelo-eq",
    nombre: "Modelo Equivalencia",
    opdRaizId: "opd-raiz",
    opds: {
      "opd-raiz": { id: "opd-raiz", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} },
    },
    entidades: {},
    estados: {},
    enlaces: {},
    nextSeq: 1,
  };
}

function crearOpdHijo(modelo: Modelo, nombre: string, padreNombre: string): Id {
  const padreId = Object.keys(modelo.opds).find(
    (k) => modelo.opds[k]!.nombre === padreNombre,
  )!;
  const id = `opd-eq-${_nextSeq++}`;
  modelo.opds[id] = { id, nombre, padreId, apariencias: {}, enlaces: {} };
  return id;
}

function agregarProcesoConFrontiera(modelo: Modelo): {
  procesoId: Id;
  aId: Id;
  bId: Id;
} {
  const aId = `ent-a-${_nextSeq++}`;
  const bId = `ent-b-${_nextSeq++}`;
  const pId = `ent-p-${_nextSeq++}`;
  const aAparId = `ap-a-${_nextSeq++}`;
  const bAparId = `ap-b-${_nextSeq++}`;
  const pAparId = `ap-p-${_nextSeq++}`;

  modelo.entidades[aId] = {
    id: aId, tipo: "objeto", nombre: "MateriaPrima",
    esencia: "fisica", afiliacion: "sistemica",
  };
  modelo.entidades[bId] = {
    id: bId, tipo: "objeto", nombre: "Producto",
    esencia: "fisica", afiliacion: "sistemica",
  };
  modelo.entidades[pId] = {
    id: pId, tipo: "proceso", nombre: "Transformar",
    esencia: "informacional", afiliacion: "sistemica",
  };

  const raiz = modelo.opds[modelo.opdRaizId]!;
  raiz.apariencias[aAparId] = { id: aAparId, entidadId: aId, opdId: raiz.id, x: 100, y: 60, width: 120, height: 50 };
  raiz.apariencias[bAparId] = { id: bAparId, entidadId: bId, opdId: raiz.id, x: 100, y: 160, width: 120, height: 50 };
  raiz.apariencias[pAparId] = { id: pAparId, entidadId: pId, opdId: raiz.id, x: 320, y: 110, width: 140, height: 60 };

  const enlConsumo = `enl-c-${_nextSeq++}`;
  const enlResultado = `enl-r-${_nextSeq++}`;
  const aeConsumo = `ae-c-${_nextSeq++}`;
  const aeResultado = `ae-r-${_nextSeq++}`;

  modelo.enlaces[enlConsumo] = {
    id: enlConsumo, tipo: "consumo",
    origenId: { kind: "entidad", id: aId },
    destinoId: { kind: "entidad", id: pId },
    etiqueta: "",
  };
  modelo.enlaces[enlResultado] = {
    id: enlResultado, tipo: "resultado",
    origenId: { kind: "entidad", id: pId },
    destinoId: { kind: "entidad", id: bId },
    etiqueta: "",
  };
  raiz.enlaces[aeConsumo] = { id: aeConsumo, enlaceId: enlConsumo, opdId: raiz.id, vertices: [] };
  raiz.enlaces[aeResultado] = { id: aeResultado, enlaceId: enlResultado, opdId: raiz.id, vertices: [] };

  return { procesoId: pId, aId, bId };
}

function agregarApariencias(modelo: Modelo, opdId: Id, entidadIds: Id[]): void {
  const opd = modelo.opds[opdId]!;
  for (const entidadId of entidadIds) {
    const ent = modelo.entidades[entidadId];
    if (!ent) continue;
    const apId = `ap-${opdId}-${entidadId}`;
    opd.apariencias[apId] = {
      id: apId, entidadId, opdId,
      x: 100, y: 100, width: 120, height: 50,
    };
  }
}

describe("equivalencia/verificar", () => {
  test("dos descomposiciones con misma frontera → equivalente", () => {
    const { modelo, eq } = construirDosVariantesEquivalentes();
    const r = verificarEquivalencia(modelo, eq);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.equivalente).toBe(true);
  });

  test("frontera distinta → no equivalente, reporta diferencias", () => {
    const { modelo, eq } = construirDosVariantesDistintas();
    const r = verificarEquivalencia(modelo, eq);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.equivalente).toBe(false);
      expect(r.value.diferencias).toBeDefined();
      expect(r.value.diferencias!.size).toBeGreaterThan(0);
    }
  });

  test("verificarEquivalencia es pura: no muta el modelo", () => {
    const { modelo, eq } = construirDosVariantesEquivalentes();
    const antes = JSON.stringify(modelo);
    verificarEquivalencia(modelo, eq);
    expect(JSON.stringify(modelo)).toBe(antes);
  });
});
