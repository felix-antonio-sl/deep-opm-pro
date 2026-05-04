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

test("renderiza todos los markers canonicos de enlaces", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.locator("textarea").fill(JSON.stringify(modeloMarkersCanonicos(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(page.locator(".joint-link")).toHaveCount(8);
  await expect(page.locator(".joint-element")).toHaveCount(15);
  await page.screenshot({ path: "test-results/opm-markers-canonicos.png", fullPage: true });

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
  await expect(page.locator(".joint-element")).toHaveCount(4);
  await expect(page.getByText("Un Proceso se descompone en Un Proceso 1, Un Proceso 2 y Un Proceso 3 en esa secuencia.")).toBeVisible();

  await page.getByRole("button", { name: "Exportar" }).click();
  const json = await page.locator("textarea").inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const proceso = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Un Proceso");
  const subprocesos = Object.values(exportado.modelo.entidades).filter((entidad) => /^Un Proceso [1-3]$/.test(entidad.nombre));
  expect(proceso?.refinamiento?.tipo).toBe("descomposicion");
  expect(subprocesos).toHaveLength(3);
  const opdHijoId = proceso?.refinamiento?.opdId;
  expect(opdHijoId).toBeTruthy();
  if (!opdHijoId) throw new Error("La descomposicion no exporto opdId");
  expect(exportado.modelo.opds[opdHijoId]?.padreId).toBe(exportado.modelo.opdRaizId);
  expect(Object.values(exportado.modelo.opds[opdHijoId]?.apariencias ?? {}).some((apariencia) => apariencia.entidadId === proceso?.id)).toBe(true);
  const aparienciasHijo = Object.values(exportado.modelo.opds[opdHijoId]?.apariencias ?? {});
  const contorno = aparienciasHijo.find((apariencia) => apariencia.entidadId === proceso.id);
  if (!contorno) throw new Error("No se exporto contorno de descomposicion");
  for (const subproceso of subprocesos) {
    const apariencia = aparienciasHijo.find((item) => item.entidadId === subproceso.id);
    if (!apariencia) throw new Error(`No se exporto apariencia de ${subproceso.nombre}`);
    expect(apariencia.x).toBeGreaterThan(contorno.x);
    expect(apariencia.y).toBeGreaterThan(contorno.y);
    expect(apariencia.x + apariencia.width).toBeLessThan(contorno.x + contorno.width);
    expect(apariencia.y + apariencia.height).toBeLessThan(contorno.y + contorno.height);
  }

  await page.screenshot({ path: "test-results/opm-descomposicion-opd-hijo.png", fullPage: true });
  await assertWorkbenchLayout(page);

  await page.getByRole("button", { name: "Quitar descomposición" }).click();
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Un Proceso descompuesto" })).toHaveCount(0);
  await expect(page.locator('[role="treeitem"][data-opd-id="opd-1"]')).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("Un Proceso se descompone en Un Proceso 1, Un Proceso 2 y Un Proceso 3 en esa secuencia.")).toHaveCount(0);
  await page.getByRole("button", { name: "Exportar" }).click();
  const jsonSinDescomposicion = await page.locator("textarea").inputValue();
  const exportadoSinDescomposicion = JSON.parse(jsonSinDescomposicion) as ExportadoModelo;
  const procesoSinDescomposicion = Object.values(exportadoSinDescomposicion.modelo.entidades).find((entidad) => entidad.nombre === "Un Proceso");
  expect(procesoSinDescomposicion?.refinamiento).toBeUndefined();
  expect(Object.values(exportadoSinDescomposicion.modelo.opds)).toHaveLength(1);

  expect(pageErrors).toEqual([]);
});

test("despliega objeto y navega al OPD hijo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await expect(page.getByText("Desplegar como...")).toBeVisible();

  await desplegarComoAgregacion(page);

  const nodoHijo = page.locator('[role="treeitem"]').filter({ hasText: "SD1: Un Objeto desplegado" });
  await expect(nodoHijo).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".joint-element")).toHaveCount(7);
  await expect(page.getByText("Un Objeto se despliega en Un Objeto parte 1, Un Objeto parte 2 y Un Objeto parte 3.")).toBeVisible();

  await page.getByRole("button", { name: "Exportar" }).click();
  const json = await page.locator("textarea").inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Un Objeto");
  const partes = Object.values(exportado.modelo.entidades).filter((entidad) => /^Un Objeto parte [1-3]$/.test(entidad.nombre));
  expect(objeto?.refinamiento?.tipo).toBe("despliegue");
  expect(partes).toHaveLength(3);
  const opdHijoId = objeto?.refinamiento?.opdId;
  expect(opdHijoId).toBeTruthy();
  if (!opdHijoId || !objeto) throw new Error("El despliegue no exporto opdId");
  expect(exportado.modelo.opds[opdHijoId]?.padreId).toBe(exportado.modelo.opdRaizId);
  expect(Object.values(exportado.modelo.enlaces).filter((enlace) => enlace.tipo === "agregacion" && enlace.origenId === objeto.id)).toHaveLength(3);

  await page.getByRole("button", { name: "Quitar despliegue" }).click();
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Un Objeto desplegado" })).toHaveCount(0);
  await page.getByRole("button", { name: "Exportar" }).click();
  const jsonSinDespliegue = await page.locator("textarea").inputValue();
  const exportadoSinDespliegue = JSON.parse(jsonSinDespliegue) as ExportadoModelo;
  const objetoSinDespliegue = Object.values(exportadoSinDespliegue.modelo.entidades).find((entidad) => entidad.nombre === "Un Objeto");
  expect(objetoSinDespliegue?.refinamiento).toBeUndefined();
  expect(Object.values(exportadoSinDespliegue.modelo.opds)).toHaveLength(1);
  expect(Object.values(exportadoSinDespliegue.modelo.enlaces)).toHaveLength(0);

  await page.screenshot({ path: "test-results/opm-despliegue-opd-hijo.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("activa plegado parcial desde Inspector y persiste la vista compacta", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await desplegarComoAgregacion(page);
  await page.locator('[role="treeitem"][data-opd-id="opd-1"]').click();
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await elementoPorTexto(page, "Un Objeto").click();

  await expect(page.getByRole("button", { name: "Plegado parcial" })).toBeVisible();
  await page.getByRole("button", { name: "Plegado parcial" }).click();

  await expect(page.locator(".joint-element")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Un Objeto parte 1")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Un Objeto parte 2")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Un Objeto parte 3")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Plegado completo" })).toBeVisible();

  await page.getByRole("button", { name: "Exportar" }).click();
  const json = await page.locator("textarea").inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Un Objeto");
  if (!objeto?.refinamiento) throw new Error("No se exporto despliegue del objeto");
  const aparienciaPadre = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .find((apariencia) => apariencia.entidadId === objeto.id);
  expect(aparienciaPadre?.modoPlegado).toBe("parcial");
  expect(Object.values(exportado.modelo.opds[objeto.refinamiento.opdId]?.apariencias ?? {})).toHaveLength(4);

  await page.keyboard.press("Control+S");
  await expect(page.getByText("Modelo guardado exitosamente")).toBeVisible();
  await page.getByRole("button", { name: "Nuevo" }).click();
  await page.getByRole("button", { name: "Cargar" }).first().click();
  await expect(elementoPorTexto(page, "Un Objeto parte 1")).toHaveCount(1);
  await elementoPorTexto(page, "Un Objeto").click();
  await expect(page.getByRole("button", { name: "Plegado completo" })).toBeVisible();

  await page.screenshot({ path: "test-results/opm-plegado-parcial.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("mantiene canvas e inspector en columnas separadas tras recalculos", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso" }).click();
  await page.getByRole("button", { name: "Descomponer" }).click();
  await elementoPorTexto(page, "Un Proceso 1").click();
  await page.getByRole("button", { name: "Descomponer" }).click();
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1.1:" })).toHaveAttribute("aria-current", "page");

  await page.waitForTimeout(4000);
  await assertWorkbenchLayout(page);
  await assertCanvasScrollable(page);
  await page.getByRole("img", { name: "OPD activo" }).evaluate((element) => (element as HTMLElement).scrollTo({ left: 0, top: 0 }));
  await page.screenshot({ path: "test-results/opm-layout-columns.png", fullPage: true });

  expect(pageErrors).toEqual([]);
});

test("redistribuye consumo al primer subproceso y resultado al ultimo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso" }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByLabel("Nombre").fill("Salida");

  await elementoPorTexto(page, "Entrada").click();
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await elementoPorTexto(page, "Procesar").click();
  await elementoPorTexto(page, "Procesar").click();
  await page.getByLabel("Tipo de enlace").selectOption("resultado");
  await elementoPorTexto(page, "Salida").click();
  await expect(page.locator(".joint-link")).toHaveCount(2);

  await elementoPorTexto(page, "Procesar").click();
  await page.getByRole("button", { name: "Descomponer" }).click();
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Procesar descompuesto" })).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".joint-element")).toHaveCount(6);
  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(elementoPorTexto(page, "Entrada")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Salida")).toHaveCount(1);
  await expect(page.getByText(/Procesar 1\s+consume\s+Entrada/)).toBeVisible();
  await expect(page.getByText(/Procesar 3\s+genera\s+Salida/)).toBeVisible();

  await page.getByRole("button", { name: "Exportar" }).click();
  const json = await page.locator("textarea").inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const procesar = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar");
  const entrada = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Entrada");
  const salida = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Salida");
  const primero = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar 1");
  const ultimo = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar 3");
  const opdHijoId = procesar?.refinamiento?.opdId;
  if (!opdHijoId || !entrada || !salida || !primero || !ultimo) throw new Error("No se exporto la redistribucion esperada");
  const enlacesHijo = Object.values(exportado.modelo.opds[opdHijoId]?.enlaces ?? {})
    .map((apariencia) => exportado.modelo.enlaces[apariencia.enlaceId]);
  expect(enlacesHijo).toEqual(expect.arrayContaining([
    expect.objectContaining({ tipo: "consumo", origenId: entrada.id, destinoId: primero.id }),
    expect.objectContaining({ tipo: "resultado", origenId: ultimo.id, destinoId: salida.id }),
  ]));

  await page.screenshot({ path: "test-results/opm-descomposicion-enlaces-externos.png", fullPage: true });
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

  await elementoPorTexto(page, "Un Objeto").click();
  await page.getByLabel("Nombre").fill("Renombrado");
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(1);
  await deshacer.click();
  await expect(elementoPorTexto(page, "Un Objeto")).toHaveCount(1);
  await rehacer.click();
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(1);

  await elementoPorTexto(page, "Renombrado").click();
  await page.getByRole("button", { name: "Eliminar entidad" }).click();
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await deshacer.click();
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(1);

  await page.screenshot({ path: "test-results/opm-dirty-undo-redo.png", fullPage: true });
  await page.keyboard.press("Control+S");
  await expect(page.getByText("Modelo guardado exitosamente")).toBeVisible();
  await expect(page.getByText("Modelo OPM (No guardado)")).toHaveCount(0);
  await expect(deshacer).toBeEnabled();

  await page.getByRole("button", { name: "Nuevo" }).click();
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(deshacer).toBeDisabled();
  await page.getByRole("button", { name: "Cargar" }).first().click();
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(1);
  await expect(page.getByText("Modelo OPM (No guardado)")).toHaveCount(0);
  await expect(deshacer).toBeDisabled();

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
  const flexibleSvgText = new RegExp(texto.trim().split(/\s+/).map(escapeRegExp).join("\\s*"));
  return page.locator(".joint-element").filter({ hasText: flexibleSvgText });
}

function escapeRegExp(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

async function desplegarComoAgregacion(page: import("@playwright/test").Page): Promise<void> {
  await page.getByText("Desplegar como...").click();
  await page.getByRole("button", { name: "Como partes (agregación)" }).click();
}

async function assertWorkbenchLayout(page: import("@playwright/test").Page): Promise<void> {
  const tree = await rectDeLocator(page.getByTestId("tree-pane"));
  const canvas = await rectDeLocator(page.getByTestId("canvas-pane"));
  const inspector = await rectDeLocator(page.getByTestId("inspector-pane"));

  expect(tree.x).toBeLessThan(canvas.x);
  expect(canvas.x).toBeLessThan(inspector.x);
  expect(tree.x + tree.width).toBeLessThanOrEqual(canvas.x + 1);
  expect(canvas.x + canvas.width).toBeLessThanOrEqual(inspector.x + 1);
  expect(canvas.width).toBeGreaterThan(400);
  expect(inspector.width).toBeGreaterThan(250);
  expect(inspector.width).toBeLessThan(340);
}

async function assertCanvasScrollable(page: import("@playwright/test").Page): Promise<void> {
  const canvas = page.getByRole("img", { name: "OPD activo" });
  const scroll = await canvas.evaluate((element) => {
    const target = element as HTMLElement;
    target.scrollTo({ left: 160, top: 120 });
    return {
      clientWidth: target.clientWidth,
      clientHeight: target.clientHeight,
      scrollWidth: target.scrollWidth,
      scrollHeight: target.scrollHeight,
      scrollLeft: target.scrollLeft,
      scrollTop: target.scrollTop,
    };
  });

  expect(scroll.scrollWidth).toBeGreaterThan(scroll.clientWidth);
  expect(scroll.scrollHeight).toBeGreaterThan(scroll.clientHeight);
  expect(scroll.scrollLeft).toBeGreaterThan(0);
  expect(scroll.scrollTop).toBeGreaterThan(0);
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

function modeloMarkersCanonicos() {
  const entidades = {
    "o-agent": objeto("o-agent", "Agente", "fisica"),
    "p-agent": proceso("p-agent", "Proceso agente"),
    "o-instrument": objeto("o-instrument", "Instrumento"),
    "p-instrument": proceso("p-instrument", "Proceso instrumento"),
    "o-consumption": objeto("o-consumption", "Consumible"),
    "p-consumption": proceso("p-consumption", "Proceso consumo"),
    "p-result": proceso("p-result", "Proceso resultado"),
    "o-result": objeto("o-result", "Resultado"),
    "o-effect": objeto("o-effect", "Afectado"),
    "p-effect": proceso("p-effect", "Proceso efecto"),
    "p-invocation-a": proceso("p-invocation-a", "Invocador"),
    "p-invocation-b": proceso("p-invocation-b", "Invocado"),
    "o-whole": objeto("o-whole", "Todo"),
    "o-part": objeto("o-part", "Parte"),
  };
  const enlaces = {
    "e-agent": enlace("e-agent", "agente", "o-agent", "p-agent"),
    "e-instrument": enlace("e-instrument", "instrumento", "o-instrument", "p-instrument"),
    "e-consumption": enlace("e-consumption", "consumo", "o-consumption", "p-consumption"),
    "e-result": enlace("e-result", "resultado", "p-result", "o-result"),
    "e-effect": enlace("e-effect", "efecto", "o-effect", "p-effect"),
    "e-invocation": enlace("e-invocation", "invocacion", "p-invocation-a", "p-invocation-b"),
    "e-aggregation": enlace("e-aggregation", "agregacion", "o-whole", "o-part"),
  };
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-markers",
      nombre: "Markers canonicos",
      opdRaizId: "opd-1",
      nextSeq: 50,
      entidades,
      enlaces,
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            ...aparienciaPar("o-agent", "p-agent", 70, 40),
            ...aparienciaPar("o-instrument", "p-instrument", 70, 100),
            ...aparienciaPar("o-consumption", "p-consumption", 70, 160),
            ...aparienciaPar("p-result", "o-result", 70, 220),
            ...aparienciaPar("o-effect", "p-effect", 70, 280),
            ...aparienciaPar("p-invocation-a", "p-invocation-b", 70, 340),
            ...aparienciaPar("o-whole", "o-part", 70, 400),
          },
          enlaces: Object.fromEntries(Object.keys(enlaces).map((id) => [`a-${id}`, { id: `a-${id}`, enlaceId: id, opdId: "opd-1", vertices: [] }])),
        },
      },
    },
  };
}

function objeto(id: string, nombre: string, esencia = "informacional") {
  return { id, tipo: "objeto", nombre, esencia, afiliacion: "sistemica" };
}

function proceso(id: string, nombre: string) {
  return { id, tipo: "proceso", nombre, esencia: "informacional", afiliacion: "sistemica" };
}

function enlace(id: string, tipo: string, origenId: string, destinoId: string) {
  return { id, tipo, origenId, destinoId, etiqueta: "" };
}

function aparienciaPar(origenId: string, destinoId: string, x: number, y: number, dx = 290) {
  return {
    [`a-${origenId}`]: { id: `a-${origenId}`, entidadId: origenId, opdId: "opd-1", x, y, width: 135, height: 60 },
    [`a-${destinoId}`]: { id: `a-${destinoId}`, entidadId: destinoId, opdId: "opd-1", x: x + dx, y, width: 135, height: 60 },
  };
}

interface ExportadoModelo {
  modelo: {
    opdRaizId: string;
    entidades: Record<string, { id: string; nombre: string; refinamiento?: { tipo: string; opdId: string } }>;
    enlaces: Record<string, { id: string; tipo: string; origenId: string; destinoId: string }>;
    opds: Record<
      string,
      {
        padreId: string | null;
        apariencias: Record<string, { entidadId: string; x: number; y: number; width: number; height: number; modoPlegado?: string }>;
        enlaces: Record<string, { enlaceId: string; vertices: Array<{ x: number; y: number }> }>;
      }
    >;
  };
}
