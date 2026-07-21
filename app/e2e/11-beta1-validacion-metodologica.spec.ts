/**
 * Smoke ronda 16 L3 — Beta1 validacion metodologica accionable.
 *
 * Cubre el slice minimo del brief:
 *   1. Aparece aviso al crear elementos que violan metodologia (severidad).
 *   2. Cita SSOT visible en el panel y en detalle expandible.
 *   3. Click en aviso navega al elemento (entidad o OPD) implicado.
 *   4. El diagnóstico se actualiza reactivamente, sin botón de revalidación.
 *   5. Aviso se resuelve tras corregir el modelo.
 *
 * Citas SSOT:
 *   metodologia-opm-es.md §6.1 (proceso principal), §7.1 (refinamiento no
 *   trivial), §6.9 (objetos ambientales).
 */

import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial, elementoPorTexto } from "./_smoke-helpers";

test("L3 panel muestra severidad precisa y criterio SSOT en contexto", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // Crear un proceso (placeholder "Proceso") y un objeto (placeholder "Objeto"):
  // ambos disparan avisos por nombre no verbal y, en el caso del proceso, por
  // no transformar nada.
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  const panel = page.getByTestId("panel-diagnostico");
  await expect(panel).toBeVisible();
  await page.getByTestId("panel-diagnostico-toggle").click();

  // El proceso sin transformación es bloqueo; el panel no lo rebaja a sugerencia.
  await expect(panel).toHaveAttribute("data-severidad-dominante", "bloqueo");
  await expect(panel.locator("header").getByLabel(/bloqueo/)).toBeVisible();

  // El aviso de PROCESO_NOMBRE_FORMA_VERBAL aparece y trae cita SSOT
  // visible en el boton de cita.
  const aviso = page.getByTestId("aviso-PROCESO_NOMBRE_FORMA_VERBAL");
  await expect(aviso).toBeVisible();
  const cita = page.getByTestId("aviso-cita-PROCESO_NOMBRE_FORMA_VERBAL");
  await expect(cita).toBeVisible();
  await expect(cita).toHaveAttribute("title", /Criterio:.*(reglas-opm-estrictas-es|opl-es)/);

  // Click en cita expande detalle con SSOT, rationale y acciones sugeridas.
  await cita.click();
  const detalle = page.getByTestId("aviso-detalle-PROCESO_NOMBRE_FORMA_VERBAL");
  await expect(detalle).toBeVisible();
  await expect(detalle).toContainText("reglas-opm-estrictas-es");
  await expect(detalle).toContainText(/Qué puedes hacer|[Rr]enombra/);
  await expect(page.getByTestId("panel-diagnostico-revalidar")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("L3 click en aviso navega al elemento y deja seleccion visible", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // Modelo: un solo proceso con nombre no verbal (placeholder "Proceso"
  // ya viola PROCESO_NOMBRE_FORMA_VERBAL por construccion).
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByTestId("panel-diagnostico-toggle").click();
  await expect(page.getByTestId("aviso-PROCESO_NOMBRE_FORMA_VERBAL")).toBeVisible();

  // Deselecciono via Escape para que la navegacion del aviso sea verificable.
  await page.keyboard.press("Escape");

  const inspector = page.getByTestId("inspector");
  // Click en el aviso navega a la entidad y la deja seleccionada.
  const navegar = page.getByTestId("aviso-navegar-PROCESO_NOMBRE_FORMA_VERBAL");
  await expect(navegar).toBeVisible();
  await navegar.click();

  // Inspector queda en modo entidad y muestra la cosa apuntada.
  await expect(inspector).toHaveAttribute("data-modo-inspector", "entidad");
  await expect(inspector).toContainText("Proceso");

  expect(pageErrors).toEqual([]);
});

test("L3 ErrorBadge inline abre y resalta el aviso compartido", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.getByRole("button", { name: "Proceso", exact: true }).click();

  const badge = page.locator('[data-testid="error-badge"][data-regla-id="PROCESO_NO_TRANSFORMA"]');
  await expect(badge).toHaveCount(1);
  await expect(badge.first()).toHaveAttribute("aria-label", /PROCESO_NO_TRANSFORMA/);

  await badge.first().click();
  const panel = page.getByTestId("panel-diagnostico");
  await expect(panel).toHaveAttribute("data-expandido", "true");
  await expect(page.getByTestId("aviso-PROCESO_NO_TRANSFORMA")).toBeVisible();
  await expect(page.getByTestId("aviso-PROCESO_NO_TRANSFORMA")).toHaveAttribute("data-resaltado", "true");

  expect(pageErrors).toEqual([]);
});

test("L3 badge del arbol abre el mismo aviso diagnostico", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.getByRole("button", { name: "Proceso", exact: true }).click();

  const badgeArbol = page.locator('[data-testid^="tree-issue-badge-"]').first();
  await expect(badgeArbol).toBeVisible();
  await expect(badgeArbol).toHaveAttribute("aria-label", /errores|advertencias/);
  await badgeArbol.click();

  const panel = page.getByTestId("panel-diagnostico");
  await expect(panel).toHaveAttribute("data-expandido", "true");
  await expect(page.getByTestId("aviso-PROCESO_NO_TRANSFORMA")).toBeVisible();
  await expect(page.getByTestId("aviso-PROCESO_NO_TRANSFORMA")).toHaveAttribute("data-resaltado", "true");

  expect(pageErrors).toEqual([]);
});

test("L3 ciclo de feedback completo cubre barra, badge y toast", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.getByRole("button", { name: "Proceso", exact: true }).click();

  const barra = page.getByTestId("barra-herramientas-elemento");
  await expect(barra).toBeVisible();
  await expect(barra).toHaveAttribute("role", "toolbar");
  await expect(barra).toHaveAttribute("aria-label", /Acciones sobre Proceso/);

  const badge = page.locator('[data-testid="error-badge"][data-regla-id="PROCESO_NO_TRANSFORMA"]');
  await expect(badge).toHaveCount(1);
  await badge.first().click();

  const panel = page.getByTestId("panel-diagnostico");
  await expect(panel).toHaveAttribute("data-expandido", "true");
  await expect(page.getByTestId("aviso-PROCESO_NO_TRANSFORMA")).toHaveAttribute("data-resaltado", "true");

  await elementoPorTexto(page, "Proceso").click();
  await page.keyboard.press("Delete");
  const toastEliminar = page.getByTestId("flash-toast").filter({ hasText: "Eliminado “Proceso”" });
  await expect(toastEliminar).toBeVisible();
  await expect(toastEliminar).toContainText("0 enlaces eliminados");
  await expect(toastEliminar).toContainText("Ctrl+Z deshace");
  await expect(toastEliminar).toHaveAttribute("role", "status");
  await expect(toastEliminar).toHaveAttribute("aria-live", "polite");

  expect(pageErrors).toEqual([]);
});

test("L3 aviso se resuelve tras corregir el nombre del proceso", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // Crear proceso con placeholder "Proceso" -> dispara aviso de forma verbal.
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByTestId("panel-diagnostico-toggle").click();
  await expect(page.getByTestId("aviso-PROCESO_NOMBRE_FORMA_VERBAL")).toBeVisible();
  await page.getByTestId("panel-diagnostico-toggle").click();

  // El proceso recien creado queda seleccionado; el inspector ofrece edicion
  // in-place del nombre.
  const inspectorNombre = page.getByTestId("inspector").getByLabel("Nombre");
  await expect(inspectorNombre).toBeVisible();
  await inspectorNombre.fill("Procesar Solicitud");
  await inspectorNombre.press("Enter");

  // Tras el rename, el aviso PROCESO_NOMBRE_FORMA_VERBAL desaparece.
  await expect(page.getByTestId("aviso-PROCESO_NOMBRE_FORMA_VERBAL")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("L3 panel metodologia marca SD sin proceso principal con cita §6.1/§6.11", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // Crear solo un objeto (placeholder "Objeto") en el SD: no hay proceso sistemico.
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByTestId("panel-diagnostico-toggle").click();

  const aviso = page.getByTestId("aviso-SD_SIN_PROCESO_PRINCIPAL");
  await expect(aviso).toBeVisible();
  // Cita visible apunta a §6.1 / §6.11.
  await expect(page.getByTestId("aviso-cita-SD_SIN_PROCESO_PRINCIPAL")).toHaveAttribute("title", /§6.1|§6.11|metodologia-opm-es/);

  expect(pageErrors).toEqual([]);
});
