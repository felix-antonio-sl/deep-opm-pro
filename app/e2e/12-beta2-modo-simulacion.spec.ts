/**
 * Smoke E2E ronda 17 L2 — Modo simulación conceptual (Beta2).
 *
 * Cubre el slice mínimo del brief r17-L2 §6:
 *   - Acción "Simulación" desde ⋯ Más entra al modo.
 *   - BarraSimulacion reemplaza la Toolbar de edición (sin botón "Objeto").
 *   - Paso ejecuta el siguiente proceso del plan y avanza el contador.
 *   - Play ejecuta avance automático con velocidad seleccionable y pausa implícita al completar.
 *   - Correr ejecuta todos los pasos restantes; queda Completado.
 *   - Reiniciar vuelve al paso 1/N.
 *   - Salir vuelve a la Toolbar de edición.
 */
import { expect, test, type Page } from "@playwright/test";
import { cerrarPantallaInicioSiVisible, clickToolbarMasItem, jsonEditor } from "./_smoke-helpers";

test("modo simulación: entrar, paso, correr, reiniciar, salir", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // Construir un modelo con 2 procesos para tener plan no vacío.
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Recibir");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Atender");
  await page.keyboard.press("Enter");

  // Toolbar de edición presente, BarraSimulacion no.
  await expect(page.getByTestId("toolbar-root")).toBeVisible();
  await expect(page.getByTestId("barra-simulacion")).toHaveCount(0);

  // Entrar al modo simulación.
  await entrarSimulacionDesdeMas(page);
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();
  // Toolbar de edición desaparece (BarraSimulacion la reemplaza).
  await expect(page.getByTestId("toolbar-root")).toHaveCount(0);
  // No hay botón "Objeto" disponible en modo simulación (canvas read-only).
  await expect(page.getByRole("button", { name: "Objeto", exact: true })).toHaveCount(0);

  // Progreso inicial: Paso 1/2 con un proceso activo (orden depende de Y).
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/Paso\s+1\/2/);
  const primeraVez = page.getByTestId("barra-simulacion-proceso-activo");
  await expect(primeraVez).toContainText(/Recibir|Atender/);
  const primerProceso = (await primeraVez.textContent())?.replace(/^▶\s*/, "").trim() ?? "";

  // Halo verde dasheado sobre el proceso activo en el canvas (overlay visual).
  // El cell tiene id `sim-proceso-<aparienciaId>` y stroke #16a34a en JointJS.
  const haloProceso = await page.evaluate(() => {
    return document.querySelectorAll('[model-id^="sim-proceso-"]').length;
  });
  expect(haloProceso).toBe(1);

  // Ejecutar Paso → avanza a Paso 2/2 con el OTRO proceso activo.
  await page.getByTestId("barra-simulacion-paso").click();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/Paso\s+2\/2/);
  const segundo = primerProceso === "Recibir" ? "Atender" : "Recibir";
  await expect(page.getByTestId("barra-simulacion-proceso-activo")).toContainText(segundo);
  await expect(page.getByTestId("barra-simulacion-trace")).toBeVisible();
  // El halo sigue apareciendo (sobre el nuevo proceso activo).
  const haloPasoDos = await page.evaluate(() => {
    return document.querySelectorAll('[model-id^="sim-proceso-"]').length;
  });
  expect(haloPasoDos).toBe(1);

  // Correr → completa los pasos restantes.
  await page.getByTestId("barra-simulacion-correr").click();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/Completado\s+·\s+2\/2/);
  // Paso queda deshabilitado en completado.
  await expect(page.getByTestId("barra-simulacion-paso")).toBeDisabled();

  // Reiniciar → vuelve a Paso 1/2.
  await page.getByTestId("barra-simulacion-reiniciar").click();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/Paso\s+1\/2/);
  await expect(page.getByTestId("barra-simulacion-paso")).toBeEnabled();

  // Salir → vuelve a Toolbar de edición.
  await page.getByTestId("barra-simulacion-salir").click();
  await expect(page.getByTestId("barra-simulacion")).toHaveCount(0);
  await expect(page.getByTestId("toolbar-root")).toBeVisible();
  await expect(page.getByRole("button", { name: "Objeto", exact: true })).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("modo simulación: OPD sin procesos muestra mensaje y controles deshabilitados", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await entrarSimulacionDesdeMas(page);
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText("Sin procesos en este OPD");
  await expect(page.getByTestId("barra-simulacion-paso")).toBeDisabled();
  await expect(page.getByTestId("barra-simulacion-correr")).toBeDisabled();

  await page.getByTestId("barra-simulacion-salir").click();
  await expect(page.getByTestId("toolbar-root")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("modo simulación: play avanza automaticamente hasta completar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Preparar");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Resolver");
  await page.keyboard.press("Enter");

  await entrarSimulacionDesdeMas(page);
  await page.getByTestId("barra-simulacion-velocidad").fill("2");
  await page.getByTestId("barra-simulacion-auto").click();

  await expect(page.getByTestId("barra-simulacion-auto")).toContainText("Pausa");
  await expect(page.getByTestId("barra-simulacion-paso")).toBeDisabled();
  await expect(page.getByTestId("barra-simulacion-correr")).toBeDisabled();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/Completado\s+·\s+2\/2/, { timeout: 3000 });
  await expect(page.getByTestId("barra-simulacion-auto")).toBeDisabled();

  expect(pageErrors).toEqual([]);
});

// ─────────────────────────────────────────────────────────────────────────
// Cierre Simulación B0 conceptual (Tarea 9 / 2026-05-24). Cobertura smoke de
// las HU autocontenidas construidas sobre el kernel B0:
//   - B0.011/B0.015: slider de velocidad (range) + atajo Espacio play/pausa.
//   - B0.017/B0.019: corrida headless sin animación hasta completar.
//   - B0.025: resaltado OPL del proceso activo (data-sim-activa).
//   - B0.010: ocultar Paso/Correr/Reiniciar durante el auto-avance.
//   - B0.026: navegar a otro OPD no aborta la corrida (contexto vivo).
// Robustas: assertions web-first, sin sleeps arbitrarios. El slider es
// <input type="range"> → usar .fill(), nunca selectOption.
// ─────────────────────────────────────────────────────────────────────────

test("simulación: slider ajusta velocidad y Espacio togglea play", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await crearDosProcesos(page, "Recibir", "Atender");
  await entrarSimulacionDesdeMas(page);
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();

  // El slider de velocidad es un range: fill ajusta su valor y el contador lo refleja.
  await page.getByTestId("barra-simulacion-velocidad").fill("2");
  await expect(page.getByTestId("barra-simulacion-velocidad")).toHaveValue("2");

  // Foco fuera de cualquier input: el atajo global Espacio se ignora si el foco
  // está en un <input>/<textarea>/<select> (range incluido). Blur explícito.
  await quitarFoco(page);

  await expect(page.getByTestId("barra-simulacion-auto")).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Space");
  await expect(page.getByTestId("barra-simulacion-auto")).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Space");
  await expect(page.getByTestId("barra-simulacion-auto")).toHaveAttribute("aria-pressed", "false");

  expect(pageErrors).toEqual([]);
});

test("simulación: headless corre sin animación hasta completar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await crearDosProcesos(page, "Preparar", "Resolver");
  await entrarSimulacionDesdeMas(page);

  await page.getByTestId("barra-simulacion-headless").click();
  await expect(page.getByTestId("barra-simulacion-headless")).toHaveAttribute("aria-pressed", "true");

  await page.getByTestId("barra-simulacion-correr").click();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText("Completado");

  expect(pageErrors).toEqual([]);
});

test("simulación: OPL resalta la frase del proceso activo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // Un único proceso ⇒ el plan tiene 1 paso y arranca activo. Canon L1 escinde
  // la clasificación del proceso en dos oraciones ("Recibir es informacional."
  // + "...es sistémico."), ambas tocan al proceso activo.
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Recibir");
  await page.keyboard.press("Enter");

  await entrarSimulacionDesdeMas(page);
  await expect(page.getByTestId("barra-simulacion-proceso-activo")).toContainText("Recibir");

  // Las líneas OPL del proceso activo ganan data-sim-activa="true".
  await expect(page.locator('[data-testid="opl-line"][data-sim-activa="true"]')).toHaveCount(2);

  expect(pageErrors).toEqual([]);
});

test("simulación: oculta Paso/Correr/Reiniciar durante auto-avance (B0.010)", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // 3 procesos + velocidad mínima (0.25×) ⇒ el auto-avance dura lo suficiente
  // para observar los controles ocultos a mitad de corrida sin sleeps.
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Uno");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Dos");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Tres");
  await page.keyboard.press("Enter");

  await entrarSimulacionDesdeMas(page);
  await page.getByTestId("barra-simulacion-velocidad").fill("0.25");

  // En reposo los tres controles de avance manual están presentes.
  await expect(page.getByTestId("barra-simulacion-paso")).toBeVisible();
  await expect(page.getByTestId("barra-simulacion-correr")).toBeVisible();
  await expect(page.getByTestId("barra-simulacion-reiniciar")).toBeVisible();

  await quitarFoco(page);
  await page.keyboard.press("Space"); // arranca auto-avance
  await expect(page.getByTestId("barra-simulacion-auto")).toHaveAttribute("aria-pressed", "true");

  // Durante el auto-avance los controles manuales NO se renderizan.
  await expect(page.getByTestId("barra-simulacion-paso")).toHaveCount(0);
  await expect(page.getByTestId("barra-simulacion-correr")).toHaveCount(0);
  await expect(page.getByTestId("barra-simulacion-reiniciar")).toHaveCount(0);

  // Pausar los vuelve a mostrar (cierra el ciclo sin esperar a completar).
  await page.keyboard.press("Space");
  await expect(page.getByTestId("barra-simulacion-auto")).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByTestId("barra-simulacion-paso")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("simulación: navegar a otro OPD no aborta la corrida (B0.026)", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // Modelo con dos OPDs: el raíz tiene un proceso (plan no vacío) y un OPD hijo.
  await jsonEditor(page).fill(JSON.stringify(modeloSimulacionDosOpds(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();
  await expect(page.getByTestId("breadcrumb-opd")).toContainText("SD");

  await entrarSimulacionDesdeMas(page);
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();
  await expect(page.getByTestId("barra-simulacion-proceso-activo")).toContainText("Procesar");

  // Navegar al OPD hijo vía el árbol lateral (patrón spec 04) NO debe abortar.
  await page.locator('[role="treeitem"][data-opd-id="opd-2"]').click();
  await expect(page.getByTestId("breadcrumb-opd")).toContainText("SD1");
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();

  // Volver al raíz: la corrida sigue viva en su paso original.
  await page.locator('[role="treeitem"][data-opd-id="opd-1"]').click();
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/Paso\s+1\/1/);

  expect(pageErrors).toEqual([]);
});

// Ronda 27 III.A cierre: la acción "Simulación conceptual" vive ahora en
// `☰ → Herramientas`. El helper unificado abre el menú principal y
// clickea el item por testId preservado.
async function entrarSimulacionDesdeMas(page: Page): Promise<void> {
  await clickToolbarMasItem(page, "toolbar-mas-simulacion");
}

// Quita el foco de cualquier control editable para que el atajo global
// Espacio (play/pausa) no sea ignorado por el guard de inputs en atajosTeclado.
async function quitarFoco(page: Page): Promise<void> {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
}

async function crearDosProcesos(page: Page, primero: string, segundo: string): Promise<void> {
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill(primero);
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill(segundo);
  await page.keyboard.press("Enter");
}

// Modelo mínimo con dos OPDs: el raíz contiene un proceso (plan de 1 paso) y
// existe un OPD hijo navegable. Sirve para B0.026 (navegar no aborta la sim).
function modeloSimulacionDosOpds() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-sim-dos-opds",
      nombre: "Sim multi OPD",
      opdRaizId: "opd-1",
      nextSeq: 10,
      entidades: {
        "p-procesar": { id: "p-procesar", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
        "p-hijo": { id: "p-hijo", tipo: "proceso", nombre: "Detalle", esencia: "informacional", afiliacion: "sistemica" },
      },
      estados: {},
      enlaces: {},
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-procesar": { id: "a-procesar", entidadId: "p-procesar", opdId: "opd-1", x: 200, y: 120, width: 135, height: 60 },
          },
          enlaces: {},
        },
        "opd-2": {
          id: "opd-2",
          nombre: "SD1",
          padreId: "opd-1",
          apariencias: {
            "a-hijo": { id: "a-hijo", entidadId: "p-hijo", opdId: "opd-2", x: 220, y: 130, width: 135, height: 60 },
          },
          enlaces: {},
        },
      },
    },
  };
}
