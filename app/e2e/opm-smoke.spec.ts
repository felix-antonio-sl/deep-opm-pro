import { expect, test, type Page } from "@playwright/test";

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

  await expect(page.locator(".joint-link")).toHaveCount(14);
  await expect(page.locator(".joint-element")).toHaveCount(27);
  await page.screenshot({ path: "test-results/opm-markers-canonicos.png", fullPage: true });

  expect(pageErrors).toEqual([]);
});

test("renderiza abanicos O/XOR con conectores canonicos sin texto de marcador", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.locator("textarea").fill(JSON.stringify(modeloAbanicoLogico(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(page.locator(".joint-element path[joint-selector=body]")).toHaveCount(1);
  await expect(svgText(page, "O")).toHaveCount(0);
  await expect(svgText(page, "XOR")).toHaveCount(0);

  await clickLinkPorTipo(page, "Consumo");
  await expect(page.getByText("Abanico O")).toBeVisible();
  await page.getByTestId("abanico-toggle-XOR").click();
  await expect(page.getByText("Operador actualizado a XOR")).toBeVisible();
  await expect(page.locator(".joint-element polygon[joint-selector=body]")).toHaveCount(1);
  await expect(svgText(page, "O")).toHaveCount(0);
  await expect(svgText(page, "XOR")).toHaveCount(0);

  await page.screenshot({ path: "test-results/opm-abanico-logico-canonico.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("renderiza modificadores evento/condicion y demora de invocacion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.locator("textarea").fill(JSON.stringify(modeloModificadoresEnlace(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(page.locator(".joint-link")).toHaveCount(3);
  await expect(svgText(page, "E")).toBeVisible();
  await expect(svgText(page, "70%")).toBeVisible();
  await expect(svgText(page, "c")).toBeVisible();
  await expect(svgText(page, "1s")).toBeVisible();
  await expect(page.getByText("Orden inicia Aprobar, que consume Orden (probabilidad 0.7).")).toBeVisible();
  await expect(page.getByText("Aprobar invoca Validar despues de 1s.")).toBeVisible();

  await page.screenshot({ path: "test-results/opm-modificadores-enlace.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("crea auto-invocacion desde Inspector con demora default", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso" }).click();
  await expect(page.getByRole("button", { name: "Auto-invocación" })).toBeVisible();

  await page.getByRole("button", { name: "Auto-invocación" }).click();

  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(svgText(page, "1s")).toBeVisible();
  await expect(page.getByText("Proceso se invoca a sí mismo despues de 1s.")).toBeVisible();

  await page.getByRole("button", { name: "Exportar" }).click();
  const json = await page.locator("textarea").inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const proceso = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Proceso");
  const enlace = Object.values(exportado.modelo.enlaces)[0];
  if (!proceso || !enlace) throw new Error("La auto-invocacion no se exporto");
  expect(enlace.tipo).toBe("invocacion");
  expect(enlace.origenId).toEqual({ kind: "entidad", id: proceso.id });
  expect(enlace.destinoId).toEqual({ kind: "entidad", id: proceso.id });
  expect(enlace.demora).toBe("1s");

  await page.screenshot({ path: "test-results/opm-auto-invocacion.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("descompone proceso y navega al OPD hijo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso" }).click();
  await expect(page.getByRole("button", { name: "Descomponer" })).toBeVisible();

  await page.getByRole("button", { name: "Descomponer" }).click();

  const nodoHijo = page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" });
  await expect(nodoHijo).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".joint-element")).toHaveCount(4);
  await expect(page.getByText("Proceso se descompone en Proceso 1, Proceso 2 y Proceso 3 en esa secuencia.")).toBeVisible();

  await page.getByRole("button", { name: "Exportar" }).click();
  const json = await page.locator("textarea").inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const proceso = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Proceso");
  const subprocesos = Object.values(exportado.modelo.entidades).filter((entidad) => /^Proceso [1-3]$/.test(entidad.nombre));
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
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" })).toHaveCount(0);
  await expect(page.locator('[role="treeitem"][data-opd-id="opd-1"]')).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("Proceso se descompone en Proceso 1, Proceso 2 y Proceso 3 en esa secuencia.")).toHaveCount(0);
  await page.getByRole("button", { name: "Exportar" }).click();
  const jsonSinDescomposicion = await page.locator("textarea").inputValue();
  const exportadoSinDescomposicion = JSON.parse(jsonSinDescomposicion) as ExportadoModelo;
  const procesoSinDescomposicion = Object.values(exportadoSinDescomposicion.modelo.entidades).find((entidad) => entidad.nombre === "Proceso");
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

  const nodoHijo = page.locator('[role="treeitem"]').filter({ hasText: "SD1: Objeto desplegado" });
  await expect(nodoHijo).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".joint-element")).toHaveCount(7);
  await expect(page.getByText("Objeto se despliega en Objeto parte 1, Objeto parte 2 y Objeto parte 3.")).toBeVisible();

  await page.getByRole("button", { name: "Exportar" }).click();
  const json = await page.locator("textarea").inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  const partes = Object.values(exportado.modelo.entidades).filter((entidad) => /^Objeto parte [1-3]$/.test(entidad.nombre));
  expect(objeto?.refinamiento?.tipo).toBe("despliegue");
  expect(partes).toHaveLength(3);
  const opdHijoId = objeto?.refinamiento?.opdId;
  expect(opdHijoId).toBeTruthy();
  if (!opdHijoId || !objeto) throw new Error("El despliegue no exporto opdId");
  expect(exportado.modelo.opds[opdHijoId]?.padreId).toBe(exportado.modelo.opdRaizId);
  expect(Object.values(exportado.modelo.enlaces).filter((enlace) => enlace.tipo === "agregacion" && extremoApuntaAEntidad(enlace.origenId, objeto.id))).toHaveLength(3);

  await page.getByRole("button", { name: "Quitar despliegue" }).click();
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Objeto desplegado" })).toHaveCount(0);
  await page.getByRole("button", { name: "Exportar" }).click();
  const jsonSinDespliegue = await page.locator("textarea").inputValue();
  const exportadoSinDespliegue = JSON.parse(jsonSinDespliegue) as ExportadoModelo;
  const objetoSinDespliegue = Object.values(exportadoSinDespliegue.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
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
  await elementoPorTexto(page, "Objeto").click();

  await expect(page.getByRole("button", { name: "Plegado parcial" })).toBeVisible();
  await page.getByRole("button", { name: "Plegado parcial" }).click();

  await expect(page.locator(".joint-element")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Objeto parte 1")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Objeto parte 2")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Objeto parte 3")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Plegado completo" })).toBeVisible();

  await page.getByRole("button", { name: "Exportar" }).click();
  const json = await page.locator("textarea").inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  if (!objeto?.refinamiento) throw new Error("No se exporto despliegue del objeto");
  const aparienciaPadre = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .find((apariencia) => apariencia.entidadId === objeto.id);
  expect(aparienciaPadre?.modoPlegado).toBe("parcial");
  expect(Object.values(exportado.modelo.opds[objeto.refinamiento.opdId]?.apariencias ?? {})).toHaveLength(4);

  await page.keyboard.press("Control+S");
  await expect(page.getByText("Modelo guardado exitosamente")).toBeVisible();
  await page.getByRole("button", { name: "Nuevo" }).click();
  await page.getByRole("button", { name: "Cargar" }).first().click();
  await expect(elementoPorTexto(page, "Objeto parte 1")).toHaveCount(1);
  await elementoPorTexto(page, "Objeto").click();
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
  await elementoPorTexto(page, "Proceso 1").click();
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
    expect.objectContaining({ tipo: "consumo", origenId: extremoEntidad(entrada.id), destinoId: extremoEntidad(primero.id) }),
    expect.objectContaining({ tipo: "resultado", origenId: extremoEntidad(ultimo.id), destinoId: extremoEntidad(salida.id) }),
  ]));

  await page.screenshot({ path: "test-results/opm-descomposicion-enlaces-externos.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("reancla consumo derivado y conserva el ancla manual al reordenar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso" }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await elementoPorTexto(page, "Entrada").click();
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await elementoPorTexto(page, "Procesar").click();
  await elementoPorTexto(page, "Procesar").click();
  await page.getByRole("button", { name: "Descomponer" }).click();
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Procesar descompuesto" })).toHaveAttribute("aria-current", "page");

  await clickLinkPorTipo(page, "Consumo");
  await expect(page.getByText("Reanclar a subproceso")).toBeVisible();
  await page.getByTestId("reanclar-subproceso-select").selectOption({ label: "Procesar 2 (2)" });
  await page.getByRole("button", { name: "Aplicar" }).click();
  await expect(page.getByText("Derivado (manual)")).toBeVisible();

  const proceso2 = await elementoPorTexto(page, "Procesar 2").boundingBox();
  if (!proceso2) throw new Error("No se pudo ubicar Procesar 2");
  await page.mouse.move(proceso2.x + proceso2.width / 2, proceso2.y + proceso2.height / 2);
  await page.mouse.down();
  await page.mouse.move(proceso2.x + proceso2.width / 2, proceso2.y + proceso2.height / 2 + 170, { steps: 10 });
  await page.mouse.up();

  await expect(page.getByText(/Procesar 2\s+consume\s+Entrada/)).toBeVisible();
  await page.getByRole("button", { name: "Exportar" }).click();
  const json = await page.locator("textarea").inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const procesar = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar");
  const entrada = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Entrada");
  const segundo = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar 2");
  const opdHijoId = procesar?.refinamiento?.opdId;
  if (!opdHijoId || !entrada || !segundo) throw new Error("No se exporto el reanclaje esperado");
  const consumos = Object.values(exportado.modelo.opds[opdHijoId]?.enlaces ?? {})
    .map((apariencia) => exportado.modelo.enlaces[apariencia.enlaceId])
    .filter((enlace) => enlace?.tipo === "consumo");
  expect(consumos).toHaveLength(1);
  expect(consumos[0]).toEqual(expect.objectContaining({
    origenId: extremoEntidad(entrada.id),
    destinoId: extremoEntidad(segundo.id),
    derivado: expect.objectContaining({ origen: "manual" }),
  }));

  await page.screenshot({ path: "test-results/opm-reanclaje-manual.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("arrastra una cosa JointJS y persiste su apariencia", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByRole("button", { name: "Proceso" }).click();

  await expect(page.locator(".joint-element")).toHaveCount(2);

  const objectBox = await elementoPorTexto(page, "Objeto").boundingBox();
  if (!objectBox) throw new Error("No se pudo ubicar la celda de objeto para drag");
  await page.mouse.move(objectBox.x + objectBox.width / 2, objectBox.y + objectBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(objectBox.x + objectBox.width / 2 + 120, objectBox.y + objectBox.height / 2 + 70, { steps: 8 });
  await page.mouse.up();

  await page.getByRole("button", { name: "Exportar" }).click();
  const jsonDespuesDeDrag = await page.locator("textarea").inputValue();
  const exportadoDespuesDeDrag = JSON.parse(jsonDespuesDeDrag) as ExportadoModelo;
  const objetoMovido = Object.values(exportadoDespuesDeDrag.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  if (!objetoMovido) throw new Error("No se encontro Objeto en JSON exportado");
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

  await elementoPorTexto(page, "Objeto").click();
  await page.getByLabel("Nombre").fill("Renombrado");
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(1);
  await deshacer.click();
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);
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

test("confirma cambios sin guardar antes de crear un modelo nuevo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  const dialogo = page.getByRole("dialog", { name: "Hay cambios sin guardar" });
  await page.getByRole("button", { name: "Nuevo" }).click();
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByRole("button", { name: "Guardar" })).toBeFocused();

  await dialogo.getByRole("button", { name: "Cancelar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  await page.getByRole("button", { name: "Nuevo" }).click();
  await expect(dialogo).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  await page.getByRole("button", { name: "Nuevo" }).click();
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Descartar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(page.getByText("Modelo OPM (No guardado)")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("no abre confirmacion cuando Nuevo se ejecuta tras guardar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.keyboard.press("Control+S");
  await expect(page.getByText("Modelo guardado exitosamente")).toBeVisible();
  await expect(page.getByText("Modelo OPM (No guardado)")).toHaveCount(0);

  await page.getByRole("button", { name: "Nuevo" }).click();
  await expect(page.getByRole("dialog", { name: "Hay cambios sin guardar" })).toHaveCount(0);
  await expect(page.locator(".joint-element")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("activa beforeunload solo cuando el modelo esta dirty", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(await estadoBeforeUnload(page)).toEqual({ canceled: false, defaultPrevented: false });

  await page.getByRole("button", { name: "Objeto" }).click();
  await expect(await estadoBeforeUnload(page)).toEqual({ canceled: true, defaultPrevented: true });

  await page.keyboard.press("Control+S");
  await expect(page.getByText("Modelo guardado exitosamente")).toBeVisible();
  await expect(await estadoBeforeUnload(page)).toEqual({ canceled: false, defaultPrevented: false });

  expect(pageErrors).toEqual([]);
});

test("asiste importacion JSON con archivo, preview, confirmacion y error legible", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  await page.getByLabel("Archivo JSON").setInputFiles({
    name: "multi-opd.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(modeloDosOpds(), null, 2)),
  });
  await expect(page.getByTestId("import-preview")).toHaveText('Modelo "Modelo multi OPD" — 2 entidades, 2 OPDs, 0 enlaces');

  const dialogo = page.getByRole("dialog", { name: "Hay cambios sin guardar" });
  await page.getByRole("button", { name: "Importar" }).click();
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Cancelar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Objeto Raiz")).toHaveCount(0);

  await page.getByRole("button", { name: "Importar" }).click();
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Descartar" }).click();
  await expect(elementoPorTexto(page, "Objeto Raiz")).toHaveCount(1);
  await expect(page.getByText("Modelo multi OPD (No guardado)")).toHaveCount(0);

  await page.locator("textarea").fill("{");
  await expect(page.getByRole("alert")).toHaveText("JSON inválido");

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

  await elementoPorTexto(page, "Objeto").click();
  await expect(tipoEnlace).toBeEnabled();
  await tipoEnlace.selectOption("instrumento");
  await elementoPorTexto(page, "Proceso").click();

  await expect(page.locator(".joint-link")).toHaveCount(1);
  await expect(page.getByText("Proceso requiere Objeto.")).toBeVisible();

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
  await expect(page.getByText("Proceso requiere Objeto.")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("asigna multiplicidad de enlace y sincroniza canvas, OPL y JSON", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByLabel("Nombre").fill("Recurso");
  await page.getByRole("button", { name: "Proceso" }).click();
  await page.getByLabel("Nombre").fill("Procesar");

  await elementoPorTexto(page, "Recurso").click();
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await elementoPorTexto(page, "Procesar").click();
  await expect(page.locator(".joint-link")).toHaveCount(1);

  await clickCentroLink(page);
  await expect(page.getByText("Multiplicidad")).toBeVisible();
  await page.getByLabel("Origen").fill("2");

  await expect(page.locator(".joint-link text").filter({ hasText: /^2$/ })).toHaveCount(1);
  await expect(page.getByText("Procesar consume 2 Recursos.")).toBeVisible();

  await page.getByRole("button", { name: "Exportar" }).click();
  const json = await page.locator("textarea").inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const enlace = Object.values(exportado.modelo.enlaces)[0];
  expect(enlace?.multiplicidadOrigen).toBe("2");

  await page.screenshot({ path: "test-results/opm-multiplicidad-enlace.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("gestiona estados M0 de objeto con capsulas internas y OPL", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByLabel("Nombre").fill("Pedido");

  const seccionEstados = page.locator('section[aria-label="Estados"]');
  await expect(seccionEstados).toBeVisible();
  await page.getByRole("button", { name: "Agregar estados" }).click();

  await expect(seccionEstados.getByLabel("Nombre estado estado1")).toBeVisible();
  await seccionEstados.getByLabel("Nombre estado estado1").fill("pendiente");
  await seccionEstados.getByLabel("Nombre estado estado2").fill("cerrado");
  await seccionEstados.getByRole("button", { name: "Inicial" }).nth(0).click();
  await seccionEstados.getByRole("button", { name: "Final" }).nth(1).click();

  await expect(page.locator('[joint-selector^="stateCapsule"]')).toHaveCount(2);
  await expect(elementoPorTexto(page, "pendiente")).toHaveCount(1);
  await expect(elementoPorTexto(page, "cerrado")).toHaveCount(1);
  await expect(page.getByText(/Pedido puede ser .*pendiente.*cerrado/)).toBeVisible();

  await page.getByRole("button", { name: "Exportar" }).click();
  const json = await page.locator("textarea").inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const pedido = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Pedido");
  expect(pedido).toBeDefined();
  if (!pedido) throw new Error("No se exporto Pedido");
  const estados = Object.values(exportado.modelo.estados).filter((estado) => estado.entidadId === pedido.id);
  expect(estados).toHaveLength(2);
  expect(estados).toEqual(expect.arrayContaining([
    expect.objectContaining({ nombre: "pendiente", esInicial: true }),
    expect.objectContaining({ nombre: "cerrado", esFinal: true }),
  ]));

  await page.screenshot({ path: "test-results/opm-estados-objeto.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("apunta enlaces procedurales a estados y emite transicion OPL TS3", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.locator("textarea").fill(JSON.stringify(modeloTransicionEstados(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(page.locator('[joint-selector^="stateCapsule"]')).toHaveCount(2);
  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(page.getByText(/Aprobar\s+cambia\s+Pedido\s+de `pendiente` a `aprobado`\./)).toBeVisible();
  await expect(page.getByText(/Aprobar\s+cambia\s+Pedido\s+de `pendiente`\./)).toHaveCount(0);
  await expect(page.getByText(/Aprobar\s+cambia\s+Pedido\s+a `aprobado`\./)).toHaveCount(0);

  await page.getByRole("button", { name: "Exportar" }).click();
  const exportado = JSON.parse(await page.locator("textarea").inputValue()) as ExportadoModelo;
  expect(exportado.modelo.enlaces["e-consumo"]?.origenId).toEqual(extremoEstado("s-pendiente"));
  expect(exportado.modelo.enlaces["e-resultado"]?.destinoId).toEqual(extremoEstado("s-aprobado"));

  expect(pageErrors).toEqual([]);
});

test("crea resultado hacia capsula de estado por gesto directo y preserva TS3", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.locator("textarea").fill(JSON.stringify(modeloTransicionEstadosIncompleto(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(page.locator('[joint-selector^="stateCapsule"]')).toHaveCount(2);
  await expect(page.locator(".joint-link")).toHaveCount(1);
  await elementoPorTexto(page, "Aprobar").click();
  await page.getByLabel("Tipo de enlace").selectOption("resultado");
  await page.locator('[joint-selector^="stateLabel"]').filter({ hasText: "aprobado" }).click();

  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(page.getByText(/Aprobar\s+cambia\s+Pedido\s+de `pendiente` a `aprobado`\./)).toBeVisible();

  await page.getByRole("button", { name: "Exportar" }).click();
  const exportado = JSON.parse(await page.locator("textarea").inputValue()) as ExportadoModelo;
  const resultado = Object.values(exportado.modelo.enlaces).find((enlace) => enlace.tipo === "resultado");
  expect(resultado?.destinoId).toEqual(extremoEstado("s-aprobado"));

  expect(pageErrors).toEqual([]);
});

test("edita rutas en ramas de abanico hacia estados y sincroniza OPL y JSON", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.locator("textarea").fill(JSON.stringify(modeloAbanicoRutasEstados(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(page.locator('[joint-selector^="stateCapsule"]')).toHaveCount(2);
  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(svgText(page, "exitoso")).toBeVisible();

  await clickLinkPorIndice(page, 0);
  await page.getByTestId("ruta-etiqueta-input").fill("fallido");
  await expect(svgText(page, "fallido")).toBeVisible();

  await expect(page.getByText(/Por ruta exitoso/)).toBeVisible();
  await expect(page.getByText(/Por ruta fallido/)).toBeVisible();
  await expect(page.getByText(/genera\s+Pedido\s+en .(aprobado|rechazado).\./).first()).toBeVisible();

  await page.getByRole("button", { name: "Exportar" }).click();
  const exportado = JSON.parse(await page.locator("textarea").inputValue()) as ExportadoModelo;
  expect(Object.values(exportado.modelo.enlaces).map((enlace) => enlace.rutaEtiqueta).sort()).toEqual(["exitoso", "fallido"]);
  expect(exportado.modelo.abanicos?.["ab-rutas"]?.enlaceIds).toEqual(["e-exitoso", "e-fallido"]);

  await page.screenshot({ path: "test-results/opm-rutas-estados.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("split de efecto convierte enlace en consumo + resultado intermedio", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByLabel("Nombre").fill("Sistema");
  await page.getByRole("button", { name: "Proceso" }).click();
  await page.getByLabel("Nombre").fill("Actualizar");

  // Crear el efecto via toolbar: seleccionar origen, elegir tipo, click destino.
  const sistema = page.locator(".joint-element").filter({ hasText: "Sistema" }).first();
  const actualizar = page.locator(".joint-element").filter({ hasText: "Actualizar" }).first();
  await sistema.click();
  await page.getByLabel("Tipo de enlace").selectOption("efecto");
  await actualizar.click();

  // Hay 2 entidades + 1 efecto.
  await expect(page.locator(".joint-element")).toHaveCount(2);
  await expect(page.locator(".joint-link")).toHaveCount(1);

  // Seleccionar el enlace de efecto y splittearlo.
  await clickCentroLink(page);
  await page.getByRole("button", { name: "Split en par" }).click();

  // Tras el split: 3 entidades (Sistema, Actualizar, "Sistema modificado") y 2 enlaces.
  await expect(page.locator(".joint-element")).toHaveCount(3);
  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(elementoPorTexto(page, "Sistema modificado")).toHaveCount(1);

  // El JSON exportado refleja consumo + resultado y NO efecto.
  await page.getByRole("button", { name: "Exportar" }).click();
  const json = await page.locator("textarea").first().inputValue();
  expect(json).toContain('"consumo"');
  expect(json).toContain('"resultado"');
  expect(json).not.toMatch(/"tipo"\s*:\s*"efecto"/);

  expect(pageErrors).toEqual([]);
});

test("arrastra subproceso embebido dentro del macroproceso contenedor", async ({ page }) => {
  // Regresion: rect de restrictTranslate restaba cellBBox.width/height adicional al
  // que JointJS ya descuenta internamente (Element.mjs:130-131); el doble descuento
  // dejaba a los subprocesos sin juego horizontal/vertical y los anclaba al centro.
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso" }).click();
  await page.getByRole("button", { name: "Descomponer" }).click();

  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" })).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".joint-element")).toHaveCount(4);

  const ellipses = await page.locator(".joint-element").evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      const tieneEllipse = !!el.querySelector("ellipse");
      const modelId = el.getAttribute("model-id") ?? "";
      return { modelId, tieneEllipse, x: r.x, y: r.y, width: r.width, height: r.height };
    }),
  );
  const conEllipse = ellipses.filter((e) => e.tieneEllipse).sort((a, b) => b.width - a.width);
  const contornoIni = conEllipse[0];
  const subsIni = conEllipse.slice(1, 4).sort((a, b) => a.y - b.y);
  expect(subsIni).toHaveLength(3);

  const target = subsIni[1];
  const cx = target.x + target.width / 2;
  const cy = target.y + target.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 200, cy, { steps: 12 });
  await page.mouse.up();

  const ellipsesFin = await page.locator(".joint-element").evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      const tieneEllipse = !!el.querySelector("ellipse");
      const modelId = el.getAttribute("model-id") ?? "";
      return { modelId, tieneEllipse, x: r.x, y: r.y, width: r.width };
    }),
  );
  const conEllipseFin = ellipsesFin.filter((e) => e.tieneEllipse).sort((a, b) => b.width - a.width);
  const contornoFin = conEllipseFin[0];
  const subsFin = conEllipseFin.slice(1, 4).sort((a, b) => a.y - b.y);
  const subsFinPorId = new Map(subsFin.map((subproceso) => [subproceso.modelId, subproceso]));
  const targetFin = subsFinPorId.get(target.modelId);
  const hermanoSuperiorFin = subsFinPorId.get(subsIni[0]?.modelId ?? "");
  const hermanoInferiorFin = subsFinPorId.get(subsIni[2]?.modelId ?? "");
  expect(targetFin).toBeDefined();
  expect(hermanoSuperiorFin).toBeDefined();
  expect(hermanoInferiorFin).toBeDefined();
  if (!targetFin || !hermanoSuperiorFin || !hermanoInferiorFin) return;

  // El subproceso target se desplaza hacia la derecha (clamp por padding interior).
  expect(targetFin.x - target.x).toBeGreaterThan(100);
  // Contorno y hermanos quedan estaticos.
  expect(Math.abs(contornoFin.x - contornoIni.x)).toBeLessThan(10);
  expect(Math.abs(hermanoSuperiorFin.x - subsIni[0].x)).toBeLessThan(10);
  expect(Math.abs(hermanoInferiorFin.x - subsIni[2].x)).toBeLessThan(10);

  expect(pageErrors).toEqual([]);
});

test("renderiza agregacion como triangulo estructural", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByRole("button", { name: "Objeto" }).click();

  const objetos = elementoPorTexto(page, "Objeto");
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

async function clickLinkPorIndice(page: import("@playwright/test").Page, index: number): Promise<void> {
  const punto = await puntoMedioPath(page.locator(".joint-link [joint-selector=wrapper]").nth(index));
  await page.mouse.click(punto.x, punto.y);
}

async function clickLinkPorTipo(page: import("@playwright/test").Page, tipo: string): Promise<void> {
  const links = page.locator(".joint-link [joint-selector=wrapper]");
  const total = await links.count();
  for (let index = 0; index < total; index += 1) {
    const punto = await puntoMedioPath(links.nth(index));
    await page.mouse.click(punto.x, punto.y);
    if (await page.getByText(`Enlace ${tipo}`).count() > 0) return;
  }
  throw new Error(`No se pudo seleccionar enlace ${tipo}`);
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

async function estadoBeforeUnload(page: import("@playwright/test").Page): Promise<{ canceled: boolean; defaultPrevented: boolean }> {
  return page.evaluate(() => {
    const event = new Event("beforeunload", { cancelable: true }) as BeforeUnloadEvent;
    const dispatchResult = window.dispatchEvent(event);
    return {
      canceled: !dispatchResult,
      defaultPrevented: event.defaultPrevented,
    };
  });
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

function svgText(page: Page, text: string) {
  return page.locator(".joint-paper svg text").filter({ hasText: new RegExp(`^${escapeRegExp(text)}$`) }).first();
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
    "o-exhibition-a": objeto("o-exhibition-a", "Exhibidor"),
    "o-exhibition-b": objeto("o-exhibition-b", "Caracteristica"),
    "o-generalization-a": objeto("o-generalization-a", "General"),
    "o-generalization-b": objeto("o-generalization-b", "Especial"),
    "o-classification-a": objeto("o-classification-a", "Clase"),
    "o-classification-b": objeto("o-classification-b", "Instancia"),
  };
  const enlaces = {
    "e-agent": enlace("e-agent", "agente", "o-agent", "p-agent"),
    "e-instrument": enlace("e-instrument", "instrumento", "o-instrument", "p-instrument"),
    "e-consumption": enlace("e-consumption", "consumo", "o-consumption", "p-consumption"),
    "e-result": enlace("e-result", "resultado", "p-result", "o-result"),
    "e-effect": enlace("e-effect", "efecto", "o-effect", "p-effect"),
    "e-invocation": enlace("e-invocation", "invocacion", "p-invocation-a", "p-invocation-b"),
    "e-aggregation": enlace("e-aggregation", "agregacion", "o-whole", "o-part"),
    "e-exhibition": enlace("e-exhibition", "exhibicion", "o-exhibition-a", "o-exhibition-b"),
    "e-generalization": enlace("e-generalization", "generalizacion", "o-generalization-a", "o-generalization-b"),
    "e-classification": enlace("e-classification", "clasificacion", "o-classification-a", "o-classification-b"),
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
            ...aparienciaPar("o-exhibition-a", "o-exhibition-b", 70, 460),
            ...aparienciaPar("o-generalization-a", "o-generalization-b", 70, 520),
            ...aparienciaPar("o-classification-a", "o-classification-b", 70, 580),
          },
          enlaces: Object.fromEntries(Object.keys(enlaces).map((id) => [`a-${id}`, { id: `a-${id}`, enlaceId: id, opdId: "opd-1", vertices: [] }])),
        },
      },
    },
  };
}

function modeloModificadoresEnlace() {
  const entidades = {
    "o-orden": objeto("o-orden", "Orden"),
    "p-aprobar": proceso("p-aprobar", "Aprobar"),
    "o-regla": objeto("o-regla", "Regla"),
    "p-validar": proceso("p-validar", "Validar"),
  };
  const enlaces = {
    "e-evento": {
      ...enlace("e-evento", "consumo", "o-orden", "p-aprobar"),
      modificador: "evento",
      probabilidad: 0.7,
    },
    "e-condicion": {
      ...enlace("e-condicion", "instrumento", "o-regla", "p-aprobar"),
      modificador: "condicion",
    },
    "e-invoca": {
      ...enlace("e-invoca", "invocacion", "p-aprobar", "p-validar"),
      demora: "1s",
    },
  };
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-modificadores",
      nombre: "Modificadores",
      opdRaizId: "opd-1",
      nextSeq: 20,
      entidades,
      enlaces,
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            ...aparienciaPar("o-orden", "p-aprobar", 70, 80),
            "a-o-regla": { id: "a-o-regla", entidadId: "o-regla", opdId: "opd-1", x: 70, y: 190, width: 135, height: 60 },
            "a-p-validar": { id: "a-p-validar", entidadId: "p-validar", opdId: "opd-1", x: 650, y: 80, width: 135, height: 60 },
          },
          enlaces: Object.fromEntries(Object.keys(enlaces).map((id) => [`a-${id}`, { id: `a-${id}`, enlaceId: id, opdId: "opd-1", vertices: [] }])),
        },
      },
    },
  };
}

function modeloAbanicoLogico() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-abanico-logico",
      nombre: "Modelo abanico logico",
      opdRaizId: "opd-1",
      nextSeq: 1,
      entidades: {
        "o-entrada-a": {
          id: "o-entrada-a",
          tipo: "objeto",
          nombre: "Entrada A",
          esencia: "informacional",
          afiliacion: "sistemica",
        },
        "o-entrada-b": {
          id: "o-entrada-b",
          tipo: "objeto",
          nombre: "Entrada B",
          esencia: "informacional",
          afiliacion: "sistemica",
        },
        "p-procesar": {
          id: "p-procesar",
          tipo: "proceso",
          nombre: "Procesar",
          esencia: "informacional",
          afiliacion: "sistemica",
        },
      },
      estados: {},
      enlaces: {
        "e-consumo-a": {
          id: "e-consumo-a",
          tipo: "consumo",
          origenId: extremoEntidad("o-entrada-a"),
          destinoId: extremoEntidad("p-procesar"),
          etiqueta: "",
        },
        "e-consumo-b": {
          id: "e-consumo-b",
          tipo: "consumo",
          origenId: extremoEntidad("o-entrada-b"),
          destinoId: extremoEntidad("p-procesar"),
          etiqueta: "",
        },
      },
      abanicos: {
        "ab-1": {
          id: "ab-1",
          opdId: "opd-1",
          puertoEntidadId: "p-procesar",
          operador: "O",
          enlaceIds: ["e-consumo-a", "e-consumo-b"],
        },
      },
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "ap-entrada-a": { id: "ap-entrada-a", entidadId: "o-entrada-a", opdId: "opd-1", x: 40, y: 60, width: 135, height: 60 },
            "ap-entrada-b": { id: "ap-entrada-b", entidadId: "o-entrada-b", opdId: "opd-1", x: 40, y: 230, width: 135, height: 60 },
            "ap-procesar": { id: "ap-procesar", entidadId: "p-procesar", opdId: "opd-1", x: 310, y: 145, width: 135, height: 60 },
          },
          enlaces: {
            "ae-consumo-a": { id: "ae-consumo-a", enlaceId: "e-consumo-a", opdId: "opd-1", vertices: [] },
            "ae-consumo-b": { id: "ae-consumo-b", enlaceId: "e-consumo-b", opdId: "opd-1", vertices: [] },
          },
        },
      },
    },
  };
}

function modeloTransicionEstados() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-transicion-estados",
      nombre: "Transicion estados",
      opdRaizId: "opd-1",
      nextSeq: 20,
      entidades: {
        "o-pedido": objeto("o-pedido", "Pedido"),
        "p-aprobar": proceso("p-aprobar", "Aprobar"),
      },
      estados: {
        "s-pendiente": { id: "s-pendiente", entidadId: "o-pedido", nombre: "pendiente" },
        "s-aprobado": { id: "s-aprobado", entidadId: "o-pedido", nombre: "aprobado" },
      },
      enlaces: {
        "e-consumo": {
          id: "e-consumo",
          tipo: "consumo",
          origenId: extremoEstado("s-pendiente"),
          destinoId: extremoEntidad("p-aprobar"),
          etiqueta: "",
        },
        "e-resultado": {
          id: "e-resultado",
          tipo: "resultado",
          origenId: extremoEntidad("p-aprobar"),
          destinoId: extremoEstado("s-aprobado"),
          etiqueta: "",
        },
      },
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-pedido": { id: "a-pedido", entidadId: "o-pedido", opdId: "opd-1", x: 80, y: 90, width: 135, height: 60 },
            "a-aprobar": { id: "a-aprobar", entidadId: "p-aprobar", opdId: "opd-1", x: 280, y: 90, width: 135, height: 60 },
          },
          enlaces: {
            "ae-consumo": { id: "ae-consumo", enlaceId: "e-consumo", opdId: "opd-1", vertices: [] },
            "ae-resultado": { id: "ae-resultado", enlaceId: "e-resultado", opdId: "opd-1", vertices: [] },
          },
        },
      },
    },
  };
}

function modeloTransicionEstadosIncompleto() {
  const base = modeloTransicionEstados();
  delete base.modelo.enlaces["e-resultado"];
  delete base.modelo.opds["opd-1"].enlaces["ae-resultado"];
  base.modelo.nextSeq = 30;
  return base;
}

function modeloAbanicoRutasEstados() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-rutas-estados",
      nombre: "Rutas a estados",
      opdRaizId: "opd-1",
      nextSeq: 30,
      entidades: {
        "o-pedido": objeto("o-pedido", "Pedido"),
        "p-aprobar": proceso("p-aprobar", "Aprobar"),
      },
      estados: {
        "s-aprobado": { id: "s-aprobado", entidadId: "o-pedido", nombre: "aprobado" },
        "s-rechazado": { id: "s-rechazado", entidadId: "o-pedido", nombre: "rechazado" },
      },
      enlaces: {
        "e-exitoso": {
          id: "e-exitoso",
          tipo: "resultado",
          origenId: extremoEntidad("p-aprobar"),
          destinoId: extremoEstado("s-aprobado"),
          etiqueta: "",
          rutaEtiqueta: "exitoso",
        },
        "e-fallido": {
          id: "e-fallido",
          tipo: "resultado",
          origenId: extremoEntidad("p-aprobar"),
          destinoId: extremoEstado("s-rechazado"),
          etiqueta: "",
        },
      },
      abanicos: {
        "ab-rutas": {
          id: "ab-rutas",
          opdId: "opd-1",
          puertoEntidadId: "p-aprobar",
          operador: "XOR",
          enlaceIds: ["e-exitoso", "e-fallido"],
        },
      },
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-pedido": { id: "a-pedido", entidadId: "o-pedido", opdId: "opd-1", x: 320, y: 90, width: 170, height: 94 },
            "a-aprobar": { id: "a-aprobar", entidadId: "p-aprobar", opdId: "opd-1", x: 80, y: 110, width: 135, height: 60 },
          },
          enlaces: {
            "ae-exitoso": { id: "ae-exitoso", enlaceId: "e-exitoso", opdId: "opd-1", vertices: [] },
            "ae-fallido": { id: "ae-fallido", enlaceId: "e-fallido", opdId: "opd-1", vertices: [] },
          },
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
    estados: Record<string, { id: string; entidadId: string; nombre: string; esInicial?: boolean; esFinal?: boolean }>;
    enlaces: Record<string, {
      id: string;
      tipo: string;
      origenId: ExtremoExportado;
      destinoId: ExtremoExportado;
      multiplicidadOrigen?: string;
      multiplicidadDestino?: string;
      rutaEtiqueta?: string;
      derivado?: { tipo: string; refinamientoId: string; enlacePadreId: string; origen?: string };
    }>;
    abanicos?: Record<string, { enlaceIds: string[] }>;
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

type ExtremoExportado = string | { kind: "entidad" | "estado"; id: string };

function extremoEntidad(id: string): ExtremoExportado {
  return { kind: "entidad", id };
}

function extremoEstado(id: string): ExtremoExportado {
  return { kind: "estado", id };
}

function extremoApuntaAEntidad(extremo: ExtremoExportado, entidadId: string): boolean {
  return typeof extremo === "string"
    ? extremo === entidadId
    : extremo.kind === "entidad" && extremo.id === entidadId;
}
