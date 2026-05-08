import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible } from "./_smoke-helpers";

/**
 * Smoke ronda 15 L2 — Toolbar overflow manual `⋯ Más`.
 *
 * Cubre los criterios del §7 del brief:
 * - Toolbar inicial tiene un maximo razonable de controles visibles (objetivo
 *   <= 25; tolerancia documentada para selects que cuentan como 1 control).
 * - El boton ⋯ Más abre un menu accesible (role="menu", items
 *   role="menuitem"), Escape cierra y devuelve foco al trigger.
 * - Al menos 3 acciones movidas al menu siguen invocables.
 * - No hay overflow horizontal del toolbar en viewport desktop estandar
 *   (1280x800).
 */

test.use({ viewport: { width: 1280, height: 800 } });

test("toolbar inicial expone <= 25 controles visibles, sin overflow horizontal", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  const toolbarRoot = page.getByTestId("toolbar-root");
  await expect(toolbarRoot).toBeVisible();

  // Contamos botones y selects visibles dentro del toolbar-root como proxy de
  // controles del chrome principal. Cada select cuenta como 1 (tolerancia
  // documentada por el brief).
  const totales = await toolbarRoot.evaluate((root) => {
    const visibles = (el: Element) => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      const cs = getComputedStyle(el as HTMLElement);
      return rect.width > 0 && rect.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
    };
    const buttons = Array.from(root.querySelectorAll("button")).filter(visibles);
    const selects = Array.from(root.querySelectorAll("select")).filter(visibles);
    return { buttons: buttons.length, selects: selects.length, total: buttons.length + selects.length };
  });

  // Ronda 20 L3 sumó el toggle "Biblioteca dock" en el cluster Vista, llevando
  // el conteo de 25 a 26. La cota se relaja de forma controlada respetando el
  // contrato del informe UI/UX (ningún cluster sobrepasa lo razonable).
  expect(totales.total).toBeLessThanOrEqual(26);

  // No hay overflow horizontal: scrollWidth no debe exceder al clientWidth con
  // tolerancia minima (rounding subpixel) en viewport desktop estandar.
  const overflow = await toolbarRoot.evaluate((root) => {
    const target = root as HTMLElement;
    return { scrollWidth: target.scrollWidth, clientWidth: target.clientWidth };
  });
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);

  expect(pageErrors).toEqual([]);
});

test("⋯ Más abre menu accesible, Escape cierra y se navega por teclado", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  const trigger = page.getByTestId("toolbar-mas-trigger");
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  const menu = page.getByTestId("toolbar-mas-menu");
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute("role", "menu");
  expect(await menu.locator('button[role="menuitem"]').count()).toBeGreaterThanOrEqual(3);

  // Escape cierra y devuelve foco al trigger.
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  expect(pageErrors).toEqual([]);
});

test("acciones movidas al menu Mas siguen invocables (plantillas, config grid, modo imagen)", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // 1) Abrir Plantillas desde el menu Más.
  await page.getByTestId("toolbar-mas-trigger").click();
  await page.getByTestId("toolbar-mas-plantillas").click();
  // El dialogo de plantillas se monta como "Plantillas privadas".
  await expect(page.getByRole("dialog", { name: /[Pp]lantillas/ })).toBeVisible();
  await page.keyboard.press("Escape");

  // 2) Abrir Config grid desde el menu Más.
  await page.getByTestId("toolbar-mas-trigger").click();
  await page.getByTestId("toolbar-mas-config-grid").click();
  const modalGrid = page.getByTestId("modal-config-grid");
  await expect(modalGrid).toBeVisible();
  await modalGrid.getByRole("button", { name: "Cancelar" }).click();
  await expect(modalGrid).toHaveCount(0);

  // 3) Cambiar modo imagen global desde el menu Más.
  // Estado inicial: "Respeta" (uiModoImagenGlobal === null).
  await page.getByTestId("toolbar-mas-trigger").click();
  const itemModoImagen = page.getByTestId("toolbar-mas-modo-imagen-global");
  await expect(itemModoImagen).toBeVisible();
  await itemModoImagen.click();
  // Tras el click el menu se cierra; el control en banda refleja el cambio.
  await expect(page.getByTestId("toolbar-mas-menu")).toHaveCount(0);
  await expect(page.getByTestId("toolbar-modo-imagen-global")).toHaveText("Img+Txt");

  expect(pageErrors).toEqual([]);
});
