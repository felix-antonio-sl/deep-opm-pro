import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../operaciones";
import type { Modelo, Resultado, TipoEnlace } from "../tipos";
import { debeAnimarTokensSim, tokensDeFaseSimulacion } from "./animacionTokens";
import type { FocoPasoSimulacion } from "./foco";
import type { PasoSimulacion } from "./tipos";

const focoEn = (opdId: string, enlaces: string[]): FocoPasoSimulacion => ({
  fase: "paso",
  faseConceptual: "consumo",
  paso: { opdId } as FocoPasoSimulacion["paso"],
  procesoActivoId: "p1",
  entidadesInvolucradasIds: [],
  enlacesInvolucradosIds: enlaces,
  estadosOrigenIds: [],
  estadosResultadoIds: [],
  estadosCurrentVisual: {},
});

describe("debeAnimarTokensSim", () => {
  test("anima cuando el paso vive en el OPD visible y no es headless", () => {
    expect(debeAnimarTokensSim(focoEn("SD", ["e1"]), "SD", false)).toBe(true);
  });
  test("no anima en headless", () => {
    expect(debeAnimarTokensSim(focoEn("SD", ["e1"]), "SD", true)).toBe(false);
  });
  test("no anima si el paso está en otro OPD", () => {
    expect(debeAnimarTokensSim(focoEn("SD1", ["e1"]), "SD", false)).toBe(false);
  });
  test("no anima sin paso activo", () => {
    const sinPaso: FocoPasoSimulacion = {
      fase: "inactivo",
      faseConceptual: null,
      paso: null,
      procesoActivoId: null,
      entidadesInvolucradasIds: [],
      enlacesInvolucradosIds: [],
      estadosOrigenIds: [],
      estadosResultadoIds: [],
      estadosCurrentVisual: {},
    };
    expect(debeAnimarTokensSim(sinPaso, "SD", false)).toBe(false);
  });
  test("no anima sin enlaces", () => {
    expect(debeAnimarTokensSim(focoEn("SD", []), "SD", false)).toBe(false);
  });
});

describe("tokensDeFaseSimulacion", () => {
  function must<T>(r: Resultado<T>): T {
    if (!r.ok) throw new Error(r.error);
    return r.value;
  }

  function entidadId(modelo: Modelo, nombre: string): string {
    const entidad = Object.values(modelo.entidades).find((e) => e.nombre === nombre);
    if (!entidad) throw new Error(`no existe ${nombre}`);
    return entidad.id;
  }

  function enlaceIdPorTipo(modelo: Modelo, tipo: TipoEnlace): string {
    const enlace = Object.values(modelo.enlaces).find((e) => e.tipo === tipo);
    if (!enlace) throw new Error(`no existe enlace ${tipo}`);
    return enlace.id;
  }

  function fixture(): { modelo: Modelo; paso: PasoSimulacion; ids: { consumoId: string; resultadoId: string; efectoId: string } } {
    let modelo = crearModelo("M");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Insumo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 200 }, "Salida"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 400, y: 100 }, "Afectado"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 100 }, "Procesar"));
    const proceso = entidadId(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadId(modelo, "Insumo"), proceso, "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, proceso, entidadId(modelo, "Salida"), "resultado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, proceso, entidadId(modelo, "Afectado"), "efecto"));
    const consumoId = enlaceIdPorTipo(modelo, "consumo");
    const resultadoId = enlaceIdPorTipo(modelo, "resultado");
    const efectoId = enlaceIdPorTipo(modelo, "efecto");
    const paso: PasoSimulacion = {
      opdId: modelo.opdRaizId,
      opdNombre: "SD",
      profundidad: 0,
      procesoId: proceso,
      procesoNombre: "Procesar",
      ordenY: 100,
      enlacesEntradaIds: [consumoId, efectoId],
      enlacesSalidaIds: [resultadoId, efectoId],
      transicionesPlanificadas: [],
    };
    return { modelo, paso, ids: { consumoId, resultadoId, efectoId } };
  }

  test("en consumo: el consumo viaja normal (objeto→proceso) y el efecto en reverse", () => {
    const { modelo, paso, ids } = fixture();
    const tokens = tokensDeFaseSimulacion(modelo, paso, "consumo", {});
    expect(tokens).toContainEqual({ enlaceId: ids.consumoId, direccion: "normal" });
    expect(tokens).toContainEqual({ enlaceId: ids.efectoId, direccion: "reverse" });
    expect(tokens.find((t) => t.enlaceId === ids.resultadoId)).toBeUndefined();
  });

  test("en resultado: resultado y efecto viajan normal (proceso→objeto)", () => {
    const { modelo, paso, ids } = fixture();
    const tokens = tokensDeFaseSimulacion(modelo, paso, "resultado", {});
    expect(tokens).toContainEqual({ enlaceId: ids.resultadoId, direccion: "normal" });
    expect(tokens).toContainEqual({ enlaceId: ids.efectoId, direccion: "normal" });
    expect(tokens.find((t) => t.enlaceId === ids.consumoId)).toBeUndefined();
  });

  test("en proceso y sin fase no viaja nada", () => {
    const { modelo, paso } = fixture();
    expect(tokensDeFaseSimulacion(modelo, paso, "proceso", {})).toEqual([]);
    expect(tokensDeFaseSimulacion(modelo, paso, undefined, {})).toEqual([]);
    expect(tokensDeFaseSimulacion(modelo, paso, null, {})).toEqual([]);
  });
});
