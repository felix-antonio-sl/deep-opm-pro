import { describe, expect, test } from "bun:test";
import {
  ETAPA_BENEFICIARIO,
  ETAPA_FUNCION,
  ETAPA_SEMBRAR,
  TOTAL_ETAPAS,
} from "../../modelo/creacionWizard";
import { debeMostrarAtrasWizard } from "./Asistente";

/**
 * Ronda 23 L3 #6: tras la poda 9→3 ya no hay etapa de bienvenida, así que el
 * botón "Atrás" se muestra desde la segunda etapa en adelante (beneficiario y
 * sembrar). En la primera (función) no hay nada hacia atrás.
 */
describe("AsistenteNuevoModelo DE-WIZ", () => {
  test("muestra Atrás solo después de la primera etapa", () => {
    expect(debeMostrarAtrasWizard(ETAPA_FUNCION)).toBe(false);
    expect(debeMostrarAtrasWizard(ETAPA_BENEFICIARIO)).toBe(true);
    expect(debeMostrarAtrasWizard(ETAPA_SEMBRAR)).toBe(true);
  });

  test("conserva el total canónico de 3 etapas", () => {
    expect(TOTAL_ETAPAS).toBe(3);
  });
});
