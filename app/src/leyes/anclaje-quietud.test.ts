// LEY ANCLAJE — QUIETUD de la firma SEMÁNTICA (sub-corte de quietud, D-2 → iteración 3).
//
// Acta gobernante: docs/auditorias/2026-06-26-acta-quietud-firma-centinela.md
// (iteración 3 «firma semántica» + «Ratificación HITL del custodio»).
//
// El Centinela solo tiene valor si NO grita cuando nada cambió. El falso-positivo es riesgo
// de PRIMER ORDEN (acta §«El falso-positivo…»): el primer grito de lobo reclasifica el
// Centinela de oráculo a ruido y mata el aviso real. Cero falsos positivos ES la definición
// del producto.
//
// El pecado de origen (acta «El diagnóstico común»): `firmaSnapshotSubmodelo` hasheaba el modelo
// CRUDO ENTERO —mezclando significado con presentación (coords, `modoPlegado`, ports)—. La ruta de
// persistencia (`exportarModelo`/`hidratarModelo`) y cualquier re-layout reescriben esa
// representación SIN cambio semántico ⇒ `firma(antes) ≠ firma(después)` ⇒ falso-divergente.
//
// El fix RATIFICADO (iteración 3 + custodio): la firma proyecta el SIGNIFICADO y excluye la
// PRESENTACIÓN (`proyectarSemantico`, `app/src/modelo/submodelos/firmaSemantica.ts`). Esta ley es
// la PINZA del acta:
//   (A) QUIETUD round-trip: anclar → exportar+re-hidratar la biblioteca SIN cambio → `sincronizado`.
//   (C) QUIETUD re-layout: mover/redimensionar/plegar apariencias → `sincronizado`.
//   (B) DISCRIMINACIÓN PRESERVADA: la quietud NO se compra a costa de la divergencia. Biblioteca
//       MUTADA en su SIGNIFICADO ⇒ `divergente`. Un mutante «firma constante» rompe (B); un
//       mutante «firma la presentación» rompe (A)/(C). Las tres juntas atrapan ambos fallos.
import { describe, expect, test } from "bun:test";
import type { Id, Modelo } from "../modelo/tipos";
import { anclarAPieza, evaluarDriftEntidad, firmaBiblioteca } from "../modelo/operaciones";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import fixture from "./_fixtures/fixture-anclaje-v0.json";

const FORMATO = "deep-opm-pro.modelo.v0" as const;

/** El `Modelo` CRUDO del fixture tal como vive en runtime (shape `Modelo`, sin pasar por persistencia). */
function crudo(modeloCrudo: unknown): Modelo {
  return { nextSeq: 1, ...(structuredClone(modeloCrudo) as Record<string, unknown>) } as unknown as Modelo;
}

/** Hidrata un `Modelo` crudo por el pipeline real de opforja (la ruta de persistencia: normaliza + defaults). */
function hidratar(modeloCrudo: Modelo): Modelo {
  const r = hidratarModelo(JSON.stringify({ formato: FORMATO, modelo: modeloCrudo }));
  if (!r.ok) throw new Error(`fixture inhidratable: ${r.error}`);
  return r.value;
}

/** Re-hidrata una biblioteca por la MISMA ruta de persistencia, SIN cambio semántico (round-trip puro). */
function roundtrip(m: Modelo): Modelo {
  const r = hidratarModelo(exportarModelo(m));
  if (!r.ok) throw new Error(`round-trip inhidratable: ${r.error}`);
  return r.value;
}

/**
 * Re-layout PURO: muta solo presentación a lo ancho de toda la biblioteca —coords/tamaño/plegado/
 * ports/estados suprimidos de apariencias, vértices de enlaces, coords y supresión de estados, e
 * imagen/layout de entidades—. CERO cambio de significado: una firma semántica DEBE ignorar todo esto.
 */
function reLayout(m: Modelo): Modelo {
  const opds = Object.fromEntries(
    Object.entries(m.opds).map(([oid, opd]) => [
      oid,
      {
        ...opd,
        apariencias: Object.fromEntries(
          Object.entries(opd.apariencias).map(([aid, ap]) => [
            aid,
            { ...ap, x: ap.x + 777, y: ap.y - 333, width: ap.width + 40, height: ap.height + 40, modoPlegado: "plegado" as const, estadosSuprimidos: ["fantasma" as Id] },
          ]),
        ),
        enlaces: Object.fromEntries(
          Object.entries(opd.enlaces).map(([eid, ap]) => [eid, { ...ap, vertices: [{ x: 1, y: 1 }, { x: 2, y: 2 }] }]),
        ),
      },
    ]),
  );
  const estados = Object.fromEntries(
    Object.entries(m.estados).map(([sid, s]) => [sid, { ...s, x: (s.x ?? 0) + 99, y: (s.y ?? 0) + 99, width: 12, height: 12, suprimido: !s.suprimido }]),
  );
  const entidades = Object.fromEntries(
    Object.entries(m.entidades).map(([eid, e]) => [eid, { ...e, imagen: { url: "x://re-layout", modo: "imagen" as const }, layoutEstados: "vertical" as const }]),
  );
  return { ...m, opds: opds as Modelo["opds"], estados: estados as Modelo["estados"], entidades: entidades as Modelo["entidades"] };
}

/** La biblioteca tal como el autor la tiene en RUNTIME (crudo) al momento de anclar. */
const bibliotecaRuntime = crudo(fixture.biblioteca);
const piezaRaiz = fixture.ejeCategory.raiz as Id;

/**
 * Modela el gesto de anclar: el frozenAtHash se congela con la firma VIGENTE sobre la biblioteca
 * que el autor tiene a la mano. Devuelve un modelo de UNA cosa anclada a esa biblioteca/pieza.
 */
function modeloConCosaAnclada(biblioteca: Modelo): { modelo: Modelo; entidadId: Id } {
  const entidadId = Object.keys(biblioteca.entidades)[0]!;
  const frozenAtHash = firmaBiblioteca(biblioteca); // congelado con la firma vigente AL ANCLAR
  const r = anclarAPieza(biblioteca, entidadId, { modeloId: biblioteca.id, frozenAtHash }, piezaRaiz);
  if (!r.ok) throw new Error(`anclaje falló: ${r.error}`);
  return { modelo: r.value, entidadId };
}

describe("LEY ANCLAJE QUIETUD — la firma semántica es invariante a la presentación (cero falso-divergente)", () => {
  test("(A) QUIETUD round-trip: anclar (runtime crudo) → guardar/cargar la biblioteca SIN cambio → `sincronizado`", () => {
    // El autor ancla sobre el modelo CRUDO en runtime: el frozenAtHash se congela aquí.
    const { modelo, entidadId } = modeloConCosaAnclada(bibliotecaRuntime);

    // Más tarde, el Centinela resuelve el hash VIVO leyendo la biblioteca de PERSISTENCIA
    // (hidratada, que aplica normalización + defaults de validación), SIN cambio semántico.
    const bibliotecaPersistida = hidratar(bibliotecaRuntime);
    const hashVivo = firmaBiblioteca(bibliotecaPersistida);

    // CON LA FIRMA SEMÁNTICA: el round-trip solo movió presentación (defaults de apariencia) →
    // el hash NO se mueve → `sincronizado`. (Con la firma cruda esto era `divergente`: el mutante.)
    expect(evaluarDriftEntidad(modelo.entidades[entidadId]!, hashVivo)).toBe("sincronizado");
  });

  test("(A') QUIETUD reforzada: re-guardar la biblioteca ya persistida tampoco dispara drift (punto fijo)", () => {
    const { modelo, entidadId } = modeloConCosaAnclada(bibliotecaRuntime);
    const dos = roundtrip(hidratar(bibliotecaRuntime));
    expect(evaluarDriftEntidad(modelo.entidades[entidadId]!, firmaBiblioteca(dos))).toBe("sincronizado");
  });

  test("(C) QUIETUD re-layout: mover/redimensionar/plegar apariencias NO dispara drift", () => {
    const base = hidratar(bibliotecaRuntime);
    // El autor ancla sobre la biblioteca persistida (frozen = firma semántica de `base`).
    const { modelo, entidadId } = modeloConCosaAnclada(base);
    // Más tarde alguien re-acomoda el diagrama de la biblioteca: puro layout, cero significado.
    const hashVivo = firmaBiblioteca(reLayout(base));
    expect(evaluarDriftEntidad(modelo.entidades[entidadId]!, hashVivo)).toBe("sincronizado");
  });

  test("(C') re-layout es invariante de FIRMA (no solo de veredicto): firma(base) == firma(reLayout)", () => {
    const base = hidratar(bibliotecaRuntime);
    expect(firmaBiblioteca(reLayout(base))).toBe(firmaBiblioteca(base));
  });

  test("(B) DISCRIMINACIÓN PRESERVADA: biblioteca MUTADA en su SIGNIFICADO ⇒ `divergente` (el aviso vive)", () => {
    const { modelo, entidadId } = modeloConCosaAnclada(bibliotecaRuntime);

    // gist evolucionó: una raíz de la biblioteca cambia de nombre (cambio SEMÁNTICO).
    const mutada = hidratar({
      ...bibliotecaRuntime,
      entidades: {
        ...bibliotecaRuntime.entidades,
        [piezaRaiz]: {
          ...bibliotecaRuntime.entidades[piezaRaiz]!,
          nombre: `${bibliotecaRuntime.entidades[piezaRaiz]!.nombre} (mutada)`,
        },
      },
    });
    expect(evaluarDriftEntidad(modelo.entidades[entidadId]!, firmaBiblioteca(mutada))).toBe("divergente");
  });

  test("(B'-discriminación) una mutación semántica SIEMPRE cambia la firma (el aviso no es ciego)", () => {
    // Un mutante «firma constante» rompería este test (la otra mitad de la pinza es la quietud).
    const limpio = firmaBiblioteca(hidratar(bibliotecaRuntime));
    const sucio = firmaBiblioteca(
      hidratar({
        ...bibliotecaRuntime,
        entidades: {
          ...bibliotecaRuntime.entidades,
          [piezaRaiz]: { ...bibliotecaRuntime.entidades[piezaRaiz]!, nombre: "OTRO NOMBRE" },
        },
      }),
    );
    expect(sucio).not.toBe(limpio);
  });

  test("(B'-quietud) guardar→cargar = identidad de hash (frozen-crudo == persistido) por firma semántica", () => {
    const frozen = firmaBiblioteca(bibliotecaRuntime); // congelado al anclar (crudo)
    const limpio = firmaBiblioteca(hidratar(bibliotecaRuntime)); // persistido sin cambio
    expect(limpio).toBe(frozen);
  });
});
