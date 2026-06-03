import { describe, expect, test } from "bun:test";
import type { Apariencia, Enlace } from "../../../modelo/tipos";
import { LINK_ASSETS } from "../linkAssets";
import { connectorJumpover, connectorRecto, endpointJoint, etiquetasModificador, etiquetasMultiplicidad, proyectarEnlace, routerManhattan, verticesInvocacion } from "./enlace";

describe("composer enlace", () => {
  test("proyecta enlace con multiplicidad y metadata OPM", () => {
    const enlace: Enlace = {
      id: "en-1",
      tipo: "consumo",
      origenId: { kind: "entidad", id: "origen" },
      destinoId: { kind: "entidad", id: "destino" },
      etiqueta: "",
      multiplicidadOrigen: "1..N",
    };

    const cell = proyectarEnlace("opd-1", enlace, "ae-1", { apariencia: origen }, { apariencia: destino }, [{ x: 50, y: 60 }], undefined, true);
    const line = (cell.attrs as Record<string, Record<string, unknown>>).line;
    if (!line) throw new Error("Linea no encontrada");

    expect(cell.id).toBe("ae-1");
    expect(cell.vertices).toEqual([{ x: 50, y: 60 }]);
    expect(line.stroke).toBe("#171511");
    expect(line.strokeWidth).toBe(3);
    expect(line.strokeDasharray).toBeUndefined();
    expect(line.targetMarker).toEqual(LINK_ASSETS.procedural.consumo.marker);
    expect(cell.opm).toMatchObject({ kind: "enlace", enlaceId: "en-1", aparienciaEnlaceId: "ae-1", tipo: "consumo" });
    expect(cell.z).toBeLessThan(10);
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
    const cell = proyectarEnlace("opd-1", enlaceInvocacion, "ae-inv", { apariencia: origen }, { apariencia: destino }, [], undefined, false);
    expect(cell.router).toBeUndefined();
    expect(cell.connector).toEqual({ name: "jumpover", args: { type: "arc", size: 8 } });
  });

  test("invocacion calcula zigzag desde puertos para no tapar la flecha en procesos apilados", () => {
    const sourceEndpoint = {
      apariencia: {
        ...origen,
        x: 285,
        y: 190,
        ports: { out: { x: 0.5, y: 1 } },
      },
      portId: "out",
    };
    const targetEndpoint = {
      apariencia: {
        ...destino,
        x: 285,
        y: 280,
        ports: { in: { x: 0.5, y: 0 } },
      },
      portId: "in",
    };

    const vertices = verticesInvocacion(sourceEndpoint, targetEndpoint);

    expect(vertices).toHaveLength(2);
    expect(vertices[0]?.y).toBeGreaterThan(250);
    expect(vertices[1]?.y).toBeLessThan(280);
  });

  test("invocacion no agrega quiebre de retorno cerca del destino", () => {
    const sourceEndpoint = {
      apariencia: {
        ...origen,
        x: 285,
        y: 190,
        ports: { out: { x: 0.5, y: 1 } },
      },
      portId: "out",
    };
    const targetEndpoint = {
      apariencia: {
        ...destino,
        x: 285,
        y: 280,
        ports: { in: { x: 0.5, y: 0 } },
      },
      portId: "in",
    };

    const vertices = verticesInvocacion(sourceEndpoint, targetEndpoint);
    const ultimo = vertices.at(-1);
    const ejeX = 285 + origen.width / 2;

    expect(vertices).toHaveLength(2);
    expect(Math.abs((ultimo?.x ?? 0) - ejeX)).toBeGreaterThan(1);
  });

  test("enlace en abanico mantiene connector straight (dock-point explicito)", () => {
    const cell = proyectarEnlace("opd-1", enlaceBase, "ae-aba", { apariencia: origen }, { apariencia: destino }, [], undefined, false, true);
    expect(cell.router).toBeUndefined();
    expect(cell.connector).toEqual({ name: "straight" });
  });

  test("probabilidad de rama XOR se proyecta sin requerir modificador evento", () => {
    const labels = etiquetasModificador({ ...enlaceBase, probabilidad: 0.35 });
    const textos = labels
      .map((label) => label.attrs as Record<string, Record<string, unknown>> | undefined)
      .map((attrs) => attrs?.label?.text);

    expect(textos).toContain("35%");
  });

  test("modelo denso puede desactivar jumpover para evitar ruido visual", () => {
    const cell = proyectarEnlace("opd-1", enlaceBase, "ae-denso", { apariencia: origen }, { apariencia: destino }, [], undefined, false, false, { usarJumpover: false });
    expect(cell.connector).toEqual({ name: "straight" });
  });

  test("mantiene helpers de labels, router e invocacion", () => {
    // OPCloud canon: distancia 0.9 para multiplicidad destino (fraccion path).
    expect(etiquetasMultiplicidad({ ...enlaceBase, multiplicidadDestino: "0..N" })[0]?.position).toMatchObject({ distance: 0.9, offset: -12 });
    expect(routerManhattan()).toEqual({ name: "manhattan", args: { padding: 5, step: 11 } });
    expect(connectorJumpover()).toEqual({ name: "jumpover", args: { type: "arc", size: 8 } });
    expect(connectorRecto()).toEqual({ name: "straight" });
    expect(verticesInvocacion(origen, destino)).toHaveLength(2);
  });

  test("endpointJoint conecta a port dinamico cuando existe", () => {
    const endpoint = endpointJoint({
      apariencia: { ...origen, id: "ap-1" },
      portId: "port-e-1-origen",
    });
    expect(endpoint).toEqual({
      id: "ap-1",
      port: "port-e-1-origen",
      connectionPoint: { name: "anchor" },
    });
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
