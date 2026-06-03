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
