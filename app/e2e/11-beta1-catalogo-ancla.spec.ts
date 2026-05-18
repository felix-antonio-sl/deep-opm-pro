import { expect, test } from "@playwright/test";
import {
  abrirDialogoCargarModelo,
  cargarModeloEjemplo,
  cerrarPantallaInicioSiVisible,
  crearModeloNuevoDesdeMenu,
  elementoPorTexto,
  exportadoActual,
  jsonEditor,
} from "./_smoke-helpers";

const CATALOGO_SANDBOX = [
  "System Diagram",
  "SD Sync",
  "SD Async",
  "OnStar System",
  "OPM Structure Meta Model",
  "Modelo Vacio",
];

test.describe("catalogo OPCloud sandbox", () => {
  test("catalogo lista solo ejemplos OPCloud sandbox", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    const dialogo = await abrirDialogoCargarModelo(page);
    const selector = dialogo.getByLabel("Cargar modelo de ejemplo");
    await expect(selector).toBeVisible();

    const opciones = await selector.locator("option").evaluateAll((nodes) => (
      nodes
        .map((node) => (node.textContent ?? "").trim())
        .filter((texto) => texto && texto !== "Ejemplos...")
    ));
    expect(opciones).toEqual(CATALOGO_SANDBOX);
    for (const retirado of ["Cafetera Domestica", "Prestamo Bibliotecario", "Comprar Pan", "Ejemplo organizacional"]) {
      expect(opciones).not.toContain(retirado);
    }

    expect(pageErrors).toEqual([]);
  });

  test("OnStar System se carga y expone SD raiz observado", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cargarModeloEjemplo(page, "OnStar System");

    await expect(page.locator(".joint-paper svg")).toHaveCount(1);
    expect(await page.locator(".joint-element").count()).toBeGreaterThanOrEqual(3);
    await expect(elementoPorTexto(page, "Driver Rescuing")).toBeVisible();
    await expect(elementoPorTexto(page, "OnStar System")).toBeVisible();
    await expect(elementoPorTexto(page, "Driver")).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test("OnStar System hace round-trip exportar->reimportar sin perdida", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);
    await cargarModeloEjemplo(page, "OnStar System");
    await expect(elementoPorTexto(page, "Driver Rescuing")).toBeVisible();

    const exportadoOriginal = await exportadoActual(page);
    const conteosOriginales = {
      entidades: Object.keys(exportadoOriginal.modelo.entidades).length,
      enlaces: Object.keys(exportadoOriginal.modelo.enlaces).length,
      opds: Object.keys(exportadoOriginal.modelo.opds).length,
      estados: Object.keys(exportadoOriginal.modelo.estados ?? {}).length,
    };
    expect(conteosOriginales.opds).toBeGreaterThanOrEqual(2);
    expect(conteosOriginales.estados).toBeGreaterThanOrEqual(4);
    expect(conteosOriginales.enlaces).toBeGreaterThanOrEqual(10);

    const jsonOriginal = await jsonEditor(page).inputValue();
    expect(jsonOriginal.length).toBeGreaterThan(0);

    await crearModeloNuevoDesdeMenu(page);
    await expect(page.locator(".joint-element")).toHaveCount(0);

    await jsonEditor(page).fill(jsonOriginal);
    await expect(page.getByTestId("import-preview")).toBeVisible();
    await page.getByRole("button", { name: "Importar", exact: true }).click();
    await expect(page.getByText("Driver Rescuing").first()).toBeVisible();

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
