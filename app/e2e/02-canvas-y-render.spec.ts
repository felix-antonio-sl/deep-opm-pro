import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
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
  ejecutarComandoPalette,
  irATabExtremos,
  irATabRefinamiento,
  guardarComoActual,
  cargarPrimerModelo,
  restaurarPanelOplSiMinimizado,
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

test("Exportar OPD actual como PNG descarga el paper del canvas sin chrome de aplicacion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloMarkersCanonicos(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();
  await expect(page.locator(".joint-paper svg")).toHaveCount(1);
  await expect(svgText(page, "Agente")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await ejecutarComandoPalette(page, "exportar opd png", "menu-exportar-opd-png");
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^markers-canonicos-sd-\d{4}-\d{2}-\d{2}\.png$/);
  const path = await download.path();
  if (!path) throw new Error("Playwright no entrego path de descarga PNG");
  const bytes = await readFile(path);
  const dimensiones = dimensionesPng(bytes);

  expect([...bytes.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  expect(bytes.byteLength).toBeGreaterThan(1000);
  expect(dimensiones.width).toBeGreaterThan(350);
  expect(dimensiones.width).toBeLessThan(900);
  expect(dimensiones.height).toBeGreaterThan(500);
  expect(dimensiones.height).toBeLessThan(900);
  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("exportar svg");
  await expect(palette).toContainText("sin resultados - escribe otro comando");
  await page.keyboard.press("Escape");
  expect(pageErrors).toEqual([]);
});

function dimensionesPng(bytes: Buffer): { width: number; height: number } {
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

test("Exportar todos los OPDs como PNG descarga paquete ZIP", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloDosOpds(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();
  await expect(page.locator(".joint-paper svg")).toHaveCount(1);

  const downloadPromise = page.waitForEvent("download");
  await ejecutarComandoPalette(page, "todos opds png", "menu-exportar-opds-png-zip");
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^modelo-multi-opd-opds-png-\d{4}-\d{2}-\d{2}\.zip$/);
  const path = await download.path();
  if (!path) throw new Error("Playwright no entrego path de descarga ZIP");
  const bytes = await readFile(path);

  expect([...bytes.subarray(0, 4)]).toEqual([0x50, 0x4b, 0x03, 0x04]);
  expect(bytes.toString("utf8")).toContain("01-sd.png");
  expect(bytes.toString("utf8")).toContain("02-sd1.png");
  expect(tamanoPrimeraEntradaZip(bytes)).toBeGreaterThan(1000);
  expect(pageErrors).toEqual([]);
});

function tamanoPrimeraEntradaZip(bytes: Buffer): number {
  if (bytes.length < 30) return 0;
  return bytes.readUInt32LE(22);
}

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
  await expect(page.getByTestId("abanico-puerto-exacto")).toContainText("Procesar");
  await expect(page.getByTestId("abanico-puerto-exacto")).toContainText("21:00");
  await page.getByTestId("abanico-toggle-XOR").click();
  await expect(page.getByText("Operador actualizado a XOR")).toBeVisible();
  // XOR ahora tambien es un arco SVG (un solo trazo, sin segundo concentrico).
  await expect(page.locator(".joint-element path[joint-selector=body]")).toHaveCount(1);
  await expect(svgText(page, "O")).toHaveCount(0);
  await expect(svgText(page, "XOR")).toHaveCount(0);

  const inputsProbabilidad = page.getByTestId("abanico-probabilidades").locator("input");
  await expect(inputsProbabilidad).toHaveCount(2);
  await inputsProbabilidad.nth(0).fill("40");
  await inputsProbabilidad.nth(1).fill("60");
  await page.getByTestId("abanico-probabilidades-aplicar").click();
  await expect(page.getByText("Probabilidades del abanico actualizadas")).toBeVisible();
  await expect(svgText(page, "Pr = 0.4")).toHaveCount(1);
  await expect(svgText(page, "Pr = 0.6")).toHaveCount(1);
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const abanico = Object.values(exportado.modelo.abanicos ?? {})[0];
  expect(abanico?.decision).toMatchObject({ modo: "probabilidades" });
  const enlacesFan = abanico?.enlaceIds.map((id) => exportado.modelo.enlaces[id]?.probabilidad);
  expect(enlacesFan).toEqual([0.4, 0.6]);

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
  await expect(svgText(page, "Pr = 0.7")).toBeVisible();
  await expect(svgText(page, "c")).toBeVisible();
  await expect(svgText(page, "1s")).toBeVisible();
  await restaurarPanelOplSiMinimizado(page);
  // Canon OPL vigente: probabilidad se emite como `Pr=` (procedural.ts:427;
  // el unit del generador rechaza la forma vieja "(probabilidad:") y la
  // demora va con tilde ("después").
  await expect(page.getByText("Orden inicia Aprobar, que consume Orden `Pr=0.7`.")).toBeVisible();
  await expect(page.getByText("Aprobar invoca Validar después de 1s.")).toBeVisible();

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
  await page.getByTestId("reanclar-extremo-btn").click();
  const dialogo = page.getByRole("dialog", { name: "Reanclar extremo" });
  await expect(dialogo).toBeVisible();
  await dialogo.getByTestId("mover-puerto-extremo-select").selectOption("entidad:p-validar");
  await dialogo.getByTestId("mover-puerto-ancla-select").selectOption("SE");
  await expect(dialogo.getByTestId("mover-puerto-contrato")).toContainText("16:30");
  await page.getByRole("dialog", { name: "Reanclar extremo" }).getByRole("button", { name: "Aplicar", exact: true }).click();

  await expect(page.getByText("Reanclaje aplicado")).toBeVisible();
  await expect(page.getByTestId("contrato-puerto-destino")).toContainText("Validar");
  await expect(page.getByTestId("contrato-puerto-destino")).toContainText("16:30");
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const enlace = Object.values(exportado.modelo.enlaces)[0];
  const portId = enlace?.destinoId.portId;
  const validar = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .find((apariencia) => apariencia.entidadId === "p-validar");
  expect(enlace?.destinoId).toEqual({ kind: "entidad", id: "p-validar", portId });
  expect(validar?.ports?.[portId!]).toEqual({ x: 1, y: 1 });
  expect(pageErrors).toEqual([]);
});

test("BUG-20260520T043712Z-72ab52 crea fan desde ramas existentes", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloFanManualDesdeRamas(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await clickLinkPorIndice(page, 0);
  await irATabExtremos(page);
  await expect(page.getByTestId("fan-posible-enlace")).toContainText("2 ramas resultado");
  await page.getByTestId("crear-fan-origen").click();

  await expect(page.getByText("Fan O creado")).toBeVisible();
  await expect(page.getByTestId("contrato-fan-exacto")).toContainText("Fan O");
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const abanicos = Object.values(exportado.modelo.abanicos ?? {});
  expect(abanicos).toHaveLength(1);
  const enlaces = Object.values(exportado.modelo.enlaces).filter((enlace) => enlace.tipo === "resultado");
  expect(enlaces.map((enlace) => enlace.origenId.portId)).toEqual([enlaces[0]?.origenId.portId, enlaces[0]?.origenId.portId]);
  expect(abanicos[0]?.puertoComun).toEqual({
    entidadId: "p-procesar",
    lado: "origen",
    portId: enlaces[0]?.origenId.portId,
  });
  expect(pageErrors).toEqual([]);
});

function modeloFanManualDesdeRamas() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-fan-manual",
      nombre: "Fan manual",
      opdRaizId: "opd-1",
      nextSeq: 10,
      entidades: {
        "p-procesar": proceso("p-procesar", "Procesar"),
        "o-a": objeto("o-a", "Objeto"),
        "o-b": objeto("o-b", "Objeto_2"),
      },
      estados: {},
      enlaces: {
        "e-a": { id: "e-a", tipo: "resultado", origenId: extremoEntidad("p-procesar"), destinoId: extremoEntidad("o-a"), etiqueta: "" },
        "e-b": { id: "e-b", tipo: "resultado", origenId: extremoEntidad("p-procesar"), destinoId: extremoEntidad("o-b"), etiqueta: "" },
      },
      abanicos: {},
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-p": { id: "a-p", entidadId: "p-procesar", opdId: "opd-1", x: 260, y: 260, width: 135, height: 60 },
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

test("dos consumos al mismo objeto emiten advertencia", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloConsumoDuplicado(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  const diagnostico = page.getByTestId("panel-diagnostico");
  await page.getByTestId("panel-diagnostico-toggle").click();
  // ronda23 L2 #2: el panel muestra el título humano de la regla, no el slug.
  // El testid `aviso-consumo-doble-mismo-objeto` sigue siendo el contrato estable.
  await expect(diagnostico.getByTestId("aviso-consumo-doble-mismo-objeto")).toBeVisible();
  await expect(diagnostico).toContainText("El mismo objeto se consume dos veces");
  await expect(diagnostico).toContainText("Procesar consume Entrada más de una vez");
  expect(pageErrors).toEqual([]);
});

test("crea auto-invocacion desde Inspector con demora default", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  const nombre = page.getByTestId("inspector").getByLabel("Nombre");
  await nombre.fill("Procesar");
  await nombre.press("Enter");
  // Ronda 20 L1: Auto-invocación vive en el tab `Refinamiento` del Inspector.
  await irATabRefinamiento(page);
  await expect(page.getByRole("button", { name: "Auto-invocación" })).toBeVisible();

  await page.getByRole("button", { name: "Auto-invocación" }).click();

  await expect(page.locator(".joint-link")).toHaveCount(2);
  await expect(svgText(page, "1s")).toBeVisible();
  await expect(page.getByText("Procesar se invoca a sí mismo después de 1s.")).toBeVisible();
  const json = await jsonEditor(page).inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  const proceso = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Procesar");
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
  await expect(page.getByTestId("barra-agregar-estado")).toBeVisible();
  await expect(page.getByTestId("barra-inzoom")).toBeVisible();
  await expect(page.getByTestId("barra-unfold")).toBeVisible();
  await expect(page.getByTestId("barra-editar-alias")).toBeVisible();
  await expect(page.getByTestId("barra-editar-imagen")).toBeVisible();
  await expect(page.getByTestId("barra-mas-opciones")).toBeVisible();

  const objetoBox = await elementoPorTexto(page, "Objeto").boundingBox();
  const barraBox = await barra.boundingBox();
  if (!objetoBox || !barraBox) throw new Error("No se pudo medir anchor de barra");
  // Codex rev2 «una voz»: la anotación tipográfica se ancla justo bajo el bbox
  // (placement "abajo", OFFSET=10). Verificamos que aparece pegada al borde
  // inferior del objeto (no flotando lejos) con tolerancia de un par de px.
  expect(barraBox.y).toBeGreaterThanOrEqual(objetoBox.y + objetoBox.height - 4);
  expect(barraBox.y).toBeLessThan(objetoBox.y + objetoBox.height + 24);
  expect(pageErrors).toEqual([]);
});

test("accion inspector de la anotación enfoca el Inspector lateral persistente", async ({ page }) => {
  // Codex rev2 «una voz» (L4): el shell Codex monta la marginalia (Inspector)
  // de forma persistente; la antigua semántica de "colapsar/reabrir" la columna
  // pertenecía a la caja de chips desmontada. La acción `inspector` de la
  // anotación tipográfica (testid heredado `barra-mas-opciones`) enfoca el pane
  // sin ocultar el chrome (territorio App.tsx). Verificamos que la acción está
  // disponible y que el Inspector permanece visible al invocarla.
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await elementoPorTexto(page, "Objeto").click();

  await expect(page.getByTestId("inspector-pane")).toBeVisible();
  const accionInspector = page.getByTestId("barra-mas-opciones");
  await expect(accionInspector).toBeVisible();
  await expect(accionInspector).toHaveText("Inspector");
  await accionInspector.click();
  await expect(page.getByTestId("inspector-pane")).toBeVisible();
  await expect(page.getByTestId("inspector")).toHaveAttribute("data-modo-inspector", "entidad");
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

test("BUG-20260520T060120Z-d237be sube imagen local y la persiste embebida", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await elementoPorTexto(page, "Objeto").click();
  await page.getByTestId("barra-editar-imagen").click();

  const dialogo = page.getByRole("dialog", { name: "Imagen de Objeto" });
  await expect(dialogo).toBeVisible();
  await dialogo.getByLabel("Imagen local").setInputFiles({
    name: "pixel.png",
    mimeType: "image/png",
    buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=", "base64"),
  });
  await expect(dialogo.getByLabel("URL de imagen")).toHaveValue(/^data:image\/png;base64,/);
  await dialogo.getByRole("button", { name: "Confirmar" }).click();
  await expect(dialogo).toHaveCount(0);

  const exportado = await exportadoActual(page);
  const entidad = Object.values(exportado.modelo.entidades).find((item) => item.nombre === "Objeto");
  expect(entidad?.imagen?.url).toMatch(/^data:image\/png;base64,/);
  expect(entidad?.imagen?.modo).toBe("imagen-texto");
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
  // Ronda 22: Inzoom vive en el catalogo contextual.
  await irATabRefinamiento(page);
  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");

  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" })).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".joint-element")).toHaveCount(4);

  const ellipses = await page.locator(".joint-element").evaluateAll((els) =>
    els.map((el) => {
      const body = el.querySelector<SVGGraphicsElement>('[joint-selector="body"]');
      const r = (body ?? el).getBoundingClientRect();
      const tieneEllipse = body?.tagName.toLowerCase() === "ellipse";
      const modelId = el.getAttribute("model-id") ?? "";
      return { modelId, tieneEllipse, x: r.x, y: r.y, width: r.width, height: r.height };
    }),
  );
  const conEllipse = ellipses.filter((e) => e.tieneEllipse).sort((a, b) => b.width - a.width);
  const contornoIni = conEllipse[0];
  const subsIni = conEllipse.slice(1, 4).sort((a, b) => a.y - b.y);
  expect(subsIni).toHaveLength(3);

  const target = subsIni[1];
  // Usar un punto interior no centrado evita pisar anchors cardinales de
  // conexion que se activan por hover cuando este test corre despues de otros.
  const cx = target.x + target.width * 0.35;
  const cy = target.y + target.height * 0.55;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 200, cy, { steps: 12 });
  await page.mouse.up();

  const ellipsesFin = await page.locator(".joint-element").evaluateAll((els) =>
    els.map((el) => {
      const body = el.querySelector<SVGGraphicsElement>('[joint-selector="body"]');
      const r = (body ?? el).getBoundingClientRect();
      const tieneEllipse = body?.tagName.toLowerCase() === "ellipse";
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

  // Regla de unicidad global (e5a0613): el dato interno auto-suffix a Objeto_2,
  // aunque la etiqueta renderizada canonica lo muestra como "Objeto 2".
  const objetoBase = page.locator('.joint-element[aria-label^="Objeto Objeto."]');
  const objetoDuplicado = page.locator('.joint-element[aria-label^="Objeto Objeto_2."]');
  await expect(objetoBase).toHaveCount(1);
  await expect(objetoDuplicado).toHaveCount(1);
  await objetoBase.click();
  await elegirTipoEnlaceDesdeMenu(page, "agregacion");
  await objetoDuplicado.click();

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
  await expect(page.locator(".joint-paper svg text").filter({ hasText: /^\s*Temperatura\s*\[°C\]\s*$/ }).first()).toBeVisible();
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
  // Ronda23 L1 #14: placeholder del input alias cambió de "{alias}" a
  // "ej: cliente" (sin slugs visibles que parezcan variables sin sustituir).
  await page.getByPlaceholder("ej: cliente").fill("T");

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
  await esperarWorkbenchInicial(page);
  await expect(page.locator("main")).toHaveAttribute("data-context-submodo", "ninguno");
  await expect(page.getByTestId("viewpoint-heading")).toHaveText("Workbench OPM - edición");
  await expect(page.getByTestId("toolbar-root")).toBeVisible();
  // Codex v1.1: todos los creadores viven inline; Relación aparece
  // deshabilitada hasta tener una cosa origen.
  for (const cluster of ["Modelo", "Modelar", "Conectar"]) {
    await expect(page.getByRole("group", { name: cluster })).toBeVisible();
  }
  await expect(page.locator('[data-slot="cluster-modelo"]')).toBeVisible();
  await expect(page.locator('[data-slot="cluster-modelar"]')).toBeVisible();
  await expect(page.locator('[data-slot="cluster-conectar"]')).toBeVisible();
  await expect(page.locator('[data-slot="cluster-vista"]')).toHaveCount(0);
  await expect(page.locator('[data-slot="cluster-validar"]')).toHaveCount(0);
  await expect(page.locator('[data-slot="cluster-ayuda"]')).toHaveCount(0);
  await expect(page.getByRole("group", { name: "Modelar" }).getByRole("button", { name: "Objeto", exact: true })).toBeVisible();
  await expect(page.getByTestId("abrir-menu-tipo-enlace")).toBeDisabled();
  await expect(page.getByTestId("toolbar-mas-trigger")).toHaveCount(0);
  await expect(page.getByTestId("toolbar-command-palette")).toHaveCount(0);
  await expect(page.getByTestId("toolbar-menu")).toHaveCount(0);
  // Ronda Codex v2 L5: el menú lateral se retiró; Ctrl/Cmd+K abre el command
  // palette. Sus comandos canónicos están disponibles;
  // biblioteca-dock y mapa siguen ausentes.
  await page.keyboard.press("Control+k");
  const paletteChrome = page.getByTestId("command-palette");
  await expect(paletteChrome).toBeVisible();
  const comboChrome = paletteChrome.getByRole("combobox");
  await comboChrome.fill("cuadricula");
  await expect(paletteChrome.getByTestId("command-palette-item-menu-grid-canvas")).toBeVisible();
  await comboChrome.fill("auto layout");
  await expect(paletteChrome.getByTestId("command-palette-item-menu-auto-layout")).toBeVisible();
  await comboChrome.fill("simulacion");
  await expect(paletteChrome.getByTestId("command-palette-item-menu-simulacion-conceptual")).toBeVisible();
  await comboChrome.fill("biblioteca dock");
  await expect(paletteChrome.getByText("Biblioteca dock", { exact: true })).toHaveCount(0);
  await comboChrome.fill("mapa del sistema");
  await expect(paletteChrome.getByText("Mapa del sistema", { exact: true })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
  await expect(page.getByTestId("abrir-menu-tipo-enlace")).toBeDisabled();

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const modal = page.getByTestId("modal-nombre-cosa");
  if (await modal.count()) {
    await modal.getByLabel("Nombre").fill("Objeto L1");
    await modal.getByRole("button", { name: "OK" }).click();
    await expect(modal).toHaveCount(0);
  }

  await expect(page.getByTestId("barra-herramientas-elemento")).toBeVisible();
  // Ronda 24 L4 #6: tras crear y seleccionar el objeto, el cluster Conectar
  // se monta porque hay origen disponible.
  await expect(page.locator('[data-slot="cluster-conectar"]')).toBeVisible();
  // P0 UI/UX 2026-05-26: plantillas deja de existir como superficie de producto.
  await page.keyboard.press("Control+k");
  await expect(page.getByTestId("command-palette")).toBeVisible();
  await page.getByTestId("command-palette").getByRole("combobox").fill("plantillas");
  await expect(page.getByTestId("command-palette")).toContainText("sin resultados - escribe otro comando");
  await expect(page.getByTestId("command-palette").getByRole("option")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
  await expect(page.getByTestId("abrir-menu-tipo-enlace")).toBeEnabled();

  await page.getByTestId("toolbar-drag-objeto").click({ modifiers: ["Shift"] });
  // P1 sticky ronda 4: badge canonico unifica "Modo sticky: X" + estado enlace.
  await expect(page.locator("main")).toHaveAttribute("data-context-submodo", "insertando");
  await expect(page.getByTestId("indicador-modo-canonico")).toContainText("Insertando objetos · Esc para salir");
  await expect(page.getByTestId("indicador-modo-canonico")).toHaveAttribute("role", "status");
  await expect(page.getByTestId("indicador-modo-canonico")).toHaveAttribute("aria-live", "polite");
  await expect(page.getByTestId("viewpoint-heading")).toHaveText("Workbench OPM - inserción continua");

  expect(pageErrors).toEqual([]);
});
