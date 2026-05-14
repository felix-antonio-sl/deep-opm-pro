import { describe, expect, test } from "bun:test";
import {
  actualizarAnclajesSimboloEstructural,
  actualizarPosicionLabelEnlace,
  actualizarVerticesEnlace,
  ajustarMultiplicidad,
  cambiarAfiliacion,
  cambiarEsencia,
  agregarEstado,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  designarEstadoFinal,
  designarEstadoInicial,
  descomponerProceso,
  desplegarObjeto,
  eliminarEntidad,
  eliminarEnlace,
  eliminarEstado,
  estadosDeEntidad,
  entidadesDelOpd,
  moverApariencia,
  moverAparienciaPorId,
  quitarDescomposicionProceso,
  quitarDespliegueObjeto,
  quitarEstadosObjeto,
  reanclarEnlaceExternoDerivado,
  renombrarEntidad,
  renombrarEstado,
  resetearAnclajesSimboloEstructural,
  splitEffectEnPar,
  volverEnlaceExternoDerivadoAAutomatico,
  validarFirmaEnlace,
  validarMultiplicidad,
} from "./operaciones";
import { CANON } from "./constantes";
import { solapa } from "./layout";
import { extremoApuntaAEntidad, extremoEntidad, extremoEstado } from "./extremos";
import type { Enlace, Modelo, ModoDespliegueObjeto, Resultado, TipoEnlace } from "./tipos";

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

  test("rechaza renombrar entidad a nombre vacio o solo whitespace (HU-SHARED-009)", () => {
    const creado = crearObjeto(crearModelo(), "opd-1", { x: 0, y: 0 }, "Sistema");
    if (!creado.ok) throw new Error("preparacion falló");
    const entidad = Object.values(creado.value.entidades)[0]!;
    const vacio = renombrarEntidad(creado.value, entidad.id, "   ");
    expect(vacio.ok).toBe(false);
    if (vacio.ok) return;
    expect(vacio.error).toContain("vacío");
  });

  test("rechaza renombrar entidad a nombre duplicado en mismo OPD (HU-SHARED-009)", () => {
    let modelo = crearModelo();
    const a = crearObjeto(modelo, "opd-1", { x: 0, y: 0 }, "Documento");
    if (!a.ok) throw new Error("preparacion falló");
    modelo = a.value;
    const b = crearObjeto(modelo, "opd-1", { x: 200, y: 0 }, "Reporte");
    if (!b.ok) throw new Error("preparacion falló");
    modelo = b.value;
    const reporteId = Object.values(modelo.entidades).find((e) => e.nombre === "Reporte")!.id;
    const duplicado = renombrarEntidad(modelo, reporteId, "Documento", "opd-1");
    expect(duplicado.ok).toBe(false);
    if (duplicado.ok) return;
    expect(duplicado.error).toContain("Ya existe");
  });

  test("rechaza crear o renombrar entidades con nombre duplicado global", () => {
    let modelo = crearModelo();
    const a = crearObjeto(modelo, "opd-1", { x: 0, y: 0 }, "Sistema");
    if (!a.ok) throw new Error("preparacion falló");
    modelo = a.value;
    modelo.opds["opd-2"] = { id: "opd-2", nombre: "OPD 2", padreId: "opd-1", apariencias: {}, enlaces: {} };
    const b = crearObjeto(modelo, "opd-2", { x: 0, y: 0 }, "Sistema");
    expect(b.ok).toBe(false);
    if (!b.ok) expect(b.error).toContain("Ya existe");
  });

  test("crea nombres placeholder únicos cuando no se especifica nombre", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, "opd-1", { x: 0, y: 0 }));
    const segundo = crearObjeto(modelo, "opd-1", { x: 160, y: 0 });
    expect(segundo.ok).toBe(true);
    if (!segundo.ok) return;
    expect(Object.values(segundo.value.entidades).map((entidad) => entidad.nombre).sort()).toEqual(["Objeto", "Objeto_2"]);
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

  test("crea par inicial de estados solo para objetos y respeta idempotencia", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Semaforo"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 180, y: 0 }, "Cambiar"));
    const objeto = entidadPorNombre(modelo, "Semaforo");
    const proceso = entidadPorNombre(modelo, "Cambiar");

    const creado = crearEstadosIniciales(modelo, objeto.id);
    expect(creado.ok).toBe(true);
    if (!creado.ok) return;
    expect(creado.value.creado).toBe(true);
    expect(estadosDeEntidad(creado.value.modelo, objeto.id).map((estado) => estado.nombre)).toEqual(["estado1", "estado2"]);

    const repetido = crearEstadosIniciales(creado.value.modelo, objeto.id);
    expect(repetido.ok).toBe(true);
    if (!repetido.ok) return;
    expect(repetido.value.creado).toBe(false);
    expect(estadosDeEntidad(repetido.value.modelo, objeto.id)).toHaveLength(2);
    expect(crearEstadosIniciales(modelo, proceso.id).ok).toBe(false);
  });

  test("agrega, renombra y valida unicidad local de estados", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Orden"));
    const objeto = entidadPorNombre(modelo, "Orden");
    modelo = must(crearEstadosIniciales(modelo, objeto.id)).modelo;

    const agregado = agregarEstado(modelo, objeto.id);
    expect(agregado.ok).toBe(true);
    if (!agregado.ok) return;
    modelo = agregado.value.modelo;
    expect(modelo.estados[agregado.value.estadoId]?.nombre).toBe("estado3");

    const renombrado = renombrarEstado(modelo, agregado.value.estadoId, "  aprobado  ");
    expect(renombrado.ok).toBe(true);
    if (!renombrado.ok) return;
    modelo = renombrado.value;
    expect(modelo.estados[agregado.value.estadoId]?.nombre).toBe("aprobado");

    const duplicado = renombrarEstado(modelo, agregado.value.estadoId, "estado1");
    expect(duplicado.ok).toBe(false);
    const vacio = renombrarEstado(modelo, agregado.value.estadoId, "  ");
    expect(vacio.ok).toBe(false);
  });

  test("eliminarEstado bloquea dejar un unico estado y quitarEstadosObjeto elimina el conjunto", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Documento"));
    const objeto = entidadPorNombre(modelo, "Documento");
    modelo = must(crearEstadosIniciales(modelo, objeto.id)).modelo;
    modelo = must(agregarEstado(modelo, objeto.id)).modelo;
    const estados = estadosDeEntidad(modelo, objeto.id);

    const eliminado = eliminarEstado(modelo, estados[2]?.id ?? "");
    expect(eliminado.ok).toBe(true);
    if (!eliminado.ok) return;
    modelo = eliminado.value;
    expect(estadosDeEntidad(modelo, objeto.id)).toHaveLength(2);

    const bloqueado = eliminarEstado(modelo, estadosDeEntidad(modelo, objeto.id)[0]?.id ?? "");
    expect(bloqueado.ok).toBe(false);
    expect(estadosDeEntidad(modelo, objeto.id)).toHaveLength(2);

    const sinEstados = quitarEstadosObjeto(modelo, objeto.id);
    expect(sinEstados.ok).toBe(true);
    if (!sinEstados.ok) return;
    expect(estadosDeEntidad(sinEstados.value, objeto.id)).toEqual([]);
  });

  test("designa inicial y final sin mutex entre ambas designaciones", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    const objeto = entidadPorNombre(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, objeto.id)).modelo;
    const [primero, segundo] = estadosDeEntidad(modelo, objeto.id);
    if (!primero || !segundo) throw new Error("La prueba esperaba dos estados");

    modelo = must(designarEstadoInicial(modelo, primero.id));
    modelo = must(designarEstadoInicial(modelo, segundo.id));
    expect(modelo.estados[primero.id]?.esInicial).toBeUndefined();
    expect(modelo.estados[segundo.id]?.esInicial).toBe(true);

    modelo = must(designarEstadoFinal(modelo, segundo.id));
    expect(modelo.estados[segundo.id]?.esInicial).toBe(true);
    expect(modelo.estados[segundo.id]?.esFinal).toBe(true);
  });

  test("eliminar entidad y quitar refinamiento remueven estados asociados", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Vehiculo"));
    const objeto = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(crearEstadosIniciales(modelo, objeto.id)).modelo;

    const eliminado = eliminarEntidad(modelo, objeto.id);
    expect(eliminado.ok).toBe(true);
    if (!eliminado.ok) return;
    expect(Object.values(eliminado.value.estados)).toHaveLength(0);

    modelo = must(crearObjeto(crearModelo(), "opd-1", { x: 160, y: 100 }, "Padre"));
    const padre = entidadPorNombre(modelo, "Padre");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, padre.id)).modelo;
    const parte = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Padre parte 1");
    expect(parte).toBeDefined();
    if (!parte) return;
    modelo = must(crearEstadosIniciales(modelo, parte.id)).modelo;
    expect(estadosDeEntidad(modelo, parte.id)).toHaveLength(2);

    const sinDespliegue = quitarDespliegueObjeto(modelo, padre.id);
    expect(sinDespliegue.ok).toBe(true);
    if (!sinDespliegue.ok) return;
    expect(Object.values(sinDespliegue.value.estados).some((estado) => estado.entidadId === parte.id)).toBe(false);
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

  test("persiste anclas manuales de simbolo estructural sin mover el centro", () => {
    let modelo = modeloConEntidades();
    const whole = entidadPorNombre(modelo, "Whole");
    const part = entidadPorNombre(modelo, "Part");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, whole.id, part.id, "agregacion"));
    const aparienciaEnlace = Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0];
    expect(aparienciaEnlace).toBeDefined();
    if (!aparienciaEnlace) return;

    const actualizado = actualizarAnclajesSimboloEstructural(modelo, modelo.opdRaizId, {
      [aparienciaEnlace.id]: {
        refinable: { dx: -10, dy: -15 },
        refinador: { dx: 8, dy: 15 },
      },
    });

    expect(actualizado.ok).toBe(true);
    if (!actualizado.ok) return;
    expect(actualizado.value.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlace.id]?.symbolPos).toBeUndefined();
    expect(actualizado.value.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlace.id]?.symbolAnchors).toEqual({
      refinable: { dx: -10, dy: -15 },
      refinador: { dx: 8, dy: 15 },
    });
  });

  test("resetear anclas de simbolo estructural vuelve a modo automatico", () => {
    let modelo = modeloConEntidades();
    const whole = entidadPorNombre(modelo, "Whole");
    const part = entidadPorNombre(modelo, "Part");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, whole.id, part.id, "agregacion"));
    const aparienciaEnlace = Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0];
    expect(aparienciaEnlace).toBeDefined();
    if (!aparienciaEnlace) return;

    const conAnclas = actualizarAnclajesSimboloEstructural(modelo, modelo.opdRaizId, {
      [aparienciaEnlace.id]: {
        refinable: { dx: -10, dy: -15 },
        refinador: { dx: 8, dy: 15 },
      },
    });
    expect(conAnclas.ok).toBe(true);
    if (!conAnclas.ok) return;

    const reseteado = resetearAnclajesSimboloEstructural(conAnclas.value, modelo.opdRaizId, [aparienciaEnlace.id]);

    expect(reseteado.ok).toBe(true);
    if (!reseteado.ok) return;
    expect(reseteado.value.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlace.id]?.symbolAnchors).toBeUndefined();
  });

  test("persiste posicion manual de label de enlace", () => {
    let modelo = modeloConEntidades();
    const whole = entidadPorNombre(modelo, "Whole");
    const part = entidadPorNombre(modelo, "Part");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, whole.id, part.id, "agregacion"));
    const aparienciaEnlace = Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0];
    expect(aparienciaEnlace).toBeDefined();
    if (!aparienciaEnlace) return;

    const actualizado = actualizarPosicionLabelEnlace(modelo, modelo.opdRaizId, aparienciaEnlace.id, "etiqueta", {
      distance: 0.72349,
      offset: { x: 10.1234, y: -4.9876 },
    });

    expect(actualizado.ok).toBe(true);
    if (!actualizado.ok) return;
    expect(actualizado.value.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlace.id]?.labelPositions?.etiqueta).toEqual({
      distance: 0.723,
      offset: { x: 10.123, y: -4.988 },
    });
  });

  test("valida sintaxis canonica de multiplicidad", () => {
    for (const texto of ["1", "2", "*", "1..N", "2..N", "1..5"]) {
      expect(validarMultiplicidad(texto)).toBe(true);
    }
    for (const texto of ["", " ", "1.2", "a..b", "1-N", "1..n", " 2", "2 "]) {
      expect(validarMultiplicidad(texto)).toBe(false);
    }
  });

  test("ajusta y limpia multiplicidad por extremo de enlace", () => {
    let modelo = modeloConEntidades();
    const part = entidadPorNombre(modelo, "Part");
    const proceso = entidadPorNombre(modelo, "Proceso");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, part.id, proceso.id, "consumo"));
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    expect(enlaceId).toBeDefined();
    if (!enlaceId) return;

    const origen = ajustarMultiplicidad(modelo, enlaceId, "origen", "2..N");
    expect(origen.ok).toBe(true);
    if (!origen.ok) return;
    expect(origen.value.enlaces[enlaceId]?.multiplicidadOrigen).toBe("2..N");

    const destino = ajustarMultiplicidad(origen.value, enlaceId, "destino", "*");
    expect(destino.ok).toBe(true);
    if (!destino.ok) return;
    expect(destino.value.enlaces[enlaceId]?.multiplicidadDestino).toBe("*");

    const invalido = ajustarMultiplicidad(destino.value, enlaceId, "origen", "1-N");
    expect(invalido.ok).toBe(false);

    const limpio = ajustarMultiplicidad(destino.value, enlaceId, "origen", "");
    expect(limpio.ok).toBe(true);
    if (!limpio.ok) return;
    expect(limpio.value.enlaces[enlaceId]?.multiplicidadOrigen).toBeUndefined();
    expect(limpio.value.enlaces[enlaceId]?.multiplicidadDestino).toBe("*");
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
    expect(modelo.entidades[proceso.id]?.refinamientos?.descomposicion).toEqual({
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
    expect(modelo.entidades[objeto.id]?.refinamientos?.despliegue).toEqual({
      opdId: desplegado.value.opdId,
      modo: "agregacion",
    });
    expect(Object.values(modelo.entidades)).toHaveLength(4);
    expect(Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).filter((apariencia) => apariencia.entidadId === objeto.id)).toHaveLength(1);
    expect(Object.values(opdHijo?.apariencias ?? {}).filter((apariencia) => apariencia.entidadId === objeto.id)).toHaveLength(1);
    expect(Object.values(opdHijo?.apariencias ?? {}).filter((apariencia) => modelo.entidades[apariencia.entidadId]?.tipo === "objeto")).toHaveLength(4);
    const aparienciasHijo = Object.values(opdHijo?.apariencias ?? {});
    const padreApariencia = aparienciasHijo.find((apariencia) => apariencia.entidadId === objeto.id);
    if (!padreApariencia) throw new Error("La prueba esperaba apariencia del padre en despliegue");
    expect(padreApariencia.width).toBe(CANON.dims.cosaWidth);
    expect(padreApariencia.height).toBe(CANON.dims.cosaHeight);
    for (const parte of aparienciasHijo.filter((apariencia) => apariencia.entidadId !== objeto.id)) {
      expect(parte.y).toBeGreaterThan(padreApariencia.y + padreApariencia.height);
    }
    const enlacesHijo = Object.values(opdHijo?.enlaces ?? {})
      .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
      .filter((enlace): enlace is NonNullable<typeof enlace> => enlace !== undefined);
    expect(enlacesHijo).toHaveLength(3);
    expect(enlacesHijo.every((enlace) => enlace.tipo === "agregacion" && extremoApuntaAEntidad(enlace.origenId, objeto.id))).toBe(true);
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
      expect(sinDespliegue.value.entidades[objeto.id]?.refinamientos).toBeUndefined();
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

  test("crearEnlace acepta extremos Estado solo en enlaces procedurales", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "Aprobar"));
    const pedido = entidadPorNombre(modelo, "Pedido");
    const aprobar = entidadPorNombre(modelo, "Aprobar");
    modelo = must(crearEstadosIniciales(modelo, pedido.id)).modelo;
    const [pendiente] = estadosDeEntidad(modelo, pedido.id);
    if (!pendiente) throw new Error("La prueba esperaba estado inicial");

    const consumo = crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendiente.id), aprobar.id, "consumo");
    expect(consumo.ok).toBe(true);
    if (!consumo.ok) return;
    const enlace = Object.values(consumo.value.enlaces)[0];
    expect(enlace?.origenId).toEqual(extremoEstado(pendiente.id));

    const estructural = crearEnlace(modelo, modelo.opdRaizId, pedido.id, extremoEstado(pendiente.id), "exhibicion");
    expect(estructural.ok).toBe(false);
    if (estructural.ok) return;
    expect(estructural.error).toContain("[V-237][V-239]");
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
    expect(sinDespliegue.value.entidades[objeto.id]?.refinamientos).toBeUndefined();
    expect(Object.values(sinDespliegue.value.entidades).map((entidad) => entidad.nombre)).not.toContain("Vehiculo parte 1");
    expect(Object.values(sinDespliegue.value.enlaces)).toHaveLength(0);
  });

  test("ronda 15.2: permite descomponer y desplegar la misma cosa sin conflicto (ortogonalidad)", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 120 }, "Procesar"));
    const proceso = entidadPorNombre(modelo, "Procesar");

    const inzoom = descomponerProceso(modelo, modelo.opdRaizId, proceso.id);
    expect(inzoom.ok).toBe(true);
    if (!inzoom.ok) return;
    modelo = inzoom.value.modelo;

    const unfold = desplegarObjeto(modelo, modelo.opdRaizId, proceso.id, "agregacion");
    expect(unfold.ok).toBe(true);
    if (!unfold.ok) return;
    modelo = unfold.value.modelo;

    expect(modelo.entidades[proceso.id]?.refinamientos?.descomposicion?.opdId).toBe(inzoom.value.opdId);
    expect(modelo.entidades[proceso.id]?.refinamientos?.despliegue?.opdId).toBe(unfold.value.opdId);
    expect(inzoom.value.opdId).not.toBe(unfold.value.opdId);

    // Quitar despliegue conserva descomposicion.
    const sinUnfold = quitarDespliegueObjeto(modelo, proceso.id);
    expect(sinUnfold.ok).toBe(true);
    if (!sinUnfold.ok) return;
    expect(sinUnfold.value.entidades[proceso.id]?.refinamientos?.descomposicion?.opdId).toBe(inzoom.value.opdId);
    expect(sinUnfold.value.entidades[proceso.id]?.refinamientos?.despliegue).toBeUndefined();

    // Quitar descomposicion sobre el modelo dual conserva despliegue.
    const sinInzoom = quitarDescomposicionProceso(modelo, proceso.id);
    expect(sinInzoom.ok).toBe(true);
    if (!sinInzoom.ok) return;
    expect(sinInzoom.value.entidades[proceso.id]?.refinamientos?.descomposicion).toBeUndefined();
    expect(sinInzoom.value.entidades[proceso.id]?.refinamientos?.despliegue?.opdId).toBe(unfold.value.opdId);
  });

  test("acepta despliegue de procesos y descomposicion de objetos", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Objeto"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "Proceso"));
    const objeto = entidadPorNombre(modelo, "Objeto");
    const proceso = entidadPorNombre(modelo, "Proceso");

    const desplegadoProceso = desplegarObjeto(modelo, modelo.opdRaizId, proceso.id);
    expect(desplegadoProceso.ok).toBe(true);
    if (!desplegadoProceso.ok) return;
    expect(desplegadoProceso.value.modelo.entidades[proceso.id]?.refinamientos?.despliegue).toBeDefined();
    expect(nombresInternosDespliegue(desplegadoProceso.value.modelo, desplegadoProceso.value.opdId, proceso.id)).toEqual([
      "Proceso parte 1",
      "Proceso parte 2",
      "Proceso parte 3",
    ]);

    const descompuestoObjeto = descomponerProceso(modelo, modelo.opdRaizId, objeto.id);
    expect(descompuestoObjeto.ok).toBe(true);
    if (!descompuestoObjeto.ok) return;
    expect(descompuestoObjeto.value.modelo.entidades[objeto.id]?.refinamientos?.descomposicion).toBeDefined();
    expect(nombresInternosDespliegue(descompuestoObjeto.value.modelo, descompuestoObjeto.value.opdId, objeto.id)).toEqual([
      "Objeto 1",
      "Objeto 2",
      "Objeto 3",
    ]);
  });

  test("descomposicion de objeto conserva contexto externo visible", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Sistema"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "Entorno"));
    const sistema = entidadPorNombre(modelo, "Sistema");
    const entorno = entidadPorNombre(modelo, "Entorno");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, sistema.id, entorno.id, "agregacion"));

    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, sistema.id));
    const opdHijo = descompuesto.modelo.opds[descompuesto.opdId];
    expect(opdHijo).toBeDefined();
    if (!opdHijo) return;

    expect(Object.values(opdHijo.apariencias).some((apariencia) => apariencia.entidadId === entorno.id)).toBe(true);
    expect(enlacesDelOpd(descompuesto.modelo, descompuesto.opdId)).toEqual(expect.arrayContaining([
      expect.objectContaining({ tipo: "agregacion", origenId: extremoEntidad(sistema.id), destinoId: extremoEntidad(entorno.id) }),
    ]));
  });

  test("splitEffectEnPar convierte efecto objeto a proceso en consumo y resultado intermedio", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 120 }, "Sistema"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 120 }, "Actualizar"));
    const sistema = entidadPorNombre(modelo, "Sistema");
    const actualizar = entidadPorNombre(modelo, "Actualizar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, sistema.id, actualizar.id, "efecto"));
    const effectId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "efecto")?.id;
    expect(effectId).toBeDefined();
    if (!effectId) return;

    const split = splitEffectEnPar(modelo, modelo.opdRaizId, effectId);

    expect(split.ok).toBe(true);
    if (!split.ok) return;
    expect(Object.values(split.value.entidades)).toHaveLength(3);
    expect(Object.values(split.value.enlaces).filter((enlace) => enlace.tipo === "efecto")).toHaveLength(0);
    expect(Object.values(split.value.enlaces)).toEqual(expect.arrayContaining([
      expect.objectContaining({ tipo: "consumo", origenId: extremoEntidad(sistema.id), destinoId: extremoEntidad(actualizar.id) }),
      expect.objectContaining({ tipo: "resultado", origenId: extremoEntidad(actualizar.id) }),
    ]));
    const intermedio = entidadPorNombre(split.value, "Sistema modificado");
    const resultado = Object.values(split.value.enlaces).find((enlace) => enlace.tipo === "resultado");
    expect(resultado?.destinoId).toEqual(extremoEntidad(intermedio.id));
    expect(Object.values(split.value.opds[split.value.opdRaizId]?.enlaces ?? {})).toHaveLength(2);
  });

  test("splitEffectEnPar convierte efecto proceso a objeto usando el objeto como consumido", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 120 }, "Actualizar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 120 }, "Sistema"));
    const actualizar = entidadPorNombre(modelo, "Actualizar");
    const sistema = entidadPorNombre(modelo, "Sistema");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, actualizar.id, sistema.id, "efecto"));
    const effectId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "efecto")?.id;
    expect(effectId).toBeDefined();
    if (!effectId) return;

    const split = splitEffectEnPar(modelo, modelo.opdRaizId, effectId);

    expect(split.ok).toBe(true);
    if (!split.ok) return;
    const intermedio = entidadPorNombre(split.value, "Sistema modificado");
    expect(Object.values(split.value.enlaces)).toEqual(expect.arrayContaining([
      expect.objectContaining({ tipo: "consumo", origenId: extremoEntidad(sistema.id), destinoId: extremoEntidad(actualizar.id) }),
      expect.objectContaining({ tipo: "resultado", origenId: extremoEntidad(actualizar.id), destinoId: extremoEntidad(intermedio.id) }),
    ]));
  });

  test("splitEffectEnPar rechaza enlaces que no son effect", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 120 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 120 }, "Procesar"));
    const entrada = entidadPorNombre(modelo, "Entrada");
    const procesar = entidadPorNombre(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entrada.id, procesar.id, "consumo"));
    const consumoId = Object.values(modelo.enlaces)[0]?.id;
    expect(consumoId).toBeDefined();
    if (!consumoId) return;

    const split = splitEffectEnPar(modelo, modelo.opdRaizId, consumoId);

    expect(split.ok).toBe(false);
    if (split.ok) return;
    expect(split.error).toContain("efecto");
    expect(Object.values(modelo.entidades)).toHaveLength(2);
    expect(Object.values(modelo.enlaces)).toHaveLength(1);
  });

  test("splitEffectEnPar usa sufijo numerico cuando el nombre intermedio colisiona", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 120 }, "Sistema"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 260 }, "Sistema modificado"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 120 }, "Actualizar"));
    const sistema = entidadPorNombre(modelo, "Sistema");
    const actualizar = entidadPorNombre(modelo, "Actualizar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, sistema.id, actualizar.id, "efecto"));
    const effectId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "efecto")?.id;
    expect(effectId).toBeDefined();
    if (!effectId) return;

    const split = splitEffectEnPar(modelo, modelo.opdRaizId, effectId);

    expect(split.ok).toBe(true);
    if (!split.ok) return;
    expect(Object.values(split.value.entidades).map((entidad) => entidad.nombre)).toContain("Sistema modificado 2");
  });

  test("splitEffectEnPar posiciona el intermedio sin solapar apariencias existentes", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 120 }, "Sistema"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 120 }, "Actualizar"));
    const sistema = entidadPorNombre(modelo, "Sistema");
    const actualizar = entidadPorNombre(modelo, "Actualizar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, sistema.id, actualizar.id, "efecto"));
    const aparienciasPrevias = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {});
    const effectId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "efecto")?.id;
    expect(effectId).toBeDefined();
    if (!effectId) return;

    const split = splitEffectEnPar(modelo, modelo.opdRaizId, effectId);

    expect(split.ok).toBe(true);
    if (!split.ok) return;
    const intermedio = entidadPorNombre(split.value, "Sistema modificado");
    const aparienciaIntermedia = Object.values(split.value.opds[split.value.opdRaizId]?.apariencias ?? {})
      .find((apariencia) => apariencia.entidadId === intermedio.id);
    expect(aparienciaIntermedia).toBeDefined();
    if (!aparienciaIntermedia) return;
    expect(aparienciasPrevias.some((apariencia) => solapa(aparienciaIntermedia, apariencia))).toBe(false);
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
        origenId: extremoEntidad(entrada.id),
        destinoId: extremoEntidad(primero.id),
        derivado: expect.objectContaining({ refinamientoId: procesar.id }),
      }),
      expect.objectContaining({
        tipo: "resultado",
        origenId: extremoEntidad(ultimo.id),
        destinoId: extremoEntidad(salida.id),
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
      expect.objectContaining({ tipo: "consumo", origenId: extremoEntidad(entrada.id), destinoId: extremoEntidad(nuevoPrimero.id) }),
      expect.objectContaining({ tipo: "resultado", origenId: extremoEntidad(primeroOriginal.id), destinoId: extremoEntidad(salida.id) }),
    ]));
    expect(enlacesHijo.some((enlace) => enlace.tipo === "consumo" && extremoApuntaAEntidad(enlace.destinoId, primeroOriginal.id))).toBe(false);
  });

  test("mover en OPD hijo importado no materializa derivados externos ausentes", () => {
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
    modelo = quitarDerivadosAutomaticosDeOpd(descompuesto.modelo, descompuesto.opdId);

    const antes = enlacesDelOpd(modelo, descompuesto.opdId);
    expect(antes).toHaveLength(0);

    const subproceso = entidadPorNombre(modelo, "Procesar 1");
    modelo = must(moverApariencia(modelo, descompuesto.opdId, subproceso.id, { x: 285, y: 420 }));

    expect(enlacesDelOpd(modelo, descompuesto.opdId)).toHaveLength(0);
    expect(Object.values(modelo.enlaces).filter((enlace) => !enlace.derivado)).toHaveLength(2);
  });

  test("reancla consumo externo derivado al subproceso elegido y marca origen manual", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 100 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 120 }, "Procesar"));
    const entrada = entidadPorNombre(modelo, "Entrada");
    const procesar = entidadPorNombre(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entrada.id, procesar.id, "consumo"));
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesar.id));
    modelo = descompuesto.modelo;

    const segundo = entidadPorNombre(modelo, "Procesar 2");
    const { aparienciaId, enlace } = enlaceDerivadoEnOpd(modelo, descompuesto.opdId, "consumo");
    modelo = must(reanclarEnlaceExternoDerivado(modelo, descompuesto.opdId, aparienciaId, segundo.id));

    expect(modelo.enlaces[enlace.id]).toEqual(expect.objectContaining({
      tipo: "consumo",
      origenId: extremoEntidad(entrada.id),
      destinoId: extremoEntidad(segundo.id),
      derivado: expect.objectContaining({ origen: "manual", refinamientoId: procesar.id }),
    }));
  });

  test("reanclaje manual resiste reorden por Y y refresca derivados automaticos restantes", () => {
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

    const segundo = entidadPorNombre(modelo, "Procesar 2");
    const { aparienciaId } = enlaceDerivadoEnOpd(modelo, descompuesto.opdId, "consumo");
    modelo = must(reanclarEnlaceExternoDerivado(modelo, descompuesto.opdId, aparienciaId, segundo.id));
    modelo = must(moverApariencia(modelo, descompuesto.opdId, segundo.id, { x: 285, y: 430 }));

    const enlacesHijo = enlacesDelOpd(modelo, descompuesto.opdId);
    const consumos = enlacesHijo.filter((enlace) => enlace.tipo === "consumo" && enlace.derivado?.enlacePadreId);
    const resultados = enlacesHijo.filter((enlace) => enlace.tipo === "resultado" && enlace.derivado?.enlacePadreId);

    expect(consumos).toHaveLength(1);
    expect(consumos[0]).toEqual(expect.objectContaining({
      origenId: extremoEntidad(entrada.id),
      destinoId: extremoEntidad(segundo.id),
      derivado: expect.objectContaining({ origen: "manual" }),
    }));
    expect(resultados).toHaveLength(1);
    expect(resultados[0]).toEqual(expect.objectContaining({
      origenId: extremoEntidad(segundo.id),
      destinoId: extremoEntidad(salida.id),
      derivado: expect.objectContaining({ origen: "automatico" }),
    }));
  });

  test("volver a automatico recalcula el endpoint segun la heuristica por Y", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 100 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 120 }, "Procesar"));
    const entrada = entidadPorNombre(modelo, "Entrada");
    const procesar = entidadPorNombre(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entrada.id, procesar.id, "consumo"));
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesar.id));
    modelo = descompuesto.modelo;

    const primero = entidadPorNombre(modelo, "Procesar 1");
    const segundo = entidadPorNombre(modelo, "Procesar 2");
    const { aparienciaId } = enlaceDerivadoEnOpd(modelo, descompuesto.opdId, "consumo");
    modelo = must(reanclarEnlaceExternoDerivado(modelo, descompuesto.opdId, aparienciaId, segundo.id));
    const manual = enlaceDerivadoEnOpd(modelo, descompuesto.opdId, "consumo");
    modelo = must(volverEnlaceExternoDerivadoAAutomatico(modelo, descompuesto.opdId, manual.aparienciaId));

    expect(enlacesDelOpd(modelo, descompuesto.opdId)).toContainEqual(expect.objectContaining({
      tipo: "consumo",
      origenId: extremoEntidad(entrada.id),
      destinoId: extremoEntidad(primero.id),
      derivado: expect.objectContaining({ origen: "automatico" }),
    }));
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
      extremoApuntaAEntidad(enlace.origenId, entrada.id) &&
      extremoApuntaAEntidad(enlace.destinoId, primeroOriginal.id) &&
      !enlace.derivado
    ));
    expect(manual).toBeDefined();

    modelo = must(moverApariencia(modelo, descompuesto.opdId, primeroOriginal.id, { x: 285, y: 420 }));
    const enlacesHijo = Object.values(modelo.opds[descompuesto.opdId]?.enlaces ?? {})
      .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
      .filter((enlace): enlace is NonNullable<typeof enlace> => enlace !== undefined);

    expect(enlacesHijo.some((enlace) => enlace.id === manual?.id && !enlace.derivado)).toBe(true);
    expect(enlacesHijo).toEqual(expect.arrayContaining([
      expect.objectContaining({ tipo: "consumo", destinoId: extremoEntidad(nuevoPrimero.id), derivado: expect.objectContaining({ refinamientoId: procesar.id }) }),
      expect.objectContaining({ tipo: "resultado", origenId: extremoEntidad(primeroOriginal.id), destinoId: extremoEntidad(salida.id), derivado: expect.objectContaining({ refinamientoId: procesar.id }) }),
    ]));
  });

  test("mover contorno arrastra apariencias internas pero conserva externos proxy en su posicion", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 60 }, "Externo"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 320, y: 220 }, "PadreRefinable"));
    const externoId = entidadPorNombre(modelo, "Externo").id;
    const padreId = entidadPorNombre(modelo, "PadreRefinable").id;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, externoId, padreId, "consumo"));
    const descomposicion = must(descomponerProceso(modelo, modelo.opdRaizId, padreId));
    modelo = descomposicion.modelo;
    const opdHijoId = descomposicion.opdId;

    const opdHijo = modelo.opds[opdHijoId];
    expect(opdHijo).toBeDefined();
    if (!opdHijo) return;
    const apariencias = Object.values(opdHijo.apariencias);
    const contorno = apariencias.find((apariencia) => apariencia.entidadId === padreId);
    const externoProxy = apariencias.find((apariencia) => apariencia.entidadId === externoId);
    const internos = apariencias.filter((apariencia) =>
      apariencia.entidadId !== padreId && apariencia.entidadId !== externoId,
    );
    expect(contorno).toBeDefined();
    expect(externoProxy).toBeDefined();
    expect(internos.length).toBeGreaterThan(0);
    if (!contorno || !externoProxy) return;
    expect(contorno.contextoRefinamiento).toMatchObject({
      tipo: "descomposicion",
      refinableEntidadId: padreId,
      rol: "contorno",
    });
    expect(externoProxy.contextoRefinamiento).toMatchObject({
      tipo: "descomposicion",
      refinableEntidadId: padreId,
      rol: "externo",
      contenedorAparienciaId: contorno.id,
    });
    for (const interno of internos) {
      expect(interno.contextoRefinamiento).toMatchObject({
        tipo: "descomposicion",
        refinableEntidadId: padreId,
        rol: "interno",
        contenedorAparienciaId: contorno.id,
      });
    }

    const movido = must(moverAparienciaPorId(modelo, opdHijoId, contorno.id, {
      x: contorno.x + 250,
      y: contorno.y + 90,
    }));
    const apariencasMovidas = movido.opds[opdHijoId]?.apariencias;
    expect(apariencasMovidas).toBeDefined();
    if (!apariencasMovidas) return;

    expect(apariencasMovidas[contorno.id]?.x).toBe(contorno.x + 250);
    expect(apariencasMovidas[contorno.id]?.y).toBe(contorno.y + 90);
    for (const interno of internos) {
      expect(apariencasMovidas[interno.id]?.x).toBe(interno.x + 250);
      expect(apariencasMovidas[interno.id]?.y).toBe(interno.y + 90);
    }
    // El externo proxy se mantiene en su posicion absoluta.
    expect(apariencasMovidas[externoProxy.id]?.x).toBe(externoProxy.x);
    expect(apariencasMovidas[externoProxy.id]?.y).toBe(externoProxy.y);
  });

  test("mover hijos de despliegue estructural no los clampea sobre el padre", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Todo"));
    const todo = entidadPorNombre(modelo, "Todo");
    const desplegado = must(desplegarObjeto(modelo, modelo.opdRaizId, todo.id, "agregacion"));
    modelo = desplegado.modelo;
    const opdHijo = modelo.opds[desplegado.opdId];
    expect(opdHijo).toBeDefined();
    if (!opdHijo) return;

    const hijo = Object.values(opdHijo.apariencias).find((apariencia) => apariencia.entidadId !== todo.id);
    expect(hijo).toBeDefined();
    if (!hijo) return;

    const posicionLibre = { x: 620, y: 420 };
    const movido = must(moverAparienciaPorId(modelo, desplegado.opdId, hijo.id, posicionLibre));
    const hijoMovido = movido.opds[desplegado.opdId]?.apariencias[hijo.id];

    expect(hijoMovido?.x).toBe(posicionLibre.x);
    expect(hijoMovido?.y).toBe(posicionLibre.y);
  });

  test("distribuye agente e instrumento externos a todos los subprocesos del refinamiento", () => {
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
    expect(enlacesHijo.filter((enlace) => enlace.tipo === "agente")).toHaveLength(3);
    expect(enlacesHijo.filter((enlace) => enlace.tipo === "instrumento")).toHaveLength(3);
    for (const index of [1, 2, 3]) {
      const subproceso = entidadPorNombre(modelo, `Driver Rescuing ${index}`);
      expect(enlacesHijo).toEqual(expect.arrayContaining([
        expect.objectContaining({ tipo: "agente", origenId: extremoEntidad(driver.id), destinoId: extremoEntidad(subproceso.id) }),
        expect.objectContaining({ tipo: "instrumento", origenId: extremoEntidad(sistema.id), destinoId: extremoEntidad(subproceso.id) }),
      ]));
    }
  });

  test("distribuye efecto externo a todos los subprocesos del refinamiento", () => {
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

    expect(enlacesHijo.filter((enlace) => enlace.tipo === "efecto")).toHaveLength(3);
    for (const index of [1, 2, 3]) {
      const subproceso = entidadPorNombre(modelo, `Driver Rescuing ${index}`);
      expect(enlacesHijo).toEqual(expect.arrayContaining([
        expect.objectContaining({ tipo: "efecto", origenId: extremoEntidad(sistema.id), destinoId: extremoEntidad(subproceso.id) }),
      ]));
    }
  });

  test("numera recursivamente OPDs hijos de procesos internos", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Atender Paciente"));
    modelo = must(descomponerProceso(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Atender Paciente").id)).modelo;
    const opdHijoId = modelo.entidades[entidadPorNombre(modelo, "Atender Paciente").id]?.refinamientos?.descomposicion?.opdId;
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
    const opdHijoId = modelo.entidades[proceso.id]?.refinamientos?.descomposicion?.opdId;
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
    expect(sinDescomposicion.value.entidades[proceso.id]?.refinamientos).toBeUndefined();
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
  expect(desplegado.value.modelo.entidades[objeto.id]?.refinamientos?.despliegue).toEqual({
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

function enlacesDelOpd(modelo: Modelo, opdId: string): Enlace[] {
  return Object.values(modelo.opds[opdId]?.enlaces ?? {})
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((enlace): enlace is Enlace => enlace !== undefined);
}

function quitarDerivadosAutomaticosDeOpd(modelo: Modelo, opdId: string): Modelo {
  const opd = modelo.opds[opdId];
  if (!opd) return modelo;
  const derivados = new Set(
    Object.values(opd.enlaces)
      .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
      .filter((enlace): enlace is Enlace => enlace?.derivado?.origen === "automatico")
      .map((enlace) => enlace.id),
  );
  return {
    ...modelo,
    enlaces: Object.fromEntries(Object.entries(modelo.enlaces).filter(([id]) => !derivados.has(id))),
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: Object.fromEntries(Object.entries(opd.enlaces).filter(([, apariencia]) => !derivados.has(apariencia.enlaceId))),
      },
    },
  };
}

function enlaceDerivadoEnOpd(modelo: Modelo, opdId: string, tipo: TipoEnlace): { aparienciaId: string; enlace: Enlace } {
  const encontrado = Object.values(modelo.opds[opdId]?.enlaces ?? {})
    .map((apariencia) => ({ aparienciaId: apariencia.id, enlace: modelo.enlaces[apariencia.enlaceId] }))
    .find((item): item is { aparienciaId: string; enlace: Enlace } => item.enlace?.tipo === tipo && item.enlace.derivado !== undefined);
  expect(encontrado).toBeDefined();
  if (!encontrado) throw new Error(`Enlace derivado no encontrado: ${tipo}`);
  return encontrado;
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
