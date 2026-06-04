import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, descomponerProceso, estadosDeEntidad, renombrarEstado } from "../../../modelo/operaciones";
import type { Entidad, Resultado } from "../../../modelo/tipos";
import { ESTADOS, identificadorCanonicoApariencia, identificadorCanonicoEntidad, proyectarEntidad } from "./entidad";
import { suprimirEstadoEnAparicion } from "../../../modelo/visibilidadEstados";

describe("composer entidad", () => {
  test("proyecta objeto simple con metadata OPM estable", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Orden"));
    const entidad = Object.values(modelo.entidades)[0];
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!entidad || !apariencia) throw new Error("Fixture invalido");

    const cell = proyectarEntidad(modelo, modelo.opdRaizId, apariencia, entidad, false, false, {});

    expect(cell.id).toBe(apariencia.id);
    expect(cell.type).toBe("standard.Rectangle");
    expect(cell.opm).toEqual({
      kind: "entidad",
      opdId: modelo.opdRaizId,
      entidadId: entidad.id,
      aparienciaId: apariencia.id,
      rol: "interno",
    });
  });

  test("chip ⋯N: el badge de estados ocultos lleva el conteo y se dibuja como pastilla hairline en tinta", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Pedido"));
    const entidad = Object.values(modelo.entidades)[0]!;
    modelo = must(crearEstadosIniciales(modelo, entidad.id)).modelo; // estado1, estado2
    const apariencia0 = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0]!;
    const estado1Id = estadosDeEntidad(modelo, entidad.id)[0]!.id;
    modelo = must(suprimirEstadoEnAparicion(modelo, modelo.opdRaizId, apariencia0.id, estado1Id));
    const apariencia = modelo.opds[modelo.opdRaizId]!.apariencias[apariencia0.id]!;

    const cell = proyectarEntidad(modelo, modelo.opdRaizId, apariencia, modelo.entidades[entidad.id]!, false, false, {});
    const attrs = cell.attrs as Record<string, Record<string, unknown>>;

    // 1 oculto de 2 → conteo explícito y tooltip pluralizado en singular.
    expect(attrs.suppressedBadge?.text).toBe("⋯1");
    expect(attrs.suppressedBadge?.title).toBe("1 estado oculto en este OPD");
    // Pastilla hairline: fondo paper, borde tinta (crimson es UI-only, no va en el OPD).
    expect(attrs.suppressedBadgeChip).toMatchObject({
      fill: "#fafaf8",
      stroke: "#171511",
      strokeWidth: 1,
    });
  });

  test("aplica CANON-V3 Codex a objeto", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Orden"));
    const entidad = Object.values(modelo.entidades)[0];
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!entidad || !apariencia) throw new Error("Fixture invalido");

    const cell = proyectarEntidad(modelo, modelo.opdRaizId, apariencia, entidad, false, false, {});
    const attrs = cell.attrs as Record<string, Record<string, unknown>>;

    expect(attrs.body).toMatchObject({
      fill: "transparent",
      stroke: "#27613f",
      strokeWidth: 1.5,
      rx: 0,
      ry: 0,
    });
    expect(attrs.label).toMatchObject({
      fill: "#171511",
      fontFamily: "Inria Serif, Georgia, serif",
      fontSize: 17,
      fontWeight: 400,
      fontStyle: "normal",
      textWrap: { width: -16, height: -16, ellipsis: false },
    });
  });

  test("V-212 renderiza nombre canonico sin underscores y expande ancho para evitar cortes de palabra", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Hospitalización_domiciliaria"));
    const entidad = Object.values(modelo.entidades)[0];
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!entidad || !apariencia) throw new Error("Fixture invalido");

    const cell = proyectarEntidad(modelo, modelo.opdRaizId, apariencia, entidad, false, false, {});
    const attrs = cell.attrs as Record<string, Record<string, unknown>>;

    expect(attrs.label?.text).toBe("Hospitalización Domiciliaria");
    expect(String(attrs.label?.text)).not.toContain("_");
    expect((cell.size as { width: number }).width).toBeGreaterThan(apariencia.width);
  });

  test("aplica CANON-V3 Codex a proceso con label italic", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Aprobar"));
    const entidad = Object.values(modelo.entidades)[0];
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!entidad || !apariencia) throw new Error("Fixture invalido");

    const cell = proyectarEntidad(modelo, modelo.opdRaizId, apariencia, entidad, false, false, {});
    const attrs = cell.attrs as Record<string, Record<string, unknown>>;

    expect(attrs.body).toMatchObject({
      fill: "transparent",
      stroke: "#1d3f78",
      strokeWidth: 1.5,
    });
    expect(attrs.label).toMatchObject({
      fontFamily: "Inria Serif, Georgia, serif",
      fontSize: 17,
      fontStyle: "italic",
      fill: "#171511",
    });
  });

  test("proyecta estados embebidos con selectores interactivos", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Pedido"));
    const entidad = Object.values(modelo.entidades)[0];
    if (!entidad) throw new Error("Entidad no encontrada");
    modelo = must(crearEstadosIniciales(modelo, entidad.id)).modelo;
    const [estado] = estadosDeEntidad(modelo, entidad.id);
    if (!estado) throw new Error("Estado no encontrado");
    modelo = must(renombrarEstado(modelo, estado.id, "pendiente"));
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!apariencia) throw new Error("Apariencia no encontrada");

    const cell = proyectarEntidad(modelo, modelo.opdRaizId, apariencia, modelo.entidades[entidad.id]!, false, false, {});
    const attrs = cell.attrs as Record<string, unknown>;

    expect((cell.markup as Array<Record<string, unknown>>).some((item) => item.selector === "stateCapsule0")).toBe(true);
    expect((cell.markup as Array<Record<string, unknown>>).some((item) => item.selector === "connect-anchor-e-state0")).toBe(true);
    expect((attrs.stateLabel0 as Record<string, unknown>).text).toBe("pendiente");
    expect(cell.opm).toMatchObject({ kind: "entidad" });
    expect(cell.opm.kind === "entidad" ? cell.opm.estadosInteractivos : []).toEqual(
      expect.arrayContaining([
        { selector: "stateCapsule0", estadoId: estado.id },
        { selector: "stateLabel0", estadoId: estado.id },
        { selector: "connect-anchor-e-state0", estadoId: estado.id },
        { selector: "connect-anchor-o-state0", estadoId: estado.id },
      ]),
    );
    expect(attrs.stateCapsule0).toMatchObject({
      fill: "#dedacb",
      stroke: "#68711f",
      strokeWidth: 1.2,
      // BUG-9e3b9b: rountangle (rectangulo redondeado), no stadium/pill.
      rx: ESTADOS.radius,
      ry: ESTADOS.radius,
    });
    expect(attrs.stateLabel0).toMatchObject({
      fill: "#171511",
      fontFamily: "Inria Serif, Georgia, serif",
      fontSize: 13,
      fontWeight: 400,
      fontStyle: "italic",
      textWrap: { height: 20, ellipsis: false },
    });
    expect(attrs["connect-anchor-e-state0"]).toMatchObject({
      opacity: 0,
      pointerEvents: "none",
      magnet: true,
      "data-opm-connect-state-id": estado.id,
    });
  });

  test("BUG-a8c184: proceso sistemico descompuesto conserva contorno SOLIDO (no discontinuo)", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Operar"));
    const proceso = Object.values(modelo.entidades)[0];
    if (!proceso) throw new Error("Proceso no encontrado");
    const descomp = descomponerProceso(modelo, modelo.opdRaizId, proceso.id);
    if (!descomp.ok) throw new Error(descomp.error);
    modelo = descomp.value.modelo;
    const opdHijoId = descomp.value.opdId;
    const aparienciaHijo = Object.values(modelo.opds[opdHijoId]?.apariencias ?? {})
      .find((a) => modelo.entidades[a.entidadId]?.id === proceso.id);
    if (!aparienciaHijo) throw new Error("Apariencia contorno no encontrada");

    const cell = proyectarEntidad(modelo, opdHijoId, aparienciaHijo, modelo.entidades[proceso.id]!, false, false, {});
    const body = (cell.attrs as Record<string, Record<string, unknown>>).body;
    if (!body) throw new Error("body ausente");
    expect(body.strokeWidth).toBe(4);
    expect(body.strokeDasharray).toBeUndefined();
  });

  test("BUG-a8c184: proceso AMBIENTAL descompuesto conserva contorno discontinuo", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Externo"));
    const proceso = Object.values(modelo.entidades)[0];
    if (!proceso) throw new Error("Proceso no encontrado");
    modelo = { ...modelo, entidades: { ...modelo.entidades, [proceso.id]: { ...proceso, afiliacion: "ambiental" } } };
    const descomp = descomponerProceso(modelo, modelo.opdRaizId, proceso.id);
    if (!descomp.ok) throw new Error(descomp.error);
    modelo = descomp.value.modelo;
    const opdHijoId = descomp.value.opdId;
    const aparienciaHijo = Object.values(modelo.opds[opdHijoId]?.apariencias ?? {})
      .find((a) => modelo.entidades[a.entidadId]?.id === proceso.id);
    if (!aparienciaHijo) throw new Error("Apariencia contorno no encontrada");

    const cell = proyectarEntidad(modelo, opdHijoId, aparienciaHijo, modelo.entidades[proceso.id]!, false, false, {});
    const body = (cell.attrs as Record<string, Record<string, unknown>>).body;
    if (!body) throw new Error("body ausente");
    expect(body.strokeDasharray).toBe("8 4");
    expect(body.strokeWidth).toBe(4);
  });

  test("ui-forja/08 §1.3: index label hidden (oculto en canvas)", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Sensor"));
    const entidad = Object.values(modelo.entidades)[0]!;
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0]!;

    const cell = proyectarEntidad(modelo, modelo.opdRaizId, apariencia, entidad, false, false, {});
    const markup = cell.markup as Array<Record<string, unknown>>;
    const attrs = cell.attrs as Record<string, Record<string, unknown>>;

    expect(markup.some((m) => m.tagName === "text" && m.selector === "index")).toBe(true);
    const indexAttr = attrs.index;
    if (!indexAttr) throw new Error("Falta attrs.index");
    expect(indexAttr).toMatchObject({
      display: "none",
    });
  });

  test("ui-forja/08 §2: index label oculto en proceso", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Aprobar"));
    const entidad = Object.values(modelo.entidades)[0]!;
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0]!;

    const cell = proyectarEntidad(modelo, modelo.opdRaizId, apariencia, entidad, false, false, {});
    const attrs = cell.attrs as Record<string, Record<string, unknown>>;
    const indexAttr = attrs.index;
    if (!indexAttr) throw new Error("Falta attrs.index");
    expect(indexAttr).toMatchObject({ display: "none" });
  });

  test("identificadorCanonicoEntidad: prefijo por tipo + secuencia zero-pad", () => {
    const objeto: Entidad = { id: "o-3", tipo: "objeto", nombre: "X", esencia: "informacional", afiliacion: "sistemica" };
    const proceso: Entidad = { id: "p-12", tipo: "proceso", nombre: "Y", esencia: "informacional", afiliacion: "sistemica" };
    expect(identificadorCanonicoEntidad(objeto)).toBe("o.03");
    expect(identificadorCanonicoEntidad(proceso)).toBe("p.12");
  });

  test("identificadorCanonicoApariencia: ordinal jerarquico del refinable", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Procesar Pedido"));
    const proceso = Object.values(modelo.entidades)[0];
    if (!proceso) throw new Error("Proceso no encontrado");
    const descomp = descomponerProceso(modelo, modelo.opdRaizId, proceso.id);
    if (!descomp.ok) throw new Error(descomp.error);
    modelo = descomp.value.modelo;
    const opdHijoId = descomp.value.opdId;

    const indices = Object.values(modelo.opds[opdHijoId]?.apariencias ?? {})
      .filter((a) => a.contextoRefinamiento?.rol === "interno")
      .sort((a, b) => a.y - b.y)
      .map((a) => identificadorCanonicoApariencia(modelo, opdHijoId, a, modelo.entidades[a.entidadId]!));

    expect(indices).toEqual(["p.01.1", "p.01.2", "p.01.3"]);
  });

  test("HU-17.012 renderiza Nombre [Unidad] {alias}", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Temperatura"));
    const entidad = Object.values(modelo.entidades)[0];
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!entidad || !apariencia) throw new Error("Fixture invalido");
    modelo.entidades[entidad.id] = { ...entidad, unidad: "°C", alias: "T" };

    const cell = proyectarEntidad(modelo, modelo.opdRaizId, apariencia, modelo.entidades[entidad.id]!, false, false, {});
    const attrs = cell.attrs as Record<string, unknown>;

    expect((attrs.label as Record<string, unknown>).text).toBe("Temperatura [°C] {T}");
  });
});

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
