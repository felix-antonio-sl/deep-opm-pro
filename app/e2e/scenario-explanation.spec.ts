import { expect, test, type Page } from "@playwright/test";
import { extremoEntidad, extremoEstado } from "../src/modelo/extremos";
import {
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  renombrarEstado,
} from "../src/modelo/operaciones";
import { exportarModelo } from "../src/serializacion/json";
import type { Modelo, Resultado } from "../src/modelo/tipos";
import { clickToolbarMasItem, esperarWorkbenchInicial, jsonEditor } from "./_smoke-helpers";

test("escenario: conserva desconocido, bloquea con recurso no disponible y explica la revisión", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => { pageErrors.push(error.message); });
  const { modelo, vehiculoId } = modeloConInstrumento();

  await abrirWorkbench(page);
  await jsonEditor(page).fill(exportarModelo(modelo));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  await clickToolbarMasItem(page, "toolbar-mas-simulacion");
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();

  const editor = page.getByTestId("simulacion-escenario-editor");
  await editor.locator("summary").click();
  await expect(page.getByTestId(`simulacion-escenario-estado-${vehiculoId}`)).toHaveValue("");
  await expect(page.getByTestId(`simulacion-escenario-presencia-${vehiculoId}`)).toHaveValue("");
  await page.getByLabel("Estado inicial de Pedido").selectOption({ label: "listo" });
  await page.getByTestId("simulacion-escenario-aplicar").click();
  await avanzarHastaBloqueo(page);

  const indeterminado = page.getByTestId("simulacion-escenario-conclusion");
  await expect(indeterminado).toContainText("En este escenario…");
  await expect(indeterminado).toContainText("Indeterminado");
  await expect(indeterminado).toContainText("Vehiculo no tiene un estado runtime conocido");
  await expect(indeterminado).not.toContainText("ausente");
  await expect(indeterminado.getByTestId("simulacion-escenario-limites")).toContainText("no se convierte en ausencia");

  await page.getByLabel("Presencia de Vehiculo").selectOption({ label: "Presente" });
  await page.getByLabel("Estado inicial de Vehiculo").selectOption({ label: "no disponible" });
  await page.getByTestId("simulacion-escenario-aplicar").click();
  await avanzarHastaBloqueo(page);

  const espera = page.getByTestId("simulacion-escenario-conclusion");
  await expect(espera).toContainText("En espera");
  await expect(espera).toContainText("está en no disponible; el enlace requiere disponible");
  await expect(espera).toContainText("no implica imposibilidad general");
  const evidencia = espera.locator("details");
  await evidencia.locator("summary").click();
  await expect(evidencia).toContainText("instrumento: Vehiculo: disponible → Entregar");
  await expect(evidencia).toContainText("R-ECA-2");
  await expect(page.getByTestId("simulacion-escenario-editor")).toContainText(`Base local fijada al aplicar`);

  await page.getByTestId("barra-simulacion-salir").click();
  expect(pageErrors).toEqual([]);
});

function modeloConInstrumento(): { modelo: Modelo; vehiculoId: string } {
  let modelo = crearModelo("Ensayo de vehículo");
  modelo = debe(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 100 }, "Pedido"));
  modelo = debe(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 250 }, "Vehiculo"));
  modelo = debe(crearProceso(modelo, modelo.opdRaizId, { x: 360, y: 170 }, "Entregar"));
  const pedidoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Pedido")!.id;
  const vehiculoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Vehiculo")!.id;
  const procesoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Entregar")!.id;

  const estadosPedido = debe(crearEstadosIniciales(modelo, pedidoId));
  modelo = estadosPedido.modelo;
  const [listoId, entregadoId] = estadosPedido.estadoIds;
  if (!listoId || !entregadoId) throw new Error("Se esperaban dos estados para Pedido");
  modelo = debe(renombrarEstado(modelo, listoId, "listo"));
  modelo = debe(renombrarEstado(modelo, entregadoId, "entregado"));

  const estadosVehiculo = debe(crearEstadosIniciales(modelo, vehiculoId));
  modelo = estadosVehiculo.modelo;
  const [noDisponibleId, disponibleId] = estadosVehiculo.estadoIds;
  if (!noDisponibleId || !disponibleId) throw new Error("Se esperaban dos estados para Vehiculo");
  modelo = debe(renombrarEstado(modelo, noDisponibleId, "no disponible"));
  modelo = debe(renombrarEstado(modelo, disponibleId, "disponible"));

  modelo = debe(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(listoId), extremoEntidad(procesoId), "consumo"));
  modelo = debe(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(procesoId), extremoEstado(entregadoId), "resultado"));
  modelo = debe(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(disponibleId), extremoEntidad(procesoId), "instrumento"));
  return { modelo, vehiculoId };
}

function debe<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

async function avanzarHastaBloqueo(page: Page): Promise<void> {
  const paso = page.getByTestId("barra-simulacion-paso");
  for (let indice = 0; indice < 6 && await paso.isEnabled(); indice += 1) {
    await paso.click();
    if (await page.getByTestId("barra-simulacion-progreso").innerText().then((texto) => texto.includes("Bloqueada"))) break;
  }
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText("Bloqueada");
}

async function abrirWorkbench(page: Page): Promise<void> {
  await page.goto("/");
  const workbench = page.getByTestId("toolbar-root");
  const login = page.getByTestId("pantalla-login");
  await expect(workbench.or(login)).toBeVisible();
  if (await login.count() > 0) {
    await page.getByTestId("login-email").fill("dev@opforja.local");
    await page.getByTestId("login-password").fill("opforja-dev-password");
    await page.getByTestId("login-submit").click();
  }
  await esperarWorkbenchInicial(page);
}
