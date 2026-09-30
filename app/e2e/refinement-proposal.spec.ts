import { expect, test, type Page } from "@playwright/test";
import { crearModeloNuevoDesdeMenu, guardarComoActual } from "./_smoke-helpers";

test("preparar un refinamiento conserva el modelo hasta incorporar y permite deshacerlo", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByTestId("login-email").fill("dev@opforja.local");
  await page.getByTestId("login-password").fill("opforja-dev-password");
  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("canvas-pane")).toBeVisible();
  await crearModeloNuevoDesdeMenu(page);
  await page.getByTestId("toolbar-drag-proceso").click();
  await page.getByLabel("Nombre").fill("Reparto");
  await guardarComoActual(page, `Refinamiento ${Date.now()}`, "Propuesta humana reversible");
  const before = await snapshot(page);
  await page.getByRole("button", { name: "Proponer refinamiento…", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Proponer refinamiento" });
  await dialog.getByLabel("Pregunta que debe responder").fill("¿Cómo se realiza el reparto?");
  await dialog.getByLabel("Justificación del nuevo nivel").fill("Detallar sus pasos sin cambiar las declaraciones del nivel superior");
  await dialog.getByRole("button", { name: "Preparar propuesta", exact: true }).click();
  await expect(dialog.getByText(/La propuesta conserva/)).toBeVisible();
  expect(await snapshot(page)).toBe(before);
  await dialog.getByText("Ver diferencia OPD y OPL", { exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "Texto OPL por OPD" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("refinement-proposal.png") });
  await dialog.getByRole("button", { name: "Incorporar al documento" }).click();
  await expect(dialog.getByText("Refinamiento incorporado.", { exact: false })).toBeVisible();
  const incorporated = JSON.parse(await snapshot(page)) as { modelo: { opds: Record<string, unknown> } };
  expect(Object.keys(incorporated.modelo.opds)).toHaveLength(2);
  await dialog.getByRole("button", { name: "Deshacer refinamiento", exact: true }).click();
  await expect(dialog.getByText("Refinamiento incorporado.", { exact: false })).toHaveCount(0);
  const undone = JSON.parse(await snapshot(page)) as { modelo: { opds: Record<string, unknown>; entidades: Record<string, unknown> } };
  expect(Object.keys(undone.modelo.opds)).toHaveLength(1);
  expect(undone.modelo.entidades).toEqual(JSON.parse(before).modelo.entidades);
});

function snapshot(page: Page): Promise<string> {
  return page.evaluate(() => {
    const hook = (window as unknown as { __opmTest?: { exportarModeloActual(): string } }).__opmTest;
    if (!hook) throw new Error("Falta el lector de modelo DEV");
    return hook.exportarModeloActual();
  });
}
