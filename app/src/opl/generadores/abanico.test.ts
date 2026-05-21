import { describe, expect, test } from "bun:test";
import type { Modelo } from "../../modelo/tipos";
import { oracionAbanico } from "./abanico";

describe("abanico OPL", () => {
  test("OR emite al menos uno de", () => {
    const modelo = modeloBase("O");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe("*Procesar* consume al menos uno de **Entrada A** y **Entrada B**.");
  });

  test("XOR emite exactamente uno de", () => {
    const modelo = modeloBase("XOR");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe("*Procesar* consume exactamente uno de **Entrada A** y **Entrada B**.");
  });

  test("XOR de resultados a estados del mismo objeto no repite el objeto", () => {
    const modelo = modeloResultadosAEstados("XOR");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe("*Procesar* cambia **Pedido** a exactamente uno de `aprobado` y `rechazado`.");
  });

  test("OR de consumos desde estados del mismo objeto no repite el objeto", () => {
    const modelo = modeloConsumosDesdeEstados("O");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe("*Procesar* cambia **Pedido** de al menos uno de `pendiente` y `observado`.");
  });

  // SSOT OPL-ES §11.4: abanicos combinados con modificador `condicion`.
  // Caso reportado en BUG-20260521T224939Z-7d8b75: instrumento OR convergente
  // con todos los enlaces condicionales debe emitir la forma "ocurre si … existe, … se omite".
  test("OR de instrumentos con modificador condicion emite forma 'ocurre si … se omite'", () => {
    const modelo = modeloInstrumentos("O", "condicion");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe(
      "*Procesar* ocurre si al menos uno de **Objeto_4** y **Objeto_5** existe, de lo contrario *Procesar* se omite.",
    );
  });

  test("XOR de instrumentos con modificador condicion emite 'ocurre si exactamente uno … se omite'", () => {
    const modelo = modeloInstrumentos("XOR", "condicion");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe(
      "*Procesar* ocurre si exactamente uno de **Objeto_4** y **Objeto_5** existe, de lo contrario *Procesar* se omite.",
    );
  });

  test("OR de consumos con modificador condicion incluye claúsula 'en cuyo caso consume'", () => {
    const modelo = modeloBase("O", "condicion");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe(
      "*Procesar* ocurre si al menos uno de **Entrada A** y **Entrada B** existe, en cuyo caso *Procesar* consume **Entrada A** y **Entrada B**, de lo contrario *Procesar* se omite.",
    );
  });

  test("abanico mixto (1 condicional + 1 no condicional) mantiene comportamiento por defecto", () => {
    const modelo = modeloInstrumentos("O", "mixto");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe(
      "*Procesar* requiere al menos uno de **Objeto_4** y **Objeto_5**.",
    );
  });

  test("OR de resultados condicionales mantiene forma por defecto (TODO SSOT)", () => {
    // resultado + condicion + abanico no tiene canon SSOT explícito;
    // se conserva la forma directa hasta que la SSOT lo defina.
    const modelo = modeloResultados("O", "condicion");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe(
      "*Procesar* genera al menos uno de **Salida A** y **Salida B**.",
    );
  });
});

function modeloBase(operador: "O" | "XOR", modificador?: "condicion"): Modelo {
  const mod = modificador ? { modificador } : {};
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: { opd: { id: "opd", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
    entidades: {
      proceso: { id: "proceso", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
      a: { id: "a", tipo: "objeto", nombre: "Entrada A", esencia: "informacional", afiliacion: "sistemica" },
      b: { id: "b", tipo: "objeto", nombre: "Entrada B", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {
      l1: { id: "l1", tipo: "consumo", origenId: { kind: "entidad", id: "a" }, destinoId: { kind: "entidad", id: "proceso", portId: "port-fan-proceso-destino" }, etiqueta: "", ...mod },
      l2: { id: "l2", tipo: "consumo", origenId: { kind: "entidad", id: "b" }, destinoId: { kind: "entidad", id: "proceso", portId: "port-fan-proceso-destino" }, etiqueta: "", ...mod },
    },
    abanicos: { ab1: { id: "ab1", opdId: "opd", puertoComun: { entidadId: "proceso", lado: "destino", portId: "port-fan-proceso-destino" }, puertoEntidadId: "proceso", operador, enlaceIds: ["l1", "l2"] } },
    nextSeq: 1,
  };
}

function modeloInstrumentos(operador: "O" | "XOR", config: "condicion" | "mixto"): Modelo {
  const mod1 = { modificador: "condicion" as const };
  const mod2 = config === "condicion" ? { modificador: "condicion" as const } : {};
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: { opd: { id: "opd", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
    entidades: {
      proceso: { id: "proceso", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
      o4: { id: "o4", tipo: "objeto", nombre: "Objeto_4", esencia: "informacional", afiliacion: "sistemica" },
      o5: { id: "o5", tipo: "objeto", nombre: "Objeto_5", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {
      l1: { id: "l1", tipo: "instrumento", origenId: { kind: "entidad", id: "o4" }, destinoId: { kind: "entidad", id: "proceso", portId: "port-fan-proceso-destino" }, etiqueta: "", ...mod1 },
      l2: { id: "l2", tipo: "instrumento", origenId: { kind: "entidad", id: "o5" }, destinoId: { kind: "entidad", id: "proceso", portId: "port-fan-proceso-destino" }, etiqueta: "", ...mod2 },
    },
    abanicos: { ab1: { id: "ab1", opdId: "opd", puertoComun: { entidadId: "proceso", lado: "destino", portId: "port-fan-proceso-destino" }, puertoEntidadId: "proceso", operador, enlaceIds: ["l1", "l2"] } },
    nextSeq: 1,
  };
}

function modeloResultados(operador: "O" | "XOR", modificador?: "condicion"): Modelo {
  const mod = modificador ? { modificador } : {};
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: { opd: { id: "opd", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
    entidades: {
      proceso: { id: "proceso", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
      a: { id: "a", tipo: "objeto", nombre: "Salida A", esencia: "informacional", afiliacion: "sistemica" },
      b: { id: "b", tipo: "objeto", nombre: "Salida B", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {
      l1: { id: "l1", tipo: "resultado", origenId: { kind: "entidad", id: "proceso", portId: "port-fan-proceso-origen" }, destinoId: { kind: "entidad", id: "a" }, etiqueta: "", ...mod },
      l2: { id: "l2", tipo: "resultado", origenId: { kind: "entidad", id: "proceso", portId: "port-fan-proceso-origen" }, destinoId: { kind: "entidad", id: "b" }, etiqueta: "", ...mod },
    },
    abanicos: { ab1: { id: "ab1", opdId: "opd", puertoComun: { entidadId: "proceso", lado: "origen", portId: "port-fan-proceso-origen" }, puertoEntidadId: "proceso", operador, enlaceIds: ["l1", "l2"] } },
    nextSeq: 1,
  };
}

function modeloResultadosAEstados(operador: "O" | "XOR"): Modelo {
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: { opd: { id: "opd", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
    entidades: {
      proceso: { id: "proceso", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
      pedido: { id: "pedido", tipo: "objeto", nombre: "Pedido", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {
      aprobado: { id: "aprobado", entidadId: "pedido", nombre: "aprobado" },
      rechazado: { id: "rechazado", entidadId: "pedido", nombre: "rechazado" },
    },
    enlaces: {
      l1: { id: "l1", tipo: "resultado", origenId: { kind: "entidad", id: "proceso", portId: "port-fan-proceso-origen" }, destinoId: { kind: "estado", id: "aprobado" }, etiqueta: "" },
      l2: { id: "l2", tipo: "resultado", origenId: { kind: "entidad", id: "proceso", portId: "port-fan-proceso-origen" }, destinoId: { kind: "estado", id: "rechazado" }, etiqueta: "" },
    },
    abanicos: { ab1: { id: "ab1", opdId: "opd", puertoComun: { entidadId: "proceso", lado: "origen", portId: "port-fan-proceso-origen" }, puertoEntidadId: "proceso", operador, enlaceIds: ["l1", "l2"] } },
    nextSeq: 1,
  };
}

function modeloConsumosDesdeEstados(operador: "O" | "XOR"): Modelo {
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: { opd: { id: "opd", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
    entidades: {
      proceso: { id: "proceso", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
      pedido: { id: "pedido", tipo: "objeto", nombre: "Pedido", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {
      pendiente: { id: "pendiente", entidadId: "pedido", nombre: "pendiente" },
      observado: { id: "observado", entidadId: "pedido", nombre: "observado" },
    },
    enlaces: {
      l1: { id: "l1", tipo: "consumo", origenId: { kind: "estado", id: "pendiente" }, destinoId: { kind: "entidad", id: "proceso", portId: "port-fan-proceso-destino" }, etiqueta: "" },
      l2: { id: "l2", tipo: "consumo", origenId: { kind: "estado", id: "observado" }, destinoId: { kind: "entidad", id: "proceso", portId: "port-fan-proceso-destino" }, etiqueta: "" },
    },
    abanicos: { ab1: { id: "ab1", opdId: "opd", puertoComun: { entidadId: "proceso", lado: "destino", portId: "port-fan-proceso-destino" }, puertoEntidadId: "proceso", operador, enlaceIds: ["l1", "l2"] } },
    nextSeq: 1,
  };
}
