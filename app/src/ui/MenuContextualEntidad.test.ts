import { describe, expect, test } from "bun:test";
import type { AccionContextual } from "../store/acciones-contextuales";
import { grupoAccionMenuEntidad, ordenarAccionesMenuEntidad } from "./MenuContextualEntidad";

function accion(id: AccionContextual["id"], categoria: AccionContextual["categoria"] = "edicion"): AccionContextual {
  return {
    id,
    label: id,
    testId: id,
    categoria,
    visible: true,
    enabled: true,
    superficies: ["menu-contextual"],
  };
}

describe("MenuContextualEntidad", () => {
  test("ordena las acciones con refinamiento primero y destructivas al final", () => {
    const acciones = ordenarAccionesMenuEntidad([
      accion("ocultar-apariencia", "peligro"),
      accion("copiar-estilo", "apariencia"),
      accion("inzoom", "refinamiento"),
      accion("editar-alias", "edicion"),
      accion("unfold", "refinamiento"),
      accion("traer-conectados", "enlaces"),
    ]);

    expect(acciones.map((item) => item.id)).toEqual([
      "inzoom",
      "unfold",
      "editar-alias",
      "copiar-estilo",
      "traer-conectados",
      "ocultar-apariencia",
    ]);
  });

  test("agrupa acciones para separadores visuales del menu vertical", () => {
    expect(grupoAccionMenuEntidad("inzoom")).toBe("refinamiento");
    expect(grupoAccionMenuEntidad("agregar-estado")).toBe("edicion");
    expect(grupoAccionMenuEntidad("copiar-estilo")).toBe("apariencia");
    expect(grupoAccionMenuEntidad("traer-conectados")).toBe("enlaces");
    expect(grupoAccionMenuEntidad("ocultar-apariencia")).toBe("peligro");
  });
});
