import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial, elementoPorTexto, exportadoActual, jsonEditor, rectDeLocator } from "./_smoke-helpers";

test("drag desde anchor abre MenuTipoEnlace anclado y confirma conexion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await jsonEditor(page).fill(JSON.stringify(modeloConexionAnchor(), null, 2));
  await page.getByRole("button", { name: "Importar", exact: true }).click();
  await expect(elementoPorTexto(page, "Entrada")).toBeVisible();
  await expect(elementoPorTexto(page, "Procesar")).toBeVisible();
  await elementoPorTexto(page, "Entrada").click();

  const entradaBody = elementoPorTexto(page, "Entrada").locator('[joint-selector="body"]');
  const procesarBody = elementoPorTexto(page, "Procesar").locator('[joint-selector="body"]');
  const entrada = await rectDeLocator(entradaBody);
  const procesar = await rectDeLocator(procesarBody);
  const anchorE = { x: entrada.x + entrada.width, y: entrada.y + entrada.height / 2 };
  const destino = { x: procesar.x + procesar.width / 2, y: procesar.y + procesar.height / 2 };

  await page.mouse.move(anchorE.x, anchorE.y);
  await page.mouse.down();
  await expect(page.getByTestId("indicador-modo-canonico")).toHaveAttribute("data-modo", "conectar");
  await expect(page.locator(".joint-link")).toHaveCount(1);
  await page.mouse.move(destino.x, destino.y, { steps: 6 });
  await page.mouse.up();

  const menu = page.getByTestId("menu-tipo-enlace");
  await expect(menu).toBeVisible();
  await expect(menu.getByText("Conectar Entrada → Procesar")).toBeVisible();
  await menu.getByTestId("menu-tipo-enlace-consumo").click();

  await expect(page.locator(".joint-link")).toHaveCount(1);
  const exportado = await exportadoActual(page);
  const enlaceConsumo = Object.values(exportado.modelo.enlaces).find((enlace) => enlace.tipo === "consumo");
  const portId = enlaceConsumo?.origenId.portId;
  const entradaApariencia = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .find((apariencia) => apariencia.entidadId === "o-entrada");
  expect(enlaceConsumo).toBeTruthy();
  expect(entradaApariencia?.ports?.[portId!]).toEqual({ x: 1, y: 0.5 });
  expect(pageErrors).toEqual([]);
});

test("camino Conectar por boton muestra tip de anchor antes de elegir destino", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await jsonEditor(page).fill(JSON.stringify(modeloConexionAnchor(), null, 2));
  await page.getByRole("button", { name: "Importar", exact: true }).click();
  await elementoPorTexto(page, "Entrada").locator('[joint-selector="body"]').click();

  await page.getByTestId("abrir-menu-tipo-enlace").click();
  await page.getByTestId("menu-tipo-enlace-consumo").click();

  await expect(page.getByTestId("indicador-modo-canonico")).toHaveAttribute("data-modo", "conectar");
  await expect(page.getByTestId("nudge-conexion-anchor")).toContainText("Tip: arrastra desde un anchor ◉");
});

test("teclado conecta foco origen y destino mediante MenuTipoEnlace", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await jsonEditor(page).fill(JSON.stringify(modeloConexionAnchor(), null, 2));
  await page.getByRole("button", { name: "Importar", exact: true }).click();

  const entrada = elementoPorTexto(page, "Entrada");
  const procesar = elementoPorTexto(page, "Procesar");
  await expect(entrada).toHaveAttribute("data-opm-keyboard-connect", "true");
  await expect(procesar).toHaveAttribute("data-opm-keyboard-connect", "true");

  await entrada.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("indicador-modo-canonico")).toHaveAttribute("data-modo", "conectar");
  await expect(page.getByTestId("indicador-modo-canonico")).toHaveAttribute("role", "status");
  await expect(page.getByTestId("indicador-modo-canonico")).toHaveAttribute("aria-live", "polite");
  await expect(page.getByTestId("viewpoint-heading")).toHaveText("Workbench OPM - conectando");

  await page.keyboard.press("Tab");
  await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "")).toContain("Proceso Procesar");
  await page.keyboard.press("Enter");

  const menu = page.getByTestId("menu-tipo-enlace");
  await expect(menu).toBeVisible();
  await expect(menu.getByText("Conectar Entrada → Procesar")).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute("data-testid") ?? "")).toBe("menu-tipo-enlace-exhibicion");

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute("data-testid") ?? "")).toBe("menu-tipo-enlace-consumo");
  await page.keyboard.press("Enter");

  await expect(page.locator(".joint-link")).toHaveCount(1);
  const exportado = await exportadoActual(page);
  expect(Object.values(exportado.modelo.enlaces).some((enlace) => enlace.tipo === "consumo")).toBe(true);
  expect(pageErrors).toEqual([]);
});

// BUG-20260605T010727Z-916191: el destino del drag-desde-anchor se resolvía
// desde el elementView del element:pointerup, pero JointJS entrega ese evento
// SIEMPRE a la sourceView del gesto (el origen), nunca a la vista bajo el
// cursor → destino==origen (cancelación silenciosa) u objeto dueño del estado
// (menú "O [s1] → O"). Estos dos tests cubren la resolución por punto.
test("drag desde anchor por hover (sin seleccion) conecta entidad → entidad", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await jsonEditor(page).fill(JSON.stringify(modeloConexionAnchor(), null, 2));
  await page.getByRole("button", { name: "Importar", exact: true }).click();
  await expect(elementoPorTexto(page, "Entrada")).toBeVisible();

  // Sin click previo: hover activa los anchors (jointjs.css :hover).
  await elementoPorTexto(page, "Entrada").locator('[joint-selector="body"]').hover();
  const anchorE = await centroDeSelector(page, "connect-anchor-e");
  const procesar = await rectDeLocator(elementoPorTexto(page, "Procesar").locator('[joint-selector="body"]'));
  const destino = { x: procesar.x + procesar.width / 2, y: procesar.y + procesar.height / 2 };

  await page.mouse.move(anchorE.x, anchorE.y);
  await page.mouse.down();
  await expect(page.getByTestId("indicador-modo-canonico")).toHaveAttribute("data-modo", "conectar");
  await page.mouse.move(destino.x, destino.y, { steps: 6 });
  await page.mouse.up();

  const menu = page.getByTestId("menu-tipo-enlace");
  await expect(menu).toBeVisible();
  await expect(menu.getByText("Conectar Entrada → Procesar")).toBeVisible();
  await menu.getByTestId("menu-tipo-enlace-consumo").click();

  const exportado = await exportadoActual(page);
  expect(Object.values(exportado.modelo.enlaces).some((enlace) => enlace.tipo === "consumo")).toBe(true);
  expect(pageErrors).toEqual([]);
});

test("drag desde anchor de estado resuelve el proceso bajo el cursor como destino", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await jsonEditor(page).fill(JSON.stringify(modeloConexionEstado(), null, 2));
  await page.getByRole("button", { name: "Importar", exact: true }).click();
  await expect(elementoPorTexto(page, "O")).toBeVisible();

  await elementoPorTexto(page, "O").locator('[joint-selector="body"]').hover();
  const anchorEstado = await centroDeSelector(page, "connect-anchor-s-state0");
  const proceso = await rectDeLocator(elementoPorTexto(page, "P").locator('[joint-selector="body"]'));
  const destino = { x: proceso.x + proceso.width / 2, y: proceso.y + proceso.height / 2 };

  await page.mouse.move(anchorEstado.x, anchorEstado.y);
  await page.mouse.down();
  await expect(page.getByTestId("indicador-modo-canonico")).toHaveAttribute("data-modo", "conectar");
  await page.mouse.move(destino.x, destino.y, { steps: 8 });
  await page.mouse.up();

  const menu = page.getByTestId("menu-tipo-enlace");
  await expect(menu).toBeVisible();
  await expect(menu.getByText("Conectar O [s1] → P")).toBeVisible();
  expect(pageErrors).toEqual([]);
});

async function centroDeSelector(page: import("@playwright/test").Page, selector: string): Promise<{ x: number; y: number }> {
  const punto = await page.evaluate((sel) => {
    const nodo = document.querySelector(`[joint-selector='${sel}']`);
    if (!nodo) return null;
    const rect = (nodo as SVGGraphicsElement).getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  }, selector);
  if (!punto) throw new Error(`No se encontró [joint-selector=${selector}] en el DOM`);
  return punto;
}

function modeloConexionEstado() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-anchor-estado",
      nombre: "Modelo anchor estado",
      opdRaizId: "opd-1",
      nextSeq: 5,
      entidades: {
        "o-1": { id: "o-1", tipo: "objeto", nombre: "O", esencia: "informacional", afiliacion: "sistemica" },
        "p-1": { id: "p-1", tipo: "proceso", nombre: "P", esencia: "informacional", afiliacion: "sistemica" },
      },
      estados: {
        "s-1": { id: "s-1", entidadId: "o-1", nombre: "s1" },
        "s-2": { id: "s-2", entidadId: "o-1", nombre: "s2" },
      },
      enlaces: {},
      abanicos: {},
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-o1": { id: "a-o1", entidadId: "o-1", opdId: "opd-1", x: 160, y: 120, width: 170, height: 110 },
            "a-p1": { id: "a-p1", entidadId: "p-1", opdId: "opd-1", x: 180, y: 360, width: 150, height: 70 },
          },
          enlaces: {},
        },
      },
    },
  };
}

function modeloConexionAnchor() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-anchor",
      nombre: "Modelo anchor",
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
            "a-procesar": { id: "a-procesar", entidadId: "p-procesar", opdId: "opd-1", x: 360, y: 150, width: 135, height: 60 },
          },
          enlaces: {},
        },
      },
    },
  };
}
