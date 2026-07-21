import { describe, expect, test } from "bun:test";
import type { AvisoDiagnostico } from "./diagnostico";
import type { AvisoMetodologico, CodigoChecker } from "./tipos";
import {
  agruparPorSeveridad,
  clasificarSeveridad,
  resumenSeveridades,
  resumenSeveridadesTexto,
  severidadDiagnostico,
} from "./diagnosticoSeveridad";

const MEJORAS: CodigoChecker[] = [
  "SD_SIN_PROCESO_PRINCIPAL",
  "PROCESO_NOMBRE_FORMA_VERBAL",
  "ESTADO_NOMBRE_CANONICO",
  "OBJETO_NOMBRE_SINGULAR",
  "INZOOM_CONTENIDO_INSUFICIENTE",
  "INZOOM_NOMBRES_PLACEHOLDER_HIJOS",
  "UNFOLD_CONTENIDO_INSUFICIENTE",
  "PROCESO_SISTEMICO_DESCONECTADO",
  "RECURSO_LINEAL_MULTIPLES_CONSUMIDORES",
  "DESCOMPOSICION_SIN_SUBPROCESOS",
  "DESCOMPOSICION_NO_PRESERVA_FRONTERA",
  "EFECTO_SIN_TRANSICION",
  "PROBABILIDAD_FUERA_DE_ABANICO",
  "ENTIDAD_SIN_APARICIONES",
];

const BLOQUEOS: CodigoChecker[] = [
  "PROCESO_NO_TRANSFORMA",
  "EFECTO_OBJETO_SIN_ESTADOS",
  "PAR_TRANSFORMADOR_DUPLICADO",
  "INVOCACION_REDUNDANTE_CON_ORDEN",
  "ORDEN_INZOOM_REFERENCIA_INVALIDA",
];

function aviso(codigo: CodigoChecker): AvisoMetodologico {
  return {
    codigo,
    severidad: "advertencia",
    mensaje: codigo,
    rationale: "Razon",
    ssotRef: "metodologia-opm-es.md §6",
    accionesSugeridas: ["Accion"],
  };
}

describe("diagnosticoSeveridad · clasificarSeveridad", () => {
  for (const codigo of MEJORAS) {
    test(`${codigo} se clasifica como mejora metodologica`, () => {
      expect(clasificarSeveridad(aviso(codigo))).toBe("mejora");
    });
  }

  for (const codigo of BLOQUEOS) {
    test(`${codigo} se clasifica como bloqueo estructural`, () => {
      expect(clasificarSeveridad(aviso(codigo))).toBe("bloqueo");
    });
  }
});

describe("diagnosticoSeveridad · resumenSeveridades", () => {
  test("cuenta lista vacia", () => {
    expect(resumenSeveridades([])).toEqual({ bloqueos: 0, mejoras: 0, estilo: 0 });
  });

  test("cuenta la particion canonica entre bloqueos y mejoras", () => {
    expect(resumenSeveridades([...MEJORAS, ...BLOQUEOS].map(aviso))).toEqual({
      bloqueos: BLOQUEOS.length,
      mejoras: MEJORAS.length,
      estilo: 0,
    });
  });

  test("agrupa sin perder orden relativo por severidad", () => {
    const avisos = [
      aviso("PROCESO_NO_TRANSFORMA"),
      aviso("SD_SIN_PROCESO_PRINCIPAL"),
      aviso("OBJETO_NOMBRE_SINGULAR"),
    ];
    expect(agruparPorSeveridad(avisos).mejora.map((item) => item.codigo)).toEqual([
      "SD_SIN_PROCESO_PRINCIPAL",
      "OBJETO_NOMBRE_SINGULAR",
    ]);
    expect(agruparPorSeveridad(avisos).bloqueo.map((item) => item.codigo)).toEqual([
      "PROCESO_NO_TRANSFORMA",
    ]);
  });

  test("formatea resumen visible del panel", () => {
    expect(resumenSeveridadesTexto({ bloqueos: 0, mejoras: 21, estilo: 0 })).toBe(
      "0 bloqueos estructurales / 21 mejoras metodologicas / 0 observaciones de estilo",
    );
  });
});

describe("diagnosticoSeveridad · clases no metodologicas", () => {
  test("una rotura de integridad visual es bloqueo, no mejora", () => {
    expect(severidadDiagnostico(diagnostico({
      origen: "visual",
      codigo: "visual-enlace-extremo-logico-inexistente",
      severidad: "error",
    }))).toBe("bloqueo");
  });

  test("solape e imagen con estados son estilo y legibilidad", () => {
    expect(severidadDiagnostico(diagnostico({
      origen: "visual",
      codigo: "visual-solape-apariencias",
      severidad: "info",
    }))).toBe("estilo");
    expect(severidadDiagnostico(diagnostico({
      codigo: "imagen-estados-excluyentes",
      severidad: "info",
    }))).toBe("estilo");
  });
});

function diagnostico(overrides: Partial<AvisoDiagnostico>): AvisoDiagnostico {
  return {
    id: "d-1",
    origen: "validacion",
    reglaId: "regla",
    codigo: "regla",
    codigoVisible: "regla",
    testIdCodigo: "regla",
    titulo: "Regla",
    severidad: "advertencia",
    mensaje: "Mensaje",
    destino: "Modelo",
    cita: "Fuente",
    citaSSOT: "Fuente",
    avisoNavegable: null,
    ...overrides,
  };
}
