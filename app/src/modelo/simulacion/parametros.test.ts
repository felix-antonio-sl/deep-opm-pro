import { describe, expect, test } from "bun:test";
import { crearModelo } from "../operaciones";
import type { Entidad } from "../tipos";
import {
  generarDatosSimulados,
  muestrearValorEntidad,
  normalizarParametrosSimulacion,
  parametrosSimulacionPorDefecto,
} from "./parametros";

function atributoBase(patch: Partial<Entidad> = {}): Entidad {
  return {
    id: "o-1",
    tipo: "objeto",
    nombre: "Temperatura",
    esencia: "informacional",
    afiliacion: "sistemica",
    esAtributo: true,
    valorSlot: { tipo: "float", placeholder: "value" },
    ...patch,
  };
}

describe("parametrosSimulacionPorDefecto", () => {
  test("usa el valor actual como rango uniforme inicial en atributos numericos", () => {
    const entidad = atributoBase({ valorSlot: { tipo: "float", placeholder: "value", valor: 25.5 } });
    expect(parametrosSimulacionPorDefecto(entidad)).toEqual({
      simulable: true,
      configuracion: {
        modo: "numerica",
        distribucion: "uniform",
        entero: false,
        uniformMin: 25.5,
        uniformMax: 25.5,
      },
    });
  });

  test("usa valores textuales ponderados para atributos string", () => {
    const entidad = atributoBase({
      nombre: "Estado textual",
      valorSlot: { tipo: "string", placeholder: "value", valor: "ok" },
    });
    expect(parametrosSimulacionPorDefecto(entidad).configuracion).toEqual({
      modo: "textual",
      valores: [{ texto: "ok", porcentaje: 100 }],
    });
  });
});

describe("normalizarParametrosSimulacion", () => {
  test("rechaza simulacion textual con suma de porcentajes distinta de 100", () => {
    const resultado = normalizarParametrosSimulacion({
      simulable: true,
      configuracion: {
        modo: "textual",
        valores: [
          { texto: "A", porcentaje: 80 },
          { texto: "B", porcentaje: 10 },
        ],
      },
    }, "string");
    expect(resultado.ok).toBe(false);
  });

  test("rechaza simulacion numerica sobre atributo string", () => {
    const resultado = normalizarParametrosSimulacion({
      simulable: true,
      configuracion: { modo: "numerica", distribucion: "uniform", uniformMin: 0, uniformMax: 1 },
    }, "string");
    expect(resultado.ok).toBe(false);
  });
});

describe("muestrearValorEntidad", () => {
  test("muestrea uniforme deterministico con rng inyectado", () => {
    const entidad = atributoBase({
      simulacion: {
        simulable: true,
        configuracion: { modo: "numerica", distribucion: "uniform", uniformMin: 10, uniformMax: 20 },
      },
    });
    const resultado = muestrearValorEntidad(entidad, () => 0.25);
    expect(resultado).toEqual({ ok: true, value: 12.5 });
  });

  test("muestrea textual ponderado con porcentajes OPCloud-like", () => {
    const entidad = atributoBase({
      valorSlot: { tipo: "string", placeholder: "value" },
      simulacion: {
        simulable: true,
        configuracion: {
          modo: "textual",
          valores: [
            { texto: "bajo", porcentaje: 20 },
            { texto: "alto", porcentaje: 80 },
          ],
        },
      },
    });
    expect(muestrearValorEntidad(entidad, () => 0.19)).toEqual({ ok: true, value: "bajo" });
    expect(muestrearValorEntidad(entidad, () => 0.21)).toEqual({ ok: true, value: "alto" });
  });
});

describe("generarDatosSimulados", () => {
  test("genera filas por atributo simulable como OpmModel.getSimulatedData", () => {
    const modelo = crearModelo("Datos");
    const entidad = atributoBase({
      simulacion: {
        simulable: true,
        configuracion: { modo: "numerica", distribucion: "uniform", uniformMin: 3, uniformMax: 3 },
      },
    });
    const filas = generarDatosSimulados({ ...modelo, entidades: { [entidad.id]: entidad } }, 2, () => 0.5);
    expect(filas).toEqual([{ Temperatura: 3 }, { Temperatura: 3 }]);
  });

  test("misma semilla produce la misma serie de datos", () => {
    const modelo = crearModelo("Datos sembrados");
    const entidad = atributoBase({
      simulacion: {
        simulable: true,
        configuracion: { modo: "numerica", distribucion: "uniform", uniformMin: 0, uniformMax: 100 },
      },
    });
    const sembrado = { ...modelo, entidades: { [entidad.id]: entidad } };

    expect(generarDatosSimulados(sembrado, 4, 1234)).toEqual(generarDatosSimulados(sembrado, 4, 1234));
    expect(generarDatosSimulados(sembrado, 4, 1234)).not.toEqual(generarDatosSimulados(sembrado, 4, 4321));
  });
});
