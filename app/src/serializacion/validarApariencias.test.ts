import { describe, expect, test } from "bun:test";
import type { Entidad } from "../modelo/tipos";
import {
  validarApariencias,
  validarAparienciasEnlace,
  validarModoTamano,
  validarPuertosApariencia,
  validarVertices,
} from "./validarApariencias";

const entidades: Record<string, Entidad> = {
  "e-1": { id: "e-1", tipo: "objeto", nombre: "Sistema", esencia: "fisica", afiliacion: "sistemica" },
};

describe("validarApariencias", () => {
  test("acepta apariencia con modo plegado parcial", () => {
    const resultado = validarApariencias("opd-1", {
      "a-1": { id: "a-1", entidadId: "e-1", opdId: "opd-1", x: 1, y: 2, width: 135, height: 60, modoPlegado: "parcial" },
    }, entidades);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value["a-1"]?.modoPlegado).toBe("parcial");
  });

  test("acepta modoTamano opcional y rechaza valores no canonicos", () => {
    const resultado = validarApariencias("opd-1", {
      "a-1": { id: "a-1", entidadId: "e-1", opdId: "opd-1", x: 1, y: 2, width: 135, height: 60, modoTamano: "manual" },
    }, entidades);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value["a-1"]?.modoTamano).toBe("manual");
    expect(validarModoTamano("a-1", "gigante").ok).toBe(false);
    expect(validarModoTamano("a-1", undefined).ok).toBe(true);
  });

  test("preserva contexto de refinamiento de apariencia", () => {
    const resultado = validarApariencias("opd-1", {
      "a-1": {
        id: "a-1",
        entidadId: "e-1",
        opdId: "opd-1",
        x: 1,
        y: 2,
        width: 135,
        height: 60,
        contextoRefinamiento: {
          tipo: "descomposicion",
          refinableEntidadId: "p-1",
          rol: "externo",
          contenedorAparienciaId: "a-contorno",
          enlacesPadreIds: ["e-padre"],
        },
      },
    }, entidades);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value["a-1"]?.contextoRefinamiento).toEqual({
      tipo: "descomposicion",
      refinableEntidadId: "p-1",
      rol: "externo",
      contenedorAparienciaId: "a-contorno",
      enlacesPadreIds: ["e-padre"],
    });
  });

  test("acepta vertices validos", () => {
    const resultado = validarVertices("ae-1", [{ x: 1, y: 2 }, { x: 3, y: 4 }]);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value).toEqual([{ x: 1, y: 2 }, { x: 3, y: 4 }]);
  });

  test("rechaza vertices invalidos en apariencia de enlace", () => {
    const resultado = validarAparienciasEnlace("opd-1", {
      "ae-1": { id: "ae-1", enlaceId: "l-1", opdId: "opd-1", vertices: [{ x: 1, y: Number.NaN }] },
    });

    expect(resultado.ok).toBe(false);
  });

  // V16-4: labelPositions era declarado por el tipo y consumido por el render, pero la
  // whitelist de import lo descartaba — etiquetas arrastradas se perdian al reimportar.
  test("preserva labelPositions y rechaza malformados", () => {
    const ok = validarAparienciasEnlace("opd-1", {
      "ae-1": {
        id: "ae-1", enlaceId: "l-1", opdId: "opd-1", vertices: [],
        labelPositions: { etiqueta: { distance: 0.18, offset: { x: 4, y: -10 } }, "multiplicidad:destino": { distance: 0.9 } },
      },
    });
    expect(ok.ok).toBe(true);
    if (!ok.ok) return;
    expect(ok.value["ae-1"]?.labelPositions).toEqual({
      etiqueta: { distance: 0.18, offset: { x: 4, y: -10 } },
      "multiplicidad:destino": { distance: 0.9 },
    });

    const mal = validarAparienciasEnlace("opd-1", {
      "ae-1": { id: "ae-1", enlaceId: "l-1", opdId: "opd-1", vertices: [], labelPositions: { etiqueta: { distance: "lejos" } } },
    });
    expect(mal.ok).toBe(false);
  });

  test("preserva puertos dinamicos OPCloud-style y valida rango relativo", () => {
    const resultado = validarApariencias("opd-1", {
      "a-1": {
        id: "a-1",
        entidadId: "e-1",
        opdId: "opd-1",
        x: 1,
        y: 2,
        width: 135,
        height: 60,
        ports: {
          "port-e-1-origen": { x: 1, y: 0.5 },
        },
      },
    }, entidades);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value["a-1"]?.ports).toEqual({
      "port-e-1-origen": { x: 1, y: 0.5 },
    });
    expect(validarPuertosApariencia("a-1", { "p-1": { x: 1.2, y: 0.5 } }).ok).toBe(false);
  });
});
