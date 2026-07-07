import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial } from "./_smoke-helpers";

/**
 * Ronda 22 §7.10 — Command Palette como superficie discoverable.
 *
 * Cubre el contrato minimo: Ctrl+K abre, fuzzy search encuentra acciones
 * estaticas del MenuPrincipal, Enter ejecuta y Escape cierra.
 */

test("Ctrl+K abre palette, busca accion de menu y Enter la ejecuta", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await expect(palette).toHaveAttribute("data-ifml-stereotype", "Modal");
  await expect(palette.getByRole("combobox")).toBeFocused();

  await palette.getByRole("combobox").fill("tabla enlaces");
  await expect(page.getByTestId("command-palette-item-menu-tabla-enlaces")).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
  const tabla = page.getByTestId("tabla-enlaces");
  await expect(tabla).toBeVisible();
  await expect(tabla).toHaveAttribute("data-ifml-stereotype", "Modal");

  expect(pageErrors).toEqual([]);
});

test("Escape cierra Command Palette sin ejecutar accion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  await expect(page.getByTestId("command-palette")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
  await expect(page.getByTestId("tabla-enlaces")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("Command Palette abre Abrir / importar unificado", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("abrir importar");
  await expect(page.getByTestId("command-palette-item-menu-abrir-importar")).toBeVisible();

  await page.keyboard.press("Enter");
  const dialogo = page.getByRole("dialog", { name: "Modelos" });
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByLabel("Cargar modelo de ejemplo")).toHaveCount(0);
  await expect(dialogo.getByTestId("abrir-importar-json")).toHaveText("Importar JSON");

  expect(pageErrors).toEqual([]);
});

test("Command Palette no expone asistente, ejemplos ni plantillas", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();

  for (const query of ["asistente", "ejemplo", "plantilla"]) {
    await palette.getByRole("combobox").fill(query);
    await expect(palette).toContainText("¿Buscas algo del modelo? Prueba Ctrl+F");
    await expect(palette.getByRole("option")).toHaveCount(0);
  }

  expect(pageErrors).toEqual([]);
});

test("Command Palette abre Configuración consolidada", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("configuracion");
  await expect(page.getByTestId("command-palette-item-menu-configuracion")).toBeVisible();

  await page.keyboard.press("Enter");
  const dialogo = page.getByRole("dialog", { name: "Configuración" });
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByLabel("Nombre del modelo")).toBeVisible();
  await expect(dialogo.getByLabel("Paso")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("Command Palette ofrece Exportar OPL del modelo (Markdown) y copia todo el modelo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (texto: string) => {
          (window as Window & { __copiedOpl?: string }).__copiedOpl = texto;
        },
      },
    });
  });
  // Modelo con contenido para que el OPL no sea vacío.
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("OPL del modelo");
  const item = page.getByTestId("command-palette-item-menu-exportar-opl-modelo");
  await expect(item).toBeVisible();
  // M-1 (auditoría UX 2026-06-12): con query la lista es plana — sin secciones.
  await expect(palette.getByTestId("command-palette-section-resultados")).toContainText("Exportar OPL del modelo (Markdown)");

  await item.click();
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
  const copiado = await page.evaluate(() => (window as Window & { __copiedOpl?: string }).__copiedOpl ?? "");
  expect(copiado.startsWith("# ")).toBe(true); // título del modelo
  expect(copiado).toContain("## "); // al menos una sección por OPD
  expect(copiado).toContain("**Objeto**"); // el objeto creado, en Markdown
  expect(copiado).not.toContain("<"); // Markdown, nunca HTML

  expect(pageErrors).toEqual([]);
});

test("Command Palette ofrece Exportar diagnóstico (JSON) en EXPORTAR y lo ejecuta", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  // El clipboard real del navegador headless deniega writeText y emitiría un
  // pageerror; lo stubeamos para verificar el comando sin depender de permisos.
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();

  await palette.getByRole("combobox").fill("diagnostico");
  const item = page.getByTestId("command-palette-item-menu-exportar-diagnostico");
  await expect(item).toBeVisible();
  await expect(item).toContainText("Exportar diagnóstico (JSON)");
  // Vive bajo la sección EXPORTAR (enrutado por seccionVisualCommandPalette).
  // M-1 (auditoría UX 2026-06-12): con query la lista es plana — sin secciones.
  await expect(palette.getByTestId("command-palette-section-resultados")).toContainText("Exportar diagnóstico (JSON)");

  // Ejecutarlo copia al portapapeles (stub) y cierra el palette sin errores.
  await item.click();
  await expect(page.getByTestId("command-palette")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("Command Palette abre cheatsheet con estereotipo modal IFML", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("atajos teclado");
  await expect(page.getByTestId("command-palette-item-menu-atajos-teclado")).toBeVisible();

  await page.keyboard.press("Enter");
  const cheatsheet = page.getByTestId("cheatsheet-atajos");
  await expect(cheatsheet).toBeVisible();
  await expect(cheatsheet).toHaveAttribute("data-ifml-stereotype", "Modal");

  expect(pageErrors).toEqual([]);
});

test("Command Palette activa modo solo canvas 100% y Ctrl+Shift+M lo revierte", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("100 canvas");
  const item = page.getByTestId("command-palette-item-menu-solo-canvas");
  await expect(item).toBeVisible();
  await expect(item).toContainText("Modo solo canvas");

  await item.click();
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
  await expect(page.getByTestId("codex-frame")).toHaveAttribute("data-canvas-only", "true");
  await expect(page.getByTestId("canvas-pane")).toBeVisible();
  await expect(page.getByTestId("toolbar-root")).toHaveCount(0);
  await expect(page.getByTestId("opl-pane")).toHaveCount(0);
  await expect(page.getByTestId("inspector-pane")).toHaveCount(0);
  await expect(page.getByTestId("canvas-header")).toHaveCount(0);

  await page.keyboard.press("Control+Shift+M");
  await expect(page.getByTestId("codex-frame")).toHaveAttribute("data-canvas-only", "false");
  await expect(page.getByTestId("toolbar-root")).toBeVisible();
  await expect(page.getByTestId("opl-pane")).toBeVisible();
  await expect(page.getByTestId("inspector-pane")).toBeVisible();
  await expect(page.getByTestId("canvas-header")).toBeVisible();

  expect(pageErrors).toEqual([]);
});
