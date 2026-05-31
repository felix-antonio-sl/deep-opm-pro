import { describe, expect, test } from "bun:test";
import type { Apariencia, Estado, Id, Modelo, Opd } from "./tipos";
import {
  estadoVisibleEnAparicion,
  estadosSuprimidosLocalmente,
  estadosVisiblesEnAparicion,
  hayEstadosOcultosEnAparicion,
  mostrarEstadoEnAparicion,
  mostrarTodosLosEstadosEnAparicion,
  suprimirEstadoEnAparicion,
  suprimirTodosLosEstadosEnAparicion,
} from "./visibilidadEstados";

function estado(id: Id, entidadId: Id, extra: Partial<Estado> = {}): Estado {
  return { id, entidadId, nombre: id, ...extra };
}

function apariencia(id: Id, entidadId: Id, opdId: Id, extra: Partial<Apariencia> = {}): Apariencia {
  return { id, entidadId, opdId, x: 0, y: 0, width: 100, height: 60, ...extra };
}

function modeloBase(): { modelo: Modelo; opdId: Id; objetoId: Id; ap: Apariencia; s1: Estado; s2: Estado } {
  const opdId = "opd-1";
  const objetoId = "o-1";
  const s1 = estado("s-1", objetoId);
  const s2 = estado("s-2", objetoId);
  const ap = apariencia("ap-1", objetoId, opdId);
  const opd: Opd = {
    id: opdId,
    nombre: "SD",
    padreId: null,
    apariencias: { [ap.id]: ap },
    enlaces: {},
  };
  const modelo = {
    opdRaizId: opdId,
    opdActivoId: opdId,
    nextSeq: 10,
    entidades: { [objetoId]: { id: objetoId, tipo: "objeto", nombre: "Objeto", afiliacion: "sistemica", esencia: "informacional" } },
    estados: { [s1.id]: s1, [s2.id]: s2 },
    enlaces: {},
    opds: { [opdId]: opd },
  } as unknown as Modelo;
  return { modelo, opdId, objetoId, ap, s1, s2 };
}

describe("estadoVisibleEnAparicion — predicado efectivo (meet global ∧ local)", () => {
  test("visible cuando no hay supresión global ni local", () => {
    const { ap, s1 } = modeloBase();
    expect(estadoVisibleEnAparicion(s1, ap)).toBe(true);
  });

  test("global domina: estado.suprimido oculta en TODA aparición sin importar local", () => {
    const { ap, s1 } = modeloBase();
    const globalSuprimido = { ...s1, suprimido: true };
    expect(estadoVisibleEnAparicion(globalSuprimido, ap)).toBe(false);
    // aun si NO está en la lista local, la global manda
    expect(estadoVisibleEnAparicion(globalSuprimido, { ...ap, estadosSuprimidos: [] })).toBe(false);
  });

  test("local refina: oculta solo en esta aparición", () => {
    const { ap, s1 } = modeloBase();
    const apConLocal = { ...ap, estadosSuprimidos: [s1.id] };
    expect(estadoVisibleEnAparicion(s1, apConLocal)).toBe(false);
  });

  test("local de un estado distinto no afecta", () => {
    const { ap, s1, s2 } = modeloBase();
    const apConLocal = { ...ap, estadosSuprimidos: [s2.id] };
    expect(estadoVisibleEnAparicion(s1, apConLocal)).toBe(true);
  });

  test("dimensiones ortogonales: global y local simultáneas → oculto (idempotente conceptual)", () => {
    const { ap, s1 } = modeloBase();
    const globalSuprimido = { ...s1, suprimido: true };
    const apConLocal = { ...ap, estadosSuprimidos: [s1.id] };
    expect(estadoVisibleEnAparicion(globalSuprimido, apConLocal)).toBe(false);
  });
});

describe("estadosVisiblesEnAparicion / estadosSuprimidosLocalmente", () => {
  test("filtra el conjunto del objeto por el predicado efectivo", () => {
    const { modelo, objetoId, ap, s1 } = modeloBase();
    const apConLocal = { ...ap, estadosSuprimidos: [s1.id] };
    const visibles = estadosVisiblesEnAparicion(modelo, objetoId, apConLocal);
    expect(visibles.map((e) => e.id)).toEqual(["s-2"]);
  });

  test("estadosSuprimidosLocalmente ignora ids colgantes y de otro objeto", () => {
    const { modelo, objetoId, ap } = modeloBase();
    const apSucia = { ...ap, estadosSuprimidos: ["s-1", "fantasma", "s-de-otro"] };
    const limpios = estadosSuprimidosLocalmente(modelo, objetoId, apSucia);
    expect(limpios).toEqual(["s-1"]);
  });
});

describe("suprimirEstadoEnAparicion (op pura inmutable)", () => {
  test("registra el id local y no muta el modelo original", () => {
    const { modelo, opdId, ap, s1 } = modeloBase();
    const r = suprimirEstadoEnAparicion(modelo, opdId, ap.id, s1.id);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.opds[opdId]!.apariencias[ap.id]!.estadosSuprimidos).toEqual([s1.id]);
    // inmutabilidad
    expect(modelo.opds[opdId]!.apariencias[ap.id]!.estadosSuprimidos).toBeUndefined();
  });

  test("idempotente: suprimir dos veces no duplica", () => {
    const { modelo, opdId, ap, s1 } = modeloBase();
    const r1 = suprimirEstadoEnAparicion(modelo, opdId, ap.id, s1.id);
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;
    const r2 = suprimirEstadoEnAparicion(r1.value, opdId, ap.id, s1.id);
    expect(r2.ok).toBe(true);
    if (!r2.ok) return;
    expect(r2.value.opds[opdId]!.apariencias[ap.id]!.estadosSuprimidos).toEqual([s1.id]);
    // idempotencia referencial: el modelo no cambia
    expect(r2.value).toBe(r1.value);
  });

  test("SELLO 3: permite registrar local aunque el estado ya esté global-suprimido (ortogonal)", () => {
    const base = modeloBase();
    const modelo = { ...base.modelo, estados: { ...base.modelo.estados, [base.s1.id]: { ...base.s1, suprimido: true } } };
    const r = suprimirEstadoEnAparicion(modelo, base.opdId, base.ap.id, base.s1.id);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.opds[base.opdId]!.apariencias[base.ap.id]!.estadosSuprimidos).toEqual([base.s1.id]);
  });

  test("rechaza estado con enlaces incidentes (paridad con supresión global)", () => {
    const base = modeloBase();
    const modelo = {
      ...base.modelo,
      enlaces: {
        "e-1": {
          id: "e-1",
          tipo: "agente",
          origenId: { kind: "estado", id: base.s1.id },
          destinoId: { kind: "entidad", id: "p-1" },
        },
      },
    } as unknown as Modelo;
    const r = suprimirEstadoEnAparicion(modelo, base.opdId, base.ap.id, base.s1.id);
    expect(r.ok).toBe(false);
  });

  test("rechaza si el estado no pertenece al objeto de la aparición", () => {
    const { modelo, opdId, ap } = modeloBase();
    const r = suprimirEstadoEnAparicion(modelo, opdId, ap.id, "s-ajeno");
    expect(r.ok).toBe(false);
  });

  test("falla con opd/aparición inexistente", () => {
    const { modelo, ap, s1 } = modeloBase();
    expect(suprimirEstadoEnAparicion(modelo, "opd-x", ap.id, s1.id).ok).toBe(false);
    expect(suprimirEstadoEnAparicion(modelo, "opd-1", "ap-x", s1.id).ok).toBe(false);
  });
});

describe("mostrarEstadoEnAparicion (restaurar local)", () => {
  test("quita el id de la lista local", () => {
    const { modelo, opdId, ap, s1, s2 } = modeloBase();
    const supr = suprimirEstadoEnAparicion(
      suprimirEstadoEnAparicion(modelo, opdId, ap.id, s1.id).ok ? (suprimirEstadoEnAparicion(modelo, opdId, ap.id, s1.id) as { value: Modelo }).value : modelo,
      opdId, ap.id, s2.id,
    );
    expect(supr.ok).toBe(true);
    if (!supr.ok) return;
    const r = mostrarEstadoEnAparicion(supr.value, opdId, ap.id, s1.id);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.opds[opdId]!.apariencias[ap.id]!.estadosSuprimidos).toEqual([s2.id]);
  });

  test("no-op si el estado no estaba local-suprimido", () => {
    const { modelo, opdId, ap, s1 } = modeloBase();
    const r = mostrarEstadoEnAparicion(modelo, opdId, ap.id, s1.id);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value).toBe(modelo);
  });

  test("limpia el campo cuando la lista queda vacía (normalización)", () => {
    const { modelo, opdId, ap, s1 } = modeloBase();
    const supr = suprimirEstadoEnAparicion(modelo, opdId, ap.id, s1.id);
    expect(supr.ok).toBe(true);
    if (!supr.ok) return;
    const r = mostrarEstadoEnAparicion(supr.value, opdId, ap.id, s1.id);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.opds[opdId]!.apariencias[ap.id]!.estadosSuprimidos).toBeUndefined();
  });
});

describe("suprimir/mostrar TODOS en la aparición (suppressAll/expressAll por fibra)", () => {
  test("suprimir todos llena la lista con los estados visibles del objeto", () => {
    const { modelo, opdId, ap } = modeloBase();
    const r = suprimirTodosLosEstadosEnAparicion(modelo, opdId, ap.id);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect((r.value.opds[opdId]!.apariencias[ap.id]!.estadosSuprimidos ?? []).sort()).toEqual(["s-1", "s-2"]);
  });

  test("suprimir todos OMITE estados con enlaces incidentes (no se pueden suprimir)", () => {
    const base = modeloBase();
    const modelo = {
      ...base.modelo,
      enlaces: {
        "e-1": { id: "e-1", tipo: "agente", origenId: { kind: "estado", id: base.s1.id }, destinoId: { kind: "entidad", id: "p-1" } },
      },
    } as unknown as Modelo;
    const r = suprimirTodosLosEstadosEnAparicion(modelo, base.opdId, base.ap.id);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    // s-1 tiene enlace → no se suprime; s-2 sí
    expect(r.value.opds[base.opdId]!.apariencias[base.ap.id]!.estadosSuprimidos).toEqual(["s-2"]);
  });

  test("mostrar todos limpia la lista local (no toca la supresión global)", () => {
    const base = modeloBase();
    const modelo = { ...base.modelo, estados: { ...base.modelo.estados, [base.s1.id]: { ...base.s1, suprimido: true } } };
    const supr = suprimirTodosLosEstadosEnAparicion(modelo, base.opdId, base.ap.id);
    expect(supr.ok).toBe(true);
    if (!supr.ok) return;
    const r = mostrarTodosLosEstadosEnAparicion(supr.value, base.opdId, base.ap.id);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.opds[base.opdId]!.apariencias[base.ap.id]!.estadosSuprimidos).toBeUndefined();
    // la global persiste
    expect(r.value.estados[base.s1.id]!.suprimido).toBe(true);
  });
});

describe("hayEstadosOcultosEnAparicion (badge/elipsis por cualquier causa)", () => {
  test("true si hay supresión global", () => {
    const base = modeloBase();
    const modelo = { ...base.modelo, estados: { ...base.modelo.estados, [base.s1.id]: { ...base.s1, suprimido: true } } };
    expect(hayEstadosOcultosEnAparicion(modelo, base.objetoId, base.ap)).toBe(true);
  });

  test("true si hay supresión local", () => {
    const { modelo, objetoId, ap, s1 } = modeloBase();
    expect(hayEstadosOcultosEnAparicion(modelo, objetoId, { ...ap, estadosSuprimidos: [s1.id] })).toBe(true);
  });

  test("false si todos los estados son visibles", () => {
    const { modelo, objetoId, ap } = modeloBase();
    expect(hayEstadosOcultosEnAparicion(modelo, objetoId, ap)).toBe(false);
  });
});
