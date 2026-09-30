import { expect, test, type Page } from "@playwright/test";
import { esperarWorkbenchInicial } from "./_smoke-helpers";

test("retiene ambas ramas tras una divergencia y aplica solo la rama que el usuario elige", async ({ page }) => {
  instalarBackend(page);
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await expect.poll(() => page.evaluate(async () => {
    const { getDocumentLocalIdentity } = await import("/src/persistencia/backend.ts");
    return getDocumentLocalIdentity().status;
  })).toBe("authenticated");

  const transportResult = await page.evaluate(async () => {
    const { store } = await import("/src/store.ts");
    const { exportarModelo } = await import("/src/serializacion/json.ts");
    const { createDocumentPersistencePort } = await import("/src/app/ports/documentPersistencePort.ts");
    const documentId = "doc-sync-conflict-e2e";
    const state = store.getState();
    const baseline = exportarModelo(state.modelo, null);
    const localModel = { ...state.modelo, nombre: "Rama local" };
    const remoteModel = { ...state.modelo, nombre: "Rama remota" };
    const remoteJson = exportarModelo(remoteModel, null);
    const localTab = state.pestanasAbiertas.find((tab) => tab.id === state.pestanaActivaId);
    store.setState({
      modelo: localModel,
      modeloPersistidoId: documentId,
      revisionBasePorModelo: { ...state.revisionBasePorModelo, [documentId]: 1 },
      dirty: true,
      dirtyModelo: true,
      ...(localTab ? { pestanasAbiertas: state.pestanasAbiertas.map((tab) => tab.id === localTab.id
        ? { ...tab, modeloId: documentId, modelo: localModel, snapshotJson: baseline, dirty: true }
        : tab) } : {}),
    });
    let commits = 0;
    const port = createDocumentPersistencePort(documentId, {
      transport: {
        async readRemote() { return { revision: 2, snapshotJson: remoteJson }; },
        async commitRemote() { commits += 1; throw new Error("No se debe aplicar sobre una rama divergente"); },
      },
    });
    await port.saveHere();
    const result = await port.synchronize();
    port.dispose();
    return { kind: result.kind, commits, documentId };
  });

  expect(transportResult).toEqual({ kind: "conflict", commits: 0, documentId: "doc-sync-conflict-e2e" });
  const statusButton = page.getByRole("button", { name: "Guardado del documento: Revisar conflicto" });
  await expect(statusButton).toBeVisible();
  await statusButton.click();
  await expect(page.getByRole("region", { name: "Ramas en conflicto" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Rama local" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Rama remota" })).toBeVisible();

  await page.getByRole("button", { name: "Usar rama remota", exact: true }).click();
  await expect.poll(() => page.evaluate(async () => {
    const { store } = await import("/src/store.ts");
    return store.getState().modelo.nombre;
  })).toBe("Rama remota");
  const recovery = await page.evaluate(async () => {
    const { getLocalDocumentRepository } = await import("/src/persistencia/localRepository.ts");
    const { getDocumentLocalIdentity } = await import("/src/persistencia/backend.ts");
    const identity = getDocumentLocalIdentity();
    if (identity.status !== "authenticated") return null;
    return getLocalDocumentRepository().recoveryJson(identity.identity, "doc-sync-conflict-e2e");
  });
  expect(recovery).not.toBeNull();
  const recovered = JSON.parse(recovery!) as { document: { conflicts: Array<{ localSnapshotJson: string; remoteSnapshotJson: string; status: string }> } };
  expect(recovered.document.conflicts[0]).toMatchObject({
    localSnapshotJson: expect.stringContaining("Rama local"),
    remoteSnapshotJson: expect.stringContaining("Rama remota"),
    status: "resolved",
  });
});

function instalarBackend(page: Page): void {
  const session = { tenantId: "tenant-sync-conflict-e2e", userId: "user-sync-conflict-e2e" };
  page.route("**/__deep-opm/session", (route) => route.fulfill({ json: { session } }));
  page.route("**/__deep-opm/workspace", (route) => route.fulfill({ json: { indice: { modelos: [], carpetas: [], recientes: [] } } }));
  page.route("**/__deep-opm/modelos", (route) => route.fulfill({ json: { modelos: [] } }));
}
