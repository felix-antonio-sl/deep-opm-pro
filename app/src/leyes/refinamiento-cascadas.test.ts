import { describe, expect, test } from "bun:test";
import { listarAvisosVisuales } from "../modelo/diagnosticoVisual";
import {
  crearEnlace,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
  moverApariencia,
  reanclarEnlaceExternoDerivado,
} from "../modelo/operaciones";
import type {
  Apariencia,
  Enlace,
  Id,
  Modelo,
  Opd,
  Resultado,
} from "../modelo/tipos";

const REGLA_CONTORNO_NO_DISTRIBUIDO = "visual-transformador-contorno-no-distribuido";
const REGLA_SUBPROCESO_SIN_TRANSFORMADO = "visual-subproceso-sin-transformado";

describe("leyes de cascadas de refinamiento", () => {
  test("law-refinement-projection descomponer distribuye transformadores externos sin dejar contorno visible", () => {
    let modelo = modeloConEntradaProcesoSalida();
    const procesar = entidadPorNombre(modelo, "Procesar");

    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesar));
    modelo = descompuesto.modelo;

    expect(avisosRegla(modelo, descompuesto.opdId, REGLA_CONTORNO_NO_DISTRIBUIDO)).toEqual([]);
    const derivados = enlacesDelOpd(modelo, descompuesto.opdId).filter((enlace) =>
      enlace.derivado?.tipo === "enlace-externo-refinamiento"
    );
    expect(derivados.map((enlace) => enlace.tipo).sort()).toEqual(["consumo", "resultado"]);
  });

  test("law-refinement-late-link crear enlace externo posterior a descomposicion sincroniza el hijo", () => {
    let modelo = crearModelo("Ley enlace tardio");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 120 }, "Procesar"));
    const procesar = entidadPorNombre(modelo, "Procesar");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesar));
    modelo = descompuesto.modelo;
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 120 }, "Entrada"));
    const entrada = entidadPorNombre(modelo, "Entrada");

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entrada, procesar, "consumo"));

    expect(avisosRegla(modelo, descompuesto.opdId, REGLA_CONTORNO_NO_DISTRIBUIDO)).toEqual([]);
    expect(enlacesDelOpd(modelo, descompuesto.opdId)).toContainEqual(expect.objectContaining({
      tipo: "consumo",
      derivado: expect.objectContaining({ refinamientoId: procesar, origen: "automatico" }),
    }));
    expect(aparienciaDeEntidad(modelo, descompuesto.opdId, entrada)?.contextoRefinamiento).toMatchObject({
      tipo: "descomposicion",
      refinableEntidadId: procesar,
      rol: "externo",
    });
  });

  test("law-refinement-reorder mover subprocesos recalcula derivados sin reintroducir contorno", () => {
    let modelo = modeloConEntradaProcesoSalida();
    const entrada = entidadPorNombre(modelo, "Entrada");
    const salida = entidadPorNombre(modelo, "Salida");
    const procesar = entidadPorNombre(modelo, "Procesar");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesar));
    modelo = descompuesto.modelo;
    const primeroOriginal = entidadPorNombre(modelo, "Procesar 1");
    const nuevoPrimero = entidadPorNombre(modelo, "Procesar 2");

    modelo = must(moverApariencia(modelo, descompuesto.opdId, primeroOriginal, { x: 285, y: 430 }));

    expect(avisosRegla(modelo, descompuesto.opdId, REGLA_CONTORNO_NO_DISTRIBUIDO)).toEqual([]);
    expect(enlacesDelOpd(modelo, descompuesto.opdId)).toContainEqual(expect.objectContaining({
      tipo: "consumo",
      origenId: expect.objectContaining({ id: entrada }),
      destinoId: expect.objectContaining({ id: nuevoPrimero }),
      derivado: expect.objectContaining({ origen: "automatico" }),
    }));
    expect(enlacesDelOpd(modelo, descompuesto.opdId)).toContainEqual(expect.objectContaining({
      tipo: "resultado",
      origenId: expect.objectContaining({ id: primeroOriginal }),
      destinoId: expect.objectContaining({ id: salida }),
      derivado: expect.objectContaining({ origen: "automatico" }),
    }));
  });

  test("law-refinement-manual-reanchor reanclar derivado conserva ausencia de contorno no distribuido", () => {
    let modelo = modeloConEntradaProcesoSalida();
    const entrada = entidadPorNombre(modelo, "Entrada");
    const procesar = entidadPorNombre(modelo, "Procesar");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesar));
    modelo = descompuesto.modelo;
    const segundo = entidadPorNombre(modelo, "Procesar 2");
    const derivado = aparienciaEnlaceDerivada(modelo, descompuesto.opdId, "consumo");

    modelo = must(reanclarEnlaceExternoDerivado(modelo, descompuesto.opdId, derivado.aparienciaId, segundo));

    expect(avisosRegla(modelo, descompuesto.opdId, REGLA_CONTORNO_NO_DISTRIBUIDO)).toEqual([]);
    expect(enlacesDelOpd(modelo, descompuesto.opdId)).toContainEqual(expect.objectContaining({
      tipo: "consumo",
      origenId: expect.objectContaining({ id: entrada }),
      destinoId: expect.objectContaining({ id: segundo }),
      derivado: expect.objectContaining({ origen: "manual" }),
    }));
  });

  test("law-refinement-complete-flow no deja avisos de cascada cuando todos los subprocesos transforman objetos", () => {
    let modelo = crearModelo("Ley flujo completo");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 120 }, "Procesar"));
    const procesar = entidadPorNombre(modelo, "Procesar");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesar));
    modelo = descompuesto.modelo;
    modelo = must(crearObjeto(modelo, descompuesto.opdId, { x: 560, y: 180 }, "Insumo"));
    const insumo = entidadPorNombre(modelo, "Insumo");

    for (const nombre of ["Procesar 1", "Procesar 2", "Procesar 3"]) {
      modelo = must(crearEnlace(modelo, descompuesto.opdId, insumo, entidadPorNombre(modelo, nombre), "consumo"));
    }

    expect(avisosRegla(modelo, descompuesto.opdId, REGLA_CONTORNO_NO_DISTRIBUIDO)).toEqual([]);
    expect(avisosRegla(modelo, descompuesto.opdId, REGLA_SUBPROCESO_SIN_TRANSFORMADO)).toEqual([]);
  });
});

function modeloConEntradaProcesoSalida(): Modelo {
  let modelo = crearModelo("Ley cascadas");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 120 }, "Entrada"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 120 }, "Procesar"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 560, y: 120 }, "Salida"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Entrada"), entidadPorNombre(modelo, "Procesar"), "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Procesar"), entidadPorNombre(modelo, "Salida"), "resultado"));
  return modelo;
}

function avisosRegla(modelo: Modelo, opdId: Id, reglaId: string) {
  return listarAvisosVisuales(modelo, opdId).filter((aviso) => aviso.reglaId === reglaId);
}

function enlacesDelOpd(modelo: Modelo, opdId: Id): Enlace[] {
  return Object.values(modelo.opds[opdId]?.enlaces ?? {})
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((enlace): enlace is Enlace => enlace !== undefined);
}

function aparienciaDeEntidad(modelo: Modelo, opdId: Id, entidadId: Id): Apariencia | undefined {
  return Object.values(modelo.opds[opdId]?.apariencias ?? {})
    .find((apariencia) => apariencia.entidadId === entidadId);
}

function aparienciaEnlaceDerivada(
  modelo: Modelo,
  opdId: Id,
  tipo: Enlace["tipo"],
): { aparienciaId: Id; enlace: Enlace } {
  const opd = modelo.opds[opdId] as Opd | undefined;
  if (!opd) throw new Error(`OPD no encontrado: ${opdId}`);
  for (const apariencia of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[apariencia.enlaceId];
    if (enlace?.tipo === tipo && enlace.derivado?.tipo === "enlace-externo-refinamiento") {
      return { aparienciaId: apariencia.id, enlace };
    }
  }
  throw new Error(`Enlace derivado no encontrado: ${tipo}`);
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
