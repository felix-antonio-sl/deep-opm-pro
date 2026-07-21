/**
 * Smoke E2E ronda 17 L2 — Modo simulacion conceptual (Beta2).
 *
 * Cubre el slice minimo del brief r17-L2 S6:
 *   - Accion "Simulacion" desde ... Mas entra al modo.
 *   - BarraSimulacion reemplaza la Toolbar de edicion (sin boton "Objeto").
 *   - Paso avanza una microfase conceptual del proceso actual.
 *   - Auto reproduce con velocidad seleccionable y pausa implicita al completar.
 *   - Correr ejecuta todos los pasos restantes; queda Completada.
 *   - Reiniciar vuelve al paso inicial.
 *   - Salir vuelve a la Toolbar de edicion.
 *
 * Actualizado S1 Codex: avance por microfases OPM runtime.
 */
import { expect, test, type Page } from "@playwright/test";
import { esperarWorkbenchInicial, clickToolbarMasItem, jsonEditor, modeloAbanicoRutasEstados, modeloTransicionEstados } from "./_smoke-helpers";

test("modo simulacion: entrar, paso, correr, reiniciar, salir", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Recibir");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Atender");
  await page.keyboard.press("Enter");

  await expect(page.getByTestId("toolbar-root")).toBeVisible();
  await expect(page.getByTestId("barra-simulacion")).toHaveCount(0);

  await entrarSimulacionDesdeMas(page);
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();
  await expect(page.getByTestId("toolbar-root")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Objeto", exact: true })).toHaveCount(0);

  // Un proceso desnudo no tiene preparación (nada que verificar): el primer
  // beat semántico es "Proceso activo".
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/paso\s+1\s+de\s+2/);
  await expect(page.getByTestId("barra-simulacion-narrativa")).toContainText(/Proceso activo: (Recibir|Atender)/);
  await expect(page.getByTestId("barra-simulacion-narrativa")).toContainText("paso 1 de 2");
  const primeraVez = page.getByTestId("barra-simulacion-proceso-activo");
  await expect(primeraVez).toContainText(/Recibir|Atender/);

  // Marco inicial: al entrar todavía no hay proceso activo en canvas.
  const haloProcesoInicial = await page.evaluate(() => {
    return document.querySelectorAll('[model-id^="sim-proceso-"]').length;
  });
  expect(haloProcesoInicial).toBe(0);

  // Avanzar fases de un proceso sin enlaces: activar proceso -> completado ->
  // siguiente proceso (la preparación vacía ya no detiene el avance; el primer
  // click activa la fase inicial del frame quieto).
  await avanzarFases(page, 3);
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/paso\s+2\s+de\s+2/);
  await expect(page.getByTestId("barra-simulacion-narrativa")).toContainText(/Proceso activo: (Recibir|Atender)/);
  await expect(page.getByTestId("barra-simulacion-narrativa")).toContainText("paso 2 de 2");
  await expect(page.getByTestId("barra-simulacion-trace")).toBeVisible();
  // Sin beat de preparación vacía, el paso 2 entra directo con su proceso activo.
  const haloProcesoPasoDos = await page.evaluate(() => {
    return document.querySelectorAll('[model-id^="sim-proceso-"]').length;
  });
  expect(haloProcesoPasoDos).toBe(1);

  // Correr -> completa los pasos restantes.
  await page.getByTestId("barra-simulacion-correr").click();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/Completada\s+·\s+2\s+pasos/);
  await expect(page.getByTestId("barra-simulacion-narrativa")).toContainText("Simulación completada");
  await expect(page.getByTestId("barra-simulacion-narrativa")).toContainText("se ejecutó sin cambios de estado");
  await expect(page.getByTestId("barra-simulacion-paso")).toBeDisabled();

  // Reiniciar -> vuelve a paso 1 de 2.
  await page.getByTestId("barra-simulacion-reiniciar").click();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/paso\s+1\s+de\s+2/);
  await expect(page.getByTestId("barra-simulacion-paso")).toBeEnabled();

  // Salir -> vuelve a Toolbar de edicion.
  await page.getByTestId("barra-simulacion-salir").click();
  await expect(page.getByTestId("barra-simulacion")).toHaveCount(0);
  await expect(page.getByTestId("toolbar-root")).toBeVisible();
  await expect(page.getByRole("button", { name: "Objeto", exact: true })).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("modo simulacion: OPD sin procesos muestra mensaje y controles deshabilitados", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await entrarSimulacionDesdeMas(page);
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText("No hay procesos para simular");
  await expect(page.getByTestId("barra-simulacion-paso")).toBeDisabled();
  await expect(page.getByTestId("barra-simulacion-correr")).toBeDisabled();

  await page.getByTestId("barra-simulacion-salir").click();
  await expect(page.getByTestId("toolbar-root")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("modo simulacion: play avanza automaticamente hasta completar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Preparar");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Resolver");
  await page.keyboard.press("Enter");

  await entrarSimulacionDesdeMas(page);
  // Clic en segmento "2x" de velocidad.
  await page.getByTestId("barra-simulacion-velocidad").getByRole("button", { name: "Velocidad 2x" }).click();
  await page.getByTestId("barra-simulacion-auto").click();

  await expect(page.getByTestId("barra-simulacion-auto")).toContainText("pausa");
  await expect(page.getByTestId("barra-simulacion-paso")).toBeDisabled();
  await expect(page.getByTestId("barra-simulacion-correr")).toBeDisabled();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/Completada\s+·\s+2\s+pasos/, { timeout: 7000 });
  await expect(page.getByTestId("barra-simulacion-auto")).toBeDisabled();

  expect(pageErrors).toEqual([]);
});

// B0.011/B0.015: velocidad segmented + atajo Espacio play/pausa.
test("simulacion: velocidad segmented ajusta y Espacio togglea play", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await crearDosProcesos(page, "Recibir", "Atender");
  await entrarSimulacionDesdeMas(page);
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();

  // Segmented: clic en 2x.
  await page.getByTestId("barra-simulacion-velocidad").getByRole("button", { name: "Velocidad 2x" }).click();

  await quitarFoco(page);
  await expect(page.getByTestId("barra-simulacion-auto")).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Space");
  await expect(page.getByTestId("barra-simulacion-auto")).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Space");
  await expect(page.getByTestId("barra-simulacion-auto")).toHaveAttribute("aria-pressed", "false");

  expect(pageErrors).toEqual([]);
});

// B0.017/B0.019: headless sin animacion hasta completar.
test("simulacion: headless corre sin animacion hasta completar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await crearDosProcesos(page, "Preparar", "Resolver");
  await entrarSimulacionDesdeMas(page);

  await page.getByTestId("barra-simulacion-headless").click();
  await expect(page.getByTestId("barra-simulacion-headless")).toHaveAttribute("aria-pressed", "true");

  await page.getByTestId("barra-simulacion-correr").click();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText("Completada");

  expect(pageErrors).toEqual([]);
});

// B0.025: el marco inicial no marca OPL como proceso activo.
test("simulacion: marco inicial no resalta frase OPL como proceso activo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Recibir");
  await page.keyboard.press("Enter");

  await entrarSimulacionDesdeMas(page);
  await expect(page.locator('[data-testid="opl-line"][data-sim-activa="true"]')).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

// B0.026: navegar a otro OPD no aborta la corrida.
test("simulacion: navegar a otro OPD no aborta la corrida (B0.026)", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await jsonEditor(page).fill(JSON.stringify(modeloSimulacionDosOpds(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  // El fixture nombra al OPD raiz "SD" (render: "sd"); "system diagram" era el
  // default historico ya retirado del codigo. El OPD hijo "SD1" se valida abajo.
  await expect(page.getByTestId("breadcrumb-opd")).toContainText("sd");

  await entrarSimulacionDesdeMas(page);
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();
  await expect(page.getByTestId("barra-simulacion-proceso-activo")).toContainText("Procesar");

  await page.locator('[role="treeitem"][data-opd-id="opd-2"]').click();
  await expect(page.getByTestId("breadcrumb-opd")).toContainText("sd1");
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();

  await page.locator('[role="treeitem"][data-opd-id="opd-1"]').click();
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/paso\s+1\s+de\s+1/);

  expect(pageErrors).toEqual([]);
});

test("simulacion: la edicion queda sellada — R no enciende modo enlace y el bloqueo habla (C-1)", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await jsonEditor(page).fill(JSON.stringify(modeloTransicionEstados(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();

  await entrarSimulacionDesdeMas(page);
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();

  // Seleccionar una cosa y presionar R: ANTES encendia el modo enlace con
  // targets verdes "conectables" que morian en silencio al clickear (C-1).
  await page.getByRole("button", { name: /Objeto Pedido/ }).click();
  await page.keyboard.press("r");

  // El bloqueo HABLA: el flash nombra el modo y la salida.
  await expect(page.getByTestId("flash-toast").filter({ hasText: "Modo simulación" })).toBeVisible();

  // Y la barra contextual no ofrece acciones de edicion en simulacion.
  await expect(page.getByRole("button", { name: "Descomponer" })).toHaveCount(0);

  // La promesa «⎋ salir» del copy ahora es verdadera: Escape sale del modo.
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("barra-simulacion")).toHaveCount(0);
  await expect(page.getByTestId("toolbar-root")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("simulacion: decision XOR inline — elegir una rama aplica su transicion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await jsonEditor(page).fill(JSON.stringify(modeloAbanicoRutasEstados(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();

  await entrarSimulacionDesdeMas(page);
  await expect(page.getByTestId("barra-simulacion-proceso-activo")).toContainText("Aprobar");

  // El paso actual tiene un abanico XOR de salida: la barra ofrece la
  // decision inline (una opcion por rama, rotulada por estado destino al
  // no haber etiqueta de enlace).
  const grupo = page.getByTestId("barra-simulacion-xor");
  await expect(grupo).toBeVisible();
  const ramas = page.getByTestId("barra-simulacion-xor-rama");
  await expect(ramas).toHaveCount(2);

  await ramas.filter({ hasText: "Pedido: rechazado" }).click();

  // El paso quedo resuelto por la rama elegida (no por la politica del
  // modo): corrida completada y la decision desaparece de la barra.
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText("Completada");
  await expect(grupo).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("simulacion: estados, enlaces y tokens se activan visualmente en el canvas", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await jsonEditor(page).fill(JSON.stringify(modeloTransicionEstadosDosPasosVisual(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();

  await entrarSimulacionDesdeMas(page);
  await expect(page.getByTestId("barra-simulacion-proceso-activo")).toContainText("Aprobar");
  await expect.poll(async () => page.evaluate(
    () => document.querySelectorAll('[data-opm-sim-token="viaje"]').length,
  ), { timeout: 500 }).toBe(0);
  await page.getByTestId("barra-simulacion-paso").click();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText("consumo");
  await expect.poll(async () => page.evaluate(
    () => document.querySelectorAll('[data-opm-sim-token="viaje"]').length,
  ), { timeout: 1500 }).toBeGreaterThan(0);

  const visualConsumo = await page.evaluate(() => ({
    procesoActivo: document.querySelectorAll('[data-opm-sim="process-active"]').length,
    estadoCurrent: document.querySelectorAll('[data-opm-sim="state-current"]').length,
    estadoResultado: document.querySelectorAll('[data-opm-sim="state-result"]').length,
    enlaceRuntime: document.querySelectorAll('[data-opm-sim="runtime-link"]').length,
    tokenCore: document.querySelectorAll('[data-opm-sim-token="core"]').length,
    tokenAura: document.querySelectorAll('[data-opm-sim-token="aura"]').length,
    tokenTrail: document.querySelectorAll('[data-opm-sim-token="trail"]').length,
  }));

  expect(visualConsumo).toEqual({
    procesoActivo: 1,
    estadoCurrent: 1,
    estadoResultado: 0,
    enlaceRuntime: 1,
    tokenCore: 1,
    tokenAura: 1,
    tokenTrail: 1,
  });

  await avanzarFases(page, 2);
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText("resultado");
  const visualResultado = await page.evaluate(() => ({
    procesoActivo: document.querySelectorAll('[data-opm-sim="process-active"]').length,
    estadoCurrent: document.querySelectorAll('[data-opm-sim="state-current"]').length,
    estadoResultado: document.querySelectorAll('[data-opm-sim="state-result"]').length,
    enlaceRuntime: document.querySelectorAll('[data-opm-sim="runtime-link"]').length,
    tokenCore: document.querySelectorAll('[data-opm-sim-token="core"]').length,
    tokenAura: document.querySelectorAll('[data-opm-sim-token="aura"]').length,
    tokenTrail: document.querySelectorAll('[data-opm-sim-token="trail"]').length,
  }));

  expect(visualResultado).toEqual({
    procesoActivo: 1,
    estadoCurrent: 0,
    estadoResultado: 1,
    enlaceRuntime: 1,
    tokenCore: 1,
    tokenAura: 1,
    tokenTrail: 1,
  });

  expect(pageErrors).toEqual([]);
});

async function entrarSimulacionDesdeMas(page: Page): Promise<void> {
  await clickToolbarMasItem(page, "toolbar-mas-simulacion");
}

async function avanzarFases(page: Page, total: number): Promise<void> {
  for (let i = 0; i < total; i += 1) {
    await page.getByTestId("barra-simulacion-paso").click();
  }
}

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

function modeloTransicionEstadosVisual() {
  const payload = modeloTransicionEstados();
  payload.modelo.estados["s-pendiente"] = {
    ...payload.modelo.estados["s-pendiente"],
    esInicial: true,
    designaciones: ["inicial"],
  };
  return payload;
}

function modeloTransicionEstadosDosPasosVisual() {
  const payload = modeloTransicionEstadosVisual();
  payload.modelo.entidades["p-archivar"] = {
    id: "p-archivar",
    tipo: "proceso",
    nombre: "Archivar",
    esencia: "informacional",
    afiliacion: "sistemica",
  };
  payload.modelo.estados["s-archivado"] = {
    id: "s-archivado",
    entidadId: "o-pedido",
    nombre: "archivado",
  };
  payload.modelo.enlaces["e-consumo-archivar"] = {
    id: "e-consumo-archivar",
    tipo: "consumo",
    origenId: { kind: "estado", id: "s-aprobado" },
    destinoId: { kind: "entidad", id: "p-archivar" },
    etiqueta: "",
  };
  payload.modelo.enlaces["e-resultado-archivar"] = {
    id: "e-resultado-archivar",
    tipo: "resultado",
    origenId: { kind: "entidad", id: "p-archivar" },
    destinoId: { kind: "estado", id: "s-archivado" },
    etiqueta: "",
  };
  payload.modelo.opds["opd-1"].apariencias["a-archivar"] = {
    id: "a-archivar",
    entidadId: "p-archivar",
    opdId: "opd-1",
    x: 500,
    y: 220,
    width: 135,
    height: 60,
  };
  payload.modelo.opds["opd-1"].enlaces["ae-consumo-archivar"] = {
    id: "ae-consumo-archivar",
    enlaceId: "e-consumo-archivar",
    opdId: "opd-1",
    vertices: [],
  };
  payload.modelo.opds["opd-1"].enlaces["ae-resultado-archivar"] = {
    id: "ae-resultado-archivar",
    enlaceId: "e-resultado-archivar",
    opdId: "opd-1",
    vertices: [],
  };
  return payload;
}
