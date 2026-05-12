import { describe, expect, test } from "bun:test";
import type { Apariencia, Enlace } from "../../../modelo/tipos";
import { LINK_ASSETS } from "../linkAssets";
import { connectorJumpover, etiquetasMultiplicidad, proyectarEnlace, routerManhattan, verticesInvocacion } from "./enlace";

describe("composer enlace", () => {
  test("proyecta enlace con multiplicidad, estilo y metadata OPM", () => {
    const enlace: Enlace = {
      id: "en-1",
      tipo: "consumo",
      origenId: { kind: "entidad", id: "origen" },
      destinoId: { kind: "entidad", id: "destino" },
      etiqueta: "",
      multiplicidadOrigen: "1..N",
      estilo: { color: "#3BC3FF", strokeWidth: 3, dashArray: "2 2" },
    };

    const cell = proyectarEnlace("opd-1", enlace, "ae-1", { apariencia: origen }, { apariencia: destino }, [{ x: 50, y: 60 }], true);
    const line = (cell.attrs as Record<string, Record<string, unknown>>).line;
    if (!line) throw new Error("Linea no encontrada");

    expect(cell.id).toBe("ae-1");
    expect(cell.vertices).toEqual([{ x: 50, y: 60 }]);
    expect(line.stroke).toBe("#3BC3FF");
    expect(line.strokeDasharray).toBe("2 2");
    expect(line.targetMarker).toEqual(LINK_ASSETS.procedural.consumo.marker);
    expect(cell.opm).toMatchObject({ kind: "enlace", enlaceId: "en-1", aparienciaEnlaceId: "ae-1", tipo: "consumo" });
    // Ronda 15 L4: enlaces procedurales con routerManhattan deben usar
    // jumpover para que cruces se dibujen como puentes.
    expect(cell.connector).toEqual({ name: "jumpover", args: { type: "arc", size: 8 } });
  });

  test("invocacion conserva connector jumpover (vertices manuales en zigzag)", () => {
    // Post-OPCloud-replica: connector jumpover GLOBAL (excepto en abanico).
    const enlaceInvocacion: Enlace = {
      id: "en-inv",
      tipo: "invocacion",
      origenId: { kind: "entidad", id: "origen" },
      destinoId: { kind: "entidad", id: "destino" },
      etiqueta: "",
    };
    const cell = proyectarEnlace("opd-1", enlaceInvocacion, "ae-inv", { apariencia: origen }, { apariencia: destino }, [], false);
    expect(cell.router).toBeUndefined();
    expect(cell.connector).toEqual({ name: "jumpover", args: { type: "arc", size: 8 } });
  });

  test("enlace en abanico mantiene connector straight (dock-point explicito)", () => {
    const cell = proyectarEnlace("opd-1", enlaceBase, "ae-aba", { apariencia: origen }, { apariencia: destino }, [], false, true);
    expect(cell.router).toBeUndefined();
    expect(cell.connector).toEqual({ name: "straight" });
  });

  test("mantiene helpers de labels, router e invocacion", () => {
    // OPCloud canon: distancia 0.9 para multiplicidad destino (fraccion path).
    expect(etiquetasMultiplicidad({ ...enlaceBase, multiplicidadDestino: "0..N" })[0]?.position).toMatchObject({ distance: 0.9, offset: -12 });
    expect(routerManhattan()).toEqual({ name: "manhattan", args: { padding: 5, step: 11 } });
    expect(connectorJumpover()).toEqual({ name: "jumpover", args: { type: "arc", size: 8 } });
    expect(verticesInvocacion(origen, destino)).toHaveLength(3);
  });
});

const origen: Apariencia = {
  id: "ap-origen",
  entidadId: "origen",
  opdId: "opd-1",
  x: 20,
  y: 30,
  width: 135,
  height: 60,
};

const destino: Apariencia = {
  id: "ap-destino",
  entidadId: "destino",
  opdId: "opd-1",
  x: 220,
  y: 130,
  width: 135,
  height: 60,
};

const enlaceBase: Enlace = {
  id: "en-1",
  tipo: "resultado",
  origenId: { kind: "entidad", id: "origen" },
  destinoId: { kind: "entidad", id: "destino" },
  etiqueta: "",
};
