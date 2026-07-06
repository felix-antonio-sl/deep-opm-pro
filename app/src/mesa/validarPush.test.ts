import { describe, expect, test } from "bun:test";
import { evaluarPush } from "./validarPush";
import { exportarModelo } from "../serializacion/json";
import { crearModelo } from "../modelo/operaciones";
import type { Modelo } from "../modelo/tipos";

const bundleValido = exportarModelo(crearModelo("X"));
const bundleInvalido = '{"esto":"no es un modelo"}';

function modeloSellado(): Modelo {
  return {
    ...crearModelo("Sellado"),
    procedencia: { protoHash: "abc123", autoriaVersion: "1", layoutVersion: "2" },
  };
}
// El sello vive en `Modelo.procedencia` (anidado bajo `.modelo` en el
// documento serializado por `exportarModelo`, NO en la raíz del documento) —
// solo el compilador de autoría lo emite.
const bundleSellado = exportarModelo(modeloSellado());

describe("evaluarPush", () => {
  test("bundle inválido → rechaza sin permitir escritura", () => {
    const v = evaluarPush({
      bundleJson: bundleInvalido,
      destino: { tieneSello: false, especie: "modelo" },
      baseFueAutosave: false,
      confirmadoPorOperador: false,
    });
    expect(v.ok).toBe(false);
  });

  test("modelo con sello + bundle artesanal (sin sello) → rechaza (carril procedencia)", () => {
    const v = evaluarPush({
      bundleJson: bundleValido,
      destino: { tieneSello: true, especie: "modelo" },
      baseFueAutosave: false,
      confirmadoPorOperador: false,
    });
    expect(v).toMatchObject({ ok: false });
    if (!v.ok) expect(v.motivo).toContain("proto");
  });

  test("modelo con sello + bundle SELLADO (del compilador) → pasa (el carril respeta el compilador)", () => {
    const v = evaluarPush({
      bundleJson: bundleSellado,
      destino: { tieneSello: true, especie: "modelo" },
      baseFueAutosave: false,
      confirmadoPorOperador: false,
    });
    expect(v.ok).toBe(true);
  });

  test("modelo sin sello + bundle artesanal → pasa (push libre mesa-nacido)", () => {
    const v = evaluarPush({
      bundleJson: bundleValido,
      destino: { tieneSello: false, especie: "modelo" },
      baseFueAutosave: false,
      confirmadoPorOperador: false,
    });
    expect(v.ok).toBe(true);
  });

  test("base fue autosave + sin confirmación → rechaza (base no ratificada)", () => {
    const v = evaluarPush({
      bundleJson: bundleValido,
      destino: { tieneSello: false, especie: "modelo" },
      baseFueAutosave: true,
      confirmadoPorOperador: false,
    });
    expect(v).toMatchObject({ ok: false });
    if (!v.ok) expect(v.motivo).toContain("ratific");
  });

  test("base fue autosave + confirmada → pasa", () => {
    const v = evaluarPush({
      bundleJson: bundleValido,
      destino: { tieneSello: false, especie: "modelo" },
      baseFueAutosave: true,
      confirmadoPorOperador: true,
    });
    expect(v.ok).toBe(true);
  });

  test("destino biblioteca → rechaza (solo-lectura)", () => {
    const v = evaluarPush({
      bundleJson: bundleValido,
      destino: { tieneSello: false, especie: "biblioteca" },
      baseFueAutosave: false,
      confirmadoPorOperador: false,
    });
    expect(v).toMatchObject({ ok: false });
  });

  test("crear (sin destino) exige especie explícita", () => {
    const sin = evaluarPush({ bundleJson: bundleValido, baseFueAutosave: false, confirmadoPorOperador: false });
    expect(sin.ok).toBe(false);
    const con = evaluarPush({
      bundleJson: bundleValido,
      baseFueAutosave: false,
      confirmadoPorOperador: false,
      especieAlCrear: "apunte",
    });
    expect(con).toMatchObject({ ok: true, especieDestino: "apunte" });
  });

  test("bundleTieneSello no lanza con JSON malformado (defensivo)", () => {
    const v = evaluarPush({
      bundleJson: "{esto no es json valido",
      destino: { tieneSello: true, especie: "modelo" },
      baseFueAutosave: false,
      confirmadoPorOperador: false,
    });
    expect(v.ok).toBe(false);
  });
});
