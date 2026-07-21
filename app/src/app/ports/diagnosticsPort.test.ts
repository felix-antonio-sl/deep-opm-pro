import { describe, expect, mock, test } from "bun:test";
import { crearModelo } from "../../modelo/operaciones";
import type { Entidad, Modelo } from "../../modelo/tipos";
import type { Aviso } from "../../modelo/validaciones";
import { crearDiagnosticsPort, crearDiagnosticsQueryPort } from "./diagnosticsPort";

describe("DiagnosticsPort", () => {
  test("expone calculo de avisos por alcance sin depender del store completo", () => {
    const modelo = modeloConProcesoPlaceholder();
    const query = crearDiagnosticsQueryPort(modelo);

    const avisos = query.listarAvisos({ tipo: "modelo" });

    expect(avisos.map((aviso) => aviso.testIdCodigo)).toContain("PROCESO_NO_TRANSFORMA");
    expect(avisos.map((aviso) => aviso.reglaId)).not.toContain("proceso-sin-entrada-ni-salida");
    expect(avisos.map((aviso) => aviso.reglaId)).toContain("PROCESO_NOMBRE_FORMA_VERBAL");
  });

  test("compone avisos del OPD activo y conserva accion de navegacion", () => {
    const modelo = modeloConProcesoPlaceholder();
    const navegarAviso = mock((_: Aviso) => undefined);

    const port = crearDiagnosticsPort({ modelo, opdActivoId: modelo.opdRaizId, navegarAviso });

    expect(port.avisos).toEqual(port.listarAvisos({ tipo: "opd", opdId: modelo.opdRaizId }));
    expect(port.navegarAviso).toBe(navegarAviso);
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
