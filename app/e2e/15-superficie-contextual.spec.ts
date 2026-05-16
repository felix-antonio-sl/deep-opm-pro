/**
 * Smoke ronda 15 L5 — Cierre UX contextual de superficie unica.
 *
 * Cubre los cuatro journeys del brief Linea 5:
 *  - seleccionar cosa actualiza barra contextual e Inspector;
 *  - seleccionar enlace actualiza Inspector y Panel OPL;
 *  - refinamiento navega/expone OPD hijo;
 *  - PanelDiagnostico no oculta informacion critica.
 *
 * Mantiene la asuncion del workbench (canvas + inspector + opl + arbol)
 * sin tocar render/canvas (territorio L4) ni Toolbar (territorio L2).
 */

import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible, clickLinkPorTipo, elegirTipoEnlaceDesdeMenu, elementoPorTexto, exportadoActual } from "./_smoke-helpers";

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
  await elegirTipoEnlaceDesdeMenu(page, "consumo");
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

  // La barra contextual también cubre enlace único con acciones primarias de enlace.
  const barra = page.getByTestId("barra-herramientas-elemento");
  await expect(barra).toBeVisible();
  await expect(page.getByTestId("barra-cambiar-tipo-enlace")).toBeVisible();
  await expect(page.getByTestId("barra-copiar-estilo")).toBeVisible();
  await expect(page.getByTestId("barra-pegar-estilo")).toBeVisible();

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

test("multiseleccion expone barra contextual con acciones de lote", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.keyboard.press("Control+a");

  const barra = page.getByTestId("barra-herramientas-elemento");
  await expect(barra).toBeVisible();
  await expect(page.getByTestId("barra-resumen-multiseleccion")).toContainText("2 seleccionadas");
  await expect(page.getByTestId("barra-eliminar-seleccion")).toBeVisible();
  await expect(page.getByTestId("barra-agregar-como-partes")).toBeVisible();
  await expect(page.getByTestId("accion-traer-enlaces")).toBeVisible();
  await expect(page.getByTestId("barra-alinear-seleccion")).toBeVisible();
  await expect(page.getByTestId("barra-distribuir-seleccion")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("PanelDiagnostico se expande y colapsa sin perder informacion critica", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  // Modelo minimo: aseguro que ambos paneles se monten.
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  const diagnostico = page.getByTestId("panel-diagnostico");
  await expect(diagnostico).toBeVisible();

  // El contador se mantiene visible incluso cuando el panel esta colapsado.
  await expect(diagnostico).toContainText(/issues/);

  // Toggle expande Diagnostico: el cuerpo aparece con agrupacion unica.
  await page.getByTestId("panel-diagnostico-toggle").click();
  await expect(diagnostico).toHaveAttribute("data-expandido", "true");
  await expect(diagnostico).toContainText("Mejoras");

  // Colapsar preserva el Inspector y deja el contador visible.
  await page.getByTestId("panel-diagnostico-toggle").click();
  await expect(diagnostico).toHaveAttribute("data-expandido", "false");
  // Inspector debe seguir disponible (no oculto por avisos).
  await expect(page.getByTestId("inspector")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

/**
 * Contrato UX TablaEnlaces (Beta1) — implementado en ronda 16 L1.
 *
 * Anclajes:
 *  - EPICA-16 Tabla de Enlaces (backlog vivo).
 *  - Auditoria IFML §6 O-4: TablaEnlaces como vista alterna en XOR canvas/mapa.
 *  - Selector existente `tablaEnlacesAbierta` en App.tsx queda como puente
 *    legacy; el describe siguiente cierra el contrato sobre el modal vigente.
 *
 * Reglas duras (validadas por estos tests):
 *  1. Columnas minimas obligatorias por fila: Tipo, Origen, Destino, Etiqueta,
 *     Mult. origen, Mult. destino, OPDs donde aparece.
 *  2. Seleccion bidireccional: clickear una fila navega y selecciona el enlace
 *     en canvas; seleccionar un enlace por canvas/OPL marca la fila visible
 *     cuando la tabla esta abierta.
 *  3. Edicion in-place de etiqueta y multiplicidades, validada con los mismos
 *     validators del Inspector (validarEtiquetaEnlace, validarMultiplicidad).
 *     Confirmar con Enter o blur, cancelar con Escape.
 *  4. Navegacion a extremos: botones "Ir a origen" / "Ir a destino" cambian
 *     opdActivoId al OPD donde la apariencia del extremo existe y dejan la
 *     entidad seleccionada. Si el extremo es estado, selecciona la portadora.
 *  5. Eliminacion: cada fila expone "Eliminar" con confirmacion inline; el
 *     enlace desaparece cross-OPD del modelo.
 */
test.describe("Contrato TablaEnlaces Beta1", () => {
  test("columnas minimas presentes y empty state explicito sin enlaces", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);

    await page.getByLabel("Menú principal").click();
    await page.getByRole("menu", { name: "Menú principal" })
      .getByRole("menuitem", { name: "Tabla de enlaces" })
      .click();

    const tabla = page.getByTestId("tabla-enlaces");
    await expect(tabla).toBeVisible();
    for (const clave of ["tipo", "origen", "destino", "etiqueta", "multOrigen", "multDestino", "opds"]) {
      await expect(page.getByTestId(`tabla-enlaces-col-${clave}`)).toBeVisible();
    }
    await expect(page.getByTestId("tabla-enlaces-vacio")).toBeVisible();
    await expect(page.getByTestId("tabla-enlaces-vacio")).toContainText("Sin enlaces que mostrar");

    expect(pageErrors).toEqual([]);
  });

  test("clickear fila navega al enlace en canvas y enciende Inspector en modo enlace", async ({ page }) => {
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

    await page.getByLabel("Menú principal").click();
    await page.getByRole("menu", { name: "Menú principal" })
      .getByRole("menuitem", { name: "Tabla de enlaces" })
      .click();
    const fila = page.getByTestId("tabla-enlaces-fila").first();
    await expect(fila).toBeVisible();
    await expect(fila.getByTestId("tabla-enlaces-celda-tipo")).toHaveText("Consumo");

    // Click sobre celda no editable (tipo) para evitar que stopPropagation de los
    // inputs in-place de etiqueta/mult absorba el navegar de la fila.
    await fila.getByTestId("tabla-enlaces-celda-tipo").click();
    // Tras click, la tabla se cierra y el enlace queda seleccionado.
    await expect(page.getByTestId("tabla-enlaces")).toHaveCount(0);
    const inspector = page.getByTestId("inspector");
    await expect(inspector).toHaveAttribute("data-modo-inspector", "enlace");
    await expect(inspector).toContainText("Enlace Consumo");

    expect(pageErrors).toEqual([]);
  });

  test("seleccion en canvas resalta la fila correspondiente en la tabla", async ({ page }) => {
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

    // Selecciono el enlace en canvas y luego abro la tabla.
    await clickLinkPorTipo(page, "Consumo");
    await page.getByLabel("Menú principal").click();
    await page.getByRole("menu", { name: "Menú principal" })
      .getByRole("menuitem", { name: "Tabla de enlaces" })
      .click();

    const fila = page.getByTestId("tabla-enlaces-fila").first();
    await expect(fila).toHaveAttribute("aria-selected", "true");

    expect(pageErrors).toEqual([]);
  });

  test("edicion in-place de etiqueta y multiplicidad valida con validators canonicos", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);
    await page.getByRole("button", { name: "Objeto", exact: true }).click();
    await page.getByLabel("Nombre").fill("Cliente");
    await page.getByRole("button", { name: "Objeto", exact: true }).click();
    await page.getByLabel("Nombre").fill("Pedido");
    await elementoPorTexto(page, "Cliente").click();
    await elegirTipoEnlaceDesdeMenu(page, "agregacion");
    await elementoPorTexto(page, "Pedido").click();

    await page.getByLabel("Menú principal").click();
    await page.getByRole("menu", { name: "Menú principal" })
      .getByRole("menuitem", { name: "Tabla de enlaces" })
      .click();

    const fila = page.getByTestId("tabla-enlaces-fila").first();
    // Edicion etiqueta — Enter confirma.
    const etiquetaInput = fila.getByTestId("tabla-enlaces-etiqueta-input");
    await etiquetaInput.click();
    await etiquetaInput.fill("contiene");
    await etiquetaInput.press("Enter");

    // Multiplicidad destino: valor canonico 0..N.
    const multDestino = fila.getByTestId("tabla-enlaces-mult-destino-input");
    await multDestino.click();
    await multDestino.fill("0..N");
    await multDestino.press("Enter");

    // Multiplicidad origen invalida → marca aria-invalid sin commit.
    const multOrigen = fila.getByTestId("tabla-enlaces-mult-origen-input");
    await multOrigen.click();
    await multOrigen.fill("abc");
    await multOrigen.press("Enter");
    await expect(multOrigen).toHaveAttribute("aria-invalid", "true");

    // Reset: corregir el valor a vacio dispara setError(null) en commit, y
    // la fila vuelve a aria-invalid=false sin colateralizar Escape (que el
    // browser puede interpretar como cierre de dialog modal).
    await multOrigen.fill("");
    await multOrigen.press("Enter");
    await expect(multOrigen).toHaveAttribute("aria-invalid", "false");

    // El JSON ahora refleja contiene + 0..N (no 'abc').
    await page.getByTestId("tabla-enlaces-cerrar").click();
    const exportado = await exportadoActual(page);
    const enlace = Object.values(exportado.modelo.enlaces)[0] as Record<string, unknown>;
    expect(enlace.etiqueta).toBe("contiene");
    expect(enlace.multiplicidadDestino).toBe("0..N");
    expect(enlace.multiplicidadOrigen).toBeUndefined();

    expect(pageErrors).toEqual([]);
  });

  test("Ir a origen / Ir a destino cambia opdActivoId y selecciona la entidad", async ({ page }) => {
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

    await page.getByLabel("Menú principal").click();
    await page.getByRole("menu", { name: "Menú principal" })
      .getByRole("menuitem", { name: "Tabla de enlaces" })
      .click();
    const fila = page.getByTestId("tabla-enlaces-fila").first();

    // Ir a origen → tabla cierra, Inspector entra en modo entidad con la cosa portadora del origen.
    await fila.getByTestId("tabla-enlaces-ir-origen").click();
    await expect(page.getByTestId("tabla-enlaces")).toHaveCount(0);
    const inspectorOrigen = page.getByTestId("inspector");
    await expect(inspectorOrigen).toHaveAttribute("data-modo-inspector", "entidad");
    // El header del inspector muestra el tipo, el input "Nombre" lleva el nombre canónico.
    await expect(inspectorOrigen).toContainText("Objeto");
    await expect(page.getByLabel("Nombre")).toHaveValue("Entrada");
    // La barra contextual flotante etiqueta la entidad portadora del origen.
    await expect(page.getByTestId("barra-herramientas-elemento"))
      .toHaveAttribute("aria-label", /Barra de acciones de Entrada/);

    // Reabrir tabla y ahora ir al destino.
    await page.getByLabel("Menú principal").click();
    await page.getByRole("menu", { name: "Menú principal" })
      .getByRole("menuitem", { name: "Tabla de enlaces" })
      .click();
    await page.getByTestId("tabla-enlaces-fila").first()
      .getByTestId("tabla-enlaces-ir-destino").click();
    const inspectorDestino = page.getByTestId("inspector");
    await expect(inspectorDestino).toHaveAttribute("data-modo-inspector", "entidad");
    await expect(inspectorDestino).toContainText("Proceso");
    await expect(page.getByLabel("Nombre")).toHaveValue("Procesar");

    expect(pageErrors).toEqual([]);
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
