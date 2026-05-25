import { expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../operaciones";
import { detectarColisionNombre } from "./colisionNombre";

function modeloConSensor() {
  const m = crearModelo();
  const r = crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Sensor");
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

test("sin colisión → null", () => {
  expect(detectarColisionNombre(modeloConSensor(), "Bomba", "objeto")).toBeNull();
});

test("colisión mismo tipo → mismoTipo true + ubicaciones de la existente", () => {
  const col = detectarColisionNombre(modeloConSensor(), "Sensor", "objeto");
  expect(col?.mismoTipo).toBe(true);
  expect(col?.ubicaciones.length).toBeGreaterThan(0);
});

test("colisión tipo distinto → mismoTipo false", () => {
  const col = detectarColisionNombre(modeloConSensor(), "Sensor", "proceso");
  expect(col?.mismoTipo).toBe(false);
});

test("excluir entidad propia → no colisiona consigo misma", () => {
  const m = modeloConSensor();
  const sensor = Object.values(m.entidades)[0];
  if (!sensor) throw new Error("Modelo sin entidades");
  expect(detectarColisionNombre(m, "Sensor", "objeto", sensor.id)).toBeNull();
});
