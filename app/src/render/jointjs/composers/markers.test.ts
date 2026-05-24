import { describe, expect, test } from "bun:test";
import type { TipoEnlace } from "../../../modelo/tipos";
import { LINK_ASSETS } from "../linkAssets";
import { etiquetaBadgeModificadorCanonico, marcadorDestino, marcadoresEstructurales, marcadorFuente, markerAttrs, textoSubtipoModificador } from "./markers";

// Tipos estructurales: su marker lo emite `marcadoresEstructurales` (triangulo
// fill / triangulo outline / triangulo+dot), no source/target del link.
const ESTRUCTURALES: TipoEnlace[] = ["agregacion", "exhibicion", "generalizacion", "clasificacion"];
const TODOS_LOS_TIPOS: TipoEnlace[] = [
  "agregacion", "exhibicion", "generalizacion", "clasificacion",
  "etiquetado", "etiquetadoBidireccional", "agente", "instrumento",
  "consumo", "resultado", "efecto", "invocacion",
  "excepcionSobretiempo", "excepcionSubtiempo", "excepcionSubSobretiempo",
];

describe("composer markers", () => {
  test("ui-forja/08 §4.2: las 8 familias canonicas de marker estan resueltas desde assets", () => {
    // 1. Procedimental (arrow swallowtail): consumo/resultado/efecto.
    expect(marcadorDestino("consumo")?.d).toBe("M0,0 L10,-5 L6,0 L10,5 z");
    expect(marcadorDestino("resultado")?.d).toBe("M0,0 L10,-5 L6,0 L10,5 z");
    // 2. Agente (lollipop lleno) — circulo ink fill.
    expect(marcadorDestino("agente")?.fill).toBe("#171511");
    // 3. Instrumento (lollipop hueco) — circulo outline fill paper.
    expect(marcadorDestino("instrumento")?.fill).toBe("#fafaf8");
    // 4. Invocacion (rombo) — distinta del swallowtail.
    expect(marcadorDestino("invocacion")?.d).toBe("M0,0 L5,5 L10,0 L5,-5 z");
    // 5. Agregacion (triangulo fill ink).
    // 6. Generalizacion (triangulo outline).
    // 7. Clasificacion/instanciacion (triangulo + dot).
    // 8. Exhibicion (triangulo contorno + inner) — todos via marcadoresEstructurales.
    for (const tipo of ESTRUCTURALES) {
      const cells = marcadoresEstructurales(tipo, "t1", { x: 0, y: 0 }, 30, false, { kind: "enlace", rolEstructural: "simbolo" } as never);
      expect(cells.length).toBeGreaterThanOrEqual(1);
      const primero = cells[0];
      if (!primero) throw new Error(`Sin marker estructural para ${tipo}`);
      const body = (primero.attrs as Record<string, Record<string, unknown>>).body;
      expect(body?.stroke).toBe("#171511");
    }
  });

  test("ui-forja/08 §4.2: cobertura total — todo TipoEnlace resuelve marker o es estructural", () => {
    for (const tipo of TODOS_LOS_TIPOS) {
      if (ESTRUCTURALES.includes(tipo)) {
        const cells = marcadoresEstructurales(tipo, "t1", { x: 0, y: 0 }, 30, false, { kind: "enlace", rolEstructural: "simbolo" } as never);
        expect(cells.length).toBeGreaterThanOrEqual(1);
        continue;
      }
      const resuelto = marcadorDestino(tipo) ?? marcadorFuente(tipo);
      expect(resuelto, `marker faltante para ${tipo}`).not.toBeNull();
    }
  });

  test("resuelve markers procedimentales desde assets canonicos", () => {
    expect(marcadorDestino("agente")).toEqual(LINK_ASSETS.procedural.agente.marker);
    expect(marcadorDestino("instrumento")).toEqual(LINK_ASSETS.procedural.instrumento.marker);
    expect(marcadorFuente("efecto")).toEqual(LINK_ASSETS.procedural.efecto.marker);
    expect(marcadorDestino("invocacion")).toEqual(LINK_ASSETS.procedural.invocacion.marker);
    expect(marcadorFuente("invocacion")).toBeNull();
  });

  test("clona attrs de marker sin mutar el asset base", () => {
    const marker = markerAttrs(LINK_ASSETS.procedural.consumo.marker);
    expect(marker).toEqual(LINK_ASSETS.procedural.consumo.marker);
    expect(marker).not.toBe(LINK_ASSETS.procedural.consumo.marker);
  });

  test("pinta markers canonicos con ink/paper Codex y hairline", () => {
    expect(LINK_ASSETS.procedural.consumo.marker).toMatchObject({
      fill: "#171511",
      stroke: "#171511",
      strokeWidth: 1,
    });
    expect(LINK_ASSETS.procedural.instrumento.marker).toMatchObject({
      fill: "#fafaf8",
      stroke: "#171511",
      strokeWidth: 1,
    });
    expect(LINK_ASSETS.procedural.invocacion.marker).toMatchObject({
      fill: "#fafaf8",
      stroke: "#171511",
      strokeWidth: 1,
    });
    expect(LINK_ASSETS.structural.generalizacion.markerFill).toBe("#fafaf8");
  });

  test("consumo/resultado/efecto comparten silueta swallowtail canonica OPM (no triangulo simple)", () => {
    // Restauracion 2026-05-23: silueta swallowtail = arrowhead con V-notch
    // interno hacia atras (cola hendida tipo cola-de-golondrina). El "L6,0"
    // entre las dos alas (L10,-5 y L10,5) introduce la hendidura. Un
    // triangulo simple llenaria directo L10,5 -> L10,-5 sin pasar por L6,0.
    const swallowtail = "M0,0 L10,-5 L6,0 L10,5 z";
    expect(LINK_ASSETS.procedural.consumo.marker.d).toBe(swallowtail);
    expect(LINK_ASSETS.procedural.resultado.marker.d).toBe(swallowtail);
    expect(LINK_ASSETS.procedural.efecto.marker.d).toBe(swallowtail);
    // El swallowtail debe distinguirse claramente de las otras siluetas
    // canonicas: lollipop (agente/instrumento), rombo (invocacion).
    expect(LINK_ASSETS.procedural.agente.marker.d).not.toBe(swallowtail);
    expect(LINK_ASSETS.procedural.instrumento.marker.d).not.toBe(swallowtail);
    expect(LINK_ASSETS.procedural.invocacion.marker.d).not.toBe(swallowtail);
  });

  test("resuelve badges canonicos c/e/no desde subtipo o modificador base", () => {
    // SSOT §4.1/§4.2: marca canonica `c`/`e` MINUSCULA, `no` -> `¬`.
    expect(textoSubtipoModificador({ id: "e1", tipo: "consumo", origenId: { kind: "entidad", id: "o1" }, destinoId: { kind: "entidad", id: "p1" }, etiqueta: "", modificador: "condicion" })).toBe("c");
    expect(textoSubtipoModificador({ id: "e2", tipo: "consumo", origenId: { kind: "entidad", id: "o1" }, destinoId: { kind: "entidad", id: "p1" }, etiqueta: "", modificador: "evento", subtipoModificador: "E" })).toBe("e");
    expect(textoSubtipoModificador({ id: "e3", tipo: "consumo", origenId: { kind: "entidad", id: "o1" }, destinoId: { kind: "entidad", id: "p1" }, etiqueta: "", modificador: "no" })).toBe("¬");
    const badge = etiquetaBadgeModificadorCanonico("c", 0);
    expect(badge).toMatchObject({ attrs: { label: { text: "c" } }, position: { distance: 0, offset: -20 } });
    expect(badge).toMatchObject({
      attrs: {
        badge: { fill: "#fafaf8", stroke: "#171511", strokeWidth: 1 },
        label: { fill: "#171511", fontFamily: "Inria Serif, Georgia, serif", fontWeight: 400 },
      },
    });
  });
});
