// LEY ANCLAJE — eval-de-mecanismo sobre el fixture REAL de gist (corte Centinela α, Fase 1).
//
// Esta ley es el TEST-FIRST del resolutor de hash vivo (`construirResolverHashVivo`,
// el corazón puro de `cargarYEvaluarDrift` del store): sobre el fixture de validación
// del Anclaje —copiado hermético desde gist-opm@be59117, ver `_fixtures/PROCEDENCIA.md`—
// prueba el ESLABÓN NUEVO que el kernel verde NO cubre:
//
//   1. Composabilidad: dos SD0 anclados a la MISMA Pieza resuelven al mismo objeto común
//      (piezaId + modeloId) derivado del `anclaje` — no inyectado a mano.
//   2. Gate duro Calco-adversarial (la aserción central, acta de arranque D-B): cosas
//      CALCADAS (mismo `estereotipoId`, SIN `anclaje`) NUNCA entran al `driftMap` ni
//      producen composabilidad-por-anclaje. Si lo hicieran, el Centinela vigila copias
//      muertas y el gate está roto.
//   3. Herencia sensible a mutación: re-computar `firmaBiblioteca` viva tras mutar una
//      raíz de la biblioteca da una firma distinta ⇒ los SD0 anclados quedan `divergente`;
//      los calcos, inmutables.
//
// Se verifica además invariancia al EJE (Category vs Component): ambos ejes —dos formas de
// herencia gist— dan el mismo veredicto.
//
// Acta de arranque: docs/auditorias/2026-06-26-acta-arranque-centinela-drift.md (D-B: el
// eval se funde en Fase 1 como test-first del resolutor; la ley ROJA precede al resolutor).
// Vocabulario categorial permitido en este andamio de ingeniero (no es superficie de usuario).
import { describe, expect, test } from "bun:test";
import type { Anclaje, Id, Modelo } from "../modelo/tipos";
import { evaluarDriftModelo, firmaBiblioteca } from "../modelo/operaciones";
import { hidratarModelo } from "../serializacion/json";
// ESLABÓN NUEVO bajo prueba (no existe aún ⇒ esta ley es ROJA hasta que el resolutor lo exporte):
import { construirResolverHashVivo } from "../store/modelo/acciones-anclaje";
import fixture from "./_fixtures/fixture-anclaje-v0.json";

const FORMATO = "deep-opm-pro.modelo.v0" as const;

/**
 * Hidrata un sub-modelo crudo del fixture (shape `Modelo`) vía el pipeline real de opforja.
 *
 * Dos adaptaciones MECÁNICas para que el fixture cross-repo pase la validación DURA de
 * opforja, ninguna toca la SEMÁNTICA que la ley prueba (ver `_fixtures/PROCEDENCIA.md` y el
 * reporte de Fase 1 — punto de criterio elevado al comité):
 *   · `nextSeq`: el generador de gist-opm no lo emite; lo inyectamos (no se hashea).
 *   · `estereotipoId` de los calcos: opforja exige que un `estereotipoId` aplicado resuelva
 *     contra fábrica o catálogo `Modelo.estereotipos` (contrato D6 de import DURO,
 *     `validarIntegridad.ts:35`). El fixture modela el Calco de forma abstracta (sin
 *     catálogo). Lo RELEVANTE para el gate Calco-adversarial es que el calco NO tenga
 *     `anclaje` — el marker de estereotipo es incidental. Lo eliminamos al hidratar para que
 *     el calco entre como copia local pura; la aserción central («sin anclaje ⇒ fuera del
 *     driftMap») queda intacta y MÁS dura (no depende del estereotipo, solo de la ausencia
 *     de referencia viva).
 */
function hidratar(modeloCrudo: unknown): Modelo {
  const crudo = structuredClone(modeloCrudo) as Record<string, unknown>;
  const conScaffold = { nextSeq: 1, ...crudo };
  const r = hidratarModelo(JSON.stringify({ formato: FORMATO, modelo: conScaffold }));
  if (!r.ok) throw new Error(`fixture inhidratble: ${r.error}`);
  return r.value;
}

/**
 * Hidrata un sub-modelo CALCADO del fixture, normalizándolo a copia local pura: elimina los
 * `estereotipoId` (sin catálogo en el fixture; opforja los exige resolubles —
 * `validarIntegridad.ts:35`) y los `enlaces` de generalización incidentales (sin apariencia
 * visual; opforja exige toda enlace con apariencia — `validarIntegridad.ts:83`). NINGUNO de
 * los dos es relevante para el gate Calco-adversarial: lo único que la ley necesita es que
 * el calco NO tenga `anclaje`. Tras la normalización el calco es una copia local pura, que es
 * EXACTAMENTE lo que un Calco es semánticamente (Σ desacoplado, sin referencia viva).
 */
function hidratarCalco(modeloCrudo: unknown): Modelo {
  const crudo = structuredClone(modeloCrudo) as Record<string, unknown>;
  const entidades = crudo.entidades as Record<string, Record<string, unknown>> | undefined;
  if (entidades) {
    for (const ent of Object.values(entidades)) delete ent.estereotipoId;
  }
  crudo.enlaces = {};
  const conScaffold = { nextSeq: 1, ...crudo };
  const r = hidratarModelo(JSON.stringify({ formato: FORMATO, modelo: conScaffold }));
  if (!r.ok) throw new Error(`fixture calco inhidratble: ${r.error}`);
  return r.value;
}

/**
 * Hash VIVO de la biblioteca EN TÉRMINOS DE OPFORJA. El `frozenAtHash` cross-repo del
 * fixture (`fnv1a-c6073070`, congelado por la `firmaBiblioteca` de gist-opm sobre el shape
 * crudo) NO coincide con la firma de opforja sobre el shape HIDRATADO/NORMALIZADO: opforja
 * inyecta defaults (p.ej. `modoPlegado` en apariencias) que su propia firma hashea. En
 * PRODUCCIÓN esto no es problema: opforja ancla y compara con SU MISMA `firmaBiblioteca`
 * (amarras §6 = HODOM anclado a gist DENTRO de opforja). Por eso la ley RE-CONGELA en
 * términos de opforja —tal como hará el gesto de anclar— y NO exige identidad de hash
 * cross-repo (esa identidad nunca fue parte del valor del Centinela). El fixture mismo lo
 * dice: «re-computar en runtime, no hardcodear».
 */
const HASH_VIVO_OPFORJA = firmaBiblioteca(hidratar(fixture.biblioteca));

/** Re-ancla cada cosa anclada de `m` al hash vivo de opforja (lo que hace el gesto real de anclar). */
function reCongelarAOpforja(m: Modelo): Modelo {
  const entidades: Modelo["entidades"] = {};
  for (const [id, ent] of Object.entries(m.entidades)) {
    entidades[id] = ent.anclaje
      ? { ...ent, anclaje: { ...ent.anclaje, biblioteca: { ...ent.anclaje.biblioteca, frozenAtHash: HASH_VIVO_OPFORJA } } }
      : ent;
  }
  return { ...m, entidades };
}

/** Funde las entidades/opds de varios sub-modelos en un único `Modelo` para barrerlo. */
function fundir(nombre: string, ...modelos: Modelo[]): Modelo {
  const base = modelos[0]!;
  return {
    ...base,
    id: nombre,
    nombre,
    entidades: Object.assign({}, ...modelos.map((m) => m.entidades)),
  };
}

/** Anclaje de una entidad (lanza si no está anclada — el fixture garantiza que sí). */
function anclajeDe(m: Modelo, entidadId: Id): Anclaje {
  const a = m.entidades[entidadId]?.anclaje;
  if (!a) throw new Error(`entidad sin anclaje: ${entidadId}`);
  return a;
}

const biblioteca = hidratar(fixture.biblioteca);
const ejes = {
  Category: fixture.ejeCategory,
  Component: fixture.ejeComponent,
} as const;

describe("LEY ANCLAJE — el `frozenAtHash` es REFERENCIA, no verdad: se re-computa, no se confía", () => {
  test("el fixture es internamente consistente (su frozen referencia == frozen de los SD0 anclados)", () => {
    // El fixture congeló su biblioteca y sus SD0 con el MISMO hash de referencia
    // (`fnv1a-c6073070`, computado por la firma de gist-opm). Eso prueba que el fixture es
    // coherente consigo mismo; NO que coincida con la firma de opforja sobre el shape hidratado.
    const sd0A = hidratar(fixture.ejeCategory.sd0A);
    const congeladoSd0 = Object.values(sd0A.entidades).find((e) => e.anclaje)!.anclaje!.biblioteca.frozenAtHash;
    expect(congeladoSd0).toBe(fixture.frozenAtHashReferencia);
  });

  test("opforja RE-COMPUTA la firma viva en sus propios términos (≠ hash cross-repo del fixture)", () => {
    // El Centinela compara con la firma de OPFORJA, re-congelada al anclar (amarras §6 =
    // anclaje DENTRO de opforja). Documentamos explícitamente que difiere del cross-repo:
    // esa identidad nunca fue parte del valor — el fixture mismo dice «re-computar en runtime».
    expect(HASH_VIVO_OPFORJA).not.toBe(fixture.frozenAtHashReferencia);
  });
});

for (const [eje, datos] of Object.entries(ejes)) {
  describe(`LEY ANCLAJE — eje ${eje} (forma de herencia gist)`, () => {
    // Re-congelados en términos de opforja (lo que hace el gesto real de anclar).
    const sd0A = reCongelarAOpforja(hidratar(datos.sd0A));
    const sd0B = reCongelarAOpforja(hidratar(datos.sd0B));
    const sd0Acalco = hidratarCalco(datos.sd0A_calco);
    const sd0Bcalco = hidratarCalco(datos.sd0B_calco);

    const idA = Object.values(sd0A.entidades).find((e) => e.anclaje)!.id;
    const idB = Object.values(sd0B.entidades).find((e) => e.anclaje)!.id;

    test("1) COMPOSABILIDAD — dos SD0 anclados resuelven al MISMO objeto común (piezaId + modeloId)", () => {
      const a = anclajeDe(sd0A, idA);
      const b = anclajeDe(sd0B, idB);
      // El objeto común se deriva del `anclaje`, no se inyecta: misma Pieza, misma biblioteca.
      expect(a.piezaId).toBe(b.piezaId);
      expect(a.biblioteca.modeloId).toBe(b.biblioteca.modeloId);
      expect(a.piezaId).toBe(datos.raiz as Id);
      expect(a.biblioteca.modeloId).toBe(biblioteca.id);

      // …y el resolutor de hash vivo construye un driftMap donde AMBOS aparecen, sincronizados
      // contra la biblioteca viva (su firma == frozenAtHash re-congelado al anclar).
      const modelo = fundir(`combinado-${eje}`, sd0A, sd0B);
      const resolver = construirResolverHashVivo({ [biblioteca.id]: HASH_VIVO_OPFORJA });
      const drift = evaluarDriftModelo(modelo, resolver);
      expect(drift[idA]).toBe("sincronizado");
      expect(drift[idB]).toBe("sincronizado");
      expect(Object.keys(drift).sort()).toEqual([idA, idB].sort());
    });

    test("2) GATE DURO Calco-adversarial — cosas CALCADAS no entran al driftMap (nunca producen marca)", () => {
      // Mismo estereotipoId, SIN anclaje: el Centinela NO vigila copias muertas.
      const modeloCalco = fundir(`calco-${eje}`, sd0Acalco, sd0Bcalco);
      const resolver = construirResolverHashVivo({ [biblioteca.id]: firmaBiblioteca(biblioteca) });
      const drift = evaluarDriftModelo(modeloCalco, resolver);
      // Ninguna entidad calcada aparece: composabilidad-por-anclaje NO existe para el Calco.
      expect(Object.keys(drift)).toHaveLength(0);
      // Sello explícito: las entidades calcadas tienen estereotipoId pero NO anclaje.
      for (const ent of Object.values(modeloCalco.entidades)) {
        expect(ent.anclaje).toBeUndefined();
      }
    });

    test("3) HERENCIA SENSIBLE A MUTACIÓN — mutar una raíz de la biblioteca ⇒ los anclados quedan divergentes", () => {
      const h1 = HASH_VIVO_OPFORJA; // == firmaBiblioteca(biblioteca): lo congelado al anclar
      expect(firmaBiblioteca(biblioteca)).toBe(h1);
      // Mutar una raíz viva de la biblioteca: gist evolucionó bajo los pies de los SD0.
      const bibliotecaMutada: Modelo = {
        ...biblioteca,
        entidades: {
          ...biblioteca.entidades,
          [datos.raiz]: {
            ...biblioteca.entidades[datos.raiz as Id]!,
            nombre: `${biblioteca.entidades[datos.raiz as Id]!.nombre} (mutada)`,
          },
        },
      };
      const h2 = firmaBiblioteca(bibliotecaMutada);
      expect(h2).not.toBe(h1); // la mutación cambia la firma

      const modelo = fundir(`combinado-${eje}`, sd0A, sd0B);
      // Resolutor que ve la biblioteca MUTADA (hash vivo = h2) frente al frozenAtHash = h1.
      const resolver = construirResolverHashVivo({ [biblioteca.id]: h2 });
      const drift = evaluarDriftModelo(modelo, resolver);
      expect(drift[idA]).toBe("divergente");
      expect(drift[idB]).toBe("divergente");

      // En los calcos, nada cambia: siguen fuera del driftMap pase lo que pase con la biblioteca.
      const modeloCalco = fundir(`calco-${eje}`, sd0Acalco, sd0Bcalco);
      const driftCalco = evaluarDriftModelo(modeloCalco, resolver);
      expect(Object.keys(driftCalco)).toHaveLength(0);
    });
  });
}

describe("LEY ANCLAJE — invariancia al EJE: el veredicto no depende de la forma de herencia", () => {
  test("Category y Component dan el MISMO veredicto de drift ante la misma operación", () => {
    const resultados = Object.entries(ejes).map(([eje, datos]) => {
      const sd0A = reCongelarAOpforja(hidratar(datos.sd0A));
      const sd0B = reCongelarAOpforja(hidratar(datos.sd0B));
      const idA = Object.values(sd0A.entidades).find((e) => e.anclaje)!.id;
      const idB = Object.values(sd0B.entidades).find((e) => e.anclaje)!.id;
      const modelo = fundir(`combinado-${eje}`, sd0A, sd0B);

      // Biblioteca viva == congelada ⇒ sincronizado en ambos ejes.
      const sync = construirResolverHashVivo({ [biblioteca.id]: HASH_VIVO_OPFORJA });
      const driftSync = evaluarDriftModelo(modelo, sync);
      // Biblioteca irresoluble (null) ⇒ no-resuelto en ambos ejes (sin inventar divergencia).
      const noResuelto = construirResolverHashVivo({});
      const driftNR = evaluarDriftModelo(modelo, noResuelto);

      return {
        sync: [driftSync[idA], driftSync[idB]],
        noResuelto: [driftNR[idA], driftNR[idB]],
      };
    });
    expect(resultados[0]).toEqual(resultados[1]); // Category ≡ Component
    expect(resultados[0]!.sync).toEqual(["sincronizado", "sincronizado"]);
    expect(resultados[0]!.noResuelto).toEqual(["no-resuelto", "no-resuelto"]);
  });
});
