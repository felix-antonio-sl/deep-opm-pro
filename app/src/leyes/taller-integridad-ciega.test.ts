import { describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones/creacion";
import { crearOpdSuelto } from "../modelo/operaciones/opdSuelto";
import { validarApariencias } from "../serializacion/validarApariencias";

/**
 * LEY: la integridad estructural NUNCA degrada por el hecho de que un OPD sea
 * suelto (R-OPD-REF-20). El rechazo de una `entidadId` colgante lo hace
 * `validarApariencias` (`validarApariencias.ts:36`), ciego a la especie del
 * modelo y a la banda del OPD (suelto vs raíz).
 */
describe("LEY: integridad NUNCA degrada por suelto (R-OPD-REF-20)", () => {
  test("una apariencia colgante en un OPD suelto se rechaza igual que en la raíz", () => {
    const { modelo, opdId } = crearOpdSuelto(crearModelo("M"));
    // Apariencia con entidadId inexistente; se inyecta tanto en el suelto como
    // en la raíz para falsar que el rechazo es idéntico (no hay caso especial).
    const colganteEn = (targetOpdId: string): Record<string, unknown> => ({
      "a-x": { id: "a-x", entidadId: "no-existe", opdId: targetOpdId, x: 0, y: 0, width: 10, height: 10 },
    });
    expect(validarApariencias(opdId, colganteEn(opdId), modelo.entidades).ok).toBe(false);
    expect(validarApariencias(modelo.opdRaizId, colganteEn(modelo.opdRaizId), modelo.entidades).ok).toBe(false);
  });
});
