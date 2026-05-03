import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import { exportarModelo, hidratarModelo } from "./json";

describe("serializacion JSON", () => {
  test("hace round-trip del modelo minimo", () => {
    const creado = crearObjeto(crearModelo("Prueba"), "opd-1", { x: 10, y: 20 }, "Sistema");
    expect(creado.ok).toBe(true);
    if (!creado.ok) return;

    const json = exportarModelo(creado.value);
    const hidratado = hidratarModelo(json);

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.nombre).toBe("Prueba");
    expect(Object.values(hidratado.value.entidades)[0]?.nombre).toBe("Sistema");
  });
});
