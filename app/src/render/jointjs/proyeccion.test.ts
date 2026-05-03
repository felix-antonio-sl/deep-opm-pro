import { describe, expect, test } from "bun:test";
import { cambiarEsencia, crearEnlace, crearModelo, crearObjeto, crearProceso } from "../../modelo/operaciones";
import type { Modelo, Resultado } from "../../modelo/tipos";
import { proyectarModeloAJointCells } from "./proyeccion";

describe("proyeccion JointJS", () => {
  test("proyecta apariencias como ids de celdas y mantiene metadata OPM", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Driver"));
    const entidad = Object.values(modelo.entidades)[0];
    expect(entidad).toBeDefined();
    if (!entidad) return;

    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    expect(apariencia).toBeDefined();
    if (!apariencia) return;

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, entidad.id, null);
    expect(cells).toHaveLength(1);
    expect(cells[0]?.id).toBe(apariencia.id);
    expect(cells[0]?.type).toBe("standard.Rectangle");
    expect(cells[0]?.opm).toEqual({
      kind: "entidad",
      opdId: modelo.opdRaizId,
      entidadId: entidad.id,
      aparienciaId: apariencia.id,
    });
    expect(((cells[0]?.attrs as Attrs | undefined)?.label as Attrs | undefined)?.textWrap).toEqual({ width: -12 });
  });

  test("proyecta habilitadores con piruleta en el proceso y corchete en origen", () => {
    const modelo = modeloConAgente();
    const enlace = Object.values(modelo.enlaces)[0];
    const aparienciaEnlace = Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0];
    expect(enlace).toBeDefined();
    expect(aparienciaEnlace).toBeDefined();
    if (!enlace || !aparienciaEnlace) return;

    const aparienciaPorEntidad = new Map(
      Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).map((apariencia) => [
        apariencia.entidadId,
        apariencia.id,
      ]),
    );

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);
    const cellEnlace = cells.find((cell) => cell.id === aparienciaEnlace.id);
    expect(cellEnlace?.type).toBe("standard.Link");
    expect((cellEnlace?.source as { id?: string } | undefined)?.id).toBe(aparienciaPorEntidad.get(enlace.origenId));
    expect((cellEnlace?.target as { id?: string } | undefined)?.id).toBe(aparienciaPorEntidad.get(enlace.destinoId));
    const line = ((cellEnlace?.attrs as Attrs | undefined)?.line as Attrs | undefined);
    expect((line?.sourceMarker as Attrs | undefined)?.d).toContain("L 0 -8");
    expect((line?.targetMarker as Attrs | undefined)?.type).toBe("circle");
    expect((line?.targetMarker as Attrs | undefined)?.fill).toBe("#586D8C");
    expect(cellEnlace?.opm).toMatchObject({
      kind: "enlace",
      enlaceId: enlace.id,
      aparienciaEnlaceId: aparienciaEnlace.id,
      tipo: "agente",
    });
  });

  test("proyecta efecto como enlace bidireccional", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Objeto"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Proceso"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Objeto"), entidadPorNombre(modelo, "Proceso"), "efecto"));

    const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((cell) => cell.type === "standard.Link");
    const line = ((cellEnlace?.attrs as Attrs | undefined)?.line as Attrs | undefined);

    expect((line?.sourceMarker as Attrs | undefined)?.d).toBe("M 10 -5 0 0 10 5 z");
    expect((line?.targetMarker as Attrs | undefined)?.d).toBe("M 10 -5 0 0 10 5 z");
  });

  test("proyecta agregacion con triangulo estructural separado", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Whole"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Part"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Whole"), entidadPorNombre(modelo, "Part"), "agregacion"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, Object.values(modelo.enlaces)[0]?.id ?? null);

    expect(cells.filter((cell) => cell.type === "standard.Link")).toHaveLength(2);
    const triangulo = cells.find((cell) => cell.type === "standard.Polygon");
    expect(triangulo).toBeDefined();
    expect(((triangulo?.attrs as Attrs | undefined)?.body as Attrs | undefined)?.refPoints).toBe("0,15 30,0 30,30");
    expect(((triangulo?.attrs as Attrs | undefined)?.body as Attrs | undefined)?.strokeWidth).toBe(4);
  });
});

type Attrs = Record<string, unknown>;

function modeloConAgente(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Driver"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Driver Rescuing"));
  const driver = entidadPorNombre(modelo, "Driver");
  const rescate = entidadPorNombre(modelo, "Driver Rescuing");
  modelo = must(cambiarEsencia(modelo, driver, "fisica"));
  return must(crearEnlace(modelo, modelo.opdRaizId, driver, rescate, "agente"));
}

function entidadPorNombre(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  expect(entidad).toBeDefined();
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
