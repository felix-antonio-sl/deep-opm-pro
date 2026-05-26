// Ronda Codex v1 · L4 — lógica de CodexSelectionAnnotation.
//
// Sin DOM-render library: la barra emergente vive en un portal y depende de
// hooks + paper JointJS, así que se prueban los helpers puros que deciden marca,
// acciones, metaline y posicionamiento (ui-forja 02 §5). testIds estables y la
// presencia visual del overlay se cubren en e2e.
import { describe, expect, test } from "bun:test";
import {
  accionesDeContexto,
  marcaDeContexto,
  metaDeContexto,
  posicionarAnotacion,
} from "./CodexSelectionAnnotation";
import type { ContextoBarraSeleccion } from "../BarraHerramientasElemento";
import { GLIFO_REF, GLIFO_SEP } from "./glifos";
import type { Entidad, Enlace } from "../../modelo/tipos";

const objeto: Entidad = {
  id: "o.06",
  tipo: "objeto",
  nombre: "Beneficiario",
  esencia: "informacional",
  afiliacion: "sistemica",
};

const enlace: Enlace = {
  id: "e.01",
  tipo: "consumo",
  origenId: { kind: "entidad", id: "o.06" },
  destinoId: { kind: "entidad", id: "p.01" },
} as unknown as Enlace;

const ctxEntidad: ContextoBarraSeleccion = {
  tipo: "entidad",
  entidad: objeto,
  nombre: objeto.nombre,
  anchorCellIds: ["ap-1"],
  enlaceEstiloId: null,
};

const ctxMulti: ContextoBarraSeleccion = {
  tipo: "multi",
  cantidad: 3,
  nombre: "3 seleccionadas",
  anchorCellIds: ["ap-1", "ap-2", "ap-3"],
  enlaceEstiloId: null,
};

const ctxEnlace: ContextoBarraSeleccion = {
  tipo: "enlace",
  enlace,
  nombre: "enlace consumo",
  anchorCellIds: ["ae-1"],
  enlaceEstiloId: "e.01",
};

describe("CodexSelectionAnnotation · marca", () => {
  test("selección única usa el glifo de referencia ※ (no dígito)", () => {
    const { marca, marcaGrande } = marcaDeContexto(ctxEntidad);
    expect(marca).toBe(GLIFO_REF);
    expect(marcaGrande).toBe(false);
  });

  test("multi-selección usa el dígito grande con la cantidad", () => {
    const { marca, marcaGrande } = marcaDeContexto(ctxMulti);
    expect(marca).toBe("3");
    expect(marcaGrande).toBe(true);
  });
});

describe("CodexSelectionAnnotation · acciones", () => {
  test("objeto: primaria descomponer + acciones de objeto, inspector incluido", () => {
    const acciones = accionesDeContexto(ctxEntidad);
    const labels = acciones.map((a) => a.label);
    expect(labels).toContain("descomponer");
    expect(labels).toContain("estado");
    expect(labels).toContain("inspector");
    expect(acciones.find((a) => a.label === "descomponer")?.primary).toBe(true);
  });

  test("multi: incluye eliminar marcada como destructiva", () => {
    const acciones = accionesDeContexto(ctxMulti);
    const eliminar = acciones.find((a) => a.label === "eliminar");
    expect(eliminar?.danger).toBe(true);
  });

  test("enlace: muestra tipo (primaria) y estilo, sin acción de estado", () => {
    const labels = accionesDeContexto(ctxEnlace).map((a) => a.label);
    expect(labels).toContain("tipo");
    expect(labels).toContain("estilo");
    expect(labels).not.toContain("estado");
  });
});

describe("CodexSelectionAnnotation · metaline", () => {
  test("entidad: nombre · tipo · esencia · afiliación localizada", () => {
    expect(metaDeContexto(ctxEntidad)).toBe(
      `Beneficiario ${GLIFO_SEP} objeto ${GLIFO_SEP} informacional ${GLIFO_SEP} sistémico`,
    );
  });

  test("multi: refleja la cantidad seleccionada", () => {
    expect(metaDeContexto(ctxMulti)).toContain("3 cosas");
  });
});

describe("CodexSelectionAnnotation · posicionamiento", () => {
  test("debajo del bbox cuando hay espacio (placement abajo, centrado)", () => {
    const pos = posicionarAnotacion({ x: 100, y: 100, width: 80, height: 40 }, 600);
    expect(pos.placement).toBe("abajo");
    expect(pos.left).toBe(140); // 100 + 80/2
    expect(pos.top).toBe(150); // 100 + 40 + OFFSET(10)
  });

  test("arriba del bbox cuando no cabe debajo (cerca del borde inferior)", () => {
    const pos = posicionarAnotacion({ x: 100, y: 540, width: 80, height: 40 }, 600);
    expect(pos.placement).toBe("arriba");
    expect(pos.top).toBeLessThan(540);
  });

  test("BUG-f81da4: clampa el centro horizontal para que la anotación no salga ni colisione en viewport angosto", () => {
    const pos = posicionarAnotacion(
      { x: 8, y: 100, width: 40, height: 40 },
      600,
      { anchoCanvas: 320, anchoEstimado: 300 },
    );
    expect(pos.left).toBeGreaterThanOrEqual(158);
    expect(pos.left).toBeLessThanOrEqual(162);
  });
});
