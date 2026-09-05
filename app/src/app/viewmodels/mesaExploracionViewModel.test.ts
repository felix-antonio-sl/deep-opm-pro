import { describe, expect, test } from "bun:test";
import {
  agregarFuenteExploracion,
  agregarTrazoExploracion,
  crearPropuestaExploracion,
} from "../../modelo/mesaExploracion";
import { crearModelo, definirOntologiaOrganizacional } from "../../modelo/operaciones";
import type { Resultado } from "../../modelo/tipos";
import { derivarPreviewMesaExploracion } from "./mesaExploracionViewModel";

const AHORA = "2026-08-31T12:00:00.000Z";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

describe("Mesa de exploración · viewmodel", () => {
  test("expone el nombre efectivo reforzado por ontología en forma, copy y OPL", () => {
    let modelo = crearModelo("Preview con ontología");
    modelo = must(definirOntologiaOrganizacional(modelo, {
      modo: "enforce",
      terminos: [{ canonico: "Paciente", sinonimos: ["Usuario"] }],
    }));
    const fuente = must(agregarFuenteExploracion(
      modelo,
      { contenido: "Existe un usuario que solicita atención" },
      AHORA,
    ));
    const trazo = must(agregarTrazoExploracion(
      fuente.modelo,
      { fuenteIds: [fuente.fuenteId], texto: "un usuario" },
      AHORA,
    ));
    const propuesta = must(crearPropuestaExploracion(
      trazo.modelo,
      {
        trazoIds: [trazo.trazoId],
        operacion: {
          tipo: "crear-entidad",
          entidadTipo: "objeto",
          nombre: "Usuario",
          opdId: trazo.modelo.opdRaizId,
        },
      },
      AHORA,
    ));

    const preview = derivarPreviewMesaExploracion(
      propuesta.modelo,
      propuesta.propuestaId,
      true,
    );

    expect(preview).toMatchObject({ error: null, tipo: "objeto", nombre: "Paciente" });
    expect(preview?.lineas.join("\n")).toContain("Paciente");
    expect(preview?.lineas.join("\n")).not.toContain("Usuario");
  });
});
