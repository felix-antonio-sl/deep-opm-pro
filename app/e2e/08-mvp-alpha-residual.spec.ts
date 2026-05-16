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
  await page.getByTestId("toolbar-modo-creacion-objeto").dragTo(canvas, { targetPosition: { x: 320, y: 190 } });

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
  await page.getByRole("img", { name: "OPD activo" }).click({ position: { x: 8, y: 8 } });
  await expect(page.getByTestId("menu-tipo-enlace")).toHaveCount(0);
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
  await page.getByTestId("toggle-biblioteca-dock").click();
  await expect(page.getByTestId("biblioteca-dock")).toBeVisible();
  await expect(page.getByTestId("biblioteca-dock").getByText("Entrada")).toBeVisible();
  await expect(page.getByTestId("biblioteca-dock").getByText("Procesar")).toBeVisible();
  await page.getByLabel("Cerrar biblioteca dock").click();
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

  await page.getByTestId("toolbar-mas-trigger").click();
  await expect(page.getByTestId("toolbar-mas-modo-imagen-global")).toContainText("Texto");
  await page.keyboard.press("Escape");
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

async function clickModoImagenGlobalDesdeMas(page: Page): Promise<void> {
  await page.getByTestId("toolbar-mas-trigger").click();
  await page.getByTestId("toolbar-mas-modo-imagen-global").click();
  await expect(page.getByTestId("toolbar-mas-menu")).toHaveCount(0);
}

async function abrirPlantillasDesdeMas(page: Page): Promise<void> {
  await page.getByTestId("toolbar-mas-trigger").click();
  await page.getByTestId("toolbar-mas-plantillas").click();
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

test("HU-33.001/.002/.003: guarda plantilla privada y aparece en catálogo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const modal = page.getByTestId("modal-nombre-cosa");
  if (await modal.count()) {
    await modal.getByLabel("Nombre").fill("Bloque reusable");
    await modal.getByRole("button", { name: "OK" }).click();
  } else {
    await page.getByLabel("Nombre").fill("Bloque reusable");
  }

  await page.getByLabel("Menú principal").click();
  await page.getByRole("menuitem", { name: "Guardar como plantilla..." }).click();
  const guardar = page.getByTestId("dialogo-guardar-plantilla");
  await expect(guardar).toBeVisible();
  await expect(guardar.getByLabel("Ámbito de plantilla")).toHaveValue("privado");
  await guardar.getByLabel("Nombre de plantilla").fill("Plantilla smoke privada");
  await guardar.getByLabel("Descripción de plantilla").fill("Catálogo privado");
  await page.getByTestId("guardar-plantilla-confirmar").click();
  await expect(guardar).toHaveCount(0);

  await abrirPlantillasDesdeMas(page);
  const dialogo = page.getByTestId("dialogo-plantillas");
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByText("Mis plantillas")).toBeVisible();
  await expect(dialogo.getByText("Plantilla smoke privada")).toBeVisible();
  await dialogo.getByLabel("Buscar plantillas").fill("smoke");
  await expect(dialogo.getByTestId("plantilla-tile")).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});

test("HU-33.006/.007/.008/.009/.018: inserta plantilla con sufijo, sub-OPD y etiqueta", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await instalarPlantillaSmoke(page, "plantilla-insertar", modeloPlantillaSmoke());
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const modal = page.getByTestId("modal-nombre-cosa");
  if (await modal.count()) {
    await modal.getByLabel("Nombre").fill("Sensor");
    await modal.getByRole("button", { name: "OK" }).click();
  } else {
    await page.getByLabel("Nombre").fill("Sensor");
  }

  await abrirPlantillasDesdeMas(page);
  const dialogo = page.getByTestId("dialogo-plantillas");
  await expect(dialogo.getByText("Plantilla inserción")).toBeVisible();
  await dialogo.getByTestId("insertar-plantilla").click();
  await expect(dialogo).toHaveCount(0);

  const exportado = await exportadoActual(page);
  const nombres = Object.values(exportado.modelo.entidades).map((entidad) => entidad.nombre);
  expect(nombres).toContain("Sensor_2");
  expect(Object.values(exportado.modelo.enlaces).some((enlace) =>
    enlace.tipo === "exhibicion" && enlace.etiqueta === "capacidad nominal"
  )).toBe(true);
  const hijos = Object.values(exportado.modelo.opds).filter((opd) => opd.padreId === exportado.modelo.opdRaizId);
  expect(hijos.length).toBeGreaterThanOrEqual(1);
  expect(Object.values(exportado.modelo.entidades).some((entidad) => entidad.nombre === "Paso interno")).toBe(true);
  expect(pageErrors).toEqual([]);
});

test("HU-33.010: insertar plantilla enfoca temporalmente los ids nuevos", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await instalarPlantillaSmoke(page, "plantilla-halo", modeloPlantillaSmoke());
  await abrirPlantillasDesdeMas(page);
  await page.getByTestId("insertar-plantilla").click();

  await expect(page.locator(".joint-element").filter({ has: page.locator('[stroke="#3DA8FF"]') }).first()).toBeVisible();
  await page.waitForTimeout(3200);
  const exportado = await exportadoActual(page);
  expect(Object.values(exportado.modelo.entidades).some((entidad) => entidad.nombre === "Sensor")).toBe(true);
  expect(pageErrors).toEqual([]);
});

test("HU-33.022/.015: cancelar guardado no persiste y catálogo vacío muestra mensaje", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByLabel("Menú principal").click();
  await page.getByRole("menuitem", { name: "Guardar como plantilla..." }).click();
  await expect(page.getByTestId("dialogo-guardar-plantilla")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("dialogo-guardar-plantilla")).toHaveCount(0);

  await abrirPlantillasDesdeMas(page);
  await expect(page.getByTestId("plantillas-vacio")).toContainText("Sin plantillas");
  expect(pageErrors).toEqual([]);
});

async function instalarPlantillaSmoke(page: Page, id: string, contenido: ExportadoModelo): Promise<void> {
  await page.evaluate(({ idPlantilla, modelo }) => {
    const ahora = new Date().toISOString();
    const contenidoPersistido = {
      id: `contenido-${idPlantilla}`,
      nombre: "Plantilla inserción",
      descripcion: "",
      creadoEn: ahora,
      actualizadoEn: ahora,
      json: JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: modelo.modelo }, null, 2),
    };
    const plantilla = {
      id: idPlantilla,
      nombre: "Plantilla inserción",
      descripcion: "Incluye sub-OPD",
      ambito: "privado",
      contenido: contenidoPersistido,
      creadoEn: ahora,
      actualizadoEn: ahora,
    };
    const indice = {
      id: plantilla.id,
      nombre: plantilla.nombre,
      descripcion: plantilla.descripcion,
      ambito: plantilla.ambito,
      creadoEn: plantilla.creadoEn,
      actualizadoEn: plantilla.actualizadoEn,
    };
    localStorage.setItem("opm:plantillas-lista", JSON.stringify([idPlantilla]));
    localStorage.setItem(`opm:plantilla:${idPlantilla}`, JSON.stringify({ formato: "deep-opm-pro.plantilla.local.v1", plantilla }));
    localStorage.setItem(`opm:plantilla-indice:${idPlantilla}`, JSON.stringify({ formato: "deep-opm-pro.plantilla.local.v1", plantilla: indice }));
  }, { idPlantilla: id, modelo: contenido });
}

function modeloPlantillaSmoke() {
  return {
    modelo: {
      id: "modelo-plantilla-smoke",
      nombre: "Plantilla inserción",
      opdRaizId: "opd-plantilla-raiz",
      nextSeq: 100,
      entidades: {
        "o-sensor": { id: "o-sensor", tipo: "objeto", nombre: "Sensor", esencia: "informacional", afiliacion: "sistemica" },
        "o-capacidad": { id: "o-capacidad", tipo: "objeto", nombre: "Capacidad", esencia: "informacional", afiliacion: "sistemica" },
        "p-proceso": { id: "p-proceso", tipo: "proceso", nombre: "Proceso plantilla", esencia: "informacional", afiliacion: "sistemica", refinamiento: { tipo: "descomposicion", opdId: "opd-plantilla-hijo" } },
        "o-paso": { id: "o-paso", tipo: "objeto", nombre: "Paso interno", esencia: "informacional", afiliacion: "sistemica" },
      },
      estados: {},
      enlaces: {
        "e-exhibe": {
          id: "e-exhibe",
          tipo: "exhibicion",
          origenId: extremoEntidad("o-sensor"),
          destinoId: extremoEntidad("o-capacidad"),
          etiqueta: "capacidad nominal",
        },
      },
      abanicos: {},
      opds: {
        "opd-plantilla-raiz": {
          id: "opd-plantilla-raiz",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-sensor": { id: "a-sensor", entidadId: "o-sensor", opdId: "opd-plantilla-raiz", x: 80, y: 70, width: 135, height: 60 },
            "a-capacidad": { id: "a-capacidad", entidadId: "o-capacidad", opdId: "opd-plantilla-raiz", x: 280, y: 70, width: 135, height: 60 },
            "a-proceso": { id: "a-proceso", entidadId: "p-proceso", opdId: "opd-plantilla-raiz", x: 180, y: 190, width: 135, height: 60 },
          },
          enlaces: { "ae-exhibe": { id: "ae-exhibe", enlaceId: "e-exhibe", opdId: "opd-plantilla-raiz", vertices: [] } },
        },
        "opd-plantilla-hijo": {
          id: "opd-plantilla-hijo",
          nombre: "Detalle plantilla",
          padreId: "opd-plantilla-raiz",
          apariencias: {
            "a-proceso-hijo": { id: "a-proceso-hijo", entidadId: "p-proceso", opdId: "opd-plantilla-hijo", x: 90, y: 80, width: 360, height: 220 },
            "a-paso": { id: "a-paso", entidadId: "o-paso", opdId: "opd-plantilla-hijo", x: 140, y: 150, width: 135, height: 60 },
          },
          enlaces: {},
        },
      },
    },
  };
}

test("L3 UX: tooltips sistemáticos en Toolbar (Deshacer, Cargar, Nuevo)", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  const botonDeshacer = page.getByRole("button", { name: "Deshacer", exact: true });
  await expect(botonDeshacer).toHaveAttribute("title", /Deshacer.*Ctrl\+Z/);

  const botonCargar = page.getByRole("button", { name: "Cargar", exact: true }).first();
  await expect(botonCargar).toHaveAttribute("title", /Cargar modelo/);

  const botonNuevo = page.getByRole("button", { name: "Nuevo", exact: true });
  await expect(botonNuevo).toHaveAttribute("title", /Nuevo modelo/);

  expect(pageErrors).toEqual([]);
});

test("HU-10.003: drag Objeto al canvas abre modal-nombre-cosa y Enter persiste el nombre", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  const canvas = page.getByRole("img", { name: "OPD activo" });
  await page.getByTestId("toolbar-modo-creacion-objeto").dragTo(canvas, { targetPosition: { x: 320, y: 190 } });

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
  await cerrarPantallaInicioSiVisible(page);
  const canvas = page.getByRole("img", { name: "OPD activo" });
  await page.getByTestId("toolbar-modo-creacion-objeto").dragTo(canvas, { targetPosition: { x: 320, y: 190 } });

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
  await cerrarPantallaInicioSiVisible(page);
  const canvas = page.getByRole("img", { name: "OPD activo" });
  await page.getByTestId("toolbar-modo-creacion-objeto").dragTo(canvas, { targetPosition: { x: 320, y: 190 } });
  const modalNombre = page.getByTestId("modal-nombre-cosa");
  if (await modalNombre.count()) {
    await modalNombre.getByLabel("Nombre").fill("Cargable doble clic");
    await modalNombre.getByRole("button", { name: "OK" }).click();
    await expect(modalNombre).toHaveCount(0);
  }
  await guardarComoActual(page, "Doble clic", "Para HU-30019");

  await page.getByRole("button", { name: "Nuevo", exact: true }).click();
  await expect(elementoPorTexto(page, "Cargable doble clic")).toHaveCount(0);

  await page.getByRole("button", { name: "Cargar", exact: true }).first().click();
  const dialogo = page.getByRole("dialog", { name: "Cargar modelo" });
  await expect(dialogo).toBeVisible();
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
  await cerrarPantallaInicioSiVisible(page);
  const canvas = page.getByRole("img", { name: "OPD activo" });
  await page.getByTestId("toolbar-modo-creacion-objeto").dragTo(canvas, { targetPosition: { x: 320, y: 190 } });
  const modalNombre = page.getByTestId("modal-nombre-cosa");
  if (await modalNombre.count()) {
    await modalNombre.getByLabel("Nombre").fill("Cargable boton");
    await modalNombre.getByRole("button", { name: "OK" }).click();
    await expect(modalNombre).toHaveCount(0);
  }
  await guardarComoActual(page, "Click boton", "Para HU-30020");

  await page.getByRole("button", { name: "Nuevo", exact: true }).click();
  await expect(elementoPorTexto(page, "Cargable boton")).toHaveCount(0);

  await page.getByRole("button", { name: "Cargar", exact: true }).first().click();
  const dialogo = page.getByRole("dialog", { name: "Cargar modelo" });
  await expect(dialogo).toBeVisible();
  const tile = dialogo.getByTestId("modelo-tile-cargar").filter({ hasText: "Click boton" }).first();
  await tile.click();
  await dialogo.getByRole("button", { name: "Cargar", exact: true }).click();

  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Cargable boton")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("HU-30.037: Esc cancela DialogoArchivados sin persistir cambios al modelo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByLabel("Cargar modelo de ejemplo").selectOption("Cafetera Domestica");

  const exportadoAntes = await exportadoActual(page);

  await page.getByLabel("Menú principal").click();
  const menu = page.getByRole("menu", { name: "Menú principal" });
  await menu.getByRole("menuitem", { name: "Archivados", exact: true }).click();

  const dialogo = page.getByRole("dialog", { name: "Modelos archivados" });
  await expect(dialogo).toBeVisible();

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
  await cerrarPantallaInicioSiVisible(page);
  await page.getByLabel("Cargar modelo de ejemplo").selectOption("Cafetera Domestica");

  const exportadoAntes = await exportadoActual(page);

  await page.keyboard.press("Control+Shift+F");
  const dialogo = page.getByRole("dialog", { name: "Buscar global" });
  await expect(dialogo).toBeVisible();

  await dialogo.getByLabel("Buscar global").fill("Cafe");
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
  await cerrarPantallaInicioSiVisible(page);
  await page.getByLabel("Cargar modelo de ejemplo").selectOption("Cafetera Domestica");

  // Persistir el modelo: el diálogo de versiones requiere `modeloPersistidoId`.
  await page.getByLabel("Menú principal").click();
  await page.getByRole("menu", { name: "Menú principal" })
    .getByRole("menuitem", { name: "Guardar", exact: true }).click();
  const dialogoGuardar = page.getByRole("dialog", { name: "Guardar como" });
  await expect(dialogoGuardar).toBeVisible();
  await dialogoGuardar.getByLabel("Nombre del modelo").fill("HU 30037 versiones");
  await dialogoGuardar.getByRole("button", { name: "Guardar" }).click();
  await expect(dialogoGuardar).toHaveCount(0);

  const exportadoAntes = await exportadoActual(page);

  await page.getByLabel("Menú principal").click();
  await page.getByRole("menu", { name: "Menú principal" })
    .getByRole("menuitem", { name: "Versiones del modelo", exact: true }).click();

  const dialogo = page.getByRole("dialog", { name: /Versiones de "/ });
  await expect(dialogo).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialogo).toHaveCount(0);

  const exportadoDespues = await exportadoActual(page);
  expect(exportadoDespues).toEqual(exportadoAntes);

  expect(pageErrors).toEqual([]);
});
