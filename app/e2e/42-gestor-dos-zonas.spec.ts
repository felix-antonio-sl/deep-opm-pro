import { expect, test, type Page } from "@playwright/test";
import {
  esperarWorkbenchInicial,
  ejecutarComandoPalette,
  abrirDialogoCargarModelo,
} from "./_smoke-helpers";

/**
 * Ciclo documental reversible:
 *   Taller/Apunte ⇄ Modelos/Modelo → Bibliotecas
 *
 * Los espacios son navegación primaria; el rigor formal y el rol Biblioteca se
 * derivan sin crear nuevas especies. Graduar y reabrir conservan el mismo ID.
 */
const RUTA_STORE = "/src/store.ts";

async function idModeloActivo(page: Page): Promise<string> {
  const id = await page.evaluate(async (ruta) => {
    const m = (await import(ruta)) as {
      store: { getState: () => { modeloPersistidoId: string | null } };
    };
    return m.store.getState().modeloPersistidoId;
  }, RUTA_STORE);
  expect(id).toBeTruthy();
  return id as string;
}

async function marcarBiblioteca(page: Page, modeloId: string): Promise<void> {
  await page.evaluate(async ({ ruta, id }) => {
    const m = (await import(ruta)) as {
      store: { getState: () => { toggleBibliotecaModelo: (id: string) => void } };
    };
    m.store.getState().toggleBibliotecaModelo(id);
  }, { ruta: RUTA_STORE, id: modeloId });
  const dialogo = page.getByTestId("dialogo-rol-biblioteca");
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Marcar como Biblioteca", exact: true }).click();
  await expect(dialogo).toHaveCount(0);
}

test("el mismo documento transita Taller ⇄ Modelos y conserva Biblioteca como rol", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // 1. Todo nace Apunte y el gestor abre en Taller.
  await ejecutarComandoPalette(page, "nuevo", "menu-nuevo-modelo");
  await expect(page.getByTestId("cinta-apunte")).toContainText("Apunte · en Taller");
  const documentoId = await idModeloActivo(page);

  let gestor = await abrirDialogoCargarModelo(page);
  await expect(gestor.getByTestId("gestor-espacio-taller")).toHaveAttribute("aria-current", "page");
  const filaApunte = gestor.getByTestId("gestor-zona-taller")
    .getByTestId("modelo-fila-cargar")
    .filter({ hasText: /Apunte \d{4}-\d{2}-\d{2}/ })
    .first();
  await expect(filaApunte).toBeVisible();
  await expect(filaApunte.locator('[data-testid^="chip-rigor-"]')).toHaveAttribute("data-especie", "apunte");
  await gestor.getByRole("button", { name: "Cancelar" }).click();

  // 2. Graduar reconoce el documento como Modelo, sin alterar su identidad.
  await page.getByTestId("cinta-apunte-graduar").click();
  const graduacion = page.getByTestId("dialogo-graduar");
  await expect(graduacion.getByTestId("graduar-integridad")).toBeVisible();
  await expect(graduacion.getByTestId("graduar-integracion")).toBeVisible();
  await expect(graduacion.getByTestId("graduar-validez")).toBeVisible();
  await expect(graduacion.getByTestId("graduar-validacion-humana")).toContainText("no registrada");
  await graduacion.getByTestId("graduar-nombre").fill("Modelo graduado 42");
  await graduacion.getByTestId("graduar-confirmar").click();
  await expect(graduacion).toHaveCount(0);
  await expect(page.getByTestId("cinta-modelo")).toContainText("Modelo · en Modelos");
  expect(await idModeloActivo(page)).toBe(documentoId);

  gestor = await abrirDialogoCargarModelo(page);
  await expect(gestor.getByTestId("gestor-espacio-modelos")).toHaveAttribute("aria-current", "page");
  const filaModelo = gestor
    .locator('[data-testid^="gestor-modelos-"]')
    .getByTestId("modelo-fila-cargar")
    .filter({ hasText: "Modelo graduado 42" })
    .first();
  await expect(filaModelo).toBeVisible();
  await expect(filaModelo.locator('[data-testid^="chip-rigor-"]')).toHaveAttribute("data-especie", "modelo");
  await expect(
    gestor.locator('[data-testid="gestor-modelos-listos"], [data-testid="gestor-modelos-pendientes"]'),
  ).toHaveCount(1);

  // 3. Reabrir desde el propio gestor devuelve el mismo documento al Taller.
  await filaModelo.getByTestId("modelo-acciones-toggle").click();
  await filaModelo.getByRole("menuitem", { name: "Reabrir en Taller…" }).click();
  const reapertura = page.getByTestId("dialogo-reabrir-taller");
  await expect(reapertura).toBeVisible();
  await expect(reapertura.getByTestId("tutor-dialogo-reabrir")).toHaveCount(0);
  await expect(reapertura.locator('[data-tutor-surface-owner="product"]')).toHaveCount(1);
  await expect(reapertura.getByTestId("reabrir-taller-confirmar"))
    .toHaveAttribute("data-tutor-entrypoint", "workspace:reopen-workshop");
  await expect(reapertura).toContainText("No cambian su ID");
  await reapertura.getByTestId("reabrir-taller-confirmar").click();
  await expect(reapertura).toHaveCount(0);
  await expect(page.getByTestId("cinta-apunte")).toContainText("Apunte · en Taller");
  expect(await idModeloActivo(page)).toBe(documentoId);

  gestor = await abrirDialogoCargarModelo(page);
  await expect(gestor.getByTestId("gestor-espacio-taller")).toHaveAttribute("aria-current", "page");
  await expect(
    gestor.getByTestId("gestor-zona-taller")
      .getByTestId("modelo-fila-cargar")
      .filter({ hasText: "Modelo graduado 42" }),
  ).toHaveCount(1);
  await gestor.getByRole("button", { name: "Cancelar" }).click();

  // 4. Biblioteca sigue siendo un rol ortogonal: se alcanza desde Modelo y
  // ocupa su propio estante, conservando ID y mostrando preparación formal.
  await page.getByTestId("cinta-apunte-graduar").click();
  await page.getByTestId("graduar-confirmar").click();
  await expect(page.getByTestId("cinta-modelo")).toBeVisible();
  await marcarBiblioteca(page, documentoId);
  expect(await idModeloActivo(page)).toBe(documentoId);

  gestor = await abrirDialogoCargarModelo(page);
  await expect(gestor.getByTestId("gestor-espacio-bibliotecas")).toHaveAttribute("aria-current", "page");
  const filaBiblioteca = gestor.getByTestId("gestor-zona-bibliotecas")
    .getByTestId("modelo-fila-cargar")
    .filter({ hasText: "Modelo graduado 42" })
    .first();
  await expect(filaBiblioteca).toBeVisible();
  await expect(filaBiblioteca.locator('[data-testid^="chip-rigor-"]')).toHaveAttribute("data-especie", "biblioteca");
  await expect(filaBiblioteca.locator('[data-testid^="chip-rigor-"]')).toContainText("Biblioteca");

  expect(pageErrors).toEqual([]);
});
