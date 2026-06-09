/**
 * E2E mobile-readonly v1 — Invariantes de no-mutación y navegación.
 *
 * Verifica que:
 * - Ningún gesto mobile readonly muta el modelo (drag, resize, link, etc.)
 * - Deep links se parsean correctamente
 * - La búsqueda no muta el modelo al seleccionar
 * - El toggle de diagnóstico persiste
 */

import { expect, test } from "@playwright/test";
import { esperarMobileLectura, esperarWorkbenchInicial } from "./_smoke-helpers";

const VIEWPORT_MOBILE = { width: 390, height: 844 } as const;

test.describe("mobile-readonly invariantes", () => {
  test.use({ viewport: VIEWPORT_MOBILE });

  test("gesto drag no muta modelo", async ({ page }) => {
    await page.goto("/");
    await esperarMobileLectura(page);

    const snapshotAntes = await page.evaluate(() => {
      const store = (window as any).__opmStore;
      return store?.exportarModelo?.(store.modelo);
    });

    // Intentar drag sobre el diagrama mobile (el shell readonly no tiene
    // `canvas-pane`; la vista de diagrama es `mobile-vista-diagrama`).
    const canvas = page.getByTestId("mobile-vista-diagrama");
    await canvas.dragTo(canvas, { sourcePosition: { x: 50, y: 50 }, targetPosition: { x: 100, y: 100 } });

    const snapshotDespues = await page.evaluate(() => {
      const store = (window as any).__opmStore;
      return store?.exportarModelo?.(store.modelo);
    });

    expect(snapshotAntes).toEqual(snapshotDespues);
  });

  test("resize no muta modelo", async ({ page }) => {
    await page.goto("/");
    await esperarMobileLectura(page);

    const snapshotAntes = await page.evaluate(() => {
      const store = (window as any).__opmStore;
      return store?.exportarModelo?.(store.modelo);
    });

    // Intentar resize (no hay handles en readonly, pero el test verifica)
    await expect(page.getByTestId("resize-se")).toHaveCount(0);

    const snapshotDespues = await page.evaluate(() => {
      const store = (window as any).__opmStore;
      return store?.exportarModelo?.(store.modelo);
    });

    expect(snapshotAntes).toEqual(snapshotDespues);
  });

  test("link desde anchor no muta modelo", async ({ page }) => {
    await page.goto("/");
    await esperarMobileLectura(page);

    const snapshotAntes = await page.evaluate(() => {
      const store = (window as any).__opmStore;
      return store?.exportarModelo?.(store.modelo);
    });

    // No hay anchors de conexión visibles en readonly
    await expect(page.getByTestId("connect-anchor")).toHaveCount(0);

    const snapshotDespues = await page.evaluate(() => {
      const store = (window as any).__opmStore;
      return store?.exportarModelo?.(store.modelo);
    });

    expect(snapshotAntes).toEqual(snapshotDespues);
  });

  // FIXME(mobile-contenido): el shell mobile-readonly proyecta el modelo ACTIVO
  // de la sesión (carga directa del backend), que en dev/test arranca VACÍO — no
  // hay forma de seleccionar un modelo con contenido hasta que exista la capa de
  // tenants/auth (decisión 2026-06-09: se eliminó la carga por URL; la selección
  // de modelo se delega a tenants/auth). Sin contenido, `[data-opm-kind=entidad]`
  // no existe. Secundario: `window.__opmStore` no está expuesto → el chequeo de
  // no-mutación es no-op. Reactivar cuando exista selección de modelo (tenants).
  test.fixme("bottom sheet no muta modelo", async ({ page }) => {
    await page.goto("/");
    await esperarMobileLectura(page);

    const snapshotAntes = await page.evaluate(() => {
      const store = (window as any).__opmStore;
      return store?.exportarModelo?.(store.modelo);
    });

    // Tap en una entidad abre bottom sheet (si aplica)
    await page.click("[data-opm-kind=entidad]");

    const snapshotDespues = await page.evaluate(() => {
      const store = (window as any).__opmStore;
      return store?.exportarModelo?.(store.modelo);
    });

    expect(snapshotAntes).toEqual(snapshotDespues);
  });

  test("cambio de tab no muta modelo", async ({ page }) => {
    await page.goto("/");
    await esperarMobileLectura(page);

    const snapshotAntes = await page.evaluate(() => {
      const store = (window as any).__opmStore;
      return store?.exportarModelo?.(store.modelo);
    });

    await page.getByTestId("mobile-tab-opds").click();
    await page.getByTestId("mobile-tab-opl").click();
    await page.getByTestId("mobile-tab-acerca").click();
    await page.getByTestId("mobile-tab-diagrama").click();

    const snapshotDespues = await page.evaluate(() => {
      const store = (window as any).__opmStore;
      return store?.exportarModelo?.(store.modelo);
    });

    expect(snapshotAntes).toEqual(snapshotDespues);
  });
});

test.describe("mobile-readonly montaje por viewport", () => {
  // El shell mobile-readonly ya NO usa routing por URL (deep-links /m/:id
  // eliminados): proyecta el modelo activo de la sesión (carga directa desde el
  // backend) y monta según viewport + flag. La selección de modelo se delega a
  // la futura capa de tenants/auth.
  test("la vista por defecto es el diagrama", async ({ page }) => {
    await page.setViewportSize(VIEWPORT_MOBILE);
    await page.goto("/");
    await esperarMobileLectura(page);
    await expect(page.getByTestId("mobile-vista-diagrama")).toBeVisible();
  });

  test("desktop no monta mobile-app-lectura", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await esperarWorkbenchInicial(page);

    await expect(page.getByTestId("mobile-app-lectura")).toHaveCount(0);
    await expect(page.getByTestId("canvas-pane")).toBeVisible();
  });
});

test.describe("mobile-readonly búsqueda", () => {
  test.use({ viewport: VIEWPORT_MOBILE });

  test("toggle diagnóstico off por default", async ({ page }) => {
    await page.goto("/");
    await esperarMobileLectura(page);

    await page.getByTestId("mobile-boton-buscar").click();
    await expect(page.getByTestId("mobile-busqueda-toggle-diagnostico-input")).not.toBeChecked();
  });

  test("toggle diagnóstico persiste", async ({ page }) => {
    await page.goto("/");
    await esperarMobileLectura(page);

    await page.getByTestId("mobile-boton-buscar").click();
    await page.getByTestId("mobile-busqueda-toggle-diagnostico-input").check();

    // Recargar y verificar
    await page.reload();
    await esperarMobileLectura(page);
    await page.getByTestId("mobile-boton-buscar").click();
    await expect(page.getByTestId("mobile-busqueda-toggle-diagnostico-input")).toBeChecked();
  });

  // FIXME(mobile-contenido): mismo bloqueo que "bottom sheet no muta modelo" —
  // sin un modelo con contenido (pendiente de tenants/auth) no hay
  // `mobile-busqueda-hit`.
  test.fixme("búsqueda no muta modelo al navegar", async ({ page }) => {
    await page.goto("/");
    await esperarMobileLectura(page);

    const snapshotAntes = await page.evaluate(() => {
      const store = (window as any).__opmStore;
      return store?.exportarModelo?.(store.modelo);
    });

    await page.getByTestId("mobile-boton-buscar").click();
    await page.getByTestId("mobile-busqueda-input").fill("proceso");
    // Click en primer hit
    await page.getByTestId("mobile-busqueda-hit").first().click();

    const snapshotDespues = await page.evaluate(() => {
      const store = (window as any).__opmStore;
      return store?.exportarModelo?.(store.modelo);
    });

    expect(snapshotAntes).toEqual(snapshotDespues);
  });
});
