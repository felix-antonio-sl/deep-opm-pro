import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso } from "./operaciones";
import type { Id, Modelo, TipoEnlace } from "./tipos";
import {
  evaluarTiposEnlacePermitidos,
  tiposEnlacePermitidos,
} from "./opcionesEnlace";

describe("opciones preventivas de enlace", () => {
  test("marca tipos invalidos con motivo reutilizando la firma canonica", () => {
    const { modelo, objeto, proceso } = modeloBase();

    const evaluadas = evaluarTiposEnlacePermitidos(modelo, objeto, proceso);
    const consumo = porTipo(evaluadas, "consumo");
    const excepcion = porTipo(evaluadas, "excepcionSobretiempo");

    expect(consumo.permitido).toBe(true);
    expect(excepcion.permitido).toBe(false);
    expect(excepcion.motivo).toContain("Proceso fuente -> Proceso de manejo");
    expect(tiposEnlacePermitidos(modelo, objeto, proceso)).not.toContain("excepcionSobretiempo");
  });

  test("respeta direccion entrante para prevenir elecciones visualmente invertidas", () => {
    const { modelo, objeto, proceso } = modeloBase();

    const permitidas = tiposEnlacePermitidos(modelo, objeto, proceso, "entrante");

    expect(permitidas).toContain("resultado");
    expect(permitidas).not.toContain("consumo");
  });

  test("bloquea autoenlaces antes de ofrecer tipos permisivos como etiquetado", () => {
    const { modelo, objeto } = modeloBase();

    const evaluadas = evaluarTiposEnlacePermitidos(modelo, objeto, objeto);

    expect(porTipo(evaluadas, "etiquetado").permitido).toBe(false);
    expect(porTipo(evaluadas, "etiquetado").motivo).toContain("dos extremos distintos");
  });
});

function modeloBase(): { modelo: Modelo; objeto: Id; proceso: Id; manejador: Id } {
  let modelo = crearModelo("Opciones enlace");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Orden"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 440, y: 80 }, "Manejar Excepcion"));
  return {
    modelo,
    objeto: entidadPorNombre(modelo, "Orden"),
    proceso: entidadPorNombre(modelo, "Procesar"),
    manejador: entidadPorNombre(modelo, "Manejar Excepcion"),
  };
}

function porTipo<T extends { tipo: TipoEnlace }>(evaluadas: T[], tipo: TipoEnlace): T {
  const evaluada = evaluadas.find((item) => item.tipo === tipo);
  if (!evaluada) throw new Error(`Tipo no evaluado: ${tipo}`);
  return evaluada;
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
