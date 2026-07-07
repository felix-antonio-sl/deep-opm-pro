import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial } from "./_smoke-helpers";

// A′-vitrina: chip ramificado de revisión del agente + colapso de hitos.
// Se simula el escenario de producción inyectando en el store la base y la
// revisión remota (el repo de memoria de dev no incrementa `revision`, así que
// el poll no pisa la inyección). Técnica de inyección: import('/src/store.ts').

/** Crea+guarda un modelo, detiene el poll y fija base=5 + revisión remota del agente=6. */
async function prepararEscenario(page: import("@playwright/test").Page): Promise<string> {
  return page.evaluate(async () => {
    const { store } = await import("/src/store.ts");
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Vitrina e2e" });
    for (let i = 0; i < 60; i++) {
      if (store.getState().mensaje === "Modelo guardado exitosamente") break;
      await new Promise((r) => setTimeout(r, 25));
    }
    const id = store.getState().modeloPersistidoId as string;
    store.getState().detenerPollRevision();
    store.setState({
      revisionBasePorModelo: { ...store.getState().revisionBasePorModelo, [id]: 5 },
      revisionRemota: { modeloId: id, revision: 6 },
    });
    return id;
  });
}

test("chip: rama sin cambios locales muestra sólo Recargar", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await prepararEscenario(page);

  const chip = page.getByTestId("chip-revision-nueva");
  await expect(chip).toBeVisible();
  await expect(chip).toHaveAttribute("data-cambios-locales", "false");
  await expect(page.getByTestId("revision-recargar")).toBeVisible();
  await expect(page.getByTestId("revision-ver")).toHaveCount(0);
  await expect(page.getByTestId("revision-descartar")).toHaveCount(0);
});

test("chip: rama con cambios locales muestra Ver + Descartar (no Recargar)", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await prepararEscenario(page);
  // Editar → dirty; re-fijar la revisión remota por si el poll la tocó.
  await page.evaluate(async () => {
    const { store } = await import("/src/store.ts");
    const id = store.getState().modeloPersistidoId as string;
    store.getState().crearProcesoDemo();
    store.setState({ revisionRemota: { modeloId: id, revision: 6 } });
  });

  const chip = page.getByTestId("chip-revision-nueva");
  await expect(chip).toHaveAttribute("data-cambios-locales", "true");
  await expect(page.getByTestId("revision-ver")).toBeVisible();
  await expect(page.getByTestId("revision-descartar")).toBeVisible();
  await expect(page.getByTestId("revision-recargar")).toHaveCount(0);
});

test("historial: una sesión de agente colapsa en un hito expandible", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  const id = await prepararEscenario(page);

  // Inyectar historial: humana + corrida de 3 versiones de agente + humana.
  await page.evaluate((modeloId) => {
    return import("/src/store.ts").then(({ store }) => {
      const V = (vid: string, nombre: string, min: number) => ({ id: vid, nombre, creadoEn: `2026-07-07T12:0${min}:00.000Z`, modeloPayloadKey: vid, bytes: 100 });
      const versiones = [
        V("h2", "Guardado manual", 5),
        V("a3", "agente·paso 3", 4),
        V("a2", "agente·paso 2", 3),
        V("a1", "agente·paso 1", 2),
        V("h1", "Guardado manual inicial", 1),
      ];
      store.setState({
        modelosGuardados: store.getState().modelosGuardados.map((m) => (m.id === modeloId ? { ...m, versiones } : m)),
        mostrarVersiones: true,
      });
      store.getState().abrirDialogoVersiones(modeloId);
    });
  }, id);

  const hito = page.getByTestId("hito-sesion-agente");
  await expect(hito).toBeVisible();
  await expect(hito).toContainText("Sesión de agente · 3 revisiones");
  // Colapsado por defecto: las versiones internas del agente no están visibles.
  await expect(page.getByText("agente·paso 2", { exact: true })).toHaveCount(0);
  // Expandir → aparecen las 3 versiones internas.
  await hito.getByRole("button").click();
  await expect(page.getByText("agente·paso 2", { exact: true })).toBeVisible();
  await expect(page.getByText("agente·paso 1", { exact: true })).toBeVisible();
});
