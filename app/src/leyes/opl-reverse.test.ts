import { describe, expect, test } from "bun:test";
import { crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, estadosDeEntidad, renombrarEstado } from "../modelo/operaciones";
import type { Modelo, Resultado } from "../modelo/tipos";
import { generarOpl } from "../opl/generar";
import { aplicarPatchesOpl, planificarEdicionOplLibre } from "../opl/parser";
import { exportarModelo } from "../serializacion/json";

describe("law-opl-safe-lens", () => {
  test("planificar no borra hechos por ausencia de linea", () => {
    const modelo = modeloConObjetoProcesoEstadosYConsumo();
    const pedidoId = entidadPorNombre(modelo, "Pedido");
    const lineas = generarOpl(modelo);
    const textoSinConsumo = lineas.filter((linea) => !linea.includes("consume")).join("\n");

    const preview = planificarEdicionOplLibre(modelo, textoSinConsumo, { opdActivoId: modelo.opdRaizId });

    expect(preview.diagnosticos).toContainEqual(expect.objectContaining({
      codigo: "no-delete-by-absence",
      severidad: "info",
    }));
    expect(preview.patches).toEqual([]);

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    expect(exportarModelo(aplicado)).toBe(exportarModelo(modelo));
    expect(Object.values(aplicado.enlaces).some((enlace) => enlace.tipo === "consumo")).toBe(true);
    expect(estadosDeEntidad(aplicado, pedidoId).map((estado) => estado.nombre)).toEqual(["pendiente", "aprobado"]);
  });

  test("preview no muta el modelo aunque proponga patches", () => {
    const modelo = modeloConObjetoProcesoEstadosYConsumo();
    const snapshot = exportarModelo(modelo);
    const texto = generarOpl(modelo)
      .join("\n")
      .replace("**Pedido** es un objeto informacional y sistémico.", "**Orden** es un objeto físico y ambiental.");

    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });

    expect(preview.diagnosticos.filter((diagnostico) => diagnostico.severidad === "error")).toEqual([]);
    expect(preview.patches.map((patch) => patch.tipo)).toEqual([
      "renombrar-entidad",
      "cambiar-esencia",
      "cambiar-afiliacion",
    ]);
    expect(exportarModelo(modelo)).toBe(snapshot);
  });

  test("apply preserva hechos omitidos cuando preview no trae patches destructivos", () => {
    const modelo = modeloConObjetoProcesoEstadosYConsumo();
    const consumoId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "consumo")?.id;
    if (!consumoId) throw new Error("La prueba esperaba enlace consumo");

    const textoEditado = generarOpl(modelo).filter((linea) => !linea.includes("consume")).join("\n");
    const preview = planificarEdicionOplLibre(modelo, textoEditado, { opdActivoId: modelo.opdRaizId });
    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));

    expect(aplicado.enlaces[consumoId]).toEqual(modelo.enlaces[consumoId]);
    expect(Object.keys(aplicado.entidades)).toEqual(Object.keys(modelo.entidades));
    expect(Object.keys(aplicado.estados)).toEqual(Object.keys(modelo.estados));
  });

  test("contexto jerarquico crea refinamiento idempotente sin sincronizar hijos destructivamente", () => {
    const modelo = modeloConObjetoProcesoEstadosYConsumo();
    const texto = "*Aprobar Pedido* se descompone en *Revisar* y *Cerrar*.";

    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });

    expect(preview.diagnosticos.filter((diagnostico) => diagnostico.severidad === "error")).toEqual([]);
    expect(preview.patches).toEqual([expect.objectContaining({
      tipo: "crear-refinamiento",
      familia: "descomposicion",
    })]);

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    const aprobar = entidadPorNombre(aplicado, "Aprobar Pedido");
    expect(aplicado.entidades[aprobar]?.refinamientos?.descomposicion?.opdId).toBeDefined();

    const segunda = planificarEdicionOplLibre(aplicado, texto, { opdActivoId: aplicado.opdRaizId });
    expect(segunda.patches).toEqual([]);
  });
});

function modeloConObjetoProcesoEstadosYConsumo(): Modelo {
  let modelo = crearModelo("Leyes OPL reverse");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 80 }, "Pedido"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 80 }, "Aprobar Pedido"));

  const pedidoId = entidadPorNombre(modelo, "Pedido");
  const aprobarId = entidadPorNombre(modelo, "Aprobar Pedido");
  const estados = must(crearEstadosIniciales(modelo, pedidoId));
  modelo = estados.modelo;
  modelo = must(renombrarEstado(modelo, estados.estadoIds[0]!, "pendiente"));
  modelo = must(renombrarEstado(modelo, estados.estadoIds[1]!, "aprobado"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, pedidoId, aprobarId, "consumo"));
  return modelo;
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
