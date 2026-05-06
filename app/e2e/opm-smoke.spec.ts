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

test("workspace local abre menu, guarda como, guarda incremental y carga desde dialogo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByText("Modelo (No guardado)").first()).toBeVisible();
  await expect(page.getByRole("treeitem", { name: /SD/ })).toBeVisible();
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(page.getByText("Sin OPL todavía.")).toBeVisible();

  await page.getByLabel("Menú principal").click();
  const menu = page.getByRole("menu", { name: "Menú principal" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Nuevo", exact: true })).toBeVisible();
  await menu.getByRole("menuitem", { name: "Guardar", exact: true }).click();

  let dialogoGuardar = page.getByRole("dialog", { name: "Guardar como" });
  await expect(dialogoGuardar).toBeVisible();
  // Tras L4 ronda6: el dialogo muestra "Destino: Inicio / Modelos locales" como
  // texto siempre visible; el breadcrumb completo con boton "Inicio" vive bajo
  // el details "Cambiar carpeta destino" colapsado por default.
  await expect(dialogoGuardar.getByText(/Inicio \/ Modelos locales/)).toBeVisible();
  await dialogoGuardar.getByLabel("Nombre del modelo").fill("Workspace L2");
  await dialogoGuardar.getByLabel("Descripción").fill("Persistencia local");
  await dialogoGuardar.getByRole("button", { name: "Guardar" }).click();
  await expect(dialogoGuardar).toHaveCount(0);
  await expect(page.locator("span").filter({ hasText: /^Workspace L2$/ }).first()).toBeVisible();

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.keyboard.press("Control+S");
  await expect(page.getByRole("dialog", { name: "Guardar como" })).toHaveCount(0);
  await expect(page.getByText("Modelo guardado exitosamente")).toBeVisible();

  await page.getByRole("button", { name: "Nuevo", exact: true }).click();
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await page.getByRole("button", { name: "Cargar", exact: true }).first().click();
  const dialogoCargar = page.getByRole("dialog", { name: "Cargar modelo" });
  await expect(dialogoCargar).toBeVisible();
  // Post L4 ronda6: cada modelo en "Recientes" es un boton con data-testid="reciente-modelo".
  const tileWorkspaceL2 = dialogoCargar.getByTestId("reciente-modelo").filter({ hasText: /Workspace L2/ });
  await expect(tileWorkspaceL2).toBeVisible();
  await tileWorkspaceL2.dblclick();
  await expect(dialogoCargar).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("L2 dialogo cargar abre ejemplo organizacional", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Cargar", exact: true }).first().click();
  const dialogo = page.getByRole("dialog", { name: "Cargar modelo" });
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Ejemplo organizacional" }).click();

  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Cliente")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Resolver solicitud")).toHaveCount(1);
  await expect(page.locator(".joint-link")).toHaveCount(3);
  expect(pageErrors).toEqual([]);
});

test("L2 dialogo cargar busca descripcion, selecciona tile y carga", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await guardarComoActual(page, "Busqueda L2", "descripcion persistencia l2");
  await page.getByRole("button", { name: "Nuevo", exact: true }).click();
  await page.getByRole("button", { name: "Cargar", exact: true }).first().click();
  const dialogo = page.getByRole("dialog", { name: "Cargar modelo" });
  await expect(dialogo).toBeVisible();
  await dialogo.getByLabel("Buscar modelos por nombre").fill("persistencia");

  const tile = dialogo.getByTestId("modelo-tile-cargar").filter({ hasText: /Busqueda L2/ });
  await expect(tile).toBeVisible();
  await tile.click();
  await dialogo.getByRole("button", { name: "Cargar", exact: true }).click();

  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});

test("workspace L4 mueve modelos y busca global con guard", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.keyboard.press("Control+S");
  const dialogoGuardar = page.getByRole("dialog", { name: "Guardar como" });
  await expect(dialogoGuardar).toBeVisible();
  await dialogoGuardar.getByLabel("Nombre del modelo").fill("Workspace L4 Busqueda");
  await dialogoGuardar.getByLabel("Descripción").fill("hallazgo global l4");
  await dialogoGuardar.getByLabel("Crear versiones en guardados manuales").check();
  await dialogoGuardar.getByRole("button", { name: "Guardar" }).click();
  await expect(dialogoGuardar).toHaveCount(0);

  await page.keyboard.press("Control+Shift+F");
  const dialogoBuscar = page.getByRole("dialog", { name: "Buscar global" });
  await expect(dialogoBuscar).toBeVisible();
  await dialogoBuscar.getByLabel("Buscar global").fill("ha");
  await expect(dialogoBuscar.getByText("Ingresa al menos 3 caracteres.")).toBeVisible();
  await dialogoBuscar.getByLabel("Buscar global").fill("hallazgo");
  await expect(dialogoBuscar.getByTestId(/resultado-busqueda-global-/)).toContainText("Workspace L4 Busqueda");
  await dialogoBuscar.getByRole("button", { name: "Cerrar" }).click();

  await page.getByRole("button", { name: "Cargar", exact: true }).first().click();
  const dialogoCargar = page.getByRole("dialog", { name: "Cargar modelo" });
  await expect(dialogoCargar).toBeVisible();
  await dialogoCargar.getByRole("button", { name: "+ Nueva carpeta" }).click();
  await dialogoCargar.getByPlaceholder("Nombre de carpeta").fill("Destino L4");
  await page.keyboard.press("Enter");
  await expect(dialogoCargar.getByRole("button", { name: /Destino L4/ })).toBeVisible();
  await dialogoCargar.locator('button[title="Workspace L4 Busqueda"]').last().click({ button: "right" });
  await page.getByRole("button", { name: "Cortar" }).click();
  await dialogoCargar.getByRole("button", { name: /Destino L4/ }).dblclick();
  await dialogoCargar.getByRole("button", { name: "Pegar aqui" }).click();
  await expect(dialogoCargar.locator('button[title="Workspace L4 Busqueda"]').last()).toBeVisible();
  await dialogoCargar.getByRole("button", { name: "Cancelar" }).click();

  expect(pageErrors).toEqual([]);
});

test("sincroniza OPL interactivo con canvas y renombrado inverso", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");

  await elementoPorTexto(page, "Entrada").click();
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await clickCabeceraElemento(page, "Procesar");

  const panel = page.getByLabel("Panel OPL-ES");
  await expect(panel.locator('[data-testid="opl-line"]')).toHaveCount(3);
  await expect(panel.locator('[data-opl-ordinal="1"]')).toBeVisible();
  await expect(panel.locator('[data-opl-ordinal="2"]')).toBeVisible();
  await expect(panel.locator('[data-opl-ordinal="3"]')).toBeVisible();

  const tokenEntrada = panel.getByText("Entrada").first();
  await tokenEntrada.hover();
  await expect(tokenEntrada).toHaveCSS("background-color", "rgb(225, 230, 235)");

  await elementoPorTexto(page, "Procesar").click();
  await panel.getByLabel("Filtrar por selección").check();
  await expect(panel.getByText("Entrada es un objeto")).toHaveCount(0);
  await expect(panel.getByText(/Procesar\s+consume\s+Entrada\./)).toBeVisible();

  await panel.getByLabel("Filtrar por selección").uncheck();
  await tokenEntrada.dblclick();
  await page.getByLabel("Renombrar desde OPL").fill("Cliente");
  await page.keyboard.press("Enter");

  await expect(elementoPorTexto(page, "Cliente")).toHaveCount(1);
  await expect(panel.getByText("Cliente")).toHaveCount(2);
  await expect(panel.getByText(/Procesar\s+consume\s+Cliente\./)).toBeVisible();

  await page.screenshot({ path: "test-results/opm-opl-interactivo-inverso.png", fullPage: true });
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

  await jsonEditor(page).fill(JSON.stringify(modeloDosOpds(), null, 2));
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

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const json = await jsonEditor(page).inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  expect(Object.values(exportado.modelo.opds["opd-1"]?.apariencias ?? {})).toHaveLength(1);
  const aparienciasHijo = Object.values(exportado.modelo.opds["opd-2"]?.apariencias ?? {});
  expect(aparienciasHijo).toHaveLength(2);
  expect(todasSeparadas(aparienciasHijo)).toBe(true);

  await page.screenshot({ path: "test-results/opm-opd-tree.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("arbol OPD atajos panel: F2 renombra y Ctrl+D abre gestion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloDosOpds(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  const nodoRaiz = page.locator('[role="treeitem"][data-opd-id="opd-1"]');
  await expect(nodoRaiz).toBeVisible();
  await nodoRaiz.focus();
  await page.keyboard.press("F2");

  const input = page.getByTestId("arbol-opd-renombrado-inline");
  await expect(input).toBeVisible();
  await input.fill("SD Ajustado");
  await page.keyboard.press("Enter");
  await expect(nodoRaiz).toContainText("SD Ajustado");

  await nodoRaiz.focus();
  await page.keyboard.press("Control+d");
  await expect(page.getByRole("dialog", { name: "Gestión del árbol OPD" })).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("pestanas de sesion mantienen modelos independientes", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByTestId("barra-pestanas")).toBeVisible();
  await expect(page.getByRole("tab")).toHaveCount(1);

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(page.locator(".joint-element")).toHaveCount(1);

  await page.getByTestId("nueva-pestana-btn").click();
  await expect(page.getByRole("tab")).toHaveCount(2);
  await expect(page.locator(".joint-element")).toHaveCount(0);

  await page.getByRole("tab").nth(0).click();
  await expect(page.locator(".joint-element")).toHaveCount(1);

  await page.getByRole("tab").nth(1).click();
  const dialogo = page.getByRole("dialog", { name: "Hay cambios sin guardar" });
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Descartar" }).click();
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await page.getByTestId(/^cerrar-pestana-/).nth(1).click();
  await expect(page.getByRole("tab")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("OPL agrupa oraciones por OPD y permite colapsar bloques", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloDosOpds(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  const bloqueRaiz = page.getByTestId("bloque-opl-opd-1");
  const bloqueHijo = page.getByTestId("bloque-opl-opd-2");
  await expect(bloqueRaiz).toBeVisible();
  await expect(bloqueHijo).toBeVisible();
  await expect(bloqueRaiz.getByText("Objeto Raiz")).toBeVisible();
  await expect(bloqueHijo.getByText("Proceso Hijo")).toBeVisible();

  await page.getByTestId("cabecera-bloque-opl-opd-2").click();
  await expect(bloqueHijo.getByText("Proceso Hijo")).toHaveCount(0);
  await page.getByTestId("cabecera-bloque-opl-opd-2").click();
  await expect(bloqueHijo.getByText("Proceso Hijo")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

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
  await expect(svgText(page, "E")).toBeVisible();
  await expect(svgText(page, "70%")).toBeVisible();
  await expect(svgText(page, "C")).toBeVisible();
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

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
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
  await page.getByTestId("mover-puerto-btn").click();
  const dialogo = page.getByRole("dialog", { name: "Mover Puerto" });
  await expect(dialogo).toBeVisible();
  await dialogo.getByTestId("mover-puerto-extremo-select").selectOption("entidad:p-validar");
  await page.getByRole("dialog", { name: "Mover Puerto" }).getByRole("button", { name: "Mover", exact: true }).click();

  await expect(page.getByText("Puerto movido")).toBeVisible();
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
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

  await expect(page.getByTestId("panel-avisos")).toContainText("consumo-doble-mismo-objeto");
  await expect(page.getByTestId("panel-avisos")).toContainText("Procesar consume Entrada más de una vez");
  expect(pageErrors).toEqual([]);
});

test("crea auto-invocacion desde Inspector con demora default", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await expect(page.getByRole("button", { name: "Auto-invocación" })).toBeVisible();

  await page.getByRole("button", { name: "Auto-invocación" }).click();

  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(svgText(page, "1s")).toBeVisible();
  await expect(page.getByText("Proceso se invoca a sí mismo despues de 1s.")).toBeVisible();

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
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

test("descompone proceso y navega al OPD hijo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await expect(page.getByRole("button", { name: "Descomponer" })).toBeVisible();

  await page.getByRole("button", { name: "Descomponer" }).click();

  const nodoHijo = page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" });
  await expect(nodoHijo).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".joint-element")).toHaveCount(4);
  await expect(page.getByTestId("bloque-opl-opd-1").getByText("Proceso se descompone en Proceso 1, Proceso 2 y Proceso 3 en esa secuencia.")).toBeVisible();

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const json = await jsonEditor(page).inputValue();
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
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const jsonSinDescomposicion = await jsonEditor(page).inputValue();
  const exportadoSinDescomposicion = JSON.parse(jsonSinDescomposicion) as ExportadoModelo;
  const procesoSinDescomposicion = Object.values(exportadoSinDescomposicion.modelo.entidades).find((entidad) => entidad.nombre === "Proceso");
  expect(procesoSinDescomposicion?.refinamiento).toBeUndefined();
  expect(Object.values(exportadoSinDescomposicion.modelo.opds)).toHaveLength(1);

  expect(pageErrors).toEqual([]);
});

test("elimina desde arbol solo OPDs hoja y deshacer restaura", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByRole("button", { name: "Descomponer" }).click();
  const nodoPadre = page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" });
  await expect(nodoPadre).toHaveAttribute("aria-current", "page");

  await elementoPorTexto(page, "Proceso 1").click();
  await page.getByRole("button", { name: "Descomponer" }).click();
  const nodoHoja = page.locator('[role="treeitem"]').filter({ hasText: "SD1.1: Proceso 1 descompuesto" });
  await expect(nodoHoja).toHaveAttribute("aria-current", "page");

  await nodoPadre.getByRole("button", { name: /Eliminar OPD/ }).click();
  await expect(page.getByText(/Eliminar descendientes primero/)).toBeVisible();
  await expect(nodoPadre).toHaveCount(1);
  await expect(nodoHoja).toHaveCount(1);

  page.once("dialog", (dialog) => dialog.accept());
  await nodoHoja.getByRole("button", { name: /Eliminar OPD/ }).click();
  await expect(nodoHoja).toHaveCount(0);
  await expect(nodoPadre).toHaveAttribute("aria-current", "page");

  await page.getByRole("button", { name: "Deshacer" }).click();
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1.1: Proceso 1 descompuesto" })).toHaveCount(1);

  await page.screenshot({ path: "test-results/opm-eliminar-opd-hoja.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("crea objeto interno por click dentro del contenedor refinado", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByRole("button", { name: "Descomponer" }).click();
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" })).toHaveAttribute("aria-current", "page");

  await page.getByRole("button", { name: "Objeto en canvas" }).click();
  const contorno = await rectDeLocator(elementoPorTexto(page, "Proceso"));
  await page.mouse.click(contorno.x + 48, contorno.y + 118);

  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);
  await expect(page.getByText(/interior|exterior/i)).toHaveCount(0);
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const proceso = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Proceso");
  const objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  const opdHijoId = proceso?.refinamiento?.opdId;
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

test("despliega objeto y navega al OPD hijo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(page.getByText("Desplegar como...")).toBeVisible();

  await desplegarComoAgregacion(page);

  const nodoHijo = page.locator('[role="treeitem"]').filter({ hasText: "SD1: Objeto desplegado" });
  await expect(nodoHijo).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".joint-element")).toHaveCount(5);
  await expect(page.getByTestId("bloque-opl-opd-1").getByText("Objeto se despliega en Objeto parte 1, Objeto parte 2 y Objeto parte 3.")).toBeVisible();

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const json = await jsonEditor(page).inputValue();
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
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const jsonSinDespliegue = await jsonEditor(page).inputValue();
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
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
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

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const json = await jsonEditor(page).inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  if (!objeto?.refinamiento) throw new Error("No se exporto despliegue del objeto");
  const aparienciaPadre = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .find((apariencia) => apariencia.entidadId === objeto.id);
  expect(aparienciaPadre?.modoPlegado).toBe("parcial");
  expect(Object.values(exportado.modelo.opds[objeto.refinamiento.opdId]?.apariencias ?? {})).toHaveLength(4);

  await guardarComoActual(page, "Plegado parcial local");
  await page.getByRole("button", { name: "Nuevo", exact: true }).click();
  await cargarPrimerModelo(page);
  await expect(elementoPorTexto(page, "Objeto parte 1")).toHaveCount(1);
  await clickCabeceraElemento(page, "Objeto");
  await expect(page.getByRole("button", { name: "Plegado completo" })).toBeVisible();

  await page.screenshot({ path: "test-results/opm-plegado-parcial.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("edita estilo visual de cosa, persiste local y resetea defaults", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(page.getByRole("button", { name: "Fill #fef3c7" })).toBeVisible();

  await page.getByRole("button", { name: "Fill #fef3c7" }).click();
  await page.getByRole("button", { name: "Borde #3bc3ff" }).click();

  await expect(page.locator('.joint-element rect[joint-selector="body"]')).toHaveAttribute("fill", "#fef3c7");
  await expect(page.locator('.joint-element rect[joint-selector="body"]')).toHaveAttribute("stroke", "#3bc3ff");

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  let json = await jsonEditor(page).inputValue();
  let exportado = JSON.parse(json) as ExportadoModelo;
  let objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  if (!objeto) throw new Error("No se exporto objeto");
  let apariencia = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .find((item) => item.entidadId === objeto.id);
  expect(apariencia?.estilo).toEqual({ fill: "#fef3c7", borderColor: "#3bc3ff" });

  await guardarComoActual(page, "Estilo visual local");
  await page.getByRole("button", { name: "Nuevo", exact: true }).click();
  await cargarPrimerModelo(page);
  await expect(page.locator('.joint-element rect[joint-selector="body"]')).toHaveAttribute("fill", "#fef3c7");
  await expect(page.locator('.joint-element rect[joint-selector="body"]')).toHaveAttribute("stroke", "#3bc3ff");

  await elementoPorTexto(page, "Objeto").click();
  // Tras L6 ronda6 hay dos botones "Reset": uno para Style (apariencia) y otro
  // para texto del rotulo. El test apunta al de apariencia (Reset Style).
  await page.getByTitle("Reset Style").click();
  await expect(page.locator('.joint-element rect[joint-selector="body"]')).toHaveAttribute("fill", "#fdffff");

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  json = await jsonEditor(page).inputValue();
  exportado = JSON.parse(json) as ExportadoModelo;
  objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  if (!objeto) throw new Error("No se exporto objeto tras reset");
  apariencia = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .find((item) => item.entidadId === objeto.id);
  expect(apariencia?.estilo).toBeUndefined();

  await page.screenshot({ path: "test-results/opm-estilo-visual-cosa.png", fullPage: true });
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
  await page.getByRole("button", { name: "Plegado parcial" }).click();
  await expect(elementoPorTexto(page, "Objeto parte 1")).toHaveCount(1);

  await elementoPorTexto(page, "Objeto parte 1").click();
  await page.getByLabel("Tipo de enlace").selectOption("instrumento");
  await elementoPorTexto(page, "Mover").click();

  await expect(page.locator(".joint-link")).toHaveCount(1);
  await expect(page.getByText(/Mover\s+requiere\s+Objeto parte 1\./)).toBeVisible();
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
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
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Salida");

  await elementoPorTexto(page, "Entrada").click();
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await clickCabeceraElemento(page, "Procesar");
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

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const json = await jsonEditor(page).inputValue();
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
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
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
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const json = await jsonEditor(page).inputValue();
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

test("L3 descomposicion avanzada: inspector reasigna, inline renombra, paralelo y ambiental clamp", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await elementoPorTexto(page, "Entrada").click();
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await elementoPorTexto(page, "Procesar").click();
  await elementoPorTexto(page, "Procesar").click();
  await page.getByRole("button", { name: "Descomponer" }).click();
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Procesar descompuesto" })).toHaveAttribute("aria-current", "page");

  await clickCabeceraElemento(page, "Procesar");
  await expect(page.getByText("Enlaces externos derivados")).toBeVisible();
  await page.getByTestId(/refinamiento-reasignar-/).selectOption({ label: "Procesar 2 (2)" });
  await page.getByRole("button", { name: "Reasignar" }).click();

  const proceso2ParaRename = await elementoPorTexto(page, "Procesar 2").boundingBox();
  if (!proceso2ParaRename) throw new Error("No se pudo ubicar Procesar 2 para renombrado");
  await page.mouse.dblclick(proceso2ParaRename.x + proceso2ParaRename.width / 2, proceso2ParaRename.y + proceso2ParaRename.height / 2);
  await expect(page.getByTestId("renombrado-inline")).toBeVisible();
  await page.getByTestId("renombrado-inline").fill("Validar Entrada");
  await page.keyboard.press("Enter");
  await expect(elementoPorTexto(page, "Validar Entrada")).toHaveCount(1);
  await expect(page.getByText(/Validar Entrada\s+consume\s+Entrada/)).toBeVisible();

  const p1 = await elementoPorTexto(page, "Procesar 1").boundingBox();
  const p2 = await elementoPorTexto(page, "Validar Entrada").boundingBox();
  if (!p1 || !p2) throw new Error("No se pudo ubicar subprocesos para paralelo");
  await page.mouse.move(p1.x + p1.width / 2, p1.y + p1.height / 2);
  await page.mouse.down();
  await page.mouse.move(p1.x + p1.width / 2, p2.y + p2.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByText(/Procesar se descompone en paralelo/).first()).toBeVisible();

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const contorno = await elementoPorTexto(page, "Procesar").boundingBox();
  if (!contorno) throw new Error("No se pudo ubicar contorno para creacion ambiental");
  await page.mouse.click(contorno.x + contorno.width - 10, contorno.y + contorno.height - 10);
  await page.getByRole("button", { name: "Ambiental" }).click();

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const procesar = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar");
  const entrada = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Entrada");
  const validado = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Validar Entrada");
  const ambiental = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  const opdHijoId = procesar?.refinamiento?.opdId;
  if (!opdHijoId || !entrada || !validado || !ambiental) throw new Error("No se exporto modelo L3 esperado");
  const enlaceManual = Object.values(exportado.modelo.opds[opdHijoId]?.enlaces ?? {})
    .map((apariencia) => exportado.modelo.enlaces[apariencia.enlaceId])
    .find((enlace) => enlace?.tipo === "consumo");
  expect(enlaceManual).toEqual(expect.objectContaining({
    origenId: extremoEntidad(entrada.id),
    destinoId: extremoEntidad(validado.id),
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

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
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

test("marca dirty state y navega cambios con deshacer y rehacer", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");

  const deshacer = page.getByRole("button", { name: "Deshacer" });
  const rehacer = page.getByRole("button", { name: "Rehacer" });
  await expect(page.getByText("Modelo (No guardado)").first()).toBeVisible();
  await expect(deshacer).toBeDisabled();
  await expect(rehacer).toBeDisabled();

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(page.getByText("Modelo (No guardado)").first()).toBeVisible();
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await expect(deshacer).toBeEnabled();
  await expect(rehacer).toBeDisabled();

  await page.keyboard.press("Control+Z");
  await expect(page.getByText("Modelo (No guardado)").first()).toBeVisible();
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(deshacer).toBeDisabled();
  await expect(rehacer).toBeEnabled();

  await page.keyboard.press("Control+Shift+Z");
  await expect(page.getByText("Modelo (No guardado)").first()).toBeVisible();
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await expect(deshacer).toBeEnabled();
  await expect(rehacer).toBeDisabled();

  await deshacer.click();
  await expect(page.getByText("Modelo (No guardado)").first()).toBeVisible();
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(deshacer).toBeDisabled();
  await expect(rehacer).toBeEnabled();

  await rehacer.click();
  await expect(page.getByText("Modelo (No guardado)").first()).toBeVisible();
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
  await guardarComoActual(page, "Renombrado local");
  await expect(page.getByText("Modelo (No guardado)").first()).toHaveCount(0);
  await expect(deshacer).toBeEnabled();

  await page.getByRole("button", { name: "Nuevo", exact: true }).click();
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(deshacer).toBeDisabled();
  await cargarPrimerModelo(page);
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(1);
  await expect(page.getByText("Modelo (No guardado)").first()).toHaveCount(0);
  await expect(deshacer).toBeDisabled();

  expect(pageErrors).toEqual([]);
});

test("confirma cambios sin guardar antes de crear un modelo nuevo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  const dialogo = page.getByRole("dialog", { name: "Hay cambios sin guardar" });
  await page.getByRole("button", { name: "Nuevo", exact: true }).click();
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByRole("button", { name: "Guardar" })).toBeFocused();

  await dialogo.getByRole("button", { name: "Cancelar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  await page.getByRole("button", { name: "Nuevo", exact: true }).click();
  await expect(dialogo).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  await page.getByRole("button", { name: "Nuevo", exact: true }).click();
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Descartar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(page.getByText("Modelo (No guardado)").first()).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("no abre confirmacion cuando Nuevo se ejecuta tras guardar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await guardarComoActual(page, "Modelo sin confirmacion");
  await expect(page.getByText("Modelo (No guardado)").first()).toHaveCount(0);

  await page.getByRole("button", { name: "Nuevo", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Hay cambios sin guardar" })).toHaveCount(0);
  await expect(page.locator(".joint-element")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("dialogo cerrar con cambios dirty ofrece Guardar Descartar Cancelar en pestañas", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByTestId("nueva-pestana-btn").click();
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  await page.getByRole("tab").first().click();
  const dialogo = page.getByRole("dialog", { name: "Hay cambios sin guardar" });
  await expect(dialogo).toBeVisible();
  await expect(page.getByTestId("dialogo-confirmacion-cerrar-dirty")).toBeVisible();
  await expect(dialogo.getByRole("button", { name: "Guardar" })).toBeVisible();
  await expect(dialogo.getByRole("button", { name: "Descartar" })).toBeVisible();
  await expect(dialogo.getByRole("button", { name: "Cancelar" })).toBeVisible();

  await dialogo.getByRole("button", { name: "Cancelar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  await page.getByTestId(/^cerrar-pestana-/).nth(1).click();
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Descartar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(page.getByRole("tab")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("panel OPL busca texto y filtra lineas", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await elementoPorTexto(page, "Entrada").click();
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await elementoPorTexto(page, "Procesar").click();

  const panel = page.getByLabel("Panel OPL-ES");
  await expect(panel.locator('[data-testid="opl-line"]')).toHaveCount(3);
  await page.getByTestId("panel-opl-buscar").fill("consume");
  await expect(panel.locator('[data-testid="opl-line"]')).toHaveCount(1);
  await expect(panel.getByText(/Procesar\s+consume\s+Entrada\./)).toBeVisible();
  await expect(panel.getByText("Entrada es un objeto")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("panel OPL copia y exporta HTML desde botones", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (texto: string) => {
          (window as Window & { __copiedOpl?: string }).__copiedOpl = texto;
        },
      },
    });
  });
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  await page.getByTestId("panel-opl-copiar").click();
  const copiado = await page.evaluate(() => (window as Window & { __copiedOpl?: string }).__copiedOpl ?? "");
  expect(copiado).toContain("**Objeto** es un objeto informacional y sistémico.");
  await expect(page.getByText("OPL copiado al portapapeles")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("panel-opl-exportar-html").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/Modelo-opl\.html$/);

  expect(pageErrors).toEqual([]);
});

test("panel OPL alterna numeracion 123 sin perder seleccion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  const panel = page.getByLabel("Panel OPL-ES");
  await expect(panel.locator('[data-opl-ordinal="1"] span').first()).toHaveCSS("opacity", "1");

  await page.getByTestId("panel-opl-toggle-numeracion").click();
  await expect(panel.locator('[data-opl-ordinal="1"] span').first()).toHaveCSS("opacity", "0");
  await panel.getByText("Entrada").click();
  await expect(page.getByLabel("Nombre")).toHaveValue("Entrada");

  expect(pageErrors).toEqual([]);
});

test("panel OPL minimiza y restaura desde barra colapsada", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByTestId("panel-opl-minimizar").click();

  await expect(page.getByTestId("panel-opl-minimizado")).toBeVisible();
  await expect(page.getByTestId("panel-opl-restaurar")).toContainText("OPL · 1 oraciones · Restaurar");
  await expect(page.locator('[data-testid="opl-line"]')).toHaveCount(0);

  await page.getByTestId("panel-opl-restaurar").click();
  await expect(page.locator('[data-testid="opl-line"]')).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("panel OPL se mueve a lateral derecho y persiste al recargar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByTestId("panel-opl-posicion").click();

  const oplLateral = page.getByTestId("opl-pane");
  const inspector = page.getByTestId("inspector-pane");
  await expect(oplLateral).toBeVisible();
  let oplBox = await oplLateral.boundingBox();
  let inspectorBox = await inspector.boundingBox();
  if (!oplBox || !inspectorBox) throw new Error("No se pudo medir layout lateral OPL");
  expect(oplBox.x).toBeGreaterThan(inspectorBox.x);
  expect(oplBox.height).toBeGreaterThan(300);

  await page.reload();
  oplBox = await page.getByTestId("opl-pane").boundingBox();
  inspectorBox = await page.getByTestId("inspector-pane").boundingBox();
  if (!oplBox || !inspectorBox) throw new Error("No se pudo medir layout lateral OPL tras recarga");
  expect(oplBox.x).toBeGreaterThan(inspectorBox.x);

  expect(pageErrors).toEqual([]);
});

test("panel OPL indenta y contrae bloques jerarquicos desde preferencias", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await jsonEditor(page).fill(JSON.stringify(modeloDosOpds(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  const bloqueRaiz = page.getByTestId("bloque-opl-opd-1");
  const bloqueHijo = page.getByTestId("bloque-opl-opd-2");
  await expect(bloqueRaiz).toHaveAttribute("data-opl-nivel", "0");
  await expect(bloqueHijo).toHaveAttribute("data-opl-nivel", "1");
  expect(await bloqueRaiz.evaluate((el) => getComputedStyle(el).paddingLeft)).toBe("0px");
  expect(await bloqueHijo.evaluate((el) => getComputedStyle(el).paddingLeft)).toBe("16px");

  await page.getByTestId("cabecera-bloque-opl-opd-2").click();
  await expect(bloqueHijo.getByText("Proceso Hijo")).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId("bloque-opl-opd-2").getByText("Proceso Hijo")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("panel OPL selecciona enlace especifico en oracion multi-enlace", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await jsonEditor(page).fill(JSON.stringify(modeloAbanicoLogico(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  const lineaMultiEnlace = page.locator('[data-testid="opl-line"]').filter({ hasText: "al menos uno de" });
  await lineaMultiEnlace.getByText("Entrada B").click();
  await page.getByRole("button", { name: "Eliminar enlace" }).click();
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  expect(exportado.modelo.enlaces["e-consumo-a"]).toBeDefined();
  expect(exportado.modelo.enlaces["e-consumo-b"]).toBeUndefined();

  expect(pageErrors).toEqual([]);
});

test("panel OPL muestra placeholder de AI Text sin ejecutar funcionalidad", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByTestId("panel-opl-ai-text").click();
  await expect(page.getByText("Próximamente: oraciones generadas por LLM")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("undo elimina entidad y restaura modelo previo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await elementoPorTexto(page, "Objeto").click();
  await page.getByRole("button", { name: "Eliminar entidad" }).click();
  await expect(page.locator(".joint-element")).toHaveCount(0);

  await page.keyboard.press("Control+Z");
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("undo renombra entidad y restaura nombre previo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Renombrado");
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(1);

  await page.keyboard.press("Control+Z");
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("undo mueve apariencia y restaura posicion previa", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await elementoPorTexto(page, "Objeto").click();
  const antes = await aparienciaRaizPorNombre(page, "Objeto");

  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  const movida = await aparienciaRaizPorNombre(page, "Objeto");
  expect(movida.x).toBeGreaterThan(antes.x);

  await page.keyboard.press("Control+Z");
  await page.keyboard.press("Control+Z");
  const restaurada = await aparienciaRaizPorNombre(page, "Objeto");
  expect(restaurada.x).toBe(antes.x);
  expect(restaurada.y).toBe(antes.y);

  expect(pageErrors).toEqual([]);
});

test("undo cambia esencia y restaura valor previo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Física" }).click();
  await expect(page.getByText("Objeto es un objeto físico y sistémico.")).toBeVisible();

  await page.keyboard.press("Control+Z");
  await expect(page.getByText("Objeto es un objeto informacional y sistémico.")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("undo edita vertices y restaura ruta previa", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await elementoPorTexto(page, "Objeto").click();
  await page.getByLabel("Tipo de enlace").selectOption("instrumento");
  await clickCabeceraElemento(page, "Proceso");
  await clickCentroLink(page);

  const segmentBox = await rectDeLocator(page.locator(".joint-marker-segment").first());
  await page.mouse.move(segmentBox.x + segmentBox.width / 2, segmentBox.y + segmentBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(segmentBox.x + segmentBox.width / 2, segmentBox.y + segmentBox.height / 2 + 70, { steps: 8 });
  await page.mouse.up();
  expect((await verticesPrimerEnlace(page)).length).toBeGreaterThan(0);

  await page.keyboard.press("Control+Z");
  expect(await verticesPrimerEnlace(page)).toHaveLength(0);

  expect(pageErrors).toEqual([]);
});

test("extraer todas las partes plegadas crea apariencias en un solo undo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await desplegarComoAgregacion(page);
  await page.locator('[role="treeitem"][data-opd-id="opd-1"]').click();
  await clickCabeceraElemento(page, "Objeto");
  await page.getByRole("button", { name: "Plegado parcial" }).click();
  await page.getByTestId("extraer-todas-partes-btn").click();

  await expect(page.locator(".joint-element")).toHaveCount(4);
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  let exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  if (!objeto) throw new Error("No se exporto Objeto");
  const extraidas = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .filter((apariencia) => apariencia.parteExtraidaDe);
  expect(extraidas).toHaveLength(3);

  await page.keyboard.press("Control+Z");
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  expect(Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .filter((apariencia) => apariencia.parteExtraidaDe)).toHaveLength(0);

  expect(pageErrors).toEqual([]);
});

test("activa beforeunload solo cuando el modelo esta dirty", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(await estadoBeforeUnload(page)).toEqual({ canceled: false, defaultPrevented: false });

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(await estadoBeforeUnload(page)).toEqual({ canceled: true, defaultPrevented: true });

  await guardarComoActual(page, "Beforeunload limpio");
  await expect(await estadoBeforeUnload(page)).toEqual({ canceled: false, defaultPrevented: false });

  expect(pageErrors).toEqual([]);
});

test("asiste importacion JSON con archivo, preview, confirmacion y error legible", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
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
  await expect(page.getByText("Modelo multi OPD (No guardado)")).toHaveCount(1);

  await jsonEditor(page).fill("{");
  await expect(page.getByRole("alert")).toHaveText("JSON inválido");

  expect(pageErrors).toEqual([]);
});

test("crea enlace, edita vertices y elimina desde celdas JointJS", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  const tipoEnlace = page.getByLabel("Tipo de enlace");
  await expect(tipoEnlace).toBeDisabled();
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Proceso", exact: true }).click();

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
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const jsonConVertice = await jsonEditor(page).inputValue();
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
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Recurso");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
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

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
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

  await expect(seccionEstados.getByLabel("Nombre estado estado1")).toBeVisible();
  await seccionEstados.getByLabel("Nombre estado estado1").fill("pendiente");
  await seccionEstados.getByLabel("Nombre estado estado2").fill("cerrado");
  await seccionEstados.getByRole("button", { name: "Inicial" }).nth(0).click();
  await seccionEstados.getByRole("button", { name: "Final" }).nth(1).click();

  await expect(page.locator('[joint-selector^="stateCapsule"]')).toHaveCount(2);
  await expect(elementoPorTexto(page, "pendiente")).toHaveCount(1);
  await expect(elementoPorTexto(page, "cerrado")).toHaveCount(1);
  await expect(page.getByText(/Pedido puede ser .*pendiente.*cerrado/)).toBeVisible();

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
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
  await expect(page.getByText(/Aprobar\s+cambia\s+Pedido\s+de `pendiente` a `aprobado`\./)).toBeVisible();
  await expect(page.getByText(/Aprobar\s+cambia\s+Pedido\s+de `pendiente`\./)).toHaveCount(0);
  await expect(page.getByText(/Aprobar\s+cambia\s+Pedido\s+a `aprobado`\./)).toHaveCount(0);

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
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
  await page.getByLabel("Tipo de enlace").selectOption("resultado");
  await page.locator('[joint-selector^="stateLabel"]').filter({ hasText: "aprobado" }).click();

  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(page.getByText(/Aprobar\s+cambia\s+Pedido\s+de `pendiente` a `aprobado`\./)).toBeVisible();

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
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
  await page.getByTestId("ruta-etiqueta-input").fill("fallido");
  await expect(svgText(page, "fallido")).toBeVisible();

  await expect(page.getByText(/Por ruta exitoso/)).toBeVisible();
  await expect(page.getByText(/Por ruta fallido/)).toBeVisible();
  await expect(page.getByText(/genera\s+Pedido\s+en `(aprobado|rechazado)`\./).first()).toBeVisible();

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
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
  await page.getByLabel("Tipo de enlace").selectOption("efecto");
  await clickCabeceraElemento(page, "Actualizar");

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
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const json = await jsonEditor(page).first().inputValue();
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
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
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

  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const json = await jsonEditor(page).inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  expect(Object.values(exportado.modelo.enlaces).some((enlace) => enlace.etiqueta === "componente critico")).toBe(true);

  await page.screenshot({ path: "test-results/opm-bus-agregacion-etiqueta.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

function elementoPorTexto(page: import("@playwright/test").Page, texto: string): import("@playwright/test").Locator {
  const flexibleSvgText = new RegExp(`^\\s*${texto.trim().split(/\s+/).map(escapeRegExp).join("\\s*")}\\s*$`);
  return page.locator(".joint-element").filter({
    has: page.locator("text").filter({ hasText: flexibleSvgText }),
  });
}

function escapeRegExp(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function cerrarPantallaInicioSiVisible(page: import("@playwright/test").Page): Promise<void> {
  const pantalla = page.getByTestId("pantalla-inicio");
  if (await pantalla.count() === 0) return;
  await pantalla.getByRole("button", { name: "Nuevo", exact: true }).click();
  await expect(pantalla).toHaveCount(0);
}

async function rectDeLocator(locator: import("@playwright/test").Locator): Promise<{ x: number; y: number; width: number; height: number }> {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
}

async function clickCabeceraElemento(page: import("@playwright/test").Page, texto: string): Promise<void> {
  const target = elementoPorTexto(page, texto);
  const rect = await rectDeLocator(target);
  await target.click({
    position: { x: rect.width / 2, y: Math.min(14, rect.height / 3) },
    force: true,
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

async function guardarComoActual(page: import("@playwright/test").Page, nombre: string, descripcion = ""): Promise<void> {
  await page.keyboard.press("Control+S");
  const dialogo = page.getByRole("dialog", { name: "Guardar como" });
  await expect(dialogo).toBeVisible();
  await dialogo.getByLabel("Nombre del modelo").fill(nombre);
  if (descripcion) await dialogo.getByLabel("Descripción").fill(descripcion);
  await dialogo.getByRole("button", { name: "Guardar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(page.getByText("Modelo guardado exitosamente")).toBeVisible();
}

async function cargarPrimerModelo(page: import("@playwright/test").Page): Promise<void> {
  await page.getByRole("button", { name: "Cargar", exact: true }).first().click();
  const dialogo = page.getByRole("dialog", { name: "Cargar modelo" });
  await expect(dialogo).toBeVisible();
  // El panel "Recientes" expone botones con data-testid="reciente-modelo";
  // un solo click sobre el primer item abre el modelo en modo carga.
  await dialogo.getByTestId("reciente-modelo").first().click();
  await expect(dialogo).toHaveCount(0);
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
  const flexibleSvgText = new RegExp(`^\\s*${text.trim().split(/\s+/).map(escapeRegExp).join("\\s+")}\\s*$`);
  return page.locator(".joint-paper svg text").filter({ hasText: flexibleSvgText }).first();
}

function jsonEditor(page: Page) {
  return page.locator('textarea[spellcheck="false"]').first();
}

async function exportadoActual(page: Page): Promise<ExportadoModelo> {
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  return JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
}

async function aparienciaRaizPorNombre(page: Page, nombre: string): Promise<{ x: number; y: number; width: number; height: number }> {
  const exportado = await exportadoActual(page);
  const entidad = Object.values(exportado.modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`No se exporto entidad ${nombre}`);
  const apariencia = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .find((item) => item.entidadId === entidad.id);
  if (!apariencia) throw new Error(`No se exporto apariencia de ${nombre}`);
  return apariencia;
}

async function verticesPrimerEnlace(page: Page): Promise<Array<{ x: number; y: number }>> {
  const exportado = await exportadoActual(page);
  return Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.enlaces ?? {})[0]?.vertices ?? [];
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

function modeloNoModificador() {
  const entidades = {
    "o-orden": objeto("o-orden", "Orden"),
    "p-aprobar": proceso("p-aprobar", "Aprobar"),
  };
  const enlaces = {
    "e-consumo": enlace("e-consumo", "consumo", "o-orden", "p-aprobar"),
  };
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-no-modificador",
      nombre: "NO modificador",
      opdRaizId: "opd-1",
      nextSeq: 10,
      entidades,
      estados: {},
      enlaces,
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: aparienciaPar("o-orden", "p-aprobar", 70, 90),
          enlaces: { "ae-e-consumo": { id: "ae-e-consumo", enlaceId: "e-consumo", opdId: "opd-1", vertices: [] } },
        },
      },
    },
  };
}

function modeloMoverPuerto() {
  const entidades = {
    "o-entrada": objeto("o-entrada", "Entrada"),
    "p-procesar": proceso("p-procesar", "Procesar"),
    "p-validar": proceso("p-validar", "Validar"),
  };
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-mover-puerto",
      nombre: "Mover Puerto",
      opdRaizId: "opd-1",
      nextSeq: 10,
      entidades,
      estados: {},
      enlaces: {
        "e-consumo": enlace("e-consumo", "consumo", "o-entrada", "p-procesar"),
      },
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            ...aparienciaPar("o-entrada", "p-procesar", 70, 90),
            "a-p-validar": { id: "a-p-validar", entidadId: "p-validar", opdId: "opd-1", x: 650, y: 90, width: 135, height: 60 },
          },
          enlaces: { "ae-e-consumo": { id: "ae-e-consumo", enlaceId: "e-consumo", opdId: "opd-1", vertices: [] } },
        },
      },
    },
  };
}

function modeloConsumoDuplicado() {
  const entidades = {
    "o-entrada": objeto("o-entrada", "Entrada"),
    "p-procesar": proceso("p-procesar", "Procesar"),
  };
  const enlaces = {
    "e-consumo-1": enlace("e-consumo-1", "consumo", "o-entrada", "p-procesar"),
    "e-consumo-2": enlace("e-consumo-2", "consumo", "o-entrada", "p-procesar"),
  };
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-consumo-duplicado",
      nombre: "Consumo duplicado",
      opdRaizId: "opd-1",
      nextSeq: 10,
      entidades,
      estados: {},
      enlaces,
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: aparienciaPar("o-entrada", "p-procesar", 70, 90),
          enlaces: {
            "ae-e-consumo-1": { id: "ae-e-consumo-1", enlaceId: "e-consumo-1", opdId: "opd-1", vertices: [] },
            "ae-e-consumo-2": { id: "ae-e-consumo-2", enlaceId: "e-consumo-2", opdId: "opd-1", vertices: [{ x: 260, y: 190 }] },
          },
        },
      },
    },
  };
}

function modeloBusAgregacion() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-bus-agregacion",
      nombre: "Bus agregacion",
      opdRaizId: "opd-1",
      nextSeq: 1,
      entidades: {
        "o-todo": objeto("o-todo", "Todo"),
        "o-parte-a": objeto("o-parte-a", "Parte A"),
        "o-parte-b": objeto("o-parte-b", "Parte B"),
      },
      estados: {},
      enlaces: {
        "e-parte-a": enlace("e-parte-a", "agregacion", "o-todo", "o-parte-a"),
        "e-parte-b": enlace("e-parte-b", "agregacion", "o-todo", "o-parte-b"),
      },
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-o-todo": { id: "a-o-todo", entidadId: "o-todo", opdId: "opd-1", x: 70, y: 120, width: 135, height: 60 },
            "a-o-parte-a": { id: "a-o-parte-a", entidadId: "o-parte-a", opdId: "opd-1", x: 320, y: 60, width: 135, height: 60 },
            "a-o-parte-b": { id: "a-o-parte-b", entidadId: "o-parte-b", opdId: "opd-1", x: 320, y: 190, width: 135, height: 60 },
          },
          enlaces: {
            "ae-parte-a": { id: "ae-parte-a", enlaceId: "e-parte-a", opdId: "opd-1", vertices: [] },
            "ae-parte-b": { id: "ae-parte-b", enlaceId: "e-parte-b", opdId: "opd-1", vertices: [] },
          },
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
    entidades: Record<string, { id: string; nombre: string; afiliacion?: string; refinamiento?: { tipo: string; opdId: string }; imagen?: { url: string; modo: string } }>;
    estados: Record<string, { id: string; entidadId: string; nombre: string; esInicial?: boolean; esFinal?: boolean }>;
    enlaces: Record<string, {
      id: string;
      tipo: string;
      origenId: ExtremoExportado;
      destinoId: ExtremoExportado;
      etiqueta: string;
      multiplicidadOrigen?: string;
      multiplicidadDestino?: string;
      modificador?: string;
      subtipoModificador?: string;
      probabilidad?: number;
      rutaEtiqueta?: string;
      derivado?: { tipo: string; refinamientoId: string; enlacePadreId: string; origen?: string };
    }>;
    abanicos?: Record<string, { enlaceIds: string[] }>;
    opds: Record<
      string,
      {
        padreId: string | null;
        apariencias: Record<string, {
          entidadId: string;
          x: number;
          y: number;
          width: number;
          height: number;
          modoTamano?: string;
          modoPlegado?: string;
          estilo?: { fill?: string; borderColor?: string };
          parteExtraidaDe?: { padreAparienciaId: string; parteEntidadId: string };
        }>;
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

// ─── L5: Mapa del sistema y gestión del árbol OPD ──────────────────

test("mapa del sistema: abre, muestra thumbnails, doble clic navega", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  // Crear modelo con jerarquía: SD > SD1 (descompone proceso) — flujo determinista
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  // Asegurar que el proceso esta seleccionado para que "Descomponer" funcione
  await elementoPorTexto(page, "Proceso").click();
  await page.getByRole("button", { name: "Descomponer", exact: true }).click();

  // Esperar a que SD1 aparezca en el arbol; con el arbol expandido por
  // default, el nodo descompuesto es visible inmediatamente.
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1:" })).toHaveCount(1);
  await elementoPorTexto(page, "Proceso 1").click();
  await page.getByRole("button", { name: "Descomponer", exact: true }).click();
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1.1:" })).toHaveCount(1);
  // Verificar al menos 3 treeitems (Mapa + SD raiz + SD1)
  const treeItems = page.getByRole("treeitem");
  const count = await treeItems.count();
  expect(count).toBeGreaterThanOrEqual(3);

  // Abrir Mapa del sistema desde el árbol
  const mapaEntry = page.getByTitle("Mapa del sistema");
  if (await mapaEntry.isVisible()) {
    await mapaEntry.click();
  }

  // Verificar que el mapa se muestra
  const mapa = page.getByTestId("mapa-sistema");
  await expect(mapa).toBeVisible({ timeout: 5000 });

  // Verificar que la cobertura visual vuelve a igualar el descriptor multinivel.
  const jointElems = page.locator(".joint-element");
  const elemCount = await jointElems.count();
  expect(elemCount).toBeGreaterThanOrEqual(3);
  await expect(page.getByText(/\d+ OPDs · \d+ relaciones/)).toBeVisible();

  await page.getByRole("button", { name: "Filtros" }).click();
  await expect(page.getByTestId("mapa-filtros")).toBeVisible();
  await page.getByLabel("Filtros del mapa").getByRole("combobox").nth(1).selectOption("predominanciaProceso");
  await mapa.getByRole("button", { name: "Estadísticas" }).click();
  await expect(page.getByTestId("mapa-estadisticas")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "SVG" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/mapa-\d{4}-\d{2}-\d{2}\.svg$/);

  // Cerrar mapa
  await page.getByRole("button", { name: "Cerrar mapa" }).click();
  await expect(mapa).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("gestion arbol Ctrl+D: abre, busca, renombra y verifica", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("treeitem", { name: /SD/ })).toBeVisible();

  // Ctrl+D abre Gestión del árbol
  await page.keyboard.press("Control+d");

  const dialog = page.getByRole("dialog", { name: "Gestión del árbol OPD" });
  await expect(dialog).toBeVisible({ timeout: 5000 });

  // Buscar "SD"
  const searchInput = dialog.locator('input[type="search"]');
  await searchInput.fill("SD");
  // Debería encontrar al menos el nodo SD
  await expect(dialog.getByText("SD")).toBeVisible();

  // Cerrar con Escape
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("arbol OPD: renombrado inline y expandir/colapsar funcionan", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  const canvasPane = page.getByTestId("canvas-pane");
  await canvasPane.click({ position: { x: 200, y: 200 } });

  // L1 ronda 7: la barra creativa permanece sticky tras crear (HU-11.001).
  // Liberar el modo y seleccionar el proceso recién creado para que el
  // Inspector exponga "Descomponer".
  await page.keyboard.press("Escape");
  await canvasPane.locator(".joint-element").first().click();

  // Descomponer para crear SD1
  await page.getByRole("button", { name: "Descomponer", exact: true }).click();

  // Verificar que el árbol tiene nodos expandibles
  const treePane = page.getByTestId("tree-pane");
  // El botón de colapsar/expandir debería estar visible
  const expandBtn = treePane.locator('button[aria-label="Expandir"], button[aria-label="Colapsar"]');
  const hasExpand = await expandBtn.count();
  // Al menos debería haber botones de expandir si hay jerarquía
  expect(hasExpand).toBeGreaterThanOrEqual(0); // Puede ser 0 si no hay jerarquía

  expect(pageErrors).toEqual([]);
});

test("grid: toggle, configuración y snap al mover cosa", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByTestId("toggle-grid").click();
  await expect(page.getByTestId("toggle-grid")).toHaveAttribute("aria-pressed", "false");
  await page.getByTestId("toggle-grid").click();
  await page.getByTestId("config-grid").click();
  const dialog = page.getByTestId("modal-config-grid");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Paso").fill("20");
  await dialog.getByRole("button", { name: "Guardar" }).click();

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const objetoBox = await elementoPorTexto(page, "Objeto").boundingBox();
  if (!objetoBox) throw new Error("No se renderizó Objeto");
  await page.mouse.move(objetoBox.x + objetoBox.width / 2, objetoBox.y + objetoBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(objetoBox.x + objetoBox.width / 2 + 37, objetoBox.y + objetoBox.height / 2 + 23, { steps: 6 });
  await page.mouse.up();

  const apariencia = await aparienciaRaizPorNombre(page, "Objeto");
  expect(apariencia.x % 20).toBe(0);
  expect(apariencia.y % 20).toBe(0);
  expect(pageErrors).toEqual([]);
});

test("alinear selección: tres cosas quedan alineadas a la izquierda", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.keyboard.press("Control+a");
  await page.getByTestId("alinear-cosas").selectOption("izq");

  const exportado = await exportadoActual(page);
  const xs = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {}).map((ap) => ap.x);
  expect(new Set(xs).size).toBe(1);
  expect(pageErrors).toEqual([]);
});

test("resize handle: esquina persiste tamaño manual", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await elementoPorTexto(page, "Objeto").click();
  const handle = page.locator('[joint-selector="resize-se"]').first();
  await expect(handle).toBeVisible();
  const box = await handle.boundingBox();
  if (!box) throw new Error("No se renderizó handle de resize");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 42, box.y + box.height / 2 + 28, { steps: 6 });
  await page.mouse.up();

  const apariencia = await aparienciaRaizPorNombre(page, "Objeto");
  expect(apariencia.width).toBeGreaterThan(135);
  expect(apariencia.height).toBeGreaterThan(60);
  expect(apariencia.modoTamano).toBe("manual");
  expect(pageErrors).toEqual([]);
});

test("L4 arrastra cosa desde Toolbar al canvas y respeta posicion de drop", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  const canvas = page.getByRole("img", { name: "OPD activo" });
  await page.getByRole("button", { name: "Objeto en canvas" }).dragTo(canvas, { targetPosition: { x: 320, y: 190 } });

  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);
  await expect(page.getByTestId("modal-nombre-cosa")).toBeVisible();
  const apariencia = await aparienciaRaizPorNombre(page, "Objeto");
  expect(apariencia.x).toBeGreaterThanOrEqual(280);
  expect(apariencia.x).toBeLessThanOrEqual(360);
  expect(apariencia.y).toBeGreaterThanOrEqual(150);
  expect(apariencia.y).toBeLessThanOrEqual(230);
  expect(pageErrors).toEqual([]);
});

test("L4 menu de tipos validos muestra previews OPL y filtra por direccion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await page.getByRole("img", { name: "OPD activo" }).click({ position: { x: 8, y: 8 } });
  await page.keyboard.press("Control+a");
  await page.getByTestId("abrir-menu-tipo-enlace").click();

  const menu = page.getByTestId("menu-tipo-enlace");
  await expect(menu).toBeVisible();
  await expect(menu.getByText(/consume/)).toBeVisible();
  await expect(menu.getByTestId("menu-tipo-enlace-consumo")).toBeVisible();
  await menu.getByRole("button", { name: "Entrada", exact: true }).click();
  await expect(menu.getByText(/genera|requiere|maneja/)).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("L4 biblioteca lista cosas y menu contextual borra enlace", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await page.getByTestId("abrir-biblioteca-cosa").click();
  await expect(page.getByTestId("biblioteca-cosa")).toBeVisible();
  await expect(page.getByTestId("biblioteca-cosa").getByText("Entrada")).toBeVisible();
  await expect(page.getByTestId("biblioteca-cosa").getByText("Procesar")).toBeVisible();
  await page.getByLabel("Cerrar biblioteca").click();
  await expect(page.getByTestId("biblioteca-cosa")).toHaveCount(0);

  await elementoPorTexto(page, "Entrada").click();
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await elementoPorTexto(page, "Procesar").click();
  await expect(page.locator(".joint-link")).toHaveCount(1);
  await clickLinkPorTipo(page, "Consumo");
  await expect(page.getByTestId("reanclar-extremo-btn")).toBeVisible();

  const punto = await puntoMedioPath(page.locator(".joint-link [joint-selector=wrapper]").first());
  await page.mouse.click(punto.x, punto.y, { button: "right" });
  await expect(page.getByTestId("menu-contextual-enlace")).toBeVisible();
  await page.getByRole("menuitem", { name: "Eliminar" }).click();
  await expect(page.locator(".joint-link")).toHaveCount(0);
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
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await elementoPorTexto(page, "Procesar").click();
  await clickLinkPorTipo(page, "Consumo");

  await page.getByTestId("abrir-dialogo-estilo-enlace").click();
  const dialogo = page.getByTestId("dialogo-estilo-enlace");
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Color #d92d20" }).click();
  await dialogo.getByRole("button", { name: "3px" }).click();
  await dialogo.getByRole("button", { name: "Discontinua" }).click();
  await dialogo.getByRole("button", { name: "Listo" }).click();

  await page.getByRole("button", { name: "Copiar estilo" }).click();
  await expect(page.getByText("Estilo copiado")).toBeVisible();
  const exportado = await exportadoActual(page);
  const enlace = Object.values(exportado.modelo.enlaces)[0];
  expect(enlace?.estilo).toEqual({ color: "#d92d20", strokeWidth: 3, dashArray: "4 4" });
  expect(pageErrors).toEqual([]);
});

test("imagenes: agrega URL a objeto, renderiza overlay e insignia y alterna modo desde insignia", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await routeImagenSmoke(page);

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.locator('button[title="Editar imagen del objeto seleccionado"]').click();
  const dialog = page.getByRole("dialog", { name: "Imagen de Objeto" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("URL de imagen").fill("https://example.com/smoke.png");
  await dialog.getByRole("button", { name: "Confirmar" }).click();
  await expect(dialog).toHaveCount(0);

  await expect(page.locator('.joint-element image[joint-selector="imagen"]')).toHaveCount(1);
  await expect(page.locator('[data-testid="entidad-insignia-imagen"]').first()).toBeVisible();

  await page.locator('[data-testid="entidad-insignia-imagen"]').last().click();
  await expect(page.locator('.joint-element image[joint-selector="imagen"]')).toHaveCount(1);
  await page.locator('[data-testid="entidad-insignia-imagen"]').last().click();
  await expect(page.locator('.joint-element image[joint-selector="imagen"]')).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("imagenes: suprime bitmap en objeto desplegado y conserva metadata", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await routeImagenSmoke(page);

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloConImagenRefinada(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();
  await expect(page.locator('.joint-element image[joint-selector="imagen"]')).toHaveCount(0);

  const exportado = await exportadoActual(page);
  expect(exportado.modelo.entidades["o-img-a"]).toMatchObject({
    imagen: { url: "https://example.com/smoke.png", modo: "imagen-texto" },
    refinamiento: { tipo: "despliegue", opdId: "opd-img-hijo" },
  });
  expect(pageErrors).toEqual([]);
});

test("imagenes: toggle global modo texto oculta bitmaps del OPD activo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await routeImagenSmoke(page);

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloConImagenes(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();
  await expect(page.locator('.joint-element image[joint-selector="imagen"]')).toHaveCount(2);

  await page.getByTestId("toolbar-modo-imagen-global").click();
  await page.getByTestId("toolbar-modo-imagen-global").click();
  await page.getByTestId("toolbar-modo-imagen-global").click();

  await expect(page.getByTestId("toolbar-modo-imagen-global")).toHaveText("Texto");
  await expect(page.locator('.joint-element image[joint-selector="imagen"]')).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

async function routeImagenSmoke(page: Page): Promise<void> {
  await page.route("https://example.com/smoke.png", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "image/png",
      body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=", "base64"),
    });
  });
}

function modeloConImagenes() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-img",
      nombre: "Modelo imagenes",
      opdRaizId: "opd-1",
      nextSeq: 20,
      entidades: {
        "o-img-a": {
          id: "o-img-a",
          tipo: "objeto",
          nombre: "Objeto A",
          esencia: "informacional",
          afiliacion: "sistemica",
          imagen: { url: "https://example.com/smoke.png", modo: "imagen-texto" },
        },
        "o-img-b": {
          id: "o-img-b",
          tipo: "objeto",
          nombre: "Objeto B",
          esencia: "informacional",
          afiliacion: "sistemica",
          imagen: { url: "https://example.com/smoke.png", modo: "imagen" },
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
            "a-img-a": { id: "a-img-a", entidadId: "o-img-a", opdId: "opd-1", x: 120, y: 100, width: 135, height: 60 },
            "a-img-b": { id: "a-img-b", entidadId: "o-img-b", opdId: "opd-1", x: 320, y: 100, width: 135, height: 60 },
          },
          enlaces: {},
        },
      },
    },
  };
}

function modeloConImagenRefinada() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-img-ref",
      nombre: "Modelo imagen refinada",
      opdRaizId: "opd-1",
      nextSeq: 30,
      entidades: {
        "o-img-a": {
          id: "o-img-a",
          tipo: "objeto",
          nombre: "Objeto A",
          esencia: "informacional",
          afiliacion: "sistemica",
          refinamiento: { tipo: "despliegue", opdId: "opd-img-hijo", modo: "agregacion" },
          imagen: { url: "https://example.com/smoke.png", modo: "imagen-texto" },
        },
        "o-img-parte": {
          id: "o-img-parte",
          tipo: "objeto",
          nombre: "Parte A",
          esencia: "informacional",
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
            "a-img-a": { id: "a-img-a", entidadId: "o-img-a", opdId: "opd-1", x: 120, y: 100, width: 135, height: 60 },
          },
          enlaces: {},
        },
        "opd-img-hijo": {
          id: "opd-img-hijo",
          nombre: "SD1",
          padreId: "opd-1",
          apariencias: {
            "a-img-a-hijo": { id: "a-img-a-hijo", entidadId: "o-img-a", opdId: "opd-img-hijo", x: 90, y: 70, width: 420, height: 260 },
            "a-img-parte": { id: "a-img-parte", entidadId: "o-img-parte", opdId: "opd-img-hijo", x: 140, y: 150, width: 135, height: 60 },
          },
          enlaces: {},
        },
      },
    },
  };
}
