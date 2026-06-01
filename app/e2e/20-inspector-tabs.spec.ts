/**
 * Smoke Codex v2 L3 — Inspector ficha continua (sin tabs).
 *
 * Reemplaza al smoke de tabs de la ronda 20. Tras Codex C9 el Inspector ya no
 * particiona el contenido en pestañas: todas las secciones se apilan en una
 * ficha tipográfica continua (`inspector-ficha` / `inspector-ficha-enlace`),
 * cada una bajo un kicker mono y visibles simultáneamente. Cubre:
 *  - entidad: las 6 secciones (Semántica, Enlaces, Refinamiento, Extensiones,
 *    Apariciones, Tamaño) están montadas y visibles a la vez, sin tablist ni tabs;
 *  - el header rotula con el identificador canónico de punto (`p.NN`), no con
 *    el id interno de guion;
 *  - enlace: las 2 secciones (Propiedades, Extremos) apiladas, sin tabs;
 *  - la navegación cross-OPD desde la sección Apariciones sigue funcionando;
 *  - la rama vacía no muestra los contadores `N objetos · N procesos · N OPDs`.
 */

import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial, clickLinkPorTipo, ejecutarAccionCommandPalette, elegirTipoEnlaceDesdeMenu, elementoPorTexto, exportadoActual, modeloDosOpds } from "./_smoke-helpers";

test("entidad muestra ficha continua con las 6 secciones apiladas y sin tabs", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Proceso", exact: true }).click();

  const inspector = page.getByTestId("inspector");
  await expect(inspector).toHaveAttribute("data-modo-inspector", "entidad");

  // Ficha continua: NO hay tablist ni tabs.
  await expect(inspector.locator('[role="tablist"]')).toHaveCount(0);
  await expect(inspector.locator('[role="tab"]')).toHaveCount(0);
  await expect(page.getByTestId("inspector-ficha")).toBeVisible();

  // Las 6 secciones están todas montadas y visibles simultáneamente.
  const secciones = [
    "inspector-panel-semantica",
    "inspector-panel-enlaces",
    "inspector-panel-refinamiento",
    "inspector-panel-extensiones",
    "inspector-panel-apariciones",
    "inspector-panel-tamano",
  ];
  for (const tid of secciones) {
    await expect(page.getByTestId(tid)).toBeVisible();
  }

  // La descripción (sección Semántica) y el estado de refinamiento conviven en
  // la misma ficha sin cambiar de pestaña.
  await expect(page.getByTestId("inspector-seccion-descripcion")).toBeVisible();
  await expect(page.getByTestId("refinamiento-estado-descomposicion")).toContainText("Inzoom: sin OPD hijo");

  expect(pageErrors).toEqual([]);
});

test("conectar submodelo selecciona un modelo existente desde catálogo y crea referencia LF-04", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const persistido = {
    id: "modelo-sub-e2e",
    nombre: "Modelo sub E2E",
    descripcion: "Detalle existente",
    creadoEn: "2026-06-01T00:00:00.000Z",
    actualizadoEn: "2026-06-01T00:05:00.000Z",
  };
  const payload = modeloDosOpds();
  await page.addInitScript(({ resumen, modelo }) => {
    localStorage.setItem(
      "deep-opm-pro:persistencia:index",
      JSON.stringify({ formato: "deep-opm-pro.persistencia.local.v1", modelos: [resumen] }),
    );
    localStorage.setItem(
      `deep-opm-pro:persistencia:modelo:${resumen.id}`,
      JSON.stringify({ formato: "deep-opm-pro.persistencia.local.v1", modelo: { ...resumen, json: JSON.stringify(modelo) } }),
    );
    localStorage.setItem(
      "deep-opm-pro:persistencia:workspace",
      JSON.stringify({ modelos: [{ id: resumen.id, carpetaId: null }], carpetas: [], recientes: [] }),
    );
  }, { resumen: persistido, modelo: payload });

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByRole("button", { name: "Conectar submodelo", exact: true }).click();

  const dialogo = page.getByTestId("dialogo-submodelo");
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByText("Modelo sub E2E")).toBeVisible();
  await expect(dialogo.getByText("Detalle existente")).toBeVisible();

  await dialogo.getByTestId("submodelo-modelo-tile").first().click();
  await expect(dialogo.getByLabel("Vista")).toHaveValue("Modelo sub E2E");
  await dialogo.getByRole("button", { name: "Conectar", exact: true }).click();
  await expect(dialogo).toHaveCount(0);

  const exportado = await exportadoActual(page);
  const submodelo = Object.values(exportado.modelo.submodelos ?? {})[0];
  expect(submodelo).toMatchObject({
    modeloId: "modelo-sub-e2e",
    nombre: "Modelo sub E2E",
    estado: "descargado",
  });
  expect(exportado.modelo.opds[submodelo!.opdVistaId!]?.vista).toMatchObject({
    kind: "submodel-view",
    submodeloRefId: submodelo!.id,
    readOnly: true,
  });

  expect(pageErrors).toEqual([]);
});

test("header del inspector rotula con identificador canónico de punto", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Proceso", exact: true }).click();

  const inspector = page.getByTestId("inspector");
  const header = inspector.locator("[data-entidad-id]");
  // El identificador visible usa punto (`p.01`), nunca guion (`p-1`).
  await expect(header).toContainText(/p\.\d+/);
  await expect(header).not.toContainText(/p-\d/);

  expect(pageErrors).toEqual([]);
});

test("sección Apariciones lista OPDs y navega cross-OPD con un click", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  // Inzoom crea OPD hijo; el proceso aparece en el contorno del OPD hijo.
  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");
  // Tras la descomposición el OPD activo es el hijo (SD1). Volvemos a la raíz.
  await page.locator('[role="treeitem"][data-opd-id="opd-1"]').click();

  // Re-seleccionar el proceso en la raíz para que el inspector lo muestre.
  await elementoPorTexto(page, "Proceso").click();

  // La sección Apariciones (en la ficha, sin tab) lista los dos OPDs.
  await expect(page.getByTestId("seccion-apariciones")).toBeVisible();

  // El OPD raíz aparece como activo (no clickeable).
  const aparicionRaiz = page.getByTestId("aparicion-opd-1");
  await expect(aparicionRaiz).toBeVisible();
  await expect(aparicionRaiz).toBeDisabled();

  const items = page.locator('[data-testid^="aparicion-"]');
  const count = await items.count();
  expect(count).toBeGreaterThanOrEqual(2);

  for (let i = 0; i < count; i += 1) {
    const item = items.nth(i);
    const disabled = await item.isDisabled();
    if (!disabled) {
      await item.click();
      break;
    }
  }
  const arbol = page.getByRole("tree", { name: "Árbol OPD" });
  const activo = arbol.locator('[role="treeitem"][aria-current="page"]');
  await expect(activo).toHaveCount(1);
  await expect(activo).not.toHaveAttribute("data-opd-id", "opd-1");

  expect(pageErrors).toEqual([]);
});

test("sección Enlaces lista in/out y navega al inspector del enlace", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await elementoPorTexto(page, "Entrada").click();
  await elegirTipoEnlaceDesdeMenu(page, "consumo");
  await elementoPorTexto(page, "Procesar").click();

  await elementoPorTexto(page, "Entrada").click();

  const salientes = page.getByTestId("inspector-enlaces-salientes");
  await expect(salientes).toContainText("Salientes (1)");
  await expect(salientes).toContainText("consumo");
  await expect(salientes).toContainText("Procesar");
  await expect(salientes).toContainText("SD");

  const fila = page.locator('[data-testid^="inspector-enlaces-fila-"]').first();
  await expect(fila).toHaveAttribute("data-ifml-event", "SelectEvent");
  await expect(fila).toHaveAttribute("data-ifml-flow", "NavigationFlow");
  await fila.click();

  await expect(page.getByTestId("inspector")).toHaveAttribute("data-modo-inspector", "enlace");
  // La ficha del enlace monta sus secciones propias; ya no hay tab activo.
  await expect(page.getByTestId("inspector-panel-enlace-propiedades")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("inspector de enlace muestra ficha con las secciones apiladas y sin tabs", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await elementoPorTexto(page, "Entrada").click();
  await elegirTipoEnlaceDesdeMenu(page, "consumo");
  await elementoPorTexto(page, "Procesar").click();
  await clickLinkPorTipo(page, "Consumo");

  const inspector = page.getByTestId("inspector");
  await expect(inspector).toHaveAttribute("data-modo-inspector", "enlace");

  // Sin tablist; ficha de enlace con las 2 secciones visibles a la vez.
  await expect(inspector.locator('[role="tablist"]')).toHaveCount(0);
  await expect(page.getByTestId("inspector-ficha-enlace")).toBeVisible();
  await expect(page.getByTestId("inspector-panel-enlace-propiedades")).toBeVisible();
  await expect(page.getByTestId("inspector-panel-enlace-extremos")).toBeVisible();

  // El header del enlace rotula con punto (`e.NN`), no con guion.
  const header = inspector.locator("[data-enlace-id]");
  await expect(header).toContainText(/e\.\d+/);

  expect(pageErrors).toEqual([]);
});

test("inspector vacío no muestra contadores N objetos · N procesos · N OPDs", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  const inspector = page.getByTestId("inspector");
  await expect(inspector).toHaveAttribute("data-modo-inspector", "vacio");
  await expect(page.getByTestId("inspector-vacio")).toBeVisible();
  // Los contadores fueron retirados (Codex v2 / L3).
  await expect(page.getByTestId("inspector-vacio-conteos")).toHaveCount(0);
  // Placeholder editorial en su lugar.
  await expect(page.getByTestId("inspector-vacio-placeholder")).toHaveText(
    "Selecciona un elemento.",
  );
  await expect(page.getByTestId("inspector-vacio-renombrar")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});
