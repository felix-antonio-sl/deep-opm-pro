import { describe, expect, test } from "bun:test";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import { verificarMetodologia } from "./checkers";
import {
  crearComprarPan,
  crearPrestamoBibliotecario,
  fixtureTodos,
  fixturesPorCategoria,
} from "./fixtures";
import { refinaA, refinamientosDe, tieneRefinamiento } from "./refinamientos";

/**
 * Suite focal Beta1 ronda 16 L4: catalogo simple + anclas reales.
 *
 * Verifica que los fixtures `ancla-real` introducidos cumplen el slice minimo
 * shippeable (multi-OPD, estados, descomposicion, despliegue, enlaces
 * variados) y que el round-trip `exportarModelo -> hidratarModelo` no pierde
 * conteos observables. Cubre la condicion de cierre Beta1 §174.6 ("guarda y
 * carga sin perdida") en el plano unitario; el smoke 11-beta1-catalogo-ancla
 * ejerce la misma propiedad in-vivo desde el dialogo de carga.
 */

describe("FixtureDemo categoria", () => {
  test("toda fixture declara categoria explicita", () => {
    for (const fixture of fixtureTodos()) {
      expect(fixture.categoria).toBeDefined();
      const cat = fixture.categoria ?? "demo-pedagogica";
      expect(["demo-pedagogica", "ancla-real"]).toContain(cat);
    }
  });

  test("fixturesPorCategoria devuelve subconjuntos disjuntos cuya union es total", () => {
    const todos = fixtureTodos();
    const demos = fixturesPorCategoria("demo-pedagogica");
    const anclas = fixturesPorCategoria("ancla-real");
    expect(demos.length + anclas.length).toBe(todos.length);
    const demoNombres = new Set(demos.map((f) => f.modelo.nombre));
    for (const ancla of anclas) {
      expect(demoNombres.has(ancla.modelo.nombre)).toBe(false);
    }
  });

  test("anclas reales beta1 estan presentes en el catalogo", () => {
    const anclas = fixturesPorCategoria("ancla-real");
    const nombres = anclas.map((f) => f.modelo.nombre).sort();
    expect(nombres).toContain("Prestamo Bibliotecario");
    expect(nombres).toContain("Comprar Pan");
  });

  test("fixtures observacionales y modelo amplio estan presentes en el catalogo", () => {
    const nombres = fixtureTodos().map((fixture) => fixture.modelo.nombre);
    expect(nombres).toContain("Modelo Vacio");
    expect(nombres).toContain("System Diagram");
    expect(nombres).toContain("SD Sync");
    expect(nombres).toContain("SD Async");
    expect(nombres).toContain("OnStar System");
    expect(nombres).toContain("OPM Structure Meta Model");
    expect(nombres).toContain("App modeladora OPM deseada");
  });
});

describe("ancla primario: Prestamo Bibliotecario", () => {
  const fixture = crearPrestamoBibliotecario();
  const modelo = fixture.modelo;

  test("estructura cumple slice minimo (multi-OPD, estados, descomposicion, despliegue)", () => {
    // Multi-OPD: SD raiz + SD1 in-zoom + OPD despliegue Biblioteca = 3.
    const opdsCount = Object.keys(modelo.opds).length;
    expect(opdsCount).toBeGreaterThanOrEqual(3);

    // Estados: Libro tiene >= 3 (disponible, prestado, atrasado).
    const estadosCount = Object.keys(modelo.estados ?? {}).length;
    expect(estadosCount).toBeGreaterThanOrEqual(3);

    // Enlaces variados: agente, instrumento, consumo, resultado, efecto,
    // agregacion (SD raiz) + invocaciones (SD1) >= 6.
    const enlacesCount = Object.keys(modelo.enlaces).length;
    expect(enlacesCount).toBeGreaterThanOrEqual(6);

    // Procesar Prestamo tiene descomposicion (in-zoom).
    const procesarPrestamo = Object.values(modelo.entidades)
      .find((e) => e.nombre === "Procesar Prestamo");
    expect(procesarPrestamo).toBeDefined();
    expect(tieneRefinamiento(procesarPrestamo!, "descomposicion")).toBe(true);

    // Biblioteca tiene despliegue (unfold como agregacion).
    const biblioteca = Object.values(modelo.entidades)
      .find((e) => e.nombre === "Biblioteca");
    expect(biblioteca).toBeDefined();
    expect(tieneRefinamiento(biblioteca!, "despliegue")).toBe(true);

    // Tipos de enlace presentes incluyen los obligatorios del wizard SD.
    const tipos = new Set(Object.values(modelo.enlaces).map((l) => l.tipo));
    for (const tipo of ["agente", "instrumento", "consumo", "resultado", "efecto", "agregacion", "invocacion"] as const) {
      expect(tipos.has(tipo)).toBe(true);
    }
  });

  test("descomposicion y despliegue apuntan a OPDs distintos del SD raiz", () => {
    const procesarPrestamo = Object.values(modelo.entidades)
      .find((e) => e.nombre === "Procesar Prestamo")!;
    const biblioteca = Object.values(modelo.entidades)
      .find((e) => e.nombre === "Biblioteca")!;
    const refsProc = refinamientosDe(procesarPrestamo);
    const refsBib = refinamientosDe(biblioteca);
    expect(refsProc).toHaveLength(1);
    expect(refsBib).toHaveLength(1);
    expect(refsProc[0]?.opdId).not.toBe(modelo.opdRaizId);
    expect(refsBib[0]?.opdId).not.toBe(modelo.opdRaizId);
    expect(refsProc[0]?.opdId).not.toBe(refsBib[0]?.opdId);

    // Cada OPD existe en el modelo.
    expect(modelo.opds[refsProc[0]!.opdId]).toBeDefined();
    expect(modelo.opds[refsBib[0]!.opdId]).toBeDefined();
  });

  test("refinaA recupera el slot por opdId", () => {
    const biblioteca = Object.values(modelo.entidades)
      .find((e) => e.nombre === "Biblioteca")!;
    const slot = refinamientosDe(biblioteca)[0]!;
    const recuperado = refinaA(biblioteca, slot.opdId);
    expect(recuperado).not.toBeNull();
    expect(recuperado?.tipo).toBe("despliegue");
  });

  test("round-trip preserva conteos observables", () => {
    const json = exportarModelo(modelo);
    const hidratado = hidratarModelo(json);
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    const m2 = hidratado.value;
    expect(m2.nombre).toBe(modelo.nombre);
    expect(Object.keys(m2.entidades).length).toBe(Object.keys(modelo.entidades).length);
    expect(Object.keys(m2.enlaces).length).toBe(Object.keys(modelo.enlaces).length);
    expect(Object.keys(m2.opds).length).toBe(Object.keys(modelo.opds).length);
    expect(Object.keys(m2.estados ?? {}).length).toBe(Object.keys(modelo.estados ?? {}).length);

    // Refinamientos preservados via helpers (no via campo legacy).
    const procPre = Object.values(modelo.entidades).find((e) => e.nombre === "Procesar Prestamo")!;
    const procPos = Object.values(m2.entidades).find((e) => e.nombre === "Procesar Prestamo")!;
    expect(tieneRefinamiento(procPos, "descomposicion")).toBe(tieneRefinamiento(procPre, "descomposicion"));
    const bibPre = Object.values(modelo.entidades).find((e) => e.nombre === "Biblioteca")!;
    const bibPos = Object.values(m2.entidades).find((e) => e.nombre === "Biblioteca")!;
    expect(tieneRefinamiento(bibPos, "despliegue")).toBe(tieneRefinamiento(bibPre, "despliegue"));
  });

  test("round-trip preserva nombres de estados de Libro", () => {
    const json = exportarModelo(modelo);
    const hidratado = hidratarModelo(json);
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    const libro = Object.values(hidratado.value.entidades)
      .find((e) => e.nombre === "Libro")!;
    const estados = Object.values(hidratado.value.estados ?? {})
      .filter((s) => s.entidadId === libro.id)
      .map((s) => s.nombre)
      .sort();
    expect(estados).toContain("disponible");
    expect(estados).toContain("prestado");
    expect(estados).toContain("atrasado");
  });

  test("verificarMetodologia ejecuta sin lanzar y produce arreglo", () => {
    const avisos = verificarMetodologia(modelo);
    expect(Array.isArray(avisos)).toBe(true);
    // Si hay avisos, todos declaran codigo y rationale (consistencia post-L3).
    for (const aviso of avisos) {
      expect(typeof aviso.codigo).toBe("string");
      expect(typeof aviso.rationale).toBe("string");
    }
  });
});

describe("ancla secundaria liviana: Comprar Pan", () => {
  const fixture = crearComprarPan();
  const modelo = fixture.modelo;

  test("es plana (un solo OPD, sin descomposicion ni estados)", () => {
    expect(Object.keys(modelo.opds).length).toBe(1);
    expect(Object.keys(modelo.estados ?? {}).length).toBe(0);
    for (const entidad of Object.values(modelo.entidades)) {
      expect(tieneRefinamiento(entidad)).toBe(false);
    }
  });

  test("tiene la estructura wizard SD canonica", () => {
    expect(Object.keys(modelo.entidades).length).toBe(6);
    expect(Object.keys(modelo.enlaces).length).toBe(5);
    const tipos = Object.values(modelo.enlaces).map((l) => l.tipo).sort();
    expect(tipos).toEqual(["agente", "agente", "consumo", "instrumento", "resultado"]);
  });

  test("round-trip preserva conteos", () => {
    const json = exportarModelo(modelo);
    const hidratado = hidratarModelo(json);
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    const m2 = hidratado.value;
    expect(Object.keys(m2.entidades).length).toBe(Object.keys(modelo.entidades).length);
    expect(Object.keys(m2.enlaces).length).toBe(Object.keys(modelo.enlaces).length);
    expect(Object.keys(m2.opds).length).toBe(Object.keys(modelo.opds).length);
  });
});

describe("round-trip exhaustivo del catalogo", () => {
  for (const fixture of fixtureTodos()) {
    test(`${fixture.modelo.nombre} hace round-trip sin perder conteos`, () => {
      const json = exportarModelo(fixture.modelo);
      const hidratado = hidratarModelo(json);
      expect(hidratado.ok).toBe(true);
      if (!hidratado.ok) return;
      const m2 = hidratado.value;
      expect(m2.nombre).toBe(fixture.modelo.nombre);
      expect(Object.keys(m2.entidades).length).toBe(Object.keys(fixture.modelo.entidades).length);
      expect(Object.keys(m2.enlaces).length).toBe(Object.keys(fixture.modelo.enlaces).length);
      expect(Object.keys(m2.opds).length).toBe(Object.keys(fixture.modelo.opds).length);
      expect(Object.keys(m2.estados ?? {}).length).toBe(Object.keys(fixture.modelo.estados ?? {}).length);
    });
  }
});
