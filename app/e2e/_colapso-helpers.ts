import type { Page } from "@playwright/test";

/**
 * C′·A (M-4): las secciones del Inspector de entidad nacen plegadas
 * (Refinamiento, Extensiones, Apariciones, Tamaño; y los disclosures internos
 * Avanzado/Notas). Este helper abre una sección por su testid de panel si está
 * cerrada, para que los e2e que interactúan con su contenido lo encuentren.
 * Idempotente: si ya está abierta, no hace nada.
 *
 * `panelTestid` es el testid del `<section>`/contenedor (p. ej.
 * `inspector-panel-refinamiento`, `inspector-avanzado`); el toggle es
 * `${panelTestid}-toggle`.
 */
export async function abrirSeccionInspector(page: Page, panelTestid: string): Promise<void> {
  const contenido = page.getByTestId(panelTestid).locator("[data-abierta]").first();
  const estado = await contenido.getAttribute("data-abierta").catch(() => null);
  if (estado === "false") {
    await page.getByTestId(`${panelTestid}-toggle`).first().click();
    await contenido.waitFor({ state: "visible" }).catch(() => undefined);
  }
}
