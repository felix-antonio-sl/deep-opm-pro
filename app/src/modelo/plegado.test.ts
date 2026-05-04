import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, descomponerProceso, desplegarObjeto, renombrarEntidad } from "./operaciones";
import { cambiarModoPlegado, partesDePlegado } from "./plegado";
import type { Apariencia, Modelo, Resultado } from "./tipos";

describe("plegado parcial", () => {
  test("cambia modoPlegado en una apariencia con refinamiento sin alterar el subarbol", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Atender"));
    const procesoId = entidadPorNombre(modelo, "Atender");
    modelo = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId)).modelo;
    const apariencia = aparienciaDeEntidad(modelo, modelo.opdRaizId, procesoId);
    const entidadesAntes = Object.keys(modelo.entidades);
    const opdsAntes = Object.keys(modelo.opds);

    const resultado = cambiarModoPlegado(modelo, modelo.opdRaizId, apariencia.id, "parcial");

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value.opds[modelo.opdRaizId]?.apariencias[apariencia.id]?.modoPlegado).toBe("parcial");
    expect(Object.keys(resultado.value.entidades)).toEqual(entidadesAntes);
    expect(Object.keys(resultado.value.opds)).toEqual(opdsAntes);
  });

  test("rechaza plegado parcial en apariencia sin refinamiento", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Objeto simple"));
    const objetoId = entidadPorNombre(modelo, "Objeto simple");
    const apariencia = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);

    const resultado = cambiarModoPlegado(modelo, modelo.opdRaizId, apariencia.id, "parcial");

    expect(resultado.ok).toBe(false);
    if (resultado.ok) return;
    expect(resultado.error).toContain("requiere una entidad con partes");
  });

  test("ordena partes compactas alfabeticamente por defecto", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;
    modelo = renombrarPartes(modelo, ["Rueda", "Chasis", "Motor"]);

    expect(partesDePlegado(modelo, objetoId).map((parte) => parte.nombre)).toEqual(["Chasis", "Motor", "Rueda"]);
  });
});

function renombrarPartes(modelo: Modelo, nombres: string[]): Modelo {
  const partes = Object.values(modelo.entidades)
    .filter((entidad) => entidad.nombre.startsWith("Vehiculo parte "))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
  return partes.reduce((actual, parte, index) => must(renombrarEntidad(actual, parte.id, nombres[index] ?? parte.nombre)), modelo);
}

function aparienciaDeEntidad(modelo: Modelo, opdId: string, entidadId: string): Apariencia {
  const apariencia = Object.values(modelo.opds[opdId]?.apariencias ?? {})
    .find((item) => item.entidadId === entidadId);
  if (!apariencia) throw new Error(`Apariencia no encontrada: ${entidadId}`);
  return apariencia;
}

function entidadPorNombre(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  expect(entidad).toBeDefined();
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
