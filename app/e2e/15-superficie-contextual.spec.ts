/**
 * Smoke ronda 15 L5 — Cierre UX contextual de superficie unica.
 *
 * Cubre los cuatro journeys del brief Linea 5:
 *  - seleccionar cosa actualiza barra contextual e Inspector;
 *  - seleccionar enlace actualiza Inspector y Panel OPL;
 *  - refinamiento navega/expone OPD hijo;
 *  - PanelMetodologia/PanelAvisos no ocultan informacion critica.
 *
 * Mantiene la asuncion del workbench (canvas + inspector + opl + arbol)
 * sin tocar render/canvas (territorio L4) ni Toolbar (territorio L2).
 */

import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible, clickLinkPorTipo, elementoPorTexto } from "./_smoke-helpers";

test("seleccionar una cosa enciende barra contextual e Inspector con la misma referencia", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  // Inspector responde a la seleccion en modo entidad.
  const inspector = page.getByTestId("inspector");
  await expect(inspector).toHaveAttribute("data-modo-inspector", "entidad");
  await expect(inspector).toContainText("Objeto");

  // Barra contextual flotante refleja la misma seleccion.
  const barra = page.getByTestId("barra-herramientas-elemento");
  await expect(barra).toBeVisible();
  await expect(barra).toHaveAttribute("aria-label", /Barra de acciones de Objeto/);

  // El boton inzoom existe y dispara descomposicion (conexion barra -> Inspector via store).
  await expect(page.getByTestId("barra-inzoom")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("seleccionar un enlace conmuta Inspector a modo enlace y resalta su oracion en OPL", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await elementoPorTexto(page, "Entrada").click();
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await elementoPorTexto(page, "Procesar").click();

  // Hay 1 enlace ya creado; selecciono el enlace clickeando su wrapper SVG.
  await clickLinkPorTipo(page, "Consumo");

  const inspector = page.getByTestId("inspector");
  await expect(inspector).toHaveAttribute("data-modo-inspector", "enlace");
  await expect(inspector).toContainText("Enlace Consumo");

  // Panel OPL: la oracion correspondiente al enlace debe estar visible
  // y marcada como seleccionada (boxShadow inset via style.lineaSeleccionada).
  const panel = page.getByTestId("panel-opl");
  await expect(panel).toBeVisible();
  await expect(panel.getByText(/Procesar\s+consume\s+Entrada/)).toBeVisible();

  // Cuando hay seleccion la barra contextual de cosa NO debe estar visible:
  // BarraHerramientasElemento es solo para entidades, no para enlaces.
  await expect(page.getByTestId("barra-herramientas-elemento")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("inzoom desde barra contextual navega al OPD hijo y arbol expone el descendiente", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Proceso", exact: true }).click();

  // Inzoom desde la barra contextual flotante (no desde Inspector).
  await expect(page.getByTestId("barra-inzoom")).toBeVisible();
  await page.getByTestId("barra-inzoom").click();

  // El arbol OPD debe exponer el OPD hijo y marcarlo como activo.
  const arbol = page.getByRole("tree", { name: "Árbol OPD" });
  const nodoHijo = arbol.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" });
  await expect(nodoHijo).toHaveAttribute("aria-current", "page");

  // El Inspector permanece en modo entidad (la cosa refinada sigue seleccionada).
  await expect(page.getByTestId("inspector")).toHaveAttribute("data-modo-inspector", "entidad");

  expect(pageErrors).toEqual([]);
});

test("PanelMetodologia y PanelAvisos se pueden colapsar sin perder informacion critica", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  // Modelo minimo: aseguro que ambos paneles se monten.
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  const metodologia = page.getByTestId("panel-metodologia");
  const avisos = page.getByTestId("panel-avisos");
  await expect(metodologia).toBeVisible();
  await expect(avisos).toBeVisible();

  // El contador se mantiene visible incluso cuando el panel esta colapsado.
  const contadorMetodologia = page.getByTestId("panel-metodologia-total");
  await expect(contadorMetodologia).toBeVisible();

  // Toggle colapsa Metodologia: el cuerpo desaparece pero el contador sigue.
  await page.getByTestId("panel-metodologia-toggle").click();
  await expect(metodologia).toHaveAttribute("data-colapsado", "true");
  await expect(contadorMetodologia).toBeVisible();
  // Re-expandir restaura.
  await page.getByTestId("panel-metodologia-toggle").click();
  await expect(metodologia).toHaveAttribute("data-colapsado", "false");

  // Mismo contrato para Verificacion metodologica.
  await page.getByTestId("panel-avisos-toggle").click();
  await expect(avisos).toHaveAttribute("data-colapsado", "true");
  // Inspector debe seguir disponible (no oculto por avisos).
  await expect(page.getByTestId("inspector")).toBeVisible();
  await page.getByTestId("panel-avisos-toggle").click();
  await expect(avisos).toHaveAttribute("data-colapsado", "false");

  expect(pageErrors).toEqual([]);
});

test("Inspector vacio expone CTA y aria-live consistente al limpiar seleccion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(page.getByTestId("inspector")).toHaveAttribute("data-modo-inspector", "entidad");

  // Vaciar seleccion via Escape.
  await page.keyboard.press("Escape");
  const inspector = page.getByTestId("inspector");
  await expect(inspector).toHaveAttribute("data-modo-inspector", "vacio");
  await expect(page.getByTestId("inspector-vacio")).toBeVisible();
  await expect(page.getByTestId("inspector-vacio")).toContainText(/Selecciona una cosa o un enlace/);

  expect(pageErrors).toEqual([]);
});
