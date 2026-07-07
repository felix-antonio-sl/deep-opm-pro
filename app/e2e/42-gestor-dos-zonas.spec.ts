import { expect, test, type Page } from "@playwright/test";
import {
  esperarWorkbenchInicial,
  ejecutarComandoPalette,
  abrirDialogoCargarModelo,
} from "./_smoke-helpers";

/**
 * Ola 4 «Gestor de dos zonas rigor×rol» (diseño §6). Verifica que el gestor
 * segrega por ROL (Trabajo vs Bibliotecas) y que el chip de rigor deriva de la
 * ESPECIE (Apunte/Modelo), mutando in-situ al graduar SIN que la fila salte de
 * zona (maduró el rigor, no cambió el rol). Marcar biblioteca SÍ cambia el rol:
 * la fila salta al estante «Bibliotecas».
 */
const RUTA_STORE = "/src/store.ts";

async function idModeloActivo(page: Page): Promise<string> {
  const id = await page.evaluate(async (ruta) => {
    const m = (await import(ruta)) as { store: { getState: () => { modeloPersistidoId: string | null } } };
    return m.store.getState().modeloPersistidoId;
  }, RUTA_STORE);
  expect(id).toBeTruthy();
  return id as string;
}

async function marcarBiblioteca(page: Page, modeloId: string): Promise<void> {
  await page.evaluate(async ({ ruta, id }) => {
    const m = (await import(ruta)) as { store: { getState: () => { toggleBibliotecaModelo: (id: string) => void } } };
    m.store.getState().toggleBibliotecaModelo(id);
  }, { ruta: RUTA_STORE, id: modeloId });
}

test("dos zonas rigor×rol: el chip muta in-situ al graduar; marcar biblioteca salta de zona", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // 1. Nace un apunte (puerta «Nuevo» real).
  await ejecutarComandoPalette(page, "nuevo", "menu-nuevo-modelo");
  await expect(page.getByTestId("cinta-apunte")).toBeVisible();

  // 2. En el gestor, el apunte está en la zona «Trabajo» con chip «Apunte».
  let gestor = await abrirDialogoCargarModelo(page);
  const trabajo = gestor.getByTestId("gestor-zona-trabajo");
  await expect(trabajo).toBeVisible();
  const filaApunte = trabajo
    .getByTestId("modelo-fila-cargar")
    .filter({ hasText: /Apunte \d{4}-\d{2}-\d{2}/ })
    .first();
  await expect(filaApunte).toBeVisible();
  const chipApunte = filaApunte.locator('[data-testid^="chip-rigor-"]');
  await expect(chipApunte).toHaveAttribute("data-especie", "apunte");
  await expect(chipApunte).toHaveText("Apunte");
  // Aún no hay biblioteca: la fila del apunte no está en un estante de bibliotecas.
  await expect(gestor.getByTestId("gestor-zona-bibliotecas")).toHaveCount(0);
  await gestor.getByRole("button", { name: "Cancelar" }).click();
  await expect(gestor).toHaveCount(0);

  // 3. Graduar desde la cinta (nombre definitivo).
  await page.getByTestId("cinta-apunte-graduar").click();
  await expect(page.getByTestId("dialogo-graduar")).toBeVisible();
  await page.getByTestId("graduar-nombre").fill("Modelo graduado 42");
  await page.getByTestId("graduar-confirmar").click();
  await expect(page.getByTestId("cinta-apunte")).toHaveCount(0);
  const modeloId = await idModeloActivo(page);

  // 4. Reabrir: el MISMO ítem sigue en «Trabajo» pero con el chip mutado a «Modelo»
  //    (maduró, no cambió de rol → no saltó de zona).
  gestor = await abrirDialogoCargarModelo(page);
  const trabajo2 = gestor.getByTestId("gestor-zona-trabajo");
  const filaModelo = trabajo2
    .getByTestId("modelo-fila-cargar")
    .filter({ hasText: "Modelo graduado 42" })
    .first();
  await expect(filaModelo).toBeVisible();
  const chipModelo = filaModelo.locator('[data-testid^="chip-rigor-"]');
  await expect(chipModelo).toHaveAttribute("data-especie", "modelo");
  await expect(chipModelo).toHaveText("Modelo");
  // No está en un estante de bibliotecas todavía.
  await expect(
    gestor.getByTestId("gestor-zona-bibliotecas").getByTestId("modelo-fila-cargar").filter({ hasText: "Modelo graduado 42" }),
  ).toHaveCount(0);
  await gestor.getByRole("button", { name: "Cancelar" }).click();
  await expect(gestor).toHaveCount(0);

  // 5. Marcar biblioteca = cambio de ROL → la fila salta al estante «Bibliotecas»
  //    (y ya no está en «Trabajo»).
  await marcarBiblioteca(page, modeloId);
  gestor = await abrirDialogoCargarModelo(page);
  const bibliotecas = gestor.getByTestId("gestor-zona-bibliotecas");
  await expect(bibliotecas).toBeVisible();
  const filaBiblioteca = bibliotecas
    .getByTestId("modelo-fila-cargar")
    .filter({ hasText: "Modelo graduado 42" })
    .first();
  await expect(filaBiblioteca).toBeVisible();
  // En su estante ya no lleva chip de rigor (self-suppress de la especie biblioteca).
  await expect(filaBiblioteca.locator('[data-testid^="chip-rigor-"]')).toHaveCount(0);
  // Salió de «Trabajo».
  await expect(
    gestor.getByTestId("gestor-zona-trabajo").getByTestId("modelo-fila-cargar").filter({ hasText: "Modelo graduado 42" }),
  ).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});
