/**
 * Smoke 20 — Biblioteca dock convive con canvas y filtra correctamente.
 *
 * L3 ronda 20: la biblioteca dock se acopla bajo el árbol OPD y debe
 * permitir trabajar con árbol + dock + canvas + inspector visibles a la
 * vez en desktop ≥ 900px. Cierra criterio del informe UI/UX 2026-05-07
 * línea 159: "Abrir la biblioteca no debe tapar el area central del
 * modelo salvo en mobile. Debe poder quedar visible mientras se navega
 * el canvas".
 */
import { expect, test, type Page } from "@playwright/test";
import { jsonEditor } from "./_smoke-helpers";

function modeloBibliotecaSmoke() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-biblio",
      nombre: "Modelo biblioteca dock",
      opdRaizId: "opd-1",
      nextSeq: 20,
      entidades: {
        "o-motor": {
          id: "o-motor",
          tipo: "objeto",
          nombre: "Motor",
          esencia: "fisica",
          afiliacion: "sistemica",
        },
        "o-pieza": {
          id: "o-pieza",
          tipo: "objeto",
          nombre: "Pieza",
          esencia: "fisica",
          afiliacion: "sistemica",
        },
        "p-armar": {
          id: "p-armar",
          tipo: "proceso",
          nombre: "Armar",
          esencia: "fisica",
          afiliacion: "sistemica",
        },
        "p-probar": {
          id: "p-probar",
          tipo: "proceso",
          nombre: "Probar motor",
          esencia: "fisica",
          afiliacion: "sistemica",
        },
        "o-tornillo": {
          id: "o-tornillo",
          tipo: "objeto",
          nombre: "Tornillo",
          esencia: "fisica",
          afiliacion: "sistemica",
        },
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
            "a-motor": {
              id: "a-motor",
              entidadId: "o-motor",
              opdId: "opd-1",
              x: 120,
              y: 100,
              width: 135,
              height: 60,
            },
            "a-armar": {
              id: "a-armar",
              entidadId: "p-armar",
              opdId: "opd-1",
              x: 320,
              y: 100,
              width: 135,
              height: 60,
            },
          },
          enlaces: {},
        },
      },
    },
  };
}

test.describe("biblioteca dock", () => {
  test("Ctrl+B abre el dock; canvas y arbol siguen visibles", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    await jsonEditor(page).fill(JSON.stringify(modeloBibliotecaSmoke(), null, 2));
    await page.getByRole("button", { name: "Importar" }).click();

    // Dock cerrado por default.
    await expect(page.getByTestId("biblioteca-dock")).toHaveCount(0);

    // Toggle via Ctrl+B (atajo global).
    await page.keyboard.press("Control+b");
    await expect(page.getByTestId("biblioteca-dock")).toBeVisible();

    // Convivencia: arbol + dock + canvas + inspector siguen visibles.
    await expect(page.getByTestId("tree-pane")).toBeVisible();
    await expect(page.getByTestId("biblioteca-dock-pane")).toBeVisible();
    await expect(page.getByTestId("canvas-pane")).toBeVisible();
    await expect(page.getByTestId("inspector-pane")).toBeVisible();

    // La acción vive en ⋯ Más y refleja estado activo.
    await esperarEstadoBibliotecaDockEnMas(page, "true");

    // Cerrar via Ctrl+B nuevamente.
    await page.keyboard.press("Control+b");
    await expect(page.getByTestId("biblioteca-dock")).toHaveCount(0);
    await esperarEstadoBibliotecaDockEnMas(page, "false");

    expect(pageErrors).toEqual([]);
  });

  test("busqueda filtra items por nombre", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    await jsonEditor(page).fill(JSON.stringify(modeloBibliotecaSmoke(), null, 2));
    await page.getByRole("button", { name: "Importar" }).click();

    await clickToolbarMasItem(page, "toolbar-mas-biblioteca-dock");
    await expect(page.getByTestId("biblioteca-dock")).toBeVisible();

    // Sin filtro: 5 entidades.
    await expect(page.getByTestId("biblioteca-dock-contador")).toHaveText("5 entidades");

    // Filtra por "motor".
    await page.getByTestId("biblioteca-dock-buscar").fill("motor");
    await expect(page.getByTestId("biblioteca-dock-contador")).toHaveText("2 entidades");

    // Filtra por algo que no existe → empty state.
    await page.getByTestId("biblioteca-dock-buscar").fill("zzz");
    await expect(page.getByTestId("biblioteca-dock-empty")).toBeVisible();
    await expect(page.getByTestId("biblioteca-dock-contador")).toHaveText("0 entidades");

    expect(pageErrors).toEqual([]);
  });

  test("filtros por tipo y por OPD activo combinan correctamente", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    await jsonEditor(page).fill(JSON.stringify(modeloBibliotecaSmoke(), null, 2));
    await page.getByRole("button", { name: "Importar" }).click();

    await clickToolbarMasItem(page, "toolbar-mas-biblioteca-dock");
    await expect(page.getByTestId("biblioteca-dock")).toBeVisible();

    // Default: chip "Todos" activo, contador 5.
    await expect(page.getByTestId("biblioteca-filtro-todos")).toHaveAttribute("aria-checked", "true");
    await expect(page.getByTestId("biblioteca-dock-contador")).toHaveText("5 entidades");

    // Filtra por "Objetos": Motor, Pieza, Tornillo.
    await page.getByTestId("biblioteca-filtro-objetos").click();
    await expect(page.getByTestId("biblioteca-filtro-objetos")).toHaveAttribute("aria-checked", "true");
    await expect(page.getByTestId("biblioteca-dock-contador")).toHaveText("3 entidades");

    // Filtra por "Procesos": Armar, Probar motor.
    await page.getByTestId("biblioteca-filtro-procesos").click();
    await expect(page.getByTestId("biblioteca-dock-contador")).toHaveText("2 entidades");

    // Solo OPD activo (opd-1 raíz tiene Motor + Armar).
    await page.getByTestId("biblioteca-filtro-todos").click();
    await page.getByTestId("biblioteca-filtro-opd-activo").click();
    await expect(page.getByTestId("biblioteca-filtro-opd-activo")).toHaveAttribute("aria-checked", "true");
    await expect(page.getByTestId("biblioteca-dock-contador")).toHaveText("2 entidades");

    expect(pageErrors).toEqual([]);
  });
});

async function clickToolbarMasItem(page: Page, testId: string): Promise<void> {
  await page.getByTestId("toolbar-mas-trigger").click();
  await page.getByTestId(testId).click();
}

async function esperarEstadoBibliotecaDockEnMas(page: Page, estado: "true" | "false"): Promise<void> {
  await page.getByTestId("toolbar-mas-trigger").click();
  await expect(page.getByTestId("toolbar-mas-biblioteca-dock")).toHaveAttribute("aria-pressed", estado);
  await page.keyboard.press("Escape");
}
