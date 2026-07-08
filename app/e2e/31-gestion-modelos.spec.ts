import { expect, test } from "@playwright/test";
import {
  abrirDialogoCargarModelo,
  crearModeloNuevoDesdeMenu,
  ejecutarComandoPalette,
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
  const tile = dialogo.getByTestId("modelo-fila-cargar").filter({ hasText: "Modelo desechable" });
  await expect(tile).toHaveCount(1);
  await tile.getByTestId("modelo-acciones-toggle").click();
  await dialogo.getByRole("menuitem", { name: "Eliminar…" }).click();

  await expect(dialogo.getByTestId("modelo-fila-cargar").filter({ hasText: "Modelo desechable" })).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

// Higiene del gestor «Abrir modelo» (spec 2026-07-06-chrome-gestion-design §1):
// buscador único, sidebar con carpetas, estado vacío con CTA, eliminar nombrado,
// drag de tile a carpeta.

test("higiene: el gestor «Abrir modelo» tiene exactamente un buscador", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  // Con al menos un modelo, la barra de catálogo (con el buscador) se muestra;
  // es el estado poblado donde vivía el m-2 de los dos buscadores apilados.
  await guardarComoActual(page, "Modelo con buscador", "seed");
  const dialogo = await abrirDialogoCargarModelo(page);

  await expect(dialogo.locator('input[type="search"]')).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("higiene: con cero modelos el estado vacío ofrece «Nuevo modelo» e «Importar JSON»", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  // Contexto Playwright fresco = tenant aislado sin modelos guardados.
  const dialogo = await abrirDialogoCargarModelo(page);

  const vacio = dialogo.getByTestId("gestor-vacio");
  await expect(vacio).toBeVisible();
  // «Todo nace apunte» (diseño §3): el CTA del vacío pasó de «Nuevo modelo» a «Nuevo».
  await expect(vacio.getByRole("button", { name: "Nuevo", exact: true })).toBeVisible();
  await expect(vacio.getByRole("button", { name: "Importar JSON" })).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("higiene: eliminar desde el menú de fila confirma nombrando el modelo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  let mensajeConfirm = "";
  page.on("dialog", (dialog) => {
    mensajeConfirm = dialog.message();
    void dialog.accept();
  });

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await guardarComoActual(page, "Modelo con nombre único", "para eliminar");
  await crearModeloNuevoDesdeMenu(page);

  const dialogo = await abrirDialogoCargarModelo(page);
  const tile = dialogo.getByTestId("modelo-fila-cargar").filter({ hasText: "Modelo con nombre único" });
  await expect(tile).toHaveCount(1);
  await tile.getByTestId("modelo-acciones-toggle").click();
  await dialogo.getByRole("menuitem", { name: "Eliminar…" }).click();

  await expect(dialogo.getByTestId("modelo-fila-cargar").filter({ hasText: "Modelo con nombre único" })).toHaveCount(0);
  expect(mensajeConfirm).toContain("Modelo con nombre único");
  expect(pageErrors).toEqual([]);
});

test("higiene: arrastrar un tile a una carpeta de la sidebar persiste el movimiento", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await guardarComoActual(page, "Modelo movible", "para mover");

  const dialogo = await abrirDialogoCargarModelo(page);

  // Crear una carpeta desde el pie de la sidebar.
  await dialogo.getByRole("button", { name: "+ Nueva carpeta" }).click();
  const inputCarpeta = dialogo.getByPlaceholder("Nombre de carpeta");
  await inputCarpeta.fill("Destino");
  await inputCarpeta.press("Enter");
  await expect(dialogo.getByTestId("gestor-sidebar-carpeta")).toHaveText("Destino");

  const tile = dialogo.getByTestId("modelo-fila-cargar").filter({ hasText: "Modelo movible" });
  await expect(tile).toHaveCount(1);

  // Drag HTML5 con un DataTransfer compartido entre dragstart y drop: es el
  // contrato que `handlersDragDrop` espera (el mouse-drag de Playwright no
  // transporta el dataTransfer).
  await page.evaluate(() => {
    const dt = new DataTransfer();
    const tileEl = [...document.querySelectorAll('[data-testid="modelo-fila-cargar"]')]
      .find((el) => el.textContent?.includes("Modelo movible"));
    const folderEl = document.querySelector('[data-testid="gestor-sidebar-carpeta"]');
    if (!tileEl || !folderEl) throw new Error("no se encontraron tile o carpeta");
    tileEl.dispatchEvent(new DragEvent("dragstart", { bubbles: true, dataTransfer: dt }));
    folderEl.dispatchEvent(new DragEvent("dragover", { bubbles: true, cancelable: true, dataTransfer: dt }));
    folderEl.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: dt }));
  });

  // Salió de «Todas» (raíz) …
  await expect(dialogo.getByTestId("modelo-fila-cargar").filter({ hasText: "Modelo movible" })).toHaveCount(0);
  // … y aparece al abrir la carpeta destino.
  await dialogo.getByTestId("gestor-sidebar-carpeta").click();
  await expect(dialogo.getByTestId("modelo-fila-cargar").filter({ hasText: "Modelo movible" })).toHaveCount(1);

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

test("BUG-20260602T014326Z-6ce450: Guardar como no bloquea el nombre del modelo actual", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await guardarComoActual(page, "HODOM completo v14", "Base");

  await ejecutarComandoPalette(page, "guardar como", "menu-guardar-como");
  const dialogo = page.getByRole("dialog", { name: "Guardar como" });
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByLabel("Nombre del modelo")).toHaveValue("HODOM completo v14");
  await expect(dialogo.getByRole("button", { name: "Guardar" })).toBeEnabled();

  await dialogo.getByLabel("Descripción").fill("Actualizado desde Guardar como");
  await dialogo.getByRole("button", { name: "Guardar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "local-clean");

  const abrir = await abrirDialogoCargarModelo(page);
  await expect(abrir.getByTestId("modelo-fila-cargar").filter({ hasText: "HODOM completo v14" })).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});
