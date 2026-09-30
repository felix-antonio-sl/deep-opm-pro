import { expect, test, type Page } from "@playwright/test";
import { Buffer } from "node:buffer";
import { crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso } from "../src/modelo/operaciones";
import type { Modelo, Resultado } from "../src/modelo/tipos";
import { exportarModelo } from "../src/serializacion/json";
import { crearModeloNuevoDesdeMenu, guardarComoActual } from "./_smoke-helpers";

test("copiar una pieza conserva origen, materializa una identidad local y permite deshacer", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByTestId("login-email").fill("dev@opforja.local");
  await page.getByTestId("login-password").fill("opforja-dev-password");
  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("canvas-pane")).toBeVisible();
  await crearModeloNuevoDesdeMenu(page);
  await page.getByTestId("toolbar-drag-proceso").click();
  await page.getByLabel("Nombre").fill("Consumir recurso");
  await guardarComoActual(page, `Piezas ${Date.now()}`, "Revisión de copia reutilizable");

  const before = await snapshot(page);
  const source = sourceJson();
  await page.getByRole("button", { name: "Reutilizar pieza…", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Reutilizar pieza" });
  await dialog.getByLabel("Archivo de origen OPM JSON").setInputFiles({
    name: "biblioteca.json", mimeType: "application/json", buffer: Buffer.from(source.json, "utf8"),
  });
  await expect(dialog.getByText("Fuente: Biblioteca de piezas", { exact: false })).toBeVisible();
  await dialog.getByLabel("Pieza", { exact: true }).selectOption(source.pieceId);
  await dialog.getByLabel("Función que declara el autor").fill("Provee un recurso local independiente");
  await dialog.getByRole("button", { name: "Preparar propuesta", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "Declaración de origen" })).toBeVisible();
  await expect(dialog.getByText(/perfil entity-neighborhood@1/)).toBeVisible();
  await expect(dialog.getByText(/no demuestra equivalencia ni sustituibilidad/i)).toBeVisible();
  await expect(dialog.getByText("Límites de esta vista", { exact: true })).toBeVisible();
  expect(await snapshot(page)).toBe(before);
  await dialog.getByText("Ver diferencia OPD y OPL", { exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "Texto OPL por OPD" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("reusable-piece-copy-review.png") });

  await dialog.getByRole("button", { name: "Incorporar al documento" }).click();
  await expect(dialog.getByText("Pieza incorporada.", { exact: false })).toBeVisible();
  const incorporated = JSON.parse(await snapshot(page)) as { modelo: Modelo };
  const copyId = Object.keys(incorporated.modelo.pieceLineage ?? {})[0];
  expect(copyId).toBeDefined();
  if (!copyId) return;
  expect(copyId).not.toBe(source.pieceId);
  expect(incorporated.modelo.pieceLineage?.[copyId]?.lineage).toMatchObject([
    { identity: { modelId: "piece-library", pieceId: source.pieceId }, relation: "source" },
    { identity: { modelId: incorporated.modelo.id, pieceId: copyId }, relation: "copy" },
  ]);
  expect(Object.values(incorporated.modelo.estados).filter((state) => state.entidadId === copyId)).toHaveLength(2);

  await dialog.getByRole("button", { name: "Deshacer", exact: true }).click();
  await expect(dialog.getByText("Pieza incorporada.", { exact: false })).toHaveCount(0);
  const undone = JSON.parse(await snapshot(page)) as { modelo: Modelo };
  expect(undone.modelo.pieceLineage ?? {}).toEqual({});
  expect(Object.keys(undone.modelo.entidades)).toEqual(Object.keys(JSON.parse(before).modelo.entidades));
});

function sourceJson(): { json: string; pieceId: string } {
  let model = crearModelo("Biblioteca de piezas");
  model = { ...model, id: "piece-library" };
  model = must(crearObjeto(model, model.opdRaizId, { x: 80, y: 80 }, "Recurso"));
  const pieceId = Object.values(model.entidades).find((entity) => entity.nombre === "Recurso")!.id;
  model = must(crearEstadosIniciales(model, pieceId)).modelo;
  model = must(crearProceso(model, model.opdRaizId, { x: 300, y: 80 }, "Entregar recurso"));
  const processId = Object.values(model.entidades).find((entity) => entity.nombre === "Entregar recurso")!.id;
  model = must(crearEnlace(model, model.opdRaizId, { kind: "entidad", id: pieceId }, { kind: "entidad", id: processId }, "consumo"));
  return { json: exportarModelo(model), pieceId };
}

function must<T>(result: Resultado<T>): T {
  if (!result.ok) throw new Error(result.error);
  return result.value;
}

function snapshot(page: Page): Promise<string> {
  return page.evaluate(() => {
    const hook = (window as unknown as { __opmTest?: { exportarModeloActual(): string } }).__opmTest;
    if (!hook) throw new Error("Falta el lector de modelo DEV");
    return hook.exportarModeloActual();
  });
}
