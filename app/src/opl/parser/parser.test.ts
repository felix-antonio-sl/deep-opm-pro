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

  test("aplica abanico de efecto desde objeto a procesos sin invertir el sujeto", () => {
    let modelo = crearModelo("reverse");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 90 }, "B"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "P"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 90 }, "Q"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 180 }, "R"));
    const texto = [
      ...generarOpl(modelo),
      "**B** afecta a exactamente uno de los procesos *P*, *Q* o *R*.",
    ].join("\n");

    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });
    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);
    expect(preview.patches.filter((patch) => patch.tipo === "crear-enlace" && patch.tipoEnlace === "efecto")).toHaveLength(3);
    expect(preview.patches).toContainEqual(expect.objectContaining({
      tipo: "crear-abanico",
      operador: "XOR",
      tipoEnlace: "efecto",
      procesoEsOrigen: true,
    }));

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    expect(Object.values(aplicado.abanicos ?? {})).toHaveLength(1);
    expect(generarOpl(aplicado)).toContain("**B** afecta a exactamente uno de los procesos *P*, *Q* o *R*.");
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

  test("evento ET-consumo aplica modificador 'evento' al enlace creado", () => {
    const modelo = crearModelo("reverse");
    const texto = [
      "**Producto** es un objeto informacional y sistémico.",
      "*Procesar* es un proceso informacional y sistémico.",
      "**Producto** inicia *Procesar*, que consume **Producto**.",
    ].join("\n");

    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });

    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);
    const patchEnlace = preview.patches.find((patch) => patch.tipo === "crear-enlace");
    if (!patchEnlace || patchEnlace.tipo !== "crear-enlace") throw new Error("esperaba patch crear-enlace");
    expect(patchEnlace.tipoEnlace).toBe("consumo");
    expect(patchEnlace.modificador).toBe("evento");

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    const enlaceEvento = Object.values(aplicado.enlaces).find((enlace) => enlace.tipo === "consumo");
    expect(enlaceEvento?.modificador).toBe("evento");
    expect(enlaceEvento?.subtipoModificador).toBe("E");
  });

  test("evento sin sub-clausula ('X inicia Y') aplica modificador evento sobre invocacion", () => {
    const modelo = crearModelo("reverse");
    const texto = [
      "*Disparador* es un proceso informacional y sistémico.",
      "*Tarea* es un proceso informacional y sistémico.",
      "*Disparador* inicia *Tarea*.",
    ].join("\n");

    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });

    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);
    const patchEnlace = preview.patches.find((patch) => patch.tipo === "crear-enlace");
    if (!patchEnlace || patchEnlace.tipo !== "crear-enlace") throw new Error("esperaba patch crear-enlace");
    expect(patchEnlace.tipoEnlace).toBe("invocacion");
    expect(patchEnlace.modificador).toBe("evento");

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    const enlaceInvocacion = Object.values(aplicado.enlaces).find((enlace) => enlace.tipo === "invocacion");
    expect(enlaceInvocacion?.modificador).toBe("evento");
  });

  test("evento ETS2 con transicion aplica modificador efecto (estado en endpoint via D1)", () => {
    // El objeto Pedido y sus estados se pre-crean: la oracion ETS2 solo agrega
    // el enlace `efecto` con modificador "evento". El estado del iniciador se
    // pasa como parte del extremo del enlace (D1), no como patch separado.
    let modelo = crearModelo("reverse");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    const pedido = entidad(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedido)).modelo;
    const [primero, segundo] = estadosDeEntidad(modelo, pedido);
    if (!primero || !segundo) throw new Error("setup sin estados");
    modelo = must(renombrarEstado(modelo, primero.id, "pendiente"));
    modelo = must(renombrarEstado(modelo, segundo.id, "aprobado"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Procesar"));

    const texto = [
      ...generarOpl(modelo),
      "**Pedido** en `pendiente` inicia *Procesar*, que cambia **Pedido** de `pendiente` a `aprobado`.",
    ].join("\n");

    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });

    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);
    const patchEvento = preview.patches.find(
      (patch) => patch.tipo === "crear-enlace" && patch.tipoEnlace === "efecto"
    );
    if (!patchEvento || patchEvento.tipo !== "crear-enlace") throw new Error("esperaba patch crear-enlace efecto");
    expect(patchEvento.modificador).toBe("evento");

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    const enlaceEvento = Object.values(aplicado.enlaces).find((enlace) => enlace.tipo === "efecto");
    expect(enlaceEvento?.modificador).toBe("evento");
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
