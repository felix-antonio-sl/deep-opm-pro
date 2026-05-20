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
    titulo: parcial.titulo ?? "Título humano",
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
        titulo: "Agregación mezcla esencia",
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
      titulo: "Agregación mezcla esencia",
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

    expect(grupos.bloqueo.map((grupo) => grupo.id)).toEqual(["b1", "b2"]);
    expect(grupos.mejora.map((grupo) => grupo.id)).toEqual(["m1"]);
    expect(grupos.estilo.map((grupo) => grupo.id)).toEqual(["e1"]);
    // Cada grupo trae una sola instancia cuando los reglaId son distintos.
    expect(grupos.bloqueo.every((grupo) => grupo.instancias.length === 1)).toBe(true);
  });

  test("colapsa issues con el mismo testIdCodigo dentro de una severidad (ronda23 L2 #8)", () => {
    const issues = derivarIssuesDiagnostico([
      avisoDiagnostico({
        id: "p1",
        codigo: "proceso-sin-entrada-ni-salida",
        testIdCodigo: "proceso-sin-entrada-ni-salida",
        severidad: "advertencia",
        destino: "Procesar A",
      }),
      avisoDiagnostico({
        id: "p2",
        codigo: "proceso-sin-entrada-ni-salida",
        testIdCodigo: "proceso-sin-entrada-ni-salida",
        severidad: "advertencia",
        destino: "Procesar B",
      }),
      avisoDiagnostico({
        id: "p3",
        codigo: "proceso-sin-entrada-ni-salida",
        testIdCodigo: "proceso-sin-entrada-ni-salida",
        severidad: "advertencia",
        destino: "Procesar C",
      }),
    ], () => undefined);

    const grupos = agruparIssuesDiagnostico(issues);

    expect(grupos.mejora).toHaveLength(1);
    expect(grupos.mejora[0]?.id).toBe("p1");
    expect(grupos.mejora[0]?.instancias.map((issue) => issue.id)).toEqual(["p1", "p2", "p3"]);
    expect(grupos.mejora[0]?.testIdCodigo).toBe("proceso-sin-entrada-ni-salida");
  });

  test("no colapsa issues con distinto testIdCodigo aunque compartan severidad", () => {
    const issues = derivarIssuesDiagnostico([
      avisoDiagnostico({ id: "a", testIdCodigo: "regla-a", severidad: "advertencia" }),
      avisoDiagnostico({ id: "b", testIdCodigo: "regla-b", severidad: "advertencia" }),
      avisoDiagnostico({ id: "a2", testIdCodigo: "regla-a", severidad: "advertencia" }),
    ], () => undefined);

    const grupos = agruparIssuesDiagnostico(issues);

    expect(grupos.mejora.map((grupo) => grupo.testIdCodigo)).toEqual(["regla-a", "regla-b"]);
    expect(grupos.mejora[0]?.instancias.map((issue) => issue.id)).toEqual(["a", "a2"]);
    expect(grupos.mejora[1]?.instancias.map((issue) => issue.id)).toEqual(["b"]);
  });

  test("el grupo navega y cita usando el primer issue (representante)", () => {
    const navegable: Aviso = {
      reglaId: "demo",
      severidad: "advertencia",
      mensaje: "Demo",
      citaSSOT: "[V-1]",
    };
    const navegarAviso = mock(() => undefined);
    const issues = derivarIssuesDiagnostico([
      avisoDiagnostico({ id: "rep", testIdCodigo: "demo", avisoNavegable: navegable }),
      avisoDiagnostico({ id: "extra", testIdCodigo: "demo", avisoNavegable: null }),
    ], navegarAviso);
    const grupos = agruparIssuesDiagnostico(issues);

    expect(grupos.mejora).toHaveLength(1);
    grupos.mejora[0]?.navegar();
    expect(navegarAviso).toHaveBeenCalledTimes(1);
    expect(navegarAviso).toHaveBeenCalledWith(navegable);
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
