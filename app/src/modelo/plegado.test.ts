import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, descomponerProceso, desplegarObjeto, renombrarEntidad } from "./operaciones";
import { cambiarModoPlegado, contarPartesOcultas, extraerParteDePlegado, filasPlegadoParcial, partesDePlegado, partesExtraidasEn, reinsertarParteEnPlegado } from "./plegado";
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

  test("extrae una parte desde el plegado parcial como apariencia independiente", () => {
    let modelo = modeloConObjetoDesplegadoParcial();
    const padre = aparienciaDeEntidad(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Vehiculo"));
    const parteId = entidadPorNombre(modelo, "Vehiculo parte 1");

    const resultado = extraerParteDePlegado(modelo, modelo.opdRaizId, padre.id, parteId);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    const extraidas = partesExtraidasEn(resultado.value, modelo.opdRaizId, padre.id);
    expect(extraidas).toHaveLength(1);
    expect(extraidas[0]).toMatchObject({
      entidadId: parteId,
      parteExtraidaDe: { padreAparienciaId: padre.id, parteEntidadId: parteId },
    });
    expect(extraidas[0]?.x).toBeGreaterThan(padre.x + padre.width);
  });

  test("rechaza extraer si el padre no esta en plegado parcial", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;
    const padre = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    const parteId = entidadPorNombre(modelo, "Vehiculo parte 1");

    const resultado = extraerParteDePlegado(modelo, modelo.opdRaizId, padre.id, parteId);

    expect(resultado.ok).toBe(false);
    if (resultado.ok) return;
    expect(resultado.error).toContain("plegado parcial");
  });

  test("reinsertar elimina solo la apariencia extraida", () => {
    let modelo = modeloConObjetoDesplegadoParcial();
    const padre = aparienciaDeEntidad(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Vehiculo"));
    modelo = must(extraerParteDePlegado(modelo, modelo.opdRaizId, padre.id, entidadPorNombre(modelo, "Vehiculo parte 1")));
    const extraida = partesExtraidasEn(modelo, modelo.opdRaizId, padre.id)[0];
    expect(extraida).toBeDefined();
    if (!extraida) return;

    const resultado = reinsertarParteEnPlegado(modelo, extraida.id);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(partesExtraidasEn(resultado.value, modelo.opdRaizId, padre.id)).toHaveLength(0);
    expect(resultado.value.entidades[extraida.entidadId]).toBeDefined();
  });

  test("cuenta partes ocultas y marca filas extraidas", () => {
    let modelo = modeloConObjetoDesplegadoParcial();
    const padre = aparienciaDeEntidad(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Vehiculo"));
    modelo = must(extraerParteDePlegado(modelo, modelo.opdRaizId, padre.id, entidadPorNombre(modelo, "Vehiculo parte 1")));

    expect(contarPartesOcultas(modelo, modelo.opdRaizId, padre.id)).toBe(2);
    expect(filasPlegadoParcial(modelo, modelo.opdRaizId, padre.id)).toEqual([
      { tipo: "parte", entidadId: entidadPorNombre(modelo, "Vehiculo parte 1"), nombre: "Vehiculo parte 1", extraida: true },
      { tipo: "parte", entidadId: entidadPorNombre(modelo, "Vehiculo parte 2"), nombre: "Vehiculo parte 2", extraida: false },
      { tipo: "parte", entidadId: entidadPorNombre(modelo, "Vehiculo parte 3"), nombre: "Vehiculo parte 3", extraida: false },
    ]);
  });

  test("extraer y reinsertar conserva round-trip estructural de apariencias salvo nextSeq", () => {
    const base = modeloConObjetoDesplegadoParcial();
    const padre = aparienciaDeEntidad(base, base.opdRaizId, entidadPorNombre(base, "Vehiculo"));
    let modelo = must(extraerParteDePlegado(base, base.opdRaizId, padre.id, entidadPorNombre(base, "Vehiculo parte 1")));
    const extraida = partesExtraidasEn(modelo, modelo.opdRaizId, padre.id)[0];
    expect(extraida).toBeDefined();
    if (!extraida) return;
    modelo = must(reinsertarParteEnPlegado(modelo, extraida.id));

    expect(modelo.opds[modelo.opdRaizId]?.apariencias).toEqual(base.opds[base.opdRaizId]?.apariencias);
    expect(modelo.entidades).toEqual(base.entidades);
    expect(modelo.enlaces).toEqual(base.enlaces);
    expect(modelo.nextSeq).toBe(base.nextSeq + 1);
  });
});

function modeloConObjetoDesplegadoParcial(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Vehiculo"));
  const objetoId = entidadPorNombre(modelo, "Vehiculo");
  modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;
  const apariencia = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
  return must(cambiarModoPlegado(modelo, modelo.opdRaizId, apariencia.id, "parcial"));
}

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
