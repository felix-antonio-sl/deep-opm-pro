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
  irATabRefinamiento,
  guardarComoActual,
  cargarPrimerModelo,
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
  modeloEjemploOrganizacionalSmoke,
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

test("renderiza todos los markers canonicos de enlaces", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloMarkersCanonicos(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(page.locator(".joint-link")).toHaveCount(14);
  // Exhibicion = 2 poligonos (outer contorno + inner relleno); antes eran 3.
  await expect(page.locator(".joint-element")).toHaveCount(26);
  await page.screenshot({ path: "test-results/opm-markers-canonicos.png", fullPage: true });

  expect(pageErrors).toEqual([]);
});

test("renderiza abanicos O/XOR con conectores canonicos sin texto de marcador", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloAbanicoLogico(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(page.locator(".joint-element path[joint-selector=body]")).toHaveCount(1);
  await expect(svgText(page, "O")).toHaveCount(0);
  await expect(svgText(page, "XOR")).toHaveCount(0);

  await clickLinkPorTipo(page, "Consumo");
  await expect(page.getByText("Abanico O")).toBeVisible();
  await page.getByTestId("abanico-toggle-XOR").click();
  await expect(page.getByText("Operador actualizado a XOR")).toBeVisible();
  // XOR ahora tambien es un arco SVG (un solo trazo, sin segundo concentrico).
  await expect(page.locator(".joint-element path[joint-selector=body]")).toHaveCount(1);
  await expect(svgText(page, "O")).toHaveCount(0);
  await expect(svgText(page, "XOR")).toHaveCount(0);

  await page.screenshot({ path: "test-results/opm-abanico-logico-canonico.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("renderiza modificadores evento/condicion y demora de invocacion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloModificadoresEnlace(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(page.locator(".joint-link")).toHaveCount(3);
  // SSOT §4.1/§4.2: marcas canonicas `c`/`e` MINUSCULAS para condicion/evento.
  await expect(svgText(page, "e")).toBeVisible();
  await expect(svgText(page, "70%")).toBeVisible();
  await expect(svgText(page, "c")).toBeVisible();
  await expect(svgText(page, "1s")).toBeVisible();
  await expect(page.getByText("Orden inicia Aprobar, que consume Orden (probabilidad: 70%).")).toBeVisible();
  await expect(page.getByText("Aprobar invoca Validar despues de 1s.")).toBeVisible();

  await page.screenshot({ path: "test-results/opm-modificadores-enlace.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("aplica subtipo NO desde inspector y emite badge negado", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloNoModificador(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await clickLinkPorTipo(page, "Consumo");
  await page.getByTestId("modificador-enlace-select").selectOption("no");

  await expect(svgText(page, "¬")).toBeVisible();
  await expect(page.getByText("Aprobar no consume Orden.")).toBeVisible();
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const enlace = Object.values(exportado.modelo.enlaces)[0];
  expect(enlace?.modificador).toBe("no");
  expect(enlace?.subtipoModificador).toBe("no");
  expect(pageErrors).toEqual([]);
});

test("mover puerto desde dialogo cambia extremo destino del enlace", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloMoverPuerto(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await clickLinkPorTipo(page, "Consumo");
  // Ronda 20 L1: SeccionExtremos vive en tab `Extremos` del Inspector enlace.
  await irATabExtremos(page);
  await page.getByTestId("mover-puerto-btn").click();
  const dialogo = page.getByRole("dialog", { name: "Mover Puerto" });
  await expect(dialogo).toBeVisible();
  await dialogo.getByTestId("mover-puerto-extremo-select").selectOption("entidad:p-validar");
  await page.getByRole("dialog", { name: "Mover Puerto" }).getByRole("button", { name: "Mover", exact: true }).click();

  await expect(page.getByText("Puerto movido")).toBeVisible();
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  expect(Object.values(exportado.modelo.enlaces)[0]?.destinoId).toEqual({ kind: "entidad", id: "p-validar" });
  expect(pageErrors).toEqual([]);
});

test("dos consumos al mismo objeto emiten advertencia", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloConsumoDuplicado(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  const diagnostico = page.getByTestId("panel-diagnostico");
  await page.getByTestId("panel-diagnostico-toggle").click();
  await expect(diagnostico).toContainText("consumo-doble-mismo-objeto");
  await expect(diagnostico).toContainText("Procesar consume Entrada más de una vez");
  expect(pageErrors).toEqual([]);
});

test("crea auto-invocacion desde Inspector con demora default", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  // Ronda 20 L1: Auto-invocación vive en el tab `Refinamiento` del Inspector.
  await irATabRefinamiento(page);
  await expect(page.getByRole("button", { name: "Auto-invocación" })).toBeVisible();

  await page.getByRole("button", { name: "Auto-invocación" }).click();

  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(svgText(page, "1s")).toBeVisible();
  await expect(page.getByText("Proceso se invoca a sí mismo despues de 1s.")).toBeVisible();
  const json = await jsonEditor(page).inputValue();
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

test("arrastra una cosa JointJS y persiste su apariencia", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Proceso", exact: true }).click();

  await expect(page.locator(".joint-element")).toHaveCount(2);

  const objectBox = await elementoPorTexto(page, "Objeto").boundingBox();
  if (!objectBox) throw new Error("No se pudo ubicar la celda de objeto para drag");
  await page.mouse.move(objectBox.x + objectBox.width / 2, objectBox.y + objectBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(objectBox.x + objectBox.width / 2 + 120, objectBox.y + objectBox.height / 2 + 70, { steps: 8 });
  await page.mouse.up();
  const jsonDespuesDeDrag = await jsonEditor(page).inputValue();
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

test("barra flotante aparece anclada a la cosa seleccionada con acciones piloto", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await elementoPorTexto(page, "Objeto").click();

  const barra = page.getByTestId("barra-herramientas-elemento");
  await expect(barra).toBeVisible();
  // BUG-d78ae2: copiar/pegar-estilo solo aparecen si hay enlace operable.
  // En este punto la entidad recien creada no tiene enlaces visibles.
  await expect(page.getByTestId("barra-copiar-estilo")).toHaveCount(0);
  await expect(page.getByTestId("barra-pegar-estilo")).toHaveCount(0);
  await expect(page.getByTestId("barra-agregar-estado")).toBeVisible();
  await expect(page.getByTestId("barra-inzoom")).toBeVisible();
  await expect(page.getByTestId("barra-unfold")).toBeVisible();
  await expect(page.getByTestId("barra-editar-alias")).toBeVisible();
  await expect(page.getByTestId("barra-editar-imagen")).toBeVisible();
  await expect(page.getByTestId("barra-mas-opciones")).toBeVisible();

  const objetoBox = await elementoPorTexto(page, "Objeto").boundingBox();
  const barraBox = await barra.boundingBox();
  if (!objetoBox || !barraBox) throw new Error("No se pudo medir anchor de barra");
  expect(barraBox.y).toBeLessThan(objetoBox.y + objetoBox.height + 8);
  expect(pageErrors).toEqual([]);
});

test("boton mas opciones colapsa y reabre el Inspector lateral", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await elementoPorTexto(page, "Objeto").click();

  await expect(page.getByTestId("inspector-pane")).toBeVisible();
  await page.getByTestId("barra-mas-opciones").click();
  await expect(page.getByTestId("inspector-pane")).toBeHidden();
  await page.getByTestId("barra-mas-opciones").click();
  await expect(page.getByTestId("inspector-pane")).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("editar imagen desde barra abre ModalImagenObjeto para objeto seleccionado", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await elementoPorTexto(page, "Objeto").click();
  await page.getByTestId("barra-editar-imagen").click();

  await expect(page.getByRole("dialog", { name: "Imagen de Objeto" })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("arrastra subproceso embebido dentro del macroproceso contenedor", async ({ page }) => {
  // Regresion: rect de restrictTranslate restaba cellBBox.width/height adicional al
  // que JointJS ya descuenta internamente (Element.mjs:130-131); el doble descuento
  // dejaba a los subprocesos sin juego horizontal/vertical y los anclaba al centro.
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  // Ronda 20 L1: Descomponer vive en el tab `Refinamiento` del Inspector.
  await irATabRefinamiento(page);
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
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  // Regla de unicidad global (e5a0613): el segundo objeto auto-suffix a Objeto_2.
  const objetos = page.locator(".joint-element").filter({
    has: page.locator("text").filter({ hasText: /^\s*Objeto(_\d+)?\s*$/ }),
  });
  await expect(objetos).toHaveCount(2);
  await objetos.nth(0).click();
  await elegirTipoEnlaceDesdeMenu(page, "agregacion");
  await objetos.nth(1).click();

  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(page.locator(".joint-element polygon")).toHaveCount(1);
  await page.locator(".joint-element polygon").click();
  await expect(page.getByText("Enlace Agregacion")).toBeVisible();
  await expect(page.locator('[data-tool-name="vertices"]')).toHaveCount(0);
  await expect(page.locator('[data-tool-name="segments"]')).toHaveCount(0);
  await page.getByTestId("tipo-grupo-estructural").selectOption("exhibicion");
  await page.getByTestId("orden-grupo-estructural").check();
  await expect(page.getByText("Enlace Exhibicion")).toBeVisible();

  const triangulo = page.locator(".joint-element polygon").first();
  const box = await triangulo.boundingBox();
  if (!box) throw new Error("No se pudo ubicar triangulo estructural");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 52, box.y + box.height / 2 + 44, { steps: 8 });
  await page.mouse.up();

  const exportado = await exportadoActual(page);
  const aparienciaEnlace = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.enlaces ?? {})[0];
  const enlace = Object.values(exportado.modelo.enlaces)[0];
  const refinable = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  expect(enlace?.tipo).toBe("exhibicion");
  expect(refinable?.orderedFundamentalTypes).toEqual(["exhibicion"]);
  expect(aparienciaEnlace?.symbolPos).toBeDefined();
  expect(aparienciaEnlace?.symbolPos?.x).toBeGreaterThan(0);
  expect(aparienciaEnlace?.symbolPos?.y).toBeGreaterThan(0);
  await page.screenshot({ path: "test-results/opm-agregacion-triangulo.png", fullPage: true });

  expect(pageErrors).toEqual([]);
});

test("HU-17.013/.015/.016 crea atributo numérico desde Toolbar y emite OPL canónica", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await crearAtributoNumericoSmoke(page);

  await expect(page.getByText("Temperatura es valor [°C].")).toBeVisible();
  await expect(svgText(page, "Temperatura [°C]")).toBeVisible();
  const exportado = await exportadoActual(page);
  const atributo = Object.values(exportado.modelo.entidades).find((item) => item.nombre === "Temperatura");
  expect(atributo).toMatchObject({
    unidad: "°C",
    esAtributo: true,
    valorSlot: { tipo: "float", placeholder: "value" },
  });
  expect(Object.values(exportado.modelo.enlaces).some((enlace) => enlace.tipo === "exhibicion")).toBe(true);
  expect(pageErrors).toEqual([]);
});

test("HU-17.012 renderiza sintaxis compuesta Nombre [Unidad] {alias}", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await crearAtributoNumericoSmoke(page);
  await page.getByPlaceholder("{alias}").fill("T");

  await expect(elementoPorTexto(page, "Temperatura [°C] {T}")).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});

test("HU-17.017 asigna valor concreto y reemplaza placeholder en OPL", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await crearAtributoNumericoSmoke(page);
  await page.getByTestId("atributo-valor-input").fill("25");
  await page.getByTestId("atributo-valor-input").blur();

  await expect(page.getByText("Temperatura es 25 [°C].")).toBeVisible();
  const exportado = await exportadoActual(page);
  const atributo = Object.values(exportado.modelo.entidades).find((item) => item.nombre === "Temperatura");
  expect(atributo?.valorSlot?.valor).toBe(25);
  expect(pageErrors).toEqual([]);
});

test("L1 toolbar split conserva root y controles por modo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await expect(page.getByTestId("toolbar-root")).toBeVisible();
  for (const cluster of ["Modelo", "Modelar", "Conectar", "Ayuda"]) {
    await expect(page.getByRole("group", { name: cluster })).toBeVisible();
  }
  await expect(page.locator('[data-slot="cluster-modelo"]')).toBeVisible();
  await expect(page.locator('[data-slot="cluster-modelar"]')).toBeVisible();
  await expect(page.locator('[data-slot="cluster-conectar"]')).toBeVisible();
  await expect(page.locator('[data-slot="cluster-vista"]')).toHaveCount(0);
  await expect(page.locator('[data-slot="cluster-validar"]')).toHaveCount(0);
  await expect(page.locator('[data-slot="cluster-ayuda"]')).toBeVisible();
  await expect(page.getByRole("group", { name: "Modelar" }).getByRole("button", { name: "Objeto", exact: true })).toBeVisible();
  await expect(page.getByRole("group", { name: "Conectar" }).getByTestId("abrir-menu-tipo-enlace")).toBeDisabled();
  await expect(page.getByRole("group", { name: "Ayuda" }).getByTestId("toolbar-mas-trigger")).toBeVisible();
  await page.getByTestId("toolbar-mas-trigger").click();
  await expect(page.getByTestId("toolbar-mas-toggle-grid")).toBeVisible();
  await expect(page.getByTestId("toolbar-mas-config-grid")).toBeVisible();
  await expect(page.getByTestId("toolbar-mas-auto-layout")).toBeVisible();
  await expect(page.getByTestId("toolbar-mas-biblioteca-dock")).toBeVisible();
  await expect(page.getByTestId("toolbar-mas-mapa")).toBeVisible();
  await expect(page.getByTestId("toolbar-mas-simulacion")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("abrir-menu-tipo-enlace")).toBeDisabled();

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const modal = page.getByTestId("modal-nombre-cosa");
  if (await modal.count()) {
    await modal.getByLabel("Nombre").fill("Objeto L1");
    await modal.getByRole("button", { name: "OK" }).click();
    await expect(modal).toHaveCount(0);
  }

  await expect(page.getByTestId("barra-herramientas-elemento")).toBeVisible();
  await page.getByTestId("toolbar-mas-trigger").click();
  await expect(page.getByTestId("toolbar-mas-plantillas")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("abrir-menu-tipo-enlace")).toBeEnabled();

  await page.getByTestId("toolbar-modo-creacion-objeto").click();
  // P1 sticky ronda 4: badge canonico unifica "Modo sticky: X" + estado enlace.
  await expect(page.getByTestId("indicador-modo-canonico")).toContainText("Insertando objetos · Esc para salir");

  expect(pageErrors).toEqual([]);
});
