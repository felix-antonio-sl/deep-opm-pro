import { describe, expect, test } from "bun:test";
import { cambiarEsencia, crearEnlace, crearModelo, crearObjeto, crearProceso, descomponerProceso, desplegarObjeto } from "../../modelo/operaciones";
import { cambiarModoPlegado } from "../../modelo/plegado";
import type { Apariencia, Modelo, Resultado, TipoEnlace } from "../../modelo/tipos";
import { LINK_ASSETS } from "./linkAssets";
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

  test("proyecta agente con marker canonico desde assets SVG", () => {
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
    expect(line?.sourceMarker).toBeNull();
    expect((line?.targetMarker as Attrs | undefined)?.type).toBe("circle");
    expect((line?.targetMarker as Attrs | undefined)?.r).toBe(LINK_ASSETS.procedural.agente.marker.r);
    expect((line?.targetMarker as Attrs | undefined)?.fill).toBe("#586D8C");
    expect((line?.targetMarker as Attrs | undefined)?.cx).toBe(5);
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

    expect((line?.sourceMarker as Attrs | undefined)?.d).toBe(LINK_ASSETS.procedural.efecto.marker.d);
    expect((line?.targetMarker as Attrs | undefined)?.d).toBe(LINK_ASSETS.procedural.efecto.marker.d);
  });

  test("proyecta markers procedimentales restantes desde assets SVG canonicos", () => {
    const casos: Array<{ tipo: TipoEnlace; marker: Attrs }> = [
      { tipo: "instrumento", marker: LINK_ASSETS.procedural.instrumento.marker },
      { tipo: "consumo", marker: LINK_ASSETS.procedural.consumo.marker },
      { tipo: "resultado", marker: LINK_ASSETS.procedural.resultado.marker },
    ];

    for (const caso of casos) {
      const modelo = modeloConEnlace(caso.tipo);
      const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((cell) => cell.type === "standard.Link");
      const line = ((cellEnlace?.attrs as Attrs | undefined)?.line as Attrs | undefined);
      const targetMarker = line?.targetMarker as Attrs | undefined;

      expect(targetMarker?.type).toBe(caso.marker.type);
      if (caso.marker.type === "circle") {
        expect(targetMarker?.r).toBe(caso.marker.r);
      } else if (caso.marker.type === "polygon") {
        expect(targetMarker?.points).toBe(caso.marker.points);
      } else {
        expect(targetMarker?.d).toBe(caso.marker.d);
      }
      expect(targetMarker?.fill).toBe(caso.marker.fill);
      expect(targetMarker?.stroke).toBe(caso.marker.stroke);
    }
  });

  test("proyecta invocacion como rayo zigzag por defecto", () => {
    const modelo = modeloConEnlace("invocacion");
    const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((cell) => cell.type === "standard.Link");

    const vertices = cellEnlace?.vertices as Array<{ x: number; y: number }> | undefined;
    expect(vertices).toHaveLength(3);
    expect(vertices?.[0]?.y).toBe(160);
    expect(vertices?.[1]?.y).toBeGreaterThan(vertices?.[0]?.y ?? 0);
    expect(vertices?.[2]?.y).toBe(vertices?.[1]?.y);
    expect(cellEnlace?.router).toBeUndefined();
    const line = ((cellEnlace?.attrs as Attrs | undefined)?.line as Attrs | undefined);
    expect((line?.sourceMarker as Attrs | undefined)?.points).toBe(LINK_ASSETS.procedural.invocacion.marker.points);
    expect(line?.targetMarker).toBeNull();
  });

  test("proyecta exhibicion como standard.Path con markerPath canonico", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Vehiculo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Color"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Vehiculo"), entidadPorNombre(modelo, "Color"), "exhibicion"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);

    expect(cells.filter((cell) => cell.type === "standard.Link")).toHaveLength(2);
    const marker = cells.find((cell) => cell.type === "standard.Path");
    expect(marker).toBeDefined();
    const body = (marker?.attrs as Attrs | undefined)?.body as Attrs | undefined;
    expect(body?.refD).toBe(LINK_ASSETS.structural.exhibicion.markerPath);
    expect(body?.fillRule).toBe("evenodd");
    expect(body?.fill).toBe("#586D8C");
  });

  test("proyecta generalizacion como triangulo vacio (fill blanco con stroke enlace)", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Animal"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Perro"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Animal"), entidadPorNombre(modelo, "Perro"), "generalizacion"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);

    expect(cells.filter((cell) => cell.type === "standard.Link")).toHaveLength(2);
    const marker = cells.find((cell) => cell.type === "standard.Polygon");
    expect(marker).toBeDefined();
    const body = (marker?.attrs as Attrs | undefined)?.body as Attrs | undefined;
    expect(body?.refPoints).toBe(LINK_ASSETS.structural.generalizacion.markerPoints);
    expect(body?.fill).toBe(LINK_ASSETS.structural.generalizacion.markerFill);
    expect(body?.stroke).toBe("#586D8C");
  });

  test("proyecta clasificacion como triangulo vacio mas dot interno", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Persona"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Juan"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Persona"), entidadPorNombre(modelo, "Juan"), "clasificacion"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);

    expect(cells.filter((cell) => cell.type === "standard.Link")).toHaveLength(2);
    const triangulo = cells.find((cell) => cell.type === "standard.Polygon");
    const dot = cells.find((cell) => cell.type === "standard.Circle");
    expect(triangulo).toBeDefined();
    expect(dot).toBeDefined();
    const triBody = (triangulo?.attrs as Attrs | undefined)?.body as Attrs | undefined;
    expect(triBody?.refPoints).toBe(LINK_ASSETS.structural.clasificacion.markerPoints);
    expect(triBody?.fill).toBe(LINK_ASSETS.structural.clasificacion.markerFill);
    const dotSize = dot?.size as { width?: number; height?: number } | undefined;
    expect(dotSize?.width).toBe(LINK_ASSETS.structural.clasificacion.markerDot.r * 2);
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
    expect(((triangulo?.attrs as Attrs | undefined)?.body as Attrs | undefined)?.refPoints).toBe(LINK_ASSETS.structural.agregacion.markerPoints);
    expect(((triangulo?.attrs as Attrs | undefined)?.body as Attrs | undefined)?.fill).toBe("#586D8C");
    expect(((triangulo?.attrs as Attrs | undefined)?.body as Attrs | undefined)?.strokeWidth).toBe(4);
  });

  test("proyecta proceso descompuesto con contorno grueso", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Proceso"));
    const procesoId = entidadPorNombre(modelo, "Proceso");
    modelo = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId)).modelo;

    const cell = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((item) => item.opm.kind === "entidad");
    expect(((cell?.attrs as Attrs | undefined)?.body as Attrs | undefined)?.strokeWidth).toBe(4);
  });

  test("proyecta contorno de descomposicion detras del contenido interno", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Proceso"));
    const procesoId = entidadPorNombre(modelo, "Proceso");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    modelo = must(crearObjeto(descompuesto.modelo, descompuesto.opdId, { x: 190, y: 170 }, "Entrada"));

    const cells = proyectarModeloAJointCells(modelo, descompuesto.opdId, null, null);
    const contorno = cells.find((item) => item.opm.kind === "entidad" && item.opm.entidadId === procesoId);
    const contenido = cells.find((item) => item.opm.kind === "entidad" && item.opm.entidadId !== procesoId);

    expect(contorno?.z).toBe(0);
    expect(contenido?.z).toBe(10);
  });

  test("proyecta badge de partes en plegado completo", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;

    const cell = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((item) => item.opm.kind === "entidad" && item.opm.entidadId === objetoId);
    const attrs = cell?.attrs as Attrs | undefined;

    expect((attrs?.foldBadge as Attrs | undefined)?.text).toBe("▾");
    expect((cell?.markup as Array<Attrs> | undefined)?.some((item) => item.selector === "foldBadge")).toBe(true);
  });

  test("proyecta plegado parcial como filas internas sin agregar celdas de partes al OPD padre", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;
    const apariencia = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, apariencia.id, "parcial"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);
    const cell = cells.find((item) => item.opm.kind === "entidad" && item.opm.entidadId === objetoId);
    const attrs = cell?.attrs as Attrs | undefined;

    expect(cells.filter((item) => item.opm.kind === "entidad")).toHaveLength(1);
    expect((cell?.size as { height?: number } | undefined)?.height).toBeGreaterThan(60);
    expect((attrs?.partLabel0 as Attrs | undefined)?.text).toBe("Vehiculo parte 1");
    expect((attrs?.partLabel1 as Attrs | undefined)?.text).toBe("Vehiculo parte 2");
    expect((attrs?.partLabel2 as Attrs | undefined)?.text).toBe("Vehiculo parte 3");
    expect((cell?.markup as Array<Attrs> | undefined)?.some((item) => item.selector === "foldBadge")).toBe(false);
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

function modeloConEnlace(tipo: TipoEnlace): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Objeto"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Proceso"));
  const objeto = entidadPorNombre(modelo, "Objeto");
  const proceso = entidadPorNombre(modelo, "Proceso");

  if (tipo === "resultado") {
    return must(crearEnlace(modelo, modelo.opdRaizId, proceso, objeto, tipo));
  }
  if (tipo === "invocacion") {
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 420, y: 130 }, "Proceso 2"));
    return must(crearEnlace(modelo, modelo.opdRaizId, proceso, entidadPorNombre(modelo, "Proceso 2"), tipo));
  }
  return must(crearEnlace(modelo, modelo.opdRaizId, objeto, proceso, tipo));
}

function entidadPorNombre(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  expect(entidad).toBeDefined();
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function aparienciaDeEntidad(modelo: Modelo, opdId: string, entidadId: string): Apariencia {
  const apariencia = Object.values(modelo.opds[opdId]?.apariencias ?? {}).find((item) => item.entidadId === entidadId);
  expect(apariencia).toBeDefined();
  if (!apariencia) throw new Error(`Apariencia no encontrada: ${entidadId}`);
  return apariencia;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
