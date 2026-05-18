import { describe, expect, test } from "bun:test";
import {
  PREF_MOSTRAR_ARCHIVADOS_KEY,
  WORKSPACE_INDEX_KEY,
  escribirIndiceWorkspaceEnStorage,
  escribirPreferenciaBooleanaEnStorage,
  leerIndiceWorkspaceDesdeStorage,
  leerPreferenciaBooleanaDesdeStorage,
  type WorkspaceStoragePort,
} from "./workspaceStorage";
import type { WorkspaceIndice } from "./workspace";

describe("workspaceStorage", () => {
  test("lee y escribe WorkspaceIndice sin depender de localStorage global", () => {
    const storage = storageMemoria();
    const indice: WorkspaceIndice = {
      modelos: [{ id: "modelo-1", carpetaId: null, mapa: { zoom: 1.2, autoRefresh: true } }],
      carpetas: [{ id: "carpeta-1", nombre: "Clinica", padreId: null, creadoEn: 1 }],
      recientes: ["modelo-1"],
      preferenciasUi: { anchoPanelArbol: 280, nombresArbolVisibles: true },
    };

    expect(escribirIndiceWorkspaceEnStorage(storage, indice)).toEqual({ ok: true, value: undefined });
    expect(storage.datos.get(WORKSPACE_INDEX_KEY)).toBe(JSON.stringify(indice));
    expect(leerIndiceWorkspaceDesdeStorage(storage)).toEqual(indice);
  });

  test("normaliza indice corrupto a estructura vacia y filtra valores invalidos", () => {
    const storage = storageMemoria();
    storage.datos.set(WORKSPACE_INDEX_KEY, JSON.stringify({
      modelos: [
        { id: "modelo-1", carpetaId: "carpeta-1", mapa: { zoom: "bad" } },
        { carpetaId: null },
      ],
      carpetas: [{ id: "carpeta-1", nombre: "Valida" }, { nombre: "sin id" }],
      recientes: ["modelo-1", 42],
      preferenciasUi: { anchoPanelArbol: "bad" },
    }));

    expect(leerIndiceWorkspaceDesdeStorage(storage)).toEqual({
      modelos: [{ id: "modelo-1", carpetaId: "carpeta-1" }],
      carpetas: [{ id: "carpeta-1", nombre: "Valida", padreId: null, creadoEn: 0 }],
      recientes: ["modelo-1"],
    });
  });

  test("lee y escribe preferencias booleanas con fallback", () => {
    const storage = storageMemoria();

    expect(leerPreferenciaBooleanaDesdeStorage(storage, PREF_MOSTRAR_ARCHIVADOS_KEY, true)).toBe(true);
    expect(escribirPreferenciaBooleanaEnStorage(storage, PREF_MOSTRAR_ARCHIVADOS_KEY, false)).toEqual({ ok: true, value: undefined });
    expect(leerPreferenciaBooleanaDesdeStorage(storage, PREF_MOSTRAR_ARCHIVADOS_KEY, true)).toBe(false);
  });
});

function storageMemoria(): WorkspaceStoragePort & { datos: Map<string, string> } {
  const datos = new Map<string, string>();
  return {
    datos,
    readLocalStorage: (key: string) => datos.get(key) ?? null,
    writeLocalStorage: (key: string, value: string) => { datos.set(key, value); },
  };
}
