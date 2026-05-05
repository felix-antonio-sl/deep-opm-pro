import { describe, expect, test } from "bun:test";
import type { Entidad, Estado } from "../../modelo/tipos";
import { oracionDesignacionEstado, oracionEstados, textoDesignacionEstado } from "./designaciones";

describe("designaciones OPL", () => {
  const entidad: Entidad = { id: "e1", tipo: "objeto", nombre: "Pedido", esencia: "informacional", afiliacion: "sistemica" };

  test("oracionEstados enumera estados con disyuncion", () => {
    const estados: Estado[] = [
      { id: "s1", entidadId: "e1", nombre: "pendiente", designaciones: ["inicial"] },
      { id: "s2", entidadId: "e1", nombre: "cerrado", designaciones: ["final"] },
    ];
    expect(oracionEstados(entidad, estados)).toBe("**Pedido** puede ser `pendiente` (inicial) o `cerrado` (final).");
  });

  test("textoDesignacionEstado conserva default y current en ingles operativo", () => {
    expect(textoDesignacionEstado("default")).toBe("Default");
    expect(textoDesignacionEstado("current")).toBe("Current");
  });

  test("oracionDesignacionEstado usa nombre OPL de entidad", () => {
    const estado: Estado = { id: "s1", entidadId: "e1", nombre: "pendiente" };
    expect(oracionDesignacionEstado(estado, entidad, "inicial")).toBe("**Pedido** en `pendiente` es inicial.");
  });
});
