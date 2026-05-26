import { expect, test } from "@playwright/test";
import {
  abrirDialogoCargarModelo,
  crearModeloNuevoDesdeMenu,
  esperarWorkbenchInicial,
  guardarComoActual,
} from "./_smoke-helpers";

// BUG-20260526T022611Z-679f28 — usabilidad de "Abrir modelo": acciones por fila.
// BUG-20260526T022658Z-142989 — claridad de variantes vs versiones en "Guardar como".

test("BUG-679f28: cada modelo expone menú de acciones (versiones, archivar, eliminar)", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await guardarComoActual(page, "Gestion modelo A", "Para gestión");
  await crearModeloNuevoDesdeMenu(page);

  const dialogo = await abrirDialogoCargarModelo(page);
  const toggle = dialogo.getByTestId("modelo-acciones-toggle").first();
  await expect(toggle).toBeVisible();
  await toggle.click();

  const menu = dialogo.getByTestId("modelo-acciones-menu");
  await expect(menu.getByRole("menuitem", { name: "Abrir en pestaña nueva" })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Ver versiones" })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Archivar" })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Eliminar…" })).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("BUG-679f28: eliminar desde el menú quita el modelo del catálogo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("dialog", (dialog) => dialog.accept());

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await guardarComoActual(page, "Modelo desechable", "Se elimina");
  await crearModeloNuevoDesdeMenu(page);

  const dialogo = await abrirDialogoCargarModelo(page);
  const tile = dialogo.getByTestId("modelo-tile-cargar").filter({ hasText: "Modelo desechable" });
  await expect(tile).toHaveCount(1);
  await tile.getByTestId("modelo-acciones-toggle").click();
  await dialogo.getByRole("menuitem", { name: "Eliminar…" }).click();

  await expect(dialogo.getByTestId("modelo-tile-cargar").filter({ hasText: "Modelo desechable" })).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

test("BUG-142989: Guardar como aclara variante vs versión y guía ante nombre duplicado", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await guardarComoActual(page, "Modelo existente", "Base");
  // Modelo nuevo (sin persistir) → Control+S abre "Guardar como".
  await crearModeloNuevoDesdeMenu(page);

  await page.keyboard.press("Control+S");
  const dialogo = page.getByRole("dialog", { name: "Guardar como" });
  await expect(dialogo).toBeVisible();

  const ayuda = dialogo.getByTestId("ayuda-variantes-versiones");
  await expect(ayuda).toContainText("Variante");
  await expect(ayuda).toContainText("Versión");

  await dialogo.getByLabel("Nombre del modelo").fill("Modelo existente");
  await expect(dialogo.getByRole("alert")).toContainText("variante independiente");

  await page.keyboard.press("Escape");
  await expect(dialogo).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});
