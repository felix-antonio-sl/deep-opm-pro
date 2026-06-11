import { describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import { exportarModeloPdf } from "./pdf";

describe("exportarModeloPdf", () => {
  test("genera un Blob PDF autocontenido", async () => {
    const blob = exportarModeloPdf(crearModelo("PDF"));
    expect(blob.type).toBe("application/pdf");
    expect(await blob.text()).toStartWith("%PDF-1.4");
  });
});
