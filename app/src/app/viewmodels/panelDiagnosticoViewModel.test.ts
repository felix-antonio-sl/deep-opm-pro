import { describe, expect, mock, test } from "bun:test";
import type { AvisoDiagnostico } from "../../modelo/diagnostico";
import type { Aviso, SeveridadAviso } from "../../modelo/validaciones";
import {
  agruparIssuesDiagnostico,
  derivarIssuesDiagnostico,
  severidadDiagnostico,
  severidadDesdeAviso,
} from "./panelDiagnosticoViewModel";

function avisoDiagnostico(parcial: Partial<AvisoDiagnostico> = {}): AvisoDiagnostico {
  const id = parcial.id ?? "aviso-1";
  const codigo = parcial.codigo ?? parcial.reglaId ?? "regla-1";
  return {
    id,
    origen: parcial.origen ?? "validacion",
    reglaId: parcial.reglaId ?? codigo,
    codigo,
    codigoVisible: parcial.codigoVisible ?? codigo,
    testIdCodigo: parcial.testIdCodigo ?? codigo,
    severidad: parcial.severidad ?? "advertencia",
    mensaje: parcial.mensaje ?? "Mensaje",
    destino: parcial.destino ?? "Modelo",
    cita: parcial.cita ?? "[V-1]",
    citaSSOT: parcial.citaSSOT ?? "[V-1]",
    avisoNavegable: parcial.avisoNavegable ?? null,
    ...(parcial.elementoTipo ? { elementoTipo: parcial.elementoTipo } : {}),
    ...(parcial.elementoId ? { elementoId: parcial.elementoId } : {}),
    ...(parcial.opdId ? { opdId: parcial.opdId } : {}),
    ...(parcial.navegarA ? { navegarA: parcial.navegarA } : {}),
  };
}

function avisoNavegable(severidad: SeveridadAviso = "error"): Aviso {
  return {
    reglaId: "regla-navegable",
    severidad,
    mensaje: "Navegable",
    citaSSOT: "[V-1]",
    elementoTipo: "entidad",
    elementoId: "entidad-1",
  };
}

describe("panelDiagnosticoViewModel · severidad", () => {
  test("mapea severidad de validacion a grupos visibles", () => {
    expect(severidadDesdeAviso("error")).toBe("bloqueo");
    expect(severidadDesdeAviso("advertencia")).toBe("mejora");
    expect(severidadDesdeAviso("info")).toBe("estilo");
  });

  test("mantiene metodologia como mejora visible aunque llegue como info", () => {
    expect(severidadDiagnostico(avisoDiagnostico({
      origen: "metodologia",
      codigo: "PROCESO_NOMBRE_FORMA_VERBAL",
      severidad: "info",
    }))).toBe("mejora");
  });
});

describe("panelDiagnosticoViewModel · issues", () => {
  test("deriva issues conservando textos, codigos, destinos y citas", () => {
    const issues = derivarIssuesDiagnostico([
      avisoDiagnostico({
        id: "val-1",
        reglaId: "agregacion-misma-esencia",
        codigo: "agregacion-misma-esencia",
        codigoVisible: "agregacion-misma-esencia",
        testIdCodigo: "agregacion-misma-esencia",
        severidad: "advertencia",
        mensaje: "Mezcla esencia",
        destino: "Objeto - o1",
        cita: "[V-1]",
      }),
    ], () => undefined);

    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      id: "val-1",
      testIdCodigo: "agregacion-misma-esencia",
      severidad: "mejora",
      codigo: "agregacion-misma-esencia",
      mensaje: "Mezcla esencia",
      destino: "Objeto - o1",
      cita: "[V-1]",
    });
  });

  test("agrupa issues sin perder orden relativo por severidad", () => {
    const issues = derivarIssuesDiagnostico([
      avisoDiagnostico({ id: "b1", codigo: "b1", severidad: "error" }),
      avisoDiagnostico({ id: "m1", codigo: "m1", severidad: "advertencia" }),
      avisoDiagnostico({ id: "e1", codigo: "e1", severidad: "info" }),
      avisoDiagnostico({ id: "b2", codigo: "b2", severidad: "error" }),
    ], () => undefined);

    const grupos = agruparIssuesDiagnostico(issues);

    expect(grupos.bloqueo.map((issue) => issue.id)).toEqual(["b1", "b2"]);
    expect(grupos.mejora.map((issue) => issue.id)).toEqual(["m1"]);
    expect(grupos.estilo.map((issue) => issue.id)).toEqual(["e1"]);
  });

  test("navega solo cuando el aviso tiene destino navegable", () => {
    const navegable = avisoNavegable();
    const navegarAviso = mock(() => undefined);
    const issues = derivarIssuesDiagnostico([
      avisoDiagnostico({ id: "sin-destino", avisoNavegable: null }),
      avisoDiagnostico({ id: "con-destino", avisoNavegable: navegable }),
    ], navegarAviso);

    expect(issues).toHaveLength(2);
    issues.at(0)?.navegar();
    issues.at(1)?.navegar();

    expect(navegarAviso).toHaveBeenCalledTimes(1);
    expect(navegarAviso).toHaveBeenCalledWith(navegable);
  });
});
