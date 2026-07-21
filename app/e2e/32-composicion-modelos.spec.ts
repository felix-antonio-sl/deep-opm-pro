import { expect, test, type Page } from "@playwright/test";
import { ejecutarComandoPalette, esperarWorkbenchInicial, exportadoActual } from "./_smoke-helpers";

test("componer con modelo desde catálogo aplica interfaz compartida sugerida", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const resumen = {
    id: "modelo-composicion-e2e",
    nombre: "Modelo facturación E2E",
    descripcion: "Interfaz Cliente + Factura",
    creadoEn: "2026-06-02T00:00:00.000Z",
    actualizadoEn: "2026-06-02T00:05:00.000Z",
  };
  await instalarCatalogoBackendMock(page, [{
    ...resumen,
    carpetaId: null,
    json: JSON.stringify(modeloFacturacion()),
    revision: 1,
  }]);

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Cliente");

  await ejecutarComandoPalette(page, "componer", "accion-componer-modelo");
  const dialogo = page.getByTestId("dialogo-composicion");
  await expect(dialogo).toBeVisible();
  const tutor = dialogo.getByTestId("tutor-dialogo-composicion");
  await expect(tutor).toHaveAttribute("data-tutor-intervention", "ask");
  await expect(tutor).toContainText("Confirma interfaz, mapeos, procedencia y contenido incorporado.");
  await tutor.getByText("Criterio", { exact: true }).click();
  await expect(tutor).toContainText("Mapeos irresolubles o integridad rota bloquean");
  await expect(dialogo.getByText("Modelo facturación E2E")).toBeVisible();
  await dialogo.getByTestId("composicion-modelo-tile").first().click();
  await expect(tutor).toHaveAttribute("data-tutor-intervention", "orient");
  await expect(dialogo.getByLabel("Compartir Cliente")).toBeVisible();
  await expect(dialogo.getByText("1 activa")).toBeVisible();

  // Simula un mapeo obsoleto que quedó apuntando a una entidad inexistente.
  // La transacción debe bloquearse y permitir volver a una opción válida sin
  // tocar el modelo activo.
  const exportadoAntes = await exportadoActualSinCerrarComposicion(page);
  await dialogo.getByLabel("Compartir Cliente").evaluate((select) => {
    const option = document.createElement("option");
    option.value = "entidad-inexistente";
    option.textContent = "Entidad inexistente";
    select.append(option);
    (select as HTMLSelectElement).value = option.value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await expect(tutor).toHaveAttribute("data-tutor-intervention", "block");
  await expect(dialogo.getByRole("button", { name: "Componer", exact: true })).toBeDisabled();

  await dialogo.getByLabel("Compartir Cliente").selectOption({ label: "Cliente" });
  await expect(tutor).toHaveAttribute("data-tutor-intervention", "orient");
  expect(await exportadoActualSinCerrarComposicion(page)).toEqual(exportadoAntes);
  await dialogo.getByRole("button", { name: "Componer", exact: true }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(page.getByTestId("flash-toast").filter({ hasText: 'Modelo compuesto con "Modelo facturación E2E"' })).toBeVisible();
  await expect(page.getByTestId("tutor-dialogo-composicion")).toHaveCount(0);

  const exportado = await exportadoActual(page);
  const nombres = Object.values(exportado.modelo.entidades).map((entidad) => entidad.nombre);
  expect(nombres.filter((nombre) => nombre === "Cliente")).toHaveLength(1);
  expect(nombres).toContain("Factura");

  await page.keyboard.press("Control+z");
  await expect.poll(() => exportadoActualSinCerrarComposicion(page)).toEqual(exportadoAntes);

  await page.keyboard.press("Control+Shift+z");
  await expect.poll(() => exportadoActualSinCerrarComposicion(page)).toEqual(exportado);
  expect(pageErrors).toEqual([]);
});

function modeloFacturacion() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-facturacion",
      nombre: "Modelo facturación E2E",
      opdRaizId: "opd-facturacion",
      nextSeq: 10,
      entidades: {
        "obj-cliente-b": { id: "obj-cliente-b", tipo: "objeto", nombre: "Cliente", esencia: "informacional", afiliacion: "sistemica" },
        "obj-factura-b": { id: "obj-factura-b", tipo: "objeto", nombre: "Factura", esencia: "informacional", afiliacion: "sistemica" },
      },
      estados: {},
      enlaces: {},
      abanicos: {},
      opds: {
        "opd-facturacion": {
          id: "opd-facturacion",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "ap-cliente-b": { id: "ap-cliente-b", entidadId: "obj-cliente-b", opdId: "opd-facturacion", x: 80, y: 120, width: 135, height: 60 },
            "ap-factura-b": { id: "ap-factura-b", entidadId: "obj-factura-b", opdId: "opd-facturacion", x: 300, y: 120, width: 135, height: 60 },
          },
          enlaces: {},
        },
      },
    },
  };
}

async function instalarCatalogoBackendMock(page: Page, modelos: ModeloApi[]): Promise<void> {
  let workspace = { modelos: modelos.map((modelo) => ({ id: modelo.id, carpetaId: modelo.carpetaId ?? null })), carpetas: [], recientes: modelos.map((modelo) => modelo.id) };
  await page.route("**/__deep-opm/session", async (route) => {
    await route.fulfill({ json: { session: { tenantId: "tenant-e2e", userId: "user-e2e" } } });
  });
  await page.route("**/__deep-opm/workspace", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: { indice: workspace } });
      return;
    }
    const body = JSON.parse(route.request().postData() ?? "{}") as { indice?: typeof workspace };
    workspace = body.indice ?? workspace;
    await route.fulfill({ json: { indice: workspace } });
  });
  await page.route("**/__deep-opm/modelos**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname !== "/__deep-opm/modelos") {
      await route.fallback();
      return;
    }
    await route.fulfill({ json: { modelos } });
  });
  await page.route("**/__deep-opm/modelos/*", async (route) => {
    const id = decodeURIComponent(new URL(route.request().url()).pathname.split("/").pop() ?? "");
    const modelo = modelos.find((item) => item.id === id);
    await route.fulfill(modelo ? { json: { modelo } } : { status: 404, json: { error: "Modelo no encontrado" } });
  });
}

interface ModeloApi {
  id: string;
  nombre: string;
  descripcion: string;
  creadoEn: string;
  actualizadoEn: string;
  carpetaId?: string | null;
  json: string;
  revision: number;
}

async function exportadoActualSinCerrarComposicion(page: Page) {
  return page.evaluate(async () => {
    const { store } = await import("/src/store.ts");
    return JSON.parse(store.getState().exportarJson());
  });
}
