import { expect, test } from "@playwright/test";
import { clickCabeceraElemento, importarModeloJson, objeto } from "./_smoke-helpers";

// W6.4: proyección read-only de anclas normativas por target en el Inspector
// (entidad / modelo / OPD activo en la rama vacía) + chip de anclas en el árbol
// OPD (espejo del chip Vista W6.3). Las anclas nacen en el proto; la app las
// muestra, no las edita.

function modeloConAnclas() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-anclas",
      nombre: "Modelo con anclas",
      opdRaizId: "opd-1",
      nextSeq: 10,
      procedencia: { protoHash: "hash-proto-anclas", autoriaVersion: "1", layoutVersion: "1" },
      entidades: { "o-1": objeto("o-1", "Frontera HD") },
      enlaces: {},
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-1": { id: "a-1", entidadId: "o-1", opdId: "opd-1", x: 80, y: 90, width: 135, height: 60 },
          },
          enlaces: {},
        },
      },
      anclasNormativas: {
        "an-1": {
          id: "an-1",
          claveProto: "ancla:frontera-art17",
          target: { tipo: "entidad", id: "o-1" },
          estado: "vigente",
          referencias: [{ norma: "DS 1/2022", articulos: ["15", "17"], seccion: "§Protocolos clínicos" }],
          nota: "requisitos",
        },
        "an-2": {
          id: "an-2",
          claveProto: "ancla:vista-causal",
          target: { tipo: "opd", id: "opd-1" },
          estado: "vigente",
        },
        "an-3": {
          id: "an-3",
          claveProto: "ratificar:convenio-ges",
          target: { tipo: "modelo" },
          estado: "pendiente-ratificacion",
          ratificacion: { nivelAutoridad: "mesa", estadoRatificacion: "pendiente" },
        },
      },
    },
  };
}

test("rama vacía proyecta anclas del modelo y del OPD activo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await importarModeloJson(page, modeloConAnclas());

  const secciones = page.getByTestId("inspector-seccion-anclas");
  const delModelo = secciones.filter({ hasText: "Anclas del modelo" });
  await expect(delModelo).toBeVisible();
  await expect(delModelo).toContainText("ratificar:convenio-ges");
  await expect(delModelo).toContainText("[RATIFICAR]");

  const delOpd = secciones.filter({ hasText: "Anclas del OPD" });
  await expect(delOpd).toBeVisible();
  await expect(delOpd).toContainText("ancla:vista-causal");
  await expect(delOpd).toContainText("vigente");

  // El registro [RATIFICAR] (W6.5-b) convive con la proyección de anclas.
  await expect(page.getByTestId("inspector-registro-ratificar")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("Nota y RATIFICAR conservan voz, fuente, destino, undo y recibo separados", async ({ page }) => {
  await page.addInitScript(() => {
    const target = window as typeof window & { __logTutorCopiado?: string[] };
    target.__logTutorCopiado = [];
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText(texto: string) {
          target.__logTutorCopiado?.push(texto);
          return Promise.resolve();
        },
      },
    });
  });
  await page.goto("/");
  await importarModeloJson(page, modeloConAnclas());
  await page.getByRole("button", { name: "Nota del modelo" }).click();

  const tutorNota = page.getByTestId("tutor-nota-mesa");
  const tutorRatificar = page.getByTestId("tutor-registro-ratificar");
  await expect(tutorNota).toHaveCount(1);
  await expect(tutorRatificar).toHaveCount(1);
  await expect(tutorNota).toHaveAttribute("data-tutor-action", "inspector:note-add");
  await expect(tutorRatificar).toHaveAttribute("data-tutor-action", "inspector:anchor-ratify-source");
  for (const tutor of [tutorNota, tutorRatificar]) {
    await tutor.scrollIntoViewIfNeeded();
    await tutor.getByText("Fundamento", { exact: true }).click();
    await expect(tutor.locator('a[href^="/tutor-sources/"]').first()).toBeVisible();
  }

  const ratificarGenerico = page.getByTestId("ancla-item").filter({ hasText: "[RATIFICAR]" });
  await expect(ratificarGenerico).toHaveCount(1);
  await page.getByTestId("nota-mesa-input").fill("Revisar frontera sin autoridad normativa");
  await page.getByTestId("nota-mesa-agregar").click();
  await expect(page.getByTestId("nota-mesa-item")).toHaveText("Revisar frontera sin autoridad normativa×");
  await expect(ratificarGenerico).toHaveCount(1);
  await expect(page.getByTestId("nota-mesa-item")).not.toContainText("RATIFICAR");
  await page.keyboard.press("Control+z");
  await expect(page.getByTestId("nota-mesa-item")).toHaveCount(0);

  const fila = page.getByTestId("registro-ratificar-fila");
  await page.getByTestId("registro-anotar-mesa").click();
  await expect(fila).toContainText("anotado-en-mesa");
  await page.keyboard.press("Control+z");
  await expect(fila).toContainText("pendiente");
  await page.keyboard.press("Control+Shift+z");
  await expect(fila).toContainText("anotado-en-mesa");

  await page.getByTestId("registro-fuente-input").fill("Acta mesa 2026-07-21");
  await page.getByTestId("registro-ratificar-fuente").click();
  await expect(fila).toContainText("ratificado-con-fuente");
  await expect(fila).toContainText("Acta mesa 2026-07-21");
  await page.keyboard.press("Control+z");
  await expect(fila).toContainText("anotado-en-mesa");

  await page.getByTestId("registro-copiar-log").click();
  const copiados = await page.evaluate(() => (
    window as typeof window & { __logTutorCopiado?: string[] }
  ).__logTutorCopiado ?? []);
  expect(copiados).toHaveLength(1);
  expect(JSON.parse(copiados[0] ?? "{}")).toMatchObject({
    schema: "deep-opm-pro.log-decisiones.v0",
    modeloHash: "hash-proto-anclas",
  });
});

test("entidad seleccionada muestra sus anclas con referencia formateada", async ({ page }) => {
  await page.goto("/");
  await importarModeloJson(page, modeloConAnclas());

  await clickCabeceraElemento(page, "Frontera HD");

  const seccion = page.getByTestId("inspector-seccion-anclas");
  await expect(seccion).toBeVisible();
  await expect(seccion).toContainText("ancla:frontera-art17");
  await expect(seccion).toContainText("DS 1/2022 · 15, 17 · §Protocolos clínicos");
  await expect(seccion).toContainText("requisitos");
  await expect(seccion).toContainText("vigente");
});

test("árbol OPD señaliza el OPD con anclas mediante chip", async ({ page }) => {
  await page.goto("/");
  await importarModeloJson(page, modeloConAnclas());

  const chip = page.getByTestId("arbol-tag-anclas");
  await expect(chip).toBeVisible();
  await expect(chip).toHaveText("Anclas 1");
  await expect(chip).toHaveAttribute("title", /ancla:vista-causal/);
});

test("modelo sin anclas no monta sección ni chip", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("inspector-vacio")).toBeVisible();
  await expect(page.getByTestId("inspector-seccion-anclas")).toHaveCount(0);
  await expect(page.getByTestId("arbol-tag-anclas")).toHaveCount(0);
});
