import { expect, test } from "@playwright/test";

test("carga demo OPM en canvas JointJS y mantiene OPL visible", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("img", { name: "OPD activo" })).toBeVisible();

  await page.getByRole("button", { name: "Demo" }).click();

  await expect(page.locator(".joint-paper svg")).toHaveCount(1);
  await expect(page.locator(".joint-element")).toHaveCount(3);
  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(page.getByText("Driver Rescuing").first()).toBeVisible();
  await expect(page.getByText("Driver Rescuing afecta OnStar System.")).toBeVisible();

  await page.screenshot({ path: "test-results/opm-demo-jointjs.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("navega OPDs desde el arbol lateral", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("tree", { name: "Árbol OPD" })).toBeVisible();
  const nodoRaiz = page.locator('[role="treeitem"][data-opd-id="opd-1"]');
  const nodoHijo = page.locator('[role="treeitem"][data-opd-id="opd-2"]');
  await expect(nodoRaiz).toHaveAttribute("aria-current", "page");

  await page.locator("textarea").fill(JSON.stringify(modeloDosOpds(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(nodoRaiz).toHaveAttribute("aria-current", "page");
  await expect(elementoPorTexto(page, "Objeto Raiz")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Proceso Hijo")).toHaveCount(0);
  await expect(page.getByText("Objeto Raiz").first()).toBeVisible();

  await nodoHijo.click();

  await expect(nodoHijo).toHaveAttribute("aria-current", "page");
  await expect(elementoPorTexto(page, "Objeto Raiz")).toHaveCount(0);
  await expect(elementoPorTexto(page, "Proceso Hijo")).toHaveCount(1);
  await expect(page.getByText("Proceso Hijo").first()).toBeVisible();

  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByRole("button", { name: "Exportar" }).click();
  const json = await page.locator("textarea").inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  expect(Object.values(exportado.modelo.opds["opd-1"]?.apariencias ?? {})).toHaveLength(1);
  const aparienciasHijo = Object.values(exportado.modelo.opds["opd-2"]?.apariencias ?? {});
  expect(aparienciasHijo).toHaveLength(2);
  expect(todasSeparadas(aparienciasHijo)).toBe(true);

  await page.screenshot({ path: "test-results/opm-opd-tree.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("descompone proceso y navega al OPD hijo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso" }).click();
  await expect(page.getByRole("button", { name: "Descomponer" })).toBeVisible();

  await page.getByRole("button", { name: "Descomponer" }).click();

  const nodoHijo = page.locator('[role="treeitem"]').filter({ hasText: "SD1: Un Proceso descompuesto" });
  await expect(nodoHijo).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await expect(page.getByText("Un Proceso se descompone en SD1.")).toBeVisible();

  await page.getByRole("button", { name: "Exportar" }).click();
  const json = await page.locator("textarea").inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const proceso = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Un Proceso");
  expect(proceso?.refinamiento?.tipo).toBe("descomposicion");
  const opdHijoId = proceso?.refinamiento?.opdId;
  expect(opdHijoId).toBeTruthy();
  if (!opdHijoId) throw new Error("La descomposicion no exporto opdId");
  expect(exportado.modelo.opds[opdHijoId]?.padreId).toBe(exportado.modelo.opdRaizId);
  expect(Object.values(exportado.modelo.opds[opdHijoId]?.apariencias ?? {}).some((apariencia) => apariencia.entidadId === proceso?.id)).toBe(true);

  await page.screenshot({ path: "test-results/opm-descomposicion-opd-hijo.png", fullPage: true });

  await page.getByRole("button", { name: "Quitar descomposición" }).click();
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Un Proceso descompuesto" })).toHaveCount(0);
  await expect(page.locator('[role="treeitem"][data-opd-id="opd-1"]')).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("Un Proceso se descompone en SD1.")).toHaveCount(0);
  await page.getByRole("button", { name: "Exportar" }).click();
  const jsonSinDescomposicion = await page.locator("textarea").inputValue();
  const exportadoSinDescomposicion = JSON.parse(jsonSinDescomposicion) as ExportadoModelo;
  const procesoSinDescomposicion = Object.values(exportadoSinDescomposicion.modelo.entidades).find((entidad) => entidad.nombre === "Un Proceso");
  expect(procesoSinDescomposicion?.refinamiento).toBeUndefined();
  expect(Object.values(exportadoSinDescomposicion.modelo.opds)).toHaveLength(1);

  expect(pageErrors).toEqual([]);
});

test("arrastra una cosa JointJS y persiste su apariencia", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByRole("button", { name: "Proceso" }).click();

  await expect(page.locator(".joint-element")).toHaveCount(2);

  const objectBox = await elementoPorTexto(page, "Un Objeto").boundingBox();
  if (!objectBox) throw new Error("No se pudo ubicar la celda de objeto para drag");
  await page.mouse.move(objectBox.x + objectBox.width / 2, objectBox.y + objectBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(objectBox.x + objectBox.width / 2 + 120, objectBox.y + objectBox.height / 2 + 70, { steps: 8 });
  await page.mouse.up();

  await page.getByRole("button", { name: "Exportar" }).click();
  const jsonDespuesDeDrag = await page.locator("textarea").inputValue();
  const exportadoDespuesDeDrag = JSON.parse(jsonDespuesDeDrag) as ExportadoModelo;
  const objetoMovido = Object.values(exportadoDespuesDeDrag.modelo.entidades).find((entidad) => entidad.nombre === "Un Objeto");
  if (!objetoMovido) throw new Error("No se encontro Un Objeto en JSON exportado");
  const aparienciaMovida = Object.values(exportadoDespuesDeDrag.modelo.opds[exportadoDespuesDeDrag.modelo.opdRaizId]?.apariencias ?? {}).find(
    (apariencia) => apariencia.entidadId === objetoMovido.id,
  );
  expect(aparienciaMovida?.x).toBeGreaterThan(150);
  expect(aparienciaMovida?.y).toBeGreaterThan(120);

  await page.screenshot({ path: "test-results/opm-drag-jointjs.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("marca dirty state y navega cambios con deshacer y rehacer", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");

  const deshacer = page.getByRole("button", { name: "Deshacer" });
  const rehacer = page.getByRole("button", { name: "Rehacer" });
  await expect(page.getByText("Modelo OPM (No guardado)")).toHaveCount(0);
  await expect(deshacer).toBeDisabled();
  await expect(rehacer).toBeDisabled();

  await page.getByRole("button", { name: "Objeto" }).click();
  await expect(page.getByText("Modelo OPM (No guardado)")).toBeVisible();
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await expect(deshacer).toBeEnabled();
  await expect(rehacer).toBeDisabled();

  await page.keyboard.press("Control+Z");
  await expect(page.getByText("Modelo OPM (No guardado)")).toHaveCount(0);
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(deshacer).toBeDisabled();
  await expect(rehacer).toBeEnabled();

  await page.keyboard.press("Control+Shift+Z");
  await expect(page.getByText("Modelo OPM (No guardado)")).toBeVisible();
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await expect(deshacer).toBeEnabled();
  await expect(rehacer).toBeDisabled();

  await deshacer.click();
  await expect(page.getByText("Modelo OPM (No guardado)")).toHaveCount(0);
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(deshacer).toBeDisabled();
  await expect(rehacer).toBeEnabled();

  await rehacer.click();
  await expect(page.getByText("Modelo OPM (No guardado)")).toBeVisible();
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await expect(deshacer).toBeEnabled();
  await expect(rehacer).toBeDisabled();

  await page.screenshot({ path: "test-results/opm-dirty-undo-redo.png", fullPage: true });
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText("Modelo OPM (No guardado)")).toHaveCount(0);
  await expect(deshacer).toBeEnabled();

  expect(pageErrors).toEqual([]);
});

test("crea enlace, edita vertices y elimina desde celdas JointJS", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  const tipoEnlace = page.getByLabel("Tipo de enlace");
  await expect(tipoEnlace).toBeDisabled();
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByRole("button", { name: "Proceso" }).click();

  await expect(page.locator(".joint-element")).toHaveCount(2);

  await elementoPorTexto(page, "Un Objeto").click();
  await expect(tipoEnlace).toBeEnabled();
  await tipoEnlace.selectOption("instrumento");
  await elementoPorTexto(page, "Un Proceso").click();

  await expect(page.locator(".joint-link")).toHaveCount(1);
  await expect(page.getByText("Un Proceso requiere Un Objeto.")).toBeVisible();

  await clickCentroLink(page);
  await expect(page.getByText("Enlace Instrumento")).toBeVisible();
  await expect(page.locator('[data-tool-name="boundary"]')).toHaveCount(1);
  await expect(page.locator('[data-tool-name="vertices"]')).toHaveCount(1);
  await expect(page.locator('[data-tool-name="segments"]')).toHaveCount(1);

  const segmentBox = await rectDeLocator(page.locator(".joint-marker-segment").first());
  await page.mouse.move(segmentBox.x + segmentBox.width / 2, segmentBox.y + segmentBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(segmentBox.x + segmentBox.width / 2, segmentBox.y + segmentBox.height / 2 + 70, { steps: 8 });
  await page.mouse.up();
  await page.getByRole("button", { name: "Exportar" }).click();
  const jsonConVertice = await page.locator("textarea").inputValue();
  const exportadoConVertice = JSON.parse(jsonConVertice) as ExportadoModelo;
  const vertices = Object.values(exportadoConVertice.modelo.opds[exportadoConVertice.modelo.opdRaizId]?.enlaces ?? {})[0]?.vertices;
  expect(vertices?.length ?? 0).toBeGreaterThan(0);
  expect(vertices?.[0]?.x).toBeGreaterThan(200);
  expect(vertices?.[0]?.y).toBeGreaterThan(120);

  await page.screenshot({ path: "test-results/opm-link-tools-jointjs.png", fullPage: true });
  await page.getByRole("button", { name: "Eliminar enlace" }).click();
  await expect(page.locator(".joint-link")).toHaveCount(0);
  await expect(page.getByText("Un Proceso requiere Un Objeto.")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("renderiza agregacion como triangulo estructural", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByRole("button", { name: "Objeto" }).click();

  const objetos = elementoPorTexto(page, "Un Objeto");
  await expect(objetos).toHaveCount(2);
  await objetos.nth(0).click();
  await page.getByLabel("Tipo de enlace").selectOption("agregacion");
  await objetos.nth(1).click();

  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(page.locator(".joint-element polygon")).toHaveCount(1);
  await page.locator(".joint-element polygon").click();
  await expect(page.getByText("Enlace Agregacion")).toBeVisible();
  await expect(page.locator('[data-tool-name="vertices"]')).toHaveCount(0);
  await expect(page.locator('[data-tool-name="segments"]')).toHaveCount(0);
  await page.screenshot({ path: "test-results/opm-agregacion-triangulo.png", fullPage: true });

  expect(pageErrors).toEqual([]);
});

function elementoPorTexto(page: import("@playwright/test").Page, texto: string): import("@playwright/test").Locator {
  return page.locator(".joint-element").filter({ hasText: texto });
}

async function rectDeLocator(locator: import("@playwright/test").Locator): Promise<{ x: number; y: number; width: number; height: number }> {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
}

async function clickCentroLink(page: import("@playwright/test").Page): Promise<void> {
  const punto = await puntoMedioPath(page.locator(".joint-link [joint-selector=wrapper]"));
  await page.mouse.click(punto.x, punto.y);
}

async function puntoMedioPath(locator: import("@playwright/test").Locator): Promise<{ x: number; y: number }> {
  return locator.evaluate((element) => {
    const path = element as SVGPathElement;
    const ctm = path.getScreenCTM();
    if (!ctm) throw new Error("No se pudo obtener matriz de pantalla del enlace");
    const point = path.getPointAtLength(path.getTotalLength() / 2);
    return {
      x: point.x * ctm.a + point.y * ctm.c + ctm.e,
      y: point.x * ctm.b + point.y * ctm.d + ctm.f,
    };
  });
}

function todasSeparadas(apariencias: Array<{ x: number; y: number; width: number; height: number }>): boolean {
  return apariencias.every((a, index) => apariencias.slice(index + 1).every((b) => (
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  )));
}

function modeloDosOpds() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-tree",
      nombre: "Modelo multi OPD",
      opdRaizId: "opd-1",
      nextSeq: 10,
      entidades: {
        "o-1": {
          id: "o-1",
          tipo: "objeto",
          nombre: "Objeto Raiz",
          esencia: "informacional",
          afiliacion: "sistemica",
        },
        "p-2": {
          id: "p-2",
          tipo: "proceso",
          nombre: "Proceso Hijo",
          esencia: "informacional",
          afiliacion: "sistemica",
        },
      },
      enlaces: {},
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-1": {
              id: "a-1",
              entidadId: "o-1",
              opdId: "opd-1",
              x: 80,
              y: 90,
              width: 135,
              height: 60,
            },
          },
          enlaces: {},
        },
        "opd-2": {
          id: "opd-2",
          nombre: "SD1",
          padreId: "opd-1",
          apariencias: {
            "a-2": {
              id: "a-2",
              entidadId: "p-2",
              opdId: "opd-2",
              x: 220,
              y: 130,
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

interface ExportadoModelo {
  modelo: {
    opdRaizId: string;
    entidades: Record<string, { id: string; nombre: string; refinamiento?: { tipo: string; opdId: string } }>;
    opds: Record<
      string,
      {
        padreId: string | null;
        apariencias: Record<string, { entidadId: string; x: number; y: number; width: number; height: number }>;
        enlaces: Record<string, { vertices: Array<{ x: number; y: number }> }>;
      }
    >;
  };
}
