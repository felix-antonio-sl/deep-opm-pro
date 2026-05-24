import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible } from "./_smoke-helpers";

/**
 * Smoke ronda 27 III.A cierre — Chrome plano de 5 elementos.
 *
 * El veredicto jobs-web-ux original §III.A pide reducir el chrome al 70%:
 * eliminar 4 de los 9 grupos de menú existentes y aterrizar en 5 botones
 * planos:
 *   [☰ Modelo] [● Persistencia] [○ Objeto] [● Proceso] [⌕ Buscar (Ctrl+K)]
 *
 * Este spec verifica:
 * - El toolbar primario tiene exactamente 5 controles visibles sin
 *   selección (objetivo III.A original).
 * - El botón `⋯ Más` ya no existe — sus items canónicos migraron al
 *   menú principal `☰` (secciones Vista y Herramientas) y las acciones
 *   multi-selección viven en BarraHerramientasElemento.
 * - Los `data-testid` heredados (`toolbar-mas-*`) se preservan dentro del
 *   menú principal para que las 7 smokes históricas sigan funcionando
 *   apuntando al testId.
 * - No hay overflow horizontal del toolbar (1280x800 desktop estandar).
 */

test.use({ viewport: { width: 1280, height: 800 } });

test("toolbar plano III.A: exactamente 5 controles visibles sin selección, sin overflow", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  const toolbarRoot = page.getByTestId("toolbar-root");
  await expect(toolbarRoot).toBeVisible();

  // Contamos botones visibles dentro del toolbar-root. Sin selección el
  // chrome cierra III.A: ☰ · ChipPersistencia · Objeto · Proceso · Buscar.
  // (ChipPersistencia es un <button> con estado del autosalvado.)
  const conteo = await toolbarRoot.evaluate((root) => {
    const visibles = (el: Element) => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      const cs = getComputedStyle(el as HTMLElement);
      return rect.width > 0 && rect.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
    };
    const buttons = Array.from(root.querySelectorAll("button")).filter(visibles);
    const labels = buttons.map((b) => (b.textContent || "").trim().replace(/\s+/g, " "));
    return { total: buttons.length, labels };
  });

  // III.A original pide 5 elementos visibles planos. Sin selección activa,
  // el chrome cumple geometría exacta.
  expect(conteo.total).toBe(5);

  // No hay overflow horizontal: scrollWidth no debe exceder al clientWidth con
  // tolerancia minima (rounding subpixel) en viewport desktop estandar.
  const overflow = await toolbarRoot.evaluate((root) => {
    const target = root as HTMLElement;
    return { scrollWidth: target.scrollWidth, clientWidth: target.clientWidth };
  });
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);

  expect(pageErrors).toEqual([]);
});

test("toolbar omite rótulos redundantes de clusters de acción y conserva ⌕ Buscar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await expect(page.locator('[data-slot="cluster-modelar"] > span')).toHaveCount(0);
  await expect(page.locator('[data-slot="cluster-conectar"] > span')).toHaveCount(0);
  await expect(page.locator('[data-slot="cluster-ayuda"] > span')).toHaveCount(0);
  await expect(page.getByRole("group", { name: "Modelar" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Objeto", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Proceso", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Buscar comandos" })).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("III.A cierre: el botón ⋯ Más desaparece del chrome", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // Ronda 27 III.A cierre: el botón `⋯ Más` ya no existe en el chrome.
  await expect(page.getByTestId("toolbar-mas-trigger")).toHaveCount(0);
  await expect(page.getByTestId("toolbar-mas-menu")).toHaveCount(0);
  // El cluster Ayuda solo contiene `⌕ Buscar`.
  const ayuda = page.getByRole("group", { name: "Ayuda" });
  await expect(ayuda).toBeVisible();
  await expect(ayuda.getByRole("button")).toHaveCount(1);
  await expect(ayuda.getByTestId("toolbar-command-palette")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("menú principal absorbe los items del ⋯ Más en secciones Vista y Herramientas", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.getByLabel("Menú principal").click();
  const menu = page.getByRole("menu", { name: "Menú principal" });
  await expect(menu).toBeVisible();

  // Items canónicos heredados del ⋯ Más, ahora en `☰`. Preservan testId.
  await expect(menu.getByTestId("toolbar-mas-toggle-grid")).toBeVisible();
  await expect(menu.getByTestId("toolbar-mas-auto-layout")).toBeVisible();
  await expect(menu.getByTestId("toolbar-mas-biblioteca-dock")).toHaveCount(0);
  await expect(menu.getByTestId("toolbar-mas-mapa")).toHaveCount(0);
  await expect(menu.getByTestId("toolbar-mas-simulacion")).toBeVisible();
  await expect(menu.getByTestId("toolbar-mas-modo-imagen-global")).toBeVisible();

  // Labels de estado estables (alias visibles, descripciones visibles, etc.).
  await expect(menu.getByRole("menuitem", { name: "Alias visibles", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Descripciones visibles", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Cuadrícula visible", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Mapa del sistema", exact: true })).toHaveCount(0);
  await expect(menu.getByRole("menuitem", { name: "Auto-layout", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Simulación conceptual", exact: true })).toBeVisible();

  // Escape cierra y devuelve el control al botón ☰.
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("modo imagen global cicla desde `☰ → Vista` (preserva testId del legacy ⋯ Más)", async ({ page }) => {
  // Ronda 27 III.A cierre: el item Modo imagen global vive en `☰ →
  // Vista`. El click cierra el menú; al reabrir, el label refleja el
  // estado.
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.getByLabel("Menú principal").click();
  const itemModoImagen = page.getByTestId("toolbar-mas-modo-imagen-global");
  await expect(itemModoImagen).toBeVisible();
  await itemModoImagen.click();
  await expect(page.getByRole("menu", { name: "Menú principal" })).toHaveCount(0);
  await page.getByLabel("Menú principal").click();
  await expect(page.getByTestId("toolbar-mas-modo-imagen-global")).toContainText("imagen + nombre");
  await page.keyboard.press("Escape");

  expect(pageErrors).toEqual([]);
});

test("plantillas y configuración siguen viviendo en su sección canónica del menú principal", async ({ page }) => {
  // Ronda 25 L2 III.A: "Plantillas…" y "Configuración…" se eliminaron
  // del menú ⋯ Más por duplicación. Tras ronda 27 III.A cierre el botón
  // `⋯ Más` desapareció del chrome; verificamos que el menú principal
  // sigue siendo el contenedor canónico de ambos.
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.getByLabel("Menú principal").click();
  await page
    .getByRole("menu", { name: "Menú principal" })
    .getByRole("menuitem", { name: "Plantillas...", exact: true })
    .click();
  await expect(page.getByRole("dialog", { name: /[Pp]lantillas/ })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByLabel("Menú principal").click();
  await page
    .getByRole("menu", { name: "Menú principal" })
    .getByRole("menuitem", { name: "Configuración...", exact: true })
    .click();
  const dialogoConfig = page.getByTestId("modal-config-grid");
  await expect(dialogoConfig).toBeVisible();
  await dialogoConfig.getByRole("button", { name: "Cancelar" }).click();
  await expect(dialogoConfig).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("MenuPrincipal separa archivo, datos y herramientas sin duplicar el chrome", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.getByLabel("Menú principal").click();
  const menu = page.getByRole("menu", { name: "Menú principal" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Guardar", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Abrir / importar...", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Cargar otro...", exact: true })).toHaveCount(0);
  await expect(menu.getByRole("menuitem", { name: "Cargar archivados...", exact: true })).toHaveCount(0);
  await expect(menu.getByRole("menuitem", { name: "Nuevo", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Abrir como pestaña", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Renombrar...", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Configuración...", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Exportar OPD actual como SVG", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Importar/Exportar JSON...", exact: true })).toHaveCount(0);
  await expect(menu.getByRole("menuitem", { name: "Ejemplos", exact: true })).toHaveCount(0);
  await expect(menu.getByRole("menuitem", { name: "Tabla de enlaces", exact: true })).toBeVisible();
  // La función de mapa del sistema fue retirada del chrome; Simulación y
  // Auto-layout siguen como herramientas del menú principal.
  await expect(menu.getByRole("menuitem", { name: "Mapa del sistema", exact: true })).toHaveCount(0);
  await expect(menu.getByRole("menuitem", { name: "Simulación conceptual", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Auto-layout", exact: true })).toBeVisible();

  await menu.getByRole("menuitem", { name: "Abrir / importar...", exact: true }).click();
  const dialogoAbrir = page.getByRole("dialog", { name: "Abrir / importar modelo" });
  await expect(dialogoAbrir).toBeVisible();
  await expect(dialogoAbrir.getByLabel("Cargar modelo de ejemplo")).toBeVisible();
  await expect(dialogoAbrir.getByTestId("panel-json-abrir-importar").locator("summary")).toHaveText("JSON");
  await dialogoAbrir.getByRole("button", { name: "Cancelar" }).click();

  await page.getByLabel("Menú principal").click();
  await expect(menu).toBeVisible();
  await menu.getByRole("menuitem", { name: "Renombrar...", exact: true }).click();
  const dialogoConfig = page.getByRole("dialog", { name: "Configuración" });
  await expect(dialogoConfig).toBeVisible();
  await expect(dialogoConfig.getByLabel("Nombre del modelo")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("BUG-20260523T174915Z menu principal se cierra al hacer click fuera", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.getByLabel("Menú principal").click();
  const menu = page.getByRole("menu", { name: "Menú principal" });
  await expect(menu).toBeVisible();

  await page.mouse.click(720, 220);
  await expect(menu).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});
