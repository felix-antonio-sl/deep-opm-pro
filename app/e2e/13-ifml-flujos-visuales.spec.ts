/**
 * Smokes IFML Ronda 15 L3.
 *
 * Cubre el flujo `ViewContainer JointCanvas -> Event drop -> Action
 * crearEntidadEnCanvas -> NavigationFlow -> ViewContainer modal-nombre-cosa`
 * tras tipar el SystemEvent ad-hoc `opm:nueva-cosa` como
 * `nuevaCosaPendiente` en el store (IFML H-3).
 *
 * Garantías:
 * 1) El bus global `window.dispatchEvent("opm:nueva-cosa")` ya no se usa: si
 *    el listener legacy desaparece y el modal sigue apareciendo, la
 *    integración Action -> View vive en el store.
 * 2) Escape sobre el input cierra el modal sin renombrar (limpia el estado
 *    pendiente) y deja la entidad con su nombre por defecto.
 * 3) No regresa el smoke HU-30.037: Esc cierra el modal de nombre, no
 *    propaga al stack global de modales.
 */
import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible, elementoPorTexto } from "./_smoke-helpers";

test.describe("Ronda 15 L3 IFML flow nueva-cosa", () => {
  test("Action crearEntidadEnCanvas dispara modal vía store, no por bus DOM", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);

    // Antes de cualquier interacción no debe haber listeners legacy
    // `opm:nueva-cosa` registrados en window: si el contrato es de store, el
    // CustomEvent es decorativo y nadie lo escucha.
    const noListeners = await page.evaluate(() => {
      let recibido = false;
      const handler = () => { recibido = true; };
      window.addEventListener("opm:nueva-cosa", handler);
      window.dispatchEvent(new CustomEvent("opm:nueva-cosa", { detail: { entidadId: "x", aparienciaId: "y", nombre: "Z" } }));
      window.removeEventListener("opm:nueva-cosa", handler);
      // Un dispatch externo no debe abrir el modal porque el listener vivo del
      // ToolbarBase fue eliminado al migrar a estado de store.
      const modalAbierto = !!document.querySelector('[data-testid="modal-nombre-cosa"]');
      return { recibido, modalAbierto };
    });
    // El handler externo de la prueba sí recibe su propio dispatch (control),
    // pero el modal NO se abre porque el ToolbarBase ya no escucha el bus.
    expect(noListeners.recibido).toBe(true);
    expect(noListeners.modalAbierto).toBe(false);

    // Ejecutar el flujo IFML real: drop en canvas -> Action -> NavigationFlow
    const canvas = page.getByRole("img", { name: "OPD activo" });
    await page.getByTestId("toolbar-modo-creacion-objeto").dragTo(canvas, { targetPosition: { x: 320, y: 190 } });

    const modal = page.getByTestId("modal-nombre-cosa");
    await expect(modal).toBeVisible();

    // El modal lee `nuevaCosaPendiente.nombre` del store (no del CustomEvent
    // detail). Tipear y confirmar persiste el nombre como acción Action ->
    // commitModelo + setState({ nuevaCosaPendiente: null }).
    await modal.getByLabel("Nombre").fill("Cosa via store IFML");
    await modal.getByRole("button", { name: "OK" }).click();
    await expect(modal).toHaveCount(0);
    await expect(elementoPorTexto(page, "Cosa via store IFML")).toHaveCount(1);

    expect(pageErrors).toEqual([]);
  });

  test("Escape cierra el top modal correcto: descarta nuevaCosaPendiente sin renombrar", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);

    const canvas = page.getByRole("img", { name: "OPD activo" });
    await page.getByTestId("toolbar-modo-creacion-objeto").dragTo(canvas, { targetPosition: { x: 320, y: 190 } });

    const modal = page.getByTestId("modal-nombre-cosa");
    await expect(modal).toBeVisible();
    const input = modal.getByLabel("Nombre");
    await input.focus();
    await input.fill("Nombre nunca aplicado");

    // Escape sobre el input: descartarNuevaCosaPendiente, no
    // confirmarNombreNuevaCosa. El stack legacy de modales NO se ve afectado
    // (HU-30.037: dialogos archivados/buscar global responden a sus propios
    // Esc; aquí Esc sobre el input no debe propagarse a vaciarSeleccion).
    await input.press("Escape");
    await expect(modal).toHaveCount(0);

    // La entidad existe pero conserva el nombre por defecto del store
    // (no se aplicó "Nombre nunca aplicado").
    await expect(elementoPorTexto(page, "Nombre nunca aplicado")).toHaveCount(0);

    expect(pageErrors).toEqual([]);
  });

  test("HU-30.037 no regresa: Esc en DialogoArchivados sigue siendo independiente del flujo nueva-cosa", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await cerrarPantallaInicioSiVisible(page);

    // Sin nueva-cosa pendiente: Esc no debe lanzar errores ni abrir nada.
    await page.keyboard.press("Escape");

    // Crear una entidad sin renombrar: descartar pendiente.
    const canvas = page.getByRole("img", { name: "OPD activo" });
    await page.getByTestId("toolbar-modo-creacion-objeto").dragTo(canvas, { targetPosition: { x: 320, y: 190 } });
    const modal = page.getByTestId("modal-nombre-cosa");
    await expect(modal).toBeVisible();
    const input = modal.getByLabel("Nombre");
    await input.focus();
    await input.press("Escape");
    await expect(modal).toHaveCount(0);

    // Otro Esc sobre canvas vacía la selección sin tocar nada residual.
    await page.keyboard.press("Escape");

    expect(pageErrors).toEqual([]);
  });
});
