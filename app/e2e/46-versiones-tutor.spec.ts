import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  abrirDialogoCargarModelo,
  ejecutarComandoPalette,
  esperarWorkbenchInicial,
  guardarComoActual,
} from "./_smoke-helpers";

test("versiones crea, restaura como copia y elimina con recibo; el fallo conserva historia", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await guardarComoActual(page, "Tutor Versiones E2E", "Historia tipada");
  await expect.poll(() => currentPersistedModelIdOrNull(page)).not.toBeNull();
  const originalModelId = await currentPersistedModelId(page);
  await clearTransientFeedback(page);

  await ejecutarComandoPalette(page, "versiones del modelo", "menu-versiones-modelo");
  const dialog = page.getByRole("dialog", { name: /Versiones de "/ });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Mostrar versiones").check();

  const firstVersionId = await createVersionAndReadReceipt(page, dialog);
  const secondVersionId = await createVersionAndReadReceipt(page, dialog);
  expect(firstVersionId).not.toBe(secondVersionId);
  await expect(versionRow(dialog, firstVersionId)).toHaveCount(1);
  await expect(versionRow(dialog, secondVersionId)).toHaveCount(1);

  await versionRow(dialog, firstVersionId).getByRole("button", { name: "Restaurar como copia" }).click();
  const restoredReceipt = dialog.getByTestId("version-operation-receipt");
  await expect(restoredReceipt).toHaveAttribute("data-operation", "version-restore-copy");
  await expect(dialog.getByTestId("tutor-dialogo-versiones")).toHaveAttribute("data-tutor-intervention", "confirm");
  const restoredModelId = await restoredReceipt.getAttribute("data-result-id");
  expect(restoredModelId).toBeTruthy();
  expect(restoredModelId).not.toBe(originalModelId);
  await expect(versionRow(dialog, firstVersionId)).toHaveCount(1);
  await expectSingleVersionVoice(page, dialog);

  await dialog.getByRole("button", { name: "Cerrar" }).click();
  const modelManager = await abrirDialogoCargarModelo(page);
  const originalRow = modelManager.getByTestId("modelo-fila-cargar").filter({ hasText: "Historia tipada" });
  await expect(originalRow).toHaveCount(1);
  await originalRow.dblclick();
  await expect(modelManager).toHaveCount(0);
  expect(await currentPersistedModelId(page)).toBe(originalModelId);
  await ejecutarComandoPalette(page, "versiones del modelo", "menu-versiones-modelo");
  await expect(dialog).toBeVisible();
  await expect(versionRow(dialog, firstVersionId)).toHaveCount(1);
  await expect(versionRow(dialog, secondVersionId)).toHaveCount(1);

  await versionRow(dialog, firstVersionId).getByRole("button", { name: "Eliminar" }).click();
  const deleteDialog = page.getByTestId("dialogo-eliminar-version");
  await expect(deleteDialog).toBeVisible();
  await expect(deleteDialog.locator('[data-tutor-claim="product"]')).toHaveCount(1);
  await expect(dialog.getByTestId("tutor-versiones-voz")).toHaveCount(0);
  await expect(deleteDialog.getByRole("button", { name: "Cancelar" })).toBeFocused();
  await deleteDialog.getByRole("button", { name: "Cancelar" }).click();
  await expect(versionRow(dialog, firstVersionId)).toHaveCount(1);

  await versionRow(dialog, firstVersionId).getByRole("button", { name: "Eliminar" }).click();
  await deleteDialog.getByRole("button", { name: "Eliminar versión" }).click();
  const deleteReceipt = dialog.getByTestId("version-operation-receipt");
  await expect(deleteReceipt).toHaveAttribute("data-operation", "version-delete");
  await expect(deleteReceipt).toHaveAttribute("data-result-id", firstVersionId);
  await expect(deleteReceipt).toContainText("sin undo");
  await expect(versionRow(dialog, firstVersionId)).toHaveCount(0);
  await expect(versionRow(dialog, secondVersionId)).toHaveCount(1);
  await expectSingleVersionVoice(page, dialog);

  const beforeFailure = await durableVersionState(page, originalModelId);
  let failNextDelete = true;
  await page.route("**/__deep-opm/modelos/*/versiones/*", async (route) => {
    if (route.request().method() === "DELETE" && failNextDelete) {
      failNextDelete = false;
      await route.fulfill({ status: 503, json: { error: "Fallo E2E controlado" } });
      return;
    }
    await route.continue();
  });

  await versionRow(dialog, secondVersionId).getByRole("button", { name: "Eliminar" }).click();
  await deleteDialog.getByRole("button", { name: "Eliminar versión" }).click();
  const errorReceipt = dialog.getByTestId("version-operation-error");
  await expect(errorReceipt).toHaveAttribute("data-operation", "version-delete");
  await expect(errorReceipt).toContainText("El modelo y el historial local se conservaron");
  await expect(errorReceipt).toContainText("Fallo E2E controlado");
  await expect(dialog.getByTestId("tutor-dialogo-versiones")).toHaveAttribute("data-tutor-intervention", "orient");
  await expect(versionRow(dialog, secondVersionId)).toHaveCount(1);
  expect(await durableVersionState(page, originalModelId)).toEqual(beforeFailure);
  await expectSingleVersionVoice(page, dialog);

  expect(pageErrors).toEqual([]);
});

function versionRow(dialog: Locator, versionId: string): Locator {
  return dialog.locator(`[data-version-id="${versionId}"]`);
}

async function createVersionAndReadReceipt(page: Page, dialog: Locator): Promise<string> {
  await dialog.getByRole("button", { name: "Crear version ahora" }).click();
  const receipt = dialog.getByTestId("version-operation-receipt");
  await expect(receipt).toHaveAttribute("data-operation", "version-create");
  await expect(dialog.getByTestId("tutor-dialogo-versiones")).toHaveAttribute("data-tutor-intervention", "confirm");
  const resultId = await receipt.getAttribute("data-result-id");
  expect(resultId).toBeTruthy();
  await expectSingleVersionVoice(page, dialog);
  return resultId!;
}

async function expectSingleVersionVoice(page: Page, dialog: Locator): Promise<void> {
  await expect(dialog.getByTestId("tutor-versiones-voz")).toHaveCount(1);
  await expect(page.getByTestId("flash-toast").filter({ hasText: /[Vv]ersión|Fallo E2E controlado/ })).toHaveCount(0);
}

async function clearTransientFeedback(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const [{ store }, { feedbackStore }] = await Promise.all([
      import("/src/store.ts"),
      import("/src/store/feedback.ts"),
    ]);
    store.setState({ mensaje: null });
    feedbackStore.getState().clearAll();
  });
}

async function currentPersistedModelId(page: Page): Promise<string> {
  const id = await currentPersistedModelIdOrNull(page);
  if (!id) throw new Error("El modelo E2E no quedó persistido.");
  return id;
}

async function currentPersistedModelIdOrNull(page: Page): Promise<string | null> {
  return page.evaluate(async () => {
    const { store } = await import("/src/store.ts");
    return store.getState().modeloPersistidoId;
  });
}

async function durableVersionState(page: Page, originalModelId: string) {
  return page.evaluate(async (modelId) => {
    const { store } = await import("/src/store.ts");
    const state = store.getState();
    return {
      activeModel: JSON.stringify(state.modelo),
      persistedModelId: state.modeloPersistidoId,
      versionIds: state.modelosGuardados
        .find((item) => item.id === modelId)
        ?.versiones?.map((version) => version.id) ?? [],
    };
  }, originalModelId);
}
