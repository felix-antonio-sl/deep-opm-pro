import { describe, expect, test } from "bun:test";
import type { AvisoDiagnostico } from "./diagnostico";
import {
  CODIGOS_VALIDEZ_DEGRADABLES_APUNTE,
  severidadDiagnostico,
} from "./diagnosticoSeveridad";
import type { Modelo } from "./tipos";
import { validarReferenciasOpd } from "../serializacion/validarIntegridad";

// Ley falsable del modo apunte — corrección 4 (DEGRADAR POR CLASE) + línea dura.
//
// Un apunte relaja la VALIDEZ OPM a observación, pero la INTEGRIDAD estructural
// nunca degrada. El mecanismo es whitelist (fail-closed): un código degrada SOLO
// si está en `CODIGOS_VALIDEZ_DEGRADABLES_APUNTE`; cualquier otro conserva su
// severidad. Spec: docs/superpowers/specs/2026-06-30-modo-apunte-design.md §1, §3.4.

function avisoDiagnostico(over: Partial<AvisoDiagnostico>): AvisoDiagnostico {
  return {
    id: "x-1",
    origen: "validacion",
    reglaId: "regla",
    codigo: "regla",
    codigoVisible: "regla",
    testIdCodigo: "regla",
    titulo: "Regla",
    severidad: "error",
    mensaje: "mensaje",
    destino: "Modelo",
    cita: "",
    citaSSOT: "",
    avisoNavegable: null,
    ...over,
  };
}

describe("modo apunte · degradación de severidad por-clase (corrección 4)", () => {
  // Representante de VALIDEZ: agente=humano (R-AG-1). Error → bloqueo en modo normal.
  const VALIDEZ = "agente-requiere-objeto-fisico";
  // Representante de INTEGRIDAD (referencia colgante en el panel): NO whitelisted.
  const INTEGRIDAD = "visual-enlace-extremo-logico-inexistente";

  test("la whitelist contiene el código de validez y NO el de integridad", () => {
    expect(CODIGOS_VALIDEZ_DEGRADABLES_APUNTE.has(VALIDEZ)).toBe(true);
    expect(CODIGOS_VALIDEZ_DEGRADABLES_APUNTE.has(INTEGRIDAD)).toBe(false);
  });

  test("validez con severidad error: bloqueo en modo normal, observación en apunte", () => {
    const aviso = avisoDiagnostico({ origen: "validacion", codigo: VALIDEZ, severidad: "error" });
    expect(severidadDiagnostico(aviso)).toBe("bloqueo");
    expect(severidadDiagnostico(aviso, { esApunte: true })).toBe("estilo");
  });

  test("integridad NO degrada: misma severidad con o sin apunte", () => {
    const aviso = avisoDiagnostico({ origen: "visual", codigo: INTEGRIDAD, severidad: "advertencia" });
    // Sin apunte mapea a 'mejora' (advertencia). El apunte NO lo baja a observación.
    expect(severidadDiagnostico(aviso)).toBe("mejora");
    expect(severidadDiagnostico(aviso, { esApunte: true })).toBe("mejora");
  });

  test("validez metodológica (EFECTO_OBJETO_SIN_ESTADOS) también se relaja en apunte", () => {
    const aviso = avisoDiagnostico({ origen: "metodologia", codigo: "EFECTO_OBJETO_SIN_ESTADOS", severidad: "info" });
    expect(severidadDiagnostico(aviso)).toBe("mejora");
    expect(severidadDiagnostico(aviso, { esApunte: true })).toBe("estilo");
  });

  test("esApunte=false es idéntico a no pasar opciones (cero migración)", () => {
    const aviso = avisoDiagnostico({ origen: "validacion", codigo: VALIDEZ, severidad: "error" });
    expect(severidadDiagnostico(aviso, { esApunte: false })).toBe(severidadDiagnostico(aviso));
  });
});

describe("modo apunte · línea dura: la integridad mecánica es incondicional", () => {
  // `validarReferenciasOpd` es el gate de integridad de import/serialización. NO
  // recibe `esApunte` por construcción: un apunte con una referencia colgante se
  // rechaza igual que un modelo. Esto blinda la línea dura aguas abajo de la
  // degradación de severidad del panel.
  test("validarReferenciasOpd rechaza una referencia colgante sin importar la especie", () => {
    const modelo: Modelo = {
      id: "m-1",
      nombre: "Apunte",
      opdRaizId: "opd-1",
      nextSeq: 1,
      entidades: {},
      estados: {},
      enlaces: {},
      abanicos: {},
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {},
          enlaces: {
            "ae-1": { id: "ae-1", enlaceId: "enlace-inexistente", opdId: "opd-1", vertices: [] },
          },
        },
      },
    } as unknown as Modelo;

    expect(validarReferenciasOpd(modelo).ok).toBe(false);
  });
});
