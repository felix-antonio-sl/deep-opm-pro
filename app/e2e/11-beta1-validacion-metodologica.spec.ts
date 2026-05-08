/**
 * Smoke ronda 16 L3 — Beta1 validacion metodologica accionable.
 *
 * Cubre el slice minimo del brief:
 *   1. Aparece aviso al crear elementos que violan metodologia (severidad).
 *   2. Cita SSOT visible en el panel y en detalle expandible.
 *   3. Click en aviso navega al elemento (entidad o OPD) implicado.
 *   4. Boton Revalidar recomputa avisos sin recargar pagina.
 *   5. Aviso se resuelve tras corregir el modelo.
 *
 * Citas SSOT:
 *   metodologia-opm-es.md §6.1 (proceso principal), §7.1 (refinamiento no
 *   trivial), §6.9 (objetos ambientales).
 */

import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible } from "./_smoke-helpers";

test("L3 panel metodologia muestra aviso, cita SSOT y permite revalidar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // Crear un proceso (placeholder "Proceso") y un objeto (placeholder "Objeto"):
  // ambos disparan avisos por nombre no verbal y, en el caso del proceso, por
  // no transformar nada.
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  const panel = page.getByTestId("panel-metodologia");
  await expect(panel).toBeVisible();

  // Hay al menos un aviso — el contador NO debe ser cero.
  const total = page.getByTestId("panel-metodologia-total");
  await expect(total).not.toHaveText("0");

  // El aviso de PROCESO_NOMBRE_FORMA_VERBAL aparece y trae cita SSOT
  // visible en el boton de cita.
  const aviso = page.getByTestId("aviso-PROCESO_NOMBRE_FORMA_VERBAL");
  await expect(aviso).toBeVisible();
  const cita = page.getByTestId("aviso-cita-PROCESO_NOMBRE_FORMA_VERBAL");
  await expect(cita).toBeVisible();
  await expect(cita).toContainText(/metodologia-opm-es|Glos/);

  // Click en cita expande detalle con SSOT, rationale y acciones sugeridas.
  await cita.click();
  const detalle = page.getByTestId("aviso-detalle-PROCESO_NOMBRE_FORMA_VERBAL");
  await expect(detalle).toBeVisible();
  await expect(detalle).toContainText("metodologia-opm-es.md");
  await expect(detalle).toContainText(/[Aa]ccion|[Rr]enombra/);

  // Boton Revalidar dispara recalculo.
  const revalidar = page.getByTestId("panel-metodologia-revalidar");
  await expect(revalidar).toBeVisible();
  const revisionAntes = await panel.getAttribute("data-revision");
  await revalidar.click();
  const revisionDespues = await panel.getAttribute("data-revision");
  expect(revisionDespues).not.toBe(revisionAntes);

  expect(pageErrors).toEqual([]);
});

test("L3 click en aviso navega al elemento y deja seleccion visible", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // Modelo: un solo proceso con nombre no verbal (placeholder "Proceso"
  // ya viola PROCESO_NOMBRE_FORMA_VERBAL por construccion).
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
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

test("L3 aviso se resuelve tras corregir el nombre del proceso", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // Crear proceso con placeholder "Proceso" -> dispara aviso de forma verbal.
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await expect(page.getByTestId("aviso-PROCESO_NOMBRE_FORMA_VERBAL")).toBeVisible();

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
  await cerrarPantallaInicioSiVisible(page);

  // Crear solo un objeto (placeholder "Objeto") en el SD: no hay proceso sistemico.
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  const aviso = page.getByTestId("aviso-SD_SIN_PROCESO_PRINCIPAL");
  await expect(aviso).toBeVisible();
  // Cita visible apunta a §6.1 / §6.11.
  await expect(page.getByTestId("aviso-cita-SD_SIN_PROCESO_PRINCIPAL")).toContainText(/§6.1|§6.11|metodologia-opm-es/);

  expect(pageErrors).toEqual([]);
});
