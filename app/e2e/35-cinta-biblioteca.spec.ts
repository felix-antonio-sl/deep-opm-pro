// B5 (gesto de anclar) — Cinta de modo de biblioteca (spec §2(d)).
//
// Falsa la cinta del topbar end-to-end: aparece SOLO sobre una biblioteca, en
// dos estados (solo-lectura / editando), y el desbloqueo «Editar biblioteca»
// pide UNA confirmación con el COPY exacto del spec — no por-edición.
//
// La biblioteca-abierta se conduce por el store (mismo patrón que
// 34-centinela-drift: `import('/src/store.ts')`), sin sembrar backend: lo que se
// prueba aquí es la cinta + el diálogo, no el camino de persistencia (cubierto
// por el unit de gobernanza). El COPY exacto se ancla además en el unit del
// store contra deriva textual.

import { expect, test, type Page } from "@playwright/test";
import { esperarWorkbenchInicial } from "./_smoke-helpers";

const RUTA_STORE = "/src/store.ts";

const COPY_EXACTO =
  "Editar esta biblioteca puede hacer divergir los modelos anclados a ella. " +
  "La próxima vez que se abran, verán un aviso de cambio. No se rompe nada: solo se enteran.";

async function gobernarBiblioteca(page: Page, esBiblioteca: boolean): Promise<void> {
  await page.evaluate(async ({ ruta, valor }) => {
    const m = (await import(ruta)) as {
      store: { getState: () => { gobernarAperturaBiblioteca: (v: boolean) => void } };
    };
    m.store.getState().gobernarAperturaBiblioteca(valor);
  }, { ruta: RUTA_STORE, valor: esBiblioteca });
}

test.describe("B5 — cinta de modo de biblioteca", () => {
  test("dos estados + confirmación única con el COPY del spec", async ({ page }) => {
    await page.goto("/");
    await esperarWorkbenchInicial(page);

    const cinta = page.getByTestId("cinta-biblioteca");
    const dialogoCopy = page.getByTestId("dialogo-editar-biblioteca-copy");

    // Sobre un modelo normal la cinta no existe (no se fuga al resto de la app).
    await expect(cinta).toHaveCount(0);

    // Abrir una biblioteca → estado solo-lectura.
    await gobernarBiblioteca(page, true);
    await expect(cinta).toBeVisible();
    await expect(cinta).toContainText("Biblioteca");
    await expect(cinta).toContainText("solo lectura");
    await expect(page.getByTestId("cinta-biblioteca-editar")).toBeVisible();
    await expect(page.getByTestId("cinta-biblioteca-terminar")).toHaveCount(0);

    // «Editar biblioteca» abre el diálogo con el COPY exacto y CERO crimson en el
    // texto (la gravedad la lleva el copy, no el color).
    await page.getByTestId("cinta-biblioteca-editar").click();
    await expect(page.getByTestId("dialogo-editar-biblioteca")).toBeVisible();
    await expect(dialogoCopy).toHaveText(COPY_EXACTO);

    // Confirmar «Editar de todos modos» → el diálogo se va y la cinta pasa a
    // «editando».
    await page.getByTestId("dialogo-editar-biblioteca-confirmar").click();
    await expect(page.getByTestId("dialogo-editar-biblioteca")).toHaveCount(0);
    await expect(cinta).toContainText("Editando");
    await expect(cinta).toContainText("los anclados verán un aviso");
    await expect(page.getByTestId("cinta-biblioteca-terminar")).toBeVisible();
    await expect(page.getByTestId("cinta-biblioteca-editar")).toHaveCount(0);

    // Confirmación UNA sola vez: ya editando, no reaparece un diálogo por-edición.
    await expect(page.getByTestId("dialogo-editar-biblioteca")).toHaveCount(0);

    // «Terminar edición» → vuelve a solo-lectura sin pedir nada.
    await page.getByTestId("cinta-biblioteca-terminar").click();
    await expect(cinta).toContainText("solo lectura");
    await expect(page.getByTestId("cinta-biblioteca-editar")).toBeVisible();
    await expect(page.getByTestId("dialogo-editar-biblioteca")).toHaveCount(0);
  });

  test("Cancelar deja la biblioteca en solo-lectura", async ({ page }) => {
    await page.goto("/");
    await esperarWorkbenchInicial(page);
    await gobernarBiblioteca(page, true);

    await page.getByTestId("cinta-biblioteca-editar").click();
    await expect(page.getByTestId("dialogo-editar-biblioteca")).toBeVisible();
    await page.getByTestId("dialogo-editar-biblioteca-cancelar").click();

    await expect(page.getByTestId("dialogo-editar-biblioteca")).toHaveCount(0);
    await expect(page.getByTestId("cinta-biblioteca")).toContainText("solo lectura");
    await expect(page.getByTestId("cinta-biblioteca-editar")).toBeVisible();
  });
});
