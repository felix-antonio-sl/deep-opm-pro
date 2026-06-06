import { describe, expect, test } from "bun:test";
import type { AvisoMetodologico, CodigoChecker } from "./tipos";
import {
  agruparPorSeveridad,
  clasificarSeveridad,
  resumenSeveridades,
  resumenSeveridadesTexto,
} from "./diagnosticoSeveridad";

const CODIGOS: CodigoChecker[] = [
  "SD_SIN_PROCESO_PRINCIPAL",
  "PROCESO_NOMBRE_FORMA_VERBAL",
  "OBJETO_NOMBRE_SINGULAR",
  "OBJETO_AMBIENTAL_SIN_CONTORNO_DISCONTINUO",
  "INZOOM_CONTENIDO_INSUFICIENTE",
  "INZOOM_NOMBRES_PLACEHOLDER_HIJOS",
  "UNFOLD_CONTENIDO_INSUFICIENTE",
  "PROCESO_NO_TRANSFORMA",
  "PROCESO_SISTEMICO_DESCONECTADO",
  "RECURSO_LINEAL_MULTIPLES_CONSUMIDORES",
  "DESCOMPOSICION_SIN_SUBPROCESOS",
  "DESCOMPOSICION_NO_PRESERVA_FRONTERA",
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
  for (const codigo of CODIGOS) {
    test(`${codigo} se clasifica como mejora metodologica`, () => {
      expect(clasificarSeveridad(aviso(codigo))).toBe("mejora");
    });
  }
});

describe("diagnosticoSeveridad · resumenSeveridades", () => {
  test("cuenta lista vacia", () => {
    expect(resumenSeveridades([])).toEqual({ bloqueos: 0, mejoras: 0, estilo: 0 });
  });

  test("cuenta todos los avisos actuales como mejoras", () => {
    expect(resumenSeveridades(CODIGOS.map(aviso))).toEqual({
      bloqueos: 0,
      mejoras: CODIGOS.length,
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
      "PROCESO_NO_TRANSFORMA",
      "SD_SIN_PROCESO_PRINCIPAL",
      "OBJETO_NOMBRE_SINGULAR",
    ]);
  });

  test("formatea resumen visible del panel", () => {
    expect(resumenSeveridadesTexto({ bloqueos: 0, mejoras: 21, estilo: 0 })).toBe(
      "0 bloqueos estructurales / 21 mejoras metodologicas / 0 sugerencias de estilo",
    );
  });
});
