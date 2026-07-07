import { expect, test } from "@playwright/test";
import {
  esperarWorkbenchInicial,
  ejecutarComandoPalette,
  abrirDialogoCargarModelo,
} from "./_smoke-helpers";

/**
 * Ola 3 «Todo nace apunte» (diseño §3, R-OPD-REF-15). Verifica el nacimiento
 * DESATENDIDO: «Nuevo» abre un apunte editable AL INSTANTE (sin diálogo de
 * nombre), persistido desde el nacimiento; la raíz proyecta «Hoja»; y la
 * graduación pide nombre/carpeta + reporte de validez y apaga la cinta.
 */
test("«Nuevo» nace un apunte editable al instante, aparece en el gestor y se gradúa", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // 1. «Nuevo» (comando real de la paleta) → nacerApunte. SIN diálogo de nombre.
  await ejecutarComandoPalette(page, "nuevo", "menu-nuevo-modelo");
  await expect(page.getByRole("dialog", { name: "Guardar como" })).toHaveCount(0);

  // La cinta apunte aparece (especie derivada del índice tras el guardado async).
  const cinta = page.getByTestId("cinta-apunte");
  await expect(cinta).toBeVisible();
  await expect(page.getByTestId("cinta-apunte-estado")).toContainText("Apunte");

  // La raíz proyecta «Hoja» en el árbol de navegación (display-only).
  await expect(page.getByTestId("tree-node-opd-1")).toContainText("Hoja");

  // 2. Dibujar una cosa (queda dirty → el autosalvado toma el relevo).
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const modal = page.getByTestId("modal-nombre-cosa");
  if (await modal.count() > 0) {
    await expect(modal).toBeVisible();
    await modal.getByLabel("Nombre").fill("Idea");
    await modal.getByRole("button", { name: "OK" }).click();
    await expect(modal).toHaveCount(0);
  } else {
    await page.getByLabel("Nombre").fill("Idea");
  }

  // 3. El apunte YA está en el gestor sin guardar manual (persistido al nacer).
  const gestor = await abrirDialogoCargarModelo(page);
  await expect(
    gestor.getByTestId("modelo-fila-cargar").filter({ hasText: /Apunte \d{4}-\d{2}-\d{2}/ }).first(),
  ).toBeVisible();
  await gestor.getByRole("button", { name: "Cancelar" }).click();
  await expect(gestor).toHaveCount(0);

  // 4. Graduar desde la cinta: el diálogo pide nombre + muestra el reporte de validez.
  await cinta.getByTestId("cinta-apunte-graduar").click();
  await expect(page.getByTestId("dialogo-graduar")).toBeVisible();
  await expect(page.getByTestId("graduar-validez")).toBeVisible();
  await page.getByTestId("graduar-nombre").fill("Modelo graduado");
  await page.getByTestId("graduar-confirmar").click();

  // 5. La cinta apunte desaparece: ya es modelo (especie apunte apagada en el índice).
  await expect(page.getByTestId("cinta-apunte")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});
