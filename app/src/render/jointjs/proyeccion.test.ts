import { describe, expect, test } from "bun:test";
import { ajustarMultiplicidad, cambiarEsencia, crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, designarEstadoFinal, designarEstadoInicial, descomponerProceso, desplegarObjeto, estadosDeEntidad, renombrarEstado } from "../../modelo/operaciones";
import { cambiarModoPlegado, extraerParteDePlegado, reinsertarParteEnPlegado } from "../../modelo/plegado";
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
      rol: "interno",
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

  test("proyecta etiquetas de multiplicidad cerca de origen y destino", () => {
    let modelo = modeloConEnlace("consumo");
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    expect(enlaceId).toBeDefined();
    if (!enlaceId) return;
    modelo = must(ajustarMultiplicidad(modelo, enlaceId, "origen", "2"));
    modelo = must(ajustarMultiplicidad(modelo, enlaceId, "destino", "1..N"));

    const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((cell) => cell.type === "standard.Link");
    const labels = cellEnlace?.labels as Array<{ attrs?: Attrs; position?: { distance?: number; offset?: number; args?: { keepGradient?: boolean } } }> | undefined;

    expect(labels).toHaveLength(2);
    expect(labels?.[0]?.attrs?.label).toMatchObject({ text: "2", fontFamily: "Arial", fontSize: 12, fill: "#1f2937" });
    expect(labels?.[0]?.position).toMatchObject({ distance: 18, offset: -12 });
    expect(labels?.[0]?.position?.args?.keepGradient).toBe(false);
    expect(labels?.[1]?.attrs?.label).toMatchObject({ text: "1..N", fontFamily: "Arial", fontSize: 12, fill: "#1f2937" });
    expect(labels?.[1]?.position).toMatchObject({ distance: -18, offset: -12 });
    expect(labels?.[1]?.position?.args?.keepGradient).toBe(false);
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

  test("proyecta exhibicion como triangulos anidados (grande lleno + medio vacio + pequeno lleno)", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Vehiculo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Color"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Vehiculo"), entidadPorNombre(modelo, "Color"), "exhibicion"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);

    expect(cells.filter((cell) => cell.type === "standard.Link")).toHaveLength(2);
    const polygons = cells.filter((cell) => cell.type === "standard.Polygon");
    expect(polygons).toHaveLength(3);

    const grande = polygons.find((cell) => !String(cell.id).endsWith("-medio") && !String(cell.id).endsWith("-pequeno"));
    const medio = polygons.find((cell) => String(cell.id).endsWith("-medio"));
    const pequeno = polygons.find((cell) => String(cell.id).endsWith("-pequeno"));
    expect(grande).toBeDefined();
    expect(medio).toBeDefined();
    expect(pequeno).toBeDefined();

    expect(((grande?.attrs as Attrs)?.body as Attrs).fill).toBe("#586D8C");
    expect(((medio?.attrs as Attrs)?.body as Attrs).fill).toBe("white");
    expect(((pequeno?.attrs as Attrs)?.body as Attrs).fill).toBe("#586D8C");
    // Stack: grande detras, pequeno adelante.
    expect(grande?.z).toBeLessThan(medio?.z ?? 0);
    expect((medio?.z ?? 0)).toBeLessThan(pequeno?.z ?? 0);
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

  test("proyecta estados de objeto como capsulas internas inferiores", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Pedido"));
    const objetoId = entidadPorNombre(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, objetoId)).modelo;
    const [primero, segundo] = estadosDeEntidad(modelo, objetoId);
    if (!primero || !segundo) throw new Error("La prueba esperaba dos estados");
    modelo = must(renombrarEstado(modelo, primero.id, "pendiente"));
    modelo = must(renombrarEstado(modelo, segundo.id, "cerrado"));
    modelo = must(designarEstadoInicial(modelo, primero.id));
    modelo = must(designarEstadoFinal(modelo, segundo.id));

    const cell = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((item) => item.opm.kind === "entidad" && item.opm.entidadId === objetoId);
    const attrs = cell?.attrs as Attrs | undefined;

    expect((cell?.size as { height?: number } | undefined)?.height).toBe(94);
    expect((cell?.markup as Array<Attrs> | undefined)?.filter((item) => String(item.selector).startsWith("stateCapsule"))).toHaveLength(2);
    expect(attrs?.stateCapsule0).toMatchObject({ height: 24, rx: 8, fill: "#fdffff", stroke: "#586D8C", strokeWidth: 3 });
    expect(attrs?.stateCapsule1).toMatchObject({ height: 24, rx: 8, fill: "#eef8ff", stroke: "#586D8C", strokeWidth: 1 });
    expect((attrs?.stateCapsule0 as Attrs | undefined)?.y).toBe(64);
    expect((attrs?.stateLabel0 as Attrs | undefined)?.text).toBe("pendiente");
    expect((attrs?.stateLabel1 as Attrs | undefined)?.text).toBe("cerrado");
  });

  test("plegado parcial oculta capsulas de estado y conserva filas de partes", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(crearEstadosIniciales(modelo, objetoId)).modelo;
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;
    const apariencia = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, apariencia.id, "parcial"));

    const cell = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((item) => item.opm.kind === "entidad" && item.opm.entidadId === objetoId);
    const markup = cell?.markup as Array<Attrs> | undefined;
    const attrs = cell?.attrs as Attrs | undefined;

    expect(markup?.some((item) => String(item.selector).startsWith("stateCapsule"))).toBe(false);
    expect((attrs?.partLabel0 as Attrs | undefined)?.text).toBe("Vehiculo parte 1");
  });

  test("proyecta parte extraida con proxy punteado, marca visual y contador", () => {
    let modelo = modeloConVehiculoDesplegado();
    modelo = agregarPartes(modelo, 2);
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    const padre = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, padre.id, "parcial"));
    modelo = must(extraerParteDePlegado(modelo, modelo.opdRaizId, padre.id, entidadPorNombre(modelo, "Vehiculo parte 1")));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);
    const padreCell = cells.find((item) => item.opm.kind === "entidad" && item.opm.aparienciaId === padre.id);
    const attrs = padreCell?.attrs as Attrs | undefined;
    const proxy = cells.find((item) => item.opm.kind === "proxy-plegado");

    expect(cells.filter((item) => item.opm.kind === "entidad")).toHaveLength(2);
    expect((attrs?.partLabel0 as Attrs | undefined)?.text).toBe("Vehiculo parte 1");
    expect((attrs?.partLabel0 as Attrs | undefined)?.textDecoration).toBe("line-through");
    expect((attrs?.partCounter1 as Attrs | undefined)?.text).toBe("y 4 partes más");
    expect(proxy?.type).toBe("standard.Link");
    expect(((proxy?.attrs as Attrs | undefined)?.line as Attrs | undefined)?.strokeDasharray).toBe("5 4");
  });

  test("reancla enlaces a parte reinsertada en el rectangulo padre con etiqueta", () => {
    let modelo = modeloConVehiculoDesplegado();
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    const padre = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    const parteId = entidadPorNombre(modelo, "Vehiculo parte 1");
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, padre.id, "parcial"));
    modelo = must(extraerParteDePlegado(modelo, modelo.opdRaizId, padre.id, parteId));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 360, y: 110 }, "Mover"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, parteId, entidadPorNombre(modelo, "Mover"), "instrumento"));
    const extraida = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).find((apariencia) => apariencia.entidadId === parteId && apariencia.parteExtraidaDe);
    expect(extraida).toBeDefined();
    if (!extraida) return;
    modelo = must(reinsertarParteEnPlegado(modelo, extraida.id));

    const link = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((item) => item.opm.kind === "enlace" && item.type === "standard.Link");
    const labels = link?.labels as Array<{ attrs?: { label?: { text?: string } } }> | undefined;

    expect((link?.source as { id?: string } | undefined)?.id).toBe(padre.id);
    expect(labels?.some((label) => label.attrs?.label?.text === "Vehiculo parte 1")).toBe(true);
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

function modeloConVehiculoDesplegado(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Vehiculo"));
  const objetoId = entidadPorNombre(modelo, "Vehiculo");
  return must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;
}

function agregarPartes(modeloInicial: Modelo, cantidad: number): Modelo {
  let modelo = modeloInicial;
  const objetoId = entidadPorNombre(modelo, "Vehiculo");
  const opdDespliegueId = modelo.entidades[objetoId]?.refinamiento?.opdId;
  expect(opdDespliegueId).toBeDefined();
  if (!opdDespliegueId) throw new Error("Despliegue no encontrado");

  for (let indice = 0; indice < cantidad; indice += 1) {
    const nombre = `Vehiculo parte ${indice + 4}`;
    modelo = must(crearObjeto(modelo, opdDespliegueId, { x: 90 + indice * 130, y: 230 }, nombre));
    modelo = must(crearEnlace(modelo, opdDespliegueId, objetoId, entidadPorNombre(modelo, nombre), "agregacion"));
  }

  return modelo;
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
