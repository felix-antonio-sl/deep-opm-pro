import { describe, expect, test } from "bun:test";
import { normalizarWorkspaceIndice } from "./workspaceStorage";
import type { WorkspaceIndice } from "./workspace";

describe("workspaceStorage", () => {
  test("normaliza WorkspaceIndice desde dato estructurado sin storage navegador", () => {
    const indice: WorkspaceIndice = {
      modelos: [{ id: "modelo-1", carpetaId: null, mapa: { zoom: 1.2, autoRefresh: true } }],
      carpetas: [{ id: "carpeta-1", nombre: "Clinica", padreId: null, creadoEn: 1 }],
      recientes: ["modelo-1"],
      preferenciasUi: { anchoPanelArbol: 280, nombresArbolVisibles: true },
    };

    expect(normalizarWorkspaceIndice(indice)).toEqual(indice);
  });

  test("normaliza indice corrupto a estructura vacia y filtra valores invalidos", () => {
    expect(normalizarWorkspaceIndice({
      modelos: [
        { id: "modelo-1", carpetaId: "carpeta-1", mapa: { zoom: "bad" } },
        { carpetaId: null },
      ],
      carpetas: [{ id: "carpeta-1", nombre: "Valida" }, { nombre: "sin id" }],
      recientes: ["modelo-1", 42],
      preferenciasUi: { anchoPanelArbol: "bad" },
    })).toEqual({
      modelos: [{ id: "modelo-1", carpetaId: "carpeta-1" }],
      carpetas: [{ id: "carpeta-1", nombre: "Valida", padreId: null, creadoEn: 0 }],
      recientes: ["modelo-1"],
    });
  });
});
