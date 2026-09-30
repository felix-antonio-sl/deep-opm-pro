import { expect, test } from "@playwright/test";
import { crearModelo, crearObjeto } from "../src/modelo/operaciones";
import { exportarModelo } from "../src/serializacion/json";
import { createPortablePackage, PORTABLE_READER_PROFILE } from "../src/serializacion/portablePackage";

test.use({ trace: "off", screenshot: "off", serviceWorkers: "allow" });

test("abre un paquete local y vuelve a leerlo sin red tras preparar el shell", async ({ page }) => {
  const manifestResponse = await page.request.get("/portable-reader/asset-manifest.json");
  test.skip(!manifestResponse.ok(), "El lector portable estático requiere un build de preview.");
  const manifest = await manifestResponse.json() as { version?: number; urls?: string[] };
  test.skip(manifest.version !== 1 || !manifest.urls?.some((url) => new URL(url, "http://portable-reader.invalid/").pathname === "/portable-reader/index.html"), "El manifest de desarrollo no declara el grafo offline completo.");

  const backendRequests: string[] = [];
  const runtimeErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(`${error.message}\n${error.stack ?? ""}`));
  page.on("console", (message) => { if (message.type() === "error") runtimeErrors.push(message.text()); });
  page.on("requestfailed", (request) => failedRequests.push(`${request.method()} ${request.url()} · ${request.failure()?.errorText ?? "failed"}`));
  await page.route("**/__deep-opm/**", async (route) => {
    backendRequests.push(route.request().url());
    await route.abort("blockedbyclient");
  });
  await page.route("https://api.typesafe.ai/**", async (route) => {
    backendRequests.push(route.request().url());
    await route.abort("blockedbyclient");
  });

  let model = crearModelo("Lectura sin conexión");
  const created = crearObjeto(model, model.opdRaizId, { x: 80, y: 100 }, "Hecho disponible");
  if (!created.ok) throw new Error(created.error);
  model = created.value;
  const bytes = await createPortablePackage({
    profile: PORTABLE_READER_PROFILE,
    revisions: [{ id: "current", modelJson: exportarModelo(model), label: model.nombre, selectedOpdId: model.opdRaizId }],
    includedSources: [{
      id: "source-1",
      title: "Criterio autorizado",
      locator: "opforja://test/source-1",
      content: "La lectura se conserva en el equipo.",
      mediaType: "text/plain",
      authorizedByUser: true,
    }],
    omittedSources: [{
      id: "external-1",
      title: "Pieza externa no incluida",
      locator: "opforja://external/piece-1",
      reason: "La pieza sigue en su sistema de origen.",
    }],
    createdAt: "2026-09-23T11:00:00.000Z",
  });

  await page.goto("/portable-reader/");
  const fileInput = page.getByLabel("Elegir paquete portable");
  if (await fileInput.count() === 0) {
    const body = await page.locator("body").innerText().catch(() => "<body unavailable>");
    throw new Error(`El lector no montó la interfaz. Body: ${body}\nErrores: ${runtimeErrors.join(" | ")}\nRequests fallidas: ${failedRequests.join(" | ")}`);
  }
  await fileInput.setInputFiles({
    name: "lectura.opforja.json",
    mimeType: "application/json",
    buffer: Buffer.from(bytes),
  });
  await expect(page.getByRole("heading", { name: model.nombre })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Diagramas y enunciados" })).toBeVisible();
  await expect(page.getByRole("img", { name: /Diagrama OPM/ })).toBeVisible({ timeout: 15_000 });
  await page.getByText("Criterio autorizado", { exact: true }).click();
  await expect(page.getByText("La lectura se conserva en el equipo.")).toBeVisible();
  await expect(page.getByText("La pieza sigue en su sistema de origen.")).toHaveCount(1);

  await page.getByRole("button", { name: "Guardar copia en este dispositivo" }).click();
  await expect(page).toHaveURL(/\/portable-reader\/\?package=[0-9a-f-]+/i);
  await expect(page.getByRole("heading", { name: model.nombre })).toBeVisible();
  await page.getByRole("button", { name: "Preparar para uso sin conexión" }).click();
  await expect(page.getByRole("status")).toContainText("Lector guardado para uso sin conexión");
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  expect(backendRequests).toEqual([]);

  const packageLocation = new URL(page.url());
  await page.context().setOffline(true);
  await page.close();
  const coldPage = await page.context().newPage();
  await coldPage.goto(new URL(`/portable-reader/${packageLocation.search}`, packageLocation.origin).href);
  await expect(coldPage.getByRole("heading", { name: model.nombre })).toBeVisible({ timeout: 15_000 });
  await expect(coldPage.getByRole("img", { name: /Diagrama OPM/ })).toBeVisible({ timeout: 15_000 });
  await coldPage.getByText("Criterio autorizado", { exact: true }).click();
  await expect(coldPage.getByText("La lectura se conserva en el equipo.")).toBeVisible();
  expect(backendRequests).toEqual([]);
});
