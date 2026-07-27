import { expect, test } from "@playwright/test";
import {
  confirmarRefinamientoPendiente,
  elementoPorTexto,
  esperarWorkbenchInicial,
} from "./_smoke-helpers";

// Bocetos bottom-up (R-OPD-REF-20): un OPD suelto (padreId:null ≠ raíz) es un
// componente transitorio legítimo. Vive en la banda «Bocetos» (proyección
// DERIVADA, no especie documental) y converge con el árbol mediante «Integrar».
// La operación inversa lo devuelve a Bocetos sin cambiar identidad ni contenido.
test("integrar un Boceto y devolver el mismo OPD sin pérdida", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // Una cosa en la raíz para adoptar contra ella.
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Cargar");

  const mainTree = page.getByRole("tree", { name: "Árbol OPD" });
  const banda = page.getByTestId("arbol-banda-taller");

  // Sin sueltos aún: la banda no existe, pero el gesto sí.
  await expect(banda).toHaveCount(0);

  // Crear un Boceto OPD bottom-up.
  await page.getByTestId("arbol-nuevo-suelto").click();

  // El Boceto aparece en su banda local y NO cuelga de la raíz.
  await expect(banda).toBeVisible();
  await expect(banda).toContainText("Bocetos · 1 OPD aún sin integrar");
  const sueltoItem = banda.getByRole("treeitem").first();
  await expect(sueltoItem).toBeVisible();
  const sueltoTestId = await sueltoItem.getAttribute("data-testid");
  expect(sueltoTestId).toBeTruthy();
  await expect(mainTree.locator(`[data-testid="${sueltoTestId}"]`)).toHaveCount(0);
  await expect(page.getByTestId("canvas-header")).toContainText("Boceto 1 · Boceto no integrado");

  // El OPL del Boceto acompaña al fragmento activo aunque todavía no pertenezca
  // al árbol canónico. No debe esperar a la adopción para reflejar lo dibujado.
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Proyectar");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Resultado");
  await page.getByTestId("estado-vacio-conectar-resultado").click();
  const opl = page.getByTestId("panel-opl");
  await expect(opl).toContainText("Proyectar es un proceso informacional y sistémico.");
  await expect(opl).toContainText("Resultado es un objeto informacional y sistémico.");
  await expect(opl).toContainText("Proyectar genera Resultado.");
  await expect(opl).not.toContainText("Sin OPL todavía");

  // Volver a la raíz y seleccionar el proceso (crear el suelto activó el suelto).
  await mainTree.getByRole("treeitem").first().click();
  await elementoPorTexto(page, "Cargar").click();

  // Integrar el Boceto como descomposición de «Cargar» desde su menú contextual.
  await sueltoItem.click({ button: "right" });
  await expect(page.getByTestId("menu-contextual-arbol")).toBeVisible();
  await page.getByTestId("menu-adoptar-descomposicion").click();
  await confirmarRefinamientoPendiente(page, {
    pregunta: "¿Qué parte de Cargar explica este fragmento?",
  });

  // Adoptado: ya no es suelto → la banda desaparece y el OPD cuelga del árbol.
  await expect(banda).toHaveCount(0);
  await expect(mainTree.locator(`[data-testid="${sueltoTestId}"]`)).toHaveCount(1);
  await expect(page.getByTestId("canvas-header")).toContainText("Boceto 1 · OPD integrado");

  // La inversa explícita NO es «Eliminar refinamiento»: conserva el OPD, su OPL
  // y todo su subárbol, y lo devuelve con el mismo identificador a Bocetos.
  const integrado = mainTree.locator(`[data-testid="${sueltoTestId}"]`);
  await integrado.click({ button: "right" });
  await page.getByTestId("menu-devolver-bocetos").click();
  const dialogoDevolver = page.getByTestId("dialogo-devolver-boceto");
  await expect(dialogoDevolver).toBeVisible();
  await expect(dialogoDevolver.getByTestId("tutor-dialogo-devolver-boceto")).toBeVisible();
  await expect(dialogoDevolver).toContainText("No se elimina contenido");
  await dialogoDevolver.getByTestId("dialogo-devolver-boceto-confirmar").click();

  await expect(dialogoDevolver).toHaveCount(0);
  await expect(mainTree.locator(`[data-testid="${sueltoTestId}"]`)).toHaveCount(0);
  await expect(banda.locator(`[data-testid="${sueltoTestId}"]`)).toHaveCount(1);
  await expect(page.getByTestId("canvas-header")).toContainText("Boceto 1 · Boceto no integrado");
  await expect(opl).toContainText("Proyectar genera Resultado.");

  // El historial restaura la integración sin fabricar un OPD nuevo.
  await page.keyboard.press("Control+z");
  await expect(banda).toHaveCount(0);
  await expect(mainTree.locator(`[data-testid="${sueltoTestId}"]`)).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});
