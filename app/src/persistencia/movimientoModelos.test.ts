import { describe, expect, test } from "bun:test";
import { cortarCarpeta, cortarModelo, moverCarpeta, moverModelo, pegarCarpeta, pegarModelo } from "./movimientoModelos";
import type { WorkspaceIndice } from "./workspace";

describe("movimiento de workspace L4", () => {
  test("corta y pega modelos entre carpetas sin cambiar otros metadatos", () => {
    const workspace = workspaceBase();
    const corte = cortarModelo(workspace, "modelo-1", "2026-05-05T00:00:00.000Z");
    expect(corte.ok).toBe(true);
    if (!corte.ok) return;

    const pegado = pegarModelo(workspace, corte.value, "carpeta-b");

    expect(pegado.ok).toBe(true);
    if (!pegado.ok) return;
    expect(pegado.value.modelos.find((modelo) => modelo.id === "modelo-1")?.carpetaId).toBe("carpeta-b");
    expect(pegado.value.modelos.find((modelo) => modelo.id === "modelo-2")?.carpetaId).toBe("carpeta-a");
  });

  test("mueve carpetas por cut/paste y bloquea ciclos", () => {
    const workspace = workspaceBase();
    const corte = cortarCarpeta(workspace, "carpeta-b");
    expect(corte.ok).toBe(true);
    if (!corte.ok) return;

    const pegado = pegarCarpeta(workspace, corte.value, "carpeta-a");
    expect(pegado.ok).toBe(true);
    if (!pegado.ok) return;
    expect(pegado.value.carpetas.find((carpeta) => carpeta.id === "carpeta-b")?.padreId).toBe("carpeta-a");

    const ciclo = moverCarpeta(pegado.value, "carpeta-a", "carpeta-b");
    expect(ciclo.ok).toBe(false);
    if (!ciclo.ok) expect(ciclo.error).toContain("subcarpeta propia");
  });

  test("drag directo de modelo rechaza carpeta destino inexistente", () => {
    const resultado = moverModelo(workspaceBase(), "modelo-1", "no-existe");
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toContain("destino");
  });
});

function workspaceBase(): WorkspaceIndice {
  return {
    carpetas: [
      { id: "carpeta-a", nombre: "A", padreId: null, creadoEn: 1 },
      { id: "carpeta-b", nombre: "B", padreId: null, creadoEn: 2 },
    ],
    modelos: [
      { id: "modelo-1", carpetaId: "carpeta-a" },
      { id: "modelo-2", carpetaId: "carpeta-a" },
    ],
    recientes: [],
  };
}
