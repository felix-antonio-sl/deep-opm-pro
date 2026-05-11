import { describe, expect, test } from "bun:test";
import { extremoEntidad } from "../extremos";
import {
  asignarValorAtributo,
  crearAtributoEnObjeto,
  crearEnlace,
  crearModelo,
  crearObjeto,
  crearProceso,
} from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { planificarSimulacion } from "./plan";
import { ejecutarPaso, iniciarSimulacion } from "./runner";
import { aplicarCambiosValor, iniciarValoresRuntime } from "./valores";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Fixture fail: ${resultado.error}`);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): string {
  const e = Object.values(modelo.entidades).find((it) => it.nombre === nombre);
  if (!e) throw new Error(`Entidad no encontrada: ${nombre}`);
  return e.id;
}

/** Fixture: objeto Sensor con atributo Lectura (float, valor 25),
 *  objeto Display con atributo Temperatura (float), proceso Mostrar
 *  con consumo Lectura → instrumento y resultado → Temperatura. */
function modeloPropagacionAtributos(): {
  modelo: Modelo;
  lecturaId: string;
  temperaturaId: string;
} {
  let modelo = crearModelo("Sensor");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 50, y: 50 }, "Sensor"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 50, y: 250 }, "Display"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 150 }, "Mostrar"));
  const sensorId = entidadId(modelo, "Sensor");
  const displayId = entidadId(modelo, "Display");
  const mostrarId = entidadId(modelo, "Mostrar");

  const atrSensor = must(crearAtributoEnObjeto(modelo, modelo.opdRaizId, sensorId, "Lectura", { tipoSlot: "float", valor: 25 }));
  modelo = atrSensor.modelo;
  const lecturaId = entidadId(modelo, "Lectura");

  const atrDisplay = must(crearAtributoEnObjeto(modelo, modelo.opdRaizId, displayId, "Temperatura", { tipoSlot: "float" }));
  modelo = atrDisplay.modelo;
  const temperaturaId = entidadId(modelo, "Temperatura");

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(lecturaId), extremoEntidad(mostrarId), "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(mostrarId), extremoEntidad(temperaturaId), "resultado"));

  return { modelo, lecturaId, temperaturaId };
}

describe("iniciarValoresRuntime", () => {
  test("copia entidad.valorSlot.valor de cada atributo con valor", () => {
    const { modelo, lecturaId, temperaturaId } = modeloPropagacionAtributos();
    const valores = iniciarValoresRuntime(modelo);
    expect(valores[lecturaId]).toBe(25);
    expect(valores[temperaturaId]).toBeUndefined();
  });

  test("entidades sin valorSlot no aparecen en valores runtime", () => {
    let modelo = crearModelo("Sin atributos");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 50, y: 50 }, "Objeto"));
    const objetoId = entidadId(modelo, "Objeto");

    const valores = iniciarValoresRuntime(modelo);
    expect(valores[objetoId]).toBeUndefined();
  });
});

describe("aplicarCambiosValor — propagación atributo→atributo", () => {
  test("copia valor de atributo entrada a atributo salida del mismo tipo", () => {
    const { modelo, lecturaId, temperaturaId } = modeloPropagacionAtributos();
    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    const valoresActuales = iniciarValoresRuntime(modelo);

    const { valoresNuevos, cambios, motivos } = aplicarCambiosValor(modelo, valoresActuales, plan[0]!);
    expect(motivos).toEqual([]);
    expect(cambios).toEqual([{ entidadId: temperaturaId, antes: undefined, despues: 25 }]);
    expect(valoresNuevos[temperaturaId]).toBe(25);
    // El valor original no se mutó
    expect(valoresActuales[temperaturaId]).toBeUndefined();
    expect(valoresActuales[lecturaId]).toBe(25);
  });

  test("diagnóstico cuando atributo entrada no tiene valor runtime", () => {
    let modelo = crearModelo("Sin valor");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 50, y: 50 }, "Sensor"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 50, y: 250 }, "Display"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 150 }, "Mostrar"));
    const sensorId = entidadId(modelo, "Sensor");
    const displayId = entidadId(modelo, "Display");
    const mostrarId = entidadId(modelo, "Mostrar");
    modelo = must(crearAtributoEnObjeto(modelo, modelo.opdRaizId, sensorId, "Lectura", { tipoSlot: "float" })).modelo;
    modelo = must(crearAtributoEnObjeto(modelo, modelo.opdRaizId, displayId, "Temp", { tipoSlot: "float" })).modelo;
    const lecturaId = entidadId(modelo, "Lectura");
    const tempId = entidadId(modelo, "Temp");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(lecturaId), extremoEntidad(mostrarId), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(mostrarId), extremoEntidad(tempId), "resultado"));

    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    const { cambios, motivos } = aplicarCambiosValor(modelo, {}, plan[0]!);
    expect(cambios).toEqual([]);
    expect(motivos.length).toBeGreaterThan(0);
    expect(motivos[0]).toContain("Lectura");
    expect(motivos[0]).toContain("sin valor");
  });

  test("diagnóstico cuando tipos de slot difieren", () => {
    let modelo = crearModelo("Tipos");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 50, y: 50 }, "A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 50, y: 250 }, "B"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 150 }, "Copiar"));
    const aId = entidadId(modelo, "A");
    const bId = entidadId(modelo, "B");
    const copiarId = entidadId(modelo, "Copiar");
    modelo = must(crearAtributoEnObjeto(modelo, modelo.opdRaizId, aId, "Numero", { tipoSlot: "integer", valor: 7 })).modelo;
    modelo = must(crearAtributoEnObjeto(modelo, modelo.opdRaizId, bId, "Texto", { tipoSlot: "string" })).modelo;
    const numeroId = entidadId(modelo, "Numero");
    const textoId = entidadId(modelo, "Texto");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(numeroId), extremoEntidad(copiarId), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(copiarId), extremoEntidad(textoId), "resultado"));

    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    const valoresActuales = iniciarValoresRuntime(modelo);
    const { cambios, motivos } = aplicarCambiosValor(modelo, valoresActuales, plan[0]!);
    expect(cambios).toEqual([]);
    expect(motivos.some((m) => m.includes("Tipos incompatibles"))).toBe(true);
  });
});

describe("ejecutarPaso — integra cambios de valor en el trace", () => {
  test("trace.cambiosValor refleja propagación atributo→atributo", () => {
    const { modelo, temperaturaId } = modeloPropagacionAtributos();
    let ctx = iniciarSimulacion(modelo, modelo.opdRaizId);
    ctx = ejecutarPaso(modelo, ctx);
    expect(ctx.trace[0]?.cambiosValor).toEqual([
      { entidadId: temperaturaId, antes: undefined, despues: 25 },
    ]);
    expect(ctx.valoresRuntime[temperaturaId]).toBe(25);
  });

  test("no muta el modelo persistente (valor original intacto)", () => {
    const { modelo, lecturaId } = modeloPropagacionAtributos();
    const valorOriginal = modelo.entidades[lecturaId]?.valorSlot?.valor;
    let ctx = iniciarSimulacion(modelo, modelo.opdRaizId);
    ctx = ejecutarPaso(modelo, ctx);
    expect(modelo.entidades[lecturaId]?.valorSlot?.valor).toBe(valorOriginal);
  });

  test("respeta cambios manuales del operador en valoresRuntime", () => {
    const { modelo, lecturaId, temperaturaId } = modeloPropagacionAtributos();
    let ctx = iniciarSimulacion(modelo, modelo.opdRaizId);
    // Operador asigna manualmente 99 a Lectura antes de ejecutar
    ctx = { ...ctx, valoresRuntime: { ...ctx.valoresRuntime, [lecturaId]: 99 } };
    ctx = ejecutarPaso(modelo, ctx);
    expect(ctx.valoresRuntime[temperaturaId]).toBe(99);
    expect(ctx.trace[0]?.cambiosValor[0]?.despues).toBe(99);
  });
});

describe("asignarValorAtributo (control)", () => {
  test("setea valor en entidad.valorSlot (modelo persistente, no runtime)", () => {
    const { modelo: base, lecturaId } = modeloPropagacionAtributos();
    const actualizado = must(asignarValorAtributo(base, lecturaId, 50));
    expect(actualizado.entidades[lecturaId]?.valorSlot?.valor).toBe(50);
    // El runtime se inicializa desde ahí
    const valores = iniciarValoresRuntime(actualizado);
    expect(valores[lecturaId]).toBe(50);
  });
});
