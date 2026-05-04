import { describe, expect, test } from "bun:test";
import {
  actualizarVerticesEnlace,
  cambiarAfiliacion,
  cambiarEsencia,
  crearEnlace,
  crearModelo,
  crearObjeto,
  crearProceso,
  eliminarEntidad,
  eliminarEnlace,
  entidadesDelOpd,
  moverApariencia,
  moverAparienciaPorId,
  renombrarEntidad,
} from "./operaciones";
import type { Modelo, Resultado, TipoEnlace } from "./tipos";

describe("operaciones de modelo", () => {
  test("crea entidad logica y apariencia separadas", () => {
    const modelo = crearModelo();
    const creado = crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Sistema");

    expect(creado.ok).toBe(true);
    if (!creado.ok) return;

    expect(Object.values(creado.value.entidades)).toHaveLength(1);
    expect(creado.value.opds[modelo.opdRaizId]?.padreId).toBeNull();
    expect(Object.values(creado.value.opds[modelo.opdRaizId]?.apariencias ?? {})).toHaveLength(1);
    expect(entidadesDelOpd(creado.value, modelo.opdRaizId)[0]?.nombre).toBe("Sistema");
  });

  test("valida firma de agente como objeto fisico a proceso", () => {
    let modelo = crearModelo();
    const objeto = crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Operador");
    expect(objeto.ok).toBe(true);
    if (!objeto.ok) return;
    modelo = objeto.value;

    const proceso = crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Rescatar");
    expect(proceso.ok).toBe(true);
    if (!proceso.ok) return;
    modelo = proceso.value;

    const operador = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Operador");
    const rescatar = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Rescatar");
    expect(operador).toBeDefined();
    expect(rescatar).toBeDefined();
    if (!operador || !rescatar) return;

    const invalido = crearEnlace(modelo, modelo.opdRaizId, operador.id, rescatar.id, "agente");
    expect(invalido.ok).toBe(false);

    const fisico = cambiarEsencia(modelo, operador.id, "fisica");
    expect(fisico.ok).toBe(true);
    if (!fisico.ok) return;

    const valido = crearEnlace(fisico.value, fisico.value.opdRaizId, operador.id, rescatar.id, "agente");
    expect(valido.ok).toBe(true);
  });

  test("acepta firmas basicas de Sprint 0 y rechaza self-link", () => {
    let modelo = modeloConEntidades();
    const agente = entidadPorNombre(modelo, "Agente");
    const fisico = cambiarEsencia(modelo, agente.id, "fisica");
    expect(fisico.ok).toBe(true);
    if (!fisico.ok) return;
    modelo = fisico.value;

    const casos: Array<[TipoEnlace, string, string]> = [
      ["agregacion", "Whole", "Part"],
      ["instrumento", "Instrumento", "Proceso"],
      ["agente", "Agente", "Proceso"],
      ["consumo", "Part", "Proceso"],
      ["resultado", "Proceso", "Part"],
      ["efecto", "Part", "Proceso"],
      ["invocacion", "Proceso", "Subproceso"],
    ];

    for (const [tipo, origenNombre, destinoNombre] of casos) {
      const origen = entidadPorNombre(modelo, origenNombre);
      const destino = entidadPorNombre(modelo, destinoNombre);
      const creado = crearEnlace(modelo, modelo.opdRaizId, origen.id, destino.id, tipo);
      expect(creado.ok).toBe(true);
      if (creado.ok) modelo = creado.value;
    }

    const whole = entidadPorNombre(modelo, "Whole");
    const self = crearEnlace(modelo, modelo.opdRaizId, whole.id, whole.id, "agregacion");
    expect(self.ok).toBe(false);
  });

  test("renombra entidad con nombre no vacio", () => {
    const creado = crearObjeto(crearModelo(), "opd-1", { x: 0, y: 0 });
    expect(creado.ok).toBe(true);
    if (!creado.ok) return;
    const entidad = Object.values(creado.value.entidades)[0];
    expect(entidad).toBeDefined();
    if (!entidad) return;

    const renombrado = renombrarEntidad(creado.value, entidad.id, "  OnStar System  ");
    expect(renombrado.ok).toBe(true);
    if (!renombrado.ok) return;
    expect(renombrado.value.entidades[entidad.id]?.nombre).toBe("OnStar System");
  });

  test("cambia esencia y afiliacion de una entidad", () => {
    const creado = crearObjeto(crearModelo(), "opd-1", { x: 0, y: 0 }, "Objeto Ambiental");
    expect(creado.ok).toBe(true);
    if (!creado.ok) return;
    const entidad = Object.values(creado.value.entidades)[0];
    expect(entidad).toBeDefined();
    if (!entidad) return;

    const fisica = cambiarEsencia(creado.value, entidad.id, "fisica");
    expect(fisica.ok).toBe(true);
    if (!fisica.ok) return;

    const ambiental = cambiarAfiliacion(fisica.value, entidad.id, "ambiental");
    expect(ambiental.ok).toBe(true);
    if (!ambiental.ok) return;

    expect(ambiental.value.entidades[entidad.id]?.esencia).toBe("fisica");
    expect(ambiental.value.entidades[entidad.id]?.afiliacion).toBe("ambiental");
  });

  test("mueve apariencia sin cambiar identidad logica", () => {
    const creado = crearObjeto(crearModelo(), "opd-1", { x: 0, y: 0 }, "Movible");
    expect(creado.ok).toBe(true);
    if (!creado.ok) return;
    const entidad = Object.values(creado.value.entidades)[0];
    expect(entidad).toBeDefined();
    if (!entidad) return;

    const movido = moverApariencia(creado.value, creado.value.opdRaizId, entidad.id, { x: 120, y: 80 });
    expect(movido.ok).toBe(true);
    if (!movido.ok) return;

    const apariencia = Object.values(movido.value.opds[movido.value.opdRaizId]?.apariencias ?? {})[0];
    expect(apariencia?.entidadId).toBe(entidad.id);
    expect(apariencia?.x).toBe(120);
    expect(apariencia?.y).toBe(80);
  });

  test("mueve apariencia por id visual para adapters de render", () => {
    const creado = crearObjeto(crearModelo(), "opd-1", { x: 0, y: 0 }, "Movible");
    expect(creado.ok).toBe(true);
    if (!creado.ok) return;

    const apariencia = Object.values(creado.value.opds[creado.value.opdRaizId]?.apariencias ?? {})[0];
    expect(apariencia).toBeDefined();
    if (!apariencia) return;

    const movido = moverAparienciaPorId(creado.value, creado.value.opdRaizId, apariencia.id, { x: 44, y: 55 });
    expect(movido.ok).toBe(true);
    if (!movido.ok) return;

    expect(movido.value.opds[movido.value.opdRaizId]?.apariencias[apariencia.id]?.x).toBe(44);
    expect(movido.value.opds[movido.value.opdRaizId]?.apariencias[apariencia.id]?.y).toBe(55);
  });

  test("actualiza vertices de apariencia de enlace", () => {
    let modelo = modeloConEntidades();
    const whole = entidadPorNombre(modelo, "Whole");
    const part = entidadPorNombre(modelo, "Part");
    const enlace = crearEnlace(modelo, modelo.opdRaizId, whole.id, part.id, "agregacion");
    expect(enlace.ok).toBe(true);
    if (!enlace.ok) return;
    modelo = enlace.value;

    const aparienciaEnlace = Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0];
    expect(aparienciaEnlace).toBeDefined();
    if (!aparienciaEnlace) return;

    const actualizado = actualizarVerticesEnlace(modelo, modelo.opdRaizId, aparienciaEnlace.id, [
      { x: 100, y: 20 },
      { x: 140, y: 80 },
    ]);
    expect(actualizado.ok).toBe(true);
    if (!actualizado.ok) return;

    expect(actualizado.value.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlace.id]?.vertices).toEqual([
      { x: 100, y: 20 },
      { x: 140, y: 80 },
    ]);
  });

  test("elimina entidad y cascada de enlaces asociados", () => {
    let modelo = modeloConEntidades();
    const whole = entidadPorNombre(modelo, "Whole");
    const part = entidadPorNombre(modelo, "Part");
    const enlace = crearEnlace(modelo, modelo.opdRaizId, whole.id, part.id, "agregacion");
    expect(enlace.ok).toBe(true);
    if (!enlace.ok) return;
    modelo = enlace.value;

    const eliminado = eliminarEntidad(modelo, part.id);
    expect(eliminado.ok).toBe(true);
    if (!eliminado.ok) return;

    expect(eliminado.value.entidades[part.id]).toBeUndefined();
    expect(Object.values(eliminado.value.enlaces)).toHaveLength(0);
    expect(Object.values(eliminado.value.opds[modelo.opdRaizId]?.enlaces ?? {})).toHaveLength(0);
  });

  test("elimina enlace sin borrar entidades", () => {
    let modelo = modeloConEntidades();
    const whole = entidadPorNombre(modelo, "Whole");
    const part = entidadPorNombre(modelo, "Part");
    const enlace = crearEnlace(modelo, modelo.opdRaizId, whole.id, part.id, "agregacion");
    expect(enlace.ok).toBe(true);
    if (!enlace.ok) return;
    modelo = enlace.value;

    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    expect(enlaceId).toBeDefined();
    if (!enlaceId) return;

    const eliminado = eliminarEnlace(modelo, enlaceId);
    expect(eliminado.ok).toBe(true);
    if (!eliminado.ok) return;

    expect(Object.values(eliminado.value.enlaces)).toHaveLength(0);
    expect(Object.values(eliminado.value.entidades)).toHaveLength(Object.values(modelo.entidades).length);
    expect(Object.values(eliminado.value.opds[modelo.opdRaizId]?.enlaces ?? {})).toHaveLength(0);
  });

  test("rechaza enlaces cuando un extremo no tiene apariencia en el OPD", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Objeto"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Proceso"));
    const objeto = entidadPorNombre(modelo, "Objeto");
    const proceso = entidadPorNombre(modelo, "Proceso");
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        "opd-2": {
          id: "opd-2",
          nombre: "SD1",
          padreId: modelo.opdRaizId,
          apariencias: {
            "a-local": {
              id: "a-local",
              entidadId: objeto.id,
              opdId: "opd-2",
              x: 0,
              y: 0,
              width: 135,
              height: 60,
            },
          },
          enlaces: {},
        },
      },
    };

    const enlace = crearEnlace(modelo, "opd-2", objeto.id, proceso.id, "instrumento");

    expect(enlace.ok).toBe(false);
    if (enlace.ok) return;
    expect(enlace.error).toContain("apariencia en el OPD");
  });
});

function modeloConEntidades(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Whole"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 180, y: 0 }, "Part"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 120 }, "Instrumento"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 240 }, "Agente"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 240, y: 120 }, "Proceso"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 420, y: 120 }, "Subproceso"));
  return modelo;
}

function entidadPorNombre(modelo: Modelo, nombre: string) {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  expect(entidad).toBeDefined();
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
