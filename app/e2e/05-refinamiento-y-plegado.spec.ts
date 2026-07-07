import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  elementoPorTexto,
  escapeRegExp,
  modeloTraerConectadosSmoke,
  esperarWorkbenchInicial,
  crearAtributoNumericoSmoke,
  rectDeLocator,
  clickCabeceraElemento,
  clickCentroLink,
  elegirTipoEnlaceDesdeMenu,
  clickLinkPorIndice,
  clickLinkPorTipo,
  desplegarComoAgregacion,
  ejecutarAccionCommandPalette,
  irATabRefinamiento,
  irATabExtremos,
  guardarComoActual,
  cargarPrimerModelo,
  crearModeloNuevoDesdeMenu,
  assertWorkbenchLayout,
  assertCanvasScrollable,
  estadoBeforeUnload,
  puntoMedioPath,
  todasSeparadas,
  svgText,
  jsonEditor,
  exportadoActual,
  aparienciaRaizPorNombre,
  verticesPrimerEnlace,
  modeloDosOpds,
  modeloSmokeTablaEnlaces,
  modeloMarkersCanonicos,
  modeloModificadoresEnlace,
  modeloNoModificador,
  modeloMoverPuerto,
  modeloConsumoDuplicado,
  modeloBusAgregacion,
  modeloAbanicoLogico,
  modeloTransicionEstados,
  modeloTransicionEstadosIncompleto,
  modeloAbanicoRutasEstados,
  objeto,
  proceso,
  enlace,
  aparienciaPar,
  extremoEntidad,
  extremoEstado,
  extremoApuntaAEntidad,
  type ExportadoModelo,
  type ExtremoExportado,
} from "./_smoke-helpers";

test("descompone proceso y navega al OPD hijo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  // Ronda 22: Inzoom vive en el catálogo contextual; Refinamiento muestra estado.
  await irATabRefinamiento(page);
  await expect(page.getByTestId("refinamiento-estado-descomposicion")).toContainText("Inzoom: sin OPD hijo");
  // Ronda23 L1 #10: el label de la acción inzoom de la barra flotante pasó a
  // "Descomponer". Para asegurar que el panel Refinamiento NO renderiza un
  // botón propio "Descomponer" (la acción vive en el catálogo contextual),
  // se busca dentro del scope del estado de descomposición.
  await expect(
    page.getByTestId("refinamiento-estado-descomposicion").getByRole("button", { name: "Descomponer" }),
  ).toHaveCount(0);

  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");

  const nodoHijo = page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" });
  await expect(nodoHijo).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".joint-element")).toHaveCount(4);
  await expect(page.getByTestId("opl-pane")).toContainText("Sin OPL todavía");

  // BUG-20260524T034932Z-b6be2b: al navegar al OPD hijo refinado, el viewport
  // debe enfocar el centro geométrico del canvas (donde nace el diagrama
  // refinado), no quedar en la esquina superior izquierda (scroll 0,0).
  await expect.poll(async () => {
    const contorno = await elementoPorTexto(page, "Proceso").boundingBox();
    const canvasBox = await page.getByTestId("canvas-pane").boundingBox();
    if (!contorno || !canvasBox) return Number.POSITIVE_INFINITY;
    const centroContornoX = contorno.x + contorno.width / 2;
    const centroCanvasX = canvasBox.x + canvasBox.width / 2;
    return Math.abs(centroContornoX - centroCanvasX);
  }).toBeLessThan(260);
  const scrollRefinado = await page.getByRole("img", { name: "OPD activo" }).evaluate((el) => ({
    left: el.scrollLeft,
    top: el.scrollTop,
  }));
  // Canvas infinito: el viewport enfoca el centro del contenido (verificado
  // arriba por el centrado del contorno). El centro ya no es el punto fijo
  // 3600/2600; basta confirmar que el viewport se desplazó del origen (no quedó
  // en la esquina 0,0), que era la regresión del bug.
  expect(scrollRefinado.left).toBeGreaterThan(0);
  expect(scrollRefinado.top).toBeGreaterThan(0);
  const json = await jsonEditor(page).inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const proceso = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Proceso");
  const subprocesos = Object.values(exportado.modelo.entidades).filter((entidad) => /^Proceso [1-3]$/.test(entidad.nombre));
  expect(proceso?.refinamientos?.descomposicion).toBeDefined();
  expect(subprocesos).toHaveLength(3);
  const opdHijoId = proceso?.refinamientos?.descomposicion?.opdId;
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

  await expect(page.getByRole("button", { name: "Quitar descomposición" })).toHaveCount(0);
  await ejecutarAccionCommandPalette(page, "quitar inzoom", "accion-quitar-descomposicion");
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" })).toHaveCount(0);
  await expect(page.locator('[role="treeitem"][data-opd-id="opd-1"]')).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("Proceso se descompone en Proceso 1, Proceso 2 y Proceso 3 en esa secuencia.")).toHaveCount(0);
  const jsonSinDescomposicion = await jsonEditor(page).inputValue();
  const exportadoSinDescomposicion = JSON.parse(jsonSinDescomposicion) as ExportadoModelo;
  const procesoSinDescomposicion = Object.values(exportadoSinDescomposicion.modelo.entidades).find((entidad) => entidad.nombre === "Proceso");
  expect(procesoSinDescomposicion?.refinamientos).toBeUndefined();
  expect(Object.values(exportadoSinDescomposicion.modelo.opds)).toHaveLength(1);

  expect(pageErrors).toEqual([]);
});

test("descompone objeto desde barra contextual y navega al OPD hijo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(page.getByTestId("barra-inzoom")).toBeVisible();

  await page.getByTestId("barra-inzoom").click();

  const nodoHijo = page.locator('[role="treeitem"]').filter({ hasText: "SD1: Objeto descompuesto" });
  await expect(nodoHijo).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".joint-element")).toHaveCount(4);
  await expect(page.getByTestId("bloque-opl-opd-1").getByText("Objeto se descompone en Objeto 1, Objeto 2 y Objeto 3 en esa secuencia.")).toBeVisible();
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  const componentes = Object.values(exportado.modelo.entidades).filter((entidad) => /^Objeto [1-3]$/.test(entidad.nombre));
  expect(objeto?.refinamientos?.descomposicion).toBeDefined();
  expect(componentes).toHaveLength(3);
  expect(componentes.every((entidad) => (entidad as { tipo?: string }).tipo === "objeto")).toBe(true);
  const opdHijoId = objeto?.refinamientos?.descomposicion?.opdId;
  if (!opdHijoId || !objeto) throw new Error("La descomposicion de objeto no exporto opdId");
  expect(exportado.modelo.opds[opdHijoId]?.padreId).toBe(exportado.modelo.opdRaizId);
  const aparienciasHijo = Object.values(exportado.modelo.opds[opdHijoId]?.apariencias ?? {});
  const contorno = aparienciasHijo.find((apariencia) => apariencia.entidadId === objeto.id);
  if (!contorno) throw new Error("No se exporto contorno de objeto descompuesto");
  for (const componente of componentes) {
    const apariencia = aparienciasHijo.find((item) => item.entidadId === componente.id);
    if (!apariencia) throw new Error(`No se exporto apariencia de ${componente.nombre}`);
    expect(apariencia.x).toBeGreaterThan(contorno.x);
    expect(apariencia.y).toBeGreaterThan(contorno.y);
    expect(apariencia.x + apariencia.width).toBeLessThan(contorno.x + contorno.width);
    expect(apariencia.y + apariencia.height).toBeLessThan(contorno.y + contorno.height);
  }

  await page.screenshot({ path: "test-results/opm-object-inzoom-opd-hijo.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("elimina desde arbol solo OPDs hoja y deshacer restaura", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  // Ronda 22: Inzoom vive en el catalogo contextual.
  await irATabRefinamiento(page);
  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");
  const nodoPadre = page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" });
  await expect(nodoPadre).toHaveAttribute("aria-current", "page");

  await elementoPorTexto(page, "Proceso 1").click();
  await irATabRefinamiento(page);
  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");
  const nodoHoja = page.locator('[role="treeitem"]').filter({ hasText: "SD1.1: Proceso 1 descompuesto" });
  await expect(nodoHoja).toHaveAttribute("aria-current", "page");

  await nodoPadre.hover();
  await nodoPadre.getByRole("button", { name: /Eliminar OPD/ }).click();
  await expect(page.getByText(/Eliminar descendientes primero/)).toBeVisible();
  await expect(nodoPadre).toHaveCount(1);
  await expect(nodoHoja).toHaveCount(1);

  page.once("dialog", (dialog) => dialog.accept());
  await nodoHoja.hover();
  await nodoHoja.getByRole("button", { name: /Eliminar OPD/ }).click();
  await expect(nodoHoja).toHaveCount(0);
  await expect(nodoPadre).toHaveAttribute("aria-current", "page");

  // Ronda 25 L1 III.A: chrome ya no expone botón ↶; undo se invoca por atajo.
  await page.keyboard.press("Control+Z");
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1.1: Proceso 1 descompuesto" })).toHaveCount(1);

  await page.screenshot({ path: "test-results/opm-eliminar-opd-hoja.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("crea objeto interno por click dentro del contenedor refinado", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  // Ronda 22: Inzoom vive en el catalogo contextual.
  await irATabRefinamiento(page);
  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" })).toHaveAttribute("aria-current", "page");

  await page.getByTestId("toolbar-drag-objeto").click({ modifiers: ["Shift"] });
  const contorno = await rectDeLocator(elementoPorTexto(page, "Proceso"));
  await page.mouse.click(contorno.x + 48, contorno.y + 118);

  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);
  await expect(page.getByText(/interior|exterior/i)).toHaveCount(0);
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const proceso = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Proceso");
  const objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  const opdHijoId = proceso?.refinamientos?.descomposicion?.opdId;
  if (!proceso || !objeto || !opdHijoId) throw new Error("No se exporto la creación interna esperada");
  const aparienciasHijo = Object.values(exportado.modelo.opds[opdHijoId]?.apariencias ?? {});
  const aparienciaContorno = aparienciasHijo.find((apariencia) => apariencia.entidadId === proceso.id);
  const aparienciaObjeto = aparienciasHijo.find((apariencia) => apariencia.entidadId === objeto.id);
  if (!aparienciaContorno || !aparienciaObjeto) throw new Error("No se exporto apariencia interna");
  expect(aparienciaObjeto.x).toBeGreaterThan(aparienciaContorno.x);
  expect(aparienciaObjeto.y).toBeGreaterThan(aparienciaContorno.y);
  expect(aparienciaObjeto.x + aparienciaObjeto.width).toBeLessThan(aparienciaContorno.x + aparienciaContorno.width);
  expect(aparienciaObjeto.y + aparienciaObjeto.height).toBeLessThan(aparienciaContorno.y + aparienciaContorno.height);
  expect(Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .some((apariencia) => apariencia.entidadId === objeto.id)).toBe(false);

  await page.screenshot({ path: "test-results/opm-creacion-interna-contenedor.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("crea objeto contextual fuera del contenedor refinado cuando el click cae fuera", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await irATabRefinamiento(page);
  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" })).toHaveAttribute("aria-current", "page");

  await page.getByTestId("toolbar-drag-objeto").click({ modifiers: ["Shift"] });
  const contorno = await rectDeLocator(elementoPorTexto(page, "Proceso"));
  await page.mouse.click(contorno.x - 30, contorno.y + contorno.height / 2);

  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const proceso = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Proceso");
  const objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  const opdHijoId = proceso?.refinamientos?.descomposicion?.opdId;
  if (!proceso || !objeto || !opdHijoId) throw new Error("No se exporto la creación contextual esperada");
  const aparienciasHijo = Object.values(exportado.modelo.opds[opdHijoId]?.apariencias ?? {});
  const aparienciaContorno = aparienciasHijo.find((apariencia) => apariencia.entidadId === proceso.id);
  const aparienciaObjeto = aparienciasHijo.find((apariencia) => apariencia.entidadId === objeto.id);
  if (!aparienciaContorno || !aparienciaObjeto) throw new Error("No se exporto apariencia contextual");
  expect(aparienciaObjeto.contextoRefinamiento).toBeUndefined();
  expect(pageErrors).toEqual([]);
});

test("despliega objeto y navega al OPD hijo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  // Ronda 22: Unfold vive en el catálogo contextual; Refinamiento muestra estado.
  await irATabRefinamiento(page);
  await expect(page.getByTestId("refinamiento-estado-despliegue")).toContainText("Despliegue: sin OPD hijo");
  await expect(page.getByText("Desplegar como...")).toHaveCount(0);

  await desplegarComoAgregacion(page);

  const nodoHijo = page.locator('[role="treeitem"]').filter({ hasText: "SD1: Objeto desplegado" });
  await expect(nodoHijo).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".joint-element")).toHaveCount(5);
  await expect(page.getByTestId("bloque-opl-opd-1").getByText("Objeto se despliega en Objeto parte 1, Objeto parte 2 y Objeto parte 3.")).toBeVisible();
  const json = await jsonEditor(page).inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  const partes = Object.values(exportado.modelo.entidades).filter((entidad) => /^Objeto parte [1-3]$/.test(entidad.nombre));
  expect(objeto?.refinamientos?.despliegue).toBeDefined();
  expect(partes).toHaveLength(3);
  const opdHijoId = objeto?.refinamientos?.despliegue?.opdId;
  expect(opdHijoId).toBeTruthy();
  if (!opdHijoId || !objeto) throw new Error("El despliegue no exporto opdId");
  expect(exportado.modelo.opds[opdHijoId]?.padreId).toBe(exportado.modelo.opdRaizId);
  expect(Object.values(exportado.modelo.enlaces).filter((enlace) => enlace.tipo === "agregacion" && extremoApuntaAEntidad(enlace.origenId, objeto.id))).toHaveLength(3);

  await expect(page.getByRole("button", { name: "Quitar despliegue" })).toHaveCount(0);
  await ejecutarAccionCommandPalette(page, "quitar despliegue", "accion-quitar-despliegue");
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Objeto desplegado" })).toHaveCount(0);
  const jsonSinDespliegue = await jsonEditor(page).inputValue();
  const exportadoSinDespliegue = JSON.parse(jsonSinDespliegue) as ExportadoModelo;
  const objetoSinDespliegue = Object.values(exportadoSinDespliegue.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  expect(objetoSinDespliegue?.refinamientos).toBeUndefined();
  expect(Object.values(exportadoSinDespliegue.modelo.opds)).toHaveLength(1);
  expect(Object.values(exportadoSinDespliegue.modelo.enlaces)).toHaveLength(0);

  await page.screenshot({ path: "test-results/opm-despliegue-opd-hijo.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("despliega proceso desde inspector y navega al OPD hijo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  // Ronda 22: Unfold vive en el catálogo contextual; Refinamiento muestra estado.
  await irATabRefinamiento(page);
  await expect(page.getByTestId("refinamiento-estado-despliegue")).toContainText("Despliegue: sin OPD hijo");
  await expect(page.getByText("Desplegar como...")).toHaveCount(0);

  await desplegarComoAgregacion(page);

  const nodoHijo = page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso desplegado" });
  await expect(nodoHijo).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".joint-element")).toHaveCount(5);
  await expect(page.getByTestId("opl-pane")).toContainText("Sin OPL todavía");
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const proceso = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Proceso");
  const partes = Object.values(exportado.modelo.entidades).filter((entidad) => /^Proceso parte [1-3]$/.test(entidad.nombre));
  expect(proceso?.refinamientos?.despliegue).toBeDefined();
  expect(partes).toHaveLength(3);
  expect(partes.every((entidad) => (entidad as { tipo?: string }).tipo === "proceso")).toBe(true);
  const opdHijoId = proceso?.refinamientos?.despliegue?.opdId;
  if (!opdHijoId || !proceso) throw new Error("El despliegue de proceso no exporto opdId");
  expect(exportado.modelo.opds[opdHijoId]?.padreId).toBe(exportado.modelo.opdRaizId);
  expect(Object.values(exportado.modelo.enlaces).filter((enlace) => enlace.tipo === "agregacion" && extremoApuntaAEntidad(enlace.origenId, proceso.id))).toHaveLength(3);
  const aparienciasHijo = Object.values(exportado.modelo.opds[opdHijoId]?.apariencias ?? {});
  const contorno = aparienciasHijo.find((apariencia) => apariencia.entidadId === proceso.id);
  if (!contorno) throw new Error("No se exporto contorno de proceso desplegado");
  for (const parte of partes) {
    const apariencia = aparienciasHijo.find((item) => item.entidadId === parte.id);
    if (!apariencia) throw new Error(`No se exporto apariencia de ${parte.nombre}`);
    // BUG-372334: en despliegue (unfold) las partes viven FUERA del padre y se
    // posicionan debajo (no embebidas). Inzoom es el modo embebido.
    const dentro = apariencia.x >= contorno.x
      && apariencia.y >= contorno.y
      && apariencia.x + apariencia.width <= contorno.x + contorno.width
      && apariencia.y + apariencia.height <= contorno.y + contorno.height;
    expect(dentro).toBe(false);
    expect(apariencia.y).toBeGreaterThanOrEqual(contorno.y + contorno.height);
  }

  await page.locator('[role="treeitem"][data-opd-id="opd-1"]').click();
  await elementoPorTexto(page, "Proceso").click();
  // Reset de tab al cambiar selección: volver a Refinamiento para ver estado del despliegue.
  await irATabRefinamiento(page);
  await expect(page.getByTestId("refinamiento-estado-despliegue")).toContainText("Despliegue: SD1");
  await expect(page.getByRole("button", { name: "Mostrar despliegue" })).toHaveCount(0);

  await page.screenshot({ path: "test-results/opm-process-unfold-opd-hijo.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("ronda 15.2: una entidad acepta descomposicion + despliegue simultaneos y el arbol muestra ambos OPDs hijos", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  // Inzoom vive en el catálogo contextual.
  await irATabRefinamiento(page);
  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");
  const nodoInzoom = page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" });
  await expect(nodoInzoom).toHaveAttribute("aria-current", "page");
  // Volver a la raíz para desplegar
  await page.locator('[role="treeitem"][data-opd-id="opd-1"]').click();
  await elementoPorTexto(page, "Proceso").click();
  // Desplegar (unfold) sin remover la descomposicion previa.
  await desplegarComoAgregacion(page);
  const nodoUnfold = page.locator('[role="treeitem"]').filter({ hasText: "SD2: Proceso desplegado" });
  await expect(nodoUnfold).toHaveAttribute("aria-current", "page");

  // Árbol muestra ambos OPDs hijos.
  await expect(nodoInzoom).toHaveCount(1);
  await expect(nodoUnfold).toHaveCount(1);

  // Volver a la raíz y verificar que el inspector muestra ambos estados sin acciones imperativas.
  await page.locator('[role="treeitem"][data-opd-id="opd-1"]').click();
  await elementoPorTexto(page, "Proceso").click();
  // Reset de tab al cambiar selección: re-navegar a Refinamiento.
  await irATabRefinamiento(page);
  await expect(page.getByTestId("refinamiento-estado-descomposicion")).toContainText("Inzoom: SD1");
  await expect(page.getByTestId("refinamiento-estado-despliegue")).toContainText("Despliegue: SD2");
  await expect(page.getByRole("button", { name: "Abrir descomposición" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Mostrar despliegue" })).toHaveCount(0);

  // El JSON exportado preserva ambos slots ortogonales.
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const proceso = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Proceso");
  expect(proceso?.refinamientos?.descomposicion?.opdId).toBeTruthy();
  expect(proceso?.refinamientos?.despliegue?.opdId).toBeTruthy();
  expect(proceso?.refinamientos?.descomposicion?.opdId).not.toBe(proceso?.refinamientos?.despliegue?.opdId);

  await page.screenshot({ path: "test-results/opm-refinamiento-dual.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("activa plegado parcial desde Inspector y persiste la vista compacta", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await desplegarComoAgregacion(page);
  await page.locator('[role="treeitem"][data-opd-id="opd-1"]').click();
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await elementoPorTexto(page, "Objeto").click();

  // Ronda 20 L1: Plegado parcial/completo vive en el tab `Refinamiento`.
  await irATabRefinamiento(page);
  await expect(page.getByRole("button", { name: "Plegado parcial" })).toBeVisible();
  await page.getByRole("button", { name: "Plegado parcial" }).click();

  await expect(page.locator(".joint-element")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Objeto parte 1")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Objeto parte 2")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Objeto parte 3")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Plegado completo" })).toBeVisible();
  const json = await jsonEditor(page).inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  if (!objeto?.refinamientos?.despliegue) throw new Error("No se exporto despliegue del objeto");
  const aparienciaPadre = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .find((apariencia) => apariencia.entidadId === objeto.id);
  expect(aparienciaPadre?.modoPlegado).toBe("parcial");
  expect(Object.values(exportado.modelo.opds[objeto.refinamientos.despliegue.opdId]?.apariencias ?? {})).toHaveLength(4);

  await guardarComoActual(page, "Plegado parcial local");
  await crearModeloNuevoDesdeMenu(page);
  await cargarPrimerModelo(page);
  await expect(elementoPorTexto(page, "Objeto parte 1")).toHaveCount(1);
  await clickCabeceraElemento(page, "Objeto");
  // Ronda 20 L1: el toggle Plegado completo/parcial vive en el tab `Refinamiento`.
  await irATabRefinamiento(page);
  await expect(page.getByRole("button", { name: "Plegado completo" })).toBeVisible();

  await page.screenshot({ path: "test-results/opm-plegado-parcial.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("crea enlace desde fila plegada sin extraer la parte", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Mover");
  await elementoPorTexto(page, "Objeto").click();
  await desplegarComoAgregacion(page);
  await page.locator('[role="treeitem"][data-opd-id="opd-1"]').click();
  await expect(page.locator(".joint-element")).toHaveCount(2);
  await clickCabeceraElemento(page, "Objeto");
  // Ronda 20 L1: Plegado parcial vive en el tab `Refinamiento`.
  await irATabRefinamiento(page);
  await page.getByRole("button", { name: "Plegado parcial" }).click();
  await expect(elementoPorTexto(page, "Objeto parte 1")).toHaveCount(1);

  await elementoPorTexto(page, "Objeto parte 1").click();
  await elegirTipoEnlaceDesdeMenu(page, "instrumento");
  await elementoPorTexto(page, "Mover").click();

  await expect(page.locator(".joint-link")).toHaveCount(1);
  await expect(page.getByText(/Mover\s+requiere\s+Objeto parte 1\./)).toBeVisible();
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  const parte = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto parte 1");
  const mover = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Mover");
  if (!objeto || !parte || !mover) throw new Error("No se exportaron entidades esperadas");
  const enlace = Object.values(exportado.modelo.enlaces).find((item) => item.tipo === "instrumento");
  expect(enlace).toMatchObject({
    origenId: extremoEntidad(parte.id),
    destinoId: extremoEntidad(mover.id),
  });
  const aparienciasRaiz = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {});
  expect(aparienciasRaiz.some((apariencia) => apariencia.entidadId === parte.id)).toBe(false);
  expect(aparienciasRaiz.some((apariencia) => apariencia.entidadId === objeto.id && apariencia.modoPlegado === "parcial")).toBe(true);

  await page.screenshot({ path: "test-results/opm-fila-plegada-enlace.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("mantiene canvas e inspector en columnas separadas tras recalculos", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  // Ronda 22: Inzoom vive en el catalogo contextual.
  await irATabRefinamiento(page);
  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");
  await elementoPorTexto(page, "Proceso 1").click();
  await irATabRefinamiento(page);
  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");
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
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Salida");

  await elementoPorTexto(page, "Entrada").click();
  await elegirTipoEnlaceDesdeMenu(page, "consumo");
  await clickCabeceraElemento(page, "Procesar");
  await elementoPorTexto(page, "Procesar").click();
  await elegirTipoEnlaceDesdeMenu(page, "resultado");
  await elementoPorTexto(page, "Salida").click();
  await expect(page.locator(".joint-link")).toHaveCount(2);

  await elementoPorTexto(page, "Procesar").click();
  // Ronda 22: Inzoom vive en el catalogo contextual.
  await irATabRefinamiento(page);
  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Procesar descompuesto" })).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".joint-element")).toHaveCount(6);
  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(elementoPorTexto(page, "Entrada")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Salida")).toHaveCount(1);
  await expect(page.getByText(/Procesar 1\s+consume\s+Entrada/)).toBeVisible();
  await expect(page.getByText(/Procesar 3\s+genera\s+Salida/)).toBeVisible();
  const json = await jsonEditor(page).inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const procesar = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar");
  const entrada = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Entrada");
  const salida = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Salida");
  const primero = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar 1");
  const ultimo = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar 3");
  const opdHijoId = procesar?.refinamientos?.descomposicion?.opdId;
  if (!opdHijoId || !entrada || !salida || !primero || !ultimo) throw new Error("No se exporto la redistribucion esperada");
  const enlacesHijo = Object.values(exportado.modelo.opds[opdHijoId]?.enlaces ?? {})
    .map((apariencia) => exportado.modelo.enlaces[apariencia.enlaceId]);
  expect(enlacesHijo).toEqual(expect.arrayContaining([
    expect.objectContaining({
      tipo: "consumo",
      origenId: expect.objectContaining(extremoEntidad(entrada.id)),
      destinoId: expect.objectContaining(extremoEntidad(primero.id)),
    }),
    expect.objectContaining({
      tipo: "resultado",
      origenId: expect.objectContaining(extremoEntidad(ultimo.id)),
      destinoId: expect.objectContaining(extremoEntidad(salida.id)),
    }),
  ]));

  await page.screenshot({ path: "test-results/opm-descomposicion-enlaces-externos.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("BUG-20260520T060333Z-bddc4e traslada fan de resultados al diagrama refinado", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloFanResultadoRefinable(), null, 2));
  await page.getByRole("button", { name: "Importar", exact: true }).click();
  await elementoPorTexto(page, "Procesar").click();
  await irATabRefinamiento(page);
  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Procesar descompuesto" })).toHaveAttribute("aria-current", "page");

  const exportado = await exportadoActual(page);
  const procesar = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar");
  const ultimo = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar 3");
  const opdHijoId = procesar?.refinamientos?.descomposicion?.opdId;
  if (!opdHijoId || !ultimo) throw new Error("No se exporto la descomposicion esperada");
  const derivados = Object.values(exportado.modelo.opds[opdHijoId]?.enlaces ?? {})
    .map((apariencia) => exportado.modelo.enlaces[apariencia.enlaceId])
    .filter((enlace) => enlace?.tipo === "resultado" && enlace.derivado?.origen === "automatico");
  const abanicosHijo = Object.values(exportado.modelo.abanicos ?? {}).filter((abanico) => abanico.opdId === opdHijoId);

  expect(derivados).toHaveLength(2);
  expect(abanicosHijo).toHaveLength(1);
  expect(abanicosHijo[0]?.operador).toBe("O");
  expect(abanicosHijo[0]?.enlaceIds).toEqual(derivados.map((enlace) => enlace.id));
  expect(abanicosHijo[0]?.puertoComun).toEqual({
    entidadId: ultimo.id,
    lado: "origen",
    portId: derivados[0]?.origenId.portId,
  });
  expect(pageErrors).toEqual([]);
});

test("reancla consumo derivado y conserva el ancla manual al reordenar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await elementoPorTexto(page, "Entrada").click();
  await elegirTipoEnlaceDesdeMenu(page, "consumo");
  await elementoPorTexto(page, "Procesar").click();
  await elementoPorTexto(page, "Procesar").click();
  // Ronda 22: Inzoom vive en el catalogo contextual.
  await irATabRefinamiento(page);
  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Procesar descompuesto" })).toHaveAttribute("aria-current", "page");

  await expect(page.getByText("Enlaces externos derivados")).toBeVisible();
  await page.getByTestId(/refinamiento-reasignar-/).selectOption({ label: "Procesar 2 (2)" });
  await page.getByRole("button", { name: "Reasignar" }).click();

  const proceso2 = await elementoPorTexto(page, "Procesar 2").boundingBox();
  if (!proceso2) throw new Error("No se pudo ubicar Procesar 2");
  await page.mouse.move(proceso2.x + proceso2.width / 2, proceso2.y + proceso2.height / 2);
  await page.mouse.down();
  await page.mouse.move(proceso2.x + proceso2.width / 2, proceso2.y + proceso2.height / 2 + 170, { steps: 10 });
  await page.mouse.up();

  await expect(page.getByText(/Procesar 2\s+consume\s+Entrada/)).toBeVisible();
  const json = await jsonEditor(page).inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const procesar = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar");
  const entrada = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Entrada");
  const segundo = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar 2");
  const opdHijoId = procesar?.refinamientos?.descomposicion?.opdId;
  if (!opdHijoId || !entrada || !segundo) throw new Error("No se exporto el reanclaje esperado");
  const consumos = Object.values(exportado.modelo.opds[opdHijoId]?.enlaces ?? {})
    .map((apariencia) => exportado.modelo.enlaces[apariencia.enlaceId])
    .filter((enlace) => enlace?.tipo === "consumo");
  expect(consumos).toHaveLength(1);
  expect(consumos[0]).toEqual(expect.objectContaining({
    origenId: expect.objectContaining(extremoEntidad(entrada.id)),
    destinoId: expect.objectContaining(extremoEntidad(segundo.id)),
    derivado: expect.objectContaining({ origen: "manual" }),
  }));

  await page.screenshot({ path: "test-results/opm-reanclaje-manual.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("L3 descomposicion avanzada: inspector reasigna, inline renombra, paralelo y ambiental clamp", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await elementoPorTexto(page, "Entrada").click();
  await elegirTipoEnlaceDesdeMenu(page, "consumo");
  await elementoPorTexto(page, "Procesar").click();
  await elementoPorTexto(page, "Procesar").click();
  // Ronda 22: Inzoom vive en el catalogo contextual.
  await irATabRefinamiento(page);
  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Procesar descompuesto" })).toHaveAttribute("aria-current", "page");

  await clickCabeceraElemento(page, "Procesar");
  // Ronda 20 L1: ReasignacionExternos vive en el tab `Refinamiento`.
  await irATabRefinamiento(page);
  await expect(page.getByText("Enlaces externos derivados")).toBeVisible();
  await page.getByTestId(/refinamiento-reasignar-/).selectOption({ label: "Procesar 2 (2)" });
  await page.getByRole("button", { name: "Reasignar" }).click();

  const proceso2ParaRename = elementoPorTexto(page, "Procesar 2");
  await expect(proceso2ParaRename).toBeVisible();
  await abrirRenombradoInline(page, proceso2ParaRename);
  await expect(page.getByTestId("renombrado-inline")).toBeVisible();
  await page.getByTestId("renombrado-inline").fill("Validar Entrada");
  await page.keyboard.press("Enter");
  await expect(elementoPorTexto(page, "Validar Entrada")).toHaveCount(1);
  await expect(page.getByText(/Validar Entrada\s+consume\s+Entrada/)).toBeVisible();

  // Tras reasignar/renombrar el viewport puede quedar lejos del contenido
  // (scroll preservado); el drag por mouse solo agarra elementos visibles.
  // Como haría un humano: scrollear al subproceso antes de arrastrarlo y
  // releer las coordenadas ya con la vista puesta.
  await elementoPorTexto(page, "Procesar 1").scrollIntoViewIfNeeded();
  const p1 = await elementoPorTexto(page, "Procesar 1").boundingBox();
  const p2 = await elementoPorTexto(page, "Validar Entrada").boundingBox();
  if (!p1 || !p2) throw new Error("No se pudo ubicar subprocesos para paralelo");
  await page.mouse.move(p1.x + p1.width / 2, p1.y + p1.height / 2);
  await page.mouse.down();
  await page.mouse.move(p1.x + p1.width / 2, p2.y + p2.height / 2, { steps: 8 });
  await page.mouse.up();
  // \s+ entre nodos inline del OPL renderizado (regex no normaliza whitespace),
  // mismo patrón que el assert de "consume" de arriba.
  await expect(page.getByText(/Procesar\s+se descompone en paralelo/).first()).toBeVisible();

  // El botón "Objeto" hoy crea directo en posición libre — FUERA del contorno
  // por diseño (posicionLibre → columnasFueraDe). Para crear DENTRO y verificar
  // el clamp se usa el modo sticky (Shift+clic) con clic posicionado.
  await elementoPorTexto(page, "Procesar").evaluate((el) => el.scrollIntoView({ block: "end", inline: "end" }));
  const contorno = await elementoPorTexto(page, "Procesar").boundingBox();
  if (!contorno) throw new Error("No se pudo ubicar contorno para creacion ambiental");
  await page.getByTestId("toolbar-drag-objeto").click({ modifiers: ["Shift"] });
  await expect(page.getByTestId("indicador-modo-canonico")).toContainText("Insertando objetos");
  // El contorno inzoom es una ELIPSE: la esquina del boundingBox queda fuera
  // del path. Punto dentro de la elipse cerca del borde inferior-derecho:
  // centro + 0.64·radio en ambos ejes (0.64² + 0.64² ≈ 0.82 < 1).
  await page.mouse.click(contorno.x + contorno.width * 0.82, contorno.y + contorno.height * 0.82);
  const modalNombre = page.getByTestId("modal-nombre-cosa");
  await expect(modalNombre).toBeVisible();
  await modalNombre.getByLabel("Nombre").fill("Objeto");
  await modalNombre.getByRole("button", { name: "OK" }).click();
  await expect(modalNombre).toHaveCount(0);
  // Salir del modo sticky con otro Shift+clic (Escape no lo desactiva); si
  // siguiera activo, el clic de selección crearía un "Objeto 2".
  await page.getByTestId("toolbar-drag-objeto").click({ modifiers: ["Shift"] });
  await expect(page.getByTestId("indicador-modo-canonico")).toHaveCount(0);
  await elementoPorTexto(page, "Objeto").click();
  // Codex v2 / L3 (C9): el toggle Ambiental/Sistémica vive en
  // SeccionEsenciaAfiliacion, sección Semántica de la ficha continua —
  // siempre montada, sin tab que activar.
  await page.getByRole("button", { name: "Ambiental" }).click();
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const procesar = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar");
  const entrada = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Entrada");
  const validado = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Validar Entrada");
  const ambiental = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  const opdHijoId = procesar?.refinamientos?.descomposicion?.opdId;
  if (!opdHijoId || !entrada || !validado || !ambiental) throw new Error("No se exporto modelo L3 esperado");
  const enlaceManual = Object.values(exportado.modelo.opds[opdHijoId]?.enlaces ?? {})
    .map((apariencia) => exportado.modelo.enlaces[apariencia.enlaceId])
    .find((enlace) => enlace?.tipo === "consumo");
  expect(enlaceManual).toEqual(expect.objectContaining({
    origenId: expect.objectContaining(extremoEntidad(entrada.id)),
    destinoId: expect.objectContaining(extremoEntidad(validado.id)),
    derivado: expect.objectContaining({ origen: "manual" }),
  }));
  const aparienciasHijo = Object.values(exportado.modelo.opds[opdHijoId]?.apariencias ?? {});
  const contornoExportado = aparienciasHijo.find((apariencia) => apariencia.entidadId === procesar.id);
  const ambientalExportado = aparienciasHijo.find((apariencia) => apariencia.entidadId === ambiental.id);
  if (!contornoExportado || !ambientalExportado) throw new Error("No se exporto ambiental interno");
  expect(ambiental.afiliacion).toBe("ambiental");
  expect(ambientalExportado.x + ambientalExportado.width).toBeLessThanOrEqual(contornoExportado.x + contornoExportado.width);
  expect(ambientalExportado.y + ambientalExportado.height).toBeLessThanOrEqual(contornoExportado.y + contornoExportado.height);

  await page.screenshot({ path: "test-results/opm-l3-descomposicion-avanzada.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

async function abrirRenombradoInline(page: Page, target: Locator): Promise<void> {
  const input = page.getByTestId("renombrado-inline");
  for (let intento = 0; intento < 3; intento += 1) {
    await expect(target).toBeVisible();
    const rect = await rectDeLocator(target);
    await page.mouse.dblclick(rect.x + rect.width / 2, rect.y + Math.min(14, rect.height / 3));
    await input.waitFor({ state: "visible", timeout: 1000 }).catch(() => undefined);
    if (await input.isVisible().catch(() => false)) return;
  }
  await expect(input).toBeVisible();
}

function modeloFanResultadoRefinable() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-fan-refinamiento",
      nombre: "Fan refinamiento",
      opdRaizId: "opd-1",
      nextSeq: 20,
      entidades: {
        "p-procesar": proceso("p-procesar", "Procesar"),
        "o-a": objeto("o-a", "Objeto"),
        "o-b": objeto("o-b", "Objeto_2"),
      },
      estados: {},
      enlaces: {
        "e-a": { id: "e-a", tipo: "resultado", origenId: { ...extremoEntidad("p-procesar"), portId: "port-fan-padre" }, destinoId: extremoEntidad("o-a"), etiqueta: "" },
        "e-b": { id: "e-b", tipo: "resultado", origenId: { ...extremoEntidad("p-procesar"), portId: "port-fan-padre" }, destinoId: extremoEntidad("o-b"), etiqueta: "" },
      },
      abanicos: {
        "ab-padre": {
          id: "ab-padre",
          opdId: "opd-1",
          puertoComun: { entidadId: "p-procesar", lado: "origen", portId: "port-fan-padre" },
          puertoEntidadId: "p-procesar",
          operador: "O",
          enlaceIds: ["e-a", "e-b"],
        },
      },
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-p": { id: "a-p", entidadId: "p-procesar", opdId: "opd-1", x: 260, y: 260, width: 135, height: 60, ports: { "port-fan-padre": { x: 1, y: 0.5 } } },
            "a-a": { id: "a-a", entidadId: "o-a", opdId: "opd-1", x: 40, y: 60, width: 135, height: 60 },
            "a-b": { id: "a-b", entidadId: "o-b", opdId: "opd-1", x: 520, y: 80, width: 135, height: 60 },
          },
          enlaces: {
            "ae-a": { id: "ae-a", enlaceId: "e-a", opdId: "opd-1", vertices: [] },
            "ae-b": { id: "ae-b", enlaceId: "e-b", opdId: "opd-1", vertices: [] },
          },
        },
      },
    },
  };
}

test("HU-10.021: desplegar objeto crea OPD hijo y entrada en árbol jerárquico", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const modalNombre = page.getByTestId("modal-nombre-cosa");
  if (await modalNombre.count()) {
    await modalNombre.getByLabel("Nombre").fill("Sistema desplegable");
    await modalNombre.getByRole("button", { name: "OK" }).click();
    await expect(modalNombre).toHaveCount(0);
  }
  await desplegarComoAgregacion(page);

  const arbol = page.getByRole("tree");
  await expect(arbol).toBeVisible();
  const items = arbol.getByRole("treeitem");
  expect(await items.count()).toBeGreaterThanOrEqual(2);

  expect(pageErrors).toEqual([]);
});
