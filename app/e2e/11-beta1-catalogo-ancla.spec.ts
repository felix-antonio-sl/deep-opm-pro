import { expect, test } from "@playwright/test";
import {
  cerrarPantallaInicioSiVisible,
  elementoPorTexto,
  exportadoActual,
  jsonEditor,
} from "./_smoke-helpers";

/**
 * Beta1 ronda 16 L4 — catalogo simple + ancla pedagogica.
 *
 * Verifica el slice minimo shippeable §6 del brief:
 *   1) el catalogo simple lista el ancla "Prestamo Bibliotecario" como entrada
 *      seleccionable (decision: distinguir demos pedagogicas vs anclas reales
 *      via campo `categoria` en `FixtureDemo`; este smoke ejerce la presencia
 *      sin asumir UI dedicada de filtro);
 *   2) cargar el ancla -> exportar JSON -> reimportar JSON observa los mismos
 *      conteos (entidades, OPDs, enlaces, estados), cubriendo el criterio §174.6
 *      del HANDOFF ("guarda y carga sin perdida") sobre la superficie de
 *      persistencia existente (PersistenciaJson en Inspector vacio).
 *
 * Politica viva: tokens-only para chrome (no se introduce UI nueva); este
 * smoke no debe colisionar con L1/L2/L3 (no toca TablaEnlaces, busqueda,
 * checkers ni paneles de metodologia).
 */

test.describe("beta1 catalogo + ancla", () => {
  test("catalogo lista anclas pedagogicas Beta1 (Prestamo Bibliotecario, Comprar Pan)", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    const selector = page.getByLabel("Cargar modelo de ejemplo");
    await expect(selector).toBeVisible();

    const optPrestamo = selector.locator("option").filter({ hasText: /^Prestamo Bibliotecario$/ });
    const optPan = selector.locator("option").filter({ hasText: /^Comprar Pan$/ });
    await expect(optPrestamo).toHaveCount(1);
    await expect(optPan).toHaveCount(1);

    expect(pageErrors).toEqual([]);
  });

  test("ancla Prestamo Bibliotecario se carga y expone OPL del SD raiz", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await page.getByLabel("Cargar modelo de ejemplo").selectOption("Prestamo Bibliotecario");

    // El canvas dibuja el SD raiz: al menos el proceso central + biblioteca + libro visibles.
    await expect(page.locator(".joint-paper svg")).toHaveCount(1);
    expect(await page.locator(".joint-element").count()).toBeGreaterThanOrEqual(3);

    // Texto del SD raiz visible en canvas. El árbol OPD también contiene esos
    // nombres, pero puede estar fuera del viewport por la nueva navegación primaria.
    await expect(elementoPorTexto(page, "Procesar Prestamo")).toBeVisible();
    await expect(elementoPorTexto(page, "Bibliotecario")).toBeVisible();
    await expect(elementoPorTexto(page, "Libro")).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test("ancla Prestamo Bibliotecario hace round-trip exportar->reimportar sin perdida", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);
    await page.getByLabel("Cargar modelo de ejemplo").selectOption("Prestamo Bibliotecario");
    await expect(elementoPorTexto(page, "Procesar Prestamo")).toBeVisible();

    // Snapshot inicial via Exportar.
    const exportadoOriginal = await exportadoActual(page);
    const conteosOriginales = {
      entidades: Object.keys(exportadoOriginal.modelo.entidades).length,
      enlaces: Object.keys(exportadoOriginal.modelo.enlaces).length,
      opds: Object.keys(exportadoOriginal.modelo.opds).length,
      estados: Object.keys(exportadoOriginal.modelo.estados ?? {}).length,
    };
    // El ancla debe satisfacer el slice minimo: multi-OPD (>=3), estados (>=3),
    // varios enlaces (>=6).
    expect(conteosOriginales.opds).toBeGreaterThanOrEqual(3);
    expect(conteosOriginales.estados).toBeGreaterThanOrEqual(3);
    expect(conteosOriginales.enlaces).toBeGreaterThanOrEqual(6);

    // Snapshot del JSON exportado (textarea-json contiene la cadena lista para reimportar).
    const jsonOriginal = await jsonEditor(page).inputValue();
    expect(jsonOriginal.length).toBeGreaterThan(0);

    // Crear modelo nuevo limpia el canvas y la dirty-flag para reimportar sin guard.
    await page.getByRole("button", { name: "Nuevo", exact: true }).click();
    await expect(page.locator(".joint-element")).toHaveCount(0);

    // Reimportar el JSON capturado.
    await jsonEditor(page).fill(jsonOriginal);
    await expect(page.getByTestId("import-preview")).toBeVisible();
    await page.getByRole("button", { name: "Importar", exact: true }).click();

    // Tras reimportacion el canvas vuelve a tener el SD raiz del ancla.
    await expect(page.getByText("Procesar Prestamo").first()).toBeVisible();

    // Conteos round-trip via Exportar de nuevo.
    const exportadoTrasRT = await exportadoActual(page);
    const conteosTrasRT = {
      entidades: Object.keys(exportadoTrasRT.modelo.entidades).length,
      enlaces: Object.keys(exportadoTrasRT.modelo.enlaces).length,
      opds: Object.keys(exportadoTrasRT.modelo.opds).length,
      estados: Object.keys(exportadoTrasRT.modelo.estados ?? {}).length,
    };
    expect(conteosTrasRT).toEqual(conteosOriginales);

    expect(pageErrors).toEqual([]);
  });
});
