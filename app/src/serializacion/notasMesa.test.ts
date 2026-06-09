import { describe, expect, test } from "bun:test";
import { agregarNotaMesa } from "../modelo/notasMesa";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import type { Modelo, Resultado } from "../modelo/tipos";
import { exportarModelo, hidratarModelo } from "./json";

// W6.5-a: round-trip de notasMesa (extensión aditiva — ausente ⇒ byte-identidad
// de modelos sin notas; presente ⇒ sobrevive exportar→hidratar campo a campo).

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function modeloConNota(): Modelo {
  let modelo = crearModelo("Notas");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Paciente"));
  const objetoId = Object.values(modelo.entidades)[0]!.id;
  modelo = must(agregarNotaMesa(modelo, { tipo: "entidad", id: objetoId }, "¿dividir en dos?", "2026-06-10"));
  return must(agregarNotaMesa(modelo, { tipo: "modelo" }, "revisar frontera", "2026-06-10"));
}

describe("serialización notasMesa — W6.5-a", () => {
  test("round-trip preserva las notas campo a campo", () => {
    const original = modeloConNota();
    const hidratado = must(hidratarModelo(exportarModelo(original)));
    expect(hidratado.notasMesa).toEqual(original.notasMesa);
  });

  test("modelo sin notas no gana la clave al exportar (aditivo, byte-identidad)", () => {
    const json = exportarModelo(crearModelo("Limpio"));
    expect(json).not.toContain("notasMesa");
    const hidratado = must(hidratarModelo(json));
    expect(hidratado.notasMesa).toBeUndefined();
  });

  test("nota con shape inválido rechaza ruidoso al hidratar", () => {
    const json = exportarModelo(modeloConNota());
    const roto = json.replace('"¿dividir en dos?"', "42");
    const resultado = hidratarModelo(roto);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toContain("ota");
  });
});
