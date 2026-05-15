import { describe, expect, test } from "bun:test";
import {
  ETAPA_BENEFICIARIO,
  ETAPA_BIENVENIDA,
  ETAPA_CONFIRMAR,
  ETAPA_FUNCION,
} from "../../modelo/creacionWizard";
import { debeMostrarAtrasWizard } from "./Asistente";

describe("AsistenteNuevoModelo DE-WIZ", () => {
  test("muestra Atrás solo después de la bienvenida", () => {
    expect(debeMostrarAtrasWizard(ETAPA_BIENVENIDA)).toBe(false);
    expect(debeMostrarAtrasWizard(ETAPA_FUNCION)).toBe(true);
    expect(debeMostrarAtrasWizard(ETAPA_BENEFICIARIO)).toBe(true);
    expect(debeMostrarAtrasWizard(ETAPA_CONFIRMAR)).toBe(true);
  });
});
