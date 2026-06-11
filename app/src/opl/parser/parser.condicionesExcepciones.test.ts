import { describe, expect, test } from "bun:test";
import {
  aplicarPatchesOpl,
  parsearParrafoOpl,
  planificarEdicionOplLibre,
} from ".";
import { generarOpl } from "../generar";
import {
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  estadosDeEntidad,
  renombrarEstado,
} from "../../modelo/operaciones";
import { extremoEstado } from "../../modelo/extremos";
import { aplicarModificador } from "../../modelo/modificadores";
import type { Modelo, Resultado } from "../../modelo/tipos";

/**
 * Cobertura L2: parser de condiciones (§7) y excepciones (§8.1) OPL-ES.
 *
 * Casos cubiertos:
 *  - EX1 sobretiempo / EX2 subtiempo (parser puro + roundtrip).
 *  - CT1 (consumo sin estado) / CT2 (efecto sin estado).
 *  - CH1 (agente sin estado) / CH2 (instrumento sin estado).
 *  - CS1 (consumo con estado-origen) / CS2 (efecto con cambio de estado).
 *  - CS6 (instrumento con estado-origen).
 *  - Planificacion y aplicacion sobre enlace nuevo y existente.
 *  - D3: condicion sobre enlace con modificador distinto emite warning patch-conflict.
 */
describe("parser OPL — condiciones (§7) y excepciones (§8.1)", () => {
  // ── EXCEPCIONES (EX1/EX2) ────────────────────────────────────────────────

  test("EX1 parsea excepcion por sobretiempo con valor y unidad", () => {
    const result = parsearParrafoOpl("*Manejar Excepcion* ocurre si duración de *Procesar* excede 5 minutos.");
    expect(result.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);
    expect(result.ast[0]).toMatchObject({
      kind: "excepcion",
      proceso: "Manejar Excepcion",
      fuente: "Procesar",
      limite: { tipo: "max", valor: "5", unidad: "minutos" },
    });
  });

  test("EX2 parsea excepcion por subtiempo con valor y unidad", () => {
    const result = parsearParrafoOpl("*Manejar Excepcion* ocurre si duración de *Procesar* es menor que 30 segundos.");
    expect(result.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);
    expect(result.ast[0]).toMatchObject({
      kind: "excepcion",
      proceso: "Manejar Excepcion",
      fuente: "Procesar",
      limite: { tipo: "min", valor: "30", unidad: "segundos" },
    });
  });

  test("excepcion sobretiempo roundtripea desde OPL libre al modelo", () => {
    let modelo = crearModelo("excepciones");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Procesar"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Manejar Excepcion"));

    const texto = [
      ...generarOpl(modelo),
      "*Manejar Excepcion* ocurre si duración de *Procesar* excede 5 minutos.",
    ].join("\n");

    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });
    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);
    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    const sobretiempo = Object.values(aplicado.enlaces).find((enlace) => enlace.tipo === "excepcionSobretiempo");
    expect(sobretiempo).toBeDefined();
    expect(sobretiempo!.tiempoMaximo).toBe("5");
    expect(sobretiempo!.unidadTiempoMaximo).toBe("minutos");
  });

  test("excepcion subtiempo persiste valor y unidad en el enlace", () => {
    const modelo = crearModelo("ex2");
    const texto = [
      "*Procesar* es un proceso informacional y sistémico.",
      "*Manejar Excepcion* es un proceso informacional y sistémico.",
      "*Manejar Excepcion* ocurre si duración de *Procesar* es menor que 30 segundos.",
    ].join("\n");
    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });
    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    const subtiempo = Object.values(aplicado.enlaces).find((enlace) => enlace.tipo === "excepcionSubtiempo");
    expect(subtiempo).toBeDefined();
    expect(subtiempo!.tiempoMinimo).toBe("30");
    expect(subtiempo!.unidadTiempoMinimo).toBe("segundos");
  });

  // ── CONDICIONES (CT/CH/CS) ───────────────────────────────────────────────

  test("CT1 parsea condicion transformadora por consumo sin estado", () => {
    const result = parsearParrafoOpl(
      "*Procesar* ocurre si **Pedido** existe, en cuyo caso **Pedido** se consume, de lo contrario *Procesar* se omite.",
    );
    expect(result.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);
    expect(result.ast[0]).toMatchObject({
      kind: "condicion",
      proceso: "Procesar",
      condicionante: "Pedido",
      base: "consumo",
      sinConsecuencia: false,
    });
  });

  test("CT2 parsea condicion transformadora por efecto sin estado", () => {
    const result = parsearParrafoOpl(
      "*Procesar* ocurre si **Pedido** existe, en cuyo caso *Procesar* afecta **Pedido**, de lo contrario *Procesar* se omite.",
    );
    expect(result.ast[0]).toMatchObject({
      kind: "condicion",
      proceso: "Procesar",
      condicionante: "Pedido",
      base: "efecto",
      sinConsecuencia: false,
    });
  });

  test("CH2 parsea condicion habilitadora instrumento sin estado", () => {
    const result = parsearParrafoOpl("*Procesar* ocurre si **Pedido** existe, de lo contrario *Procesar* se omite.");
    expect(result.ast[0]).toMatchObject({
      kind: "condicion",
      proceso: "Procesar",
      condicionante: "Pedido",
      base: "instrumento",
      sinConsecuencia: true,
    });
  });

  test("CH1 parsea condicion habilitadora agente sin estado", () => {
    const result = parsearParrafoOpl("**Operador** maneja *Procesar* si **Operador** existe, de lo contrario *Procesar* se omite.");
    expect(result.ast[0]).toMatchObject({
      kind: "condicion",
      proceso: "Procesar",
      condicionante: "Operador",
      base: "agente",
      sinConsecuencia: true,
    });
  });

  test("CS1 parsea condicion con estado especificado en consumo", () => {
    const result = parsearParrafoOpl(
      "*Procesar* ocurre si **Pedido** está en `abierto`, en cuyo caso **Pedido** se consume, de lo contrario *Procesar* se omite.",
    );
    expect(result.ast[0]).toMatchObject({
      kind: "condicion",
      proceso: "Procesar",
      condicionante: "Pedido",
      condicionanteEstado: "abierto",
      base: "consumo",
      sinConsecuencia: false,
    });
  });

  test("CS2 parsea condicion con estado entrada y salida", () => {
    const result = parsearParrafoOpl(
      "*Procesar* ocurre si **Pedido** está en `abierto`, en cuyo caso *Procesar* cambia **Pedido** de `abierto` a `cerrado`, de lo contrario *Procesar* se omite.",
    );
    expect(result.ast[0]).toMatchObject({
      kind: "condicion",
      proceso: "Procesar",
      condicionante: "Pedido",
      condicionanteEstado: "abierto",
      base: "efecto",
      estadoSalida: "cerrado",
      sinConsecuencia: false,
    });
  });

  test("CS6 parsea condicion instrumento con estado especificado", () => {
    const result = parsearParrafoOpl("*Procesar* ocurre si **Pedido** está en `abierto`, de lo contrario *Procesar* se omite.");
    expect(result.ast[0]).toMatchObject({
      kind: "condicion",
      proceso: "Procesar",
      condicionante: "Pedido",
      condicionanteEstado: "abierto",
      base: "instrumento",
      sinConsecuencia: true,
    });
  });

  // ── PLANIFICADOR Y APLICADOR ─────────────────────────────────────────────

  test("planifica condicion CH2 sobre instrumento existente y aplica modificador", () => {
    let modelo = crearModelo("condiciones");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    const objeto = entidad(modelo, "Pedido");
    const proceso = entidad(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, objeto, proceso, "instrumento"));

    const texto = [
      ...generarOpl(modelo),
      "*Procesar* ocurre si **Pedido** existe, de lo contrario *Procesar* se omite.",
    ].join("\n");

    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });
    const condicionPatch = preview.patches.find(
      (patch) => patch.tipo === "crear-enlace" && patch.modificador === "condicion",
    );
    expect(condicionPatch).toBeDefined();

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    const enlace = Object.values(aplicado.enlaces).find((item) => item.tipo === "instrumento");
    expect(enlace?.modificador).toBe("condicion");
  });

  test("aplica condicion CT1 creando enlace consumo con modificador en una sola pasada", () => {
    const modelo = crearModelo("ct1");
    const texto = [
      "**Pedido** es un objeto informacional y sistémico.",
      "*Procesar* es un proceso informacional y sistémico.",
      "*Procesar* ocurre si **Pedido** existe, en cuyo caso **Pedido** se consume, de lo contrario *Procesar* se omite.",
    ].join("\n");
    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });
    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    const consumo = Object.values(aplicado.enlaces).find((enlace) => enlace.tipo === "consumo");
    expect(consumo).toBeDefined();
    expect(consumo!.modificador).toBe("condicion");
  });

  test("aplica condicion con estado como extremo de estado, sin descartar condicionanteEstado", () => {
    let modelo = crearModelo("cs1");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    const pedido = entidad(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedido)).modelo;
    const [primero, segundo] = estadosDeEntidad(modelo, pedido);
    if (!primero || !segundo) throw new Error("setup sin estados");
    modelo = must(renombrarEstado(modelo, primero.id, "abierto"));
    modelo = must(renombrarEstado(modelo, segundo.id, "cerrado"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Procesar"));

    const texto = [
      ...generarOpl(modelo),
      "*Procesar* ocurre si **Pedido** está en `abierto`, en cuyo caso **Pedido** se consume, de lo contrario *Procesar* se omite.",
    ].join("\n");

    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });
    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toHaveLength(0);

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches, modelo.opdRaizId));
    const consumo = Object.values(aplicado.enlaces).find((enlace) => enlace.tipo === "consumo");
    expect(consumo?.origenId).toEqual(extremoEstado(primero.id));
    expect(consumo?.modificador).toBe("condicion");
  });

  test("D3: condicion sobre enlace con modificador distinto emite patch-conflict warning", () => {
    let modelo = crearModelo("d3");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    const objeto = entidad(modelo, "Pedido");
    const proceso = entidad(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, objeto, proceso, "instrumento"));
    const enlace = Object.values(modelo.enlaces).find((item) => item.tipo === "instrumento")!;
    modelo = must(aplicarModificador(modelo, enlace.id, "evento"));

    const texto = [
      ...generarOpl(modelo),
      "*Procesar* ocurre si **Pedido** existe, de lo contrario *Procesar* se omite.",
    ].join("\n");

    const preview = planificarEdicionOplLibre(modelo, texto, { opdActivoId: modelo.opdRaizId });
    const conflicto = preview.diagnosticos.find((d) => d.codigo === "patch-conflict");
    expect(conflicto).toBeDefined();
  });
});

function entidad(modelo: Modelo, nombre: string): string {
  const encontrada = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!encontrada) throw new Error(`No existe entidad ${nombre}`);
  return encontrada.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
