import { describe, expect, test } from "bun:test";
import { crearCosaEnPosicion } from "./creacionInterna";
import { extremoEntidad } from "./extremos";
import { contenedorRefinamiento } from "./layout";
import {
  aparienciaLimpiableAutomaticamente,
  aparienciaRenderizableEnOpd,
  aparicionesVisiblesEnOpd,
  clasificarAparicion,
  entidadesVisiblesEnOpd,
  entidadVisibleEnOpd,
  opdIdDeEntidadVisible,
} from "./politicaApariciones";
import { crearEnlace, crearModelo, crearObjeto, crearProceso, descomponerProceso } from "./operaciones";
import type { Apariencia, Modelo, Resultado } from "./tipos";

describe("politica de apariciones por OPD", () => {
  test("la visibilidad es pertenencia a las apariencias del OPD", () => {
    const base = modeloConExternoMaterializado();
    const opdRaiz = base.modelo.opds[base.modelo.opdRaizId];
    const opdHijo = base.modelo.opds[base.opdHijoId];
    if (!opdRaiz || !opdHijo) throw new Error("La prueba esperaba OPDs");

    expect(entidadVisibleEnOpd(opdRaiz, base.padreId)).toBe(true);
    expect(entidadVisibleEnOpd(opdHijo, base.padreId)).toBe(true);
    expect(entidadVisibleEnOpd(opdHijo, "entidad-inexistente")).toBe(false);
    expect(aparicionesVisiblesEnOpd(opdHijo)).toEqual(Object.values(opdHijo.apariencias));
    expect(entidadesVisiblesEnOpd(opdHijo).has(base.padreId)).toBe(true);
    expect(entidadesVisiblesEnOpd(opdHijo).has("entidad-inexistente")).toBe(false);
    expect(opdIdDeEntidadVisible(base.modelo, base.externoId, base.modelo.opdRaizId)).toBe(base.modelo.opdRaizId);
    expect(opdIdDeEntidadVisible(base.modelo, base.externoId, base.opdHijoId)).toBe(base.opdHijoId);
    expect(opdIdDeEntidadVisible(base.modelo, "entidad-inexistente", base.opdHijoId)).toBeNull();

    const aparienciaRaiz = aparienciaDeEntidad(base.modelo, base.modelo.opdRaizId, base.padreId);
    expect(aparienciaRenderizableEnOpd(opdRaiz, aparienciaRaiz)).toBe(true);
    expect(aparienciaRenderizableEnOpd(opdHijo, aparienciaRaiz)).toBe(false);
  });

  test("clasifica contorno, interno y externo materializado sin mezclar visibilidad con rol", () => {
    const base = modeloConExternoMaterializado();
    const opdHijo = base.modelo.opds[base.opdHijoId];
    if (!opdHijo) throw new Error("La prueba esperaba OPD hijo");

    const contorno = aparienciaDeEntidad(base.modelo, base.opdHijoId, base.padreId);
    const externo = aparienciaDeEntidad(base.modelo, base.opdHijoId, base.externoId);
    const interno = Object.values(opdHijo.apariencias).find((apariencia) =>
      apariencia.entidadId !== base.padreId && apariencia.entidadId !== base.externoId
    );
    if (!interno) throw new Error("La prueba esperaba apariencia interna");

    expect(clasificarAparicion(base.modelo, base.opdHijoId, contorno)).toMatchObject({
      visible: true,
      razonVisibilidad: "apariencia-en-opd",
      origen: "refinamiento-contorno",
      rolRefinamiento: "contorno",
      confinadaAContorno: false,
      limpiableAutomaticamente: false,
    });
    expect(clasificarAparicion(base.modelo, base.opdHijoId, interno)).toMatchObject({
      origen: "refinamiento-interno",
      rolRefinamiento: "interno",
      confinadaAContorno: true,
      limpiableAutomaticamente: false,
    });
    expect(clasificarAparicion(base.modelo, base.opdHijoId, externo)).toMatchObject({
      origen: "refinamiento-externo-materializado",
      rolRefinamiento: "externo",
      confinadaAContorno: false,
      limpiableAutomaticamente: true,
    });
    expect(aparienciaLimpiableAutomaticamente(base.modelo, base.opdHijoId, externo, base.padreId)).toBe(true);
  });

  test("una aparicion contextual manual fuera del contorno no se limpia automaticamente", () => {
    const base = modeloConExternoMaterializado();
    const contorno = contenedorRefinamiento(base.modelo, base.opdHijoId);
    if (!contorno) throw new Error("La prueba esperaba contorno");
    const creado = must(crearCosaEnPosicion(base.modelo, base.opdHijoId, "objeto", {
      x: contorno.x + contorno.width + 64,
      y: contorno.y + 120,
    }));
    const apariencia = creado.modelo.opds[base.opdHijoId]?.apariencias[creado.aparienciaId];
    if (!apariencia) throw new Error("La prueba esperaba apariencia creada");

    expect(clasificarAparicion(creado.modelo, base.opdHijoId, apariencia)).toMatchObject({
      origen: "manual",
      rolRefinamiento: "externo",
      confinadaAContorno: false,
      limpiableAutomaticamente: false,
    });
    expect(aparienciaLimpiableAutomaticamente(creado.modelo, base.opdHijoId, apariencia, base.padreId)).toBe(false);
  });
});

function modeloConExternoMaterializado(): { modelo: Modelo; externoId: string; padreId: string; opdHijoId: string } {
  let modelo = crearModelo("Politica apariciones");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 60 }, "Externo"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 320, y: 220 }, "PadreRefinable"));
  const externoId = entidadPorNombre(modelo, "Externo");
  const padreId = entidadPorNombre(modelo, "PadreRefinable");
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(externoId), extremoEntidad(padreId), "consumo"));
  const descomposicion = must(descomponerProceso(modelo, modelo.opdRaizId, padreId));
  return { modelo: descomposicion.modelo, externoId, padreId, opdHijoId: descomposicion.opdId };
}

function aparienciaDeEntidad(modelo: Modelo, opdId: string, entidadId: string): Apariencia {
  const apariencia = Object.values(modelo.opds[opdId]?.apariencias ?? {})
    .find((item) => item.entidadId === entidadId);
  if (!apariencia) throw new Error(`La prueba esperaba apariencia de ${entidadId} en ${opdId}`);
  return apariencia;
}

function entidadPorNombre(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`La prueba esperaba entidad ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
