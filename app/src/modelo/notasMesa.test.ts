import { describe, expect, test } from "bun:test";
import { agregarNotaMesa, editarNotaMesa, eliminarNotaMesa, enumerarNotasMesa, notasDeTarget } from "./notasMesa";
import { crearModelo, crearObjeto } from "./operaciones";
import type { Modelo, Resultado } from "./tipos";

// W6.5-a: NotaMesa = comentario de revisión anclado a un componente (entidad/
// enlace/opd/modelo). Es META de la mesa, no modelo OPM: no emite OPL, no cuenta
// como cosa, no altera validarModelo (mismo estatuto que AnclaNormativa, V-204).
// Viaja en el contexto W6.0 como insumo de re-elicitación y se resuelve
// corrigiendo el proto — por eso es desechable, no definición.

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

const FECHA = "2026-06-10";

function modeloConObjeto(): { modelo: Modelo; objetoId: string } {
  const modelo = must(crearObjeto(crearModelo("Mesa"), crearModelo("Mesa").opdRaizId, { x: 40, y: 40 }, "Paciente"));
  const objetoId = Object.values(modelo.entidades).find((e) => e.nombre === "Paciente")!.id;
  return { modelo, objetoId };
}

describe("notasMesa — kernel W6.5-a", () => {
  test("agregar una nota a una entidad la deja enumerable con target, texto y fecha", () => {
    const { modelo, objetoId } = modeloConObjeto();
    const conNota = must(agregarNotaMesa(modelo, { tipo: "entidad", id: objetoId }, "¿Son dos procesos?", FECHA));

    const notas = enumerarNotasMesa(conNota);
    expect(notas).toHaveLength(1);
    expect(notas[0]?.texto).toBe("¿Son dos procesos?");
    expect(notas[0]?.fecha).toBe(FECHA);
    expect(notas[0]?.target).toEqual({ tipo: "entidad", id: objetoId });
  });

  test("agregar nota a nivel de modelo no exige id de target", () => {
    const { modelo } = modeloConObjeto();
    const conNota = must(agregarNotaMesa(modelo, { tipo: "modelo" }, "Revisar frontera del sistema", FECHA));
    expect(notasDeTarget(conNota, { tipo: "modelo" })).toHaveLength(1);
  });

  test("rechaza texto vacío y target inexistente", () => {
    const { modelo } = modeloConObjeto();
    expect(agregarNotaMesa(modelo, { tipo: "modelo" }, "   ", FECHA).ok).toBe(false);
    expect(agregarNotaMesa(modelo, { tipo: "entidad", id: "no-existe" }, "x", FECHA).ok).toBe(false);
  });

  test("editar reemplaza el texto preservando id/target; eliminar la quita", () => {
    const { modelo, objetoId } = modeloConObjeto();
    let m = must(agregarNotaMesa(modelo, { tipo: "entidad", id: objetoId }, "borrador", FECHA));
    const nota = enumerarNotasMesa(m)[0]!;

    m = must(editarNotaMesa(m, nota.id, "texto final"));
    expect(enumerarNotasMesa(m)[0]?.texto).toBe("texto final");
    expect(enumerarNotasMesa(m)[0]?.id).toBe(nota.id);

    m = must(eliminarNotaMesa(m, nota.id));
    expect(enumerarNotasMesa(m)).toHaveLength(0);
  });

  test("editar/eliminar nota inexistente falla ruidoso", () => {
    const { modelo } = modeloConObjeto();
    expect(editarNotaMesa(modelo, "nm-fantasma", "x").ok).toBe(false);
    expect(eliminarNotaMesa(modelo, "nm-fantasma").ok).toBe(false);
  });

  test("notasDeTarget filtra por tipo+id sin mezclar targets", () => {
    const { modelo, objetoId } = modeloConObjeto();
    let m = must(agregarNotaMesa(modelo, { tipo: "entidad", id: objetoId }, "sobre la entidad", FECHA));
    m = must(agregarNotaMesa(m, { tipo: "modelo" }, "sobre el modelo", FECHA));
    m = must(agregarNotaMesa(m, { tipo: "opd", id: m.opdRaizId }, "sobre el OPD", FECHA));

    expect(notasDeTarget(m, { tipo: "entidad", id: objetoId })).toHaveLength(1);
    expect(notasDeTarget(m, { tipo: "modelo" })).toHaveLength(1);
    expect(notasDeTarget(m, { tipo: "opd", id: m.opdRaizId })).toHaveLength(1);
    expect(enumerarNotasMesa(m)).toHaveLength(3);
  });

  test("las notas NO alteran el OPL ni el conteo de cosas (estatuto meta)", async () => {
    const { modelo, objetoId } = modeloConObjeto();
    const { generarOpl } = await import("../opl/generar");
    const oplAntes = generarOpl(modelo, modelo.opdRaizId);
    const conNota = must(agregarNotaMesa(modelo, { tipo: "entidad", id: objetoId }, "nota", FECHA));
    expect(generarOpl(conNota, conNota.opdRaizId)).toEqual(oplAntes);
    expect(Object.keys(conNota.entidades)).toEqual(Object.keys(modelo.entidades));
  });
});
