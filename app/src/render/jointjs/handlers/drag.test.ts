import { describe, expect, test } from "bun:test";
import type { dia } from "jointjs";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../../../modelo/operaciones";
import type { ExtremoEnlace, Modelo } from "../../../modelo/tipos";
import { persistirReanclajeArrowhead } from "./drag";

describe("handlers/drag reanclaje", () => {
  test("persistirReanclajeArrowhead conserva el port de JointJS al reanclar", () => {
    const modelo = modeloConEnlace();
    const enlace = Object.values(modelo.enlaces)[0]!;
    const origen = aparienciaPorEntidad(modelo, enlace.origenId.id);
    const llamados: Array<{ enlaceId: string; lado: "origen" | "destino"; extremo: ExtremoEnlace }> = [];

    persistirReanclajeArrowhead(
      fakeLinkCell(enlace.id, { id: origen.id, port: "port-manual-n" }),
      "origen",
      modelo,
      modelo.opdRaizId,
      (enlaceId, lado, extremo) => llamados.push({ enlaceId, lado, extremo }),
    );

    expect(llamados).toEqual([{
      enlaceId: enlace.id,
      lado: "origen",
      extremo: { kind: "entidad", id: enlace.origenId.id, portId: "port-manual-n" },
    }]);
  });

  test("persistirReanclajeArrowhead no ignora cambios de port en la misma entidad", () => {
    let modelo = modeloConEnlace();
    const enlace = Object.values(modelo.enlaces)[0]!;
    modelo = {
      ...modelo,
      enlaces: {
        ...modelo.enlaces,
        [enlace.id]: { ...enlace, origenId: { ...enlace.origenId, portId: "port-previo" } },
      },
    };
    const origen = aparienciaPorEntidad(modelo, enlace.origenId.id);
    let llamado: ExtremoEnlace | undefined;

    persistirReanclajeArrowhead(
      fakeLinkCell(enlace.id, { id: origen.id, port: "port-nuevo" }),
      "origen",
      modelo,
      modelo.opdRaizId,
      (_enlaceId, _lado, extremo) => {
        llamado = extremo;
      },
    );

    const esperado: ExtremoEnlace = { kind: "entidad", id: enlace.origenId.id, portId: "port-nuevo" };
    expect(llamado).toEqual(esperado);
  });
});

function modeloConEnlace(): Modelo {
  let modelo = crearModelo("Drag reanchor");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 40 }, "Entrada"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 240, y: 80 }, "Procesar"));
  const entrada = entidad(modelo, "Entrada");
  const procesar = entidad(modelo, "Procesar");
  return must(crearEnlace(modelo, modelo.opdRaizId, entrada, procesar, "consumo"));
}

function fakeLinkCell(enlaceId: string, extremo: { id: string; port?: string }): dia.Cell {
  return {
    isLink: () => true,
    source: () => extremo,
    target: () => extremo,
    prop: (key: string) => key === "opm" ? {
      kind: "enlace",
      enlaceId,
      aparienciaEnlaceId: "ae-test",
      opdId: "opd-test",
    } : undefined,
  } as unknown as dia.Cell;
}

function aparienciaPorEntidad(modelo: Modelo, entidadId: string) {
  const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})
    .find((item) => item.entidadId === entidadId);
  if (!apariencia) throw new Error(`Apariencia no encontrada: ${entidadId}`);
  return apariencia;
}

function entidad(modelo: Modelo, nombre: string): string {
  const encontrada = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!encontrada) throw new Error(`Entidad no encontrada: ${nombre}`);
  return encontrada.id;
}

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
