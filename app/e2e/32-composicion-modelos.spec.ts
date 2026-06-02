import { expect, test } from "@playwright/test";
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
  await page.addInitScript(({ resumenPersistido, modelo }) => {
    localStorage.setItem(
      "deep-opm-pro:persistencia:index",
      JSON.stringify({ formato: "deep-opm-pro.persistencia.local.v1", modelos: [resumenPersistido] }),
    );
    localStorage.setItem(
      `deep-opm-pro:persistencia:modelo:${resumenPersistido.id}`,
      JSON.stringify({ formato: "deep-opm-pro.persistencia.local.v1", modelo: { ...resumenPersistido, json: JSON.stringify(modelo) } }),
    );
    localStorage.setItem(
      "deep-opm-pro:persistencia:workspace",
      JSON.stringify({ modelos: [{ id: resumenPersistido.id, carpetaId: null }], carpetas: [], recientes: [] }),
    );
  }, { resumenPersistido: resumen, modelo: modeloFacturacion() });

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Cliente");

  await ejecutarComandoPalette(page, "componer", "accion-componer-modelo");
  const dialogo = page.getByTestId("dialogo-composicion");
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByText("Modelo facturación E2E")).toBeVisible();
  await dialogo.getByTestId("composicion-modelo-tile").first().click();
  await expect(dialogo.getByLabel("Compartir Cliente")).toBeVisible();
  await expect(dialogo.getByText("1 activa")).toBeVisible();
  await dialogo.getByRole("button", { name: "Componer", exact: true }).click();
  await expect(dialogo).toHaveCount(0);

  const exportado = await exportadoActual(page);
  const nombres = Object.values(exportado.modelo.entidades).map((entidad) => entidad.nombre);
  expect(nombres.filter((nombre) => nombre === "Cliente")).toHaveLength(1);
  expect(nombres).toContain("Factura");
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
