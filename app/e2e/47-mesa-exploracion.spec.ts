import { expect, test } from "@playwright/test";
import {
  abrirDialogoCargarModelo,
  elementoPorTexto,
  esperarWorkbenchInicial,
  ejecutarComandoPalette,
} from "./_smoke-helpers";

const FUENTE = "Una solicitud cambia de pendiente a atendida";
const TRAZO = "cambia de pendiente a atendida";
const HECHO = "Atender solicitud";

test("Mesa de exploración conserva lo preformal hasta confirmar, deja rastro y permite deshacer, corregir y recuperar", async ({ page }) => {
  test.setTimeout(60_000);
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await ejecutarComandoPalette(page, "nuevo", "menu-nuevo-modelo");
  await expect(page.getByTestId("cinta-apunte")).toBeVisible();

  const entrada = page.getByTestId("estado-vacio-empezar-exploracion");
  await expect(entrada).toHaveText("Material todavía ambiguo · explorar antes de modelar");
  await entrada.click();

  const mesa = page.getByTestId("dialogo-mesa-exploracion");
  await expect(mesa).toBeVisible();
  await expect(mesa.getByTestId("mesa-estado")).toContainText("Sin interpretar");
  await expect(mesa.getByLabel("Material original")).toBeFocused();
  await expect(mesa.getByTestId("tutor-mesa-exploracion")).toContainText(
    "Señala primero lo observable; la Mesa no convierte nada en OPM hasta que confirmes.",
  );

  await mesa.getByLabel("Material original").fill(FUENTE);
  await mesa.getByRole("button", { name: "Conservar fuente" }).click();
  await expect(mesa.getByTestId("mesa-fuente-conservada")).toContainText(FUENTE);
  await expect(mesa.getByLabel("Fragmento observable")).toBeFocused();

  await mesa.getByLabel("Fragmento observable").fill(TRAZO);
  await mesa.getByRole("button", { name: "Guardar trazo" }).click();
  await expect(mesa.getByTestId("mesa-trazo-conservado")).toContainText(TRAZO);
  await expect(mesa.getByRole("button", { name: "Editar trazo" })).toBeVisible();

  // La decisión de objeto/proceso la toma la persona: no hay clasificación silenciosa.
  await expect(mesa).toContainText("¿Qué describe el trazo?");
  await mesa.getByRole("button", { name: "Algo que ocurre o cambia" }).click();
  await expect(mesa.getByLabel("Nombre del proceso propuesto")).toBeFocused();
  await mesa.getByLabel("Nombre del proceso propuesto").fill(HECHO);
  await mesa.getByRole("button", { name: "Previsualizar propuesta" }).click();

  await expect(mesa.getByTestId("mesa-estado")).toContainText(
    "Propuesta pendiente · todavía no cambia el modelo",
  );
  await expect(mesa.getByTestId("mesa-mini-opd")).toContainText(`Proceso: ${HECHO}`);
  await expect(mesa.getByTestId("mesa-mini-opd")).toHaveAttribute(
    "aria-label",
    `Mini-OPD: proceso ${HECHO}`,
  );
  await expect(mesa.getByTestId("mesa-opl-preview")).toContainText(HECHO);
  await expect(mesa).toContainText(`Se creará un proceso llamado «${HECHO}»`);

  // Fuente, trazo y propuesta no emiten OPL ni alteran el OPD canónico.
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(page.getByTestId("panel-opl")).not.toContainText(HECHO);

  await mesa.getByRole("button", { name: "Confirmar como hecho OPM" }).click();
  await expect(mesa.getByTestId("mesa-estado")).toContainText("Hecho OPM confirmado");
  await expect(mesa.getByTestId("mesa-proveniencia")).toContainText(FUENTE);
  await expect(mesa.getByTestId("mesa-proveniencia")).toContainText(TRAZO);
  await expect(mesa.getByTestId("mesa-proveniencia")).toContainText(HECHO);
  await expect(elementoPorTexto(page, HECHO)).toHaveCount(1);
  await expect(page.getByTestId("panel-opl")).toContainText(HECHO);

  await mesa.getByRole("button", { name: "Ir al hecho OPM" }).click();
  await expect(mesa).toHaveCount(0);
  await expect(page.getByTestId("inspector-entidad-nombre")).toHaveValue(HECHO);

  // El Apunte mantiene una entrada estable al rastro incluso después de crear el hecho.
  await page.getByTestId("cinta-apunte-explorar").click();
  await expect(mesa.getByTestId("mesa-proveniencia")).toContainText(HECHO);
  await mesa.getByRole("button", { name: "Ver fuente" }).click();
  await expect(mesa.getByTestId("mesa-fuente-conservada")).toContainText(FUENTE);
  await mesa.getByRole("button", { name: "Volver al hecho" }).click();

  await mesa.getByRole("button", { name: "Deshacer confirmación" }).click();
  await expect(mesa.getByTestId("mesa-estado")).toContainText(
    "Propuesta pendiente · todavía no cambia el modelo",
  );
  await expect(elementoPorTexto(page, HECHO)).toHaveCount(0);
  await expect(page.getByTestId("panel-opl")).not.toContainText(HECHO);
  await expect(mesa.getByTestId("mesa-fuente-conservada")).toContainText(FUENTE);
  await expect(mesa.getByTestId("mesa-trazo-conservado")).toContainText(TRAZO);

  await mesa.getByRole("button", { name: "Corregir propuesta" }).click();
  await mesa.getByLabel("Nombre del proceso propuesto").fill("Resolver solicitud");
  await mesa.getByRole("button", { name: "Actualizar propuesta" }).click();
  await expect(mesa.getByTestId("mesa-mini-opd")).toContainText("Proceso: Resolver solicitud");
  await mesa.getByRole("button", { name: "Confirmar como hecho OPM" }).click();
  await expect(elementoPorTexto(page, "Resolver solicitud")).toHaveCount(1);
  await expect(mesa.getByTestId("mesa-proveniencia")).toContainText("Resolver solicitud");

  // El Apunte nace persistido; guardamos por el atajo público y recargamos.
  await mesa.getByRole("button", { name: "Cerrar" }).click();
  await page.keyboard.press("Control+s");
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "local-clean", { timeout: 15_000 });
  const nombreApunte = (await page.getByRole("tab", { selected: true }).textContent())?.trim() ?? "Apunte";
  await page.reload();
  await esperarWorkbenchInicial(page);
  const gestor = await abrirDialogoCargarModelo(page);
  const fila = gestor.getByTestId("gestor-zona-taller").getByTestId("modelo-fila-cargar").filter({ hasText: nombreApunte }).first();
  await expect(fila).toBeVisible();
  await fila.dblclick();
  await expect(gestor).toHaveCount(0);
  await expect(page.getByTestId("cinta-apunte")).toBeVisible();
  await page.getByTestId("cinta-apunte-explorar").click();
  await expect(mesa.getByTestId("mesa-proveniencia")).toContainText(FUENTE);
  await expect(mesa.getByTestId("mesa-proveniencia")).toContainText(TRAZO);
  await expect(mesa.getByTestId("mesa-proveniencia")).toContainText("Resolver solicitud");
  await mesa.getByRole("button", { name: "Ver fuente" }).click();
  await expect(mesa.getByTestId("mesa-fuente-conservada")).toContainText(FUENTE);
  await expect(mesa.getByTestId("mesa-trazo-conservado")).toContainText(TRAZO);
  await expect(elementoPorTexto(page, "Resolver solicitud")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("Mesa de exploración ofrece diálogo lineal operable por teclado y foco contenido", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await ejecutarComandoPalette(page, "nuevo", "menu-nuevo-modelo");

  const entrada = page.getByTestId("estado-vacio-empezar-exploracion");
  await entrada.focus();
  await page.keyboard.press("Enter");

  const mesa = page.getByTestId("dialogo-mesa-exploracion");
  await expect(mesa).toHaveAttribute("aria-modal", "true");
  await expect(mesa.getByLabel("Material original")).toBeFocused();
  await expect(mesa.getByLabel("Material original")).toHaveAttribute(
    "aria-describedby",
    "mesa-fuente-ayuda",
  );

  // Tab y Shift+Tab permanecen dentro del diálogo base; Escape vuelve al disparador.
  await page.keyboard.press("Shift+Tab");
  await expect(mesa.locator(":focus")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(mesa).toHaveCount(0);
  await expect(entrada).toBeFocused();
});

test("Mesa de exploración no transporta borradores efímeros entre Apuntes", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await ejecutarComandoPalette(page, "nuevo", "menu-nuevo-modelo");

  await page.getByTestId("estado-vacio-empezar-exploracion").click();
  const mesa = page.getByTestId("dialogo-mesa-exploracion");
  await mesa.getByLabel("Material original").fill("Borrador exclusivo del primer Apunte");
  await mesa.getByRole("button", { name: "Cerrar" }).click();

  await ejecutarComandoPalette(page, "nuevo", "menu-nuevo-modelo");
  await page.getByTestId("estado-vacio-empezar-exploracion").click();

  await expect(mesa.getByLabel("Material original")).toHaveValue("");
});

test("Mesa de exploración muestra el nombre ontológico efectivo en mini-OPD, copy y OPL", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await ejecutarComandoPalette(page, "nuevo", "menu-nuevo-modelo");

  await ejecutarComandoPalette(page, "ontologia canon sinonimo", "menu-configurar-ontologia");
  const ontologia = page.getByTestId("dialogo-ontologia");
  await ontologia.getByLabel("Modo").selectOption("enforce");
  await ontologia.getByLabel("Términos").fill("Paciente = Usuario");
  await ontologia.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(ontologia).toHaveCount(0);

  await page.getByTestId("estado-vacio-empezar-exploracion").click();
  const mesa = page.getByTestId("dialogo-mesa-exploracion");
  await mesa.getByLabel("Material original").fill("Existe un usuario que solicita atención");
  await mesa.getByRole("button", { name: "Conservar fuente" }).click();
  await mesa.getByLabel("Fragmento observable").fill("un usuario");
  await mesa.getByRole("button", { name: "Guardar trazo" }).click();
  await mesa.getByRole("button", { name: "Una cosa que existe" }).click();
  await mesa.getByLabel("Nombre del objeto propuesto").fill("Usuario");
  await mesa.getByRole("button", { name: "Previsualizar propuesta" }).click();

  const miniOpd = mesa.getByTestId("mesa-mini-opd");
  await expect(miniOpd).toContainText("Objeto: Paciente");
  await expect(miniOpd).toHaveAttribute("aria-label", "Mini-OPD: objeto Paciente");
  await expect(mesa.getByTestId("mesa-opl-preview")).toContainText("Paciente");
  await expect(mesa).toContainText("Se creará un objeto llamado «Paciente»");
});
