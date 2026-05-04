import { describe, expect, test } from "bun:test";
import {
  actualizarVerticesEnlace,
  cambiarAfiliacion,
  cambiarEsencia,
  crearEnlace,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
  desplegarObjeto,
  eliminarEntidad,
  eliminarEnlace,
  entidadesDelOpd,
  moverApariencia,
  moverAparienciaPorId,
  quitarDescomposicionProceso,
  quitarDespliegueObjeto,
  renombrarEntidad,
  validarFirmaEnlace,
} from "./operaciones";
import type { Modelo, ModoDespliegueObjeto, Resultado, TipoEnlace } from "./tipos";

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

  test("elimina derivados cuando se borra el enlace externo padre", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 100 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 120 }, "Procesar"));
    const entrada = entidadPorNombre(modelo, "Entrada");
    const procesar = entidadPorNombre(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entrada.id, procesar.id, "consumo"));
    const enlacePadreId = Object.values(modelo.enlaces)[0]?.id;
    expect(enlacePadreId).toBeDefined();
    if (!enlacePadreId) return;
    modelo = must(descomponerProceso(modelo, modelo.opdRaizId, procesar.id)).modelo;
    expect(Object.values(modelo.enlaces).some((enlace) => enlace.derivado?.enlacePadreId === enlacePadreId)).toBe(true);

    const eliminado = eliminarEnlace(modelo, enlacePadreId);

    expect(eliminado.ok).toBe(true);
    if (!eliminado.ok) return;
    expect(Object.values(eliminado.value.enlaces).some((enlace) => enlace.derivado?.enlacePadreId === enlacePadreId)).toBe(false);
    expect(Object.values(eliminado.value.enlaces).some((enlace) => enlace.id === enlacePadreId)).toBe(false);
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

  test("descompone proceso en OPD hijo, conserva identidad e idempotencia", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Atender Paciente"));
    const proceso = entidadPorNombre(modelo, "Atender Paciente");

    const descompuesto = descomponerProceso(modelo, modelo.opdRaizId, proceso.id);

    expect(descompuesto.ok).toBe(true);
    if (!descompuesto.ok) return;
    modelo = descompuesto.value.modelo;
    const opdHijo = modelo.opds[descompuesto.value.opdId];
    expect(descompuesto.value.creado).toBe(true);
    expect(opdHijo?.nombre).toBe("SD1");
    expect(opdHijo?.padreId).toBe(modelo.opdRaizId);
    expect(modelo.entidades[proceso.id]?.refinamiento).toEqual({
      tipo: "descomposicion",
      opdId: descompuesto.value.opdId,
    });
    expect(Object.values(modelo.entidades)).toHaveLength(4);
    expect(Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).filter((apariencia) => apariencia.entidadId === proceso.id)).toHaveLength(1);
    expect(Object.values(opdHijo?.apariencias ?? {}).filter((apariencia) => apariencia.entidadId === proceso.id)).toHaveLength(1);
    expect(Object.values(opdHijo?.apariencias ?? {}).filter((apariencia) => modelo.entidades[apariencia.entidadId]?.tipo === "proceso")).toHaveLength(4);
    expect(Object.values(modelo.entidades).map((entidad) => entidad.nombre)).toEqual(expect.arrayContaining([
      "Atender Paciente 1",
      "Atender Paciente 2",
      "Atender Paciente 3",
    ]));

    const repetido = descomponerProceso(modelo, modelo.opdRaizId, proceso.id);
    expect(repetido.ok).toBe(true);
    if (!repetido.ok) return;
    expect(repetido.value.creado).toBe(false);
    expect(repetido.value.opdId).toBe(descompuesto.value.opdId);
    expect(Object.values(repetido.value.modelo.opds).filter((opd) => opd.padreId === modelo.opdRaizId)).toHaveLength(1);
  });

  test("despliega objeto en OPD hijo, conserva identidad e idempotencia", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 160, y: 100 }, "Vehiculo"));
    const objeto = entidadPorNombre(modelo, "Vehiculo");

    const desplegado = desplegarObjeto(modelo, modelo.opdRaizId, objeto.id);

    expect(desplegado.ok).toBe(true);
    if (!desplegado.ok) return;
    modelo = desplegado.value.modelo;
    const opdHijo = modelo.opds[desplegado.value.opdId];
    expect(desplegado.value.creado).toBe(true);
    expect(opdHijo?.nombre).toBe("SD1");
    expect(opdHijo?.padreId).toBe(modelo.opdRaizId);
    expect(modelo.entidades[objeto.id]?.refinamiento).toEqual({
      tipo: "despliegue",
      opdId: desplegado.value.opdId,
      modo: "agregacion",
    });
    expect(Object.values(modelo.entidades)).toHaveLength(4);
    expect(Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).filter((apariencia) => apariencia.entidadId === objeto.id)).toHaveLength(1);
    expect(Object.values(opdHijo?.apariencias ?? {}).filter((apariencia) => apariencia.entidadId === objeto.id)).toHaveLength(1);
    expect(Object.values(opdHijo?.apariencias ?? {}).filter((apariencia) => modelo.entidades[apariencia.entidadId]?.tipo === "objeto")).toHaveLength(4);
    const enlacesHijo = Object.values(opdHijo?.enlaces ?? {})
      .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
      .filter((enlace): enlace is NonNullable<typeof enlace> => enlace !== undefined);
    expect(enlacesHijo).toHaveLength(3);
    expect(enlacesHijo.every((enlace) => enlace.tipo === "agregacion" && enlace.origenId === objeto.id)).toBe(true);
    expect(Object.values(modelo.entidades).map((entidad) => entidad.nombre)).toEqual(expect.arrayContaining([
      "Vehiculo parte 1",
      "Vehiculo parte 2",
      "Vehiculo parte 3",
    ]));

    const repetido = desplegarObjeto(modelo, modelo.opdRaizId, objeto.id);
    expect(repetido.ok).toBe(true);
    if (!repetido.ok) return;
    expect(repetido.value.creado).toBe(false);
    expect(repetido.value.opdId).toBe(desplegado.value.opdId);
    expect(Object.values(repetido.value.modelo.opds).filter((opd) => opd.padreId === modelo.opdRaizId)).toHaveLength(1);
  });

  test("desplegarObjeto - modo agregacion mantiene comportamiento previo", () => {
    const modelo = modeloConObjetoDesplegable();
    const objeto = entidadPorNombre(modelo, "Vehiculo");

    const desplegado = desplegarObjeto(modelo, modelo.opdRaizId, objeto.id, "agregacion");

    expect(desplegado.ok).toBe(true);
    if (!desplegado.ok) return;
    expect(desplegado.value.modo).toBe("agregacion");
    expect(nombresInternosDespliegue(desplegado.value.modelo, desplegado.value.opdId, objeto.id)).toEqual([
      "Vehiculo parte 1",
      "Vehiculo parte 2",
      "Vehiculo parte 3",
    ]);
    expect(tiposEnlacesOpd(desplegado.value.modelo, desplegado.value.opdId)).toEqual(["agregacion", "agregacion", "agregacion"]);
  });

  test("desplegarObjeto - modo exhibicion crea atributos iniciales", () => {
    assertDespliegueModo("exhibicion", ["Atributo 1", "Atributo 2", "Atributo 3"]);
  });

  test("desplegarObjeto - modo generalizacion crea especializaciones iniciales", () => {
    assertDespliegueModo("generalizacion", ["Especialización 1", "Especialización 2", "Especialización 3"]);
  });

  test("desplegarObjeto - modo clasificacion crea instancias iniciales", () => {
    assertDespliegueModo("clasificacion", ["Instancia 1", "Instancia 2", "Instancia 3"]);
  });

  test("quitarDespliegueObjeto revierte los modos estructurales nuevos", () => {
    const modos = ["exhibicion", "generalizacion", "clasificacion"] satisfies ModoDespliegueObjeto[];
    for (const modo of modos) {
      let modelo = modeloConObjetoDesplegable();
      const objeto = entidadPorNombre(modelo, "Vehiculo");
      modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objeto.id, modo)).modelo;

      const sinDespliegue = quitarDespliegueObjeto(modelo, objeto.id);

      expect(sinDespliegue.ok).toBe(true);
      if (!sinDespliegue.ok) return;
      expect(Object.values(sinDespliegue.value.opds)).toHaveLength(1);
      expect(sinDespliegue.value.entidades[objeto.id]?.refinamiento).toBeUndefined();
      expect(Object.values(sinDespliegue.value.enlaces)).toHaveLength(0);
      expect(Object.values(sinDespliegue.value.entidades)).toHaveLength(1);
    }
  });

  test("validarFirmaEnlace acepta y rechaza exhibicion/generalizacion/clasificacion", () => {
    const modelo = modeloConEntidades();
    const whole = entidadPorNombre(modelo, "Whole");
    const part = entidadPorNombre(modelo, "Part");
    const proceso = entidadPorNombre(modelo, "Proceso");
    const subproceso = entidadPorNombre(modelo, "Subproceso");

    expect(validarFirmaEnlace("exhibicion", whole, proceso).ok).toBe(true);
    expect(validarFirmaEnlace("generalizacion", whole, part).ok).toBe(true);
    expect(validarFirmaEnlace("generalizacion", proceso, subproceso).ok).toBe(true);
    expect(validarFirmaEnlace("generalizacion", whole, proceso).ok).toBe(false);
    expect(validarFirmaEnlace("clasificacion", whole, part).ok).toBe(true);
    expect(validarFirmaEnlace("clasificacion", proceso, subproceso).ok).toBe(true);
    expect(validarFirmaEnlace("clasificacion", proceso, whole).ok).toBe(false);
  });

  test("quita despliegue y elimina partes/agregaciones locales", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 160, y: 100 }, "Vehiculo"));
    const objeto = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objeto.id)).modelo;

    const sinDespliegue = quitarDespliegueObjeto(modelo, objeto.id);

    expect(sinDespliegue.ok).toBe(true);
    if (!sinDespliegue.ok) return;
    expect(Object.values(sinDespliegue.value.opds)).toHaveLength(1);
    expect(sinDespliegue.value.entidades[objeto.id]?.refinamiento).toBeUndefined();
    expect(Object.values(sinDespliegue.value.entidades).map((entidad) => entidad.nombre)).not.toContain("Vehiculo parte 1");
    expect(Object.values(sinDespliegue.value.enlaces)).toHaveLength(0);
  });

  test("rechaza despliegue de procesos y descomposicion de objetos", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Objeto"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "Proceso"));
    const objeto = entidadPorNombre(modelo, "Objeto");
    const proceso = entidadPorNombre(modelo, "Proceso");

    expect(desplegarObjeto(modelo, modelo.opdRaizId, proceso.id).ok).toBe(false);
    expect(descomponerProceso(modelo, modelo.opdRaizId, objeto.id).ok).toBe(false);
  });

  test("redistribuye consumo al primer subproceso y resultado al ultimo", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 100 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 120 }, "Procesar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 520, y: 100 }, "Salida"));
    const entrada = entidadPorNombre(modelo, "Entrada");
    const procesar = entidadPorNombre(modelo, "Procesar");
    const salida = entidadPorNombre(modelo, "Salida");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entrada.id, procesar.id, "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesar.id, salida.id, "resultado"));

    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesar.id));
    modelo = descompuesto.modelo;
    const opdHijo = modelo.opds[descompuesto.opdId];
    expect(opdHijo).toBeDefined();
    if (!opdHijo) return;
    expect(Object.values(opdHijo.apariencias).some((apariencia) => apariencia.entidadId === entrada.id)).toBe(true);
    expect(Object.values(opdHijo.apariencias).some((apariencia) => apariencia.entidadId === salida.id)).toBe(true);
    expect(Object.values(opdHijo.enlaces)).toHaveLength(2);
    const primero = entidadPorNombre(modelo, "Procesar 1");
    const ultimo = entidadPorNombre(modelo, "Procesar 3");
    const enlacesHijo = Object.values(modelo.opds[descompuesto.opdId]?.enlaces ?? {})
      .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
      .filter((enlace): enlace is NonNullable<typeof enlace> => enlace !== undefined);

    expect(enlacesHijo).toHaveLength(2);
    expect(enlacesHijo).toEqual(expect.arrayContaining([
      expect.objectContaining({
        tipo: "consumo",
        origenId: entrada.id,
        destinoId: primero.id,
        derivado: expect.objectContaining({ refinamientoId: procesar.id }),
      }),
      expect.objectContaining({
        tipo: "resultado",
        origenId: ultimo.id,
        destinoId: salida.id,
        derivado: expect.objectContaining({ refinamientoId: procesar.id }),
      }),
    ]));
    expect(Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})).toHaveLength(2);
  });

  test("recalcula derivados externos al reordenar subprocesos por Y", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 100 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 120 }, "Procesar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 520, y: 100 }, "Salida"));
    const entrada = entidadPorNombre(modelo, "Entrada");
    const procesar = entidadPorNombre(modelo, "Procesar");
    const salida = entidadPorNombre(modelo, "Salida");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entrada.id, procesar.id, "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesar.id, salida.id, "resultado"));
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesar.id));
    modelo = descompuesto.modelo;

    const primeroOriginal = entidadPorNombre(modelo, "Procesar 1");
    const nuevoPrimero = entidadPorNombre(modelo, "Procesar 2");
    modelo = must(moverApariencia(modelo, descompuesto.opdId, primeroOriginal.id, { x: 285, y: 420 }));
    const enlacesHijo = Object.values(modelo.opds[descompuesto.opdId]?.enlaces ?? {})
      .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
      .filter((enlace): enlace is NonNullable<typeof enlace> => enlace !== undefined);

    expect(enlacesHijo).toHaveLength(2);
    expect(enlacesHijo).toEqual(expect.arrayContaining([
      expect.objectContaining({ tipo: "consumo", origenId: entrada.id, destinoId: nuevoPrimero.id }),
      expect.objectContaining({ tipo: "resultado", origenId: primeroOriginal.id, destinoId: salida.id }),
    ]));
    expect(enlacesHijo.some((enlace) => enlace.tipo === "consumo" && enlace.destinoId === primeroOriginal.id)).toBe(false);
  });

  test("no borra enlaces manuales al recalcular derivados externos", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 100 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 120 }, "Procesar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 520, y: 100 }, "Salida"));
    const entrada = entidadPorNombre(modelo, "Entrada");
    const procesar = entidadPorNombre(modelo, "Procesar");
    const salida = entidadPorNombre(modelo, "Salida");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entrada.id, procesar.id, "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesar.id, salida.id, "resultado"));
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesar.id));
    modelo = descompuesto.modelo;

    const primeroOriginal = entidadPorNombre(modelo, "Procesar 1");
    const nuevoPrimero = entidadPorNombre(modelo, "Procesar 2");
    modelo = must(crearEnlace(modelo, descompuesto.opdId, entrada.id, primeroOriginal.id, "consumo"));
    const manual = Object.values(modelo.enlaces).find((enlace) => (
      enlace.tipo === "consumo" &&
      enlace.origenId === entrada.id &&
      enlace.destinoId === primeroOriginal.id &&
      !enlace.derivado
    ));
    expect(manual).toBeDefined();

    modelo = must(moverApariencia(modelo, descompuesto.opdId, primeroOriginal.id, { x: 285, y: 420 }));
    const enlacesHijo = Object.values(modelo.opds[descompuesto.opdId]?.enlaces ?? {})
      .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
      .filter((enlace): enlace is NonNullable<typeof enlace> => enlace !== undefined);

    expect(enlacesHijo.some((enlace) => enlace.id === manual?.id && !enlace.derivado)).toBe(true);
    expect(enlacesHijo).toEqual(expect.arrayContaining([
      expect.objectContaining({ tipo: "consumo", destinoId: nuevoPrimero.id, derivado: expect.objectContaining({ refinamientoId: procesar.id }) }),
      expect.objectContaining({ tipo: "resultado", origenId: primeroOriginal.id, destinoId: salida.id, derivado: expect.objectContaining({ refinamientoId: procesar.id }) }),
    ]));
  });

  test("mantiene agente e instrumento externos sobre el contorno del refinamiento", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 40 }, "Driver"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 150 }, "OnStar System"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 100 }, "Driver Rescuing"));
    const driver = entidadPorNombre(modelo, "Driver");
    const sistema = entidadPorNombre(modelo, "OnStar System");
    const rescate = entidadPorNombre(modelo, "Driver Rescuing");
    modelo = must(cambiarEsencia(modelo, driver.id, "fisica"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, driver.id, rescate.id, "agente"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, sistema.id, rescate.id, "instrumento"));

    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, rescate.id));
    modelo = descompuesto.modelo;
    const opdHijo = modelo.opds[descompuesto.opdId];
    expect(opdHijo).toBeDefined();
    if (!opdHijo) return;

    const enlacesHijo = Object.values(opdHijo.enlaces)
      .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
      .filter((enlace): enlace is NonNullable<typeof enlace> => enlace !== undefined);
    expect(enlacesHijo).toEqual(expect.arrayContaining([
      expect.objectContaining({ tipo: "agente", origenId: driver.id, destinoId: rescate.id }),
      expect.objectContaining({ tipo: "instrumento", origenId: sistema.id, destinoId: rescate.id }),
    ]));
    expect(enlacesHijo.some((enlace) => enlace.destinoId === entidadPorNombre(modelo, "Driver Rescuing 1").id)).toBe(false);
  });

  test("mantiene efecto externo no refinado en el contorno", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 100 }, "OnStar System"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 120 }, "Driver Rescuing"));
    const sistema = entidadPorNombre(modelo, "OnStar System");
    const rescate = entidadPorNombre(modelo, "Driver Rescuing");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, sistema.id, rescate.id, "efecto"));

    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, rescate.id));
    modelo = descompuesto.modelo;
    const enlacesHijo = Object.values(modelo.opds[descompuesto.opdId]?.enlaces ?? {})
      .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
      .filter((enlace): enlace is NonNullable<typeof enlace> => enlace !== undefined);

    expect(enlacesHijo).toHaveLength(1);
    expect(enlacesHijo[0]).toMatchObject({ tipo: "efecto", origenId: sistema.id, destinoId: rescate.id });
  });

  test("numera recursivamente OPDs hijos de procesos internos", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Atender Paciente"));
    modelo = must(descomponerProceso(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Atender Paciente").id)).modelo;
    const opdHijoId = modelo.entidades[entidadPorNombre(modelo, "Atender Paciente").id]?.refinamiento?.opdId;
    expect(opdHijoId).toBeDefined();
    if (!opdHijoId) return;
    modelo = must(crearProceso(modelo, opdHijoId, { x: 200, y: 180 }, "Examinar"));

    const nieto = descomponerProceso(modelo, opdHijoId, entidadPorNombre(modelo, "Examinar").id);

    expect(nieto.ok).toBe(true);
    if (!nieto.ok) return;
    expect(nieto.value.modelo.opds[nieto.value.opdId]?.nombre).toBe("SD1.1");
    expect(nieto.value.modelo.opds[nieto.value.opdId]?.padreId).toBe(opdHijoId);
  });

  test("quita descomposicion y elimina subarbol OPD e internos huerfanos", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Atender Paciente"));
    const proceso = entidadPorNombre(modelo, "Atender Paciente");
    modelo = must(descomponerProceso(modelo, modelo.opdRaizId, proceso.id)).modelo;
    const opdHijoId = modelo.entidades[proceso.id]?.refinamiento?.opdId;
    expect(opdHijoId).toBeDefined();
    if (!opdHijoId) return;
    modelo = must(crearObjeto(modelo, opdHijoId, { x: 40, y: 70 }, "Orden"));
    modelo = must(crearProceso(modelo, opdHijoId, { x: 220, y: 70 }, "Examinar"));
    const orden = entidadPorNombre(modelo, "Orden");
    const examinar = entidadPorNombre(modelo, "Examinar");
    modelo = must(crearEnlace(modelo, opdHijoId, orden.id, examinar.id, "consumo"));
    modelo = must(descomponerProceso(modelo, opdHijoId, examinar.id)).modelo;

    const sinDescomposicion = quitarDescomposicionProceso(modelo, proceso.id);

    expect(sinDescomposicion.ok).toBe(true);
    if (!sinDescomposicion.ok) return;
    expect(Object.values(sinDescomposicion.value.opds)).toHaveLength(1);
    expect(sinDescomposicion.value.opds[modelo.opdRaizId]).toBeDefined();
    expect(sinDescomposicion.value.entidades[proceso.id]?.refinamiento).toBeUndefined();
    expect(sinDescomposicion.value.entidades[orden.id]).toBeUndefined();
    expect(sinDescomposicion.value.entidades[examinar.id]).toBeUndefined();
    expect(Object.values(sinDescomposicion.value.enlaces)).toHaveLength(0);
    expect(Object.values(sinDescomposicion.value.opds[modelo.opdRaizId]?.apariencias ?? {})).toHaveLength(1);
  });

  test("elimina entidad refinada sin dejar OPDs ni enlaces huerfanos", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 100 }, "Sistema"));
    const sistema = entidadPorNombre(modelo, "Sistema");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, sistema.id)).modelo;
    expect(Object.values(modelo.opds)).toHaveLength(2);
    expect(Object.values(modelo.enlaces)).toHaveLength(3);

    const eliminado = eliminarEntidad(modelo, sistema.id);

    expect(eliminado.ok).toBe(true);
    if (!eliminado.ok) return;
    expect(Object.values(eliminado.value.opds)).toHaveLength(1);
    expect(Object.values(eliminado.value.entidades)).toHaveLength(0);
    expect(Object.values(eliminado.value.enlaces)).toHaveLength(0);
    expect(Object.values(eliminado.value.opds[modelo.opdRaizId]?.apariencias ?? {})).toHaveLength(0);
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

function modeloConObjetoDesplegable(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 160, y: 100 }, "Vehiculo"));
  return modelo;
}

function assertDespliegueModo(modo: ModoDespliegueObjeto, nombres: string[]): void {
  const modelo = modeloConObjetoDesplegable();
  const objeto = entidadPorNombre(modelo, "Vehiculo");

  const desplegado = desplegarObjeto(modelo, modelo.opdRaizId, objeto.id, modo);

  expect(desplegado.ok).toBe(true);
  if (!desplegado.ok) return;
  expect(desplegado.value.modo).toBe(modo);
  expect(desplegado.value.modelo.entidades[objeto.id]?.refinamiento).toEqual({
    tipo: "despliegue",
    opdId: desplegado.value.opdId,
    modo,
  });
  expect(nombresInternosDespliegue(desplegado.value.modelo, desplegado.value.opdId, objeto.id)).toEqual(nombres);
  expect(tiposEnlacesOpd(desplegado.value.modelo, desplegado.value.opdId)).toEqual([modo, modo, modo].map(tipoEnlaceEsperado));
}

function nombresInternosDespliegue(modelo: Modelo, opdId: string, objetoId: string): string[] {
  return Object.values(modelo.opds[opdId]?.apariencias ?? {})
    .filter((apariencia) => apariencia.entidadId !== objetoId)
    .map((apariencia) => modelo.entidades[apariencia.entidadId]?.nombre)
    .filter((nombre): nombre is string => nombre !== undefined)
    .sort((a, b) => a.localeCompare(b, "es"));
}

function tiposEnlacesOpd(modelo: Modelo, opdId: string): TipoEnlace[] {
  return Object.values(modelo.opds[opdId]?.enlaces ?? {})
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId]?.tipo)
    .filter((tipo): tipo is TipoEnlace => tipo !== undefined)
    .sort((a, b) => a.localeCompare(b, "es"));
}

function tipoEnlaceEsperado(modo: ModoDespliegueObjeto): TipoEnlace {
  if (modo === "agregacion") return "agregacion";
  if (modo === "exhibicion") return "exhibicion";
  if (modo === "generalizacion") return "generalizacion";
  return "clasificacion";
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
