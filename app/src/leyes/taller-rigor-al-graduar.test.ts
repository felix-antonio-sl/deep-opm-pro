import { describe, expect, test } from "bun:test";
import type { AvisoDiagnostico } from "../modelo/diagnostico";
import { severidadDiagnostico } from "../modelo/diagnosticoSeveridad";

/**
 * LEY: rigor al graduar (diseño §3, R-OPD-REF-15). La misma señal de diagnóstico
 * que en un APUNTE se relaja a observación («estilo») debe volverse EXIGIBLE al
 * graduar (severidad real, como si ya fuera modelo). El diálogo de graduación
 * muestra esa severidad real llamando `severidadDiagnostico(aviso, {esApunte:false})`.
 * La integridad (no whitelisted) NUNCA degrada: es exigible en ambos modos.
 */
function avisoDe(overrides: Partial<AvisoDiagnostico>): AvisoDiagnostico {
  return {
    id: "a-1",
    origen: "metodologia",
    reglaId: "R",
    codigo: "SD_SIN_PROCESO_PRINCIPAL",
    codigoVisible: "SD_SIN_PROCESO_PRINCIPAL",
    testIdCodigo: "SD_SIN_PROCESO_PRINCIPAL",
    titulo: "SD sin proceso principal",
    severidad: "info",
    mensaje: "",
    destino: "",
    cita: "",
    citaSSOT: "",
    avisoNavegable: null,
    ...overrides,
  };
}

describe("LEY: rigor al graduar", () => {
  test("un código degradable es observación en apunte y exigible al graduar", () => {
    const aviso = avisoDe({ origen: "metodologia", codigo: "SD_SIN_PROCESO_PRINCIPAL" });
    expect(severidadDiagnostico(aviso, { esApunte: true })).toBe("estilo");   // observación
    expect(severidadDiagnostico(aviso, { esApunte: false })).toBe("mejora");  // exigible al graduar
  });

  test("ADVERSARIAL: un código de integridad (no whitelisted) es exigible en ambos modos", () => {
    // Referencia colgante = integridad mecánica; NUNCA degrada por ser apunte.
    const aviso = avisoDe({ origen: "visual", codigo: "visual-referencia-colgante", severidad: "error" });
    expect(severidadDiagnostico(aviso, { esApunte: true })).toBe("bloqueo");
    expect(severidadDiagnostico(aviso, { esApunte: false })).toBe("bloqueo");
  });
});
