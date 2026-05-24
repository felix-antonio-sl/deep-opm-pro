import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, estadosDeEntidad, renombrarEstado } from "../../../modelo/operaciones";
import type { Resultado } from "../../../modelo/tipos";
import { proyectarEntidad } from "./entidad";

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

  test("aplica CANON-V3 Codex a objeto sin romper overrides de usuario", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Orden"));
    const entidad = Object.values(modelo.entidades)[0];
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!entidad || !apariencia) throw new Error("Fixture invalido");

    const cell = proyectarEntidad(modelo, modelo.opdRaizId, apariencia, entidad, false, false, {});
    const attrs = cell.attrs as Record<string, Record<string, unknown>>;

    expect(attrs.body).toMatchObject({
      fill: "transparent",
      stroke: "#3a6b4d",
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

    const override = proyectarEntidad(
      modelo,
      modelo.opdRaizId,
      { ...apariencia, estilo: { borderColor: "#123456", fill: "#abcdef" } },
      entidad,
      false,
      false,
      {},
    );
    const overrideAttrs = override.attrs as Record<string, Record<string, unknown>>;
    const overrideBody = overrideAttrs.body;
    if (!overrideBody) throw new Error("Fixture invalido: falta attrs.body");
    expect(overrideBody.stroke).toBe("#123456");
    expect(overrideBody.fill).toBe("#abcdef");
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
      stroke: "#26467a",
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
    expect((attrs.stateLabel0 as Record<string, unknown>).text).toBe("pendiente");
    expect(cell.opm).toMatchObject({ kind: "entidad" });
    expect(cell.opm.kind === "entidad" ? cell.opm.estadosInteractivos : []).toEqual(
      expect.arrayContaining([
        { selector: "stateCapsule0", estadoId: estado.id },
        { selector: "stateLabel0", estadoId: estado.id },
      ]),
    );
    expect(attrs.stateCapsule0).toMatchObject({
      fill: "#ece9e1",
      stroke: "#7e8338",
      strokeWidth: 1.2,
      rx: "calc(h/2)",
      ry: "calc(h/2)",
    });
    expect(attrs.stateLabel0).toMatchObject({
      fill: "#171511",
      fontFamily: "Inria Serif, Georgia, serif",
      fontSize: 13,
      fontWeight: 400,
      fontStyle: "italic",
      textWrap: { height: 20, ellipsis: false },
    });
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
