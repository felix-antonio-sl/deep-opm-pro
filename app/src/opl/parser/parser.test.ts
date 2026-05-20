import { describe, expect, test } from "bun:test";
import { generarOpl } from "../generar";
import {
  aplicarPatchesOpl,
  parsearParrafoOpl,
  planificarEdicionOplLibre,
} from ".";
import {
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  estadosDeEntidad,
  renombrarEstado,
} from "../../modelo/operaciones";
import type { Modelo, Resultado } from "../../modelo/tipos";

describe("OPL reverse libre — parser SSOT alpha-lock", () => {
  test("parsea descripcion de cosa con markdown opcional y tildes OPL-ES", () => {
    const result = parsearParrafoOpl("1. **Conductor** es un objeto físico y sistémico.");

    expect(result.diagnosticos).toHaveLength(0);
    expect(result.ast[0]).toMatchObject({
      kind: "descripcion-cosa",
      nombre: "Conductor",
      tipoEntidad: "objeto",
      esencia: "fisica",
      afiliacion: "sistemica",
    });
  });

  test("planifica renombrado line-bound desde una descripcion editada", () => {
    let modelo = crearModelo("reverse");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Entrada"));

    const texto = generarOpl(modelo).join("\n").replace("Entrada", "Cliente");
    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });

    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);
    expect(preview.patches).toContainEqual({
      tipo: "renombrar-entidad",
      linea: 1,
      entidadId: entidad(modelo, "Entrada"),
      anterior: "Entrada",
      siguiente: "Cliente",
    });
  });

  test("aplica cambio de esencia y afiliacion sin mutar directo hasta el applicator", () => {
    let modelo = crearModelo("reverse");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Documento"));
    const texto = "**Documento** es un objeto físico y ambiental.";
    const preview = planificarEdicionOplLibre(modelo, texto);

    expect(preview.patches.map((patch) => patch.tipo)).toEqual(["cambiar-esencia", "cambiar-afiliacion"]);

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    const doc = aplicado.entidades[entidad(aplicado, "Documento")]!;
    expect(doc.esencia).toBe("fisica");
    expect(doc.afiliacion).toBe("ambiental");
  });

  test("crea entidad nueva desde oracion OPL valida", () => {
    const modelo = crearModelo("reverse");
    const texto = "**Cliente** es un objeto físico y ambiental.";
    const preview = planificarEdicionOplLibre(modelo, texto);

    expect(preview.patches).toContainEqual({
      tipo: "crear-entidad",
      linea: 1,
      nombre: "Cliente",
      entidadTipo: "objeto",
      esencia: "fisica",
      afiliacion: "ambiental",
    });

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    expect(Object.values(aplicado.entidades).some((item) => item.nombre === "Cliente")).toBe(true);
  });

  test("crea enlace procedural nuevo cuando los endpoints ya existen", () => {
    let modelo = crearModelo("reverse");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 180, y: 0 }, "Procesar"));
    const texto = [
      ...generarOpl(modelo),
      "*Procesar* consume **Entrada**.",
    ].join("\n");

    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });
    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);
    expect(preview.patches.some((patch) => patch.tipo === "crear-enlace" && patch.tipoEnlace === "consumo")).toBe(true);

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    expect(Object.values(aplicado.enlaces).some((enlace) => enlace.tipo === "consumo")).toBe(true);
    expect(generarOpl(aplicado)).toContain("*Procesar* consume **Entrada**.");
  });

  test("crea entidades y enlaces declarados en el mismo lote OPL", () => {
    const modelo = crearModelo("reverse");
    const texto = [
      "**Entrada** es un objeto informacional y sistémico.",
      "*Procesar* es un proceso informacional y sistémico.",
      "*Procesar* consume **Entrada**.",
    ].join("\n");

    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });

    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);
    expect(preview.patches.map((patch) => patch.tipo)).toEqual([
      "crear-entidad",
      "crear-entidad",
      "crear-enlace",
    ]);

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    expect(Object.values(aplicado.entidades).some((entidad) => entidad.nombre === "Entrada")).toBe(true);
    expect(Object.values(aplicado.entidades).some((entidad) => entidad.nombre === "Procesar")).toBe(true);
    expect(Object.values(aplicado.enlaces).some((enlace) => enlace.tipo === "consumo")).toBe(true);
    expect(generarOpl(aplicado)).toContain("*Procesar* consume **Entrada**.");
  });

  test("resuelve referencias editadas al nuevo nombre dentro del mismo lote OPL", () => {
    let modelo = crearModelo("reverse");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 180, y: 0 }, "Procesar"));
    const texto = [
      "**Cliente** es un objeto informacional y sistémico.",
      "*Procesar* es un proceso informacional y sistémico.",
      "*Procesar* consume **Cliente**.",
    ].join("\n");

    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });

    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);
    expect(preview.patches.map((patch) => patch.tipo)).toEqual([
      "renombrar-entidad",
      "crear-enlace",
    ]);

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    expect(generarOpl(aplicado)).toContain("*Procesar* consume **Cliente**.");
  });

  test("sincroniza estados por posicion y agrega estados nuevos sin borrar por ausencia", () => {
    let modelo = crearModelo("reverse");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    const pedido = entidad(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedido)).modelo;
    const [primero, segundo] = estadosDeEntidad(modelo, pedido);
    if (!primero || !segundo) throw new Error("setup sin estados");
    modelo = must(renombrarEstado(modelo, primero.id, "pendiente"));
    modelo = must(renombrarEstado(modelo, segundo.id, "cerrado"));

    const texto = generarOpl(modelo).join("\n").replace("`pendiente` o `cerrado`", "`abierto`, `en curso` o `cerrado`");
    const preview = planificarEdicionOplLibre(modelo, texto);
    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));

    expect(estadosDeEntidad(aplicado, pedido).map((estado) => estado.nombre)).toEqual(["abierto", "en curso", "cerrado"]);
  });

  test("diagnostica contexto parseado pero no aplica refinamientos desde texto libre", () => {
    const result = parsearParrafoOpl("*Proceso* se descompone en *Paso A* y *Paso B*.");

    expect(result.ast[0]).toMatchObject({ kind: "contexto", familia: "descomposicion" });
    expect(result.diagnosticos[0]).toMatchObject({ codigo: "unsupported-kernel", severidad: "warning" });
  });
});

function entidad(modelo: Modelo, nombre: string): string {
  const encontrada = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!encontrada) throw new Error(`No existe entidad ${nombre}`);
  return encontrada.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
