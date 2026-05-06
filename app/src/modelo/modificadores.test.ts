import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso, desplegarObjeto } from "./operaciones";
import { autoInvocacionDeProceso, crearAutoInvocacion, esAutoInvocacion } from "./autoinvocacion";
import {
  aplicarModificador,
  aplicarSubtipoModificador,
  crearInvocacion,
  definirDemora,
  definirProbabilidad,
  quitarModificador,
  validarMetadatosEnlace,
} from "./modificadores";
import type { Modelo, Resultado } from "./tipos";

describe("modificadores de enlace", () => {
  test("aplica condicion, evento y NO solo sobre enlaces procedurales", () => {
    let modelo = modeloBase();
    const enlaceId = enlacePorTipo(modelo, "consumo");

    modelo = must(aplicarModificador(modelo, enlaceId, "condicion"));
    expect(modelo.enlaces[enlaceId]?.modificador).toBe("condicion");
    expect(modelo.enlaces[enlaceId]?.subtipoModificador).toBe("C");

    modelo = must(aplicarModificador(modelo, enlaceId, "evento"));
    expect(modelo.enlaces[enlaceId]?.modificador).toBe("evento");
    expect(modelo.enlaces[enlaceId]?.subtipoModificador).toBe("E");

    modelo = must(aplicarModificador(modelo, enlaceId, "no"));
    expect(modelo.enlaces[enlaceId]?.modificador).toBe("no");
    expect(modelo.enlaces[enlaceId]?.subtipoModificador).toBe("no");

    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), "agregacion")).modelo;
    const estructural = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "agregacion");
    expect(estructural).toBeDefined();
    if (!estructural) return;
    expect(aplicarModificador(modelo, estructural.id, "evento").ok).toBe(false);
  });

  test("probabilidad solo aplica a enlaces evento y se limpia al quitar modificador", () => {
    let modelo = modeloBase();
    const enlaceId = enlacePorTipo(modelo, "consumo");

    expect(definirProbabilidad(modelo, enlaceId, 0.7).ok).toBe(false);
    modelo = must(aplicarModificador(modelo, enlaceId, "evento"));
    expect(definirProbabilidad(modelo, enlaceId, -0.1).ok).toBe(false);
    expect(definirProbabilidad(modelo, enlaceId, 1.1).ok).toBe(false);

    modelo = must(definirProbabilidad(modelo, enlaceId, 0.7));
    expect(modelo.enlaces[enlaceId]?.probabilidad).toBe(0.7);

    modelo = must(quitarModificador(modelo, enlaceId));
    expect(modelo.enlaces[enlaceId]?.modificador).toBeUndefined();
    expect(modelo.enlaces[enlaceId]?.subtipoModificador).toBeUndefined();
    expect(modelo.enlaces[enlaceId]?.probabilidad).toBeUndefined();
  });

  test("aplicarSubtipoModificador valida coherencia con modificador base", () => {
    let modelo = modeloBase();
    const enlaceId = enlacePorTipo(modelo, "consumo");

    expect(aplicarSubtipoModificador(modelo, enlaceId, "E").ok).toBe(false);

    modelo = must(aplicarModificador(modelo, enlaceId, "evento"));
    modelo = must(aplicarSubtipoModificador(modelo, enlaceId, "E"));
    expect(modelo.enlaces[enlaceId]?.subtipoModificador).toBe("E");
    expect(aplicarSubtipoModificador(modelo, enlaceId, "C").ok).toBe(false);

    modelo = must(aplicarModificador(modelo, enlaceId, "no"));
    expect(aplicarSubtipoModificador(modelo, enlaceId, "no").ok).toBe(true);
  });

  test("crearInvocacion crea Proceso -> Proceso y rechaza objeto como origen", () => {
    let modelo = modeloBase();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 420, y: 80 }, "Validar"));

    const creado = crearInvocacion(modelo, modelo.opdRaizId, entidad(modelo, "Procesar"), entidad(modelo, "Validar"));
    expect(creado.ok).toBe(true);
    if (!creado.ok) return;
    const invocacion = Object.values(creado.value.enlaces).find((enlace) => enlace.tipo === "invocacion");
    expect(invocacion).toBeDefined();
    expect(invocacion?.origenId.id).toBe(entidad(modelo, "Procesar"));
    expect(invocacion?.destinoId.id).toBe(entidad(modelo, "Validar"));

    expect(crearInvocacion(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), entidad(modelo, "Validar")).ok).toBe(false);
  });

  test("demora se restringe a invocacion", () => {
    let modelo = modeloBase();
    const consumoId = enlacePorTipo(modelo, "consumo");
    expect(definirDemora(modelo, consumoId, "1s").ok).toBe(false);

    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 420, y: 80 }, "Validar"));
    modelo = must(crearInvocacion(modelo, modelo.opdRaizId, entidad(modelo, "Procesar"), entidad(modelo, "Validar")));
    const invocacionId = enlacePorTipo(modelo, "invocacion");
    modelo = must(definirDemora(modelo, invocacionId, "1s"));
    expect(modelo.enlaces[invocacionId]?.demora).toBe("1s");

    modelo = must(definirDemora(modelo, invocacionId, ""));
    expect(modelo.enlaces[invocacionId]?.demora).toBeUndefined();
  });

  test("crearAutoInvocacion crea invocacion al mismo proceso con demora default", () => {
    let modelo = modeloBase();
    const procesoId = entidad(modelo, "Procesar");

    modelo = must(crearAutoInvocacion(modelo, modelo.opdRaizId, procesoId));
    const auto = autoInvocacionDeProceso(modelo, modelo.opdRaizId, procesoId);

    expect(auto).toBeDefined();
    expect(auto?.tipo).toBe("invocacion");
    expect(auto?.origenId).toEqual(auto?.destinoId);
    expect(auto?.demora).toBe("1s");
    expect(auto ? esAutoInvocacion(auto) : false).toBe(true);
  });

  test("crearAutoInvocacion rechaza proceso inexistente, objeto y duplicado", () => {
    let modelo = modeloBase();
    const procesoId = entidad(modelo, "Procesar");
    const objetoId = entidad(modelo, "Entrada");

    expect(crearAutoInvocacion(modelo, modelo.opdRaizId, "p-inexistente").ok).toBe(false);
    expect(crearAutoInvocacion(modelo, modelo.opdRaizId, objetoId).ok).toBe(false);

    modelo = must(crearAutoInvocacion(modelo, modelo.opdRaizId, procesoId));
    const duplicado = crearAutoInvocacion(modelo, modelo.opdRaizId, procesoId);
    expect(duplicado.ok).toBe(false);
    if (!duplicado.ok) expect(duplicado.error).toContain("ya existe");
  });

  test("validarMetadatosEnlace protege combinaciones invalidas", () => {
    const modelo = modeloBase();
    const enlace = modelo.enlaces[enlacePorTipo(modelo, "consumo")];
    expect(enlace).toBeDefined();
    if (!enlace) return;

    expect(validarMetadatosEnlace({ ...enlace, probabilidad: 0.5 }).ok).toBe(false);
    expect(validarMetadatosEnlace({ ...enlace, modificador: "evento", probabilidad: 0.5 }).ok).toBe(true);
    expect(validarMetadatosEnlace({ ...enlace, modificador: "evento", probabilidad: 2 }).ok).toBe(false);
    expect(validarMetadatosEnlace({ ...enlace, modificador: "evento", subtipoModificador: "C" }).ok).toBe(false);
    expect(validarMetadatosEnlace({ ...enlace, modificador: "evento", subtipoModificador: "E" }).ok).toBe(true);
  });
});

function modeloBase(): Modelo {
  let modelo = crearModelo("Modificadores");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Entrada"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 80 }, "Procesar"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), entidad(modelo, "Procesar"), "consumo"));
  return modelo;
}

function entidad(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function enlacePorTipo(modelo: Modelo, tipo: string): string {
  const enlace = Object.values(modelo.enlaces).find((item) => item.tipo === tipo);
  if (!enlace) throw new Error(`Enlace no encontrado: ${tipo}`);
  return enlace.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
