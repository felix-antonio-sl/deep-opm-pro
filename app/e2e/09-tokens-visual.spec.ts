import { expect, test } from "@playwright/test";

// [JOYAS §1-3] Snapshot smoke L2: tokens visuales para toolbar/inspector/dialogo.

test("L2 snapshot visual de toolbar e inspector tras migrar tokens", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByTestId("toolbar-root")).toBeVisible();
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  await expect(page.getByTestId("inspector-pane")).toBeVisible();
  await page.getByTestId("toolbar-root").screenshot({ path: "test-results/l2-tokens-toolbar.png" });
  await page.getByTestId("inspector-pane").screenshot({ path: "test-results/l2-tokens-inspector.png" });
  expect(pageErrors).toEqual([]);
});

test("L2 snapshot visual de dialogo tras migrar tokens", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Cargar", exact: true }).first().click();
  const dialogo = page.getByRole("dialog", { name: "Cargar modelo" });

  await expect(dialogo).toBeVisible();
  await dialogo.screenshot({ path: "test-results/l2-tokens-dialogo.png" });
  expect(pageErrors).toEqual([]);
});
