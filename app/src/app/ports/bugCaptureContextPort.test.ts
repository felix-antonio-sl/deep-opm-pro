import { expect, test } from "bun:test";
import { crearBugCaptureContext, type BugCaptureStoreContext } from "./bugCaptureContextPort";

test("crearBugCaptureContext combina contexto de store y navegador sin mutar el snapshot", () => {
  const storeContext: BugCaptureStoreContext = {
    modeloId: "modelo-1",
    modeloNombre: "Modelo Clinico",
    opdActivoId: "opd-1",
    opdActivoNombre: "SD1",
    seleccionEntidadId: "obj-1",
    seleccionEnlaceId: null,
    pestanaActivaId: "tab-1",
    vistaMapaActiva: false,
  };

  const context = crearBugCaptureContext(storeContext, {
    url: "http://localhost:5173/",
    userAgent: "playwright",
    viewport: { width: 1280, height: 720, devicePixelRatio: 1 },
    capturedAt: "2026-05-17T00:00:00.000Z",
  });

  expect(context).toEqual({
    ...storeContext,
    url: "http://localhost:5173/",
    userAgent: "playwright",
    viewport: { width: 1280, height: 720, devicePixelRatio: 1 },
    capturedAt: "2026-05-17T00:00:00.000Z",
  });
});
