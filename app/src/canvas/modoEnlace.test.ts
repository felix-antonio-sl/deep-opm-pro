import { describe, expect, test } from "bun:test";
import { cambiarEsencia, crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import type { Id, Modelo, TipoEnlace } from "../modelo/tipos";
import {
  anchorConexionDesdeSelector,
  colorHaloPorTipo,
  entidadDestinoValida,
  evaluarDestinos,
  tipoInicialConexionDesdeEntidad,
} from "./modoEnlace";

describe("modo enlace canvas", () => {
  test("evaluarDestinos marca destino valido e invalido para consumo", () => {
    const { modelo, entrada, procesar, salida } = modeloBase();
    const destinos = evaluarDestinos(modelo, modelo.opdRaizId, entrada, "consumo");

    expect(destinos.find((d) => d.entidad.id === procesar)?.esValido).toBe(true);
    expect(destinos.find((d) => d.entidad.id === salida)?.esValido).toBe(false);
    expect(destinos.find((d) => d.entidad.id === entrada)?.esOrigen).toBe(true);
  });

  test("evaluarDestinos marca destino valido e invalido para resultado", () => {
    const { modelo, entrada, procesar, salida } = modeloBase();
    const destinos = evaluarDestinos(modelo, modelo.opdRaizId, procesar, "resultado");

    expect(destinos.find((d) => d.entidad.id === salida)?.esValido).toBe(true);
    expect(destinos.find((d) => d.entidad.id === entrada)?.esValido).toBe(true);
  });

  test("entidadDestinoValida usa validarFirmaEnlace como contrato", () => {
    const { modelo, entrada, procesar, salida } = modeloBase();

    expect(entidadDestinoValida(modelo, modelo.opdRaizId, entrada, procesar, "consumo")).toBe(true);
    expect(entidadDestinoValida(modelo, modelo.opdRaizId, salida, entrada, "consumo")).toBe(false);
  });

  test("cubre tipos canonicos con al menos un par valido", () => {
    const { modelo, entrada, procesar, salida, sistema, parte, atributo, subproceso } = modeloBase();
    const casos: Array<{ tipo: TipoEnlace; origen: Id; destino: Id }> = [
      { tipo: "agregacion", origen: sistema, destino: parte },
      { tipo: "exhibicion", origen: sistema, destino: atributo },
      { tipo: "generalizacion", origen: sistema, destino: parte },
      { tipo: "clasificacion", origen: sistema, destino: parte },
      { tipo: "agente", origen: sistema, destino: procesar },
      { tipo: "instrumento", origen: sistema, destino: procesar },
      { tipo: "consumo", origen: entrada, destino: procesar },
      { tipo: "resultado", origen: procesar, destino: salida },
      { tipo: "efecto", origen: procesar, destino: salida },
      { tipo: "invocacion", origen: procesar, destino: subproceso },
      { tipo: "excepcionSobretiempo", origen: procesar, destino: subproceso },
      { tipo: "excepcionSubtiempo", origen: procesar, destino: subproceso },
      { tipo: "excepcionSubSobretiempo", origen: procesar, destino: subproceso },
    ];

    for (const caso of casos) {
      expect(entidadDestinoValida(modelo, modelo.opdRaizId, caso.origen, caso.destino, caso.tipo)).toBe(true);
    }
  });

  test("colorHaloPorTipo retorna colores de la paleta canonica", () => {
    expect(colorHaloPorTipo("agregacion")).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(colorHaloPorTipo("resultado")).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(colorHaloPorTipo("agente")).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(colorHaloPorTipo("excepcionSobretiempo")).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  test("anchorConexionDesdeSelector normaliza los 8 anchors de reloj", () => {
    expect(anchorConexionDesdeSelector("connect-anchor-n")).toBe("N");
    expect(anchorConexionDesdeSelector("connect-anchor-ne")).toBe("NE");
    expect(anchorConexionDesdeSelector("connect-anchor-E")).toBe("E");
    expect(anchorConexionDesdeSelector("connect-anchor-se")).toBe("SE");
    expect(anchorConexionDesdeSelector("connect-anchor-s")).toBe("S");
    expect(anchorConexionDesdeSelector("connect-anchor-so")).toBe("SO");
    expect(anchorConexionDesdeSelector("connect-anchor-o")).toBe("O");
    expect(anchorConexionDesdeSelector("connect-anchor-no")).toBe("NO");
    expect(anchorConexionDesdeSelector("resize-n")).toBeNull();
  });

  test("tipoInicialConexionDesdeEntidad elige feedback semantico para drag-from-anchor", () => {
    const { modelo, entrada, procesar } = modeloBase();

    expect(tipoInicialConexionDesdeEntidad(modelo, modelo.opdRaizId, entrada)).toBe("consumo");
    expect(tipoInicialConexionDesdeEntidad(modelo, modelo.opdRaizId, procesar)).toBe("resultado");
  });
});

function modeloBase(): {
  modelo: Modelo;
  entrada: Id;
  procesar: Id;
  salida: Id;
  sistema: Id;
  parte: Id;
  atributo: Id;
  subproceso: Id;
} {
  let modelo = crearModelo("Modo enlace");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Entrada"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 440, y: 80 }, "Salida"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 220 }, "Sistema"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 220 }, "Parte"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 440, y: 220 }, "Atributo"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 620, y: 80 }, "Subproceso"));
  const entrada = entidadPorNombre(modelo, "Entrada");
  const procesar = entidadPorNombre(modelo, "Procesar");
  const salida = entidadPorNombre(modelo, "Salida");
  const sistema = entidadPorNombre(modelo, "Sistema");
  const parte = entidadPorNombre(modelo, "Parte");
  const atributo = entidadPorNombre(modelo, "Atributo");
  const subproceso = entidadPorNombre(modelo, "Subproceso");
  modelo = must(cambiarEsencia(modelo, sistema, "fisica"));
  return { modelo, entrada, procesar, salida, sistema, parte, atributo, subproceso };
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
