import { describe, expect, test } from "bun:test";
import { crearModelo } from "./operaciones";
import type { Entidad, Modelo } from "./tipos";
import { listarAvisosDiagnostico } from "./diagnostico";

describe("diagnostico unificado", () => {
  test("combina validacion estructural y metodologia en una fuente comun", () => {
    const modelo = modeloConProcesoPlaceholder();

    const avisos = listarAvisosDiagnostico(modelo, { tipo: "opd", opdId: modelo.opdRaizId });
    const codigos = avisos.map((aviso) => aviso.reglaId);

    expect(codigos).toContain("proceso-sin-entrada-ni-salida");
    expect(codigos).toContain("PROCESO_NOMBRE_FORMA_VERBAL");
    expect(avisos.find((aviso) => aviso.reglaId === "PROCESO_NOMBRE_FORMA_VERBAL")).toMatchObject({
      origen: "metodologia",
      severidad: "info",
      elementoTipo: "entidad",
      destino: "Proceso",
    });
  });

  test("deduplica avisos al calcular alcance de modelo completo", () => {
    const modelo = modeloConProcesoPlaceholder();

    const avisos = listarAvisosDiagnostico(modelo, { tipo: "modelo" });
    const ids = avisos.map((aviso) => aviso.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});

function modeloConProcesoPlaceholder(): Modelo {
  const base = crearModelo("Modelo");
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
