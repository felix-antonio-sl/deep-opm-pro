/**
 * Smoke ronda 16 L1 — Beta1: TablaEnlaces como workbench.
 *
 * Cubre el slice minimo del brief `linea-1-tabla-enlaces-workbench.md`:
 *  - filtro por tipo,
 *  - eliminacion con confirmacion inline (cross-OPD),
 *  - edicion canonica de multiplicidad (1, 0..1, N, 0..N, *) con commit en Enter,
 *  - filas reflejan modelo cargado por JSON con multiples enlaces,
 *  - empty state tras vaciar.
 *
 * Anclajes complementarios al contrato cerrado en
 * `15-superficie-contextual.spec.ts` describe "Contrato TablaEnlaces Beta1".
 */

import { expect, test, type Page } from "@playwright/test";
import { esperarWorkbenchInicial, ejecutarComandoPalette, jsonEditor, modeloSmokeTablaEnlaces, modeloMarkersCanonicos, modeloTransicionEstados } from "./_smoke-helpers";

async function abrirTablaPorMenu(page: Page): Promise<void> {
  // Ronda Codex v2 L5: el menú lateral se retiró; la Tabla de enlaces se abre
  // desde el command palette (vía única de comandos).
  await ejecutarComandoPalette(page, "tabla de enlaces", "menu-tabla-enlaces");
  await expect(page.getByTestId("tabla-enlaces")).toBeVisible();
}

async function snapshotFocoCanvas(page: Page): Promise<Array<{ kind: string; enlaceId?: string; targetId?: string; targetKind?: string; strokeWidth: number | null; wrapperStroke?: string }>> {
  return page.evaluate(() => {
    type CellProbe = {
      id: string | number;
      prop: (path: string) => unknown;
      get: (path: string) => unknown;
    };
    type AdapterProbe = { graph: { getCells: () => CellProbe[] } };
    type OpmProbe = { kind?: string; enlaceId?: string; targetId?: string; targetKind?: string };
    type AttrsProbe = { line?: { strokeWidth?: unknown }; wrapper?: { stroke?: unknown } };

    const adapter = (window as unknown as { __opmJointAdapter?: AdapterProbe }).__opmJointAdapter;
    if (!adapter) return [];
    return adapter.graph.getCells().map((cell) => {
      const opm = cell.prop("opm") as OpmProbe | undefined;
      const attrs = cell.get("attrs") as AttrsProbe | undefined;
      const strokeWidth = attrs?.line?.strokeWidth;
      return {
        kind: opm?.kind ?? "",
        enlaceId: opm?.enlaceId,
        targetId: opm?.targetId,
        targetKind: opm?.targetKind,
        strokeWidth: typeof strokeWidth === "number" ? strokeWidth : null,
        wrapperStroke: typeof attrs?.wrapper?.stroke === "string" ? attrs.wrapper.stroke : undefined,
      };
    });
  });
}

test("workbench Beta1: lista, filtra, edita multiplicidad y elimina enlace cross-OPD", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloSmokeTablaEnlaces(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();

  await abrirTablaPorMenu(page);
  // El modelo organizacional smoke trae 3 enlaces (agente, consumo, resultado).
  await expect(page.getByTestId("tabla-enlaces-fila")).toHaveCount(3);

  // Filtro por tipo deja una sola fila.
  await page.getByTestId("tabla-enlaces-filtro").selectOption("consumo");
  await expect(page.getByTestId("tabla-enlaces-fila")).toHaveCount(1);
  const filaConsumo = page.getByTestId("tabla-enlaces-fila").first();
  await expect(filaConsumo.getByTestId("tabla-enlaces-celda-tipo")).toHaveText("Consumo");
  await expect(filaConsumo.getByTestId("tabla-enlaces-celda-origen")).toHaveText("Solicitud");
  await expect(filaConsumo.getByTestId("tabla-enlaces-celda-destino")).toHaveText("Resolver solicitud");

  // Edicion canonica de multiplicidad origen y destino.
  await filaConsumo.getByTestId("tabla-enlaces-mult-origen-input").click();
  await filaConsumo.getByTestId("tabla-enlaces-mult-origen-input").fill("1");
  await filaConsumo.getByTestId("tabla-enlaces-mult-origen-input").press("Enter");
  await filaConsumo.getByTestId("tabla-enlaces-mult-destino-input").click();
  await filaConsumo.getByTestId("tabla-enlaces-mult-destino-input").fill("0..N");
  await filaConsumo.getByTestId("tabla-enlaces-mult-destino-input").press("Tab");

  // Quito el filtro y verifico que las 3 filas siguen ahi.
  await page.getByTestId("tabla-enlaces-filtro").selectOption("todos");
  await expect(page.getByTestId("tabla-enlaces-fila")).toHaveCount(3);

  // Eliminacion con confirmacion: borro la agregacion organizacional (en realidad no hay, eliminemos la 'agente').
  await page.getByTestId("tabla-enlaces-filtro").selectOption("agente");
  const filaAgente = page.getByTestId("tabla-enlaces-fila").first();
  await filaAgente.getByTestId("tabla-enlaces-eliminar").click();
  await expect(filaAgente.getByTestId("tabla-enlaces-confirmar-eliminar")).toBeVisible();
  // Cancelar primero — la fila sigue.
  await filaAgente.getByTestId("tabla-enlaces-cancelar-eliminar").click();
  await expect(page.getByTestId("tabla-enlaces-fila")).toHaveCount(1);
  // Confirmar ahora.
  await filaAgente.getByTestId("tabla-enlaces-eliminar").click();
  await filaAgente.getByTestId("tabla-enlaces-confirmar-eliminar").click();

  // Tras borrado, en el filtro "agente" no quedan filas.
  await expect(page.getByTestId("tabla-enlaces-vacio")).toBeVisible();
  await page.getByTestId("tabla-enlaces-filtro").selectOption("todos");
  await expect(page.getByTestId("tabla-enlaces-fila")).toHaveCount(2);

  // Verifico via JSON: el enlace agente desaparecio del modelo y la mult quedo persistida.
  await page.getByTestId("tabla-enlaces-cerrar").click();
  const json = await jsonEditor(page).inputValue();
  const exportado = JSON.parse(json);
  const enlaces = Object.values(exportado.modelo.enlaces) as Array<Record<string, unknown>>;
  expect(enlaces.find((e) => e.tipo === "agente")).toBeUndefined();
  const consumoFinal = enlaces.find((e) => e.tipo === "consumo");
  expect(consumoFinal?.multiplicidadOrigen).toBe("1");
  expect(consumoFinal?.multiplicidadDestino).toBe("0..N");

  expect(pageErrors).toEqual([]);
});

test("workbench Beta1: ordenamiento por columna alterna ascendente/descendente", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloSmokeTablaEnlaces(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  await abrirTablaPorMenu(page);

  const colTipo = page.getByTestId("tabla-enlaces-col-tipo");
  await colTipo.click();
  await expect(colTipo).toHaveAttribute("aria-sort", "ascending");
  await colTipo.click();
  await expect(colTipo).toHaveAttribute("aria-sort", "descending");

  // El orden ascendente por tipo deja la primera fila en "Agente" (alfabético entre agente/consumo/resultado).
  await colTipo.click();
  await expect(colTipo).toHaveAttribute("aria-sort", "ascending");
  await expect(page.getByTestId("tabla-enlaces-fila").first()
    .getByTestId("tabla-enlaces-celda-tipo")).toHaveText("Agente");

  expect(pageErrors).toEqual([]);
});

test("workbench denso: busca enlaces y filtra por familia sin perder contexto", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  const modelo = modeloMarkersCanonicos();
  modelo.modelo.enlaces["e-agent"].etiqueta = "rol clinico";
  await jsonEditor(page).fill(JSON.stringify(modelo, null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  await abrirTablaPorMenu(page);

  await expect(page.getByTestId("tabla-enlaces-fila")).toHaveCount(10);
  await expect(page.getByTestId("tabla-enlaces-contador")).toContainText("10 de 10 enlaces");
  await expect(page.getByTestId("tabla-enlaces-contador")).toContainText("6 procedurales");
  await expect(page.getByTestId("tabla-enlaces-contador")).toContainText("4 estructurales");

  await page.getByTestId("tabla-enlaces-familia-procedural").click();
  await expect(page.getByTestId("tabla-enlaces-fila")).toHaveCount(6);
  await expect(page.getByTestId("tabla-enlaces-familia-procedural")).toHaveAttribute("aria-pressed", "true");

  await page.getByTestId("tabla-enlaces-buscar").fill("rol clinico");
  await expect(page.getByTestId("tabla-enlaces-fila")).toHaveCount(1);
  await expect(page.getByTestId("tabla-enlaces-fila").first()).toContainText("Agente");

  await page.getByTestId("tabla-enlaces-limpiar-filtros").click();
  await expect(page.getByTestId("tabla-enlaces-fila")).toHaveCount(10);
  await expect(page.getByTestId("tabla-enlaces-familia-todos")).toHaveAttribute("aria-pressed", "true");

  await page.getByTestId("tabla-enlaces-familia-estructural").click();
  await expect(page.getByTestId("tabla-enlaces-fila")).toHaveCount(4);
  await page.getByTestId("tabla-enlaces-buscar").fill("Caracteristica");
  await expect(page.getByTestId("tabla-enlaces-fila")).toHaveCount(1);
  await expect(page.getByTestId("tabla-enlaces-fila").first()
    .getByTestId("tabla-enlaces-celda-tipo")).toHaveText("Exhibicion");

  await page.getByTestId("tabla-enlaces-buscar").fill("SD");
  await expect(page.getByTestId("tabla-enlaces-fila")).toHaveCount(4);

  expect(pageErrors).toEqual([]);
});

test("workbench denso: resalta filas filtradas en el canvas sin cerrar tabla", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  const modelo = modeloMarkersCanonicos();
  modelo.modelo.enlaces["e-agent"].etiqueta = "rol clinico";
  await jsonEditor(page).fill(JSON.stringify(modelo, null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  await abrirTablaPorMenu(page);

  await page.getByTestId("tabla-enlaces-familia-procedural").click();
  await page.getByTestId("tabla-enlaces-buscar").fill("rol clinico");
  await expect(page.getByTestId("tabla-enlaces-fila")).toHaveCount(1);

  await page.getByTestId("tabla-enlaces-enfocar-filtrados").click();

  await expect(page.getByTestId("tabla-enlaces")).toBeVisible();
  await expect(page.getByTestId("tabla-enlaces-foco-status")).toContainText("1 enlace resaltado");
  await expect.poll(async () => {
    const cells = await snapshotFocoCanvas(page);
    const enlaces = cells.filter((cell) => cell.kind === "enlace" && cell.enlaceId === "e-agent");
    return {
      enlaceResaltado: enlaces.some((cell) => cell.wrapperStroke !== undefined && cell.wrapperStroke !== "transparent"),
      halos: cells
        .filter((cell) => cell.kind === "selection-halo")
        .map((cell) => cell.targetId)
        .filter((id): id is string => typeof id === "string")
        .sort(),
    };
  }).toEqual({
    enlaceResaltado: true,
    halos: ["o-agent", "p-agent"],
  });

  expect(pageErrors).toEqual([]);
});

test("workbench denso: resalta extremo de estado filtrado sobre la capsula OPM", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  const modelo = modeloTransicionEstados();
  modelo.modelo.enlaces["e-consumo"].etiqueta = "entrada-pendiente";
  await jsonEditor(page).fill(JSON.stringify(modelo, null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  await abrirTablaPorMenu(page);

  await page.getByTestId("tabla-enlaces-buscar").fill("entrada-pendiente");
  await expect(page.getByTestId("tabla-enlaces-fila")).toHaveCount(1);

  await page.getByTestId("tabla-enlaces-enfocar-filtrados").click();

  await expect(page.getByTestId("tabla-enlaces")).toBeVisible();
  await expect(page.getByTestId("tabla-enlaces-foco-status")).toContainText("1 enlace resaltado");
  await expect.poll(async () => {
    const cells = await snapshotFocoCanvas(page);
    const enlaces = cells.filter((cell) => cell.kind === "enlace" && cell.enlaceId === "e-consumo");
    const halos = cells.filter((cell) => cell.kind === "selection-halo");
    return {
      enlaceResaltado: enlaces.some((cell) => cell.wrapperStroke !== undefined && cell.wrapperStroke !== "transparent"),
      haloEstado: halos.some((cell) => cell.targetId === "s-pendiente" && cell.targetKind === "estado"),
      haloObjetoPedido: halos.some((cell) => cell.targetId === "o-pedido"),
      haloProceso: halos.some((cell) => cell.targetId === "p-aprobar"),
    };
  }).toEqual({
    enlaceResaltado: true,
    haloEstado: true,
    haloObjetoPedido: false,
    haloProceso: true,
  });

  expect(pageErrors).toEqual([]);
});

test("workbench Beta1: edicion de etiqueta persiste y la fila refleja el cambio sin reabrir", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloSmokeTablaEnlaces(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  await abrirTablaPorMenu(page);

  await page.getByTestId("tabla-enlaces-filtro").selectOption("agente");
  const fila = page.getByTestId("tabla-enlaces-fila").first();
  const etiqueta = fila.getByTestId("tabla-enlaces-etiqueta-input");
  await etiqueta.click();
  await etiqueta.fill("inicia");
  await etiqueta.blur();

  await expect(etiqueta).toHaveValue("inicia");

  // Verifico via JSON.
  await page.getByTestId("tabla-enlaces-cerrar").click();
  const exportado = JSON.parse(await jsonEditor(page).inputValue());
  const agente = (Object.values(exportado.modelo.enlaces) as Array<Record<string, unknown>>)
    .find((e) => e.tipo === "agente");
  expect(agente?.etiqueta).toBe("inicia");

  expect(pageErrors).toEqual([]);
});
