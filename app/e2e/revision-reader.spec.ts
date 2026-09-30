import { expect, test } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { crearModelo, crearObjeto } from "../src/modelo/operaciones/creacion";
import { MESA_EXPLORACION_SCHEMA } from "../src/modelo/tipos/extensiones";
import { exportarModelo, hidratarModelo } from "../src/serializacion/json";

// La URL contiene una capacidad de lectura. Evitamos guardarla en trazas de
// Playwright, incluso cuando el test falla.
test.use({ trace: "off", screenshot: "off" });

const EMAIL = "dev@opforja.local";
const PASSWORD = "opforja-dev-password";

test("un enlace abre una revisión fija en dos lectores móviles y se revoca", async ({ page, browser }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByTestId("login-email").fill(EMAIL);
  await page.getByTestId("login-password").fill(PASSWORD);
  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("canvas-pane")).toBeVisible();

  let model = crearModelo(`Revisión compartida ${randomUUID().slice(0, 8)}`);
  const createdEntity = crearObjeto(model, model.opdRaizId, { x: 80, y: 100 }, "Objeto visible", { id: "review-visible-object" });
  if (!createdEntity.ok) throw new Error(createdEntity.error);
  model = createdEntity.value;
  model.notasMesa = {
    privateNote: { id: "privateNote", target: { tipo: "modelo" }, texto: "Nota privada del autor", fecha: "2026-01-01" },
  };
  model.mesaExploracion = {
    schema: MESA_EXPLORACION_SCHEMA,
    fuentes: {
      included: { id: "included", tipo: "texto", titulo: "Fuente compartida", contenido: "Contenido autorizado", creadaEn: "2026-01-01" },
      excluded: { id: "excluded", tipo: "texto", titulo: "Fuente privada", contenido: "Contenido que debe permanecer oculto", creadaEn: "2026-01-01" },
    },
    trazos: {},
    propuestas: {},
    confirmaciones: {},
  };
  const normalizedModel = hidratarModelo(exportarModelo(model));
  if (!normalizedModel.ok) throw new Error(normalizedModel.error);
  model = normalizedModel.value;
  const modelJson = exportarModelo(model);
  const documentId = model.id;
  let shared: { id: string; token: string } | null = null;
  let readerContextA: Awaited<ReturnType<typeof browser.newContext>> | null = null;
  let readerContextB: Awaited<ReturnType<typeof browser.newContext>> | null = null;

  try {
    const seeded = await page.evaluate(async ({ documentId, modelName, modelJson }) => {
      const sessionResponse = await fetch("/__deep-opm/session");
      const { session } = await sessionResponse.json() as { session: { tenantId: string; userId: string } };
      const identity = `${encodeURIComponent(session.tenantId)}:${encodeURIComponent(session.userId)}`;
      const headers = { "content-type": "application/json", "x-opforja-session-identity": identity };
      const saveResponse = await fetch("/__deep-opm/modelos", {
        method: "POST",
        headers,
        body: JSON.stringify({
          id: documentId,
          nombre: modelName,
          descripcion: "",
          creadoEn: "2026-01-01T00:00:00.000Z",
          actualizadoEn: "2026-01-01T00:00:00.000Z",
          autosalvado: false,
          json: modelJson,
        }),
      });
      if (!saveResponse.ok) return { saveStatus: saveResponse.status, createStatus: 0, body: null };
      const saved = await saveResponse.json() as { modelo: { revision: number } };
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(modelJson));
      const expectedWorkingCopyHash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
      const createResponse = await fetch("/__deep-opm/review/grants", {
        method: "POST",
        headers,
        body: JSON.stringify({
          documentId,
          includedSourceIds: ["included"],
          annotate: true,
          expectedRevision: saved.modelo.revision,
          expectedWorkingCopyHash,
        }),
      });
      return {
        saveStatus: saveResponse.status,
        createStatus: createResponse.status,
        body: await createResponse.json() as { share: { id: string }; token: string },
      };
    }, { documentId, modelName: model.nombre, modelJson });

    expect(seeded.saveStatus).toBe(200);
    expect(seeded.createStatus).toBe(201);
    if (!seeded.body) throw new Error("No se pudo crear la revisión compartida");
    shared = { id: seeded.body.share.id, token: seeded.body.token };

    const baseURL = new URL("/", page.url()).href;
    readerContextA = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 } });
    readerContextB = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 } });
    const readerA = await readerContextA.newPage();
    const readerB = await readerContextB.newPage();
    const reviewUrl = `/revision/${encodeURIComponent(shared.token)}`;

    await readerA.goto(reviewUrl);
    await expect(readerA.getByRole("heading", { name: model.nombre })).toBeVisible();
    await expect(readerA.getByRole("heading", { name: "Diagramas" })).toBeVisible();
    await expect(readerA.getByRole("img", { name: /Diagrama OPM/ })).toBeVisible();
    await readerA.getByText("Fuente compartida").click();
    await expect(readerA.getByText("Contenido autorizado")).toBeVisible();
    await expect(readerA.getByText("Hay fuentes que no se incluyeron en esta revisión.")).toBeVisible();
    await expect(readerA.getByText("Fuente privada")).toHaveCount(0);
    await expect(readerA.getByText("Contenido que debe permanecer oculto")).toHaveCount(0);
    await expect(readerA.getByText("Nota privada del autor")).toHaveCount(0);
    expect(await readerA.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await readerB.goto(reviewUrl);
    await expect(readerB.getByRole("heading", { name: model.nombre })).toBeVisible();
    await readerB.getByLabel("Anotación").fill("Observación del primer lector");
    await readerB.getByRole("button", { name: "Añadir anotación" }).focus();
    await readerB.keyboard.press("Shift+Tab");
    await expect(readerB.getByLabel("Anotación")).toBeFocused();
    await readerB.getByRole("button", { name: "Añadir anotación" }).click();
    await expect(readerB.getByText("Observación del primer lector")).toBeVisible();

    await readerA.reload();
    await expect(readerA.getByText("Observación del primer lector")).toBeVisible();
    await readerA.getByLabel("Anotación").fill("Observación del segundo lector");
    await readerA.getByRole("button", { name: "Añadir anotación" }).click();
    await expect(readerA.getByText("Observación del segundo lector")).toBeVisible();
    await readerB.reload();
    await expect(readerB.getByText("Observación del primer lector")).toBeVisible();
    await expect(readerB.getByText("Observación del segundo lector")).toBeVisible();

    const revokeStatus = await page.evaluate(async ({ documentId, shareId }) => {
      const sessionResponse = await fetch("/__deep-opm/session");
      const { session } = await sessionResponse.json() as { session: { tenantId: string; userId: string } };
      const identity = `${encodeURIComponent(session.tenantId)}:${encodeURIComponent(session.userId)}`;
      const response = await fetch(`/__deep-opm/review/grants/${encodeURIComponent(shareId)}?documentId=${encodeURIComponent(documentId)}`, {
        method: "DELETE",
        headers: { "x-opforja-session-identity": identity },
      });
      return response.status;
    }, { documentId, shareId: shared.id });
    expect(revokeStatus).toBe(200);
    await readerA.reload();
    await expect(readerA.getByRole("heading", { name: "Revisión no disponible" })).toBeVisible();
  } finally {
    if (shared) {
      await page.evaluate(async ({ documentId, shareId }) => {
        const sessionResponse = await fetch("/__deep-opm/session");
        if (!sessionResponse.ok) return;
        const { session } = await sessionResponse.json() as { session: { tenantId: string; userId: string } };
        const identity = `${encodeURIComponent(session.tenantId)}:${encodeURIComponent(session.userId)}`;
        await fetch(`/__deep-opm/review/grants/${encodeURIComponent(shareId)}?documentId=${encodeURIComponent(documentId)}`, {
          method: "DELETE", headers: { "x-opforja-session-identity": identity },
        });
      }, { documentId, shareId: shared.id }).catch(() => undefined);
    }
    await page.evaluate(async (documentId) => {
      const sessionResponse = await fetch("/__deep-opm/session");
      if (!sessionResponse.ok) return;
      const { session } = await sessionResponse.json() as { session: { tenantId: string; userId: string } };
      const identity = `${encodeURIComponent(session.tenantId)}:${encodeURIComponent(session.userId)}`;
      await fetch(`/__deep-opm/modelos/${encodeURIComponent(documentId)}`, {
        method: "DELETE", headers: { "x-opforja-session-identity": identity },
      });
    }, documentId).catch(() => undefined);
    await readerContextA?.close();
    await readerContextB?.close();
  }
});
