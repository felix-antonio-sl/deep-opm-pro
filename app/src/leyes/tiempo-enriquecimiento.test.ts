import { describe, expect, test } from "bun:test";
import { extremoEntidad, extremoEstado } from "../modelo/extremos";
import { designarInicial } from "../modelo/estadosDesignaciones";
import { fijarDuracion } from "../modelo/objetoDuracion";
import {
  cambiarAfiliacion,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  definirTiempoExcepcionEnlace,
} from "../modelo/operaciones";
import { resumirEnriquecimientoCuantitativo } from "../modelo/simulacion/enriquecimiento";
import { desplegar, iniciarSimulacion } from "../modelo/simulacion/runner";
import type { Id, Modelo, Resultado } from "../modelo/tipos";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Fixture fail: ${resultado.error}`);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((it) => it.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function enlacePorTipo(modelo: Modelo, tipo: string): Id {
  const enlace = Object.values(modelo.enlaces).find((it) => it.tipo === tipo);
  if (!enlace) throw new Error(`Enlace no encontrado: ${tipo}`);
  return enlace.id;
}

function modeloConTiempo(nominalMin: number, umbralSobretiempoMin = 8): {
  modelo: Modelo;
  procesarId: Id;
  escalarId: Id;
  sobretiempoId: Id;
} {
  let modelo = crearModelo("Tiempo");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 120 }, "Pedido"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 120 }, "Procesar"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 520, y: 260 }, "Escalar"));

  const pedidoId = entidadId(modelo, "Pedido");
  const procesarId = entidadId(modelo, "Procesar");
  const escalarId = entidadId(modelo, "Escalar");
  // R-EXC-1A (guard nuevo): el proceso de manejo de excepción debe ser ambiental.
  modelo = must(cambiarAfiliacion(modelo, escalarId, "ambiental"));
  const estados = must(crearEstadosIniciales(modelo, pedidoId));
  modelo = estados.modelo;
  const [pendienteId, listoId] = estados.estadoIds;
  modelo = must(designarInicial(modelo, pendienteId));
  modelo = must(fijarDuracion(modelo, listoId, {
    unidad: "min",
    min: Math.max(0, nominalMin - 5),
    nominal: nominalMin,
    max: nominalMin + 10,
  }));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendienteId), extremoEntidad(procesarId), "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(procesarId), extremoEstado(listoId), "resultado"));
  modelo = must(crearEnlace(
    modelo,
    modelo.opdRaizId,
    extremoEntidad(procesarId),
    extremoEntidad(escalarId),
    "excepcionSobretiempo",
  ));

  const sobretiempoId = enlacePorTipo(modelo, "excepcionSobretiempo");
  modelo = must(definirTiempoExcepcionEnlace(modelo, sobretiempoId, {
    tiempoMaximo: String(umbralSobretiempoMin),
    unidadTiempoMaximo: "min",
  }));

  return { modelo, procesarId, escalarId, sobretiempoId };
}

describe("LEY F-D1/F-D3 — tiempo y enriquecimiento cuantitativo", () => {
  test("F-D1 tiempo: la traza conserva ventana temporal y dispara sobretiempo por umbral", () => {
    const { modelo, procesarId, escalarId, sobretiempoId } = modeloConTiempo(10);

    const fin = desplegar(modelo, iniciarSimulacion(modelo, modelo.opdRaizId));
    const entrada = fin.trace[0]!;

    expect(entrada.ventanaDuracion).toEqual({ unidad: "min", min: 5, nominal: 10, max: 20 });
    expect(entrada.duracion).toBe(600);
    expect(fin.reloj).toBe(600);
    expect(entrada.eventosTemporales).toEqual([{
      tipo: "sobretiempo",
      enlaceId: sobretiempoId,
      procesoOrigenId: procesarId,
      procesoManejoId: escalarId,
      duracion: 600,
      umbral: 480,
      unidadReloj: "s",
      umbralOriginal: { valor: 8, unidad: "min" },
    }]);
  });

  test("F-D3 enriquecimiento cuantitativo: las corridas se resumen por duración y eventos", () => {
    const normal = modeloConTiempo(5);
    const tardio = modeloConTiempo(10);

    const corridas = [
      desplegar(normal.modelo, iniciarSimulacion(normal.modelo, normal.modelo.opdRaizId)),
      desplegar(tardio.modelo, iniciarSimulacion(tardio.modelo, tardio.modelo.opdRaizId)),
    ];
    const resumen = resumirEnriquecimientoCuantitativo(corridas);

    expect(resumen.corridas).toBe(2);
    expect(resumen.duracion).toEqual({ total: 900, media: 450, min: 300, max: 600, unidadReloj: "s" });
    expect(resumen.eventosTemporales.porTipo.sobretiempo).toBe(1);
    expect(resumen.eventosTemporales.porEnlace[tardio.sobretiempoId]).toBe(1);
  });
});
