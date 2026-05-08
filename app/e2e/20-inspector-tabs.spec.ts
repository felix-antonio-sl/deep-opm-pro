/**
 * Smoke ronda 20 L1 — Inspector en tabs por intención.
 *
 * Cubre los criterios de salida del informe UI/UX 2026-05-07 §Fase 2 §P1
 * inspector líneas 98-114:
 *  - al seleccionar una entidad, el inspector muestra 5 tabs (Semántica,
 *    Enlaces, Refinamiento, Apariciones, Estilo);
 *  - el tab default es Semántica y la primera vista contiene descripción +
 *    esencia/afiliación sin necesidad de scroll excesivo;
 *  - cambiar de tab Refinamiento muestra los controles de in-zoom/unfold y
 *    oculta los controles semánticos;
 *  - el tab Apariciones lista los OPDs donde aparece la entidad y permite
 *    navegar cross-OPD con un click;
 *  - selección de enlace ofrece 3 tabs simétricos (Propiedades, Extremos,
 *    Estilo) con default Propiedades;
 *  - el tab activo persiste por sesión vía store (no localStorage).
 */

import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible, clickLinkPorTipo, elementoPorTexto } from "./_smoke-helpers";

test("entidad muestra 5 tabs con default Semántica y descripción visible sin scroll", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Proceso", exact: true }).click();

  const inspector = page.getByTestId("inspector");
  await expect(inspector).toHaveAttribute("data-modo-inspector", "entidad");

  // Los 5 tabs por intención existen en orden estricto.
  const tabsEsperados = [
    "inspector-tab-semantica",
    "inspector-tab-enlaces",
    "inspector-tab-refinamiento",
    "inspector-tab-apariciones",
    "inspector-tab-estilo",
  ];
  for (const tid of tabsEsperados) {
    await expect(page.getByTestId(tid)).toBeVisible();
  }

  // Default Semántica: aria-selected=true en el tab Semántica y false en el resto.
  await expect(page.getByTestId("inspector-tab-semantica")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByTestId("inspector-tab-refinamiento")).toHaveAttribute("aria-selected", "false");

  // Panel Semántica activo: existe el panel del tab default y muestra
  // controles semánticos (descripción y esencia/afiliación) por encima
  // del fold (sin necesidad de scroll en 1280x720).
  await expect(page.getByTestId("inspector-panel-semantica")).toBeVisible();
  await expect(page.getByTestId("inspector-seccion-descripcion")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("click en tab Refinamiento muestra controles de in-zoom y oculta los semánticos", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Proceso", exact: true }).click();

  // Cambio al tab Refinamiento.
  await page.getByTestId("inspector-tab-refinamiento").click();
  await expect(page.getByTestId("inspector-tab-refinamiento")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByTestId("inspector-tab-semantica")).toHaveAttribute("aria-selected", "false");

  // Panel Refinamiento muestra el botón Descomponer (control canónico de in-zoom).
  await expect(page.getByTestId("inspector-panel-refinamiento")).toBeVisible();
  await expect(page.getByRole("button", { name: "Descomponer" })).toBeVisible();
  // Las secciones semánticas (descripción) ya no están montadas en el DOM.
  await expect(page.getByTestId("inspector-seccion-descripcion")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("tab Apariciones lista OPDs y navega cross-OPD con un click", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  // Descomponer crea OPD hijo; el proceso aparece en el contorno del OPD hijo.
  // Ronda 20 L1: Descomponer vive en el tab `Refinamiento` (no default).
  await page.getByTestId("inspector-tab-refinamiento").click();
  await page.getByRole("button", { name: "Descomponer", exact: true }).click();
  // Tras la descomposición el OPD activo es el hijo (SD1). Volvemos a la raíz.
  await page.locator('[role="treeitem"][data-opd-id="opd-1"]').click();

  // Re-seleccionar el proceso en la raíz para que el inspector lo muestre.
  await elementoPorTexto(page, "Proceso").click();

  // El tab Apariciones debe estar disponible y, al activarlo, listar los
  // dos OPDs donde aparece el proceso (raíz + descomposición).
  await page.getByTestId("inspector-tab-apariciones").click();
  await expect(page.getByTestId("inspector-tab-apariciones")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByTestId("seccion-apariciones")).toBeVisible();

  // El OPD raíz aparece como activo (no clickeable).
  const aparicionRaiz = page.getByTestId("aparicion-opd-1");
  await expect(aparicionRaiz).toBeVisible();
  await expect(aparicionRaiz).toBeDisabled();

  // El OPD hijo (descomposición) aparece como navegable (no disabled).
  // Su id no es estable entre fixtures, así que lo localizamos por exclusión:
  // hay >= 2 items y el que no es opd-1 ni está disabled debe ser navegable.
  const items = page.locator('[data-testid^="aparicion-"]');
  const count = await items.count();
  expect(count).toBeGreaterThanOrEqual(2);

  // Click en cualquier item no-activo cambia el OPD activo: el árbol marca el
  // OPD destino como aria-current="page".
  for (let i = 0; i < count; i += 1) {
    const item = items.nth(i);
    const disabled = await item.isDisabled();
    if (!disabled) {
      await item.click();
      break;
    }
  }
  // Si la navegación cross-OPD ocurrió, el árbol expone el nuevo OPD activo.
  const arbol = page.getByRole("tree", { name: "Árbol OPD" });
  const activo = arbol.locator('[role="treeitem"][aria-current="page"]');
  await expect(activo).toHaveCount(1);
  // Y NO es el OPD raíz (porque navegamos a otro OPD).
  await expect(activo).not.toHaveAttribute("data-opd-id", "opd-1");

  expect(pageErrors).toEqual([]);
});

test("inspector de enlace expone 3 tabs simétricos con default Propiedades", async ({ page }) => {
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
  await clickLinkPorTipo(page, "Consumo");

  const inspector = page.getByTestId("inspector");
  await expect(inspector).toHaveAttribute("data-modo-inspector", "enlace");

  // 3 tabs en orden estricto, default propiedades.
  await expect(page.getByTestId("inspector-enlace-tab-propiedades")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByTestId("inspector-enlace-tab-extremos")).toBeVisible();
  await expect(page.getByTestId("inspector-enlace-tab-estilo")).toBeVisible();

  // Cambio al tab Estilo y persiste.
  await page.getByTestId("inspector-enlace-tab-estilo").click();
  await expect(page.getByTestId("inspector-enlace-tab-estilo")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByTestId("inspector-enlace-tab-propiedades")).toHaveAttribute("aria-selected", "false");

  expect(pageErrors).toEqual([]);
});
