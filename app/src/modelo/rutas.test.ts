import { describe, expect, test } from "bun:test";
import { extremoEstado } from "./extremos";
import { crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, estadosDeEntidad } from "./operaciones";
import { definirRutaEtiqueta, enlaceAdmiteRuta, rutaEtiquetaNormalizada } from "./rutas";
import type { Id, Modelo, Resultado } from "./tipos";

describe("rutas de enlace", () => {
  test("normaliza etiqueta con trim y elimina vacio", () => {
    expect(rutaEtiquetaNormalizada(" exitoso ")).toBe("exitoso");
    expect(rutaEtiquetaNormalizada("   ")).toBeUndefined();
    expect(rutaEtiquetaNormalizada(undefined)).toBeUndefined();
  });

  test("define y limpia ruta en enlace procedural con extremo Estado", () => {
    const { modelo: base, enlaceId } = modeloConResultadoAEstado();

    let resultado = definirRutaEtiqueta(base, enlaceId, " exitoso ");

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value.enlaces[enlaceId]?.rutaEtiqueta).toBe("exitoso");

    resultado = definirRutaEtiqueta(resultado.value, enlaceId, " ");
    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value.enlaces[enlaceId]?.rutaEtiqueta).toBeUndefined();
  });

  test("rechaza enlace inexistente y enlace sin extremo Estado", () => {
    const { modelo, enlaceId } = modeloConResultadoAEstado();
    expect(definirRutaEtiqueta(modelo, "missing", "x").ok).toBe(false);

    let sinEstado = crearModelo();
    sinEstado = must(crearProceso(sinEstado, sinEstado.opdRaizId, { x: 0, y: 0 }, "P"));
    sinEstado = must(crearObjeto(sinEstado, sinEstado.opdRaizId, { x: 220, y: 0 }, "O"));
    sinEstado = must(crearEnlace(sinEstado, sinEstado.opdRaizId, entidad(sinEstado, "P"), entidad(sinEstado, "O"), "resultado"));
    const normalId = Object.keys(sinEstado.enlaces)[0];
    if (!normalId) throw new Error("La prueba esperaba enlace");

    expect(enlaceAdmiteRuta(modelo, enlaceId)).toBe(true);
    expect(enlaceAdmiteRuta(sinEstado, normalId)).toBe(false);
    expect(definirRutaEtiqueta(sinEstado, normalId, "x").ok).toBe(false);
  });
});

function modeloConResultadoAEstado(): { modelo: Modelo; enlaceId: Id } {
  let modelo = crearModelo();
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Aprobar"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "Pedido"));
  const pedidoId = entidad(modelo, "Pedido");
  modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
  const [, aprobado] = estadosDeEntidad(modelo, pedidoId);
  if (!aprobado) throw new Error("La prueba esperaba estado");
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Aprobar"), extremoEstado(aprobado.id), "resultado"));
  const enlaceId = Object.keys(modelo.enlaces)[0];
  if (!enlaceId) throw new Error("La prueba esperaba enlace");
  return { modelo, enlaceId };
}

function entidad(modelo: Modelo, nombre: string): Id {
  const encontrada = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!encontrada) throw new Error(`Entidad no encontrada: ${nombre}`);
  return encontrada.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
