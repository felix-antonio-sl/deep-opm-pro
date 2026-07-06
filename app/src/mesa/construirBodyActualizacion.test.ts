import { describe, expect, test } from "bun:test";
import { construirBodyActualizacion } from "./construirBodyActualizacion";
import type { ResumenModeloPersistido } from "../persistencia/modelos";

// Registro existente con TODOS los campos que el bug crítico perdía en un
// `mesa push` de actualización: carpetaId, descripcion no vacía, archivado,
// versiones nombradas. Ver comentario de construirBodyActualizacion.ts.
const existente: ResumenModeloPersistido = {
  id: "m1",
  nombre: "Nombre viejo",
  descripcion: "Descripción clínica importante que NO debe perderse",
  creadoEn: "2026-01-01T00:00:00.000Z",
  actualizadoEn: "2026-01-02T00:00:00.000Z",
  carpetaId: "carpeta-clinica",
  archivado: true,
  archivadoEn: "2026-01-03T00:00:00.000Z",
  archivadoAuto: false,
  crearVersionAlGuardar: true,
  versiones: [{ id: "v1", creadoEn: "2026-01-01T00:00:00.000Z", nombre: "v1 nombrada", modeloPayloadKey: "v1", bytes: 42 }],
  revision: 3,
};

describe("construirBodyActualizacion", () => {
  test("preserva carpeta/descripción/archivado/versiones del existente y aplica json/nombre/revision nuevos", () => {
    const body = construirBodyActualizacion(
      { id: "m1", nombre: "Nombre nuevo", json: '{"formato":"opm-v0","modelo":{}}', revision: 3 },
      existente,
      "2026-02-01T00:00:00.000Z",
    );

    // Preservado desde `existente` — este es el REGRESSION GUARD del bug crítico.
    expect(body.carpetaId).toBe("carpeta-clinica");
    expect(body.descripcion).toBe("Descripción clínica importante que NO debe perderse");
    expect(body.archivado).toBe(true);
    expect(body.archivadoEn).toBe("2026-01-03T00:00:00.000Z");
    expect(body.archivadoAuto).toBe(false);
    expect(body.crearVersionAlGuardar).toBe(true);
    expect(body.versiones).toEqual(existente.versiones);
    expect(body.creadoEn).toBe("2026-01-01T00:00:00.000Z");

    // Aplicado desde `nuevo` — lo que trae el push.
    expect(body.nombre).toBe("Nombre nuevo");
    expect(body.revision).toBe(3);
    expect(body.actualizadoEn).toBe("2026-02-01T00:00:00.000Z");
    expect(JSON.parse(body.json)).toEqual({ formato: "opm-v0", modelo: {} });
  });

  test("regresión del bug crítico: el body trae más que solo id/nombre/json/creadoEn/actualizadoEn/revision", () => {
    const body = construirBodyActualizacion(
      { id: "m1", nombre: "Nombre nuevo", json: "{}", revision: 3 },
      existente,
    );
    const claves = Object.keys(body);
    for (const preservada of ["carpetaId", "descripcion", "archivado", "archivadoEn", "versiones", "crearVersionAlGuardar"]) {
      expect(claves).toContain(preservada);
    }
  });
});
