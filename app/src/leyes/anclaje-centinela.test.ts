// LEY CENTINELA DE DRIFT — prueba falsable del VALOR del Anclaje (corte C-1).
//
// El Anclaje (Δ, referencia viva) gana su valor cuando AVISA: una cosa anclada a una
// Pieza de una biblioteca gobernada (la greda gist) debe enterarse si la biblioteca
// cambió bajo sus pies. Sin ese aviso, el reuso vivo es indistinguible de una copia
// que se pudre en silencio (el Calco). Este es el «Centinela de Drift»: comparar el
// `frozenAtHash` congelado al anclar contra el hash VIVO de la biblioteca; si difieren,
// la cosa está «divergente» y Félix-curador lo ve, en vez de perseguir copias a mano.
//
// Acta de valor: docs/auditorias/2026-06-24-acta-valor-anclaje-centinela-drift.md.
//   · Condición 2 (falsabilidad del valor): si el Centinela no avisa, no ahorra dolor
//     → se mata el frente. El MUTANTE que pone esta ley roja: `evaluarDrift` devolviendo
//     "sincronizado" cuando los hashes difieren. Si esa mutación no rompe ningún test,
//     el Centinela no protege nada.
//   · Condición 3 (cero matemática en superficie): el vocabulario es sincronizado /
//     divergente / no-resuelto / Re-sincronizar / Soltar — nunca fibración ni pullback.
//
// Kernel PURO: el Centinela NO lee persistencia. Recibe el hash vivo (que el caller
// computa resolviendo la biblioteca contra Postgres/API) o lo resuelve por inyección.
// El único eslabón nuevo respecto del corte-1 (`anclarAPieza`) es `firmaBiblioteca` —
// el primer pedacito de la resolución externa C4, sin la cascada completa.
import { describe, expect, test } from "bun:test";
import {
  anclarAPieza,
  crearModelo,
  crearObjeto,
  evaluarDrift,
  evaluarDriftEntidad,
  evaluarDriftModelo,
  firmaBiblioteca,
  reSincronizarAnclaje,
  soltarAnclaje,
} from "../modelo/operaciones";
import type { Anclaje, BibliotecaRef, Entidad, Id, Modelo, Resultado } from "../modelo/tipos";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(`fixture: ${r.error}`);
  return r.value;
}
function entidadDe(m: Modelo, nombre: string): Entidad {
  const e = Object.values(m.entidades).find((x) => x.nombre === nombre);
  if (!e) throw new Error(`entidad no encontrada: ${nombre}`);
  return e;
}
function eid(m: Modelo, nombre: string): Id {
  return entidadDe(m, nombre).id;
}

// La greda gist como Modelo persistido APARTE: una biblioteca de Piezas gobernada.
// `ENT_CATEGORY` es el id GLOBAL de la Pieza dentro de la biblioteca (opaco para el
// drift, que es biblioteca-nivel — coherente con `anclaje-mecanismo.test.ts`).
const ENT_CATEGORY = "ent-Category" as Id;
function gredaV1(): Modelo {
  let g = crearModelo("gist 14.1.0");
  g = must(crearObjeto(g, g.opdRaizId, { x: 0, y: 0 }, "Category"));
  return g;
}
/** Misma greda con un tipo raíz cambiado: gist evolucionó (invariante (i): base no-congelada). */
function gredaV2(): Modelo {
  let g = gredaV1();
  g = must(crearObjeto(g, g.opdRaizId, { x: 200, y: 0 }, "Aspect"));
  return g;
}
/** Ancla `nombre` en `m` a la Pieza de `greda`, congelando la firma VIVA de la greda. */
function anclarA(m: Modelo, nombre: string, greda: Modelo): Modelo {
  const biblioteca: BibliotecaRef = {
    modeloId: greda.id,
    nombre: greda.nombre,
    frozenAtHash: firmaBiblioteca(greda),
  };
  return must(anclarAPieza(m, eid(m, nombre), biblioteca, ENT_CATEGORY));
}

describe("CENTINELA — `evaluarDrift`: la unidad pura de comparación de hashes", () => {
  test("hashes iguales ⇒ sincronizado", () => {
    expect(evaluarDrift("fnv1a-aaaa", "fnv1a-aaaa")).toBe("sincronizado");
  });

  test("hashes distintos ⇒ divergente (el corazón del valor: la biblioteca cambió)", () => {
    expect(evaluarDrift("fnv1a-aaaa", "fnv1a-bbbb")).toBe("divergente");
  });

  test("hash vivo no disponible (null) ⇒ no-resuelto (honestidad: no inventar divergencia)", () => {
    // La biblioteca no está cargada/resoluble: el Centinela NO degrada a "divergente"
    // ni a "sincronizado" — reporta que no pudo leer. (Doctrina SelloProcedencia.)
    expect(evaluarDrift("fnv1a-aaaa", null)).toBe("no-resuelto");
  });
});

describe("CENTINELA — `evaluarDriftEntidad`: drift de una cosa según su anclaje", () => {
  test("entidad SIN anclaje ⇒ null (el Centinela no aplica a cosas no ancladas)", () => {
    let m = crearModelo("SD0");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Local"));
    expect(evaluarDriftEntidad(entidadDe(m, "Local"), "fnv1a-xxxx")).toBeNull();
  });

  test("entidad anclada, hash vivo == frozenAtHash ⇒ sincronizado", () => {
    const greda = gredaV1();
    let m = crearModelo("SD0");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Disciplina"));
    m = anclarA(m, "Disciplina", greda);
    expect(evaluarDriftEntidad(entidadDe(m, "Disciplina"), firmaBiblioteca(greda))).toBe("sincronizado");
  });

  test("entidad anclada, hash vivo != frozenAtHash ⇒ divergente", () => {
    let m = crearModelo("SD0");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Disciplina"));
    m = anclarA(m, "Disciplina", gredaV1());
    // La biblioteca evolucionó a v2: su firma viva ya no coincide con la congelada.
    expect(evaluarDriftEntidad(entidadDe(m, "Disciplina"), firmaBiblioteca(gredaV2()))).toBe("divergente");
  });
});

describe("CENTINELA — ciclo de valor end-to-end (Félix-curador con gist real)", () => {
  test("anclar→sincronizado · gist cambia→divergente · re-sincronizar→sincronizado · soltar→desanclada", () => {
    // 1) Félix ancla una entidad de HODOM a la raíz de gist (greda v1).
    let m = crearModelo("HODOM SD0");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Disciplina"));
    m = anclarA(m, "Disciplina", gredaV1());
    expect(evaluarDriftEntidad(entidadDe(m, "Disciplina"), firmaBiblioteca(gredaV1()))).toBe("sincronizado");

    // 2) gist cambia un tipo raíz → HODOM SE LO DICE SOLO (en vez de pudrirse en silencio).
    const hashVivoV2 = firmaBiblioteca(gredaV2());
    expect(evaluarDriftEntidad(entidadDe(m, "Disciplina"), hashVivoV2)).toBe("divergente");

    // 3) Félix re-sincroniza: acepta el cambio, re-congela al hash vivo.
    m = must(reSincronizarAnclaje(m, eid(m, "Disciplina"), hashVivoV2));
    expect(entidadDe(m, "Disciplina").anclaje?.biblioteca.frozenAtHash).toBe(hashVivoV2);
    expect(evaluarDriftEntidad(entidadDe(m, "Disciplina"), hashVivoV2)).toBe("sincronizado");

    // 4) Félix suelta (Δ→Σ): la cosa deja de estar anclada; el Centinela ya no aplica.
    m = must(soltarAnclaje(m, eid(m, "Disciplina")));
    expect(entidadDe(m, "Disciplina").anclaje).toBeUndefined();
    expect(evaluarDriftEntidad(entidadDe(m, "Disciplina"), hashVivoV2)).toBeNull();
  });
});

describe("CENTINELA — `evaluarDriftModelo`: barrido del modelo con resolver inyectado", () => {
  test("solo las cosas ancladas entran; el resolver lee el hash vivo por biblioteca", () => {
    const greda = gredaV1();
    let m = crearModelo("HODOM SD0");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Disciplina"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 200, y: 0 }, "Etiqueta"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 400, y: 0 }, "Local")); // no anclada
    m = anclarA(m, "Disciplina", greda);
    m = anclarA(m, "Etiqueta", greda);

    // El resolver simula leer la biblioteca viva (gist evolucionó a v2).
    const hashVivoV2 = firmaBiblioteca(gredaV2());
    const resolver = (anclaje: Anclaje): string | null =>
      anclaje.biblioteca.modeloId === greda.id ? hashVivoV2 : null;

    const drift = evaluarDriftModelo(m, resolver);
    expect(drift[eid(m, "Disciplina")]).toBe("divergente");
    expect(drift[eid(m, "Etiqueta")]).toBe("divergente");
    // La entidad no anclada NO aparece en el reporte (el Centinela no la vigila).
    expect(drift[eid(m, "Local")]).toBeUndefined();
    expect(Object.keys(drift)).toHaveLength(2);
  });

  test("biblioteca irresoluble (resolver devuelve null) ⇒ no-resuelto, no falso divergente", () => {
    const greda = gredaV1();
    let m = crearModelo("HODOM SD0");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Disciplina"));
    m = anclarA(m, "Disciplina", greda);
    const drift = evaluarDriftModelo(m, () => null);
    expect(drift[eid(m, "Disciplina")]).toBe("no-resuelto");
  });
});

describe("CENTINELA — guardas y aditividad de las operaciones", () => {
  test("re-sincronizar una entidad inexistente falla y no corrompe el modelo", () => {
    const m = crearModelo("SD0");
    expect(reSincronizarAnclaje(m, "no-existe" as Id, "fnv1a-zzzz").ok).toBe(false);
  });

  test("re-sincronizar una entidad NO anclada falla ruidoso (no hay anclaje que re-congelar)", () => {
    let m = crearModelo("SD0");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Local"));
    expect(reSincronizarAnclaje(m, eid(m, "Local"), "fnv1a-zzzz").ok).toBe(false);
  });

  test("soltar una entidad inexistente o no anclada falla ruidoso (anti-silencio)", () => {
    let m = crearModelo("SD0");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Local"));
    expect(soltarAnclaje(m, "no-existe" as Id).ok).toBe(false);
    expect(soltarAnclaje(m, eid(m, "Local")).ok).toBe(false);
  });

  test("re-sincronizar es aditivo: no toca otras entidades, ni piezaId, ni estereotipoId", () => {
    const greda = gredaV1();
    let m = crearModelo("SD0");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Disciplina"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 200, y: 0 }, "Otra"));
    m = anclarA(m, "Disciplina", greda);
    const otraAntes = entidadDe(m, "Otra");

    m = must(reSincronizarAnclaje(m, eid(m, "Disciplina"), firmaBiblioteca(gredaV2())));

    // Solo cambió frozenAtHash: piezaId y modeloId del anclaje quedan intactos.
    expect(entidadDe(m, "Disciplina").anclaje?.piezaId).toBe(ENT_CATEGORY);
    expect(entidadDe(m, "Disciplina").anclaje?.biblioteca.modeloId).toBe(greda.id);
    expect(entidadDe(m, "Disciplina").estereotipoId).toBeUndefined();
    expect(entidadDe(m, "Otra")).toEqual(otraAntes);
  });

  test("soltar preserva la cosa como objeto local: solo desaparece `anclaje`", () => {
    const greda = gredaV1();
    let m = crearModelo("SD0");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Disciplina"));
    m = anclarA(m, "Disciplina", greda);
    const antesNombre = entidadDe(m, "Disciplina").nombre;
    const antesEsencia = entidadDe(m, "Disciplina").esencia;

    m = must(soltarAnclaje(m, eid(m, "Disciplina")));

    const ent = entidadDe(m, "Disciplina");
    expect(ent.anclaje).toBeUndefined();
    expect(ent.nombre).toBe(antesNombre);
    expect(ent.esencia).toBe(antesEsencia);
  });
});
