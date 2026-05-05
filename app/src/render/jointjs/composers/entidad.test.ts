import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearModelo, crearObjeto, estadosDeEntidad, renombrarEstado } from "../../../modelo/operaciones";
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
  });
});

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
