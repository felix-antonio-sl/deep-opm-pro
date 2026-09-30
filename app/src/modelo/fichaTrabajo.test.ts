import { describe, expect, test } from "bun:test";
import { actualizarModalidadDocumento } from "./fichaTrabajo";
import { crearModelo } from "./operaciones/creacion";

describe("modalidad en la ficha de trabajo", () => {
  test("guarda la modalidad anterior junto a su contexto al cambiarla", () => {
    const model = {
      ...crearModelo("Cambio de contexto"),
      fichaTrabajo: {
        modalidad: "existente" as const,
        preguntaHabilitante: "¿Qué ocurre hoy?",
        criterioSuficiencia: "Cubrir el flujo actual",
      },
    };

    const result = actualizarModalidadDocumento(model, "propuesto", "Se decidió diseñar un estado objetivo");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.fichaTrabajo?.modalidad).toBe("propuesto");
    expect(result.value.fichaTrabajo?.historialModalidad).toEqual([{
      modalidad: "existente",
      contexto: {
        preguntaHabilitante: "¿Qué ocurre hoy?",
        criterioSuficiencia: "Cubrir el flujo actual",
        motivoCambio: "Se decidió diseñar un estado objetivo",
      },
    }]);
  });

  test("no crea una ficha local paralela a un documento upstream", () => {
    const model = {
      ...crearModelo("Fuente"),
      procedencia: { protoHash: "hash", autoriaVersion: "1", layoutVersion: "1" },
    };

    const result = actualizarModalidadDocumento(model, "exploratorio");

    expect(result).toEqual({ ok: false, error: "La modalidad pertenece a la fuente upstream; re-elicita allí el cambio." });
  });
});
