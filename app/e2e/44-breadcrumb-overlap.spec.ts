import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial, jsonEditor } from "./_smoke-helpers";

// BUG-20260708T205824Z-7f09f9: «se solapan y sobreescriben los breadcrumbs».
// Repro: OPD activo de nombre largo con ruta profunda (HODOM). Los segmentos
// del breadcrumb (flex, minWidth:0, nowrap, SIN overflow) desbordan sus cajas y
// se enciman en vez de recortarse.

async function medirDesbordes(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const nav = document.querySelector('[data-testid="breadcrumb-opd"]');
    if (!nav) return [] as Array<{ testid: string | null; text: string; overflowPx: number; overflowRecortado: boolean }>;
    return Array.from(nav.querySelectorAll('button[data-testid^="breadcrumb-opd-"]')).map((el) => {
      const cs = getComputedStyle(el);
      return {
        testid: el.getAttribute("data-testid"),
        text: (el.textContent || "").trim(),
        overflowPx: el.scrollWidth - el.clientWidth,
        overflowRecortado: cs.overflowX === "hidden" || cs.overflow === "hidden",
      };
    });
  });
}

test("los segmentos del breadcrumb no se solapan con nombres largos", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 963 });
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await jsonEditor(page).fill(JSON.stringify(modeloRutaLarga(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();

  // Activar el OPD hoja de nombre largo para que el breadcrumb muestre la ruta profunda.
  await page.getByTestId("tree-node-opd-3").click();
  await expect(page.getByTestId("breadcrumb-opd-opd-3")).toBeVisible();

  await page.screenshot({ path: "test-results/breadcrumb-repro.png", clip: { x: 0, y: 0, width: 1280, height: 60 } });

  // El texto de cada segmento no debe desbordar su propia caja (scrollWidth >
  // clientWidth con overflow visible = texto pintado ENCIMA del vecino).
  const desbordes = await medirDesbordes(page);
  // Código compacto: el segmento activo muestra el código canónico, no el
  // nombre descriptivo completo.
  const activo = desbordes.find((s) => s.testid === "breadcrumb-opd-opd-3");
  expect(activo?.text.startsWith("sd1.m2.1.r")).toBe(true);
  for (const seg of desbordes) {
    const desborda = seg.overflowPx > 1 && !seg.overflowRecortado;
    expect(desborda, `«${seg.text}» (${seg.testid}) desborda su caja ${seg.overflowPx}px sin recorte → se solapa con el vecino`).toBe(false);
  }
});

test("con barra angosta el breadcrumb recorta sin solaparse (excede el contenedor)", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await jsonEditor(page).fill(JSON.stringify(modeloRutaLarga(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  await page.getByTestId("tree-node-opd-3").click();
  await expect(page.getByTestId("breadcrumb-opd-opd-3")).toBeVisible();

  const desbordes = await medirDesbordes(page);
  for (const seg of desbordes) {
    const desborda = seg.overflowPx > 1 && !seg.overflowRecortado;
    expect(desborda, `«${seg.text}» (${seg.testid}) desborda ${seg.overflowPx}px sin recorte al angostar la barra`).toBe(false);
  }
});

function modeloRutaLarga() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-breadcrumb-largo",
      nombre: "HODOM completo v2.0",
      opdRaizId: "opd-1",
      nextSeq: 6,
      entidades: {
        "p-1": { id: "p-1", tipo: "proceso", nombre: "Atender", esencia: "informacional", afiliacion: "sistemica" },
      },
      estados: {},
      enlaces: {},
      abanicos: {},
      opds: {
        "opd-1": { id: "opd-1", nombre: "SD - Sistema HODOM de hospitalizacion domiciliaria", padreId: null, apariencias: { "a-1": { id: "a-1", entidadId: "p-1", opdId: "opd-1", x: 200, y: 200, width: 150, height: 70 } }, enlaces: {} },
        "opd-2": { id: "opd-2", nombre: "SD1.M2 - Modulo de atencion clinica integral del paciente", padreId: "opd-1", apariencias: {}, enlaces: {} },
        "opd-3": { id: "opd-3", nombre: "SD1.M2.1.R - Realizacion de la atencion (prestaciones)", padreId: "opd-2", apariencias: {}, enlaces: {} },
      },
    },
  };
}
