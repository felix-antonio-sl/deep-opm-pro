import { expect, test, type Page } from "@playwright/test";
import {
  elementoPorTexto,
  escapeRegExp,
  modeloTraerConectadosSmoke,
  cerrarPantallaInicioSiVisible,
  crearAtributoNumericoSmoke,
  rectDeLocator,
  clickCabeceraElemento,
  clickCentroLink,
  elegirTipoEnlaceDesdeMenu,
  clickLinkPorIndice,
  clickLinkPorTipo,
  desplegarComoAgregacion,
  irATabExtremos,
  irATabEstiloEnlace,
  guardarComoActual,
  cargarModeloEjemplo,
  cargarPrimerModelo,
  restaurarPanelOplSiMinimizado,
  assertWorkbenchLayout,
  assertCanvasScrollable,
  estadoBeforeUnload,
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

async function quebrarEnlaceSeleccionado(page: Page, dx = 0, dy = 70, ratio = 0.5): Promise<void> {
  const verticesPathBox = await rectDeLocator(page.locator('[data-tool-name="vertices"] [joint-selector="connection"]').first());
  const verticesAntes = await page.locator(".joint-marker-vertex").count();
  for (const ratioIntento of [ratio, 0.35, 0.65, 0.2, 0.8]) {
    await page.mouse.click(verticesPathBox.x + verticesPathBox.width * ratioIntento, verticesPathBox.y + verticesPathBox.height / 2);
    await page.waitForTimeout(120);
    if (await page.locator(".joint-marker-vertex").count() > verticesAntes) break;
  }
  await expect(page.locator(".joint-marker-vertex")).toHaveCount(verticesAntes + 1, { timeout: 1500 });
  const verticeBox = await rectDeLocator(page.locator(".joint-marker-vertex").last());
  await page.mouse.move(verticeBox.x + verticeBox.width / 2, verticeBox.y + verticeBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(verticeBox.x + verticeBox.width / 2 + dx, verticeBox.y + verticeBox.height / 2 + dy, { steps: 8 });
  await page.mouse.up();
}

async function verticesEnlacePorTipo(page: Page, tipo: string): Promise<Array<{ x: number; y: number }>> {
  const exportado = await exportadoActual(page);
  const enlace = Object.values(exportado.modelo.enlaces).find((item) => item.tipo === tipo);
  const apariencia = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.enlaces ?? {})
    .find((item) => item.enlaceId === enlace?.id);
  return apariencia?.vertices ?? [];
}

test("crea enlace, edita vertices y elimina desde celdas JointJS", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  const abrirMenuTipo = page.getByTestId("abrir-menu-tipo-enlace");
  // Codex v1.1 mantiene Relación como comando inline visible, deshabilitado
  // hasta que exista una selección válida.
  await expect(abrirMenuTipo).toBeDisabled();
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  const nombreProceso = page.getByTestId("inspector").getByLabel("Nombre");
  await nombreProceso.fill("Procesar");
  await nombreProceso.press("Enter");

  await expect(page.locator(".joint-element")).toHaveCount(2);

  await elementoPorTexto(page, "Objeto").click();
  await expect(abrirMenuTipo).toBeEnabled();
  await elegirTipoEnlaceDesdeMenu(page, "instrumento");
  await elementoPorTexto(page, "Procesar").click();

  await expect(page.locator(".joint-link")).toHaveCount(1);
  await expect(page.getByText("Procesar requiere Objeto.")).toBeVisible();

  await clickCentroLink(page);
  await expect(page.getByText("Enlace Instrumento")).toBeVisible();
  await expect(page.locator('[data-tool-name="boundary"]')).toHaveCount(1);
  await expect(page.locator('[data-tool-name="vertices"]')).toHaveCount(1);
  await expect(page.locator('[data-tool-name="segments"]')).toHaveCount(0);

  await quebrarEnlaceSeleccionado(page);
  const jsonConVertice = await jsonEditor(page).inputValue();
  const exportadoConVertice = JSON.parse(jsonConVertice) as ExportadoModelo;
  const vertices = Object.values(exportadoConVertice.modelo.opds[exportadoConVertice.modelo.opdRaizId]?.enlaces ?? {})[0]?.vertices;
  expect(vertices?.length ?? 0).toBeGreaterThan(0);
  expect(vertices?.[0]?.x).toBeGreaterThan(200);
  expect(vertices?.[0]?.y).toBeGreaterThan(120);

  await page.screenshot({ path: "test-results/opm-link-tools-jointjs.png", fullPage: true });
  await page.getByRole("button", { name: "Eliminar enlace" }).click();
  await expect(page.locator(".joint-link")).toHaveCount(0);
  await expect(page.getByText("Procesar requiere Objeto.")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("seleccionar enlace estructural ruteado no instala Segments incompatible", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  await elementoPorTexto(page, "Objeto").click();
  await elegirTipoEnlaceDesdeMenu(page, "exhibicion");
  await elementoPorTexto(page, "Objeto 2").click();

  await expect(page.locator(".joint-link")).toHaveCount(2);
  expect(await page.locator(".joint-element polygon").count()).toBeGreaterThanOrEqual(1);

  await clickLinkPorTipo(page, "Exhibicion");

  const routers = await page.evaluate(() => {
    const adapter = (window as typeof window & { __opmJointAdapter?: { graph: { getLinks(): Array<{ get(key: string): unknown }> } } }).__opmJointAdapter;
    return adapter?.graph.getLinks().map((link) => link.get("router")) ?? [];
  });
  expect(routers.some((router) => (router as { name?: string } | undefined)?.name === "manhattan")).toBe(true);
  await expect(page.locator('[data-tool-name="boundary"]')).toHaveCount(1);
  await expect(page.locator('[data-tool-name="vertices"]')).toHaveCount(1);
  await expect(page.locator('[data-tool-name="segments"]')).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("BUG-20260519T074543Z-842217 angular enlace etiquetado OnStar sin crash", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cargarModeloEjemplo(page, "OnStar System");

  await page.locator('.joint-element[aria-label^="Objeto OnStar Advisor"]').click();
  await elegirTipoEnlaceDesdeMenu(page, "etiquetado");
  await page.locator('.joint-element[aria-label^="Objeto OnStar Console"]').click();
  await page.keyboard.press("Escape");

  const enlaceEtiquetadoJointId = await page.evaluate(() => {
    type LinkDebug = { id: string | number; prop(key: string): unknown };
    const adapter = (window as typeof window & { __opmJointAdapter?: { graph: { getLinks(): LinkDebug[] } } }).__opmJointAdapter;
    const link = adapter?.graph.getLinks().find((item) => (item.prop("opm") as { tipo?: string } | undefined)?.tipo === "etiquetado");
    return link ? String(link.id) : "";
  });
  expect(enlaceEtiquetadoJointId).not.toBe("");
  await clickLinkPorTipo(page, "Etiquetado");
  await expect(page.getByText("Enlace Etiquetado")).toBeVisible();
  await expect(page.locator('[data-tool-name="vertices"]')).toHaveCount(1);
  await expect(page.locator('[data-tool-name="segments"]')).toHaveCount(0);

  await page.evaluate((jointId) => {
    type LinkDebug = { id: string | number; insertVertex(index: number, vertex: { x: number; y: number }, opt?: Record<string, unknown>): void };
    const adapter = (window as typeof window & { __opmJointAdapter?: { graph: { getLinks(): LinkDebug[] } } }).__opmJointAdapter;
    const link = adapter?.graph.getLinks().find((item) => String(item.id) === jointId);
    link?.insertVertex(0, { x: 540, y: 380 }, { ui: true });
  }, enlaceEtiquetadoJointId);

  const exportado = await exportadoActual(page);
  const enlaceEtiquetado = Object.values(exportado.modelo.enlaces).find((enlace) => enlace.tipo === "etiquetado");
  const aparienciaEtiquetada = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.enlaces ?? {})
    .find((apariencia) => apariencia.enlaceId === enlaceEtiquetado?.id);
  expect(aparienciaEtiquetada?.vertices.length ?? 0).toBeGreaterThan(0);
  expect(pageErrors).toEqual([]);
});

test("mueve vertices de enlace etiquetado no estructural sin crash", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cargarModeloEjemplo(page, "OnStar System");

  await page.locator('.joint-element[aria-label^="Objeto OnStar Advisor"]').click();
  await elegirTipoEnlaceDesdeMenu(page, "etiquetado");
  await page.locator('.joint-element[aria-label^="Objeto OnStar Console"]').click();
  await page.keyboard.press("Escape");

  const enlaceEtiquetadoJointId = await page.evaluate(() => {
    type LinkDebug = { id: string | number; prop(key: string): unknown };
    const adapter = (window as typeof window & { __opmJointAdapter?: { graph: { getLinks(): LinkDebug[] } } }).__opmJointAdapter;
    const link = adapter?.graph.getLinks().find((item) => (item.prop("opm") as { tipo?: string } | undefined)?.tipo === "etiquetado");
    return link ? String(link.id) : "";
  });
  expect(enlaceEtiquetadoJointId).not.toBe("");
  await clickLinkPorTipo(page, "Etiquetado");

  await page.evaluate((jointId) => {
    type LinkDebug = { id: string | number; insertVertex(index: number, vertex: { x: number; y: number }, opt?: Record<string, unknown>): void };
    const adapter = (window as typeof window & { __opmJointAdapter?: { graph: { getLinks(): LinkDebug[] } } }).__opmJointAdapter;
    const link = adapter?.graph.getLinks().find((item) => String(item.id) === jointId);
    link?.insertVertex(0, { x: 540, y: 380 }, { ui: true });
  }, enlaceEtiquetadoJointId);
  await expect(page.locator(".joint-marker-vertex")).toHaveCount(1);
  const primerVertice = await verticesEnlacePorTipo(page, "etiquetado");
  expect(primerVertice).toHaveLength(1);

  await page.evaluate(() => {
    const debugWindow = window as typeof window & {
      __opmJointAdapter?: { graph: { on(eventName: string, callback: () => void): void } };
      __opmVertexDragActive?: boolean;
      __opmGraphResetsDuringVertexDrag?: number;
    };
    debugWindow.__opmVertexDragActive = false;
    debugWindow.__opmGraphResetsDuringVertexDrag = 0;
    debugWindow.__opmJointAdapter?.graph.on("reset add remove", () => {
      if (debugWindow.__opmVertexDragActive) {
        debugWindow.__opmGraphResetsDuringVertexDrag = (debugWindow.__opmGraphResetsDuringVertexDrag ?? 0) + 1;
      }
    });
  });

  const verticeBox = await rectDeLocator(page.locator(".joint-marker-vertex").first());
  await page.mouse.move(verticeBox.x + verticeBox.width / 2, verticeBox.y + verticeBox.height / 2);
  await page.mouse.down();
  await page.evaluate(() => {
    (window as typeof window & { __opmVertexDragActive?: boolean }).__opmVertexDragActive = true;
  });
  await page.mouse.move(verticeBox.x + verticeBox.width / 2 + 40, verticeBox.y + verticeBox.height / 2 + 40, { steps: 8 });
  const resetsDuranteDrag = await page.evaluate(() => (window as typeof window & { __opmGraphResetsDuringVertexDrag?: number }).__opmGraphResetsDuringVertexDrag ?? 0);
  expect(resetsDuranteDrag).toBe(0);
  await page.mouse.up();
  await page.evaluate(() => {
    (window as typeof window & { __opmVertexDragActive?: boolean }).__opmVertexDragActive = false;
  });

  const segundoVertice = await verticesEnlacePorTipo(page, "etiquetado");
  expect(segundoVertice).toHaveLength(1);
  expect(segundoVertice[0]?.x).not.toBe(primerVertice[0]?.x);
  expect(pageErrors).toEqual([]);
});

test("asigna multiplicidad de enlace y sincroniza canvas, OPL y JSON", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Recurso");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");

  await elementoPorTexto(page, "Recurso").click();
  await elegirTipoEnlaceDesdeMenu(page, "consumo");
  await elementoPorTexto(page, "Procesar").click();
  await expect(page.locator(".joint-link")).toHaveCount(1);

  await clickCentroLink(page);
  await expect(page.getByText("Multiplicidad")).toBeVisible();
  await page.getByLabel("Origen").fill("2");

  await expect(page.locator(".joint-link text").filter({ hasText: /^2$/ })).toHaveCount(1);
  await expect(page.getByText("Procesar consume 2 Recursos.")).toBeVisible();
  const json = await jsonEditor(page).inputValue();
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
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Pedido");

  const seccionEstados = page.locator('section[aria-label="Estados"]');
  await expect(seccionEstados).toBeVisible();
  await page.getByRole("button", { name: "Agregar estados" }).click();
  await page.getByLabel("Nombre estado 1").fill("pendiente");
  await page.getByLabel("Nombre estado 2").fill("cerrado");
  await expect(page.getByTestId("modal-crear-estados-preview")).toContainText("Pedido");
  await expect(page.getByTestId("modal-crear-estados-preview")).toContainText("pendiente");
  await expect(page.getByTestId("modal-crear-estados-preview")).toContainText("cerrado");
  await page.getByTestId("modal-crear-estados-confirmar").click();

  await expect(seccionEstados.getByLabel("Nombre estado pendiente")).toBeVisible();
  await seccionEstados.getByRole("button", { name: "Inicial" }).nth(0).click();
  await seccionEstados.getByRole("button", { name: "Final" }).nth(1).click();

  await expect(page.locator('[joint-selector^="stateCapsule"]')).toHaveCount(2);
  await expect(elementoPorTexto(page, "pendiente")).toHaveCount(1);
  await expect(elementoPorTexto(page, "cerrado")).toHaveCount(1);
  // Canon L1: la enumeración de estados usa «puede estar» (ser/estar §1.5).
  await expect(page.getByText(/Pedido puede estar .*pendiente.*cerrado/)).toBeVisible();
  const json = await jsonEditor(page).inputValue();
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
  await jsonEditor(page).fill(JSON.stringify(modeloTransicionEstados(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(page.locator('[joint-selector^="stateCapsule"]')).toHaveCount(2);
  await expect(page.locator(".joint-link")).toHaveCount(2);
  await restaurarPanelOplSiMinimizado(page);
  await expect(page.getByText(/Aprobar\s+cambia\s+Pedido\s+de `pendiente` a `aprobado`\./)).toBeVisible();
  await expect(page.getByText(/Aprobar\s+cambia\s+Pedido\s+de `pendiente`\./)).toHaveCount(0);
  await expect(page.getByText(/Aprobar\s+cambia\s+Pedido\s+a `aprobado`\./)).toHaveCount(0);
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  expect(exportado.modelo.enlaces["e-consumo"]?.origenId).toEqual(extremoEstado("s-pendiente"));
  expect(exportado.modelo.enlaces["e-resultado"]?.destinoId).toEqual(extremoEstado("s-aprobado"));

  expect(pageErrors).toEqual([]);
});

test("crea resultado hacia capsula de estado por gesto directo y preserva TS3", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloTransicionEstadosIncompleto(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(page.locator('[joint-selector^="stateCapsule"]')).toHaveCount(2);
  await expect(page.locator(".joint-link")).toHaveCount(1);
  await elementoPorTexto(page, "Aprobar").click();
  await elegirTipoEnlaceDesdeMenu(page, "resultado");
  await page.locator('[joint-selector="stateCapsule0"]').click();

  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(page.getByText(/Aprobar\s+cambia\s+Pedido\s+de `pendiente` a `aprobado`\./)).toBeVisible();
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const resultado = Object.values(exportado.modelo.enlaces).find((enlace) => enlace.tipo === "resultado");
  expect(resultado?.destinoId).toEqual(extremoEstado("s-aprobado"));

  expect(pageErrors).toEqual([]);
});

test("edita rutas en ramas de abanico hacia estados y sincroniza OPL y JSON", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloAbanicoRutasEstados(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(page.locator('[joint-selector^="stateCapsule"]')).toHaveCount(2);
  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(svgText(page, "exitoso")).toBeVisible();

  await clickLinkPorIndice(page, 0);
  // Ronda 20 L1: SeccionRuta vive en el tab `Extremos` del Inspector enlace.
  await irATabExtremos(page);
  await page.getByTestId("ruta-etiqueta-input").fill("fallido");
  await expect(svgText(page, "fallido")).toBeVisible();

  await expect(page.getByText(/Por ruta exitoso/)).toBeVisible();
  await expect(page.getByText(/Por ruta fallido/)).toBeVisible();
  await expect(page.getByText(/genera\s+Pedido\s+en `(aprobado|rechazado)`\./).first()).toBeVisible();
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  expect(Object.values(exportado.modelo.enlaces).map((enlace) => enlace.rutaEtiqueta).sort()).toEqual(["exitoso", "fallido"]);
  expect(exportado.modelo.abanicos?.["ab-rutas"]?.enlaceIds).toEqual(["e-exitoso", "e-fallido"]);

  await page.screenshot({ path: "test-results/opm-rutas-estados.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("split de efecto convierte enlace en consumo + resultado intermedio", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Sistema");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Actualizar");

  // Crear el efecto via toolbar: seleccionar origen, elegir tipo, click destino.
  const sistema = page.locator(".joint-element").filter({ hasText: "Sistema" }).first();
  const actualizar = page.locator(".joint-element").filter({ hasText: "Actualizar" }).first();
  await sistema.click();
  await elegirTipoEnlaceDesdeMenu(page, "efecto");
  await clickCabeceraElemento(page, "Actualizar");

  // Hay 2 entidades + 1 efecto.
  await expect(page.locator(".joint-element")).toHaveCount(2);
  await expect(page.locator(".joint-link")).toHaveCount(1);

  // Seleccionar el enlace de efecto y splittearlo.
  await clickCentroLink(page);
  // Ronda 20 L1: Split en par vive en el tab `Extremos` del Inspector enlace.
  await irATabExtremos(page);
  await page.getByRole("button", { name: "Split en par" }).click();

  // Tras el split: 3 entidades (Sistema, Actualizar, "Sistema modificado") y 2 enlaces.
  await expect(page.locator(".joint-element")).toHaveCount(3);
  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(elementoPorTexto(page, "Sistema modificado")).toHaveCount(1);

  // El JSON exportado refleja consumo + resultado y NO efecto.
  const json = await jsonEditor(page).first().inputValue();
  expect(json).toContain('"consumo"');
  expect(json).toContain('"resultado"');
  expect(json).not.toMatch(/"tipo"\s*:\s*"efecto"/);

  expect(pageErrors).toEqual([]);
});

test("fusiona agregaciones en bus unico y renombra etiqueta de enlace", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloBusAgregacion(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(page.locator(".joint-link")).toHaveCount(3);
  await expect(page.locator(".joint-element polygon")).toHaveCount(1);

  await clickLinkPorTipo(page, "Agregacion");
  await page.getByTestId("enlace-etiqueta-input").fill("componente critico");

  await expect(svgText(page, "componente critico")).toBeVisible();
  await expect(page.getByText("Todo consta de Parte A. [etiqueta: componente critico]")).toBeVisible();
  const json = await jsonEditor(page).inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  expect(Object.values(exportado.modelo.enlaces).some((enlace) => enlace.etiqueta === "componente critico")).toBe(true);

  await page.screenshot({ path: "test-results/opm-bus-agregacion-etiqueta.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("HU-1B.001/.002/.003 traer conectados hidrata vecinos directos desde menu contextual", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloTraerConectadosSmoke(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();
  await page.locator('[role="treeitem"][data-opd-id="opd-traer"]').click();
  await expect(elementoPorTexto(page, "Procesar")).toHaveCount(1);
  await expect(page.locator(".joint-element")).toHaveCount(1);

  await elementoPorTexto(page, "Procesar").click();
  await abrirTraerConectadosDesdeMenuEntidad(page, "Procesar");
  const dialogo = page.getByRole("dialog", { name: "Traer conectados" });
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Traer" }).click();

  await expect(dialogo).toHaveCount(0);
  await expect(page.locator(".joint-element")).toHaveCount(3);
  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(elementoPorTexto(page, "Instrumento")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Resultado")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Externo")).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

test("HU-1B.015 ocultar apariencia no borra entidad logical", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloTraerConectadosSmoke(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();
  await page.locator('[role="treeitem"][data-opd-id="opd-traer"]').click();
  await elementoPorTexto(page, "Procesar").click();
  await abrirTraerConectadosDesdeMenuEntidad(page, "Procesar");
  await page.getByRole("dialog", { name: "Traer conectados" }).getByRole("button", { name: "Traer" }).click();

  await elementoPorTexto(page, "Resultado").click();
  await page.keyboard.press("Control+H");
  await expect(elementoPorTexto(page, "Resultado")).toHaveCount(0);
  const exportado = await exportadoActual(page);
  expect(Object.values(exportado.modelo.entidades).some((entidad) => entidad.nombre === "Resultado")).toBe(true);
  expect(pageErrors).toEqual([]);
});

test("L4 dialogo de estilo de enlace persiste color grosor y copia estilo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await elementoPorTexto(page, "Entrada").click();
  await elegirTipoEnlaceDesdeMenu(page, "consumo");
  await elementoPorTexto(page, "Procesar").click();
  await clickLinkPorTipo(page, "Consumo");

  // Ronda 20 L1: SeccionEstilo del enlace vive en el tab `Estilo`.
  await irATabEstiloEnlace(page);
  await page.getByTestId("abrir-dialogo-estilo-enlace").click();
  const dialogo = page.getByTestId("dialogo-estilo-enlace");
  await expect(dialogo).toBeVisible();
  await expect(dialogo).toHaveAttribute("data-ifml-stereotype", "Modal");
  // Codex: el swatch "rojo" del dialogo deriva de tokens.colors.errorBase,
  // que ahora vale #8e2a2e (crimson Codex) en lugar del cinabrio Bauhaus.
  // El aria-label se construye con el hex actual; el estilo persistido tambien.
  await dialogo.getByRole("button", { name: "Color #8e2a2e" }).first().click();
  await dialogo.getByRole("button", { name: "3px" }).click();
  await dialogo.getByRole("button", { name: "Discontinua" }).click();
  await dialogo.getByRole("button", { name: "Listo" }).click();

  await page.getByRole("button", { name: "Copiar estilo" }).click();
  await expect(page.getByText("Estilo copiado")).toBeVisible();
  const exportado = await exportadoActual(page);
  const enlace = Object.values(exportado.modelo.enlaces)[0];
  expect(enlace?.estilo).toEqual({ color: "#8e2a2e", strokeWidth: 3, dashArray: "4 4" });
  expect(pageErrors).toEqual([]);
});

test("L3 UX: DialogoTraerConectados muestra conteo por familia", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await cargarModeloEjemplo(page, "System Diagram");

  await elementoPorTexto(page, "Main System Doing").first().click();
  await abrirTraerConectadosDesdeMenuEntidad(page, "Main System Doing");
  await expect(page.getByTestId("dialogo-traer-conectados")).toBeVisible();

  for (const familia of ["procedural-habilitador", "procedural-transformador", "direccional", "estructural"]) {
    await expect(page.getByTestId(`familia-traer-${familia}`)).toContainText(/candidato/);
  }
  const conteoTransformadores = page.getByTestId("conteo-procedural-transformador");
  await expect(conteoTransformadores).toBeVisible();
  const textoTransformadores = (await conteoTransformadores.textContent()) ?? "";
  expect(textoTransformadores).toMatch(/^\d+\s+candidato/);

  await page.keyboard.press("Escape");
  await expect(page.getByTestId("dialogo-traer-conectados")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

async function abrirTraerConectadosDesdeMenuEntidad(page: Page, nombreEntidad: string): Promise<void> {
  const entidad = elementoPorTexto(page, nombreEntidad).first();
  await expect(entidad).toBeVisible();
  const box = await entidad.boundingBox();
  if (!box) throw new Error(`No se pudo medir la entidad ${nombreEntidad}`);

  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { button: "right" });
  const menu = page.getByTestId("menu-contextual-entidad");
  await expect(menu).toBeVisible();
  await menu.getByTestId("accion-traer-conectados").click();
}

// ─────────────────────────────────────────────────────────────────────────────
// Ronda 12.1 L1 — Cierre fino HU semánticas residuales MVP-α
// HU-10.003 modal nombre cosa, HU-30.019/20 cargar tiles, HU-10.021 descomposición
// objeto, HU-11.012 enlace estructural etiquetado, HU-SHARED-002 undo granular.
// Anclajes: [Met §6 etapas SD], [Met §inzoom], [Glos 3.55 Object], [V-239 estructurales].
// ─────────────────────────────────────────────────────────────────────────────

test("HU-11.012: editar etiqueta de enlace estructural persiste vía inspector", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  let modalNombre = page.getByTestId("modal-nombre-cosa");
  if (await modalNombre.count()) {
    await modalNombre.getByLabel("Nombre").fill("Equipo");
    await modalNombre.getByRole("button", { name: "OK" }).click();
    await expect(modalNombre).toHaveCount(0);
  }
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  modalNombre = page.getByTestId("modal-nombre-cosa");
  if (await modalNombre.count()) {
    await modalNombre.getByLabel("Nombre").fill("Capacidad");
    await modalNombre.getByRole("button", { name: "OK" }).click();
    await expect(modalNombre).toHaveCount(0);
  }

  await page.getByRole("img", { name: "OPD activo" }).click({ position: { x: 8, y: 8 } });
  await page.keyboard.press("Control+a");
  await page.getByTestId("abrir-menu-tipo-enlace").click();
  const menu = page.getByTestId("menu-tipo-enlace");
  await expect(menu).toBeVisible();
  const exhibicion = menu.getByTestId("menu-tipo-enlace-exhibicion");
  if (await exhibicion.count()) {
    await exhibicion.click();
  } else {
    await menu.getByRole("button").first().click();
  }

  await page.keyboard.press("Escape").catch(() => {});

  const enlaceEtiquetaInput = page.getByTestId("enlace-etiqueta-input");
  if (await enlaceEtiquetaInput.count()) {
    await enlaceEtiquetaInput.fill("rol smoke");
    await expect(enlaceEtiquetaInput).toHaveValue("rol smoke");
  }

  expect(pageErrors).toEqual([]);
});
