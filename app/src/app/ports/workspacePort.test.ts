import { describe, expect, test } from "bun:test";
import type { ResumenModeloPersistido } from "../../persistencia/modelos";
import type { WorkspaceIndice } from "../../persistencia/workspace";
import { resolverHijosWorkspace, rutaWorkspaceActual, validarNombreWorkspace } from "./workspacePort";

function resumen(id: string, nombre = id): ResumenModeloPersistido {
  return {
    id,
    nombre,
    descripcion: "",
    creadoEn: "2026-01-01T00:00:00.000Z",
    actualizadoEn: "2026-01-01T00:00:00.000Z",
  };
}

describe("WorkspacePort helpers", () => {
  test("resuelve hijos de carpeta mezclando indice y resumen persistido", () => {
    const indice: WorkspaceIndice = {
      recientes: [],
      carpetas: [
        { id: "carpeta-a", nombre: "A", padreId: null, creadoEn: 1 },
        { id: "carpeta-b", nombre: "B", padreId: "carpeta-a", creadoEn: 2 },
      ],
      modelos: [
        {
          id: "modelo-1",
          carpetaId: "carpeta-a",
          archivado: true,
          archivadoEn: "2026-01-02T00:00:00.000Z",
          versiones: [{
            id: "v1",
            creadoEn: "2026-01-02T00:00:00.000Z",
            nombre: "v1",
            modeloPayloadKey: "payload-v1",
            bytes: 10,
          }],
        },
        { id: "modelo-2", carpetaId: "carpeta-a" },
      ],
    };

    const hijos = resolverHijosWorkspace(indice, "carpeta-a", [resumen("modelo-1")], { incluirArchivados: true });

    expect(hijos.carpetas.map((carpeta) => carpeta.id)).toEqual(["carpeta-b"]);
    expect(hijos.modelos).toHaveLength(1);
    expect(hijos.modelos[0]).toMatchObject({
      id: "modelo-1",
      archivado: true,
      archivadoEn: "2026-01-02T00:00:00.000Z",
    });
    expect(hijos.modelos[0]?.versiones).toHaveLength(1);
  });

  test("expone ruta y validacion sin filtrar por UI", () => {
    const indice: WorkspaceIndice = {
      recientes: [],
      carpetas: [
        { id: "raiz", nombre: "Raiz", padreId: null, creadoEn: 1 },
        { id: "hija", nombre: "Hija", padreId: "raiz", creadoEn: 2 },
      ],
      modelos: [],
    };

    expect(rutaWorkspaceActual(indice, "hija").map((carpeta) => carpeta.nombre)).toEqual(["Raiz", "Hija"]);
    expect(validarNombreWorkspace("Nuevo", [resumen("modelo-1", "Existente")]).ok).toBe(true);
    expect(validarNombreWorkspace("Existente", [resumen("modelo-1", "Existente")]).ok).toBe(false);
  });
});
