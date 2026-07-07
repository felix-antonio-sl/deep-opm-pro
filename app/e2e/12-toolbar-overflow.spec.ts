import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial, ejecutarComandoPalette } from "./_smoke-helpers";

/**
 * Smoke ronda 27 III.A cierre — Chrome plano de 5 elementos.
 *
 * El veredicto jobs-web-ux original §III.A pide reducir el chrome al 70%:
 * eliminar 4 de los 9 grupos de menú existentes y aterrizar en 5 botones
 * planos:
 *   [● Persistencia] [○ Objeto] [● Proceso] [Estado] [Relación]
 *
 * Este spec verifica:
 * - El toolbar primario tiene exactamente 7 controles visibles sin
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

test("toolbar plano Codex v1.1: creadores visibles sin selección, sin overflow", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  const toolbarRoot = page.getByTestId("toolbar-root");
  await expect(toolbarRoot).toBeVisible();

  // Contamos botones visibles dentro del toolbar-root. Codex v1.1 expone los
  // creadores inline y persistencia. La paleta de comandos ya no tiene botón
  // visible: se abre por Ctrl/Cmd+K.
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

  expect(conteo.total).toBe(5);
  expect(conteo.labels).toEqual([
    "●Sin guardar ⌃S",
    "ObjetoO",
    "ProcesoP",
    "EstadoS",
    "RelaciónR",
  ]);

  // No hay overflow horizontal: scrollWidth no debe exceder al clientWidth con
  // tolerancia minima (rounding subpixel) en viewport desktop estandar.
  const overflow = await toolbarRoot.evaluate((root) => {
    const target = root as HTMLElement;
    return { scrollWidth: target.scrollWidth, clientWidth: target.clientWidth };
  });
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);

  expect(pageErrors).toEqual([]);
});

test("toolbar omite rótulos redundantes y no duplica la paleta como botón", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await expect(page.locator('[data-slot="cluster-modelar"] > span')).toHaveCount(0);
  await expect(page.locator('[data-slot="cluster-conectar"] > span')).toHaveCount(0);
  await expect(page.locator('[data-slot="cluster-ayuda"]')).toHaveCount(0);
  await expect(page.getByRole("group", { name: "Modelar" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Objeto", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Proceso", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Buscar comandos" })).toHaveCount(0);
  await page.keyboard.press("Control+k");
  await expect(page.getByTestId("command-palette")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("III.A cierre: el botón ⋯ Más desaparece del chrome", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // Ronda 27 III.A cierre: el botón `⋯ Más` ya no existe en el chrome.
  await expect(page.getByTestId("toolbar-mas-trigger")).toHaveCount(0);
  await expect(page.getByTestId("toolbar-mas-menu")).toHaveCount(0);
  await expect(page.getByRole("group", { name: "Ayuda" })).toHaveCount(0);
  await expect(page.getByTestId("toolbar-command-palette")).toHaveCount(0);
  await expect(page.getByTestId("toolbar-menu")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("el command palette absorbe los comandos de vista (grid, auto-layout, simulación, modo imagen)", async ({ page }) => {
  // Ronda Codex v2 L5 (CRÍT-Comandos): el menú lateral se retiró. El atajo
  // abre el command palette `⌘K` (vía única de comandos). Verificamos que los
  // comandos de la antigua sección Vista están disponibles; biblioteca-dock y
  // mapa siguen ausentes.
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  const combobox = palette.getByRole("combobox");

  // El palette acota a 60 items sin filtro; tipamos una query por comando para
  // confirmar que cada uno está disponible (así lo encuentra el usuario real).
  const visiblePorQuery = async (query: string, itemId: string) => {
    await combobox.fill(query);
    await expect(palette.getByTestId(`command-palette-item-${itemId}`)).toBeVisible();
  };
  await visiblePorQuery("cuadricula", "menu-grid-canvas");
  await visiblePorQuery("auto layout", "menu-auto-layout");
  await visiblePorQuery("simulacion", "menu-simulacion-conceptual");
  await visiblePorQuery("imagen", "menu-modo-imagen-global");
  await visiblePorQuery("alias", "menu-alias-visibles");
  await visiblePorQuery("descripciones", "menu-descripciones-visibles");
  await combobox.fill("biblioteca dock");
  await expect(palette.getByText("Biblioteca dock", { exact: true })).toHaveCount(0);
  await combobox.fill("mapa del sistema");
  await expect(palette.getByText("Mapa del sistema", { exact: true })).toHaveCount(0);

  // Escape cierra sin depender de chrome visible.
  await page.keyboard.press("Escape");
  await expect(palette).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("modo imagen global cicla desde el command palette y refleja el estado en el label", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // Ronda Codex v2 L5: el comando "Imagen: …" cicla el modo global. Tras un
  // ciclo (null → imagen+nombre), el label refleja el nuevo estado.
  await ejecutarComandoPalette(page, "imagen", "menu-modo-imagen-global");
  await page.keyboard.press("Control+k");
  await expect(page.getByTestId("command-palette-item-menu-modo-imagen-global")).toContainText("imagen + nombre");
  await page.mouse.click(20, 20);
  await expect(page.getByTestId("command-palette")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("configuración se invoca desde el command palette y plantillas no aparece", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("plantillas");
  await expect(palette).toContainText("¿Buscas algo del modelo? Prueba Ctrl+F");
  await page.keyboard.press("Escape");

  await ejecutarComandoPalette(page, "configuracion", "menu-configuracion");
  const dialogoConfig = page.getByTestId("modal-config-grid");
  await expect(dialogoConfig).toBeVisible();
  await dialogoConfig.getByRole("button", { name: "Cancelar" }).click();
  await expect(dialogoConfig).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("el command palette es superset del antiguo menú: archivo, datos y herramientas", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // Ronda Codex v2 L5: el atajo abre el palette; sus comandos cubren las
  // acciones que el menú lateral exponía.
  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  const combobox = palette.getByRole("combobox");
  const visiblePorQuery = async (query: string, itemId: string) => {
    await combobox.fill(query);
    await expect(palette.getByTestId(`command-palette-item-${itemId}`)).toBeVisible();
  };
  await visiblePorQuery("nuevo modelo", "menu-nuevo-modelo");
  await visiblePorQuery("abrir importar", "menu-abrir-importar");
  await visiblePorQuery("abrir pestana", "menu-abrir-pestana");
  await visiblePorQuery("configuracion", "menu-configuracion");
  await visiblePorQuery("exportar opd png", "menu-exportar-opd-png");
  await visiblePorQuery("todos opds png", "menu-exportar-opds-png-zip");
  await visiblePorQuery("tabla de enlaces", "menu-tabla-enlaces");
  await visiblePorQuery("simulacion", "menu-simulacion-conceptual");
  await visiblePorQuery("auto layout", "menu-auto-layout");
  await combobox.fill("modo solo canvas");
  await expect(palette.getByTestId("command-palette-item-menu-solo-canvas")).toBeVisible();
  await expect(palette.getByRole("option")).toHaveCount(1);
  await combobox.fill("mapa del sistema");
  await expect(palette.getByText("Mapa del sistema", { exact: true })).toHaveCount(0);
  await page.keyboard.press("Escape");

  // "Abrir / importar" desde el palette abre el diálogo unificado.
  await ejecutarComandoPalette(page, "abrir importar", "menu-abrir-importar");
  const dialogoAbrir = page.getByRole("dialog", { name: "Abrir modelo" });
  await expect(dialogoAbrir).toBeVisible();
  await expect(dialogoAbrir.getByLabel("Cargar modelo de ejemplo")).toHaveCount(0);
  await expect(dialogoAbrir.getByTestId("abrir-importar-json")).toHaveText("Importar JSON");
  await dialogoAbrir.getByRole("button", { name: "Cancelar" }).click();

  expect(pageErrors).toEqual([]);
});

test("BUG-20260523T174915Z el command palette se cierra al hacer click fuera", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // Ronda Codex v2 L5: Ctrl/Cmd+K abre el palette; un click en el backdrop lo cierra.
  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();

  await page.mouse.click(20, 20);
  await expect(palette).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});
