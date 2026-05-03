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

  test("normaliza padreId faltante en documentos anteriores", () => {
    const modelo = crearModelo("Legacy");
    const json = JSON.stringify({
      formato: "deep-opm-pro.modelo.v0",
      modelo: {
        ...modelo,
        opds: {
          [modelo.opdRaizId]: {
            id: modelo.opdRaizId,
            nombre: "SD",
            apariencias: {},
            enlaces: {},
          },
          "opd-2": {
            id: "opd-2",
            nombre: "SD1",
            apariencias: {},
            enlaces: {},
          },
        },
      },
    });

    const hidratado = hidratarModelo(json);

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.opds[modelo.opdRaizId]?.padreId).toBeNull();
    expect(hidratado.value.opds["opd-2"]?.padreId).toBe(modelo.opdRaizId);
  });
});
