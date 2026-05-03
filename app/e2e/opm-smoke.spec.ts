import { expect, test } from "@playwright/test";

test("carga demo OPM en canvas JointJS y mantiene OPL visible", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("img", { name: "OPD activo" })).toBeVisible();

  await page.getByRole("button", { name: "Demo" }).click();

  await expect(page.locator(".joint-paper svg")).toHaveCount(1);
  await expect(page.locator(".joint-element")).toHaveCount(3);
  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(page.getByText("Driver Rescuing").first()).toBeVisible();
  await expect(page.getByText("Driver Rescuing afecta OnStar System.")).toBeVisible();

  await page.screenshot({ path: "test-results/opm-demo-jointjs.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("arrastra una cosa JointJS y persiste su apariencia", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByRole("button", { name: "Proceso" }).click();

  await expect(page.locator(".joint-element")).toHaveCount(2);

  const objectBox = await elementoPorTexto(page, "Un Objeto").boundingBox();
  if (!objectBox) throw new Error("No se pudo ubicar la celda de objeto para drag");
  await page.mouse.move(objectBox.x + objectBox.width / 2, objectBox.y + objectBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(objectBox.x + objectBox.width / 2 + 120, objectBox.y + objectBox.height / 2 + 70, { steps: 8 });
  await page.mouse.up();

  await page.getByRole("button", { name: "Exportar" }).click();
  const jsonDespuesDeDrag = await page.locator("textarea").inputValue();
  const exportadoDespuesDeDrag = JSON.parse(jsonDespuesDeDrag) as ExportadoModelo;
  const objetoMovido = Object.values(exportadoDespuesDeDrag.modelo.entidades).find((entidad) => entidad.nombre === "Un Objeto");
  if (!objetoMovido) throw new Error("No se encontro Un Objeto en JSON exportado");
  const aparienciaMovida = Object.values(exportadoDespuesDeDrag.modelo.opds[exportadoDespuesDeDrag.modelo.opdRaizId]?.apariencias ?? {}).find(
    (apariencia) => apariencia.entidadId === objetoMovido.id,
  );
  expect(aparienciaMovida?.x).toBeGreaterThan(150);
  expect(aparienciaMovida?.y).toBeGreaterThan(120);

  await page.screenshot({ path: "test-results/opm-drag-jointjs.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("marca dirty state y navega cambios con deshacer y rehacer", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");

  const deshacer = page.getByRole("button", { name: "Deshacer" });
  const rehacer = page.getByRole("button", { name: "Rehacer" });
  await expect(page.getByText("Modelo OPM (No guardado)")).toHaveCount(0);
  await expect(deshacer).toBeDisabled();
  await expect(rehacer).toBeDisabled();

  await page.getByRole("button", { name: "Objeto" }).click();
  await expect(page.getByText("Modelo OPM (No guardado)")).toBeVisible();
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await expect(deshacer).toBeEnabled();
  await expect(rehacer).toBeDisabled();

  await page.keyboard.press("Control+Z");
  await expect(page.getByText("Modelo OPM (No guardado)")).toHaveCount(0);
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(deshacer).toBeDisabled();
  await expect(rehacer).toBeEnabled();

  await page.keyboard.press("Control+Shift+Z");
  await expect(page.getByText("Modelo OPM (No guardado)")).toBeVisible();
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await expect(deshacer).toBeEnabled();
  await expect(rehacer).toBeDisabled();

  await deshacer.click();
  await expect(page.getByText("Modelo OPM (No guardado)")).toHaveCount(0);
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(deshacer).toBeDisabled();
  await expect(rehacer).toBeEnabled();

  await rehacer.click();
  await expect(page.getByText("Modelo OPM (No guardado)")).toBeVisible();
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await expect(deshacer).toBeEnabled();
  await expect(rehacer).toBeDisabled();

  await page.screenshot({ path: "test-results/opm-dirty-undo-redo.png", fullPage: true });
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText("Modelo OPM (No guardado)")).toHaveCount(0);
  await expect(deshacer).toBeEnabled();

  expect(pageErrors).toEqual([]);
});

test("crea enlace, edita vertices y elimina desde celdas JointJS", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByRole("button", { name: "Proceso" }).click();

  await expect(page.locator(".joint-element")).toHaveCount(2);

  await elementoPorTexto(page, "Un Objeto").click();
  await page.getByRole("button", { name: "Instrumento" }).click();
  await elementoPorTexto(page, "Un Proceso").click();

  await expect(page.locator(".joint-link")).toHaveCount(1);
  await expect(page.getByText("Un Proceso requiere Un Objeto.")).toBeVisible();

  await clickCentroLink(page);
  await expect(page.getByText("Enlace Instrumento")).toBeVisible();
  await expect(page.locator('[data-tool-name="boundary"]')).toHaveCount(1);
  await expect(page.locator('[data-tool-name="vertices"]')).toHaveCount(1);
  await expect(page.locator('[data-tool-name="segments"]')).toHaveCount(1);

  const linkBox = await page.locator(".joint-link [joint-selector=wrapper]").boundingBox();
  if (!linkBox) throw new Error("No se pudo ubicar el wrapper del enlace");
  await page.mouse.click(linkBox.x + linkBox.width / 2, linkBox.y + linkBox.height / 2);
  await expect(page.locator(".joint-marker-vertex")).toHaveCount(1);

  const vertexBox = await rectDeLocator(page.locator(".joint-marker-vertex").first());
  await page.mouse.move(vertexBox.x + vertexBox.width / 2, vertexBox.y + vertexBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(vertexBox.x + vertexBox.width / 2, vertexBox.y + vertexBox.height / 2 + 70, { steps: 8 });
  await page.mouse.up();
  await page.getByRole("button", { name: "Exportar" }).click();
  const jsonConVertice = await page.locator("textarea").inputValue();
  const exportadoConVertice = JSON.parse(jsonConVertice) as ExportadoModelo;
  const vertices = Object.values(exportadoConVertice.modelo.opds[exportadoConVertice.modelo.opdRaizId]?.enlaces ?? {})[0]?.vertices;
  expect(vertices).toHaveLength(1);
  expect(vertices?.[0]?.x).toBeGreaterThan(200);
  expect(vertices?.[0]?.y).toBeGreaterThan(120);

  await page.screenshot({ path: "test-results/opm-link-tools-jointjs.png", fullPage: true });
  await page.getByRole("button", { name: "Eliminar enlace" }).click();
  await expect(page.locator(".joint-link")).toHaveCount(0);
  await expect(page.getByText("Un Proceso requiere Un Objeto.")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

function elementoPorTexto(page: import("@playwright/test").Page, texto: string): import("@playwright/test").Locator {
  return page.locator(".joint-element").filter({ hasText: texto });
}

async function rectDeLocator(locator: import("@playwright/test").Locator): Promise<{ x: number; y: number; width: number; height: number }> {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
}

async function clickCentroLink(page: import("@playwright/test").Page): Promise<void> {
  const linkBox = await page.locator(".joint-link [joint-selector=wrapper]").boundingBox();
  if (!linkBox) throw new Error("No se pudo ubicar el wrapper del enlace");
  await page.mouse.click(linkBox.x + linkBox.width / 2, linkBox.y + linkBox.height / 2);
}

interface ExportadoModelo {
  modelo: {
    opdRaizId: string;
    entidades: Record<string, { id: string; nombre: string }>;
    opds: Record<
      string,
      {
        apariencias: Record<string, { entidadId: string; x: number; y: number }>;
        enlaces: Record<string, { vertices: Array<{ x: number; y: number }> }>;
      }
    >;
  };
}
