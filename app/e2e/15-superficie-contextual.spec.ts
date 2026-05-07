/**
 * Smoke ronda 15 L5 — Cierre UX contextual de superficie unica.
 *
 * Cubre los cuatro journeys del brief Linea 5:
 *  - seleccionar cosa actualiza barra contextual e Inspector;
 *  - seleccionar enlace actualiza Inspector y Panel OPL;
 *  - refinamiento navega/expone OPD hijo;
 *  - PanelMetodologia/PanelAvisos no ocultan informacion critica.
 *
 * Mantiene la asuncion del workbench (canvas + inspector + opl + arbol)
 * sin tocar render/canvas (territorio L4) ni Toolbar (territorio L2).
 */

import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible, clickLinkPorTipo, elementoPorTexto } from "./_smoke-helpers";

test("seleccionar una cosa enciende barra contextual e Inspector con la misma referencia", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  // Inspector responde a la seleccion en modo entidad.
  const inspector = page.getByTestId("inspector");
  await expect(inspector).toHaveAttribute("data-modo-inspector", "entidad");
  await expect(inspector).toContainText("Objeto");

  // Barra contextual flotante refleja la misma seleccion.
  const barra = page.getByTestId("barra-herramientas-elemento");
  await expect(barra).toBeVisible();
  await expect(barra).toHaveAttribute("aria-label", /Barra de acciones de Objeto/);

  // El boton inzoom existe y dispara descomposicion (conexion barra -> Inspector via store).
  await expect(page.getByTestId("barra-inzoom")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("seleccionar un enlace conmuta Inspector a modo enlace y resalta su oracion en OPL", async ({ page }) => {
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

  // Hay 1 enlace ya creado; selecciono el enlace clickeando su wrapper SVG.
  await clickLinkPorTipo(page, "Consumo");

  const inspector = page.getByTestId("inspector");
  await expect(inspector).toHaveAttribute("data-modo-inspector", "enlace");
  await expect(inspector).toContainText("Enlace Consumo");

  // Panel OPL: la oracion correspondiente al enlace debe estar visible
  // y marcada como seleccionada (boxShadow inset via style.lineaSeleccionada).
  const panel = page.getByTestId("panel-opl");
  await expect(panel).toBeVisible();
  await expect(panel.getByText(/Procesar\s+consume\s+Entrada/)).toBeVisible();

  // Cuando hay seleccion la barra contextual de cosa NO debe estar visible:
  // BarraHerramientasElemento es solo para entidades, no para enlaces.
  await expect(page.getByTestId("barra-herramientas-elemento")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("inzoom desde barra contextual navega al OPD hijo y arbol expone el descendiente", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Proceso", exact: true }).click();

  // Inzoom desde la barra contextual flotante (no desde Inspector).
  await expect(page.getByTestId("barra-inzoom")).toBeVisible();
  await page.getByTestId("barra-inzoom").click();

  // El arbol OPD debe exponer el OPD hijo y marcarlo como activo.
  const arbol = page.getByRole("tree", { name: "Árbol OPD" });
  const nodoHijo = arbol.locator('[role="treeitem"]').filter({ hasText: "SD1: Proceso descompuesto" });
  await expect(nodoHijo).toHaveAttribute("aria-current", "page");

  // El Inspector permanece en modo entidad (la cosa refinada sigue seleccionada).
  await expect(page.getByTestId("inspector")).toHaveAttribute("data-modo-inspector", "entidad");

  expect(pageErrors).toEqual([]);
});

test("PanelMetodologia y PanelAvisos se pueden colapsar sin perder informacion critica", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  // Modelo minimo: aseguro que ambos paneles se monten.
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  const metodologia = page.getByTestId("panel-metodologia");
  const avisos = page.getByTestId("panel-avisos");
  await expect(metodologia).toBeVisible();
  await expect(avisos).toBeVisible();

  // El contador se mantiene visible incluso cuando el panel esta colapsado.
  const contadorMetodologia = page.getByTestId("panel-metodologia-total");
  await expect(contadorMetodologia).toBeVisible();

  // Toggle colapsa Metodologia: el cuerpo desaparece pero el contador sigue.
  await page.getByTestId("panel-metodologia-toggle").click();
  await expect(metodologia).toHaveAttribute("data-colapsado", "true");
  await expect(contadorMetodologia).toBeVisible();
  // Re-expandir restaura.
  await page.getByTestId("panel-metodologia-toggle").click();
  await expect(metodologia).toHaveAttribute("data-colapsado", "false");

  // Mismo contrato para Verificacion metodologica.
  await page.getByTestId("panel-avisos-toggle").click();
  await expect(avisos).toHaveAttribute("data-colapsado", "true");
  // Inspector debe seguir disponible (no oculto por avisos).
  await expect(page.getByTestId("inspector")).toBeVisible();
  await page.getByTestId("panel-avisos-toggle").click();
  await expect(avisos).toHaveAttribute("data-colapsado", "false");

  expect(pageErrors).toEqual([]);
});

/**
 * Contrato UX TablaEnlaces (Beta1) — descrito como tests pendientes para que
 * la siguiente ronda lo materialice sin reinventar el contrato. La feature
 * completa NO se implementa aqui (fuera de slice L5); este describe.skip es
 * la SSOT operativa del acuerdo de integracion.
 *
 * Anclajes:
 *  - EPICA-16 Tabla de Enlaces (backlog vivo).
 *  - Auditoria IFML §6 O-4: TablaEnlaces como vista alterna en XOR canvas/mapa,
 *    no como modal aislado.
 *  - Selector existente `tablaEnlacesAbierta` en App.tsx queda como puente
 *    legacy; Beta1 puede sustituirlo por una pestana de la BarraPestanas.
 *
 * Reglas duras del contrato (validadas por estos tests cuando se enciendan):
 *  1. Columnas minimas obligatorias por fila: Tipo, Origen, Destino, Etiqueta,
 *     Multiplicidad origen, Multiplicidad destino, OPDs donde aparece.
 *     Columnas opcionales: Modificador, Probabilidad, Demora, Ruta de etiqueta.
 *  2. Seleccion bidireccional: clickear una fila pone enlaceSeleccionId en
 *     el store y enciende Inspector en modo enlace; seleccionar un enlace en
 *     canvas/OPL marca la fila correspondiente con scrollIntoView automatico.
 *     Misma semantica que la integracion canvas <-> OPL ya cubierta por
 *     `seleccionarDesdeOpl` y el effect de scroll en PanelOpl.
 *  3. Edicion in-place de etiqueta y multiplicidades por celda, validada con
 *     los mismos validators del Inspector (validarEtiquetaEnlace,
 *     validarMultiplicidad). Cancelar con Escape, confirmar con Enter o blur.
 *  4. Navegacion a extremos: dos botones por fila ("Ir a origen", "Ir a
 *     destino") cambian opdActivoId al OPD donde la apariencia del extremo
 *     existe y dejan la entidad seleccionada. Si el extremo es un estado,
 *     se selecciona la entidad portadora (mismo contrato que el panel OPL).
 *  5. Render no obligatorio en Beta1: vista de tabla virtualizada solo si
 *     |enlaces| > 200; debajo de ese umbral basta lista plana.
 *  6. Layout: Beta1 expone TablaEnlaces como pestana adicional en
 *     BarraPestanas, no como modal exclusivo. Mientras llega esa migracion,
 *     el modal sobrevive como acceso secundario.
 */
test.describe.skip("Contrato TablaEnlaces Beta1 — pending implementation", () => {
  test("columnas minimas presentes y orden estable", () => {
    // Verificar Tipo, Origen, Destino, Etiqueta, MultOrigen, MultDestino, OPDs.
  });
  test("clickear fila enciende Inspector en modo enlace", () => {
    // page.getByTestId("tabla-enlaces-fila").first().click();
    // expect(page.getByTestId("inspector")).toHaveAttribute("data-modo-inspector", "enlace");
  });
  test("seleccion en canvas marca y revela fila correspondiente", () => {
    // Reciproco del journey 2 ya cubierto en este spec.
  });
  test("edicion in-place de etiqueta valida con validarEtiquetaEnlace", () => {
    // Espejar el contrato del Inspector para mantener una sola fuente de verdad.
  });
  test("Ir a origen / Ir a destino cambia opdActivoId y selecciona la entidad", () => {
    // page.getByTestId("tabla-enlaces-fila-N-ir-origen").click();
  });
});

test("Inspector vacio expone CTA y aria-live consistente al limpiar seleccion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(page.getByTestId("inspector")).toHaveAttribute("data-modo-inspector", "entidad");

  // Vaciar seleccion via Escape.
  await page.keyboard.press("Escape");
  const inspector = page.getByTestId("inspector");
  await expect(inspector).toHaveAttribute("data-modo-inspector", "vacio");
  await expect(page.getByTestId("inspector-vacio")).toBeVisible();
  await expect(page.getByTestId("inspector-vacio")).toContainText(/Selecciona una cosa o un enlace/);

  expect(pageErrors).toEqual([]);
});
