import { describe, expect, test } from "bun:test";
import { crearModelo, crearProceso, descomponerProceso } from "../../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../../modelo/tipos";
import { derivarDocumentFocusViewModel } from "./documentFocusViewModel";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function descomponer(modelo: Modelo, nombre: string): { modelo: Modelo; procesoId: Id; opdHijoId: Id } {
  const proceso = Object.values(modelo.entidades).find((entidad) => entidad.nombre === nombre);
  if (!proceso) throw new Error(`No existe ${nombre}`);
  const resultado = must(descomponerProceso(modelo, modelo.opdRaizId, proceso.id));
  return { modelo: resultado.modelo, procesoId: proceso.id, opdHijoId: resultado.opdId };
}

describe("DocumentFocusViewModel", () => {
  test("expone raíz, nivel, referente y refinamiento existente con identidad estable", () => {
    let modelo = crearModelo("Documento");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Operar"));
    const primerNivel = descomponer(modelo, "Operar");
    modelo = primerNivel.modelo;
    const segundoProceso = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Operar 1");
    if (!segundoProceso) throw new Error("No se creó el subproceso");
    const segundoNivel = must(descomponerProceso(modelo, primerNivel.opdHijoId, segundoProceso.id));
    modelo = segundoNivel.modelo;
    const antes = JSON.stringify(modelo);

    const foco = derivarDocumentFocusViewModel(modelo, primerNivel.opdHijoId);

    expect(foco.root).toEqual({ opdId: modelo.opdRaizId, nombre: "SD" });
    expect(foco.active).toEqual({ opdId: primerNivel.opdHijoId, nombre: "SD1", nivel: 1 });
    expect(foco.path.map((segmento) => [segmento.opdId, segmento.nivel])).toEqual([
      [modelo.opdRaizId, 0],
      [primerNivel.opdHijoId, 1],
    ]);
    expect(foco.referrer).toMatchObject({
      opdId: primerNivel.opdHijoId,
      entidadId: primerNivel.procesoId,
      entidadNombre: "Operar",
      tipo: "descomposicion",
    });
    expect(foco.refinements).toContainEqual(expect.objectContaining({
      opdId: segundoNivel.opdId,
      entidadId: segundoProceso.id,
      tipo: "descomposicion",
    }));
    expect(foco.actions.navigateRefinement).toMatchObject({ kind: "navigation", changesModel: false });
    expect(foco.actions.createRefinement).toMatchObject({ kind: "creation", changesModel: true, requiresQuestion: true });
    expect(foco.actions.proposeRefinement).toMatchObject({ kind: "proposal", supported: true, createsOpmFacts: false, requiresConfirmation: true });
    expect(JSON.stringify(modelo)).toBe(antes);
  });

  test("marca el OPL local de apunte y da un alcance explícito para el export completo", () => {
    const modelo = crearModelo("Apunte");
    const foco = derivarDocumentFocusViewModel(modelo, modelo.opdRaizId);

    expect(foco.opl.panel).toBe("modelo-completo");
    expect(foco.opl.copyLocal).toEqual({ opdId: modelo.opdRaizId, etiqueta: "OPL local · SD" });
    expect(foco.opl.exportComplete).toEqual({ etiqueta: "OPL completo del modelo", comando: "exportar-opl-modelo" });
  });

  test("no inventa una ruta ni un referente cuando el OPD activo falta o carece de padre válido", () => {
    const modelo = crearModelo("Documento");
    expect(derivarDocumentFocusViewModel(modelo, "no-existe")).toMatchObject({
      active: null,
      path: [],
      referrer: null,
      opl: { panel: "modelo-completo", copyLocal: null },
    });
  });
});
