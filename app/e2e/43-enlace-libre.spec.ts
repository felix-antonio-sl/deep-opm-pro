import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial, elementoPorTexto, exportadoActual, jsonEditor } from "./_smoke-helpers";

// BUG-20260708T193209Z-f688a1: «El atajo "R" no está activo. no permite enlazar
// cosas». Causa raíz: R sin selección retornaba en silencio-cero. Fix híbrido:
// con selección R usa el origen preseleccionado (camino rápido); sin selección
// R entra en el enlace libre (elige origen → elige destino con dos clicks).

test("R sin selección entra en enlace libre y dos clicks crean el enlace", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await jsonEditor(page).fill(JSON.stringify(modeloDosCosas(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  await expect(elementoPorTexto(page, "Entrada")).toBeVisible();
  await expect(elementoPorTexto(page, "Procesar")).toBeVisible();

  // Foco al canvas + sin selección (esquina vacía del paper, entidades en x≥120).
  await page.locator(".joint-paper").click({ position: { x: 6, y: 6 } });
  await page.keyboard.press("Escape");

  // R sin nada seleccionado: fase «elige origen». No hay silencio-cero: las cosas
  // del OPD se marcan como candidatas a origen.
  await page.keyboard.press("r");
  await expect(page.locator('[data-opm-modo-enlace="origen-candidato"]')).toHaveCount(2);

  // Primer click: fija «Entrada» como origen → transición a fase destino.
  await elementoPorTexto(page, "Entrada").locator('[joint-selector="body"]').click();
  await expect(page.getByTestId("indicador-modo-canonico")).toHaveAttribute("data-modo", "conectar");

  // Segundo click: «Procesar» como destino → enlace creado con el tipo sugerido.
  await elementoPorTexto(page, "Procesar").locator('[joint-selector="body"]').click();
  await expect(page.locator(".joint-link")).toHaveCount(1);

  const exportado = await exportadoActual(page);
  const enlace = Object.values(exportado.modelo.enlaces)[0];
  expect(enlace).toBeTruthy();
  expect(pageErrors).toEqual([]);
});

test("Escape en fase elige-origen cancela el enlace libre sin crear nada", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await jsonEditor(page).fill(JSON.stringify(modeloDosCosas(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  await expect(elementoPorTexto(page, "Entrada")).toBeVisible();

  await page.locator(".joint-paper").click({ position: { x: 6, y: 6 } });
  await page.keyboard.press("Escape");
  await page.keyboard.press("r");
  await expect(page.locator('[data-opm-modo-enlace="origen-candidato"]')).toHaveCount(2);

  await page.keyboard.press("Escape");
  await expect(page.locator('[data-opm-modo-enlace="origen-candidato"]')).toHaveCount(0);

  const exportado = await exportadoActual(page);
  expect(Object.keys(exportado.modelo.enlaces)).toHaveLength(0);
});

function modeloDosCosas() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-enlace-libre",
      nombre: "Modelo enlace libre",
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
            "a-procesar": { id: "a-procesar", entidadId: "p-procesar", opdId: "opd-1", x: 380, y: 150, width: 135, height: 60 },
          },
          enlaces: {},
        },
      },
    },
  };
}
