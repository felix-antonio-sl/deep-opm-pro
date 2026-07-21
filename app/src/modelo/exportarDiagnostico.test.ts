import { describe, expect, test } from "bun:test";
import { construirDiagnosticoExport, exportarDiagnosticoJson } from "./exportarDiagnostico";
import { crearModelo } from "./operaciones";
import { fixtureTodos } from "./fixtures";
import { listarAvisosDiagnostico } from "./diagnostico";
import { severidadDiagnostico } from "./diagnosticoSeveridad";
import type { Entidad, Modelo } from "./tipos";

const FECHA_FIJA = new Date("2026-02-15T10:30:00Z");

describe("exportarDiagnostico · envoltorio", () => {
  test("emite metadatos, totales por severidad y array de hallazgos", () => {
    const exportado = construirDiagnosticoExport(modeloConProcesoPlaceholder(), FECHA_FIJA);

    expect(exportado.modelo).toBe("Modelo de prueba");
    expect(exportado.alcance).toBe("modelo");
    expect(exportado.fecha).toBe("2026-02-15");
    // El proceso placeholder dispara un bloqueo ontológico y una mejora de nombre.
    expect(exportado.totales).toEqual({ bloqueo: 1, mejora: 1, estilo: 0, total: 2 });
    expect(exportado.sugerencias).toHaveLength(2);
  });

  test("la fecha se inyecta de forma determinista", () => {
    const a = construirDiagnosticoExport(modeloConProcesoPlaceholder(), new Date("2024-01-02T00:00:00Z"));
    const b = construirDiagnosticoExport(modeloConProcesoPlaceholder(), new Date("2030-12-31T23:59:59Z"));

    expect(a.fecha).toBe("2024-01-02");
    expect(b.fecha).toBe("2030-12-31");
  });

  test("cada hallazgo lleva los campos serializables y excluye navegar/avisoNavegable", () => {
    const exportado = construirDiagnosticoExport(modeloConProcesoPlaceholder(), FECHA_FIJA);
    const sugerencia = exportado.sugerencias.find((s) => s.codigo === "PROCESO_NO_TRANSFORMA");

    expect(sugerencia).toBeDefined();
    expect(sugerencia).toMatchObject({
      origen: "metodologia",
      severidad: "bloqueo",
      codigo: "PROCESO_NO_TRANSFORMA",
      destino: "Proceso",
      elementoId: "p-proceso",
      elementoTipo: "entidad",
    });
    expect(typeof sugerencia?.id).toBe("string");
    expect(typeof sugerencia?.titulo).toBe("string");
    expect(typeof sugerencia?.mensaje).toBe("string");
    expect(typeof sugerencia?.citaSSOT).toBe("string");

    // Ningún campo no serializable debe filtrarse al JSON exportado.
    for (const s of exportado.sugerencias) {
      expect(s).not.toHaveProperty("navegar");
      expect(s).not.toHaveProperty("avisoNavegable");
    }
  });

  test("usa la severidad visible (clasificada), no el SeveridadAviso crudo", () => {
    const exportado = construirDiagnosticoExport(modeloConProcesoPlaceholder(), FECHA_FIJA);
    // PROCESO_NOMBRE_FORMA_VERBAL es una mejora metodológica. El export debe
    // reflejar la misma severidad visible que el panel.
    const metodologico = exportado.sugerencias.find((s) => s.codigo === "PROCESO_NOMBRE_FORMA_VERBAL");

    expect(metodologico).toBeDefined();
    expect(metodologico?.origen).toBe("metodologia");
    expect(metodologico?.severidad).toBe("mejora");
    // Ninguna sugerencia debe llevar un valor de severidad cruda.
    for (const s of exportado.sugerencias) {
      expect(["bloqueo", "mejora", "estilo"]).toContain(s.severidad);
    }
  });
});

describe("exportarDiagnostico · invariantes", () => {
  test("los totales discriminan severidades y suman el total en cualquier modelo", () => {
    for (const fixture of [...fixtureTodos().map((f) => f.modelo), modeloConProcesoPlaceholder()]) {
      const exportado = construirDiagnosticoExport(fixture, FECHA_FIJA);
      const { bloqueo, mejora, estilo, total } = exportado.totales;

      expect(bloqueo + mejora + estilo).toBe(total);
      expect(total).toBe(exportado.sugerencias.length);
    }
  });

  test("la severidad de cada sugerencia coincide con severidadDiagnostico del aviso", () => {
    const modelo = modeloConProcesoPlaceholder();
    const avisos = listarAvisosDiagnostico(modelo, { tipo: "modelo" });
    const exportado = construirDiagnosticoExport(modelo, FECHA_FIJA);
    const severidadEsperadaPorId = new Map(avisos.map((a) => [a.id, severidadDiagnostico(a)]));

    for (const sugerencia of exportado.sugerencias) {
      expect(sugerencia.severidad).toBe(severidadEsperadaPorId.get(sugerencia.id)!);
    }
  });

  test("un modelo sin avisos exporta totales en cero y sugerencias vacías", () => {
    const exportado = construirDiagnosticoExport(crearModelo("Vacío"), FECHA_FIJA);

    expect(exportado.totales).toEqual({ bloqueo: 0, mejora: 0, estilo: 0, total: 0 });
    expect(exportado.sugerencias).toEqual([]);
  });
});

describe("exportarDiagnosticoJson", () => {
  test("produce JSON con indentación de 2 espacios y round-trip estable", () => {
    const modelo = modeloConProcesoPlaceholder();
    const json = exportarDiagnosticoJson(modelo, FECHA_FIJA);

    expect(json).toContain('\n  "modelo":');
    expect(json).not.toContain("\t");
    expect(JSON.parse(json)).toEqual(construirDiagnosticoExport(modelo, FECHA_FIJA) as unknown as Record<string, unknown>);
  });
});

function modeloConProcesoPlaceholder(): Modelo {
  const base = crearModelo("Modelo de prueba");
  const proceso: Entidad = {
    id: "p-proceso",
    tipo: "proceso",
    nombre: "Proceso",
    esencia: "informacional",
    afiliacion: "sistemica",
  };
  return {
    ...base,
    entidades: { [proceso.id]: proceso },
    opds: {
      [base.opdRaizId]: {
        ...base.opds[base.opdRaizId]!,
        apariencias: {
          "a-proceso": {
            id: "a-proceso",
            entidadId: proceso.id,
            opdId: base.opdRaizId,
            x: 80,
            y: 80,
            width: 135,
            height: 60,
          },
        },
      },
    },
  };
}
