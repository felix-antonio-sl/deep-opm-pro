import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible, exportadoActual } from "./_smoke-helpers";

/**
 * B-mount — Resolución de colisión de nombre (DialogoColisionNombre).
 *
 * La colisión aparece en dos caminos:
 *
 *  B3 – "creacion": crearEntidadEnCanvas → confirmarNombreNuevaCosa detecta
 *       colisión → `colisionPendiente.contexto === "creacion"` → muestra
 *       "Reutilizar" (solo mismo tipo) + "Usar otro nombre" + "Cancelar".
 *
 *  B4 – "rename": renombrarSeleccionada detecta colisión → `contexto === "rename"`
 *       → muestra SOLO "Usar otro nombre" + "Cancelar" (sin Reutilizar).
 *
 * El diálogo tiene testId `dialogo-colision-nombre` y está montado via portal
 * en body desde App.tsx (siempre montado, visible cuando `colisionPendiente` ≠ null).
 *
 * Flujo B3 (creacion):
 *   Shift+clic botón "Objeto" (testId toolbar-drag-objeto) → entra modo sticky →
 *   clic en canvas → `nuevaCosaPendiente` se activa → `modal-nombre-cosa` aparece →
 *   fill + OK → `confirmarNombreNuevaCosa` → si hay colisión → diálogo abre.
 *
 *   Nota: el modo sticky permanece activo entre creaciones consecutivas. NO se
 *   llama a Shift+clic de nuevo para la segunda entidad — se hace clic directo
 *   en el canvas (el modo ya está activo). Shift+clic cuando modoCreacion está
 *   activo lo DESACTIVA (toggle).
 *
 * Flujo B4 (rename):
 *   Clic "Objeto" sin Shift → `crearObjetoDemo` → inspector enfocado →
 *   `getByTestId("inspector-entidad-nombre").fill(nombreColision)` →
 *   `renombrarSeleccionada` → si hay colisión → diálogo abre.
 */

/**
 * Entra en modo sticky de creación de objetos y crea una entidad en el canvas.
 * Confirma el nombre pedido en el modal inline.
 *
 * Si ya estamos en modo sticky (modoCreacion === "objeto"), NO hace Shift+clic
 * para no desactivarlo; directamente hace clic en el canvas.
 *
 * Tras retornar, el modo sticky sigue activo para permitir creaciones sucesivas.
 */
async function crearObjetoViaCanvasStickyActivo(
  page: import("@playwright/test").Page,
  nombre: string,
  yaEnSticky: boolean,
): Promise<void> {
  if (!yaEnSticky) {
    // Activar modo sticky: Shift+clic sobre el botón "Objeto".
    await page.getByTestId("toolbar-drag-objeto").click({ modifiers: ["Shift"] });
    await expect(page.getByTestId("indicador-modo-canonico")).toContainText("Insertando objetos");
  }

  // Clic en el canvas para crear la entidad provisional.
  // Posicionamos lejos del borde para evitar hacer clic sobre un elemento existente.
  const canvas = page.getByRole("img", { name: "OPD activo" });
  const rect = await canvas.boundingBox();
  const x = rect ? rect.width * 0.4 : 300;
  const y = rect ? rect.height * 0.5 : 200;
  await canvas.click({ position: { x, y } });

  // El modal de nombre debe aparecer.
  const modal = page.getByTestId("modal-nombre-cosa");
  await expect(modal).toBeVisible();
  await modal.getByLabel("Nombre").fill(nombre);
  await modal.getByRole("button", { name: "OK" }).click();

  // El modal cierra (el diálogo de colisión puede reemplazarlo si hay choque).
  await expect(modal).toHaveCount(0);
}

test.describe("B-mount: colisión de nombre", () => {
  test("Reutilizar (B3 creacion): misma entidad obtiene aparición adicional sin crear entidad nueva", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);

    // Paso 1: crear el primer objeto "Sensor" vía canvas en modo sticky.
    await crearObjetoViaCanvasStickyActivo(page, "Sensor", false);
    await expect(page.getByTestId("dialogo-colision-nombre")).toHaveCount(0);

    // Estado base: ≥ 1 entidad, entre ellas "Sensor".
    const estadoBase = await exportadoActual(page);
    const entidadesBase = Object.values(estadoBase.modelo.entidades);
    const sensorBase = entidadesBase.find((e) => e.nombre === "Sensor");
    expect(sensorBase).toBeDefined();
    const totalEntidadesBase = entidadesBase.length;

    // Paso 2: crear OTRO objeto con el mismo nombre "Sensor" (sticky ya activo).
    await crearObjetoViaCanvasStickyActivo(page, "Sensor", true);

    // El diálogo de colisión debe aparecer.
    const dialogo = page.getByTestId("dialogo-colision-nombre");
    await expect(dialogo).toBeVisible();
    await expect(page.getByRole("dialog", { name: "Nombre ya existe" })).toBeVisible();

    // El texto del diálogo menciona el nombre en conflicto.
    await expect(dialogo.getByText("Sensor", { exact: false })).toBeVisible();

    // Contexto "creacion" + mismo tipo → "Reutilizar" debe estar presente.
    const btnReutilizar = dialogo.getByRole("button", { name: "Reutilizar" });
    await expect(btnReutilizar).toBeVisible();

    // "Usar otro nombre" y "Cancelar" también presentes.
    await expect(dialogo.getByRole("button", { name: "Usar otro nombre" })).toBeVisible();
    await expect(dialogo.getByRole("button", { name: "Cancelar" })).toBeVisible();

    // El input "Nombre alternativo" sugiere "Sensor 2".
    const inputAlternativo = dialogo.getByLabel("Nombre alternativo");
    await expect(inputAlternativo).toBeVisible();
    await expect(inputAlternativo).toHaveValue("Sensor 2");

    // Click en "Reutilizar".
    await btnReutilizar.click();

    // El diálogo se cierra.
    await expect(dialogo).toHaveCount(0);

    // Verificar que NO se creó una entidad nueva: el total de entidades es igual al base.
    const estadoPost = await exportadoActual(page);
    const entidadesPost = Object.values(estadoPost.modelo.entidades);
    expect(entidadesPost.length).toBe(totalEntidadesBase);

    // La entidad "Sensor" es la misma (mismo id).
    const sensorPost = entidadesPost.find((e) => e.nombre === "Sensor");
    expect(sensorPost).toBeDefined();
    expect(sensorPost!.id).toBe(sensorBase!.id);

    expect(pageErrors).toEqual([]);
  });

  test("Cancelar (B3 creacion): entidad provisional es eliminada y el modelo queda intacto", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);

    // Crear "Sensor" (primera vez, sin colisión).
    await crearObjetoViaCanvasStickyActivo(page, "Sensor", false);
    await expect(page.getByTestId("dialogo-colision-nombre")).toHaveCount(0);

    const estadoBase = await exportadoActual(page);
    const totalEntidadesBase = Object.values(estadoBase.modelo.entidades).length;

    // Crear otro "Sensor" (con colisión, sticky ya activo).
    await crearObjetoViaCanvasStickyActivo(page, "Sensor", true);
    const dialogo = page.getByTestId("dialogo-colision-nombre");
    await expect(dialogo).toBeVisible();

    // Click en "Cancelar".
    await dialogo.getByRole("button", { name: "Cancelar" }).click();
    await expect(dialogo).toHaveCount(0);

    // La entidad provisional debe haber sido eliminada por resolverColisionCancelar.
    const estadoPost = await exportadoActual(page);
    const entidadesPost = Object.values(estadoPost.modelo.entidades);
    expect(entidadesPost.length).toBe(totalEntidadesBase);
    expect(entidadesPost.find((e) => e.nombre === "Sensor")).toBeDefined();

    expect(pageErrors).toEqual([]);
  });

  test("Usar otro nombre (B4 rename): crea entidad nueva con nombre alternativo", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);

    // Crear "Sensor" vía botón Objeto (toolbar directo → crearObjetoDemo).
    await page.getByRole("button", { name: "Objeto", exact: true }).click();
    await expect(page.getByTestId("inspector-entidad-nombre")).toBeVisible();
    await page.getByTestId("inspector-entidad-nombre").fill("Sensor");

    // Crear "Beta" con nombre distinto.
    await page.getByRole("button", { name: "Objeto", exact: true }).click();
    await expect(page.getByTestId("inspector-entidad-nombre")).toBeVisible();
    await page.getByTestId("inspector-entidad-nombre").fill("Beta");

    const estadoBase = await exportadoActual(page);
    const totalEntidadesBase = Object.values(estadoBase.modelo.entidades).length;

    // Renombrar "Beta" a "Sensor" desde el inspector → colisión (B4).
    await page.getByTestId("inspector-entidad-nombre").fill("Sensor");

    // El diálogo de colisión debe aparecer.
    const dialogo = page.getByTestId("dialogo-colision-nombre");
    await expect(dialogo).toBeVisible();

    // Contexto "rename" → NO debe existir el botón "Reutilizar".
    await expect(dialogo.getByRole("button", { name: "Reutilizar" })).toHaveCount(0);

    // "Usar otro nombre" visible, pre-relleno con "Sensor 2".
    const inputAlternativo = dialogo.getByLabel("Nombre alternativo");
    await expect(inputAlternativo).toHaveValue("Sensor 2");
    await expect(dialogo.getByRole("button", { name: "Usar otro nombre" })).toBeVisible();

    await dialogo.getByRole("button", { name: "Usar otro nombre" }).click();
    await expect(dialogo).toHaveCount(0);

    // "Sensor" y "Sensor 2" coexisten; "Beta" ya no existe.
    const estadoPost = await exportadoActual(page);
    const entidadesPost = Object.values(estadoPost.modelo.entidades);
    expect(entidadesPost.length).toBe(totalEntidadesBase);
    expect(entidadesPost.find((e) => e.nombre === "Sensor")).toBeDefined();
    expect(entidadesPost.find((e) => e.nombre === "Sensor 2")).toBeDefined();
    expect(entidadesPost.find((e) => e.nombre === "Beta")).toBeUndefined();

    expect(pageErrors).toEqual([]);
  });

  test("Cancelar (B4 rename): descarta el rename y el modelo queda intacto", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);

    // Crear "Sensor".
    await page.getByRole("button", { name: "Objeto", exact: true }).click();
    await expect(page.getByTestId("inspector-entidad-nombre")).toBeVisible();
    await page.getByTestId("inspector-entidad-nombre").fill("Sensor");

    // Crear "Beta".
    await page.getByRole("button", { name: "Objeto", exact: true }).click();
    await expect(page.getByTestId("inspector-entidad-nombre")).toBeVisible();
    await page.getByTestId("inspector-entidad-nombre").fill("Beta");

    const estadoBase = await exportadoActual(page);
    const totalEntidadesBase = Object.values(estadoBase.modelo.entidades).length;
    expect(estadoBase.modelo.entidades[
      Object.keys(estadoBase.modelo.entidades).find(
        (k) => estadoBase.modelo.entidades[k]?.nombre === "Beta",
      ) ?? ""
    ]).toBeDefined();

    // Intentar renombrar "Beta" a "Sensor" → colisión (B4).
    await page.getByTestId("inspector-entidad-nombre").fill("Sensor");

    const dialogo = page.getByTestId("dialogo-colision-nombre");
    await expect(dialogo).toBeVisible();

    // Click en "Cancelar".
    await dialogo.getByRole("button", { name: "Cancelar" }).click();
    await expect(dialogo).toHaveCount(0);

    // El modelo no debe haber cambiado:
    // "Beta" sigue existiendo (el rename fue cancelado).
    const estadoPost = await exportadoActual(page);
    const entidadesPost = Object.values(estadoPost.modelo.entidades);
    expect(entidadesPost.length).toBe(totalEntidadesBase);
    expect(entidadesPost.find((e) => e.nombre === "Beta")).toBeDefined();
    expect(entidadesPost.find((e) => e.nombre === "Sensor")).toBeDefined();

    expect(pageErrors).toEqual([]);
  });
});
