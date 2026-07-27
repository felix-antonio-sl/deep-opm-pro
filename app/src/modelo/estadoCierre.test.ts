import { describe, expect, test } from "bun:test";
import { clasificarEstadoCierre } from "./estadoCierre";

describe("estado de cierre derivado", () => {
  test("separa integridad, cierre formal, mejoras y Bocetos", () => {
    const estado = clasificarEstadoCierre([
      { origen: "visual", codigo: "visual-referencia-colgante", severidad: "error" },
      { origen: "validacion", codigo: "proceso-sin-entrada-ni-salida", severidad: "error" },
      { origen: "validacion", codigo: "efecto-direccion-canonica", severidad: "advertencia" },
      { origen: "validacion", codigo: "solo-estilo", severidad: "info" },
    ], 2);

    expect(estado).toEqual({
      bloqueosIntegridad: 1,
      bloqueosCierre: 1,
      mejoras: 1,
      bocetos: 2,
      pendientes: 5,
      listoFormalmente: false,
    });
  });

  test("solo declara listo cuando no queda ninguna condición pendiente", () => {
    expect(clasificarEstadoCierre([], 0)).toEqual({
      bloqueosIntegridad: 0,
      bloqueosCierre: 0,
      mejoras: 0,
      bocetos: 0,
      pendientes: 0,
      listoFormalmente: true,
    });
  });
});
