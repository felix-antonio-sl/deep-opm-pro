import { describe, expect, test } from "bun:test";
import type { Entidad } from "../../modelo/tipos";
import { tokens } from "../tokens";
import { anclajeStyles, debeMostrarSeccionAnclaje, SeccionAnclaje } from "./SeccionAnclaje";

/**
 * Centinela de Drift (Fase 3) — contrato estructural del componente (patrón
 * SeccionAnclas.test). La copy por estado se prueba en `anclajePresentacion.test.ts`;
 * el comportamiento DOM (clics → acciones, marca visible) lo cubre browser:smoke
 * en Fase 4. Aquí: montaje condicional, función-componente y aserción dura D3.
 */
const entidadAnclada = {
  id: "ent-1",
  tipo: "objeto",
  nombre: "Cosa",
  anclaje: { piezaId: "Component", biblioteca: { modeloId: "gist-1", nombre: "gist", frozenAtHash: "h0" } },
} as unknown as Entidad;

const entidadLibre = { id: "ent-2", tipo: "objeto", nombre: "Suelta" } as unknown as Entidad;

describe("SeccionAnclaje contrato", () => {
  test("export es función componente con un parámetro de props", () => {
    expect(typeof SeccionAnclaje).toBe("function");
    expect(SeccionAnclaje.length).toBe(1);
  });

  test("debeMostrarSeccionAnclaje: true solo con anclaje (no aparece sin anclar)", () => {
    expect(debeMostrarSeccionAnclaje(entidadAnclada)).toBe(true);
    expect(debeMostrarSeccionAnclaje(entidadLibre)).toBe(false);
  });

  test("D3: cero crimson en los estilos de la sección (énfasis tipográfico, no cromático)", () => {
    const serializado = JSON.stringify(anclajeStyles).toLowerCase();
    expect(serializado).not.toContain(tokens.colors.crimson.toLowerCase());
    expect(serializado).not.toContain("crimson");
    // tokens.colors.accent === crimson: ningún estilo debe resolver a ese hex.
    expect(serializado).not.toContain(tokens.colors.accent.toLowerCase());
  });
});
