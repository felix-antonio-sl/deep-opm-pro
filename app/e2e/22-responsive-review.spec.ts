/**
 * Smoke E2E ronda 21 L2 — Modo revisión mobile (390x844).
 *
 * Cubre los criterios del brief §7:
 * - A 390x844 no hay overflow horizontal > 8px en el body.
 * - La toolbar primaria de modelado pesado está oculta (cluster Modelar/
 *   Conectar/Vista/Validar). El cluster Modelo (chip + menú) sigue visible.
 * - Tabs `Canvas`, `OPDs`, `OPL`, `Issues` son visibles y se puede navegar
 *   entre ellas.
 * - Comentarios/notas (EPICA-42): no implementado en producción → el test
 *   registra `WARN: comentarios no disponibles` en consola, no falla.
 * - Desktop (1280x800) preserva la toolbar y los paneles existentes.
 */
import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible } from "./_smoke-helpers";

const VIEWPORT_MOBILE = { width: 390, height: 844 } as const;
const VIEWPORT_DESKTOP = { width: 1280, height: 800 } as const;

test.describe("mobile 390x844 — modo revisión sin toolbar saturada", () => {
  test.use({ viewport: VIEWPORT_MOBILE });

  test("no hay overflow horizontal > 8px en mobile", async ({ page }) => {
    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);

    const overflow = await page.evaluate(() => ({
      docScroll: document.documentElement.scrollWidth,
      docClient: document.documentElement.clientWidth,
      bodyScroll: document.body.scrollWidth,
      bodyClient: document.body.clientWidth,
    }));
    // Tolerancia 8px por subpixel y barras de scroll virtuales.
    expect(overflow.docScroll - overflow.docClient).toBeLessThanOrEqual(8);
    expect(overflow.bodyScroll - overflow.bodyClient).toBeLessThanOrEqual(8);
  });

  test("toolbar primaria de modelado pesado oculta a 390px", async ({ page }) => {
    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);

    const toolbarRoot = page.getByTestId("toolbar-root");
    await expect(toolbarRoot).toBeVisible();
    // Las acciones pesadas (Modelar/Conectar/Vista/Validar/Ayuda) viven en
    // toolbar-actions-pesadas; en mobile el componente las oculta.
    await expect(page.getByTestId("toolbar-actions-pesadas")).toHaveCount(0);
    // Modelar (Objeto, Proceso) no está visible.
    await expect(page.getByTestId("toolbar-drag-objeto")).toHaveCount(0);
    await expect(page.getByTestId("toolbar-drag-proceso")).toHaveCount(0);
  });

  test("4 tabs Canvas/OPDs/OPL/Issues visibles y navegables", async ({ page }) => {
    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);

    const nav = page.getByTestId("modo-revision-mobile");
    await expect(nav).toBeVisible();
    await expect(page.getByTestId("mobile-tab-canvas")).toBeVisible();
    await expect(page.getByTestId("mobile-tab-opds")).toBeVisible();
    await expect(page.getByTestId("mobile-tab-opl")).toBeVisible();
    await expect(page.getByTestId("mobile-tab-issues")).toBeVisible();

    // Por default, vista Canvas está activa: el canvas-pane es visible y
    // ningún overlay de panel está montado.
    await expect(page.getByTestId("canvas-pane")).toBeVisible();
    await expect(page.getByTestId("mobile-pane-opds")).toHaveCount(0);

    // Cambiar a OPDs: aparece el árbol como overlay.
    await page.getByTestId("mobile-tab-opds").click();
    await expect(page.getByTestId("mobile-pane-opds")).toBeVisible();
    await expect(page.getByTestId("tree-pane")).toBeVisible();

    // Cambiar a OPL.
    await page.getByTestId("mobile-tab-opl").click();
    await expect(page.getByTestId("mobile-pane-opl")).toBeVisible();
    await expect(page.getByTestId("opl-pane")).toBeVisible();

    // Cambiar a Issues: panel metodologia + aviso edicion.
    await page.getByTestId("mobile-tab-issues").click();
    await expect(page.getByTestId("mobile-pane-issues")).toBeVisible();
    await expect(page.getByTestId("mobile-aviso-edicion")).toBeVisible();
    await expect(page.getByTestId("mobile-aviso-edicion")).toContainText(
      "Editar en escritorio o tablet",
    );

    // Volver a Canvas: overlay desaparece, canvas sigue visible.
    await page.getByTestId("mobile-tab-canvas").click();
    await expect(page.getByTestId("mobile-pane-issues")).toHaveCount(0);
    await expect(page.getByTestId("canvas-pane")).toBeVisible();
  });

  test("EPICA-42 (comentarios/notas): no disponible → WARN no bloqueante", async ({ page }) => {
    // El brief §6 / §7 exige que si EPICA-42 no está implementada productivamente,
    // se deje un WARN explícito en lugar de un FAIL. Aquí no hay tab "Notas"
    // y no debe haberlo: las 4 tabs canónicas son Canvas/OPDs/OPL/Issues.
    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);
    const tabsCount = await page
      .getByTestId("modo-revision-mobile")
      .locator("[role=tab]")
      .count();
    if (tabsCount === 4) {
      // eslint-disable-next-line no-console
      console.log("WARN: comentarios no disponibles (EPICA-42 sin productizar)");
    }
    expect(tabsCount).toBe(4);
  });
});

test.describe("desktop 1280x800 — preserva toolbar y paneles existentes", () => {
  test.use({ viewport: VIEWPORT_DESKTOP });

  test("toolbar primaria, tree y opl siguen visibles", async ({ page }) => {
    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);

    await expect(page.getByTestId("toolbar-root")).toBeVisible();
    await expect(page.getByTestId("toolbar-actions-pesadas")).toBeVisible();
    await expect(page.getByTestId("toolbar-drag-objeto")).toBeVisible();
    await expect(page.getByTestId("toolbar-drag-proceso")).toBeVisible();
    await expect(page.getByTestId("tree-pane")).toBeVisible();
    await expect(page.getByTestId("inspector-pane")).toBeVisible();
    await expect(page.getByTestId("opl-pane")).toBeVisible();

    // El componente de tabs mobile NO debe montarse en desktop.
    await expect(page.getByTestId("modo-revision-mobile")).toHaveCount(0);
  });
});
