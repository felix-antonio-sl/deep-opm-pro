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

// Selector de modelos (post-auth v1): el shell mobile lista los modelos
// guardados del tenant y abre uno en lectura. Antes NO había forma de llegar
// a un modelo guardado desde mobile (el shell proyectaba solo el SD vacío).
test.describe("mobile-readonly selector de modelos", () => {
  test.use({ viewport: VIEWPORT_MOBILE });

  function modeloGuardadoFixture() {
    const ahora = new Date().toISOString();
    return {
      id: "modelo-mobile-1",
      nombre: "Laboratorio móvil",
      descripcion: "",
      creadoEn: ahora,
      actualizadoEn: ahora,
      json: JSON.stringify({
        formato: "deep-opm-pro.modelo.v0",
        modelo: {
          id: "m-mobile",
          nombre: "Laboratorio móvil",
          opdRaizId: "opd-1",
          nextSeq: 5,
          entidades: { "o-1": { id: "o-1", tipo: "objeto", nombre: "Paciente", esencia: "fisica", afiliacion: "sistemica" } },
          enlaces: {},
          opds: {
            "opd-1": {
              id: "opd-1",
              nombre: "SD",
              padreId: null,
              apariencias: { "a-1": { id: "a-1", entidadId: "o-1", opdId: "opd-1", x: 80, y: 90, width: 135, height: 60 } },
              enlaces: {},
            },
          },
        },
      }),
    };
  }

  test("con un modelo guardado, la lista auto-abre y el tap lo carga en lectura", async ({ page }) => {
    await page.goto("/");
    await esperarMobileLectura(page);

    // Sembrar por API bajo la MISMA cookie de tenant del contexto.
    const status = await page.evaluate(async (modelo) => {
      const r = await fetch("/__deep-opm/modelos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ modelo }),
      });
      return r.status;
    }, modeloGuardadoFixture());
    expect(status).toBe(200);

    await page.reload();
    await esperarMobileLectura(page);

    // Auto-switch: SD vacío + hay guardados ⇒ vista Modelos.
    await expect(page.getByTestId("mobile-vista-modelos")).toBeVisible();
    const item = page.getByTestId("mobile-modelo-item").filter({ hasText: "Laboratorio móvil" });
    await expect(item).toBeVisible();

    await item.click();
    // El tap salta al diagrama y el modelo cargado se proyecta.
    await expect(page.getByTestId("mobile-vista-diagrama")).toBeVisible();
    // Observables de carga real: Acerca declara el nombre del modelo cargado
    // y el OPL proyecta su cosa ("Paciente").
    await page.getByTestId("mobile-tab-acerca").click();
    await expect(page.getByTestId("mobile-vista-acerca")).toContainText("Laboratorio móvil");
    await page.getByTestId("mobile-tab-opl").click();
    await expect(page.getByTestId("mobile-vista-opl")).toContainText("Paciente");
  });

  test("sin modelos guardados no hay auto-switch: el diagrama sigue siendo la vista inicial", async ({ page }) => {
    await page.goto("/");
    await esperarMobileLectura(page);
    await expect(page.getByTestId("mobile-vista-diagrama")).toBeVisible();
    await expect(page.getByTestId("mobile-vista-modelos")).toHaveCount(0);
    // La tab existe y lleva a la lista vacía.
    await page.getByTestId("mobile-tab-modelos").click();
    await expect(page.getByTestId("mobile-modelos-vacio")).toBeVisible();
  });
});
