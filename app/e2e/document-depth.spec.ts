import { expect, test } from "@playwright/test";
import {
  ejecutarAccionCommandPalette,
  ejecutarComandoPalette,
  exportadoActual,
  type ExportadoModelo,
} from "./_smoke-helpers";

test("navegar profundidad conserva hechos y distingue OPL local del completo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByTestId("toolbar-drag-proceso")).toBeVisible({ timeout: 15_000 });
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (texto: string) => { (window as Window & { __copiedOpl?: string }).__copiedOpl = texto; } },
    });
  });

  // Describir por dentro crea una vez y pide una pregunta; la navegación
  // posterior usa el refinamiento ya existente.
  await page.getByTestId("toolbar-drag-proceso").click();
  await ejecutarAccionCommandPalette(page, "inzoom", "accion-inzoom");
  // Un hecho existente en el hijo hace visible el bloque OPL enfocado.
  await page.getByTestId("toolbar-drag-objeto").click();
  await page.getByLabel("Nombre").fill("Detalle");

  const creado = await exportadoActual(page);
  const opdRaizId = creado.modelo.opdRaizId;
  const proceso = Object.values(creado.modelo.entidades).find((entidad) => entidad.nombre === "Proceso");
  const opdHijoId = proceso?.refinamientos?.descomposicion?.opdId;
  if (!proceso || !opdHijoId) throw new Error("La confirmación no creó el refinamiento esperado");
  const firmaAntesDeNavegar = firmaSemantica(creado.modelo);

  await expect(page.getByTestId("opl-alcance")).toHaveText("OPL completo · todos los OPDs");
  await expect(page.getByTestId("opl-bloque-foco")).toHaveText("en foco · nivel 1");
  const bloqueActivo = page.getByTestId(`bloque-opl-${opdHijoId}`);
  await expect(bloqueActivo).toHaveAttribute("data-opd-activo", "true");
  await expect(bloqueActivo.locator("[aria-current='location']")).toBeVisible();

  // Volver por la ruta y entrar otra vez desde el árbol son cambios de foco.
  await page.getByTestId("breadcrumb-opd-sd").click();
  await expect(page.locator(`[role='treeitem'][data-opd-id='${opdRaizId}']`)).toHaveAttribute("aria-current", "page");
  await expect(page.getByTestId("tutor-refinamiento")).toHaveCount(0);
  const hijo = page.locator(`[role='treeitem'][data-opd-id='${opdHijoId}']`);
  await hijo.click();
  await expect(hijo).toHaveAttribute("aria-current", "page");
  await expect(page.getByTestId("opl-alcance")).toHaveText("OPL completo · todos los OPDs");

  const trasNavegar = await exportadoActual(page);
  expect(firmaSemantica(trasNavegar.modelo)).toEqual(firmaAntesDeNavegar);

  await page.getByTestId("panel-opl-copiar").click();
  await expect(page.getByText("OPL copiado al portapapeles")).toBeVisible();
  const oplLocal = await page.evaluate(() => (window as Window & { __copiedOpl?: string }).__copiedOpl ?? "");
  expect(oplLocal).toContain("> Alcance: OPL local del OPD «SD1».");
  expect(oplLocal).not.toContain("OPL completo del modelo");

  await ejecutarComandoPalette(page, "exportar opl del modelo", "menu-exportar-opl-modelo");
  const oplCompleto = await page.evaluate(() => (window as Window & { __copiedOpl?: string }).__copiedOpl ?? "");
  expect(oplCompleto).toContain("> Alcance: OPL completo del modelo");
  expect(oplCompleto).toContain("## SD\n");
  expect(oplCompleto).toContain("## SD1\n");
  expect(oplCompleto).not.toContain("<");

  expect(pageErrors).toEqual([]);
});

function firmaSemantica(modelo: ExportadoModelo["modelo"]): unknown {
  const idsOrdenados = (registro: Record<string, unknown>) => Object.keys(registro).sort();
  return {
    root: modelo.opdRaizId,
    opds: idsOrdenados(modelo.opds).map((id) => [id, modelo.opds[id]?.padreId]),
    entidades: idsOrdenados(modelo.entidades),
    estados: idsOrdenados(modelo.estados),
    enlaces: idsOrdenados(modelo.enlaces),
    refinamientos: Object.values(modelo.entidades)
      .map((entidad) => [entidad.id, entidad.refinamientos ?? null])
      .sort(([a], [b]) => String(a).localeCompare(String(b))),
  };
}
