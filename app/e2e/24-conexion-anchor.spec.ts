import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible, elementoPorTexto, exportadoActual, jsonEditor, rectDeLocator } from "./_smoke-helpers";

test("drag desde anchor abre MenuTipoEnlace anclado y confirma conexion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await jsonEditor(page).fill(JSON.stringify(modeloConexionAnchor(), null, 2));
  await page.getByRole("button", { name: "Importar", exact: true }).click();
  await expect(elementoPorTexto(page, "Entrada")).toBeVisible();
  await expect(elementoPorTexto(page, "Procesar")).toBeVisible();

  const entradaBody = elementoPorTexto(page, "Entrada").locator('[joint-selector="body"]');
  const procesarBody = elementoPorTexto(page, "Procesar").locator('[joint-selector="body"]');
  const entrada = await rectDeLocator(entradaBody);
  const procesar = await rectDeLocator(procesarBody);
  const anchorE = { x: entrada.x + entrada.width, y: entrada.y + entrada.height / 2 };
  const destino = { x: procesar.x + procesar.width / 2, y: procesar.y + procesar.height / 2 };

  await page.mouse.move(anchorE.x, anchorE.y);
  await page.mouse.down();
  await expect(page.getByTestId("indicador-modo-canonico")).toHaveAttribute("data-modo", "conectar");
  await expect(page.locator(".joint-link")).toHaveCount(1);
  await page.mouse.move(destino.x, destino.y, { steps: 6 });
  await page.mouse.up();

  const menu = page.getByTestId("menu-tipo-enlace");
  await expect(menu).toBeVisible();
  await expect(menu.getByText("Conectar Entrada -> Procesar")).toBeVisible();
  await menu.getByTestId("menu-tipo-enlace-consumo").click();

  await expect(page.locator(".joint-link")).toHaveCount(1);
  const exportado = await exportadoActual(page);
  expect(Object.values(exportado.modelo.enlaces).some((enlace) => enlace.tipo === "consumo")).toBe(true);
  expect(pageErrors).toEqual([]);
});

function modeloConexionAnchor() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-anchor",
      nombre: "Modelo anchor",
      opdRaizId: "opd-1",
      nextSeq: 3,
      entidades: {
        "o-entrada": { id: "o-entrada", tipo: "objeto", nombre: "Entrada", esencia: "informacional", afiliacion: "sistemica" },
        "p-procesar": { id: "p-procesar", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
      },
      estados: {},
      enlaces: {},
      abanicos: {},
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-entrada": { id: "a-entrada", entidadId: "o-entrada", opdId: "opd-1", x: 120, y: 150, width: 135, height: 60 },
            "a-procesar": { id: "a-procesar", entidadId: "p-procesar", opdId: "opd-1", x: 360, y: 150, width: 135, height: 60 },
          },
          enlaces: {},
        },
      },
    },
  };
}
