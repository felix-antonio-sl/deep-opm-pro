// Helpers compartidos para smokes Playwright (extraídos de opm-smoke.spec.ts
// en ronda 13.0 T1.4 steipete; movimiento mecánico, lógica intacta).

import { expect, type Page } from "@playwright/test";

export function elementoPorTexto(page: import("@playwright/test").Page, texto: string): import("@playwright/test").Locator {
  const flexibleSvgText = new RegExp(`^\\s*${texto.trim().split(/\s+/).map(escapeRegExp).join("\\s*")}\\s*$`);
  return page.locator(".joint-element").filter({
    has: page.locator("text").filter({ hasText: flexibleSvgText }),
  });
}

export function escapeRegExp(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function modeloTraerConectadosSmoke() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-traer",
      nombre: "Modelo traer conectados",
      opdRaizId: "opd-1",
      nextSeq: 20,
      entidades: {
        "o-instrumento": { id: "o-instrumento", tipo: "objeto", nombre: "Instrumento", esencia: "informacional", afiliacion: "sistemica" },
        "p-procesar": { id: "p-procesar", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
        "o-resultado": { id: "o-resultado", tipo: "objeto", nombre: "Resultado", esencia: "informacional", afiliacion: "sistemica" },
        "o-externo": { id: "o-externo", tipo: "objeto", nombre: "Externo", esencia: "informacional", afiliacion: "sistemica" },
      },
      estados: {},
      enlaces: {
        "e-instrumento": {
          id: "e-instrumento",
          tipo: "instrumento",
          origenId: { kind: "entidad", id: "o-instrumento" },
          destinoId: { kind: "entidad", id: "p-procesar" },
          etiqueta: "",
        },
        "e-resultado": {
          id: "e-resultado",
          tipo: "resultado",
          origenId: { kind: "entidad", id: "p-procesar" },
          destinoId: { kind: "entidad", id: "o-resultado" },
          etiqueta: "",
        },
        "e-externo": {
          id: "e-externo",
          tipo: "agregacion",
          origenId: { kind: "entidad", id: "o-resultado" },
          destinoId: { kind: "entidad", id: "o-externo" },
          etiqueta: "",
        },
      },
      abanicos: {},
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-instrumento-root": { id: "a-instrumento-root", entidadId: "o-instrumento", opdId: "opd-1", x: 80, y: 90, width: 135, height: 60 },
            "a-procesar-root": { id: "a-procesar-root", entidadId: "p-procesar", opdId: "opd-1", x: 280, y: 170, width: 135, height: 60 },
            "a-resultado-root": { id: "a-resultado-root", entidadId: "o-resultado", opdId: "opd-1", x: 480, y: 90, width: 135, height: 60 },
            "a-externo-root": { id: "a-externo-root", entidadId: "o-externo", opdId: "opd-1", x: 680, y: 90, width: 135, height: 60 },
          },
          enlaces: {
            "ae-instrumento-root": { id: "ae-instrumento-root", enlaceId: "e-instrumento", opdId: "opd-1", vertices: [] },
            "ae-resultado-root": { id: "ae-resultado-root", enlaceId: "e-resultado", opdId: "opd-1", vertices: [] },
            "ae-externo-root": { id: "ae-externo-root", enlaceId: "e-externo", opdId: "opd-1", vertices: [] },
          },
        },
        "opd-traer": {
          id: "opd-traer",
          nombre: "Traer",
          padreId: "opd-1",
          apariencias: {
            "a-procesar": { id: "a-procesar", entidadId: "p-procesar", opdId: "opd-traer", x: 280, y: 170, width: 135, height: 60 },
          },
          enlaces: {},
        },
      },
    },
  };
}

export async function esperarWorkbenchInicial(page: import("@playwright/test").Page): Promise<void> {
  await expect(page.getByTestId("toolbar-root")).toBeVisible();
  await expect(page.getByTestId("canvas-pane")).toBeVisible();
}

export async function restaurarPanelOplSiMinimizado(page: import("@playwright/test").Page): Promise<void> {
  const restaurar = page.getByTestId("panel-opl-restaurar");
  if (await restaurar.count() > 0) {
    await restaurar.click();
    await expect(page.getByTestId("panel-opl-minimizado")).toHaveCount(0);
  }
}

export async function crearAtributoNumericoSmoke(page: import("@playwright/test").Page): Promise<void> {
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const modal = page.getByTestId("modal-nombre-cosa");
  if (await modal.count() > 0) {
    await expect(modal).toBeVisible();
    await modal.getByLabel("Nombre").fill("Sistema");
    await modal.getByRole("button", { name: "OK" }).click();
    await expect(modal).toHaveCount(0);
  } else {
    await page.getByLabel("Nombre").fill("Sistema");
  }

  await page.getByTestId("toolbar-crear-atributo-numerico").click();
  await expect(page.getByTestId("inspector-seccion-atributo")).toBeVisible();
  await page.getByLabel("Nombre").fill("Temperatura [°C]");
}

export async function rectDeLocator(locator: import("@playwright/test").Locator): Promise<{ x: number; y: number; width: number; height: number }> {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
}

export async function clickCabeceraElemento(page: import("@playwright/test").Page, texto: string): Promise<void> {
  const target = elementoPorTexto(page, texto);
  const rect = await rectDeLocator(target);
  await target.click({
    position: { x: rect.width / 2, y: Math.min(14, rect.height / 3) },
    force: true,
  });
}

export async function clickCentroLink(page: import("@playwright/test").Page): Promise<void> {
  const punto = await puntoMedioPath(page.locator(".joint-link [joint-selector=wrapper]"));
  await page.mouse.click(punto.x, punto.y);
}

export async function clickLinkPorIndice(page: import("@playwright/test").Page, index: number): Promise<void> {
  const link = page.locator(".joint-link [joint-selector=wrapper]").nth(index);
  await link.scrollIntoViewIfNeeded();
  const punto = await puntoMedioPath(link);
  await page.mouse.click(punto.x, punto.y);
}

export async function clickLinkPorTipo(page: import("@playwright/test").Page, tipo: string): Promise<void> {
  const links = page.locator(".joint-link [joint-selector=wrapper]");
  const total = await links.count();
  for (let index = 0; index < total; index += 1) {
    const link = links.nth(index);
    await link.scrollIntoViewIfNeeded();
    const punto = await puntoMedioPath(link);
    await page.mouse.click(punto.x, punto.y);
    if (await page.getByText(`Enlace ${tipo}`).count() > 0) return;
  }
  throw new Error(`No se pudo seleccionar enlace ${tipo}`);
}

export async function elegirTipoEnlaceDesdeMenu(page: import("@playwright/test").Page, tipo: string): Promise<void> {
  const trigger = page.getByTestId("abrir-menu-tipo-enlace");
  await expect(trigger).toBeEnabled();
  await trigger.click();
  const opcion = page.getByTestId(`menu-tipo-enlace-${tipo}`);
  await expect(opcion).toBeVisible();
  await opcion.click();
}

/**
 * Codex v2 / L3 (C9): el Inspector pasó de tabs a una ficha continua — todas
 * las secciones (Refinamiento, Apariciones, Estilo, Extremos, …) están siempre
 * montadas y visibles, no hay tab que activar. Estos helpers se conservan para
 * no tocar todos los specs consumidores: como el testid del tab ya no existe,
 * la guarda `count === 0` los convierte en no-ops idempotentes; el control
 * buscado por el spec ya está en el DOM dentro de su sección.
 */
export async function irATabRefinamiento(page: import("@playwright/test").Page): Promise<void> {
  const tab = page.getByTestId("inspector-tab-refinamiento");
  if ((await tab.count()) === 0) return;
  await tab.click();
}

export async function irATabApariciones(page: import("@playwright/test").Page): Promise<void> {
  const tab = page.getByTestId("inspector-tab-apariciones");
  if ((await tab.count()) === 0) return;
  await tab.click();
}

export async function irATabEstiloEntidad(page: import("@playwright/test").Page): Promise<void> {
  const tab = page.getByTestId("inspector-tab-estilo");
  if ((await tab.count()) === 0) return;
  await tab.click();
}

export async function irATabExtremos(page: import("@playwright/test").Page): Promise<void> {
  const tab = page.getByTestId("inspector-enlace-tab-extremos");
  if ((await tab.count()) === 0) return;
  await tab.click();
}

export async function irATabEstiloEnlace(page: import("@playwright/test").Page): Promise<void> {
  const tab = page.getByTestId("inspector-enlace-tab-estilo");
  if ((await tab.count()) === 0) return;
  await tab.click();
}

export async function ejecutarAccionCommandPalette(page: import("@playwright/test").Page, query: string, itemId: string): Promise<void> {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill(query);
  await expect(page.getByTestId(`command-palette-item-${itemId}`)).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
}

export async function desplegarComoAgregacion(page: import("@playwright/test").Page): Promise<void> {
  // Ronda23 L1 #10: label visible cambiado a "Desplegar"; el id de la
  // acción interna (accion-unfold) permanece intacto.
  await ejecutarAccionCommandPalette(page, "desplegar", "accion-unfold");
}

export async function guardarComoActual(page: import("@playwright/test").Page, nombre: string, descripcion = ""): Promise<void> {
  await page.keyboard.press("Control+S");
  const dialogo = page.getByRole("dialog", { name: "Guardar como" });
  await expect(dialogo).toBeVisible();
  await dialogo.getByLabel("Nombre del modelo").fill(nombre);
  if (descripcion) await dialogo.getByLabel("Descripción").fill(descripcion);
  await dialogo.getByRole("button", { name: "Guardar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "local-clean");
}

/**
 * Ronda Codex v2 L5 (CRÍT-Comandos): el menú lateral `MenuPrincipal` se
 * retiró. El command palette `⌘K` (el botón ☰ lo invoca) es la vía ÚNICA de
 * comandos y superset de las acciones que el menú exponía. Este helper abre
 * el palette y devuelve su locator para los specs que aún quieran inspeccionar
 * comandos disponibles.
 */
export async function abrirMenuPrincipal(page: import("@playwright/test").Page): Promise<import("@playwright/test").Locator> {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  await page.getByTestId("toolbar-menu").click();
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  return palette;
}

/**
 * Mapeo de los antiguos `data-testid="toolbar-mas-*"` del menú lateral a los
 * IDs de comando del palette. Preserva la firma `clickToolbarMasItem` para no
 * tocar los specs que la consumen (auto-layout, grid, modo imagen, simulación).
 */
const TOOLBAR_MAS_A_COMANDO: Readonly<Record<string, { itemId: string; query: string }>> = {
  "toolbar-mas-auto-layout": { itemId: "menu-auto-layout", query: "auto layout" },
  "toolbar-mas-toggle-grid": { itemId: "menu-grid-canvas", query: "cuadricula" },
  "toolbar-mas-modo-imagen-global": { itemId: "menu-modo-imagen-global", query: "imagen" },
  "toolbar-mas-simulacion": { itemId: "menu-simulacion-conceptual", query: "simulacion" },
};

export async function clickToolbarMasItem(page: import("@playwright/test").Page, testId: string): Promise<void> {
  const comando = TOOLBAR_MAS_A_COMANDO[testId];
  if (!comando) throw new Error(`clickToolbarMasItem: testId sin mapeo a comando del palette: ${testId}`);
  await ejecutarComandoPalette(page, comando.query, comando.itemId);
}

/**
 * Ejecuta un comando del palette por su `itemId`, escribiendo `query` para
 * filtrarlo. Espejo de `ejecutarAccionCommandPalette` para items de menú.
 */
export async function ejecutarComandoPalette(page: import("@playwright/test").Page, query: string, itemId: string): Promise<void> {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  await page.getByTestId("toolbar-menu").click();
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill(query);
  const item = page.getByTestId(`command-palette-item-${itemId}`);
  await expect(item).toBeVisible();
  await item.click();
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
}

/**
 * Compatibilidad: los specs invocaban acciones del menú por su label visible.
 * Ahora se resuelven a comandos del palette por label conocido.
 */
const LABEL_MENU_A_COMANDO: Readonly<Record<string, { itemId: string; query: string }>> = {
  "Nuevo": { itemId: "menu-nuevo-modelo", query: "nuevo modelo" },
  "Abrir / importar...": { itemId: "menu-abrir-importar", query: "abrir importar" },
};

export async function ejecutarMenuPrincipal(page: import("@playwright/test").Page, label: string): Promise<void> {
  const comando = LABEL_MENU_A_COMANDO[label];
  if (!comando) throw new Error(`ejecutarMenuPrincipal: label sin mapeo a comando del palette: ${label}`);
  await ejecutarComandoPalette(page, comando.query, comando.itemId);
}

export async function crearModeloNuevoDesdeMenu(page: import("@playwright/test").Page): Promise<void> {
  await ejecutarMenuPrincipal(page, "Nuevo");
}

export async function importarModeloJson(page: import("@playwright/test").Page, contenido: ExportadoModelo): Promise<void> {
  const dialogo = await abrirDialogoCargarModelo(page);
  await jsonEditor(page).fill(JSON.stringify(contenido, null, 2));
  await expect(dialogo.getByTestId("import-preview")).toBeVisible();
  await dialogo.getByRole("button", { name: "Importar", exact: true }).click();
  await expect(dialogo).toHaveCount(0);
}

export async function abrirDialogoCargarModelo(page: import("@playwright/test").Page): Promise<import("@playwright/test").Locator> {
  await ejecutarMenuPrincipal(page, "Abrir / importar...");
  const dialogo = page.getByRole("dialog", { name: "Abrir modelo" });
  await expect(dialogo).toBeVisible();
  return dialogo;
}

export async function cargarPrimerModelo(page: import("@playwright/test").Page): Promise<void> {
  const dialogo = await abrirDialogoCargarModelo(page);
  // El panel "Recientes" expone botones con data-testid="reciente-modelo";
  // un solo click sobre el primer item abre el modelo en modo carga.
  await dialogo.getByTestId("reciente-modelo").first().click();
  await expect(dialogo).toHaveCount(0);
}

export async function assertWorkbenchLayout(page: import("@playwright/test").Page): Promise<void> {
  const opl = await rectDeLocator(page.getByTestId("opl-pane"));
  const tree = await rectDeLocator(page.getByTestId("tree-pane"));
  const canvas = await rectDeLocator(page.getByTestId("canvas-pane"));
  const inspector = await rectDeLocator(page.getByTestId("inspector-pane"));

  expect(opl.x).toBeLessThan(canvas.x);
  expect(canvas.x).toBeLessThan(inspector.x);
  expect(opl.x + opl.width).toBeLessThanOrEqual(canvas.x + 8);
  expect(canvas.x + canvas.width).toBeLessThanOrEqual(inspector.x + 1);
  expect(tree.x).toBeGreaterThanOrEqual(inspector.x - 1);
  expect(canvas.width).toBeGreaterThan(400);
  expect(opl.width).toBeGreaterThan(250);
  expect(inspector.width).toBeGreaterThan(250);
  // L6: ANCHO_PANEL_INSPECTOR_DEFAULT pasó de 300 a 360; cota superior holgada.
  expect(inspector.width).toBeLessThan(380);
}

export async function assertCanvasScrollable(page: import("@playwright/test").Page): Promise<void> {
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

export async function estadoBeforeUnload(page: import("@playwright/test").Page): Promise<{ canceled: boolean; defaultPrevented: boolean }> {
  return page.evaluate(() => {
    const event = new Event("beforeunload", { cancelable: true }) as BeforeUnloadEvent;
    const dispatchResult = window.dispatchEvent(event);
    return {
      canceled: !dispatchResult,
      defaultPrevented: event.defaultPrevented,
    };
  });
}

export async function puntoMedioPath(locator: import("@playwright/test").Locator): Promise<{ x: number; y: number }> {
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

export function todasSeparadas(apariencias: Array<{ x: number; y: number; width: number; height: number }>): boolean {
  return apariencias.every((a, index) => apariencias.slice(index + 1).every((b) => (
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  )));
}

export function svgText(page: Page, text: string) {
  const flexibleSvgText = new RegExp(`^\\s*${text.trim().split(/\s+/).map(escapeRegExp).join("\\s+")}\\s*$`);
  return page.locator(".joint-paper svg text").filter({ hasText: flexibleSvgText }).first();
}

export function jsonEditor(page: Page) {
  const handle = {
    async fill(value: string): Promise<void> {
      await abrirDialogoJson(page);
      await textareaJson(page).fill(value);
    },
    async inputValue(): Promise<string> {
      const dialogo = await abrirDialogoJson(page);
      await dialogo.getByRole("button", { name: "Exportar", exact: true }).click();
      const value = await textareaJson(page).inputValue();
      await page.keyboard.press("Escape");
      await expect(dialogo).toHaveCount(0);
      return value;
    },
    first() {
      return handle;
    },
  };
  return handle;
}

async function abrirDialogoJson(page: Page) {
  const dialogo = page.getByTestId("dialogo-abrir-importar");
  if (!(await dialogo.isVisible().catch(() => false))) {
    // Ronda Codex v2 L5: el menú lateral se retiró; abrimos vía palette.
    await ejecutarComandoPalette(page, "abrir importar", "menu-abrir-importar");
  }
  await expect(dialogo).toBeVisible();
  const panelJson = dialogo.getByTestId("panel-json-abrir-importar");
  const abierto = await panelJson.evaluate((element) => (element as HTMLDetailsElement).open);
  if (!abierto) await panelJson.locator("summary").click();
  return dialogo;
}

function textareaJson(page: Page) {
  return page.getByTestId("panel-json-abrir-importar").locator('textarea[spellcheck="false"]').first();
}

export async function exportadoActual(page: Page): Promise<ExportadoModelo> {
  return JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
}

export async function aparienciaRaizPorNombre(page: Page, nombre: string): Promise<{ x: number; y: number; width: number; height: number }> {
  const exportado = await exportadoActual(page);
  const entidad = Object.values(exportado.modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`No se exporto entidad ${nombre}`);
  const apariencia = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .find((item) => item.entidadId === entidad.id);
  if (!apariencia) throw new Error(`No se exporto apariencia de ${nombre}`);
  return apariencia;
}

export async function verticesPrimerEnlace(page: Page): Promise<Array<{ x: number; y: number }>> {
  const exportado = await exportadoActual(page);
  return Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.enlaces ?? {})[0]?.vertices ?? [];
}

export function modeloDosOpds() {
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

export function modeloSmokeTablaEnlaces() {
  const entidades = {
    "o-cliente": objeto("o-cliente", "Cliente", "fisica"),
    "o-solicitud": objeto("o-solicitud", "Solicitud"),
    "p-resolver": proceso("p-resolver", "Resolver solicitud"),
    "o-respuesta": objeto("o-respuesta", "Respuesta"),
  };
  const enlaces = {
    "e-agente": enlace("e-agente", "agente", "o-cliente", "p-resolver"),
    "e-consumo": enlace("e-consumo", "consumo", "o-solicitud", "p-resolver"),
    "e-resultado": enlace("e-resultado", "resultado", "p-resolver", "o-respuesta"),
  };
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-smoke-tabla-enlaces",
      nombre: "Modelo smoke tabla enlaces",
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
            "a-cliente": { id: "a-cliente", entidadId: "o-cliente", opdId: "opd-1", x: 60, y: 60, width: 135, height: 60 },
            "a-solicitud": { id: "a-solicitud", entidadId: "o-solicitud", opdId: "opd-1", x: 60, y: 180, width: 135, height: 60 },
            "a-resolver": { id: "a-resolver", entidadId: "p-resolver", opdId: "opd-1", x: 310, y: 120, width: 135, height: 60 },
            "a-respuesta": { id: "a-respuesta", entidadId: "o-respuesta", opdId: "opd-1", x: 560, y: 120, width: 135, height: 60 },
          },
          enlaces: Object.fromEntries(Object.keys(enlaces).map((id) => [`a-${id}`, { id: `a-${id}`, enlaceId: id, opdId: "opd-1", vertices: [] }])),
        },
      },
    },
  };
}

export function modeloMarkersCanonicos() {
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
    "e-effect": enlace("e-effect", "efecto", "p-effect", "o-effect"),
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
            ...aparienciaPar("p-effect", "o-effect", 70, 280),
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

export function modeloModificadoresEnlace() {
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

export function modeloNoModificador() {
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

export function modeloMoverPuerto() {
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

export function modeloConsumoDuplicado() {
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

export function modeloBusAgregacion() {
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

export function modeloAbanicoLogico() {
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
          destinoId: { ...extremoEntidad("p-procesar"), portId: "port-fan-procesar-destino" },
          etiqueta: "",
        },
        "e-consumo-b": {
          id: "e-consumo-b",
          tipo: "consumo",
          origenId: extremoEntidad("o-entrada-b"),
          destinoId: { ...extremoEntidad("p-procesar"), portId: "port-fan-procesar-destino" },
          etiqueta: "",
        },
      },
      abanicos: {
        "ab-1": {
          id: "ab-1",
          opdId: "opd-1",
          puertoComun: { entidadId: "p-procesar", lado: "destino", portId: "port-fan-procesar-destino" },
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
            "ap-procesar": {
              id: "ap-procesar",
              entidadId: "p-procesar",
              opdId: "opd-1",
              x: 310,
              y: 145,
              width: 135,
              height: 60,
              ports: { "port-fan-procesar-destino": { x: 0, y: 0.5 } },
            },
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

export function modeloTransicionEstados() {
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

export function modeloTransicionEstadosIncompleto() {
  const base = modeloTransicionEstados();
  delete base.modelo.enlaces["e-resultado"];
  delete base.modelo.opds["opd-1"].enlaces["ae-resultado"];
  base.modelo.nextSeq = 30;
  return base;
}

export function modeloAbanicoRutasEstados() {
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
          origenId: { ...extremoEntidad("p-aprobar"), portId: "port-fan-aprobar-origen" },
          destinoId: extremoEstado("s-aprobado"),
          etiqueta: "",
          rutaEtiqueta: "exitoso",
        },
        "e-fallido": {
          id: "e-fallido",
          tipo: "resultado",
          origenId: { ...extremoEntidad("p-aprobar"), portId: "port-fan-aprobar-origen" },
          destinoId: extremoEstado("s-rechazado"),
          etiqueta: "",
        },
      },
      abanicos: {
        "ab-rutas": {
          id: "ab-rutas",
          opdId: "opd-1",
          puertoComun: { entidadId: "p-aprobar", lado: "origen", portId: "port-fan-aprobar-origen" },
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
            "a-aprobar": {
              id: "a-aprobar",
              entidadId: "p-aprobar",
              opdId: "opd-1",
              x: 80,
              y: 110,
              width: 135,
              height: 60,
              ports: { "port-fan-aprobar-origen": { x: 1, y: 0.5 } },
            },
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

export function objeto(id: string, nombre: string, esencia = "informacional") {
  return { id, tipo: "objeto", nombre, esencia, afiliacion: "sistemica" };
}

export function proceso(id: string, nombre: string) {
  return { id, tipo: "proceso", nombre, esencia: "informacional", afiliacion: "sistemica" };
}

export function enlace(id: string, tipo: string, origenId: string, destinoId: string) {
  return { id, tipo, origenId, destinoId, etiqueta: "" };
}

export function aparienciaPar(origenId: string, destinoId: string, x: number, y: number, dx = 290) {
  return {
    [`a-${origenId}`]: { id: `a-${origenId}`, entidadId: origenId, opdId: "opd-1", x, y, width: 135, height: 60 },
    [`a-${destinoId}`]: { id: `a-${destinoId}`, entidadId: destinoId, opdId: "opd-1", x: x + dx, y, width: 135, height: 60 },
  };
}

export interface ExportadoModelo {
  modelo: {
    opdRaizId: string;
    entidades: Record<string, {
      id: string;
      nombre: string;
      afiliacion?: string;
      unidad?: string;
      alias?: string;
      esAtributo?: boolean;
      valorSlot?: { tipo: string; placeholder: "value"; valor?: number | string };
      refinamiento?: { tipo: string; opdId: string };
      refinamientos?: {
        descomposicion?: { opdId: string };
        despliegue?: { opdId: string; modo?: string };
      };
      imagen?: { url: string; modo: string };
      orderedFundamentalTypes?: string[];
    }>;
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
    abanicos?: Record<string, {
      enlaceIds: string[];
      puertoComun?: { entidadId: string; lado: "origen" | "destino"; portId: string };
      puertoEntidadId?: string;
    }>;
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
        enlaces: Record<string, { enlaceId: string; vertices: Array<{ x: number; y: number }>; symbolPos?: { x: number; y: number } }>;
      }
    >;
  };
}

export type ExtremoExportado = string | { kind: "entidad" | "estado"; id: string };

export function extremoEntidad(id: string): ExtremoExportado {
  return { kind: "entidad", id };
}

export function extremoEstado(id: string): ExtremoExportado {
  return { kind: "estado", id };
}

export function extremoApuntaAEntidad(extremo: ExtremoExportado, entidadId: string): boolean {
  return typeof extremo === "string"
    ? extremo === entidadId
    : extremo.kind === "entidad" && extremo.id === entidadId;
}
