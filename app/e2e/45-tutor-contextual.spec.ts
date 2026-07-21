import { expect, test } from "@playwright/test";
import {
  confirmarRefinamientoPendiente,
  elementoPorTexto,
  ejecutarComandoPalette,
  esperarWorkbenchInicial,
  jsonEditor,
  modeloDosOpds,
} from "./_smoke-helpers";

test("refinar pide una pregunta antes del único commit y la muestra en el OPD hijo", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Proceso", exact: true }).click();

  await page.getByTestId("barra-inzoom").click();
  const formulario = page.getByTestId("tutor-refinamiento");
  await expect(formulario).toBeVisible();
  await expect(formulario.getByTestId("tutor-refinamiento-pregunta")).toBeFocused();
  await expect(formulario.getByTestId("tutor-refinamiento-confirmar")).toBeDisabled();
  await expect(page.locator('[role="treeitem"][data-opd-id="opd-2"]')).toHaveCount(0);

  await formulario.getByText("Fundamento", { exact: true }).click();
  const fuenteManual = formulario.getByRole("link", { name: /Manual de opforja/ });
  await expect(fuenteManual).toBeVisible();
  const popupPromise = page.waitForEvent("popup");
  await fuenteManual.click();
  const fuenteCompleta = await popupPromise;
  await fuenteCompleta.waitForLoadState("domcontentloaded");
  await expect(fuenteCompleta).toHaveURL(/\/tutor-sources\/source\.manual\.opforja\.html#refinement$/);
  await expect(fuenteCompleta.locator(":target")).toBeVisible();
  await fuenteCompleta.close();

  await confirmarRefinamientoPendiente(page, {
    pregunta: "¿Qué subprocesos explican la transformación?",
  });

  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" }))
    .toHaveAttribute("aria-current", "page");
  await expect(page.getByTestId("pregunta-guia-opd")).toContainText("¿Qué subprocesos explican la transformación?");
  await expect(page.getByTestId("panel-opl")).not.toContainText("¿Qué subprocesos explican la transformación?");
});

test("Escape cancela el gateway de refinamiento sin crear un OPD", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const disparador = page.getByTestId("barra-inzoom");
  await disparador.click();
  await expect(page.getByTestId("tutor-refinamiento")).toBeVisible();

  await page.keyboard.press("Escape");

  await expect(page.getByTestId("tutor-refinamiento")).toHaveCount(0);
  await expect(page.getByRole("treeitem")).toHaveCount(1);
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await expect(disparador).toBeVisible();
  await expect(disparador).toBeFocused();
});

test("Editar la pregunta conserva valor y foco al cancelar y revela su fundamento", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByTestId("barra-inzoom").click();
  await confirmarRefinamientoPendiente(page, {
    pregunta: "¿Qué subprocesos explican la transformación?",
  });

  const editar = page.getByRole("button", { name: "Editar", exact: true });
  await editar.click();
  const editor = page.getByTestId("pregunta-guia-editor");
  await expect(editor.getByTestId("pregunta-guia-input")).toBeFocused();
  await editor.getByText("Por qué", { exact: true }).click();
  await expect(editor).toContainText("Cada refinamiento debe responder una pregunta real, no decorar el árbol.");
  await expect(editor).toContainText("Manual de opforja");
  await expect(editor).toContainText("Metodología Forja OPM");

  await editor.getByTestId("pregunta-guia-input").fill("Cambio que no se guardará");
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("pregunta-guia-opd")).toContainText("¿Qué subprocesos explican la transformación?");
  await expect(editar).toBeFocused();

  await editar.click();
  await page.getByTestId("pregunta-guia-input").fill("Otro cambio no guardado");
  await page.getByTestId("pregunta-guia-editor").getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(page.getByTestId("pregunta-guia-opd")).toContainText("¿Qué subprocesos explican la transformación?");
  await expect(editar).toBeFocused();
});

test("Escape al cancelar adopción conserva la selección y devuelve foco al OPD suelto", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Cargar");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Pedido");

  const arbol = page.getByRole("tree", { name: "Árbol OPD" });
  const banda = page.getByTestId("arbol-banda-taller");
  await page.getByTestId("arbol-nuevo-suelto").click();
  const suelto = banda.getByRole("treeitem").first();
  await expect(suelto).toBeVisible();

  await arbol.getByRole("treeitem").first().click();
  await elementoPorTexto(page, "Cargar").click();
  await suelto.click({ button: "right" });
  await page.getByTestId("menu-adoptar-descomposicion").click();
  const formulario = page.getByTestId("tutor-refinamiento");
  await expect(formulario).toBeVisible();
  await expect(formulario).toContainText("¿Qué pregunta responde este OPD al refinar «Cargar»?");
  await formulario.getByLabel("Elemento que refina").selectOption({ label: "Pedido" });
  await expect(formulario).toContainText("¿Qué pregunta responde este OPD al refinar «Pedido»?");

  await page.keyboard.press("Escape");

  await expect(page.getByTestId("tutor-refinamiento")).toHaveCount(0);
  await expect(banda).toBeVisible();
  await expect(page.getByTestId("barra-inzoom")).toBeVisible();
  await expect(suelto).toBeFocused();
});

test("la ficha local conecta campo y enfoque a commits atómicos recuperables", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  const seccion = page.getByTestId("inspector-ficha-trabajo");
  await seccion.getByTestId("inspector-ficha-trabajo-toggle").click();

  const pregunta = seccion.getByLabel("Pregunta habilitante");
  await expect(pregunta).toHaveAttribute(
    "data-tutor-entrypoint",
    "inspector:ficha-pregunta-habilitante",
  );
  await pregunta.fill("¿Qué frontera debe explicar este modelo?");
  await pregunta.blur();

  const tutor = seccion.getByTestId("tutor-ficha-trabajo");
  await expect(tutor).toHaveAttribute("data-tutor-intervention", "confirm");
  await expect(tutor).toHaveAttribute("data-tutor-action", "inspector:ficha-pregunta-habilitante");
  await expect(tutor).toContainText("Declara solo el contexto que ayude a decidir y revisar el modelo.");
  expect((await modeloActualDesdeStore(page)).fichaTrabajo?.preguntaHabilitante)
    .toBe("¿Qué frontera debe explicar este modelo?");

  await page.keyboard.press("Control+z");
  await expect(pregunta).toHaveValue("");
  expect((await modeloActualDesdeStore(page)).fichaTrabajo?.preguntaHabilitante).toBeUndefined();
  await expect(tutor).toHaveCount(0);

  const sistemas = seccion.getByLabel("Sistemas", { exact: true });
  await expect(sistemas).toHaveAttribute(
    "data-tutor-entrypoint",
    "inspector:ficha-lentes-conocimiento",
  );
  await sistemas.check();
  await expect(tutor).toHaveAttribute("data-tutor-action", "inspector:ficha-lentes-conocimiento");
  expect((await modeloActualDesdeStore(page)).lentesConocimiento).toEqual(["sistemas"]);
  await page.keyboard.press("Control+z");
  await expect(sistemas).not.toBeChecked();
  expect((await modeloActualDesdeStore(page)).lentesConocimiento ?? []).toEqual([]);
  await expect(tutor).toHaveCount(0);
});

for (const viewport of [
  { width: 1280, height: 720, label: "escritorio" },
  { width: 640, height: 800, label: "estrecho" },
] as const) {
  test(`crear una cosa deja una sola voz contextual en ${viewport.label}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await esperarWorkbenchInicial(page);
    await page.getByRole("button", { name: "Objeto", exact: true }).click();

    const deltaOpl = page.getByTestId("panel-opl-delta");
    await expect(deltaOpl).toBeVisible();
    await expect(deltaOpl).toContainText("OPL actualizada");
    await expect(page.getByText("¿Expresa la nueva decisión?", { exact: true })).toHaveCount(0);
    const voces = page.locator('[data-tutor-intervention]:visible');
    await expect(voces).toHaveCount(1);
    await expect(voces).toHaveAttribute("data-tutor-intervention", "orient");
    await expect(voces).toContainText("Decide si la cosa existe o transforma.");
    await expect(voces.getByText("Criterio", { exact: true })).toBeVisible();
    await expect(voces.getByText("Fundamento", { exact: true })).toBeVisible();
    await expect(page.getByText("Guía", { exact: true })).toHaveCount(0);
  });
}

test("la importación distingue reemplazo riesgoso de pestaña nueva recuperable", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Trabajo local");
  await expect(page.getByRole("tab")).toHaveCount(1);
  await jsonEditor(page).fill(JSON.stringify(modeloDosOpds(), null, 2));

  const reemplazar = page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true });
  await reemplazar.click();
  const confirmacion = page.getByRole("dialog", { name: "Hay cambios sin guardar" });
  await expect(confirmacion).toBeVisible();
  await expect(confirmacion).toHaveCount(1);
  await expect(page.getByTestId("tutor-importacion-json")).toHaveCount(0);
  await confirmacion.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(confirmacion).toHaveCount(0);
  await expect(elementoPorTexto(page, "Trabajo local")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Objeto Raiz")).toHaveCount(0);
  await expect(reemplazar).toBeFocused();

  await page.getByRole("button", { name: "Importar en pestaña nueva", exact: true }).click();

  await expect(page.getByRole("tab")).toHaveCount(2);
  await expect(page.getByRole("tab", { selected: true })).toContainText("Modelo multi OPD");
  await page.getByRole("tab").first().click();
  await expect(elementoPorTexto(page, "Trabajo local")).toHaveCount(1);
});

test("requisitos y vocabulario exponen guía propietaria sin prometer inferencia", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await ejecutarComandoPalette(page, "ontologia canon sinonimo", "menu-configurar-ontologia");
  const ontologia = page.getByTestId("dialogo-ontologia");
  await expect(ontologia).toContainText("Normalización léxica");
  const tutorOntologia = ontologia.getByTestId("tutor-dialogo-ontologia");
  await expect(tutorOntologia).toHaveAttribute("data-tutor-intervention", "orient");
  await expect(tutorOntologia)
    .toContainText("no construye una ontología formal");
  await expect(tutorOntologia.getByText("Criterio", { exact: true })).toBeVisible();
  await expect(tutorOntologia.getByText("Fundamento", { exact: true })).toBeVisible();
  await expect(ontologia).toContainText("todavía no sugiere ni reemplaza nombres automáticamente");
  await ontologia.getByRole("button", { name: "Cancelar", exact: true }).click();

  await ejecutarComandoPalette(page, "crear requisito", "menu-crear-requisito");
  const requisito = page.getByTestId("dialogo-requisito");
  const tutorRequisito = requisito.getByTestId("tutor-dialogo-requisito");
  await expect(tutorRequisito).toHaveAttribute("data-tutor-intervention", "orient");
  await expect(tutorRequisito)
    .toContainText("no demuestra satisfacción externa ni certifica cumplimiento");
  await expect(tutorRequisito.getByText("Criterio", { exact: true })).toBeVisible();
});

test("la simulación numérica declara el alcance real del CSV", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await ejecutarComandoPalette(page, "simulacion numerica", "menu-simulacion-numerica");

  const dialogo = page.getByTestId("modal-simulacion-numerica");
  const alcance = dialogo.getByTestId("simulacion-numerica-alcance");
  await expect(alcance).toHaveAttribute("data-tutor-intervention", "orient");
  await expect(alcance)
    .toContainText("no dinámica de procesos, colas, capacidad, rendimiento ni evidencia real");
  await expect(alcance.getByText("Criterio", { exact: true })).toBeVisible();
  await expect(alcance.getByText("Fundamento", { exact: true })).toBeVisible();
});

test("Ctrl+K encuentra una referencia local y muestra criterio con fuentes", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await palette.getByRole("combobox").fill("composición linealidad");

  const referencia = page.getByTestId("command-palette-item-tutor-content.composition.choice");
  await expect(referencia).toBeVisible();
  await referencia.hover();
  const preview = page.getByTestId("command-palette-tutor-preview");
  await expect(preview).toContainText("Criterio:");
  await expect(preview).toContainText("Reglas OPM estrictas");

  const popupPromise = page.waitForEvent("popup");
  await page.keyboard.press("Enter");
  const referenciaCompleta = await popupPromise;
  await referenciaCompleta.waitForLoadState("domcontentloaded");
  await expect(referenciaCompleta).toHaveURL(/\/tutor-sources\/source\.canon\.rules\.html#[a-z0-9-]+$/);
  await expect(referenciaCompleta.locator("body")).toContainText("Reglas OPM estrictas — SSOT prescriptiva");
  await expect(referenciaCompleta.locator(":target")).toBeVisible();
});

test("Ctrl+K deja PDF, diff y merge como referencia sin CTA ficticio", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await palette.getByRole("combobox").fill("PDF diff visual merge");

  const referencia = page.getByTestId("command-palette-item-tutor-content.export.external-limit");
  await expect(referencia).toBeVisible();
  await expect(referencia).not.toHaveAttribute("data-tutor-entrypoint", /.*/);
  await referencia.hover();
  await expect(palette.getByTestId("command-palette-tutor-preview"))
    .toContainText("Esas capacidades no están disponibles en la mesa.");
  await expect(palette.locator('[data-tutor-entrypoint]').filter({ hasText: /PDF|diff|merge/i }))
    .toHaveCount(0);

  const popupPromise = page.waitForEvent("popup");
  await page.keyboard.press("Enter");
  const fuente = await popupPromise;
  await fuente.waitForLoadState("domcontentloaded");
  await expect(fuente).toHaveURL(/\/tutor-sources\//);
  await fuente.close();
});

test("Ctrl+K prioriza una fuente exacta del corpus antes que resultados temáticos", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await palette.getByRole("combobox").fill("opforja y skill flujo de trabajo");

  const fuenteExacta = page.getByTestId("command-palette-item-tutor-source.cheatsheet.skill-flow");
  await expect(fuenteExacta).toBeVisible();
  await expect(palette.getByRole("option").first()).toHaveAttribute(
    "data-testid",
    "command-palette-item-tutor-source.cheatsheet.skill-flow",
  );
  await expect(palette.getByTestId("command-palette-tutor-preview"))
    .toContainText("opforja y skill — Flujo de trabajo");
});

async function modeloActualDesdeStore(page: import("@playwright/test").Page) {
  return page.evaluate(async () => {
    const { store } = await import("/src/store.ts");
    return JSON.parse(store.getState().exportarJson()).modelo;
  });
}
