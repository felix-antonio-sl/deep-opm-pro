import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, crearEnlace } from "../modelo/operaciones";
import { derivar } from "../modelo/razonamiento";
import type { Consulta } from "../modelo/razonamiento";
import { hechosDe } from "../modelo/hechos";
import type { Id, Modelo, Resultado } from "../modelo/tipos";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}
function idPorNombre(modelo: Modelo, nombre: string): Id {
  return Object.values(modelo.entidades).find((e) => e.nombre === nombre)!.id;
}

// Fabricar →(resultado) Pieza →(consumo) Ensamblar
function modeloCadena(): Modelo {
  let m = crearModelo();
  m = must(crearProceso(m, m.opdRaizId, { x: 100, y: 100 }, "Fabricar"));
  m = must(crearObjeto(m, m.opdRaizId, { x: 300, y: 100 }, "Pieza"));
  m = must(crearProceso(m, m.opdRaizId, { x: 500, y: 100 }, "Ensamblar"));
  m = must(crearEnlace(m, m.opdRaizId, idPorNombre(m, "Fabricar"), idPorNombre(m, "Pieza"), "resultado"));
  m = must(crearEnlace(m, m.opdRaizId, idPorNombre(m, "Pieza"), idPorNombre(m, "Ensamblar"), "consumo"));
  return m;
}

describe("LEY law-derivacion", () => {
  test("pura: derivar no muta el modelo", () => {
    const m = modeloCadena();
    const antes = JSON.stringify(m);
    derivar(m, { tipo: "requerido-por", procesoId: idPorNombre(m, "Ensamblar") });
    expect(JSON.stringify(m)).toBe(antes);
  });

  test("determinista: dos llamadas idénticas dan el mismo resultado", () => {
    const m = modeloCadena();
    const c = { tipo: "afectan-a", entidadId: idPorNombre(m, "Pieza") } as const;
    expect(derivar(m, c)).toEqual(derivar(m, c));
  });

  test("todo inferido: ningún hecho derivado se confunde con uno declarado", () => {
    const m = modeloCadena();
    const r = derivar(m, { tipo: "requerido-por", procesoId: idPorNombre(m, "Ensamblar") });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((h) => h.inferido === true)).toBe(true);
  });
});

describe("LEY law-derivacion-no-contradice", () => {
  test("todo hecho derivado referencia elementos DECLARADOS en hechosDe (no inventa ni contradice)", () => {
    const m = modeloCadena();
    // hechos declarados de F0: el conjunto contra el cual lo inferido no debe contradecir.
    const declarados = new Set<string>();
    for (const h of hechosDe(m).values()) {
      if (h.tipo === "entidad") declarados.add(h.entidadId);
      else if (h.tipo === "estado") {
        declarados.add(h.estadoId);
        declarados.add(h.entidadId);
      } else declarados.add(h.enlaceId);
    }
    const consultas: Consulta[] = [
      { tipo: "afectan-a", entidadId: idPorNombre(m, "Pieza") },
      { tipo: "requerido-por", procesoId: idPorNombre(m, "Ensamblar") },
      { tipo: "impacto-de-eliminar", elementoId: idPorNombre(m, "Pieza") },
      { tipo: "impacto-aguas-abajo", elementoId: idPorNombre(m, "Fabricar") },
    ];
    let total = 0;
    for (const c of consultas) {
      for (const h of derivar(m, c)) {
        total += 1;
        // marcado inferido: nunca se mezcla con lo declarado.
        expect(h.inferido).toBe(true);
        // toda referencia derivada existe entre los hechos declarados (no inventa).
        if (h.entidadId) expect(declarados.has(h.entidadId)).toBe(true);
        if (h.procesoId) expect(declarados.has(h.procesoId)).toBe(true);
        if (h.enlaceId) expect(declarados.has(h.enlaceId)).toBe(true);
        if (h.estadoId) expect(declarados.has(h.estadoId)).toBe(true);
      }
    }
    expect(total).toBeGreaterThan(0); // la ley no es vacua
  });

  test("alcanzable tampoco inventa: sus hechos referencian estados/procesos DECLARADOS en hechosDe", () => {
    const m: Modelo = {
      id: "m",
      nombre: "m",
      opdRaizId: "raiz",
      nextSeq: 100,
      entidades: {
        Huevo: { id: "Huevo", tipo: "objeto", nombre: "Huevo", esencia: "fisica", afiliacion: "sistemica" },
        Cocinar: { id: "Cocinar", tipo: "proceso", nombre: "Cocinar", esencia: "informacional", afiliacion: "sistemica" },
      },
      estados: {
        crudo: { id: "crudo", entidadId: "Huevo", nombre: "crudo", designaciones: ["inicial"] },
        cocido: { id: "cocido", entidadId: "Huevo", nombre: "cocido" },
      },
      enlaces: {
        cons: { id: "cons", tipo: "consumo", origenId: { kind: "estado", id: "crudo" }, destinoId: { kind: "entidad", id: "Cocinar" }, etiqueta: "c" },
        res: { id: "res", tipo: "resultado", origenId: { kind: "entidad", id: "Cocinar" }, destinoId: { kind: "estado", id: "cocido" }, etiqueta: "r" },
      },
      opds: { raiz: { id: "raiz", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
    };
    const declarados = new Set<string>();
    for (const h of hechosDe(m).values()) {
      if (h.tipo === "entidad") declarados.add(h.entidadId);
      else if (h.tipo === "estado") {
        declarados.add(h.estadoId);
        declarados.add(h.entidadId);
      } else declarados.add(h.enlaceId);
    }
    const r = derivar(m, { tipo: "alcanzable", entidadId: "Huevo", estado: "cocido" });
    expect(r.length).toBeGreaterThan(0);
    for (const h of r) {
      expect(h.inferido).toBe(true);
      if (h.entidadId) expect(declarados.has(h.entidadId)).toBe(true);
      if (h.procesoId) expect(declarados.has(h.procesoId)).toBe(true);
      if (h.estadoId) expect(declarados.has(h.estadoId)).toBe(true);
    }
  });
});

// Insumo →(consumo) Fabricar →(resultado) Pieza →(consumo) Ensamblar →(resultado) Producto
function modeloCadenaLarga(): Modelo {
  let m = crearModelo();
  m = must(crearObjeto(m, m.opdRaizId, { x: 40, y: 100 }, "Insumo"));
  m = must(crearProceso(m, m.opdRaizId, { x: 220, y: 100 }, "Fabricar"));
  m = must(crearObjeto(m, m.opdRaizId, { x: 400, y: 100 }, "Pieza"));
  m = must(crearProceso(m, m.opdRaizId, { x: 580, y: 100 }, "Ensamblar"));
  m = must(crearObjeto(m, m.opdRaizId, { x: 760, y: 100 }, "Producto"));
  m = must(crearEnlace(m, m.opdRaizId, idPorNombre(m, "Insumo"), idPorNombre(m, "Fabricar"), "consumo"));
  m = must(crearEnlace(m, m.opdRaizId, idPorNombre(m, "Fabricar"), idPorNombre(m, "Pieza"), "resultado"));
  m = must(crearEnlace(m, m.opdRaizId, idPorNombre(m, "Pieza"), idPorNombre(m, "Ensamblar"), "consumo"));
  m = must(crearEnlace(m, m.opdRaizId, idPorNombre(m, "Ensamblar"), idPorNombre(m, "Producto"), "resultado"));
  return m;
}

describe("LEY law-impacto-aguas-abajo (cono descendente transitivo)", () => {
  test("transitivo y direccional: alcanza aguas abajo, excluye lo de aguas arriba y el propio elemento", () => {
    const m = modeloCadenaLarga();
    const ids = (nombre: string) => idPorNombre(m, nombre);
    const afectados = derivar(m, { tipo: "impacto-aguas-abajo", elementoId: ids("Fabricar") })
      .map((h) => h.entidadId);

    // aguas abajo de Fabricar: Pieza (1 salto), Ensamblar (2), Producto (3) → transitivo, no primer nivel.
    expect(afectados).toContain(ids("Pieza"));
    expect(afectados).toContain(ids("Ensamblar"));
    expect(afectados).toContain(ids("Producto"));
    // control de no-tautología (direccionalidad): Insumo está AGUAS ARRIBA → NO debe aparecer.
    // si el cierre fuese no-dirigido, Insumo entraría.
    expect(afectados).not.toContain(ids("Insumo"));
    // excluye el propio elemento colapsado.
    expect(afectados).not.toContain(ids("Fabricar"));
  });

  test("control de no-tautología: es MÁS que el primer nivel de impacto-de-eliminar", () => {
    const m = modeloCadenaLarga();
    const fabricarId = idPorNombre(m, "Fabricar");
    const productoId = idPorNombre(m, "Producto");

    const aguasAbajo = derivar(m, { tipo: "impacto-aguas-abajo", elementoId: fabricarId }).map((h) => h.entidadId);
    const primerNivel = derivar(m, { tipo: "impacto-de-eliminar", elementoId: fabricarId });

    // aguas-abajo alcanza Producto (3 saltos); impacto-de-eliminar (incidencias directas) NO lo lista.
    expect(aguasAbajo).toContain(productoId);
    expect(primerNivel.some((h) => h.entidadId === productoId)).toBe(false);
  });

  test("hoja terminal: un elemento sin flujo descendente tiene impacto vacío (unidad)", () => {
    const m = modeloCadenaLarga();
    const afectados = derivar(m, { tipo: "impacto-aguas-abajo", elementoId: idPorNombre(m, "Producto") });
    expect(afectados).toEqual([]);
  });

  test("pura y todo inferido", () => {
    const m = modeloCadenaLarga();
    const antes = JSON.stringify(m);
    const r = derivar(m, { tipo: "impacto-aguas-abajo", elementoId: idPorNombre(m, "Insumo") });
    expect(JSON.stringify(m)).toBe(antes);
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((h) => h.inferido === true && h.via === "impacto-aguas-abajo")).toBe(true);
  });
});
