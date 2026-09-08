import { describe, expect, test } from "bun:test";
import {
  crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso,
  renombrarEstado,
} from "../../modelo/operaciones";
import { extremoEstado } from "../../modelo/extremos";
import { aplicarModificador } from "../../modelo/modificadores";
import { definirRutaEtiqueta } from "../../modelo/rutas";
import type { Resultado } from "../../modelo/tipos";
import { exportarModelo, hidratarModelo } from "../../serializacion/json";
import { generarOpl } from "../generar";
import { aplicarPatchesOpl, parsearParrafoOpl, planificarEdicionOplLibre } from ".";

function must<T>(result: Resultado<T>): T {
  if (!result.ok) throw new Error(result.error);
  return result.value;
}

describe("rutas OPL — conservación de etiquetas y extremos", () => {
  for (const route of ["rápida", "urgente, secundaria", "prioridad; revisión"]) {
    for (const modifier of [undefined, "condicion", "evento"] as const) {
      test(`OPD → OPL → modelo vacío → JSON → OPL: ${route} / ${modifier ?? "sin modificador"}`, () => {
        let source = crearModelo("rutas");
        source = must(crearObjeto(source, source.opdRaizId, { x: 0, y: 0 }, "Pedido"));
        const objectId = Object.keys(source.entidades)[0]!;
        const states = must(crearEstadosIniciales(source, objectId));
        source = must(renombrarEstado(states.modelo, states.estadoIds[0], "abierto"));
        source = must(renombrarEstado(source, states.estadoIds[1], "cerrado"));
        source = must(crearProceso(source, source.opdRaizId, { x: 200, y: 0 }, "Procesar"));
        const processId = Object.values(source.entidades).find((entity) => entity.nombre === "Procesar")!.id;
        source = must(crearEnlace(source, source.opdRaizId, extremoEstado(states.estadoIds[0]), processId, "consumo"));
        const linkId = Object.keys(source.enlaces)[0]!;
        if (modifier) source = must(aplicarModificador(source, linkId, modifier));
        source = must(definirRutaEtiqueta(source, linkId, route));
        const originalOpl = generarOpl(source);
        expect(originalOpl.some((sentence) => sentence.startsWith(`Por ruta ${route}, `))).toBe(true);

        const empty = crearModelo("recuperado");
        const preview = planificarEdicionOplLibre(empty, originalOpl.join("\n"), { opdActivoId: empty.opdRaizId });
        expect(preview.diagnosticos.filter((diagnostic) => diagnostic.severidad === "error")).toEqual([]);
        const applied = must(aplicarPatchesOpl(empty, preview.patches, empty.opdRaizId));
        const restored = must(hidratarModelo(exportarModelo(applied)));

        expect(Object.values(restored.entidades).map((entity) => entity.nombre).sort()).toEqual(["Pedido", "Procesar"]);
        expect(Object.values(restored.enlaces)).toHaveLength(1);
        expect(Object.values(restored.enlaces)[0]).toMatchObject({ tipo: "consumo", rutaEtiqueta: route });
        expect(Object.values(restored.enlaces)[0]?.modificador).toBe(modifier);
        expect(generarOpl(restored)).toEqual(originalOpl);
      });
    }
  }

  test("la coma dentro del nombre marcado del proceso no se confunde con el prefijo", () => {
    const parsed = parsearParrafoOpl("2. Por ruta urgente, secundaria, *Procesar, revisar* consume **Pedido** en `abierto`. [etiqueta: control]");
    expect(parsed.diagnosticos).toEqual([]);
    expect(parsed.ast[0]).toMatchObject({
      kind: "procedimental", proceso: "Procesar, revisar", objeto: "Pedido",
      estadoEntrada: "abierto", rutaEtiqueta: "urgente, secundaria", etiqueta: "control",
    });
  });

  test("las comillas de una ruta se leen antes de limpiar el markdown", () => {
    const parsed = parsearParrafoOpl("Por ruta `urgente, secundaria`, Procesar consume Pedido en `abierto`.");
    expect(parsed.diagnosticos).toEqual([]);
    expect(parsed.ast[0]).toMatchObject({
      kind: "procedimental", proceso: "Procesar", objeto: "Pedido", rutaEtiqueta: "urgente, secundaria",
    });
  });

  test("la multiplicidad no oculta el comienzo de la oración marcada", () => {
    const parsed = parsearParrafoOpl("Por ruta urgente, secundaria, 2 *Procesar* consume **Pedido** en `abierto`.");
    expect(parsed.diagnosticos).toEqual([]);
    expect(parsed.ast[0]).toMatchObject({
      kind: "procedimental", proceso: "Procesar", multiplicidadDestino: "2", rutaEtiqueta: "urgente, secundaria",
    });
  });

  test("la consecuencia no puede sustituir el estado de la guarda", () => {
    const empty = crearModelo("condición contradictoria");
    const preview = planificarEdicionOplLibre(empty, [
      "**Pedido** es un objeto informacional y sistémico.",
      "**Pedido** puede estar `abierto` o `cerrado`.",
      "*Procesar* es un proceso informacional y sistémico.",
      "Por ruta rápida, *Procesar* ocurre si **Pedido** está en `abierto`, en cuyo caso *Procesar* consume **Pedido** en `cerrado`, de lo contrario *Procesar* se omite.",
    ].join("\n"));
    expect(preview.diagnosticos.some((diagnostic) => diagnostic.severidad === "error")).toBe(true);
    expect(Object.keys(empty.entidades)).toHaveLength(0);
  });

  test("la negación aún sin reverse se informa, nunca se convierte en un nombre de proceso", () => {
    const parsed = parsearParrafoOpl("Por ruta urgente, secundaria, *Procesar* no consume **Pedido** en `abierto`.");
    expect(parsed.ast[0]?.kind).toBe("unsupported");
    expect(parsed.diagnosticos).toContainEqual(expect.objectContaining({ codigo: "unsupported-kernel", severidad: "error" }));
  });
});
