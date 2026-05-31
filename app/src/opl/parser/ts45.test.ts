import { describe, expect, test } from "bun:test";
import { extremoEstado } from "../../modelo/extremos";
import { crearEstadosIniciales, crearModelo, crearObjeto, crearProceso } from "../../modelo/operaciones";
import type { Modelo, Resultado } from "../../modelo/tipos";
import { aplicarPatchesOpl } from "./aplicar";
import { planificarEdicionOplLibre } from "./planificar";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Fixture fail: ${resultado.error}`);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function modeloBase(): { modelo: Modelo; estadoEntradaId: string; estadoSalidaId: string } {
  let modelo = crearModelo("TS45");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Pedido"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Resolver"));
  const estados = must(crearEstadosIniciales(modelo, entidadId(modelo, "Pedido")));
  modelo = estados.modelo;
  const [estadoEntradaId, estadoSalidaId] = estados.estadoIds;
  if (!estadoEntradaId || !estadoSalidaId) throw new Error("La prueba esperaba dos estados");
  return { modelo, estadoEntradaId, estadoSalidaId };
}

describe("OPL reverse TS4/TS5 parcial standalone", () => {
  test("aplica 'cambia de estado' como efecto Estado -> Proceso", () => {
    const { modelo, estadoEntradaId } = modeloBase();
    const preview = planificarEdicionOplLibre(modelo, "*Resolver* cambia **Pedido** de `estado1`.");
    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toEqual([]);

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches));

    const efecto = Object.values(aplicado.enlaces).find((enlace) => enlace.tipo === "efecto");
    expect(efecto).toMatchObject({
      origenId: extremoEstado(estadoEntradaId),
      estadoEntradaId,
    });
  });

  test("aplica 'cambia a estado' como efecto Proceso -> Estado", () => {
    const { modelo, estadoSalidaId } = modeloBase();
    const preview = planificarEdicionOplLibre(modelo, "*Resolver* cambia **Pedido** a `estado2`.");
    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toEqual([]);

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches));

    const efecto = Object.values(aplicado.enlaces).find((enlace) => enlace.tipo === "efecto");
    expect(efecto).toMatchObject({
      destinoId: extremoEstado(estadoSalidaId),
      estadoSalidaId,
    });
  });
});
