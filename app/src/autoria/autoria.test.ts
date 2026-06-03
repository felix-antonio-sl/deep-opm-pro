import { describe, expect, test } from "bun:test";
import { crearAutor, emitirBundle } from "./index";
import { construirCafetera } from "./_fixtures/cafetera";

describe("autoría DSL", () => {
  test("construye un modelo y resuelve claves a ids", () => {
    const a = crearAutor({ id: "x", nombre: "X" });
    a.entidad("p", "proceso", "Hacer algo", "fisica", "sistemica");
    a.entidad("o", "objeto", "Cosa", "fisica", "ambiental");
    a.estados("o", ["a", "b"], "a");
    a.opd("sd0", "SD0", null);
    a.ver("sd0", "p", 0, 0);
    a.ver("sd0", "o", 0, 0);
    a.enlazar("sd0", "p", "o", "efecto", { entrada: "a", salida: "b" });
    expect(Object.keys(a.modelo.entidades).length).toBe(2);
    expect(Object.keys(a.modelo.estados).length).toBe(2);
    expect(Object.keys(a.modelo.enlaces).length).toBe(1);
    expect(Object.keys(a.modelo.opds).length).toBe(1);
    expect(a.modelo.opdRaizId).toBe("opd-sd0");
    expect(a.id("p")).toBe("p-p");
  });

  test("es re-entrante: dos autores no comparten estado", () => {
    const a = crearAutor();
    const b = crearAutor();
    a.entidad("x", "objeto", "X", "fisica", "ambiental");
    expect(Object.keys(a.modelo.entidades).length).toBe(1);
    expect(Object.keys(b.modelo.entidades).length).toBe(0);
  });

  test("lanza ante clave de entidad/estado no registrada", () => {
    const a = crearAutor();
    a.opd("sd0", "SD0", null);
    expect(() => a.ver("sd0", "no-existe", 0, 0)).toThrow(/Entidad no registrada/);
  });

  test("la agregación contorno→subproceso se consume como contención interna (no enlace)", () => {
    const a = construirCafetera();
    // 3 agregaciones contorno→sub fueron consumidas; no aparecen como enlaces.
    expect(a.internosInzoom.get("opd-inzoom")?.size).toBe(3);
  });
});

describe("autoría — emitirBundle (cafetera, dominio NO-HODOM)", () => {
  const bundle = emitirBundle(construirCafetera());

  test("emite sin lanzar: round-trip + contención + canon PASS", () => {
    expect(bundle.conteos.entidades).toBe(9);
    expect(bundle.conteos.opds).toBe(2);
    expect(bundle.conteos.estados).toBe(2);
  });

  test("el JSON es un bundle deep-opm-pro.modelo.v0 válido", () => {
    const parsed = JSON.parse(bundle.json);
    expect(parsed.formato).toBe("deep-opm-pro.modelo.v0");
    expect(parsed.modelo.opds).toBeDefined();
  });

  test("canon sin bloqueantes (0 avisos de severidad error)", () => {
    expect(bundle.avisos.filter((a) => a.severidad === "error").length).toBe(0);
  });

  test("OPL no vacío y nombra el proceso raíz", () => {
    expect(bundle.opl.length).toBeGreaterThan(0);
    expect(bundle.opl).toContain("Hacer café");
  });

  test("cero solapamientos reales en todos los OPDs (consciente de contención)", () => {
    const modelo = JSON.parse(bundle.json).modelo;
    const contiene = (A: any, B: any) =>
      A.x <= B.x && A.y <= B.y && A.x + A.width >= B.x + B.width && A.y + A.height >= B.y + B.height;
    const inter = (a: any, b: any) =>
      a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    let solapes = 0;
    for (const opd of Object.values<any>(modelo.opds)) {
      const aps = Object.values<any>(opd.apariencias);
      for (let i = 0; i < aps.length; i++)
        for (let j = i + 1; j < aps.length; j++) {
          const a = aps[i], b = aps[j];
          if (inter(a, b) && !contiene(a, b) && !contiene(b, a)) solapes++;
        }
    }
    expect(solapes).toBe(0);
  });
});
