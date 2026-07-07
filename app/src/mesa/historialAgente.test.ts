import { describe, expect, test } from "bun:test";
import { agruparHistorialPorSesionAgente, esVersionDeAgente } from "./historialAgente";
import type { VersionResumen } from "../modelo/tipos";

function v(id: string, nombre: string, creadoEn: string): VersionResumen {
  return { id, nombre, creadoEn, modeloPayloadKey: id, bytes: 10 };
}

describe("esVersionDeAgente", () => {
  test("prefijo agente· → true", () => {
    expect(esVersionDeAgente(v("1", "agente·nota", "2026-07-07T10:00:00Z"))).toBe(true);
  });
  test("humano → false", () => {
    expect(esVersionDeAgente(v("1", "Guardado manual", "2026-07-07T10:00:00Z"))).toBe(false);
  });
});

describe("agruparHistorialPorSesionAgente", () => {
  test("lista vacía → []", () => {
    expect(agruparHistorialPorSesionAgente([])).toEqual([]);
  });
  test("solo humanas → todas individuales", () => {
    const out = agruparHistorialPorSesionAgente([
      v("a", "Manual", "2026-07-07T12:00:00Z"),
      v("b", "Manual", "2026-07-07T11:00:00Z"),
    ]);
    expect(out.map((f) => f.tipo)).toEqual(["individual", "individual"]);
  });
  test("corrida consecutiva de agente → una fila sesion-agente", () => {
    const versiones = [
      v("a3", "agente·paso 3", "2026-07-07T12:03:00Z"),
      v("a2", "agente·paso 2", "2026-07-07T12:02:00Z"),
      v("a1", "agente·paso 1", "2026-07-07T12:01:00Z"),
      v("h", "Manual", "2026-07-07T12:00:00Z"),
    ];
    const out = agruparHistorialPorSesionAgente(versiones);
    expect(out.map((f) => f.tipo)).toEqual(["sesion-agente", "individual"]);
    const grupo = out[0];
    if (grupo.tipo !== "sesion-agente") throw new Error("esperaba grupo");
    expect(grupo.versiones).toHaveLength(3);
    expect(grupo.desde).toBe("2026-07-07T12:01:00Z"); // más antigua de la corrida
    expect(grupo.hasta).toBe("2026-07-07T12:03:00Z"); // más nueva de la corrida
  });
  test("dos sesiones separadas por una humana → dos grupos", () => {
    const versiones = [
      v("b2", "agente·b2", "2026-07-07T14:02:00Z"),
      v("b1", "agente·b1", "2026-07-07T14:01:00Z"),
      v("h", "Manual", "2026-07-07T13:00:00Z"),
      v("a2", "agente·a2", "2026-07-07T12:02:00Z"),
      v("a1", "agente·a1", "2026-07-07T12:01:00Z"),
    ];
    const out = agruparHistorialPorSesionAgente(versiones);
    expect(out.map((f) => f.tipo)).toEqual(["sesion-agente", "individual", "sesion-agente"]);
  });
  test("una sola versión de agente → sesion-agente de 1 (sigue siendo hito honesto)", () => {
    const out = agruparHistorialPorSesionAgente([v("a", "agente·x", "2026-07-07T12:00:00Z")]);
    expect(out).toHaveLength(1);
    expect(out[0].tipo).toBe("sesion-agente");
  });
});
