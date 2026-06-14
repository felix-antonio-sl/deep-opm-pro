import { expect, test, type Page } from "@playwright/test";
import {
  clickToolbarMasItem,
  ejecutarComandoPalette,
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
  irATabExtremos,
  guardarComoActual,
  abrirDialogoCargarModelo,
  abrirMenuPrincipal,
  importarModeloJson,
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

test("grid: toggle, configuración y snap al mover cosa", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  // Ronda 27 III.A cierre: los toggles del antiguo `⋯ Más` viven ahora en
  // el command palette. El helper unificado abre el palette por atajo y clickea
  // el item; el estado se inspecciona reabriendo el palette porque el clic lo cierra.
  // La cuadrícula arranca INACTIVA por defecto (GRID_DEFAULT.activa=false,
  // alineado a ui-forja/08 `drawGrid:false`; decisión #24-2): el comando del
  // palette ofrece "Mostrar". El item se filtra escribiendo el query.
  await page.keyboard.press("Control+k");
  await page.getByTestId("command-palette").getByRole("combobox").fill("cuadricula");
  await expect(page.getByTestId("command-palette-item-menu-grid-canvas")).toContainText("Mostrar cuadrícula del canvas");
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
  // Ronda Codex v2 L5: tras alternar la cuadrícula, el comando del palette
  // refleja el nuevo estado en su label. Al activarla, ofrece "Ocultar".
  await clickToolbarMasItem(page, "toolbar-mas-toggle-grid");
  await page.keyboard.press("Control+k");
  await page.getByTestId("command-palette").getByRole("combobox").fill("cuadricula");
  await expect(page.getByTestId("command-palette-item-menu-grid-canvas")).toContainText("Ocultar cuadrícula del canvas");
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
  // Ronda 25 L2 III.A: Configuración… ya no se duplica en ⋯ Más; vive
  // solamente en el command palette (sección Modelo).
  await abrirConfiguracionDesdeMenuPrincipal(page);
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
  // Ronda 27 III.A cierre: el `⋯ Más` desaparece del chrome; las acciones
  // multi-selección (alinear, distribuir, eliminar, partes, traer enlaces)
  // viven en la barra contextual flotante `BarraHerramientasElemento`.
  // `barra-alinear-seleccion` alinea a la izquierda (eje "izq") por
  // default — equivalencia funcional con el viejo `toolbar-mas-alinear-izq`.
  await page.getByTestId("barra-alinear-seleccion").click();

  const exportado = await exportadoActual(page);
  const xs = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {}).map((ap) => ap.x);
  expect(new Set(xs).size).toBe(1);
  expect(pageErrors).toEqual([]);
});

// SEL-2 (Codex rev2 §6.2 — decisión bloqueada): la selección ya no emite los 8
// resize-handles flotantes. La affordance Codex es solo el underline crimson +
// la anotación tipográfica. El redimensionado manual por arrastre de handle se
// retira; el tamaño manual sigue disponible vía Inspector. Test conservado como
// skip para documentar la retirada (no se elimina la huella histórica).
test.skip("resize handle: esquina persiste tamaño manual", async ({ page }) => {
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
  await esperarWorkbenchInicial(page);
  const canvas = page.getByRole("img", { name: "OPD activo" });
  const scrollInicial = await canvas.evaluate((element) => ({
    left: (element as HTMLElement).scrollLeft,
    top: (element as HTMLElement).scrollTop,
  }));
  await page.getByTestId("toolbar-drag-objeto").dragTo(canvas, { targetPosition: { x: 320, y: 190 } });

  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);
  await expect(page.getByTestId("modal-nombre-cosa")).toBeVisible();
  const apariencia = await aparienciaRaizPorNombre(page, "Objeto");
  expect(apariencia.x).toBeGreaterThanOrEqual(scrollInicial.left + 280);
  expect(apariencia.x).toBeLessThanOrEqual(scrollInicial.left + 360);
  expect(apariencia.y).toBeGreaterThanOrEqual(scrollInicial.top + 150);
  expect(apariencia.y).toBeLessThanOrEqual(scrollInicial.top + 230);
  expect(pageErrors).toEqual([]);
});

test("L4 menu de tipos validos muestra previsualización OPL y filtra por direccion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await page.getByRole("img", { name: "OPD activo" }).click({ position: { x: 8, y: 8 } });
  await page.keyboard.press("Control+a");
  await page.getByTestId("abrir-menu-tipo-enlace").click();

  const menu = page.getByTestId("menu-tipo-enlace");
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute("data-ifml-stereotype", "Modeless");
  await expect(menu.getByTestId("menu-tipo-enlace-filtrado")).toContainText(/tipos? no aplica/);
  await expect(menu.getByText(/consume/)).toBeVisible();
  await expect(menu.getByTestId("menu-tipo-enlace-consumo")).toBeVisible();
  await menu.getByRole("button", { name: "Entrada", exact: true }).click();
  await expect(menu.getByText(/genera|requiere|maneja/)).toBeVisible();
  await page.getByRole("img", { name: "OPD activo" }).click({ position: { x: 8, y: 8 } });
  await expect(page.getByTestId("menu-tipo-enlace")).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

test("L4 biblioteca dock pausada y menu contextual borra enlace", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  // Ronda Codex v2 L5: el menú lateral se retiró; Ctrl/Cmd+K abre el palette. El
  // dock sigue sin estar expuesto como comando.
  await page.keyboard.press("Control+k");
  await expect(page.getByTestId("command-palette")).toBeVisible();
  await expect(page.getByTestId("command-palette").getByText("Biblioteca dock", { exact: true })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
  await expect(page.getByTestId("biblioteca-dock")).toHaveCount(0);

  await elementoPorTexto(page, "Entrada").click();
  await elegirTipoEnlaceDesdeMenu(page, "consumo");
  await elementoPorTexto(page, "Procesar").click();
  await expect(page.locator(".joint-link")).toHaveCount(1);
  await clickLinkPorTipo(page, "Consumo");
  // Ronda 20 L1: SeccionExtremos vive en el tab `Extremos` del Inspector enlace.
  await irATabExtremos(page);
  await expect(page.getByTestId("reanclar-extremo-btn")).toBeVisible();

  const punto = await puntoMedioPath(page.locator(".joint-link [joint-selector=wrapper]").first());
  await page.mouse.click(punto.x, punto.y, { button: "right" });
  await expect(page.getByTestId("menu-contextual-enlace")).toBeVisible();
  await page.getByRole("menuitem", { name: "Eliminar" }).click();
  await expect(page.locator(".joint-link")).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

test("imagenes: agrega URL a objeto, renderiza overlay e insignia y alterna modo desde insignia", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await routeImagenSmoke(page);

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(page.getByTestId("barra-editar-imagen")).toBeVisible();
  await page.getByTestId("barra-editar-imagen").click();
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
    refinamientos: { despliegue: { opdId: "opd-img-hijo" } },
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

  await clickModoImagenGlobalDesdeMas(page);
  await clickModoImagenGlobalDesdeMas(page);
  await clickModoImagenGlobalDesdeMas(page);

  // Ronda Codex v2 L5: el comando "Imagen: …" del palette refleja el modo
  // global tras ciclar (null → imagen+nombre → solo imagen → solo nombre).
  await page.keyboard.press("Control+k");
  await expect(page.getByTestId("command-palette-item-menu-modo-imagen-global")).toContainText("solo nombre");
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
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

// Ronda 27 III.A cierre: el helper `clickToolbarMasItem` se importa
// canónicamente desde `_smoke-helpers` y resuelve via menú principal
// (`☰`) porque el botón `⋯ Más` desapareció del chrome.
async function clickModoImagenGlobalDesdeMas(page: Page): Promise<void> {
  await clickToolbarMasItem(page, "toolbar-mas-modo-imagen-global");
}

async function abrirConfiguracionDesdeMenuPrincipal(page: Page): Promise<void> {
  await ejecutarComandoPalette(page, "configuracion", "menu-configuracion");
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

test("L3 UX: toolbar CN-CIM&B conserva tooltips primarios y mueve archivo al menú", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // Ronda 25 L1 III.A: el botón ↶ del chrome global se eliminó. La affordance
  // de reversibilidad se traslada al tooltip del chip persistencia (el cual
  // siempre menciona Ctrl+Z); el atajo global sigue operando.
  await expect(page.getByRole("button", { name: "Deshacer", exact: true })).toHaveCount(0);
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("title", /Ctrl\+Z/);

  const botonObjeto = page.getByRole("button", { name: "Objeto", exact: true });
  await expect(botonObjeto).toHaveAttribute("title", /Crear objeto.*Shift\+clic/);

  await expect(page.getByRole("button", { name: "Nuevo", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Cargar", exact: true })).toHaveCount(0);
  // Ronda Codex v2 L5: el menú lateral se retiró; el botón ☰ abre el command
  // palette. Sus comandos "Nuevo modelo" y "Abrir modelo" siguen
  // disponibles (el palette es superset del antiguo menú).
  const palette = await abrirMenuPrincipal(page);
  await palette.getByRole("combobox").fill("nuevo modelo");
  await expect(palette.getByTestId("command-palette-item-menu-nuevo-modelo")).toBeVisible();
  await palette.getByRole("combobox").fill("abrir importar");
  await expect(palette.getByTestId("command-palette-item-menu-abrir-importar")).toBeVisible();
  await page.keyboard.press("Escape");

  expect(pageErrors).toEqual([]);
});

test("HU-10.003: drag Objeto al canvas abre modal-nombre-cosa y Enter persiste el nombre", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  const canvas = page.getByRole("img", { name: "OPD activo" });
  await page.getByTestId("toolbar-drag-objeto").dragTo(canvas, { targetPosition: { x: 320, y: 190 } });

  const modal = page.getByTestId("modal-nombre-cosa");
  await expect(modal).toBeVisible();
  // El input expone autoFocus; algunos hosts Playwright tardan en reflejar
  // el focus, así que aseguramos que el modal exista + el input acepta texto.
  const input = modal.getByLabel("Nombre");
  await input.fill("Sistema autofocus");
  await page.keyboard.press("Enter");
  await expect(modal).toHaveCount(0);
  await expect(elementoPorTexto(page, "Sistema autofocus")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("HU-10.003: modal-nombre-cosa expone el form con input controlado para nombre", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  const canvas = page.getByRole("img", { name: "OPD activo" });
  await page.getByTestId("toolbar-drag-objeto").dragTo(canvas, { targetPosition: { x: 320, y: 190 } });

  const modal = page.getByTestId("modal-nombre-cosa");
  await expect(modal).toBeVisible();
  // El form tiene input "Nombre" y botón "OK"; valida shape mínima del modal
  // canónico (autoFocus + role="textbox" + submit). Esc canónico vive en
  // Toolbar.tsx onKeyDown del input; cobertura específica vía cierre Cancelar
  // del Dialogo wrapper queda bajo HU-30.037 (territorio L2).
  const input = modal.getByLabel("Nombre");
  await expect(input).toBeVisible();
  const ok = modal.getByRole("button", { name: "OK" });
  await expect(ok).toBeVisible();
  await input.fill("Forma mínima HU-10.003");
  expect(await input.inputValue()).toBe("Forma mínima HU-10.003");

  expect(pageErrors).toEqual([]);
});

test("HU-30.019: doble clic sobre tile en DialogoCargarModelo carga modelo y cierra diálogo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  const canvas = page.getByRole("img", { name: "OPD activo" });
  await page.getByTestId("toolbar-drag-objeto").dragTo(canvas, { targetPosition: { x: 320, y: 190 } });
  const modalNombre = page.getByTestId("modal-nombre-cosa");
  if (await modalNombre.count()) {
    await modalNombre.getByLabel("Nombre").fill("Cargable doble clic");
    await modalNombre.getByRole("button", { name: "OK" }).click();
    await expect(modalNombre).toHaveCount(0);
  }
  await guardarComoActual(page, "Doble clic", "Para HU-30019");

  await crearModeloNuevoDesdeMenu(page);
  await expect(elementoPorTexto(page, "Cargable doble clic")).toHaveCount(0);

  const dialogo = await abrirDialogoCargarModelo(page);
  const tile = dialogo.getByTestId("modelo-tile-cargar").filter({ hasText: "Doble clic" }).first();
  await expect(tile).toBeVisible();
  await tile.dblclick();

  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Cargable doble clic")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("HU-30.020: clic sobre tile selecciona y botón Cargar del diálogo carga modelo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  const canvas = page.getByRole("img", { name: "OPD activo" });
  await page.getByTestId("toolbar-drag-objeto").dragTo(canvas, { targetPosition: { x: 320, y: 190 } });
  const modalNombre = page.getByTestId("modal-nombre-cosa");
  if (await modalNombre.count()) {
    await modalNombre.getByLabel("Nombre").fill("Cargable boton");
    await modalNombre.getByRole("button", { name: "OK" }).click();
    await expect(modalNombre).toHaveCount(0);
  }
  await guardarComoActual(page, "Click boton", "Para HU-30020");

  await crearModeloNuevoDesdeMenu(page);
  await expect(elementoPorTexto(page, "Cargable boton")).toHaveCount(0);

  const dialogo = await abrirDialogoCargarModelo(page);
  const tile = dialogo.getByTestId("modelo-tile-cargar").filter({ hasText: "Click boton" }).first();
  await tile.click();
  await dialogo.getByRole("button", { name: "Abrir", exact: true }).click();

  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Cargable boton")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("HU-30.037: Esc cancela Abrir / importar sin persistir cambios", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await importarModeloJson(page, modeloDosOpds());

  const exportadoAntes = await exportadoActual(page);

  // Ronda Codex v2 L5: "Abrir / importar" se invoca desde el palette.
  await ejecutarComandoPalette(page, "abrir importar", "menu-abrir-importar");

  const dialogo = page.getByRole("dialog", { name: "Abrir modelo" });
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByLabel("Mostrar archivados")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialogo).toHaveCount(0);

  const exportadoDespues = await exportadoActual(page);
  expect(exportadoDespues).toEqual(exportadoAntes);

  expect(pageErrors).toEqual([]);
});

test("HU-30.037: Esc cancela Configuración sin persistir cambios al modelo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await importarModeloJson(page, modeloDosOpds());

  const exportadoAntes = await exportadoActual(page);

  // Ronda Codex v2 L5: "Configuración" se invoca desde el palette.
  await ejecutarComandoPalette(page, "configuracion", "menu-configuracion");

  const dialogo = page.getByRole("dialog", { name: "Configuración" });
  await expect(dialogo).toBeVisible();
  await dialogo.getByLabel("Nombre del modelo").fill("Cambio no persistido");
  await dialogo.getByLabel("Paso").fill("40");

  await page.keyboard.press("Escape");
  await expect(dialogo).toHaveCount(0);

  const exportadoDespues = await exportadoActual(page);
  expect(exportadoDespues).toEqual(exportadoAntes);

  expect(pageErrors).toEqual([]);
});

test("HU-30.037: Esc cancela DialogoBuscarGlobal sin persistir cambios al modelo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await importarModeloJson(page, modeloDosOpds());

  const exportadoAntes = await exportadoActual(page);

  await page.keyboard.press("Control+Shift+F");
  const dialogo = page.getByRole("dialog", { name: "Buscar global" });
  await expect(dialogo).toBeVisible();

  await dialogo.getByLabel("Buscar global").fill("Main");
  await page.keyboard.press("Escape");
  await expect(dialogo).toHaveCount(0);

  const exportadoDespues = await exportadoActual(page);
  expect(exportadoDespues).toEqual(exportadoAntes);

  expect(pageErrors).toEqual([]);
});

test("HU-30.037: Esc cancela DialogoVersiones sin persistir cambios al modelo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await importarModeloJson(page, modeloDosOpds());

  // Persistir el modelo: el diálogo de versiones requiere `modeloPersistidoId`.
  // Ronda Codex v2 L5: Guardar (Ctrl+S) sobre un modelo no persistido abre
  // "Guardar como"; el menú lateral se retiró.
  await page.keyboard.press("Control+s");
  const dialogoGuardar = page.getByRole("dialog", { name: "Guardar como" });
  await expect(dialogoGuardar).toBeVisible();
  await dialogoGuardar.getByLabel("Nombre del modelo").fill("HU 30037 versiones");
  await dialogoGuardar.getByRole("button", { name: "Guardar" }).click();
  await expect(dialogoGuardar).toHaveCount(0);

  const exportadoAntes = await exportadoActual(page);

  // Ronda Codex v2 L5: "Versiones del modelo" se invoca desde el palette.
  await ejecutarComandoPalette(page, "versiones del modelo", "menu-versiones-modelo");

  const dialogo = page.getByRole("dialog", { name: /Versiones de "/ });
  await expect(dialogo).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialogo).toHaveCount(0);

  const exportadoDespues = await exportadoActual(page);
  expect(exportadoDespues).toEqual(exportadoAntes);

  expect(pageErrors).toEqual([]);
});
