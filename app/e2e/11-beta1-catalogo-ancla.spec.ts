import { expect, test } from "@playwright/test";
import {
  abrirDialogoCargarModelo,
  cargarModeloEjemplo,
  cerrarPantallaInicioSiVisible,
  crearModeloNuevoDesdeMenu,
  elementoPorTexto,
  exportadoActual,
  rectDeLocator,
  type ExportadoModelo,
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

type ModeloExportado = ExportadoModelo["modelo"];

function entidadIdPorNombre(modelo: ModeloExportado, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  expect(entidad).toBeDefined();
  return entidad!.id;
}

function extremoId(extremo: ModeloExportado["enlaces"][string]["origenId"]): string | null {
  if (typeof extremo === "string") return extremo;
  return extremo.kind === "entidad" ? extremo.id : null;
}

function aparienciaPorNombre(modelo: ModeloExportado, opdId: string, nombre: string) {
  const entidadId = entidadIdPorNombre(modelo, nombre);
  const apariencia = Object.values(modelo.opds[opdId]?.apariencias ?? {}).find((item) => item.entidadId === entidadId);
  expect(apariencia).toBeDefined();
  return apariencia!;
}

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
    await expect(elementoPorTexto(page, "Driver Rescuing")).toBeVisible();

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

  test("SD Async carga SD1 unfolded con cuarto proceso y objetos I/O", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cargarModeloEjemplo(page, "SD Async");

    const exportado = await exportadoActual(page);
    const modelo = exportado.modelo;
    const nombres = Object.values(modelo.entidades).map((entidad) => entidad.nombre);
    expect(nombres).toContain("Beneficiary Group");
    expect(nombres).toContain("Forth Processing");
    expect(nombres).toContain("Main I/O Output");
    expect(nombres).toContain("I/O Object's Relevant Attribute");
    expect(Object.values(modelo.enlaces).some((enlace) => enlace.tipo === "invocacion")).toBe(false);

    const sd1 = Object.entries(modelo.opds).find(([, opd]) => opd.padreId === modelo.opdRaizId);
    expect(sd1).toBeDefined();
    const [sd1Id] = sd1!;
    expect(aparienciaPorNombre(modelo, sd1Id, "Main System Doing")).toMatchObject({
      x: 250,
      y: 155,
      width: 190,
      height: 75,
    });
    expect(aparienciaPorNombre(modelo, sd1Id, "Main Output")).toMatchObject({ x: 585, y: 545 });

    const forth = entidadIdPorNombre(modelo, "Forth Processing");
    const mainOutput = entidadIdPorNombre(modelo, "Main Output");
    expect(
      Object.values(modelo.enlaces).some(
        (enlace) =>
          enlace.tipo === "resultado" &&
          extremoId(enlace.origenId) === forth &&
          extremoId(enlace.destinoId) === mainOutput,
      ),
    ).toBe(true);

    await page.locator(`[role="treeitem"][data-opd-id="${sd1Id}"]`).click();
    await expect(elementoPorTexto(page, "Forth Processing")).toBeVisible();
    await expect(elementoPorTexto(page, "Main I/O Output")).toBeVisible();
    await expect(elementoPorTexto(page, "I/O Object's Relevant Attribute")).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test("SD Sync carga SD1 sin duplicados y con resultado final OPCloud-like", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cargarModeloEjemplo(page, "SD Sync");

    const exportado = await exportadoActual(page);
    const modelo = exportado.modelo;
    const nombres = Object.values(modelo.entidades).map((entidad) => entidad.nombre);
    expect(nombres).not.toContain("SD1 Main Input");
    expect(nombres).not.toContain("SD1 Main Output");

    const sd1 = Object.entries(modelo.opds).find(([, opd]) => opd.padreId === modelo.opdRaizId);
    expect(sd1).toBeDefined();
    const [sd1Id] = sd1!;
    expect(aparienciaPorNombre(modelo, sd1Id, "Main System Doing")).toMatchObject({
      x: 180,
      y: 110,
      width: 340,
      height: 455,
    });
    expect(aparienciaPorNombre(modelo, sd1Id, "Main Output")).toMatchObject({ x: 620, y: 505 });

    const last = entidadIdPorNombre(modelo, "Last Processing");
    const mainOutput = entidadIdPorNombre(modelo, "Main Output");
    expect(
      Object.values(modelo.enlaces).some(
        (enlace) =>
          enlace.tipo === "resultado" &&
          enlace.derivado?.origen === "manual" &&
          extremoId(enlace.origenId) === last &&
          extremoId(enlace.destinoId) === mainOutput,
      ),
    ).toBe(true);

    await page.locator(`[role="treeitem"][data-opd-id="${sd1Id}"]`).click();
    await expect(elementoPorTexto(page, "Last Processing")).toBeVisible();
    await expect(elementoPorTexto(page, "Main Output")).toBeVisible();
    await expect(elementoPorTexto(page, "SD1 Main Output")).toHaveCount(0);

    expect(pageErrors).toEqual([]);
  });

  test("SD Sync no duplica enlaces visibles al mover una cosa en SD1", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cargarModeloEjemplo(page, "SD Sync");

    const exportado = await exportadoActual(page);
    const sd1 = Object.entries(exportado.modelo.opds).find(([, opd]) => opd.padreId === exportado.modelo.opdRaizId);
    expect(sd1).toBeDefined();
    const [sd1Id] = sd1!;
    await page.locator(`[role="treeitem"][data-opd-id="${sd1Id}"]`).click();
    await expect(elementoPorTexto(page, "Main I/O Output")).toBeVisible();

    const cantidadLinksAntes = await page.locator(".joint-link").count();
    const ioOutput = elementoPorTexto(page, "Main I/O Output");
    const rect = await rectDeLocator(ioOutput);
    await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
    await page.mouse.down();
    await page.mouse.move(rect.x + rect.width / 2 + 80, rect.y + rect.height / 2 - 25, { steps: 8 });
    await page.mouse.up();

    await expect(ioOutput).toBeVisible();
    await expect(page.locator(".joint-link")).toHaveCount(cantidadLinksAntes);
    expect(pageErrors).toEqual([]);
  });

  test("SD Sync mantiene objetos contextuales fuera del contorno durante drag", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cargarModeloEjemplo(page, "SD Sync");

    const exportado = await exportadoActual(page);
    const sd1 = Object.entries(exportado.modelo.opds).find(([, opd]) => opd.padreId === exportado.modelo.opdRaizId);
    expect(sd1).toBeDefined();
    const [sd1Id] = sd1!;
    await page.locator(`[role="treeitem"][data-opd-id="${sd1Id}"]`).click();
    await expect(elementoPorTexto(page, "Main I/O Output")).toBeVisible();

    const modeloAntes = (await exportadoActual(page)).modelo;
    const contornoAntes = aparienciaPorNombre(modeloAntes, sd1Id, "Main System Doing");
    const ioAntes = aparienciaPorNombre(modeloAntes, sd1Id, "Main I/O Output");
    expect(ioAntes.x).toBeGreaterThan(contornoAntes.x + contornoAntes.width);

    const ioOutput = elementoPorTexto(page, "Main I/O Output");
    const rect = await rectDeLocator(ioOutput);
    await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
    await page.mouse.down();
    await page.mouse.move(rect.x + rect.width / 2 - 20, rect.y + rect.height / 2 + 15, { steps: 8 });
    await page.mouse.up();

    await expect.poll(async () => {
      const modelo = (await exportadoActual(page)).modelo;
      return aparienciaPorNombre(modelo, sd1Id, "Main I/O Output");
    }).toMatchObject({
      x: ioAntes.x - 20,
      y: ioAntes.y + 15,
    });
    const modeloDespues = (await exportadoActual(page)).modelo;
    const contornoDespues = aparienciaPorNombre(modeloDespues, sd1Id, "Main System Doing");
    const ioDespues = aparienciaPorNombre(modeloDespues, sd1Id, "Main I/O Output");
    expect(ioDespues.x).toBeGreaterThan(contornoDespues.x + contornoDespues.width);
    expect(pageErrors).toEqual([]);
  });
});
