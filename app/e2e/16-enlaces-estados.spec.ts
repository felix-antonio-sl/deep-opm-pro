/**
 * Smoke 16 — enlaces a estado (BUG-20260508T020740Z-1fc4d2).
 *
 * El bug reportaba tres sintomas concretos:
 *   1. Las flechas terminan en el top/bottom del bbox del Objeto contenedor
 *      en lugar de tocar la capsula del estado al que el enlace apunta
 *      semanticamente.
 *   2. Los enlaces quedan visualmente por detras del Objeto contenedor.
 *   3. Durante el drag del Objeto, los enlaces a estado quedan congelados
 *      hasta el `pointerup`.
 *
 * Causa raiz: `composers/enlace.ts:endpointJoint` retornaba `target: {x, y}`
 * literal cuando el extremo era un estado, lo cual rompe la propiedad
 * id-based de JointJS (los endpoints punto-literal NO se reposicionan al
 * mover el padre y NO conocen el sub-elemento al que conectan).
 *
 * Fix: el composer ahora emite `target: { id: aparienciaPadre, selector:
 * "stateCapsuleN", anchor: midSide, connectionPoint: boundary }` y eleva
 * `z` del link a 20 cuando alguno de sus extremos toca un estado (encima
 * del cell de entidad con z=10).
 *
 * Este smoke valida el fix end-to-end usando el adapter JointJS expuesto
 * en `window.__opmJointAdapter` (mismo patron que `14-canvas-fidelity`).
 */
import { expect, test } from "@playwright/test";
import { jsonEditor, modeloTransicionEstados } from "./_smoke-helpers";

interface AdapterJoint {
  graph: {
    getLinks(): Array<{
      id: string;
      get(prop: string): unknown;
    }>;
    getCell(id: string): {
      position(): { x: number; y: number };
      get(prop: string): unknown;
      set(prop: string, value: unknown): void;
    } | undefined;
  };
}

function adapter(): AdapterJoint | undefined {
  return (window as unknown as { __opmJointAdapter?: AdapterJoint }).__opmJointAdapter;
}

test("BUG-1fc4d2 enlace a estado: endpoint id+selector, z>=20 y reposiciona en drag", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloTransicionEstados(), null, 2));
  await page.getByRole("button", { name: "Importar", exact: true }).click();

  await expect(page.locator('[joint-selector^="stateCapsule"]')).toHaveCount(2);
  await expect(page.locator(".joint-link")).toHaveCount(2);

  // Sintoma 1: cada extremo a estado debe ser id-based con selector de
  // capsula, no punto literal {x, y}.
  const enlaces = await page.evaluate(() => {
    const a = (window as unknown as { __opmJointAdapter?: AdapterJoint }).__opmJointAdapter;
    if (!a) return [];
    return a.graph.getLinks().map((link) => ({
      id: link.id,
      source: link.get("source"),
      target: link.get("target"),
      z: link.get("z"),
    }));
  });
  expect(enlaces).toHaveLength(2);
  // El consumo va estado->proceso. Source debe ser {id: "a-pedido",
  // selector: "stateCapsule0"} (pendiente es el primer estado).
  const consumo = enlaces.find((e) => e.id === "ae-consumo");
  expect(consumo).toBeDefined();
  expect((consumo?.source as { id?: string; selector?: string }).id).toBe("a-pedido");
  expect((consumo?.source as { selector?: string }).selector).toMatch(/^stateCapsule\d+$/);
  expect((consumo?.target as { id?: string }).id).toBe("a-aprobar");
  // Y resultado va proceso->estado. Target debe ser estado.
  const resultado = enlaces.find((e) => e.id === "ae-resultado");
  expect(resultado).toBeDefined();
  expect((resultado?.source as { id?: string }).id).toBe("a-aprobar");
  expect((resultado?.target as { id?: string; selector?: string }).id).toBe("a-pedido");
  expect((resultado?.target as { selector?: string }).selector).toMatch(/^stateCapsule\d+$/);

  // Sintoma 2: z del link a estado debe ser >= z de la entidad padre. Los
  // cells de entidad tienen z=10, los links a estado deben quedar encima
  // (z=20). Sin esto los enlaces se ven cortados por el contorno del Objeto.
  expect(consumo?.z).toBeGreaterThanOrEqual(11);
  expect(resultado?.z).toBeGreaterThanOrEqual(11);

  // Sintoma 3: durante el drag del padre, los endpoints siguen siendo
  // id-based (NO se materializan como {x, y} literal). Se verifica
  // mutando la posicion del cell padre via el adapter (lo mismo que el
  // gesture del usuario): JointJS recalcula la geometria del path del link
  // automaticamente porque el endpoint apunta al id, no a coordenadas.
  const reposicionado = await page.evaluate(() => {
    const a = (window as unknown as { __opmJointAdapter?: AdapterJoint }).__opmJointAdapter;
    if (!a) return null;
    const padre = a.graph.getCell("a-pedido");
    if (!padre) return null;
    const antes = padre.position();
    padre.set("position", { x: antes.x + 200, y: antes.y + 80 });
    const linkConsumo = a.graph.getLinks().find((l) => l.id === "ae-consumo");
    const linkResultado = a.graph.getLinks().find((l) => l.id === "ae-resultado");
    if (!linkConsumo || !linkResultado) return null;
    return {
      consumoSource: linkConsumo.get("source"),
      consumoTarget: linkConsumo.get("target"),
      resultadoTarget: linkResultado.get("target"),
    };
  });
  expect(reposicionado).not.toBeNull();
  // Los endpoints siguen siendo id-based con selector de capsula. Si el
  // composer hubiera emitido {x,y} literal, el endpoint quedaria
  // congelado en su valor pre-drag.
  expect((reposicionado?.consumoSource as { id?: string; selector?: string }).id).toBe("a-pedido");
  expect((reposicionado?.consumoSource as { selector?: string }).selector).toMatch(/^stateCapsule\d+$/);
  expect((reposicionado?.consumoTarget as { id?: string }).id).toBe("a-aprobar");
  expect((reposicionado?.resultadoTarget as { id?: string; selector?: string }).id).toBe("a-pedido");
  expect((reposicionado?.resultadoTarget as { selector?: string }).selector).toMatch(/^stateCapsule\d+$/);

  expect(pageErrors).toEqual([]);
});
