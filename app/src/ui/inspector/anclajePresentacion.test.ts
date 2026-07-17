import { describe, expect, test } from "bun:test";
import type { Anclaje } from "../../modelo/tipos";
import { copyAnclaje, nombreBiblioteca, nombrePieza } from "./anclajePresentacion";

const anclaje: Anclaje = {
  piezaId: "Component",
  biblioteca: { modeloId: "gist-lib-1", nombre: "gist", frozenAtHash: "h0" },
};

describe("anclajePresentacion — copy honesto biblioteca-nivel (Centinela Fase 3)", () => {
  test("nombres presentables: rótulo de biblioteca y pieza", () => {
    expect(nombreBiblioteca(anclaje)).toBe("gist");
    expect(nombrePieza(anclaje)).toBe("Component");
  });

  test("biblioteca sin rótulo cae al modeloId", () => {
    const sinNombre: Anclaje = { piezaId: "P", biblioteca: { modeloId: "lib-x", frozenAtHash: "h" } };
    expect(nombreBiblioteca(sinNombre)).toBe("lib-x");
  });

  test("sincronizado: línea sobria «al día», sin re-sincronizar, soltar disponible", () => {
    const c = copyAnclaje("sincronizado", anclaje);
    expect(c.cuerpo).toContain("al día");
    expect(c.cuerpo).toContain("gist");
    expect(c.cuerpo).toContain("Component");
    expect(c.titulo).toBeNull();
    expect(c.mostrarReSincronizar).toBe(false);
    expect(c.mostrarSoltar).toBe(true);
  });

  test("divergente: copy biblioteca-nivel (D1) — «la biblioteca cambió», NUNCA «tu Pieza cambió»", () => {
    const c = copyAnclaje("divergente", anclaje);
    expect(c.titulo).toBe("La biblioteca de esta pieza cambió.");
    expect(c.cuerpo).toContain("la biblioteca cambió");
    // D1: no se culpa a la Pieza.
    expect(c.cuerpo.toLowerCase()).not.toContain("tu pieza cambió");
    expect(c.mostrarReSincronizar).toBe(true);
    expect(c.mostrarSoltar).toBe(true);
  });

  test("divergente: explica resync sin importación y undo inmediato de Soltar", () => {
    const c = copyAnclaje("divergente", anclaje);
    expect(c.avisoAcciones).toContain("Re-sincronizar acepta la firma actual como nueva referencia");
    expect(c.avisoAcciones).toContain("no cambia tu contenido");
    expect(c.avisoAcciones).toContain("Puedes deshacerlo de inmediato con Ctrl+Z");
    expect(c.avisoAcciones).toContain("no existe una reconversión directa a Anclaje");
    expect(c.avisoAcciones).not.toContain("Soltar no se deshace");
  });

  test("no-resuelto: honestidad temporal — no se pudo leer; sin re-sincronizar, soltar disponible", () => {
    const c = copyAnclaje("no-resuelto", anclaje);
    expect(c.cuerpo).toContain("No se pudo leer la biblioteca");
    expect(c.titulo).toBeNull();
    expect(c.mostrarReSincronizar).toBe(false);
    expect(c.mostrarSoltar).toBe(true);
  });

  test("estado nulo (drift aún sin resolver) ⇒ no-resuelto defensivo, no inventa al-día", () => {
    const c = copyAnclaje(null, anclaje);
    expect(c.estado).toBe("no-resuelto");
    expect(c.mostrarReSincronizar).toBe(false);
  });

  test("D5: cero matemática en superficie en todo el copy", () => {
    for (const estado of ["sincronizado", "divergente", "no-resuelto"] as const) {
      const c = copyAnclaje(estado, anclaje);
      const todo = `${c.titulo ?? ""} ${c.cuerpo} ${c.avisoAcciones}`.toLowerCase();
      for (const prohibido of ["fibración", "fibracion", "pullback", "functor", "adjunción", "hash", "δ", "σ"]) {
        expect(todo).not.toContain(prohibido);
      }
    }
  });
});
