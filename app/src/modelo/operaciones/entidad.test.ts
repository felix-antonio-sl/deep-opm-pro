import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, descomponerProceso } from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import {
  asignarValorAtributo,
  crearAtributoEnObjeto,
  esAtributoDerivado,
  renombrarEntidad,
} from "./entidad";

describe("operaciones/entidad valor numérico", () => {
  test("crearAtributoEnObjeto crea atributo, exhibición y apariencias en una operación", () => {
    let modelo = modeloConObjeto();
    const padreId = entidadPorNombre(modelo, "Sistema");

    const creado = crearAtributoEnObjeto(modelo, modelo.opdRaizId, padreId, "Temperatura [°C]", { tipoSlot: "float" });

    expect(creado.ok).toBe(true);
    if (!creado.ok) return;
    modelo = creado.value.modelo;
    const atributo = modelo.entidades[creado.value.atributoId];
    expect(atributo).toMatchObject({
      nombre: "Temperatura",
      unidad: "°C",
      esAtributo: true,
      valorSlot: { tipo: "float", placeholder: "value" },
    });
    expect(modelo.enlaces[creado.value.enlaceId]).toMatchObject({
      tipo: "exhibicion",
      origenId: { kind: "entidad", id: padreId },
      destinoId: { kind: "entidad", id: creado.value.atributoId },
    });
    expect(modelo.opds[modelo.opdRaizId]?.apariencias[creado.value.aparienciaId]?.entidadId).toBe(creado.value.atributoId);
    expect(Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {}).some((item) => item.enlaceId === creado.value.enlaceId)).toBe(true);
  });

  test("crearAtributoEnObjeto en in-zoom nace dentro del contorno", () => {
    let modelo = modeloConObjeto();
    const padreId = entidadPorNombre(modelo, "Sistema");
    const descompuesto = descomponerProceso(modelo, modelo.opdRaizId, padreId);
    expect(descompuesto.ok).toBe(true);
    if (!descompuesto.ok) return;
    modelo = descompuesto.value.modelo;

    const creado = crearAtributoEnObjeto(modelo, descompuesto.value.opdId, padreId, "Temperatura");

    expect(creado.ok).toBe(true);
    if (!creado.ok) return;
    const opd = creado.value.modelo.opds[descompuesto.value.opdId];
    const contorno = Object.values(opd?.apariencias ?? {}).find((apariencia) => apariencia.entidadId === padreId);
    const atributo = opd?.apariencias[creado.value.aparienciaId];
    expect(contorno).toBeDefined();
    expect(atributo).toBeDefined();
    if (!contorno || !atributo) return;
    expect(atributo.x).toBeGreaterThanOrEqual(contorno.x);
    expect(atributo.y).toBeGreaterThanOrEqual(contorno.y);
    expect(atributo.x + atributo.width).toBeLessThanOrEqual(contorno.x + contorno.width);
    expect(atributo.y + atributo.height).toBeLessThanOrEqual(contorno.y + contorno.height);
    expect(atributo.contextoRefinamiento).toMatchObject({
      tipo: "descomposicion",
      refinableEntidadId: padreId,
      rol: "interno",
      contenedorAparienciaId: contorno.id,
    });
  });

  test("renombrarEntidad parsea nombre [unidad] de forma idempotente", () => {
    let modelo = modeloConObjeto();
    const entidadId = entidadPorNombre(modelo, "Sistema");

    modelo = must(renombrarEntidad(modelo, entidadId, "Temperatura [°C]", modelo.opdRaizId));
    expect(modelo.entidades[entidadId]?.nombre).toBe("Temperatura");
    expect(modelo.entidades[entidadId]?.unidad).toBe("°C");

    modelo = must(renombrarEntidad(modelo, entidadId, "Temperatura [°C]", modelo.opdRaizId));
    expect(modelo.entidades[entidadId]?.nombre).toBe("Temperatura");
    expect(modelo.entidades[entidadId]?.unidad).toBe("°C");
  });

  test("asignarValorAtributo valida tipo y no muta con valor inválido", () => {
    let modelo = modeloConObjeto();
    const padreId = entidadPorNombre(modelo, "Sistema");
    const creado = crearAtributoEnObjeto(modelo, modelo.opdRaizId, padreId, "Temperatura", { tipoSlot: "integer" });
    if (!creado.ok) throw new Error(creado.error);
    modelo = creado.value.modelo;
    const atributoId = creado.value.atributoId;

    const invalido = asignarValorAtributo(modelo, atributoId, 25.5);
    expect(invalido.ok).toBe(false);
    expect(modelo.entidades[atributoId]?.valorSlot?.valor).toBeUndefined();

    modelo = must(asignarValorAtributo(modelo, atributoId, "25"));
    expect(modelo.entidades[atributoId]?.valorSlot?.valor).toBe(25);
  });

  test("esAtributoDerivado detecta atributos antiguos por exhibición entrante", () => {
    let modelo = modeloConObjeto();
    const padreId = entidadPorNombre(modelo, "Sistema");
    const creado = crearAtributoEnObjeto(modelo, modelo.opdRaizId, padreId, "Temperatura");
    if (!creado.ok) throw new Error(creado.error);
    modelo = creado.value.modelo;
    const { esAtributo: _esAtributo, ...legacy } = modelo.entidades[creado.value.atributoId]!;
    modelo.entidades[creado.value.atributoId] = legacy;

    expect(esAtributoDerivado(modelo, creado.value.atributoId)).toBe(true);
  });
});

function modeloConObjeto(): Modelo {
  return must(crearObjeto(crearModelo(), "opd-1", { x: 20, y: 30 }, "Sistema"));
}

function entidadPorNombre(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
